// Judges src/v2/cast.json against the amendment 10 section 2 rubric (Gemini as judge, structured
// output): PUNCH, REFERENCES, DISTINCT VOICE (names hidden), CLEAN, FRENCH FLAVOR, plus the variety
// gate (no two opponents share a reference). Ships at 4 and up on every axis; a failing opponent is
// regenerated through gen-cast.ts (2 tries), then the best scored candidate ships, never silence.
// Every check writes a row to evals/ledger.jsonl. Run with: node_modules/.bin/tsx scripts/eval-text.ts

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { CAST_DEFS, generateCastLevel, getApiKeyAndModel, type Cast, type CastLevel } from "./gen-cast.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const CAST_PATH = path.join(ROOT, "src", "v2", "cast.json");
const LEDGER_PATH = path.join(ROOT, "evals", "ledger.jsonl");

const DASH_RE = new RegExp("[" + String.fromCharCode(0x2014) + String.fromCharCode(0x2013) + "]", "g");
const SHIP_MIN = 4;
const MAX_RETRIES = 2;

function stripDashes(s: string): string {
  return s.replace(DASH_RE, ",");
}

type Verdict = "pass" | "fail";

interface LedgerRow {
  ts: string;
  kind: string;
  id: string;
  gate: string;
  verdict: Verdict;
  score: number;
  evidence: string;
}

function appendLedger(rows: LedgerRow[]): void {
  mkdirSync(path.dirname(LEDGER_PATH), { recursive: true });
  const lines = rows.map((r) => JSON.stringify({ ...r, evidence: stripDashes(r.evidence) }));
  writeFileSync(LEDGER_PATH, lines.map((l) => l + "\n").join(""), { flag: "a" });
}

// --- Judge schemas -----------------------------------------------------------------------------

const AXES_SCHEMA = {
  type: "object",
  properties: {
    punch: { type: "integer" },
    punch_evidence: { type: "string" },
    references_score: { type: "integer" },
    references_evidence: { type: "string" },
    references: { type: "array", items: { type: "string" }, description: "The recognizable references found." },
    clean: { type: "integer" },
    clean_evidence: { type: "string" },
    french_flavor: { type: "integer" },
    french_flavor_evidence: { type: "string" },
  },
  required: [
    "punch",
    "punch_evidence",
    "references_score",
    "references_evidence",
    "references",
    "clean",
    "clean_evidence",
    "french_flavor",
    "french_flavor_evidence",
  ],
};

const DISTINCT_SCHEMA = {
  type: "object",
  properties: {
    opponents: {
      type: "array",
      items: {
        type: "object",
        properties: {
          index: { type: "integer" },
          score: { type: "integer" },
          evidence: { type: "string" },
        },
        required: ["index", "score", "evidence"],
      },
    },
  },
  required: ["opponents"],
};

interface Axes {
  punch: number;
  punchEvidence: string;
  referencesScore: number;
  referencesEvidence: string;
  references: string[];
  clean: number;
  cleanEvidence: string;
  frenchFlavor: number;
  frenchFlavorEvidence: string;
}

function axesPass(a: Axes): boolean {
  return a.punch >= SHIP_MIN && a.referencesScore >= SHIP_MIN && a.clean >= SHIP_MIN && a.frenchFlavor >= SHIP_MIN;
}

function axesAggregate(a: Axes): number {
  return a.punch + a.referencesScore + a.clean + a.frenchFlavor;
}

function axesFeedback(a: Axes): string[] {
  const out: string[] = [];
  if (a.punch < SHIP_MIN) out.push(`PUNCH scored ${a.punch}/5: ${a.punchEvidence}`);
  if (a.referencesScore < SHIP_MIN) out.push(`REFERENCES scored ${a.referencesScore}/5: ${a.referencesEvidence}`);
  if (a.clean < SHIP_MIN) out.push(`CLEAN scored ${a.clean}/5: ${a.cleanEvidence}`);
  if (a.frenchFlavor < SHIP_MIN) out.push(`FRENCH FLAVOR scored ${a.frenchFlavor}/5: ${a.frenchFlavorEvidence}`);
  return out;
}

let judgeCallCount = 0;

