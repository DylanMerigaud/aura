# Music analysis for AURA v2: onsets, per-beat energy, drops and breakdowns of every Lyria track,
# written to src/v2/analysis.json keyed by track key. Beats are the manifest grid (bpm_measured, first_beat_s)
# because the game places beat k at firstBeat + k * 60 / bpm. librosa's tempo is quantized to whole onset
# frames (123.05 BPM = 21 frames of 512 samples), which drifts up to 15 ms per bar; refine_bpm() folds a 64
# sample onset envelope over a fine BPM scan and keeps the sharpest pulse (bpm_refined, tied to the manifest
# value it refined through manifest_bpm, so a later manifest fix wins in src/v2/tracks.ts).
import json
import os
import sys

import librosa
import numpy as np

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MUSIC = os.path.join(ROOT, "assets", "music")
OUT = os.path.join(ROOT, "src", "v2", "analysis.json")


def refine_bpm(y, sr, b0):
    hop = 64
    env = librosa.onset.onset_strength(y=y, sr=sr, hop_length=hop)
    t = librosa.frames_to_time(np.arange(len(env)), sr=sr, hop_length=hop)
    best = (0.0, b0)
    for bpm in np.arange(b0 * 0.97, b0 * 1.03, 0.005):
        h, _ = np.histogram((t * bpm / 60) % 1, bins=96, weights=env)
        h = np.convolve(np.r_[h[-2:], h, h[:2]], np.ones(5) / 5, "valid")
        sc = h.max() / h.mean()
        if sc > best[0]:
            best = (sc, float(bpm))
    return round(best[1], 3)


def analyze(entry):
    path = os.path.join(MUSIC, entry["file"])
    y, sr = librosa.load(path, sr=22050, mono=True)
    dur = len(y) / sr
    bpm = refine_bpm(y, sr, entry["bpm_measured"])
    fb = entry["first_beat_s"]
    spb = 60.0 / bpm
    n = int((dur - fb) / spb) + 1
    beats = [round(fb + k * spb, 4) for k in range(n)]
    downbeats = beats[::4]

    hop = 512
    env = librosa.onset.onset_strength(y=y, sr=sr, hop_length=hop)
    frames = librosa.onset.onset_detect(onset_envelope=env, sr=sr, hop_length=hop, backtrack=False)
    times = librosa.frames_to_time(frames, sr=sr, hop_length=hop)
    peak = float(np.percentile(env, 99)) or 1.0
    onsets = [{"t": round(float(t), 4), "s": round(min(1.0, float(env[f]) / peak), 3)} for t, f in zip(times, frames)]

    # RMS per beat, normalized to the track's loudest beat.
    rms = librosa.feature.rms(y=y, hop_length=hop)[0]
    rt = librosa.frames_to_time(np.arange(len(rms)), sr=sr, hop_length=hop)
    e = []
    for k in range(n):
        m = (rt >= beats[k]) & (rt < beats[k] + spb)
        e.append(float(np.mean(rms[m])) if m.any() else 0.0)
    e = np.array(e)
    e = e / (e.max() or 1.0)
    energy = [round(float(v), 3) for v in e]

    # Drops: biggest rise of the 2 bar mean after vs before a downbeat.
    rises = []
    for k in range(8, n - 4, 4):
        before = e[max(0, k - 8):k].mean()
        after = e[k:k + 8].mean()
        rises.append((after - before, k))
    rises.sort(reverse=True)
    drops = []
    for r, k in rises:
        if r < 0.08 or len(drops) >= 3:
            break
        if all(abs(k - d) >= 16 for d in drops):
            drops.append(k)
    drops_s = sorted(beats[k] for k in drops)

    # Breakdowns: runs of 4+ beats whose energy is well under the track median.
    thr = float(np.median(e)) * 0.72
    breakdowns = []
    k = 0
    while k < n:
        if e[k] < thr:
            j = k
            while j < n and e[j] < thr:
                j += 1
            if j - k >= 4 and k > 2:
                breakdowns.append([beats[k], round(beats[j - 1] + spb, 4)])
            k = j
        else:
            k += 1

    # Drift of the free tracker vs the manifest grid, ms per bar.
    _, bt = librosa.beat.beat_track(y=y, sr=sr, start_bpm=bpm, units="time")
    drift = None
    if len(bt) > 8:
        idx = np.round((bt - fb) / spb)
        err = bt - (fb + idx * spb)
        slope = np.polyfit(idx, err, 1)[0]
        drift = {"ms_per_bar": round(float(slope * 4 * 1000), 2), "mean_abs_ms": round(float(np.mean(np.abs(err)) * 1000), 1), "tracker_bpm": round(float(60 / np.median(np.diff(bt))), 2)}

    return {
        "manifest_bpm": entry["bpm_measured"],
        "bpm_refined": bpm,
        "beats_s": beats,
        "downbeats_s": downbeats,
        "onsets_s": onsets,
        "energy_per_beat": energy,
        "drops_s": drops_s,
        "breakdowns": breakdowns,
        "duration_s": round(dur, 3),
        "drift": drift,
    }


def main():
    manifest = json.load(open(os.path.join(MUSIC, "manifest.json")))
    only = set(sys.argv[1:])
    out = json.load(open(OUT)) if os.path.exists(OUT) and only else {}
    for entry in manifest:
        key = entry["file"].rsplit(".", 1)[0]
        if only and key not in only:
            continue
        out[key] = analyze(entry)
        a = out[key]
        print(key, "beats", len(a["beats_s"]), "onsets", len(a["onsets_s"]), "drops", a["drops_s"], "breakdowns", a["breakdowns"], "bpm", a["manifest_bpm"], "->", a["bpm_refined"], "drift", a["drift"])
    json.dump(out, open(OUT, "w"), separators=(",", ":"))


if __name__ == "__main__":
    main()
