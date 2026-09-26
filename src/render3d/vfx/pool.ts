// Preallocated particle pool (no three.js): flat typed arrays, a ring cursor that reuses dead
// slots first and steals the oldest live one when full. `active` caps the usable slots (quality).

export class ParticlePool {
  readonly capacity: number;
  active: number;
  readonly pos: Float32Array;
  readonly vel: Float32Array;
  readonly color: Float32Array;
  /** Remaining life in seconds (<= 0 is dead) and the life it was born with. */
  readonly life: Float32Array;
  readonly maxLife: Float32Array;
  readonly size: Float32Array;
  readonly seed: Float32Array;
  private cursor = 0;

  constructor(capacity: number) {
    this.capacity = capacity;
    this.active = capacity;
    this.pos = new Float32Array(capacity * 3);
    this.vel = new Float32Array(capacity * 3);
    this.color = new Float32Array(capacity * 3);
    this.life = new Float32Array(capacity);
    this.maxLife = new Float32Array(capacity);
    this.size = new Float32Array(capacity);
    this.seed = new Float32Array(capacity);
  }

  setQuality(k: number): void {
    this.active = Math.max(1, Math.min(this.capacity, Math.floor(this.capacity * k)));
    for (let i = this.active; i < this.capacity; i++) this.life[i] = 0;
    if (this.cursor >= this.active) this.cursor = 0;
  }

  /** Slot for a new particle: the next dead one within `active`, else the one with the least life. */
  alloc(): number {
    const n = this.active;
    for (let k = 0; k < n; k++) {
      const i = (this.cursor + k) % n;
      if (this.life[i] <= 0) {
        this.cursor = (i + 1) % n;
        return i;
      }
    }
    let best = 0;
    for (let i = 1; i < n; i++) if (this.life[i] < this.life[best]) best = i;
    this.cursor = (best + 1) % n;
    return best;
  }

  spawn(x: number, y: number, z: number, vx: number, vy: number, vz: number, life: number, size: number, r: number, g: number, b: number): number {
    const i = this.alloc();
    const j = i * 3;
    this.pos[j] = x;
    this.pos[j + 1] = y;
    this.pos[j + 2] = z;
    this.vel[j] = vx;
    this.vel[j + 1] = vy;
    this.vel[j + 2] = vz;
    this.color[j] = r;
    this.color[j + 1] = g;
    this.color[j + 2] = b;
    this.life[i] = life;
    this.maxLife[i] = life;
    this.size[i] = size;
    this.seed[i] = Math.random() * 100;
    return i;
  }

  alive(): number {
    let c = 0;
    for (let i = 0; i < this.capacity; i++) if (this.life[i] > 0) c++;
    return c;
  }

  clear(): void {
    this.life.fill(0);
  }
}

/** Palette per combo tier: 0 faint blue, 1 blue, 2 purple, 3 white hot. rgb 0..1 plus an alpha gain. */
export const TIER_COLORS: readonly (readonly [number, number, number, number])[] = [
  [0.25, 0.4, 1.0, 0.35],
  [0.2, 0.6, 1.0, 0.85],
  [0.65, 0.3, 1.0, 0.95],
  [1.0, 0.95, 0.85, 1.0],
];

export function tierColor(tier: number): readonly [number, number, number, number] {
  return TIER_COLORS[Math.max(0, Math.min(3, Math.floor(tier)))];
}

/** Flame spawn rate (particles/s) from the meter (-1..1), the beat energy (0..1) and the tier. */
export function flameRate(meter: number, energy: number, tier: number): number {
  const share = (Math.max(-1, Math.min(1, meter)) + 1) / 2;
  return (60 + 260 * share) * (0.6 + 0.6 * energy) * (1 + 0.25 * tier);
}

/** Enemy flame rate: grows as he wins (meter toward -1). */
export function enemyFlameRate(meter: number, energy: number): number {
  const share = (1 - Math.max(-1, Math.min(1, meter))) / 2;
  return 180 * share * share * (0.6 + 0.6 * energy);
}
