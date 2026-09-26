// Battle HUD: assembles the meter/score/combo/tachometer bar, the QTE prompt layer and the
// popups into one Listener the lead registers with game.listen(). Letterbox is the stage's job,
// not duplicated here.
import type { CoreEvent, Frame, LevelV2, Listener } from "../../contracts";
import { el } from "../dom";
import { buildMeter } from "./meter";
import { buildPrompts } from "./prompts";
import { buildPopups } from "./popups";

export function buildHud(base: string) {
  const root = el("div", "hud screen");
  const meter = buildMeter();
  const prompts = buildPrompts();
  const popups = buildPopups(base);
  root.appendChild(meter.root);
  root.appendChild(prompts.root);
  root.appendChild(popups.root);
  // Between the FIGHT tap and the first count in click (models, track): never a silent black wait.
  const loading = el("div", "hud-loading hidden", "LOADING");
  root.appendChild(loading);

  let level: LevelV2 | null = null;

  /** Called by app.ts right before game.play(): resets transient state and level context. */
  function prepare(l: LevelV2) {
    level = l;
    root.classList.remove("shown");
    loading.classList.remove("hidden");
    popups.reset();
  }

  function vibrate(ms: number) {
    if ("vibrate" in navigator) navigator.vibrate(ms);
  }

  const listener: Listener = {
    event(e: CoreEvent) {
      if (e.kind === "countIn") loading.classList.add("hidden");
      if (e.kind === "countIn" && e.n === 1) root.classList.add("shown");
      if (level) popups.event(e, level);
      if (e.kind === "judged" && e.grade !== "miss") vibrate(e.big ? 30 : 15);
      else if (e.kind === "release" || e.kind === "drop") vibrate(45);
      if (e.kind === "end") root.classList.remove("shown");
    },
    frame(f: Frame, realDt: number) {
      level = f.level;
      meter.frame(f, realDt);
      prompts.frame(f);
    },
  };

  return { root, listener, prepare };
}
