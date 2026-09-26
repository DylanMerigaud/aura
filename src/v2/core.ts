// v2 battle core: QTE runner, aura tug of war, timing score, the 69 burst, the tempo rule, beats, drops,
// taunts and the end of the battle. Pure: song time in, CoreEvents and a Frame out, no DOM, no audio.
import type { Dir } from "../qte/types";
import { QteRunner, type Result } from "../qte/runner";
import { comboMultiplier, releaseMultiplier, type Grade } from "../qte/judge";
import { Tempo } from "./tempo";
import { tierOf, type CoreEvent, type Frame, type LevelV2, type Stats, type TrackInfo } from "./contracts";

/** Aura drained per beat by opponent pressure, per level. */
const PRESSURE = [0, 0.003, 0.006, 0.009, 0.011];
/** Mash presses per beat of the window that count toward the burst (amendment 6: no turbo key). */
const MASH_CAP_PER_BEAT = 3;
/** Presses under this gap on the same key are ignored. */
const MIN_GAP = 0.03;
/** An onset this strong within this distance of a QTE target makes it a "strong" hit (director hit stop). */
const STRONG_ONSET = 0.6;
const STRONG_WINDOW = 0.05;
const BASE: Record<Grade, number> = { perfect: 300, great: 200, ok: 100, miss: 0 };

export class BattleCore {
  runner: QteRunner;
  tempo = new Tempo();
  meter = 0;
  score = 0;
  combo = 0;
  maxCombo = 0;
  bestBurst = 0;
  counts = { perfect: 0, great: 0, ok: 0, miss: 0, cringe: 0 };
  spb: number;
  ended = false;
  win: boolean | null = null;
  private gain: number;
  private lastBeat = -99;
  private tauntIdx = 0;
  private dropIdx = 0;
  private dropSoonIdx = 0;
  private phase2Fired = false;
  private lastKey: Record<string, number> = {};
  private mashStarted = -1;
  private holdStarted = -1;
  songTime = -99;
  private showsAt: Frame["showsAt"] = (ev) => this.runner.showsAt(ev);
  private targetAt: Frame["targetAt"] = (ev) => this.runner.targetAt(ev);
  /** Reused every frame (read synchronously by the listeners, never kept). */
  private prompts: Frame["prompts"] = [];

  /**
   * `tauntShift` rotates which line each taunt slot says (the slots keep their beats): the driver passes
   * the attempt number, so a retry does not open on the same taunt as the last try.
   */
  constructor(public level: LevelV2, public track: TrackInfo, windowScale: number, private emit: (e: CoreEvent) => void, private tauntShift = 0) {
    this.spb = 60 / level.bpm;
    this.runner = new QteRunner(level.events, this.spb, windowScale, (r) => this.onResult(r));
    this.gain = 1.15 / Math.max(8, level.events.length);
  }

  /** A press at song time t (seconds from beat 0). */
  input(i: { kind: "dir"; dir: Dir; t: number } | { kind: "space"; down: boolean; t: number }) {
    if (this.ended) return;
    const key = i.kind === "dir" ? i.dir : i.down ? "space" : "space-up";
    const prev = this.lastKey[key];
    if (prev !== undefined && i.t - prev < MIN_GAP && i.t >= prev) return;
    this.lastKey[key] = i.t;
    const cur = this.runner.current();
    const before = cur ? cur.progress : 0;
    const wasHeld = cur ? cur.held : false;
    this.runner.input(i);
    if (!cur || cur.phase === "done") return;
    if (cur.ev.type === "mash" && cur.progress > before && i.kind === "dir") {
      this.emit({ kind: "mashStep", count: Math.min(cur.progress, this.mashCap(cur.ev.length)), side: i.dir === "left" ? "left" : "right" });
    }
    if (cur.ev.type === "hold" && cur.held && !wasHeld) this.emit({ kind: "holdStart" });
  }

