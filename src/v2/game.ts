// v2 battle driver: loads the Lyria track, counts in on the audio clock, runs the BattleCore on the song clock,
// bends the music playbackRate with the tempo rule, plays the voices, fans events out to the listeners.
import { ctx, heardTime, musicBus } from "../audio/engine";
import { sfx } from "../audio/sfx";
import { getOffset } from "../game/latency";
import { SongClock } from "./clock";
import { BattleCore } from "./core";
import { loadCalls, playVoice, stopVoices } from "./voicePlayer";
import type { CoreEvent, GameApi, LevelV2, Listener, PlayInput, Stats, TrackInfo } from "./contracts";

const COUNT_IN = 4;
const RESUME_COUNT_IN = 3;
/** Seconds between the decided battle and the results (the finish animation). */
const FINISH = 3.2;
/** The cast text version the taunt recordings must carry in voice/v2/index.json ("cast": CAST_TAG). */
export const CAST_TAG = "roster-1625";
/** The voice the battle lines must be recorded in (voice/v2/index.json "voice": VOICE_TAG). The flat,
 * overlapping TTS lines recorded before the bake off carry no tag and stay silent (addendum 17:05 point 5)
 * until the bake off winner's recordings land with it. */
export const VOICE_TAG = "bakeoff-winner";
/** A track still not decoded after this plays the battle on the clock alone (count in, SFX), never a black wait. */
const TRACK_WAIT_MS = 12000;

export interface GameDeps {
  base: string;
  trackInfo: (key: string) => TrackInfo;
  /** Where the track source connects (the audio layers' input), default the music bus. */
  musicIn?: () => AudioNode;
  /** A count in beat scheduled at context time `at` (n = 4..1). */
  countIn?: (at: number, n: number) => void;
  stopAll?: () => void;
}

export class Game implements GameApi {
  private listeners: Listener[] = [];
  private core: BattleCore | null = null;
  private clock: SongClock | null = null;
  private src: AudioBufferSourceNode | null = null;
  private srcGain: GainNode | null = null;
  private track: TrackInfo | null = null;
  private buffers = new Map<string, Promise<AudioBuffer | null>>();
  private raw = new Map<string, Promise<ArrayBuffer | null>>();
  private voices: Record<string, string> | null = null;
  private voiceBufs = new Map<string, AudioBuffer>();
  private offset = 0;
  private paused = false;
  private pausePos = 0;
  private endAt = -1;
  private done: ((s: Stats) => void) | null = null;
  private setRate = 1;
  /** Count in clicks already scheduled on the audio clock, announced to the listeners as they are heard. */
  private pendingCount: { n: number; at: number }[] = [];
  /** Battles started per level id: rotates the taunt lines so a retry hears a new one first. */
  private attempts = new Map<number, number>();
  private lastTurn: "player" | "opponent" = "player";

  constructor(private deps: GameDeps) {}

  listen(l: Listener) {
    this.listeners.push(l);
  }

  private emit = (e: CoreEvent) => {
    for (const l of this.listeners) l.event(e);
    this.react(e);
  };

  /** The track's compressed bytes, fetched once (safe before any gesture: no AudioContext needed). */
  private bytes(file: string): Promise<ArrayBuffer | null> {
    let p = this.raw.get(file);
    if (!p) {
      p = fetch(`${this.deps.base}music/${file}`)
        .then((r) => (r.ok ? r.arrayBuffer() : Promise.reject(r.status)))
        .catch(() => {
          // A failed download is not cached: the next battle tries again.
          this.raw.delete(file);
          return null;
        });
      this.raw.set(file, p);
    }
    return p;
  }

  /** The decoded track: decoding waits for the first call here (the tap), the bytes may already be in. */
  private buffer(file: string): Promise<AudioBuffer | null> {
    let p = this.buffers.get(file);
    if (!p) {
      p = this.bytes(file)
        .then((a) => {
          if (!a) return Promise.reject(new Error("no bytes"));
          // decodeAudioData detaches the bytes: the decoded promise is the cache from here on.
          this.raw.delete(file);
          return ctx.decodeAudioData(a);
        })
        .catch(() => {
          this.buffers.delete(file);
          return null;
        });
      this.buffers.set(file, p);
    }
    return p;
  }

  /** Ahead of a battle (addendum 17:40): only the track's bytes download, nothing decodes before the tap,
   * the voices stream during the battle. `decode` (after a battle, the context running) decodes it too. */
  preload(level: LevelV2, decode = false): Promise<void> {
    const file = this.deps.trackInfo(level.track).file;
    return (decode ? this.buffer(file) : this.bytes(file)).then(() => {});
  }

