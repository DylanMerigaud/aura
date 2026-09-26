# AURA: hackathon submission form, exact values

The form is the modal behind "Submit your project" on
https://hackathons.techeurope.io/dashboard/hackathons/tech-europe-ai-gaming-hack, read verbatim in
`docs/submission-form.md` (2026-09-26, nothing was submitted). Every value below is for one field of
that modal, in the order the modal shows them. Deadline: 19:00 CEST today.

## Gate first: the captain must be checked in

The banner above the form says: "On-site? Check in at the registration desk when you arrive, your
captain needs to be checked in to submit." Dylan is the captain of Itchy & Scratchy (Dorian Poupard
is the other member), so Dylan's own check in at the desk is what unlocks Submit. Do it before
17:30, not at 18:55: a filled form does nothing if the captain is not checked in.

Order of the last hour: itch.io page Public, then `docs` merged into `main` and deployed, then this
form, so every link you paste already answers.

## The fields

| # | Field in the modal | Value |
|---|---|---|
| 1 | Team Code | G28FMJ (read only, nothing to type) |
| 2 | What are you building? | the block under "Field 2" below (120 words, the form shows no limit, 130 is the cap I set) |
| 3 | Which track are you competing on? | Build a Game |
| 4 | Which partner technologies did you use? | tick Google DeepMind, Gradium and Cognition (all three) |
| 5 | Which side challenges do you want to participate in? | tick Cognition |
| 6 | GitHub Repo (must be public) | https://github.com/DylanMerigaud/aura |
| 7 | Hosted Version of the Game (link) | https://dylanmerigaud.github.io/aura/ |

Field 3: the handoff said Open Innovation. The modal has one radio option only, "Build a Game" (the
team's track on the dashboard is "Build a Game by Voodoo"), so that is the value. There is no Open
Innovation option and no Voodoo checkbox to tick.

Field 5: the side challenge checkbox is labeled Cognition and nothing else, there is no Devin box.
The claim is true and checkable: Cognition's Devin wrote the Cloudflare Worker as pull request 1,
https://github.com/DylanMerigaud/aura/pull/1 (author `app/devin-ai-integration`, merged 2026-09-26
13:26 CEST, read with `gh pr view 1`). Keep the PR link at hand if a judge asks.

Field 7: one text input, one URL. The itch.io page is the published game the hackathon rules ask for
and it plays the same build as the GitHub Pages root. Put the GitHub Pages root in the field and the
itch.io link in the description of the itch page and in the README, or the reverse if a mentor says
the field must hold the itch.io URL:

- itch.io page (FILL when it is Public and plays): https://dylanmerigaud.itch.io/aura

### Field 2, What are you building?

```
You have zero aura, and a TikTok LIVE crowd is watching you fix that in one rhythm battle at Chatelet in Paris, against Mehdi Aura. Easy onboarding: no tutorial text, the first 20 seconds teach by doing and cannot be lost. Hard to master: the Perfect window tightens from 110 ms to 70 ms as your combo climbs, and the better you play the faster the song gets. Stickiness: one tap retries on the beat, and a share card sends your score to TikTok or WhatsApp. Mobile first: portrait, touch, one hand. Lyria 3 Pro made the music, Gemini wrote the lines and the live roast, Gradium and Gemini TTS voiced them, through a Cloudflare Worker that Cognition's Devin wrote.
```

Sentence order follows the organizers' new brief (the demo is on mobile, the judges look for
stickiness, easy onboarding and a game hard to master): the fantasy first, then the three judge
words in their own words with one line of proof each, then mobile first, then the partner models by
name, then Devin's Worker in one clause. No stack before the player. Count: run the command in the
checks below, it must print 130 or less (120 at the time of writing).

## Checks before you press Submit

Run these from the repo root of the merged `main`. Each one has the value it must print.

1. Repo is public: `gh repo view DylanMerigaud/aura --json visibility -q .visibility` prints
   `PUBLIC` (it did at 14:12).
