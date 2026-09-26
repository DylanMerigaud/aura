// Synthesized crowd: a looped murmur bed that follows the aura meter, plus cheer and boo one-shots with "hey" blips.
import { ctx, env, master, noiseSource } from "./engine";

let bed: GainNode | null = null;
let bedFilter: BiquadFilterNode;
let bedSrc: AudioBufferSourceNode | null = null;
let blipTimer = 0;
let bedLfo: OscillatorNode | null = null;

export function startCrowd() {
  if (bed) return;
  bed = ctx.createGain();
  bed.gain.value = 0.12;
  bedFilter = ctx.createBiquadFilter();
  bedFilter.type = "bandpass";
  bedFilter.frequency.value = 700;
  bedFilter.Q.value = 0.6;
  const n = noiseSource(ctx.currentTime, 36000);
  bedSrc = n;
  const lfo = ctx.createOscillator();
  lfo.frequency.value = 0.3;
  const lg = ctx.createGain();
  lg.gain.value = 0.04;
  lfo.connect(lg).connect(bed.gain);
  lfo.start();
  bedLfo = lfo;
  n.connect(bedFilter).connect(bed).connect(master);
  // Random voices in the crowd.
  blipTimer = window.setInterval(() => {
    if (!bed) return;
    const t = ctx.currentTime + Math.random() * 0.3;
    voiceBlip(t, 0.03 + intensity * 0.06, 0.5 + Math.random());
  }, 180);
}

let intensity = 0.3;

export function stopCrowd() {
  if (!bed) return;
  clearInterval(blipTimer);
  bed.gain.cancelScheduledValues(ctx.currentTime);
  bed.gain.setTargetAtTime(0, ctx.currentTime, 0.6);
  bedSrc?.stop(ctx.currentTime + 3);
  bedLfo?.stop(ctx.currentTime);
  bedLfo = null;
  bed = null;
  bedSrc = null;
}

/** meter in [-1, 1], player side positive: the crowd gets louder and brighter as the fight swings. */
export function setCrowd(meter: number, hype: number) {
  if (!bed) return;
  intensity = Math.min(1, 0.3 + Math.abs(meter) * 0.4 + hype * 0.5);
  const t = ctx.currentTime;
  bed.gain.setTargetAtTime(0.08 + intensity * 0.22, t, 0.3);
  bedFilter.frequency.setTargetAtTime(500 + intensity * 900, t, 0.3);
}

/** A formant "hey" / "oh" blip: noise through two vowel bandpasses with a pitch-ish rise. */
function voiceBlip(t: number, vol: number, pitch: number) {
  const o = ctx.createOscillator();
  o.type = "sawtooth";
  o.frequency.setValueAtTime(140 * pitch, t);
  o.frequency.linearRampToValueAtTime(200 * pitch, t + 0.12);
  const g = ctx.createGain();
  env(g, t, vol, 0.03, 0.2);
  const f1 = ctx.createBiquadFilter();
  f1.type = "bandpass";
  f1.frequency.value = 650 + Math.random() * 200;
  f1.Q.value = 5;
  const f2 = ctx.createBiquadFilter();
  f2.type = "bandpass";
  f2.frequency.value = 1500 + Math.random() * 500;
  f2.Q.value = 6;
  o.connect(f1).connect(g);
  o.connect(f2).connect(g);
  g.connect(master);
  o.start(t);
  o.stop(t + 0.3);
}

export function cheer(size = 1) {
  const t = ctx.currentTime;
  const n = noiseSource(t, 2.2);
  const f = ctx.createBiquadFilter();
  f.type = "bandpass";
  f.frequency.setValueAtTime(900, t);
  f.frequency.linearRampToValueAtTime(1400, t + 0.5);
  const g = ctx.createGain();
  env(g, t, 0.25 * size, 0.15, 1.8);
  n.connect(f).connect(g).connect(master);
  const count = Math.round(6 + size * 10);
  for (let i = 0; i < count; i++) voiceBlip(t + Math.random() * 0.7, 0.07, 0.9 + Math.random() * 0.9);
}

export function boo() {
  const t = ctx.currentTime;
  for (let i = 0; i < 8; i++) {
    const o = ctx.createOscillator();
    o.type = "sawtooth";
    const p = 90 + Math.random() * 70;
    o.frequency.setValueAtTime(p, t);
    o.frequency.linearRampToValueAtTime(p * 0.8, t + 0.9);
    const f = ctx.createBiquadFilter();
    f.type = "bandpass";
    f.frequency.value = 400;
    f.Q.value = 4;
    const g = ctx.createGain();
    env(g, t + Math.random() * 0.2, 0.05, 0.15, 0.8);
    o.connect(f).connect(g).connect(master);
    o.start(t);
    o.stop(t + 1.3);
  }
}
