// Shared plumbing of the mechanical evals (scripts/eval-pacing.ts, scripts/eval-animation.ts): the chart
// interface both gates read, the loaders that turn whatever is on disk into it, the track analysis lookup,
// the ledger writer, the table printer and the README count line. No DOM, no audio, no three.js.
import { appendFileSync, existsSync, mkdirSync, readFileSync, readdirSync, realpathSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

export const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
export const LEDGER = join(ROOT, "evals", "ledger.jsonl");
export const README = join(ROOT, "README.md");

export type Verdict = "pass" | "fail" | "error";

/** One gate result before it becomes a ledger row. `evidence.note` is the short human reason the table prints. */
export interface Check {
  id: string;
  gate: string;
  verdict: Verdict;
  score: number;
  evidence: Record<string, unknown>;
}

/** The ledger row shape shared by every eval of the repo. */
export interface Row extends Check {
  ts: string;
  kind: string;
}

/*
 * THE CHART INTERFACE. Every pacing and chart based animation check reads this shape, never the game's own
 * types, so a change of the in-game format only needs a new adapter below.
 * - Beats count from beat 0 of the song (the first beat after the count in), on an eighth note grid (b * 2 is
 *   an integer), in the chart's own bpm.
 * - A slot is an input window [b, b + dur]: a HIT has dur 0; a COMBO starts on its first press and ends on its
 *   last (dur = presses - 1 on the quarter grid); a MASH charges from b and releases on b + dur; a HOLD presses
 *   on b and releases on b + dur.
 * - `move` names what the player does: the arrow of a HIT ("up"), the arrows of a COMBO ("left up right").
 */
export type SlotType = "hit" | "combo" | "mash" | "hold";

export interface Slot {
  b: number;
  dur: number;
  type: SlotType;
  move?: string;
}

/** On screen text of a level, by role. Missing roles are not checked. */
export interface ChartText {
  /** The story card, one entry per line of the same card. */
  story?: string[];
  taunts?: string[];
  /** End of level roast lines (only one shows per play). */
  roast?: string[];
  /** Short announcer calls. */
  announcer?: string[];
}

export interface Chart {
  id: string;
  bpm: number;
  /** Level length in 4/4 bars (may be fractional). */
  bars: number;
  slots: Slot[];
  /** Count in clicks before beat 0. */
  countInBeats?: number;
  /** Declared breakdowns in beats, [start, end]. */
  breakdowns?: [number, number][];
  /** Key into assets/music/manifest.json ("level4" for level4.mp3). */
  track?: string;
  text?: ChartText;
  /** Where the chart came from, for the evidence. */
  source?: string;
}

export const BEATS_PER_BAR = 4;

export function slotEnd(s: Slot): number {
  return s.b + s.dur;
}

export function lengthBeats(c: Chart): number {
  return c.bars * BEATS_PER_BAR;
}

export function beatsToSeconds(beats: number, bpm: number): number {
  return (beats * 60) / bpm;
}

/** Words as a reader counts them: whitespace separated tokens holding a letter or a digit. */
export function wordCount(s: string): number {
  return s.split(/\s+/).filter((w) => /[\p{L}\p{N}]/u.test(w)).length;
}

export function sortedSlots(c: Chart): Slot[] {
  return [...c.slots].sort((a, b) => a.b - b.b || slotEnd(a) - slotEnd(b));
}

// ---------------------------------------------------------------------------------------------------------
// Adapters

/** The in-game v2 event shape (src/qte/types.ts QteEvent), restated so this file never imports game code. */
type GameEvent =
  | { type: "hit"; beat: number; dir: string }
  | { type: "mash"; beat: number; length: number }
  | { type: "hold"; beat: number; length: number }
  | { type: "combo"; beat: number; dirs: string[] };

/** The fields of src/v2/contracts.ts LevelV2 the evals read. */
export interface GameLevel {
  id: number;
  bpm: number;
  lengthBeats: number;
  events: GameEvent[];
  track?: string;
  story?: string[];
  taunts?: { beat: number; text: string }[];
  announcer?: { intro?: string; win?: string; lose?: string };
  breakdownBeats?: [number, number][];
}

export function slotFromEvent(e: GameEvent): Slot {
  switch (e.type) {
    case "hit":
      return { b: e.beat, dur: 0, type: "hit", move: e.dir };
    case "combo":
      // The game keys a COMBO on its last press; the window opens dirs.length - 1 beats earlier.
      return { b: e.beat - e.dirs.length + 1, dur: e.dirs.length - 1, type: "combo", move: e.dirs.join(" ") };
    case "mash":
      return { b: e.beat, dur: e.length, type: "mash" };
    case "hold":
      return { b: e.beat, dur: e.length, type: "hold" };
  }
}

/**
 * A v2 level as a Chart. Text mapping: the story card is `story`, taunts are the taunt texts, the roast is the
 * announcer win and lose lines (src/v2/ui/results.ts shows one of them while the live roast loads), the
 * announcer call is the intro line.
 */
export function chartFromLevel(l: GameLevel, prefix = "v2", countInBeats?: number): Chart {
  const roast = [l.announcer?.win, l.announcer?.lose].filter((s): s is string => !!s);
  const announcer = [l.announcer?.intro].filter((s): s is string => !!s);
  return {
    id: `${prefix}-level${l.id}`,
    bpm: l.bpm,
    bars: l.lengthBeats / BEATS_PER_BAR,
    slots: l.events.map(slotFromEvent),
    countInBeats,
    breakdowns: l.breakdownBeats,
    track: l.track,
    text: {
      story: l.story?.filter((s) => s.trim()),
      taunts: l.taunts?.map((t) => t.text),
      roast: roast.length ? roast : undefined,
      announcer: announcer.length ? announcer : undefined,
    },
    source: `src/v2/levels.ts LEVELS_V2[${l.id - 1}]`,
  };
}

/** True when `x` looks like a Chart (the documented interface) rather than any other JSON. */
export function isChartLike(x: unknown): x is Chart {
  if (!x || typeof x !== "object") return false;
  const o = x as Record<string, unknown>;
  return typeof o.bpm === "number" && typeof o.bars === "number" && Array.isArray(o.slots);
}

/** Charts inside a parsed JSON value: the value itself, or the entries of its `charts` or `levels` array. */
export function chartsInJson(value: unknown, source: string): Chart[] {
  const out: Chart[] = [];
  const take = (x: unknown, i: number) => {
    if (!isChartLike(x)) return;
    out.push({ ...x, id: x.id ?? `${source}#${i}`, source });
  };
  if (Array.isArray(value)) value.forEach(take);
  else if (value && typeof value === "object") {
    take(value, 0);
    const o = value as Record<string, unknown>;
    for (const k of ["charts", "levels"]) if (Array.isArray(o[k])) (o[k] as unknown[]).forEach(take);
  }
  return out;
}

function jsonFiles(dir: string, out: string[] = []): string[] {
  if (!existsSync(dir)) return out;
  for (const name of readdirSync(dir)) {
    if (name === "node_modules" || name.startsWith(".")) continue;
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) jsonFiles(p, out);
    else if (name.endsWith(".json") && st.size < 2_000_000) out.push(p);
  }
  return out;
}

