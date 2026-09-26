// Layout math of the world tour map: projection, pin spacing, star slots, camera drift.
import { describe, expect, it } from "vitest";
import {
  CONTINENTS,
  DEFAULT_STOPS,
  MAP_SIZE,
  MIN_PIN_GAP,
  driftWeight,
  layoutStops,
  lonLatToMap,
  starSlots,
} from "../../src/map/index";

describe("lonLatToMap", () => {
  it("puts the null island at the centre", () => {
    expect(lonLatToMap(0, 0)).toEqual({ x: 0, z: 0 });
  });

  it("maps the corners onto the plane edges, north at negative z", () => {
    expect(lonLatToMap(180, 90)).toEqual({ x: MAP_SIZE.width / 2, z: -MAP_SIZE.height / 2 });
    expect(lonLatToMap(-180, -90)).toEqual({ x: -MAP_SIZE.width / 2, z: MAP_SIZE.height / 2 });
  });

  it("is linear in longitude and latitude", () => {
    expect(lonLatToMap(90, 45).x).toBeCloseTo(MAP_SIZE.width / 4, 10);
    expect(lonLatToMap(90, 45).z).toBeCloseTo(-MAP_SIZE.height / 4, 10);
  });

  it("clamps out of range coordinates", () => {
    expect(lonLatToMap(400, 200)).toEqual(lonLatToMap(180, 90));
    expect(lonLatToMap(-400, -200)).toEqual(lonLatToMap(-180, -90));
  });

  it("honours a custom plane size", () => {
    expect(lonLatToMap(180, 90, { width: 2, height: 2 })).toEqual({ x: 1, z: -1 });
  });
});

describe("layoutStops", () => {
  it("returns one entry per stop, in order", () => {
    const layout = layoutStops(DEFAULT_STOPS);
    expect(layout.map((l) => l.id)).toEqual(DEFAULT_STOPS.map((s) => s.id));
  });

  it("keeps every pin inside the plane", () => {
    for (const spot of layoutStops(DEFAULT_STOPS)) {
      expect(Math.abs(spot.x)).toBeLessThanOrEqual(MAP_SIZE.width / 2);
      expect(Math.abs(spot.z)).toBeLessThanOrEqual(MAP_SIZE.height / 2);
    }
  });

  it("pushes apart the two Paris stops so the plates stay readable", () => {
    const layout = layoutStops(DEFAULT_STOPS);
    const chatelet = layout.find((l) => l.id === "chatelet")!;
    const barbes = layout.find((l) => l.id === "barbes")!;
    expect(Math.hypot(chatelet.x - barbes.x, chatelet.z - barbes.z)).toBeGreaterThanOrEqual(MIN_PIN_GAP - 1e-6);
  });

  it("separates every pair by at least the minimum gap", () => {
    const layout = layoutStops(DEFAULT_STOPS, MAP_SIZE, 2);
    for (let i = 0; i < layout.length; i++) {
      for (let j = i + 1; j < layout.length; j++) {
        const d = Math.hypot(layout[i].x - layout[j].x, layout[i].z - layout[j].z);
        expect(d).toBeGreaterThanOrEqual(2 - 1e-6);
      }
    }
  });

  it("splits two stops sitting on the exact same coordinates", () => {
    const twins = [
      { id: "a", name: "A", lon: 10, lat: 10 },
      { id: "b", name: "B", lon: 10, lat: 10 },
    ];
    const layout = layoutStops(twins, MAP_SIZE, 1);
    expect(Math.hypot(layout[0].x - layout[1].x, layout[0].z - layout[1].z)).toBeGreaterThanOrEqual(1 - 1e-6);
  });

  it("leaves distant stops where the projection put them", () => {
    const shibuya = DEFAULT_STOPS.find((s) => s.id === "shibuya")!;
    const spot = layoutStops([shibuya])[0];
    const projected = lonLatToMap(shibuya.lon, shibuya.lat);
    expect(spot.x).toBeCloseTo(projected.x, 10);
    expect(spot.z).toBeCloseTo(projected.z, 10);
  });

  it("places the five tour stops on the expected hemispheres", () => {
    const layout = layoutStops(DEFAULT_STOPS);
    const by = (id: string) => layout.find((l) => l.id === id)!;
    expect(by("rooftop").x).toBeLessThan(0);
    expect(by("rooftop").z).toBeGreaterThan(0);
    expect(by("shibuya").x).toBeGreaterThan(0);
    expect(by("shibuya").z).toBeLessThan(0);
    expect(by("pacujalur").x).toBeGreaterThan(0);
  });
});

describe("starSlots", () => {
  it("centres the row on zero", () => {
    const slots = starSlots(3, 1);
    expect(slots).toEqual([-1, 0, 1]);
  });

  it("keeps a constant spacing for any count", () => {
    const slots = starSlots(4, 0.5);
    expect(slots).toHaveLength(4);
    for (let i = 1; i < slots.length; i++) expect(slots[i] - slots[i - 1]).toBeCloseTo(0.5, 10);
    expect(slots.reduce((a, b) => a + b, 0)).toBeCloseTo(0, 10);
  });
});

describe("driftWeight", () => {
  it("eases towards zero while a stop is held", () => {
    let w = 1;
    for (let i = 0; i < 60; i++) w = driftWeight(w, true, 1 / 60);
    expect(w).toBeLessThan(0.1);
    expect(w).toBeGreaterThanOrEqual(0);
  });

  it("eases back to full drift once released", () => {
    let w = 0;
    for (let i = 0; i < 120; i++) w = driftWeight(w, false, 1 / 60);
    expect(w).toBeGreaterThan(0.95);
    expect(w).toBeLessThanOrEqual(1);
  });

  it("is monotonic", () => {
    let w = 1;
    for (let i = 0; i < 20; i++) {
      const next = driftWeight(w, true, 1 / 60);
      expect(next).toBeLessThan(w);
      w = next;
    }
  });
});

describe("continents", () => {
  it("embeds six closed outlines with in range coordinates", () => {
    expect(CONTINENTS).toHaveLength(6);
    for (const continent of CONTINENTS) {
      expect(continent.ring.length).toBeGreaterThanOrEqual(3);
      for (const [lon, lat] of continent.ring) {
        expect(lon).toBeGreaterThanOrEqual(-180);
        expect(lon).toBeLessThanOrEqual(180);
        expect(lat).toBeGreaterThanOrEqual(-90);
        expect(lat).toBeLessThanOrEqual(90);
      }
    }
  });
});
