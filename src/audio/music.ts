// Procedural beat per level: kick, snare, hats, bass and a seeded lead riff on a lookahead scheduler.
import { ctx, env, musicBus, noiseSource } from "./engine";

const LOOKAHEAD = 0.12;
const MINOR = [0, 3, 5, 7, 10, 12, 15, 17];

function rng(seed: number) {
  let s = seed * 9301 + 49297;
  return () => ((s = (s * 9301 + 49297) % 233280) / 233280);
}

export class Music {
  spb: number;
  /** AudioContext time of beat 0. */
  t0 = 0;
  private step = 0;
  private timer = 0;
  private riff: number[];
  private bassLine: number[];
  root: number;
  octave = 1;
  onBeat: ((beat: number, at: number) => void) | null = null;

  constructor(public bpm: number, seed: number, public lengthBeats: number, public phase2Beat?: number) {
    this.spb = 60 / bpm;
    const r = rng(seed);
    this.root = 110 * Math.pow(2, Math.floor(r() * 5) / 12);
    this.riff = Array.from({ length: 16 }, () => (r() < 0.55 ? MINOR[Math.floor(r() * MINOR.length)] : -1));
    this.bassLine = [0, 0, MINOR[Math.floor(r() * 4)], MINOR[1 + Math.floor(r() * 3)]];
  }

  /** Song time in seconds (0 = beat 0), negative during the count-in. */
  songTime(): number {
    return ctx.currentTime - this.t0;
  }

  start(countInBeats = 4) {
    this.t0 = ctx.currentTime + 0.15 + countInBeats * this.spb;
    this.step = -countInBeats * 4;
    this.timer = window.setInterval(() => this.schedule(), 25);
    this.schedule();
  }

  stop() {
    clearInterval(this.timer);
  }

  private schedule() {
    const s16 = this.spb / 4;
    while (this.t0 + this.step * s16 < ctx.currentTime + LOOKAHEAD) {
      const at = this.t0 + this.step * s16;
      if (this.step >= this.lengthBeats * 4 + 8) return this.stop();
      this.play(this.step, at);
      this.step++;
    }
  }

  private play(step: number, at: number) {
    const beat = Math.floor(step / 4);
    const sub = ((step % 4) + 4) % 4;
    if (sub === 0 && this.onBeat) this.onBeat(beat, at);
    if (step < 0) {
      if (sub === 0) this.hat(at, 0.35, true);
      return;
    }
    if (beat >= this.lengthBeats) {
      if (step === this.lengthBeats * 4) { this.kick(at); this.crash(at); }
      return;
    }
    const p2 = this.phase2Beat !== undefined && beat >= this.phase2Beat;
    this.octave = p2 ? 0.5 : 1;
    const bar = Math.floor(beat / 4);
    const breakdown = bar % 8 === 7;
    if (sub === 0 && (!breakdown || beat % 4 === 0)) this.kick(at);
    if (p2 && sub === 2 && beat % 2 === 1) this.kick(at);
    if (sub === 0 && beat % 2 === 1 && !breakdown) this.snare(at);
    this.hat(at, sub === 2 ? 0.22 : 0.09, false);
    if (sub === 0 || sub === 3) this.bass(at, this.bassLine[bar % 4], sub === 0 ? 0.28 : 0.12);
    const note = this.riff[(step + (bar % 2) * 3) % 16];
    if (note >= 0 && bar >= 2) this.lead(at, note + (bar % 4 === 3 ? 5 : 0));
    if (beat % 16 === 0 && sub === 0) this.crash(at);
  }

  private kick(t: number) {
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.frequency.setValueAtTime(150, t);
    o.frequency.exponentialRampToValueAtTime(42, t + 0.12);
    env(g, t, 1.0, 0.002, 0.28);
    o.connect(g).connect(musicBus);
    o.start(t);
    o.stop(t + 0.35);
  }

  private snare(t: number) {
    const n = noiseSource(t, 0.25);
    const f = ctx.createBiquadFilter();
    f.type = "bandpass";
    f.frequency.value = 1800;
    const g = ctx.createGain();
    env(g, t, 0.55, 0.002, 0.18);
    n.connect(f).connect(g).connect(musicBus);
    const o = ctx.createOscillator();
    const og = ctx.createGain();
    o.frequency.value = 190;
    env(og, t, 0.3, 0.002, 0.08);
    o.connect(og).connect(musicBus);
    o.start(t);
    o.stop(t + 0.12);
  }

  private hat(t: number, vol: number, open: boolean) {
    const n = noiseSource(t, open ? 0.2 : 0.06);
    const f = ctx.createBiquadFilter();
    f.type = "highpass";
    f.frequency.value = 7500;
    const g = ctx.createGain();
    env(g, t, vol, 0.001, open ? 0.15 : 0.04);
    n.connect(f).connect(g).connect(musicBus);
  }

  private crash(t: number) {
    const n = noiseSource(t, 1.4);
    const f = ctx.createBiquadFilter();
    f.type = "highpass";
    f.frequency.value = 4000;
    const g = ctx.createGain();
    env(g, t, 0.25, 0.002, 1.2);
    n.connect(f).connect(g).connect(musicBus);
  }

  private bass(t: number, semi: number, vol: number) {
    const o = ctx.createOscillator();
    o.type = "sawtooth";
    o.frequency.value = (this.root / 2) * this.octave * Math.pow(2, semi / 12);
    const f = ctx.createBiquadFilter();
    f.type = "lowpass";
    f.frequency.setValueAtTime(900, t);
    f.frequency.exponentialRampToValueAtTime(120, t + 0.2);
    const g = ctx.createGain();
    env(g, t, vol, 0.005, this.spb * 0.45);
    o.connect(f).connect(g).connect(musicBus);
    o.start(t);
    o.stop(t + this.spb * 0.5);
  }

  private lead(t: number, semi: number) {
    const o = ctx.createOscillator();
    o.type = "square";
    o.frequency.value = this.root * 2 * this.octave * Math.pow(2, semi / 12);
    const f = ctx.createBiquadFilter();
    f.type = "lowpass";
    f.frequency.value = 2400;
    const g = ctx.createGain();
    env(g, t, 0.07, 0.004, this.spb * 0.2);
    o.connect(f).connect(g).connect(musicBus);
    o.start(t);
    o.stop(t + this.spb * 0.3);
  }
}
