// Synthesized pack sounds (Web Audio, no files): the tear, a rising tone per flip, the big rarity hits.
import { RARITY_STYLE, type Rarity } from "./catalog";

// One context for every opening when the game does not pass its own: browsers cap live contexts.
let shared: AudioContext | null = null;

export class PackSound {
  private ctx: AudioContext | null;
  private out: GainNode | null = null;
  private noise: AudioBuffer | null = null;

  constructor(ctx?: AudioContext | null) {
    this.ctx = ctx ?? shared;
  }

  /** Call inside a user gesture: creates or resumes the context. Silent if Web Audio is missing. */
  unlock(): void {
    try {
      if (!this.ctx) {
        const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
        if (!AC) return;
        this.ctx = shared = new AC();
      }
      if (this.ctx.state === "suspended") void this.ctx.resume();
      if (!this.out) {
        this.out = this.ctx.createGain();
        this.out.gain.value = 0.55;
        this.out.connect(this.ctx.destination);
      }
    } catch {
      this.ctx = null;
    }
  }

  private noiseBuffer(ac: AudioContext): AudioBuffer {
    if (this.noise) return this.noise;
    const b = ac.createBuffer(1, ac.sampleRate, ac.sampleRate);
    const d = b.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    return (this.noise = b);
  }

  private tone(freq: number, at: number, dur: number, type: OscillatorType, peak: number, glideTo?: number): void {
    const ac = this.ctx!;
    const o = ac.createOscillator();
    const g = ac.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, at);
    if (glideTo) o.frequency.exponentialRampToValueAtTime(glideTo, at + dur);
    g.gain.setValueAtTime(0.0001, at);
    g.gain.exponentialRampToValueAtTime(peak, at + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, at + dur);
    o.connect(g).connect(this.out!);
    o.start(at);
    o.stop(at + dur + 0.02);
  }

  private hiss(at: number, dur: number, from: number, to: number, peak: number): void {
    const ac = this.ctx!;
    const s = ac.createBufferSource();
    s.buffer = this.noiseBuffer(ac);
    const f = ac.createBiquadFilter();
    f.type = "bandpass";
    f.Q.value = 1.2;
    f.frequency.setValueAtTime(from, at);
    f.frequency.exponentialRampToValueAtTime(to, at + dur);
    const g = ac.createGain();
    g.gain.setValueAtTime(0.0001, at);
    g.gain.exponentialRampToValueAtTime(peak, at + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, at + dur);
    s.connect(f).connect(g).connect(this.out!);
    s.start(at);
    s.stop(at + dur + 0.02);
  }

  private ready(): boolean {
    return !!this.ctx && !!this.out;
  }

  /** The pack idles: a soft shimmer so the screen is never silent before the tap. */
  shimmer(): void {
    if (!this.ready()) return;
    const t = this.ctx!.currentTime;
    this.tone(1318, t, 0.5, "sine", 0.05);
    this.tone(1760, t + 0.07, 0.45, "sine", 0.035);
  }

  tear(): void {
    if (!this.ready()) return;
    const t = this.ctx!.currentTime;
    this.hiss(t, 0.35, 900, 7000, 0.6);
    this.tone(110, t, 0.4, "sine", 0.7, 45);
    this.tone(660, t + 0.02, 0.25, "triangle", 0.18, 1320);
  }

  /** Card i of n: the pitch climbs with the index and jumps with the rarity. */
  flip(rarity: Rarity, index: number): void {
    if (!this.ready()) return;
    const t = this.ctx!.currentTime;
    const base = RARITY_STYLE[rarity].tone * Math.pow(2, index / 6);
    this.hiss(t, 0.12, 3000, 9000, 0.12);
    this.tone(base, t, 0.35, "triangle", 0.3);
    this.tone(base * 1.5, t + 0.06, 0.4, "sine", 0.16);
    if (rarity === "epic" || rarity === "legendary" || rarity === "unfathomable") {
      this.tone(base * 2, t + 0.12, 0.7, "sine", 0.18);
      this.tone(base / 2, t, 0.8, "sawtooth", 0.08);
    }
  }

  /** The 1 percent: a boom, a rising chord and a white noise swell. */
  unfathomable(): void {
    if (!this.ready()) return;
    const t = this.ctx!.currentTime;
    this.tone(70, t, 1.4, "sine", 0.9, 30);
    this.hiss(t, 1.6, 400, 12000, 0.5);
    for (const [i, f] of [523, 659, 784, 1047, 1319].entries()) this.tone(f, t + 0.08 * i, 1.6, "sawtooth", 0.07);
  }

  newTag(): void {
    if (!this.ready()) return;
    const t = this.ctx!.currentTime;
    this.tone(1568, t, 0.12, "square", 0.06);
    this.tone(2093, t + 0.07, 0.16, "square", 0.05);
  }

  close(): void {
    if (!this.ready()) return;
    const t = this.ctx!.currentTime;
    this.hiss(t, 0.25, 6000, 800, 0.15);
  }
}
