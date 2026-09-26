# Ships the board winners: copies samples/music/<track>/c<N>.mp3 to assets/music/<track>.mp3 and writes the manifest
# entry (same fields as the other tracks, model lyria-3-pro-preview, plus in_point_s). The grid: bpm_measured is
# librosa's (quantized to whole onset frames, like every other entry), first_beat_s is the phase of the strongest
# pulse of the onset envelope folded at the refined BPM, snapped to the latest backtracked onset within 60 ms before
# it, because the free tracker's first beat on a freshly cut file can sit a 16th off. Tracks without in_point_s get
# the same in point rule, measured and not cut. Then run: python3 scripts/analyze-music.py <tracks>.
# Usage: python3 scripts/ship-music-v3.py level1=1 level2=2 boss3=3 victory=3
import importlib.util
import json
import os
import re
import shutil
import sys

import librosa
import numpy as np

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
_spec = importlib.util.spec_from_file_location("pm", os.path.join(ROOT, "scripts", "process-music-v3.py"))
PM = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(PM)
_spec2 = importlib.util.spec_from_file_location("am", os.path.join(ROOT, "scripts", "analyze-music.py"))
AM = importlib.util.module_from_spec(_spec2)
_spec2.loader.exec_module(AM)

ROLE = {
    "level1": "level 1, Chatelet metro at 2am, against the Turnstile Ninja",
    "level2": "level 2, kebab shop at 4am",
    "boss3": "final boss, phase two (boss2 is phase one)",
    "victory": "victory stinger",
}
TAIL = "No lyrics, no vocals with words, instrumental only, no spoken words."


def first_beat(path, bpm):
    y, sr = librosa.load(path, sr=22050, mono=True)
    spb = 60 / bpm
    env = librosa.onset.onset_strength(y=y, sr=sr, hop_length=64)
    t = librosa.frames_to_time(np.arange(len(env)), sr=sr, hop_length=64)
    h, _ = np.histogram((t / spb) % 1, bins=96, weights=env)
    h = np.convolve(np.r_[h[-2:], h, h[:2]], np.ones(5) / 5, "valid")
    ph = (np.argmax(h) + 0.5) / 96 * spb
    ot = librosa.frames_to_time(librosa.onset.onset_detect(y=y, sr=sr, backtrack=True), sr=sr)
    cand = [o for o in ot if -0.06 <= o - ph <= 0.01]
    return round(max(float(max(cand)) if cand else ph - 0.03, 0.0), 3)


def main():
    picks = dict(a.split("=") for a in sys.argv[1:])
    src = open(os.path.join(ROOT, "scripts", "gen-music-v3.ts")).read()
    mpath = os.path.join(ROOT, "assets", "music", "manifest.json")
    man = json.load(open(mpath))
    for t, n in picks.items():
        base = os.path.join(ROOT, "samples", "music", t)
        dst = os.path.join(ROOT, "assets", "music", f"{t}.mp3")
        shutil.copy(os.path.join(base, f"c{n}.mp3"), dst)
        a = json.load(open(os.path.join(base, f"c{n}.json")))
        js = [json.load(open(os.path.join(base, f"c{n}.{f}.json"))) for f in ("judge", "judge2")]
        prompt = re.search(t + r": \{.*?prompt: `(.*?)`", src, re.S).group(1).replace("${TAIL}", TAIL)
        refined = AM.refine_bpm(librosa.load(dst, sr=22050, mono=True)[0], 22050, a["bpm_measured"])
        fb = first_beat(dst, refined)
        spb = 60 / refined
        beats = [round(fb + i * spb, 3) for i in range(int((a["duration_s"] - fb) / spb) + 1)]
        ch = a["checks"]
        passed = sum(c["passed"] for c in ch.values())
        agree = a["confidence"] == "high"
        e = {
            "file": f"{t}.mp3",
            "role": ROLE[t],
            "bpm_requested": a["bpm_requested"],
            "bpm_measured": a["bpm_measured"],
            "first_beat_s": fb,
            "first_beat_method": f"phase of the strongest pulse of the onset envelope folded at the refined {refined} BPM, snapped to the latest onset_detect(backtrack=True) onset within 60 ms before it",
            "in_point_s": 0.0,
            "in_point_rule": "first downbeat whose 2 bar mean energy reaches 60 percent of the loudest 2 bars; the shipped file is already cut there (raw clip cut at %.3f s), so playback starts at 0" % a["raw_in_point_s"],
            "duration_s": a["duration_s"],
            "rms_db": a["rms_db"],
            "model": "lyria-3-pro-preview",
            "confidence": a["confidence"],
            "confidence_note": (f"free tracker, {a['bpm_requested']} BPM hinted tracker and autocorrelation estimate agree at {a['bpm_measured']} BPM" if agree
                                else f"hinted tracker and autocorrelation agree at {a['bpm_methods'][1]} BPM, the free tracker reads {a['bpm_methods'][0]}") + f"; the refined fold lands on {refined} BPM",
            "bpm_confidence": a["confidence"],
            "beats_s": beats,
            "downbeats_s": beats[::4],
            "onsets_s": a["onsets_s"],
            "energy_per_beat": a["energy_per_beat"],
            "drops_s": a["drops_s"],
            "breakdowns": a["breakdowns"],
            "eval": {
                "passed": passed == 5, "score": passed, "attempts": 5, "checks": ch,
                "mood_judge": {"model": "gemini-3.1-pro-preview", "note": js[0]["note"],
                               "passes": [{k: j[k] for k in ("note_score", "beat_clarity", "loop_or_ending", "intelligible_words", "total")} for j in js]},
            },
            "regeneration_note": f"regenerated on lyria-3-pro-preview after Dylan's note \"{js[0]['note']}\", five candidates, candidate c{n} ranked first on samples/music/BOARD.md",
            "prompt": prompt,
        }
        idx = [i for i, m in enumerate(man) if m["file"] == e["file"]]
        if idx:
            man[idx[0]] = e
        else:
            man.insert([i for i, m in enumerate(man) if m["file"] == "boss2.mp3"][0] + 1, e)
        print(t, f"c{n}", "bpm", a["bpm_measured"], "refined", refined, "first beat", fb)
    for m in man:
        if "in_point_s" in m:
            continue
        y, sr = librosa.load(os.path.join(ROOT, "assets", "music", m["file"]), sr=22050, mono=True)
        ip, _ = PM.in_point(y, sr, m["bpm_requested"], False)
        m["in_point_s"] = round(ip + 0.01, 3) if ip > 0 else 0.0
        m["in_point_rule"] = "first downbeat whose 2 bar mean energy reaches 60 percent of the loudest 2 bars (measured, file not cut)"
    json.dump(man, open(mpath, "w"), indent=2)


if __name__ == "__main__":
    main()
