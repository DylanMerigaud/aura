// The QTE prompt layer: v1's prompt presentation (git tag v1-2d, src/game/battle.ts lane(),
// timerRing(), label(), mashOrb()) on a transparent 2D canvas over the 3D stage, MOBILE ONLY (addendum
// 17:15): a HIT is v1's ARROW flying along a visible lane into the ring, swipe its direction when it lands;
// the hold is a long bar with an arrow head, the 67 a cluster of small left and right arrows, released
// with a swipe up. v1's travel, size, glow and timing; same colors, glow sprites, beat pulse on the ring, timer rings and Arial Black labels.
// Drawing happens in v1 units (the 1280x720 canvas) around the ring at (0, 0), scaled to the
// viewport: landscape keeps v1's horizontal lane, portrait turns it vertical (arrows fall from the
// top into a ring at 60 percent of the height, inside the safe width).
import type { EventState } from "../../../qte/runner";
import type { Dir } from "../../../qte/types";
import type { Frame } from "../../contracts";
import { el } from "../dom";
import { newGate, visiblePrompts } from "./queue";

const CYAN = "#ffffff";
const CYAN_DIM = "#5c5c5c";
const MAGENTA = "#ffffff";
const YELLOW = "#ffd400";
const LANE_PX_PER_BEAT = 260;

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

const ROT: Record<Dir, number> = { right: 0, down: Math.PI / 2, left: Math.PI, up: -Math.PI / 2 };
const STEP: Record<Dir, [number, number]> = { right: [1, 0], down: [0, 1], left: [-1, 0], up: [0, -1] };

