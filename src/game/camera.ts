// Virtual camera over the 1280x720 scene: follow targets, punch-in zoom, rotation, decaying shake, handheld sway.

export const W = 1280;
export const H = 720;

export class Camera {
  x = W / 2;
  y = H / 2;
  zoom = 1;
  rot = 0;
  tx = W / 2;
  ty = H / 2;
  tzoom = 1;
  trot = 0;
  shakeAmt = 0;
  punch = 0;
  handheld = 0;
  letterbox = 0;
  tletterbox = 0;
  private sx = 0;
  private sy = 0;
  private time = 0;

  focus(x: number, y: number, zoom: number, rot = 0) {
    this.tx = x;
    this.ty = y;
    this.tzoom = zoom;
    this.trot = rot;
  }

  shake(a: number) {
    this.shakeAmt = Math.max(this.shakeAmt, a);
  }

  kick(z: number) {
    this.punch = Math.max(this.punch, z);
  }

  /** Snap straight to the target (a hard cut). */
  cut() {
    this.x = this.tx;
    this.y = this.ty;
    this.zoom = this.tzoom;
    this.rot = this.trot;
  }

  update(dt: number) {
    this.time += dt;
    const k = 1 - Math.exp(-dt * 5);
    this.x += (this.tx - this.x) * k;
    this.y += (this.ty - this.y) * k;
    this.zoom += (this.tzoom - this.zoom) * k;
    this.rot += (this.trot - this.rot) * k;
    this.letterbox += (this.tletterbox - this.letterbox) * (1 - Math.exp(-dt * 8));
    this.punch *= Math.exp(-dt * 9);
    this.shakeAmt *= Math.exp(-dt * 7);
    const s = this.shakeAmt;
    this.sx = (Math.random() * 2 - 1) * s * 18;
    this.sy = (Math.random() * 2 - 1) * s * 18;
  }

  apply(g: CanvasRenderingContext2D) {
    const hh = this.handheld;
    const hx = hh * (Math.sin(this.time * 1.3) * 10 + Math.sin(this.time * 3.1) * 4);
    const hy = hh * (Math.cos(this.time * 1.7) * 8 + Math.sin(this.time * 2.3) * 3);
    const hr = hh * Math.sin(this.time * 0.9) * 0.015;
    g.translate(W / 2, H / 2);
    g.rotate(this.rot + hr + this.shakeAmt * (Math.random() - 0.5) * 0.02);
    g.scale(this.zoom + this.punch, this.zoom + this.punch);
    g.translate(-this.x + this.sx + hx, -this.y + this.sy + hy);
  }

  /** Parallax offset for a layer at depth factor `f` (1 = moves with the world). */
  parallax(f: number) {
    return { x: (this.x - W / 2) * (1 - f), y: (this.y - H / 2) * (1 - f) };
  }
}
