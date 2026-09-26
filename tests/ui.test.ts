// Tests for the v2 UI's pure logic: progress save and load, star display, touch zone routing.
// No DOM here on purpose (see src/v2/ui/progress.ts): these run in plain Node.
import { describe, expect, it } from "vitest";
import { loadProgress, nextProgress, saveProgress, type ProgressV2 } from "../src/v2/ui/progress";
import { isTapKey, lift, newTapState, press, routeKey, zoneMode, type KeyLike } from "../src/v2/ui/touch";
import { approach, clamp, pct, starGlyphs } from "../src/v2/ui/format";
import { newGate, visiblePrompts } from "../src/v2/ui/hud/queue";
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

describe("tap routing (TAP ONLY)", () => {
  it("every press is a tap down, a second thumb included", () => {
    const s = newTapState();
    expect(press(s, "p1")).toBe(true);
    expect(press(s, "p2")).toBe(true);
  });

  it("the tap up comes with the last finger lifted, never without a press", () => {
    const s = newTapState();
    expect(lift(s, "p1")).toBe(false);
    press(s, "p1");
    press(s, "p2");
    expect(lift(s, "p1")).toBe(false);
    expect(lift(s, "p2")).toBe(true);
    expect(lift(s, "p2")).toBe(false);
  });

  it("zoneMode: the opponent turn wins, mash turns into release as the ring closes", () => {
    expect(zoneMode("mash", "opponent", true)).toBe("opponent");
    expect(zoneMode("hit", "opponent", false)).toBe("opponent");
    expect(zoneMode("mash", "player", false)).toBe("mash");
    expect(zoneMode("mash", "player", true)).toBe("release");
    expect(zoneMode("hold", "player", true)).toBe("hold");
  });
});

describe("battle keyboard routing (any key is a tap)", () => {
  const k = (type: string, code: string, timeStamp = 0, repeat = false): KeyLike => ({ type, code, timeStamp, repeat });

  it("a key press and release reach the game as a tap, with their own timestamps", () => {
    const s = newTapState();
    expect(routeKey(s, k("keydown", "Space", 100))).toEqual({ prevent: true, input: { kind: "tap", down: true, at: 100 } });
    expect(routeKey(s, k("keyup", "Space", 350))).toEqual({ prevent: true, input: { kind: "tap", down: false, at: 350 } });
  });

  it("letters, arrows and Enter are taps too; system keys are left alone", () => {
    for (const c of ["KeyJ", "ArrowLeft", "Enter", "Digit6"]) expect(isTapKey(c)).toBe(true);
    for (const c of ["Escape", "Tab", "MetaLeft", "ShiftRight", "F5"]) expect(isTapKey(c)).toBe(false);
    expect(routeKey(newTapState(), k("keydown", "Escape"))).toEqual({ prevent: false, input: null });
  });

  it("two keys alternated during a mash are two taps", () => {
    const s = newTapState();
    expect(routeKey(s, k("keydown", "KeyF")).input).toMatchObject({ kind: "tap", down: true });
    expect(routeKey(s, k("keydown", "KeyJ")).input).toMatchObject({ kind: "tap", down: true });
    expect(routeKey(s, k("keyup", "KeyF")).input).toBeNull();
    expect(routeKey(s, k("keyup", "KeyJ")).input).toMatchObject({ kind: "tap", down: false });
  });

  it("auto repeat is ignored but still prevented", () => {
    const s = newTapState();
    routeKey(s, k("keydown", "Space"));
    expect(routeKey(s, k("keydown", "Space", 50, true))).toEqual({ prevent: true, input: null });
  });

  it("never a release without a press in the same battle", () => {
    expect(routeKey(newTapState(), k("keyup", "Space"))).toEqual({ prevent: true, input: null });
  });

  it("maps the event timestamp through the clock", () => {
    const r = routeKey(newTapState(), k("keydown", "ArrowRight", 1000), (t) => t / 1000);
    expect(r.input).toMatchObject({ at: 1 });
  });

  it("a fake window: capture listener feeds game.input and stops the event from reaching screens", () => {
    const inputs: unknown[] = [];
    const screenSaw: string[] = [];
    const s = newTapState();
    const fire = (type: string, code: string) => {
      let stopped = false;
      let prevented = false;
      const ev = { ...k(type, code), preventDefault: () => (prevented = true), stopImmediatePropagation: () => (stopped = true) };
      const r = routeKey(s, ev);
      if (r.prevent) {
        ev.preventDefault();
        ev.stopImmediatePropagation();
      }
      if (r.input) inputs.push(r.input);
      if (!stopped) screenSaw.push(code);
      return prevented;
    };
    expect(fire("keydown", "Space")).toBe(true);
    expect(fire("keyup", "Space")).toBe(true);
    fire("keydown", "Escape");
    expect(inputs).toHaveLength(2);
    expect(screenSaw).toEqual(["Escape"]);
  });
});

describe("prompt queue", () => {
  const st = (ev: QteEvent, phase: EventState["phase"] = "pending"): EventState => ({ ev, phase, held: false, progress: 0, lastDir: null, result: null });
  const hit = (beat: number) => st({ type: "hit", beat, dir: "up" });
  const SPB = 0.5;

  it("draws only the current HIT arrow: the next one appears once it resolves", () => {
    const gate = newGate();
    const a = hit(8);
    const b = hit(9);
    expect(visiblePrompts([a, b], 3.5, SPB, gate)).toEqual([a]);
    a.phase = "done";
    expect(visiblePrompts([b], 4.01, SPB, gate)).toEqual([b]);
  });

  it("never shows a HOLD ring over a HIT arrow: the hold waits until the hit resolves", () => {
    const gate = newGate();
    const h = hit(8);
    const hold = st({ type: "hold", beat: 10, length: 2 });
    expect(visiblePrompts([h, hold], 3.5, SPB, gate)).toEqual([h]);
    h.phase = "done";
    expect(visiblePrompts([hold], 4.1, SPB, gate)).toEqual([hold]);
  });

  it("shows nothing but the panel during a COMBO, MASH or HOLD", () => {
    const gate = newGate();
    const combo = st({ type: "combo", beat: 12, dirs: ["up", "left", "down"] });
    const mash = st({ type: "mash", beat: 14, length: 4 });
    expect(visiblePrompts([combo, mash, hit(20)], 4, SPB, gate)).toEqual([combo]);
  });

  it("keeps one beat of silence after a panel resolves", () => {
    const gate = newGate();
    const hold = st({ type: "hold", beat: 10, length: 2 });
    const next = hit(13);
    expect(visiblePrompts([hold, next], 5.5, SPB, gate)).toEqual([hold]);
    hold.phase = "done";
    expect(visiblePrompts([next], 6.0, SPB, gate)).toEqual([]);
    expect(visiblePrompts([next], 6.4, SPB, gate)).toEqual([]);
    expect(visiblePrompts([next], 6.5, SPB, gate)).toEqual([next]);
  });

  it("no silence after a plain HIT", () => {
    const gate = newGate();
    const a = hit(8);
    const b = hit(9);
    visiblePrompts([a, b], 3.9, SPB, gate);
    a.phase = "done";
    expect(visiblePrompts([b], 4.0, SPB, gate)).toEqual([b]);
  });

  it("reuses the output array (no allocation per frame)", () => {
    const gate = newGate();
    const out: EventState[] = [];
    expect(visiblePrompts([hit(8)], 0, SPB, gate, out)).toBe(out);
    expect(visiblePrompts([], 0, SPB, gate, out)).toEqual([]);
  });
});
