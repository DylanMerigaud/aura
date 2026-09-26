// Plays decoded voice buffers through the one VoiceQueue (src/v2/voiceQueue.ts): the battle lines
// (src/v2/game.ts), the announcer calls (src/v2/ui/announce.ts) and the live Gradium roast
// (src/v2/net/live.ts) all go through here, so two voices never overlap.
import { ctx, master } from "../audio/engine";
import { callKey, VoiceQueue, type VoiceKind } from "./voiceQueue";

export const queue = new VoiceQueue();
const sources = new Map<number, AudioBufferSourceNode>();

/** Queue a decoded line; false when the queue dropped it. Guarded: never throws without audio. */
export function playVoice(buf: AudioBuffer, kind: VoiceKind, id: string, opts: { at?: number; gain?: number; maxWait?: number } = {}): boolean {
  try {
    if (!ctx || !master) return false;
    const d = queue.request({ id, kind, duration: buf.duration, at: opts.at, maxWait: opts.maxWait }, ctx.currentTime);
    for (const b of d.bumped) stop(b.token);
    if (!d.play) return false;
    const s = ctx.createBufferSource();
    s.buffer = buf;
    const g = ctx.createGain();
    g.gain.value = opts.gain ?? 1.2;
    s.connect(g).connect(master);
    s.start(d.start);
    sources.set(d.token, s);
    s.onended = () => sources.delete(d.token);
    return true;
  } catch {
    return false;
  }
}

function stop(token: number) {
  const s = sources.get(token);
  sources.delete(token);
  try {
    s?.stop();
  } catch {
    /* already stopped */
  }
}

/** Stop every queued and sounding voice (a quit or a new battle). */
export function stopVoices() {
  for (const b of queue.clear()) stop(b.token);
}

// Announcer calls: recorded files keyed "call-<slug>" in voice/v2/index.json. No file, no sound.
const calls = new Map<string, AudioBuffer>();

/** Decode the recorded announcer calls listed in the voice index (keys starting "call-"). */
export async function loadCalls(base: string, index: Record<string, string>): Promise<void> {
  if (!ctx) return;
  await Promise.all(
    Object.keys(index)
      .filter((k) => k.startsWith("call-") && !calls.has(k))
      .map(async (k) => {
        try {
          const a = await (await fetch(`${base}voice/v2/${index[k]}`)).arrayBuffer();
          calls.set(k, await ctx.decodeAudioData(a));
        } catch {
          /* missing call: silent */
        }
      }),
  );
}

/** Play the recorded call for a text ("six! seven!" plays "call-six-seven"), if there is one. */
export function playCall(text: string): boolean {
  const k = callKey(text);
  const b = calls.get(k);
  return b ? playVoice(b, "call", k) : false;
}
