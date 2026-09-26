// The v2 campaign: the hero chart (level 1, the club) written by hand on the analysis of level4.mp3,
// levels 2 to 5 generated from their track's analysis by a seeded, deterministic chart generator.
import type { Dir, QteEvent, Taunt } from "../qte/types";
import type { LevelV2, StageKey, TrackInfo } from "./contracts";
import { toBeat, trackInfo } from "./tracks";
import cast from "./cast.json";

interface CastLevel {
  id: number;
  title: string;
  place: string;
  story: string[];
  opponent: { name: string; persona: string; color: string };
  taunts: string[];
  announcer: { intro: string; win: string; lose: string };
}
const CAST = (cast as { levels: CastLevel[] }).levels;

/** First beat a QTE may start on (the validator's floor, also "first QTE within 2 bars"). */
const FIRST = 8;

/** Beat occupied by an event: [first input beat, last judged beat]. */
export function span(e: QteEvent): [number, number] {
  if (e.type === "hit") return [e.beat, e.beat];
  if (e.type === "combo") return [e.beat - e.dirs.length + 1, e.beat];
  return [e.beat, e.beat + e.length];
}

/** Strongest onset strength within a fifth of a beat of grid beat k (0 when none). */
export function onsetAt(info: TrackInfo, k: number): number {
  const t = info.firstBeat + (k * 60) / info.bpm;
  const tol = 12 / info.bpm;
  let s = 0;
  for (const o of info.onsets) if (Math.abs(o.t - t) <= tol && o.s > s) s = o.s;
  return s;
}

function taunts(events: QteEvent[], texts: string[], at: number[]): Taunt[] {
  const busy = (b: number) => events.some((e) => b >= span(e)[0] - 1 && b <= span(e)[1]);
  return texts.map((text, i) => {
    let b = at[i];
    for (let d = 0; d < 16 && busy(b); d++) b = at[i] + (d % 2 ? -(d + 1) / 2 : d / 2 + 1);
    return { beat: b, text };
  });
}

function base(id: number, track: string, stage: StageKey, artKey: string, neon: [string, string], windowScale: number, lengthBeats: number) {
  const c = CAST.find((l) => l.id === id) ?? CAST[id - 1];
  const info = trackInfo(track);
  return {
    info,
    c,
    level: {
      id,
      title: c.title,
      place: c.place,
      artKey,
      story: [c.story[0] ?? "", c.story[1] ?? ""] as [string, string],
      opponent: { ...c.opponent },
      announcer: { ...c.announcer },
      bpm: info.bpm,
      windowScale,
      lengthBeats,
      seed: id * 1009,
      track,
      stage,
      neon,
    },
  };
}

/*
 * HERO CHART on level4.mp3 (the 12:40 render), refined grid 130.0 BPM, beat 0 = 0.058 s, lengthBeats 86 (39.7 s).
 * Shape (energy_per_beat, the 808 band, 16th RMS): a 4 beat intro, the groove kicks in on beat 4 with an 808
 * slam every 2 bars (4, 12, 20, 28) and a clap accent on the last beat of every bar (7, 11, 15 ... 31); a stop
 * and go breakdown from 37 to 67 (energy 0.25 to 0.45, the bass out) broken by an 808 slam every 2 bars (36,
 * 44, 52, 60); THE DROP on beat 68 (energy 0.38 on 64 to 67, then 0.95 for the rest, the largest rise of the
 * track); full section to the end.
 * Onset strength matched per input (full band onset_strength normalized to its 99.5th percentile, "cow" = the
 * 500 to 1800 Hz band where the cowbell and the clap sit, "808" = the 30 to 150 Hz slam):
 *   beat  input           full  cow   note
 *   8     HIT right       1.15  1.04  first QTE, 2 bars in
 *   12    HIT up          1.50  1.19  808 slam
 *   15    HIT left        1.53  1.34  bar end accent, strongest onset of the groove
 *   19    HIT down        1.06  1.13  bar end accent
 *   23    HIT right       1.26  1.09  bar end accent
 *   28    COMBO 3 end     0.48        presses 26 27 28: 27 is the accent (0.94), 28 the 808 slam
 *   31    HIT down        0.98  0.68  bar end accent
 *   36    HIT up          0.36  0.36  808 slam that opens the breakdown (energy 0.88 between two dips)
 *   40    HOLD 4                      bass out, release on the 808 slam of 44
 *   47    HIT left        0.52  0.54  clap
 *   52    COMBO 4 end     0.35        presses 49 to 52, the last on the 808 slam
 *   56    HOLD 4                      release on the 808 slam of 60
 *   62    MASH 6                      charge through the last 6 beats before the drop
 *   68    MASH release    0.57  0.62  THE 69 release on the drop
 *   71    HIT up          0.70  0.82
 *   76    COMBO 3 end     1.00  1.07  presses 74 75 76, strongest onset of the drop
 *   79    HIT right       0.79  0.75
 *   82    HIT up          0.50  0.68  last input, 808 slam
 */
