// The visible, contextual play zone over the bottom of the screen, TAP ONLY: nothing on a HIT (the note
// flying to the ring is the cue), one big pad for the 67 mash, the same pad asking for the drop tap as
// the ring closes, the HOLD pad, dimmed with "HIS MOVE" on the opponent turn. Purely visual
// (pointer-events none): the canvas under it takes every tap anywhere on the screen.
import type { GameApi } from "../contracts";
import { el } from "./dom";
import { currentZone } from "./battleInput";
import type { ZoneMode } from "./touch";

export function buildPlayZone(game: GameApi) {
  const root = el("div", "playzone zone-none");
  root.setAttribute("aria-hidden", "true");
  const mash = el("div", "pz-pad pz-mash");
  mash.appendChild(el("span", "pz-big", "67"));
  mash.appendChild(el("span", "pz-small", "TAP TAP TAP"));
  const release = el("div", "pz-pad pz-release");
  release.appendChild(el("span", "pz-big", "TAP"));
  release.appendChild(el("span", "pz-small", "ON THE DROP"));
  const hold = el("div", "pz-pad pz-hold");
  hold.appendChild(el("span", "pz-big", "HOLD"));
  hold.appendChild(el("span", "pz-small", "LIFT ON THE BEAT"));
  const his = el("div", "pz-his", "HIS MOVE");
  for (const n of [mash, release, hold, his]) root.appendChild(n);

  let shown: ZoneMode = "none";
  /** Call every frame: switches the class only when the mode changes. */
  function frame() {
    const m = currentZone(game);
    if (m === shown) return;
    root.classList.remove(`zone-${shown}`);
    root.classList.add(`zone-${m}`);
    shown = m;
  }

  return { root, frame };
}