  private mashCap(length: number) {
    return MASH_CAP_PER_BEAT * length;
  }

  private push(d: number) {
    this.meter = Math.max(-1, Math.min(1, this.meter + d));
  }

  /** True when a strong onset of the track sits on the QTE's target time. */
  private strongAt(songT: number): boolean {
    const t = songT + this.track.firstBeat;
    for (const o of this.track.onsets) if (Math.abs(o.t - t) <= STRONG_WINDOW && o.s >= STRONG_ONSET) return true;
    return false;
  }

  private onResult(r: Result) {
    const ev = r.ev;
    const target = this.runner.targetAt(ev);
    if (ev.type === "hold" && r.grade !== "miss") this.emit({ kind: "holdEnd", grade: r.grade });
    if (r.cringe || r.grade === "miss") {
      this.combo = 0;
      if (r.cringe) this.counts.cringe++;
      else this.counts.miss++;
      this.push(-this.gain * (r.cringe ? 1.4 : 1.1));
      this.tempo.nudge("miss", r.cringe);
      if (ev.type === "hold") this.emit({ kind: "holdEnd", grade: "miss" });
      this.emit({ kind: "judged", grade: "miss", cringe: r.cringe, qte: ev.type, dir: ev.type === "hit" ? ev.dir : undefined, combo: 0, score: this.score, strong: false, big: false });
      return;
    }
    this.combo++;
    this.maxCombo = Math.max(this.maxCombo, this.combo);
    this.counts[r.grade]++;
    this.tempo.nudge(r.grade);
    const mult = comboMultiplier(this.combo);
    const boost = 1 + (mult - 1) * 0.15;
    if (ev.type === "mash") {
      const count = Math.min(r.mashCount ?? 0, this.mashCap(ev.length));
      const m = r.mashMult ?? releaseMultiplier(r.grade);
      const burst = Math.round(count * m);
      this.bestBurst = Math.max(this.bestBurst, burst);
      this.score += BASE[r.grade] * mult + burst * 30 * mult;
      this.push(Math.min(0.4, burst * 0.006 + this.gain) * boost);
      this.emit({ kind: "release", burst, count, mult: m, grade: r.grade });
      return;
    }
    const k = r.grade === "perfect" ? 1 : r.grade === "great" ? 0.75 : 0.4;
    this.score += BASE[r.grade] * mult;
    this.push(this.gain * k * boost);
    this.emit({
      kind: "judged", grade: r.grade, cringe: false, qte: ev.type, dir: ev.type === "hit" ? ev.dir : undefined,
      combo: this.combo, score: this.score, strong: r.grade === "perfect" && this.strongAt(target), big: ev.type === "combo" || ev.type === "hold",
    });
  }

  energyAt(beat: number): number {
    const e = this.track.energyPerBeat;
    return e.length ? e[Math.max(0, Math.min(e.length - 1, beat))] : 0.7;
  }