const HERO_EVENTS: QteEvent[] = [
  { type: "hit", beat: 8, dir: "right" },
  { type: "hit", beat: 12, dir: "up" },
  { type: "hit", beat: 15, dir: "left" },
  { type: "hit", beat: 19, dir: "down" },
  { type: "hit", beat: 23, dir: "right" },
  { type: "combo", beat: 28, dirs: ["left", "up", "right"] },
  { type: "hit", beat: 31, dir: "down" },
  { type: "hit", beat: 36, dir: "up" },
  { type: "hold", beat: 40, length: 4 },
  { type: "hit", beat: 47, dir: "left" },
  { type: "combo", beat: 52, dirs: ["up", "down", "left", "right"] },
  { type: "hold", beat: 56, length: 4 },
  { type: "mash", beat: 62, length: 6 },
  { type: "hit", beat: 71, dir: "up" },
  { type: "combo", beat: 76, dirs: ["down", "left", "right"] },
  { type: "hit", beat: 79, dir: "right" },
  { type: "hit", beat: 82, dir: "up" },
];

function hero(): LevelV2 {
  const { c, level } = base(1, "level4", "metro", "metro", ["#ffb347", "#35e0ff"], 1, 86);
  return {
    ...level,
    events: HERO_EVENTS,
    // Beat 3 before the first QTE, 33 before the breakdown, 84 after the last input.
    taunts: taunts(HERO_EVENTS, c.taunts, [3, 14, 24, 33, 46, 58, 76, 84]),
    dropBeats: [4, 68],
    breakdownBeats: [[37, 44], [45, 52], [53, 60], [61, 68]],
  };
}

/** mulberry32: small seeded PRNG so generated charts never change between builds. */
function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

interface Flavor {
  /** Anchors placed first: MASH releases on drops, HOLDs on drops or breakdowns. */
  mashes: number;
  mashLen: number;
  holdOnDrops: boolean;
  holdOnBreakdowns: boolean;
  /** Chance a filler slot becomes a COMBO / a HOLD instead of a HIT. */
  combo: number;
  hold: number;
  /** Filler spacing in beats. */
  gapMin: number;
  gapMax: number;
  /** Tighter spacing after this beat (boss phase 2). */
  phase2?: number;
}

const DIRS: Dir[] = ["up", "down", "left", "right"];

function dropBeatsOf(info: TrackInfo, lengthBeats: number): number[] {
  return info.drops.map((t) => Math.round(toBeat(info, t))).filter((b) => b >= FIRST + 4 && b <= lengthBeats - 4);
}

function breakdownBeatsOf(info: TrackInfo, lengthBeats: number): [number, number][] {
  return info.breakdowns
    .map(([a, b]) => [Math.ceil(toBeat(info, a)), Math.round(toBeat(info, b))] as [number, number])
    .filter(([a, b]) => b - a >= 2 && a >= FIRST && b <= lengthBeats - 4);
}

/** Energy rise at beat b: mean of the 4 beats from b minus the mean of the 4 before. */
export function rise(info: TrackInfo, b: number): number {
  const e = info.energyPerBeat;
  const m = (from: number) => [0, 1, 2, 3].reduce((s, i) => s + (e[from + i] ?? 0), 0) / 4;
  return m(b) - m(b - 4);
}

