// Tests for the v2 UI's pure logic: progress save and load, star display, touch zone routing.
// No DOM here on purpose (see src/v2/ui/progress.ts): these run in plain Node.
import { describe, expect, it } from "vitest";
import { loadProgress, nextProgress, saveProgress, type ProgressV2 } from "../src/v2/ui/progress";
import { edgeDir, mashTap, onPointerDown, swipeDir } from "../src/v2/ui/touch";
import { approach, clamp, pct, starGlyphs } from "../src/v2/ui/format";
import { visiblePrompts } from "../src/v2/ui/hud/queue";
import type { EventState } from "../src/qte/runner";
import type { QteEvent } from "../src/qte/types";

describe("progress", () => {
  it("loads a default when nothing was saved", () => {
    const p = loadProgress();
    expect(p.unlocked).toBeGreaterThanOrEqual(1);
    expect(p.best).toEqual(expect.any(Object));
  });

  it("round trips through save and load", () => {
    const p: ProgressV2 = { unlocked: 3, best: { 1: { score: 900, stars: 3, accuracy: 0.95, burst: 40 } } };
    saveProgress(p);
    const loaded = loadProgress();
    expect(loaded).toEqual(p);
  });

  it("nextProgress keeps the best of every field and only unlocks on a win", () => {
    const p: ProgressV2 = { unlocked: 1, best: { 1: { score: 500, stars: 1, accuracy: 0.6, burst: 20 } } };
    const win = nextProgress(p, 1, 0, { score: 300, stars: 2, accuracy: 0.8, burst: 50 }, 5);
    expect(win.best[1]).toEqual({ score: 500, stars: 2, accuracy: 0.8, burst: 50 });
    expect(win.unlocked).toBe(2);

    const lose = nextProgress(p, 1, 0, { score: 300, stars: 0, accuracy: 0.4, burst: 5 }, 5);
    expect(lose.unlocked).toBe(1);
  });

  it("nextProgress never unlocks past the total node count", () => {
    const p: ProgressV2 = { unlocked: 4, best: {} };
    const r = nextProgress(p, 5, 4, { score: 100, stars: 1, accuracy: 0.9, burst: 10 }, 5);
    expect(r.unlocked).toBe(5);
  });
});

describe("format", () => {
  it("clamps", () => {
    expect(clamp(5, 0, 1)).toBe(1);
    expect(clamp(-5, 0, 1)).toBe(0);
    expect(clamp(0.5, 0, 1)).toBe(0.5);
  });

  it("stars are filled then empty glyphs, always three", () => {
    expect(starGlyphs(0)).toBe("☆☆☆");
    expect(starGlyphs(1)).toBe("★☆☆");
    expect(starGlyphs(3)).toBe("★★★");
  });

  it("pct rounds and clamps to 0..100", () => {
    expect(pct(0.865)).toBe("87%");
    expect(pct(-1)).toBe("0%");
    expect(pct(2)).toBe("100%");
  });

  it("approach moves toward the target without overshooting past it over many steps", () => {
    let v = 0;
    for (let i = 0; i < 200; i++) v = approach(v, 1, 1 / 60, 8);
    expect(v).toBeCloseTo(1, 2);
  });
});

describe("touch zone routing", () => {
  it("mash: left half is left, right half is right, center third is space down", () => {
    expect(mashTap(0.1)).toEqual({ kind: "dir", dir: "left" });
    expect(mashTap(0.9)).toEqual({ kind: "dir", dir: "right" });
    expect(mashTap(0.5)).toEqual({ kind: "space", down: true });
  });

  it("hit: an edge tap fires a direction, the dead center fires nothing", () => {
    expect(edgeDir(0.5, 0.5)).toBeNull();
    expect(edgeDir(0.05, 0.5)).toBe("left");
    expect(edgeDir(0.95, 0.5)).toBe("right");
    expect(edgeDir(0.5, 0.05)).toBe("up");
    expect(edgeDir(0.5, 0.95)).toBe("down");
  });

  it("hit: a swipe under the threshold is null, past it fires the dominant axis", () => {
    expect(swipeDir(5, 5)).toBeNull();
    expect(swipeDir(-40, 5)).toBe("left");
    expect(swipeDir(5, 40)).toBe("down");
  });

  it("onPointerDown routes by mode", () => {
    expect(onPointerDown("hold", 0.5, 0.5)).toEqual({ kind: "space", down: true });
    expect(onPointerDown("mash", 0.9, 0.5)).toEqual({ kind: "dir", dir: "right" });
    expect(onPointerDown("hit", 0.5, 0.5)).toBeNull();
    expect(onPointerDown("hit", 0.02, 0.5)).toEqual({ kind: "dir", dir: "left" });
    expect(onPointerDown("none", 0.5, 0.5)).toBeNull();
  });
});

describe("prompt queue", () => {
  const st = (ev: QteEvent, phase: EventState["phase"] = "pending"): EventState => ({ ev, phase, held: false, progress: 0, lastDir: null, result: null });
  const hit = (beat: number) => st({ type: "hit", beat, dir: "up" });

  it("never shows a HOLD ring over a HIT arrow: the hold waits until the hit resolves", () => {
    const h = hit(8);
    const hold = st({ type: "hold", beat: 10, length: 2 });
    expect(visiblePrompts([h, hold])).toEqual([h]);
    h.phase = "done";
    expect(visiblePrompts([h, hold])).toEqual([hold]);
  });

  it("shows one panel at a time, and what is queued behind a panel waits", () => {
    const combo = st({ type: "combo", beat: 12, dirs: ["up", "left", "down"] });
    const mash = st({ type: "mash", beat: 14, length: 4 });
    expect(visiblePrompts([combo, mash, hit(20)])).toEqual([combo]);
  });

  it("lets a run of HIT arrows share the lane, up to the next panel", () => {
    const a = hit(8);
    const b = hit(9);
    const hold = st({ type: "hold", beat: 10, length: 2 });
    expect(visiblePrompts([a, b, hold, hit(14)])).toEqual([a, b]);
  });

  it("reuses the output array (no allocation per frame)", () => {
    const out: EventState[] = [];
    expect(visiblePrompts([hit(8)], out)).toBe(out);
    expect(visiblePrompts([], out)).toEqual([]);
  });
});
