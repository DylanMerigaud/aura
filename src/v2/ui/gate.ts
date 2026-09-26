// TITLE SCENE (addendum 15:20): the loaded 3D stage idles behind a see through overlay, the big AURA
// logo and a pulsing TAP line (addendum 16:15: white condensed letters, dark outline, one accent). The
// scene itself is the tap to start: the first tap anywhere (pointer down, click or any key) unlocks audio
// AND starts the current opponent's battle, one input from the title to playing.
// Layout (addendum 17:35), top to bottom: the AURA logo, a clear band where the fighters stand in the
// scene, the big TAP TO PLAY, then LOADOUT and SETTINGS as two small buttons side by side in the thumb
// zone. Each button owns its hit area: nothing it receives reaches the start tap.
// No loading screen (addendum 17:40): this is the first screen; waiting(true) turns the prompt into a
// short GETTING READY pulse while app.ts gives the rigs at most a second after the tap.
//
// Audio unlock: initAudio creates the context on the tap if nothing did before. resume() runs on the tap's pointerdown and again on its pointerup, since iOS only
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

export interface GateCorners {
  loadout(): void;
  settings?(): void;
}

export function buildGate(onStart: () => void, corners: GateCorners) {
  const root = el("section", "screen gate");
  root.appendChild(el("h1", "logo gate-logo", "AURA"));
  // The fighters stand in the 3D scene behind this band: nothing is drawn over them.
  root.appendChild(el("div", "gate-space"));
  const prompt = el("p", "gate-prompt", "TAP TO PLAY");
  root.appendChild(prompt);
  let touch = false;
  try {
    touch = typeof matchMedia === "function" && matchMedia("(pointer: coarse)").matches;
  } catch {
    /* no media queries: the desktop hint */
  }
  root.appendChild(el("p", "gate-hint", touch ? "you have zero aura. fix that." : "click or any key"));
  const row = el("div", "gate-row");
  root.appendChild(row);

  let fire = once(() => {});
  let armedAt = 0;
  function arm() {
    armedAt = performance.now();
    fire = once(() => {
      unlockAudio();
      onStart();
    });
  }

  // A title button owns its hit area: nothing it receives reaches the start tap.
  function corner(cls: string, label: string, act: () => void) {
    const b = el("button", "gate-btn " + cls, label);
    b.type = "button";
    const stop = (e: Event) => e.stopPropagation();
    b.addEventListener("pointerdown", stop);
    b.addEventListener("pointerup", (e) => {
      e.stopPropagation();
      unlockAudio();
    });
    b.addEventListener("click", (e) => {
      e.stopPropagation();
      unlockAudio();
      act();
    });
    row.appendChild(b);
    return b;
  }
  corner("gate-loadout", "LOADOUT", () => corners.loadout());
  if (corners.settings) corner("gate-settings", "SETTINGS", () => corners.settings?.());

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

  /** The GETTING READY pulse on the prompt while the tap waits (a second at most) for the fighters. */
  function waiting(on: boolean) {
    prompt.textContent = on ? "GETTING READY" : "TAP TO PLAY";
    prompt.classList.toggle("waiting", on);
  }

  arm();
  return {
    root,
    onKey,
    /** Re-arm the one tap each time the title scene is shown again. */
    show() {
      arm();
      waiting(false);
    },
    waiting,
  };
}
