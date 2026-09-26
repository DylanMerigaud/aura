// Pacing gate: every chart on disk (see loadCharts in scripts/eval-lib.ts) against the mechanical pacing rules,
// one ledger row per chart and gate, kind "pacing". Thresholds and their reasons: docs/evals.md.
// Run: npx tsx scripts/eval-pacing.ts [--chart file.json] [--dry]. Exit 1 on any fail or error.
import {
  beatsToSeconds,
  check,
  finish,
  isMain,
  lengthBeats,
  loadCharts,
  parseCli,
  slotEnd,
  sortedSlots,
  trackDrops,
  wordCount,
  type Chart,
  type Check,
  type Slot,
  type TrackDrops,
} from "./eval-lib";

export const PACING = {
  /** First QTE within 2 bars of beat 0. */
  firstQteMaxBeat: 8,
  /** Longest span with no QTE outside a declared breakdown: 2 bars. */
  maxDeadBeats: 8,
  /** After a MASH release or a COMBO end the next input waits this many beats (the beat after stays empty). */
  minRestBeats: 2,
  levelSeconds: [35, 50] as [number, number],
  maxCountInBeats: 4,
  /** The 69 charge window. */
  mashBeats: [2, 8] as [number, number],
  /** A MASH release lands on a measured drop of its track within this many seconds. */
  dropToleranceS: 0.12,
  text: {
    storyMax: 8,
    tauntMax: 5,
    roastMax: 12,
    announcer: [1, 4] as [number, number],
    /** Total on screen words per level, strictly under. */
    totalUnder: 40,
  },
};

const fmt = (x: number) => +x.toFixed(3);
const open = (s: Slot) => s.type !== "hit" && s.dur > 0;

/** Pairs of slots whose input windows [b, b + dur] touch or cross. */
export function overlaps(slots: Slot[]): [Slot, Slot][] {
  const out: [Slot, Slot][] = [];
  const s = [...slots].sort((a, b) => a.b - b.b);
  for (let i = 0; i < s.length; i++) for (let j = i + 1; j < s.length && s[j].b <= slotEnd(s[i]); j++) out.push([s[i], s[j]]);
  return out;
}

/** Longest spans with no QTE window, no declared breakdown and no opponent move, from the first QTE to the end of the level. */
export function deadSpans(c: Chart): { from: number; to: number; beats: number }[] {
  const slots = sortedSlots(c);
  if (!slots.length) return [];
  const covered: [number, number][] = [
    ...slots.map((s) => [s.b, slotEnd(s)] as [number, number]),
    ...(c.breakdowns ?? []).map(([a, b]) => [a, b] as [number, number]),
    ...(c.opponentMoves ?? []).map(([a, b]) => [a, b] as [number, number]),
  ].sort((a, b) => a[0] - b[0]);
  const out: { from: number; to: number; beats: number }[] = [];
  let reach = slots[0].b;
  for (const [a, b] of covered) {
    if (b < reach) continue;
    if (a > reach) out.push({ from: reach, to: a, beats: a - reach });
    reach = Math.max(reach, b);
  }
  const end = lengthBeats(c);
  if (end > reach) out.push({ from: reach, to: end, beats: end - reach });
  return out;
}