export function generateChart(info: TrackInfo, lengthBeats: number, seed: number, f: Flavor): QteEvent[] {
  const r = rng(seed);
  const hi = lengthBeats - 4;
  const anchors: QteEvent[] = [];
  const free = (a: number, b: number) => anchors.every((e) => b < span(e)[0] - 1 || a > span(e)[1] + 1);
  const drops = dropBeatsOf(info, lengthBeats).sort((a, b) => rise(info, b) - rise(info, a));
  // No analysis: pretend the drop sits on the middle bar so the MASH still has a target.
  if (!drops.length) drops.push(Math.round(lengthBeats / 8) * 4);

  // MASH releases on the biggest drops.
  for (const d of drops.slice(0, f.mashes)) {
    const start = d - f.mashLen;
    if (start >= FIRST && free(start, d)) anchors.push({ type: "mash", beat: start, length: f.mashLen });
  }
  // A drop with no MASH freezes on a HOLD from the drop beat.
  if (f.holdOnDrops) {
    for (const d of drops) {
      const len = d + 3 <= hi ? 3 : 2;
      if (d + len <= hi && free(d, d + len)) anchors.push({ type: "hold", beat: d, length: len });
    }
  }
  if (f.holdOnBreakdowns) {
    for (const [a, b] of breakdownBeatsOf(info, lengthBeats)) {
      const len = Math.max(1, Math.min(4, b - a));
      if (free(a, a + len)) anchors.push({ type: "hold", beat: a, length: len });
    }
  }
  anchors.sort((a, b) => a.beat - b.beat);

  // Fill between anchors: pick the strongest onset in each spacing window.
  const events: QteEvent[] = [];
  let pos = FIRST - 2;
  let lastDir: Dir | null = null;
  const pickDir = () => {
    const opts = DIRS.filter((d) => d !== lastDir);
    lastDir = opts[Math.floor(r() * opts.length)];
    return lastDir;
  };
  const strongest = (a: number, b: number) => {
    let best = -1;
    let bestS = -1;
    for (let k = a; k <= b; k++) {
      const s = onsetAt(info, k) + (info.energyPerBeat[k] ?? 0.5) * 0.2 + r() * 0.05;
      if (s > bestS) {
        bestS = s;
        best = k;
      }
    }
    return best;
  };
  const fillTo = (limit: number) => {
    for (;;) {
      const tight = f.phase2 !== undefined && pos >= f.phase2;
      const gMin = tight ? Math.max(1, f.gapMin - 1) : f.gapMin;
      const gMax = tight ? Math.max(gMin, f.gapMax - 1) : f.gapMax;
      const roll = r();
      // COMBO: its first press lands gMin after the previous event, its last on a strong onset.
      if (roll < f.combo) {
        const n = r() < 0.4 ? 4 : 3;
        const a = Math.max(pos + gMin + n - 1, FIRST + n - 1);
        const k = strongest(a, Math.min(a + 2, limit));
        if (k >= 0) {
          events.push({ type: "combo", beat: k, dirs: Array.from({ length: n }, pickDir) });
          pos = k;
          continue;
        }
      }
      const lo = Math.max(pos + gMin, FIRST);
      if (lo > limit) return;
      const k = strongest(lo, Math.min(pos + gMax, limit));
      if (k < 0) return;
      if (roll > 1 - f.hold && k + 2 <= limit) {
        events.push({ type: "hold", beat: k, length: 2 });
        pos = k + 2;
        continue;
      }
      events.push({ type: "hit", beat: k, dir: pickDir() });
      pos = k;
    }
  };
  // The first QTE lands on beat 8, two bars in, always a plain HIT.
  if (!anchors.some((a) => span(a)[0] <= FIRST + 1)) {
    events.push({ type: "hit", beat: FIRST, dir: pickDir() });
    pos = FIRST;
  }
  for (const a of anchors) {
    fillTo(span(a)[0] - 2);
    events.push(a);
    // Nothing within 1 beat after a MASH release or a HOLD release.
    pos = span(a)[1] + 1;
  }
  fillTo(hi);
  return events;
}

/** Whole beats that fit in the track (ending a quarter second before it), capped at 50 s of play. */
export function fitBeats(info: TrackInfo): number {
  return Math.min(Math.floor(((info.duration - info.firstBeat - 0.25) * info.bpm) / 60), Math.floor((50 * info.bpm) / 60));
}

