// Placeholder announcer voice: the browser's speechSynthesis says the short battle calls (YOUR MOVE /
// HIS MOVE) until recorded lines exist. Guarded: silent where the API is missing or throws.

/** The call for a turn, shared by the HUD popup and the voice. */
export function turnCall(who: "player" | "opponent"): string {
  return who === "player" ? "YOUR MOVE" : "HIS MOVE";
}

/** Speak a short call now, cutting whatever the announcer was still saying. */
export function announce(text: string): void {
  try {
    const synth = typeof window !== "undefined" ? window.speechSynthesis : undefined;
    if (!synth || typeof SpeechSynthesisUtterance === "undefined") return;
    synth.cancel();
    const u = new SpeechSynthesisUtterance(text.toLowerCase());
    u.rate = 1.1;
    u.pitch = 0.8;
    u.volume = 1;
    u.lang = "en-US";
    synth.speak(u);
  } catch {
    /* no voice on this browser: the popup carries the call */
  }
}
