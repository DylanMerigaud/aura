// Generates level 1 of src/v2/cast.json only: THE TURNSTILE NINJA at Chatelet, 2am (decisions of 15:00).
// Gemini (gemini-3.1-pro-preview, structured JSON) writes the title, the one line story, the persona, 8 taunts
// of 5 words, the announcer calls (1 to 4 words) and two 2025 to 2026 youth references. Lines that break the
// word budgets are replaced by the hand written seeds. The other levels of cast.json are left untouched.
// Run with: GEMINI_API_KEY=$(security find-generic-password -s gemini-api-key-hackathon -a dylanmerigaud -w) \
//   node_modules/.bin/tsx scripts/gen-ninja.ts
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT_PATH = path.join(ROOT, "src", "v2", "cast.json");
const MODEL = "gemini-3.1-pro-preview";
const DASH_RE = new RegExp("[" + String.fromCharCode(0x2014) + String.fromCharCode(0x2013) + "]", "g");

const SEED_TAUNTS = [
  "Navigo? Never heard of it.",
  "Wesh, you validated? Didn't think so.",
  "Controllers fear me, not you.",
  "Tickets are for NPCs, frerot.",
  "C'est carre. You're already cooked.",
  "I jump turnstiles, you jump nothing.",
  "Line 14 bows to me.",
  "Zero ticket, infinite aura. Easy.",
];

const SCHEMA = {
  type: "object",
  properties: {
    title: { type: "string" },
    story: { type: "string" },
    persona: { type: "string" },
    taunts: { type: "array", items: { type: "string" } },
    announcer: {
      type: "object",
      properties: { intro: { type: "string" }, win: { type: "string" }, lose: { type: "string" } },
      required: ["intro", "win", "lose"],
    },
    references: { type: "array", items: { type: "string" } },
  },
  required: ["title", "story", "persona", "taunts", "announcer", "references"],
};

const PROMPT = [
  'You write the text of the ONE playable level of AURA, a mobile rhythm "aura battle" game for a Gen Z audience',
  "that lives in aura farming and brainrot slang. Setting: Chatelet metro station, Paris, 2am.",
  'The rival is THE TURNSTILE NINJA (le Fraudeur de Chatelet), handle @turnstile_ninja: the Parisian who never paid',
  "a metro ticket. Silent, cocky, hands in pockets, chin up. He barely talks, so every word hits.",
  "",
  "Write:",
  "- title: what the player unlocks by beating him, 1 to 3 words.",
  "- story: ONE line, 8 words max, sets up the fight.",
  "- persona: one short line.",
  "- taunts: exactly 8 taunts, EXACTLY 5 words each, English with a French touch (wesh, frerot, c'est carre,",
  "  t'es cuit, Navigo, controleurs, RATP vibes without naming the brand). Tone and length like these seeds:",
  '  "Navigo? Never heard of it", "Wesh, you validated?", "Controllers fear me", "Tickets are for NPCs", "C\'est carre."',
  "- announcer: intro, win (player wins), lose (player loses): 1 to 4 words each, hype calls like",
  '  "Lock in.", "Aura secured.", "He\'s cooked.".',
  "- references: the two 2025 to 2026 youth internet references you used (aura farming, 6 7, sigma, NPC, cooked,",
  "  chopped, mog, main character, locked in, the Pacu Jalur boat kid...), each a few words.",
  "",
  "Hard rules: no real brand, no real person, no slur, nothing about religion, race or bodies, nothing that",
  "encourages real fare dodging beyond the joke. Never an em dash or en dash, use a comma instead.",
  "Respond with JSON matching the schema only.",
].join("\n");

const words = (s: string) => s.trim().split(/\s+/).filter(Boolean).length;
const clean = (s: string) => s.replace(DASH_RE, ",").replace(/\s+/g, " ").trim();

async function call(apiKey: string): Promise<any> {
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`, {
    method: "POST",
    headers: { "x-goog-api-key": apiKey, "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: PROMPT }] }],
      generationConfig: { responseMimeType: "application/json", responseJsonSchema: SCHEMA, temperature: 1.1 },
    }),
  });
  if (!res.ok) throw new Error(`Gemini ${res.status}: ${(await res.text()).slice(0, 300)}`);
  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (typeof text !== "string") throw new Error("Gemini returned no text");
  return JSON.parse(text);
}

async function main() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY missing (read it from the keychain in the same command)");
  let g: any = null;
  for (let attempt = 0; attempt < 3 && !g; attempt++) {
    try {
      const out = await call(apiKey);
      const good = (out.taunts ?? []).map(clean).filter((t: string) => words(t) === 5);
      if (good.length >= 6) g = { ...out, taunts: good };
      else console.log(`attempt ${attempt + 1}: only ${good.length} taunts of 5 words, retrying`);
    } catch (e) {
      console.log(`attempt ${attempt + 1} failed: ${(e as Error).message}`);
    }
  }
  if (!g) throw new Error("Gemini never produced usable taunts");

  // Fill up to 8 with seeds, never a duplicate.
  const taunts: string[] = g.taunts.slice(0, 8);
  for (const s of SEED_TAUNTS) if (taunts.length < 8 && !taunts.includes(s)) taunts.push(s);
  const call14 = (s: string, fb: string) => (words(clean(s ?? "")) >= 1 && words(clean(s ?? "")) <= 4 ? clean(s) : fb);
  const story = words(clean(g.story ?? "")) <= 8 ? clean(g.story) : "No ticket. No mercy. Chatelet, 2am.";

  const level1 = {
    id: 1,
    model: MODEL,
    title: clean(g.title ?? "Fare Dodger"),
    place: "Chatelet, 2am",
    story: [story],
    opponent: {
      name: "THE TURNSTILE NINJA",
      handle: "@turnstile_ninja",
      persona: clean(g.persona ?? "Silent, cocky, hands in pockets, chin up. Never paid a ticket."),
      color: "#35e0ff",
    },
    taunts,
    announcer: {
      intro: call14(g.announcer?.intro, "Lock in."),
      win: call14(g.announcer?.win, "Aura secured."),
      lose: call14(g.announcer?.lose, "You're cooked."),
    },
    references: (g.references ?? []).slice(0, 2).map(clean),
  };

  const cast = JSON.parse(readFileSync(OUT_PATH, "utf8")) as { levels: { id: number }[] };
  const i = cast.levels.findIndex((l) => l.id === 1);
  if (i >= 0) cast.levels[i] = level1;
  else cast.levels.unshift(level1);
  writeFileSync(OUT_PATH, JSON.stringify(cast, null, 1) + "\n");
  console.log(JSON.stringify(level1, null, 1));
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