2. Hosted link answers and serves the latest build: `curl -sI https://dylanmerigaud.github.io/aura/ | head -1`
   prints 200 (it did at 14:12). The judges open it on a phone, so open it once on a phone in portrait too. The root still served the first 2D build at 14:12 and the 3D build
   under `/v2/`. The handoff says the latest build is always at the root, so open the root once in a
   private window and confirm it shows the battle described above before you paste it.
3. itch.io page is Public and plays in a private window on a phone and a laptop.
4. `README.md` (setup and installation steps) and `docs/apis.md` (APIs, frameworks and tools) are
   pushed on `main`. The README is still the 2D build's README until `docs/readme-draft.md` is copied
   over it at the 17:30 merge.
5. Description length: `pbpaste | wc -w` after copying the block, it must print 130 or less.
6. No dash characters in anything pasted: `pbpaste | rg -P "\x{2014}|\x{2013}"` prints nothing.
7. The mandatory partner count: at least 2 partner technologies used, three ticked. Each has a file
   on disk: Google DeepMind (the music in `assets/music/`, the cast in `src/v2/cast.json`, the art
   in `public/art/`), Gradium (`public/voice/`), Cognition (pull request 1, the folder `worker/`).

## Which sentence depends on what

The build is still moving (STATUS.md at 14:12 says the 3D build has not been seen rendering), and the
mobile claims in Field 2 (onboarding, the tightening window, the share card, portrait) were decided
at 14:35 and are being built by other lanes: none of them was on `origin/main` at 14:35, so each has
a row below with the check and the sentence to paste if it fails. Each row is a claim in Field 2,
the check, and the sentence to paste if the check fails.

