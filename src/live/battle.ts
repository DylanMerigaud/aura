// The TikTok LIVE badge bound to a battle: created on the first count in click, torn down after the end.
// The cut down battle HUD keeps only the LIVE badge and the viewer count, small in a corner; the viewers
// follow the aura meter and the combo, and jump on a win.
import { createLiveUI, type LiveUI } from "./index";
import type { CoreEvent, Frame, Listener } from "../v2/contracts";

export const PLAYER_HANDLE = "@zero_aura_andy";

/** Viewer count for a meter in [-1, 1] and a combo: 2K at even, up to about 90K on a long winning streak. */
export function viewersFor(meter: number, combo: number): number {
  const base = 2000 + (meter + 1) * 14000;
  return Math.round(base * (1 + Math.min(combo, 50) / 25));
}

export function liveListener(parent: HTMLElement, opponentHandle: () => string): Listener & { stop(): void } {
  let live: LiveUI | null = null;
  let runs = 0;
  let lastViewers = 0;
  let viewersAt = 0;
  let teardown: number | undefined;

  function stop() {
    if (teardown !== undefined) clearTimeout(teardown);
    teardown = undefined;
    live?.destroy();
    live = null;
  }

  function start() {
    stop();
    runs++;
    live = createLiveUI(parent, { playerHandle: PLAYER_HANDLE, opponentHandle: opponentHandle(), seed: `run-${runs}`, minimal: true });
    lastViewers = viewersFor(0, 0);
    live.setViewers(lastViewers);
  }

  function event(e: CoreEvent) {
    if (e.kind === "countIn" && e.n === 4 && (!live || teardown !== undefined)) start();
    if (!live || e.kind !== "end") return;
    if (e.win) live.setViewers(Math.max(lastViewers * 2, 120000));
    teardown = window.setTimeout(stop, 3200);
  }

  function frame(f: Frame) {
    if (!live || teardown !== undefined) return;
    const now = performance.now();
    if (now - viewersAt < 1000) return;
    viewersAt = now;
    const v = viewersFor(f.meter, f.combo);
    if (Math.abs(v - lastViewers) / Math.max(1, lastViewers) > 0.04) {
      lastViewers = v;
      live.setViewers(v);
    }
  }

  return { event, frame, stop };
}
