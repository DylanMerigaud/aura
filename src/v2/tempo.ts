// Dylan's tempo rule: every judged press nudges the game speed, the speed eases in over 250 ms and decays back
// to 1.0 at 1 percent a second. Pure, driven by the game loop.
import type { Grade } from "../qte/judge";

export const TEMPO_MIN = 0.9;
export const TEMPO_MAX = 1.15;
const NUDGE: Record<Grade, number> = { perfect: 0.006, great: 0.003, ok: 0, miss: -0.015 };
const DECAY_PER_S = 0.01;
/** Exponential ease rate: 95 percent of a step is reached in 250 ms. */
const EASE = 12;

export class Tempo {
  target = 1;
  rate = 1;

  nudge(grade: Grade, cringe = false) {
    const d = cringe ? NUDGE.miss : NUDGE[grade];
    this.target = Math.min(TEMPO_MAX, Math.max(TEMPO_MIN, this.target + d));
  }

  update(dt: number) {
    if (this.target > 1) this.target = Math.max(1, this.target - DECAY_PER_S * dt);
    else if (this.target < 1) this.target = Math.min(1, this.target + DECAY_PER_S * dt);
    this.rate += (this.target - this.rate) * (1 - Math.exp(-EASE * dt));
    this.rate = Math.min(TEMPO_MAX, Math.max(TEMPO_MIN, this.rate));
  }

  reset() {
    this.target = this.rate = 1;
  }
}
