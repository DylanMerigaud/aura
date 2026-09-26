// The visible, contextual play zone over the bottom of the screen, MOBILE ONLY: nothing on a HIT (the arrow
// flying to the ring is the cue), one big pad for the 67 mash, the same pad asking for the drop tap as
// the ring closes, the HOLD pad, dimmed on the opponent turn (no turn card, addendum 17:50). Purely visual
// (pointer-events none): the canvas under it takes every tap anywhere on the screen.
// Each hint disappears for the rest of the session after the first success of its kind (the mash
// pads after a graded MASH release, the hold pad after a graded HOLD), and the pad outline fades
// after the first hit. Session only: a module level Set, never localStorage.
import type { CoreEvent, GameApi } from "../contracts";
import { el } from "./dom";
import { currentZone } from "./battleInput";
import type { ZoneMode } from "./touch";

export type HintKind = "tap" | "mash" | "hold";
const learned = new Set<HintKind>();

/** The hint kind a core event teaches (a success of that kind), or null. Pure. */
export function lessonOf(e: CoreEvent): HintKind | null {
  if (e.kind === "judged") return e.grade !== "miss" && !e.cringe ? "tap" : null;
  if (e.kind === "release") return e.grade !== "miss" ? "mash" : null;
  if (e.kind === "holdEnd") return e.grade !== "miss" ? "hold" : null;
  return null;
}

/** Record a lesson; true when it is new this session. */
export function learn(e: CoreEvent): boolean {
  const k = lessonOf(e);
  if (!k || learned.has(k)) return false;
  learned.add(k);
  return true;
}

export function hasLearned(k: HintKind): boolean {
  return learned.has(k);
}

/** Tests only: forget the session's lessons. */
export function resetLessons() {
  learned.clear();
}

export function buildPlayZone(game: GameApi) {
  const root = el("div", "playzone zone-none");
  root.setAttribute("aria-hidden", "true");
  const mash = el("div", "pz-pad pz-mash");
  mash.appendChild(el("span", "pz-big", "67"));
  mash.appendChild(el("span", "pz-small", "TAP LEFT RIGHT"));
  const release = el("div", "pz-pad pz-release");
  release.appendChild(el("span", "pz-big", "SWIPE UP"));
  release.appendChild(el("span", "pz-small", "ON THE DROP"));
  const hold = el("div", "pz-pad pz-hold");
  hold.appendChild(el("span", "pz-big", "HOLD"));
  hold.appendChild(el("span", "pz-small", "LIFT ON THE BEAT"));
  for (const n of [mash, release, hold]) root.appendChild(n);

  function syncLearned() {
    for (const k of ["tap", "mash", "hold"] as HintKind[]) root.classList.toggle(`learned-${k}`, learned.has(k));
  }
  syncLearned();

  /** Forwarded core events: the first success of a kind retires its hint for the session. */
  function event(e: CoreEvent) {
    if (learn(e)) syncLearned();
  }

  let shown: ZoneMode = "none";
  /** Call every frame: switches the class only when the mode changes. */
  function frame() {
    const m = currentZone(game);
    if (m === shown) return;
    root.classList.remove(`zone-${shown}`);
    root.classList.add(`zone-${m}`);
    shown = m;
  }

  return { root, frame, event };
}
