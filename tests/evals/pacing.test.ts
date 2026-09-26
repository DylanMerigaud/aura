// The pacing gate on one passing chart and planted failures, the v2 level adapter, the JSON chart loader.
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { chartFromLevel, loadCharts, type Chart, type Check, type TrackDrops } from "../../scripts/eval-lib";
import { deadSpans, overlaps, pacingChecks } from "../../scripts/eval-pacing";

/** 80 beats at 120 BPM = 40 s, first QTE on beat 4, one 69 charge released on beat 40. */
function good(): Chart {
  return {
    id: "good",
    bpm: 120,
    bars: 20,
    countInBeats: 4,
    track: "t",
    slots: [
      { b: 4, dur: 0, type: "hit", move: "up" },
      { b: 8, dur: 0, type: "hit", move: "left" },
      { b: 12.5, dur: 0, type: "hit", move: "right" },
      { b: 16, dur: 2, type: "combo", move: "up down left" },
      { b: 21, dur: 0, type: "hit", move: "down" },
      { b: 26, dur: 4, type: "hold" },
      { b: 34, dur: 6, type: "mash" },
      { b: 42, dur: 0, type: "hit", move: "up" },
      { b: 48, dur: 0, type: "hit", move: "left" },
      { b: 56, dur: 0, type: "hit", move: "down" },
      { b: 64, dur: 0, type: "hit", move: "right" },
      { b: 72, dur: 0, type: "hit", move: "up" },
    ],
    text: {
      story: ["Metro, 2am. Kevin wants aura."],
      taunts: ["You are cooked, frerot.", "NPC energy detected.", "Zero aura, zero rizz."],
      roast: ["Massive W, you sent him back to HR.", "Unbelievable L, outpaced by an intern."],
      announcer: ["FIGHT!"],
    },
  };
}

/** Release of the good chart: beat 40 at 120 BPM = 20 s after beat 0. */
const DROPS: TrackDrops = { file: "t.mp3", firstBeatS: 0.1, drops: [{ t: 20.15, from: "test" }] };

const byGate = (checks: Check[], gate: string) => checks.filter((c) => c.gate === gate);
const verdictOf = (checks: Check[], gate: string) => byGate(checks, gate).map((c) => c.verdict);
const failed = (checks: Check[]) => checks.filter((c) => c.verdict !== "pass").map((c) => c.gate);

describe("pacing gate", () => {
  it("passes every gate on the good chart", () => {
    const checks = pacingChecks(good(), DROPS);
    expect(failed(checks)).toEqual([]);
    expect(checks.map((c) => c.gate).sort()).toEqual(
      [
        "count_in", "dead_span", "first_qte", "level_length", "mash_length", "no_arrow_in_open", "no_overlap",
        "release_on_drop", "rest_after_release", "text_announcer", "text_roast", "text_story", "text_taunts",
        "text_total",
      ].sort(),
    );
  });

  it("fails an overlap and an arrow inside an open HOLD", () => {
    const c = good();
    c.slots.push({ b: 28, dur: 0, type: "hit", move: "up" });
    const checks = pacingChecks(c, DROPS);
    expect(verdictOf(checks, "no_overlap")).toEqual(["fail"]);
    expect(verdictOf(checks, "no_arrow_in_open")).toEqual(["fail"]);
    expect(overlaps(c.slots).length).toBe(1);
  });

  it("fails two windows on the same beat as an overlap without calling it an arrow in an open window", () => {
    const c = good();
    c.slots.push({ b: 8, dur: 0, type: "hit", move: "down" });
    const checks = pacingChecks(c, DROPS);
    expect(verdictOf(checks, "no_overlap")).toEqual(["fail"]);
    expect(verdictOf(checks, "no_arrow_in_open")).toEqual(["pass"]);
  });

  it("fails an input one beat after a MASH release or a COMBO end", () => {
    const c = good();
    c.slots = c.slots.filter((s) => s.b !== 42);
    c.slots.push({ b: 41, dur: 0, type: "hit", move: "up" });
    expect(verdictOf(pacingChecks(c, DROPS), "rest_after_release")).toEqual(["fail"]);
    const d = good();
    d.slots = d.slots.filter((s) => s.b !== 21);
    d.slots.push({ b: 19, dur: 0, type: "hit", move: "up" });
    expect(verdictOf(pacingChecks(d, DROPS), "rest_after_release")).toEqual(["fail"]);
  });

  it("fails a first QTE later than 2 bars", () => {
    const c = good();
    c.slots = c.slots.filter((s) => s.b > 8);
    const checks = pacingChecks(c, DROPS);
    expect(verdictOf(checks, "first_qte")).toEqual(["fail"]);
    expect(byGate(checks, "first_qte")[0].evidence.firstBeat).toBe(12.5);
  });

  it("fails a dead span over 2 bars, unless a declared breakdown covers it", () => {
    const c = good();
    c.slots = c.slots.filter((s) => s.b !== 48 && s.b !== 56);
    const checks = pacingChecks(c, DROPS);
    expect(verdictOf(checks, "dead_span")).toEqual(["fail"]);
    expect(deadSpans(c).find((d) => d.beats > 8)).toEqual({ from: 42, to: 64, beats: 22 });
    c.breakdowns = [[44, 60]];
    expect(verdictOf(pacingChecks(c, DROPS), "dead_span")).toEqual(["pass"]);
  });

  it("fails a dead tail after the last QTE", () => {
    const c = good();
    c.slots = c.slots.filter((s) => s.b < 64);
    expect(verdictOf(pacingChecks(c, DROPS), "dead_span")).toEqual(["fail"]);
  });

  it("fails a level shorter than 35 s or longer than 50 s, and a count in over 4 beats", () => {
    expect(verdictOf(pacingChecks({ ...good(), bars: 17 }, DROPS), "level_length")).toEqual(["fail"]);
    expect(verdictOf(pacingChecks({ ...good(), bars: 26 }, DROPS), "level_length")).toEqual(["fail"]);
    expect(verdictOf(pacingChecks({ ...good(), countInBeats: 8 }, DROPS), "count_in")).toEqual(["fail"]);
  });

  it("fails too much text, line by line and in total", () => {
    const c = good();
    c.text = {
      story: ["Bass rattles the floor as strobe lights freeze the sweat in midair."],
      taunts: ["You are completely cooked by this 808 drop.", "Cooked.", "NPC."],
      roast: ["Shadowbanned forever, total loss of user momentum and every single follower you ever had."],
      announcer: ["The bass drops, fight for the dance floor."],
    };
    const checks = pacingChecks(c, DROPS);
    for (const g of ["text_story", "text_taunts", "text_roast", "text_announcer", "text_total"]) expect(verdictOf(checks, g)).toEqual(["fail"]);
    expect(byGate(checks, "text_taunts")[0].score).toBeCloseTo(2 / 3);
  });

  it("fails an empty announcer call and passes a chart with no text at all", () => {
    const c = good();
    c.text = { announcer: [""] };
    expect(verdictOf(pacingChecks(c, DROPS), "text_announcer")).toEqual(["fail"]);
    const checks = pacingChecks({ ...good(), text: undefined }, DROPS);
    expect(checks.some((x) => x.gate.startsWith("text_"))).toBe(false);
  });

  it("fails a 69 charge outside 2 to 8 beats and a release off the drop", () => {
    const c = good();
    c.slots = c.slots.map((s) => (s.type === "mash" ? { ...s, b: 30, dur: 10 } : s));
    const checks = pacingChecks(c, DROPS);
    expect(verdictOf(checks, "mash_length")).toEqual(["fail"]);
    const late: TrackDrops = { ...DROPS, drops: [{ t: 20.25, from: "test" }] };
    expect(verdictOf(pacingChecks(good(), late), "release_on_drop")).toEqual(["fail"]);
    expect(byGate(pacingChecks(good(), undefined), "release_on_drop")).toEqual([]);
  });
});

