// Renders every Gen Z SFX slot (src/sfx/recipes.ts) offline with node-web-audio-api to
// public/sfx-preview/<slot>.wav, mono 48 kHz 16 bit, peak normalized to -1 dBFS, for the review board.
// Also writes mashCharge-run.wav (twelve calls stepping 0 to 1 on 16ths) so the escalation can be heard.
// Prints per slot: scheduled duration, raw peak, DC offset and the longest silence inside the sound.
// Run: pnpm sfx:render (or npx tsx scripts/render-sfx.ts [--bpm 120] [--seed 7]).
import { OfflineAudioContext } from "node-web-audio-api";
import { mkdirSync, writeFileSync } from "node:fs";
import { SLOTS, SLOT_NAMES, mashCharge } from "../src/sfx/recipes";
import { audibleSpan, dcOffset, encodeWav16, normalize, peak, toDb } from "../src/sfx/analyze";

const SR = 48000;
const OUT = "public/sfx-preview";
const arg = (name: string, fallback: number) => {
  const i = process.argv.indexOf(`--${name}`);
  return i > 0 ? Number(process.argv[i + 1]) : fallback;
};
const bpm = arg("bpm", 120);
const seed = arg("seed", 7);

/** Render into a buffer long enough for the slot's max duration, then trim to the scheduled duration. */
async function render(draw: (ctx: BaseAudioContext) => number, maxSec: number) {
  const ctx = new OfflineAudioContext(1, Math.ceil((maxSec + 0.5) * SR), SR);
  const duration = draw(ctx);
  const buf = await ctx.startRendering();
  const full = buf.getChannelData(0);
  return { duration, x: full.slice(0, Math.min(full.length, Math.ceil((duration + 0.01) * SR))) };
}

function writeWav(name: string, x: Float32Array) {
  const y = normalize(x, -1);
  const fade = Math.min(y.length, Math.round(0.003 * SR));
  for (let i = 0; i < fade; i++) y[y.length - 1 - i] *= i / fade;
  writeFileSync(`${OUT}/${name}.wav`, encodeWav16(y, SR));
}

mkdirSync(OUT, { recursive: true });
const rows: string[][] = [["slot", "duration s", "raw peak dBFS", "dc", "longest gap ms"]];
for (const slot of SLOT_NAMES) {
  const spec = SLOTS[slot];
  const [, max] = spec.duration(bpm);
  const { duration, x } = await render((ctx) => spec.recipe(ctx, ctx.destination, { bpm, seed, step: 0.5 }), max);
  const span = audibleSpan(x, SR);
  rows.push([
    slot,
    duration.toFixed(3),
    toDb(peak(x)).toFixed(1),
    dcOffset(normalize(x, -1)).toFixed(4),
    (span.longestGap * 1000).toFixed(0),
  ]);
  writeWav(slot, x);
}

// The mash run: twelve steps on 16ths so the per call pitch climb is audible in one file.
const sixteenth = 60 / bpm / 4;
const run = await render((ctx) => {
  let end = 0;
  for (let i = 0; i < 12; i++) {
    const at = i * sixteenth;
    end = at + mashCharge(ctx, ctx.destination, { bpm, seed: seed + i, step: i / 11, at });
  }
  return end;
}, 12 * sixteenth + 0.3);
writeWav("mashCharge-run", run.x);

const widths = rows[0].map((_, c) => Math.max(...rows.map((r) => r[c].length)));
for (const r of rows) console.log(r.map((cell, c) => (c === 0 ? cell.padEnd(widths[c]) : cell.padStart(widths[c]))).join("  "));
console.log(`\nwrote ${SLOT_NAMES.length + 1} files to ${OUT}/ (bpm ${bpm}, seed ${seed}, mono ${SR} Hz, peak -1 dBFS)`);