  /** Advance to song time t (seconds from beat 0). realDt drives the tempo easing and the pressure. */
  update(t: number, realDt: number) {
    this.songTime = t;
    this.tempo.update(realDt);
    if (this.ended) return;
    this.runner.update(t);
    const L = this.level;
    const beatPos = t / this.spb;
    const b = Math.floor(beatPos);
    if (b > this.lastBeat && b >= 0) {
      this.lastBeat = b;
      this.emit({ kind: "beat", beat: b, downbeat: b % 4 === 0, energy: this.energyAt(b), bar: Math.floor(b / 4) });
    }
    if (beatPos > 0 && beatPos < L.lengthBeats) this.push(-(realDt / this.spb) * PRESSURE[Math.min(4, L.id - 1)]);
    const ta = L.taunts[this.tauntIdx];
    if (ta && beatPos >= ta.beat) {
      const k = (this.tauntIdx + this.tauntShift) % L.taunts.length;
      this.emit({ kind: "taunt", text: L.taunts[k].text, index: k });
      this.tauntIdx++;
      this.push(-0.05);
    }
    const drops = L.dropBeats;
    while (this.dropSoonIdx < drops.length && beatPos >= drops[this.dropSoonIdx] - 1) {
      if (beatPos < drops[this.dropSoonIdx]) this.emit({ kind: "dropSoon", beat: drops[this.dropSoonIdx] });
      this.dropSoonIdx++;
    }
    while (this.dropIdx < drops.length && beatPos >= drops[this.dropIdx]) {
      if (beatPos < drops[this.dropIdx] + 1) this.emit({ kind: "drop", beat: drops[this.dropIdx] });
      this.dropIdx++;
    }
    if (L.phase2Beat !== undefined && !this.phase2Fired && beatPos >= L.phase2Beat) {
      this.phase2Fired = true;
      this.emit({ kind: "phase2" });
    }
    const cur = this.runner.current();
    if (cur && cur.ev.type === "mash" && t >= this.runner.opensAt(cur.ev) && this.mashStarted !== cur.ev.beat) {
      this.mashStarted = cur.ev.beat;
      this.emit({ kind: "mashStart", lengthBeats: cur.ev.length });
    }
    if (Math.abs(this.meter) >= 1 || beatPos >= L.lengthBeats + 1) this.finish();
  }

  private finish() {
    this.ended = true;
    this.win = this.meter > 0;
    this.emit({ kind: "end", win: this.win, ko: Math.abs(this.meter) >= 1 });
  }

  stats(): Stats {
    const c = this.counts;
    const total = c.perfect + c.great + c.ok + c.miss + c.cringe || 1;
    const accuracy = (c.perfect + c.great * 0.7 + c.ok * 0.3) / total;
    const win = !!this.win;
    const stars = !win ? 0 : accuracy >= 0.9 && c.cringe === 0 ? 3 : accuracy >= 0.8 ? 2 : 1;
    return { win, ko: Math.abs(this.meter) >= 1, score: this.score, maxCombo: this.maxCombo, counts: { ...c }, accuracy, bestBurst: this.bestBurst, stars, meter: this.meter };
  }

  frame(): Frame {
    const t = this.songTime;
    const beatPos = t / this.spb;
    const cur = this.runner.current();
    const mashing = !!cur && cur.ev.type === "mash" && t >= this.runner.opensAt(cur.ev) && !this.ended;
    const holding = !!cur && cur.ev.type === "hold" && cur.held;
    let holdProgress = 0;
    if (holding && cur && cur.ev.type === "hold") holdProgress = Math.max(0, Math.min(1, (t - cur.ev.beat * this.spb) / (cur.ev.length * this.spb)));
    let nextDrop: number | undefined;
    for (const d of this.level.dropBeats) if (d > beatPos) { nextDrop = d; break; }
    const prompts = this.prompts;
    prompts.length = 0;
    for (let i = 0; i < this.runner.states.length; i++) {
      const s = this.runner.states[i];
      if (s.phase === "done") continue;
      if (this.runner.showsAt(s.ev) > t + 2 * this.spb) break;
      prompts.push(s);
    }
    return {
      songTime: t, beatPos, beatPhase: beatPos - Math.floor(beatPos), spb: this.spb,
      meter: this.meter, combo: this.combo, tier: tierOf(this.combo), score: this.score, rate: this.tempo.rate,
      energy: this.energyAt(Math.floor(beatPos)), beatsToDrop: nextDrop === undefined ? Infinity : nextDrop - beatPos,
      mashing, mashCount: mashing && cur ? Math.min(cur.progress, this.mashCap((cur.ev as { length: number }).length)) : 0,
      holding, holdProgress, phase2: this.phase2Fired, ending: this.ended, win: this.win, prompts,
      showsAt: this.showsAt, targetAt: this.targetAt, level: this.level,
    };
  }
}
