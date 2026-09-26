# Ranks the five Lyria 3 Pro candidates per track into samples/music/BOARD.md from c<N>.json (analysis, music gate)
# and the judge passes c<N>.judge.json and c<N>.judge2.json (gemini-3.1-pro-preview). Rank: mean of the two passes'
# totals (note, beat, loop or ending), minus 0.5 when a pass heard intelligible words (the brief says instrumental),
# ties broken by no intelligible words, then the note score, then the music gate count. Two mechanical demotions, 0.5
# each, read from the game's own analysis (scripts/analyze-music.py on the candidate): a level track whose weakest
# 2 bars fall under 0.35 of its loudest beat or that spends over 6 s in breakdowns (a lull the chart has to fill),
# and a measured BPM outside 8 percent of the request (the game grid would run at a half or double tempo). Prints the winners as JSON.
import importlib.util
import json
import os

import numpy as np

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TRACKS = {
    "level1": ("level 1, Chatelet metro at 2am", "more funk, more bass"),
    "level2": ("level 2, kebab shop at 4am", "sidechain on the bass"),
    "boss3": ("final boss, phase two (new)", "heavier, faster, more intense than phase one"),
    "victory": ("victory stinger", "too smooth, more samba"),
}


_spec = importlib.util.spec_from_file_location("am", os.path.join(ROOT, "scripts", "analyze-music.py"))
AM = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(AM)


def steady(track, n, a):
    AM.MUSIC = os.path.join(ROOT, "samples", "music", track)
    r = AM.analyze({"file": f"c{n}.mp3", "bpm_measured": a["bpm_measured"], "first_beat_s": a["first_beat_s"]})
    e = np.array(r["energy_per_beat"])
    low = float(np.convolve(e, np.ones(8) / 8, "valid").min())
    brk = sum(b - x for x, b in r["breakdowns"])
    return round(low, 2), round(brk, 1)


def load(track, n):
    base = os.path.join(ROOT, "samples", "music", track)
    a = json.load(open(os.path.join(base, f"c{n}.json")))
    js = [json.load(open(os.path.join(base, f))) for f in (f"c{n}.judge.json", f"c{n}.judge2.json") if os.path.exists(os.path.join(base, f))]
    mean = lambda k: sum(j[k] for j in js) / len(js)
    words = any(j["intelligible_words"] for j in js)
    low, brk = steady(track, n, a) if track != "victory" else (None, 0.0)
    lull = low is not None and (low < 0.35 or brk > 6.0)
    off = not a["checks"]["bpm_within_8pct"]["passed"]
    score = mean("total") - (0.5 if words else 0) - (0.5 if lull else 0) - (0.5 if off else 0)
    return {"low": low, "brk": brk, "lull": lull, "off": off,"n": n, "a": a, "js": js, "note": mean("note_score"), "beat": mean("beat_clarity"), "loop": mean("loop_or_ending"), "words": words, "score": round(score, 2)}


def main():
    out = ["# Music board, Lyria 3 Pro candidates", "",
           "Five candidates per rejected track, generated on `lyria-3-pro-preview` (`scripts/gen-music-v3.ts`), cut and analyzed by",
           "`scripts/process-music-v3.py` (in point, best 40 s window for level tracks, librosa grid, music gate of 5 checks),",
           "judged twice by `gemini-3.1-pro-preview` with audio input and structured JSON (`scripts/judge-music-v3.ts`): the",
           "note axis is Dylan's rejection note, then beat clarity, then loop quality (levels) or ending quality (victory),",
           "1 to 5 each. Score = mean total of the two passes, minus 0.5 if a pass heard intelligible words, minus 0.5 for a lull",
           "(weakest 2 bars under 0.35 or over 6 s of breakdown in the game's own analysis), minus 0.5 for a BPM off the request",
           "by over 8 percent (the grid would run at half or double time); ties go to the one with no words. Every judgment",
           "is a `kind: \"music\"` row in `evals/ledger.jsonl` (id `<track>-c<N>`; the level and boss rows with no `cut` in",
           "their evidence judged an earlier cut that kept the raw clip's outro, superseded by the rows that carry it).", ""]
    winners = {}
    for t, (role, note) in TRACKS.items():
        rows = sorted((load(t, n) for n in range(1, 6)), key=lambda r: (r["score"], not r["words"], r["note"], r["a"]["gate_passed"]), reverse=True)
        winners[t] = rows[0]["n"]
        out += [f"## {t}: {role}", "", f"Note: \"{note}\".", "",
                "| rank | file | BPM measured | music gate | note (p1, p2) | beat (p1, p2) | loop or ending (p1, p2) | words | weakest 2 bars, breakdown s | score |",
                "|---:|---|---:|---:|---|---|---|---|---|---:|"]
        for i, r in enumerate(rows):
            p = lambda k: ", ".join(str(j[k]) for j in r["js"])
            name = f"c{r['n']}.mp3" + (" **WINNER**" if i == 0 else "")
            out.append(f"| {i + 1} | {name} | {r['a']['bpm_measured']} | {r['a']['gate_passed']}/5 | {p('note_score')} | {p('beat_clarity')} | {p('loop_or_ending')} | {'yes' if r['words'] else 'no'} | {'n/a' if r['low'] is None else f"{r['low']}, {r['brk']}"}{' (lull)' if r['lull'] else ''}{' (BPM off)' if r['off'] else ''} | {r['score']} |")
        w = rows[0]
        out += ["", f"Winner evidence (pass 1): {w['js'][0]['note_evidence']} {w['js'][0]['loop_evidence']}", ""]
    open(os.path.join(ROOT, "samples", "music", "BOARD.md"), "w").write("\n".join(out))
    print(json.dumps(winners))


if __name__ == "__main__":
    main()
