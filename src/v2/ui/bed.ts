// Menu music bed: the title Lyria loop under the title, map and VS card, faded out across the battle's
// count in bar so the kick count and the level track take over (amendment 9 section 5, map to level
// crossfade). Optional: a slow or failed download just leaves the menus silent.
import { ctx, musicBus } from "../../audio/engine";

const LEVEL = 0.55;

export function buildBed(base: string) {
  let buf: Promise<AudioBuffer | null> | null = null;
  let src: AudioBufferSourceNode | null = null;
  let gain: GainNode | null = null;
  let wanted = false;

  function load(): Promise<AudioBuffer | null> {
    buf ??= fetch(`${base}music/title.mp3`)
      .then((r) => (r.ok ? r.arrayBuffer() : Promise.reject(r.status)))
      .then((a) => ctx.decodeAudioData(a))
      .catch(() => {
        buf = null;
        return null;
      });
    return buf;
  }

  /** Fade the loop in (no-op while it already plays). */
  function start(fadeIn = 1) {
    wanted = true;
    if (!ctx) return;
    if (gain && src) {
      gain.gain.cancelScheduledValues(ctx.currentTime);
      gain.gain.setTargetAtTime(LEVEL, ctx.currentTime, fadeIn / 3);
      return;
    }
    void load().then((b) => {
      if (!b || !wanted || src) return;
      const t = ctx.currentTime;
      const s = ctx.createBufferSource();
      s.buffer = b;
      s.loop = true;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, t);
      g.gain.setTargetAtTime(LEVEL, t, fadeIn / 3);
      s.connect(g).connect(musicBus);
      s.start(t);
      src = s;
      gain = g;
    });
  }

  /** Fade out over `seconds` (a bar of the next level) and stop. */
  function stop(seconds: number) {
    wanted = false;
    const s = src, g = gain;
    src = null;
    gain = null;
    if (!s || !g || !ctx) return;
    const t = ctx.currentTime;
    g.gain.cancelScheduledValues(t);
    g.gain.setValueAtTime(g.gain.value, t);
    g.gain.linearRampToValueAtTime(0.0001, t + Math.max(0.05, seconds));
    s.stop(t + Math.max(0.05, seconds) + 0.05);
  }

  return { start, stop };
}
