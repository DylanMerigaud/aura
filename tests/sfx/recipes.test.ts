// Offline renders of every Gen Z SFX slot through node-web-audio-api: each recipe renders without throwing,
// its scheduled duration sits inside its spec and matches what is actually heard, the peak stays under 0 dBFS,
// no DC offset over 0.05 and no silence longer than 100 ms inside a sound. Plus the pure helpers.
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { OfflineAudioContext } from "node-web-audio-api";
import {
  FANFARE,
  SLOTS,
  SLOT_NAMES,
  applyMaster,
  mashPitch,
  pitchFactor,
  rollHits,
  seeded,
  softClipCurve,
  type RecipeOpts,
  type Slot,
} from "../../src/sfx/recipes";
import { audibleSpan, dcOffset, normalize, peak } from "../../src/sfx/analyze";

const SR = 48000;

async function render(slot: Slot, opts: RecipeOpts, master = false) {
  const [, max] = SLOTS[slot].duration(opts.bpm ?? 120);
  const ctx = new OfflineAudioContext(1, Math.ceil((max + 0.5) * SR), SR);
  const dest = master ? applyMaster(ctx).input : ctx.destination;
  const duration = SLOTS[slot].recipe(ctx, dest, opts);
  const x = (await ctx.startRendering()).getChannelData(0);
  return { duration, x };
}

/** Frequency estimate from zero crossings between `from` and `to` seconds (good for one dominant partial). */
function zeroCrossHz(x: Float32Array, from: number, to: number): number {
  let n = 0;
  const a = Math.floor(from * SR);
  const b = Math.floor(to * SR);
  for (let i = a + 1; i < b; i++) if ((x[i - 1] < 0) !== (x[i] < 0)) n++;
  return n / 2 / (to - from);
}

const CASES = SLOT_NAMES.flatMap((slot) =>
  [90, 120, 150].flatMap((bpm) => [1, 2].map((seed) => ({ slot, bpm, seed }))),
);

describe("every slot, rendered offline", () => {
  it("covers the sixteen slots the game calls", () => {
    expect(SLOT_NAMES).toEqual([
      "menuMove", "menuConfirm", "menuCancel", "levelStart", "perfect", "great", "ok", "missCringe",
      "mashCharge", "auraRelease", "bigHit", "crowdRoar", "crowdOoh", "victory", "defeat", "tick",
    ]);
  });

  it.each(CASES)("$slot at $bpm bpm, seed $seed", async ({ slot, bpm, seed }) => {
    const { duration, x } = await render(slot, { bpm, seed, step: seed === 1 ? 0 : 1 });
    const [min, max] = SLOTS[slot].duration(bpm);
    expect(duration).toBeGreaterThanOrEqual(min);
    expect(duration).toBeLessThanOrEqual(max);

    const p = peak(x);
    expect(p).toBeLessThan(1); // under 0 dBFS
    expect(p).toBeGreaterThan(0.01); // and not silent

    const y = normalize(x, -1);
    expect(Math.abs(dcOffset(y.subarray(0, Math.ceil(duration * SR))))).toBeLessThan(0.05);

    const span = audibleSpan(x, SR, -48, 5);
    expect(span.start).toBeLessThanOrEqual(0.005); // starts on time
    expect(span.end).toBeLessThanOrEqual(duration + 0.02); // never rings past its scheduled duration
    expect(span.end).toBeGreaterThanOrEqual(duration * 0.5); // and does not declare a tail it never plays
    expect(span.longestGap).toBeLessThanOrEqual(0.1); // no silence over 100 ms inside the sound
  });

  it("every slot has its row in docs/sfx.md", () => {
    const doc = readFileSync("docs/sfx.md", "utf8");
    for (const slot of SLOT_NAMES) expect(doc).toContain(`| \`${slot}\` | ${SLOTS[slot].recipeLine.split(",")[0]}`);
  });

  it.each(SLOT_NAMES)("%s stays under 0 dBFS through the master chain", async (slot) => {
    const { x } = await render(slot, { seed: 3, step: 1 }, true);
    expect(peak(x)).toBeLessThan(1);
  });
});

