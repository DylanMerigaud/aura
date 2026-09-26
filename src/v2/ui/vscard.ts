// VS card: our silhouette against the opponent portrait, the level name, place and BPM, then a
// press to fight. A plain SVG silhouette stands in for the player (no player render asset is
// owned by this lane).
import type { LevelV2 } from "../contracts";
import { el } from "./dom";

const SILHOUETTE = `<svg viewBox="0 0 100 160" preserveAspectRatio="xMidYMax meet">
  <circle cx="50" cy="26" r="20" fill="currentColor" />
  <path d="M20 150 L26 78 Q28 58 50 58 Q72 58 74 78 L80 150 Z" fill="currentColor" />
</svg>`;

export function buildVsCard(base: string, onFight: () => void) {
  const root = el("section", "screen vscard");
  const stage = el("div", "vs-stage");
  const us = el("div", "vs-side us");
  us.innerHTML = SILHOUETTE;
  const versus = el("div", "vs-versus", "VS");
  const them = el("div", "vs-side them");
  const themArt = el("div", "vs-portrait");
  them.appendChild(themArt);
  stage.appendChild(us);
  stage.appendChild(versus);
  stage.appendChild(them);
  root.appendChild(stage);

  const info = el("div", "vs-info");
  const name = el("h2", "vs-level-name");
  const place = el("p", "vs-place");
  const bpm = el("p", "vs-bpm");
  const prompt = el("p", "vs-prompt", "PRESS SPACE OR TAP TO FIGHT");
  info.appendChild(name);
  info.appendChild(place);
  info.appendChild(bpm);
  info.appendChild(prompt);
  root.appendChild(info);

  let armed = false;
  root.addEventListener("click", () => {
    if (armed) onFight();
  });
  function show(level: LevelV2) {
    themArt.style.backgroundImage = `url("${base}art/opp-${level.artKey}.jpg")`;
    them.style.setProperty("--opp-color", level.opponent.color || "#ff3df2");
    name.textContent = level.opponent.name.toUpperCase();
    place.textContent = level.place;
    bpm.textContent = `${level.bpm} BPM`;
    armed = false;
    setTimeout(() => (armed = true), 350);
  }

  function onKey(e: KeyboardEvent) {
    if (!armed) return;
    if (e.code === "Enter" || e.code === "Space") onFight();
  }

  return { root, onKey, show };
}
