// Results (amendment 10: under 1 s after the end, skippable with one input). Timing grade counts,
// accuracy, best burst, stars, the title unlocked, then a live roast (fetchRoast, under 3 s) or
// the level's own announcer line while it is not back yet.
import type { LevelV2, Stats } from "../contracts";
import { starGlyphs } from "./format";
import { el } from "./dom";
import { fetchRoast, speakLive } from "../net/live";

export function buildResults(onNext: () => void) {
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

  const prompt = el("p", "results-prompt");
  root.appendChild(prompt);

  let armed = false;
  let genAtShow = 0;
  root.addEventListener("click", () => {
    if (armed) onNext();
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
    prompt.textContent = stats.win ? "PRESS SPACE TO CONTINUE" : "PRESS SPACE TO RETRY";
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

  function onKey(e: KeyboardEvent) {
    if (!armed) return;
    if (e.code === "Enter" || e.code === "Space") onNext();
  }

  return { root, onKey, show };
}
