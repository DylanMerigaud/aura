// Shared AudioContext, master bus with a limiter, and a reusable white noise buffer.

export let ctx: AudioContext;
export let master: GainNode;
export let musicBus: GainNode;
export let sfxBus: GainNode;
export let noise: AudioBuffer;

export function initAudio(): AudioContext {
  if (ctx) return ctx;
  ctx = new AudioContext({ latencyHint: "interactive" });
  const comp = ctx.createDynamicsCompressor();
  comp.threshold.value = -10;
  comp.ratio.value = 8;
  master = ctx.createGain();
  master.gain.value = 0.9;
  master.connect(comp).connect(ctx.destination);
  musicBus = ctx.createGain();
  musicBus.gain.value = 0.7;
  musicBus.connect(master);
  sfxBus = ctx.createGain();
  sfxBus.connect(master);
  noise = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
  const d = noise.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  return ctx;
}

/** A one-shot envelope: attack to `peak` then exponential decay to silence. */
export function env(g: GainNode, t: number, peak: number, attack: number, decay: number) {
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(peak, t + attack);
  g.gain.exponentialRampToValueAtTime(0.0001, t + attack + decay);
}

export function noiseSource(t: number, dur: number): AudioBufferSourceNode {
  const s = ctx.createBufferSource();
  s.buffer = noise;
  s.loop = true;
  s.start(t, Math.random() * 1.5);
  s.stop(t + dur);
  return s;
}
