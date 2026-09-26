// Unit tests for the Worker: CORS logic, the KV backed rate limiter, dash stripping and the two
// routes with fetch mocked, so nothing here ever touches Gemini or Gradium.
import { describe, expect, it, vi } from "vitest";
import { ALLOWED_ORIGINS, corsHeaders, isAllowedOrigin } from "../src/cors";
import { LIMIT, overLimit, rateKey, type RateStore } from "../src/ratelimit";
import { clampRoast, stripDashes, twoWordTitle } from "../src/text";
import { extractText, parseRoast, parseStats, prompt } from "../src/roast";
import { parseVoice } from "../src/voice";
import worker, { type Env } from "../src/index";

function memoryStore(): RateStore & { map: Map<string, string> } {
  const map = new Map<string, string>();
  return {
    map,
    async get(key) {
      return map.get(key) ?? null;
    },
    async put(key, value) {
      map.set(key, value);
    },
  };
}

function env(overrides: Partial<Env> = {}): Env {
  return { RATE: memoryStore(), GEMINI_API_KEY: "gemini-test", GRADIUM_API_KEY: "gradium-test", ...overrides };
}

function post(path: string, body: unknown, origin = "https://dylanmerigaud.github.io"): Request {
  return new Request(`https://proxy.example${path}`, {
    method: "POST",
    headers: { "content-type": "application/json", origin, "cf-connecting-ip": "203.0.113.7" },
    body: JSON.stringify(body),
  });
}

const STATS = { level: 3, score: 41200, rank: "S", combo: 88, perfect: 61, miss: 2, cringe: 1 };

function geminiResponse(roast: string, title: string): Response {
  return new Response(
    JSON.stringify({ steps: [{ model_output: true, content: [{ text: JSON.stringify({ roast, title }) }] }] }),
    { status: 200, headers: { "content-type": "application/json" } },
  );
}

describe("CORS", () => {
  it("allows exactly the game origins and itch.zone subdomains", () => {
    for (const origin of ALLOWED_ORIGINS) expect(isAllowedOrigin(origin)).toBe(true);
    expect(ALLOWED_ORIGINS).toEqual([
      "https://dylanmerigaud.github.io",
      "https://html.itch.zone",
      "https://v6p9d9t4.ssl.hwcdn.net",
      "http://localhost:8080",
      "http://localhost:5173",
    ]);
    expect(isAllowedOrigin("https://html-classic.itch.zone")).toBe(true);
    expect(isAllowedOrigin("https://evil.itch.zone.example.com")).toBe(false);
  });

  it("rejects look alike origins, other schemes and null", () => {
    expect(isAllowedOrigin("https://evil.dylanmerigaud.github.io")).toBe(false);
    expect(isAllowedOrigin("http://dylanmerigaud.github.io")).toBe(false);
    expect(isAllowedOrigin("https://dylanmerigaud.github.io.evil.com")).toBe(false);
    expect(isAllowedOrigin("http://localhost:8081")).toBe(false);
    expect(isAllowedOrigin(null)).toBe(false);
  });

  it("echoes an allowed origin and varies on Origin, and grants nothing otherwise", () => {
    const allowed = corsHeaders("https://html.itch.zone");
    expect(allowed["access-control-allow-origin"]).toBe("https://html.itch.zone");
    expect(allowed.vary).toBe("Origin");
    expect(corsHeaders("https://evil.example")["access-control-allow-origin"]).toBeUndefined();
  });

  it("answers OPTIONS preflight with 204 and the allow headers", async () => {
    const request = new Request("https://proxy.example/roast", {
      method: "OPTIONS",
      headers: { origin: "http://localhost:8080" },
    });
    const response = await worker.fetch(request, env());
    expect(response.status).toBe(204);
    expect(response.headers.get("access-control-allow-origin")).toBe("http://localhost:8080");
    expect(response.headers.get("access-control-allow-methods")).toContain("POST");
  });

  it("refuses a POST from a disallowed browser origin", async () => {
    const response = await worker.fetch(post("/roast", STATS, "https://evil.example"), env());
    expect(response.status).toBe(403);
    expect(response.headers.get("access-control-allow-origin")).toBeNull();
  });
});

