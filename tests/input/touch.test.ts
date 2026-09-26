// @vitest-environment jsdom
// Touch and mouse mapping: swipes, taps by zone, hold, two finger cancel, multi touch.
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createInput, HOLD_MS } from "../../src/input/index";
import { gesture, makeHarness, pointer, ROOT_HEIGHT, ROOT_WIDTH, type Harness } from "./helpers";

let h: Harness;

beforeEach(() => {
  vi.useFakeTimers();
  h = makeHarness();
});

afterEach(() => {
  h.destroy();
  vi.useRealTimers();
});

describe("swipes", () => {
  it.each([
    ["right", 30, 0],
    ["left", -30, 0],
    ["up", 0, -30],
    ["down", 0, 30],
  ] as const)("a fast swipe of at least 24 px is a hit %s", (dir, dx, dy) => {
    gesture(h.root, { x: 200, y: 400, x2: 200 + dx, y2: 400 + dy, t0: 1000, t1: 1100 });
    expect(h.intents).toEqual([{ kind: "hit", direction: dir, t: 1100 }]);
  });

  it("picks the dominant axis on a diagonal swipe", () => {
    gesture(h.root, { x: 200, y: 400, x2: 240, y2: 420, t0: 0, t1: 100 });
    expect(h.intents).toEqual([{ kind: "hit", direction: "right", t: 100 }]);
  });

  it("accepts exactly 24 px within exactly 250 ms", () => {
    gesture(h.root, { x: 100, y: 100, x2: 124, y2: 100, t0: 0, t1: 250 });
    expect(h.intents).toEqual([{ kind: "hit", direction: "right", t: 250 }]);
  });

  it("ignores a swipe shorter than 24 px", () => {
    gesture(h.root, { x: 100, y: 100, x2: 118, y2: 100, t0: 0, t1: 100 });
    expect(h.intents).toEqual([]);
  });

  it("ignores a swipe slower than 250 ms", () => {
    gesture(h.root, { x: 100, y: 100, x2: 200, y2: 100, t0: 0, t1: 300 });
    expect(h.intents).toEqual([]);
  });

  it("works in landscape too", () => {
    h.destroy();
    h = makeHarness({}, ROOT_HEIGHT, ROOT_WIDTH);
    gesture(h.root, { x: 400, y: 200, x2: 400, y2: 150, t0: 0, t1: 80 });
    expect(h.intents).toEqual([{ kind: "hit", direction: "up", t: 80 }]);
  });
});

