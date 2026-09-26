// v2 audio layers (amendment 9 section 6): the Lyria track bus (lowpass riser, sidechain duck), the crowd
// bed, and every judged / release / story one shot, all layered and scheduled on ctx.currentTime, never
// on the frame. Read src/audio/engine.ts, sfx.ts, crowd.ts first: this reuses them, never edits them.
import { ctx, heardTime, master, musicBus, noiseSource, sfxBus } from "./engine";
import { sfx } from "./sfx";
import { cheer, boo } from "./crowd";
import { sparkleTail, mashTick, sting, subDrop, downlifter, countKick, riserTick } from "./synth-extra";
import type { Grade } from "../qte/judge";
import { play, useOutput, type PlayOpts, type Slot } from "../sfx";
import type { CoreEvent, Frame, Listener } from "../v2/contracts";

const OPEN_HZ = 20000;

/** Where the shared media sits: one level up from /v2/, next to the page at the root (as src/v2/main.ts). */
const MEDIA_BASE = typeof location !== "undefined" && /\/v2\/?/.test(location.pathname) ? "../" : "";

/** Gradium crowd chants (public/voice/v2): decoded once, on the first count in, played under the action. */
const CHANTS = ["crowd-six-seven-1", "crowd-six-seven-2", "crowd-mix"] as const;
type Chant = (typeof CHANTS)[number];
const chantBufs = new Map<Chant, AudioBuffer>();
let chantsLoading = false;

function loadChants() {
  if (chantsLoading) return;
  chantsLoading = true;
  for (const c of CHANTS) {
    fetch(`${MEDIA_BASE}voice/v2/${c}.mp3`)
      .then((r) => (r.ok ? r.arrayBuffer() : Promise.reject(r.status)))
      .then((a) => ctx.decodeAudioData(a))
      .then((b) => chantBufs.set(c, b))
      .catch(() => {
        /* a missing chant leaves the synthesized crowd alone */
      });
  }
}

/** Play a crowd chant at context time t under the music (never through the voice queue: it is the room, not a line). */
function chant(c: Chant, t: number, gain = 0.55) {
  const b = chantBufs.get(c);
  if (!b) return;
  const s = ctx.createBufferSource();
  s.buffer = b;
  const g = ctx.createGain();
  g.gain.value = gain;
  s.connect(g).connect(master);
  s.start(Math.max(ctx.currentTime, t));
}

/** A Gen Z slot (src/sfx, docs/sfx.md) at context time t. A failure is logged, never thrown into the frame loop. */
function gz(slot: Slot, t: number, opts: PlayOpts = {}) {
  try {
    play(slot, { ...opts, at: Math.max(0, t - ctx.currentTime) });
  } catch (err) {
    console.warn(`sfx ${slot}:`, err);
  }
}

/** +/-3 percent pitch multiplier so a repeated hit does not sound like a machine gun. Pure, testable. */
export function jitter(rand: () => number = Math.random): number {
  return 1 + (rand() * 2 - 1) * 0.03;
}

/** Minimum gap between two crowd one shots, measured on the audio clock. Pure, testable. */
export class CrowdGate {
  private last = -Infinity;
  constructor(private cooldown = 0.25) {}
  allow(at: number): boolean {
    if (at - this.last < this.cooldown) return false;
    this.last = at;
    return true;
  }
}

/** Drop riser lowpass frequency: 400 Hz a bar out, fully open exactly at the drop. Pure, testable. */
export function riserFreq(beatsToDrop: number, barBeats = 4, from = 400, to = OPEN_HZ): number {
  const k = Math.min(1, Math.max(0, 1 - beatsToDrop / barBeats));
  return from * Math.pow(to / from, k);
}

/**
 * Context time to schedule a sound so it is HEARD `beats` beats from now: a sound scheduled at context time
 * T is heard when heardTime() reaches T. Never in the past. Pure, testable.
 */
export function dropBoomTime(now: number, heardNow: number, beats: number, spb: number, rate: number): number {
  return Math.max(now, heardNow + (Math.max(0, beats) * spb) / Math.max(0.1, rate));
}

export class AudioFx implements Listener {
  /** The lead connects the Lyria track source here: musicIn -> lowpass -> duck -> musicBus. */
  readonly musicIn: GainNode;
  private lowpass: BiquadFilterNode;
  private duck: GainNode;

