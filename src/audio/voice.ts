// Voice lines: plays the Gradium-rendered file for a line id, falls back to browser speech synthesis.
import { ctx, master } from "./engine";

let index: Record<string, string> = {};
const buffers = new Map<string, AudioBuffer>();

export async function loadVoices() {
  try {
    const r = await fetch("voice/index.json");
    if (r.ok) index = await r.json();
  } catch {
    index = {};
  }
}

/** Decode the lines of one level ahead of time so playback is instant. */
export async function preload(ids: string[]) {
  await Promise.all(
    ids.map(async (id) => {
      const file = index[id];
      if (!file || buffers.has(id)) return;
      try {
        const data = await (await fetch(`voice/${file}`)).arrayBuffer();
        buffers.set(id, await ctx.decodeAudioData(data));
      } catch {
        /* missing file: speech synthesis fallback below */
      }
    }),
  );
}

export function play(id: string, fallbackText: string, opts: { pitch?: number; rate?: number } = {}) {
  const buf = buffers.get(id);
  if (buf) {
    const s = ctx.createBufferSource();
    s.buffer = buf;
    const g = ctx.createGain();
    g.gain.value = 1.1;
    s.connect(g).connect(master);
    s.start();
    return;
  }
  if (!("speechSynthesis" in window)) return;
  const u = new SpeechSynthesisUtterance(fallbackText);
  u.pitch = opts.pitch ?? 0.8;
  u.rate = opts.rate ?? 1.1;
  speechSynthesis.cancel();
  speechSynthesis.speak(u);
}
