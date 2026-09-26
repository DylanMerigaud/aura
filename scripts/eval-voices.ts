// Mechanical gate for every public/voice/v2/*.mp3 line (amendment 10 section 5): duration within
// 1.6 s of the text's expected pace at 150 words a minute, peak over -6 dBFS, leading silence
// trimmed under 80 ms, no clipping. A failing line is fixed in place with ffmpeg (trim, normalize);
// a duration miss regenerates the line through Gradium (at most twice, credits are not free).
// Every check writes a row to evals/ledger.jsonl. Run with: node_modules/.bin/tsx scripts/eval-voices.ts

import { execFileSync, spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { collectJobs, fetchAudio, readApiKey, transcodeToMp3, VOICE_DIR, type RenderJob } from "./gen-voices-v2.js";
import type { Cast } from "./gen-cast.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const CAST_PATH = path.join(ROOT, "src/v2/cast.json");
const LEDGER_PATH = path.join(ROOT, "evals/ledger.jsonl");
const TMP_DIR = path.join(ROOT, ".cache/eval-voices-tmp");

const DASH_RE = new RegExp("[" + String.fromCharCode(0x2014) + String.fromCharCode(0x2013) + "]", "g");
const WORDS_PER_MINUTE = 150;
const DURATION_TOLERANCE_S = 1.6;
const PEAK_FLOOR_DB = -6;
const CLIP_CEILING_DB = -0.1;
const LEADING_SILENCE_MAX_MS = 80;
const TARGET_PEAK_DB = -3; // re-normalize target, safely between the floor and the clip ceiling
const MAX_REGEN = 2;

function stripDashes(s: string): string {
  return s.replace(DASH_RE, ",");
}

function run(cmd: string, args: string[]): string {
  const r = spawnSync(cmd, args, { encoding: "utf8" });
  return `${r.stdout ?? ""}${r.stderr ?? ""}`;
}

function wordCount(s: string): number {
  return s.trim().split(/\s+/).filter(Boolean).length;
}

function ffprobeDuration(file: string): number {
  const out = execFileSync(
    "ffprobe",
    ["-v", "error", "-show_entries", "format=duration", "-of", "default=noprint_wrappers=1:nokey=1", file],
    { encoding: "utf8" },
  );
  return parseFloat(out.trim());
}

function volumeStats(file: string): { max: number; mean: number } {
  const text = run("ffmpeg", ["-i", file, "-af", "volumedetect", "-f", "null", "-"]);
  const maxM = text.match(/max_volume:\s*(-?\d+(?:\.\d+)?)\s*dB/);
  const meanM = text.match(/mean_volume:\s*(-?\d+(?:\.\d+)?)\s*dB/);
  return { max: maxM ? parseFloat(maxM[1]) : -99, mean: meanM ? parseFloat(meanM[1]) : -99 };
}

/** Leading silence length in ms, 0 if the file does not start silent. */
function leadingSilenceMs(file: string): number {
  const text = run("ffmpeg", ["-i", file, "-af", "silencedetect=noise=-50dB:duration=0.02", "-f", "null", "-"]);
  const starts = [...text.matchAll(/silence_start:\s*(-?\d+(?:\.\d+)?)/g)];
  const durs = [...text.matchAll(/silence_duration:\s*(-?\d+(?:\.\d+)?)/g)];
  if (starts.length === 0) return 0;
  if (parseFloat(starts[0][1]) > 0.005) return 0;
  return durs.length > 0 ? parseFloat(durs[0][1]) * 1000 : 0;
}

interface Measurement {
  duration: number;
  expected: number;
  durationOk: boolean;
  peakDb: number;
  peakOk: boolean;
  clippingOk: boolean;
  silenceMs: number;
  silenceOk: boolean;
}

function measure(file: string, text: string): Measurement {
  const duration = ffprobeDuration(file);
  const expected = (wordCount(text) / WORDS_PER_MINUTE) * 60;
  const { max } = volumeStats(file);
  const silenceMs = leadingSilenceMs(file);
  return {
    duration,
    expected,
    durationOk: Math.abs(duration - expected) <= DURATION_TOLERANCE_S,
    peakDb: max,
    peakOk: max >= PEAK_FLOOR_DB,
    clippingOk: max <= CLIP_CEILING_DB,
    silenceMs,
    silenceOk: silenceMs < LEADING_SILENCE_MAX_MS,
  };
}

/** Trims leading silence and/or renormalizes the peak, in place, when either check fails. */
function fixAudioInPlace(file: string, m: Measurement): void {
  const filters: string[] = [];
  if (!m.silenceOk) filters.push("silenceremove=start_periods=1:start_duration=0:start_threshold=-50dB");
  if (!m.peakOk || !m.clippingOk) filters.push(`volume=${(TARGET_PEAK_DB - m.peakDb).toFixed(2)}dB`);
  if (filters.length === 0) return;
  const tmp = `${file}.fix.mp3`;
  execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-i", file, "-af", filters.join(","), "-ac", "1", "-b:a", "64k", tmp]);
  renameSync(tmp, file);
}

function evidenceFor(m: Measurement): string {
  return (
    `duration ${m.duration.toFixed(2)}s vs expected ${m.expected.toFixed(2)}s (${m.durationOk ? "ok" : "fail"}), ` +
    `peak ${m.peakDb.toFixed(1)}dBFS (${m.peakOk ? "ok" : "too quiet"}, ${m.clippingOk ? "no clipping" : "CLIPPING"}), ` +
    `leading silence ${m.silenceMs.toFixed(0)}ms (${m.silenceOk ? "ok" : "fail"})`
  );
}

async function evalLine(job: RenderJob, apiKey: string): Promise<{ verdict: "pass" | "fail"; score: number; evidence: string }> {
  const filePath = path.join(VOICE_DIR, `${job.lineId}.mp3`);
  let m = measure(filePath, job.text);
  let regenAttempts = 0;

  for (;;) {
    if (!m.peakOk || !m.clippingOk || !m.silenceOk) {
      fixAudioInPlace(filePath, m);
      m = measure(filePath, job.text);
    }
    if (m.durationOk || regenAttempts >= MAX_REGEN) break;
    regenAttempts++;
    console.log(`${job.lineId}: duration ${m.duration.toFixed(2)}s vs ${m.expected.toFixed(2)}s, regenerating (try ${regenAttempts}).`);
    const audio = await fetchAudio(apiKey, job);
    const oggTmp = path.join(TMP_DIR, `${job.lineId}.ogg`);
    writeFileSync(oggTmp, audio);
    transcodeToMp3(oggTmp, filePath);
    m = measure(filePath, job.text);
  }

  const checks = [m.durationOk, m.peakOk, m.clippingOk, m.silenceOk];
  const score = checks.filter(Boolean).length;
  return { verdict: score === 4 ? "pass" : "fail", score, evidence: evidenceFor(m) };
}

function appendLedger(rows: { ts: string; kind: string; id: string; gate: string; verdict: string; score: number; evidence: string }[]): void {
  mkdirSync(path.dirname(LEDGER_PATH), { recursive: true });
  const lines = rows.map((r) => JSON.stringify({ ...r, evidence: stripDashes(r.evidence) }));
  writeFileSync(LEDGER_PATH, lines.map((l) => l + "\n").join(""), { flag: "a" });
}

async function main(): Promise<void> {
  if (!existsSync(VOICE_DIR)) throw new Error(`${VOICE_DIR} does not exist, run gen-voices-v2.ts first.`);
  mkdirSync(TMP_DIR, { recursive: true });

  const cast: Cast = JSON.parse(readFileSync(CAST_PATH, "utf8"));
  const jobs = collectJobs(cast);
  const apiKey = readApiKey();

  let passCount = 0;
  for (const job of jobs) {
    const filePath = path.join(VOICE_DIR, `${job.lineId}.mp3`);
    if (!existsSync(filePath)) {
      console.log(`${job.lineId}: missing file, skipped (run gen-voices-v2.ts).`);
      continue;
    }
    const result = await evalLine(job, apiKey);
    if (result.verdict === "pass") passCount++;
    appendLedger([{ ts: new Date().toISOString(), kind: "voice", id: job.lineId, gate: "mechanical", ...result }]);
    console.log(`${job.lineId}: ${result.verdict} (${result.score}/4) ${result.evidence}`);
  }

  console.log(`\n${passCount}/${jobs.length} voice lines pass the mechanical gate.`);
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : String(err));
  process.exit(1);
});
