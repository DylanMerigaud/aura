// Generates src/campaign.json for the 5 AURA levels: Gemini writes story, opponent, taunts,
// announcer lines and the QTE event script, this script sets the fixed numbers and validates
// and repairs the result. Run with: pnpm gen:campaign (add --force to bypass the response cache).

import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { Campaign, Dir, Level, QteEvent } from "../src/qte/types.js";
import { validateLevel } from "../src/qte/validate.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const CACHE_DIR = path.join(ROOT, ".cache", "gemini");
const VALID_DIRS: readonly Dir[] = ["up", "down", "left", "right"];

// Built from code points so this source file stays free of the characters it strips from Gemini's output.
const DASH_RE = new RegExp("[" + String.fromCharCode(0x2014) + String.fromCharCode(0x2013) + "]", "g");

interface LevelDef {
  id: number;
  title: string;
  place: string;
  artKey: string;
  bpm: number;
  windowScale: number;
  lengthBeats: number;
  seed: number;
  phase2Beat?: number;
  difficultyBrief: string;
  eventCountHint: number;
}

const LEVEL_DEFS: LevelDef[] = [
  {
    id: 1,
    title: "NPC",
    place: "Metro platform, 2am",
    artKey: "metro",
    bpm: 100,
    windowScale: 1.0,
    lengthBeats: 64,
    seed: 1,
    difficultyBrief:
      "Mostly HIT events spaced every 2 beats. Include exactly 2 MASH events of length 4, one HOLD event, and one COMBO event with 3 directions. Keep it simple and readable, this is the first fight.",
    eventCountHint: 20,
  },
  {
    id: 2,
    title: "Side character",
    place: "Kebab shop, 4am",
    artKey: "kebab",
    bpm: 110,
    windowScale: 0.9,
    lengthBeats: 72,
    seed: 2,
    difficultyBrief:
      "Rising density: HIT events every 1 to 2 beats, 2 to 3 MASH events of length 4 to 5, one or two HOLD events of length 1 to 2, one or two COMBO events with 3 directions.",
    eventCountHint: 26,
  },
  {
    id: 3,
    title: "Main character",
    place: "Rooftop",
    artKey: "rooftop",
    bpm: 120,
    windowScale: 0.8,
    lengthBeats: 80,
    seed: 3,
    difficultyBrief:
      "Higher density: HIT events on consecutive beats in places, 3 MASH events of length 5 to 6, two HOLD events of length 2 to 3, two COMBO events with 3 to 4 directions.",
    eventCountHint: 32,
  },
  {
    id: 4,
    title: "Sigma",
    place: "Club",
    artKey: "club",
    bpm: 128,
    windowScale: 0.7,
    lengthBeats: 88,
    seed: 4,
    difficultyBrief:
      "High density: HIT events on consecutive beats in bursts, 3 to 4 MASH events of length 6 to 7, two to three HOLD events of length 3, three COMBO events with 4 directions.",
    eventCountHint: 38,
  },
  {
    id: 5,
    title: "Aura 9000",
    place: "Voodoo stage, final boss",
    artKey: "stage",
    bpm: 136,
    windowScale: 0.6,
    lengthBeats: 112,
    seed: 5,
    phase2Beat: 56,
    difficultyBrief:
      "Maximum density across both phases: HIT events on consecutive beats throughout, several MASH events of length 6 to 8, several HOLD events of length 3 to 4, several COMBO events with 4 directions. Escalate further after the phase 2 drop at beat 56.",
    eventCountHint: 48,
  },
];

