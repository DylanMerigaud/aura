// Results (addendum 16:15 point 4, 16:40 points 2 and 3): a clean card, under 1 s after the battle. The result
// word big (AURA FARMED or HUMBLED), three big numbers (score, accuracy, best combo), the stars, the one line
// roast (the level's announcer line at once, replaced by the live Gemini roast when it lands), the XP bar
// filling from before to after with a RANK UP moment, two big buttons (RETRY, or NEXT after a win, and SHARE),
// then small: the NEXT OPPONENT locked preview, LOADOUT (a won battle opened its pack before this card). Tap words only.
import type { LevelV2, Stats } from "../contracts";
import { starGlyphs } from "./format";
import { el, replay } from "./dom";
import { fetchRoast, speakLive } from "../net/live";
import { isTapKey, shareData, shareUrl, type ShareData } from "./flow";
import { RANKS, rankFill, rankIndex, type XpGain } from "../xp";

export interface ResultsHandlers {
  /** Fight the same opponent again. */
  retry(): void;
  /** Fight the next opponent (offered after a win). */
  next(): void;
  loadout(): void;
}

export interface ResultsExtra {
  /** The opponent after the one just fought; locked until he is beaten. */
  nextOpponent?: { name: string; locked: boolean; loop?: number } | null;
  xp?: XpGain | null;
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

/** XP bar fill (0..100 percent) for an XP total. */
export function fillPct(xp: number): number {
  return Math.round(rankFill(xp) * 1000) / 10;
}

export function buildResults(on: ResultsHandlers) {
  const root = el("section", "screen results");
  const card = el("div", "rc");
  root.appendChild(card);
  const heading = el("h1", "results-heading");
  card.appendChild(heading);
  const vs = el("p", "rc-vs");
  card.appendChild(vs);
  const starsRow = el("p", "results-stars");
  card.appendChild(starsRow);

  const nums = el("div", "rc-nums");
  card.appendChild(nums);
  function num(cls: string, label: string) {
    const box = el("div", "rc-num " + cls);
    const v = el("span", "rc-val", "0");
    box.appendChild(v);
    box.appendChild(el("span", "rc-lab", label));
    nums.appendChild(box);
    return v;
  }
  const scoreEl = num("score", "SCORE");
  const accEl = num("acc", "ACCURACY");
  const comboEl = num("combo", "BEST COMBO");

  const roast = el("p", "results-roast");
  const roastTag = el("p", "results-roast-tag hidden", "roast written live by Gemini, voiced live by Gradium");
  card.appendChild(roast);
  card.appendChild(roastTag);

  // XP bar: the rank word, the bar, the gained XP; RANK UP overlays the card for a moment.
  const xpBox = el("div", "rc-xp");
  const xpHead = el("div", "rc-xp-head");
  const rankEl = el("span", "rc-rank");
  const gainEl = el("span", "rc-gain");
  xpHead.appendChild(rankEl);
  xpHead.appendChild(gainEl);
  const bar = el("div", "rc-bar");
  const fill = el("div", "rc-fill");
  bar.appendChild(fill);
  xpBox.appendChild(xpHead);
  xpBox.appendChild(bar);
  card.appendChild(xpBox);
  const rankUp = el("div", "rc-rankup hidden");
  const rankUpWord = el("p", "rc-rankup-word", "RANK UP");
  const rankUpRank = el("p", "rc-rankup-rank");
  rankUp.appendChild(rankUpWord);
  rankUp.appendChild(rankUpRank);
  root.appendChild(rankUp);

  const buttons = el("div", "results-buttons");
  card.appendChild(buttons);
  const small = el("div", "rc-small");
  card.appendChild(small);
  const toast = el("p", "results-toast");
  card.appendChild(toast);

  let armed = false;
  let genAtShow = 0;
  let won = false;
  let cur: { stats: Stats; level: LevelV2 } | null = null;
  const timers: ReturnType<typeof setTimeout>[] = [];
  function later(fn: () => void, ms: number) {
    timers.push(setTimeout(fn, ms));
  }

  function button(parent: HTMLElement, cls: string, label: string, act: () => void) {
    const b = el("button", cls, label);
    b.type = "button";
    b.addEventListener("pointerdown", (e) => e.stopPropagation());
    b.addEventListener("click", (e) => {
      e.stopPropagation();
      if (!armed) return;
      act();
    });
    parent.appendChild(b);
    return b;
  }

  function say(text: string) {
    toast.textContent = text;
    replay(toast, "show");
  }

  const primary = () => (won ? on.next() : on.retry());
  const retryBtn = button(buttons, "results-btn retry", "RETRY", primary);
  button(buttons, "results-btn share", "SHARE", () => {
    if (!cur) return;
    const { stats, level } = cur;
    void share(shareData(stats, level, shareUrl(location)), stats, level).then((r) => {
      if (r === "copied") say("link copied");
    });
  });
  const replayLink = button(small, "rc-link replay", "replay", () => on.retry());

  const preview = el("div", "rc-next");
  const sil = el("div", "rc-sil");
  sil.appendChild(el("span", "rc-sil-head"));
  sil.appendChild(el("span", "rc-sil-body"));
  const nextText = el("div", "rc-next-text");
  const nextLab = el("span", "rc-next-lab", "NEXT OPPONENT");
  const nextName = el("span", "rc-next-name");
  const nextLock = el("span", "rc-next-lock", "LOCKED: WIN TO FACE HIM");
  nextText.appendChild(nextLab);
  nextText.appendChild(nextName);
  nextText.appendChild(nextLock);
  preview.appendChild(sil);
  preview.appendChild(nextText);
  small.appendChild(preview);

  button(small, "rc-link loadout", "LOADOUT", () => on.loadout());
  function paintXp(g: XpGain | null | undefined) {
    rankUp.classList.add("hidden");
    xpBox.classList.toggle("hidden", !g);
    if (!g) return;
    const r0 = rankIndex(g.before);
    rankEl.textContent = RANKS[r0].toUpperCase();
    gainEl.textContent = `+${g.gained} XP`;
    fill.style.transition = "none";
    fill.style.width = `${fillPct(g.before)}%`;
    xpBox.dataset.rank = RANKS[rankIndex(g.after)];
    xpBox.dataset.fill = String(fillPct(g.after));
    void fill.offsetWidth;
    fill.style.transition = "";
    later(() => {
      if (!g.rankUp) {
        fill.style.width = `${fillPct(g.after)}%`;
        return;
      }
      // Fill to the top, flash, the new rank word, then the bar restarts inside the new rank.
      fill.style.width = "100%";
      later(() => {
        rankEl.textContent = g.rank.toUpperCase();
        rankUpRank.textContent = g.rank.toUpperCase();
        rankUp.classList.remove("hidden");
        replay(rankUp, "go");
        replay(xpBox, "flash");
        fill.style.transition = "none";
        fill.style.width = "0%";
        void fill.offsetWidth;
        fill.style.transition = "";
        later(() => (fill.style.width = `${fillPct(g.after)}%`), 60);
        later(() => rankUp.classList.add("hidden"), 1800);
      }, 750);
    }, 250);
  }

  function show(stats: Stats, level: LevelV2, extra: ResultsExtra = {}) {
    armed = false;
    genAtShow++;
    const myGen = genAtShow;
    while (timers.length) clearTimeout(timers.pop());
    won = !!stats.win;
    heading.textContent = won ? "AURA FARMED" : "HUMBLED";
    heading.classList.toggle("win", won);
    heading.classList.toggle("lose", !won);
    vs.textContent = `VS ${level.opponent?.name ?? level.title}`.toUpperCase();
    starsRow.textContent = starGlyphs(stats.stars ?? 0);
    scoreEl.textContent = String(Math.round(stats.score || 0));
    accEl.textContent = `${Math.round((stats.accuracy || 0) * 100)}%`;
    comboEl.textContent = String(stats.maxCombo ?? 0);
    roast.textContent = won ? level.announcer.win : level.announcer.lose;
    roastTag.classList.add("hidden");
    retryBtn.textContent = won ? "NEXT" : "RETRY";
    retryBtn.classList.toggle("next", won);
    replayLink.classList.toggle("hidden", !won);
    const n = extra.nextOpponent;
    preview.classList.toggle("hidden", !n);
    if (n) {
      nextName.textContent = n.name.toUpperCase() + (n.loop ? ` +${n.loop}` : "");
      preview.classList.toggle("locked", n.locked);
      nextLab.textContent = n.locked ? "NEXT OPPONENT" : "UP NEXT";
      nextLock.classList.toggle("hidden", !n.locked);
    }
    paintXp(extra.xp);
    cur = { stats, level };
    toast.textContent = "";
    // A last frantic battle tap must not land on a button: a short guard, still well under the 1 s rule.
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

  // The primary button is the default: any key is the one input (the win pack opens before this card).
  function onKey(e: KeyboardEvent) {
    if (!armed || !isTapKey(e)) return;
    e.preventDefault();
    replay(retryBtn, "pressed");
    primary();
  }

  function hide() {
    while (timers.length) clearTimeout(timers.pop());
    rankUp.classList.add("hidden");
  }

  return { root, onKey, show, hide };
}