describe("chart adapters", () => {
  it("maps a v2 level: a COMBO opens on its first press, text by role", () => {
    const c = chartFromLevel(
      {
        id: 3,
        bpm: 104,
        lengthBeats: 68,
        track: "level2",
        events: [
          { type: "hit", beat: 8, dir: "up" },
          { type: "combo", beat: 14, dirs: ["left", "up", "right"] },
          { type: "mash", beat: 20, length: 5 },
        ],
        story: ["Neon over the spit.", ""],
        taunts: [{ beat: 3, text: "T'es cuit." }],
        announcer: { intro: "FIGHT", win: "W.", lose: "L." },
        breakdownBeats: [[30, 34]],
      },
      "v2",
      4,
    );
    expect(c.id).toBe("v2-level3");
    expect(c.bars).toBe(17);
    expect(c.slots[1]).toEqual({ b: 12, dur: 2, type: "combo", move: "left up right" });
    expect(c.slots[2]).toEqual({ b: 20, dur: 5, type: "mash" });
    expect(c.text).toEqual({ story: ["Neon over the spit."], taunts: ["T'es cuit."], roast: ["W.", "L."], announcer: ["FIGHT"] });
    expect(c.countInBeats).toBe(4);
  });

  it("loads charts in the documented interface from a JSON file", async () => {
    const dir = mkdtempSync(join(tmpdir(), "aura-evals-"));
    const f = join(dir, "charts.json");
    writeFileSync(f, JSON.stringify({ charts: [good(), { nope: true }] }));
    const { charts, errors } = await loadCharts([f], dir);
    expect(errors).toEqual([]);
    expect(charts.map((c) => c.id)).toEqual(["good"]);
    const bad = join(dir, "broken.json");
    writeFileSync(bad, "{");
    expect((await loadCharts([bad], dir)).errors.length).toBe(1);
  });
});

describe("dead spans and opponent turns", () => {
  it("an opponent turn with a move is not a dead span", async () => {
    const { deadSpans } = await import("../../scripts/eval-pacing");
    const base = { id: "t", bpm: 120, bars: 6, slots: [{ b: 0, dur: 0, type: "hit" as const }, { b: 20, dur: 0, type: "hit" as const }] };
    expect(deadSpans(base).some((d) => d.beats >= 16)).toBe(true);
    expect(deadSpans({ ...base, opponentMoves: [[2, 18]] }).some((d) => d.beats >= 16)).toBe(false);
  });
});