const LEVEL_SCHEMA = {
  type: "object",
  properties: {
    story: {
      type: "array",
      items: { type: "string" },
      minItems: 2,
      maxItems: 2,
      description: "Exactly 2 short punchy lines setting up the fight.",
    },
    opponent: {
      type: "object",
      properties: {
        name: { type: "string" },
        persona: { type: "string", description: "One line persona." },
        color: { type: "string", description: "A neon hex color, like #35e0ff." },
      },
      required: ["name", "persona", "color"],
    },
    taunts: {
      type: "array",
      minItems: 3,
      maxItems: 3,
      items: {
        type: "object",
        properties: {
          beat: { type: "integer", description: "Integer beat when this taunt fires." },
          text: { type: "string" },
        },
        required: ["beat", "text"],
      },
    },
    announcer: {
      type: "object",
      properties: {
        intro: { type: "string" },
        win: { type: "string" },
        lose: { type: "string" },
      },
      required: ["intro", "win", "lose"],
    },
    events: {
      type: "array",
      description: "The QTE script, in beat order.",
      items: {
        type: "object",
        properties: {
          type: { type: "string", enum: ["hit", "mash", "hold", "combo"] },
          beat: { type: "integer" },
          dir: {
            type: "string",
            enum: ["up", "down", "left", "right"],
            description: "Only for type hit.",
          },
          length: {
            type: "integer",
            description: "Only for type mash (3 to 8) or hold (1 to 4).",
          },
          dirs: {
            type: "array",
            items: { type: "string", enum: ["up", "down", "left", "right"] },
            description: "Only for type combo, 3 or 4 directions.",
          },
        },
        required: ["type", "beat"],
      },
    },
  },
  required: ["story", "opponent", "taunts", "announcer", "events"],
};

function getApiKeyAndModel(): { apiKey: string; model: string } {
  try {
    const apiKey = execFileSync(
      "security",
      ["find-generic-password", "-s", "gemini-api-key-hackathon", "-a", "dylanmerigaud", "-w"],
      { encoding: "utf8" }
    ).trim();
    if (apiKey) return { apiKey, model: "gemini-3.8-flash" };
  } catch {
    // fall through to the fallback key below
  }
  try {
    const apiKey = execFileSync(
      "security",
      ["find-generic-password", "-s", "gemini-api-key", "-a", "dylanmerigaud", "-w"],
      { encoding: "utf8" }
    ).trim();
    if (apiKey) return { apiKey, model: "gemini-3.5-flash-lite" };
  } catch {
    // no fallback key either
  }
  throw new Error(
    "No Gemini API key found in the keychain (checked gemini-api-key-hackathon and gemini-api-key)."
  );
}

function buildPrompt(def: LevelDef, previousErrors?: string[]): string {
  const lines: string[] = [];
  lines.push(
    `You are writing content for level ${def.id} of a browser rhythm QTE "aura battle" game called AURA.`
  );
  lines.push(`Setting: ${def.place}. The level title unlocked on win is "${def.title}".`);
  lines.push(`Song: bpm ${def.bpm}, length ${def.lengthBeats} beats.`);
  if (def.phase2Beat !== undefined) {
    lines.push(
      `This is the final boss. At beat ${def.phase2Beat} the music drops an octave and the camera goes handheld, phase 2 starts.`
    );
  }
  lines.push("");
  lines.push("Write:");
  lines.push("- story: exactly 2 short punchy lines setting up the fight.");
  lines.push("- opponent: a name, a one line persona, and a neon hex color like #35e0ff.");
  lines.push(
    `- taunts: exactly 3 short, funny, Gen Z aura and cringe humor taunts in English, PG-13, each with an integer beat between 0 and ${def.lengthBeats} when it fires.`
  );
  lines.push("- announcer: intro, win and lose lines for the fight.");
  lines.push("- events: the QTE script, an array of timed inputs on the beat grid.");
  lines.push("");
  lines.push("Event types:");
  lines.push('- hit: type "hit", beat N, dir one of up, down, left, right: a single press on beat N.');
  lines.push(
    '- mash: type "mash", beat N, length L (3 to 8): alternate left and right from beat N for L beats.'
  );
  lines.push('- hold: type "hold", beat N, length L (1 to 4): hold from beat N to beat N plus L.');
  lines.push(
    '- combo: type "combo", beat N, dirs an array of 3 or 4 directions in order, shown 2 beats ahead, judged on beat N.'
  );
  lines.push("");
  lines.push("Hard rules for events:");
  lines.push(
    `- Every beat must be an integer. The first event must not start before beat 8. The last event must end at least 4 beats before beat ${def.lengthBeats} (so no later than beat ${
      def.lengthBeats - 4
    }).`
  );
  lines.push("- Sort events by beat, ascending.");
  lines.push(
    "- At most one event per beat, and events must never overlap: a mash or hold occupies beat through beat plus length, a combo occupies (beat minus dirs length plus 1) through beat, a hit occupies only beat."
  );
  lines.push("- Use a mix of all 4 directions across the level, not just one or two.");
  lines.push(
    "- Never use an em dash or en dash character anywhere in any text field. Use a comma or start a new sentence instead."
  );
  lines.push("");
  lines.push("Difficulty brief for this level: " + def.difficultyBrief);
  lines.push(`Aim for roughly ${def.eventCountHint} events total.`);
  if (previousErrors && previousErrors.length > 0) {
    lines.push("");
    lines.push("Your previous attempt had these problems. Fix every one of them in this new attempt:");
    for (const err of previousErrors) lines.push("- " + err);
  }
  lines.push("");
  lines.push("Respond with JSON matching the given schema only.");
  return lines.join("\n");
}

