// Top bar: the crowd's verdict as an old YouTube like / dislike bar (thumbs up and down at the
// ends, a green versus red ratio bar, compact counts under each), then score and combo.
// The ratio comes from frame.meter (the tug of war that decides the win); the counts are cosmetic,
// grown by the judged events in src/v2/ui/hud/likes.ts.
import { comboMultiplier } from "../../../qte/judge";
import type { CoreEvent, Frame } from "../../contracts";
import { tierOf } from "../../contracts";
import { approach } from "../format";
import { el, replay, setText } from "../dom";
import { applyEvent, formatCount, newLikes, reconcile, targetRatio, trickle } from "./likes";

const SVG_NS = "http://www.w3.org/2000/svg";
/** A thumbs up glyph (24x24), drawn inline so no emoji font is needed; thumbs down is it rotated. */
const THUMB_PATH =
  "M2 21h4V9H2v12zm20-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L13.17 1 6.59 7.59C6.22 7.95 6 8.45 6 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z";

function thumb(down: boolean): HTMLElement {
  const box = el("span", `lk-icon ${down ? "lk-icon-down" : "lk-icon-up"}`);
  try {
    const svg = document.createElementNS(SVG_NS, "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("aria-hidden", "true");
    const p = document.createElementNS(SVG_NS, "path");
    p.setAttribute("d", THUMB_PATH);
    p.setAttribute("fill", "currentColor");
    if (down) p.setAttribute("transform", "rotate(180 12 12)");
    svg.appendChild(p);
    box.appendChild(svg);
  } catch {
    box.textContent = down ? "-" : "+";
  }
  return box;
}

export function buildMeter() {
  const root = el("div", "hud-top");

  const bar = el("div", "likebar");
  const up = thumb(false);
  const down = thumb(true);
  const track = el("div", "lk-track");
  const likeFill = el("div", "lk-fill lk-like");
  const dislikeFill = el("div", "lk-fill lk-dislike");
  track.appendChild(likeFill);
  track.appendChild(dislikeFill);
  const upCount = el("span", "lk-count lk-count-up", "0");
  const downCount = el("span", "lk-count lk-count-down", "0");
  bar.appendChild(up);
  bar.appendChild(track);
  bar.appendChild(down);
  bar.appendChild(upCount);
  bar.appendChild(downCount);
  root.appendChild(bar);

  const rightBox = el("div", "hud-right-box");
  const score = el("div", "hud-score", "0");
  const comboRow = el("div", "hud-combo hidden");
  const comboNum = el("span", "hud-combo-num", "0");
  const comboMult = el("span", "hud-combo-mult", "");
  comboRow.appendChild(comboNum);
  comboRow.appendChild(el("span", "hud-combo-label", "COMBO"));
  comboRow.appendChild(comboMult);
  rightBox.appendChild(score);
  rightBox.appendChild(comboRow);
  root.appendChild(rightBox);

  let counts = newLikes();
  let shownLikes = counts.likes;
  let shownDislikes = counts.dislikes;
  let shownRatio = 0.5;
  let lastPct = NaN;
  let meter = 0;

  function reset() {
    counts = newLikes();
    shownLikes = counts.likes;
    shownDislikes = counts.dislikes;
    shownRatio = 0.5;
    lastPct = NaN;
    meter = 0;
  }

  function event(e: CoreEvent) {
    const side = applyEvent(counts, e);
    if (!side) return;
    reconcile(counts, meter);
    try {
      replay(track, side === "like" ? "lk-bump-like" : "lk-bump-dislike");
      replay(side === "like" ? up : down, "lk-pop");
    } catch {
      /* no layout (tests, hidden tab): the bump is cosmetic */
    }
  }

  function frame(f: Frame, realDt: number) {
    meter = f.meter;
    trickle(counts, realDt, f.turn === "opponent" && !f.ending);
    reconcile(counts, meter);
    // Eased width, written only when it moved a visible tenth of a percent.
    shownRatio = approach(shownRatio, targetRatio(meter), realDt, 9);
    const pctW = Math.round(shownRatio * 1000) / 10;
    if (pctW !== lastPct) {
      lastPct = pctW;
      likeFill.style.width = `${pctW}%`;
      dislikeFill.style.width = `${Math.round((100 - pctW) * 10) / 10}%`;
    }
    shownLikes = approach(shownLikes, counts.likes, realDt, 7);
    shownDislikes = approach(shownDislikes, counts.dislikes, realDt, 7);
    setText(upCount, formatCount(shownLikes));
    setText(downCount, formatCount(shownDislikes));

    setText(score, String(Math.round(f.score)));
    if (f.combo >= 2) {
      comboRow.classList.remove("hidden");
      setText(comboNum, String(f.combo));
      const m = comboMultiplier(f.combo);
      setText(comboMult, m > 1 ? `x${m}` : "");
      const tier = String(tierOf(f.combo));
      if (comboRow.dataset.tier !== tier) comboRow.dataset.tier = tier;
    } else {
      comboRow.classList.add("hidden");
    }
  }

  return { root, frame, event, reset };
}
