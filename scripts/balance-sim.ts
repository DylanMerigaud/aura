// Headless balance simulation: plays every v2 chart through the real BattleCore (src/v2/core.ts, the QTE runner
// and judge in src/qte/) with four seeded bots, 500 runs each, and reports score, win rate, accuracy, best combo
// and the end of battle aura meter per chart and bot. Writes docs/balance.md and prints the same table.
// Run with `pnpm balance`. Pure: no DOM, no audio, no network, no keys.
import { writeFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
import type { Dir, QteEvent } from "../src/qte/types";
import { BattleCore } from "../src/v2/core";
import { tierOf, type LevelV2, type Stats, type TrackInfo } from "../src/v2/contracts";
import { LEVELS_V2 } from "../src/v2/levels";
import { trackInfo } from "../src/v2/tracks";

/** Per level timing window scale used by the battle screen (src/v2/ui/app.ts WINDOW_SCALE, by campaign index). */
export const WINDOW_SCALE = [1, 0.9, 0.8, 0.7, 0.6];
/** Simulation step in seconds (120 Hz frame loop). */
export const STEP = 1 / 120;
export const RUNS = 500;

export interface Bot {
  name: string;
  /** Gaussian timing error, seconds (0 = exact). */
  sigma: number;
  /** Chance an event is skipped entirely. */
  lapse: number;
  /** MASH alternations per second. */
  mashHz: number;
  /** Random key presses per second; a masher ignores the chart. */
  randomHz?: number;
}

export const BOTS: Bot[] = [
  { name: "perfect", sigma: 0, lapse: 0, mashHz: 12 },
  { name: "good", sigma: 0.04, lapse: 0.03, mashHz: 9 },
  { name: "average", sigma: 0.07, lapse: 0.08, mashHz: 8 },
  { name: "masher", sigma: 0, lapse: 0, mashHz: 0, randomHz: 10 },
];

/** Thresholds of the balance flags. */
export const FLAGS = { averageWinMin: 0.35, averageWinMax: 0.85, masherWinMax: 0.1, perfectStars: 3 as const };

export type SimInput = { kind: "dir"; dir: Dir; t: number } | { kind: "space"; down: boolean; t: number } | { kind: "tap"; down: boolean; t: number };

/** mulberry32, the same family as the chart generator, so every bot is reproducible under a seed. */
export function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Standard normal from two uniforms (Box-Muller). */
export function gaussian(r: () => number): number {
  const u = 1 - r();
  const v = r();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

const DIRS: Dir[] = ["up", "down", "left", "right"];

function seedFor(level: LevelV2, bot: Bot, run: number): number {
  let h = (level.seed ^ (run * 2654435761)) >>> 0;
  for (const ch of bot.name) h = Math.imul(h ^ ch.charCodeAt(0), 16777619) >>> 0;
  return h;
}

/** Song seconds the battle lasts: the core ends one beat past lengthBeats. */
function endTime(level: LevelV2): number {
  return ((level.lengthBeats + 2) * 60) / level.bpm;
}

/** The inputs a bot would produce on a chart, sorted by song time. */
export function planInputs(level: LevelV2, bot: Bot, seed: number): SimInput[] {
  const r = rng(seed);
  const spb = 60 / level.bpm;
  const out: SimInput[] = [];
  if (bot.randomHz) {
    const gap = 1 / bot.randomHz;
    let space = false;
    for (let t = 0; t < endTime(level); t += gap) {
      const roll = Math.floor(r() * 5);
      if (roll < 4) out.push({ kind: "dir", dir: DIRS[roll], t });
      else {
        space = !space;
        out.push({ kind: "space", down: space, t });
      }
    }
    return out;
  }
  const err = () => (bot.sigma > 0 ? gaussian(r) * bot.sigma : 0);
  for (const ev of level.events) {
    if (bot.lapse > 0 && r() < bot.lapse) continue;
    const T = ev.beat * spb;
    // A TAP note (v2) takes a tap, an arrow a swipe in its direction.
    if (ev.type === "hit") out.push(ev.tap ? { kind: "tap", down: true, t: T + err() } : { kind: "dir", dir: ev.dir, t: T + err() });
    else if (ev.type === "combo") {
      ev.dirs.forEach((dir, i) => out.push({ kind: "dir", dir, t: T - (ev.dirs.length - 1 - i) * spb + err() }));
    } else if (ev.type === "hold") {
      out.push({ kind: "space", down: true, t: T + err() });
      out.push({ kind: "space", down: false, t: T + ev.length * spb + err() });
    } else {
      const R = T + ev.length * spb;
      const gap = 1 / Math.max(1, bot.mashHz);
      let side: Dir = "left";
      for (let t = T + err() * 0.5; t < R - gap / 2; t += gap) {
        out.push({ kind: "dir", dir: side, t: Math.max(T - 0.2, t) });
        side = side === "left" ? "right" : "left";
      }
      out.push({ kind: "space", down: true, t: R + err() });
      out.push({ kind: "space", down: false, t: R + err() + 0.1 });
    }
  }
  return out.sort((a, b) => a.t - b.t);
}

export interface RunResult extends Stats {
  /** Highest combo flame tier reached during the run. */
  maxTier: 0 | 1 | 2 | 3;
}

/** One battle, stepped at STEP through the real core. */
export function simulateRun(level: LevelV2, bot: Bot, seed: number, info: TrackInfo = trackInfo(level.track), windowScale = level.windowScale): RunResult {
  const core = new BattleCore(level, info, windowScale, () => {});
  const inputs = planInputs(level, bot, seed);
  let i = 0;
  let maxTier: 0 | 1 | 2 | 3 = 0;
  const end = endTime(level);
  for (let t = -1; t <= end && !core.ended; t += STEP) {
    while (i < inputs.length && inputs[i].t <= t) core.input(inputs[i++]);
    core.update(t, STEP);
    const tier = tierOf(core.combo);
    if (tier > maxTier) maxTier = tier;
  }
  return { ...core.stats(), maxTier };
}

export interface MeterBins {
  ko: number;
  lose: number;
  behind: number;
  ahead: number;
  win: number;
  kowin: number;
}

export interface Report {
  chart: string;
  bot: string;
  runs: number;
  medianScore: number;
  winRate: number;
  accuracy: number;
  bestCombo: number;
  medianCombo: number;
  stars: number;
  maxTier: number;
  meter: { min: number; median: number; max: number; bins: MeterBins };
}

export function median(xs: number[]): number {
  if (!xs.length) return 0;
  const s = [...xs].sort((a, b) => a - b);
  const m = s.length >> 1;
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
}

/** Aura meter at the end, binned: KO loss, [-1,-0.5), [-0.5,0], (0,0.5), [0.5,1), KO win. */
export function binMeter(meters: number[], kos: boolean[]): MeterBins {
  const b: MeterBins = { ko: 0, lose: 0, behind: 0, ahead: 0, win: 0, kowin: 0 };
  meters.forEach((m, i) => {
    if (kos[i] && m <= -1) b.ko++;
    else if (kos[i] && m >= 1) b.kowin++;
    else if (m < -0.5) b.lose++;
    else if (m <= 0) b.behind++;
    else if (m < 0.5) b.ahead++;
    else b.win++;
  });
  return b;
}

export function simulateChart(level: LevelV2, bot: Bot, runs = RUNS, windowScale = level.windowScale): Report {
  const info = trackInfo(level.track);
  const results: RunResult[] = [];
  for (let k = 0; k < runs; k++) results.push(simulateRun(level, bot, seedFor(level, bot, k), info, windowScale));
  const meters = results.map((s) => s.meter);
  return {
    chart: `L${level.id} ${level.place}`,
    bot: bot.name,
    runs,
    medianScore: median(results.map((s) => s.score)),
    winRate: results.filter((s) => s.win).length / runs,
    accuracy: results.reduce((a, s) => a + s.accuracy, 0) / runs,
    bestCombo: Math.max(...results.map((s) => s.maxCombo)),
    medianCombo: median(results.map((s) => s.maxCombo)),
    stars: Math.max(...results.map((s) => s.stars)),
    maxTier: Math.max(...results.map((s) => s.maxTier)),
    meter: { min: Math.min(...meters), median: median(meters), max: Math.max(...meters), bins: binMeter(meters, results.map((s) => s.ko)) },
  };
}

/** Balance flags for one chart from its four bot reports. Empty = balanced. */
export function flagChart(reports: Report[]): string[] {
  const by = (name: string) => reports.find((r) => r.bot === name);
  const avg = by("average");
  const masher = by("masher");
  const perfect = by("perfect");
  const out: string[] = [];
  const pct = (x: number) => `${Math.round(x * 100)} percent`;
  if (avg && avg.winRate < FLAGS.averageWinMin) out.push(`too hard: average bot wins ${pct(avg.winRate)} (under ${pct(FLAGS.averageWinMin)})`);
  if (avg && avg.winRate > FLAGS.averageWinMax) out.push(`too easy: average bot wins ${pct(avg.winRate)} (over ${pct(FLAGS.averageWinMax)})`);
  if (masher && masher.winRate > FLAGS.masherWinMax) out.push(`mashable: button masher wins ${pct(masher.winRate)} (over ${pct(FLAGS.masherWinMax)})`);
  if (perfect && perfect.stars < FLAGS.perfectStars) out.push(`no top tier: perfect bot reaches ${perfect.stars} stars, not ${FLAGS.perfectStars}`);
  return out;
}

export interface ChartReport {
  chart: string;
  events: number;
  seconds: number;
  reports: Report[];
  flags: string[];
}

export function simulateAll(levels: LevelV2[] = LEVELS_V2, runs = RUNS, bots = BOTS): ChartReport[] {
  return levels.map((level, idx) => {
    const scale = WINDOW_SCALE[idx] ?? level.windowScale;
    const reports = bots.map((bot) => simulateChart(level, bot, runs, scale));
    return { chart: reports[0]?.chart ?? `L${level.id}`, events: level.events.length, seconds: (level.lengthBeats * 60) / level.bpm, reports, flags: flagChart(reports) };
  });
}

const f2 = (x: number) => x.toFixed(2);
const pct = (x: number) => `${(x * 100).toFixed(1)}%`;

function meterText(m: Report["meter"]): string {
  const b = m.bins;
  return `${f2(m.min)} / ${f2(m.median)} / ${f2(m.max)} [${b.ko} ${b.lose} ${b.behind} ${b.ahead} ${b.win} ${b.kowin}]`;
}

/** Markdown of the whole run: a table per chart, then the flags. */
export function renderMarkdown(charts: ChartReport[], runs = RUNS): string {
  const lines: string[] = [];
  lines.push("# Chart balance");
  lines.push("");
  lines.push(`Generated by \`pnpm balance\` (scripts/balance-sim.ts): ${runs} seeded runs per bot per chart through the real`);
  lines.push("battle core (src/v2/core.ts, the QTE runner and judge in src/qte/). Do not edit by hand, rerun the script.");
  lines.push("");
  lines.push("## Bots");
  lines.push("");
  lines.push("| bot | timing sigma | lapses | mash rate | notes |");
  lines.push("|-----|-------------:|-------:|----------:|-------|");
  for (const b of BOTS) {
    const notes = b.randomHz ? `random key at ${b.randomHz} per second, ignores the chart` : b.sigma === 0 ? "exact timing, every input right" : "Gaussian timing error, skips events at the lapse rate";
    lines.push(`| ${b.name} | ${Math.round(b.sigma * 1000)} ms | ${Math.round(b.lapse * 100)}% | ${b.randomHz ? "-" : `${b.mashHz}/s`} | ${notes} |`);
  }
  lines.push("");
  lines.push("Columns: median score, win rate against the level's opponent pressure (aura meter above 0 at the end), mean");
  lines.push("accuracy (Perfect 1, Great 0.7, Ok 0.3), best combo over all runs (median in parentheses), best star rating and");
  lines.push("best combo flame tier, then the end of battle aura meter as min / median / max and a six bin histogram:");
  lines.push("[KO loss, -1..-0.5, -0.5..0, 0..0.5, 0.5..1, KO win].");
  lines.push("");
  for (const c of charts) {
    lines.push(`## ${c.chart} (${c.events} events, ${c.seconds.toFixed(1)} s)`);
    lines.push("");
    lines.push("| bot | median score | win rate | accuracy | best combo | stars | tier | aura meter min / median / max [bins] |");
    lines.push("|-----|-------------:|---------:|---------:|-----------:|------:|-----:|--------------------------------------|");
    for (const r of c.reports) {
      lines.push(`| ${r.bot} | ${r.medianScore} | ${pct(r.winRate)} | ${pct(r.accuracy)} | ${r.bestCombo} (${r.medianCombo}) | ${r.stars} | ${r.maxTier} | ${meterText(r.meter)} |`);
    }
    lines.push("");
    lines.push(c.flags.length ? `Flags: ${c.flags.map((f) => `**${f}**`).join("; ")}` : "Flags: none, balanced.");
    lines.push("");
  }
  lines.push("## Flag rules");
  lines.push("");
  lines.push(`- too hard: the average bot wins under ${Math.round(FLAGS.averageWinMin * 100)} percent of runs.`);
  lines.push(`- too easy: the average bot wins over ${Math.round(FLAGS.averageWinMax * 100)} percent of runs.`);
  lines.push(`- mashable: the button masher wins over ${Math.round(FLAGS.masherWinMax * 100)} percent of runs.`);
  lines.push(`- no top tier: the perfect bot never reaches ${FLAGS.perfectStars} stars (win, accuracy 0.9 or more, no cringe).`);
  lines.push("");
  const flagged = charts.filter((c) => c.flags.length);
  lines.push(flagged.length ? `Unbalanced charts: ${flagged.map((c) => c.chart).join(", ")}.` : "Unbalanced charts: none.");
  lines.push("");
  return lines.join("\n");
}

export function main(out = "docs/balance.md") {
  const charts = simulateAll();
  const md = renderMarkdown(charts);
  writeFileSync(out, md);
  console.log(md);
  console.log(`Wrote ${out}`);
}

const entry = process.argv[1] ? pathToFileURL(process.argv[1]).href : "";
if (entry && import.meta.url === entry) main();