/** Prompt kinds the player has landed once this session: their ghost finger never shows again. */
const taught = new Set<string>();

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
  /** Onboarding by doing: the ghost finger shows each kind until its first success (session long). */
  const watched = new Map<string, EventState>();
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

  /** v1's arrow glyph: glow sprite, the arrow shape, a white outline. */
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
    const k = size;
    g.moveTo(k, 0);
    g.lineTo(0, -k * 0.8);
    g.lineTo(0, -k * 0.35);
    g.lineTo(-k * 0.85, -k * 0.35);
    g.lineTo(-k * 0.85, k * 0.35);
    g.lineTo(0, k * 0.35);
    g.lineTo(0, k * 0.8);
    g.closePath();
    g.fill();
    g.strokeStyle = "#000";
    g.lineWidth = 4;
    g.stroke();
    g.restore();
  }

  /** The visible lane the arrows travel along, from its spawn point into the ring. */
  function lane() {
    const [x, y] = lanePos(2.2);
    g.strokeStyle = "rgba(255,255,255,0.14)";
    g.lineWidth = 64;
    g.lineCap = "round";
    g.beginPath();
    g.moveTo(0, 0);
    g.lineTo(x, y);
    g.stroke();
    g.lineCap = "butt";
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

  /** The ghost finger over the ring: `press` 0 hovering, 1 down on the ring. */
  function ghost(press: number, alpha = 0.9) {
    g.save();
    g.globalAlpha = alpha;
    g.font = "64px sans-serif";
    g.textAlign = "center";
    g.textBaseline = "bottom";
    g.fillText("\u{1F447}", 0, -40 + press * 26);
    if (press > 0.8) {
      g.strokeStyle = "rgba(255,255,255,0.8)";
      g.lineWidth = 4;
      g.beginPath();
      g.arc(0, 0, 60 + (1 - press) * 120, 0, Math.PI * 2);
      g.stroke();
    }
    g.restore();
  }

  /** The ghost finger swiping `dir` through the ring as the arrow lands (dt = seconds to the target). */
  function ghostSwipe(dir: Dir, dt: number) {
    const p = Math.max(0, Math.min(1, 0.5 - dt * 2.5));
    const [sx, sy] = STEP[dir];
    g.save();
    g.translate(sx * (p - 0.5) * 140, sy * (p - 0.5) * 140 + 40);
    ghost(0, 0.4 + 0.5 * Math.exp(-Math.abs(dt) * 6));
    g.restore();
  }

  /** Draw the ghost finger for a prompt kind the player has not landed yet. */
  function teach(s: EventState, f: Frame) {
    const kind = s.ev.type;
    if (taught.has(kind)) return;
    watched.set(kind, s);
    const now = f.songTime;
    const T = s.ev.beat * f.spb;
    if (kind === "hit" && s.ev.type === "hit") ghostSwipe(s.ev.dir, T - now);
    else if (kind === "mash" && f.mashing && s.progress < 4) ghost(Math.abs(Math.sin(now * Math.PI * 7)));
    else if (kind === "hold" && !s.held) ghost(now >= T - 0.05 ? 1 : Math.exp(-(T - now) * 9));
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
        // A long bar with an arrow head flying in: the head lands on the press, the tail is the hold length.
        const [hx, hy] = lanePos(Math.max(0, (T - now) / spb));
        const [tx, ty] = lanePos(Math.max(0, (T - now) / spb) + ev.length * 0.5);
        g.strokeStyle = YELLOW;
        g.globalAlpha = 0.75;
        g.lineWidth = 26;
        g.lineCap = "round";
        g.beginPath();
        g.moveTo(hx, hy);
        g.lineTo(tx, ty);
        g.stroke();
        g.lineCap = "butt";
        g.globalAlpha = 1;
        arrow(hx, hy, portrait ? "down" : "left", 34, YELLOW);
        if (!taught.has("hold")) label("HOLD", 0, 70, YELLOW, 28);
      } else {
        const p = f.holdProgress;
        g.strokeStyle = YELLOW;
        g.lineWidth = 12;
        g.beginPath();
        g.arc(0, 0, 58, -Math.PI / 2, -Math.PI / 2 + p * Math.PI * 2);
        g.stroke();
        label(p >= 0.97 ? "LIFT!" : "HOLD...", 0, 10, "#fff", 26);
      }
    } else if (ev.type === "mash") {
      const R = f.targetAt(ev);
      if (f.mashing) {
        const wob = Math.sin(performance.now() / 1000 * 30);
        const closing = R - now < spb;
        mashOrb(f.mashCount, wob);
        // The cluster of small arrows: left and right, the side to tap next lit.
        const nextLeft = s.lastDir !== "left";
        for (let i = 0; i < 3; i++) {
          arrow(-80 - i * 30, (i - 1) * 34, "left", 20, nextLeft ? CYAN : CYAN_DIM, nextLeft ? 1 : 0.5);
          arrow(80 + i * 30, (i - 1) * 34, "right", 20, nextLeft ? CYAN_DIM : CYAN, nextLeft ? 0.5 : 1);
        }
        label(`${f.mashCount}`, 0, 4, "#fff", 44 + Math.min(30, f.mashCount));
        label("67", 0, -96, YELLOW, 56 + (closing ? 0 : wob * 4));
        // The ring closes onto the note ring over the last beat: tap when they meet.
        if (closing) {
          const c = Math.max(0, (R - now) / spb);
          g.strokeStyle = YELLOW;
          g.lineWidth = 8;
          g.beginPath();
          g.arc(0, 0, 50 + c * 90, 0, Math.PI * 2);
          g.stroke();
          arrow(0, -150, "up", 40, YELLOW);
          if (!taught.has("mash")) label("SWIPE UP ON THE DROP!", 0, 130, YELLOW, (portrait ? 24 : 32) + wob * 3);
        } else {
          timerRing(0, 0, (R - now) / (R - T), CYAN);
          if (!taught.has("mash")) label("LEFT RIGHT LEFT RIGHT", 0, 130, CYAN, portrait ? 22 : 30);
        }
      } else {
        label("67 INCOMING", 0, 0, YELLOW, 30);
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
    // The battle is decided: the ring and every prompt leave the screen, the results come over a clean scene.
    if (f.ending) return clear();
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
    // The ring shrinks as the windows tighten with the combo (wider in the onboarding).
    const ringK = Math.min(1.3, Math.max(0.75, (f.windowK ?? 0.846) / 0.846));
    g.arc(0, 0, 46 * ringK + pulse * 6, 0, Math.PI * 2);
    g.stroke();
    if (opponent) return;

    for (const [kind, st] of watched) {
      if (st.phase !== "done") continue;
      watched.delete(kind);
      if (st.result && st.result.grade !== "miss" && !st.result.cringe) taught.add(kind);
    }
    lane();
    for (const p of visiblePrompts(f.prompts, f.songTime, f.spb, gate, shown)) {
      prompt(p, f);
      teach(p, f);
    }
  }

  /** New battle: forget the previous level's queue state and wipe the layer. */
  function reset() {
    gate.panel = null;
    gate.silentUntil = -Infinity;
    clear();
  }

  return { root: canvas, frame, clear, reset };
}
