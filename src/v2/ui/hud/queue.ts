// Prompt exclusivity: which QTE prompts the HUD may draw this frame. Pure (no DOM), unit tested in
// tests/ui.test.ts.
import type { EventState } from "../../../qte/runner";

/**
 * One prompt widget at a time, in script order, the same order the runner takes input in (it routes every
 * press to the first unresolved event only). A COMBO, HOLD or MASH panel shows only once everything before
 * it is resolved, and nothing queued behind it shows until it resolves. Consecutive HITs share the arrow
 * lane, so a run of them flies together (each arrow keeps its full 2 beat approach). Writes into `out`.
 */
export function visiblePrompts(states: readonly EventState[], out: EventState[] = []): EventState[] {
  out.length = 0;
  for (const s of states) {
    if (s.phase === "done") continue;
    if (s.ev.type !== "hit") {
      if (!out.length) out.push(s);
      break;
    }
    out.push(s);
  }
  return out;
}
