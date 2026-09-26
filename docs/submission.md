# AURA: submission

Name: AURA
Tagline: You have zero aura. Fix that, live, one beat at a time.

Team: Itchy & Scratchy (Dylan Merigaud, captain, and Dorian Poupard)
Track: Build a Game (the only track option in the submission form)
Partner technologies used: Google DeepMind (Lyria 3 Pro, Gemini, Gemini TTS), Gradium (text to speech), Cognition (Devin wrote the Cloudflare Worker, pull request 1)
Side challenge: Cognition

Short description: Easy to learn, hard to master, made to replay. A rhythm aura battle for your phone, portrait and one hand, framed as a TikTok LIVE: one perfect fight at Chatelet in Paris against His Holiness, on the beat of a generated Brazilian funk track, and a world tour map of the fights to come.

The exact values for the hackathon form are in `docs/submission-values.md`, the itch.io page fields are in `docs/itch-page.md`. This file is the long write-up the README top and the judges read. A marker `[TO VERIFY n]` points to the numbered row of the last section: the claim was decided at 14:35 and was not on `origin/main` at 14:35.

## Easy to learn, hard to master, made to replay

The demo is on a phone, so AURA is mobile first: portrait, touch, one hand. The judges look for stickiness, easy onboarding and a game that is hard to master. Each has its proof in the game.

- **Easy onboarding.** No text tutorial. The first 20 seconds of the Chatelet battle teach by doing: a four beat count in, single arrows with wide timing windows, a ghost hand that shows the swipe once, the 69 introduced with a two second hand demo, and an announcer who calls each move by name. The first 15 seconds cannot be lost. [TO VERIFY 20]
- **Hard to master.** The Perfect window tightens as the combo climbs, from 110 ms at combo 0 to 70 ms at combo 25, and a ring around each target shrinks to show it. [TO VERIFY 21] The better you play, the faster the song gets. The 69 pays more the closer to the drop you release it. Eight Perfects in a row start FLOW, sunglasses on and the score doubled. [TO VERIFY 22] Three stars need 90 percent accuracy and zero cringe, and after a win, cringe mode asks for more. [TO VERIFY 23]
- **Stickiness.** One tap retries the battle on the beat. Your personal best and rank stay on the device. Aura Packs hand out emotes in five rarities. A 1080 by 1920 share card (score, tier, combo, the roast, the stop and your handle) goes to TikTok or WhatsApp through the phone's share sheet. The world tour map shows the locked stops as the promise. [TO VERIFY 24]

## What it does

You have zero aura, and a livestream crowd is watching you fix that. The camera sits over your shoulder at Chatelet in Paris, at night, and across the ring stands His Holiness, who is visiting and is very calm about it. On a phone, held in portrait, you swipe the arrows, hold, and tap left and right to mash, all with one thumb, on the beat of a Brazilian funk track, and an announcer calls what you did in one to four words. Land them and the aura bar slides toward you, miss and it slides toward him, press the wrong arrow and it counts as cringe. Mashing charges a burst, the 69, that you release on the drop. Perfects speed the song up a little, misses slow it down. The fight lasts about 40 seconds. At the end, Gemini writes a roast of how you played and Gradium speaks it. Then you are back on the AURA WORLD TOUR map, where Shibuya, a Rio rooftop and the Pacu Jalur boat race in Riau, the birthplace of aura farming, wait behind a padlock.

## How I built it

The game reads the song, and the models never sit in the frame loop. Two layers and one live branch.

Generation, at build time. Gemini writes the announcer calls and each opponent's taunts as structured JSON, and a second Gemini call grades every line on a rubric (punch with a word limit, references, distinct voice, clean, French flavor). A failing set is regenerated twice, then the best scored candidate ships and the failure stays in the record. Every check appends a row to `evals/ledger.jsonl`. Lyria 3 Pro wrote the Brazilian funk montagem phonk tracks, and `analyze-music.py` measures each one: beats, onsets, drops, breakdowns, energy per beat. The announcer voice was picked by a bake off: the same lines rendered with five candidate Gradium voices and Gemini TTS, and a Gemini audio judge scored each on boxing ring energy and on whether a TikTok edit would use it. The fighters are Mixamo rigs, and every character image is captured in engine.

