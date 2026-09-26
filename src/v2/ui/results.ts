// Results (amendment 10 and addendum 15:20: under 1 s after the end, retry is one input). Timing grade
// counts, accuracy, best burst, stars, the title unlocked, then a live roast (fetchRoast, under 3 s) or
// the level's own announcer line while it is not back yet. Four big buttons: RETRY (the default: any
// key or a tap on it), PACK (the Aura Packs opening, once per result), MAP (the world tour), SHARE
// (Web Share, else the link copied).
import type { LevelV2, Stats } from "../contracts";
import { starGlyphs } from "./format";
import { el, replay } from "./dom";
import { fetchRoast, speakLive } from "../net/live";
import { isTapKey, shareData, shareUrl, type ShareData } from "./flow";

export interface ResultsHandlers {
  retry(): void;
  map(): void;
  /** Opens the pack; resolves when its overlay closed. */
  pack(stats: Stats, level: LevelV2): Promise<void>;
}

/** Hook for the later share card: return an image File to attach to the Web Share call, or null. */
export let shareCard: ((stats: Stats, level: LevelV2) => Promise<File | null>) | null = null;
export function setShareCard(fn: typeof shareCard) {
  shareCard = fn;
}

async function share(data: ShareData, stats: Stats, level: LevelV2): Promise<"shared" | "copied" | "failed"> {
  const nav = typeof navigator !== "undefined" ? navigator : null;
  if (nav && typeof nav.share === "function") {
    try {
      const file = shareCard ? await shareCard(stats, level).catch(() => null) : null;
      const payload: ShareData & { files?: File[] } = { ...data };
      if (file && typeof nav.canShare === "function" && nav.canShare({ files: [file] })) payload.files = [file];
      await nav.share(payload);
      return "shared";
    } catch (err) {
      // The player closed the sheet: that is an answer, not a reason to copy behind their back.
      if ((err as { name?: string })?.name === "AbortError") return "failed";
    }
  }
  try {
    await nav?.clipboard?.writeText(data.url);
    return nav?.clipboard ? "copied" : "failed";
  } catch {
    return "failed";
  }
}

export function buildResults(on: ResultsHandlers) {
  const root = el("section", "screen results");
  const heading = el("h1", "results-heading");
  root.appendChild(heading);
  const starsRow = el("p", "results-stars");
  root.appendChild(starsRow);
  const titleLine = el("p", "results-title");
  root.appendChild(titleLine);

  const rows = el("div", "results-rows");
  root.appendChild(rows);
  const rowEls = {
    perfect: el("p", "results-row"),
    great: el("p", "results-row"),
    ok: el("p", "results-row"),
    miss: el("p", "results-row"),
    cringe: el("p", "results-row"),
    accuracy: el("p", "results-row"),
    score: el("p", "results-row"),
    burst: el("p", "results-row"),
  };
  Object.values(rowEls).forEach((r) => rows.appendChild(r));

  const roast = el("p", "results-roast");
  const roastTag = el("p", "results-roast-tag hidden", "roast written live by Gemini, voiced live by Gradium");
  root.appendChild(roast);
  root.appendChild(roastTag);

  const buttons = el("div", "results-buttons");
  root.appendChild(buttons);
  const toast = el("p", "results-toast");
  root.appendChild(toast);

  let armed = false;
  let genAtShow = 0;
  let packOpen = false;
  let packDone = false;
  let cur: { stats: Stats; level: LevelV2 } | null = null;

  function button(cls: string, label: string, act: () => void) {
    const b = el("button", "results-btn " + cls, label);
    b.type = "button";
    b.addEventListener("click", (e) => {
      e.stopPropagation();
      if (!armed || packOpen) return;
      act();
    });
    buttons.appendChild(b);
    return b;
  }

  function say(text: string) {
    toast.textContent = text;
    replay(toast, "show");
  }

  const retryBtn = button("retry", "RETRY", () => on.retry());
  const packBtn = button("pack", "PACK", () => {
    if (!cur) return;
    if (packDone) {
      replay(packBtn, "shake");
      say("pack opened: win again for the next one");
      return;
    }
    packDone = true;
    packOpen = true;
    packBtn.classList.add("disabled");
    on.pack(cur.stats, cur.level)
      .catch(() => say("the pack got lost on the way"))
      .finally(() => (packOpen = false));
  });
  button("map", "MAP", () => on.map());
  button("share", "SHARE", () => {
    if (!cur) return;
    const { stats, level } = cur;
    void share(shareData(stats, level, shareUrl(location)), stats, level).then((r) => {
      if (r === "copied") say("link copied");
    });
  });

  function row(el2: HTMLElement, label: string, value: string) {
    el2.textContent = `${label}   ${value}`;
  }

  function show(stats: Stats, level: LevelV2) {
    armed = false;
    genAtShow++;
    const myGen = genAtShow;
    heading.textContent = stats.win ? "VICTORY" : "YOU HAVE BEEN HUMBLED";
    heading.classList.toggle("win", stats.win);
    heading.classList.toggle("lose", !stats.win);
    starsRow.textContent = starGlyphs(stats.stars);
    titleLine.textContent = stats.win ? `TITLE UNLOCKED: ${level.title.toUpperCase()}` : "";
    titleLine.classList.toggle("hidden", !stats.win);
    row(rowEls.perfect, "PERFECT", String(stats.counts.perfect));
    row(rowEls.great, "GREAT", String(stats.counts.great));
    row(rowEls.ok, "OK", String(stats.counts.ok));
    row(rowEls.miss, "MISS", String(stats.counts.miss));
    row(rowEls.cringe, "CRINGE", String(stats.counts.cringe));
    row(rowEls.accuracy, "ACCURACY", `${Math.round(stats.accuracy * 100)}%`);
    row(rowEls.score, "SCORE", String(Math.round(stats.score)));
    row(rowEls.burst, "BEST BURST", String(stats.bestBurst));
    roast.textContent = stats.win ? level.announcer.win : level.announcer.lose;
    roastTag.classList.add("hidden");
    cur = { stats, level };
    packDone = false;
    packOpen = false;
    packBtn.classList.remove("disabled");
    toast.textContent = "";
    // A last frantic battle tap must not land on RETRY: a short guard, still well under the 1 s rule.
    setTimeout(() => (armed = true), 300);

    fetchRoast(stats, level)
      .then((r) => {
        if (myGen !== genAtShow || !r) return;
        roast.textContent = r.roast;
        roastTag.textContent = "roast written live by Gemini";
        roastTag.classList.remove("hidden");
        return speakLive(r.roast).then((ok) => {
          if (ok && myGen === genAtShow) roastTag.textContent = "roast written live by Gemini, voiced live by Gradium";
        });
      })
      .catch(() => {
        /* offline or the worker is down: the announcer line already shown stands */
      });
  }

  // RETRY is the default: any key is the one input that restarts (the pack overlay owns keys while open).
  function onKey(e: KeyboardEvent) {
    if (!armed || packOpen || !isTapKey(e)) return;
    e.preventDefault();
    replay(retryBtn, "pressed");
    on.retry();
  }

  return { root, onKey, show };
}
