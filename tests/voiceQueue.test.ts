// The single voice queue (addendum 17:05 point 5): one line at a time, call > line > taunt, a line
// never starts over another, a taunt is dropped while a call plays.
import { describe, expect, it } from "vitest";
import { callKey, VoiceQueue } from "../src/v2/voiceQueue";

describe("voice queue", () => {
  it("plays at once when idle, queues the next after the sounding line ends", () => {
    const q = new VoiceQueue();
    const a = q.request({ id: "intro", kind: "line", duration: 2 }, 0);
    expect(a).toMatchObject({ play: true, start: 0 });
    const b = q.request({ id: "win", kind: "line", duration: 1 }, 1);
    expect(b).toMatchObject({ play: true, start: 2 });
    expect(q.pending(1).map((x) => x.id)).toEqual(["intro", "win"]);
    expect(q.pending(3.5)).toEqual([]);
  });

  it("a call never starts over a sounding line, even a taunt: it waits or is dropped when too late", () => {
    const q = new VoiceQueue();
    q.request({ id: "t", kind: "taunt", duration: 0.3 }, 0);
    expect(q.request({ id: "call-flow", kind: "call", duration: 0.4 }, 0.1)).toMatchObject({ play: true, start: 0.3 });
    const q2 = new VoiceQueue();
    q2.request({ id: "intro", kind: "line", duration: 3 }, 0);
    expect(q2.request({ id: "call-flow", kind: "call", duration: 0.4 }, 0.5)).toMatchObject({ play: false, reason: "too-late" });
  });

  it("a taunt is dropped while a call is sounding or booked", () => {
    const q = new VoiceQueue();
    q.request({ id: "call-six-seven", kind: "call", duration: 0.6 }, 0);
    expect(q.request({ id: "t", kind: "taunt", duration: 1 }, 0.2)).toMatchObject({ play: false, reason: "call-playing" });
    expect(q.request({ id: "t", kind: "taunt", duration: 1 }, 0.7)).toMatchObject({ play: true, start: 0.7 });
  });

  it("a higher priority request bumps a booked line that has not started, never one that is sounding", () => {
    const q = new VoiceQueue();
    q.request({ id: "intro", kind: "line", duration: 1 }, 0);
    const t = q.request({ id: "t", kind: "taunt", duration: 1 }, 0.5);
    expect(t).toMatchObject({ play: true, start: 1 });
    const c = q.request({ id: "call-flow", kind: "call", duration: 0.3 }, 0.6);
    expect(c.play).toBe(true);
    if (c.play) expect(c.start).toBe(1);
    expect(c.bumped.map((b) => b.id)).toEqual(["t"]);
    expect(q.pending(0.6).map((b) => b.id)).toEqual(["intro", "call-flow"]);
  });

  it("no overlap ever: every booked line starts after the previous one ended", () => {
    const q = new VoiceQueue();
    const kinds = ["call", "line", "taunt"] as const;
    let seed = 7;
    const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
    for (let i = 0; i < 300; i++) {
      const now = i * 0.2;
      q.request({ id: `x${i}`, kind: kinds[i % 3], duration: 0.2 + rnd() * 2, at: now + rnd() * 0.5 }, now);
      const live = q.pending(now);
      for (let k = 1; k < live.length; k++) expect(live[k].start).toBeGreaterThanOrEqual(live[k - 1].end - 1e-9);
    }
  });

  it("a scheduled start (the win line 0.4 s later) is kept, clear() forgets everything", () => {
    const q = new VoiceQueue();
    expect(q.request({ id: "win", kind: "line", duration: 1, at: 0.4 }, 0)).toMatchObject({ play: true, start: 0.4 });
    expect(q.clear().map((b) => b.id)).toEqual(["win"]);
    expect(q.pending(0)).toEqual([]);
  });

  it("call keys follow the voice index naming", () => {
    expect(callKey("six! seven!")).toBe("call-six-seven");
    expect(callKey("flow!")).toBe("call-flow");
  });
});
