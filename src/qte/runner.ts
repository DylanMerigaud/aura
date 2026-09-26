// QTE runner: routes timed inputs to the scripted events and emits graded results. Pure, no DOM, no audio.
import type { Dir, QteEvent } from "./types";
import { judge, releaseMultiplier, WINDOWS, type Grade } from "./judge";

export type Input =
  | { kind: "dir"; dir: Dir; t: number }
  | { kind: "space"; down: boolean; t: number }
  /**
   * TAP ONLY input (v2): a press or a lift anywhere. HIT = a press on the note, MASH = presses (every one
   * counts, no alternation) then one press on the drop, HOLD = press on the beat, lift on its end.
   */
  | { kind: "tap"; down: boolean; t: number };

export interface Result {
  ev: QteEvent;
  grade: Grade;
  /** true when the player pressed the wrong thing ("cringe"). */
  cringe: boolean;
  /** MASH only: alternations counted and the release multiplier. */
  mashCount?: number;
  mashMult?: number;
}

export type Phase = "pending" | "active" | "done";

export interface EventState {
  ev: QteEvent;
  phase: Phase;
  /** HOLD: pressed and still held. COMBO: dirs matched so far. MASH: alternations. */
  held: boolean;
  progress: number;
  lastDir: Dir | null;
  result: Result | null;
}

const MASH_LEAD = 0.25;
const COMBO_SHOW_BEATS = 2;

export class QteRunner {
  states: EventState[];
  private next = 0;

  constructor(
    events: QteEvent[],
    public spb: number,
    public windowScale: number,
    private emit: (r: Result) => void,
  ) {
    this.states = events.map((ev) => ({ ev, phase: "pending", held: false, progress: 0, lastDir: null, result: null }));
  }

  get ok() {
    return WINDOWS.ok * this.windowScale;
  }

  /** Song time (s) at which an event starts accepting input. */
  opensAt(ev: QteEvent): number {
    const T = ev.beat * this.spb;
    if (ev.type === "hit") return T - this.ok;
    if (ev.type === "mash") return T - MASH_LEAD;
    // An early HOLD press is judged (as a miss) instead of silently dropped.
    if (ev.type === "hold") return T - this.spb;
    return T - (ev.dirs.length + COMBO_SHOW_BEATS) * this.spb;
  }

  /** Time the combo becomes visible (for rendering). */
  showsAt(ev: QteEvent): number {
    return ev.type === "combo" ? (ev.beat - ev.dirs.length - COMBO_SHOW_BEATS) * this.spb : ev.beat * this.spb - 2 * this.spb;
  }

  /** Song time the event targets for its final judgement. */
  targetAt(ev: QteEvent): number {
    const T = ev.beat * this.spb;
    return ev.type === "mash" || ev.type === "hold" ? T + ev.length * this.spb : T;
  }

  current(): EventState | null {
    return this.next < this.states.length ? this.states[this.next] : null;
  }

  private finish(s: EventState, r: Omit<Result, "ev">) {
    s.phase = "done";
    s.result = { ev: s.ev, ...r };
    this.next++;
    this.emit(s.result);
  }

  input(inp: Input) {
    if (inp.kind === "tap") return this.tap(inp.down, inp.t);
    const s = this.current();
    if (!s || inp.t < this.opensAt(s.ev)) return;
    s.phase = "active";
    const ev = s.ev;
    const T = ev.beat * this.spb;
    if (ev.type === "hit") {
      if (inp.kind !== "dir") return;
      const g = judge(inp.t - T, this.windowScale);
      if (inp.dir !== ev.dir) return this.finish(s, { grade: "miss", cringe: true });
      this.finish(s, { grade: g, cringe: false });
    } else if (ev.type === "mash") {
      const R = this.targetAt(ev);
      if (inp.kind === "dir") {
        if ((inp.dir === "left" || inp.dir === "right") && inp.dir !== s.lastDir) {
          s.progress++;
          s.lastDir = inp.dir;
        }
      } else if (inp.down) {
        const g = judge(inp.t - R, this.windowScale);
        if (s.progress === 0) return this.finish(s, { grade: "miss", cringe: false, mashCount: 0, mashMult: 0 });
        this.finish(s, { grade: g === "miss" ? "ok" : g, cringe: false, mashCount: s.progress, mashMult: releaseMultiplier(g) });
      }
    } else if (ev.type === "hold") {
      if (inp.kind !== "space") return;
      if (inp.down && !s.held) {
        if (judge(inp.t - T, this.windowScale) === "miss") return this.finish(s, { grade: "miss", cringe: false });
        s.held = true;
      } else if (!inp.down && s.held) {
        this.finish(s, { grade: judge(inp.t - this.targetAt(ev), this.windowScale), cringe: false });
      }
    } else {
      if (inp.kind !== "dir") return;
      if (inp.dir !== ev.dirs[s.progress]) return this.finish(s, { grade: "miss", cringe: true });
      s.progress++;
      if (s.progress === ev.dirs.length) this.finish(s, { grade: judge(inp.t - T, this.windowScale), cringe: false });
    }
  }

  /**
   * The tap vocabulary. A MASH counts every press until one beat before its drop; that last beat the ring
   * closes and presses are ignored, then the first press inside the release window is the release.
   */
  private tap(down: boolean, t: number) {
    const s = this.current();
    if (!s || t < this.opensAt(s.ev)) return;
    const ev = s.ev;
    const T = ev.beat * this.spb;
    if (ev.type === "hold") {
      if (down && !s.held) {
        s.phase = "active";
        if (judge(t - T, this.windowScale) === "miss") return this.finish(s, { grade: "miss", cringe: false });
        s.held = true;
      } else if (!down && s.held) {
        this.finish(s, { grade: judge(t - this.targetAt(ev), this.windowScale), cringe: false });
      }
      return;
    }
    if (!down) return;
    s.phase = "active";
    if (ev.type === "hit") return this.finish(s, { grade: judge(t - T, this.windowScale), cringe: false });
    if (ev.type === "mash") {
      const R = this.targetAt(ev);
      if (t < R - this.spb) {
        s.progress++;
        s.lastDir = s.lastDir === "left" ? "right" : "left";
        return;
      }
      if (t < R - this.ok) return;
      const g = judge(t - R, this.windowScale);
      if (s.progress === 0) return this.finish(s, { grade: "miss", cringe: false, mashCount: 0, mashMult: 0 });
      return this.finish(s, { grade: g === "miss" ? "ok" : g, cringe: false, mashCount: s.progress, mashMult: releaseMultiplier(g) });
    }
    s.progress++;
    if (s.progress >= ev.dirs.length) this.finish(s, { grade: judge(t - T, this.windowScale), cringe: false });
  }

  /** Resolve events whose window has passed without the needed input. */
  update(t: number) {
    for (;;) {
      const s = this.current();
      if (!s) return;
      const ev = s.ev;
      const late = this.targetAt(ev) + this.ok;
      if (t < late) return;
      if (ev.type === "mash") {
        // No release: the aura mass fizzles at half power.
        if (t < this.targetAt(ev) + 0.35) return;
        this.finish(s, { grade: s.progress === 0 ? "miss" : "ok", cringe: false, mashCount: s.progress, mashMult: 0.5 });
      } else {
        this.finish(s, { grade: "miss", cringe: false });
      }
    }
  }
}
