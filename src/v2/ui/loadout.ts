// Loadout (addendum 16:15 point 2): pick your fighter from the rig pool and your victory emote from the Aura
// Packs you own. Big cards, one tap to pick, saved at once. Portraits are in engine captures of the real rigs
// (src/loadout/preview.ts), never a generated face. Reached from a small button on the title and the results.
import { CATALOG, equip, getEquipped, getInventory } from "../../packs";
import { CHARACTER_POOL, getLoadout, setLoadout } from "../../loadout/state";
import { disposePreviews, portrait } from "../../loadout/preview";
import "../../loadout/loadout.css";
import { el } from "./dom";

export function buildLoadout(onBack: () => void, base = "") {
  const root = el("section", "screen loadout lo");
  root.appendChild(el("h2", "lo-title", "LOADOUT"));
  root.appendChild(el("p", "lo-label", "FIGHTER"));
  const fighters = el("div", "lo-fighters");
  root.appendChild(fighters);
  root.appendChild(el("p", "lo-label", "VICTORY EMOTE"));
  const emotes = el("div", "lo-emotes");
  root.appendChild(emotes);
  const back = el("button", "lo-back", "DONE");
  back.type = "button";
  back.addEventListener("click", onBack);
  root.appendChild(back);

  const cards = CHARACTER_POOL.map((c, i) => {
    const b = el("button", "lo-card");
    b.type = "button";
    const img = el("img", "lo-img");
    img.alt = c.name;
    b.appendChild(img);
    b.appendChild(el("span", "lo-name", c.name));
    b.addEventListener("click", () => {
      setLoadout({ character: c.file });
      paint();
    });
    fighters.appendChild(b);
    return { c, b, img, i };
  });

  const emoteItems = CATALOG.filter((it) => it.kind === "emote");
  const chips = emoteItems.map((it) => {
    const b = el("button", `lo-chip r-${it.rarity}`, it.name);
    b.type = "button";
    b.addEventListener("click", () => {
      if (equip(it.id)) {
        setLoadout({ emote: it.id });
        paint();
      } else b.animate?.([{ transform: "translateX(-4px)" }, { transform: "translateX(4px)" }, { transform: "none" }], 180);
    });
    emotes.appendChild(b);
    return { it, b };
  });

  function paint() {
    const lo = getLoadout();
    const chosen = lo.character ?? CHARACTER_POOL[0].file;
    for (const { c, b } of cards) b.classList.toggle("picked", c.file === chosen);
    const owned = new Set(getInventory().emotes.map((e) => e.id));
    const equipped = getEquipped()?.id;
    for (const { it, b } of chips) {
      b.classList.toggle("locked", !owned.has(it.id));
      b.classList.toggle("picked", it.id === equipped);
      b.title = owned.has(it.id) ? it.name : "open Aura Packs to unlock";
    }
  }

  function show() {
    paint();
    for (const { c, img } of cards) {
      if (img.src) continue;
      portrait(base, c.file)
        .then((u) => (img.src = u))
        .catch(() => img.classList.add("missing"));
    }
  }

  function onKey(e: KeyboardEvent) {
    if (e.code === "Escape" || e.code === "Enter") onBack();
  }

  return { root, onKey, show, hide: disposePreviews };
}
