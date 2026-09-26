// Battle input, MOBILE ONLY (addendum 17:15): pointer gestures on the full window canvas, no keys.
// A press records its start and its mode; a mash tap and a hold press fire on the press, a swipe (HIT,
// or the 67's release swipe up) fires on the lift with the pointerup timestamp, a hold ends on its lift.
// Desktop is for testing only: the mouse drives the same pointer path. Pauses on visibilitychange.
import type { GameApi } from "../contracts";
import { heardTime } from "../../audio/engine";
import { onLift, onPress, RELEASE_BEATS, zoneMode, type Decision, type ZoneMode } from "./touch";

/** Optional getters the v2 Game exposes beyond GameApi (turn, mash release beat). */
type ZoneGame = GameApi & { turn?(): "player" | "opponent"; releasing?(beats: number): boolean };

/** The play zone's current mode, read from the game. */
export function currentZone(game: GameApi): ZoneMode {
  const g = game as ZoneGame;
  return zoneMode(game.touchMode(), g.turn?.() ?? "player", g.releasing?.(RELEASE_BEATS) ?? false);
}

function vibrate(ms: number) {
  if (typeof navigator !== "undefined" && "vibrate" in navigator) navigator.vibrate(ms);
}

export function bindBattleInput(canvas: HTMLCanvasElement, game: GameApi) {
  /** Live pointers: where and in which mode they pressed, and what the press fired. */
  const presses = new Map<number, { x: number; y: number; mode: ZoneMode; fired: Decision }>();
  let bound = false;

  function send(d: Decision, ts: number) {
    if (!d) return;
    const at = heardTime(ts);
    if (d.kind === "tap") game.input({ kind: "tap", down: true, at });
    else if (d.kind === "dir") game.input({ kind: "dir", dir: d.dir, at });
    else game.input({ kind: "space", down: d.down, at });
  }

  function onDown(e: PointerEvent) {
    e.preventDefault();
    try { canvas.setPointerCapture(e.pointerId); } catch { /* synthetic pointer */ }
    const r = canvas.getBoundingClientRect();
    const mode = currentZone(game);
    const fired = onPress(mode, (e.clientX - r.left) / Math.max(1, r.width));
    presses.set(e.pointerId, { x: e.clientX, y: e.clientY, mode, fired });
    if (fired?.kind === "dir") vibrate(8);
    send(fired, e.timeStamp);
  }
  function onUp(e: PointerEvent) {
    const p = presses.get(e.pointerId);
    if (!p) return;
    presses.delete(e.pointerId);
    const d = onLift(p.mode, e.clientX - p.x, e.clientY - p.y, p.fired);
    if (d?.kind === "dir") vibrate(8);
    send(d, e.timeStamp);
  }
  function onVisibility() {
    if (document.hidden) game.pause();
    else game.resume();
  }

  function show() {
    if (bound) return;
    bound = true;
    presses.clear();
    const a = document.activeElement;
    if (a instanceof HTMLElement) a.blur();
    canvas.addEventListener("pointerdown", onDown);
    canvas.addEventListener("pointerup", onUp);
    canvas.addEventListener("pointercancel", onUp);
    document.addEventListener("visibilitychange", onVisibility);
  }
  function hide() {
    if (!bound) return;
    bound = false;
    canvas.removeEventListener("pointerdown", onDown);
    canvas.removeEventListener("pointerup", onUp);
    canvas.removeEventListener("pointercancel", onUp);
    document.removeEventListener("visibilitychange", onVisibility);
    presses.clear();
  }

  return { show, hide };
}
