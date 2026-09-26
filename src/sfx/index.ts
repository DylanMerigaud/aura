// Game facing entry for the Gen Z SFX: play(slot, opts) schedules one recipe on ctx.currentTime plus an `at`
// offset, and duck(musicGain, ms) is the sidechain dip under a hit. Nothing is preloaded: every call builds its
// own small node graph (and its own seeded noise) at call time. The recipes live in ./recipes.ts.
import { SLOTS, type RecipeOpts, type Slot } from "./recipes";

export * from "./recipes";

interface Output {
  ctx: BaseAudioContext;
  dest: AudioNode;
}

let output: Output | null = null;

/** Where play() sends sounds when a call names no ctx or dest: e.g. useOutput(ctx, sfxBus) once after initAudio(). */
export function useOutput(ctx: BaseAudioContext, dest: AudioNode = ctx.destination) {
  if (dest.context !== ctx) throw new Error("sfx.useOutput: dest belongs to another AudioContext");
  output = { ctx, dest };
}

export interface PlayOpts extends RecipeOpts {
  /** Context to schedule on. Default: the one given to useOutput, or dest's own context. */
  ctx?: BaseAudioContext;
  /** Node to connect to. Default: ctx.destination when ctx is passed, else the useOutput destination. */
  dest?: AudioNode;
}

export interface Played {
  slot: Slot;
  /** Context time the sound starts. */
  start: number;
  /** Context time its scheduled tail ends. */
  end: number;
  /** Scheduled duration in seconds. */
  duration: number;
}

/** Schedule `slot` at ctx.currentTime + opts.at. Throws when no output is known or the slot does not exist. */
export function play(slot: Slot, opts: PlayOpts = {}): Played {
  const spec = SLOTS[slot];
  if (!spec) throw new Error(`sfx.play: unknown slot "${String(slot)}"`);
  const dest = opts.dest ?? (opts.ctx ? opts.ctx.destination : output?.dest);
  const ctx = opts.ctx ?? dest?.context ?? output?.ctx;
  if (!ctx || !dest) throw new Error("sfx.play: no output; call useOutput(ctx, dest) first or pass opts.ctx");
  if (dest.context !== ctx) throw new Error("sfx.play: opts.dest belongs to another AudioContext");
  const start = ctx.currentTime + Math.max(0, opts.at ?? 0);
  const duration = spec.recipe(ctx, dest, opts);
  return { slot, start, end: start + duration, duration };
}

export interface DuckOpts {
  /** Gain multiplier at the bottom of the dip. Default 0.35. */
  depth?: number;
  /** Start offset in seconds after ctx.currentTime. Default 0. */
  at?: number;
  /** Seconds to reach the bottom. Default 0.02. */
  attack?: number;
  /** Resting gain to come back to. Default: the node's value the first time it was ducked. */
  level?: number;
}

/** The last duck scheduled on a param: two linear segments, (t0, v0) to (t1, low) to (t2, base). */
interface DuckState {
  base: number;
  t0: number;
  v0: number;
  t1: number;
  low: number;
  t2: number;
}

const ducks = new WeakMap<AudioParam, DuckState>();

/** The value a previous duck gives its param at `t`, from its two linear segments. */
function duckValueAt(s: DuckState, t: number): number {
  if (t <= s.t0) return s.v0;
  if (t >= s.t2) return s.base;
  if (t <= s.t1) return s.v0 + (s.low - s.v0) * ((t - s.t0) / (s.t1 - s.t0));
  return s.low + (s.base - s.low) * ((t - s.t1) / (s.t2 - s.t1));
}

/**
 * Sidechain duck: dips `musicGain` to depth x its resting level in `attack` seconds, then ramps back to rest
 * by `ms` milliseconds after the start. Returns the context time the duck ends.
 * Give it a gain node dedicated to ducking, sitting between the music and its bus: the resting level is that
 * node's value on its first duck (or opts.level), and the helper assumes it owns the node's automation.
 * A duck that lands inside another one continues from the value the first one had reached, with no jump: the
 * previous segment is cut at `t` by a ramp that stays on its own line (no cancelAndHoldAtTime needed, so
 * browsers without it behave the same).
 */
export function duck(musicGain: GainNode, ms = 150, opts: DuckOpts = {}): number {
  const g = musicGain.gain;
  const prev = ducks.get(g);
  const base = opts.level ?? prev?.base ?? g.value;
  const t = musicGain.context.currentTime + Math.max(0, opts.at ?? 0);
  const len = Math.max(0.03, ms / 1000);
  const attack = Math.min(Math.max(0.001, opts.attack ?? 0.02), len / 2);
  const depth = Math.min(1, Math.max(0, opts.depth ?? 0.35));
  const inside = prev !== undefined && t > prev.t0 && t < prev.t2;
  const from = prev ? duckValueAt(prev, t) : g.value;
  g.cancelScheduledValues(t);
  if (inside) g.linearRampToValueAtTime(from, t);
  else g.setValueAtTime(from, t);
  g.linearRampToValueAtTime(base * depth, t + attack);
  g.linearRampToValueAtTime(base, t + len);
  ducks.set(g, { base, t0: t, v0: from, t1: t + attack, low: base * depth, t2: t + len });
  return t + len;
}
