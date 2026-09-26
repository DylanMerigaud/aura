// Tests for the campaign level validator: grid, overlap and content rules.
import { describe, expect, it } from "vitest";
import { validateLevel } from "../src/qte/validate.js";
import type { Level } from "../src/qte/types.js";

function baseLevel(overrides: Partial<Level> = {}): Level {
  return {
    id: 1,
    title: "NPC",
    place: "Metro platform, 2am",
    artKey: "metro",
    story: ["Line 13, last train gone.", "Prove him wrong."],
    opponent: { name: "Kevin Shades", persona: "Never wrong.", color: "#35e0ff" },
    taunts: [{ beat: 10, text: "Zero aura detected." }],
    announcer: { intro: "Fight!", win: "Aura secured!", lose: "Humbled." },
    bpm: 100,
    windowScale: 1.0,
    lengthBeats: 32,
    seed: 1,
    events: [
      { type: "hit", beat: 8, dir: "up" },
      { type: "hit", beat: 10, dir: "down" },
      { type: "mash", beat: 12, length: 3 },
      { type: "hold", beat: 17, length: 2 },
      { type: "combo", beat: 23, dirs: ["left", "up", "right"] },
    ],
    ...overrides,
  };
}

describe("validateLevel", () => {
  it("accepts a valid level", () => {
    const errors = validateLevel(baseLevel());
    expect(errors).toEqual([]);
  });

  it("rejects overlapping events", () => {
    const level = baseLevel({
      events: [
        { type: "mash", beat: 10, length: 5 },
        { type: "hit", beat: 12, dir: "up" },
      ],
    });
    const errors = validateLevel(level);
    expect(errors.some((e) => e.includes("overlap"))).toBe(true);
  });

  it("rejects an off grid (non integer) beat", () => {
    const level = baseLevel({
      events: [{ type: "hit", beat: 10.5, dir: "up" }],
    });
    const errors = validateLevel(level);
    expect(errors.some((e) => e.includes("not an integer"))).toBe(true);
  });

  it("rejects a dash character in any string field", () => {
    const dash = String.fromCharCode(0x2014);
    const level = baseLevel({
      opponent: { name: "Kevin Shades", persona: `Never wrong${dash}ever.`, color: "#35e0ff" },
    });
    const errors = validateLevel(level);
    expect(errors.some((e) => e.includes("dash character"))).toBe(true);
  });

  it("rejects more than one event on the same beat", () => {
    const level = baseLevel({
      events: [
        { type: "hit", beat: 10, dir: "up" },
        { type: "hit", beat: 10, dir: "down" },
      ],
    });
    const errors = validateLevel(level);
    expect(errors.some((e) => e.includes("collides with another event on the same beat"))).toBe(true);
  });
});
