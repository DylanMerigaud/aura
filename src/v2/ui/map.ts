// Campaign screen: the AURA WORLD TOUR map (src/map, docs/map.md). Five stops; Chatelet is the one playable
// level, the other four are names on the map behind a padlock and a SOON stamp. The WebGL map exists only
// while this screen shows: show() builds it, hide() destroys it, so the battle stage keeps the GPU to itself.
import type { LevelV2 } from "../contracts";
import { createMap, DEFAULT_STOPS, type MapHandle } from "../../map/index";
import "../../map/map.css";
import { el } from "./dom";
import type { ProgressV2 } from "./progress";

/** Only the first stop is built; the map never unlocks another one. */
const PLAYABLE = DEFAULT_STOPS[0].id;

export function buildMap(levels: LevelV2[], _base: string, progress: () => ProgressV2, onSelect: (index: number) => void) {
  const root = el("section", "screen map aura-map");
  const canvas = document.createElement("canvas");
  canvas.className = "aura-map__canvas";
  root.appendChild(canvas);
  root.appendChild(el("div", "aura-map__veil"));
  root.appendChild(el("h1", "aura-map__title", "AURA WORLD TOUR"));
  const touch = typeof matchMedia === "function" && matchMedia("(pointer: coarse)").matches;
  root.appendChild(el("p", "aura-map__hint", touch ? "TAP CHATELET" : "ENTER TO PLAY CHATELET"));

  let map: MapHandle | null = null;
  const onResize = () => map?.resize();

  function hide() {
    removeEventListener("resize", onResize);
    map?.destroy();
    map = null;
  }

  function show() {
    hide();
    const level = levels[0];
    const stars = Math.max(0, Math.min(3, level ? (progress().best[level.id]?.stars ?? 0) : 0));
    // The screen becomes visible in the same frame: size the canvas once layout has run.
    requestAnimationFrame(() => {
      if (map || !root.isConnected) return;
      map = createMap(canvas, {
        stops: DEFAULT_STOPS,
        unlocked: [PLAYABLE],
        stars: { [PLAYABLE]: stars },
        onSelect: (id) => {
          if (id === PLAYABLE) onSelect(0);
        },
        onLocked: () => {},
      });
      map.resize();
      addEventListener("resize", onResize);
    });
  }

  function onKey(e: KeyboardEvent) {
    if (e.code === "Enter" || e.code === "Space") onSelect(0);
  }

  return { root, onKey, show, hide };
}
