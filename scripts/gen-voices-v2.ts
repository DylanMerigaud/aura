// Renders src/v2/cast.json taunt and announcer lines to public/voice/v2/*.mp3 via the Gradium TTS
// REST API (same endpoint and voices as v1's scripts/gen-voices.ts), cached by hash of (voice, text)
// in .cache/gradium-v2, then writes public/voice/v2/index.json. Run with:
// node_modules/.bin/tsx scripts/gen-voices-v2.ts (add --force to bypass the cache).

import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, unlinkSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { Cast, CastLevel } from "./gen-cast.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const CAST_PATH = path.join(ROOT, "src/v2/cast.json");
export const VOICE_DIR = path.join(ROOT, "public/voice/v2");
const CACHE_DIR = path.join(ROOT, ".cache/gradium-v2");
const INDEX_PATH = path.join(VOICE_DIR, "index.json");

const FORCE = process.argv.includes("--force");
// Same 2 concurrent session cap measured live for v1 (scripts/gen-voices.ts): a third in-flight
// request gets 400 "Concurrency limit exceeded: 2 active sessions".
const CONCURRENCY = 2;

const TTS_ENDPOINT = "https://api.gradium.ai/api/post/speech/tts";
const OUTPUT_FORMAT = "opus";
const EXT = "ogg";

export interface Voice {
  name: string;
  id: string;
}

// Same voice set as v1, so the cast keeps a consistent roster across both versions of the game.
const ANNOUNCER_VOICE: Voice = { name: "Marcus", id: "r2sIQdqqoqgRJuXw" };
const BOSS_VOICE: Voice = { name: "Garrett", id: "POBHtemksfWQbng0" };
const BOSS_LEVEL_ID = 5;
const OPPONENT_VOICES: Voice[] = [
  { name: "Sterling", id: "6MFfc37kq0sBjBjy" },
  { name: "Reuben", id: "CF0NgaMwHMMrHZn0" },
  { name: "Maeve", id: "6PWnV0Nq4wu7RVBT" },
  { name: "Freya", id: "GgfEkEJtxZR7gnpy" },
];

function opponentVoiceFor(level: CastLevel): Voice {
  if (level.id === BOSS_LEVEL_ID) return BOSS_VOICE;
  return OPPONENT_VOICES[(level.id - 1) % OPPONENT_VOICES.length];
}

// v2 line id convention (amendment 10 lane brief): v2-l<level>-taunt-<i>, v2-l<level>-intro/win/lose.
export const v2LineId = {
  taunt: (level: number, i: number) => `v2-l${level}-taunt-${i}`,
  intro: (level: number) => `v2-l${level}-intro`,
  win: (level: number) => `v2-l${level}-win`,
  lose: (level: number) => `v2-l${level}-lose`,
};

export function readApiKey(): string {
  const key = execFileSync("security", ["find-generic-password", "-s", "gradium-api-key", "-a", "dylanmerigaud", "-w"])
    .toString()
    .trim();
  console.log(`Gradium API key loaded (${key.length} chars).`);
  return key;
}

export interface RenderJob {
  lineId: string;
  text: string;
  voice: Voice;
}

export function collectJobs(cast: Cast): RenderJob[] {
  const jobs: RenderJob[] = [];
  for (const level of cast.levels) {
    const voice = opponentVoiceFor(level);
    level.taunts.forEach((taunt, i) => {
      jobs.push({ lineId: v2LineId.taunt(level.id, i), text: taunt, voice });
    });
    jobs.push({ lineId: v2LineId.intro(level.id), text: level.announcer.intro, voice: ANNOUNCER_VOICE });
    jobs.push({ lineId: v2LineId.win(level.id), text: level.announcer.win, voice: ANNOUNCER_VOICE });
    jobs.push({ lineId: v2LineId.lose(level.id), text: level.announcer.lose, voice: ANNOUNCER_VOICE });
  }
  return jobs;
}

