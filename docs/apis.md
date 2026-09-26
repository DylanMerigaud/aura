# APIs, frameworks and tools

Every API, framework and tool used to build and ship AURA, one row each.

| Name | What it does here | Where |
|---|---|---|
| Gemini API | Two models, called at build time only. `gemini-3.8-flash` (fallback `gemini-3.5-flash-lite`) generates each level's story, opponent, taunts, announcer lines and the QTE event script in one call, via the REST `generateContent` endpoint with structured JSON output (`responseMimeType: "application/json"`, a `responseJsonSchema`) and `thinkingConfig.thinkingLevel: "low"`. `gemini-3.1-flash-image` ("Nano Banana 2") generates the backgrounds, portraits and title art via the same endpoint with `responseModalities: ["IMAGE"]` and an `imageConfig.aspectRatio`. | `scripts/gen-campaign.ts`, `scripts/gen-art.ts` |
| Gradium TTS API | Renders every taunt and announcer line to audio. REST endpoint `https://api.gradium.ai/api/post/speech/tts`, POST with an `x-api-key` header, `output_format: "opus"`. Voices used: Marcus (announcer, intro/win/lose lines on every level), Garrett (the level 5 boss's taunts), and Sterling, Reuben, Maeve, Freya (opponent taunts on levels 1 to 4, one voice per level, cycled by level id). | `scripts/gen-voices.ts` |
| Web Audio API | The whole soundtrack, SFX, crowd and voice playback: oscillators, biquad filters, a shared noise buffer and gain envelopes, scheduled against `AudioContext.currentTime` on a lookahead timer, plus a dynamics compressor as the master limiter. Also the single clock every QTE timing decision is measured against. | `src/audio/*` |
| Canvas 2D | All rendering: the battle scene, characters, particles, HUD, camera transform, menus and screens. No WebGL. | `src/game/*`, `src/ui/draw.ts`, `src/main.ts` |
| Pointer Events | Touch and mouse input: swipes for HIT and COMBO, split tap zones for MASH, press and release for HOLD, all timestamped onto the same audio clock as keyboard input. | `src/qte/input.ts` |
| localStorage | Two independent keys: the calibrated input latency offset, and campaign progress (unlocked levels, best score, combo and rank per level, cringe mode unlock). Both wrapped in try/catch so a blocked or full storage degrades to defaults instead of crashing. | `src/game/latency.ts`, `src/ui/progress.ts` |
| TypeScript | Project language throughout, strict mode on, shared types for the campaign and QTE data so the game, the Gemini generator and the validator all agree on shape. | `src/`, `scripts/`, `tsconfig.json` |
| esbuild | Bundles `src/main.ts` into a single IIFE: `public/game.js` with sourcemaps and watch in dev, minified `dist/game.js` for production and itch.io. | `scripts/build.mjs` |
| vitest | Unit tests for the timing judge, the QTE runner and the campaign validator. | `tests/*` |
| tsx | Runs the TypeScript generation and tooling scripts directly (campaign, art, voices, snapshots, balance sim) with no separate compile step. | `package.json` scripts, `scripts/*` |
| @napi-rs/canvas | Native Canvas 2D implementation that lets the real rendering code run headlessly in Node, standing in for the browser canvas in the snapshot and balance tools. | `scripts/snap.ts`, `scripts/snap-screens.ts`, `scripts/fake-env.ts` |
| ffmpeg | Transcodes Gradium's Ogg Opus output to mono 64 kbps MP3, since Safari does not decode Opus reliably everywhere MP3 does. | `scripts/gen-voices.ts` |
| GitHub Pages | Hosts the public build, served from the `gh-pages` branch, no GitHub Actions involved. | `scripts/deploy-pages.sh`, https://dylanmerigaud.github.io/aura/ |
| itch.io | Secondary distribution as a plain zipped static build. | `pnpm zip`, `aura-itch.zip` |
| pnpm | Package manager and script runner for the whole workflow (install, dev, build, zip, test, deploy). | `package.json` |
| Claude Code | Used to write the game during the hackathon. | built with |
