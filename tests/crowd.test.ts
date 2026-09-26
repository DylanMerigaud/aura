// The crowd roster door (at least 5 distinct character files, none on more than 40 percent of the slots),
// the files it may use (never the player nor the rival), the slots clear of the over the shoulder shot
// and the rig count per quality tier.
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { existsSync } from "node:fs";
import { CROWD_MAX, buildRoster, crowdBudget, crowdCandidates, crowdFiles, crowdSlots, rosterOk } from "../src/render3d/crowdRoster";
import { LAYOUT, MOVE_S, project, shotPose, type V3 } from "../src/render3d/director";

const manifest = JSON.parse(readFileSync("assets/3d/manifest.json", "utf8")) as { characters: { file: string; role?: string }[] };
const files = crowdCandidates(manifest.characters);

describe("crowdFiles", () => {
  it("ships at least 5 distinct silhouette files, each on disk, never the player nor the ninja", () => {
    const shipped = crowdFiles(manifest.characters);
    expect(new Set(shipped).size).toBeGreaterThanOrEqual(5);
    for (const f of shipped) expect(existsSync(`assets/3d/${f}`)).toBe(true);
    expect(shipped.some((f) => /james|mannequin|ninja/.test(f))).toBe(false);
  });
  it("candidates: every crowd role file plus the elder, never the player nor the ninja", () => {
    for (const c of manifest.characters) if (c.role === "crowd") expect(files).toContain(c.file);
    expect(files).toContain("characters/abe_enemy_elder.glb");
    expect(files.some((f) => /james|mannequin|ninja/.test(f))).toBe(false);
    expect(files.length).toBeGreaterThanOrEqual(7);
  });
});

describe("roster door", () => {
  it("fails under 5 distinct files", () => {
    expect(rosterOk(buildRoster(["a", "b", "c", "d"], 16))).toBe(false);
    expect(rosterOk([])).toBe(false);
  });

  it("fails when one file holds more than 40 percent of the slots", () => {
    expect(rosterOk(["a", "a", "a", "a", "a", "a", "a", "b", "c", "d", "e", "f"])).toBe(false);
    expect(rosterOk(["a", "a", "a", "a", "b", "c", "d", "e", "f", "g"])).toBe(true);
  });

  it("passes for the manifest's crowd at every tier, each prefix of the full roster included", () => {
    for (const seed of [1, 7, 42, 1234]) {
      const roster = buildRoster(files, CROWD_MAX, seed);
      expect(roster).toHaveLength(CROWD_MAX);
      for (let n = 8; n <= CROWD_MAX; n++) expect(rosterOk(roster.slice(0, n))).toBe(true);
    }
  });

  it("passes with only 5 files left and never seats the same file twice in a row", () => {
    const roster = buildRoster(files.slice(0, 5), CROWD_MAX, 3);
    expect(rosterOk(roster)).toBe(true);
    for (let i = 1; i < roster.length; i++) expect(roster[i]).not.toBe(roster[i - 1]);
  });
});

describe("crowdBudget", () => {
  it("drops from 16 to 12 to 8 rigs with the adaptive quality, a touch screen starts at 12", () => {
    expect(crowdBudget(0, false)).toBe(16);
    expect(crowdBudget(0, true)).toBe(12);
    expect(crowdBudget(1, false)).toBe(12);
    expect(crowdBudget(2, false)).toBe(8);
    expect(crowdBudget(2, true)).toBe(8);
  });
});

describe("crowdSlots", () => {
  const eye = 1.6;
  it("never stands between an over the shoulder camera and the fighters, in landscape and portrait", () => {
    for (const n of [8, 12, 16]) {
      const slots = crowdSlots(n);
      expect(slots).toHaveLength(n);
      for (const aspect of [16 / 9, 9 / 16, 9 / 19.5])
        for (const kind of ["ots", "otsWide"] as const)
          for (let t = 0; t <= MOVE_S; t += 1) {
            const pose = shotPose(kind, t, 0, aspect);
            const [ex, , ed] = project(pose, aspect, [LAYOUT.enemy[0], eye, LAYOUT.enemy[2]]);
            const pd = project(pose, aspect, [LAYOUT.player[0], eye, LAYOUT.player[2]])[2];
            for (const s of slots) {
              expect(Math.hypot(pose.pos[0] - s.x, pose.pos[2] - s.z)).toBeGreaterThan(2.5);
              const [x, y, z] = project(pose, aspect, [s.x, eye, s.z] as V3);
              // Always well behind our shoulder; one in frame nearer than the enemy stays clear of him on screen.
              const inFrame = z > 0 && x > -0.1 && x < 1.1 && y > -0.1 && y < 1.1;
              if (inFrame) expect(z).toBeGreaterThan(pd + 3);
              if (inFrame && z < ed) expect(Math.abs(x - ex)).toBeGreaterThan(0.3);
            }
          }
    }
  });

  it("keeps every slot outside the ring and off the camera side", () => {
    for (const s of crowdSlots(16)) {
      expect(Math.hypot(s.x, s.z)).toBeGreaterThan(6.5);
      expect(Math.abs(s.angle - Math.PI)).toBeLessThan(Math.PI - 0.99);
    }
  });
});
