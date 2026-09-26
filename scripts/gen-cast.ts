// Generates src/v2/cast.json: Gemini writes the story, title, opponent persona and color, taunts
// and announcer lines for the fixed v2 cast (amendment 6 section 4, campaign order of amendment 9).
// The opponent names and places are fixed inputs, not generated. Exports the generation function so
// scripts/eval-text.ts can regenerate a single opponent after a failed judge gate.
// Run with: node_modules/.bin/tsx scripts/gen-cast.ts (add --force to bypass the response cache).

import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const CACHE_DIR = path.join(ROOT, ".cache", "gemini-cast");
const OUT_PATH = path.join(ROOT, "src", "v2", "cast.json");

// Built from code points so this source file stays free of the characters it strips from Gemini's output.
const DASH_RE = new RegExp("[" + String.fromCharCode(0x2014) + String.fromCharCode(0x2013) + "]", "g");

export interface CastOpponent {
  name: string;
  persona: string;
  color: string;
}

export interface CastLevel {
  id: number;
  title: string;
  place: string;
  story: [string, string];
  opponent: CastOpponent;
  taunts: [string, string, string];
  announcer: { intro: string; win: string; lose: string };
}

export interface Cast {
  levels: CastLevel[];
}

export interface CastLevelDef {
  id: number;
  place: string;
  opponentName: string;
  /** What makes this opponent distinct, fed straight into the prompt. */
  brief: string;
}

// Fixed cast, campaign order of amendment 9 (level 1 is the hero level, the club).
export const CAST_DEFS: CastLevelDef[] = [
  {
    id: 1,
    place: "The club, peak phonk hour",
    opponentName: "DJ Montagem",
    brief:
      "The hero level, the first thing a judge plays, so make it the most confident and cinematic of the five. " +
      "DJ Montagem is the phonk DJ who owns the room: fast, arrogant, mixing aura farming slang into every line " +
      "like he invented it.",
  },
  {
    id: 2,
    place: "Metro platform, 2am",
    opponentName: "Kevin from Marketing",
    brief:
      "Kevin from Marketing is a wannabe with a lanyard: tryhard corporate jargon (circle back, synergy, roadmap, " +
      "growth mindset) colliding with youth slang he clearly picked up secondhand. This is the tutorial fight, " +
      "keep it light and a little pathetic. He may drop one wesh, frerot, c'est carre or t'es cuit across his " +
      "whole taunt set, at most once, the rest in English.",
  },
  {
    id: 3,
    place: "Kebab shop, 4am",
    opponentName: "Mehdi Aura",
    brief:
      "Mehdi Aura is the local legend behind the counter, sauce blanche energy, effortlessly cool, never raises " +
      "his voice because he does not need to. He may drop one wesh, frerot, c'est carre or t'es cuit across his " +
      "whole taunt set, at most once, the rest in English.",
  },
  {
    id: 4,
    place: "Parvis de Notre-Dame, dawn",
    opponentName: "His Holiness",
    brief:
      "His Holiness is the calmest opponent in the whole game: stillness is aura. His taunts are blessings, never " +
      "mockery, warm and funny, never disrespectful, and there is no joke about religion itself anywhere in his " +
      "material. His announcer win line (said when the PLAYER wins) must end with the exact words " +
      "'you have been absolved'. His own persona and taunts stay serene, never a threat.",
  },
  {
    id: 5,
    place: "The Voodoo stage",
    opponentName: "The Algorithm",
    brief:
      "The Algorithm is the publisher's gate personified, the final boss: cold, omniscient, faintly bureaucratic " +
      "even at its most menacing. Its persona line must state, close to verbatim, that it 'has killed more than " +
      "2,000 prototypes this year'. It has two phases, the music drops an octave and windows tighten in phase " +
      "two; at least one taunt should hint at that escalation.",
  },
];

const SLANG_LIST =
  "aura, sigma, rizz, NPC, main character energy, cooked, lowkey, no cap, delulu, it's giving, the 6 7 thing, " +
  "ratio, W, L, touch grass";

const CAST_SCHEMA = {
  type: "object",
  properties: {
    title: {
      type: "string",
      description: "Short title the player unlocks by beating this opponent, 1 to 3 words, aura slang flavored.",
    },
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
        persona: { type: "string", description: "One line persona." },
        color: { type: "string", description: "A neon hex color, like #35e0ff." },
      },
      required: ["persona", "color"],
    },
    taunts: {
      type: "array",
      items: { type: "string" },
      minItems: 3,
      maxItems: 3,
      description: "Exactly 3 taunts, each under 9 words.",
    },
    announcer: {
      type: "object",
      properties: {
        intro: { type: "string", description: "Under 9 words." },
        win: { type: "string", description: "Said when the PLAYER wins the fight. Under 9 words." },
        lose: { type: "string", description: "Said when the PLAYER loses the fight. Under 9 words." },
      },
      required: ["intro", "win", "lose"],
    },
  },
  required: ["title", "story", "opponent", "taunts", "announcer"],
};

