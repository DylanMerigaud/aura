// @vitest-environment jsdom
// Timestamp preservation, the calibration offset, the enabled flag, destroy and the intent pool.
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createInput, HOLD_MS, type Intent } from "../../src/input/index";
import { gesture, key, makeHarness, pointer, type Harness } from "./helpers";

let h: Harness;

beforeEach(() => {
  vi.useFakeTimers();
  h = makeHarness();
});

afterEach(() => {
  h.destroy();
  vi.useRealTimers();
});

describe("timestamps", () => {
  it("uses the event timeStamp, not the wall clock", () => {
    vi.setSystemTime(new Date(2030, 0, 1));
    gesture(h.root, { x: 50, y: 50, t0: 12345.5, t1: 12400.25 });
    key(window, "keydown", "Enter", 777.125);
    expect(h.intents.map((i) => i.t)).toEqual([12400.25, 777.125]);
  });

  it("stamps a swipe with the lift time and a hold start with press time plus 180 ms", () => {
    gesture(h.root, { x: 50, y: 50, x2: 150, y2: 50, t0: 1000, t1: 1090 });
    pointer(h.root, "pointerdown", { x: 50, y: 50, t: 2000 });
    vi.advanceTimersByTime(HOLD_MS);
    expect(h.intents.map((i) => i.t)).toEqual([1090, 2000 + HOLD_MS]);
  });
});

describe("calibration offset", () => {
  it("is added to every timestamp", () => {
    h.destroy();
    h = makeHarness({ calibrationOffsetMs: -35 });
    gesture(h.root, { x: 50, y: 50, t0: 1000, t1: 1050 });
    key(window, "keydown", "Escape", 2000);
    pointer(h.root, "pointerdown", { x: 50, y: 50, t: 3000 });
    vi.advanceTimersByTime(HOLD_MS);
    pointer(h.root, "pointerup", { x: 50, y: 50, t: 3500 });
    expect(h.intents.map((i) => i.t)).toEqual([1050 - 35, 2000 - 35, 3000 + HOLD_MS - 35, 3500 - 35]);
  });

  it("can be changed at runtime", () => {
    key(window, "keydown", "Enter", 100);
    key(window, "keyup", "Enter", 110);
    h.input.calibrationOffsetMs = 12;
    expect(h.input.calibrationOffsetMs).toBe(12);
    key(window, "keydown", "Enter", 200);
    expect(h.intents.map((i) => i.t)).toEqual([100, 212]);
  });
});

describe("enabled flag", () => {
  it("drops pointer and key events while disabled", () => {
    h.input.enabled = false;
    gesture(h.root, { x: 50, y: 50, t0: 0, t1: 50 });
    key(window, "keydown", "Enter", 60);
    key(window, "keyup", "Enter", 70);
    expect(h.intents).toEqual([]);
    h.input.enabled = true;
    gesture(h.root, { x: 50, y: 50, t0: 100, t1: 150 });
    expect(h.intents.map((i) => i.kind)).toEqual(["mashLeft"]);
  });

  it("starts disabled when asked", () => {
    h.destroy();
    h = makeHarness({ enabled: false });
    expect(h.input.enabled).toBe(false);
    key(window, "keydown", "Enter", 0);
    expect(h.intents).toEqual([]);
  });

  it("disabling mid press cancels the pending hold and swallows the lift", () => {
    pointer(h.root, "pointerdown", { x: 50, y: 50, t: 0 });
    h.input.enabled = false;
    vi.advanceTimersByTime(HOLD_MS * 2);
    h.input.enabled = true;
    pointer(h.root, "pointerup", { x: 50, y: 50, t: 400 });
    expect(h.intents).toEqual([]);
  });

  it("disabling during a Space hold forgets the key so the lift emits nothing", () => {
    key(window, "keydown", "Space", 0);
    vi.advanceTimersByTime(HOLD_MS);
    expect(h.intents.map((i) => i.kind)).toEqual(["holdStart"]);
    h.input.enabled = false;
    key(window, "keyup", "Space", 500);
    expect(h.intents).toHaveLength(1);
  });
});

describe("destroy", () => {
  it("removes every listener and clears pending timers", () => {
    pointer(h.root, "pointerdown", { x: 50, y: 50, t: 0 });
    h.input.destroy();
    vi.advanceTimersByTime(HOLD_MS * 2);
    pointer(h.root, "pointerup", { x: 50, y: 50, t: 400 });
    key(window, "keydown", "Enter", 500);
    gesture(h.root, { x: 50, y: 50, t0: 600, t1: 650 });
    expect(h.intents).toEqual([]);
    expect(vi.getTimerCount()).toBe(0);
  });

  it("is idempotent", () => {
    h.input.destroy();
    expect(() => h.input.destroy()).not.toThrow();
  });

  it("window blur resets pressed state", () => {
    key(window, "keydown", "Space", 0);
    window.dispatchEvent(new Event("blur"));
    vi.advanceTimersByTime(HOLD_MS * 2);
    key(window, "keyup", "Space", 500);
    expect(h.intents).toEqual([]);
  });
});

describe("intent pool", () => {
  it("reuses the same intent object across emissions", () => {
    const seen: Intent[] = [];
    const root = document.createElement("div");
    document.body.appendChild(root);
    const input = createInput(root, { onIntent: (i) => seen.push(i) });
    key(window, "keydown", "Enter", 0);
    key(window, "keyup", "Enter", 5);
    key(window, "keydown", "Escape", 100);
    expect(seen).toHaveLength(2);
    expect(seen[0]).toBe(seen[1]);
    expect(seen[1].kind).toBe("cancel");
    input.destroy();
    root.remove();
  });

  it("does not allocate a new intent per event in a mash burst", () => {
    const seen = new Set<Intent>();
    const root = document.createElement("div");
    document.body.appendChild(root);
    const input = createInput(root, { onIntent: (i) => seen.add(i) });
    for (let n = 0; n < 200; n++) {
      pointer(root, "pointerdown", { id: 1, x: 10, y: 10, t: n * 40 });
      pointer(root, "pointerup", { id: 1, x: 10, y: 10, t: n * 40 + 20 });
    }
    expect(seen.size).toBe(1);
    input.destroy();
    root.remove();
  });
});