The client. A scheduler starts the track on the Web Audio clock and stamps every key and touch onto the clock the player is hearing, output latency included, so what you see, hear and get judged on agree. The judge is plain beat grid math with three windows, Perfect, Great and Ok, and the Perfect window tightens with the combo, from 110 ms at combo 0 to 70 ms at combo 25. [TO VERIFY 21] The core turns judged results into aura, combo, score and events, and never imports the renderer. The director reads those events and the track analysis: it cuts the camera on downbeats, ramps slow motion into each drop and snaps back on it. The renderer (Three.js) and the LIVE frame HUD only read events. The chart of the Chatelet fight is written by hand on the measured onsets, so the notes land on the drop.

The live branch. A Cloudflare Worker, written by Cognition's Devin as pull request 1, holds the Gemini and Gradium keys and answers two routes: the roast and its voice. The game waits a few seconds, and if the Worker is slow or down it keeps the announcer's bundled line, so nothing waits on the network. Every other model output is a file in the bundle, so the game is a static page that runs on a free host.

## Challenges

The beat tracker was off by about 250 ms. The hero track measured 129.2 BPM and is really 130.0, because the tracker rounds to whole analysis frames. Over 86 beats that drift puts the last notes a quarter second away from the music. We fold the onset envelope over a fine tempo scan and keep the sharpest pulse. Lyria also ignores the tempo we ask for: the first club track was requested at 120 BPM and measured 129.2, the boss track was requested at 128 and measured 136, so we chart on what we measure and never on what we asked for. The other fight was AI grading AI. Gemini kept writing announcer lines over the word limit and the judge kept rejecting them with the count in the evidence: an intro of 12 words against a limit of 9 is a real row of the ledger. After the first play test the lines got shorter still, one to four words, because an announcer calls the action and does not narrate it. Input latency differs between speakers, a laptop and Bluetooth headphones, so inputs are stamped on the clock the player hears and there is a calibration screen. Phones: the demo is on one, so the battle is built portrait first, played with one thumb, and a 3D game on a phone needed a load path of its own, only the clips a fight needs, a timeout and a fallback on every network wait, and bloom switched off where the GPU cannot render to half float.

## Accomplishments

One battle, tuned instead of five, and a map that sells the rest. The first QTE lands inside 2 bars and no stretch runs longer than 2 bars without one, checked by a script rather than by eye. The evals ledger held 334 rows at 14:12: text checks 209 passed and 35 failed (each failure sent the line back for another try), music checks 35 passed and 5 failed, voice checks 30 passed, pacing checks 20 passed. A pure battle core with 115 unit tests across 10 files at 14:05, 23 of them the Worker's. 30 Mixamo dance and reaction clips, retargeted onto the two rigs in the fight. Nothing ships that was not generated by a partner model, released as CC0, or covered by Adobe's Mixamo terms.

## What we learned

Charting on measured audio beats charting on the request. A rubric written before the content is cheap, and it catches what taste misses. Keeping the models out of the frame loop is what lets a static page on a free host run a game made by models and still work with the network off. A judge gives a game 20 seconds, so the onboarding is the first 20 seconds of the battle and not a screen before it. A player's play report beats our own taste: the announcer got shorter, the look got brighter, and the map replaced four half finished levels.

## What's next

The rest of the world tour: Shibuya, the Rio rooftop and the Pacu Jalur boss, each with its own track, its own opponent and its own place. Multiplayer, same room and same beat, and loadouts so the moves you unlock change how you fight.

## Built with

Google DeepMind: Lyria 3 Pro (music), Gemini 3.1 Pro (announcer calls and taunts), Gemini 3.8 Flash (the live roast), Gemini 3.1 Flash Image "Nano Banana 2" (map and backdrops), Gemini TTS (voice candidates). Gradium text to speech. Cognition Devin (the Cloudflare Worker). Cloudflare Workers. Three.js. TypeScript, esbuild, vitest. Web Audio API. librosa for the music analysis. Mixamo characters and animations (Adobe terms). Claude Code.

## Links

- Play in the browser: https://dylanmerigaud.github.io/aura/ (the root always serves the latest build) and https://dylanmerigaud.itch.io/aura (FILL when the itch.io page is Public)
- Source: https://github.com/DylanMerigaud/aura
- The Worker, by Devin: https://github.com/DylanMerigaud/aura/pull/1 (merged 2026-09-26 13:26 CEST)
- APIs, frameworks and tools: `docs/apis.md`

## Requirements checked

