// Pools and the seeded picker: determinism, grammar, and the no repeat window.
import { describe, expect, it } from "vitest";
import {
  COMMENT_POOL,
  HANDLE_POOL,
  NO_REPEAT_WINDOW,
  commentsFor,
  createPicker,
  createRng,
  type CommentTag,
} from "../../src/live/comments";

const TAGS: CommentTag[] = [
  "perfect",
  "great",
  "miss",
  "cringe",
  "release",
  "combo",
  "taunt",
  "win",
  "lose",
  "idle",
];

describe("pools", () => {
  it("holds about 120 comments and 20 handles", () => {
    expect(COMMENT_POOL.length).toBeGreaterThanOrEqual(115);
    expect(COMMENT_POOL.length).toBeLessThanOrEqual(130);
    expect(HANDLE_POOL.length).toBe(20);
    expect(new Set(HANDLE_POOL).size).toBe(HANDLE_POOL.length);
    expect(new Set(COMMENT_POOL.map((c) => c.text)).size).toBe(COMMENT_POOL.length);
  });

  it("keeps every comment between 1 and 6 words and ASCII only", () => {
    for (const c of COMMENT_POOL) {
      const words = c.text.trim().split(/\s+/);
      expect(words.length).toBeGreaterThanOrEqual(1);
      expect(words.length).toBeLessThanOrEqual(6);
      expect(c.text).toMatch(/^[\x20-\x7E]+$/);
      expect(c.text).not.toMatch(/[\u2013\u2014]/);
      expect(c.tags.length).toBeGreaterThan(0);
    }
    for (const h of HANDLE_POOL) {
      expect(h).toMatch(/^@[a-z0-9_]+$/);
    }
  });

  it("gives every event kind more than the no repeat window of options", () => {
    for (const tag of TAGS) {
      expect(commentsFor(tag).length).toBeGreaterThan(NO_REPEAT_WINDOW);
    }
  });
});

describe("createRng", () => {
  it("is deterministic per seed and stays in 0..1", () => {
    const a = createRng(42);
    const b = createRng(42);
    for (let i = 0; i < 50; i++) {
      const v = a();
      expect(v).toBe(b());
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
    }
    expect(createRng("aura")()).not.toBe(createRng("aura2")());
  });
});

describe("createPicker", () => {
  it("never repeats a comment inside the last 8 picks", () => {
    const picker = createPicker("seed-1");
    const seen: string[] = [];
    for (let i = 0; i < 400; i++) {
      const tag = TAGS[i % TAGS.length];
      const text = picker.comment(tag);
      expect(commentsFor(tag)).toContain(text);
      expect(seen.slice(-NO_REPEAT_WINDOW)).not.toContain(text);
      seen.push(text);
    }
  });

  it("never repeats a handle inside the last 8 picks", () => {
    const picker = createPicker(7);
    const seen: string[] = [];
    for (let i = 0; i < 200; i++) {
      const handle = picker.handle();
      expect(HANDLE_POOL).toContain(handle);
      expect(seen.slice(-NO_REPEAT_WINDOW)).not.toContain(handle);
      seen.push(handle);
    }
  });

  it("is reproducible for the same seed and differs across seeds", () => {
    const run = (seed: string) => {
      const p = createPicker(seed);
      return Array.from({ length: 30 }, () => `${p.handle()} ${p.comment("perfect")}`);
    };
    expect(run("alpha")).toEqual(run("alpha"));
    expect(run("alpha")).not.toEqual(run("beta"));
  });

  it("falls back to the idle pool for an unknown tag", () => {
    const p = createPicker(1);
    const text = p.comment("nope" as CommentTag);
    expect(commentsFor("idle")).toContain(text);
  });
});
