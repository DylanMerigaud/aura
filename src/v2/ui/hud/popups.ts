// Transient battle overlays: grade popups, the 67 burst number on release, and the
// count in with the level title punch. Each is a
// small pool of reused nodes: CSS keyframes are restarted with replay() rather than creating and
// destroying nodes every trigger.
import type { CoreEvent, LevelV2 } from "../../contracts";
import { el, replay } from "../dom";
import { CRINGE_COLOR, GRADE_COLOR } from "./shared";
import { announce, turnCall } from "../announce";

/** The in battle level title card stays exactly this long. */
export const TITLE_CARD_MS = 2000;
/** The YOUR MOVE / HIS MOVE call stays this long. */
export const TURN_CALL_MS = 700;

const GRADE_POOL = 6;

export function buildPopups(base: string) {
  const root = el("div", "hud-popups");

  const gradeLane = el("div", "grade-lane");
  root.appendChild(gradeLane);
  const gradePool = Array.from({ length: GRADE_POOL }, () => {
    const n = el("div", "grade-popup");
    gradeLane.appendChild(n);
    return n;
  });
  let gradeIdx = 0;

  const burst = el("div", "burst-popup");
  const burstNum = el("div", "burst-num");
  const burstLabel = el("div", "burst-label");
  burst.appendChild(burstNum);
  burst.appendChild(burstLabel);
  root.appendChild(burst);

  const comboPop = el("div", "combo-popup");
  root.appendChild(comboPop);


  const countIn = el("div", "count-in hidden");
  const countNum = el("div", "count-num");
  countIn.appendChild(countNum);
  root.appendChild(countIn);

  const titlePunch = el("div", "level-title-punch hidden");
  root.appendChild(titlePunch);
  let titleTimer: ReturnType<typeof setTimeout> | null = null;

  // The turn call, center top. Styled inline (no stylesheet rule shared with the prompt lane).
  const turnCallNode = el("div", "turn-call hidden");
  Object.assign(turnCallNode.style, {
    position: "absolute", left: "50%", top: "13%", transform: "translate(-50%, -50%)", whiteSpace: "nowrap",
    fontSize: "clamp(40px, 13vw, 88px)", fontWeight: "900", letterSpacing: "0.02em", pointerEvents: "none",
    webkitTextStroke: "3px #000", paintOrder: "stroke fill", textShadow: "3px 3px 0 #000",
  } as Partial<CSSStyleDeclaration>);
  root.appendChild(turnCallNode);
  let turnTimer: ReturnType<typeof setTimeout> | null = null;

  function showTurnCall(who: "player" | "opponent", level: LevelV2) {
    const text = turnCall(who);
    turnCallNode.textContent = text;
    turnCallNode.style.color = who === "player" ? "#ffd400" : level.opponent.color || "#ffffff";
    turnCallNode.classList.remove("hidden");
    if (typeof turnCallNode.animate === "function") {
      turnCallNode.animate(
        [
          { transform: "translate(-50%, -50%) scale(1.8)", opacity: 0 },
          { transform: "translate(-50%, -50%) scale(1)", opacity: 1, offset: 0.2 },
          { transform: "translate(-50%, -50%) scale(1)", opacity: 1, offset: 0.8 },
          { transform: "translate(-50%, -50%) scale(0.9)", opacity: 0 },
        ],
        { duration: TURN_CALL_MS, easing: "ease-out" },
      );
    }
    if (turnTimer) clearTimeout(turnTimer);
    turnTimer = setTimeout(() => turnCallNode.classList.add("hidden"), TURN_CALL_MS);
    announce(text);
  }

  function spawnGrade(text: string, color: string, big: boolean) {
    const n = gradePool[gradeIdx];
    gradeIdx = (gradeIdx + 1) % gradePool.length;
    n.textContent = text;
    n.style.color = color;
    n.classList.toggle("big", big);
    replay(n, "pop");
  }

  function spawnCombo(combo: number, text = `${combo} COMBO`) {
    comboPop.textContent = text;
    replay(comboPop, "pop");
  }

  function event(e: CoreEvent, level: LevelV2) {
    if (e.kind === "judged") {
      if (e.cringe) spawnGrade("CRINGE", CRINGE_COLOR, true);
      else spawnGrade(e.grade.toUpperCase(), GRADE_COLOR[e.grade], e.big);
      if (!e.cringe && e.grade !== "miss" && e.combo > 0 && e.combo % 10 === 0) spawnCombo(e.combo);
      return;
    }
    if (e.kind === "flow") {
      if (e.on) {
        spawnCombo(0, "FLOW x2");
        announce("flow!");
      }
      return;
    }
    if (e.kind === "release") {
      const label = e.mult >= 2 ? "PERFECT 67" : e.mult >= 1.5 ? "GREAT 67" : e.mult >= 1 ? "SIX SEVEN" : "WEAK 67";
      announce("six! seven!");
      burstNum.textContent = String(e.burst);
      burstLabel.textContent = label;
      replay(burst, "pop-big");
      return;
    }
    // The big taunt card is gone (addendum 16:15 point 3): the line is a speech bubble on his head
    // (src/render3d/nameplates.ts say, fired by the stage on the same event).
    if (e.kind === "taunt") return;
    if (e.kind === "countIn") {
      countIn.classList.remove("hidden");
      countNum.textContent = e.n === 1 ? "FIGHT!" : String(e.n - 1);
      replay(countNum, "pop");
      if (e.n === 2) {
        titlePunch.textContent = `${level.title.toUpperCase()}  |  ${level.place.toUpperCase()}`;
        titlePunch.classList.remove("hidden");
        replay(titlePunch, "punch");
        if (titleTimer) clearTimeout(titleTimer);
        titleTimer = setTimeout(() => titlePunch.classList.add("hidden"), TITLE_CARD_MS);
      }
      if (e.n === 1) setTimeout(() => countIn.classList.add("hidden"), 700);
      return;
    }
    if (e.kind === "turn") {
      showTurnCall(e.who, level);
      return;
    }
    if (e.kind === "end") {
      titlePunch.classList.add("hidden");
      turnCallNode.classList.add("hidden");
    }
  }

  function reset() {
    countIn.classList.add("hidden");
    titlePunch.classList.add("hidden");
    turnCallNode.classList.add("hidden");
    if (titleTimer) clearTimeout(titleTimer);
    if (turnTimer) clearTimeout(turnTimer);
  }

  return { root, event, reset };
}