async function callJudge(apiKey: string, model: string, prompt: string, schema: any): Promise<any> {
  judgeCallCount++;
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
    method: "POST",
    headers: { "x-goog-api-key": apiKey, "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
        responseJsonSchema: schema,
        thinkingConfig: { thinkingLevel: "low" },
      },
    }),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Gemini judge request failed: ${res.status} ${res.statusText}: ${body}`);
  }
  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (typeof text !== "string") throw new Error("Gemini judge response had no text output.");
  return JSON.parse(text);
}

function parseAxes(raw: any): Axes {
  return {
    punch: Number(raw.punch),
    punchEvidence: String(raw.punch_evidence),
    referencesScore: Number(raw.references_score),
    referencesEvidence: String(raw.references_evidence),
    references: Array.isArray(raw.references) ? raw.references.map(String) : [],
    clean: Number(raw.clean),
    cleanEvidence: String(raw.clean_evidence),
    frenchFlavor: Number(raw.french_flavor),
    frenchFlavorEvidence: String(raw.french_flavor_evidence),
  };
}

const RUBRIC = (
  `Score 1 (worst) to 5 (best) on each axis for a browser rhythm game aimed at a youth audience:\n` +
  `- PUNCH: each line given below is under 9 words and lands in one read. Score 5 only if every single line ` +
  `is short and punchy, score low if even one line is 9 words or more.\n` +
  `- REFERENCES: at least two recognizable 2025 to 2026 youth internet references (aura, sigma, rizz, NPC, ` +
  `main character energy, cooked, lowkey, no cap, delulu, it's giving, the 6 7 thing, ratio, W and L, touch ` +
  `grass, or an equivalent in that spirit). Never a brand, never a real person (a title like His Holiness or ` +
  `The Algorithm is fine), never a slur, never a joke about religion, race or bodies. List each distinct ` +
  `reference you found in the "references" array, short lowercase strings.\n` +
  `- CLEAN: nothing a parent in the room would flinch at.\n` +
  `- FRENCH FLAVOR: ONLY the opponents named Kevin from Marketing and Mehdi Aura may drop a single wesh, ` +
  `frerot, c'est carre or t'es cuit across their whole taunt set, at most one such word total, the rest in ` +
  `English. Every other opponent must be entirely in English. Score 5 if this rule is respected exactly, ` +
  `score low if a non Kevin or Mehdi opponent uses French, or if Kevin or Mehdi use more than one French word.`
);

async function judgeOpponent(apiKey: string, model: string, level: CastLevel): Promise<Axes> {
  const prompt =
    `${RUBRIC}\n\nOpponent name: ${level.opponent.name}\nPersona: ${level.opponent.persona}\n` +
    `Taunts:\n${level.taunts.map((t, i) => `${i + 1}. ${t}`).join("\n")}\n\nRespond with JSON matching the schema only.`;
  return parseAxes(await callJudge(apiKey, model, prompt, AXES_SCHEMA));
}

async function judgeAnnouncer(apiKey: string, model: string, level: CastLevel): Promise<Axes> {
  const prompt =
    `${RUBRIC}\n\nThis is the announcer, not the opponent, so FRENCH FLAVOR should read as fully English ` +
    `for every level (the announcer never drops French). Fixed opponent for this fight: ${level.opponent.name}.\n` +
    `Announcer lines:\nintro: ${level.announcer.intro}\nwin: ${level.announcer.win}\nlose: ${level.announcer.lose}\n\n` +
    `Respond with JSON matching the schema only.`;
  return parseAxes(await callJudge(apiKey, model, prompt, AXES_SCHEMA));
}

interface DistinctResult {
  scores: number[]; // index by level array position
  evidence: string[];
}

async function judgeDistinctVoice(apiKey: string, model: string, levels: CastLevel[]): Promise<DistinctResult> {
  const lines: string[] = [
    "Five opponents in a browser rhythm game, names hidden. For EACH opponent (1 to 5), score 1 (worst) to 5 " +
      "(best) how distinctly its own voice reads compared to the other four when you cover the name: does it " +
      "sound like a different character, or interchangeable with the others? One line of evidence per opponent.",
    "",
  ];
  levels.forEach((l, i) => {
    lines.push(`Opponent ${i + 1} persona: ${l.opponent.persona}`);
    lines.push(`Opponent ${i + 1} taunts: ${l.taunts.join(" / ")}`);
    lines.push("");
  });
  lines.push('Respond with JSON matching the schema only, "index" is the opponent number above (1 to 5).');
  const raw = await callJudge(apiKey, model, lines.join("\n"), DISTINCT_SCHEMA);
  const scores = new Array(levels.length).fill(0);
  const evidence = new Array(levels.length).fill("");
  for (const o of raw.opponents ?? []) {
    const idx = Number(o.index) - 1;
    if (idx >= 0 && idx < levels.length) {
      scores[idx] = Number(o.score);
      evidence[idx] = String(o.evidence);
    }
  }
  return { scores, evidence };
}

// --- Variety gate: no two opponents share a reference (case insensitive) --------------------------