function hashFor(voice: Voice, text: string): string {
  return createHash("sha256").update(`${voice.id}::${text}`).digest("hex").slice(0, 24);
}

export async function fetchAudio(apiKey: string, job: RenderJob): Promise<Buffer> {
  const res = await fetch(TTS_ENDPOINT, {
    method: "POST",
    headers: { "x-api-key": apiKey, "Content-Type": "application/json" },
    body: JSON.stringify({ text: job.text, voice_id: job.voice.id, output_format: OUTPUT_FORMAT, only_audio: true }),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Gradium TTS ${res.status} ${res.statusText} for ${job.lineId}: ${body.slice(0, 300)}`);
  }
  return Buffer.from(await res.arrayBuffer());
}

async function runPool<T>(items: T[], limit: number, worker: (item: T) => Promise<void>): Promise<void> {
  let next = 0;
  async function runOne(): Promise<void> {
    for (;;) {
      const i = next++;
      if (i >= items.length) return;
      await worker(items[i]);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, runOne));
}

async function main() {
  mkdirSync(VOICE_DIR, { recursive: true });
  mkdirSync(CACHE_DIR, { recursive: true });

  const cast: Cast = JSON.parse(readFileSync(CAST_PATH, "utf8"));
  const jobs = collectJobs(cast);
  const apiKey = readApiKey();

  console.log(`Rendering ${jobs.length} lines across ${cast.levels.length} level(s) (force=${FORCE}), concurrency ${CONCURRENCY}.`);

  const index: Record<string, string> = {};
  let rendered = 0;
  let cached = 0;
  let failed = 0;

  await runPool(jobs, CONCURRENCY, async (job) => {
    const hash = hashFor(job.voice, job.text);
    const cachePath = path.join(CACHE_DIR, `${hash}.${EXT}`);
    const outPath = path.join(VOICE_DIR, `${job.lineId}.mp3`);
    const fileName = `${job.lineId}.mp3`;
    // Gradium returns Ogg Opus; the game ships MP3 because Safari decodes it everywhere.
    const transcode = () =>
      execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-i", cachePath, "-ac", "1", "-b:a", "64k", outPath]);

    try {
      if (!FORCE && existsSync(cachePath)) {
        transcode();
        index[job.lineId] = fileName;
        cached++;
        console.log(`cache  ${job.lineId} (${job.voice.name})`);
        return;
      }
      const audio = await fetchAudio(apiKey, job);
      writeFileSync(cachePath, audio);
      transcode();
      index[job.lineId] = fileName;
      rendered++;
      console.log(`render ${job.lineId} (${job.voice.name}, ${audio.length} bytes)`);
    } catch (err) {
      failed++;
      console.error(`FAILED ${job.lineId}: ${(err as Error).message}`);
    }
  });

  // Sweep files left over from a lineId no longer in the cast (a level or taunt count that changed).
  const keep = new Set(Object.values(index));
  keep.add("index.json");
  for (const f of readdirSync(VOICE_DIR)) {
    if (!keep.has(f)) {
      unlinkSync(path.join(VOICE_DIR, f));
      console.log(`removed stale ${f}`);
    }
  }

  writeFileSync(INDEX_PATH, `${JSON.stringify(index, null, 1)}\n`);

  const totalBytes = Object.values(index).reduce((sum, f) => {
    try {
      return sum + statSync(path.join(VOICE_DIR, f)).size;
    } catch {
      return sum;
    }
  }, 0);

  console.log(
    `Done. rendered=${rendered} cached=${cached} failed=${failed} files=${Object.keys(index).length} total_size=${(totalBytes / 1024).toFixed(1)}KB`,
  );
  if (failed > 0) process.exitCode = 1;
}

/** Transcodes a Gradium Ogg Opus buffer to the mono 64k mp3 the game ships, in place at outPath. */
export function transcodeToMp3(oggPath: string, outPath: string): void {
  execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-i", oggPath, "-ac", "1", "-b:a", "64k", outPath]);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main();
}