describe("taps", () => {
  it("left half is mashLeft", () => {
    gesture(h.root, { x: 50, y: 400, t0: 0, t1: 60 });
    expect(h.intents).toEqual([{ kind: "mashLeft", t: 60, direction: null }]);
  });

  it("right half is mashRight", () => {
    gesture(h.root, { x: 350, y: 400, t0: 0, t1: 60 });
    expect(h.intents).toEqual([{ kind: "mashRight", t: 60, direction: null }]);
  });

  it("center 30 percent is release", () => {
    gesture(h.root, { x: ROOT_WIDTH * 0.36, y: 100, t0: 0, t1: 60 });
    gesture(h.root, { x: ROOT_WIDTH * 0.64, y: 700, t0: 100, t1: 160 });
    expect(h.intents.map((i) => i.kind)).toEqual(["release", "release"]);
  });

  it("just outside the center band is a mash", () => {
    gesture(h.root, { x: ROOT_WIDTH * 0.34, y: 100, t0: 0, t1: 60 });
    gesture(h.root, { x: ROOT_WIDTH * 0.66, y: 100, t0: 100, t1: 160 });
    expect(h.intents.map((i) => i.kind)).toEqual(["mashLeft", "mashRight"]);
  });

  it("uses the root bounds, not the viewport", () => {
    h.destroy();
    const root = document.createElement("div");
    document.body.appendChild(root);
    root.getBoundingClientRect = () =>
      ({ left: 1000, top: 0, right: 1400, bottom: 800, width: 400, height: 800, x: 1000, y: 0, toJSON: () => ({}) }) as DOMRect;
    const intents: { kind: string }[] = [];
    const input = createInput(root, { onIntent: (i) => intents.push({ kind: i.kind }) });
    gesture(root, { x: 1050, y: 400, t0: 0, t1: 50 });
    expect(intents.map((i) => i.kind)).toEqual(["mashLeft"]);
    input.destroy();
    root.remove();
    h = makeHarness();
  });

  it("landscape zones follow the width", () => {
    h.destroy();
    h = makeHarness({}, ROOT_HEIGHT, ROOT_WIDTH);
    gesture(h.root, { x: 100, y: 200, t0: 0, t1: 50 });
    gesture(h.root, { x: 400, y: 200, t0: 100, t1: 150 });
    gesture(h.root, { x: 700, y: 200, t0: 200, t1: 250 });
    expect(h.intents.map((i) => i.kind)).toEqual(["mashLeft", "release", "mashRight"]);
  });

  it("a tap that drifted 12 px or more but did not swipe emits nothing", () => {
    gesture(h.root, { x: 50, y: 400, x2: 65, y2: 400, t0: 0, t1: 100 });
    expect(h.intents).toEqual([]);
  });

  it("mouse clicks are taps too", () => {
    pointer(h.root, "pointerdown", { id: 7, type: "mouse", x: 350, y: 10, t: 0 });
    pointer(h.root, "pointerup", { id: 7, type: "mouse", x: 350, y: 10, t: 40 });
    expect(h.intents).toEqual([{ kind: "mashRight", t: 40, direction: null }]);
  });

  it("ignores secondary mouse buttons", () => {
    pointer(h.root, "pointerdown", { id: 7, type: "mouse", x: 350, y: 10, t: 0, button: 2 });
    pointer(h.root, "pointerup", { id: 7, type: "mouse", x: 350, y: 10, t: 40, button: 2 });
    expect(h.intents).toEqual([]);
  });
});

describe("hold", () => {
  it("a press held over 180 ms without moving is holdStart then holdEnd on lift", () => {
    pointer(h.root, "pointerdown", { x: 200, y: 400, t: 1000 });
    vi.advanceTimersByTime(HOLD_MS - 1);
    expect(h.intents).toEqual([]);
    vi.advanceTimersByTime(1);
    expect(h.intents).toEqual([{ kind: "holdStart", t: 1000 + HOLD_MS, direction: null }]);
    pointer(h.root, "pointerup", { x: 200, y: 400, t: 1600 });
    expect(h.intents[1]).toEqual({ kind: "holdEnd", t: 1600, direction: null });
    expect(h.intents).toHaveLength(2);
  });

  it("moving 12 px before the hold fires cancels it", () => {
    pointer(h.root, "pointerdown", { x: 200, y: 400, t: 0 });
    pointer(h.root, "pointermove", { x: 200, y: 412, t: 50 });
    vi.advanceTimersByTime(400);
    pointer(h.root, "pointerup", { x: 200, y: 412, t: 400 });
    expect(h.intents).toEqual([]);
  });

  it("moving less than 12 px keeps the hold alive", () => {
    pointer(h.root, "pointerdown", { x: 200, y: 400, t: 0 });
    pointer(h.root, "pointermove", { x: 205, y: 405, t: 50 });
    vi.advanceTimersByTime(HOLD_MS);
    expect(h.intents.map((i) => i.kind)).toEqual(["holdStart"]);
  });

  it("a pointercancel while holding still ends the hold", () => {
    pointer(h.root, "pointerdown", { x: 200, y: 400, t: 0 });
    vi.advanceTimersByTime(HOLD_MS);
    pointer(h.root, "pointercancel", { x: 200, y: 400, t: 500 });
    expect(h.intents.map((i) => i.kind)).toEqual(["holdStart", "holdEnd"]);
  });

  it("a swipe after the hold started is still a holdEnd, not a hit", () => {
    pointer(h.root, "pointerdown", { x: 200, y: 400, t: 0 });
    vi.advanceTimersByTime(HOLD_MS);
    pointer(h.root, "pointermove", { x: 260, y: 400, t: 200 });
    pointer(h.root, "pointerup", { x: 260, y: 400, t: 210 });
    expect(h.intents.map((i) => i.kind)).toEqual(["holdStart", "holdEnd"]);
  });
});

