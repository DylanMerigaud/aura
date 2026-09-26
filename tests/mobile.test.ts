// Mobile and load path of v2: the clip picker keeps one file per event and skips what nothing plays,
// timeouts never hang the battle start, the pixel ratio cap and the drop boom scheduled on the heard clock.
import { describe, expect, it } from "vitest";
import { readFileSync, statSync } from "node:fs";
import { pickClips, withTimeout } from "../src/render3d/fighters";
import { pixelRatioCap } from "../src/render3d/stage";
import { dropBoomTime } from "../src/audio/layers";

const manifest = JSON.parse(readFileSync("assets/3d/manifest.json", "utf8")) as {
  characters: { file: string; role?: string }[];
  clips: { file: string; event: string }[];
};

describe("pickClips", () => {
  const picked = pickClips(manifest.clips);

  it("keeps exactly one clip per event, the first listed", () => {
    const events = picked.map((c) => c.event);
    expect(new Set(events).size).toBe(events.length);
    for (const c of picked) expect(manifest.clips.find((x) => x.event === c.event)).toBe(c);
  });

  it("skips the crowd and entrance clips nothing plays", () => {
    expect(picked.some((c) => /^crowd_|^entrance/.test(c.event))).toBe(false);
    expect(picked.map((c) => c.event)).toEqual(expect.arrayContaining(["idle_groove", "enemy_idle", "release", "hit_left"]));
  });

  it("downloads a fraction of the clip files", () => {
    const size = (files: Iterable<string>) => [...new Set(files)].reduce((n, f) => n + statSync(`assets/3d/${f}`).size, 0);
    expect(size(picked.map((c) => c.file))).toBeLessThan(0.85 * size(manifest.clips.map((c) => c.file)));
  });
});

describe("withTimeout", () => {
  it("rejects a promise that never settles", async () => {
    await expect(withTimeout(new Promise(() => {}), 20, "x")).rejects.toThrow(/timed out/);
  });
  it("passes a fast value through", async () => {
    await expect(withTimeout(Promise.resolve(3), 50)).resolves.toBe(3);
  });
});

describe("pixelRatioCap", () => {
  it("caps phones at 1 and desktops at 1.5", () => {
    expect(pixelRatioCap(3, true)).toBe(1);
    expect(pixelRatioCap(2, false)).toBe(1.5);
    expect(pixelRatioCap(1, false)).toBe(1);
    expect(pixelRatioCap(0, true)).toBe(1);
  });
});

describe("dropBoomTime", () => {
  it("lands on the heard beat, compensating the output latency", () => {
    // Context at 10.00, the ear hears 9.95 (50 ms latency), drop half a beat away at 120 BPM.
    expect(dropBoomTime(10, 9.95, 0.5, 0.5, 1)).toBeCloseTo(10.2, 6);
  });
  it("follows the playback rate and never schedules in the past", () => {
    expect(dropBoomTime(10, 9.95, 1, 0.5, 1.25)).toBeCloseTo(10.35, 6);
    expect(dropBoomTime(10, 9.9, 0, 0.5, 1)).toBe(10);
  });
});
