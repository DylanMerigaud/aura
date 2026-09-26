# Cuts a raw Lyria 3 Pro candidate (samples/music/<track>/raw/c<N>.mp3) to its in point and target length,
# encodes samples/music/<track>/c<N>.mp3 and writes c<N>.json with the manifest fields and the music gate checks.
# In point rule: the first downbeat whose 2 bar mean energy reaches 60 percent of the track's loudest
# 2 bar window, so the shipped file starts on the full groove; the cut lands 10 ms before that downbeat.
# Usage: python3 scripts/process-music-v3.py <track> <n> [<n> ...]
import json
import os
import subprocess
import sys

import librosa
import numpy as np

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TARGET = {"level1": (100, 40.0), "level2": (104, 40.0), "boss3": (138, 40.0), "victory": (130, 12.0)}
SR = 22050


def tempo_grid(y, sr, hint):
    env = librosa.onset.onset_strength(y=y, sr=sr)
    free, bt_free = librosa.beat.beat_track(onset_envelope=env, sr=sr, units="time")
    hinted, bt = librosa.beat.beat_track(onset_envelope=env, sr=sr, start_bpm=hint, units="time")
    auto = librosa.feature.tempo(onset_envelope=env, sr=sr, start_bpm=hint)[0]
    vals = [float(np.atleast_1d(free)[0]), float(np.atleast_1d(hinted)[0]), float(auto)]
    return vals, bt


