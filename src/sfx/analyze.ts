// Pure measurements over rendered samples, shared by scripts/render-sfx.ts and tests/sfx: peak, DC offset,
// audible span, the longest silence inside a sound, peak normalization and a 16 bit mono WAV encoder.
// No Node and no DOM dependency, so a browser review page can reuse it too.

export const toDb = (v: number) => 20 * Math.log10(Math.max(v, 1e-12));
export const fromDb = (db: number) => Math.pow(10, db / 20);

export function peak(x: ArrayLike<number>): number {
  let p = 0;
  for (let i = 0; i < x.length; i++) p = Math.max(p, Math.abs(x[i]));
  return p;
}

/** Mean sample value over `x` (the DC offset). */
export function dcOffset(x: ArrayLike<number>): number {
  let s = 0;
  for (let i = 0; i < x.length; i++) s += x[i];
  return x.length ? s / x.length : 0;
}

/** A copy of `x` scaled so its peak sits at `db` dBFS (default -1). A silent input comes back unchanged. */
export function normalize(x: ArrayLike<number>, db = -1): Float32Array {
  const p = peak(x);
  const out = Float32Array.from(x as ArrayLike<number>);
  if (p === 0) return out;
  const k = fromDb(db) / p;
  for (let i = 0; i < out.length; i++) out[i] *= k;
  return out;
}

export interface Span {
  /** Seconds from the buffer start to the first window above the threshold, -1 when never. */
  start: number;
  /** Seconds from the buffer start to the end of the last window above the threshold, -1 when never. */
  end: number;
  /** The longest run of windows below the threshold between start and end, in seconds. */
  longestGap: number;
}

/**
 * Where a sound is audible: the signal is cut into `windowMs` windows, a window is audible when its peak is
 * above `thresholdDb` relative to the whole buffer's peak. Returns the audible span and the longest silent run
 * inside it.
 */
export function audibleSpan(x: ArrayLike<number>, sampleRate: number, thresholdDb = -48, windowMs = 5): Span {
  const p = peak(x);
  if (p === 0) return { start: -1, end: -1, longestGap: 0 };
  const thr = p * fromDb(thresholdDb);
  const w = Math.max(1, Math.round((sampleRate * windowMs) / 1000));
  const loud: boolean[] = [];
  for (let i = 0; i < x.length; i += w) {
    let m = 0;
    for (let j = i; j < Math.min(x.length, i + w); j++) m = Math.max(m, Math.abs(x[j]));
    loud.push(m > thr);
  }
  const first = loud.indexOf(true);
  const last = loud.lastIndexOf(true);
  let gap = 0;
  let run = 0;
  for (let i = first; i <= last; i++) {
    run = loud[i] ? 0 : run + 1;
    gap = Math.max(gap, run);
  }
  const sec = w / sampleRate;
  return { start: first * sec, end: Math.min(x.length / sampleRate, (last + 1) * sec), longestGap: gap * sec };
}

/** 16 bit PCM mono WAV bytes for `x` (clamped to -1..1). */
export function encodeWav16(x: ArrayLike<number>, sampleRate: number): Uint8Array {
  const n = x.length;
  const buf = new ArrayBuffer(44 + n * 2);
  const v = new DataView(buf);
  const str = (o: number, s: string) => {
    for (let i = 0; i < s.length; i++) v.setUint8(o + i, s.charCodeAt(i));
  };
  str(0, "RIFF");
  v.setUint32(4, 36 + n * 2, true);
  str(8, "WAVE");
  str(12, "fmt ");
  v.setUint32(16, 16, true);
  v.setUint16(20, 1, true);
  v.setUint16(22, 1, true);
  v.setUint32(24, sampleRate, true);
  v.setUint32(28, sampleRate * 2, true);
  v.setUint16(32, 2, true);
  v.setUint16(34, 16, true);
  str(36, "data");
  v.setUint32(40, n * 2, true);
  for (let i = 0; i < n; i++) {
    const s = Math.max(-1, Math.min(1, x[i]));
    v.setInt16(44 + i * 2, Math.round(s * 32767), true);
  }
  return new Uint8Array(buf);
}
