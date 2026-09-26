import { describe, expect, it } from "vitest";
import { isTapKey, once, settledFraction, shareData, shareUrl, trackSettled } from "../src/v2/ui/flow";

describe("loading progress", () => {
  it("is the fraction of settled promises, clamped, and done with nothing to wait on", () => {
    expect(settledFraction(0, 4)).toBe(0);
    expect(settledFraction(1, 4)).toBe(0.25);
    expect(settledFraction(9, 4)).toBe(1);
    expect(settledFraction(0, 0)).toBe(1);
  });

  it("counts rejections as settled and resolves true when all are in", async () => {
    const seen: number[] = [];
    const ok = await trackSettled([Promise.resolve(1), Promise.reject(new Error("404")), Promise.resolve()], (f) => seen.push(f), 1000);
    expect(ok).toBe(true);
    expect(seen[0]).toBe(0);
    expect(seen[seen.length - 1]).toBe(1);
    expect(seen).toHaveLength(4);
  });

  it("gives up on the timeout so a slow asset never blocks", async () => {
    let fire: () => void = () => {};
    const seen: number[] = [];
    const p = trackSettled([Promise.resolve(), new Promise(() => {})], (f) => seen.push(f), 5, (fn) => (fire = fn));
    await Promise.resolve();
    await Promise.resolve();
    fire();
    expect(await p).toBe(false);
    expect(seen).toEqual([0, 0.5]);
  });

  it("resolves at once with no jobs", async () => {
    const seen: number[] = [];
    expect(await trackSettled([], (f) => seen.push(f), 10)).toBe(true);
    expect(seen).toEqual([1]);
  });
});

describe("the one input rule", () => {
  it("any fresh key is a tap, not repeats, shortcuts or bare modifiers", () => {
    expect(isTapKey({ key: " " })).toBe(true);
    expect(isTapKey({ key: "a" })).toBe(true);
    expect(isTapKey({ key: "Enter" })).toBe(true);
    expect(isTapKey({ key: "a", repeat: true })).toBe(false);
    expect(isTapKey({ key: "r", metaKey: true })).toBe(false);
    expect(isTapKey({ key: "Shift" })).toBe(false);
    expect(isTapKey({ key: "Escape" })).toBe(false);
  });

  it("pointerdown, click and key of the same gesture start once", () => {
    let n = 0;
    const fire = once(() => n++);
    expect(fire()).toBe(true);
    expect(fire()).toBe(false);
    expect(fire()).toBe(false);
    expect(n).toBe(1);
  });
});

describe("share", () => {
  it("builds the text and a clean url", () => {
    const url = shareUrl({ origin: "https://x.io", pathname: "/aura/" });
    expect(url).toBe("https://x.io/aura/");
    const win = shareData({ win: true, score: 1234.4, stars: 2, accuracy: 0.87 }, { place: "CHATELET", title: "Aura Farmer" }, url);
    expect(win.text).toContain("1234");
    expect(win.text).toContain("87%");
    expect(win.text).toContain("Aura Farmer");
    expect(win.url).toBe(url);
    const lose = shareData({ win: false, score: 10, stars: 0, accuracy: 0.1 }, { place: "CHATELET", title: "x" }, url);
    expect(lose.text).toContain("humbled");
  });
});
