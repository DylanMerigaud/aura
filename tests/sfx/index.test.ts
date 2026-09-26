// play(slot, opts) and duck(musicGain, ms), exercised on node-web-audio-api's OfflineAudioContext.
import { beforeEach, describe, expect, it, vi } from "vitest";
import { OfflineAudioContext } from "node-web-audio-api";
import { audibleSpan, peak } from "../../src/sfx/analyze";

const SR = 48000;
type Sfx = typeof import("../../src/sfx/index");
let sfx: Sfx;

beforeEach(async () => {
  vi.resetModules(); // a fresh module each test: no output registered by a previous test
  sfx = await import("../../src/sfx/index");
});

describe("play", () => {
  it("throws when no output is known", () => {
    expect(() => sfx.play("tick")).toThrow(/no output/);
  });

  it("throws on an unknown slot", () => {
    const ctx = new OfflineAudioContext(1, SR, SR);
    expect(() => sfx.play("airhorn" as never, { ctx })).toThrow(/unknown slot/);
  });

  it("throws when dest belongs to another context", () => {
    const a = new OfflineAudioContext(1, SR, SR);
    const b = new OfflineAudioContext(1, SR, SR);
    expect(() => sfx.play("tick", { ctx: a, dest: b.destination })).toThrow(/another AudioContext/);
    expect(() => sfx.useOutput(a, b.destination)).toThrow(/another AudioContext/);
  });

  it("schedules on ctx.currentTime plus the at offset and reports the window", async () => {
    const ctx = new OfflineAudioContext(1, SR, SR);
    const played = sfx.play("tick", { ctx, at: 0.25, seed: 1 });
    expect(played.start).toBeCloseTo(0.25);
    expect(played.duration).toBeCloseTo(0.04);
    expect(played.end).toBeCloseTo(0.29);
    const x = (await ctx.startRendering()).getChannelData(0);
    const span = audibleSpan(x, SR);
    expect(span.start).toBeGreaterThanOrEqual(0.245);
    expect(span.start).toBeLessThanOrEqual(0.255);
    expect(span.end).toBeLessThanOrEqual(0.31);
  });

  it("uses the output given to useOutput when a call names none", async () => {
    const ctx = new OfflineAudioContext(1, SR, SR);
    const bus = ctx.createGain();
    bus.gain.value = 0.5;
    bus.connect(ctx.destination);
    sfx.useOutput(ctx, bus);
    sfx.play("menuMove", { seed: 1 });
    const x = (await ctx.startRendering()).getChannelData(0);

    const ref = new OfflineAudioContext(1, SR, SR);
    sfx.play("menuMove", { ctx: ref, seed: 1 });
    const y = (await ref.startRendering()).getChannelData(0);
    expect(peak(x)).toBeCloseTo(peak(y) * 0.5, 3);
  });

  it("takes the context from dest when only dest is passed", async () => {
    const ctx = new OfflineAudioContext(1, SR, SR);
    sfx.play("ok", { dest: ctx.destination, seed: 1 });
    const x = (await ctx.startRendering()).getChannelData(0);
    expect(peak(x)).toBeGreaterThan(0.05);
  });

  it("preloads nothing: importing the module creates no context and no node", async () => {
    const spy = vi.fn();
    const Orig = globalThis.AudioContext;
    (globalThis as { AudioContext?: unknown }).AudioContext = spy;
    vi.resetModules();
    await import("../../src/sfx/index");
    expect(spy).not.toHaveBeenCalled();
    (globalThis as { AudioContext?: unknown }).AudioContext = Orig;
  });
});

describe("duck", () => {
  async function ducked(schedule: (g: GainNode) => void) {
    const ctx = new OfflineAudioContext(1, Math.ceil(SR * 0.6), SR);
    const src = ctx.createConstantSource();
    const g = ctx.createGain();
    src.connect(g).connect(ctx.destination);
    src.start(0);
    schedule(g);
    return (await ctx.startRendering()).getChannelData(0);
  }
  const at = (x: Float32Array, s: number) => x[Math.round(s * SR)];

  it("dips to the depth in 20 ms and is back at rest by ms", async () => {
    let end = 0;
    const x = await ducked((g) => {
      end = sfx.duck(g, 150, { at: 0.1 });
    });
    expect(end).toBeCloseTo(0.25);
    expect(at(x, 0.05)).toBeCloseTo(1, 3);
    expect(at(x, 0.12)).toBeCloseTo(0.35, 2);
    expect(at(x, 0.3)).toBeCloseTo(1, 3);
  });

  it("an overlapping duck continues from the held value, no jump", async () => {
    const x = await ducked((g) => {
      sfx.duck(g, 150, { at: 0.1 });
      sfx.duck(g, 150, { at: 0.15, depth: 0.2 });
    });
    let worst = 0;
    for (let i = 1; i < x.length; i++) worst = Math.max(worst, Math.abs(x[i] - x[i - 1]));
    expect(worst).toBeLessThan(0.01);
    expect(at(x, 0.17)).toBeCloseTo(0.2, 2);
    expect(at(x, 0.35)).toBeCloseTo(1, 3);
  });

  it("returns to an explicit resting level", async () => {
    const x = await ducked((g) => {
      sfx.duck(g, 100, { level: 0.8, depth: 0.5 });
    });
    expect(at(x, 0.02)).toBeCloseTo(0.4, 2);
    expect(at(x, 0.2)).toBeCloseTo(0.8, 3);
  });
});
