// Mobile and load path of v2: the clip picker keeps one file per event and skips what nothing plays,
// timeouts never hang the battle start, the pixel ratio cap and the drop boom scheduled on the heard clock.
import { describe, expect, it } from "vitest";
import { readFileSync, statSync } from "node:fs";
import { PHRASE_S, pickClips, removeDrift, restartsOnPlay, withTimeout } from "../src/render3d/fighters";
import { pixelRatioCap } from "../src/render3d/stage";
import { dropBoomTime } from "../src/audio/layers";

const manifest = JSON.parse(readFileSync("assets/3d/manifest.json", "utf8")) as {
  characters: { file: string; role?: string }[];
  clips: { file: string; event: string; canon?: string }[];
};

describe("pickClips", () => {
  const picked = pickClips(manifest.clips);
  const isCanon = (c: { canon?: string }) => !!c.canon && c.canon !== "generic";

  it("keeps exactly one clip per event: the first canon one, else the first listed", () => {
    const events = picked.map((c) => c.event);
    expect(new Set(events).size).toBe(events.length);
    for (const c of picked) {
      const same = manifest.clips.filter((x) => x.event === c.event);
      expect(c).toBe(same.find(isCanon) ?? same[0]);
    }
  });

  it("never plays a generic alternate when the event has a canon move (the taunt is the chin up stare)", () => {
    for (const c of picked) if (manifest.clips.some((x) => x.event === c.event && isCanon(x))) expect(isCanon(c)).toBe(true);
    expect(picked.find((c) => c.event === "enemy_taunt")?.file).toBe("anims/pose_taunt_chinup.glb");
  });

  it("is decided by the manifest alone: the same pick on every call, whatever finishes loading first", () => {
    expect(pickClips(manifest.clips).map((c) => c.file)).toEqual(picked.map((c) => c.file));
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

describe("restartsOnPlay", () => {
  it("never restarts a loop: the idle and the mash groove resume where they were", () => {
    expect(restartsOnPlay(false, 2.3, 1.1)).toBe(false);
    expect(restartsOnPlay(false, 15, 0)).toBe(false);
  });
  it("resumes a long dance phrase mid way, restarts it once it played to its end", () => {
    expect(restartsOnPlay(true, 16.8, 3.2)).toBe(false);
    expect(restartsOnPlay(true, 16.8, 16.8)).toBe(true);
  });
  it("restarts a pose or a reaction from its first frame", () => {
    expect(restartsOnPlay(true, 1.62, 0.8)).toBe(true);
    expect(restartsOnPlay(true, PHRASE_S - 0.01, 2)).toBe(true);
  });
});

describe("removeDrift", () => {
  it("brings a travelling Hips track back to its start on the floor, keeping the height and the sway", () => {
    // Stumble backwards: 1.3 m back on z, down to the floor, a sway on x in the middle.
    const track = { times: [0, 1, 2], values: [0, 0.7, 0, 0.2, 0.5, -0.6, 0, 0.1, -1.3] };
    removeDrift(track);
    expect(track.values[6]).toBeCloseTo(0);
    expect(track.values[8]).toBeCloseTo(0);
    expect(track.values[7]).toBeCloseTo(0.1);
    expect(track.values[3]).toBeCloseTo(0.2);
    expect(track.values[5]).toBeCloseTo(0.05);
  });
  it("leaves a clip that does not travel untouched", () => {
    const track = { times: [0, 1, 2], values: [0, 0.7, 0, 0.1, 0.72, 0.05, 0, 0.7, 0] };
    const before = [...track.values];
    removeDrift(track);
    expect(track.values).toEqual(before);
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
