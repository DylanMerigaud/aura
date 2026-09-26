// "TAP TO START" gate: the one user gesture that unlocks audio (initAudio + ctx.resume) before
// anything else runs. Confirms on pointerup, not pointerdown (v1 lesson: only the release counts
// reliably as a user gesture for the audio unlock on iOS), or on any keydown.
import { ctx, initAudio, wake } from "../../audio/engine";
import { el } from "./dom";

export function buildGate(onReady: () => void) {
  const root = el("section", "screen gate");
  root.appendChild(el("h1", "logo", "AURA"));
  root.appendChild(el("p", "gate-prompt", "TAP TO START"));

  let done = false;
  async function unlock() {
    if (done) return;
    done = true;
    initAudio();
    try {
      await ctx.resume();
    } catch {
      /* the next wake() on visibilitychange retries */
    }
    wake();
    onReady();
  }

  root.addEventListener("pointerup", unlock);
  function onKey() {
    unlock();
  }

  return { root, onKey };
}
