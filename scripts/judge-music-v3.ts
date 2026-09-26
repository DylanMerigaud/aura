// Mood judge for the Lyria 3 Pro candidates: Gemini audio input on gemini-3.1-pro-preview, structured JSON output.
// Scores 1 to 5 against Dylan's note for the track, beat clarity, and loop (levels) or ending (victory) quality.
// Writes samples/music/<track>/c<N>.judge.json and one ledger row per axis (kind "music") to evals/ledger.jsonl.
// Usage: tsx scripts/judge-music-v3.ts <track> <n1> [n2 ...]. Key from the macOS keychain, read in process.
import { execFileSync } from "node:child_process";
import { appendFileSync, readFileSync, writeFileSync, existsSync } from "node:fs";

const MODEL = "gemini-3.1-pro-preview";
const NOTES: Record<string, { note: string; criterion: string; context: string }> = {
  level1: {
    note: "more funk, more bass",
    criterion: "FUNK AND BASS WEIGHT: is this real Brazilian funk (funk carioca, mandelao, montagem) with a heavy tamborzao and a loud, bass boosted 808 with audible pitch slides? 5 = the bass hits the chest and the tamborzao is unmistakable, 1 = thin, smooth or not Brazilian funk at all.",
    context: "level 1 of a mobile rhythm battle game, Chatelet metro platform at 2am, against the Turnstile Ninja; a looping level track",
  },
  level2: {
    note: "sidechain on the bass",
    criterion: "AUDIBLE SIDECHAIN PUMP: does the bass (and pads) clearly duck and swell back on every kick, an obvious pumping, breathing sidechain you can hear without trying? 5 = the pump is the signature of the track, 1 = no audible pump.",
    context: "level 2 of a mobile rhythm battle game, a kebab shop at 4am; a looping level track in Brazilian funk montagem phonk style",
  },
  boss3: {
    note: "boss phase 2: heavier, faster, more intense than phase 1",
    criterion: "INTENSITY: does this feel like the enraged second phase of a final boss, relentless, heavy, fast and menacing, with no lull? 5 = maximum pressure all the way through, 1 = calm or generic.",
    context: "the final boss's phase two of a mobile rhythm battle game, Brazilian funk montagem phonk style; a looping battle track",
  },
  victory: {
    note: "too smooth, more samba",
    criterion: "RAW SAMBA BATUCADA: is this a raw, loud, live sounding samba batucada (surdos, repinique, caixa, tamborim, agogo, whistle), festive and unpolished rather than smooth? 5 = a street bateria at full blast, 1 = smooth, synthetic or not samba.",
    context: "the victory stinger of a mobile rhythm battle game, played once when the player wins, 8 to 15 seconds",
  },
};

const SCHEMA = {
  type: "object",
  properties: {
    note_score: { type: "integer", description: "1 to 5 on the track criterion" },
    note_evidence: { type: "string" },
    beat_clarity: { type: "integer", description: "1 to 5: a player can tap along to a clear, steady pulse from the first second" },
    beat_evidence: { type: "string" },
    loop_or_ending: { type: "integer", description: "1 to 5: for a level track, energy stays steady so it loops without a dead intro or a lull; for a stinger, it ends on a strong final hit instead of trailing off" },
    loop_evidence: { type: "string" },
    intelligible_words: { type: "boolean", description: "true if any sung or spoken words are intelligible" },
  },
  required: ["note_score", "note_evidence", "beat_clarity", "beat_evidence", "loop_or_ending", "loop_evidence", "intelligible_words"],
};

async function judge(track: string, n: number, key: string) {
  const t = NOTES[track];
  const file = `samples/music/${track}/c${n}.mp3`;
  const out = `samples/music/${track}/c${n}.judge.json`;
  if (existsSync(out)) return console.log(`${out} exists`);
  const prompt = `You are a strict music supervisor for ${t.context}. The previous version was rejected by the game director with the note: "${t.note}". Listen to this candidate and score it honestly, 1 to 5 on each axis, a 5 must be earned.\n\n1. ${t.criterion}\n2. BEAT CLARITY: can a player tap along to a clear, steady pulse from the first second?\n3. ${track === "victory" ? "ENDING: does it end on a strong final hit instead of trailing off or being cut mid phrase?" : "LOOP: does the energy stay steady and full so it can loop, without a dead intro, a long lull or a fade?"}\n\nGive one short concrete evidence sentence per axis (what you hear, with timestamps).`;
  for (let attempt = 1; attempt <= 3; attempt++) {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": key },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ inlineData: { mimeType: "audio/mpeg", data: readFileSync(file).toString("base64") } }, { text: prompt }] }],
        generationConfig: { responseMimeType: "application/json", responseJsonSchema: SCHEMA, temperature: 0.2 },
      }),
    });
    const body: any = await res.json().catch(() => ({}));
    const text = body?.candidates?.[0]?.content?.parts?.find((p: any) => p.text)?.text;
    if (!res.ok || !text) {
      console.log(`${track} c${n} attempt ${attempt}: HTTP ${res.status} ${JSON.stringify(body).slice(0, 300)}`);
      await new Promise((r) => setTimeout(r, 5000 * attempt));
      continue;
    }
    const j = JSON.parse(text);
    const total = Math.round(((j.note_score + j.beat_clarity + j.loop_or_ending) / 3) * 100) / 100;
    const result = { track, candidate: `c${n}`, model: MODEL, note: t.note, ...j, total };
    writeFileSync(out, JSON.stringify(result, null, 2));
    const ts = new Date().toISOString();
    const rows = [
      ["mood judge: " + t.note, j.note_score, j.note_evidence],
      ["mood judge: beat clarity", j.beat_clarity, j.beat_evidence],
      [track === "victory" ? "mood judge: ending quality" : "mood judge: loop quality", j.loop_or_ending, j.loop_evidence],
    ].map(([gate, score, evidence]) => JSON.stringify({ ts, kind: "music", id: `${track}-c${n}`, gate, verdict: (score as number) >= 4 ? "pass" : "fail", score, evidence: { judge: MODEL, file, candidate_model: "lyria-3-pro-preview", threshold: 4, note: evidence, intelligible_words: j.intelligible_words } }));
    appendFileSync("evals/ledger.jsonl", rows.join("\n") + "\n");
    console.log(`${track} c${n}: note ${j.note_score} beat ${j.beat_clarity} loop ${j.loop_or_ending} words ${j.intelligible_words} total ${total}`);
    return;
  }
}

const [track, ...ns] = process.argv.slice(2);
if (!NOTES[track]) throw new Error(`unknown track ${track}`);
const key = execFileSync("security", ["find-generic-password", "-s", "gemini-api-key-hackathon", "-a", "dylanmerigaud", "-w"], { encoding: "utf8" }).trim();
for (const n of ns) await judge(track, Number(n), key);
