// Loadout: greyed out until the campaign is finished, then a read only preview of the four move
// cards (amendment 6 section 5). No progression system to spend on, on purpose: this is a
// hackathon campaign, the preview is the reward.
import { el } from "./dom";

const CARDS: [string, string][] = [
  ["HIT", "press the arrow when it lands in the ring."],
  ["COMBO", "type the sequence in order, the last one on the beat."],
  ["HOLD", "press and hold, release exactly on time."],
  ["MASH", "alternate left and right, then release for the burst."],
];

export function buildLoadout(onBack: () => void) {
  const root = el("section", "screen loadout");
  root.appendChild(el("h2", "screen-title", "LOADOUT"));
  root.appendChild(el("p", "subtitle", "read only, unlocked by finishing the campaign"));
  const grid = el("div", "loadout-grid");
  for (const [name, desc] of CARDS) {
    const card = el("div", "loadout-card");
    card.appendChild(el("h3", "loadout-card-name", name));
    card.appendChild(el("p", "loadout-card-desc", desc));
    grid.appendChild(card);
  }
  root.appendChild(grid);
  root.appendChild(el("p", "results-prompt", "PRESS ESCAPE OR TAP TO GO BACK"));
  root.addEventListener("click", onBack);

  function onKey(e: KeyboardEvent) {
    if (e.code === "Escape" || e.code === "Enter" || e.code === "Space") onBack();
  }

  return { root, onKey };
}
