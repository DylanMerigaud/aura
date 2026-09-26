// Screen effects state (all 0..1) read by the composite pass, and the pure trigger/decay driver that
// writes it. Decay runs on REAL seconds so a hit stop (visual dt 0) does not freeze a flash.

export interface ScreenFx {
  flash: number;
  flashBlack: boolean;
  chroma: number;
  glitch: number;
  radial: number;
  vignette: number;
  desat: number;
  scanline: number;
}

export function newScreenFx(): ScreenFx {
  return { flash: 0, flashBlack: false, chroma: 0, glitch: 0, radial: 0, vignette: 0.25, desat: 0, scanline: 0.08 };
}

const FRAME = 1 / 60;
export const BASE_VIGNETTE = 0.25;

/** Full strength for `hold` seconds after the trigger, then a linear fade to 0 over `fade` seconds. */
export function pulse(elapsed: number, hold: number, fade: number): number {
  if (elapsed < 0) return 0;
  if (elapsed <= hold) return 1;
  if (fade <= 0) return 0;
  return Math.max(0, 1 - (elapsed - hold) / fade);
}

/** Kick pump: strongest right on the beat, gone by mid beat. */
export function kickPulse(beatPhase: number): number {
  const p = Math.min(1, Math.max(0, beatPhase));
  const k = 1 - p * 2;
  return k > 0 ? k * k * k : 0;
}

type Pulse = { t: number; hold: number; fade: number; amp: number };

function idle(): Pulse {
  return { t: 1e9, hold: 0, fade: 0, amp: 0 };
}

/** Owns the trigger timers; `tick` writes the decayed values into the ScreenFx. */
export class ScreenDriver {
  readonly fx: ScreenFx;
  private chromaP = idle();
  private glitchP = idle();
  private radialP = idle();
  private flashP = idle();
  private flashBlack = false;
  private desatTarget = 0;
  private desat = 0;

  constructor(fx: ScreenFx = newScreenFx()) {
    this.fx = fx;
  }

  private fire(p: Pulse, frames: number, fade: number, amp: number): void {
    // A weaker trigger never cuts a stronger one still holding.
    const cur = p.amp * pulse(p.t, p.hold, p.fade);
    if (cur > amp) return;
    p.t = 0;
    p.hold = frames * FRAME;
    p.fade = fade;
    p.amp = amp;
  }

  chroma(amp = 1): void {
    this.fire(this.chromaP, 2, 0.08, amp);
  }
  glitch(amp = 1): void {
    this.fire(this.glitchP, 3, 0.06, amp);
  }
  radial(amp = 1): void {
    this.fire(this.radialP, 3, 0.12, amp);
  }
  flash(amp = 1, black = false, frames = 1): void {
    this.flashBlack = black;
    this.flashP.amp = 0;
    this.fire(this.flashP, frames, 0.06, amp);
  }
  /** Slow drain to grey (loss) or back to color. */
  setDesat(target: number): void {
    this.desatTarget = target;
  }
  reset(): void {
    this.chromaP = idle();
    this.glitchP = idle();
    this.radialP = idle();
    this.flashP = idle();
    this.desatTarget = 0;
    this.desat = 0;
  }

  /** realDt in seconds; beatPhase 0..1; energy 0..1 of the current beat. */
  tick(realDt: number, beatPhase: number, energy: number): void {
    const dt = Math.max(0, Math.min(0.1, realDt));
    this.chromaP.t += dt;
    this.glitchP.t += dt;
    this.radialP.t += dt;
    this.flashP.t += dt;
    const f = this.fx;
    f.chroma = this.chromaP.amp * pulse(this.chromaP.t, this.chromaP.hold, this.chromaP.fade);
    f.glitch = this.glitchP.amp * pulse(this.glitchP.t, this.glitchP.hold, this.glitchP.fade);
    f.radial = this.radialP.amp * pulse(this.radialP.t, this.radialP.hold, this.radialP.fade);
    f.flash = this.flashP.amp * pulse(this.flashP.t, this.flashP.hold, this.flashP.fade);
    f.flashBlack = this.flashBlack;
    // Desat eases toward its target over about 0.8 s.
    const step = dt / 0.8;
    this.desat += Math.max(-step, Math.min(step, this.desatTarget - this.desat));
    f.desat = this.desat;
    f.vignette = Math.min(1, BASE_VIGNETTE + 0.22 * kickPulse(beatPhase) * (0.4 + 0.6 * energy) + 0.35 * this.desat);
  }
}
