// v2 battle driver: loads the Lyria track, counts in on the audio clock, runs the BattleCore on the song clock,
// bends the music playbackRate with the tempo rule, plays the voices, fans events out to the listeners.
import { ctx, heardTime, master, musicBus } from "../audio/engine";
import { sfx } from "../audio/sfx";
import { getOffset } from "../game/latency";
import { SongClock } from "./clock";
import { BattleCore } from "./core";
import type { CoreEvent, GameApi, LevelV2, Listener, PlayInput, Stats, TrackInfo } from "./contracts";

const COUNT_IN = 4;
const RESUME_COUNT_IN = 3;
/** Seconds between the decided battle and the results (the finish animation). */
const FINISH = 3.2;
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

  private buffer(file: string): Promise<AudioBuffer | null> {
    let p = this.buffers.get(file);
    if (!p) {
      p = fetch(`${this.deps.base}music/${file}`)
        .then((r) => (r.ok ? r.arrayBuffer() : Promise.reject(r.status)))
        .then((a) => ctx.decodeAudioData(a))
        .catch(() => {
          // A failed download is not cached: the next battle tries again.
          this.buffers.delete(file);
          return null;
        });
      this.buffers.set(file, p);
    }
    return p;
  }

  /** Fetch and decode a level's track and voices ahead of time (the loading screen and the VS card call
   * this; needs the AudioContext, created suspended during loading). Settles when both are in or failed. */
  preload(level: LevelV2): Promise<void> {
    return Promise.all([this.buffer(this.deps.trackInfo(level.track).file), this.loadVoices(level)]).then(() => {});
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

  private voice(id: string, at = ctx.currentTime) {
    const b = this.voiceBufs.get(id);
    if (!b) return;
    const s = ctx.createBufferSource();
    s.buffer = b;
    const g = ctx.createGain();
    g.gain.value = 1.2;
    s.connect(g).connect(master);
    s.start(at);
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
    this.voice(`v2-l${level.id}-intro`);
    return new Promise((res) => (this.done = res));
  }

  /** Start the track so that track position `from + firstBeat` (or `from` when resuming) lands after `beats` count in clicks. */
  private startSource(buf: AudioBuffer | null, resumePos: number, beats: number, lead: number) {
    const info = this.track!;
    const spb = 60 / info.bpm;
    const rate = this.core ? this.core.tempo.rate : 1;
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
    else this.core.input({ kind: "space", down: i.down, t });
  }

  touchMode(): "hit" | "mash" | "hold" | "none" {
    const c = this.core?.runner.current();
    if (!c || !this.core) return "none";
    if (this.core.songTime < this.core.runner.opensAt(c.ev) - 0.3) return "hit";
    return c.ev.type === "mash" ? "mash" : c.ev.type === "hold" ? "hold" : "hit";
  }

  /** Whose turn it is, from the last frame (the play zone dims and ignores taps on "opponent"). */
  turn(): "player" | "opponent" {
    return this.core ? this.lastTurn : "player";
  }

  /** True over the last RELEASE_BEATS of the current MASH window: the two pads merge into RELEASE. */
  releasing(beats = 1.5): boolean {
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
    this.core = null;
    this.clock = null;
    this.done = null;
    this.pendingCount = [];
  }

  /** Voices and music side effects of core events (the audio layers handle the SFX). */
  private react(e: CoreEvent) {
    const L = this.core?.level;
    if (!L) return;
    if (e.kind === "taunt") this.voice(`v2-l${L.id}-taunt-${e.index}`);
    else if (e.kind === "end") {
      this.endAt = ctx.currentTime + FINISH;
      const bar = (60 / L.bpm) * 4;
      // Lose: the tape slows to half speed under the one bar tail.
      if (!e.win && this.src) this.src.playbackRate.setTargetAtTime(this.setRate * 0.5, ctx.currentTime, bar / 3);
      this.stopSource(bar);
      this.voice(`v2-l${L.id}-${e.win ? "win" : "lose"}`, ctx.currentTime + 0.4);
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
