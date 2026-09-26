// Song position clock: maps AudioContext time to track seconds through piecewise constant playback rates,
// so the QTE grid and the music stay locked while the tempo rule bends the speed. Pure, no Web Audio.

interface Seg { t: number; p: number; r: number }

export class SongClock {
  private segs: Seg[];

  /** Track position `p0` (seconds) plays at context time `t0`, at rate `r0`. */
  constructor(t0: number, p0 = 0, r0 = 1) {
    this.segs = [{ t: t0, p: p0, r: r0 }];
  }

  private seg(t: number): Seg {
    for (let i = this.segs.length - 1; i > 0; i--) if (this.segs[i].t <= t) return this.segs[i];
    return this.segs[0];
  }

  /** Track seconds heard at context time t (extrapolates before the first segment). */
  pos(t: number): number {
    const s = this.seg(t);
    return s.p + (t - s.t) * s.r;
  }

  rate(): number {
    return this.segs[this.segs.length - 1].r;
  }

  /** From context time t on, the track plays at rate r. Keeps 3 s of history for late input timestamps. */
  setRate(t: number, r: number) {
    const last = this.segs[this.segs.length - 1];
    if (t < last.t) t = last.t;
    this.segs.push({ t, p: this.pos(t), r });
    while (this.segs.length > 2 && this.segs[1].t < t - 3) this.segs.shift();
  }

  /** Context time at which track position p will play, at the current rate. */
  timeOf(p: number): number {
    const s = this.segs[this.segs.length - 1];
    return s.t + (p - s.p) / s.r;
  }
}
