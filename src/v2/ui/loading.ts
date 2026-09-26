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

  // Three big jobs settle in steps: a time floor easing toward 85 percent keeps the bar moving between them,
  // so a phone on a slow network never looks frozen on 0 percent.
  let real = 0;
  let shown = -1;
  const t0 = Date.now();
  function render() {
    const floor = 0.85 * (1 - Math.exp(-(Date.now() - t0) / 5000));
    const f = Math.min(1, Math.max(real, floor));
    if (Math.round(f * 100) === shown) return;
    shown = Math.round(f * 100);
    fill.style.transform = `scaleX(${f})`;
    label.textContent = `LOADING ${shown}%`;
  }
  let timer: ReturnType<typeof setInterval> | null = setInterval(render, 150);
  function set(fraction: number) {
    real = Math.min(1, Math.max(0, fraction || 0));
    render();
    if (real >= 1 && timer) {
      clearInterval(timer);
      timer = null;
    }
  }

  return { root, set };
}
