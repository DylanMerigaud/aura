// Live partner calls through the aura-proxy Cloudflare Worker, with an offline fallback: the game never waits
// on the network for more than a few seconds and never breaks without it.
import type { LevelV2, Stats } from "../contracts";
import { ctx, master } from "../../audio/engine";

export const PROXY = "https://aura-proxy.dylanmerigaud-pro.workers.dev";
/** Gradium voice of the announcer (Marcus), the same one the bundled lines use. */
const ANNOUNCER_VOICE = "r2sIQdqqoqgRJuXw";
const DASH = new RegExp("[" + String.fromCharCode(0x2014) + String.fromCharCode(0x2013) + "]", "g");

async function post(path: string, body: unknown, ms: number): Promise<Response | null> {
  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), ms);
  try {
    const r = await fetch(`${PROXY}${path}`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body), signal: ctl.signal });
    return r.ok ? r : null;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

export async function fetchRoast(stats: Stats, level: LevelV2): Promise<{ roast: string; title: string } | null> {
  if (!PROXY) return null;
  const rank = !stats.win ? "F" : stats.stars === 3 ? "S" : stats.stars === 2 ? "A" : "B";
  const r = await post("/roast", { level: level.id, score: stats.score, rank, combo: stats.maxCombo, ...stats.counts }, 3000);
  if (!r) return null;
  try {
    const j = await r.json();
    return typeof j.roast === "string" ? { roast: j.roast.replace(DASH, ","), title: String(j.title ?? "").replace(DASH, " ") } : null;
  } catch {
    return null;
  }
}

/** Speak a line live through Gradium; resolves false when the Worker or the decode fails. */
export async function speakLive(text: string): Promise<boolean> {
  if (!PROXY || !ctx) return false;
  const r = await post("/voice", { text, voice: ANNOUNCER_VOICE }, 6000);
  if (!r) return false;
  try {
    const buf = await ctx.decodeAudioData(await r.arrayBuffer());
    const s = ctx.createBufferSource();
    s.buffer = buf;
    s.connect(master);
    s.start();
    return true;
  } catch {
    return false;
  }
}