export function pacingChecks(c: Chart, drops?: TrackDrops): Check[] {
  const out: Check[] = [];
  const id = c.id;
  const slots = sortedSlots(c);
  const where = (s: Slot) => `${s.type}@${s.b}${s.dur ? `+${s.dur}` : ""}`;

  if (!slots.length) return [check(id, "first_qte", false, { note: "chart has no slots" })];

  const ov = overlaps(slots);
  out.push(check(id, "no_overlap", ov.length === 0, {
    note: ov.length ? ov.map(([a, b]) => `${where(a)} x ${where(b)}`).join(", ") : `${slots.length} windows, none touch`,
    overlaps: ov.map(([a, b]) => [where(a), where(b)]),
  }));

  const arrowsInOpen = ov.filter(([a, b]) => (open(a) && (b.type === "hit" || b.type === "combo")) || (open(b) && (a.type === "hit" || a.type === "combo")));
  out.push(check(id, "no_arrow_in_open", arrowsInOpen.length === 0, {
    note: arrowsInOpen.length ? arrowsInOpen.map(([a, b]) => `${where(a)} x ${where(b)}`).join(", ") : "no arrow while a MASH, HOLD or COMBO is open",
    conflicts: arrowsInOpen.map(([a, b]) => [where(a), where(b)]),
  }));

  const rests: { after: string; next: string; gap: number }[] = [];
  for (const s of slots.filter((x) => x.type === "mash" || x.type === "combo")) {
    // The next input after this one opened; a negative gap means it starts before the release.
    const next = slots.find((x) => x !== s && x.b > s.b);
    if (next) rests.push({ after: where(s), next: where(next), gap: next.b - slotEnd(s) });
  }
  const shortRests = rests.filter((r) => r.gap < PACING.minRestBeats);
  if (rests.length) {
    out.push(check(id, "rest_after_release", shortRests.length === 0, {
      note: shortRests.length
        ? shortRests.map((r) => `${r.next} only ${r.gap} beat(s) after ${r.after}`).join(", ")
        : `min gap ${Math.min(...rests.map((r) => r.gap))} beats after ${rests.length} release(s)`,
      rests,
      minBeats: PACING.minRestBeats,
    }, (rests.length - shortRests.length) / rests.length));
  }

  const first = slots[0].b;
  out.push(check(id, "first_qte", first <= PACING.firstQteMaxBeat, {
    note: `first QTE on beat ${first} (${fmt(beatsToSeconds(first, c.bpm))} s), max ${PACING.firstQteMaxBeat}`,
    firstBeat: first,
    maxBeat: PACING.firstQteMaxBeat,
  }));

  const dead = deadSpans(c);
  const worst = dead.reduce((m, d) => (d.beats > m ? d.beats : m), 0);
  const tooLong = dead.filter((d) => d.beats > PACING.maxDeadBeats);
  out.push(check(id, "dead_span", tooLong.length === 0, {
    note: tooLong.length
      ? tooLong.map((d) => `${d.beats} beats from ${d.from} to ${d.to}`).join(", ")
      : `longest span without a QTE ${worst} beats (max ${PACING.maxDeadBeats})`,
    longestBeats: worst,
    spans: tooLong,
    breakdowns: c.breakdowns ?? [],
  }));

  const secs = beatsToSeconds(lengthBeats(c), c.bpm);
  const [lo, hi] = PACING.levelSeconds;
  out.push(check(id, "level_length", secs >= lo && secs <= hi, {
    note: `${fmt(secs)} s (${lengthBeats(c)} beats at ${c.bpm} BPM), range ${lo} to ${hi} s`,
    seconds: fmt(secs),
  }));

  if (c.countInBeats !== undefined) {
    out.push(check(id, "count_in", c.countInBeats <= PACING.maxCountInBeats, {
      note: `${c.countInBeats} count in beats, max ${PACING.maxCountInBeats}`,
      countInBeats: c.countInBeats,
    }));
  }

  out.push(...textChecks(c));

  const mashes = slots.filter((s) => s.type === "mash");
  if (mashes.length) {
    const [mlo, mhi] = PACING.mashBeats;
    const bad = mashes.filter((m) => m.dur < mlo || m.dur > mhi);
    out.push(check(id, "mash_length", bad.length === 0, {
      note: mashes.map((m) => `${where(m)} = ${m.dur} beats`).join(", ") + `, range ${mlo} to ${mhi}`,
      mashes: mashes.map((m) => ({ b: m.b, beats: m.dur })),
    }, (mashes.length - bad.length) / mashes.length));

    if (c.track && drops) {
      const declared = (c.dropBeats ?? []).map((b) => ({ t: drops.firstBeatS + beatsToSeconds(b, c.bpm), from: "chart dropBeats" }));
      const all = [...drops.drops, ...declared];
      const releases = mashes.map((m) => {
        const t = drops.firstBeatS + beatsToSeconds(slotEnd(m), c.bpm);
        const near = all.reduce<{ t: number; from: string } | null>((best, d) => (!best || Math.abs(d.t - t) < Math.abs(best.t - t) ? d : best), null);
        return { release: where(m), releaseS: fmt(t), nearestDropS: near ? fmt(near.t) : null, from: near?.from ?? null, deltaMs: near ? Math.round(Math.abs(near.t - t) * 1000) : null };
      });
      const off = releases.filter((r) => r.deltaMs === null || r.deltaMs > PACING.dropToleranceS * 1000);
      out.push(check(id, "release_on_drop", off.length === 0, {
        note: releases.map((r) => `release ${r.releaseS} s, drop ${r.nearestDropS ?? "none"} s, ${r.deltaMs ?? "n/a"} ms`).join("; ") + ` (max ${PACING.dropToleranceS * 1000} ms)`,
        track: drops.file,
        releases,
      }, (releases.length - off.length) / releases.length));
    }
  }
  return out;
}

