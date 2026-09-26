// Live partner calls through the aura-proxy Cloudflare Worker, with an offline fallback: the game never waits
// on the network for more than a few seconds and never breaks without it.
import type { LevelV2, Stats } from "../contracts";

export const PROXY = "";

export async function fetchRoast(stats: Stats, level: LevelV2): Promise<{ roast: string; title: string } | null> {
  if (!PROXY) return null;
  try {
    const ctl = new AbortController();
    const timer = setTimeout(() => ctl.abort(), 3000);
    const r = await fetch(`${PROXY}/roast`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ level: level.id, opponent: level.opponent.name, score: stats.score, stars: stats.stars, win: stats.win, combo: stats.maxCombo, ...stats.counts }),
      signal: ctl.signal,
    });
    clearTimeout(timer);
    if (!r.ok) return null;
    const j = await r.json();
    return typeof j.roast === "string" ? { roast: j.roast, title: String(j.title ?? "") } : null;
  } catch {
    return null;
  }
}
