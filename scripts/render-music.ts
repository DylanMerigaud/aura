// Renders a level's procedural music offline (node-web-audio-api) to .cache/music-l<N>.wav and prints peak and RMS per section.
import { OfflineAudioContext } from "node-web-audio-api";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";

const levelIdx = Number(process.argv[2] ?? 0);
const L = JSON.parse(readFileSync("src/campaign.json", "utf8")).levels[levelIdx];
const spb = 60 / L.bpm;
const dur = (L.lengthBeats + 6) * spb;
const SR = 44100;
(globalThis as any).AudioContext = class extends (OfflineAudioContext as any) {
  constructor() { super(2, Math.ceil(SR * dur), SR); }
};
(globalThis as any).window = globalThis;
const { initAudio } = await import("../src/audio/engine");
const ctx: any = initAudio();
const { Music } = await import("../src/audio/music");
const m: any = new Music(L.bpm, L.seed, L.lengthBeats, L.phase2Beat);
m.t0 = 0.1;
for (let step = 0; step < (L.lengthBeats + 2) * 4; step++) m.play(step, m.t0 + (step * spb) / 4);
const buf = await ctx.startRendering();
const ch = buf.getChannelData(0);
let peak = 0;
for (const v of ch) peak = Math.max(peak, Math.abs(v));
const sec = 8 * spb * 4;
const rows: string[] = [];
for (let s = 0; s < ch.length; s += Math.floor(sec * SR)) {
  let sum = 0, n = 0;
  for (let i = s; i < Math.min(ch.length, s + sec * SR); i++) { sum += ch[i] * ch[i]; n++; }
  rows.push((20 * Math.log10(Math.sqrt(sum / n) + 1e-9)).toFixed(1));
}
console.log(`level ${L.id}: peak ${peak.toFixed(2)} (${(20 * Math.log10(peak)).toFixed(1)} dBFS), RMS dB per 8 bars: ${rows.join(" ")}`);
// 16-bit mono WAV for a listen.
mkdirSync(".cache", { recursive: true });
const pcm = Buffer.alloc(44 + ch.length * 2);
pcm.write("RIFF", 0); pcm.writeUInt32LE(36 + ch.length * 2, 4); pcm.write("WAVEfmt ", 8);
pcm.writeUInt32LE(16, 16); pcm.writeUInt16LE(1, 20); pcm.writeUInt16LE(1, 22); pcm.writeUInt32LE(SR, 24);
pcm.writeUInt32LE(SR * 2, 28); pcm.writeUInt16LE(2, 32); pcm.writeUInt16LE(16, 34); pcm.write("data", 36); pcm.writeUInt32LE(ch.length * 2, 40);
for (let i = 0; i < ch.length; i++) pcm.writeInt16LE(Math.max(-32768, Math.min(32767, Math.round(ch[i] * 32767))), 44 + i * 2);
writeFileSync(`.cache/music-l${L.id}.wav`, pcm);