describe("rate limit", () => {
  it("allows 30 requests per minute per IP and blocks the 31st", async () => {
    const store = memoryStore();
    const now = 1_700_000_000_000;
    for (let i = 0; i < LIMIT; i++) expect(await overLimit(store, "203.0.113.7", now)).toBe(false);
    expect(await overLimit(store, "203.0.113.7", now)).toBe(true);
  });

  it("counts each IP separately and resets in the next window", async () => {
    const store = memoryStore();
    const now = 1_700_000_000_000;
    for (let i = 0; i < LIMIT; i++) await overLimit(store, "198.51.100.1", now);
    expect(await overLimit(store, "198.51.100.1", now)).toBe(true);
    expect(await overLimit(store, "198.51.100.2", now)).toBe(false);
    expect(await overLimit(store, "198.51.100.1", now + 60_000)).toBe(false);
    expect(rateKey("198.51.100.1", now)).not.toBe(rateKey("198.51.100.1", now + 60_000));
  });

  it("sets a TTL so counters expire", async () => {
    const put = vi.fn(async () => {});
    await overLimit({ get: async () => null, put }, "203.0.113.7", 0);
    expect(put).toHaveBeenCalledWith(expect.any(String), "1", { expirationTtl: 120 });
  });

  it("returns 429 with {error: rate} once the window is full", async () => {
    const e = env();
    const fetchMock = vi.fn(async () => geminiResponse("Clean run, keep going.", "Rising Star"));
    vi.stubGlobal("fetch", fetchMock);
    for (let i = 0; i < LIMIT; i++) expect((await worker.fetch(post("/roast", STATS), e)).status).toBe(200);
    const blocked = await worker.fetch(post("/roast", STATS), e);
    expect(blocked.status).toBe(429);
    expect(await blocked.json()).toEqual({ error: "rate" });
    expect(fetchMock).toHaveBeenCalledTimes(LIMIT);
    vi.unstubAllGlobals();
  });
});

describe("dash stripping", () => {
  it("replaces every dash variant with an ASCII hyphen", () => {
    const stripped = stripDashes("aura \u2014 rising \u2013 fast \u2012 now \u2010 ok \u2212 yes");
    expect(stripped).toBe("aura - rising - fast - now - ok - yes");
    expect(/[\u2010-\u2015\u2212]/.test(stripped)).toBe(false);
  });

  it("leaves ASCII hyphens and normal text alone", () => {
    expect(stripDashes("well-timed combo")).toBe("well-timed combo");
  });

  it("clamps the roast to 200 characters after stripping", () => {
    const long = "x".repeat(240) + "\u2014";
    const clamped = clampRoast(long);
    expect(clamped.length).toBe(200);
    expect(clamped).not.toContain("\u2014");
  });

  it("keeps the title to two words with no dashes", () => {
    expect(twoWordTitle("Chaotic \u2013 Good Energy Overflow")).toBe("Chaotic -");
    expect(twoWordTitle("Feral Precision")).toBe("Feral Precision");
  });

  it("strips dashes coming back from Gemini", () => {
    const parsed = parseRoast(JSON.stringify({ roast: "Two misses \u2014 still cinematic.", title: "Near \u2013 Perfect" }));
    expect(parsed).toEqual({ roast: "Two misses - still cinematic.", title: "Near -" });
  });
});

