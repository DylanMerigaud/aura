// Battle input, TAP ONLY. Keyboard: keydown AND keyup on window in the capture phase while the battle
// runs, independent of focus (the focused button is blurred at battle start) and stopped there so no
// screen handler or focused button eats the key: any key is a tap. Touch and mouse: a press anywhere
// on the full window canvas is a tap down, the lift of the last finger the tap up (./touch).
// Pauses on visibilitychange; the game resumes with its own count in.
import type { GameApi } from "../contracts";
import { heardTime } from "../../audio/engine";
import { lift, newTapState, press, RELEASE_BEATS, routeKey, zoneMode, type ZoneMode } from "./touch";

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
  let taps = newTapState();
  let bound = false;

  function onKeyEvent(e: KeyboardEvent) {
    const r = routeKey(taps, e, heardTime);
    if (!r.prevent) return;
    e.preventDefault();
    e.stopImmediatePropagation();
    if (r.input) game.input(r.input);
  }

  function onDown(e: PointerEvent) {
    e.preventDefault();
    try { canvas.setPointerCapture(e.pointerId); } catch { /* synthetic pointer */ }
    press(taps, `p${e.pointerId}`);
    if (currentZone(game) === "mash") vibrate(8);
    game.input({ kind: "tap", down: true, at: heardTime(e.timeStamp) });
  }
  function onUp(e: PointerEvent) {
    if (!lift(taps, `p${e.pointerId}`)) return;
    game.input({ kind: "tap", down: false, at: heardTime(e.timeStamp) });
  }
  function onVisibility() {
    if (document.hidden) game.pause();
    else game.resume();
  }

  function show() {
    if (bound) return;
    bound = true;
    taps = newTapState();
    // A focused menu button would turn a key into a click: nothing keeps focus in battle.
    const a = document.activeElement;
    if (a instanceof HTMLElement) a.blur();
    canvas.addEventListener("pointerdown", onDown);
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
    canvas.removeEventListener("pointerup", onUp);
    canvas.removeEventListener("pointercancel", onUp);
    removeEventListener("keydown", onKeyEvent, true);
    removeEventListener("keyup", onKeyEvent, true);
    document.removeEventListener("visibilitychange", onVisibility);
    taps = newTapState();
  }

  return { show, hide };
}
