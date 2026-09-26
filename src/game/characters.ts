// Layered primitive characters (head, torso, arms, legs, sunglasses) with six blended poses.

export type Pose = "idle" | "charge" | "release" | "hit" | "cringe" | "victory";

/** Joint angles in radians: lean, left arm up/down, right arm, arm bend, knee spread, squash. */
interface Rig { lean: number; armL: number; armR: number; bend: number; legs: number; squash: number; headTilt: number }

const POSES: Record<Pose, Rig> = {
  idle: { lean: 0, armL: 0.25, armR: -0.25, bend: 0.5, legs: 0.18, squash: 1, headTilt: 0 },
  charge: { lean: 0.12, armL: 1.3, armR: 1.1, bend: 1.3, legs: 0.35, squash: 0.94, headTilt: 0.1 },
  release: { lean: 0.28, armL: 1.55, armR: 1.55, bend: 0.05, legs: 0.42, squash: 1.04, headTilt: -0.1 },
  hit: { lean: -0.35, armL: -0.6, armR: 0.9, bend: 0.8, legs: 0.25, squash: 0.97, headTilt: -0.3 },
  cringe: { lean: 0.35, armL: 0.9, armR: 0.7, bend: 2.2, legs: 0.08, squash: 0.82, headTilt: 0.5 },
  victory: { lean: -0.05, armL: 2.7, armR: 2.5, bend: 0.2, legs: 0.3, squash: 1.06, headTilt: -0.15 },
};

export class Character {
  rig: Rig = { ...POSES.idle };
  pose: Pose = "idle";
  poseTimer = 0;
  hat: "none" | "beanie" | "chef" | "cap" | "headphones" | "crown" = "none";
  constructor(public x: number, public y: number, public facing: 1 | -1, public color: string, public skin: string, public shades: boolean) {}

  set(p: Pose, hold = 0.45) {
    this.pose = p;
    this.poseTimer = hold;
  }

  update(dt: number, rest: Pose) {
    if (this.poseTimer > 0) {
      this.poseTimer -= dt;
      if (this.poseTimer <= 0) this.pose = rest;
    } else this.pose = rest;
    const t = POSES[this.pose];
    const k = 1 - Math.exp(-dt * 14);
    const r = this.rig as unknown as Record<string, number>;
    const tt = t as unknown as Record<string, number>;
    for (const key in tt) r[key] += (tt[key] - r[key]) * k;
  }

  private drawHat(g: CanvasRenderingContext2D) {
    const h = this.hat;
    if (h === "beanie") {
      g.fillStyle = shade(this.color, -50);
      g.beginPath();
      g.ellipse(0, -42, 34, 26, 0, Math.PI, Math.PI * 2);
      g.fill();
      g.fillRect(-34, -46, 68, 10);
    } else if (h === "chef") {
      g.fillStyle = "#f5f5f5";
      g.fillRect(-26, -78, 52, 30);
      g.beginPath();
      g.arc(-14, -82, 18, 0, Math.PI * 2);
      g.arc(14, -82, 18, 0, Math.PI * 2);
      g.arc(0, -92, 18, 0, Math.PI * 2);
      g.fill();
    } else if (h === "cap") {
      g.fillStyle = "#111";
      g.beginPath();
      g.ellipse(0, -42, 33, 22, 0, Math.PI, Math.PI * 2);
      g.fill();
      g.fillRect(0, -46, 52, 8);
    } else if (h === "headphones") {
      g.strokeStyle = "#222";
      g.lineWidth = 8;
      g.beginPath();
      g.arc(0, -22, 36, Math.PI * 1.05, Math.PI * 1.95);
      g.stroke();
      g.fillStyle = "#ff3df2";
      g.fillRect(-40, -30, 14, 26);
    } else if (h === "crown") {
      g.fillStyle = "#ffd23f";
      g.beginPath();
      g.moveTo(-30, -48);
      g.lineTo(-30, -80);
      g.lineTo(-15, -62);
      g.lineTo(0, -88);
      g.lineTo(15, -62);
      g.lineTo(30, -80);
      g.lineTo(30, -48);
      g.closePath();
      g.fill();
    }
  }

