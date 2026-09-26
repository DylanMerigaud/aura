// ?demo=1: a fake Frame and CoreEvent driver at 123 BPM so the stage can be shown before the core is wired.
// A 4 beat count in, hits on the beat, a MASH and release, a HOLD, a taunt, two drops, then the end, looped.
import type { CoreEvent, Frame, LevelV2, Stage } from "../v2/contracts";
import type { Dir } from "../qte/types";

const BPM = 123;
const SPB = 60 / BPM;
const LENGTH = 72;

const LEVEL: LevelV2 = {
  id: 1,
  title: "Demo",
  place: "The club",
  artKey: "club",
  story: ["", ""],
  opponent: { name: "DJ Demo", persona: "", color: "#ff3b8d" },
  taunts: [],
  announcer: { intro: "", win: "", lose: "" },
  bpm: BPM,
  windowScale: 1,
  lengthBeats: LENGTH,
  seed: 1,
  events: [],
  track: "level4",
  stage: "club",
  dropBeats: [32, 56],
  breakdownBeats: [[24, 32]],
  neon: ["#22e1ff", "#b026ff"],
};

const DIRS: Dir[] = ["left", "up", "right", "down"];

export function runDemo(stage: Stage): () => void {
  let songTime = -4 * SPB;
  let lastBeat = -5;
  let meter = 0;
  let combo = 0;
  let score = 0;
  let mashing = false;
  let mashCount = 0;
  let holding = false;
  let ended = false;
  let restartIn = -1;
  let stopped = false;
  let prev = performance.now();
  let ready = false;

  const energyAt = (b: number) => (b >= 24 && b < 32 ? 0.25 : b >= 32 ? 0.95 : 0.6 + 0.1 * Math.sin(b));
  const emit = (e: CoreEvent) => stage.event(e);

  function onBeat(b: number): void {
    if (b < 0) {
      emit({ kind: "countIn", n: -b, at: 0 });
      return;
    }
    emit({ kind: "beat", beat: b, downbeat: b % 4 === 0, energy: energyAt(b), bar: Math.floor(b / 4) });
    const drop = LEVEL.dropBeats.find((d) => d - b === 2);
    if (drop !== undefined) emit({ kind: "dropSoon", beat: drop });
    if (LEVEL.dropBeats.includes(b)) emit({ kind: "drop", beat: b });
    if (b === 10) emit({ kind: "taunt", text: "Is that all?", index: 0 });
    if (b === 40) {
      mashing = true;
      mashCount = 0;
      emit({ kind: "mashStart", lengthBeats: 6 });
    }
    if (b === 46) {
      mashing = false;
      emit({ kind: "release", burst: 18, count: mashCount, mult: 1, grade: "perfect" });
      meter = Math.min(1, meter + 0.3);
    }
    if (b === 26) {
      holding = true;
      emit({ kind: "holdStart" });
    }
    if (b === 30) {
      holding = false;
      emit({ kind: "holdEnd", grade: "great" });
    }
    const hitBeat = (b >= 2 && b < 24 && b % 2 === 0) || (b >= 32 && b < 40) || (b >= 48 && b < LENGTH - 4 && b % 2 === 1);
    if (hitBeat) {
      const cringe = Math.random() < 0.12;
      const grade = cringe ? "miss" : Math.random() < 0.55 ? "perfect" : "great";
      combo = cringe ? 0 : combo + 1;
      score += cringe ? 0 : 300;
      meter = Math.max(-1, Math.min(1, meter + (cringe ? -0.15 : 0.05)));
      emit({ kind: "judged", grade, cringe, qte: "hit", dir: DIRS[b % 4], combo, score, strong: b % 4 === 0, big: b % 8 === 0 && !cringe });
    }
    if (b === LENGTH) {
      ended = true;
      emit({ kind: "end", win: meter >= 0, ko: false });
      restartIn = 4;
    }
  }

  function frame(): Frame {
    const beatPos = songTime / SPB;
    const b = Math.floor(beatPos);
    const next = LEVEL.dropBeats.find((d) => d > beatPos);
    return {
      songTime,
      beatPos,
      beatPhase: beatPos - b,
      spb: SPB,
      meter,
      combo,
      tier: combo >= 25 ? 3 : combo >= 15 ? 2 : combo >= 5 ? 1 : 0,
      score,
      rate: 1,
      energy: energyAt(Math.max(0, b)),
      beatsToDrop: next === undefined ? Infinity : next - beatPos,
      mashing,
      mashCount,
      holding,
      holdProgress: holding ? (beatPos - 26) / 4 : 0,
      phase2: false, turn: "player",
      ending: ended,
      win: ended ? meter >= 0 : null,
      prompts: [],
      showsAt: () => 0,
      targetAt: () => 0,
      level: LEVEL,
    };
  }

  function reset(): void {
    songTime = -4 * SPB;
    lastBeat = -5;
    meter = combo = score = 0;
    mashing = holding = ended = false;
    restartIn = -1;
  }

  function loop(now: number): void {
    if (stopped) return;
    requestAnimationFrame(loop);
    const dt = Math.min(0.05, (now - prev) / 1000);
    prev = now;
    if (!ready) {
      stage.idle(dt);
      return;
    }
    songTime += dt;
    const b = Math.floor(songTime / SPB);
    while (lastBeat < b) onBeat(++lastBeat);
    if (mashing && Math.random() < dt * 10) {
      mashCount++;
      stage.event({ kind: "mashStep", count: mashCount, side: mashCount % 2 ? "left" : "right" });
    }
    stage.frame(frame(), dt);
    if (restartIn >= 0) {
      restartIn -= dt;
      if (restartIn < 0) stage.load(LEVEL).then(reset);
    }
  }

  stage.load(LEVEL).then(() => {
    reset();
    ready = true;
  });
  requestAnimationFrame(loop);
  return () => {
    stopped = true;
  };
}
