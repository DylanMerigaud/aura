# AURA: hackathon submission form, exact values

The form is the modal behind "Submit your project" on
https://hackathons.techeurope.io/dashboard/hackathons/tech-europe-ai-gaming-hack, read verbatim in
`docs/submission-form.md`. One value per field, in the order the modal shows them. Deadline 19:00
CEST today (2026-09-26).

Gate: the captain must be checked in at the registration desk to submit ("your captain needs to be
checked in to submit"). Dylan is the captain of Itchy & Scratchy.

Order of the last hour: `docs` merged into `main` and deployed, the itch.io page Public, then this
form, so every link you paste already answers.

## The fields

| # | Field in the modal | Value |
|---|---|---|
| 1 | Team Code | G28FMJ (read only) |
| 2 | What are you building? | the block under "Field 2" below |
| 3 | Which track are you competing on? | Build a Game |
| 4 | Which partner technologies did you use? | tick Google DeepMind, Gradium and Cognition |
| 5 | Which side challenges do you want to participate in? | tick Cognition |
| 6 | GitHub Repo (must be public) | https://github.com/DylanMerigaud/aura |
| 7 | Hosted Version of the Game (link) | https://dylanmerigaud.github.io/aura/ |

Field 5: Cognition's Devin opened five pull requests that are merged on `main`: the Cloudflare Worker
(PR 1, merged 13:26 CEST), the TikTok LIVE overlay (PR 4), the world tour map (PR 5), the balance sim
(PR 6) and the input module (PR 7), all by `devin-ai-integration[bot]` (read with
`gh api 'repos/DylanMerigaud/aura/pulls?state=all'` at 15:30).

Field 7: the GitHub Pages root serves the same build as the itch zip (`scripts/build.mjs`: the 3D
build at the root, the 2D build at `/v1/`). The itch page https://dylanmerigaud.itch.io/aura
answered 404 at 15:35 <ITCH PAGE PENDING>; once it is Public, it can go in this field instead if a
mentor asks for itch.io.

### Field 2, What are you building?

```
You have zero aura, a TikTok LIVE crowd is watching, and THE TURNSTILE NINJA, the Parisian who never paid a metro ticket, is taunting you at Chatelet at 2am. AURA is a 3D rhythm battle built for a phone held upright: land every note on the beat to steal his aura. Easy to start: three moves, hit, hold and mash, all on one thumb. Hard to master: a Perfect is within 45 ms of the beat, the combo multiplies up to x4, and the cleaner you play the faster the song runs. Made to replay: a loss retries at once, a win opens an Aura Pack. Gemini wrote the rival and roasts your run live, Gradium speaks it, Lyria made the music, and Cognition's Devin wrote the Cloudflare Worker.
```

129 words. Every sentence is on `main` at 15:30: the rival and his handle (`src/v2/cast.json`), the
LIVE overlay (`src/live`), the 45 ms Perfect window (`src/qte/judge.ts`), the x4 combo cap
(`src/qte/judge.ts`), the tempo rule (`src/v2/tempo.ts`), the instant retry after a loss and the
pack after a win (`src/v2/ui/app.ts`), the live roast and voice (`src/v2/net/live.ts`, `worker/`),
Lyria in `assets/music/manifest.json`. <PENDING 17:30: if the tap only input shipped, "three moves,
hit, hold and mash, all on one thumb" becomes "tap, tap fast, hold: that is the whole game".>

## Checks before you press Submit

1. Repo is public: `gh repo view DylanMerigaud/aura --json visibility -q .visibility` prints `PUBLIC`.
2. The hosted link answers: `curl -sI https://dylanmerigaud.github.io/aura/ | head -1` prints 200
   (it did at 15:35), and it opens the 3D battle on a phone held upright.
3. The itch page is Public and plays in a private window on a phone.
4. `README.md` and `docs/apis.md` are on `main`, and `pnpm release:check` prints ALL PASS.
5. Word count: `pbpaste | wc -w` after copying the block prints 130 or less.
6. No dash characters pasted: `pbpaste | rg -P "\x{2014}|\x{2013}"` prints nothing.
