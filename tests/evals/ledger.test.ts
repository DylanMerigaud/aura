// Ledger rows and the README count line: a scripted kind counts its latest run only, any other kind the
// latest verdict of each (id, gate).
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { check, countLine, readLedger, summarize, updateReadme, wordCount, writeRows, type Row } from "../../scripts/eval-lib";

const row = (kind: string, id: string, gate: string, verdict: Row["verdict"], ts: string, run?: string): Row => ({
  ts, kind, id, gate, verdict, score: verdict === "pass" ? 1 : 0, evidence: run ? { run } : {},
});

describe("ledger", () => {
  it("writes one row per check with the run stamp", () => {
    const dir = mkdtempSync(join(tmpdir(), "aura-ledger-"));
    const ledger = join(dir, "evals", "ledger.jsonl");
    const rows = writeRows("pacing", [check("a", "g1", true, { note: "ok" }), check("a", "g2", false, {})], "R1", ledger);
    expect(rows.map((r) => [r.kind, r.id, r.gate, r.verdict, r.score])).toEqual([
      ["pacing", "a", "g1", "pass", 1],
      ["pacing", "a", "g2", "fail", 0],
    ]);
    const back = readLedger(ledger);
    expect(back.length).toBe(2);
    expect(Object.keys(back[0]).sort()).toEqual(["evidence", "gate", "id", "kind", "score", "ts", "verdict"]);
    expect(back[0].evidence.run).toBe("R1");
  });

  it("counts the current state: latest run per scripted kind, latest row per check otherwise", () => {
    const s = summarize([
      // Legacy pacing rows without a run stamp are superseded by the stamped run.
      row("pacing", "level1", "old gate", "pass", "2026-09-26T10:00:00Z"),
      row("pacing", "l1", "first_qte", "fail", "2026-09-26T11:00:00Z", "R1"),
      row("pacing", "l1", "first_qte", "pass", "2026-09-26T12:00:00Z", "R2"),
      row("pacing", "l1", "dead_span", "fail", "2026-09-26T12:00:01Z", "R2"),
      // A regenerated text line counts once, at its final verdict.
      row("text", "l1-opponent", "punch", "fail", "2026-09-26T09:00:00Z"),
      row("text", "l1-opponent", "punch", "pass", "2026-09-26T09:05:00Z"),
      row("voice", "l1-intro", "peak", "error", "2026-09-26T09:06:00Z"),
    ]);
    expect(s).toEqual({ checks: 4, pass: 2, fail: 1, error: 1, last: "2026-09-26T12:00:01Z" });
    expect(countLine(s)).toBe("Evals: 4 checks, 2 pass, 1 fail, 1 error, last run 2026-09-26T12:00:01Z");
    expect(countLine({ ...s, error: 0 })).toBe("Evals: 4 checks, 2 pass, 1 fail, last run 2026-09-26T12:00:01Z");
  });

  it("overwrites only the README count line", () => {
    const dir = mkdtempSync(join(tmpdir(), "aura-readme-"));
    const readme = join(dir, "README.md");
    const ledger = join(dir, "ledger.jsonl");
    writeFileSync(readme, "# AURA\n\n## Evals\n\nEvals: N checks, N pass, N fail, last run <ts>\n\nMore text.\n");
    writeFileSync(ledger, JSON.stringify(row("pacing", "l1", "first_qte", "pass", "2026-09-26T12:00:00Z", "R")) + "\n");
    expect(updateReadme(readme, ledger)).toBe(true);
    expect(readFileSync(readme, "utf8")).toBe("# AURA\n\n## Evals\n\nEvals: 1 checks, 1 pass, 0 fail, last run 2026-09-26T12:00:00Z\n\nMore text.\n");
    const plain = join(dir, "PLAIN.md");
    writeFileSync(plain, "# no count line\n");
    expect(updateReadme(plain, ledger)).toBe(false);
  });

  it("counts words the way a reader does", () => {
    expect(wordCount("Massive W, you sent him back to HR.")).toBe(8);
    expect(wordCount("T'es cuit, extra onions won't save you.")).toBe(7);
    expect(wordCount("  808 -- drop  ")).toBe(2);
    expect(wordCount("")).toBe(0);
  });
});
