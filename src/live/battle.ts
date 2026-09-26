// The TikTok LIVE overlay bound to a battle: created on the first count in click, fed by the core events,
// torn down after the end. Viewers follow the aura meter and the combo; the chat is the seeded picker, with
// the partner models dropping in as regulars (Gemini wrote the cast, Lyria the track, Gradium the voices).
import { createLiveUI, type LiveUI } from "./index";
import { createPicker } from "./comments";
import type { CoreEvent, Frame, Listener } from "../v2/contracts";

export const PLAYER_HANDLE = "@zero_aura_andy";

/** Partner easter eggs: [handle, line]. Rotated, one every few bars, never two in a row. */
export const PARTNER_CAMEOS: [string, string][] = [
  ["@gemini.3.1.pro", "i wrote his taunts ngl"],
  ["@lyria_on_the_beat", "this beat is mine btw"],
  ["@gradium.voice", "i do the voices fr"],
  ["@gemini.flash", "roast loading..."],
  ["@lyria_on_the_beat", "wait for the drop"],
  ["@gradium.voice", "announcer is me lol"],
];

/** Viewer count for a meter in [-1, 1] and a combo: 2K at even, up to about 90K on a long winning streak. */
export function viewersFor(meter: number, combo: number): number {
  const base = 2000 + (meter + 1) * 14000;
  return Math.round(base * (1 + Math.min(combo, 50) / 25));
}

export function liveListener(parent: HTMLElement, opponentHandle: () => string): Listener & { stop(): void } {
  let live: LiveUI | null = null;
  let picker = createPicker("aura");
  let runs = 0;
  let cameo = 0;
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
    const seed = `run-${runs}`;
    picker = createPicker(seed);
    live = createLiveUI(parent, { playerHandle: PLAYER_HANDLE, opponentHandle: opponentHandle(), seed });
    lastViewers = viewersFor(0, 0);
    live.setViewers(lastViewers);
  }

  function event(e: CoreEvent) {
    if (e.kind === "countIn" && e.n === 4 && (!live || teardown !== undefined)) start();
    if (!live) return;
    switch (e.kind) {
      case "judged":
        if (e.cringe) live.event("cringe");
        else if (e.grade === "perfect") live.event("perfect");
        else if (e.grade === "great") live.event("great");
        else if (e.grade === "miss") live.event("miss");
        if (!e.cringe && e.grade !== "miss" && (e.combo === 10 || e.combo === 25 || e.combo === 50)) live.event("combo");
        break;
      case "release":
        live.event("release", { tier: Math.min(3, 1 + Math.floor(e.burst / 20)) });
        break;
      case "taunt":
        live.event("taunt", { handle: opponentHandle(), text: e.text });
        break;
      case "beat":
        // A calm bar gets a chat line; every fourth bar a partner cameo.
        if (e.downbeat && e.bar % 2 === 1) {
          if (e.bar % 8 === 7) {
            const [h, t] = PARTNER_CAMEOS[cameo++ % PARTNER_CAMEOS.length];
            live.comment(h, t);
          } else live.comment(picker.handle(), picker.comment("idle"));
        }
        break;
      case "end":
        live.event(e.win ? "win" : "lose");
        if (e.win) live.setViewers(Math.max(lastViewers * 2, 120000));
        teardown = window.setTimeout(stop, 3200);
        break;
      default:
        break;
    }
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