  draw(g: CanvasRenderingContext2D, time: number, scale: number, beatPulse: number) {
    const r = this.rig;
    const bob = Math.sin(time * 6) * 3 + beatPulse * 6;
    // Ground shadow.
    g.fillStyle = "rgba(0,0,0,0.5)";
    g.beginPath();
    g.ellipse(this.x, this.y - 4, 90 * scale, 16 * scale, 0, 0, Math.PI * 2);
    g.fill();
    g.save();
    g.translate(this.x, this.y);
    g.scale(this.facing * scale, scale * r.squash);

    g.lineCap = "round";
    g.lineJoin = "round";
    const hipY = -150 - bob * 0.3;
    // Legs
    g.strokeStyle = "#111";
    g.lineWidth = 26;
    limb(g, -12, hipY, Math.PI / 2 + r.legs, 80, Math.PI / 2 - 0.1, 78);
    limb(g, 12, hipY, Math.PI / 2 - r.legs, 80, Math.PI / 2 + 0.1, 78);
    // Shoes
    g.fillStyle = "#f4f4f4";
    g.fillRect(-12 + Math.cos(Math.PI / 2 + r.legs) * 80 - 22, -12, 34, 12);
    g.fillRect(12 + Math.cos(Math.PI / 2 - r.legs) * 80 - 12, -12, 34, 12);
    g.save();
    g.translate(0, hipY);
    g.rotate(r.lean);
    // Back arm
    g.strokeStyle = shade(this.color, -40);
    g.lineWidth = 20;
    limb(g, -18, -118, Math.PI / 2 - r.armL, 56, Math.PI / 2 - r.armL - r.bend, 54);
    // Torso (hoodie)
    g.fillStyle = this.color;
    roundRect(g, -38, -130, 76, 136, 22);
    g.fillStyle = shade(this.color, -30);
    g.fillRect(-38, -20, 76, 18);
    // Front arm
    g.strokeStyle = shade(this.color, 15);
    g.lineWidth = 22;
    limb(g, 18, -118, Math.PI / 2 - r.armR, 58, Math.PI / 2 - r.armR - r.bend, 56);
    // Head
    g.save();
    g.translate(0, -150);
    g.rotate(r.headTilt);
    g.fillStyle = this.skin;
    g.beginPath();
    g.ellipse(0, -18, 30, 34, 0, 0, Math.PI * 2);
    g.fill();
    g.fillStyle = "#15101c";
    g.beginPath();
    g.ellipse(-2, -40, 32, 18, -0.15, Math.PI, Math.PI * 2);
    g.fill();
    this.drawHat(g);
    if (this.shades) {
      g.fillStyle = "#050505";
      roundRect(g, -4, -26, 34, 12, 4);
      g.fillStyle = "rgba(120,240,255,0.8)";
      g.fillRect(4, -24, 10, 3);
    } else {
      g.fillStyle = "#050505";
      g.fillRect(12, -24, 6, 6);
      // Eyebrow tells the mood.
      g.strokeStyle = "#15101c";
      g.lineWidth = 4;
      g.beginPath();
      const brow = this.pose === "cringe" || this.pose === "hit" ? 5 : this.pose === "charge" || this.pose === "release" ? -4 : 0;
      g.moveTo(8, -32 - brow);
      g.lineTo(22, -32 + brow);
      g.stroke();
    }
    // Mouth per pose.
    g.strokeStyle = "#3a1010";
    g.fillStyle = "#3a1010";
    g.lineWidth = 3.5;
    g.beginPath();
    if (this.pose === "victory" || this.pose === "release") {
      g.arc(16, -6, 8, 0, Math.PI);
      g.fill();
    } else if (this.pose === "cringe") {
      g.moveTo(6, -4);
      g.lineTo(11, -8);
      g.lineTo(16, -4);
      g.lineTo(21, -8);
      g.lineTo(26, -4);
      g.stroke();
    } else if (this.pose === "hit" || this.pose === "charge") {
      g.ellipse(17, -5, 4, 6, 0, 0, Math.PI * 2);
      g.fill();
    } else {
      g.moveTo(9, -5);
      g.quadraticCurveTo(17, this.shades ? -1 : -3, 25, -7);
      g.stroke();
    }
    g.restore();
    g.restore();
    g.restore();
  }
}

function limb(g: CanvasRenderingContext2D, x: number, y: number, a1: number, l1: number, a2: number, l2: number) {
  const ex = x + Math.cos(a1) * l1;
  const ey = y + Math.sin(a1) * l1;
  g.beginPath();
  g.moveTo(x, y);
  g.lineTo(ex, ey);
  g.lineTo(ex + Math.cos(a2) * l2, ey + Math.sin(a2) * l2);
  g.stroke();
}

function roundRect(g: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  g.beginPath();
  g.roundRect(x, y, w, h, r);
  g.fill();
}

function shade(hex: string, amt: number) {
  const n = parseInt(hex.slice(1), 16);
  const c = (v: number) => Math.max(0, Math.min(255, v + amt));
  return `rgb(${c(n >> 16)},${c((n >> 8) & 255)},${c(n & 255)})`;
}