  private async loadVoices(level: LevelV2) {
    if (!this.voices) {
      try {
        const r = await fetch(`${this.deps.base}voice/v2/index.json`);
        this.voices = r.ok ? await r.json() : {};
      } catch {
        this.voices = {};
      }
    }
    loadCalls(this.deps.base, this.voices ?? {}).catch(() => {});
    if (!this.voicedIndex()) return;
    const ids = [`v2-l${level.id}-intro`, `v2-l${level.id}-win`, `v2-l${level.id}-lose`, ...level.taunts.map((_, i) => `v2-l${level.id}-taunt-${i}`)];
    await Promise.all(ids.map(async (id) => {
      const f = this.voices?.[id];
      if (!f || this.voiceBufs.has(id)) return;
      try {
        const a = await (await fetch(`${this.deps.base}voice/v2/${f}`)).arrayBuffer();
        this.voiceBufs.set(id, await ctx.decodeAudioData(a));
      } catch { /* missing line: the subtitle carries it */ }
    }));
  }

  /** True when the voice index carries the bake off winner's recordings. */
  private voicedIndex(): boolean {
    return (this.voices as Record<string, string> | null)?.voice === VOICE_TAG;
  }

  /** A battle line through the single voice queue (one line at a time, a taunt never over a call). */
  private voice(id: string, kind: "line" | "taunt", at?: number) {
    if (!this.voicedIndex()) return;
    const b = this.voiceBufs.get(id);
    if (b) playVoice(b, kind, id, { at });
  }

  async play(level: LevelV2, windowScale: number): Promise<Stats> {
    this.quit();
    const info = this.deps.trackInfo(level.track);
    this.track = info;
    this.offset = getOffset();
    this.loadVoices(level);
    // The download keeps going after the timeout: the cached promise serves the retry.
    const buf = await Promise.race([this.buffer(info.file), new Promise<null>((r) => setTimeout(() => r(null), TRACK_WAIT_MS))]);
    const attempt = this.attempts.get(level.id) ?? 0;
    this.attempts.set(level.id, attempt + 1);
    this.lastTurn = "player";
    this.core = new BattleCore(level, info, windowScale, this.emit, attempt);
    this.endAt = -1;
    this.paused = false;
    this.startSource(buf, 0, COUNT_IN, 0.25);
    this.voice(`v2-l${level.id}-intro`, "line");
    return new Promise((res) => (this.done = res));
  }

  /** Start the track so that track position `from + firstBeat` (or `from` when resuming) lands after `beats` count in clicks. */
  private startSource(buf: AudioBuffer | null, resumePos: number, beats: number, lead: number) {
    const info = this.track!;
    const rate = this.core ? this.core.tempo.rate : 1;
    // Real seconds per beat: the count in clicks on the tempo the track plays at.
    const spb = 60 / info.bpm / rate;
    const tClick0 = ctx.currentTime + lead;
    // Fresh start: beat 0 lands right after the count in. Resume: the paused position does.
    const landPos = resumePos > 0 ? resumePos : info.firstBeat;
    const tLand = tClick0 + beats * spb;
    this.clock = new SongClock(tLand, landPos, rate);
    this.setRate = rate;
    for (let k = 0; k < beats; k++) {
      const at = tClick0 + k * spb;
      if (this.deps.countIn) this.deps.countIn(at, beats - k);
      else sfx.tick(at, k === beats - 1);
    }
    this.pendingCount = Array.from({ length: beats }, (_, k) => ({ n: beats - k, at: tClick0 + k * spb }));
    if (!buf) return;
    const s = ctx.createBufferSource();
    s.buffer = buf;
    s.playbackRate.value = rate;
    const g = ctx.createGain();
    s.connect(g).connect(this.deps.musicIn ? this.deps.musicIn() : musicBus);
    // A fresh start plays the few ms before beat 0 too; a resume enters exactly at the paused position.
    const startPos = resumePos > 0 ? resumePos : 0;
    const startAt = this.clock.timeOf(startPos);
    s.start(Math.max(ctx.currentTime, startAt), startPos);
    this.src = s;
    this.srcGain = g;
  }

  private stopSource(fade = 0) {
    const s = this.src, g = this.srcGain;
    this.src = null;
    this.srcGain = null;
    if (!s || !g) return;
    const t = ctx.currentTime;
    if (fade > 0) {
      g.gain.setValueAtTime(g.gain.value, t);
      g.gain.linearRampToValueAtTime(0.0001, t + fade);
      s.stop(t + fade + 0.02);
    } else {
      try { s.stop(); } catch { /* not started */ }
    }
  }

