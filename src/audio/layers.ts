// v2 audio layers (amendment 9 section 6): the Lyria track bus (lowpass riser, sidechain duck), the crowd
// bed, and every judged / release / story one shot, all layered and scheduled on ctx.currentTime, never
// on the frame. Read src/audio/engine.ts, sfx.ts, crowd.ts first: this reuses them, never edits them.
import { ctx, master, musicBus, noiseSource, sfxBus } from "./engine";
import { sfx } from "./sfx";
import { cheer, boo } from "./crowd";
import { chime, sparkleTail, mashTick, sting, subDrop, noiseBurst, downlifter, crowdOoh, countKick, riserTick } from "./synth-extra";
import type { Grade } from "../qte/judge";
import type { CoreEvent, Frame, Listener } from "../v2/contracts";

const OPEN_HZ = 20000;

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

export class AudioFx implements Listener {
  /** The lead connects the Lyria track source here: musicIn -> lowpass -> duck -> musicBus. */
  readonly musicIn: GainNode;
  private lowpass: BiquadFilterNode;
  private duck: GainNode;

  private spb = 0.5;
  private cringeUntil = 0;
  private duckCrowdToSilence = false;

  private bedGain: GainNode | null = null;
  private bedFilter: BiquadFilterNode | null = null;
  private bedSrc: AudioBufferSourceNode | null = null;
  private readonly bedBase = 0.16;

  private holdOsc: OscillatorNode | null = null;
  private holdFilter: BiquadFilterNode | null = null;
  private holdGain: GainNode | null = null;

  private whooshed = new WeakSet<object>();
  private crowdGate = new CrowdGate(0.25);

  constructor() {
    this.musicIn = ctx.createGain();
    this.lowpass = ctx.createBiquadFilter();
    this.lowpass.type = "lowpass";
    this.lowpass.frequency.value = OPEN_HZ;
    this.duck = ctx.createGain();
    this.duck.gain.value = 1;
    this.musicIn.connect(this.lowpass).connect(this.duck).connect(musicBus);
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
      case "drop":
        sfx.boom(t);
        this.duckMusic(t);
        break;
      case "phase2":
        downlifter(t);
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
  }

  // ---- judged one shots ----

  private judged(t: number, grade: Grade, cringe: boolean) {
    if (cringe) return this.cringe(t);
    if (grade === "perfect") {
      sfx.snap(t);
      chime(t, 0.24, jitter());
      sparkleTail(t);
    } else if (grade === "great") {
      sfx.snap(t);
      chime(t, 0.16, jitter());
    } else if (grade === "ok") {
      sfx.tick(t);
    } else {
      sfx.thud(t);
    }
  }

  /** Record scratch, a late crowd "ooh", and the music low passed to 600 Hz for one beat. */
  private cringe(t: number) {
    sfx.scratch(t);
    this.queueCrowd(t, "ooh");
    const openBefore = Math.max(this.lowpass.frequency.value, 400);
    this.lowpass.frequency.cancelScheduledValues(t);
    this.lowpass.frequency.setValueAtTime(600, t);
    this.lowpass.frequency.setValueAtTime(600, t + this.spb * 0.85);
    this.lowpass.frequency.linearRampToValueAtTime(openBefore, t + this.spb);
    this.cringeUntil = t + this.spb;
  }

  /** Sub drop plus noise burst plus a crowd roar sized by the burst (amendment 6's 69 release). */
  private release(t: number, burst: number) {
    subDrop(t, Math.min(2, burst / 20));
    noiseBurst(t, 0.35);
    this.queueCrowd(t, "cheer", Math.max(0.4, Math.min(2.2, burst / 14)));
  }

  private end(t: number, win: boolean) {
    if (win) {
      sfx.boom(t, 1.4);
      this.duckMusic(t);
      this.queueCrowd(t, "cheer", 2.2);
    } else {
      sfx.scratch(t);
      this.queueCrowd(t, "boo");
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
    this.ensureBed(at);
    countKick(at);
    riserTick(at, n);
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
    if (!this.bedGain || !this.bedFilter) return;
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
      if (kind === "cheer") cheer(size);
      else if (kind === "boo") boo();
      else crowdOoh(ctx.currentTime);
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
  }
}
