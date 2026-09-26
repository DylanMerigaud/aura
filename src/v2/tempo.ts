// Dylan's tempo rule: every judged press nudges the game speed, the speed eases in over 250 ms and decays back
// to 1.0 at 1 percent a second. Pure, driven by the game loop.
import type { Grade } from "../qte/judge";

export const TEMPO_MIN = 0.9;
export const TEMPO_MAX = 1.15;
const NUDGE: Record<Grade, number> = { perfect: 0.006, great: 0.003, ok: 0, miss: -0.015 };
const DECAY_PER_S = 0.01;
/** Exponential ease rate: 95 percent of a step is reached in 250 ms. */
const EASE = 12;

/**
 * `base` is the level's playback rate the rule bends around (1, or under 1 when a level plays its track slower,
 * see LevelTuning.playRate) and `maxUp` caps the speed up relative to it (TEMPO_MAX by default).
 */
export class Tempo {
  target: number;
  rate: number;
  readonly min: number;
  readonly max: number;

  constructor(public readonly base = 1, maxUp = TEMPO_MAX) {
    this.target = this.rate = base;
    this.min = TEMPO_MIN * base;
    this.max = Math.min(TEMPO_MAX, maxUp) * base;
  }

  nudge(grade: Grade, cringe = false) {
    const d = (cringe ? NUDGE.miss : NUDGE[grade]) * this.base;
    this.target = Math.min(this.max, Math.max(this.min, this.target + d));
  }

  update(dt: number) {
    const b = this.base;
    if (this.target > b) this.target = Math.max(b, this.target - DECAY_PER_S * b * dt);
    else if (this.target < b) this.target = Math.min(b, this.target + DECAY_PER_S * b * dt);
    this.rate += (this.target - this.rate) * (1 - Math.exp(-EASE * dt));
    this.rate = Math.min(this.max, Math.max(this.min, this.rate));
  }

  reset() {
    this.target = this.rate = this.base;
  }
}
