// @vitest-environment jsdom
// Keyboard mapping: directions, Space press and hold, Enter, Escape, the repeat guard and the debounce.
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { HOLD_MS, KEY_DEBOUNCE_MS } from "../../src/input/index";
import { key, makeHarness, type Harness } from "./helpers";

let h: Harness;

beforeEach(() => {
  vi.useFakeTimers();
  h = makeHarness();
});

afterEach(() => {
  h.destroy();
  vi.useRealTimers();
});

function tap(code: string, t: number): void {
  key(window, "keydown", code, t);
  key(window, "keyup", code, t + 20);
}

describe("directions", () => {
  it.each([
    ["ArrowUp", "up"],
    ["ArrowDown", "down"],
    ["KeyW", "up"],
    ["KeyS", "down"],
  ] as const)("%s is a hit %s", (code, dir) => {
    tap(code, 500);
    expect(h.intents).toEqual([{ kind: "hit", direction: dir, t: 500 }]);
  });

  it.each([
    ["ArrowLeft", "left", "mashLeft"],
    ["KeyA", "left", "mashLeft"],
    ["ArrowRight", "right", "mashRight"],
    ["KeyD", "right", "mashRight"],
  ] as const)("%s is a hit %s and a %s", (code, dir, mash) => {
    tap(code, 500);
    expect(h.intents).toEqual([
      { kind: "hit", direction: dir, t: 500 },
      { kind: mash, direction: null, t: 500 },
    ]);
  });

  it("falls back to event.key when code is missing", () => {
    const e = new KeyboardEvent("keydown", { key: "w", cancelable: true });
    Object.defineProperty(e, "timeStamp", { value: 42 });
    window.dispatchEvent(e);
    expect(h.intents).toEqual([{ kind: "hit", direction: "up", t: 42 }]);
  });

  it("prevents the default of handled keys only", () => {
    expect(key(window, "keydown", "ArrowDown", 0).defaultPrevented).toBe(true);
    expect(key(window, "keydown", "KeyQ", 0).defaultPrevented).toBe(false);
    expect(h.intents).toHaveLength(1);
  });
});

describe("Enter and Escape", () => {
  it("Enter is confirm", () => {
    tap("Enter", 10);
    expect(h.intents).toEqual([{ kind: "confirm", direction: null, t: 10 }]);
  });

  it("Escape is cancel", () => {
    tap("Escape", 10);
    expect(h.intents).toEqual([{ kind: "cancel", direction: null, t: 10 }]);
  });
});

describe("Space", () => {
  it("a short press is release at key up", () => {
    key(window, "keydown", "Space", 100);
    vi.advanceTimersByTime(50);
    expect(h.intents).toEqual([]);
    key(window, "keyup", "Space", 150);
    expect(h.intents).toEqual([{ kind: "release", direction: null, t: 150 }]);
  });

  it("holding over 180 ms is holdStart then holdEnd at key up", () => {
    key(window, "keydown", "Space", 100);
    vi.advanceTimersByTime(HOLD_MS);
    expect(h.intents).toEqual([{ kind: "holdStart", direction: null, t: 100 + HOLD_MS }]);
    vi.advanceTimersByTime(500);
    key(window, "keyup", "Space", 800);
    expect(h.intents[1]).toEqual({ kind: "holdEnd", direction: null, t: 800 });
    expect(h.intents).toHaveLength(2);
  });

  it("a key up without a matching key down emits nothing", () => {
    key(window, "keyup", "Space", 10);
    expect(h.intents).toEqual([]);
  });
});

describe("repeat guard", () => {
  it("ignores keydown events with repeat set", () => {
    key(window, "keydown", "ArrowUp", 0);
    key(window, "keydown", "ArrowUp", 500, true);
    key(window, "keydown", "ArrowUp", 1000, true);
    key(window, "keyup", "ArrowUp", 1200);
    expect(h.intents).toHaveLength(1);
  });

  it("ignores a second keydown while the key is still held even without the repeat flag", () => {
    key(window, "keydown", "Enter", 0);
    key(window, "keydown", "Enter", 500);
    expect(h.intents).toHaveLength(1);
    key(window, "keyup", "Enter", 600);
    key(window, "keydown", "Enter", 700);
    expect(h.intents).toHaveLength(2);
  });

  it("Space repeats do not restart the hold timer", () => {
    key(window, "keydown", "Space", 0);
    vi.advanceTimersByTime(100);
    key(window, "keydown", "Space", 100, true);
    vi.advanceTimersByTime(HOLD_MS - 100);
    expect(h.intents.map((i) => i.kind)).toEqual(["holdStart"]);
  });
});

describe("debounce", () => {
  it("drops a same key pressed again under 30 ms", () => {
    tap("ArrowUp", 0);
    tap("ArrowUp", KEY_DEBOUNCE_MS - 1);
    expect(h.intents).toHaveLength(1);
  });

  it("accepts a same key at 30 ms or later", () => {
    tap("ArrowUp", 0);
    tap("ArrowUp", KEY_DEBOUNCE_MS);
    expect(h.intents).toHaveLength(2);
  });

  it("does not debounce different keys", () => {
    tap("ArrowUp", 0);
    tap("ArrowDown", 5);
    expect(h.intents.map((i) => i.direction)).toEqual(["up", "down"]);
  });

  it("the debounce window starts at the accepted press, not at the dropped one", () => {
    tap("Enter", 0);
    tap("Enter", 20);
    tap("Enter", 40);
    expect(h.intents).toHaveLength(2);
  });
});

describe("custom keyboard target", () => {
  it("reads keys from the given target instead of window", () => {
    h.destroy();
    const target = document.createElement("div");
    h = makeHarness({ keyboardTarget: target });
    key(window, "keydown", "Enter", 0);
    expect(h.intents).toEqual([]);
    key(target, "keydown", "Enter", 0);
    expect(h.intents.map((i) => i.kind)).toEqual(["confirm"]);
  });
});
