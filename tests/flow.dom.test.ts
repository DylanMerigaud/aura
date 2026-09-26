// @vitest-environment jsdom
// The flow screens in a DOM: the title scene starts once, LOADOUT never starts, RESULTS retries on any key,
// the results card shows the numbers of the Stats it is given.
import { describe, expect, it, vi } from "vitest";

vi.mock("../src/v2/net/live", () => ({ fetchRoast: () => Promise.resolve(null), speakLive: () => Promise.resolve(false) }));

import { buildGate } from "../src/v2/ui/gate";
import { buildLoading } from "../src/v2/ui/loading";
import { buildResults } from "../src/v2/ui/results";
import type { LevelV2, Stats } from "../src/v2/contracts";

const key = (k: string, extra: Partial<KeyboardEventInit> = {}) => new KeyboardEvent("keydown", { key: k, ...extra });

describe("title scene", () => {
  it("the first tap starts the battle once, the LOADOUT button opens the loadout only", () => {
    const start = vi.fn();
    const menu = vi.fn();
    const g = buildGate(start, { loadout: menu });
    document.body.appendChild(g.root);
    expect(g.root.textContent).not.toMatch(/multiplayer|menu/i);
    const btn = g.root.querySelector(".gate-loadout") as HTMLButtonElement;
    btn.dispatchEvent(new Event("pointerdown", { bubbles: true }));
    btn.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    expect(menu).toHaveBeenCalledTimes(1);
    expect(start).not.toHaveBeenCalled();
    g.root.dispatchEvent(new Event("pointerdown", { bubbles: true }));
    g.root.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    expect(start).toHaveBeenCalledTimes(1);
    g.show();
    g.root.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    expect(start).toHaveBeenCalledTimes(2);
    expect(g.root.textContent).not.toMatch(/space|swipe/i);
  });
});

describe("loading", () => {
  it("paints the fraction", () => {
    const l = buildLoading();
    l.set(0.5);
    expect(l.root.textContent).toContain("50%");
    expect((l.root.querySelector(".loading-fill") as HTMLElement).style.transform).toBe("scaleX(0.5)");
  });
});

describe("results", () => {
  const stats = { win: false, score: 10, stars: 0, accuracy: 0.5, bestBurst: 3, maxCombo: 4, counts: { perfect: 1, great: 0, ok: 0, miss: 2, cringe: 0 } } as unknown as Stats;
  const level = { id: 1, title: "t", place: "CHATELET", announcer: { win: "w", lose: "l" } } as unknown as LevelV2;

  it("any key retries once armed; no PACK link (the win pack opens before the card)", () => {
    vi.useFakeTimers();
    const retry = vi.fn();
    const r = buildResults({ retry, next: vi.fn(), loadout: vi.fn() });
    document.body.appendChild(r.root);
    r.show(stats, level);
    r.onKey(key("a"));
    expect(retry).not.toHaveBeenCalled();
    vi.advanceTimersByTime(350);
    vi.useRealTimers();
    r.onKey(key("a", { repeat: true }));
    expect(retry).not.toHaveBeenCalled();
    r.onKey(key("a"));
    expect(retry).toHaveBeenCalledTimes(1);
    (r.root.querySelector(".results-btn.retry") as HTMLButtonElement).click();
    expect(retry).toHaveBeenCalledTimes(2);
    expect(r.root.querySelector(".rc-link.pack")).toBeNull();
    expect(r.root.textContent).not.toMatch(/space|swipe|press|pack/i);
  });

  const played: Stats = {
    win: true,
    ko: false,
    score: 1234.4,
    maxCombo: 17,
    counts: { perfect: 9, great: 3, ok: 1, miss: 2, cringe: 0 },
    accuracy: 0.876,
    bestBurst: 40,
    stars: 2,
    meter: 0.4,
  };
  const lvl = { id: 1, title: "t", place: "ARENA", opponent: { name: "The Boat Kid", persona: "", color: "#fff" }, announcer: { win: "w", lose: "l" } } as unknown as LevelV2;

  it("the card shows the numbers of the Stats it was given, win word, NEXT and an unlocked preview", () => {
    const r = buildResults({ retry: vi.fn(), next: vi.fn(), loadout: vi.fn() });
    r.show(played, lvl, { nextOpponent: { name: "The Turnstile Ninja", locked: false }, xp: { before: 3000, after: 5234, gained: 2234, rankUp: true, rank: "Side character" } });
    const q = (s: string) => (r.root.querySelector(s) as HTMLElement).textContent;
    expect(q(".results-heading")).toBe("AURA FARMED");
    expect(q(".rc-num.score .rc-val")).toBe("1234");
    expect(q(".rc-num.acc .rc-val")).toBe("88%");
    expect(q(".rc-num.combo .rc-val")).toBe("17");
    expect(q(".results-stars")).toBe("★★☆");
    expect(q(".results-btn.retry")).toBe("NEXT");
    expect(r.root.querySelector(".rc-link.replay")!.classList.contains("hidden")).toBe(false);
    expect(q(".rc-next-name")).toBe("THE TURNSTILE NINJA");
    expect(r.root.querySelector(".rc-next")!.classList.contains("locked")).toBe(false);
    expect(q(".rc-gain")).toBe("+2234 XP");
    expect((r.root.querySelector(".rc-xp") as HTMLElement).dataset.rank).toBe("Side character");
  });

  it("a second show with other Stats never keeps the first numbers; a loss says HUMBLED, RETRY, locked preview", () => {
    const retry = vi.fn();
    const next = vi.fn();
    const r = buildResults({ retry, next, loadout: vi.fn() });
    r.show(played, lvl);
    r.show({ ...played, win: false, score: 200, maxCombo: 1, accuracy: 0.7, stars: 0, counts: { perfect: 0, great: 1, ok: 0, miss: 5, cringe: 0 } }, lvl, {
      nextOpponent: { name: "The Turnstile Ninja", locked: true },
      xp: { before: 0, after: 200, gained: 200, rankUp: false, rank: "NPC" },
    });
    const q = (s: string) => (r.root.querySelector(s) as HTMLElement).textContent;
    expect(q(".results-heading")).toBe("HUMBLED");
    expect(q(".rc-num.score .rc-val")).toBe("200");
    expect(q(".rc-num.acc .rc-val")).toBe("70%");
    expect(q(".rc-num.combo .rc-val")).toBe("1");
    expect(q(".results-btn.retry")).toBe("RETRY");
    expect(r.root.querySelector(".rc-link.replay")!.classList.contains("hidden")).toBe(true);
    expect(r.root.querySelector(".rc-next")!.classList.contains("locked")).toBe(true);
    expect(q(".rc-rank")).toBe("NPC");
  });
});
