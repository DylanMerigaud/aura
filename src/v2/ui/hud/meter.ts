// Top bar: the tug of war aura meter, score, combo with its multiplier, and a small tachometer
// reading the current music rate (frame.rate, 0.90 to 1.15), needle eased so it never snaps.
import { comboMultiplier } from "../../../qte/judge";
import type { Frame } from "../../contracts";
import { tierOf } from "../../contracts";
import { approach } from "../format";
import { el, setText } from "../dom";

export function buildMeter() {
  const root = el("div", "hud-top");

  const meterTrack = el("div", "meter-track");
  const meterYou = el("div", "meter-fill meter-you");
  const meterThem = el("div", "meter-fill meter-them");
  const meterThumb = el("div", "meter-thumb");
  meterTrack.appendChild(meterYou);
  meterTrack.appendChild(meterThem);
  meterTrack.appendChild(meterThumb);
  root.appendChild(meterTrack);

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

  const tach = el("div", "tachometer");
  const tachNeedle = el("div", "tach-needle");
  tach.appendChild(tachNeedle);
  tach.appendChild(el("div", "tach-face"));
  root.appendChild(tach);

  let rate = 1;
  let lastMid = NaN;

  function frame(f: Frame, realDt: number) {
    // A single divider bar (v1 parity): cyan fills the left portion up to it, magenta the rest.
    // At meter 1 (full win) it is 100% cyan, at -1 (full loss) 100% magenta.
    // Width is a layout write: only when the bar moved a visible tenth of a percent (the pressure drifts it every frame).
    const mid = Math.round((50 + f.meter * 50) * 10) / 10;
    if (mid !== lastMid) {
      lastMid = mid;
      meterYou.style.width = `${mid}%`;
      meterThem.style.width = `${100 - mid}%`;
      meterThumb.style.left = `${mid}%`;
    }
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
    rate = approach(rate, f.rate, realDt, 6);
    // 0.90..1.15 maps to -50..+50 degrees.
    const deg = ((rate - 1.025) / 0.125) * 50;
    tachNeedle.style.transform = `rotate(${deg}deg)`;
  }

  return { root, frame };
}