  private spb = 0.5;
  private cringeUntil = 0;
  private duckCrowdToSilence = false;
  /** The battle is decided: the end() envelope owns the crowd bed. */
  private ended = false;

  private bedGain: GainNode | null = null;
  private bedFilter: BiquadFilterNode | null = null;
  private bedSrc: AudioBufferSourceNode | null = null;
  private readonly bedBase = 0.16;

  private holdOsc: OscillatorNode | null = null;
  private holdFilter: BiquadFilterNode | null = null;
  private holdGain: GainNode | null = null;

  private whooshed = new WeakSet<object>();
  private dropArmed = false;
  /** Context time the next drop boom is scheduled at, -1 when none. */
  private dropBoomAt = -1;
  private crowdGate = new CrowdGate(0.25);
  /** Context time of the pending count in's first click, -1 when none. */
  private firstClick = -1;

  constructor() {
    this.musicIn = ctx.createGain();
    this.lowpass = ctx.createBiquadFilter();
    this.lowpass.type = "lowpass";
    this.lowpass.frequency.value = OPEN_HZ;
    this.duck = ctx.createGain();
    this.duck.gain.value = 1;
    this.musicIn.connect(this.lowpass).connect(this.duck).connect(musicBus);
    useOutput(ctx, sfxBus);
  }

  private get bpm() {
    return 60 / this.spb;
  }

  // ---- Listener ----

  event(e: CoreEvent) {
    const t = ctx.currentTime;
    switch (e.kind) {
      case "judged":
        this.judged(t, e.grade, e.cringe);
        break;
      case "mashStep":
        mashTick(t, e.count, jitter());
        gz("mashCharge", t, { step: Math.min(1, e.count / 16) });
        break;
      case "release":
        this.release(t, e.burst);
        break;
      case "holdStart":
        this.startHoldRiser(t);
        break;
      case "holdEnd":
        this.stopHoldRiser(t, e.grade);
        break;
      case "taunt":
        sting(t, jitter());
        break;
      case "dropSoon":
        this.dropArmed = true;
        break;
      case "drop":
        // Already scheduled on the audio clock from the frame before; this is the late fallback.
        if (this.dropBoomAt < 0) {
          sfx.boom(t);
          gz("bigHit", t);
          this.duckMusic(t);
        }
        this.dropBoomAt = -1;
        break;
      case "phase2":
        downlifter(t);
        break;
      case "mashStart":
        // The room chants SIX SEVEN while the player charges the 67.
        chant(Math.random() < 0.5 ? "crowd-six-seven-1" : "crowd-six-seven-2", t);
        break;
      case "end":
        this.end(t, e.win);
        break;
      default:
        break; // "beat", "mashStart", "dropSoon", "countIn": no dedicated sound here (the lead calls
        // countIn() directly, once per beat; broadcasting it again through event() would double fire it)
    }
  }

  frame(f: Frame, _realDt: number) {
    this.spb = f.spb;
    this.updateDropRiser(f);
    this.updateCrowdBed(f);
    this.updateAnticipation(f);
    this.scheduleDropBoom(f);
  }

  /** The drop boom lands exactly on the heard drop beat: scheduled ahead on the audio clock, not on the frame. */
  private scheduleDropBoom(f: Frame) {
    if (!this.dropArmed || !Number.isFinite(f.beatsToDrop) || f.beatsToDrop > 1) return;
    this.dropArmed = false;
    const at = dropBoomTime(ctx.currentTime, heardTime(), f.beatsToDrop, f.spb, f.rate);
    sfx.boom(at);
    gz("bigHit", at);
    this.duckMusic(at);
    this.dropBoomAt = at;
  }

  // ---- judged one shots ----

  private judged(t: number, grade: Grade, cringe: boolean) {
    if (cringe) return this.cringe(t);
    if (grade === "perfect") {
      sfx.snap(t);
      gz("perfect", t);
      sparkleTail(t);
    } else if (grade === "great") {
      sfx.snap(t);
      gz("great", t);
    } else if (grade === "ok") {
      gz("ok", t);
    } else {
      sfx.thud(t);
    }
  }