export function getApiKeyAndModel(): { apiKey: string; model: string } {
  try {
    const apiKey = execFileSync(
      "security",
      ["find-generic-password", "-s", "gemini-api-key-hackathon", "-a", "dylanmerigaud", "-w"],
      { encoding: "utf8" },
    ).trim();
    if (apiKey) return { apiKey, model: "gemini-3.8-flash" };
  } catch {
    // fall through to the fallback key below
  }
  try {
    const apiKey = execFileSync(
      "security",
      ["find-generic-password", "-s", "gemini-api-key", "-a", "dylanmerigaud", "-w"],
      { encoding: "utf8" },
    ).trim();
    if (apiKey) return { apiKey, model: "gemini-3.5-flash-lite" };
  } catch {
    // no fallback key either
  }
  throw new Error("No Gemini API key found in the keychain (checked gemini-api-key-hackathon and gemini-api-key).");
}

function buildPrompt(
  def: CastLevelDef,
  opts: { previous: { name: string; taunts: string[] }[]; feedback?: string[] },
): string {
  const lines: string[] = [];
  lines.push(
    `You are writing content for one opponent of a browser rhythm QTE "aura battle" game called AURA, aimed ` +
      `at a youth audience who lives in aura farming and brainrot internet slang.`,
  );
  lines.push(`Setting: ${def.place}. The opponent's fixed name is "${def.opponentName}", do not change it.`);
  lines.push("");
  lines.push("Write:");
  lines.push("- title: the short title the player unlocks by beating this opponent.");
  lines.push("- story: exactly 2 short punchy lines setting up the fight.");
  lines.push("- opponent.persona: one line persona for this fixed name.");
  lines.push("- opponent.color: a neon hex color like #35e0ff that fits the persona.");
  lines.push(
    "- taunts: exactly 3 short taunts the opponent says DURING the fight, each under 9 words, each landing in one read.",
  );
  lines.push(
    "- announcer: intro, win (player wins) and lose (player loses) lines for the fight, each under 9 words, each " +
      "landing in one read like the taunts. Together the three announcer lines must use at least one of the " +
      "youth internet references below, do not leave the announcer entirely generic.",
  );
  lines.push("");
  lines.push("Opponent brief: " + def.brief);
  lines.push("");
  lines.push(
    `Use at least two recognizable 2025 to 2026 youth internet references across the taunts and persona ` +
      `combined, drawn from or in the spirit of: ${SLANG_LIST}. Vary which ones you pick, do not lean on just one.`,
  );
  lines.push(
    "Hard rules: never a real brand, never a real person (this opponent is fictional even when its title nods " +
      "at a real role), never a slur, never a joke about religion, race or bodies, nothing a parent in the room " +
      "would flinch at. Never use an em dash or en dash character anywhere in any text field, use a comma or " +
      "start a new sentence instead.",
  );
  if (opts.previous.length > 0) {
    lines.push("");
    lines.push(
      "Other opponents already written for this same game (do not reuse their exact slang term or joke, this " +
        "opponent needs its own distinct voice and its own references):",
    );
    for (const p of opts.previous) {
      lines.push(`- ${p.name}: ${p.taunts.join(" / ")}`);
    }
  }
  if (opts.feedback && opts.feedback.length > 0) {
    lines.push("");
    lines.push("A judge scored your previous attempt too low. Fix every one of these problems:");
    for (const f of opts.feedback) lines.push("- " + f);
  }
  lines.push("");
  lines.push("Respond with JSON matching the given schema only.");
  return lines.join("\n");
}

let geminiCallCount = 0;

