// Battle input. Keyboard: keydown AND keyup on window in the capture phase while the battle runs,
// independent of focus (the focused button is blurred at battle start) and stopped there so no
// screen handler or focused button eats Space or Enter. Touch: the full window canvas, routed by
// the pure zone logic in ./touch (bottom 55 percent play zone, swipe, mash pads, RELEASE pad, hold,
// opponent turn ignored). Pauses on visibilitychange; the game resumes with its own count in.
import type { GameApi } from "../contracts";
import { heardTime } from "../../audio/engine";
import { newKeyState, onPointerDown, RELEASE_BEATS, routeKey, swipeDir, tracksSwipe, zoneMode, type ZoneMode } from "./touch";

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
  let keys = newKeyState();
  /** Pointers tracked for a swipe (HIT): start point and whether the swipe already fired. */
  const swipes = new Map<number, { x: number; y: number; fired: boolean }>();
  /** The pointer holding the space input down (HOLD or RELEASE pad); its lift is the release. */
  let spacePointer: number | null = null;
  let bound = false;

  function onKeyEvent(e: KeyboardEvent) {
    const r = routeKey(keys, e, heardTime);
    if (!r.prevent) return;
    e.preventDefault();
    e.stopImmediatePropagation();
    if (r.input) game.input(r.input);
  }

  function frac(e: PointerEvent) {
    const r = canvas.getBoundingClientRect();
    return { fx: (e.clientX - r.left) / r.width, fy: (e.clientY - r.top) / r.height };
  }

  function onDown(e: PointerEvent) {
    e.preventDefault();
    const mode = currentZone(game);
    const { fx, fy } = frac(e);
    try { canvas.setPointerCapture(e.pointerId); } catch { /* synthetic pointer */ }
    if (tracksSwipe(mode, fy)) {
      swipes.set(e.pointerId, { x: e.clientX, y: e.clientY, fired: false });
      return;
    }
    const d = onPointerDown(mode, fx, fy);
    if (!d) return;
    const at = heardTime(e.timeStamp);
    if (d.kind === "dir") {
      vibrate(8);
      game.input({ kind: "dir", dir: d.dir, at });
    } else if (spacePointer === null) {
      spacePointer = e.pointerId;
      game.input({ kind: "space", down: true, at });
    }
  }
  function onMove(e: PointerEvent) {
    const s = swipes.get(e.pointerId);
    if (!s || s.fired) return;
    const dir = swipeDir(e.clientX - s.x, e.clientY - s.y);
    if (!dir) return;
    s.fired = true;
    if (currentZone(game) === "opponent") return;
    game.input({ kind: "dir", dir, at: heardTime(e.timeStamp) });
  }
  function onUp(e: PointerEvent) {
    swipes.delete(e.pointerId);
    if (e.pointerId !== spacePointer) return;
    spacePointer = null;
    game.input({ kind: "space", down: false, at: heardTime(e.timeStamp) });
  }
  function onVisibility() {
    if (document.hidden) game.pause();
    else game.resume();
  }

  function show() {
    if (bound) return;
    bound = true;
    keys = newKeyState();
    swipes.clear();
    spacePointer = null;
    // A focused menu button would turn Space or Enter into a click: nothing keeps focus in battle.
    const a = document.activeElement;
    if (a instanceof HTMLElement) a.blur();
    canvas.addEventListener("pointerdown", onDown);
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerup", onUp);
    canvas.addEventListener("pointercancel", onUp);
    addEventListener("keydown", onKeyEvent, true);
    addEventListener("keyup", onKeyEvent, true);
    document.addEventListener("visibilitychange", onVisibility);
  }
  function hide() {
    if (!bound) return;
    bound = false;
    canvas.removeEventListener("pointerdown", onDown);
    canvas.removeEventListener("pointermove", onMove);
    canvas.removeEventListener("pointerup", onUp);
    canvas.removeEventListener("pointercancel", onUp);
    removeEventListener("keydown", onKeyEvent, true);
    removeEventListener("keyup", onKeyEvent, true);
    document.removeEventListener("visibilitychange", onVisibility);
    keys = newKeyState();
    swipes.clear();
    spacePointer = null;
  }

  return { show, hide };
}
