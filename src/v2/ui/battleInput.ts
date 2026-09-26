// Battle input: keyboard (arrows/WASD, space) and one thumb touch on the full window canvas,
// routed by game.touchMode(). Pauses on visibilitychange and resumes with the game's own 3 beat
// count in. Vibrates on a judged hit is handled by the HUD (it hears every CoreEvent already).
import type { Dir } from "../../qte/types";
import type { GameApi } from "../contracts";
import { heardTime } from "../../audio/engine";
import { onPointerDown, swipeDir } from "./touch";

const KEYS: Record<string, Dir> = {
  ArrowUp: "up", ArrowDown: "down", ArrowLeft: "left", ArrowRight: "right",
  KeyW: "up", KeyS: "down", KeyA: "left", KeyD: "right",
};

export function bindBattleInput(canvas: HTMLCanvasElement, game: GameApi) {
  let sx = 0, sy = 0, fired = false, active = false;
  const down = new Set<number>();

  function onKey(e: KeyboardEvent) {
    if (e.repeat) return;
    const dir = KEYS[e.code];
    if (dir) {
      e.preventDefault();
      game.input({ kind: "dir", dir, at: heardTime(e.timeStamp) });
    } else if (e.code === "Space") {
      e.preventDefault();
      game.input({ kind: "space", down: true, at: heardTime(e.timeStamp) });
    }
  }
  function onKeyUp(e: KeyboardEvent) {
    if (e.code === "Space") game.input({ kind: "space", down: false, at: heardTime(e.timeStamp) });
  }

  function onDown(e: PointerEvent) {
    e.preventDefault();
    down.add(e.pointerId);
    const mode = game.touchMode();
    if (down.size > 1 && mode === "hold") return;
    canvas.setPointerCapture(e.pointerId);
    const at = heardTime(e.timeStamp);
    const r = canvas.getBoundingClientRect();
    const fx = (e.clientX - r.left) / r.width;
    const fy = (e.clientY - r.top) / r.height;
    sx = e.clientX;
    sy = e.clientY;
    fired = false;
    active = true;
    const d = onPointerDown(mode, fx, fy);
    if (d) {
      fired = true;
      game.input(d.kind === "dir" ? { kind: "dir", dir: d.dir, at } : { kind: "space", down: d.down, at });
    }
  }
  function onMove(e: PointerEvent) {
    if (!active || fired || game.touchMode() !== "hit") return;
    const dx = e.clientX - sx;
    const dy = e.clientY - sy;
    const dir = swipeDir(dx, dy);
    if (!dir) return;
    fired = true;
    game.input({ kind: "dir", dir, at: heardTime(e.timeStamp) });
  }
  function onUp(e: PointerEvent) {
    down.delete(e.pointerId);
    if (!active || down.size) return;
    active = false;
    if (game.touchMode() === "hold") game.input({ kind: "space", down: false, at: heardTime(e.timeStamp) });
  }
  function onVisibility() {
    if (document.hidden) game.pause();
    else game.resume();
  }

  function show() {
    canvas.addEventListener("pointerdown", onDown);
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerup", onUp);
    canvas.addEventListener("pointercancel", onUp);
    addEventListener("keyup", onKeyUp);
    document.addEventListener("visibilitychange", onVisibility);
  }
  function hide() {
    canvas.removeEventListener("pointerdown", onDown);
    canvas.removeEventListener("pointermove", onMove);
    canvas.removeEventListener("pointerup", onUp);
    canvas.removeEventListener("pointercancel", onUp);
    removeEventListener("keyup", onKeyUp);
    document.removeEventListener("visibilitychange", onVisibility);
    active = false;
    down.clear();
  }

  return { onKey, show, hide };
}
