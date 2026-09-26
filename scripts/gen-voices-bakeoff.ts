// Voice bake off for the announcer and the Turnstile Ninja (level 1), plus Gradium crowd shouts.
// Three candidates per role: Gradium Voice Design, gemini-3.8-flash-tts, gemini-2.5-pro-preview-tts.
// Every render is post processed with ffmpeg (trim, atempo 1.08, slap reverb, compression, sub
// thump on big calls) and judged by gemini-3.1-pro-preview on audio (energy, emotion, stereotype,
// genz, 1 to 5, ship at >= 4 on every axis). Every judgment is a ledger row in evals/ledger.jsonl.
//
// Run with node_modules/.bin/tsx scripts/gen-voices-bakeoff.ts <step> [--only=slug,slug]
//   sample  one announcer call and one taunt per candidate into samples/voice/sample/, SAMPLE.md
//   batch   five variants per line with the winning candidate per role, BOARD.md, public/voice/v2
//   crowd   French and Brazilian Portuguese crowd shouts layered into public/voice/v2/crowd-*.mp3
//   board   rewrite BOARD.md and public/voice/v2 from the stored results, no API call
// Keys come from the macOS keychain, read in process. Gradium credits are logged per call to
// samples/voice/credits.jsonl and the script refuses a Gradium call past 55,000 credits spent.

