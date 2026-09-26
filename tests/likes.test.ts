// The like / dislike bar: the counts are cosmetic but their ratio must track the meter, and the
// compact format reads like YouTube. Plus the play zone lessons (hints retire after a success).
import { beforeEach, describe, expect, it } from "vitest";
import { applyEvent, formatCount, newLikes, ratioOf, reconcile, targetRatio, trickle } from "../src/v2/ui/hud/likes";
import { hasLearned, learn, lessonOf, resetLessons } from "../src/v2/ui/playzone";
import type { CoreEvent } from "../src/v2/contracts";
import type { Grade } from "../src/qte/judge";

const judged = (grade: Grade, combo = 0, cringe = false): CoreEvent => ({
  kind: "judged", grade, cringe, qte: "hit", combo, score: 0, strong: false, big: false,
});

describe("likes counts", () => {
  it("a Perfect adds more likes than a Great than an Ok, and the combo multiplier adds more", () => {
    const gain = (e: CoreEvent) => {
      const s = newLikes();
      const before = s.likes;
      expect(applyEvent(s, e)).toBe("like");
      return s.likes - before;
    };
    expect(gain(judged("perfect"))).toBeGreaterThan(gain(judged("great")));
    expect(gain(judged("great"))).toBeGreaterThan(gain(judged("ok")));
    expect(gain(judged("perfect", 30))).toBeGreaterThan(gain(judged("perfect", 0)));
  });

  it("a miss, a cringe and a missed release add dislikes only", () => {
    for (const e of [judged("miss"), judged("great", 0, true), { kind: "release", burst: 0, count: 0, mult: 0, grade: "miss" } as CoreEvent]) {
      const s = newLikes();
      const l = s.likes;
      expect(applyEvent(s, e)).toBe("dislike");
      expect(s.likes).toBe(l);
      expect(s.dislikes).toBeGreaterThan(l);
    }
    expect(applyEvent(newLikes(), { kind: "beat", beat: 1, downbeat: false, energy: 0.5, bar: 0 })).toBeNull();
  });

  it("reconcile lands the ratio on (meter + 1) / 2 and never shrinks a count", () => {
    const s = newLikes();
    for (const m of [0.6, -0.3, 0.95, -1, 1, 0]) {
      const before = { ...s };
      applyEvent(s, judged("perfect", 12));
      reconcile(s, m);
      expect(ratioOf(s)).toBeCloseTo(targetRatio(m), 9);
      expect(s.likes).toBeGreaterThanOrEqual(before.likes);
      expect(s.dislikes).toBeGreaterThanOrEqual(before.dislikes);
    }
    expect(targetRatio(0)).toBe(0.5);
    expect(targetRatio(1)).toBeLessThan(1);
    expect(targetRatio(NaN)).toBe(0.5);
  });

  it("the opponent turn trickles dislikes, the player turn does not", () => {
    const s = newLikes();
    trickle(s, 0.05, false);
    expect(s.dislikes).toBe(newLikes().dislikes);
    trickle(s, 0.05, true);
    expect(s.dislikes).toBeGreaterThan(newLikes().dislikes);
  });
});

describe("formatCount", () => {
  it("formats like YouTube", () => {
    expect(formatCount(0)).toBe("0");
    expect(formatCount(999)).toBe("999");
    expect(formatCount(1000)).toBe("1K");
    expect(formatCount(1234)).toBe("1.2K");
    expect(formatCount(12_480)).toBe("12.4K");
    expect(formatCount(124_900)).toBe("124K");
    expect(formatCount(999_999)).toBe("999K");
    expect(formatCount(3_150_000)).toBe("3.1M");
    expect(formatCount(-5)).toBe("0");
    expect(formatCount(NaN)).toBe("0");
  });
});

describe("play zone lessons", () => {
  beforeEach(() => resetLessons());
  it("each hint retires after the first success of its kind only", () => {
    expect(lessonOf(judged("miss"))).toBeNull();
    expect(learn(judged("miss"))).toBe(false);
    expect(hasLearned("tap")).toBe(false);
    expect(learn(judged("ok"))).toBe(true);
    expect(learn(judged("perfect"))).toBe(false);
    expect(hasLearned("tap")).toBe(true);
    expect(learn({ kind: "release", burst: 0, count: 0, mult: 0, grade: "miss" })).toBe(false);
    expect(learn({ kind: "release", burst: 8, count: 8, mult: 1, grade: "great" })).toBe(true);
    expect(hasLearned("mash")).toBe(true);
    expect(learn({ kind: "holdEnd", grade: "miss" })).toBe(false);
    expect(learn({ kind: "holdEnd", grade: "ok" })).toBe(true);
    expect(hasLearned("hold")).toBe(true);
  });
});