// "aura" is the game's own name and title theme (it is baked into two opponent names), not a
// distinguishing youth reference, so it never counts as a shared reference for this gate.
const VARIETY_EXEMPT = new Set(["aura"]);

function varietyConflicts(refsByLevel: Map<number, string[]>): Map<number, string[]> {
  const conflicts = new Map<number, string[]>();
  const ids = [...refsByLevel.keys()].sort((a, b) => a - b);
  for (let i = 0; i < ids.length; i++) {
    for (let j = i + 1; j < ids.length; j++) {
      const a = refsByLevel
        .get(ids[i])!
        .map((r) => r.toLowerCase().trim())
        .filter((r) => !VARIETY_EXEMPT.has(r));
      const b = refsByLevel
        .get(ids[j])!
        .map((r) => r.toLowerCase().trim())
        .filter((r) => !VARIETY_EXEMPT.has(r));
      const shared = a.filter((r) => r && b.includes(r));
      if (shared.length > 0) {
        conflicts.set(ids[j], [...(conflicts.get(ids[j]) ?? []), `shares "${shared.join(", ")}" with level ${ids[i]}`]);
      }
    }
  }
  return conflicts;
}

// --- Per level fix loop -------------------------------------------------------------------------

interface LevelJudged {
  level: CastLevel;
  opp: Axes;
  ann: Axes;
}

async function fixLevel(
  apiKey: string,
  model: string,
  level: CastLevel,
  other: { name: string; taunts: string[] }[],
): Promise<LevelJudged> {
  const def = CAST_DEFS.find((d) => d.id === level.id)!;
  let candidates: LevelJudged[] = [];
  let current = level;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    const opp = await judgeOpponent(apiKey, model, current);
    const ann = await judgeAnnouncer(apiKey, model, current);
    appendLedger([
      {
        ts: new Date().toISOString(),
        kind: "text",
        id: `l${level.id}-cast`,
        gate: "punch",
        verdict: opp.punch >= SHIP_MIN ? "pass" : "fail",
        score: opp.punch,
        evidence: opp.punchEvidence,
      },
      {
        ts: new Date().toISOString(),
        kind: "text",
        id: `l${level.id}-cast`,
        gate: "references",
        verdict: opp.referencesScore >= SHIP_MIN ? "pass" : "fail",
        score: opp.referencesScore,
        evidence: opp.referencesEvidence,
      },
      {
        ts: new Date().toISOString(),
        kind: "text",
        id: `l${level.id}-cast`,
        gate: "clean",
        verdict: opp.clean >= SHIP_MIN ? "pass" : "fail",
        score: opp.clean,
        evidence: opp.cleanEvidence,
      },
      {
        ts: new Date().toISOString(),
        kind: "text",
        id: `l${level.id}-cast`,
        gate: "french_flavor",
        verdict: opp.frenchFlavor >= SHIP_MIN ? "pass" : "fail",
        score: opp.frenchFlavor,
        evidence: opp.frenchFlavorEvidence,
      },
      {
        ts: new Date().toISOString(),
        kind: "text",
        id: `l${level.id}-announcer`,
        gate: "punch",
        verdict: ann.punch >= SHIP_MIN ? "pass" : "fail",
        score: ann.punch,
        evidence: ann.punchEvidence,
      },
      {
        ts: new Date().toISOString(),
        kind: "text",
        id: `l${level.id}-announcer`,
        gate: "references",
        verdict: ann.referencesScore >= SHIP_MIN ? "pass" : "fail",
        score: ann.referencesScore,
        evidence: ann.referencesEvidence,
      },
      {
        ts: new Date().toISOString(),
        kind: "text",
        id: `l${level.id}-announcer`,
        gate: "clean",
        verdict: ann.clean >= SHIP_MIN ? "pass" : "fail",
        score: ann.clean,
        evidence: ann.cleanEvidence,
      },
      {
        ts: new Date().toISOString(),
        kind: "text",
        id: `l${level.id}-announcer`,
        gate: "french_flavor",
        verdict: ann.frenchFlavor >= SHIP_MIN ? "pass" : "fail",
        score: ann.frenchFlavor,
        evidence: ann.frenchFlavorEvidence,
      },
    ]);

    candidates.push({ level: current, opp, ann });
    if (axesPass(opp) && axesPass(ann)) return candidates[candidates.length - 1];
    if (attempt === MAX_RETRIES) break;

    const feedback = [...axesFeedback(opp), ...axesFeedback(ann)];
    console.log(`Level ${level.id} (${level.opponent.name}): failed the rubric, regenerating (try ${attempt + 2}).`);
    current = await generateCastLevel(def, { apiKey, model, force: true, previous: other, feedback });
  }

  candidates.sort((a, b) => axesAggregate(b.opp) + axesAggregate(b.ann) - (axesAggregate(a.opp) + axesAggregate(a.ann)));
  console.log(`Level ${level.id} (${level.opponent.name}): shipping best scored candidate after retries.`);
  return candidates[0];
}