/** Count in beats of the v2 battle driver, read from its source (the constant is not exported). */
export function readCountIn(root = ROOT): number | undefined {
  const p = join(root, "src", "v2", "game.ts");
  if (!existsSync(p)) return undefined;
  const m = /const\s+COUNT_IN\s*=\s*(\d+)/.exec(readFileSync(p, "utf8"));
  return m ? Number(m[1]) : undefined;
}

export interface Loaded {
  charts: Chart[];
  /** Sources that exist but could not be read: each becomes an `error` row. */
  errors: { id: string; message: string }[];
}

/**
 * Every chart on disk: the v2 campaign (src/v2/levels.ts LEVELS_V2) when it imports, plus any JSON file under
 * src/ or public/ that holds charts in the documented interface, plus the files passed with --chart. The v1
 * campaign (src/campaign.json, the frozen safety net) is not a chart in this interface and is skipped.
 */
export async function loadCharts(extra: string[] = [], root = ROOT): Promise<Loaded> {
  const charts: Chart[] = [];
  const errors: Loaded["errors"] = [];
  const levelsPath = join(root, "src", "v2", "levels.ts");
  if (existsSync(levelsPath)) {
    try {
      const mod = (await import(pathToFileURL(levelsPath).href)) as { LEVELS_V2?: GameLevel[] };
      if (!Array.isArray(mod.LEVELS_V2)) throw new Error("LEVELS_V2 is not exported as an array");
      const countIn = readCountIn(root);
      for (const l of mod.LEVELS_V2) charts.push(chartFromLevel(l, "v2", countIn));
    } catch (err) {
      errors.push({ id: "src/v2/levels.ts", message: (err as Error).message });
    }
  }
  const files = [...jsonFiles(join(root, "src")), ...jsonFiles(join(root, "public")), ...extra.map((f) => resolve(f))];
  for (const f of files) {
    let parsed: unknown;
    try {
      parsed = JSON.parse(readFileSync(f, "utf8"));
    } catch (err) {
      if (extra.some((e) => resolve(e) === f)) errors.push({ id: relative(root, f), message: (err as Error).message });
      continue;
    }
    charts.push(...chartsInJson(parsed, relative(root, f)));
  }
  return { charts, errors };
}

