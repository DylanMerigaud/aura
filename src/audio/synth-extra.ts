// Extra synthesized one shots for the v2 audio layers: tonal hits sfx.ts does not cover. Web Audio only,
// no sample files (copyright rule), tiny node graphs created per call.
import { ctx, env, noiseSource, master, sfxBus } from "./engine";

const now = () => ctx.currentTime;

/** A short bell-like chime (a soft stack of sine partials), pitch nudged by `pitch` (jitter multiplier). */
export function chime(t = now(), vol = 0.2, pitch = 1) {
  for (const [f, v] of [[1760, 1], [2637, 0.5], [3520, 0.3]] as const) {
    const o = ctx.createOscillator();
    o.type = "sine";
    o.frequency.value = f * pitch;
    const g = ctx.createGain();
    env(g, t, vol * v, 0.005, 0.35);
    o.connect(g).connect(sfxBus);
    o.start(t);
    o.stop(t + 0.4);
  }
}

/** A handful of high, fast grains trailing after a Perfect. */
export function sparkleTail(t = now()) {
  for (let i = 0; i < 5; i++) {
    const dt = t + i * 0.03 + Math.random() * 0.01;
    const o = ctx.createOscillator();
    o.type = "triangle";
    o.frequency.value = 3000 + Math.random() * 2500;
    const g = ctx.createGain();
    env(g, dt, 0.08, 0.002, 0.09);
    o.connect(g).connect(sfxBus);
    o.start(dt);
    o.stop(dt + 0.12);
  }
}

/** A rising tick during a MASH, pitch climbing with the alternation count. */
export function mashTick(t = now(), count = 0, pitch = 1) {
  const o = ctx.createOscillator();
  o.type = "square";
  o.frequency.value = Math.min(1800, 500 + count * 45) * pitch;
  const g = ctx.createGain();
  env(g, t, 0.14, 0.002, 0.04);
  o.connect(g).connect(sfxBus);
  o.start(t);
  o.stop(t + 0.06);
}

/** A short bright stab for a taunt. */
export function sting(t = now(), pitch = 1) {
  for (const semi of [0, 4, 7]) {
    const o = ctx.createOscillator();
    o.type = "sawtooth";
    o.frequency.value = 220 * Math.pow(2, semi / 12) * pitch;
    const g = ctx.createGain();
    env(g, t, 0.18, 0.004, 0.12);
    o.connect(g).connect(sfxBus);
    o.start(t);
    o.stop(t + 0.16);
  }
}

/** A sub sine drop under a MASH release burst, sized 0..2. */
export function subDrop(t = now(), size = 1) {
  const o = ctx.createOscillator();
  o.type = "sine";
  o.frequency.setValueAtTime(160, t);
  o.frequency.exponentialRampToValueAtTime(35, t + 0.35);
  const g = ctx.createGain();
  env(g, t, Math.min(1, 0.5 + size * 0.4), 0.003, 0.4);
  o.connect(g).connect(sfxBus);
  o.start(t);
  o.stop(t + 0.45);
}

/** A short bandpassed noise swell, layered under a release. */
export function noiseBurst(t = now(), dur = 0.3) {
  const n = noiseSource(t, dur + 0.05);
  const f = ctx.createBiquadFilter();
  f.type = "bandpass";
  f.Q.value = 1.2;
  f.frequency.setValueAtTime(200, t);
  f.frequency.exponentialRampToValueAtTime(2500, t + dur);
  const g = ctx.createGain();
  env(g, t, 0.4, dur * 0.3, dur * 0.7);
  n.connect(f).connect(g).connect(sfxBus);
}

/** A descending sweep for the boss phase 2 drop (the music drops an octave, camera goes handheld). */
export function downlifter(t = now()) {
  const o = ctx.createOscillator();
  o.type = "sawtooth";
  o.frequency.setValueAtTime(500, t);
  o.frequency.exponentialRampToValueAtTime(60, t + 0.6);
  const f = ctx.createBiquadFilter();
  f.type = "lowpass";
  f.frequency.setValueAtTime(3000, t);
  f.frequency.exponentialRampToValueAtTime(200, t + 0.6);
  const g = ctx.createGain();
  env(g, t, 0.35, 0.01, 0.6);
  o.connect(f).connect(g).connect(sfxBus);
  o.start(t);
  o.stop(t + 0.65);
}

/** A soft crowd groan for a cringe: noise through two low vowel bandpasses, no pitched "boo" drop. */
export function crowdOoh(t = now()) {
  const n = noiseSource(t, 0.6);
  const f1 = ctx.createBiquadFilter();
  f1.type = "bandpass";
  f1.frequency.setValueAtTime(500, t);
  f1.frequency.linearRampToValueAtTime(350, t + 0.5);
  f1.Q.value = 4;
  const f2 = ctx.createBiquadFilter();
  f2.type = "bandpass";
  f2.frequency.value = 900;
  f2.Q.value = 5;
  const g = ctx.createGain();
  env(g, t, 0.22, 0.05, 0.5);
  n.connect(f1).connect(g);
  n.connect(f2).connect(g);
  g.connect(master);
}

/** A short low thump for the count in kick. */
export function countKick(t = now()) {
  const o = ctx.createOscillator();
  o.frequency.setValueAtTime(130, t);
  o.frequency.exponentialRampToValueAtTime(45, t + 0.1);
  const g = ctx.createGain();
  env(g, t, 0.6, 0.002, 0.14);
  o.connect(g).connect(sfxBus);
  o.start(t);
  o.stop(t + 0.16);
}

/** A short rising chirp for the count in, brighter as `n` counts down to 1. */
export function riserTick(t = now(), n = 4) {
  const f = 550 + (4 - n) * 180;
  const o = ctx.createOscillator();
  o.type = "triangle";
  o.frequency.setValueAtTime(f, t);
  o.frequency.exponentialRampToValueAtTime(f * 1.6, t + 0.08);
  const g = ctx.createGain();
  env(g, t, 0.16, 0.003, 0.09);
  o.connect(g).connect(sfxBus);
  o.start(t);
  o.stop(t + 0.12);
}