import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { appendFileSync, copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const OUT = path.join(ROOT, "samples/voice");
const STATE_PATH = path.join(OUT, "state.json");
const CREDITS_PATH = path.join(OUT, "credits.jsonl");
const LEDGER_PATH = path.join(ROOT, "evals/ledger.jsonl");
const VOICE_DIR = path.join(ROOT, "public/voice/v2");
const CAST_ARG = process.argv.find((x) => x.startsWith("--cast="));
const CAST_PATH = CAST_ARG ? path.resolve(CAST_ARG.slice(7)) : path.join(ROOT, "src/v2/cast.json");
const TMP = path.join(ROOT, ".cache/voice-bakeoff");

const GRADIUM = "https://api.gradium.ai/api";
const GEMINI = "https://generativelanguage.googleapis.com/v1beta/models";
const JUDGE_MODEL = "gemini-3.1-pro-preview";
// Baseline read from GET /usages/credits before the first call of this bake off (2026-09-26 15:15).
const GRADIUM_BASELINE = 140557;
const GRADIUM_STOP = 55000;
const SHIP = 4;
const AXES = ["energy", "emotion", "stereotype", "genz"] as const;
type Axis = (typeof AXES)[number];
type Scores = Record<Axis, number> & { note: string };

const DASH_RE = new RegExp("[" + String.fromCharCode(0x2014) + String.fromCharCode(0x2013) + "]", "g");
const clean = (s: string) => s.replace(DASH_RE, ",");

// ---------------------------------------------------------------------------------------------
// Keys and state

function keychain(service: string): string {
  return execFileSync("security", ["find-generic-password", "-s", service, "-a", "dylanmerigaud", "-w"]).toString().trim();
}
let gradiumKey = "";
let geminiKey = "";
const gradium = () => (gradiumKey ||= keychain("gradium-api-key"));
const gemini = () => (geminiKey ||= keychain("gemini-api-key-hackathon"));

interface Render {
  file: string;
  role: Role;
  line: string;
  text: string;
  candidate: CandidateId;
  model: string;
  voice: string;
  direction: string;
  scores?: Scores;
}
interface State {
  voices: Record<string, { embedding_id: string; prompt: string; language: string }>;
  sample: Render[];
  batch: Record<string, Render[]>; // key role/slug
  crowd: { file: string; shouts: string[] }[];
  pick: Record<string, string>; // "role:candidate" -> voice option that won the sample audition
}
function loadState(): State {
  if (existsSync(STATE_PATH)) return { pick: {}, ...JSON.parse(readFileSync(STATE_PATH, "utf8")) };
  return { voices: {}, sample: [], batch: {}, crowd: [], pick: {} };
}
function saveState(s: State) {
  writeFileSync(STATE_PATH, `${JSON.stringify(s, null, 1)}\n`);
}

// ---------------------------------------------------------------------------------------------
// Roles, lines, per line directions

// A role is a character: announcer, ninja, boatkid, or opp-<name> for any other cast opponent.
type Role = string;
interface Line {
  role: Role;
  slug: string;
  text: string;
  spoken?: string; // what the TTS says when the text itself is not speakable ("...")
  indexId: string; // key in public/voice/v2/index.json
  big: boolean; // gets the sub thump
  direction: string;
}

interface Profile {
  title: string;
  base: string; // Gemini audio profile
  accent: string;
  pacing: string;
  who: string; // what the judge listens for
  energy: string; // what "energy" means for this character
}
const LOUD = "loudness, drive, punch";
const PROFILES: Record<string, Profile> = {
  announcer: {
    title: "THE ANNOUNCER",
    base: "a Gen Z hype MC at an underground dance battle in a Paris metro station at 2am, young American male, esports caster meets battle rap host, SHOUTING at full volume into a mic over a roaring crowd, voice cracking with hype, wrestling ring announcer energy",
    accent: "American, young, Gen Z slang cadence",
    pacing: "fast, punchy, no pause before the line",
    who: "THE ANNOUNCER: a Gen Z hype MC at an underground dance battle, should sound loud, hyped, caricatural, like an esports caster or battle rap host",
    energy: LOUD,
  },
  ninja: {
    title: "THE TURNSTILE NINJA",
    base: "THE TURNSTILE NINJA, a young Parisian fare dodger from the banlieue, speaking English with a strong French accent, silent type, cocky, chin up, hands in pockets, smug half smile, unbothered, low relaxed voice with a slight rasp",
    accent: "strong French accent, Parisian street",
    pacing: "fast, punchy, no pause before the line",
    who: "THE TURNSTILE NINJA: a cocky Parisian metro fare dodger, should sound smug, chin up, unbothered, with a clear French accent and street attitude",
    energy: LOUD,
  },
  "opp-papi-raleur": {
    title: "PAPI RALEUR",
    base: "PAPI RALEUR, a grumpy old Parisian grandpa in his 70s who complains about everything, then dances better than you, gravelly voice, sighing, scoffing, a strong French accent in English",
    accent: "old Parisian, strong French accent, grumbling",
    pacing: "grumbling, clipped, with a scoff or a sigh",
    who: "PAPI RALEUR: a grumpy old Parisian grandpa, should sound old, grumpy, scoffing, French, funny",
    energy: "presence and attitude: grumpy conviction, scoffs and sighs count, not loudness",
  },
  "opp-la-parisienne": {
    title: "LA PARISIENNE",
    base: "LA PARISIENNE, a chic cold Parisian woman in her late 20s, effortless, unimpressed, a coffee in hand, judges everyone in silence, dry and disdainful, a French accent in English",
    accent: "chic Parisian, French accent",
    pacing: "slow, dry, disdainful, bored",
    who: "LA PARISIENNE: a chic, cold, unimpressed Parisian woman, should sound bored, disdainful, elegant and French",
    energy: "presence and attitude: cold disdain and elegance, not loudness",
  },
  "opp-sporty-granny": {
    title: "SPORTY GRANNY",
    base: "SPORTY GRANNY, an energetic 80 year old lady in a tracksuit and sweatband, 80 years of cardio, zero mercy, bright, bossy, a drill sergeant grandma, a slight French accent",
    accent: "old lady, slight French accent, bossy coach",
    pacing: "brisk, bossy, like a fitness coach",
    who: "SPORTY GRANNY: an energetic, merciless 80 year old fitness granny, should sound old, female, bossy and full of energy",
    energy: LOUD,
  },
  boatkid: {
    title: "THE BOAT KID",
    base: "THE BOAT KID, a calm young kid, the boss of aura maxing, standing at the front of a racing boat, eyes half closed, serene, never impressed, speaks calm and quiet, almost a whisper, supremely confident",
    accent: "neutral, soft, young",
    pacing: "slow, calm, unhurried, a breath of silence feels natural",
    who: "THE BOAT KID: a calm kid archetype, the boss of aura maxing, should sound quiet, almost whispered, serene, young and supremely confident, never shouting",
    energy: "presence and intensity: magnetic, controlled calm scores high, shouting scores low",
  },
};
function profileFor(role: Role, persona?: string, name?: string): Profile {
  if (PROFILES[role]) return PROFILES[role];
  const p: Profile = {
    title: name ?? role,
    base: `${name}, ${persona ?? "a rival dancer"}`,
    accent: "French touch, Paris",
    pacing: "punchy, in character",
    who: `${name}: ${persona ?? "a rival dancer"}, should sound exactly like this character, caricatural and memorable`,
    energy: LOUD,
  };
  PROFILES[role] = p;
  return p;
}
function roleForOpponent(name: string): Role {
  if (/NINJA/i.test(name)) return "ninja";
  if (/BOAT KID/i.test(name)) return "boatkid";
  return `opp-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`;
}

// The Boat Kid's taunts before the cast file carries him (decision 16:40); a provisional key, the
// cast rerun re-keys the same text to v2-l1-taunt-<i> without a new render.
const BOAT_KID_SEED = ["...", "Stay still.", "Aura is quiet."];
const BOAT_KID_DIR = [
  "a calm slow exhale through the nose, then a short low hum, unbothered",
  "quiet command, almost a whisper, total control, a little amused",
  "serene, a soft whisper, like sharing a secret truth, confident",
];

const CALLS: [string, string, string][] = [
  ["your-move", "YOUR MOVE!", "pointing at the player, sharp and commanding, rising at the end, hyped"],
  ["his-move", "HIS MOVE!", "pointing across the stage, teasing, suspense and excitement"],
  ["perfect", "PERFECT!", "explosive, ecstatic, the crowd erupts, stretch the first syllable"],
  ["combo", "COMBO!", "punchy and fast, rising pitch, pure hype, like a fighting game announcer"],
  ["aura-farming", "AURA FARMING!", "screaming with joy, huge energy, the biggest call of the night"],
  ["flow", "FLOW!", "smooth then loud, impressed, drawn out and cool"],
  ["cringe", "CRINGE!", "mocking and disgusted, laughing at the player, playful roast"],
  // The mash move is 67 (decision 15:50): the release call, the biggest meme of the night.
  ["six-seven", "SIX! SEVEN!", "the release of the mash, two huge separate shouts, SIX then a beat then SEVEN even louder, meme energy, the crowd screams with you"],
];

function lines(): Line[] {
  const cast = JSON.parse(readFileSync(CAST_PATH, "utf8"));
  const out: Line[] = [];
  for (const [slug, text, dir] of CALLS) {
    out.push({ role: "announcer", slug, text, indexId: `call-${slug}`, big: true, direction: dir });
  }
  const annDir: Record<string, string> = {
    intro: "opening the battle, dead serious hype, building tension, then punching the last word",
    win: "victorious, ecstatic, celebrating the player, crowd going wild",
    lose: "roasting the player, mocking, laughing, ruthless but playful",
  };
  for (const level of cast.levels) {
    for (const k of ["intro", "win", "lose"] as const) {
      out.push({
        role: "announcer",
        slug: `l${level.id}-${k}`,
        text: level.announcer[k],
        indexId: `v2-l${level.id}-${k}`,
        big: k !== "lose",
        direction: annDir[k],
      });
    }
  }
  const tauntDir = [
    "fake concerned, mocking the player, a smug smirk in the voice",
    "slow and cold, delivering a verdict, satisfied",
    "bragging, relaxed, almost bored, proud",
    "condescending, dismissive, a little laugh on frerot",
    "calm and final, flexing, like closing a deal",
    "playing dumb, fake confused, then smug",
    "cool and low, swagger, chin up",
    "proud, theatrical, like a movie trailer hero, cocky",
  ];
  const calmDir = ["calm, quiet, knowing", "a whisper, certain", "serene, amused, slow", "almost silent, final"];
  // Taunts: every level of the cast. Legacy runs voiced only the Ninja; LEVELS narrows it
  // (--levels=1,2), a text already voiced for the same character is reused, not rendered.
  const lv = process.argv.find((x) => x.startsWith("--levels="));
  const levels = lv ? new Set(lv.slice(9).split(",").map(Number)) : null;
  let hasBoatKid = false;
  for (const level of cast.levels) {
    const role = roleForOpponent(level.opponent?.name ?? "");
    if (role === "boatkid") hasBoatKid = true;
    if (levels && !levels.has(level.id)) continue;
    profileFor(role, level.opponent?.persona, level.opponent?.name);
    level.taunts.forEach((t: string, i: number) => {
      const quiet = role === "boatkid";
      out.push({
        role,
        slug: role === "ninja" ? `taunt-${i}` : `l${level.id}-taunt-${i}`,
        text: t,
        spoken: /^[.\s]+$/.test(t) ? "Hmm." : undefined,
        indexId: `v2-l${level.id}-taunt-${i}`,
        big: false,
        direction: quiet
          ? /^[.\s]+$/.test(t)
            ? BOAT_KID_DIR[0]
            : calmDir[i % calmDir.length]
          : role === "ninja"
            ? tauntDir[i] ?? tauntDir[0]
            : `in character (${level.opponent?.persona ?? ""}), a taunt at the player, committed and caricatural`,
      });
    });
  }
  if (!hasBoatKid) {
    BOAT_KID_SEED.forEach((t, i) => {
      out.push({ role: "boatkid", slug: `bk-taunt-${i}`, text: t, spoken: i === 0 ? "Hmm." : undefined, indexId: `v2-boatkid-taunt-${i}`, big: false, direction: BOAT_KID_DIR[i] });
    });
  }
  return out;
}

// ---------------------------------------------------------------------------------------------
// Candidates

type CandidateId = "gradium" | "gemini-flash" | "gemini-pro";
const CANDIDATES: Record<CandidateId, { model: string }> = {
  gradium: { model: "gradium-default (voice design)" },
  "gemini-flash": { model: "gemini-3.8-flash-tts" },
  "gemini-pro": { model: "gemini-2.5-pro-preview-tts" },
};
// Voice options auditioned in the sample step, the best per role and candidate is kept for the batch.
const GEMINI_OPTIONS: Record<string, string[]> = {
  announcer: ["Fenrir", "Puck", "Sadachbia"],
  ninja: ["Algenib", "Zubenelgenubi", "Umbriel"],
  boatkid: ["Enceladus", "Achernar", "Vindemiatrix"],
};
function voiceOptions(cand: CandidateId, role: Role): string[] {
  if (cand === "gradium") return DESIGN[role] ? [role, `${role}-2`, `${role}-3`] : ["announcer-2"];
  if (GEMINI_OPTIONS[role]) return GEMINI_OPTIONS[role];
  const p = `${PROFILES[role]?.base ?? ""}`.toLowerCase();
  if (/granny|grandma|woman|girl|parisienne|she /.test(p)) return ["Kore", "Leda", "Aoede"];
  if (/papi|old|grandpa|elderly/.test(p)) return ["Charon", "Algieba", "Gacrux"];
  return ["Puck", "Orus", "Fenrir"];
}

const DESIGN: Record<string, { prompt: string; language: string }> = {
  announcer: {
    prompt:
      "Young American male hype MC, early 20s, Gen Z esports caster and battle rap host, shouting, booming, over the top wrestling ring announcer energy, very high energy, very fast pacing, big theatrical resonance, deep chest voice, grinning.",
    language: "en",
  },
  "announcer-2": {
    prompt:
      "American male streamer, 22, screaming into the mic at full volume, voice cracking with hype, Twitch clip energy, wrestling ring announcer, extremely loud, fast, ecstatic, raspy shout, huge chest resonance.",
    language: "en",
  },
  "announcer-3": {
    prompt:
      "Black American male battle rap host, 25, hyping a crowd at a street dance battle, yelling, commanding, deep booming voice, rhythmic punchy delivery, very high energy, loud, charismatic, grinning.",
    language: "en",
  },
  boatkid: {
    prompt: "Young boy, around 12, calm and quiet, almost whispering, confident and serene, soft breathy voice, slow unhurried pacing, never excited, a knowing little smile.",
    language: "en",
  },
  "boatkid-2": {
    prompt: "Calm kid, 11 to 13, soft low voice, speaks barely above a whisper, perfectly composed, unbothered, mysterious and confident, slow and gentle pacing.",
    language: "en",
  },
  "boatkid-3": {
    prompt: "Young teenage boy, 13, relaxed and serene, hushed intimate voice, breathy, deadpan confidence, slow pacing, zen and unimpressed.",
    language: "en",
  },
  "opp-papi-raleur": {
    prompt: "Grumpy old Parisian man, 75, gravelly and raspy voice, sighing and scoffing, complains about everything, strong French accent, slow and grumbling, funny.",
    language: "en",
  },
  "opp-la-parisienne": {
    prompt: "Chic Parisian woman, late 20s, cold and unimpressed, dry and disdainful, low elegant voice, French accent, slow bored pacing, effortless.",
    language: "en",
  },
  "opp-sporty-granny": {
    prompt: "Energetic old lady, 80, sporty and bossy like a fitness coach, bright strong voice, slight French accent, brisk pacing, merciless and funny.",
    language: "en",
  },
  "ninja-2": {
    prompt:
      "French man, 20, from Paris suburbs, heavy French accent in English, arrogant and teasing, lazy drawl, low voice, mocking smile, very relaxed, streetwise, confident.",
    language: "en",
  },
  "ninja-3": {
    prompt:
      "Young man from Paris, 19, strong French accent, cocky trash talker, smirking, nasal and raspy, chill but provocative, playful arrogance, medium pace, street slang attitude.",
    language: "en",
  },
  ninja: {
    prompt:
      "Young Parisian man, early 20s, banlieue street accent speaking English with a strong French accent, cocky and smug, low relaxed voice, slight rasp, half smiling, unbothered, clipped confident pacing.",
    language: "en",
  },
  "crowd-fr-1": { prompt: "Young Parisian man, 20s, shouting from a crowd at a street dance battle, hyped, loud, rough voice, fast.", language: "fr" },
  "crowd-fr-2": { prompt: "Young Parisian woman, 20s, screaming with excitement in a crowd at a dance battle, high pitch, loud, laughing.", language: "fr" },
  "crowd-fr-3": { prompt: "Parisian man, 30s, deep booming voice yelling from the back of a crowd, gritty, excited.", language: "fr" },
  "crowd-pt-1": { prompt: "Brazilian man, 20s, shouting with football commentator intensity, huge energy, fast, loud booming chest voice, ecstatic.", language: "pt" },
  "crowd-pt-2": { prompt: "Brazilian woman, 20s, screaming in a party crowd, very excited, high pitch, loud, joyful.", language: "pt" },
  "crowd-pt-3": { prompt: "Young Brazilian man from Rio, hyped street crowd voice, raspy, yelling, playful.", language: "pt" },
};

// ---------------------------------------------------------------------------------------------
// Gradium: credits guard and calls

function spentSoFar(): number {
  if (!existsSync(CREDITS_PATH)) return 0;
  return readFileSync(CREDITS_PATH, "utf8")
    .split("\n")
    .filter(Boolean)
    .reduce((s, l) => s + (JSON.parse(l).credits ?? 0), 0);
}
async function balance(): Promise<number> {
  const r = await fetch(`${GRADIUM}/usages/credits`, { headers: { "x-api-key": gradium() } });
  return (await r.json()).remaining_credits;
}
function logCredits(row: Record<string, unknown>) {
  mkdirSync(OUT, { recursive: true });
  appendFileSync(CREDITS_PATH, `${JSON.stringify({ ts: new Date().toISOString(), ...row })}\n`);
}
function guard(next: number) {
  const spent = spentSoFar();
  if (spent + next > GRADIUM_STOP) throw new Error(`Gradium stop: ${spent} credits spent, next call ${next} would pass ${GRADIUM_STOP}`);
}

async function designVoice(key: string, state: State): Promise<string> {
  if (state.voices[key]) return state.voices[key].embedding_id;
  const d = DESIGN[key];
  guard(500);
  const before = await balance();
  const r = await fetch(`${GRADIUM}/voice-generator/generate`, {
    method: "POST",
    headers: { "x-api-key": gradium(), "Content-Type": "application/json" },
    body: JSON.stringify({ prompt: d.prompt, language: d.language, n_samples: 1, json_config: { cfg_scale: 10 } }),
  });
  if (!r.ok) throw new Error(`voice design ${key}: ${r.status} ${(await r.text()).slice(0, 300)}`);
  const id: string = (await r.json()).embeddings[0].embedding_id;
  for (let i = 0; i < 60; i++) {
    const q = await fetch(`${GRADIUM}/voice-generator/embeddings?embedding_id=${id}`, { headers: { "x-api-key": gradium() } });
    const e = (await q.json()).embeddings?.[0];
    if (e?.ready) break;
    await new Promise((res) => setTimeout(res, 2000));
  }
  const after = await balance();
  logCredits({ call: "voice-generator/generate", key, credits: Math.max(0, before - after), balance: after, note: "credits = balance delta" });
  state.voices[key] = { embedding_id: id, ...d };
  // Merge into the state on disk, a batch may be writing its results concurrently.
  const cur = loadState();
  cur.voices[key] = state.voices[key];
  saveState(cur);
  return id;
}

async function gradiumTts(voiceId: string, text: string, label: string, out: string): Promise<void> {
  guard(text.length);
  // Gradium caps an account at 2 concurrent sessions (400 "Concurrency limit exceeded"): back off and retry.
  let r: Response | undefined;
  for (let i = 0; i < 8; i++) {
    r = await fetch(`${GRADIUM}/post/speech/tts`, {
    method: "POST",
    headers: { "x-api-key": gradium(), "Content-Type": "application/json" },
    body: JSON.stringify({
      text,
      voice_id: voiceId,
      output_format: "wav",
      only_audio: true,
      json_config: JSON.stringify({ temp: 1.2, padding_bonus: -2.0 }),
    }),
    signal: AbortSignal.timeout(60_000),
    }).catch(() => undefined);
    if (r?.ok) break;
    const t = r ? await r.clone().text() : "network";
    if (r && !/concurren|limit|busy/i.test(t) && r.status !== 429 && r.status < 500) break;
    await new Promise((res) => setTimeout(res, 1500 * (i + 1)));
  }
  if (!r) throw new Error(`gradium tts ${label}: network`);
  if (!r.ok) throw new Error(`gradium tts ${label}: ${r.status} ${(await r.text()).slice(0, 300)}`);
  writeFileSync(out, Buffer.from(await r.arrayBuffer()));
  logCredits({ call: "post/speech/tts", key: label, credits: text.length, note: "1 credit per character (docs/credits)" });
}

// ---------------------------------------------------------------------------------------------
// Gemini: TTS and judge

async function geminiPost(model: string, body: unknown, tries = 5): Promise<any> {
  for (let i = 0; ; i++) {
    let r: Response;
    try {
      r = await fetch(`${GEMINI}/${model}:generateContent?key=${gemini()}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(120_000),
      });
    } catch (e) {
      if (i >= tries - 1) throw e;
      await new Promise((res) => setTimeout(res, 3000 * (i + 1)));
      continue;
    }
    if (r.ok) return r.json();
    const t = (await r.text()).slice(0, 300);
    if (i >= tries - 1 || ![429, 500, 502, 503, 504].includes(r.status)) throw new Error(`${model} ${r.status}: ${t}`);
    await new Promise((res) => setTimeout(res, 4000 * (i + 1)));
  }
}

// Director's notes format. A plain "Perform this line as ..." prompt is read ALOUD in full by
// gemini-3.8-flash-tts (measured 21 s for "AURA FARMING!"), and systemInstruction is refused
// ("Developer instruction is not enabled for this model"). The notes plus TRANSCRIPT header keeps
// the spoken audio to the line on both Gemini TTS models.
function geminiPrompt(line: Line, variant: number): string {
  const pr = profileFor(line.role);
  const spice = [
    "",
    " Push it further, more caricatural.",
    " Even more attitude, exaggerate the character.",
    " Take a breath before it and hit it hard.",
    " Make it iconic, like a meme sound.",
  ][variant % 5] + (variant > 5 ? " Louder and more energetic than a normal read, provocative, big attitude, performed for a crowd." : "");
  return (
    `# AUDIO PROFILE: ${pr.title}\n` +
    `${pr.base}.\n### DIRECTOR'S NOTES\nStyle: ${line.direction}.${line.role === "boatkid" ? "" : spice}\nAccent: ${pr.accent}.\nPacing: ${pr.pacing}.\n` +
    `#### TRANSCRIPT\n${line.spoken ?? line.text}`
  );
}

async function geminiTts(model: string, voice: string, prompt: string, out: string): Promise<void> {
  const j = await geminiPost(model, {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: {
      responseModalities: ["AUDIO"],
      speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: voice } } },
    },
  });
  const part = j.candidates?.[0]?.content?.parts?.find((p: any) => p.inlineData);
  if (!part) throw new Error(`${model}: no audio in response`);
  const pcm = out.replace(/\.wav$/, ".pcm");
  writeFileSync(pcm, Buffer.from(part.inlineData.data, "base64"));
  const rate = /rate=(\d+)/.exec(part.inlineData.mimeType ?? "")?.[1] ?? "24000";
  execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-f", "s16le", "-ar", rate, "-ac", "1", "-i", pcm, out]);
}

