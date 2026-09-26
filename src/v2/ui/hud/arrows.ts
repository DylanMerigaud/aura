// The QTE prompt layer: a port of v1's arrow presentation (git tag v1-2d, src/game/battle.ts
// arrow(), lane(), timerRing(), label(), mashOrb()) onto a transparent 2D canvas over the 3D stage.
// Same shapes, colors, glow sprites, beat pulse on the ring, timer rings and Arial Black labels.
// Drawing happens in v1 units (the 1280x720 canvas) around the ring at (0, 0), scaled to the
// viewport: landscape keeps v1's horizontal lane, portrait turns it vertical (arrows fall from the
// top into a ring at 60 percent of the height, inside the safe width).
import type { EventState } from "../../../qte/runner";
import type { Dir } from "../../../qte/types";
import type { Frame } from "../../contracts";
import { el } from "../dom";
import { newGate, visiblePrompts } from "./queue";

const CYAN = "#35e0ff";
const CYAN_DIM = "#1b5b70";
const MAGENTA = "#ff3df2";
const YELLOW = "#fff36b";
const LANE_PX_PER_BEAT = 260;
const ROT: Record<Dir, number> = { right: 0, down: Math.PI / 2, left: Math.PI, up: -Math.PI / 2 };

/** v1 particles.ts glowSprite: a radial white core fading through the color to transparent. */
function glowSprite(color: string, size = 64): HTMLCanvasElement {
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

/** `host` receives --ring-x, --ring-y, --ring-r (px) so the DOM judgments sit above the ring. */
export function buildArrows(host: HTMLElement) {
  const canvas = el("canvas", "hud-arrows");
  const g = canvas.getContext("2d")!;
  const probe = el("div", "hud-safe-probe");
  const sprites = [CYAN, MAGENTA, YELLOW, "#ffffff"].map((c) => glowSprite(c));

  let cssW = 0;
  let cssH = 0;
  let dpr = 1;
  let portrait = false;
  /** Ring center in CSS px, v1 unit scale, lane length per beat in v1 units. */
  let ringX = 0;
  let ringY = 0;
  let k = 1;
  let laneUnits = LANE_PX_PER_BEAT;
  let dirty = false;

  const gate = newGate();
  const shown: EventState[] = [];

  function resize() {
    cssW = window.innerWidth;
    cssH = window.innerHeight;
    dpr = Math.min(window.devicePixelRatio || 1, 3);
    canvas.width = Math.round(cssW * dpr);
    canvas.height = Math.round(cssH * dpr);
    portrait = cssH >= cssW;
    if (!portrait) {
      k = Math.min(cssW / 1280, cssH / 720);
      ringX = cssW / 3;
      ringY = cssH * (300 / 720);
      laneUnits = LANE_PX_PER_BEAT;
    } else {
      if (!probe.parentNode) host.appendChild(probe);
      const cs = getComputedStyle(probe);
      const l = parseFloat(cs.paddingLeft) || 0;
      const r = parseFloat(cs.paddingRight) || 0;
      const t = parseFloat(cs.paddingTop) || 0;
      const avail = cssW - l - r;
      const safeW = Math.min(cssW * 0.92, 420, avail);
      k = safeW / 480;
      ringX = l + avail / 2;
      ringY = cssH * 0.6;
      // Two beats of approach from below the top HUD band.
      laneUnits = Math.min(LANE_PX_PER_BEAT, (ringY - (t + 90)) / 2 / k);
    }
    host.style.setProperty("--ring-x", `${ringX}px`);
    host.style.setProperty("--ring-y", `${ringY}px`);
    host.style.setProperty("--ring-r", `${52 * k}px`);
  }
  window.addEventListener("resize", resize);
  window.addEventListener("orientationchange", resize);

  function arrow(x: number, y: number, dir: Dir, size: number, color: string, alpha = 1) {
    g.save();
    g.translate(x, y);
    g.rotate(ROT[dir]);
    g.globalAlpha = alpha;
    g.globalCompositeOperation = "lighter";
    g.drawImage(sprites[color === CYAN || color === CYAN_DIM ? 0 : color === YELLOW ? 2 : 1], -size * 1.8, -size * 1.8, size * 3.6, size * 3.6);
    g.globalCompositeOperation = "source-over";
    g.fillStyle = color;
    g.beginPath();
    const s = size;
    g.moveTo(s, 0);
    g.lineTo(0, -s * 0.8);
    g.lineTo(0, -s * 0.35);
    g.lineTo(-s * 0.85, -s * 0.35);
    g.lineTo(-s * 0.85, s * 0.35);
    g.lineTo(0, s * 0.35);
    g.lineTo(0, s * 0.8);
    g.closePath();
    g.fill();
    g.strokeStyle = "#fff";
    g.lineWidth = 3;
    g.stroke();
    g.restore();
  }

  function timerRing(x: number, y: number, t: number, color: string) {
    t = Math.max(0, Math.min(1, t));
    g.strokeStyle = color;
    g.lineWidth = 6;
    g.beginPath();
    g.arc(x, y, 50 + t * 80, 0, Math.PI * 2);
    g.globalAlpha = 1 - t * 0.6;
    g.stroke();
    g.globalAlpha = 1;
  }

  function label(text: string, x: number, y: number, color: string, size: number) {
    g.font = `900 ${size}px "Arial Black", Impact, sans-serif`;
    g.textAlign = "center";
    g.textBaseline = "middle";
    g.lineWidth = size / 6;
    g.strokeStyle = "#000";
    g.strokeText(text, x, y);
    g.fillStyle = color;
    g.fillText(text, x, y);
  }

  /** The charge orb growing with the mash count (v1 drew it over the player; here behind the count). */
  function mashOrb(count: number, wob: number) {
    const r = Math.min(110, 20 + count * 2.4);
    const w = 1 + wob * 0.06;
    g.globalCompositeOperation = "lighter";
    g.drawImage(sprites[0], -r * 2 * w, -r * 2 * w, r * 4 * w, r * 4 * w);
    g.drawImage(sprites[3], -r * 0.8, -r * 0.8, r * 1.6, r * 1.6);
    g.globalCompositeOperation = "source-over";
  }

  function lanePos(beatsAway: number): [number, number] {
    return portrait ? [0, -beatsAway * laneUnits] : [beatsAway * laneUnits, 0];
  }

  function prompt(s: EventState, f: Frame) {
    const now = f.songTime;
    const spb = f.spb;
    const ev = s.ev;
    if (now < f.showsAt(ev)) return;
    const T = ev.beat * spb;
    if (ev.type === "hit") {
      const [x, y] = lanePos((T - now) / spb);
      arrow(x, y, ev.dir, 38, CYAN);
    } else if (ev.type === "combo") {
      const n = ev.dirs.length;
      const gap = portrait ? Math.min(84, 440 / Math.max(1, n)) : 84;
      const x0 = -((n - 1) * gap) / 2;
      for (let i = 0; i < n; i++) {
        const done = i < s.progress;
        arrow(x0 + i * gap, -110, ev.dirs[i], done ? 30 : 34, done ? YELLOW : MAGENTA, done ? 0.5 : 1);
      }
      timerRing(0, 0, (T - now) / ((n + 2) * spb), MAGENTA);
      label("COMBO", 0, 8, MAGENTA, 26);
    } else if (ev.type === "hold") {
      if (!s.held) {
        timerRing(0, 0, (T - now) / (2 * spb), YELLOW);
        label("HOLD SPACE", 0, 10, YELLOW, 24);
      } else {
        const p = f.holdProgress;
        g.strokeStyle = YELLOW;
        g.lineWidth = 12;
        g.beginPath();
        g.arc(0, 0, 58, -Math.PI / 2, -Math.PI / 2 + p * Math.PI * 2);
        g.stroke();
        label(p >= 0.97 ? "RELEASE!" : "HOLD...", 0, 10, "#fff", 26);
      }
    } else if (ev.type === "mash") {
      const R = f.targetAt(ev);
      if (f.mashing) {
        const wob = Math.sin(performance.now() / 1000 * 30);
        mashOrb(f.mashCount, wob);
        const left = s.lastDir !== "left";
        arrow(-90, 0, "left", left ? 44 : 32, left ? CYAN : CYAN_DIM);
        arrow(90, 0, "right", left ? 32 : 44, left ? CYAN_DIM : CYAN);
        label(`${f.mashCount}`, 0, 4, "#fff", 44 + Math.min(30, f.mashCount));
        label("MASH", 0, -90, CYAN, 44);
        timerRing(0, 0, (R - now) / (R - T), YELLOW);
        if (R - now < 1.5 * spb) label("SPACE TO RELEASE!", 0, 130, YELLOW, (portrait ? 26 : 34) + wob * 3);
      } else {
        label("MASH INCOMING", 0, 0, CYAN, 30);
      }
    }
  }

  function clear() {
    if (!dirty) return;
    g.setTransform(1, 0, 0, 1, 0, 0);
    g.clearRect(0, 0, canvas.width, canvas.height);
    dirty = false;
  }

  function frame(f: Frame) {
    if (window.innerWidth !== cssW || window.innerHeight !== cssH) resize();
    g.setTransform(1, 0, 0, 1, 0, 0);
    g.clearRect(0, 0, canvas.width, canvas.height);
    dirty = true;
    const s = dpr * k;
    g.setTransform(s, 0, 0, s, dpr * ringX, dpr * ringY);

    const opponent = f.turn === "opponent";
    // Beat pulse on the ring (v1: exp(-(visT - beatAt) * 7)).
    const pulse = opponent ? 0 : Math.exp(-f.beatPhase * f.spb * 7);
    g.strokeStyle = opponent ? "rgba(255,255,255,0.12)" : `rgba(255,255,255,${0.35 + pulse * 0.5})`;
    g.lineWidth = 4;
    g.beginPath();
    g.arc(0, 0, 46 + pulse * 6, 0, Math.PI * 2);
    g.stroke();
    if (opponent || f.ending) return;

    for (const p of visiblePrompts(f.prompts, f.songTime, f.spb, gate, shown)) prompt(p, f);
  }

  /** New battle: forget the previous level's queue state and wipe the layer. */
  function reset() {
    gate.panel = null;
    gate.silentUntil = -Infinity;
    clear();
  }

  return { root: canvas, frame, clear, reset };
}