  /** Record scratch, a late crowd "ooh", and the music low passed to 600 Hz for one beat. */
  private cringe(t: number) {
    gz("missCringe", t);
    this.queueCrowd(t, "ooh");
    const openBefore = Math.max(this.lowpass.frequency.value, 400);
    this.lowpass.frequency.cancelScheduledValues(t);
    this.lowpass.frequency.setValueAtTime(600, t);
    this.lowpass.frequency.setValueAtTime(600, t + this.spb * 0.85);
    this.lowpass.frequency.linearRampToValueAtTime(openBefore, t + this.spb);
    this.cringeUntil = t + this.spb;
  }

  /** Sub drop plus noise burst plus a crowd roar sized by the burst (the 67 release). */
  private release(t: number, burst: number) {
    subDrop(t, Math.min(2, burst / 20));
    gz("auraRelease", t, { bpm: this.bpm });
    this.queueCrowd(t, "cheer", Math.max(0.4, Math.min(2.2, burst / 14)));
  }

  /** Win: boom and the crowd peaks, then the bed ducks under the one bar tail. Lose: scratch, "ooh", boo. */
  private end(t: number, win: boolean) {
    this.ended = true;
    if (win) {
      sfx.boom(t, 1.4);
      gz("victory", t + 0.2, { bpm: this.bpm });
      chant("crowd-mix", t + 0.3, 0.6);
      this.duckMusic(t);
      this.queueCrowd(t, "cheer", 2.2);
      this.bedGain?.gain.cancelScheduledValues(t);
      this.bedGain?.gain.setTargetAtTime(this.bedBase * 1.6, t, 0.05);
      this.bedGain?.gain.setTargetAtTime(0.0001, t + this.spb * 2, 0.4);
    } else {
      gz("missCringe", t);
      gz("defeat", t + 0.3);
      this.queueCrowd(t, "ooh");
      window.setTimeout(() => boo(), 700);
      this.bedGain?.gain.cancelScheduledValues(t);
      this.bedGain?.gain.setTargetAtTime(0.0001, t + this.spb, 0.5);
    }
  }

  // ---- hold riser: a sustained tone from holdStart to holdEnd ----

