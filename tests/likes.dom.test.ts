// @vitest-environment jsdom
// The like / dislike bar in a DOM: thumbs as inline SVG, widths follow the meter, counts render.
import { describe, expect, it } from "vitest";
import { buildMeter } from "../src/v2/ui/hud/meter";
import { buildPlayZone, resetLessons } from "../src/v2/ui/playzone";
import type { Frame, GameApi } from "../src/v2/contracts";

const frame = (meter: number, turn: "player" | "opponent" = "player") =>
  ({ meter, score: 1234, combo: 12, turn, ending: false } as unknown as Frame);

describe("like bar", () => {
  it("draws two SVG thumbs and a green share that eases toward (meter + 1) / 2", () => {
    const m = buildMeter();
    expect(m.root.querySelectorAll(".lk-icon svg").length).toBe(2);
    m.event({ kind: "judged", grade: "perfect", cringe: false, qte: "hit", combo: 12, score: 0, strong: false, big: false });
    for (let i = 0; i < 120; i++) m.frame(frame(0.5), 1 / 60);
    const w = parseFloat((m.root.querySelector(".lk-like") as HTMLElement).style.width);
    expect(w).toBeGreaterThan(74);
    expect(w).toBeLessThan(76);
    expect(m.root.querySelector(".lk-count-up")!.textContent).toMatch(/^[\d.]+K?$/);
    expect(m.root.querySelector(".hud-score")!.textContent).toBe("1234");
  });
});

describe("play zone", () => {
  it("retires the hold hint after the first graded hold", () => {
    resetLessons();
    const game = { touchMode: () => "hold", turn: () => "player" } as unknown as GameApi;
    const z = buildPlayZone(game);
    z.event({ kind: "holdEnd", grade: "great" });
    expect(z.root.classList.contains("learned-hold")).toBe(true);
    expect(z.root.classList.contains("learned-tap")).toBe(false);
  });
});
