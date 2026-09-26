// Prompt exclusivity: which QTE prompt the HUD may draw this frame. Pure (no DOM), unit tested in
// tests/ui.test.ts.
import type { EventState } from "../../../qte/runner";

/** Carried across frames: the COMBO/HOLD/MASH panel on screen, and the end of the silence after it. */
export interface QueueGate {
  panel: EventState | null;
  silentUntil: number;
}

export function newGate(): QueueGate {
  return { panel: null, silentUntil: -Infinity };
}

/**
 * ONE PROMPT ON SCREEN AT A TIME, in script order (the order the runner takes input in: it routes
 * every press to the first unresolved event only). Only the current event is drawn: the next HIT
 * arrow appears once the current one resolves (its position still comes from its own approach
 * time, so it keeps as much of its flight as is left). When a COMBO, HOLD or MASH panel resolves,
 * one beat of silence follows before anything else shows. Writes into `out`.
 */
export function visiblePrompts(states: readonly EventState[], now: number, spb: number, gate: QueueGate, out: EventState[] = []): EventState[] {
  out.length = 0;
  if (gate.panel && gate.panel.phase === "done") {
    gate.panel = null;
    gate.silentUntil = now + spb;
  }
  if (now < gate.silentUntil) return out;
  let first: EventState | undefined;
  for (const s of states) {
    if (s.phase !== "done") {
      first = s;
      break;
    }
  }
  if (!first) return out;
  if (first.ev.type !== "hit") gate.panel = first;
  out.push(first);
  return out;
}
