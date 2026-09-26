// The QTE prompt layer: HIT arrows flying into a target ring, a COMBO arrow row with a closing
// timer ring, a HOLD ring, and the MASH panel. Everything reads frame.prompts (EventState[]) plus
// frame.showsAt/targetAt/songTime/spb for timing, and frame.holding/holdProgress/mashing/mashCount
// for live progress. DOM nodes are pooled: created once, only transform and opacity animate.
import type { EventState } from "../../../qte/runner";
import type { Frame } from "../../contracts";
import { el, setText } from "../dom";
import { ARROW, clamp01 } from "./shared";
import { visiblePrompts } from "./queue";

const HIT_POOL = 6;

export function buildPrompts() {
  const root = el("div", "hud-prompts");

  const ring = el("div", "target-ring");
  root.appendChild(ring);

  const lane = el("div", "hit-lane");
  root.appendChild(lane);
  const hitPool = Array.from({ length: HIT_POOL }, () => {
    const n = el("div", "hit-arrow hidden");
    lane.appendChild(n);
    return n;
  });

  const comboRoot = el("div", "combo-panel hidden");
  const comboArrows = el("div", "combo-arrows");
  comboRoot.appendChild(comboArrows);
  const comboRing = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  comboRing.setAttribute("class", "combo-ring");
  comboRing.setAttribute("viewBox", "0 0 100 100");
  const comboCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  comboCircle.setAttribute("cx", "50");
  comboCircle.setAttribute("cy", "50");
  comboCircle.setAttribute("r", "46");
  comboRing.appendChild(comboCircle);
  comboRoot.appendChild(comboRing);
  root.appendChild(comboRoot);
  const comboSlots: HTMLElement[] = [];

  const holdRoot = el("div", "hold-panel hidden");
  const holdSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  holdSvg.setAttribute("class", "hold-ring");
  holdSvg.setAttribute("viewBox", "0 0 100 100");
  const holdTrack = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  holdTrack.setAttribute("class", "hold-track");
  holdTrack.setAttribute("cx", "50");
  holdTrack.setAttribute("cy", "50");
  holdTrack.setAttribute("r", "44");
  const holdFill = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  holdFill.setAttribute("class", "hold-fill");
  holdFill.setAttribute("cx", "50");
  holdFill.setAttribute("cy", "50");
  holdFill.setAttribute("r", "44");
  holdSvg.appendChild(holdTrack);
  holdSvg.appendChild(holdFill);
  holdRoot.appendChild(holdSvg);
  const holdLabel = el("div", "hold-label", "HOLD");
  holdRoot.appendChild(holdLabel);
  root.appendChild(holdRoot);
  const HOLD_CIRC = 2 * Math.PI * 44;
  holdFill.setAttribute("stroke-dasharray", String(HOLD_CIRC));

  const mashRoot = el("div", "mash-panel hidden");
  const mashLeft = el("div", "mash-arrow mash-left", ARROW.left);
  const mashCount = el("div", "mash-count", "0");
  const mashRight = el("div", "mash-arrow mash-right", ARROW.right);
  mashRoot.appendChild(mashLeft);
  mashRoot.appendChild(mashCount);
  mashRoot.appendChild(mashRight);
  const mashTimer = el("div", "mash-timer");
  const mashTimerFill = el("div", "mash-timer-fill");
  mashTimer.appendChild(mashTimerFill);
  mashRoot.appendChild(mashTimer);
  const mashRelease = el("div", "mash-release hidden", "SPACE TO RELEASE!");
  mashRoot.appendChild(mashRelease);
  root.appendChild(mashRoot);

  const HINTS: Record<EventState["ev"]["type"], string> = {
    hit: "press the arrow when it hits the ring",
    combo: "type the arrows in order, the last one on the beat",
    hold: "press SPACE when the ring closes, release when the circle is full",
    mash: "alternate LEFT RIGHT fast, then SPACE to release",
  };
  const hintEl = el("div", "prompt-hint hidden");
  root.appendChild(hintEl);

  /** First two levels teach each QTE type once, on whichever is current (v1 parity). */
  function layoutHint(states: EventState[], level1or2: boolean) {
    const current = level1or2 ? states.find((s) => s.phase !== "done") : undefined;
    if (!current) {
      hintEl.classList.add("hidden");
      return;
    }
    hintEl.classList.remove("hidden");
    setText(hintEl, HINTS[current.ev.type]);
  }

  function layoutHit(states: EventState[], f: Frame) {
    let i = 0;
    for (const s of states) {
      if (s.ev.type !== "hit" || s.phase === "done") continue;
      if (i >= hitPool.length) break;
      const n = hitPool[i++];
      const showsAt = f.showsAt(s.ev);
      const targetAt = f.targetAt(s.ev);
      const t = clamp01((f.songTime - showsAt) / Math.max(0.001, targetAt - showsAt));
      n.classList.remove("hidden");
      setText(n, ARROW[s.ev.dir]);
      n.style.transform = `translateX(${(1 - t) * 46}vw)`;
      n.style.opacity = String(0.35 + t * 0.65);
    }
    for (; i < hitPool.length; i++) hitPool[i].classList.add("hidden");
  }

  function layoutCombo(states: EventState[], f: Frame) {
    const s = states.find((x) => x.ev.type === "combo" && x.phase !== "done");
    if (!s || s.ev.type !== "combo") {
      comboRoot.classList.add("hidden");
      return;
    }
    comboRoot.classList.remove("hidden");
    const dirs = s.ev.dirs;
    while (comboSlots.length < dirs.length) {
      const slot = el("span", "combo-arrow");
      comboArrows.appendChild(slot);
      comboSlots.push(slot);
    }
    comboSlots.forEach((slot, i) => {
      if (i >= dirs.length) {
        slot.classList.add("hidden");
        return;
      }
      slot.classList.remove("hidden");
      setText(slot, ARROW[dirs[i]]);
      slot.classList.toggle("done", i < s.progress);
      slot.classList.toggle("next", i === s.progress);
    });
    const showsAt = f.showsAt(s.ev);
    const targetAt = f.targetAt(s.ev);
    const t = clamp01((f.songTime - showsAt) / Math.max(0.001, targetAt - showsAt));
    comboCircle.setAttribute("stroke-dasharray", `${(1 - t) * 289} 289`);
  }

  function layoutHold(states: EventState[], f: Frame) {
    const s = states.find((x) => x.ev.type === "hold" && x.phase !== "done");
    if (!s || s.ev.type !== "hold") {
      holdRoot.classList.add("hidden");
      return;
    }
    holdRoot.classList.remove("hidden");
    if (!f.holding) {
      const showsAt = f.showsAt(s.ev);
      const press = s.ev.beat * f.spb;
      const t = clamp01((f.songTime - showsAt) / Math.max(0.001, press - showsAt));
      holdFill.setAttribute("stroke-dashoffset", String(HOLD_CIRC * t));
      setText(holdLabel, "HOLD SPACE");
    } else {
      holdFill.setAttribute("stroke-dashoffset", String(HOLD_CIRC * (1 - f.holdProgress)));
      setText(holdLabel, f.holdProgress > 0.97 ? "RELEASE!" : "HOLD...");
    }
  }

  function layoutMash(states: EventState[], f: Frame) {
    const s = states.find((x) => x.ev.type === "mash" && x.phase !== "done");
    if (!s || s.ev.type !== "mash") {
      mashRoot.classList.add("hidden");
      return;
    }
    mashRoot.classList.remove("hidden");
    const targetAt = f.targetAt(s.ev);
    if (!f.mashing) {
      setText(mashCount, "SOON");
      mashTimerFill.style.width = "0%";
      mashRelease.classList.add("hidden");
      return;
    }
    setText(mashCount, String(f.mashCount));
    // Fill from the press beat (not showsAt, which leads by a fixed 2 beats regardless of
    // type) to the release target: an accurate "time left to mash" bar.
    const pressAt = s.ev.beat * f.spb;
    const t = clamp01((f.songTime - pressAt) / Math.max(0.001, targetAt - pressAt));
    mashTimerFill.style.width = `${t * 100}%`;
    const left = s.lastDir !== "left";
    mashLeft.classList.toggle("active", left);
    mashRight.classList.toggle("active", !left);
    const remainingBeats = (targetAt - f.songTime) / f.spb;
    mashRelease.classList.toggle("hidden", remainingBeats >= 1.5);
  }

  const shown: EventState[] = [];

  function frame(f: Frame) {
    // One prompt at a time: a HOLD ring never sits over a HIT arrow, queued prompts wait their turn.
    const states = visiblePrompts(f.prompts, shown);
    layoutHit(states, f);
    layoutCombo(states, f);
    layoutHold(states, f);
    layoutMash(states, f);
    layoutHint(states, f.level.id <= 2);
  }

  return { root, frame };
}