// ---------------------------------------------------------------------------------------------------------
// Track analysis

export interface TrackDrops {
  file: string;
  firstBeatS: number;
  /** Drop times in track seconds with where each came from. */
  drops: { t: number; from: string }[];
}

type RawDrop = number | [number, number] | { t: number };
const dropTime = (d: RawDrop) => (typeof d === "number" ? d : Array.isArray(d) ? d[0] : d.t);

/**
 * Drops of a track: `drops_s` of assets/music/manifest.json, plus `drops_s` of src/v2/analysis.json (the refined
 * analysis the game grid uses). Undefined when the manifest has no entry for the track.
 */
export function trackDrops(key: string, root = ROOT): TrackDrops | undefined {
  const mPath = join(root, "assets", "music", "manifest.json");
  if (!existsSync(mPath)) return undefined;
  const manifest = JSON.parse(readFileSync(mPath, "utf8")) as { file: string; first_beat_s?: number; drops_s?: RawDrop[] }[];
  const m = manifest.find((e) => e.file === `${key}.mp3`);
  if (!m) return undefined;
  const drops = (m.drops_s ?? []).map((d) => ({ t: dropTime(d), from: "assets/music/manifest.json" }));
  const aPath = join(root, "src", "v2", "analysis.json");
  if (existsSync(aPath)) {
    try {
      const a = JSON.parse(readFileSync(aPath, "utf8")) as Record<string, { drops_s?: RawDrop[] }>;
      for (const d of a[key]?.drops_s ?? []) drops.push({ t: dropTime(d), from: "src/v2/analysis.json" });
    } catch {
      // An unreadable analysis leaves the manifest drops, which are the ones the gate names.
    }
  }
  return { file: m.file, firstBeatS: m.first_beat_s ?? 0, drops };
}

// ---------------------------------------------------------------------------------------------------------
// Ledger, table, README

export function check(id: string, gate: string, ok: boolean, evidence: Record<string, unknown>, score?: number): Check {
  return { id, gate, verdict: ok ? "pass" : "fail", score: score ?? (ok ? 1 : 0), evidence };
}

/** Stamps checks as rows of one run (evidence.run = the run start) and appends them to the ledger. */
export function writeRows(kind: string, checks: Check[], run: string, ledger = LEDGER): Row[] {
  const rows: Row[] = checks.map((c) => ({
    ts: new Date().toISOString(),
    kind,
    id: c.id,
    gate: c.gate,
    verdict: c.verdict,
    score: +c.score.toFixed(3),
    evidence: { ...c.evidence, run },
  }));
  mkdirSync(dirname(ledger), { recursive: true });
  appendFileSync(ledger, rows.map((r) => JSON.stringify(r)).join("\n") + (rows.length ? "\n" : ""));
  return rows;
}

export function readLedger(ledger = LEDGER): Row[] {
  if (!existsSync(ledger)) return [];
  return readFileSync(ledger, "utf8")
    .split("\n")
    .filter((l) => l.trim())
    .flatMap((l) => {
      try {
        return [JSON.parse(l) as Row];
      } catch {
        return [];
      }
    });
}

export interface Summary {
  checks: number;
  pass: number;
  fail: number;
  error: number;
  last: string;
}

/**
 * The current state of every check in the ledger. A kind whose rows carry `evidence.run` counts only its
 * latest run (a gate dropped from a script stops counting); any other kind counts the latest row of each
 * (id, gate), so regeneration retries count once, at their final verdict.
 */