  /** Song seconds from beat 0 heard at context time t, latency compensated. */
  private songAt(t: number): number {
    return this.clock!.pos(t - this.offset) - this.track!.firstBeat;
  }

  input(i: PlayInput) {
    if (!this.core || !this.clock || this.paused || this.endAt > 0) return;
    const t = this.songAt(i.at);
    if (i.kind === "dir") this.core.input({ kind: "dir", dir: i.dir, t });
    else this.core.input({ kind: i.kind, down: i.down, t });
  }

  touchMode(): "hit" | "mash" | "hold" | "none" {
    const c = this.core?.runner.current();
    if (!c || !this.core || this.core.ended) return "none";
    if (this.core.songTime < this.core.runner.opensAt(c.ev) - 0.3) return "hit";
    return c.ev.type === "mash" ? "mash" : c.ev.type === "hold" ? "hold" : "hit";
  }

  /** Whose turn it is, from the last frame (the play zone dims and ignores taps on "opponent"). */
  turn(): "player" | "opponent" {
    return this.core && !this.core.ended ? this.lastTurn : "player";
  }

  /** True over the last `beats` of the current MASH window: the ring closes, the pad asks for the drop tap. */
  releasing(beats = 1): boolean {
    const c = this.core?.runner.current();
    if (!c || !this.core || c.ev.type !== "mash") return false;
    return this.core.songTime >= this.core.runner.targetAt(c.ev) - beats * this.core.runner.spb;
  }

  running() {
    return !!this.core;
  }

  pause() {
    if (!this.core || !this.clock || this.paused || this.endAt > 0) return;
    this.paused = true;
    this.pendingCount = [];
    this.pausePos = this.clock.pos(ctx.currentTime);
    this.stopSource();
  }

  resume() {
    if (!this.core || !this.paused) return;
    this.paused = false;
    this.buffer(this.track!.file).then((buf) => {
      if (this.core && !this.paused) this.startSource(buf, this.pausePos, RESUME_COUNT_IN, 0.3);
    });
  }

  quit() {
    this.stopSource(0.15);
    this.deps.stopAll?.();
    stopVoices();
    this.core = null;
    this.clock = null;
    this.done = null;
    this.pendingCount = [];
  }

  /** Voices and music side effects of core events (the audio layers handle the SFX). */
  private react(e: CoreEvent) {
    const L = this.core?.level;
    if (!L) return;
    // Taunt voices only once they were recorded from the current cast text (voice/v2/index.json "cast"),
    // so an old recording never speaks over a new subtitle.
    if (e.kind === "taunt") {
      if ((this.voices as Record<string, string> | null)?.cast === CAST_TAG) this.voice(`v2-l${L.id}-taunt-${e.index}`, "taunt");
    }
    else if (e.kind === "end") {
      this.endAt = ctx.currentTime + FINISH;
      const bar = (60 / L.bpm) * 4;
      // Lose: the tape slows to half speed under the one bar tail.
      if (!e.win && this.src) this.src.playbackRate.setTargetAtTime(this.setRate * 0.5, ctx.currentTime, bar / 3);
      this.stopSource(bar);
      this.voice(`v2-l${L.id}-${e.win ? "win" : "lose"}`, "line", ctx.currentTime + 0.4);
    }
  }

  tick(realDt: number) {
    const core = this.core;
    if (!core || !this.clock) return;
    if (this.paused) return;
    // Tempo rule: bend the playback rate once the track is playing, on the same clock the grid reads.
    const now = ctx.currentTime;
    const r = core.tempo.rate;
    if (this.src && Math.abs(r - this.setRate) > 0.0005 && this.endAt < 0) {
      this.clock.setRate(now, r);
      this.src.playbackRate.setValueAtTime(r, now);
      this.setRate = r;
    }
    const heard = heardTime();
    while (this.pendingCount.length && this.pendingCount[0].at <= heard) {
      const c = this.pendingCount.shift()!;
      this.emit({ kind: "countIn", n: c.n, at: c.at });
    }
    core.update(this.songAt(heard), realDt);
    const f = core.frame();
    this.lastTurn = f.turn;
    for (const l of this.listeners) l.frame?.(f, realDt);
    if (this.endAt > 0 && now >= this.endAt && this.done) {
      const done = this.done;
      const stats = core.stats();
      this.core = null;
      this.clock = null;
      this.done = null;
      this.deps.stopAll?.();
      done(stats);
    }
  }
}
