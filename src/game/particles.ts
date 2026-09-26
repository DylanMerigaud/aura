// Pooled aura particles drawn with pre-rendered glow sprites and additive blending. No allocation per frame.

const MAX = 900;

export function glowSprite(color: string, size = 64): HTMLCanvasElement {
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const g = c.getContext("2d")!;
  const grd = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  grd.addColorStop(0, "rgba(255,255,255,1)");
  grd.addColorStop(0.2, color);
  grd.addColorStop(1, "rgba(0,0,0,0)");
  g.fillStyle = grd;
  g.fillRect(0, 0, size, size);
  return c;
}

export class Particles {
  x = new Float32Array(MAX);
  y = new Float32Array(MAX);
  vx = new Float32Array(MAX);
  vy = new Float32Array(MAX);
  life = new Float32Array(MAX);
  max = new Float32Array(MAX);
  size = new Float32Array(MAX);
  sprite = new Uint8Array(MAX);
  private head = 0;
  sprites: HTMLCanvasElement[];

  constructor(colors: string[]) {
    this.sprites = colors.map((c) => glowSprite(c));
  }

  emit(x: number, y: number, vx: number, vy: number, life: number, size: number, sprite: number) {
    const i = this.head;
    this.head = (this.head + 1) % MAX;
    this.x[i] = x;
    this.y[i] = y;
    this.vx[i] = vx;
    this.vy[i] = vy;
    this.life[i] = life;
    this.max[i] = life;
    this.size[i] = size;
    this.sprite[i] = sprite;
  }

  burst(x: number, y: number, n: number, speed: number, sprite: number, size = 26, dirX = 0) {
    for (let k = 0; k < n; k++) {
      const a = Math.random() * Math.PI * 2;
      const s = speed * (0.3 + Math.random());
      this.emit(x, y, Math.cos(a) * s + dirX * speed, Math.sin(a) * s, 0.4 + Math.random() * 0.6, size * (0.5 + Math.random()), sprite);
    }
  }

  update(dt: number) {
    for (let i = 0; i < MAX; i++) {
      if (this.life[i] <= 0) continue;
      this.life[i] -= dt;
      this.x[i] += this.vx[i] * dt;
      this.y[i] += this.vy[i] * dt;
      this.vx[i] *= 0.96;
      this.vy[i] = this.vy[i] * 0.96 - 30 * dt;
    }
  }

  draw(g: CanvasRenderingContext2D) {
    g.globalCompositeOperation = "lighter";
    for (let i = 0; i < MAX; i++) {
      if (this.life[i] <= 0) continue;
      const k = this.life[i] / this.max[i];
      const s = this.size[i] * (0.4 + k * 0.6);
      g.globalAlpha = k;
      g.drawImage(this.sprites[this.sprite[i]], this.x[i] - s / 2, this.y[i] - s / 2, s, s);
    }
    g.globalAlpha = 1;
    g.globalCompositeOperation = "source-over";
  }
}
