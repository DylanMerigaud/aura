// Campaign map (amendment 6 section 3), Candy Crush style: a winding path of 5 nodes over a
// blurred neon background, node 1 unlocked, the rest padlocked, stars under a cleared node, our
// pin hopping between nodes. Arrow keys move along the path, enter or space opens the VS card.
import type { LevelV2 } from "../contracts";
import { sfx } from "../../audio/sfx";
import { starGlyphs } from "./format";
import { el, replay } from "./dom";
import type { ProgressV2 } from "./progress";

// Percent positions, winding bottom to top like the sketch. Five nodes, one per level.
const SPOTS: [number, number][] = [
  [22, 84],
  [68, 70],
  [28, 52],
  [72, 33],
  [50, 13],
];

export function buildMap(levels: LevelV2[], base: string, progress: () => ProgressV2, onSelect: (index: number) => void) {
  const root = el("section", "screen map");
  const bg = el("div", "map-bg");
  bg.style.backgroundImage = `linear-gradient(rgba(5,2,15,0.55), rgba(5,2,15,0.75)), url("${base}art/title.jpg")`;
  root.appendChild(bg);
  root.appendChild(el("h2", "screen-title map-heading", "CAMPAIGN"));

  const path = el("div", "map-path");
  root.appendChild(path);
  const svgNs = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(svgNs, "svg");
  svg.setAttribute("class", "map-line");
  svg.setAttribute("viewBox", "0 0 100 100");
  svg.setAttribute("preserveAspectRatio", "none");
  const line = document.createElementNS(svgNs, "polyline");
  line.setAttribute("points", SPOTS.map(([x, y]) => `${x},${y}`).join(" "));
  line.setAttribute("class", "map-line-path");
  svg.appendChild(line);
  path.appendChild(svg);

  const pin = el("div", "map-pin", "\u{1F464}");
  path.appendChild(pin);

  const nodes = levels.map((L, i) => {
    const [x, y] = SPOTS[i] ?? SPOTS[SPOTS.length - 1];
    const btn = el("button", "map-node");
    btn.type = "button";
    btn.style.left = `${x}%`;
    btn.style.top = `${y}%`;
    const num = el("span", "map-node-num", String(L.id));
    const lock = el("span", "map-node-lock", "\u{1F512}");
    const stars = el("span", "map-node-stars");
    btn.appendChild(num);
    btn.appendChild(lock);
    btn.appendChild(stars);
    btn.addEventListener("click", () => select(i));
    path.appendChild(btn);
    return { btn, num, lock, stars };
  });

  let idx = 0;

  function unlockedCount(p: ProgressV2) {
    return Math.min(levels.length, Math.max(1, p.unlocked));
  }

  function refresh() {
    const p = progress();
    const unlocked = unlockedCount(p);
    nodes.forEach((n, i) => {
      const locked = i >= unlocked;
      n.btn.classList.toggle("locked", locked);
      n.lock.classList.toggle("hidden", !locked);
      n.num.classList.toggle("hidden", locked);
      const s = p.best[levels[i].id]?.stars ?? 0;
      n.stars.textContent = locked ? "" : starGlyphs(s as 0 | 1 | 2 | 3);
    });
    if (idx >= unlocked) idx = unlocked - 1;
    paint();
  }

  function paint() {
    nodes.forEach((n, i) => n.btn.classList.toggle("selected", i === idx));
    const [x, y] = SPOTS[idx] ?? SPOTS[0];
    pin.style.left = `${x}%`;
    pin.style.top = `${y}%`;
  }

  function select(i: number) {
    idx = i;
    paint();
    const p = progress();
    if (i >= unlockedCount(p)) {
      sfx.thud();
      replay(nodes[i].btn, "shake");
      return;
    }
    sfx.snap();
    onSelect(i);
  }

  function move(d: 1 | -1) {
    const p = progress();
    const n = unlockedCount(p);
    idx = (idx + d + n) % n;
    sfx.tick();
    paint();
  }

  function onKey(e: KeyboardEvent) {
    if (e.code === "ArrowRight" || e.code === "ArrowDown") move(1);
    else if (e.code === "ArrowLeft" || e.code === "ArrowUp") move(-1);
    else if (e.code === "Enter" || e.code === "Space") select(idx);
  }

  return {
    root,
    onKey,
    show() {
      refresh();
    },
  };
}