const JUDGE_SCHEMA = {
  type: "OBJECT",
  properties: {
    energy: { type: "INTEGER" },
    emotion: { type: "INTEGER" },
    stereotype: { type: "INTEGER" },
    genz: { type: "INTEGER" },
    transcript: { type: "STRING" },
    note: { type: "STRING" },
  },
  required: ["transcript", "energy", "emotion", "stereotype", "genz", "note"],
};

async function judge(file: string, line: Line): Promise<Scores> {
  const pr = profileFor(line.role);
  const who = pr.who;
  const prompt =
    `You are a harsh casting director for a mobile rhythm battle game aimed at Gen Z. Listen to this voice line.\n` +
    `Character: ${who}.\nExpected text: "${line.spoken ? `${line.text} (a wordless sound, spoken as ${line.spoken})` : line.text}". Direction: ${line.direction}.\n` +
    `Score 1 to 5 each (5 = ship it, 3 = flat or generic, 1 = broken): energy (${pr.energy}), ` +
    `emotion (a clear, committed feeling matching the direction), stereotype (it sounds exactly like this character), ` +
    `genz (would a 2026 Gen Z player find it hype and meme worthy, not cringe corporate). ` +
    `First write the transcript: every word actually spoken, verbatim. If the words are wrong, cut off, or extra words are spoken, cap every score at 2. Note: one short sentence.`;
  const data = readFileSync(file).toString("base64");
  const j = await geminiPost(JUDGE_MODEL, {
    contents: [{ parts: [{ inlineData: { mimeType: "audio/mpeg", data } }, { text: prompt }] }],
    generationConfig: { responseMimeType: "application/json", responseSchema: JUDGE_SCHEMA, temperature: 0.2 },
  });
  const text = j.candidates?.[0]?.content?.parts?.map((p: any) => p.text ?? "").join("") ?? "";
  const s = JSON.parse(text) as Scores;
  for (const a of AXES) s[a] = Math.max(1, Math.min(5, Math.round(Number(s[a]) || 1)));
  s.note = clean(String(s.note ?? ""));
  // Hard guard on top of the judge: a render that speaks the prompt or drops words never ships.
  const words = (t: string) => t.toLowerCase().normalize("NFD").replace(/[^a-z' ]/g, " ").split(/\s+/).filter(Boolean);
  const said = words(String((s as any).transcript ?? ""));
  const want = words(line.spoken ?? line.text);
  if (said.length > want.length + 2 || said.length < Math.max(1, want.length - 1)) {
    for (const a of AXES) s[a] = Math.min(s[a], 2);
    s.note = `wrong words (heard "${clean(String((s as any).transcript)).slice(0, 80)}"), capped at 2. ${s.note}`;
  }
  delete (s as any).transcript;
  return s;
}

function ledger(r: Render) {
  if (!r.scores) return;
  const min = Math.min(...AXES.map((a) => r.scores![a]));
  appendFileSync(
    LEDGER_PATH,
    `${JSON.stringify({
      ts: new Date().toISOString(),
      kind: "voice",
      id: `${r.role}/${r.line}`,
      gate: "bakeoff_judge",
      verdict: min >= SHIP ? "pass" : "fail",
      score: min,
      evidence: {
        file: path.relative(ROOT, r.file),
        model: r.model,
        voice: r.voice,
        judge: JUDGE_MODEL,
        scores: { energy: r.scores.energy, emotion: r.scores.emotion, stereotype: r.scores.stereotype, genz: r.scores.genz },
        mean: mean(r.scores),
        note: r.scores.note,
      },
    })}\n`,
  );
}

// ---------------------------------------------------------------------------------------------
// Post processing

function post(inWav: string, outMp3: string, big: boolean) {
  const chain = [
    "silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.02",
    "areverse",
    "silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.05",
    "areverse",
    "atempo=1.08",
    "highpass=f=70",
    "acompressor=threshold=-20dB:ratio=4:attack=4:release=90:makeup=5",
    "aecho=0.85:0.5:55|95:0.22|0.12",
    "alimiter=limit=0.95",
  ].join(",");
  const args = ["-y", "-loglevel", "error", "-i", inWav];
  if (big) {
    // A low sine thump under the start: 52 Hz, 280 ms, fast exponential decay.
    args.push(
      "-f",
      "lavfi",
      "-i",
      "sine=frequency=52:duration=0.28:sample_rate=44100",
      "-filter_complex",
      `[0:a]aresample=44100,${chain}[v];[1:a]afade=t=out:st=0.02:d=0.26:curve=exp,volume=0.55[s];[v][s]amix=inputs=2:duration=first:normalize=0,alimiter=limit=0.95[o]`,
      "-map",
      "[o]",
    );
  } else {
    args.push("-af", `aresample=44100,${chain}`);
  }
  args.push("-ac", "1", "-ar", "44100", "-c:a", "libmp3lame", "-b:a", "96k", outMp3);
  execFileSync("ffmpeg", args);
}

// ---------------------------------------------------------------------------------------------
// Render one line with one candidate

async function render(line: Line, cand: CandidateId, opt: string, variant: number, outMp3: string, state: State): Promise<Render> {
  mkdirSync(TMP, { recursive: true });
  mkdirSync(path.dirname(outMp3), { recursive: true });
  const raw = path.join(TMP, `${line.role}-${line.slug}-${cand}-${opt}-${variant}.wav`);
  let voice: string;
  let direction: string;
  if (cand === "gradium") {
    const id = await designVoice(opt, state);
    voice = `designed ${opt} ${id}`;
    direction = `voice design: ${DESIGN[opt].prompt} (temp 1.2, padding_bonus -2)`;
    await gradiumTts(id, line.spoken ?? line.text, `${line.role}/${line.slug}/v${variant}`, raw);
  } else {
    const model = CANDIDATES[cand].model;
    voice = opt;
    direction = geminiPrompt(line, variant);
    await geminiTts(model, voice, direction, raw);
  }
  post(raw, outMp3, line.big);
  const r: Render = { file: outMp3, role: line.role, line: line.slug, text: line.text, candidate: cand, model: CANDIDATES[cand].model, voice, direction: clean(direction) };
  r.scores = await judge(outMp3, line);
  ledger(r);
  console.log(`${line.role}/${line.slug} ${cand} v${variant}: ${fmt(r.scores)}`);
  return r;
}

const mean = (s: Scores) => Math.round((AXES.reduce((t, a) => t + s[a], 0) / AXES.length) * 100) / 100;
const minAxis = (s: Scores) => Math.min(...AXES.map((a) => s[a]));
const fmt = (s?: Scores) => (s ? `E${s.energy} Em${s.emotion} S${s.stereotype} G${s.genz} (mean ${mean(s)})` : "not judged");

async function pool<T>(items: T[], n: number, fn: (x: T) => Promise<void>) {
  let i = 0;
  await Promise.all(
    Array.from({ length: Math.min(n, items.length) }, async () => {
      while (i < items.length) {
        const x = items[i++];
        try {
          await fn(x);
        } catch (e) {
          console.error(`FAILED: ${(e as Error).message}`);
        }
      }
    }),
  );
}

// ---------------------------------------------------------------------------------------------
// Steps

async function sample() {
  const state = loadState();
  const all = lines();
  // --role=<role> samples one more character (e.g. boatkid) and keeps the earlier sample rows.
  const ra = process.argv.find((x) => x.startsWith("--role="));
  const role = ra?.slice(7);
  const picks = role
    ? [all.filter((l) => l.role === role && !l.spoken).at(-1)!]
    : [all.find((l) => l.slug === "aura-farming")!, all.find((l) => l.slug === "taunt-5")!];
  const jobs: [Line, CandidateId, string][] = [];
  for (const l of picks)
    for (const c of Object.keys(CANDIDATES) as CandidateId[]) for (const o of voiceOptions(c, l.role)) jobs.push([l, c, o]);
  const auditions: Render[] = [];
  await pool(jobs, 3, async ([l, c, o]) => {
    auditions.push(await render(l, c, o, 0, path.join(OUT, "sample", "audition", `${l.role}-${c}-${o}.mp3`), state));
  });
  // Keep the best voice option per role and candidate (highest min axis, then mean).
  const results: Render[] = [];
  for (const l of picks)
    for (const c of Object.keys(CANDIDATES) as CandidateId[]) {
      const w = winner(auditions.filter((r) => r.role === l.role && r.candidate === c));
      if (!w) continue;
      const dest = path.join(OUT, "sample", `${l.role}-${l.slug}-${c}.mp3`);
      copyFileSync(w.file, dest);
      state.pick[`${l.role}:${c}`] = voiceOptions(c, l.role).find((o) => w.voice === o || w.voice.startsWith(`designed ${o} `))!;
      results.push({ ...w, file: dest });
    }
  const cur = loadState();
  const kept = role ? cur.sample.filter((r) => r.role !== role) : [];
  const keptAud = role ? ((cur as any).auditions ?? []) : [];
  cur.pick = { ...cur.pick, ...state.pick };
  cur.voices = { ...state.voices, ...cur.voices };
  (cur as any).auditions = [...keptAud, ...auditions.map((a) => ({ file: path.relative(ROOT, a.file), voice: a.voice, scores: a.scores }))];
  cur.sample = [...kept, ...results].sort((a, b) => a.file.localeCompare(b.file));
  saveState(cur);
  const state2 = cur;
  writeSample(state2);
  console.log(readFileSync(path.join(OUT, "SAMPLE.md"), "utf8"));
}

function writeSample(state: State) {
  const rows = state.sample.map(
    (r) =>
      `| ${path.relative(OUT, r.file)} | ${r.role} | ${r.model} | ${r.candidate === "gradium" ? r.voice : `${r.voice}, per line direction`} | ${fmt(r.scores)} |`,
  );
  writeFileSync(
    path.join(OUT, "SAMPLE.md"),
    `# Voice bake off sample\n\nOne announcer call (AURA FARMING), one Ninja taunt (Navigo? Never heard of it.) and one Boat Kid taunt (Aura is quiet.) per candidate, ` +
      `post processed (trim, atempo 1.08, slap reverb, compression, sub thump on the call). Judge ${JUDGE_MODEL}, 1 to 5, ship at 4 on every axis.\n\n` +
      `| file | role | model id | voice or direction | judge (energy, emotion, stereotype, genz) |\n|---|---|---|---|---|\n${rows.join("\n")}\n\n` +
      `Best candidate per role (mean over the sample): ${bestPerRole(state).map((b) => `${b.role} ${b.cands.join(" + ")}`).join(", ")}\n\n` +
      `## Auditions (every voice option tried, the best per candidate is the row above)\n\n| file | voice | judge |\n|---|---|---|\n` +
      ((state as any).auditions ?? []).map((x: any) => `| ${path.relative(OUT, path.join(ROOT, x.file))} | ${x.voice} | ${fmt(x.scores)} |`).join("\n") +
      "\n",
  );
}

function bestPerRole(state: State): { role: Role; cands: CandidateId[] }[] {
  const roles = [...new Set(["announcer", "ninja", ...state.sample.map((r) => r.role)])];
  return roles.map((role) => {
    const rs = state.sample.filter((r) => r.role === role && r.scores);
    const ranked = rs.map((r) => ({ c: r.candidate, m: mean(r.scores!) })).sort((a, b) => b.m - a.m);
    if (ranked.length === 0) return { role, cands: ["gemini-pro"] };
    // Close call (within 0.25 of the top mean): split the five variants between the two.
    // Every candidate within 0.25 of the top mean shares the five variants (a three way tie splits three ways).
    const cands = ranked.filter((r) => ranked[0].m - r.m <= 0.25).map((r) => r.c);
    return { role, cands };
  });
}

function only(): Set<string> | null {
  const a = process.argv.find((x) => x.startsWith("--only="));
  return a ? new Set(a.slice(7).split(",")) : null;
}

// --variants=3 when the clock is short (decision 16:40 allows it), default five.
const VARIANTS = Number(process.argv.find((x) => x.startsWith("--variants="))?.slice(11) ?? 5);
const CONCURRENCY = Number(process.argv.find((x) => x.startsWith("--concurrency="))?.slice(14) ?? 4);

async function batch() {
  const state = loadState();
  const best = Object.fromEntries(bestPerRole(state).map((b) => [b.role, b.cands])) as Record<Role, CandidateId[]>;
  // An unsampled character: the overall winner (gemini-3.8-flash-tts) and its designed Gradium voice share the variants.
  for (const l of lines()) best[l.role] ??= DESIGN[l.role] ? ["gemini-flash", "gradium"] : ["gemini-flash"];
  const filter = only();
  const jobs: [Line, number][] = [];
  for (const l of lines()) {
    if (filter && !filter.has(l.slug)) continue;
    const done = new Set((state.batch[keyFor(state, l)] ?? []).map((r) => path.basename(r.file)));
    // Resumable: a variant already rendered and judged is kept unless --force.
    for (let v = 1; v <= VARIANTS; v++) if (process.argv.includes("--force") || !done.has(`v${v}.mp3`)) jobs.push([l, v]);
  }
  console.log(`batch: ${jobs.length} renders, ${Object.entries(best).map(([r, c]) => `${r} ${c}`).join(", ")}`);
  const keys = new Map(jobs.map(([l]) => [l, keyFor(state, l)]));
  await pool(jobs, CONCURRENCY, async ([l, v]) => {
    const cands = best[l.role] ?? ["gemini-flash"];
    const cand = cands[(v - 1) % cands.length];
    const key = keys.get(l)!;
    const opt = state.pick[`${l.role}:${cand}`] ?? voiceOptions(cand, l.role)[0];
    const r = await render(l, cand, opt, v, path.join(OUT, key, `v${v}.mp3`), state);
    const cur = loadState();
    cur.batch[key] = [...(cur.batch[key] ?? []).filter((x) => x.file !== r.file), r];
    cur.voices = { ...state.voices, ...cur.voices };
    saveState(cur);
  });
  board();
}

// Rescue round: a line whose winner is under the ship threshold gets v6..v10, cycling the three
// candidates with a louder direction, and the winner is picked again over all ten.
async function rescue() {
  const state = loadState();
  const jobs: [Line, number, CandidateId][] = [];
  const order: CandidateId[] = ["gemini-flash", "gemini-pro", "gradium", "gemini-flash", "gemini-pro"];
  for (const l of lines()) {
    const rs = state.batch[keyFor(state, l)] ?? [];
    const w = winner(rs);
    if (!w || minAxis(w.scores!) >= SHIP) continue;
    const done = new Set(rs.map((r) => path.basename(r.file)));
    for (let v = 6; v <= 10; v++) if (!done.has(`v${v}.mp3`)) jobs.push([l, v, order[v - 6]]);
  }
  console.log(`rescue: ${jobs.length} renders`);
  await pool(jobs, 4, async ([l, v, cand]) => {
    const opt = state.pick[`${l.role}:${cand}`] ?? voiceOptions(cand, l.role)[0];
    const key = keyFor(state, l);
    const r = await render(l, cand, opt, v, path.join(OUT, key, `v${v}.mp3`), state);
    const cur = loadState();
    cur.batch[key] = [...(cur.batch[key] ?? []).filter((x) => x.file !== r.file), r];
    saveState(cur);
  });
  board();
}

// Where a line's variants live: the same character already voiced this exact text (under any
// slug or level) means reuse, so a cast that moves a line to another level re-keys it for free.
function keyFor(state: State, l: Line): string {
  const base = `${l.role}/${l.slug}`;
  const hit = Object.entries(state.batch).find(([k, rs]) => k.startsWith(`${l.role}/`) && rs.length > 0 && rs[0].text === l.text);
  if (hit) return hit[0];
  if (!state.batch[base] || state.batch[base].length === 0) return base;
  return `${base}-${createHash("sha1").update(l.text).digest("hex").slice(0, 6)}`;
}

function winner(rs: Render[]): Render | undefined {
  return rs
    .filter((r) => r.scores)
    .sort((a, b) => minAxis(b.scores!) - minAxis(a.scores!) || mean(b.scores!) - mean(a.scores!))[0];
}

function board() {
  const state = loadState();
  const indexPath = path.join(VOICE_DIR, "index.json");
  const index: Record<string, string> = existsSync(indexPath) ? JSON.parse(readFileSync(indexPath, "utf8")) : {};
  const md: string[] = [
    "# Voice board",
    "",
    `Judge ${JUDGE_MODEL}, 1 to 5 on energy (E), emotion (Em), stereotype (S), Gen Z hype (G). Ship at 4 on every axis. Winner: highest min axis, then mean.`,
    "",
  ];
  let pass = 0;
  let fail = 0;
  const below: string[] = [];
  for (const l of lines()) {
    const rs = (state.batch[keyFor(state, l)] ?? []).sort((a, b) => a.file.localeCompare(b.file, undefined, { numeric: true }));
    if (rs.length === 0) continue;
    const w = winner(rs);
    md.push(`## ${l.role} / ${l.slug}: "${l.text}"`, "", "| variant | model | voice | scores | min | |", "|---|---|---|---|---|---|");
    for (const r of rs) {
      md.push(`| ${path.basename(r.file)} | ${r.model} | ${r.voice} | ${fmt(r.scores)} | ${r.scores ? minAxis(r.scores) : "-"} | ${r === w ? "WINNER" : ""} |`);
    }
    md.push("");
    if (w) {
      const note = w.scores?.note ?? "";
      md.push(`Winner note: ${note}`, "");
      const fileName = `${l.indexId}.mp3`;
      copyFileSync(w.file, path.join(VOICE_DIR, fileName));
      index[l.indexId] = fileName;
      if (minAxis(w.scores!) >= SHIP) pass++;
      else {
        fail++;
        below.push(`${l.role}/${l.slug} (min ${minAxis(w.scores!)}: ${note})`);
      }
    }
  }
  for (const c of state.crowd) index[path.basename(c.file, ".mp3")] = path.basename(c.file);
  if (state.crowd.length) {
    md.push("## Crowd beds (Gradium Voice Design, fr and pt, layered and panned)", "", "| file | shouts |", "|---|---|");
    for (const c of state.crowd) md.push(`| ${path.relative(ROOT, c.file)} | ${c.shouts.join(" / ")} |`);
    md.push("");
  }
  md.splice(4, 0, `Shipped winners at or above threshold: ${pass}; below: ${fail}.`, "", ...(below.length ? ["Below threshold:", ...below.map((b) => `- ${b}`), ""] : []));
  writeFileSync(path.join(OUT, "BOARD.md"), `${clean(md.join("\n"))}\n`);
  // game.ts plays the taunt voices only when the index names the cast it was voiced from.
  const castTag = (JSON.parse(readFileSync(CAST_PATH, "utf8")) as { levels: { opponent?: { name?: string } }[] }).levels.some((l) => /BOAT KID/i.test(l.opponent?.name ?? ""))
    ? "roster-1625"
    : undefined;
  // "voice": "bakeoff-winner" gates intro, win, lose and taunts in game.ts; calls play from call-<slug>, ungated.
  const out: Record<string, string> = castTag ? { cast: castTag, voice: "bakeoff-winner" } : { voice: "bakeoff-winner" };
  const tags = new Set(["cast", "voice"]);
  for (const [k, v] of Object.entries(index)) {
    if (tags.has(k) || k.startsWith("v2-call-") || (castTag && k.startsWith("v2-boatkid-"))) continue;
    out[k] = v;
  }
  writeFileSync(indexPath, `${JSON.stringify(out, null, 1)}\n`);
  console.log(`board: pass ${pass}, below ${fail}`);
  for (const b of below) console.log(`  below: ${b}`);
}

const SHOUTS: { lang: "fr" | "pt"; text: string }[] = [
  { lang: "fr", text: "Vas-y, frappe !" },
  { lang: "fr", text: "C'est grave chaud !" },
  { lang: "fr", text: "Il est cuit !" },
  { lang: "fr", text: "Trop facile, ça !" },
  { lang: "fr", text: "Franchement énorme !" },
  { lang: "pt", text: "Isso aí!" },
  { lang: "pt", text: "Ele tá voando!" },
  { lang: "pt", text: "Que aura, cara!" },
  { lang: "pt", text: "Bora, é nosso!" },
];

async function crowd() {
  const state = loadState();
  const dir = path.join(OUT, "crowd");
  mkdirSync(dir, { recursive: true });
  mkdirSync(TMP, { recursive: true });
  const voiceKeys = { fr: ["crowd-fr-1", "crowd-fr-2", "crowd-fr-3"], pt: ["crowd-pt-1", "crowd-pt-2", "crowd-pt-3"] };
  for (const k of [...voiceKeys.fr, ...voiceKeys.pt]) await designVoice(k, state);
  // Each shout rendered by two voices of its language, so every bed has several people.
  const renders: { lang: string; text: string; file: string }[] = [];
  const jobs: { lang: "fr" | "pt"; text: string; key: string; i: number }[] = [];
  SHOUTS.forEach((s, i) => {
    const ks = voiceKeys[s.lang];
    jobs.push({ ...s, key: ks[i % 3], i }, { ...s, key: ks[(i + 1) % 3], i });
  });
  await pool(jobs, 2, async (j) => {
    const raw = path.join(TMP, `crowd-${j.key}-${j.i}.wav`);
    const out = path.join(dir, `${j.key}-${j.i}.wav`);
    if (!existsSync(out)) {
      await gradiumTts(state.voices[j.key].embedding_id, j.text, `crowd/${j.key}/${j.i}`, raw);
      execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-i", raw, "-af",
        "silenceremove=start_periods=1:start_threshold=-45dB,areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse,atempo=1.08", "-ar", "44100", "-ac", "1", out]);
    }
    renders.push({ lang: j.lang, text: j.text, file: out });
  });
  const beds: { name: string; langs: string[] }[] = [
    { name: "crowd-fr", langs: ["fr"] },
    { name: "crowd-br", langs: ["pt"] },
    { name: "crowd-mix", langs: ["fr", "pt"] },
  ];
  const crowdOut: State["crowd"] = [];
  for (const bed of beds) {
    const parts = renders.filter((r) => bed.langs.includes(r.lang)).sort((a, b) => a.file.localeCompare(b.file));
    const pick = bed.name === "crowd-mix" ? parts.filter((_, i) => i % 2 === 0) : parts;
    const args = ["-y", "-loglevel", "error"];
    const f: string[] = [];
    pick.forEach((p, i) => {
      args.push("-i", p.file);
      const delay = Math.round(((i * 173) % 1400) + (i % 3) * 60);
      const pan = [-0.8, 0.6, -0.3, 0.9, 0.1, -0.6, 0.4][i % 7];
      const l = (1 - pan) / 2;
      const r = (1 + pan) / 2;
      const vol = 0.55 + ((i * 37) % 30) / 100;
      f.push(`[${i}:a]adelay=${delay},volume=${vol.toFixed(2)},pan=stereo|c0=${l.toFixed(2)}*c0|c1=${r.toFixed(2)}*c0[a${i}]`);
    });
    const mixIn = pick.map((_, i) => `[a${i}]`).join("");
    f.push(
      `${mixIn}amix=inputs=${pick.length}:duration=longest:normalize=0,aecho=0.8:0.6:40|70:0.3|0.2,acompressor=threshold=-18dB:ratio=3:makeup=3,alimiter=limit=0.9,afade=t=out:st=2.2:d=0.6[o]`,
    );
    const out = path.join(VOICE_DIR, `${bed.name}.mp3`);
    args.push("-filter_complex", f.join(";"), "-map", "[o]", "-t", "2.8", "-ac", "2", "-ar", "44100", "-c:a", "libmp3lame", "-b:a", "96k", out);
    execFileSync("ffmpeg", args);
    crowdOut.push({ file: out, shouts: [...new Set(pick.map((p) => p.text))] });
    console.log(`crowd bed ${out}`);
  }
  const cur = loadState();
  cur.crowd = [...cur.crowd.filter((c) => /crowd-(six-seven|boat-kid)-/.test(c.file)), ...crowdOut];
  saveState(cur);
  board();
}

