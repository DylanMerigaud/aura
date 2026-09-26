// Gen Z SFX recipes: every sound is synthesized here from oscillators and seeded noise, no sample file and no
// copyrighted clip anywhere. One pure function per slot, (ctx, dest, opts) => scheduled duration in seconds.
// Pure: no module state is read or written and every random draw comes from opts.seed, so the same call on
// the same context renders the same samples (the offline tests and scripts/render-sfx.ts rely on that).
// Each slot reproduces an entry of docs/genz-canon-2026.md section 1, mapped in SLOTS below and docs/sfx.md.
// This module never imports src/audio: the game hands it a context and a destination (see ./index.ts).

export interface RecipeOpts {
  /** Level tempo in BPM, read by levelStart, auraRelease and victory. Default 120, clamped to 60..200. */
  bpm?: number;
  /** Seed for every random draw (pitch variation, noise, grains, crowd voices). Default: a fresh random seed. */
  seed?: number;
  /** Random pitch variation per call, as a fraction of the pitch. Default 0.03 (3 percent), clamped to 0..0.25. */
  variation?: number;
  /** Start offset in seconds after ctx.currentTime. Default 0. */
  at?: number;
  /** mashCharge only: how far into the mash, 0 to 1. Each call pitches up with it. */
  step?: number;
  /** tick only: the accented click (the first beat of the count in). */
  accent?: boolean;
}

/** A slot recipe: schedules its nodes on ctx, connected to dest, and returns the scheduled duration in seconds. */
export type Recipe = (ctx: BaseAudioContext, dest: AudioNode, opts?: RecipeOpts) => number;

// ---------------------------------------------------------------- shared building blocks (all pure)

const EPS = 1e-4;
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
const semi = (n: number) => Math.pow(2, n / 12);

