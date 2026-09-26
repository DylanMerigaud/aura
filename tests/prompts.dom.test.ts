// @vitest-environment jsdom
// Snapshot of the QTE prompt layer (src/v2/ui/hud/arrows.ts): each prompt type is rendered to a
// recording canvas and the drawn shape names are asserted (addendum 17:50: arrows only for swipes).
import { beforeEach, describe, expect, it } from "vitest";
import type { EventState } from "../src/qte/runner";
import type { QteEvent } from "../src/qte/types";
import type { Frame } from "../src/v2/contracts";
import { buildArrows, resetTaught } from "../src/v2/ui/hud/arrows";

// jsdom has no canvas: every 2D context call is a no op that returns another no op.
const noop: any = new Proxy(function () {}, {
  get: (_t, k) => (k === "measureText" ? () => ({ width: 10 }) : noop),
  set: () => true,
  apply: () => noop,
});
HTMLCanvasElement.prototype.getContext = (() => noop) as any;

const SPB = 0.5;
const st = (ev: QteEvent, extra: Partial<EventState> = {}): EventState => ({ ev, phase: "pending", held: false, progress: 0, lastDir: null, result: null, ...extra });

function frame(s: EventState, songTime: number, extra: Partial<Frame> = {}): Frame {
  return {
    songTime,
    beatPos: songTime / SPB,
    beatPhase: 0,
    spb: SPB,
    meter: 0,
    combo: 0,
    tier: 0 as Frame["tier"],
    score: 0,
    rate: 1,
    energy: 0,
    beatsToDrop: Infinity,
    mashing: false,
    mashCount: 0,
    holding: false,
    holdProgress: 0,
    phase2: false,
    turn: "player",
    ending: false,
    win: null,
    prompts: [s],
    showsAt: () => -Infinity,
    targetAt: (ev) => (ev.beat + ("length" in ev ? ev.length : 0)) * SPB,
    level: {} as Frame["level"],
    ...extra,
  } as Frame;
}

function snapshot(s: EventState, songTime: number, extra: Partial<Frame> = {}): readonly string[] {
  const host = document.createElement("div");
  const layer = buildArrows(host);
  layer.frame(frame(s, songTime, extra));
  return [...layer.shapes()];
}

const arrows = (shapes: readonly string[]) => shapes.filter((n) => n === "arrow").length;

describe("prompt visuals per type", () => {
  beforeEach(() => resetTaught());

  it("SWIPE: exactly one v1 arrow glyph, no round note", () => {
    const shapes = snapshot(st({ type: "hit", beat: 8, dir: "left" }), 3.5);
    expect(shapes).toContain("target-ring");
    expect(arrows(shapes)).toBe(1);
    expect(shapes).not.toContain("note");
  });

  it("TAP: a round note, no arrow", () => {
    const shapes = snapshot(st({ type: "hit", beat: 8, dir: "up", tap: true }), 3.5);
    expect(shapes).toContain("note");
    expect(arrows(shapes)).toBe(0);
  });

  it("67 MASH: the big 67, a pulsing pad, a mash meter, no arrow", () => {
    const shapes = snapshot(st({ type: "mash", beat: 8, length: 4 }), 4.5, { mashing: true, mashCount: 5 });
    expect(shapes).toEqual(expect.arrayContaining(["label:67", "mash-pad", "mash-meter"]));
    expect(arrows(shapes)).toBe(0);
    expect(shapes).not.toContain("swipe-hint");
  });

  it("HOLD: a ring that fills while pressed with a press icon, no arrow", () => {
    const waiting = snapshot(st({ type: "hold", beat: 8, length: 2 }), 3.8);
    expect(waiting).toEqual(expect.arrayContaining(["timer-ring", "press-icon"]));
    expect(arrows(waiting)).toBe(0);
    const pressed = snapshot(st({ type: "hold", beat: 8, length: 2 }, { held: true }), 4.4, { holding: true, holdProgress: 0.5 });
    expect(pressed).toEqual(expect.arrayContaining(["hold-fill", "press-icon"]));
    expect(arrows(pressed)).toBe(0);
  });

  it("RELEASE: the closing ring with a small up swipe hint, not the arrow glyph", () => {
    // Mash beat 8 length 4 releases at 6.0 s; 5.8 s is inside the last beat.
    const shapes = snapshot(st({ type: "mash", beat: 8, length: 4 }), 5.8, { mashing: true, mashCount: 20 });
    expect(shapes).toEqual(expect.arrayContaining(["release-ring", "swipe-hint"]));
    expect(arrows(shapes)).toBe(0);
  });

  it("one prompt at a time: a queued prompt waits behind the current one", () => {
    const host = document.createElement("div");
    const layer = buildArrows(host);
    const a = st({ type: "hit", beat: 8, dir: "up", tap: true });
    const b = st({ type: "hit", beat: 9, dir: "right" });
    layer.frame({ ...frame(a, 3.5), prompts: [a, b] });
    expect(layer.shapes()).toContain("note");
    expect(arrows(layer.shapes())).toBe(0);
  });

  it("the opponent turn draws no prompt and no turn card", () => {
    const shapes = snapshot(st({ type: "hit", beat: 8, dir: "up" }), 3.5, { turn: "opponent" });
    expect(arrows(shapes)).toBe(0);
    expect(shapes.some((n) => /MOVE/.test(n))).toBe(false);
  });
});
