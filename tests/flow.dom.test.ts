// @vitest-environment jsdom
// The flow screens in a DOM: the title scene starts once, MENU never starts, RESULTS retries on any key.
import { describe, expect, it, vi } from "vitest";

vi.mock("../src/v2/net/live", () => ({ fetchRoast: () => Promise.resolve(null), speakLive: () => Promise.resolve(false) }));

import { buildGate } from "../src/v2/ui/gate";
import { buildLoading } from "../src/v2/ui/loading";
import { buildResults } from "../src/v2/ui/results";
import type { LevelV2, Stats } from "../src/v2/contracts";

const key = (k: string, extra: Partial<KeyboardEventInit> = {}) => new KeyboardEvent("keydown", { key: k, ...extra });

describe("title scene", () => {
  it("the first tap starts the battle once, the MENU button opens the menu only", () => {
    const start = vi.fn();
    const menu = vi.fn();
    const g = buildGate(start, menu);
    document.body.appendChild(g.root);
    const btn = g.root.querySelector(".gate-menu") as HTMLButtonElement;
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
  const stats = { win: false, score: 10, stars: 0, accuracy: 0.5, bestBurst: 3, counts: { perfect: 1, great: 0, ok: 0, miss: 2, cringe: 0 } } as unknown as Stats;
  const level = { id: 1, title: "t", place: "CHATELET", announcer: { win: "w", lose: "l" } } as unknown as LevelV2;

  it("any key retries once armed, and never while the pack is open", async () => {
    vi.useFakeTimers();
    const retry = vi.fn();
    let closePack: () => void = () => {};
    const pack = vi.fn(() => new Promise<void>((r) => (closePack = r)));
    const r = buildResults({ retry, map: vi.fn(), pack });
    document.body.appendChild(r.root);
    r.show(stats, level);
    r.onKey(key("a"));
    expect(retry).not.toHaveBeenCalled();
    vi.advanceTimersByTime(350);
    (r.root.querySelector(".results-btn.pack") as HTMLButtonElement).click();
    expect(pack).toHaveBeenCalledTimes(1);
    r.onKey(key("a"));
    expect(retry).not.toHaveBeenCalled();
    closePack();
    vi.useRealTimers();
    await new Promise((res) => setTimeout(res, 0));
    r.onKey(key("a", { repeat: true }));
    expect(retry).not.toHaveBeenCalled();
    r.onKey(key("a"));
    expect(retry).toHaveBeenCalledTimes(1);
    (r.root.querySelector(".results-btn.retry") as HTMLButtonElement).click();
    expect(retry).toHaveBeenCalledTimes(2);
    (r.root.querySelector(".results-btn.pack") as HTMLButtonElement).click();
    expect(pack).toHaveBeenCalledTimes(1);
    expect(r.root.textContent).not.toMatch(/space|swipe/i);
  });
});