// The 67 crowd chant for the mash charge: every designed crowd voice plus the announcer voices
// chanting "six seven" in English, layered and panned, each repetition louder than the last.
async function chant() {
  const state = loadState();
  mkdirSync(TMP, { recursive: true });
  const dir = path.join(OUT, "crowd");
  mkdirSync(dir, { recursive: true });
  const keys = ["crowd-fr-1", "crowd-fr-2", "crowd-fr-3", "crowd-pt-1", "crowd-pt-2", "crowd-pt-3", "announcer-2", "announcer-3"];
  for (const k of keys) await designVoice(k, loadState());
  const fresh = loadState();
  // --chant=boat-kid for the Boat Kid's chant (decision 16:40), default the 67 chant.
  const which = process.argv.find((x) => x.startsWith("--chant="))?.slice(8) ?? "six-seven";
  const texts = which === "boat-kid" ? ["Aura! Aura!", "Boat kid! Boat kid!"] : ["Six seven!", "Six! Seven!"];
  const parts: string[] = [];
  const jobs = keys.flatMap((k, i) => [{ k, t: texts[i % 2], i }]);
  await pool(jobs, 2, async (j) => {
    const raw = path.join(TMP, `chant-${which}-${j.k}.wav`);
    const out = path.join(dir, `${which}-${j.k}.wav`);
    if (!existsSync(out)) {
      await gradiumTts(fresh.voices[j.k].embedding_id, j.t, `chant/${j.k}`, raw);
      execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-i", raw, "-af",
        "silenceremove=start_periods=1:start_threshold=-45dB,areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse,atempo=1.08", "-ar", "44100", "-ac", "1", out]);
    }
    parts.push(out);
  });
  parts.sort();
  // Two one shots: -1 one chant hit (all voices together), -2 a rising chant (three repetitions, louder each time).
  const beds: { name: string; reps: number }[] = [
    { name: `crowd-${which}-1`, reps: 1 },
    { name: `crowd-${which}-2`, reps: 3 },
  ];
  const made: State["crowd"] = [];
  for (const bed of beds) {
    const args = ["-y", "-loglevel", "error"];
    const f: string[] = [];
    let n = 0;
    for (let rep = 0; rep < bed.reps; rep++) {
      parts.forEach((p, i) => {
        args.push("-i", p);
        const delay = Math.round(rep * 900 + ((i * 53) % 160));
        const pan = [-0.8, 0.6, -0.3, 0.9, 0.1, -0.6, 0.4, -0.1][i % 8];
        const vol = (0.35 + 0.25 * rep) * (0.8 + ((i * 29) % 20) / 100);
        f.push(`[${n}:a]adelay=${delay},volume=${vol.toFixed(2)},pan=stereo|c0=${((1 - pan) / 2).toFixed(2)}*c0|c1=${((1 + pan) / 2).toFixed(2)}*c0[a${n}]`);
        n++;
      });
    }
    f.push(
      `${Array.from({ length: n }, (_, i) => `[a${i}]`).join("")}amix=inputs=${n}:duration=longest:normalize=0,aecho=0.8:0.6:40|70:0.3|0.2,acompressor=threshold=-18dB:ratio=3:makeup=3,alimiter=limit=0.92[o]`,
    );
    const out = path.join(VOICE_DIR, `${bed.name}.mp3`);
    args.push("-filter_complex", f.join(";"), "-map", "[o]", "-ac", "2", "-ar", "44100", "-c:a", "libmp3lame", "-b:a", "96k", out);
    execFileSync("ffmpeg", args);
    made.push({ file: out, shouts: [`${texts.join(" / ")} (8 voices, ${bed.reps === 1 ? "one hit" : "x3, rising"})`] });
    console.log(`chant ${out}`);
  }
  const cur = loadState();
  cur.crowd = [...cur.crowd.filter((c) => !c.file.includes(`crowd-${which}-`)), ...made];
  saveState(cur);
  board();
}

async function main() {
  mkdirSync(OUT, { recursive: true });
  const step = process.argv[2];
  if (step === "sample") await sample();
  else if (step === "batch") await batch();
  else if (step === "crowd") await crowd();
  else if (step === "chant") await chant();
  else if (step === "rescue") await rescue();
  else if (step === "board") {
    writeSample(loadState());
    board();
  }
  else throw new Error("usage: gen-voices-bakeoff.ts sample|batch|crowd|board [--only=slug,slug]");
  console.log(`Gradium credits spent (logged): ${spentSoFar()}`);
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : String(e));
  process.exit(1);
});
