// Music analysis per track key, normalized to the TrackInfo contract.
// Sources: src/v2/analysis.json (scripts/analyze-music.py) when it was made from the manifest's current
// bpm_measured, else the analysis fields of assets/music/manifest.json, else defaults synthesized from the grid.
// The grid: librosa's bpm_measured is quantized to whole onset frames (129.2 BPM on a track that runs at 130.0,
// 220 ms of drift by the end of the hero track), so a fresh analysis.json supplies bpm_refined. Beats and
// downbeats are always the game grid (beat k at firstBeat + k * 60 / bpm) and per beat energy follows it.
import manifest from "../../assets/music/manifest.json";
import analysis from "./analysis.json";
import type { TrackInfo } from "./contracts";

type Pair = [number, number];
interface Raw {
  file?: string;
  bpm_measured?: number;
  bpm_refined?: number;
  manifest_bpm?: number;
  first_beat_s?: number;
  duration_s?: number;
  onsets_s?: ({ t: number; s: number } | Pair | number)[];
  energy_per_beat?: number[];
  drops_s?: (Pair | number)[];
  breakdowns?: (Pair | { start_s: number; end_s: number })[];
}

const MANIFEST = manifest as unknown as Raw[];
const ANALYSIS = analysis as unknown as Record<string, Raw>;
const cache = new Map<string, TrackInfo>();

function onsetsOf(r: Raw): { t: number; s: number }[] | undefined {
  if (!r.onsets_s?.length) return undefined;
  const list = r.onsets_s.map((o) => (typeof o === "number" ? { t: o, s: 1 } : Array.isArray(o) ? { t: o[0], s: o[1] } : o));
  const max = Math.max(...list.map((o) => o.s)) || 1;
  return max > 1 || max < 0.5 ? list.map((o) => ({ t: o.t, s: o.s / max })) : list;
}

function dropsOf(r: Raw): number[] | undefined {
  return r.drops_s?.length ? r.drops_s.map((d) => (Array.isArray(d) ? d[0] : d)) : undefined;
}

function spansOf(r: Raw): Pair[] | undefined {
  return r.breakdowns?.map((x) => (Array.isArray(x) ? [x[0], x[1]] : [x.start_s, x.end_s]) as Pair);
}

export function trackInfo(key: string): TrackInfo {
  const hit = cache.get(key);
  if (hit) return hit;
  const file = `${key}.mp3`;
  const m = MANIFEST.find((e) => e.file === file);
  if (!m) throw new Error(`unknown track ${key}`);
  const raw = ANALYSIS[key];
  const fresh = !!raw && raw.manifest_bpm === m.bpm_measured && raw.bpm_refined !== undefined;
  const a: Raw = fresh ? raw : {};
  const bpm = fresh ? a.bpm_refined! : (m.bpm_measured ?? 120);
  const firstBeat = m.first_beat_s ?? 0;
  const duration = m.duration_s ?? 40;
  const spb = 60 / bpm;
  const n = Math.floor((duration - firstBeat) / spb) + 1;
  const beats = Array.from({ length: n }, (_, k) => firstBeat + k * spb);
  const energy = a.energy_per_beat?.length ? a.energy_per_beat : m.energy_per_beat;
  const info: TrackInfo = {
    file,
    bpm,
    firstBeat,
    duration,
    beats,
    downbeats: beats.filter((_, k) => k % 4 === 0),
    drops: dropsOf(a) ?? dropsOf(m) ?? [],
    breakdowns: (fresh ? spansOf(a) : spansOf(m)) ?? [],
    energyPerBeat: energy?.length ? energy : Array.from({ length: n }, () => 0.7),
    onsets: onsetsOf(a) ?? onsetsOf(m) ?? [],
  };
  cache.set(key, info);
  return info;
}

/** Track seconds to song beats on the game grid (beat k at firstBeat + k * 60 / bpm). */
export function toBeat(info: TrackInfo, t: number): number {
  return ((t - info.firstBeat) * info.bpm) / 60;
}
