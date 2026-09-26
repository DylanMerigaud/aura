// Pacing gate (amendment 10 section 3) over LEVELS_V2: validator plus pacingIssues, one ledger row per level.
// Run: npx tsx scripts/eval-pacing.ts. Exit code 1 when any level fails.
import { appendFileSync, mkdirSync } from "node:fs";
import { validateLevel } from "../src/qte/validate";
import { LEVELS_V2, levelSeconds, pacingIssues, span } from "../src/v2/levels";

mkdirSync("evals", { recursive: true });
let failed = 0;
for (const l of LEVELS_V2) {
  const issues = [...validateLevel(l), ...pacingIssues(l)];
  const ev = [...l.events].sort((a, b) => a.beat - b.beat);
  let maxGap = span(ev[0])[0];
  for (let i = 1; i < ev.length; i++) maxGap = Math.max(maxGap, span(ev[i])[0] - span(ev[i - 1])[1]);
  const verdict = issues.length ? "fail" : "pass";
  if (issues.length) failed++;
  const row = {
    ts: new Date().toISOString(),
    kind: "pacing",
    id: `level${l.id}`,
    gate: "first QTE within 2 bars, no gap over 2 bars, 35 to 50 s, validator, no input within 1 beat of a MASH release",
    verdict,
    score: issues.length ? 0 : 1,
    evidence: {
      track: l.track,
      bpm: l.bpm,
      seconds: +levelSeconds(l).toFixed(1),
      events: l.events.length,
      firstQteBeat: span(ev[0])[0],
      maxGapBeats: maxGap,
      issues,
    },
  };
  appendFileSync("evals/ledger.jsonl", JSON.stringify(row) + "\n");
  console.log(`${verdict.toUpperCase()} level ${l.id} (${l.track}, ${row.evidence.seconds} s, ${l.events.length} events, max gap ${maxGap})${issues.length ? "\n  " + issues.join("\n  ") : ""}`);
}
process.exit(failed ? 1 : 0);