function generated(
  id: number,
  track: string,
  stage: StageKey,
  artKey: string,
  neon: [string, string],
  windowScale: number,
  f: Flavor,
  boss = false,
): LevelV2 {
  const L = fitBeats(trackInfo(track));
  const { info, c, level } = base(id, track, stage, artKey, neon, windowScale, L);
  // Boss phase 2 on the bar nearest the midpoint of the track (one track, see the lane report).
  const phase2Beat = boss ? Math.round(L / 8) * 4 : undefined;
  const events = generateChart(info, L, level.seed, { ...f, phase2: phase2Beat });
  return {
    ...level,
    ...(phase2Beat !== undefined ? { phase2Beat } : {}),
    events,
    taunts: taunts(events, c.taunts, [Math.round(L * 0.2), Math.round(L * 0.5), Math.round(L * 0.8)]),
    dropBeats: dropBeatsOf(info, L),
    breakdownBeats: breakdownBeatsOf(info, L),
  };
}

export const LEVELS_V2: LevelV2[] = [
  hero(),
  // Metro, Kevin: tutorial pace, HIT and one short MASH.
  generated(2, "level1", "metro", "metro", ["#39ff14", "#00b3ff"], 0.95, {
    mashes: 1, mashLen: 4, holdOnDrops: false, holdOnBreakdowns: false, combo: 0, hold: 0, gapMin: 2, gapMax: 4,
  }),
  // Kebab, Mehdi: adds COMBO.
  generated(3, "level2", "kebab", "kebab", ["#ff9f1c", "#ff3b30"], 0.9, {
    mashes: 1, mashLen: 5, holdOnDrops: false, holdOnBreakdowns: false, combo: 0.12, hold: 0, gapMin: 2, gapMax: 4,
  }),
  // Parvis, His Holiness: built on HOLD, freezes on the organ drops.
  generated(4, "level3", "parvis", "rooftop", ["#ffe066", "#8ecbff"], 0.85, {
    mashes: 0, mashLen: 4, holdOnDrops: true, holdOnBreakdowns: true, combo: 0.1, hold: 0.45, gapMin: 2, gapMax: 4,
  }),
  // Voodoo stage, The Algorithm: everything, phase 2 at the midpoint of the boss track tightens the spacing.
  generated(5, "boss", "stage", "stage", ["#ff007f", "#00e5ff"], 0.75, {
    mashes: 2, mashLen: 5, holdOnDrops: false, holdOnBreakdowns: true, combo: 0.3, hold: 0.1, gapMin: 2, gapMax: 4,
  }, true),
];

/** Seconds of play at the track bpm. */
export function levelSeconds(l: LevelV2): number {
  return (l.lengthBeats * 60) / l.bpm;
}

/**
 * The mechanical pacing gate of amendment 10 section 3 plus the hero rules of amendment 9: first QTE within
 * 2 bars, no span over 2 bars without a QTE (a HOLD counts as active while held), 35 to 50 s, nothing within
 * 1 beat after a MASH release, every event inside the track, taunts on free beats. Empty = pass.
 */
export function pacingIssues(l: LevelV2): string[] {
  const out: string[] = [];
  const info = trackInfo(l.track);
  const ev = [...l.events].sort((a, b) => a.beat - b.beat);
  if (!ev.length) return ["no events"];
  if (span(ev[0])[0] > FIRST) out.push(`first QTE on beat ${span(ev[0])[0]}, over 2 bars`);
  let prev = span(ev[0])[1];
  for (let i = 1; i < ev.length; i++) {
    const [a, b] = span(ev[i]);
    if (a - prev > 8) out.push(`gap of ${a - prev} beats before beat ${a}`);
    if (ev[i - 1].type === "mash" && a - prev < 2) out.push(`input on beat ${a} within 1 beat of the MASH release on ${prev}`);
    prev = b;
  }
  if (l.lengthBeats - prev > 8) out.push(`dead tail of ${l.lengthBeats - prev} beats`);
  const s = levelSeconds(l);
  if (s < 35 || s > 50) out.push(`level lasts ${s.toFixed(1)} s, outside 35..50`);
  const end = info.firstBeat + (prev * 60) / info.bpm;
  if (end > info.duration - 0.5) out.push(`last event at ${end.toFixed(2)} s, past the track end ${info.duration} s`);
  const lenEnd = info.firstBeat + levelSeconds(l);
  if (lenEnd > info.duration + 0.01) out.push(`lengthBeats ends at ${lenEnd.toFixed(2)} s, past the track end`);
  for (const t of l.taunts) {
    if (ev.some((e) => t.beat >= span(e)[0] && t.beat <= span(e)[1])) out.push(`taunt on beat ${t.beat} lands on an active QTE`);
  }
  return out;
}
