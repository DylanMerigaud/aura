// Screen to stop picking: pointer to normalized device coordinates, then a mocked raycaster.
import { describe, expect, it, vi } from "vitest";
import { pickStopId, pointerToNdc, stopIdOf, type Ndc, type PickTarget } from "../../src/map/index";

const rect = { left: 0, top: 0, width: 800, height: 600 };

function node(stopId?: string, parent: PickTarget | null = null): PickTarget {
  return { userData: stopId ? { stopId } : {}, parent };
}

/** A raycaster that returns whatever the caller staged, and records the ndc it was given. */
function mockRaycaster(hits: PickTarget[]) {
  const seen: Ndc[] = [];
  return {
    seen,
    setFromCamera: vi.fn((ndc: Ndc) => {
      seen.push({ x: ndc.x, y: ndc.y });
    }),
    intersectObjects: vi.fn(() => hits.map((object) => ({ object }))),
  };
}

describe("pointerToNdc", () => {
  it("maps the centre to the origin", () => {
    const out = { x: 0, y: 0 };
    expect(pointerToNdc(rect, 400, 300, out)).toEqual({ x: 0, y: 0 });
  });

  it("maps the corners, with y flipped", () => {
    const out = { x: 0, y: 0 };
    expect(pointerToNdc(rect, 0, 0, out)).toEqual({ x: -1, y: 1 });
    expect(pointerToNdc(rect, 800, 600, out)).toEqual({ x: 1, y: -1 });
  });

  it("accounts for the canvas offset on the page", () => {
    const out = { x: 0, y: 0 };
    const offset = { left: 100, top: 50, width: 800, height: 600 };
    expect(pointerToNdc(offset, 500, 350, out)).toEqual({ x: 0, y: 0 });
  });

  it("writes into the given object instead of allocating", () => {
    const out = { x: 0, y: 0 };
    expect(pointerToNdc(rect, 200, 150, out)).toBe(out);
    expect(out).toEqual({ x: -0.5, y: 0.5 });
  });

  it("stays finite on a zero sized canvas", () => {
    const out = { x: 0, y: 0 };
    expect(pointerToNdc({ left: 0, top: 0, width: 0, height: 0 }, 10, 10, out)).toEqual({ x: 0, y: 0 });
  });
});

describe("stopIdOf", () => {
  it("reads the id off the hit object", () => {
    expect(stopIdOf(node("shibuya"))).toBe("shibuya");
  });

  it("walks up to the stop group when a child is hit", () => {
    const group = node("rooftop");
    const plate = node(undefined, node(undefined, group));
    expect(stopIdOf(plate)).toBe("rooftop");
  });

  it("returns null for scenery", () => {
    expect(stopIdOf(node(undefined, node()))).toBeNull();
    expect(stopIdOf(null)).toBeNull();
  });

  it("does not loop forever on a cyclic parent chain", () => {
    const a: PickTarget = { userData: {} };
    const b: PickTarget = { userData: {}, parent: a };
    a.parent = b;
    expect(stopIdOf(a)).toBeNull();
  });
});

describe("pickStopId", () => {
  it("returns the stop under the pointer", () => {
    const raycaster = mockRaycaster([node("chatelet")]);
    const out = { x: 0, y: 0 };
    pointerToNdc(rect, 200, 150, out);
    expect(pickStopId(raycaster, out, "camera", ["targets"])).toBe("chatelet");
    expect(raycaster.setFromCamera).toHaveBeenCalledTimes(1);
    expect(raycaster.seen[0]).toEqual({ x: -0.5, y: 0.5 });
  });

  it("uses the closest hit that belongs to a stop", () => {
    const raycaster = mockRaycaster([node(), node("barbes"), node("shibuya")]);
    expect(pickStopId(raycaster, { x: 0, y: 0 }, "camera", [])).toBe("barbes");
  });

  it("returns null when only the map plane is hit", () => {
    const raycaster = mockRaycaster([node(), node()]);
    expect(pickStopId(raycaster, { x: 0, y: 0 }, "camera", [])).toBeNull();
  });

  it("returns null on an empty intersection list", () => {
    const raycaster = mockRaycaster([]);
    expect(pickStopId(raycaster, { x: 0, y: 0 }, "camera", [])).toBeNull();
  });

  it("searches the stop groups recursively", () => {
    const raycaster = mockRaycaster([node("rooftop")]);
    pickStopId(raycaster, { x: 0, y: 0 }, "camera", ["a", "b"]);
    expect(raycaster.intersectObjects).toHaveBeenCalledWith(["a", "b"], true);
  });

  it("maps two different screen points to two different stops", () => {
    const left = mockRaycaster([node("chatelet")]);
    const right = mockRaycaster([node("shibuya")]);
    const out = { x: 0, y: 0 };
    expect(pickStopId(left, pointerToNdc(rect, 100, 300, out), "camera", [])).toBe("chatelet");
    expect(pickStopId(right, pointerToNdc(rect, 700, 300, out), "camera", [])).toBe("shibuya");
    expect(left.seen[0].x).toBeLessThan(right.seen[0].x);
  });
});
