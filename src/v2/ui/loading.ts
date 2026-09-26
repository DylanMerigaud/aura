// LOADING (addendum 15:20): the first thing shown, automatic. The AURA logo and a progress bar over
// an opaque backdrop while level 1's rigs, clips, music and voices preload, so the game never shows
// a half loaded scene. app.ts feeds it the settled fraction of the real preload promises.
import { el } from "./dom";

export function buildLoading() {
  const root = el("section", "screen loading");
  root.appendChild(el("h1", "logo", "AURA"));
  const bar = el("div", "loading-bar");
  const fill = el("div", "loading-fill");
  bar.appendChild(fill);
  root.appendChild(bar);
  const label = el("p", "loading-label", "LOADING 0%");
  root.appendChild(label);

  function set(fraction: number) {
    const f = Math.min(1, Math.max(0, fraction || 0));
    fill.style.transform = `scaleX(${f})`;
    label.textContent = `LOADING ${Math.round(f * 100)}%`;
  }

  return { root, set };
}