describe("POST /roast", () => {
  it("calls the Gemini interactions endpoint with the key header and structured output", async () => {
    const fetchMock = vi.fn(async () => geminiResponse("Two misses, zero shame.", "Feral Precision"));
    vi.stubGlobal("fetch", fetchMock);
    const response = await worker.fetch(post("/roast", STATS), env());
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ roast: "Two misses, zero shame.", title: "Feral Precision" });

    const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe("https://generativelanguage.googleapis.com/v1beta/interactions");
    expect((init.headers as Record<string, string>)["x-goog-api-key"]).toBe("gemini-test");
    const body = JSON.parse(init.body as string);
    expect(body.model).toBe("gemini-3.8-flash");
    expect(body.response_format).toMatchObject({ type: "text", mime_type: "application/json" });
    expect(body.response_format.schema.required).toEqual(["roast", "title"]);
    expect(body.input).toContain("score 41200");
    vi.unstubAllGlobals();
  });

  it("returns 502 {error: upstream} when Gemini fails or answers junk", async () => {
    for (const failure of [
      async () => new Response("nope", { status: 500 }),
      async () => new Response("not json", { status: 200 }),
      async () => {
        throw new Error("network down");
      },
    ]) {
      vi.stubGlobal("fetch", vi.fn(failure));
      const response = await worker.fetch(post("/roast", STATS), env());
      expect(response.status).toBe(502);
      expect(await response.json()).toEqual({ error: "upstream" });
      vi.unstubAllGlobals();
    }
  });

  it("rejects a body that is not an object", async () => {
    const response = await worker.fetch(post("/roast", "hello"), env());
    expect(response.status).toBe(400);
  });

  it("coerces missing stat fields instead of failing", () => {
    expect(parseStats({ level: 2 })).toEqual({ level: 2, score: 0, rank: "", combo: 0, perfect: 0, miss: 0, cringe: 0 });
    expect(parseStats(null)).toBeNull();
    expect(prompt(STATS)).toContain("best combo 88");
  });

  it("reads the text block out of the interactions response", () => {
    expect(extractText({ steps: [{ content: [{ text: "" }, { text: "{}" }] }] })).toBe("{}");
    expect(extractText({})).toBeNull();
  });
});

describe("POST /voice", () => {
  it("streams the Gradium wav back with CORS headers", async () => {
    const audio = new Uint8Array([82, 73, 70, 70, 1, 2, 3, 4]);
    const fetchMock = vi.fn(async () => new Response(audio, { status: 200, headers: { "content-type": "audio/wav" } }));
    vi.stubGlobal("fetch", fetchMock);
    const response = await worker.fetch(post("/voice", { text: "Aura check", voice: "r2sIQdqqoqgRJuXw" }), env());
    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toBe("audio/wav");
    expect(response.headers.get("access-control-allow-origin")).toBe("https://dylanmerigaud.github.io");
    expect(new Uint8Array(await response.arrayBuffer())).toEqual(audio);

    const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe("https://api.gradium.ai/api/post/speech/tts");
    expect((init.headers as Record<string, string>)["x-api-key"]).toBe("gradium-test");
    expect(JSON.parse(init.body as string)).toEqual({
      text: "Aura check",
      voice_id: "r2sIQdqqoqgRJuXw",
      output_format: "wav",
      only_audio: true,
    });
    vi.unstubAllGlobals();
  });

  it("returns 502 when Gradium fails", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => new Response("", { status: 429 })));
    const response = await worker.fetch(post("/voice", { text: "Aura check", voice: "abc" }), env());
    expect(response.status).toBe(502);
    expect(await response.json()).toEqual({ error: "upstream" });
    vi.unstubAllGlobals();
  });

  it("requires text and voice", () => {
    expect(parseVoice({ text: "hi" })).toBeNull();
    expect(parseVoice({ text: "", voice: "abc" })).toBeNull();
    expect(parseVoice({ text: "hi", voice: "abc" })).toEqual({ text: "hi", voice: "abc" });
  });
});

describe("routing", () => {
  it("404s an unknown path and 405s a GET", async () => {
    expect((await worker.fetch(post("/nope", {}), env())).status).toBe(404);
    const get = new Request("https://proxy.example/roast", { headers: { "cf-connecting-ip": "203.0.113.7" } });
    expect((await worker.fetch(get, env())).status).toBe(405);
  });
});
