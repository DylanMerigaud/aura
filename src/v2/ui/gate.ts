// TITLE SCENE (addendum 15:20): the loaded 3D stage idles behind a see through overlay, the big AURA
// logo and a pulsing TAP line. The scene itself is the tap to start: the first tap anywhere (pointer
// down, click or any key) unlocks audio AND starts the level 1 battle, one input from the title to
// playing. The MENU corner button has its own hit area and opens the fake title menu instead.
//
// Audio unlock: the AudioContext already exists (created suspended during loading so the music
// decodes ahead). resume() runs on the tap's pointerdown and again on its pointerup, since iOS only
// counts the release as the gesture that may start audio (the v1 lesson; main.ts also wakes the
// context on every pointerup). The battle schedules on the audio clock, so a context that resumes a
// few ms later still counts in cleanly.
import { ctx, initAudio } from "../../audio/engine";
import { el } from "./dom";
import { isTapKey, once } from "./flow";

/** Resume the context and play one silent sample: the belt and braces iOS unlock. Never throws. */
export function unlockAudio() {
  try {
    initAudio();
    void ctx.resume().catch(() => {});
    const b = ctx.createBuffer(1, 1, ctx.sampleRate);
    const s = ctx.createBufferSource();
    s.buffer = b;
    s.connect(ctx.destination);
    s.start(0);
  } catch {
    /* no Web Audio: the battle still runs on its visuals */
  }
}

export function buildGate(onStart: () => void, onMenu: () => void) {
  const root = el("section", "screen gate");
  const menuBtn = el("button", "corner-btn gate-menu", "MENU");
  menuBtn.type = "button";
  root.appendChild(menuBtn);
  root.appendChild(el("h1", "logo gate-logo", "AURA"));
  root.appendChild(el("p", "gate-prompt", "TAP TO PLAY"));
  const touch = typeof matchMedia === "function" && matchMedia("(pointer: coarse)").matches;
  root.appendChild(el("p", "gate-hint", touch ? "you have zero aura. fix that." : "click or any key"));

  let fire = once(() => {});
  let armedAt = 0;
  function arm() {
    armedAt = performance.now();
    fire = once(() => {
      unlockAudio();
      onStart();
    });
  }

  // The MENU button owns its hit area: nothing it receives reaches the start tap.
  const stop = (e: Event) => e.stopPropagation();
  menuBtn.addEventListener("pointerdown", stop);
  menuBtn.addEventListener("pointerup", (e) => {
    e.stopPropagation();
    unlockAudio();
  });
  menuBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    unlockAudio();
    onMenu();
  });

  root.addEventListener("pointerdown", (e) => {
    if (e.button > 0) return;
    // iOS: the release is the gesture that counts for audio. The battle screen replaces this overlay
    // on the down, so the up lands elsewhere: catch it on window, capture phase, before anyone stops it.
    addEventListener("pointerup", () => unlockAudio(), { capture: true, once: true });
    fire();
  });
  // Old browsers without pointer events, and assistive tech, still click.
  root.addEventListener("click", () => fire());

  function onKey(e: KeyboardEvent) {
    if (!isTapKey(e)) return;
    // The key that closed a menu a moment ago is not a new tap.
    if (performance.now() - armedAt < 150) return;
    e.preventDefault();
    fire();
  }

  arm();
  return {
    root,
    onKey,
    /** Re-arm the one tap each time the title scene is shown again. */
    show() {
      arm();
    },
  };
}