describe("multi touch", () => {
  it("a two finger tap is a single cancel", () => {
    pointer(h.root, "pointerdown", { id: 1, x: 100, y: 400, t: 0 });
    pointer(h.root, "pointerdown", { id: 2, x: 300, y: 400, t: 10 });
    vi.advanceTimersByTime(60);
    pointer(h.root, "pointerup", { id: 1, x: 100, y: 400, t: 60 });
    pointer(h.root, "pointerup", { id: 2, x: 300, y: 400, t: 70 });
    expect(h.intents).toEqual([{ kind: "cancel", t: 70, direction: null }]);
  });

  it("a second finger suppresses the hold of the first", () => {
    pointer(h.root, "pointerdown", { id: 1, x: 100, y: 400, t: 0 });
    pointer(h.root, "pointerdown", { id: 2, x: 300, y: 400, t: 10 });
    vi.advanceTimersByTime(500);
    pointer(h.root, "pointerup", { id: 1, x: 100, y: 400, t: 500 });
    pointer(h.root, "pointerup", { id: 2, x: 300, y: 400, t: 510 });
    expect(h.intents).toEqual([]);
  });

  it("two fingers that moved are not a cancel", () => {
    pointer(h.root, "pointerdown", { id: 1, x: 100, y: 400, t: 0 });
    pointer(h.root, "pointerdown", { id: 2, x: 300, y: 400, t: 10 });
    pointer(h.root, "pointermove", { id: 2, x: 340, y: 400, t: 30 });
    pointer(h.root, "pointerup", { id: 1, x: 100, y: 400, t: 60 });
    pointer(h.root, "pointerup", { id: 2, x: 340, y: 400, t: 70 });
    expect(h.intents).toEqual([]);
  });

  it("tracks pointers by id so a stray up for an unknown id is ignored", () => {
    pointer(h.root, "pointerup", { id: 99, x: 100, y: 400, t: 60 });
    pointer(h.root, "pointermove", { id: 98, x: 100, y: 400, t: 60 });
    expect(h.intents).toEqual([]);
  });

  it("a duplicate pointerdown for an active id does not open a second slot", () => {
    pointer(h.root, "pointerdown", { id: 1, x: 100, y: 400, t: 0 });
    pointer(h.root, "pointerdown", { id: 1, x: 100, y: 400, t: 5 });
    pointer(h.root, "pointerup", { id: 1, x: 100, y: 400, t: 50 });
    expect(h.intents).toEqual([{ kind: "mashLeft", t: 50, direction: null }]);
  });

  it("interleaved single taps after a two finger gesture map normally again", () => {
    pointer(h.root, "pointerdown", { id: 1, x: 100, y: 400, t: 0 });
    pointer(h.root, "pointerdown", { id: 2, x: 300, y: 400, t: 10 });
    pointer(h.root, "pointerup", { id: 1, x: 100, y: 400, t: 60 });
    pointer(h.root, "pointerup", { id: 2, x: 300, y: 400, t: 70 });
    gesture(h.root, { id: 3, x: 350, y: 400, t0: 200, t1: 250 });
    expect(h.intents.map((i) => i.kind)).toEqual(["cancel", "mashRight"]);
  });
});

describe("root setup", () => {
  it("sets touch-action none and clears it on destroy", () => {
    expect(h.root.style.touchAction).toBe("none");
    h.input.destroy();
    expect(h.root.style.touchAction).toBe("");
  });

  it("prevents default on pointerdown, touchend, dblclick and contextmenu", () => {
    const down = pointer(h.root, "pointerdown", { x: 10, y: 10, t: 0 });
    expect(down.defaultPrevented).toBe(true);
    for (const name of ["touchend", "dblclick", "contextmenu"]) {
      const e = new Event(name, { cancelable: true, bubbles: true });
      h.root.dispatchEvent(e);
      expect(e.defaultPrevented).toBe(true);
    }
  });

  it("requests pointer capture on the root", () => {
    const capture = vi.fn();
    (h.root as HTMLElement & { setPointerCapture: (id: number) => void }).setPointerCapture = capture;
    pointer(h.root, "pointerdown", { id: 4, x: 10, y: 10, t: 0 });
    expect(capture).toHaveBeenCalledWith(4);
  });
});