- [x] Team of at most 5 people: 2 (Dylan Merigaud, Dorian Poupard), per the hackathon dashboard on 2026-09-26.
- [x] At least 2 partner technologies used: Google DeepMind (Gemini, Lyria, Nano Banana), Gradium and Cognition, with generated or written files on disk (`assets/music/`, `public/art/`, `public/voice/`, `worker/`).
- [x] Project created at this hackathon: first commit ebbd4f4 on 2026-09-26 11:12 CEST, after the 10:00 opening (`git log --reverse`).
- [x] Track chosen: Build a Game, the only option the submission form shows.
- [x] Public GitHub repository exists and is public (`gh repo view DylanMerigaud/aura --json visibility` printed PUBLIC at 14:12).
- [x] README with setup and installation steps exists (`README.md`), and documentation of APIs, frameworks and tools exists (`docs/apis.md`).

## Decisions this file follows

These override anything older in the repo, and they came after the first version of this file.

- One playable battle: Chatelet (Paris) against His Holiness, warm and never mocking. Never "five levels". The other stops on the map are locked: Shibuya (Tokyo), Rooftop (Rio), Pacu Jalur (Riau, the boss), optionally Barbes (Paris).
- The look is Fortnite-like (clean, bright, saturated, stylized), framed as a TikTok LIVE (LIVE badge, viewer count, comment feed, hearts). No neon, no PS2, no phone shader.
- The voice is an announcer with calls of 1 to 4 words, taunts of 5 words. The music is Brazilian funk montagem phonk from Lyria 3 Pro. Voices are Gradium and Gemini TTS, chosen by a bake off.
- No BPM shown anywhere, text on screen minimal.
- Mobile first, portrait, touch, one hand (organizers, 14:35). Every judge facing text leads with easy onboarding, hard to master and stickiness, each with its proof in the game.

## TO VERIFY AT 17:30

Not ticked above because they depend on the shipped build or on an action not done yet. Each row: the sentence in this file that depends on it, the check, and the replacement if the check fails. Update or delete the row when done. At 14:12 the committed build was still the first 3D pass (neon look, five levels, five opponents, see `STATUS.md` and `src/v2/cast.json`), so every visual and content claim below is a decision that other lanes are building.