describe("what each recipe says it plays", () => {
  it("menuMove is sine 1046 Hz then 1318 Hz", async () => {
    const { x } = await render("menuMove", { seed: 1, variation: 0 });
    expect(zeroCrossHz(x, 0.003, 0.024)).toBeCloseTo(1046.5, -1.5);
    expect(zeroCrossHz(x, 0.036, 0.056)).toBeCloseTo(1318.5, -1.5);
  });

  it("perfect rises a major third from 880 Hz", async () => {
    const { x } = await render("perfect", { seed: 1, variation: 0 });
    expect(zeroCrossHz(x, 0.005, 0.075)).toBeCloseTo(880, -1.5);
  });

  it("levelStart lands its 808 slide on 55 Hz", async () => {
    const { x } = await render("levelStart", { seed: 1, variation: 0, bpm: 120 });
    const hz = zeroCrossHz(x, 2 + 0.4, 2 + 0.56);
    expect(hz).toBeGreaterThan(50);
    expect(hz).toBeLessThan(60);
  });

  it("defeat slides down an octave from about 147 Hz", async () => {
    const { x } = await render("defeat", { seed: 1, variation: 0 });
    const early = zeroCrossHz(x, 0.02, 0.22);
    const late = zeroCrossHz(x, 1.8, 2.0);
    expect(early).toBeGreaterThan(125);
    expect(early).toBeLessThan(150);
    expect(late).toBeGreaterThan(68);
    expect(late).toBeLessThan(82);
  });

  it("mashCharge renders higher as step climbs", async () => {
    const hz = [];
    for (const step of [0, 0.5, 1]) {
      const { x } = await render("mashCharge", { seed: 1, variation: 0, step });
      hz.push(zeroCrossHz(x, 0.005, 0.13));
    }
    expect(hz[1]).toBeGreaterThan(hz[0]);
    expect(hz[2]).toBeGreaterThan(hz[1]);
  });

  it("auraRelease chops in 16ths: four gated slices over one beat", async () => {
    // The sub is almost all low frequency, so the first difference (a crude highpass) mostly hears the chop:
    // inside each 16th, the open part of the gate must carry clearly more of it than the closed part.
    const bpm = 120;
    const { x } = await render("auraRelease", { seed: 1, variation: 0, bpm });
    const g16 = 60 / bpm / 4;
    const energy = (a: number, b: number) => {
      let s = 0;
      for (let i = Math.floor(a * SR) + 1; i < Math.floor(b * SR); i++) s += (x[i] - x[i - 1]) ** 2;
      return s;
    };
    for (let i = 0; i < 4; i++) {
      const open = energy(i * g16 + 0.01, i * g16 + g16 * 0.6);
      const closed = energy(i * g16 + g16 * 0.82, (i + 1) * g16 - 0.002);
      expect(open).toBeGreaterThan(closed * 2);
    }
  });
});

