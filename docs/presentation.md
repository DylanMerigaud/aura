# AURA: the 5 minute live demo, on a phone

Five finalists present 5 minutes live, and the demo is on mobile. Judged on Performance, Execution
quality, Novelty, Stickiness; the organizers said: stickiness, easy onboarding, hard to master. The
first 20 seconds decide, so the phone is already in the hand, the game already loaded, sound up.

Markers for the 17:30 integration: `<PENDING 17:30: ...>` where the flow on main at 15:30 (title,
PLAY, the world tour map, then the fight) differs from the flow decided at 16:15 (title, one tap,
the fight), and `<VOICE WINNERS PENDING>` / `<MUSIC WINNERS PENDING>` for the model names.

## Setup (before walking on)

- Phone: brightness max, Do Not Disturb, silent switch OFF (iOS mutes Web Audio on silent), volume
  max, the page https://dylanmerigaud.github.io/aura/ open and loaded, held upright. Screen mirrored
  to the projector (the organizers' cable or AirPlay), tested once.
- Play one battle before going on stage so the assets are cached and you know the chart.
- Fallback: a laptop on the same URL (keyboard: arrows or WASD, Space or Enter), and a screen
  recording of one full battle on the phone in case the network dies.

## 0:00 to 0:20, the hook (no slides)

Phone up, game on the projector. Say, while tapping in:

> "You have zero aura. This is THE TURNSTILE NINJA, the Parisian who never paid a metro ticket. He is
> live on TikTok, and I have 40 seconds to steal his aura."

Start the fight during the sentence. <PENDING 17:30: on main at 15:30 the path is PLAY, then tap
CHATELET on the world tour map; if the one tap flow shipped, one tap on the title starts the count
in.> The first thing the room must see is the fight and the LIVE chat moving, not a menu.

## 0:20 to 1:30, play the battle, narrate in short lines

Play the full level (about 40 seconds, 86 beats at 130 BPM). Speak only between moves:

- On the first notes: "One thumb. On the beat." <PENDING 17:30: "swipe" on main at 15:30, "tap" if
  the tap only input shipped.>
- When the LIVE chat shows a partner cameo: "That is Gemini in the chat. It wrote his taunts."
- On a MASH: "Mash, then release on the drop." Let the release land, say nothing.
- On a clean run: "Listen: the song is speeding up. Play clean and the track runs faster."

## 1:30 to 2:15, the results and the live roast

Let the results screen breathe. Read nothing aloud until the roast appears:

> "That line was written just now by Gemini about my run, and Gradium is saying it live. No key in
> the game: it goes through a Cloudflare Worker that Cognition's Devin wrote."

If the network is slow the announcer's bundled line plays instead; say "offline, it falls back to
the announcer" and move on.

If it was a win, the Aura Pack opens: tap to tear, let the cards flip. "Every win drops a pack.
Emotes, rarities, all local, no money."

## 2:15 to 3:15, why it sticks (the three words, one proof each)

- Easy onboarding: "Three moves: hit, hold, mash. You saw me learn them in the fight, no tutorial
  screen."
- Hard to master: "A Perfect is 45 milliseconds either side of the beat. Combo x2 at 10, x4 at 50.
  Three stars need 90 percent and zero cringe. And the tempo rule punishes a miss by slowing the
  whole song."
- Stickiness: "Lose and you are back in the fight at once. Win and you open a pack. And the chat
  roasts you, so you want another run."

Hand the phone to a judge for one retry if the room allows it.

## 3:15 to 4:15, how it is built (one breath each)

- "3D in the browser, three.js, portrait first, touch and keyboard. The audio clock is the only
  clock: every input is judged on what you heard, not on the frame."
- "Google DeepMind: Gemini wrote the rival (gemini-3.1-pro-preview) and roasts live
  (gemini-3.8-flash); Lyria made the music (<MUSIC WINNERS PENDING>). Voices: <VOICE WINNERS
  PENDING>. Gradium speaks the live roast."
- "Cognition: Devin wrote the Worker and four modules, the LIVE overlay, the map, the balance sim,
  the input module, all merged as pull requests."
- "Every generated asset passes an eval before it ships: 546 checks in the ledger. 622 tests."
- "Sixteen Gen Z sound effects, all synthesized in code, no sample."

## 4:15 to 5:00, close

> "Chatelet is stop one. Barbes, Shibuya, Rio and the Pacu Jalur boat race are next on the world
> tour. AURA: you have zero aura. Fix that. It is on itch.io and on your phone right now."

Last frame on the projector: the URL: https://dylanmerigaud.github.io/aura/

## If something breaks on stage

- No sound: silent switch, then volume; if still nothing, switch to the laptop.
- Black screen or stutter: reload once (cached), else play the screen recording and narrate over it.
- Roast never comes: say the fallback line above, it is designed for that.