let geminiCallCount = 0;

async function callGemini(params: {
  apiKey: string;
  model: string;
  prompt: string;
  force: boolean;
}): Promise<any> {
  const { apiKey, model, prompt, force } = params;
  const hash = createHash("sha256").update(JSON.stringify({ model, prompt, schema: LEVEL_SCHEMA })).digest("hex");
  const cacheFile = path.join(CACHE_DIR, `${hash}.json`);

  if (!force && existsSync(cacheFile)) {
    return JSON.parse(readFileSync(cacheFile, "utf8"));
  }

  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
    method: "POST",
    headers: { "x-goog-api-key": apiKey, "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
        responseJsonSchema: LEVEL_SCHEMA,
        thinkingConfig: { thinkingLevel: "low" },
      },
    }),
  });
  geminiCallCount++;

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Gemini request failed: ${res.status} ${res.statusText}: ${body}`);
  }

  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (typeof text !== "string") {
    throw new Error("Gemini response had no text output.");
  }
  const parsed = JSON.parse(text);

  mkdirSync(CACHE_DIR, { recursive: true });
  writeFileSync(cacheFile, JSON.stringify(parsed, null, 1));
  return parsed;
}

function normalizeEvent(e: any): QteEvent {
  const beat = Math.round(e.beat);
  if (e.type === "hit") return { type: "hit", beat, dir: e.dir };
  if (e.type === "mash") return { type: "mash", beat, length: Math.round(e.length) };
  if (e.type === "hold") return { type: "hold", beat, length: Math.round(e.length) };
  if (e.type === "combo") return { type: "combo", beat, dirs: e.dirs };
  throw new Error(`unknown event type from Gemini: ${JSON.stringify(e)}`);
}

function mergeIntoLevel(def: LevelDef, generated: any): Level {
  const level: Level = {
    id: def.id,
    title: def.title,
    place: def.place,
    artKey: def.artKey,
    story: [String(generated.story[0]), String(generated.story[1])],
    opponent: {
      name: String(generated.opponent.name),
      persona: String(generated.opponent.persona),
      color: String(generated.opponent.color),
    },
    taunts: generated.taunts.map((t: any) => ({ beat: Math.round(t.beat), text: String(t.text) })),
    announcer: {
      intro: String(generated.announcer.intro),
      win: String(generated.announcer.win),
      lose: String(generated.announcer.lose),
    },
    bpm: def.bpm,
    windowScale: def.windowScale,
    lengthBeats: def.lengthBeats,
    seed: def.seed,
    events: generated.events.map(normalizeEvent),
  };
  if (def.phase2Beat !== undefined) {
    level.phase2Beat = def.phase2Beat;
  }
  return level;
}

function stripDashes(s: string): string {
  return s.replace(DASH_RE, ",");
}

function sanitizeLevel(level: Level): void {
  level.title = stripDashes(level.title);
  level.place = stripDashes(level.place);
  level.story = [stripDashes(level.story[0]), stripDashes(level.story[1])];
  level.opponent.name = stripDashes(level.opponent.name);
  level.opponent.persona = stripDashes(level.opponent.persona);
  level.opponent.color = stripDashes(level.opponent.color);
  level.taunts = level.taunts.map((t) => ({ beat: t.beat, text: stripDashes(t.text) }));
  level.announcer.intro = stripDashes(level.announcer.intro);
  level.announcer.win = stripDashes(level.announcer.win);
  level.announcer.lose = stripDashes(level.announcer.lose);
}

function isEventFieldsValid(e: QteEvent): boolean {
  if (!Number.isInteger(e.beat)) return false;
  if (e.type === "hit") return VALID_DIRS.includes(e.dir);
  if (e.type === "mash") return Number.isInteger(e.length) && e.length >= 3 && e.length <= 8;
  if (e.type === "hold") return Number.isInteger(e.length) && e.length >= 1 && e.length <= 4;
  if (e.type === "combo") {
    return (
      Array.isArray(e.dirs) &&
      e.dirs.length >= 3 &&
      e.dirs.length <= 4 &&
      e.dirs.every((d) => VALID_DIRS.includes(d))
    );
  }
  return false;
}

function localOccupation(e: QteEvent): [number, number] {
  if (e.type === "hit") return [e.beat, e.beat];
  if (e.type === "mash" || e.type === "hold") return [e.beat, e.beat + e.length];
  return [e.beat - e.dirs.length + 1, e.beat];
}

/** Drops any taunt or event the validator would still reject, greedily, in beat order. Returns what was dropped. */
function repairLevel(level: Level): string[] {
  const dropped: string[] = [];
  const lo = 8;
  const hi = level.lengthBeats - 4;

  level.taunts = level.taunts.filter((t) => {
    const ok = Number.isInteger(t.beat) && t.beat >= 0 && t.beat <= level.lengthBeats;
    if (!ok) dropped.push(`taunt "${t.text}" at beat ${t.beat} (outside the song)`);
    return ok;
  });

  const sortedEvents = [...level.events].sort((a, b) => a.beat - b.beat);
  const kept: QteEvent[] = [];
  let lastEnd = -Infinity;

  for (const e of sortedEvents) {
    if (!isEventFieldsValid(e)) {
      dropped.push(`${e.type} at beat ${e.beat} (invalid fields)`);
      continue;
    }
    const [start, end] = localOccupation(e);
    if (start < lo || end > hi) {
      dropped.push(`${e.type} at beat ${e.beat} (outside the ${lo} to ${hi} window)`);
      continue;
    }
    if (start <= lastEnd) {
      dropped.push(`${e.type} at beat ${e.beat} (overlaps a previous kept event)`);
      continue;
    }
    kept.push(e);
    lastEnd = end;
  }

  level.events = kept;
  return dropped;
}

async function generateLevel(def: LevelDef, apiKey: string, model: string, force: boolean): Promise<Level> {
  let prompt = buildPrompt(def);
  let generated = await callGemini({ apiKey, model, prompt, force });
  let level = mergeIntoLevel(def, generated);
  sanitizeLevel(level);
  let errors = validateLevel(level);

  if (errors.length > 0) {
    console.log(`Level ${def.id}: first attempt had ${errors.length} problem(s), re-asking Gemini once.`);
    prompt = buildPrompt(def, errors);
    generated = await callGemini({ apiKey, model, prompt, force });
    level = mergeIntoLevel(def, generated);
    sanitizeLevel(level);
    errors = validateLevel(level);
  }

  if (errors.length > 0) {
    console.log(`Level ${def.id}: second attempt still had ${errors.length} problem(s), repairing deterministically.`);
    const dropped = repairLevel(level);
    for (const d of dropped) console.log(`  dropped ${d}`);
    const finalErrors = validateLevel(level);
    if (finalErrors.length > 0) {
      throw new Error(`Level ${def.id} still invalid after repair: ${finalErrors.join("; ")}`);
    }
  }

  return level;
}

async function main(): Promise<void> {
  const force = process.argv.includes("--force");
  const { apiKey, model } = getApiKeyAndModel();

  const levels: Level[] = [];
  for (const def of LEVEL_DEFS) {
    const level = await generateLevel(def, apiKey, model, force);
    levels.push(level);
  }

  const campaign: Campaign = { levels };
  writeFileSync(path.join(ROOT, "src", "campaign.json"), JSON.stringify(campaign, null, 1) + "\n");

  console.log(`Wrote src/campaign.json with ${levels.length} levels using model ${model}.`);
  console.log(`Gemini calls made: ${geminiCallCount}`);
  for (const level of levels) {
    console.log(`- level ${level.id} "${level.title}": opponent ${level.opponent.name}, ${level.events.length} events`);
  }
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : String(err));
  process.exit(1);
});
