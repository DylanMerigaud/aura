# aura-proxy Worker

A small Cloudflare Worker (TypeScript, no framework) that fronts the two partner APIs used by the
AURA browser game, so the static build never ships an API key:

- `POST /roast` calls the Gemini API (`gemini-3.8-flash`, Interactions endpoint, structured JSON
  output) and returns `{roast, title}`: a kind, funny roast of the run under 200 characters and a
  two word aura title.
- `POST /voice` calls Gradium text to speech and streams the `audio/wav` response back.

Both routes answer CORS preflight and are limited to 30 requests per minute per client IP. Any
upstream failure answers `502 {"error":"upstream"}` so the game falls back to its bundled lines,
and being over the limit answers `429 {"error":"rate"}`.

Allowed origins: `https://dylanmerigaud.github.io`, `https://html.itch.zone`,
`https://v6p9d9t4.ssl.hwcdn.net`, `http://localhost:8080`.

## Layout

| File | What it holds |
| --- | --- |
| `src/index.ts` | Routing, CORS gate, rate limit gate, the two routes |
| `src/cors.ts` | Allow list, CORS headers, preflight, JSON helper |
| `src/ratelimit.ts` | Fixed window counter in the `RATE` KV namespace |
| `src/roast.ts` | Gemini request, response parsing |
| `src/voice.ts` | Gradium request |
| `src/text.ts` | Dash stripping, roast clamping, two word title |
| `test/worker.test.ts` | Vitest unit tests, fetch mocked |

## Deploy

```sh
cd worker
pnpm install

# One KV namespace for the rate limit counters, then paste the printed id into wrangler.toml
# (it replaces the placeholder id in the [[kv_namespaces]] block).
npx wrangler kv namespace create RATE

# Secrets live in the Worker, never in this repo.
npx wrangler secret put GEMINI_API_KEY
npx wrangler secret put GRADIUM_API_KEY

npx wrangler deploy
```

Point the game at the deployed Worker by setting `PROXY` in `src/v2/net/live.ts` to the Worker URL
(for example `https://aura-proxy.<subdomain>.workers.dev`).

## Local development

```sh
cd worker
pnpm install
pnpm test        # unit tests
pnpm typecheck
npx wrangler dev # serves on http://localhost:8787 with a local KV store
```

`wrangler dev` reads secrets from a local `.dev.vars` file (git ignored, never committed):

```
GEMINI_API_KEY=...
GRADIUM_API_KEY=...
```

## Routes

### POST /roast

Body: `{level, score, rank, combo, perfect, miss, cringe}`. Answers `{roast, title}`.

```sh
curl -sS https://aura-proxy.<subdomain>.workers.dev/roast \
  -H 'content-type: application/json' \
  -H 'origin: https://dylanmerigaud.github.io' \
  -d '{"level":3,"score":41200,"rank":"S","combo":88,"perfect":61,"miss":2,"cringe":1}'
# {"roast":"Two misses and you still kept an 88 combo. The aura is loud.","title":"Feral Precision"}
```

### POST /voice

Body: `{text, voice}` where `voice` is a Gradium voice id. Answers the `audio/wav` stream.

```sh
curl -sS https://aura-proxy.<subdomain>.workers.dev/voice \
  -H 'content-type: application/json' \
  -H 'origin: https://dylanmerigaud.github.io' \
  -d '{"text":"Your aura is unmatched.","voice":"r2sIQdqqoqgRJuXw"}' \
  --output roast.wav
```

### Errors

| Status | Body | When |
| --- | --- | --- |
| 400 | `{"error":"body"}` | Malformed or incomplete JSON body |
| 403 | `{"error":"origin"}` | Browser origin not in the allow list |
| 404 | `{"error":"not_found"}` | Unknown path |
| 405 | `{"error":"method"}` | Anything other than POST or OPTIONS |
| 429 | `{"error":"rate"}` | More than 30 requests in a minute from one IP |
| 502 | `{"error":"upstream"}` | Gemini or Gradium failed, or answered something unusable |
