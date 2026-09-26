// Keyboard and touch input mapped onto the AudioContext clock, both feeding the same Input stream.
import type { Dir } from "./types";
import { ctx, heardTime } from "../audio/engine";

export type RawInput = { kind: "dir"; dir: Dir; at: number } | { kind: "space"; down: boolean; at: number } | { kind: "confirm" } | { kind: "back" };

/** What the touch layer should do with a tap, decided by the current QTE. */
export type TouchMode = "hit" | "mash" | "hold" | "menu";

const KEYS: Record<string, Dir> = {
  ArrowUp: "up", ArrowDown: "down", ArrowLeft: "left", ArrowRight: "right",
  KeyW: "up", KeyS: "down", KeyA: "left", KeyD: "right",
};

/** Convert a DOM event timestamp into the audio time the player was hearing. */
function audioTime(ts: number) {
  return ctx ? heardTime(ts) : 0;
}

export function bindInput(canvas: HTMLCanvasElement, onInput: (i: RawInput) => void, touchMode: () => TouchMode) {
  addEventListener("keydown", (e) => {
    if (e.repeat) {
      if (e.code.startsWith("Arrow") || e.code === "Space") e.preventDefault();
      return;
    }
    const at = audioTime(e.timeStamp);
    const dir = KEYS[e.code];
    if (dir) {
      e.preventDefault();
      onInput({ kind: "dir", dir, at });
    } else if (e.code === "Space") {
      e.preventDefault();
      onInput({ kind: "space", down: true, at });
    } else if (e.code === "Enter") onInput({ kind: "confirm" });
    else if (e.code === "Escape") onInput({ kind: "back" });
  });
  addEventListener("keyup", (e) => {
    if (e.code === "Space") onInput({ kind: "space", down: false, at: audioTime(e.timeStamp) });
  });

  // Touch: swipes fire as soon as they cross the threshold; taps are routed by the current QTE type.
  let sx = 0, sy = 0, fired = false, active = false;
  const down = new Set<number>();
  canvas.addEventListener("pointerdown", (e) => {
    e.preventDefault();
    window.focus();
    down.add(e.pointerId);
    if (down.size > 1 && touchMode() === "hold") return;
    canvas.setPointerCapture(e.pointerId);
    const at = audioTime(e.timeStamp);
    const r = canvas.getBoundingClientRect();
    const fx = (e.clientX - r.left) / r.width;
    const fy = (e.clientY - r.top) / r.height;
    sx = e.clientX; sy = e.clientY; fired = false; active = true;
    const mode = touchMode();
    // Menus confirm on pointerup: only the release counts as a user gesture for audio unlock.
    if (mode === "menu") return;
    if (mode === "mash") {
      fired = true;
      if (fx > 0.38 && fx < 0.62) onInput({ kind: "space", down: true, at });
      else onInput({ kind: "dir", dir: fx < 0.5 ? "left" : "right", at });
    } else if (mode === "hold") {
      fired = true;
      onInput({ kind: "space", down: true, at });
    } else if (fx < 0.2 || fx > 0.8 || fy < 0.2 || fy > 0.8) {
      // Tap on an edge = that direction.
      const dx = fx - 0.5, dy = fy - 0.5;
      fired = true;
      onInput({ kind: "dir", dir: Math.abs(dx) > Math.abs(dy) ? (dx < 0 ? "left" : "right") : dy < 0 ? "up" : "down", at });
    }
  });
  canvas.addEventListener("pointermove", (e) => {
    if (!active || fired) return;
    const dx = e.clientX - sx, dy = e.clientY - sy;
    if (dx * dx + dy * dy < 30 * 30) return;
    fired = true;
    onInput({ kind: "dir", dir: Math.abs(dx) > Math.abs(dy) ? (dx < 0 ? "left" : "right") : dy < 0 ? "up" : "down", at: audioTime(e.timeStamp) });
  });
  const up = (e: PointerEvent) => {
    down.delete(e.pointerId);
    if (!active || down.size) return;
    active = false;
    const mode = touchMode();
    if (mode === "menu") {
      if (!fired) onInput({ kind: "confirm" });
    } else if (mode === "hold") onInput({ kind: "space", down: false, at: audioTime(e.timeStamp) });
  };
  canvas.addEventListener("pointerup", up);
  canvas.addEventListener("pointercancel", up);
}