def best_window(y, sr, hint, secs, ip):
    """Level tracks: the raw clip runs about 60 s with an intro and an outro. Among the downbeats from the in point on
    where a full window still fits, keep the start whose weakest 2 bars are the loudest (no lull, no outro inside)."""
    _, bt = tempo_grid(y, sr, hint)
    rms = librosa.feature.rms(y=y)[0]
    rt = librosa.frames_to_time(np.arange(len(rms)), sr=sr)
    dur = len(y) / sr
    best = (-1.0, ip)
    for k in range(0, len(bt), 4):
        s0 = float(bt[k]) - 0.01
        if s0 < ip - 0.05 or s0 + secs > dur - 0.2:
            continue
        m = (rt >= s0) & (rt < s0 + secs)
        spb2 = 8 * 60 / hint
        w = rms[m]
        step = max(1, int(spb2 * sr / 512))
        mins = min(w[i:i + step].mean() for i in range(0, max(1, len(w) - step), max(1, step // 4)))
        if mins > best[0]:
            best = (float(mins), s0)
    return max(0.0, best[1])


def in_point(y, sr, hint, clip):
    vals, bt = tempo_grid(y, sr, hint)
    if len(bt) < 8 or clip:
        return 0.0, vals
    rms = librosa.feature.rms(y=y)[0]
    rt = librosa.frames_to_time(np.arange(len(rms)), sr=sr)
    e = np.array([rms[(rt >= a) & (rt < b)].mean() if ((rt >= a) & (rt < b)).any() else 0 for a, b in zip(bt[:-1], bt[1:])])
    win = np.convolve(e, np.ones(8) / 8, "valid")
    thr = 0.6 * win.max()
    for k in range(0, len(win), 4):
        if win[k] >= thr:
            return max(0.0, float(bt[k]) - 0.01), vals
    return 0.0, vals


def analyze(path, bpm_req, dur_req):
    y, sr = librosa.load(path, sr=SR, mono=True)
    dur = len(y) / sr
    env = librosa.onset.onset_strength(y=y, sr=sr)
    vals, bt = tempo_grid(y, sr, bpm_req)
    bpm = vals[1]
    agree = max(vals) - min(vals) < 1.0
    frames = librosa.onset.onset_detect(onset_envelope=env, sr=sr, backtrack=True)
    ot = librosa.frames_to_time(frames, sr=sr)
    fb = float(bt[0]) if len(bt) else 0.0
    if len(ot):
        near = ot[np.argmin(np.abs(ot - fb))]
        if abs(near - fb) <= 0.3:
            fb = float(near)
    peak = float(env.max()) or 1.0
    onsets = [[round(float(t), 3), round(float(env[f]) / peak, 3)] for t, f in zip(ot, frames)]
    rms = librosa.feature.rms(y=y)[0]
    rt = librosa.frames_to_time(np.arange(len(rms)), sr=sr)
    beats = [float(b) for b in bt]
    edges = beats + [beats[-1] + 60 / bpm] if beats else []
    e = np.array([rms[(rt >= a) & (rt < b)].mean() if ((rt >= a) & (rt < b)).any() else 0 for a, b in zip(edges[:-1], edges[1:])])
    e = e / (e.max() or 1)
    downs = beats[::4]
    bar = [float(e[k:k + 4].mean()) for k in range(0, len(e), 4)]
    rises = sorted(((bar[i] - bar[i - 1], i) for i in range(1, len(bar))), reverse=True)[:4]
    drops = sorted([[round(downs[i], 3), round(r, 3)] for r, i in rises if r > 0])
    brk = []
    i = 0
    while i < len(bar):
        if bar[i] < 0.35:
            j = i
            while j < len(bar) and bar[j] < 0.35:
                j += 1
            if j - i >= 2:
                brk.append([round(downs[i], 3), round(downs[j] if j < len(downs) else dur, 3)])
            i = j
        else:
            i += 1
    first4 = float(e[[k for k, b in enumerate(beats) if b < 4.0]].mean()) if beats else 0
    gaps = []
    run = 0.0
    hop = 512 / sr
    rn = rms / (rms.max() or 1)
    for k, v in enumerate(rn):
        run = run + hop if v < 0.05 else 0.0
        if run > 0.5 and rt[k] < dur - 1.5 and not any(a <= rt[k] <= b for a, b in brk):
            gaps.append(round(float(rt[k]), 2))
            run = -1e9
    first_drop = drops[0][0] if drops else None
    checks = {
        "energy_first_4s": {"passed": first4 >= 0.35, "value": round(first4, 3), "threshold": 0.35},
        "drop_before_12s": {"passed": first_drop is not None and first_drop < 12.0, "value": first_drop, "threshold": 12.0},
        "no_long_silent_gap": {"passed": not gaps, "value": gaps, "threshold_s": 0.5, "threshold_energy": 0.05},
        "bpm_within_8pct": {"passed": abs(bpm - bpm_req) / bpm_req <= 0.08, "value": round(bpm, 2), "requested": float(bpm_req), "ratio": round(abs(bpm - bpm_req) / bpm_req, 3)},
        "duration_within_20pct": {"passed": abs(dur - dur_req) / dur_req <= 0.2, "value": round(dur, 2), "requested": dur_req, "ratio": round(abs(dur - dur_req) / dur_req, 3)},
    }
    return {
        "bpm_measured": round(bpm, 2),
        "bpm_methods": [round(v, 2) for v in vals],
        "first_beat_s": round(fb, 3),
        "duration_s": round(dur, 2),
        "rms_db": round(float(20 * np.log10(np.sqrt(np.mean(y ** 2)) + 1e-9)), 2),
        "confidence": "high" if agree else "medium",
        "beats_s": [round(b, 3) for b in beats],
        "downbeats_s": [round(b, 3) for b in downs],
        "onsets_s": onsets,
        "energy_per_beat": [round(float(v), 3) for v in e],
        "drops_s": drops,
        "breakdowns": brk,
        "checks": checks,
        "gate_passed": sum(c["passed"] for c in checks.values()),
    }


def process(track, n):
    bpm_req, secs = TARGET[track]
    base = os.path.join(ROOT, "samples", "music", track)
    raw = os.path.join(base, "raw", f"c{n}.mp3")
    y, sr = librosa.load(raw, sr=SR, mono=True)
    raw_dur = len(y) / sr
    ip, _ = in_point(y, sr, bpm_req, False)
    if track != "victory":
        ip = best_window(y, sr, bpm_req, secs, ip)
    length = min(secs, raw_dur - ip)
    fade = 0.25 if track != "victory" else 0.6
    out = os.path.join(base, f"c{n}.mp3")
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-ss", f"{ip:.3f}", "-t", f"{length:.3f}", "-i", raw,
                    "-af", f"afade=t=in:d=0.01,afade=t=out:st={length - fade:.3f}:d={fade}", "-b:a", "160k", out], check=True)
    a = analyze(out, bpm_req, secs)
    a.update({"raw_duration_s": round(raw_dur, 2), "raw_in_point_s": round(ip, 3), "in_point_s": 0.0, "bpm_requested": bpm_req})
    json.dump(a, open(os.path.join(base, f"c{n}.json"), "w"))
    c = a["checks"]
    print(track, f"c{n}", "raw", a["raw_duration_s"], "cut at", ip, "bpm", a["bpm_methods"], "fb", a["first_beat_s"], "gate", a["gate_passed"], "/5",
          "e4", c["energy_first_4s"]["value"], "drop", c["drop_before_12s"]["value"], "gaps", c["no_long_silent_gap"]["value"])


if __name__ == "__main__":
    for n in sys.argv[2:]:
        process(sys.argv[1], int(n))
