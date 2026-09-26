// Title menu (amendment 6 section 5, reached from the MENU corner button of the title scene, never
// on the way in): PLAY to the map, LOADOUT (a greyed item
// plays the cancel blip and shakes), SETTINGS for calibration, volume and controls. Touch taps the
// item directly; on desktop arrows move and enter confirms, escape or BACK returns to the scene.
import type { LevelV2 } from "../contracts";
import { sfx } from "../../audio/sfx";
import { el, replay } from "./dom";
import type { ProgressV2 } from "./progress";

export interface TitleHandlers {
  play(): void;
  settings(): void;
  /** Loadout is playable read only once the whole campaign has at least one star everywhere. */
  loadout(): void;
  /** Back to the title scene. */
  back(): void;
}

interface Item {
  root: HTMLButtonElement;
  enabled: boolean;
  action: () => void;
}

export function buildTitle(levels: LevelV2[], progress: () => ProgressV2, on: TitleHandlers) {
  const root = el("section", "screen title");
  const backBtn = el("button", "corner-btn title-back", "BACK");
  backBtn.type = "button";
  backBtn.addEventListener("click", () => {
    sfx.tick();
    on.back();
  });
  root.appendChild(backBtn);
  root.appendChild(el("h1", "logo", "AURA"));

  const subtitle = el("p", "subtitle");
  root.appendChild(subtitle);

  const list = el("div", "menu");
  root.appendChild(list);

  function campaignDone(p: ProgressV2): boolean {
    return levels.every((L) => (p.best[L.id]?.stars ?? 0) > 0);
  }

  function refresh() {
    const p = progress();
    const won = levels.filter((L) => (p.best[L.id]?.stars ?? 0) > 0);
    subtitle.textContent = won.length ? `current title: ${won[won.length - 1].title}` : "you have zero aura. fix that.";
    const done = campaignDone(p);
    loadoutItem.enabled = done;
    loadoutItem.root.classList.toggle("disabled", !done);
    loadoutItem.root.querySelector(".hint")!.textContent = done ? "read only" : "unlock: finish the campaign";
  }

  function makeItem(label: string, hint: string, enabled: boolean, action: () => void): Item {
    const btn = el("button", "menu-item" + (enabled ? "" : " disabled"));
    btn.type = "button";
    btn.appendChild(el("span", "label", label));
    btn.appendChild(el("span", "hint", hint));
    const item: Item = { root: btn, enabled, action };
    btn.addEventListener("click", () => {
      idx = items.indexOf(item);
      paint();
      select(item);
    });
    list.appendChild(btn);
    return item;
  }

  const playItem = makeItem("PLAY", "the world tour", true, on.play);
  const loadoutItem = makeItem("LOADOUT", "your fighter and your emote", true, on.loadout);
  const settingsItem = makeItem("SETTINGS", "calibration, volume, controls", true, on.settings);
  const items: Item[] = [playItem, loadoutItem, settingsItem];
  let idx = 0;

  function paint() {
    items.forEach((it, i) => it.root.classList.toggle("selected", i === idx));
  }

  function select(item: Item) {
    if (!item.enabled) {
      sfx.thud();
      replay(item.root, "shake");
      return;
    }
    sfx.snap();
    item.action();
  }

  function move(d: 1 | -1) {
    idx = (idx + d + items.length) % items.length;
    sfx.tick();
    paint();
  }

  function onKey(e: KeyboardEvent) {
    if (e.code === "ArrowDown" || e.code === "ArrowRight") move(1);
    else if (e.code === "ArrowUp" || e.code === "ArrowLeft") move(-1);
    else if (e.code === "Enter" || e.code === "Space") select(items[idx]);
    else if (e.code === "Escape") on.back();
  }

  paint();
  return {
    root,
    onKey,
    show() {
      refresh();
      idx = 0;
      paint();
    },
  };
}