export function summarize(rows: Row[]): Summary {
  const byKind = new Map<string, Row[]>();
  for (const r of rows) byKind.set(r.kind, [...(byKind.get(r.kind) ?? []), r]);
  const current: Row[] = [];
  for (const list of byKind.values()) {
    const runs = list.map((r) => r.evidence?.run).filter((x): x is string => typeof x === "string");
    if (runs.length) {
      const last = runs.reduce((a, b) => (a > b ? a : b));
      current.push(...list.filter((r) => r.evidence?.run === last));
    } else {
      const latest = new Map<string, Row>();
      for (const r of list) {
        const k = `${r.id}\u0000${r.gate}`;
        const prev = latest.get(k);
        if (!prev || prev.ts <= r.ts) latest.set(k, r);
      }
      current.push(...latest.values());
    }
  }
  const last = rows.reduce((a, r) => (r.ts > a ? r.ts : a), "");
  return {
    checks: current.length,
    pass: current.filter((r) => r.verdict === "pass").length,
    fail: current.filter((r) => r.verdict === "fail").length,
    error: current.filter((r) => r.verdict === "error").length,
    last,
  };
}

export function countLine(s: Summary): string {
  return `Evals: ${s.checks} checks, ${s.pass} pass, ${s.fail} fail${s.error ? `, ${s.error} error` : ""}, last run ${s.last || "never"}`;
}

/** Overwrites the `Evals: ...` line of the README with the ledger's current counts. False when there is no such line. */
export function updateReadme(readme = README, ledger = LEDGER): boolean {
  if (!existsSync(readme)) return false;
  const text = readFileSync(readme, "utf8");
  const re = /^Evals: .*$/m;
  if (!re.test(text)) return false;
  writeFileSync(readme, text.replace(re, countLine(summarize(readLedger(ledger)))));
  return true;
}

export function printTable(title: string, rows: Check[]): void {
  const cells = rows.map((r) => [r.verdict.toUpperCase(), r.id, r.gate, r.score.toFixed(2), String(r.evidence.note ?? "")]);
  const head = ["VERDICT", "ID", "GATE", "SCORE", "NOTE"];
  const width = head.map((h, i) => Math.max(h.length, ...cells.map((c) => (i === 4 ? 0 : c[i].length))));
  const fmt = (c: string[]) => c.map((x, i) => (i === 4 ? x : x.padEnd(width[i]))).join("  ");
  console.log(`\n${title}`);
  console.log(fmt(head));
  console.log(fmt(width.map((w, i) => "-".repeat(i === 4 ? 4 : w))));
  for (const c of cells) console.log(fmt(c));
  const n = (v: Verdict) => rows.filter((r) => r.verdict === v).length;
  console.log(`${rows.length} checks, ${n("pass")} pass, ${n("fail")} fail, ${n("error")} error`);
}

/** Command line flags shared by both eval scripts. */
export interface Cli {
  /** Extra chart JSON files (--chart path, repeatable). */
  charts: string[];
  /** --dry: print only, no ledger row and no README change. */
  dry: boolean;
  ledger: string;
  readme: string;
}

export function parseCli(argv = process.argv.slice(2)): Cli {
  const cli: Cli = { charts: [], dry: false, ledger: LEDGER, readme: README };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--chart") cli.charts.push(argv[++i]);
    else if (a === "--dry") cli.dry = true;
    else if (a === "--ledger") cli.ledger = resolve(argv[++i]);
    else if (a === "--readme") cli.readme = resolve(argv[++i]);
  }
  return cli;
}

/** True when the module at `url` is the script node was started with (symlinks resolved on both sides). */
export function isMain(url: string): boolean {
  if (!process.argv[1]) return false;
  try {
    return realpathSync(resolve(process.argv[1])) === realpathSync(fileURLToPath(url));
  } catch {
    return false;
  }
}

/** Writes the rows (unless --dry), refreshes the README line, prints the table; returns the exit code. */
export function finish(kind: string, title: string, checks: Check[], cli: Cli): number {
  const run = new Date().toISOString();
  printTable(title, checks);
  if (!cli.dry) {
    writeRows(kind, checks, run, cli.ledger);
    if (updateReadme(cli.readme, cli.ledger)) console.log(countLine(summarize(readLedger(cli.ledger))));
  }
  return checks.some((c) => c.verdict !== "pass") ? 1 : 0;
}
