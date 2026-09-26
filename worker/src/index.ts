// aura-proxy: a Cloudflare Worker that fronts the two partner APIs used by the AURA browser game,
// so the static build never ships a key. POST /roast talks to Gemini, POST /voice to Gradium.
import { corsHeaders, isAllowedOrigin, json, preflight } from "./cors";
import { clientIp, overLimit, type RateStore } from "./ratelimit";
import { fetchRoast, parseStats } from "./roast";
import { fetchSpeech, parseVoice } from "./voice";

export interface Env {
  RATE: RateStore;
  GEMINI_API_KEY: string;
  GRADIUM_API_KEY: string;
}

async function readJson(request: Request): Promise<unknown> {
  try {
    return await request.json();
  } catch {
    return null;
  }
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const origin = request.headers.get("origin");
    const url = new URL(request.url);

    if (request.method === "OPTIONS") return preflight(request);
    if (request.method !== "POST") return json({ error: "method" }, 405, origin);
    if (origin !== null && !isAllowedOrigin(origin)) return json({ error: "origin" }, 403, origin);

    if (await overLimit(env.RATE, clientIp(request))) return json({ error: "rate" }, 429, origin);

    if (url.pathname === "/roast") {
      const stats = parseStats(await readJson(request));
      if (!stats) return json({ error: "body" }, 400, origin);
      const roast = await fetchRoast(stats, env.GEMINI_API_KEY);
      if (!roast) return json({ error: "upstream" }, 502, origin);
      return json(roast, 200, origin);
    }

    if (url.pathname === "/voice") {
      const voice = parseVoice(await readJson(request));
      if (!voice) return json({ error: "body" }, 400, origin);
      const upstream = await fetchSpeech(voice, env.GRADIUM_API_KEY);
      if (!upstream) return json({ error: "upstream" }, 502, origin);
      return new Response(upstream.body, {
        status: 200,
        headers: { ...corsHeaders(origin), "content-type": "audio/wav", "cache-control": "no-store" },
      });
    }

    return json({ error: "not_found" }, 404, origin);
  },
};