| Claim in the description | Check | If it fails, use |
|---|---|---|
| "at Chatelet in Paris, against Mehdi Aura" | Play the root URL: the map opens on Chatelet and the fight is Mehdi Aura | delete "at Chatelet in Paris, against Mehdi Aura" and write "in one perfect rhythm battle" |
| "a TikTok LIVE crowd", "an announcer calls every hit" | The battle shows the LIVE badge, viewers and comments; the announcer's short calls play | drop "a TikTok LIVE crowd is watching you" and write "a crowd is watching you" |
| "Easy onboarding: no tutorial text, the first 20 seconds teach by doing and cannot be lost" | Play the root URL as a first time player for 20 seconds with no help: a 4 beat count in, single arrows with wide windows, a ghost hand showing the swipe once, the 69 shown by a 2 second hand demo, the announcer calling the move names, and no fail possible before 15 seconds. NOT ON DISK at 14:35: `rg -n -i "ghost\|tutorial\|demo" src/v2` finds only the crowd's ghost copy (`src/render3d/crowd.ts`), no hand and no protected opening | "Easy onboarding: no tutorial text, the announcer calls each move by name." if the hand is missing but the calls work, else delete the "Easy onboarding" sentence and keep the other two |
| "Hard to master: the Perfect window tightens from 110 ms to 70 ms as your combo climbs" | The ring around each target shrinks as the combo grows, and the code scales the window: 110 ms at combo 0 down to 70 ms at combo 25. NOT ON DISK at 14:35: `WINDOWS` in `src/qte/judge.ts` is a fixed 45 ms Perfect, 90 ms Great, 130 ms Ok. Say whether 110 ms is the window either side of the beat or its full width, the way the code does | "Hard to master: the timing window tightens as your combo climbs" if the build tightens but the numbers differ, and the numbers `WINDOWS` prints if they do |
| "the better you play the faster the song gets" | On disk: `src/v2/tempo.ts` (Perfect +0.6 percent, Great +0.3, miss -1.5, range 0.90 to 1.15, decay 1 percent a second), applied to the music rate in `src/v2/game.ts`. The decay out-pays one Perfect a second, so the song only speeds up when Perfects land faster than about 1.7 a second: confirm by ear in the shipped build, on a run of Perfects | none if it plays, else delete the clause |
| "Stickiness: one tap retries on the beat" | On a lose and on a win, one tap restarts the battle at once, the count in included. At 14:35 the results prompt reads "TAP TO RETRY" after a loss and "TAP TO CONTINUE" after a win (`src/v2/ui/results.ts`), and the win goes back to the map | "Stickiness: one tap retries" if the retry lands on the count in and not on the beat, or "Stickiness: your best score is kept and a tap retries" if a win still routes through the map |
| "a share card sends your score to TikTok or WhatsApp" | Finish a fight on a phone, tap Share: the Web Share sheet opens with a 1080 x 1920 image (score, tier, combo, roast, the stop, the handle). NOT ON DISK: `rg -n -i "navigator.share" src` finds nothing on any branch at 14:35 (the only file with "share" in its name is `src/v2/ui/hud/shared.ts`, a HUD helper). Web Share needs a secure context, so it works on GitHub Pages and on the itch embed only if the iframe allows it (test on the itch page, not only on the root) | delete "and a share card sends your score to TikTok or WhatsApp" and write "and your best score and rank are kept", which is on disk (`src/v2/ui/progress.ts` keeps score, stars, accuracy and best 69 per level in `localStorage`; the rank is a TO VERIFY) |
| "Mobile first: portrait, touch, one hand" | Open the root URL on a phone held in portrait: the battle fills the screen and every move (swipe, mash, hold, release) works with one thumb. On disk at 14:35: one thumb touch on the full canvas (`src/v2/ui/battleInput.ts`) and one portrait phone rule for the top bar (`public/v2/v2.css`). Not seen on a phone: STATUS.md says nobody had watched the 3D build render | "Built for a phone, played with swipes and taps." if the layout is landscape on a phone, and delete "portrait" |
| "a world tour map shows the fights to come" (not in Field 2 any more, kept in the write-up) | The map screen shows the locked stops with a padlock | delete the clause in `docs/submission.md` |
| "Gemini writes a roast of how you played and Gradium speaks it, live" | Finish a fight on the root URL with sound on: the chip "roast written live by Gemini, voiced live by Gradium" appears. FOUND at 14:12: `/roast` answered in 4.8 to 6.5 s in four tries and the game stops waiting after 3 s (`post("/roast", ..., 3000)` in `src/v2/net/live.ts`), so the chip would almost never show; the voice route answered in 1.6 s. Needs the timeout raised (8 s) or the roast requested when the fight ends, in the main session | "At the end, the announcer's verdict plays, and when our Cloudflare Worker answers in time, Gemini writes a roast of how you played and Gradium speaks it." |
| "through a Cloudflare Worker that Cognition's Devin wrote" | `gh pr view 1 --repo DylanMerigaud/aura --json author,state -q '.author.login + " " + .state'` prints `app/devin-ai-integration MERGED` (it did at 14:12), and the Worker answers: `curl -s -X POST https://aura-proxy.dylanmerigaud-pro.workers.dev/roast -H 'content-type: application/json' -d '{"level":1,"score":9000,"rank":"A","combo":40,"perfect":20,"miss":2,"cringe":0}'` prints a JSON with `roast` | none, the claim is on disk today |
| "Lyria 3 Pro made the music" | `rg -o "lyria-[0-9a-z.-]+" assets/music/manifest.json scripts \| sort -u` prints the Pro model id. At 14:12 it printed `lyria-3.5` and `lyria-3-clip-preview` (the first render), so this sentence follows the decision to regenerate with Lyria 3 Pro and holds only after the new manifest is committed | replace "Lyria 3 Pro" with the exact ids the command prints |
| "Gemini wrote the lines" | `rg -o "gemini-[0-9a-z.-]+" scripts worker/src \| sort -u`: the line generator names a Gemini model | none, the family name is true whatever the version |
| "Gradium and Gemini TTS voiced them" | `ls public/voice/v2/` holds lines from both engines, the bake off winner per `docs/` or the ledger | delete "and Gemini TTS" if no shipped line comes from it |
