// Menu sounds for the v2 screens: one delegated listener, so no screen has to know about audio. A button whose
// label reads as going back plays the cancel slot, any other button the confirm slot, arrow keys on a menu the
// move slot. Nothing plays before the tap to start gate has created the AudioContext.
import { ctx, sfxBus } from "./engine";
import { play, useOutput, type Slot } from "../sfx";

const BACK = /^\s*(back|quit|close|cancel|menu|nah|x|←)\b/i;

export function menuSlot(label: string): Slot {
  return BACK.test(label) ? "menuCancel" : "menuConfirm";
}

export function bindMenuSounds(isBattle: () => boolean, root: Document = document) {
  const fire = (slot: Slot) => {
    if (!ctx || ctx.state !== "running") return;
    try {
      useOutput(ctx, sfxBus);
      play(slot);
    } catch (err) {
      console.warn(`menu sfx ${slot}:`, err);
    }
  };
  root.addEventListener(
    "click",
    (e) => {
      const b = (e.target as Element | null)?.closest?.("button, [role=button], a");
      if (b) fire(menuSlot(b.textContent ?? ""));
    },
    true,
  );
  root.addEventListener("keydown", (e) => {
    if (isBattle() || e.repeat) return;
    if (e.key === "ArrowUp" || e.key === "ArrowDown" || e.key === "ArrowLeft" || e.key === "ArrowRight") fire("menuMove");
  });
}
