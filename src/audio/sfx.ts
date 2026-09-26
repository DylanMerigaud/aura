// Synthesized QTE sound effects: whoosh, snap, thud, charge, boom, record scratch, cheers and boos.
import { ctx, env, noiseSource, sfxBus } from "./engine";

function tone(type: OscillatorType, f0: number, f1: number, t: number, dur: number, vol: number) {
  const o = ctx.createOscillator();
  o.type = type;
  o.frequency.setValueAtTime(f0, t);
  o.frequency.exponentialRampToValueAtTime(f1, t + dur);
  const g = ctx.createGain();
  env(g, t, vol, 0.004, dur);
  o.connect(g).connect(sfxBus);
  o.start(t);
  o.stop(t + dur + 0.05);
}

function band(t: number, dur: number, f0: number, f1: number, vol: number, q = 1) {
  const n = noiseSource(t, dur + 0.05);
  const f = ctx.createBiquadFilter();
  f.type = "bandpass";
  f.Q.value = q;
  f.frequency.setValueAtTime(f0, t);
  f.frequency.exponentialRampToValueAtTime(f1, t + dur);
  const g = ctx.createGain();
  env(g, t, vol, dur * 0.4, dur * 0.6);
  n.connect(f).connect(g).connect(sfxBus);
}

const now = () => ctx.currentTime;

export const sfx = {
  whoosh(t = now()) { band(t, 0.35, 400, 3000, 0.25, 2); },
  snap(t = now()) {
    band(t, 0.05, 3500, 5000, 0.9, 3);
    tone("triangle", 1760, 880, t, 0.12, 0.35);
  },
  great(t = now()) { tone("triangle", 1320, 990, t, 0.1, 0.3); band(t, 0.04, 3000, 4000, 0.5, 3); },
  ok(t = now()) { tone("sine", 880, 700, t, 0.09, 0.25); },
  thud(t = now()) {
    tone("sine", 120, 40, t, 0.25, 0.9);
    band(t, 0.12, 300, 120, 0.5, 1);
  },
  boom(t = now(), size = 1) {
    tone("sine", 90, 28, t, 0.9 + size * 0.4, 1.0);
    band(t, 1.2, 1800, 80, 0.9 * Math.min(1.5, size), 0.7);
    tone("sawtooth", 220, 55, t, 0.5, 0.25);
  },
  scratch(t = now()) {
    const o = ctx.createOscillator();
    o.type = "sawtooth";
    o.frequency.setValueAtTime(600, t);
    o.frequency.linearRampToValueAtTime(180, t + 0.12);
    o.frequency.linearRampToValueAtTime(700, t + 0.2);
    o.frequency.linearRampToValueAtTime(90, t + 0.38);
    const f = ctx.createBiquadFilter();
    f.type = "bandpass";
    f.frequency.value = 900;
    const g = ctx.createGain();
    env(g, t, 0.5, 0.005, 0.4);
    o.connect(f).connect(g).connect(sfxBus);
    o.start(t);
    o.stop(t + 0.45);
  },
  tick(t = now(), hi = false) { tone("square", hi ? 1600 : 1000, hi ? 1500 : 950, t, 0.03, 0.15); },
  /** Rising charge tone during a MASH; returns a handle to feed the mash count and stop. */
  charge() {
    const t = now();
    const o = ctx.createOscillator();
    o.type = "sawtooth";
    o.frequency.value = 110;
    const o2 = ctx.createOscillator();
    o2.type = "square";
    o2.frequency.value = 111.5;
    const f = ctx.createBiquadFilter();
    f.type = "lowpass";
    f.frequency.value = 600;
    f.Q.value = 6;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.18, t + 0.2);
    o.connect(f);
    o2.connect(f);
    f.connect(g).connect(sfxBus);
    o.start(t);
    o2.start(t);
    return {
      set(level: number) {
        const k = Math.min(1, level);
        const tt = ctx.currentTime;
        o.frequency.setTargetAtTime(110 + k * 660, tt, 0.05);
        o2.frequency.setTargetAtTime(111.5 + k * 670, tt, 0.05);
        f.frequency.setTargetAtTime(600 + k * 4000, tt, 0.05);
      },
      stop() {
        const tt = ctx.currentTime;
        g.gain.cancelScheduledValues(tt);
        g.gain.setTargetAtTime(0.0001, tt, 0.03);
        o.stop(tt + 0.2);
        o2.stop(tt + 0.2);
      },
    };
  },
};