export function textChecks(c: Chart): Check[] {
  const t = c.text;
  if (!t) return [];
  const out: Check[] = [];
  const T = PACING.text;
  const id = c.id;
  let total = 0;
  const counted: Record<string, number> = {};

  if (t.story?.length) {
    const n = t.story.reduce((s, line) => s + wordCount(line), 0);
    total += n;
    counted.story = n;
    out.push(check(id, "text_story", n <= T.storyMax, { note: `story card ${n} words, max ${T.storyMax}`, words: n, text: t.story }));
  }
  const each = (gate: string, lines: string[] | undefined, ok: (n: number) => boolean, range: string, key: string, sum: "all" | "max") => {
    if (!lines?.length) return;
    const counts = lines.map(wordCount);
    const bad = counts.filter((n) => !ok(n)).length;
    const n = sum === "all" ? counts.reduce((a, b) => a + b, 0) : Math.max(...counts);
    total += n;
    counted[key] = n;
    out.push(check(id, gate, bad === 0, {
      note: `${lines.length} line(s) of ${counts.join(", ")} words, ${range}`,
      words: counts,
      text: lines,
    }, (lines.length - bad) / lines.length));
  };
  each("text_taunts", t.taunts, (n) => n <= T.tauntMax, `max ${T.tauntMax} each`, "taunts", "all");
  // Only one roast line shows per play: the longest one counts toward the total.
  each("text_roast", t.roast, (n) => n <= T.roastMax, `max ${T.roastMax} each`, "roast", "max");
  each("text_announcer", t.announcer, (n) => n >= T.announcer[0] && n <= T.announcer[1], `${T.announcer[0]} to ${T.announcer[1]} each`, "announcer", "all");

  if (Object.keys(counted).length) {
    out.push(check(id, "text_total", total < T.totalUnder, {
      note: `${total} words on screen (${Object.entries(counted).map(([k, v]) => `${k} ${v}`).join(", ")}), under ${T.totalUnder}`,
      words: total,
      parts: counted,
    }));
  }
  return out;
}

export async function runPacing(extraCharts: string[] = []): Promise<Check[]> {
  const { charts, errors } = await loadCharts(extraCharts);
  const out: Check[] = errors.map((e) => ({ id: e.id, gate: "load", verdict: "error" as const, score: 0, evidence: { note: e.message } }));
  if (!charts.length && !errors.length) out.push({ id: "charts", gate: "load", verdict: "error", score: 0, evidence: { note: "no chart found on disk" } });
  for (const c of charts) out.push(...pacingChecks(c, c.track ? trackDrops(c.track) : undefined));
  return out;
}

if (isMain(import.meta.url)) {
  const cli = parseCli();
  const checks = await runPacing(cli.charts);
  process.exit(finish("pacing", "PACING", checks, cli));
}
