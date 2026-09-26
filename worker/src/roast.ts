// Gemini call behind POST /roast: turns one run's stats into a short kind roast and a two word aura title.
import { clampRoast, twoWordTitle } from "./text";

export const GEMINI_ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/interactions";
export const GEMINI_MODEL = "gemini-3.8-flash";

export interface RunStats {
  level: number;
  score: number;
  rank: string;
  combo: number;
  perfect: number;
  miss: number;
  cringe: number;
}

export interface Roast {
  roast: string;
  title: string;
}

const SCHEMA = {
  type: "object",
  properties: {
    roast: { type: "string", description: "Kind, funny roast of the run, under 200 characters." },
    title: { type: "string", description: "Two word aura title, title case." },
  },
  required: ["roast", "title"],
};

export function parseStats(body: unknown): RunStats | null {
  if (typeof body !== "object" || body === null) return null;
  const b = body as Record<string, unknown>;
  const num = (v: unknown): number => (typeof v === "number" && Number.isFinite(v) ? v : 0);
  return {
    level: num(b.level),
    score: num(b.score),
    rank: typeof b.rank === "string" ? b.rank.slice(0, 8) : "",
    combo: num(b.combo),
    perfect: num(b.perfect),
    miss: num(b.miss),
    cringe: num(b.cringe),
  };
}

export function prompt(stats: RunStats): string {
  return [
    "You are the announcer of AURA, an aura battle rhythm game.",
    "Write a roast of the run below that is kind, funny and hype, never mean and never discouraging.",
    "Rules: under 200 characters, one or two sentences, no swearing, no slurs, no insults about the player as a person,",
    "plain ASCII punctuation only, never an em dash or an en dash.",
    "Also write an aura title of exactly two words that sums up the run, title case, no punctuation.",
    "Run stats:",
    `level ${stats.level}, score ${stats.score}, rank ${stats.rank || "none"}, best combo ${stats.combo},`,
    `${stats.perfect} perfect hits, ${stats.miss} misses, ${stats.cringe} cringe moments.`,
  ].join(" ");
}

// The Interactions response is an interaction object whose steps carry content blocks; the JSON
// payload arrives as the text block of a model output step.
export function extractText(payload: unknown): string | null {
  const steps = (payload as { steps?: unknown[] } | null)?.steps;
  if (!Array.isArray(steps)) return null;
  for (let i = steps.length - 1; i >= 0; i--) {
    const content = (steps[i] as { content?: unknown[] } | null)?.content;
    if (!Array.isArray(content)) continue;
    for (const block of content) {
      const text = (block as { text?: unknown } | null)?.text;
      if (typeof text === "string" && text.trim()) return text;
    }
  }
  return null;
}

export function parseRoast(text: string): Roast | null {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start < 0 || end <= start) return null;
  let parsed: unknown;
  try {
    parsed = JSON.parse(text.slice(start, end + 1));
  } catch {
    return null;
  }
  const obj = parsed as { roast?: unknown; title?: unknown } | null;
  if (!obj || typeof obj.roast !== "string" || !obj.roast.trim()) return null;
  return {
    roast: clampRoast(obj.roast),
    title: twoWordTitle(typeof obj.title === "string" ? obj.title : ""),
  };
}

// Returns null on any upstream failure so the caller can answer 502 and the game can fall back
// to its bundled lines.
export async function fetchRoast(stats: RunStats, apiKey: string, fetchImpl: typeof fetch = fetch): Promise<Roast | null> {
  let response: Response;
  try {
    response = await fetchImpl(GEMINI_ENDPOINT, {
      method: "POST",
      headers: { "content-type": "application/json", "x-goog-api-key": apiKey },
      body: JSON.stringify({
        model: GEMINI_MODEL,
        input: prompt(stats),
        response_format: { type: "text", mime_type: "application/json", schema: SCHEMA },
      }),
    });
  } catch {
    return null;
  }
  if (!response.ok) return null;
  let payload: unknown;
  try {
    payload = await response.json();
  } catch {
    return null;
  }
  const text = extractText(payload);
  return text ? parseRoast(text) : null;
}
