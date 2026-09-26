// The announcer's one word calls: a recorded file per call in voice/v2/index.json ("six! seven!" is
// "call-six-seven"), played through the single voice queue (src/v2/voiceQueue.ts) at call priority.
// No recording, no sound: the robotic speechSynthesis placeholder is gone (addendum 17:05 point 5).
import { playCall } from "../voicePlayer";

/** Queue a short call; silent when the call has no recording or audio is not running. */
export function announce(text: string): void {
  try {
    playCall(text);
  } catch {
    /* no audio: the popup carries the call */
  }
}