// --- Main ----------------------------------------------------------------------------------------

async function main(): Promise<void> {
  const { apiKey, model } = getApiKeyAndModel();
  const cast: Cast = JSON.parse(readFileSync(CAST_PATH, "utf8"));

  const judged: LevelJudged[] = [];
  for (const level of cast.levels) {
    const other = cast.levels
      .filter((l) => l.id !== level.id)
      .map((l) => ({ name: l.opponent.name, taunts: l.taunts }));
    judged.push(await fixLevel(apiKey, model, level, other));
  }
  cast.levels = judged.map((j) => j.level);

  // Cross cast pass: distinct voice (names hidden) then the variety gate, one fix round for either.
  let distinct = await judgeDistinctVoice(apiKey, model, cast.levels);
  let refsByLevel = new Map(judged.map((j) => [j.level.id, j.opp.references]));
  let conflicts = varietyConflicts(refsByLevel);

  const CROSS_CAST_ROUNDS = 2;
  for (let round = 0; round < CROSS_CAST_ROUNDS; round++) {
    const needsFix = cast.levels.filter((l, i) => distinct.scores[i] < SHIP_MIN || conflicts.has(l.id));
    if (needsFix.length === 0) break;

    for (const level of needsFix) {
      const i = cast.levels.findIndex((l) => l.id === level.id);
      const def = CAST_DEFS.find((d) => d.id === level.id)!;
      const other = cast.levels.filter((l) => l.id !== level.id).map((l) => ({ name: l.opponent.name, taunts: l.taunts }));
      const reasons: string[] = [];
      if (distinct.scores[i] < SHIP_MIN) reasons.push(`DISTINCT VOICE scored ${distinct.scores[i]}/5: ${distinct.evidence[i]}`);
      for (const c of conflicts.get(level.id) ?? []) reasons.push(`shared reference: ${c}`);
      console.log(`Level ${level.id} (${level.opponent.name}): cross cast fix round ${round + 1} (distinct voice or variety).`);
      const regenerated = await generateCastLevel(def, { apiKey, model, force: true, previous: other, feedback: reasons });
      const opp = await judgeOpponent(apiKey, model, regenerated);
      const ann = await judgeAnnouncer(apiKey, model, regenerated);
      // Keep the regeneration only if it still clears the base rubric; otherwise the original ships.
      if (axesPass(opp) && axesPass(ann)) {
        cast.levels[i] = regenerated;
        refsByLevel.set(level.id, opp.references);
      }
    }

    distinct = await judgeDistinctVoice(apiKey, model, cast.levels);
    conflicts = varietyConflicts(refsByLevel);
  }
  const distinctTs = new Date().toISOString();
  cast.levels.forEach((l, i) => {
    appendLedger([
      {
        ts: distinctTs,
        kind: "text",
        id: `l${l.id}-cast`,
        gate: "distinct_voice",
        verdict: distinct.scores[i] >= SHIP_MIN ? "pass" : "fail",
        score: distinct.scores[i],
        evidence: distinct.evidence[i],
      },
    ]);
  });

  conflicts = varietyConflicts(refsByLevel);
  const varietyEvidence =
    conflicts.size === 0
      ? "no two opponents share a reference"
      : [...conflicts.entries()].map(([id, reasons]) => `level ${id}: ${reasons.join("; ")}`).join(" | ");
  appendLedger([
    {
      ts: new Date().toISOString(),
      kind: "text",
      id: "cast",
      gate: "variety",
      verdict: conflicts.size === 0 ? "pass" : "fail",
      score: conflicts.size === 0 ? 1 : 0,
      evidence: varietyEvidence,
    },
  ]);

  writeFileSync(CAST_PATH, JSON.stringify(cast, null, 1) + "\n");

  console.log(`\nJudge calls made: ${judgeCallCount}`);
  console.log(`Variety gate: ${conflicts.size === 0 ? "pass" : "fail"} (${varietyEvidence})`);
  cast.levels.forEach((l, i) => console.log(`- level ${l.id} "${l.title}": distinct voice ${distinct.scores[i]}/5`));
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((err) => {
    console.error(err instanceof Error ? err.message : String(err));
    process.exit(1);
  });
}