/** mulberry32: a tiny seeded PRNG, uniform in [0, 1). */
export function seeded(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** The pitch multiplier of one call: 1 plus or minus `variation`, drawn from `rand`. */
export function pitchFactor(rand: () => number, variation = 0.03): number {
  return 1 + (rand() * 2 - 1) * clamp(variation, 0, 0.25);
}

interface Kit {
  ctx: BaseAudioContext;
  /** The recipe's own output gain, connected to dest. */
  out: GainNode;
  /** Absolute start time on the context clock. */
  t: number;
  rng: () => number;
  /** Pitch multiplier of this call (the 3 percent variation). */
  p: number;
  bpm: number;
  /** Seconds per beat at bpm. */
  spb: number;
}

function kit(ctx: BaseAudioContext, dest: AudioNode, opts: RecipeOpts, level: number): Kit {
  const rng = seeded(opts.seed ?? Math.floor(Math.random() * 4294967296));
  const p = pitchFactor(rng, opts.variation ?? 0.03);
  const bpm = clamp(opts.bpm ?? 120, 60, 200);
  const out = ctx.createGain();
  out.gain.value = level;
  out.connect(dest);
  return { ctx, out, t: ctx.currentTime + Math.max(0, opts.at ?? 0), rng, p, bpm, spb: 60 / bpm };
}

/** A gain node shaped as linear attack to `peak`, hold, then exponential decay to silence; connected to `to`. */
function envGain(k: Kit, t: number, peak: number, attack: number, hold: number, decay: number, to: AudioNode = k.out): GainNode {
  const g = k.ctx.createGain();
  const a = g.gain;
  const top = Math.max(peak, EPS * 2);
  a.setValueAtTime(0, t);
  a.linearRampToValueAtTime(top, t + attack);
  a.setValueAtTime(top, t + attack + hold);
  a.exponentialRampToValueAtTime(EPS, t + attack + hold + decay);
  a.setValueAtTime(0, t + attack + hold + decay);
  g.connect(to);
  return g;
}

interface ToneSpec {
  type?: OscillatorType;
  /** Start frequency in Hz. */
  f: number;
  /** Glide target in Hz, reached `glide` seconds after the start (exponential). */
  to?: number;
  glide?: number;
  t: number;
  /** Total length: attack + hold + decay. */
  dur: number;
  peak: number;
  attack?: number;
  hold?: number;
  /** Detune in cents. */
  detune?: number;
  dest?: AudioNode;
}

/** One oscillator through its own envelope. Returns the oscillator so a caller can add pitch automation. */
function tone(k: Kit, s: ToneSpec): OscillatorNode {
  const o = k.ctx.createOscillator();
  o.type = s.type ?? "sine";
  o.frequency.setValueAtTime(s.f, s.t);
  if (s.to !== undefined) o.frequency.exponentialRampToValueAtTime(s.to, s.t + (s.glide ?? s.dur));
  if (s.detune) o.detune.value = s.detune;
  const attack = s.attack ?? 0.003;
  const hold = s.hold ?? 0;
  const g = envGain(k, s.t, s.peak, attack, hold, Math.max(0.005, s.dur - attack - hold), s.dest ?? k.out);
  o.connect(g);
  o.start(s.t);
  o.stop(s.t + s.dur + 0.01);
  return o;
}

/** White noise drawn from the call's seed, `dur` seconds long, started at `t` into `to`. */
function noise(k: Kit, t: number, dur: number, to: AudioNode): AudioBufferSourceNode {
  const n = Math.max(1, Math.ceil(dur * k.ctx.sampleRate));
  const buf = k.ctx.createBuffer(1, n, k.ctx.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < n; i++) d[i] = k.rng() * 2 - 1;
  const s = k.ctx.createBufferSource();
  s.buffer = buf;
  s.connect(to);
  s.start(t);
  s.stop(t + dur);
  return s;
}

function biquad(k: Kit, type: BiquadFilterType, freq: number, q: number, to: AudioNode): BiquadFilterNode {
  const f = k.ctx.createBiquadFilter();
  f.type = type;
  f.frequency.value = freq;
  f.Q.value = q;
  f.connect(to);
  return f;
}

/** tanh saturation normalized so a full scale input still peaks at 1. */
function shaper(k: Kit, drive: number, to: AudioNode): WaveShaperNode {
  const n = 1024;
  const curve = new Float32Array(n);
  const norm = Math.tanh(drive);
  for (let i = 0; i < n; i++) {
    const x = (i / (n - 1)) * 2 - 1;
    curve[i] = Math.tanh(drive * x) / norm;
  }
  const w = k.ctx.createWaveShaper();
  w.curve = curve;
  w.oversample = "2x";
  w.connect(to);
  return w;
}

/** A few discrete early reflections (a bounded "tiny reverb"): src -> delay -> gain -> out, per tap. */
function taps(k: Kit, src: AudioNode, list: ReadonlyArray<readonly [number, number]>) {
  for (const [delay, gain] of list) {
    const d = k.ctx.createDelay(1);
    d.delayTime.value = delay;
    const g = k.ctx.createGain();
    g.gain.value = gain;
    src.connect(d).connect(g).connect(k.out);
  }
}

/** Piecewise linear automation: [offset seconds, value] pairs from `t`. */
function contour(param: AudioParam, t: number, points: ReadonlyArray<readonly [number, number]>) {
  param.setValueAtTime(points[0][1], t + points[0][0]);
  for (const [dt, v] of points.slice(1)) param.linearRampToValueAtTime(v, t + dt);
}

/** A soft sine bell: fundamental plus two quieter harmonics that die faster. */
function bell(k: Kit, f: number, t: number, dur: number, peak: number, to: AudioNode) {
  tone(k, { f, t, dur, peak, attack: 0.006, dest: to });
  tone(k, { f: f * 2, t, dur: dur * 0.5, peak: peak * 0.22, attack: 0.004, dest: to });
  tone(k, { f: f * 3, t, dur: dur * 0.3, peak: peak * 0.08, attack: 0.003, dest: to });
}

/** A tamborzao style kick: a sine that drops fast from 170 Hz to 48 Hz. */
function kick(k: Kit, t: number, peak: number, decay: number, to: AudioNode = k.out) {
  tone(k, { f: 170 * k.p, to: 48 * k.p, glide: 0.06, t, dur: decay, peak, attack: 0.001, dest: to });
}

/** A hand drum "tak": a short bandpassed noise burst around 1 kHz (the slit drum recipe, canon entry 3). */
function tak(k: Kit, t: number, peak: number, to: AudioNode = k.out) {
  const g = envGain(k, t, peak, 0.001, 0.004, 0.03, to);
  noise(k, t, 0.04, biquad(k, "bandpass", 1000 * k.p, 1.6, g));
}

// ---------------------------------------------------------------- pure helpers the tests read directly

/** mashCharge base pitch: 220 Hz at step 0 up two octaves to 880 Hz at step 1 (a semitone per 1/24 step). */
export function mashPitch(step: number): number {
  return 220 * Math.pow(2, 2 * clamp(step, 0, 1));
}

/**
 * levelStart roll hit offsets in seconds: 16th notes at `bpm` that accelerate across one bar (each gap shrinks
 * linearly with the position in the bar, down to 40 percent of a 16th by the downbeat).
 */
export function rollHits(bpm = 120): number[] {
  const spb = 60 / clamp(bpm, 60, 200);
  const bar = 4 * spb;
  const hits: number[] = [];
  for (let x = 0; x < bar - 1e-9; x += (spb / 4) * (1 - 0.6 * (x / bar))) hits.push(x);
  return hits;
}

/** The victory fanfare: an original six note line (semitones over the root, length in beats), one bar long. */
export const FANFARE = {
  semis: [0, 4, 7, 9, 11, 12],
  beats: [0.5, 0.5, 0.5, 0.25, 0.25, 2],
} as const;

// ---------------------------------------------------------------- the slots

/** Two tone notification chime: sine 1046 Hz then 1318 Hz, fast decay, 60 ms (canon 24). */
export const menuMove: Recipe = (ctx, dest, opts = {}) => {
  const k = kit(ctx, dest, opts, 1);
  tone(k, { f: 1046.5 * k.p, t: k.t, dur: 0.034, peak: 0.42, attack: 0.002 });
  tone(k, { f: 1318.5 * k.p, t: k.t + 0.026, dur: 0.034, peak: 0.42, attack: 0.002 });
  return 0.06;
};

/** A click, then a short rising triangle sweep an octave and a fifth up. */
export const menuConfirm: Recipe = (ctx, dest, opts = {}) => {
  const k = kit(ctx, dest, opts, 0.6);
  const click = envGain(k, k.t, 0.5, 0.0005, 0.001, 0.006);
  noise(k, k.t, 0.01, biquad(k, "highpass", 2500, 0.7, click));
  const t = k.t + 0.004;
  tone(k, { type: "triangle", f: 520 * k.p, to: 1560 * k.p, glide: 0.11, t, dur: 0.15, peak: 0.36, attack: 0.008, hold: 0.07 });
  tone(k, { f: 1040 * k.p, to: 3120 * k.p, glide: 0.11, t, dur: 0.12, peak: 0.1, attack: 0.008, hold: 0.04 });
  return 0.16;
};

/** A descending two tone (a fourth down), triangle through a closed lowpass so it lands dull. */
export const menuCancel: Recipe = (ctx, dest, opts = {}) => {
  const k = kit(ctx, dest, opts, 0.5);
  const lp = biquad(k, "lowpass", 1100, 0.5, k.out);
  tone(k, { type: "triangle", f: 587.3 * k.p, t: k.t, dur: 0.09, peak: 0.55, attack: 0.004, hold: 0.03, dest: lp });
  tone(k, { type: "triangle", f: 440 * k.p, t: k.t + 0.075, dur: 0.11, peak: 0.55, attack: 0.004, hold: 0.03, dest: lp });
  return 0.19;
};

/** One bar of tamborzao kicks in accelerating 16ths over a noise riser, then an 808 slide 110 to 55 Hz. */
export const levelStart: Recipe = (ctx, dest, opts = {}) => {
  const k = kit(ctx, dest, opts, 0.62);
  const bar = 4 * k.spb;
  // Riser bed under the roll: bandpassed noise opening from 300 Hz to 3.5 kHz, swelling to the downbeat.
  const bed = k.ctx.createGain();
  bed.gain.setValueAtTime(0.05, k.t);
  bed.gain.linearRampToValueAtTime(0.22, k.t + bar);
  bed.gain.linearRampToValueAtTime(0, k.t + bar + 0.05);
  bed.connect(k.out);
  const sweep = biquad(k, "bandpass", 300, 1.2, bed);
  sweep.frequency.setValueAtTime(300, k.t);
  sweep.frequency.exponentialRampToValueAtTime(3500, k.t + bar);
  noise(k, k.t, bar + 0.06, sweep);
  // The roll: a 3+3+2 accent grouping on the hit index, velocity rising toward the downbeat.
  rollHits(k.bpm).forEach((x, i) => {
    const vel = 0.45 + 0.45 * (x / bar);
    const accent = i % 8 === 0 || i % 8 === 3 || i % 8 === 6;
    kick(k, k.t + x, (accent ? 1 : 0.55) * vel, 0.09);
    tak(k, k.t + x, (accent ? 0.35 : 0.55) * vel);
  });
  // The downbeat: a full kick, then the 808 slide driven into saturation so a phone speaker still hears it.
  const down = k.t + bar;
  kick(k, down, 0.9, 0.2);
  const g = envGain(k, down, 0.6, 0.004, 0.12, 0.476);
  const sat = shaper(k, 2.5, biquad(k, "lowpass", 2500, 0.7, g));
  const o = k.ctx.createOscillator();
  o.frequency.setValueAtTime(110 * k.p, down);
  o.frequency.exponentialRampToValueAtTime(55 * k.p, down + 0.4);
  o.connect(sat);
  o.start(down);
  o.stop(down + 0.61);
  return bar + 0.6;
};

/** The "+aura" ding: 880 Hz then a major third up, bell partials, two reflections, a sparkle noise tail (canon 9). */
export const perfect: Recipe = (ctx, dest, opts = {}) => {
  const k = kit(ctx, dest, opts, 1);
  const dry = k.ctx.createGain();
  dry.connect(k.out);
  taps(k, dry, [[0.05, 0.28], [0.11, 0.14]]);
  bell(k, 880 * k.p, k.t, 0.32, 0.36, dry);
  bell(k, 880 * semi(4) * k.p, k.t + 0.08, 0.4, 0.4, dry);
  // Sparkle: a highpassed noise tail plus a few seeded high grains.
  const air = envGain(k, k.t + 0.08, 0.1, 0.02, 0.05, 0.3);
  noise(k, k.t + 0.08, 0.38, biquad(k, "highpass", 6500, 0.7, air));
  for (let i = 0; i < 6; i++) {
    const t = k.t + 0.1 + i * 0.045 + k.rng() * 0.015;
    tone(k, { type: "triangle", f: 3000 + k.rng() * 3500, t, dur: 0.06, peak: 0.06, attack: 0.002 });
  }
  return 0.6;
};

/** A lighter ding: the same major third a step lower, faster, one reflection, no sparkle. */
export const great: Recipe = (ctx, dest, opts = {}) => {
  const k = kit(ctx, dest, opts, 1);
  const dry = k.ctx.createGain();
  dry.connect(k.out);
  taps(k, dry, [[0.05, 0.2]]);
  bell(k, 784 * k.p, k.t, 0.25, 0.34, dry);
  bell(k, 784 * semi(4) * k.p, k.t + 0.06, 0.28, 0.36, dry);
  return 0.4;
};

/** A soft single blip: a triangle at 660 Hz with a faint octave, short. */
export const ok: Recipe = (ctx, dest, opts = {}) => {
  const k = kit(ctx, dest, opts, 1);
  tone(k, { type: "triangle", f: 660 * k.p, t: k.t, dur: 0.14, peak: 0.34, attack: 0.004 });
  tone(k, { f: 1320 * k.p, t: k.t, dur: 0.06, peak: 0.06, attack: 0.002 });
  return 0.15;
};

/** Record scratch (noise and a sawtooth sharing one back and forth pitch gesture) plus a low thud (canon 8). */
export const missCringe: Recipe = (ctx, dest, opts = {}) => {
  const k = kit(ctx, dest, opts, 1);
  const g = envGain(k, k.t, 0.62, 0.004, 0.3, 0.08);
  const bp = biquad(k, "bandpass", 1800, 5, g);
  contour(bp.frequency, k.t, [[0, 1800 * k.p], [0.1, 500 * k.p], [0.18, 2400 * k.p], [0.36, 300 * k.p]]);
  noise(k, k.t, 0.4, bp);
  const saw = k.ctx.createOscillator();
  saw.type = "sawtooth";
  contour(saw.frequency, k.t, [[0, 420 * k.p], [0.1, 130 * k.p], [0.18, 560 * k.p], [0.36, 70 * k.p]]);
  const sawGain = k.ctx.createGain();
  sawGain.gain.value = 0.35;
  saw.connect(sawGain).connect(bp);
  saw.start(k.t);
  saw.stop(k.t + 0.39);
  // The thud lands just behind the scratch.
  tone(k, { f: 120 * k.p, to: 40 * k.p, glide: 0.2, t: k.t + 0.02, dur: 0.38, peak: 0.6, attack: 0.002 });
  return 0.42;
};

/** One mash step: a rising sawtooth that pitches up with opts.step, over a sub sine that climbs an octave. */
export const mashCharge: Recipe = (ctx, dest, opts = {}) => {
  const k = kit(ctx, dest, opts, 0.55);
  const s = clamp(opts.step ?? 0, 0, 1);
  const f = mashPitch(s) * k.p;
  const lp = biquad(k, "lowpass", 1200 + 5000 * s, 2, k.out);
  tone(k, { type: "sawtooth", f, to: f * semi(4), glide: 0.1, t: k.t, dur: 0.14, peak: 0.26, attack: 0.004, hold: 0.05, dest: lp });
  tone(k, { type: "square", f: f * 1.005, to: f * 1.005 * semi(4), glide: 0.1, t: k.t, dur: 0.14, peak: 0.08, attack: 0.004, hold: 0.05, dest: lp });
  tone(k, { f: 55 * Math.pow(2, s) * k.p, t: k.t, dur: 0.14, peak: 0.42, attack: 0.004, hold: 0.05 });
  return 0.14;
};

/**
 * Sub drop 80 to 30 Hz, a noise burst, and one beat of a gated montagem chop: a synth vowel through two
 * formants, gated in 16ths at the level bpm, alternate slices shifted a few semitones (canon 23).
 */
export const auraRelease: Recipe = (ctx, dest, opts = {}) => {
  const k = kit(ctx, dest, opts, 0.5);
  const beat = k.spb;
  const len = Math.max(beat, 0.5);
  // Sub drop, saturated so its harmonics carry on small speakers.
  const subG = envGain(k, k.t, 0.62, 0.003, len * 0.4, len * 0.6 + 0.1);
  const sub = k.ctx.createOscillator();
  sub.frequency.setValueAtTime(80 * k.p, k.t);
  sub.frequency.exponentialRampToValueAtTime(30 * k.p, k.t + len);
  sub.connect(shaper(k, 3, subG));
  sub.start(k.t);
  sub.stop(k.t + len + 0.12);
  // Noise burst, lowpass closing.
  const nb = envGain(k, k.t, 0.4, 0.004, 0.02, 0.25);
  const lp = biquad(k, "lowpass", 4000, 0.7, nb);
  lp.frequency.setValueAtTime(4000, k.t);
  lp.frequency.exponentialRampToValueAtTime(400, k.t + 0.27);
  noise(k, k.t, 0.3, lp);
  // Gated chop: saw voice -> two parallel formants ("ah") -> gate -> per gate lowpass sweep.
  const sweep = biquad(k, "lowpass", 5000, 1, k.out);
  const gate = k.ctx.createGain();
  gate.gain.value = 0;
  gate.connect(sweep);
  const voice = k.ctx.createOscillator();
  voice.type = "sawtooth";
  for (const [fc, q, v] of [[700, 5, 1], [1150, 6, 0.7]] as const) {
    const bp = k.ctx.createBiquadFilter();
    bp.type = "bandpass";
    bp.frequency.value = fc;
    bp.Q.value = q;
    const vg = k.ctx.createGain();
    vg.gain.value = v;
    voice.connect(bp).connect(vg).connect(gate);
  }
  const g16 = beat / 4;
  [0, 3, -2, 5].forEach((shift, i) => {
    const at = k.t + i * g16;
    voice.frequency.setValueAtTime(233 * semi(shift) * k.p, at);
    gate.gain.setValueAtTime(0, at);
    gate.gain.linearRampToValueAtTime(1.6, at + 0.004);
    gate.gain.setValueAtTime(1.6, at + g16 * 0.65);
    gate.gain.linearRampToValueAtTime(0, at + g16 * 0.8);
    sweep.frequency.setValueAtTime(5000, at);
    sweep.frequency.exponentialRampToValueAtTime(900, at + g16 * 0.8);
  });
  voice.start(k.t);
  voice.stop(k.t + beat);
  return len + 0.12;
};

/** A saturated tamborzao kick plus a distorted 808 slide down a fifth (canon 22). */
export const bigHit: Recipe = (ctx, dest, opts = {}) => {
  const k = kit(ctx, dest, opts, 0.7);
  const bus = k.ctx.createGain();
  bus.gain.value = 0.9;
  bus.connect(shaper(k, 2.2, biquad(k, "lowpass", 5000, 0.7, k.out)));
  kick(k, k.t, 0.8, 0.22, bus);
  tak(k, k.t, 0.5, bus);
  const g808 = envGain(k, k.t + 0.01, 0.75, 0.005, 0.15, 0.455, bus);
  const o = k.ctx.createOscillator();
  o.frequency.setValueAtTime(110 * k.p, k.t + 0.01);
  o.frequency.exponentialRampToValueAtTime(73.4 * k.p, k.t + 0.31);
  o.connect(shaper(k, 4, g808));
  o.start(k.t + 0.01);
  o.stop(k.t + 0.63);
  return 0.62;
};

/** A crowd noise swell through a bandpass at 800 Hz over 700 ms, plus a sawtooth airhorn stab (canon 19, 25). */
export const crowdRoar: Recipe = (ctx, dest, opts = {}) => {
  const k = kit(ctx, dest, opts, 1);
  const swell = k.ctx.createGain();
  swell.gain.setValueAtTime(0, k.t);
  swell.gain.linearRampToValueAtTime(0.7, k.t + 0.3);
  swell.gain.setValueAtTime(0.7, k.t + 0.42);
  swell.gain.exponentialRampToValueAtTime(EPS, k.t + 0.7);
  swell.gain.setValueAtTime(0, k.t + 0.7);
  swell.connect(k.out);
  const bp = biquad(k, "bandpass", 800, 0.9, swell);
  const wobble = k.ctx.createOscillator();
  wobble.frequency.value = 5.5;
  const depth = k.ctx.createGain();
  depth.gain.value = 120;
  wobble.connect(depth).connect(bp.frequency);
  wobble.start(k.t);
  wobble.stop(k.t + 0.72);
  const upper = k.ctx.createGain();
  upper.gain.value = 0.5;
  upper.connect(biquad(k, "bandpass", 1700, 1.5, swell));
  const pink = biquad(k, "lowpass", 3500, 0.7, bp);
  pink.connect(upper);
  noise(k, k.t, 0.72, pink);
  // Airhorn: three detuned saws dropping a fourth over 200 ms, hard driven.
  const at = k.t + 0.12;
  const horn = envGain(k, at, 0.3, 0.005, 0.15, 0.08);
  const drive = shaper(k, 3, biquad(k, "lowpass", 4000, 0.7, horn));
  const hp = biquad(k, "highpass", 250, 0.7, drive);
  for (const cents of [-8, 0, 8]) {
    const o = k.ctx.createOscillator();
    o.type = "sawtooth";
    o.detune.value = cents;
    o.frequency.setValueAtTime(587.3 * k.p, at);
    o.frequency.exponentialRampToValueAtTime(587.3 * 0.75 * k.p, at + 0.2);
    const g = k.ctx.createGain();
    g.gain.value = 0.34;
    o.connect(g).connect(hp);
    o.start(at);
    o.stop(at + 0.245);
  }
  return 0.72;
};

/** A descending "ooh": two vowel formants on noise sliding down, over a few seeded voices gliding down. */
export const crowdOoh: Recipe = (ctx, dest, opts = {}) => {
  const k = kit(ctx, dest, opts, 1.7);
  const body = envGain(k, k.t, 0.55, 0.08, 0.15, 0.47);
  const f1 = biquad(k, "bandpass", 900, 3, body);
  f1.frequency.setValueAtTime(900 * k.p, k.t);
  f1.frequency.exponentialRampToValueAtTime(450 * k.p, k.t + 0.6);
  const f2 = biquad(k, "bandpass", 1500, 4, body);
  f2.frequency.setValueAtTime(1500 * k.p, k.t);
  f2.frequency.exponentialRampToValueAtTime(800 * k.p, k.t + 0.6);
  const src = k.ctx.createGain();
  src.connect(f1);
  src.connect(f2);
  noise(k, k.t, 0.7, src);
  const voices = envGain(k, k.t, 0.2, 0.08, 0.15, 0.47, biquad(k, "lowpass", 900, 0.7, k.out));
  for (let i = 0; i < 7; i++) {
    const f = (180 + k.rng() * 120) * k.p;
    const o = k.ctx.createOscillator();
    o.type = "triangle";
    o.frequency.setValueAtTime(f, k.t);
    o.frequency.exponentialRampToValueAtTime(f * 0.82, k.t + 0.6);
    const g = k.ctx.createGain();
    g.gain.value = 0.18;
    o.connect(g).connect(voices);
    o.start(k.t);
    o.stop(k.t + 0.71);
  }
  return 0.72;
};

/** A brass like voice: three detuned saws through a lowpass that blats open on the attack. */
function brass(k: Kit, f: number, t: number, len: number, peak: number, release: number, to: AudioNode) {
  const g = k.ctx.createGain();
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(peak, t + 0.02);
  g.gain.linearRampToValueAtTime(peak * 0.8, t + 0.1);
  g.gain.setValueAtTime(peak * 0.8, t + len);
  g.gain.exponentialRampToValueAtTime(EPS, t + len + release);
  g.gain.setValueAtTime(0, t + len + release);
  g.connect(to);
  const lp = biquad(k, "lowpass", f * 1.5, 1.5, g);
  lp.frequency.setValueAtTime(f * 1.5, t);
  lp.frequency.exponentialRampToValueAtTime(Math.min(6000, f * 6), t + 0.04);
  lp.frequency.exponentialRampToValueAtTime(Math.min(4000, f * 3.5), t + 0.15);
  for (const cents of [-9, 0, 9]) {
    const o = k.ctx.createOscillator();
    o.type = "sawtooth";
    o.frequency.value = f;
    o.detune.value = cents;
    o.connect(lp);
    o.start(t);
    o.stop(t + len + release + 0.01);
  }
}

/** The original six note fanfare (FANFARE) on detuned saw brass, a held major chord, and a crowd swell (canon 20). */
export const victory: Recipe = (ctx, dest, opts = {}) => {
  const k = kit(ctx, dest, opts, 1.25);
  const spb = 60 / clamp(k.bpm, 80, 160);
  const bar = 4 * spb;
  const release = 0.35;
  const root = 349.23 * k.p; // F4
  const bus = k.ctx.createGain();
  bus.connect(k.out);
  let x = 0;
  FANFARE.semis.forEach((n, i) => {
    const at = k.t + x * spb;
    const len = FANFARE.beats[i] * spb;
    const last = i === FANFARE.semis.length - 1;
    brass(k, root * semi(n), at, last ? len : len + 0.02, 0.11, last ? release : 0.05, bus);
    if (last) for (const c of [4, 7]) brass(k, root * semi(n + c), at, len, 0.07, release, bus);
    if (last) brass(k, root / 2, at, len, 0.08, release, bus);
    x += FANFARE.beats[i];
  });
  // The crowd swells under the whole bar and lets go with the chord.
  const swell = k.ctx.createGain();
  swell.gain.setValueAtTime(0, k.t);
  swell.gain.linearRampToValueAtTime(0.16, k.t + bar);
  swell.gain.exponentialRampToValueAtTime(EPS, k.t + bar + release);
  swell.gain.setValueAtTime(0, k.t + bar + release);
  swell.connect(k.out);
  noise(k, k.t, bar + release, biquad(k, "bandpass", 900, 0.7, swell));
  return bar + release + 0.05;
};

/** A long 808 slide down an octave over 2 s, saturated, with a lowpass closing from 3 kHz to 120 Hz. */
export const defeat: Recipe = (ctx, dest, opts = {}) => {
  const k = kit(ctx, dest, opts, 0.6);
  const g = k.ctx.createGain();
  g.gain.setValueAtTime(0, k.t);
  g.gain.linearRampToValueAtTime(0.75, k.t + 0.005);
  g.gain.setValueAtTime(0.75, k.t + 0.2);
  g.gain.linearRampToValueAtTime(0.4, k.t + 1.6);
  g.gain.exponentialRampToValueAtTime(EPS, k.t + 2.2);
  g.gain.setValueAtTime(0, k.t + 2.2);
  g.connect(k.out);
  const lp = biquad(k, "lowpass", 3000, 0.8, g);
  lp.frequency.setValueAtTime(3000, k.t);
  lp.frequency.exponentialRampToValueAtTime(120, k.t + 2);
  const sat = shaper(k, 3, lp);
  for (const [type, mult, v] of [["sine", 1, 1], ["triangle", 2, 0.3]] as const) {
    const o = k.ctx.createOscillator();
    o.type = type;
    o.frequency.setValueAtTime(146.83 * mult * k.p, k.t);
    o.frequency.exponentialRampToValueAtTime(73.42 * mult * k.p, k.t + 2);
    const og = k.ctx.createGain();
    og.gain.value = v;
    o.connect(og).connect(sat);
    o.start(k.t);
    o.stop(k.t + 2.21);
  }
  return 2.2;
};

/** A count in click: a shutter like noise transient plus a short square blip, higher when accented. */
export const tick: Recipe = (ctx, dest, opts = {}) => {
  const k = kit(ctx, dest, opts, 1);
  const click = envGain(k, k.t, 0.35, 0.0005, 0.001, 0.004);
  noise(k, k.t, 0.006, biquad(k, "highpass", 3000, 0.7, click));
  tone(k, { type: "square", f: (opts.accent ? 1760 : 1175) * k.p, t: k.t, dur: 0.035, peak: 0.18, attack: 0.001 });
  return 0.04;
};

// ---------------------------------------------------------------- master chain

export interface MasterChain {
  /** Connect the sfx here. */
  input: GainNode;
  compressor: DynamicsCompressorNode;
  clipper: WaveShaperNode;
  output: GainNode;
}

/**
 * Soft clipper transfer curve: unity below `knee`, a tanh bend above it that never passes `ceiling`.
 * The WaveShaper clamps inputs outside -1..1 to the curve ends, so the output peak is bounded by the curve.
 */
export function softClipCurve(knee = 0.6, ceiling = 0.95, n = 2048): Float32Array<ArrayBuffer> {
  const curve = new Float32Array(n);
  const room = ceiling - knee;
  for (let i = 0; i < n; i++) {
    const x = (i / (n - 1)) * 2 - 1;
    const a = Math.abs(x);
    const y = a <= knee ? a : knee + room * Math.tanh((a - knee) / room);
    curve[i] = Math.sign(x) * y;
  }
  return curve;
}

/** input -> compressor -> soft clipper -> output -> dest (default ctx.destination). */
export function applyMaster(ctx: BaseAudioContext, dest: AudioNode = ctx.destination): MasterChain {
  const input = ctx.createGain();
  const compressor = ctx.createDynamicsCompressor();
  compressor.threshold.value = -14;
  compressor.knee.value = 8;
  compressor.ratio.value = 5;
  compressor.attack.value = 0.003;
  compressor.release.value = 0.15;
  const clipper = ctx.createWaveShaper();
  clipper.curve = softClipCurve();
  clipper.oversample = "4x";
  const output = ctx.createGain();
  input.connect(compressor).connect(clipper).connect(output).connect(dest);
  return { input, compressor, clipper, output };
}

// ---------------------------------------------------------------- the slot table

export interface SlotSpec {
  recipe: Recipe;
  /** The recipe in one line. */
  recipeLine: string;
  /** The docs/genz-canon-2026.md section 1 entry it reproduces, and its top 12 game slot when it has one. */
  canon: string;
  /** Allowed scheduled duration in seconds at `bpm` (min, max). */
  duration: (bpm: number) => readonly [number, number];
}

const barOf = (bpm: number) => 240 / clamp(bpm, 60, 200);
const beatOf = (bpm: number) => 60 / clamp(bpm, 60, 200);

export const SLOTS = {
  menuMove: {
    recipe: menuMove,
    recipeLine: "sine 1046 Hz then 1318 Hz, 2 ms attack, fast exponential decay",
    canon: "entry 24, TikTok notification ding (top 12, slot 1 menu move)",
    duration: () => [0.05, 0.1],
  },
  menuConfirm: {
    recipe: menuConfirm,
    recipeLine: "highpassed noise click, then a triangle sweep 520 to 1560 Hz over 110 ms",
    canon: "top 12, slot 2 confirm: the bed under the re-voiced \"lock in\" (entry 17)",
    duration: () => [0.1, 0.25],
  },
  menuCancel: {
    recipe: menuCancel,
    recipeLine: "triangle 587 Hz then 440 Hz (a fourth down) through a 1.1 kHz lowpass",
    canon: "top 12, slot 3 cancel: the bed under the re-voiced \"nah\" (entry 12), the entry 9 loss interval",
    duration: () => [0.1, 0.25],
  },
  levelStart: {
    recipe: levelStart,
    recipeLine: "one bar of tamborzao kicks and noise taks in accelerating 16ths over a noise riser, then an 808 slide 110 to 55 Hz",
    canon: "entries 1 and 22, aura battle drum roll into the phonk 808 (top 12, slot 4 level start)",
    duration: (bpm) => [barOf(bpm) + 0.4, barOf(bpm) + 0.9],
  },
  perfect: {
    recipe: perfect,
    recipeLine: "sine bells 880 Hz then a major third up, two reflections, highpassed noise and high grain sparkle",
    canon: "entry 9, \"+aura\" points ding (top 12, slot 5 perfect hit)",
    duration: () => [0.4, 0.8],
  },
  great: {
    recipe: great,
    recipeLine: "sine bells 784 Hz then a major third up, one reflection, no sparkle",
    canon: "entry 9, the \"+aura\" ding one step down",
    duration: () => [0.25, 0.55],
  },
  ok: {
    recipe: ok,
    recipeLine: "triangle 660 Hz with a faint octave, 140 ms",
    canon: "entry 9, the smallest \"+aura\" tick",
    duration: () => [0.1, 0.25],
  },
  missCringe: {
    recipe: missCringe,
    recipeLine: "record scratch: noise and a sawtooth through a Q5 bandpass sharing a back and forth pitch gesture, then a 120 to 40 Hz thud",
    canon: "entry 8, the \"holy airball\" miss beat, bed under the re-voiced line (top 12, slot 6 miss cringe)",
    duration: () => [0.3, 0.6],
  },
  mashCharge: {
    recipe: mashCharge,
    recipeLine: "sawtooth rising a major third per call, base 220 to 880 Hz with step, over a 55 to 110 Hz sub",
    canon: "entry 6, the escalating \"six... seven!\" chant pitching up each repeat (top 12, slot 7 mash charge)",
    duration: () => [0.08, 0.2],
  },
  auraRelease: {
    recipe: auraRelease,
    recipeLine: "saturated sub drop 80 to 30 Hz, lowpassed noise burst, one beat of 16th gated formant chops",
    canon: "entry 23, montagem vocal chop on the drop (top 12, slot 8 aura release)",
    duration: (bpm) => [beatOf(bpm), Math.max(beatOf(bpm), 0.5) + 0.3],
  },
  bigHit: {
    recipe: bigHit,
    recipeLine: "tamborzao kick and tak plus an 808 sliding 110 to 73 Hz, all through tanh saturation",
    canon: "entry 22, distorted 808 slide plus a hard kick (top 12, slot 9 big hit)",
    duration: () => [0.4, 0.9],
  },
  crowdRoar: {
    recipe: crowdRoar,
    recipeLine: "noise swell through an 800 Hz bandpass over 700 ms, plus a detuned sawtooth airhorn dropping a fourth",
    canon: "entries 19 and 25, the Siuuu roar and airhorn stab (top 12, slot 10 crowd reaction)",
    duration: () => [0.65, 1.0],
  },
  crowdOoh: {
    recipe: crowdOoh,
    recipeLine: "noise through two vowel formants sliding down, over seven seeded triangle voices gliding down",
    canon: "entry 27, the crowd \"ohh\" pitched down for disappointment",
    duration: () => [0.5, 1.0],
  },
  victory: {
    recipe: victory,
    recipeLine: "original six note fanfare on detuned saw brass into a held major chord, crowd swell underneath",
    canon: "entry 20, an original fanfare in the Victory Royale register, never Epic's asset (top 12, slot 11 victory)",
    duration: (bpm) => [(240 / clamp(bpm, 80, 160)) + 0.2, (240 / clamp(bpm, 80, 160)) + 0.6],
  },
  defeat: {
    recipe: defeat,
    recipeLine: "saturated 808 sliding an octave down (147 to 73 Hz) over 2 s, lowpass closing 3 kHz to 120 Hz",
    canon: "entry 22 run as a long sad slide, the bed under \"we're so cooked\" (entry 15) (top 12, slot 12 defeat)",
    duration: () => [2.0, 2.6],
  },
  tick: {
    recipe: tick,
    recipeLine: "highpassed noise transient plus a 35 ms square blip, 1175 Hz or 1760 Hz accented",
    canon: "entry 1, the phone shutter click of the battle crowd, as a count in",
    duration: () => [0.02, 0.08],
  },
} satisfies Record<string, SlotSpec>;

export type Slot = keyof typeof SLOTS;

export const SLOT_NAMES = Object.keys(SLOTS) as Slot[];
