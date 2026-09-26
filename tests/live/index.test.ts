// @vitest-environment jsdom
// The overlay itself: API shape, node caps, batching, event mapping, teardown.
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  HEART_POOL_SIZE,
  MAX_COMMENTS,
  REACTION_POOL_SIZE,
  createLiveUI,
  formatViewers,
  type LiveUI,
} from "../../src/live/index";

let root: HTMLElement;
let ui: LiveUI;

const frame = () => new Promise<void>((resolve) => setTimeout(resolve, 40));

const feedItems = () => Array.from(root.querySelectorAll(".live-comment"));
const flyingHearts = () => Array.from(root.querySelectorAll(".live-heart--fly"));
const poppingReactions = () => Array.from(root.querySelectorAll(".live-reaction--pop"));

beforeEach(() => {
  root = document.createElement("div");
  document.body.append(root);
  ui = createLiveUI(root, { playerHandle: "@you", opponentHandle: "@rival", seed: "test-seed" });
});

afterEach(() => {
  ui.destroy();
  root.remove();
});

describe("API shape", () => {
  it("exposes every documented method", () => {
    for (const key of ["setViewers", "comment", "heart", "gift", "reactions", "event", "destroy"]) {
      expect(typeof (ui as unknown as Record<string, unknown>)[key]).toBe("function");
    }
  });

  it("mounts the chrome with the handles and stays pointer events none", () => {
    const shell = root.querySelector(".live-root") as HTMLElement;
    expect(shell).toBeTruthy();
    expect(root.querySelector(".live-badge")).toBeTruthy();
    expect(root.querySelector(".live-dot")).toBeTruthy();
    expect(root.querySelector(".live-viewers")).toBeTruthy();
    expect(root.querySelectorAll(".live-avatar").length).toBe(2);
    expect(root.textContent).toContain("@you");
    expect(root.textContent).toContain("@rival");
    expect(shell.getAttribute("aria-hidden")).toBe("true");
  });

  it("creates the heart and reaction pools up front", () => {
    expect(root.querySelectorAll(".live-heart").length).toBe(HEART_POOL_SIZE);
    expect(root.querySelectorAll(".live-reaction").length).toBe(REACTION_POOL_SIZE);
  });
});

describe("batched writes", () => {
  it("defers comment nodes to an animation frame", async () => {
    ui.comment("@chat", "no cap");
    expect(feedItems().length).toBe(0);
    await frame();
    expect(feedItems().length).toBe(1);
  });

  it("animates the viewer count toward the new value", async () => {
    const value = () => (root.querySelector(".live-viewers-value") as HTMLElement).textContent;
    expect(value()).toBe("0");
    ui.setViewers(9400);
    await frame();
    expect(value()).not.toBe("0");
    await new Promise<void>((resolve) => setTimeout(resolve, 800));
    expect(value()).toBe("9.4K");
  });
});

describe("node caps", () => {
  it("never keeps more than 6 comment nodes and recycles them", async () => {
    const seen = new Set<Element>();
    for (let i = 0; i < 40; i++) {
      ui.comment("@chat", `line ${i}`);
      await frame();
      expect(feedItems().length).toBeLessThanOrEqual(MAX_COMMENTS);
      for (const node of feedItems()) seen.add(node);
    }
    expect(feedItems().length).toBe(MAX_COMMENTS);
    expect(seen.size).toBe(MAX_COMMENTS);
    expect(feedItems().at(-1)?.textContent).toContain("line 39");
  });

  it("caps hearts at the pool size", async () => {
    ui.heart(500);
    await frame();
    expect(root.querySelectorAll(".live-heart").length).toBe(HEART_POOL_SIZE);
    expect(flyingHearts().length).toBeLessThanOrEqual(HEART_POOL_SIZE);
    expect(flyingHearts().length).toBeGreaterThan(0);
  });

  it("caps reactions at the pool size", async () => {
    ui.reactions("fire", 200);
    await frame();
    expect(root.querySelectorAll(".live-reaction").length).toBe(REACTION_POOL_SIZE);
    expect(poppingReactions().length).toBeLessThanOrEqual(REACTION_POOL_SIZE);
    expect(poppingReactions().length).toBeGreaterThan(0);
  });

  it("keeps a single gift toast node", async () => {
    ui.gift("Aura Drop", 3);
    ui.gift("Crown", 5);
    await frame();
    const toasts = root.querySelectorAll(".live-toast");
    expect(toasts.length).toBe(1);
    expect(toasts[0].textContent).toContain("Crown");
  });
});

describe("event mapping", () => {
  it("a perfect adds hearts and a comment", async () => {
    ui.event("perfect");
    await frame();
    expect(flyingHearts().length).toBeGreaterThan(0);
    expect(feedItems().length).toBe(1);
  });

  it("a cringe adds a mocking comment and an emoji burst", async () => {
    ui.event("cringe");
    await frame();
    expect(feedItems().length).toBe(1);
    expect(poppingReactions().length).toBeGreaterThan(0);
    expect(flyingHearts().length).toBe(0);
  });

  it("a release adds a gift toast", async () => {
    ui.event("release", { gift: "Galaxy" });
    await frame();
    expect((root.querySelector(".live-toast") as HTMLElement).classList).toContain("live-toast--show");
    expect(root.querySelector(".live-toast-name")?.textContent).toBe("Galaxy");
    expect(feedItems()[0].textContent).toContain("Galaxy");
  });

  it("a miss never adds hearts", async () => {
    ui.event("miss");
    await frame();
    expect(flyingHearts().length).toBe(0);
    expect(poppingReactions().length).toBeGreaterThan(0);
  });

  it("uses the seeded pools for the handle and the text", async () => {
    ui.event("win");
    await frame();
    const line = feedItems()[0] as HTMLElement;
    expect(line.querySelector(".live-comment-handle")?.textContent).toMatch(/^@[a-z0-9_]+$/);
    expect((line.querySelector(".live-comment-text")?.textContent ?? "").length).toBeGreaterThan(0);
  });

  it("honours an explicit payload", async () => {
    ui.event("taunt", { handle: "@scripted", text: "get him" });
    await frame();
    expect(feedItems()[0].textContent).toContain("@scripted");
    expect(feedItems()[0].textContent).toContain("get him");
  });
});

describe("destroy", () => {
  it("removes the overlay and ignores later calls", async () => {
    ui.comment("@chat", "bye");
    ui.destroy();
    await frame();
    expect(root.querySelector(".live-root")).toBeNull();
    ui.setViewers(10);
    ui.heart(5);
    ui.event("win");
    await frame();
    expect(root.children.length).toBe(0);
  });
});

describe("formatViewers", () => {
  it("shortens big numbers", () => {
    expect(formatViewers(0)).toBe("0");
    expect(formatViewers(999)).toBe("999");
    expect(formatViewers(1200)).toBe("1.2K");
    expect(formatViewers(24800)).toBe("25K");
    expect(formatViewers(2400000)).toBe("2.4M");
  });
});
