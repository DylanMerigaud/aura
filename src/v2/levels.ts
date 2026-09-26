// The v2 campaign, the roster in order (addendum 16:40): 1 the Boat Kid (the hero chart, written by hand on the
// analysis of level4.mp3, where the WOW lives), 2 the Turnstile Ninja, 3 Papi Raleur, 4 La Parisienne, 5 Sporty
// Granny, all in the same black arena (a light color per opponent, cast.json opponent.light). Levels 2 to 5 are
// generated from their track's analysis by a seeded, deterministic chart generator. A win moves to the next
// opponent, the roster loops when exhausted with the difficulty raised each loop (rosterLevel).
import type { Dir, QteEvent, Taunt } from "../qte/types";
import type { LevelV2, StageKey, TrackInfo, TurnSpec } from "./contracts";
import { toBeat, trackInfo } from "./tracks";
import cast from "./cast.json";

interface CastLevel {
  id: number;
  title: string;
  place: string;
  story: string[];
  opponent: { name: string; handle: string; rank: string; persona: string; color: string; light: string; rig: string };
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
 *
 * Dance battle turns (the player, then him), MOBILE ONLY (swipe, alternate taps, hold), difficulty ramping 0.2 to 0.8 over
 * the 40 s through density, windows (tighter with the combo, src/v2/core.ts) and the tempo rule. HIT pairs stay at
 * least 2 beats apart and never repeat a move (scripts/eval-animation.ts k7, k10): `dir` is the dance move the hero
 * plays on the hit, not an input.
 *   beats   turn       inputs                                              note
 *   0-16    player     HIT 4, 6, 8, 10, 12, 14                             onboarding: the first on the groove slam
 *                                                                          (4), wide windows, a ghost tap on the first
 *   16-24   opponent   boatSweep (every opponent turn)                      the Boat Kid rows, calm
 *   24-40   player     THE 67 24-28, HIT 30, HOLD 32-36, HIT 38            the 67 released on the 808 slam of 28, the
 *                                                                          hold lifted on the slam of 36
 *   40-48   opponent   boatSweep                                            the breakdown
 *   48-56   player     HOLD 48-52, HIT 53, HIT 55                           hold through the breakdown onto the slam
 *   56-64   opponent   palmPush                                             the build before the drop
 *   64-80   player     THE 67 64-68, HIT 70, 72, 74, 76, 78                 THE 67 released on THE DROP (68), then
 *                                                                          a note every 2 beats at full energy
 *   80-86   opponent   chinUpTaunt                                          his last word before the verdict
 * The first 15 s (to beat 32) cannot be lost: the core floors the meter there.
 */
const HERO_EVENTS: QteEvent[] = [
  // Onboarding (addendum 17:15): the first 4 bars one direction only, then two, then all four.
  { type: "hit", beat: 4, dir: "up" },
  { type: "hit", beat: 6, dir: "up" },
  { type: "hit", beat: 8, dir: "up" },
  { type: "hit", beat: 10, dir: "up" },
  { type: "hit", beat: 12, dir: "up" },
  { type: "hit", beat: 14, dir: "up" },
  { type: "mash", beat: 24, length: 4 },
  { type: "hit", beat: 30, dir: "left" },
  { type: "hold", beat: 32, length: 4 },
  { type: "hit", beat: 38, dir: "right" },
  { type: "hold", beat: 48, length: 4 },
  { type: "hit", beat: 53, dir: "left" },
  { type: "hit", beat: 55, dir: "right" },
  { type: "mash", beat: 64, length: 4 },
  { type: "hit", beat: 70, dir: "up" },
  { type: "hit", beat: 72, dir: "left" },
  { type: "hit", beat: 74, dir: "down" },
  { type: "hit", beat: 76, dir: "right" },
  { type: "hit", beat: 78, dir: "up" },
];

const HERO_TURNS: TurnSpec[] = [
  { who: "player", beat: 0, lengthBeats: 16 },
  // The Boat Kid's signature on every one of his turns: the mocap boat arm sweep.
  { who: "opponent", beat: 16, lengthBeats: 8, move: "boatSweep" },
  { who: "player", beat: 24, lengthBeats: 16 },
  { who: "opponent", beat: 40, lengthBeats: 8, move: "boatSweep" },
  { who: "player", beat: 48, lengthBeats: 8 },
  { who: "opponent", beat: 56, lengthBeats: 8, move: "boatSweep" },
  { who: "player", beat: 64, lengthBeats: 16 },
  { who: "opponent", beat: 80, lengthBeats: 6, move: "boatSweep" },
];

function hero(): LevelV2 {
  const { c, level } = base(1, "level4", "metro", "metro", ["#ffb347", "#35e0ff"], 1, 86);
  return {
    ...level,
    events: HERO_EVENTS,
    // Taunts on his turns only, never over a player prompt: one per turn for a short cast, two per turn for 8 lines.
    taunts: taunts(HERO_EVENTS, c.taunts, c.taunts.length <= 4 ? [17, 41, 57, 81] : [17, 21, 41, 45, 57, 61, 81, 84]),
    // 28 is the 808 slam the first 67 releases on (the pacing eval's release_on_drop).
    dropBeats: [4, 28, 68],
    breakdownBeats: [[37, 44], [45, 52], [53, 60], [61, 68]],
    turns: HERO_TURNS,
    // Tuned with pnpm balance: the average bot wins about 75 percent (flags at 35 and 85).
    opponentAura: 0.08,
  };
}

/** Opponent moves the generated levels rotate through (keys of src/anim/gestures.ts GESTURES). */
export const OPPONENT_MOVES = ["chinUpTaunt", "boatSweep", "sixSevenHands", "palmPush", "sigmaStare", "wristRoll", "shoulderBrush", "chillGuyPockets"];

/** True when the beat span [a, b] of a QTE intersects the turn [t.beat, t.beat + t.lengthBeats). */
export function intersects(a: number, b: number, t: TurnSpec): boolean {
  return a < t.beat + t.lengthBeats && b >= t.beat;
}

/** Player turn lengths tried, whole bars nearest 4 bars first, then any beat up to 10 bars. */
const TURN_OFFSETS = Array.from({ length: 33 }, (_, i) => i + 8).sort((a, b) => Number(a % 4 !== 0) - Number(b % 4 !== 0) || Math.abs(a - 16) - Math.abs(b - 16));

/**
 * Simple alternation for a generated chart: player turns of about 4 bars, opponent turns of 2 bars placed
 * where they cut no MASH (the 67 stays whole), always ending on a player turn. Any other event inside an
 * opponent turn is dropped.
 */
export function alternate(events: QteEvent[], lengthBeats: number, seed: number): { events: QteEvent[]; turns: TurnSpec[] } {
  const turns: TurnSpec[] = [];
  const anchors = events.filter((e) => e.type === "mash");
  let cursor = 0;
  let m = seed % OPPONENT_MOVES.length;
  for (;;) {
    let placed = -1;
    for (const d of TURN_OFFSETS) {
      const s = cursor + d;
      const t: TurnSpec = { who: "opponent", beat: s, lengthBeats: 8 };
      // Leave at least 2 bars of player time after it.
      if (s + 8 + 8 > lengthBeats) continue;
      if (anchors.some((e) => intersects(span(e)[0], span(e)[1], t))) continue;
      placed = s;
      break;
    }
    if (placed < 0) break;
    turns.push({ who: "player", beat: cursor, lengthBeats: placed - cursor });
    turns.push({ who: "opponent", beat: placed, lengthBeats: 8, move: OPPONENT_MOVES[m++ % OPPONENT_MOVES.length] });
    cursor = placed + 8;
  }
  turns.push({ who: "player", beat: cursor, lengthBeats: lengthBeats - cursor });
  const opp = turns.filter((t) => t.who === "opponent");
  return { turns, events: events.filter((e) => !opp.some((t) => intersects(span(e)[0], span(e)[1], t))) };
}

/**
 * The turn rules: turns in order, integer, inside the level, never overlapping; no player QTE whose span
 * intersects an opponent turn; opponent turns carry a move. Empty = pass.
 */
export function turnIssues(l: LevelV2): string[] {
  const out: string[] = [];
  const turns = l.turns ?? [];
  let end = 0;
  for (let i = 0; i < turns.length; i++) {
    const t = turns[i];
    if (!Number.isInteger(t.beat) || !Number.isInteger(t.lengthBeats) || t.lengthBeats <= 0) out.push(`turns[${i}] has a bad beat ${t.beat} or length ${t.lengthBeats}`);
    if (t.beat < 0 || t.beat + t.lengthBeats > l.lengthBeats) out.push(`turns[${i}] (${t.beat}..${t.beat + t.lengthBeats}) is outside the level`);
    if (i > 0 && t.beat < end) out.push(`turns[${i}] on beat ${t.beat} overlaps the previous turn ending on ${end}`);
    end = Math.max(end, t.beat + t.lengthBeats);
    if (t.who === "opponent" && !t.move) out.push(`turns[${i}] opponent turn on beat ${t.beat} has no move`);
    if (t.who !== "opponent") continue;
    for (const e of l.events) {
      const [a, b] = span(e);
      if (intersects(a, b, t)) out.push(`${e.type} on beat ${e.beat} (span ${a}..${b}) intersects the opponent turn ${t.beat}..${t.beat + t.lengthBeats}`);
    }
  }
  return out;
}

/** Opponent turn beats strictly inside (a, b): they do not count as a gap without a QTE. */
function opponentBeatsIn(l: LevelV2, a: number, b: number): number {
  let n = 0;
  for (const t of l.turns ?? []) if (t.who === "opponent") n += Math.max(0, Math.min(b, t.beat + t.lengthBeats) - Math.max(a, t.beat));
  return n;
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

/**
 * Where the taunts go: two per opponent turn (his turn is free of player prompts), then spread over the level
 * for the rest (taunts() slides each off a busy beat). Always one beat per text.
 */
export function tauntBeats(turns: TurnSpec[], n: number, lengthBeats: number): number[] {
  const out: number[] = [];
  for (const t of turns) if (t.who === "opponent") out.push(t.beat + 1, t.beat + Math.min(5, t.lengthBeats - 1));
  const extra = n - out.length;
  for (let i = 0; i < extra; i++) out.push(Math.round(((i + 1) * lengthBeats) / (extra + 1)));
  return out.slice(0, n).sort((a, b) => a - b);
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
  const { events, turns } = alternate(generateChart(info, L, level.seed, { ...f, phase2: phase2Beat }), L, level.seed);
  return {
    ...level,
    turns,
    ...(phase2Beat !== undefined ? { phase2Beat } : {}),
    events,
    taunts: taunts(events, c.taunts, tauntBeats(turns, c.taunts.length, L)),
    dropBeats: dropBeatsOf(info, L),
    breakdownBeats: breakdownBeatsOf(info, L),
  };
}

export const LEVELS_V2: LevelV2[] = [
  // 1 The Boat Kid (hero chart).
  hero(),
  // 2 The Turnstile Ninja: tutorial pace, HIT and one short MASH.
  generated(2, "level1", "metro", "metro", ["#39ff14", "#00b3ff"], 0.95, {
    mashes: 1, mashLen: 4, holdOnDrops: false, holdOnBreakdowns: false, combo: 0, hold: 0, gapMin: 2, gapMax: 4,
  }),
  // 3 Papi Raleur: adds COMBO.
  generated(3, "level2", "kebab", "kebab", ["#ff9f1c", "#ff3b30"], 0.9, {
    mashes: 1, mashLen: 5, holdOnDrops: false, holdOnBreakdowns: false, combo: 0.12, hold: 0, gapMin: 2, gapMax: 4,
  }),
  // 4 La Parisienne: built on HOLD, freezes on the drops.
  generated(4, "level3", "parvis", "rooftop", ["#ffe066", "#8ecbff"], 0.85, {
    mashes: 0, mashLen: 4, holdOnDrops: true, holdOnBreakdowns: true, combo: 0.1, hold: 0.45, gapMin: 2, gapMax: 4,
  }),
  // 5 Sporty Granny: everything, phase 2 at the midpoint of the boss track tightens the spacing.
  generated(5, "boss", "stage", "stage", ["#ff007f", "#00e5ff"], 0.75, {
    mashes: 2, mashLen: 5, holdOnDrops: false, holdOnBreakdowns: true, combo: 0.3, hold: 0.1, gapMin: 2, gapMax: 4,
  }, true),
];

/**
 * The level at a position of the run (0 = the Boat Kid on the first loop). Past the fifth opponent the roster
 * loops, and each loop raises the difficulty vector: windows 10 percent tighter per loop (floored at 0.55) and the
 * opponent farms more aura on his turns. Loop 0 is LEVELS_V2 as is.
 */
export function rosterLevel(index: number): LevelV2 {
  const n = LEVELS_V2.length;
  const i = Math.max(0, Math.floor(index));
  const loop = Math.floor(i / n);
  const l = LEVELS_V2[i % n];
  if (loop === 0) return l;
  return {
    ...l,
    windowScale: Math.max(0.55, l.windowScale * Math.pow(0.9, loop)),
    opponentAura: Math.min(0.3, (l.opponentAura ?? 0.04) + 0.04 * loop),
  };
}

/** Loop count of a run position (0 on the first pass through the roster). */
export function rosterLoop(index: number): number {
  return Math.floor(Math.max(0, Math.floor(index)) / LEVELS_V2.length);
}

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
    if (a - prev - opponentBeatsIn(l, prev, a) > 8) out.push(`gap of ${a - prev} beats before beat ${a}`);
    if (ev[i - 1].type === "mash" && a - prev < 2) out.push(`input on beat ${a} within 1 beat of the MASH release on ${prev}`);
    prev = b;
  }
  if (l.lengthBeats - prev - opponentBeatsIn(l, prev, l.lengthBeats) > 8) out.push(`dead tail of ${l.lengthBeats - prev} beats`);
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
