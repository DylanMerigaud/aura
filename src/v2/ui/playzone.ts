// The visible, contextual play zone over the bottom 55 percent of the screen: the swipe hint for
// arrows, the two mash pads, the merged RELEASE pad, the HOLD pad, dimmed with "HIS MOVE" on the
// opponent turn. Purely visual (pointer-events none): the canvas under it takes the touches and
// routes them with the same zone math (./touch), so what is drawn is what is accepted.
import type { GameApi } from "../contracts";
import { el } from "./dom";
import { currentZone } from "./battleInput";
import type { ZoneMode } from "./touch";

export function buildPlayZone(game: GameApi) {
  const root = el("div", "playzone zone-none");
  root.setAttribute("aria-hidden", "true");
  const swipe = el("div", "pz-swipe", "SWIPE");
  const left = el("div", "pz-pad pz-left", "L");
  const right = el("div", "pz-pad pz-right", "R");
  const release = el("div", "pz-pad pz-release", "RELEASE");
  const hold = el("div", "pz-pad pz-hold", "HOLD");
  const his = el("div", "pz-his", "HIS MOVE");
  for (const n of [swipe, left, right, release, hold, his]) root.appendChild(n);

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
