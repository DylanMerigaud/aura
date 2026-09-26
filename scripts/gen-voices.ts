// Renders campaign taunt and announcer lines to public/voice/*.mp3 via the Gradium TTS REST API, cached by hash of (voice, text) in .cache/gradium, then writes public/voice/index.json.

import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  statSync,
  unlinkSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { Campaign, Level } from "../src/qte/types.ts";
import { lineId } from "../src/qte/types.ts";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const CAMPAIGN_PATH = path.join(ROOT, "src/campaign.json");
const VOICE_DIR = path.join(ROOT, "public/voice");
const CACHE_DIR = path.join(ROOT, ".cache/gradium");
const INDEX_PATH = path.join(VOICE_DIR, "index.json");

const FORCE = process.argv.includes("--force");
// Brief allows up to 3, but this Gradium plan enforces a 2 concurrent session cap (probed live:
// a third in-flight request gets 400 "Concurrency limit exceeded: 2 active sessions"), so 3
// would just spend calls on retries. Kept as its own constant in case the plan tier changes.
const CONCURRENCY = 2;

// REST TTS endpoint (docs.gradium.ai/api-reference/endpoint/tts-post), preferred over the
// wss://api.gradium.ai/api/speech/tts WebSocket since every line here is a finished text block,
// not a token stream. Auth header is x-api-key. Gradium has no mp3 output format; opus (Ogg
// Opus, audio/ogg) is the smallest supported format, so we request it directly and never need
// the wav-to-mp3 afconvert/ffmpeg fallback the brief allows for.
const TTS_ENDPOINT = "https://api.gradium.ai/api/post/speech/tts";
const OUTPUT_FORMAT = "opus";
const EXT = "ogg";

interface Voice {
  name: string;
  id: string;
}

// Hype announcer voice, shared across every level's intro/win/lose line.
const ANNOUNCER_VOICE: Voice = { name: "Marcus", id: "r2sIQdqqoqgRJuXw" };

// Deep, hype voice reserved for the final boss (level 5 of the 5-level campaign).
const BOSS_VOICE: Voice = { name: "Garrett", id: "POBHtemksfWQbng0" };
const BOSS_LEVEL_ID = 5;

// Distinct opponent voices for the non-boss levels, picked by (level.id - 1) modulo length.
const OPPONENT_VOICES: Voice[] = [
  { name: "Sterling", id: "6MFfc37kq0sBjBjy" },
  { name: "Reuben", id: "CF0NgaMwHMMrHZn0" },
  { name: "Maeve", id: "6PWnV0Nq4wu7RVBT" },
  { name: "Freya", id: "GgfEkEJtxZR7gnpy" },
];

function opponentVoiceFor(level: Level): Voice {
  if (level.id === BOSS_LEVEL_ID) return BOSS_VOICE;
  return OPPONENT_VOICES[(level.id - 1) % OPPONENT_VOICES.length];
}

function readApiKey(): string {
  const key = execFileSync("security", [
    "find-generic-password",
    "-s",
    "gradium-api-key",
    "-a",
    "dylanmerigaud",
    "-w",
  ])
    .toString()
    .trim();
  console.log(`Gradium API key loaded (${key.length} chars).`);
  return key;
}

interface RenderJob {
  lineId: string;
  text: string;
  voice: Voice;
}

function collectJobs(campaign: Campaign): RenderJob[] {
  const jobs: RenderJob[] = [];
  for (const level of campaign.levels) {
    const voice = opponentVoiceFor(level);
    level.taunts.forEach((taunt, i) => {
      jobs.push({ lineId: lineId.taunt(level.id, i), text: taunt.text, voice });
    });
    jobs.push({ lineId: lineId.intro(level.id), text: level.announcer.intro, voice: ANNOUNCER_VOICE });
    jobs.push({ lineId: lineId.win(level.id), text: level.announcer.win, voice: ANNOUNCER_VOICE });
    jobs.push({ lineId: lineId.lose(level.id), text: level.announcer.lose, voice: ANNOUNCER_VOICE });
  }
  return jobs;
}

function hashFor(voice: Voice, text: string): string {
  return createHash("sha256").update(`${voice.id}::${text}`).digest("hex").slice(0, 24);
}

async function fetchAudio(apiKey: string, job: RenderJob): Promise<Buffer> {
  const res = await fetch(TTS_ENDPOINT, {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text: job.text,
      voice_id: job.voice.id,
      output_format: OUTPUT_FORMAT,
      only_audio: true,
    }),
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

  const campaign: Campaign = JSON.parse(readFileSync(CAMPAIGN_PATH, "utf8"));
  const jobs = collectJobs(campaign);
  const apiKey = readApiKey();

  console.log(
    `Rendering ${jobs.length} lines across ${campaign.levels.length} level(s) (force=${FORCE}), concurrency ${CONCURRENCY}.`,
  );

  const index: Record<string, string> = {};
  let rendered = 0;
  let cached = 0;
  let failed = 0;

  await runPool(jobs, CONCURRENCY, async (job) => {
    const hash = hashFor(job.voice, job.text);
    const cachePath = path.join(CACHE_DIR, `${hash}.${EXT}`);
    // Gradium returns Ogg Opus; the game ships MP3 because Safari decodes it everywhere.
    const outPath = path.join(VOICE_DIR, `${job.lineId}.mp3`);
    const fileName = `${job.lineId}.mp3`;
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

  // Stale files: anything in public/voice not produced by this run (a lineId whose text or
  // voice changed gets a new file under the same name via the write above; this sweep only
  // catches files left over from a lineId that no longer exists in the campaign).
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
    `Done. rendered=${rendered} cached=${cached} failed=${failed} files=${Object.keys(index).length} total_size=${(
      totalBytes / 1024
    ).toFixed(1)}KB`,
  );
  if (failed > 0) process.exitCode = 1;
}

main();