describe("seeds and the 3 percent pitch variation", () => {
  it("renders the same samples from the same seed", async () => {
    for (const slot of ["menuMove", "crowdRoar", "levelStart"] as const) {
      const a = await render(slot, { seed: 42 });
      const b = await render(slot, { seed: 42 });
      expect(Array.from(a.x)).toEqual(Array.from(b.x));
    }
  });

  it("renders different samples from different seeds", async () => {
    const a = await render("menuMove", { seed: 1 });
    const b = await render("menuMove", { seed: 2 });
    expect(Array.from(a.x)).not.toEqual(Array.from(b.x));
  });

  it("variation 0 removes the only random draw of a tonal recipe", async () => {
    const a = await render("menuMove", { seed: 1, variation: 0 });
    const b = await render("menuMove", { seed: 2, variation: 0 });
    expect(Array.from(a.x)).toEqual(Array.from(b.x));
  });

  it("keeps the pitch within 3 percent by default", () => {
    for (let s = 0; s < 200; s++) {
      const k = pitchFactor(seeded(s));
      expect(k).toBeGreaterThanOrEqual(0.97);
      expect(k).toBeLessThanOrEqual(1.03);
    }
    expect(pitchFactor(() => 0)).toBeCloseTo(0.97);
    expect(pitchFactor(() => 0.5)).toBeCloseTo(1);
    expect(pitchFactor(() => 0.999999, 0.1)).toBeCloseTo(1.1);
  });

  it("the seeded generator is uniform enough and in [0, 1)", () => {
    const r = seeded(9);
    let sum = 0;
    for (let i = 0; i < 10000; i++) {
      const v = r();
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
      sum += v;
    }
    expect(sum / 10000).toBeCloseTo(0.5, 1);
  });
});

describe("pure helpers", () => {
  it("mashPitch climbs two octaves from 220 Hz, clamped", () => {
    expect(mashPitch(0)).toBeCloseTo(220);
    expect(mashPitch(0.5)).toBeCloseTo(440);
    expect(mashPitch(1)).toBeCloseTo(880);
    expect(mashPitch(-1)).toBeCloseTo(220);
    expect(mashPitch(2)).toBeCloseTo(880);
  });

  it.each([90, 120, 150])("rollHits accelerates inside one bar at %i bpm", (bpm) => {
    const spb = 60 / bpm;
    const hits = rollHits(bpm);
    expect(hits[0]).toBe(0);
    expect(hits[1]).toBeCloseTo(spb / 4);
    expect(hits[hits.length - 1]).toBeLessThan(4 * spb);
    const gaps = hits.slice(1).map((h, i) => h - hits[i]);
    for (let i = 1; i < gaps.length; i++) expect(gaps[i]).toBeLessThan(gaps[i - 1]);
    expect(gaps[gaps.length - 1]).toBeGreaterThanOrEqual((spb / 4) * 0.4 - 1e-9);
  });

  it("the fanfare is six notes filling one bar and ends on the octave", () => {
    expect(FANFARE.semis).toHaveLength(6);
    expect(FANFARE.beats).toHaveLength(6);
    expect(FANFARE.beats.reduce((a, b) => a + b, 0)).toBe(4);
    expect(FANFARE.semis[FANFARE.semis.length - 1]).toBe(12);
  });

  it("softClipCurve is unity below the knee, odd, and never passes the ceiling", () => {
    const c = softClipCurve(0.6, 0.95, 2049);
    const at = (x: number) => c[Math.round(((x + 1) / 2) * (c.length - 1))];
    expect(at(0.3)).toBeCloseTo(0.3, 3);
    expect(at(-0.3)).toBeCloseTo(-0.3, 3);
    expect(Math.max(...c)).toBeLessThanOrEqual(0.95);
    expect(Math.min(...c)).toBeGreaterThanOrEqual(-0.95);
    for (let i = 1; i < c.length; i++) expect(c[i]).toBeGreaterThanOrEqual(c[i - 1]);
  });

  it("the master chain holds a stack of hot hits under 0 dBFS", async () => {
    const ctx = new OfflineAudioContext(1, SR * 3, SR);
    const m = applyMaster(ctx);
    const hot = ctx.createGain();
    hot.gain.value = 4; // +12 dB into the chain
    hot.connect(m.input);
    for (const slot of ["bigHit", "auraRelease", "crowdRoar", "levelStart"] as const) SLOTS[slot].recipe(ctx, hot, { seed: 5 });
    const x = (await ctx.startRendering()).getChannelData(0);
    expect(peak(x)).toBeLessThan(1);
    expect(peak(x)).toBeGreaterThan(0.5);
  });
});
