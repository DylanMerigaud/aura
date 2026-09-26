// Lyria 3 Pro candidates for the rejected tracks (level1, level2, boss3, victory), raw MP3 into samples/music/<track>/raw/c<N>.mp3.
// Usage: tsx scripts/gen-music-v3.ts <track> <n1> [n2 ...]. Key from the macOS keychain, read in process, never printed.
import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync, existsSync } from "node:fs";

const MODEL = "lyria-3-pro-preview";
const TAIL = "No lyrics, no vocals with words, instrumental only, no spoken words.";
export const PROMPTS: Record<string, { bpm: number; seconds: number; prompt: string }> = {
  level1: {
    bpm: 100,
    seconds: 40,
    prompt: `Instrumental Brazilian funk carioca mandelao track for a video game level set on an empty Paris metro platform at 2am. Tempo exactly 100 BPM. A heavy, loud, raw tamborzao drum pattern (the syncopated funk carioca kick and clap rhythm) and a huge bass boosted 808 with long pitch slides and glides that distorts on purpose, the bass is the loudest element of the mix. Everything hits from the very first second, no intro, no fade in, no build up. Funky swinging groove, cowbell and agogo accents, short chopped vocal textures with no intelligible words, dark, confident, bass heavy aura farming edit energy, forty seconds long. ${TAIL}`,
  },
  level2: {
    bpm: 104,
    seconds: 40,
    prompt: `Instrumental Brazilian funk montagem phonk track for a video game level set in a kebab shop at 4am. Tempo exactly 104 BPM. The signature sound is a deep 808 bass and a sustained low synth that are heavily sidechain compressed to the kick drum, an obvious pumping, breathing, ducking bass that swells back after every kick, like a French house pump. Tamborzao drum pattern, cowbell rolls, chopped vocal textures with no intelligible words. Everything hits from the very first second, no intro, no fade in, no build up, dark and confident aura farming edit energy, forty seconds long. ${TAIL}`,
  },
  boss3: {
    bpm: 138,
    seconds: 40,
    prompt: `Instrumental Brazilian funk montagem phonk final boss battle, phase two, the boss is enraged. Tempo exactly 138 BPM. Heavier, faster and more aggressive than phase one: relentless double time tamborzao drums, a massive distorted 808 bass with fast slides in a dark minor key, piercing cowbell rolls, alarm like synth stabs, heavily distorted low growling vocal chop textures with no intelligible words, maximum intensity from the very first second, no intro, no fade in, no breakdown, chaotic and menacing, forty seconds long. ${TAIL}`,
  },
  victory: {
    bpm: 130,
    seconds: 12,
    prompt: `Instrumental raw Brazilian samba batucada victory stinger for a video game. Tempo exactly 130 BPM. A live street samba school percussion section, loud surdo bass drums, cracking repinique calls, rattling caixa snares, tamborim rolls, agogo bells and a whistle, raw, loud, festive and unpolished, like a carnival bateria in the street, no synth pads, no smooth production. Hits hard from the very first instant, a short celebratory burst ending on one big unison hit, twelve seconds long. ${TAIL}`,
  },
};

async function generate(track: string, n: number, key: string) {
  const p = PROMPTS[track];
  const dir = `samples/music/${track}/raw`;
  mkdirSync(dir, { recursive: true });
  const out = `${dir}/c${n}.mp3`;
  if (existsSync(out)) return console.log(`${out} exists`);
  for (let attempt = 1; attempt <= 3; attempt++) {
    const t0 = Date.now();
    const res = await fetch("https://generativelanguage.googleapis.com/v1beta/interactions", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": key },
      body: JSON.stringify({ model: MODEL, input: p.prompt }),
    });
    const body: any = await res.json().catch(() => ({}));
    if (!res.ok) {
      console.log(`${track} c${n} attempt ${attempt}: HTTP ${res.status} ${JSON.stringify(body).slice(0, 300)}`);
      await new Promise((r) => setTimeout(r, 5000 * attempt));
      continue;
    }
    const blocks = (body.steps ?? body.outputs ?? []).flatMap((s: any) => s.content ?? [s]);
    const audio = blocks.find((b: any) => b?.type === "audio" && b.data) ?? blocks.find((b: any) => b?.data);
    if (!audio) {
      console.log(`${track} c${n}: no audio block, keys ${Object.keys(body)} ${JSON.stringify(body).slice(0, 400)}`);
      continue;
    }
    writeFileSync(out, Buffer.from(audio.data, "base64"));
    console.log(`${track} c${n}: ${out} ${(Date.now() - t0) / 1000}s ${audio.mime_type}`);
    return;
  }
}

const [track, ...ns] = process.argv.slice(2);
if (!PROMPTS[track]) throw new Error(`unknown track ${track}`);
const key = execFileSync("security", ["find-generic-password", "-s", "gemini-api-key-hackathon", "-a", "dylanmerigaud", "-w"], { encoding: "utf8" }).trim();
await Promise.all(ns.map((n) => generate(track, Number(n), key)));