1. itch.io page published and playable. Check: open the page in a private window on a phone and a laptop. The URL is not confirmed yet. Fill the Links section.
2. The root URL serves the build described here. Check: `curl -sI https://dylanmerigaud.github.io/aura/ | head -1` prints 200 (it did at 14:12), and open it: it must show the map and the Chatelet fight, and `unzip -l aura-itch.zip | rg ' index.html$'` must list the same build. At 14:12 the root still served the first 2D game and the 3D build was under `/v2/`. If the root is not switched, rewrite What it does to the build that is live.
3. "Full source code" on GitHub. Check: `git status --short` empty on `main` and `git log origin/main..` empty, so `src/v2`, `src/render3d`, `worker`, `evals`, `scripts/gen-cast.ts`, `scripts/eval-*.ts` and this `docs/` folder are pushed. `docs` is merged by the main session at 17:30, not by this lane.
4. The live roast sentence ("At the end, Gemini writes a roast of how you played and Gradium speaks it"). FOUND at 14:12: `POST /roast` answered in 4.8 to 6.5 s over four tries, and the game stops waiting after 3 s (`post("/roast", ..., 3000)` in `src/v2/net/live.ts`), so the roast would almost never reach the screen and the chip "roast written live by Gemini, voiced live by Gradium" would not show. The voice route answered in 1.6 s. Fix in the build (raise the timeout to 8 s or request the roast when the fight ends), then check: finish a fight with sound on and see the chip. If not fixed, replace the two sentences in What it does and How I built it with: "At the end, the announcer gives a verdict, and when our Cloudflare Worker answers in time, Gemini writes a roast of how you played and Gradium speaks it." Test the route: `curl -s -m 8 -X POST https://aura-proxy.dylanmerigaud-pro.workers.dev/roast -H 'content-type: application/json' -d '{"level":1,"score":9000,"rank":"A","combo":40,"perfect":20,"miss":2,"cringe":0}'`.
5. The look and the frame. "Framed as a TikTok LIVE", "the camera sits over your shoulder", "at night", "an announcer calls what you did in one to four words". Check: play the fight with sound. If the LIVE frame is missing, replace "framed as a TikTok LIVE" and "a livestream crowd is watching you fix that" with "a crowd" wording. The committed announcer lines are still 8 to 12 words (`src/v2/cast.json`), so the "one to four words" and the Challenges sentence "the lines got shorter still" hold only after the cast is regenerated.
6. The map. "Shibuya, a Rio rooftop and the Pacu Jalur boat race in Riau wait behind a padlock". Check: the map screen shows those stops by name. The committed map (`src/v2/ui/map.ts`) still draws five numbered nodes titled CAMPAIGN. Delete a stop that is not on the map, add Barbes if it shipped, delete the sentence if there is no map. The Pacu Jalur origin claim is sourced in `docs/aura-farming-spec.md` section 1 (Wikipedia, Kompas.id).
7. Model names in Built with and the first paragraph. The write-up names Lyria 3 Pro, Gemini 3.1 Pro, Gemini 3.8 Flash, Gemini 3.1 Flash Image and Gemini TTS. On disk at 14:12: `lyria-3.5` and `lyria-3-clip-preview` in `assets/music/manifest.json`, `gemini-3.8-flash` in `scripts/gen-cast.ts` and `worker/src/roast.ts`, `gemini-3.1-flash-image` in `scripts/gen-art.ts`, and no call to Gemini TTS anywhere. Check: `rg -o "lyria-[0-9a-z.-]+|gemini-[0-9a-z.-]+" scripts worker/src assets/music/manifest.json | sort -u`. Replace each name with the id printed, and delete a model that produced nothing that ships.
8. The voice bake off sentence in How I built it. No scoreboard was on disk at 14:12. Check: a `voice` or `bakeoff` row set in `evals/ledger.jsonl`, or a doc under `docs/`. If none exists, delete the sentence "The announcer voice was picked by a bake off..." and the Gemini TTS mentions.
9. Numbers in Accomplishments. Recount and replace: `python3 -c "import json,collections;r=[json.loads(l) for l in open('evals/ledger.jsonl')];print(len(r),collections.Counter((x['kind'],x['verdict']) for x in r))"` (334 rows at 14:12: text 209 pass and 35 fail, music 35 pass and 5 fail, voice 30 pass, pacing 20 pass); `pnpm test` for the test and file counts (115 tests, 10 files at 14:05); `ls assets/3d/anims/*.glb | wc -l` (30). The ledger rows at 14:12 belong to the first cast and the first tracks, and the regenerated cast, tracks and voices will add rows, so the sentence must carry the new time.
10. The Challenges numbers (129.2 against 130.0, 120 against 129.2, 128 against 136, an intro of 12 words against 9). They come from the first render of the tracks and the first cast. Check: `assets/music/manifest.json` (`bpm_requested`, `bpm_measured`) and `rg -m1 '"gate":"punch"' evals/ledger.jsonl`. If the tracks were regenerated the numbers must come from the new manifest, and if a number cannot be found on disk, delete the number and keep the lesson.
11. "The chart of the Chatelet fight is written by hand on the measured onsets". On disk today for the club chart (`HERO_EVENTS` in `src/v2/levels.ts`, hand written on the analysis of `level4.mp3`). Check that the Chatelet chart is the hand written one.
12. "Perfects speed the song up a little, misses slow it down" and "the better you play, the faster the song gets". On disk in `src/v2/tempo.ts` (Perfect +0.6 percent, Great +0.3, miss -1.5, range 0.90 to 1.15, decay 1 percent a second), applied to the music rate in `src/v2/game.ts`. The decay out-pays one Perfect a second, so the song only speeds up when Perfects land faster than about 1.7 a second. Confirm by ear in the shipped build, on a run of Perfects.
13. fps. Not measured (STATUS.md at 14:05: nobody has seen the 3D build render). Open `?debug=1` on a laptop and a phone, then add one sentence to Accomplishments: "Measured N fps on a MacBook and M fps on an iPhone".
14. Lyria generation script and music gate script. The repo has no script that calls Lyria (`scripts/render-music.ts` is the first game's procedural music renderer) and `scripts/eval-music.ts` (named in `docs/evals.md`) is not in `scripts/`, only the manifest with the model id and prompt per track. Add the scripts or say in the README that the tracks were generated with the manifest prompts through the Gemini API.
15. Characters. The build ships James (player) and Abe (His Holiness) and skips crowd models (`scripts/build.mjs`, so Sophie is not shipped). Check `ls dist/models/characters`.
16. Mixamo terms. Adobe's FAQ says the characters and animations are royalty free for commercial projects including games, and that the raw files cannot be redistributed as standalone assets (https://helpx.adobe.com/creative-cloud/faq/mixamo-faq.html, read through a search summary because the page answered 403 to a fetch). `git ls-files | rg -i '\.fbx$'` printed nothing at 14:12, and the converted glb files are committed under `assets/3d/` (39 files). Decide whether the glb files may stay public. Gradium's terms were not read.
17. Repository license. `gh repo view` showed no license and there is no LICENSE file at 14:12. Add one (MIT recommended) before the deadline, or the README says all rights reserved.
18. No em dash or en dash: `rg -nP "\x{2014}|\x{2013}" docs/ README.md` must print nothing.
19. The submission itself. The form is the modal behind "Submit your project" on the hackathon dashboard, and the captain must be checked in at the registration desk to submit. The deadline is 19:00 CEST. All values are in `docs/submission-values.md`.
20. Easy onboarding. "No text tutorial", the four beat count in, single arrows with wide windows, the ghost hand, the two second demo of the 69, the announcer calling move names, "the first 15 seconds cannot be lost". Not on disk at 14:35: `rg -n -i "ghost|tutorial|demo" src/v2` finds only the crowd's ghost copy (`src/render3d/crowd.ts`). The count in exists (4 beats, `src/v2/game.ts`). Check: hand a phone to someone who never saw the game, say nothing for 20 seconds. Delete each piece the build lacks, and if there is no ghost hand, write "the announcer calls each move by name".
21. The tightening window. 110 ms at combo 0 and 70 ms at combo 25, the ring shrinking. Not on disk at 14:35: `WINDOWS` in `src/qte/judge.ts` is a fixed 45 ms Perfect, 90 ms Great, 130 ms Ok scaled only by `windowScale` per level. Check: `rg -n "WINDOWS" src` and play to combo 25. Write the numbers the code prints, and say whether the figure is either side of the beat or the full width.
22. The 69 release multiplier and FLOW. The multiplier is on disk (`src/v2/core.ts`: Perfect x2, Great x1.5, Ok x1, off the beat x0.5, applied to the mash count). FLOW (8 Perfects in a row, sunglasses, x2) is not: `rg -n -w -i "streak|perfectRun" src/v2 src/render3d` finds no Perfect streak logic (one line of a taunt in `cast.json`), and the sunglasses in `src/render3d/stage.ts` fire at combo 25, not on a Perfect streak. Delete the FLOW sentence if it did not ship.
23. Stars and cringe mode. The three stars rule is on disk (`src/v2/core.ts`: 90 percent accuracy and zero cringe, 80 percent for two, a win for one). Cringe mode exists only in the first 2D build (`src/main.ts`, it halves the timing windows after the last level). Delete "and after a win, cringe mode asks for more" unless the 3D build has it.
24. Stickiness. Four claims, four checks. Retry on the beat: at 14:35 the results prompt is "TAP TO RETRY" after a loss and "TAP TO CONTINUE" after a win (`src/v2/ui/results.ts`), so a win still goes back to the map. Personal best: on disk (`src/v2/ui/progress.ts`, score, stars, accuracy, best 69 per level in `localStorage`), the rank is not stored there, so say "best" alone if there is no rank. Aura Packs: code and tests are on `origin/packs` (`src/packs/`, `docs/packs.md`: 13 emotes in five rarities at 60, 25, 10, 4 and 1 percent, duplicates become shards, an Aura Pass of 10 tiers, everything local), not on `origin/main`, and `rg -n -i "pack" src/v2` prints nothing there. Share card: not on any branch (`rg -n -i "navigator.share"` prints nothing); check that the Web Share sheet opens on a phone from the itch embed as well as from GitHub Pages. World tour locked stops: see row 6. Delete each piece that did not ship, keep the others.
25. Mobile first. Portrait layout on a phone, one thumb for every move, the itch embed set to portrait. On disk: one thumb touch on the full canvas (`src/v2/ui/battleInput.ts`) and a portrait phone rule for the top bar (`public/v2/v2.css`). Check: open the root URL and the itch page on a phone held upright, play the whole battle with one thumb. If the battle is landscape on a phone, write "for your phone" and delete "portrait".
26. Timing windows in the Challenges and How I built it text, and every "45 ms, 90 ms, 130 ms" in the other docs (`docs/presentation.md` closing screen, `docs/readme-draft.md`), move together with row 21.

## Checker output

`check.py --type submission docs/submission.md`, run 2026-09-26 14:41 CEST after the mobile first pass:

```
PASS  G17 zero em-dash / en-dash
PASS  G48 zero caractere invisible
PASS  G14 section 'what it does'  (183 mots)
PASS  G14 section 'how i built it'  (387 mots)
PASS  G14 section 'challenges'  (256 mots)
PASS  G14 section 'built with'  (64 mots)
PASS  G13 probleme avant techno
PASS  G16 au moins un chiffre  (110 ms, 70 ms, 90 percent, 110 ms)
PASS  G20 nom du projet  (AURA)
PASS  G19 exigences du track  (6 cochees)

RESULTAT: PASS mecanique
```