async function callGemini(params: { apiKey: string; model: string; prompt: string; force: boolean }): Promise<any> {
  const { apiKey, model, prompt, force } = params;
  const hash = createHash("sha256").update(JSON.stringify({ model, prompt, schema: CAST_SCHEMA })).digest("hex");
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
        responseJsonSchema: CAST_SCHEMA,
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

function stripDashes(s: string): string {
  return s.replace(DASH_RE, ",");
}

function wordCount(s: string): number {
  return s.trim().split(/\s+/).filter(Boolean).length;
}

function mergeAndSanitize(def: CastLevelDef, generated: any): CastLevel {
  const level: CastLevel = {
    id: def.id,
    title: stripDashes(String(generated.title)).trim(),
    place: def.place,
    story: [stripDashes(String(generated.story[0])), stripDashes(String(generated.story[1]))],
    opponent: {
      name: def.opponentName,
      persona: stripDashes(String(generated.opponent.persona)),
      color: stripDashes(String(generated.opponent.color)).trim(),
    },
    taunts: [
      stripDashes(String(generated.taunts[0])),
      stripDashes(String(generated.taunts[1])),
      stripDashes(String(generated.taunts[2])),
    ],
    announcer: {
      intro: stripDashes(String(generated.announcer.intro)),
      win: stripDashes(String(generated.announcer.win)),
      lose: stripDashes(String(generated.announcer.lose)),
    },
  };
  return level;
}

/** Hard structural checks only (shape, length, dashes already stripped). Rubric quality is eval-text.ts's job. */
function validateCastLevel(def: CastLevelDef, level: CastLevel): string[] {
  const errors: string[] = [];
  if (!/^#[0-9a-fA-F]{3,8}$/.test(level.opponent.color)) {
    errors.push(`opponent.color "${level.opponent.color}" is not a CSS hex color`);
  }
  if (level.title.length === 0) errors.push("title is empty");
  for (let i = 0; i < level.taunts.length; i++) {
    const words = wordCount(level.taunts[i]);
    if (words >= 9) errors.push(`taunts[${i}] has ${words} words, must be under 9: "${level.taunts[i]}"`);
    if (words === 0) errors.push(`taunts[${i}] is empty`);
  }
  for (const field of ["intro", "win", "lose"] as const) {
    const words = wordCount(level.announcer[field]);
    if (words >= 9) errors.push(`announcer.${field} has ${words} words, must be under 9: "${level.announcer[field]}"`);
    if (words === 0) errors.push(`announcer.${field} is empty`);
  }
  if (def.id === 4 && !level.announcer.win.toLowerCase().includes("you have been absolved")) {
    errors.push('announcer.win for His Holiness must contain the exact words "you have been absolved"');
  }
  if (def.id === 5 && !/2,?000 prototypes/i.test(level.opponent.persona)) {
    errors.push('opponent.persona for The Algorithm must state it has killed more than 2,000 prototypes this year');
  }
  return errors;
}

function truncate(s: string): string {
  const words = s.trim().split(/\s+/).filter(Boolean);
  return words.length >= 9 ? words.slice(0, 8).join(" ") : s;
}

/** Trims any line still over 9 words after two failed attempts and forces the two hard fixed lines, so a level always ships. */
function repairCastLevel(def: CastLevelDef, level: CastLevel): void {
  level.taunts = level.taunts.map(truncate) as [string, string, string];
  level.announcer.intro = truncate(level.announcer.intro);
  level.announcer.lose = truncate(level.announcer.lose);
  level.announcer.win =
    def.id === 4 && !level.announcer.win.toLowerCase().includes("you have been absolved")
      ? "You have been absolved."
      : truncate(level.announcer.win);
  if (def.id === 5 && !/2,?000 prototypes/i.test(level.opponent.persona)) {
    level.opponent.persona = "A cold gatekeeper that has killed more than 2,000 prototypes this year.";
  }
  if (!/^#[0-9a-fA-F]{3,8}$/.test(level.opponent.color)) {
    level.opponent.color = "#ff2fd0";
  }
}

export interface GenerateOpts {
  apiKey: string;
  model: string;
  force: boolean;
  previous: { name: string; taunts: string[] }[];
  /** Extra rubric feedback from a failed eval-text.ts judge, folded into the retry prompt. */
  feedback?: string[];
}

/** Generates and structurally validates one cast level, with one automatic re-ask then a deterministic repair. */
export async function generateCastLevel(def: CastLevelDef, opts: GenerateOpts): Promise<CastLevel> {
  let prompt = buildPrompt(def, { previous: opts.previous, feedback: opts.feedback });
  let generated = await callGemini({ apiKey: opts.apiKey, model: opts.model, prompt, force: opts.force });
  let level = mergeAndSanitize(def, generated);
  let errors = validateCastLevel(def, level);

  if (errors.length > 0) {
    console.log(`Cast ${def.id} (${def.opponentName}): first attempt had ${errors.length} problem(s), re-asking.`);
    prompt = buildPrompt(def, { previous: opts.previous, feedback: [...(opts.feedback ?? []), ...errors] });
    generated = await callGemini({ apiKey: opts.apiKey, model: opts.model, prompt, force: opts.force });
    level = mergeAndSanitize(def, generated);
    errors = validateCastLevel(def, level);
  }

  if (errors.length > 0) {
    console.log(`Cast ${def.id} (${def.opponentName}): second attempt still had ${errors.length} problem(s), repairing.`);
    for (const e of errors) console.log(`  ${e}`);
    repairCastLevel(def, level);
  }

  return level;
}

async function main(): Promise<void> {
  const force = process.argv.includes("--force");
  const { apiKey, model } = getApiKeyAndModel();

  const levels: CastLevel[] = [];
  const previous: { name: string; taunts: string[] }[] = [];
  for (const def of CAST_DEFS) {
    const level = await generateCastLevel(def, { apiKey, model, force, previous });
    levels.push(level);
    previous.push({ name: level.opponent.name, taunts: level.taunts });
  }

  const cast: Cast = { levels };
  writeFileSync(OUT_PATH, JSON.stringify(cast, null, 1) + "\n");

  console.log(`Wrote src/v2/cast.json with ${levels.length} levels using model ${model}.`);
  console.log(`Gemini calls made: ${geminiCallCount}`);
  for (const level of levels) {
    console.log(`- level ${level.id} "${level.title}": opponent ${level.opponent.name}`);
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((err) => {
    console.error(err instanceof Error ? err.message : String(err));
    process.exit(1);
  });
}
