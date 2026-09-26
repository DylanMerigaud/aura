# AURA: the 5 minute live demo, on a phone

Five finalists present 5 minutes live, and the demo is on mobile. Judged on Performance, Execution
quality, Novelty, Stickiness; the organizers said: stickiness, easy onboarding, hard to master. The
first 20 seconds decide, so the phone is already in the hand, the title already on screen, sound up.

## Setup (before walking on)

- Phone: brightness max, Do Not Disturb, silent switch OFF (iOS mutes Web Audio on silent), volume
  max, the page https://dylanmerigaud.github.io/aura/ open on the title, held upright. Screen
  mirrored to the projector (the organizers' cable or AirPlay), tested once.
- Play one battle before going on stage so the assets are cached and you know the chart. The
  progress is saved on the device: to open on THE BOAT KID, play in a fresh private tab or lose
  the last battle before walking on (a loss replays the same rival).
- Fallback: a laptop on the same URL (the mouse drives the same gestures: drag is a swipe, click is
  a tap), and a screen recording of one full battle on the phone in case the network dies.

## 0:00 to 0:20, the hook (no slides)

Phone up, the title on the projector: the black arena, one spotlight, both fighters grooving. Say:

> "You have zero aura. That is THE BOAT KID, rank Aura 9000. We are live on TikTok, and I have 40
> seconds to take his crowd."

Tap the title during the sentence: one tap is the whole way in, the count in starts at once. The
first thing the room sees is the fight, not a menu.

## 0:20 to 1:30, play the battle, narrate in short lines

Play the full level (39.7 seconds, 86 beats at 130 BPM). Speak only between moves:

- On the first round notes: "One thumb. Tap on the beat."
- On the first arrow: "Now the arrows: swipe their way."
- On the 67: "Six seven: both thumbs, then swipe up on the drop." Let the release land, say nothing.
- On a clean run: "Listen: the song is speeding up. Play clean and the track runs faster."
- On the like bar: "The crowd votes: likes on a hit, dislikes on a miss."

## 1:30 to 2:15, the pack and the live roast

If it was a win, the Aura Pack pops right after the last beat: tap to tear, let the cards fly.
"Every win drops a pack. Emotes, rarities, all local, no money."

Then the results card. Read nothing aloud until the roast appears:

> "That line was written just now by Gemini about my run. No key in the game: it goes through a
> Cloudflare Worker that Cognition's Devin wrote."

If the network is slow the announcer's line stays on the card; say "offline, it falls back to the
announcer" and move on. Point at the XP bar filling: "Every fight fills your rank, NPC to Aura 9000."

## 2:15 to 3:15, why it sticks (the three words, one proof each)

- Easy onboarding: "One tap to play. The first notes are taps, a ghost finger shows each move once,
  and the first 15 seconds cannot be lost. No tutorial screen."
- Hard to master: "Then arrows, swipes in their direction, the 67 and the hold. A Perfect is 45
  milliseconds either side of the beat, the windows get tighter as your combo grows, combo x4 at
  50, and a miss slows the whole song."
- Stickiness: "Win and the next rival steps in: the Turnstile Ninja, Papi Raleur, La Parisienne,
  Sporty Granny. Lose and you are back in one tap. And the roast is new every run."

Hand the phone to a judge for one retry if the room allows it.

## 3:15 to 4:15, how it is built (one breath each)

- "3D in the browser, three.js, portrait first, gestures only. The audio clock is the only clock:
  every touch is judged on what you heard, not on the frame."
- "Google DeepMind: Lyria made the music, lyria-3.5 for this track and lyria-3-pro-preview for the
  funk title loop and two levels. Gemini roasts live on gemini-3.8-flash. Every voice line was a
  bake off between Gradium Voice Design, gemini-3.8-flash-tts and gemini-2.5-pro-preview-tts, and
  gemini-3.1-pro-preview listened to each take and scored it. Gradium made the crowd chants."
- "Cognition: Devin wrote the Worker and four modules, the LIVE overlay, the map, the balance sim,
  the input module, all merged as pull requests."
- "Every generated asset passes an eval before it ships: 2018 rows in the ledger. 703 tests."
- "Sixteen Gen Z sound effects, all synthesized in code, no sample."

## 4:15 to 5:00, close

> "Five rivals, one arena, one thumb. AURA: you have zero aura. Fix that. It is on itch.io and on
> your phone right now."

Last frame on the projector: the URL: https://dylanmerigaud.github.io/aura/

## If something breaks on stage

- No sound: silent switch, then volume; if still nothing, switch to the laptop.
- Black screen or stutter: reload once (cached), else play the screen recording and narrate over it.
- Roast never comes: say the fallback line above, it is designed for that.