  private startHoldRiser(t: number) {
    this.stopHoldRiser(t, null);
    const o = ctx.createOscillator();
    o.type = "sawtooth";
    o.frequency.setValueAtTime(140, t);
    o.frequency.exponentialRampToValueAtTime(900, t + 4);
    const f = ctx.createBiquadFilter();
    f.type = "lowpass";
    f.frequency.setValueAtTime(500, t);
    f.frequency.exponentialRampToValueAtTime(4000, t + 4);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.16, t + 0.15);
    o.connect(f).connect(g).connect(sfxBus);
    o.start(t);
    this.holdOsc = o;
    this.holdFilter = f;
    this.holdGain = g;
  }

  private stopHoldRiser(t: number, grade: Grade | null) {
    if (!this.holdOsc || !this.holdGain) return;
    this.holdGain.gain.cancelScheduledValues(t);
    this.holdGain.gain.setTargetAtTime(0.0001, t, grade === "miss" ? 0.05 : 0.12);
    if (grade === "perfect" || grade === "great") this.holdFilter?.frequency.setTargetAtTime(6000, t, 0.05);
    this.holdOsc.stop(t + 0.4);
    this.holdOsc = null;
    this.holdGain = null;
    this.holdFilter = null;
  }

  // ---- count in and the crowd bed ----

  /** A kick plus a riser tick exactly at `at`, the crowd bed rising across the count in (called once per beat). */
  countIn(at: number, n: number) {
    this.ended = false;
    loadChants();
    this.ensureBed(at);
    countKick(at);
    riserTick(at, n);
    // The tamborzao roll fills the count in: one bar at the level tempo from the first click. The clicks are all
    // scheduled at once, so the second one gives the tempo while the first is still ahead.
    if (n === 4) this.firstClick = at;
    else if (n === 3 && this.firstClick > 0 && at > this.firstClick) {
      gz("levelStart", this.firstClick, { bpm: 60 / (at - this.firstClick) });
      this.firstClick = -1;
    }
    const frac = Math.min(1, (5 - n) / 4);
    this.bedGain?.gain.setTargetAtTime(this.bedBase * frac, at, 0.15);
  }

  private ensureBed(at: number) {
    if (this.bedGain) return;
    const bed = ctx.createGain();
    bed.gain.value = 0.0001;
    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = 600;
    filter.Q.value = 0.6;
    const src = noiseSource(at, 36000);
    src.connect(filter).connect(bed).connect(master);
    this.bedGain = bed;
    this.bedFilter = filter;
    this.bedSrc = src;
  }

  // ---- per frame: drop riser, crowd bed, anticipation whoosh ----

  private updateDropRiser(f: Frame) {
    const t = ctx.currentTime;
    this.duckCrowdToSilence = f.beatsToDrop <= 1;
    if (t < this.cringeUntil) return; // let the cringe dip resolve on its own schedule first
    if (f.beatsToDrop <= 4) this.lowpass.frequency.setValueAtTime(riserFreq(f.beatsToDrop), t);
    else if (this.lowpass.frequency.value < OPEN_HZ - 1) this.lowpass.frequency.setTargetAtTime(OPEN_HZ, t, 0.2);
  }

  private updateCrowdBed(f: Frame) {
    if (!this.bedGain || !this.bedFilter || this.ended) return;
    const t = ctx.currentTime;
    if (this.duckCrowdToSilence) {
      this.bedGain.gain.setTargetAtTime(0.0001, t, 0.06);
      return;
    }
    const intensity = Math.min(1, 0.3 + Math.abs(f.meter) * 0.4 + f.energy * 0.3);
    this.bedFilter.frequency.setTargetAtTime(500 + intensity * 900, t, 0.3);
    this.bedGain.gain.setTargetAtTime(this.bedBase * intensity, t, 0.3);
  }

  /** A whoosh one beat before a MASH release or a COMBO final beat, scheduled once per event. */
  private updateAnticipation(f: Frame) {
    for (const s of f.prompts) {
      if (s.phase === "done" || (s.ev.type !== "mash" && s.ev.type !== "combo")) continue;
      if (this.whooshed.has(s.ev)) continue;
      const target = f.targetAt(s.ev) - f.spb;
      if (target <= f.songTime) continue;
      const at = ctx.currentTime + (target - f.songTime) / Math.max(0.1, f.rate);
      sfx.whoosh(at);
      this.whooshed.add(s.ev);
    }
  }

  /** 150 ms sidechain duck of the music under a boom: to 0.35 and back. */
  private duckMusic(t: number) {
    const g = this.duck.gain;
    g.cancelScheduledValues(t);
    g.setValueAtTime(1, t);
    g.linearRampToValueAtTime(0.35, t + 0.02);
    g.linearRampToValueAtTime(1, t + 0.15);
  }

  /** A crowd one shot 90 to 120 ms after the hit, capped at one per 250 ms. */
  private queueCrowd(t: number, kind: "cheer" | "boo" | "ooh", size = 1) {
    const at = t + 0.09 + Math.random() * 0.03;
    if (!this.crowdGate.allow(at)) return;
    const delayMs = Math.max(0, at - ctx.currentTime) * 1000;
    window.setTimeout(() => {
      if (kind === "cheer") {
        cheer(size);
        if (size >= 1) gz("crowdRoar", ctx.currentTime);
      } else if (kind === "boo") boo();
      else gz("crowdOoh", ctx.currentTime);
    }, delayMs);
  }

  /** Silence everything: quit, results. */
  stopAll() {
    const t = ctx.currentTime;
    this.stopHoldRiser(t, null);
    if (this.bedGain) this.bedGain.gain.cancelScheduledValues(t);
    this.bedGain?.gain.setTargetAtTime(0.0001, t, 0.2);
    this.bedSrc?.stop(t + 1);
    this.bedGain = null;
    this.bedFilter = null;
    this.bedSrc = null;
    this.duck.gain.cancelScheduledValues(t);
    this.duck.gain.setTargetAtTime(1, t, 0.05);
    this.lowpass.frequency.cancelScheduledValues(t);
    this.lowpass.frequency.setTargetAtTime(OPEN_HZ, t, 0.05);
    this.duckCrowdToSilence = false;
    this.cringeUntil = 0;
    this.ended = false;
    this.dropArmed = false;
    this.dropBoomAt = -1;
  }
}
