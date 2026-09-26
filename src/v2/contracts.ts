// Shared contracts of AURA v2: the game core emits CoreEvents and a Frame every frame; the 3D stage,
// the VFX, the DOM HUD and the audio layers only read them. Game logic never imports three.js.
import type { Grade } from "../qte/judge";
import type { Dir, Level, QteEvent } from "../qte/types";
import type { EventState } from "../qte/runner";

/** Music analysis of one Lyria track, normalized from assets/music/manifest.json (all times in track seconds). */
export interface TrackInfo {
  /** File name under music/, e.g. "level4.mp3". */
  file: string;
  bpm: number;
  /** Track time of beat 0. */
  firstBeat: number;
  duration: number;
  /** Beat times; synthesized from bpm and firstBeat when the analysis is missing. */
  beats: number[];
  /** Bar starts (every 4th beat when the analysis is missing). */
  downbeats: number[];
  /** Largest energy jumps (track seconds). Empty when unknown. */
  drops: number[];
  /** Low energy spans [start, end] in track seconds. */
  breakdowns: [number, number][];
  /** RMS per beat normalized 0..1, index = beat number. Flat 0.7 when unknown. */
  energyPerBeat: number[];
  onsets: { t: number; s: number }[];
}

/** Stage sets the 3D renderer knows how to dress. */
export type StageKey = "club" | "metro" | "kebab" | "parvis" | "stage";

export interface LevelV2 extends Level {
  /** Key into the music manifest, e.g. "level4" for music/level4.mp3. */
  track: string;
  /** Second track for the boss phase 2 (optional). */
  track2?: string;
  stage: StageKey;
  /** Drops in BEATS (from the analysis or hand placed): the director ramps before each. */
  dropBeats: number[];
  /** Breakdowns in beats [start, end). */
  breakdownBeats: [number, number][];
  /** Palette of the set: two neon colors (CSS hex). */
  neon: [string, string];
  /**
   * Dance battle turns in beats, in order, never overlapping. A player QTE never intersects an opponent
   * turn (validateTurns). Missing: the whole level is one player turn.
   */
  turns?: TurnSpec[];
}

/** One turn of the battle. `move` (opponent turns) is a gesture key of src/anim/gestures.ts GESTURES. */
export interface TurnSpec {
  who: Turn;
  beat: number;
  lengthBeats: number;
  move?: string;
}

/** Combo tier drives the aura flame: 0 none, 1 blue (combo 5+), 2 purple (15+), 3 white hot (25+, sunglasses). */
export type Tier = 0 | 1 | 2 | 3;
export function tierOf(combo: number): Tier {
  return combo >= 25 ? 3 : combo >= 15 ? 2 : combo >= 5 ? 1 : 0;
}

/** Whose turn it is in the dance battle. */
export type Turn = "player" | "opponent";

export type CoreEvent =
  /** Count-in click n = 4,3,2,1 scheduled at AudioContext time `at`. */
  | { kind: "countIn"; n: number; at: number }
  /** A new beat started (song beat index); fired from the frame loop, as heard. */
  | { kind: "beat"; beat: number; downbeat: boolean; energy: number; bar: number }
  /** Any judged QTE except a MASH release. `strong` = landed on a strong onset (director: hit stop). */
  | { kind: "judged"; grade: Grade; cringe: boolean; qte: QteEvent["type"]; dir?: Dir; combo: number; score: number; strong: boolean; big: boolean }
  | { kind: "mashStart"; lengthBeats: number }
  /** One counted tap of a MASH (after the anti turbo filter); `side` alternates for the visuals. */
  | { kind: "mashStep"; count: number; side: "left" | "right" }
  /** MASH released: burst = min(count, cap) * timing multiplier (amendment 6). */
  | { kind: "release"; burst: number; count: number; mult: number; grade: Grade }
  | { kind: "holdStart" }
  | { kind: "holdEnd"; grade: Grade }
  | { kind: "taunt"; text: string; index: number }
  /** The director should start its slow motion ramp: the drop lands on `beat`. */
  | { kind: "dropSoon"; beat: number }
  | { kind: "drop"; beat: number }
  | { kind: "phase2" }
  /** Dance battle turns: the announcer calls YOUR MOVE / HIS MOVE; player prompts only exist in a player turn. */
  | { kind: "turn"; who: Turn; beat: number; lengthBeats: number }
  /** The opponent performs a canon move (a gesture key from src/anim, e.g. "boat_sweep") on his turn. */
  | { kind: "opponentMove"; move: string; beat: number; lengthBeats: number }
  | { kind: "end"; win: boolean; ko: boolean };

export interface Frame {
  /** Song seconds from beat 0 as heard (latency compensated). Negative during the count-in. */
  songTime: number;
  /** Fractional beat position; beatPhase = beatPos - floor(beatPos). */
  beatPos: number;
  beatPhase: number;
  /** Seconds per beat at rate 1. */
  spb: number;
  /** Aura tug of war, -1 (enemy wins) .. 1 (we win). */
  meter: number;
  combo: number;
  tier: Tier;
  score: number;
  /** Current music playback rate from the tempo rule (0.90 .. 1.15). */
  rate: number;
  /** Energy of the current beat 0..1 (from the analysis). */
  energy: number;
  /** Beats until the next drop (Infinity when none ahead). */
  beatsToDrop: number;
  mashing: boolean;
  mashCount: number;
  holding: boolean;
  /** 0..1 of the current HOLD. */
  holdProgress: number;
  phase2: boolean;
  /** Whose turn it is now (the play zone dims and ignores taps on "opponent"). */
  turn: Turn;
  /** Set once the battle is decided (freeze frame, letterbox). */
  ending: boolean;
  win: boolean | null;
  /** Upcoming and active QTE states, in order, for the HUD prompts. */
  prompts: EventState[];
  /** Song time (s) at which a QTE becomes visible / is judged, for the HUD. */
  showsAt: (ev: QteEvent) => number;
  targetAt: (ev: QteEvent) => number;
  level: LevelV2;
}

/** The 3D stage (src/render3d). One instance for the whole session, levels swapped in and out. */
export interface Stage {
  /** Build or swap the set, the fighters and the crowd for a level. Resolves when models are ready. */
  load(level: LevelV2): Promise<void>;
  event(e: CoreEvent): void;
  /** Called every animation frame with the real elapsed seconds (the stage owns visual time scaling). */
  frame(f: Frame, realDt: number): void;
  /** Idle rendering for menus (slow orbit of the empty ring). */
  idle(realDt: number): void;
  resize(): void;
  /** Measured fps for the debug meter and the adaptive quality. */
  fps(): number;
}

/** Points in world space the VFX attach to, updated by the stage every frame. */
export interface Anchors {
  playerFeet: { x: number; y: number; z: number };
  playerHead: { x: number; y: number; z: number };
  playerHands: { x: number; y: number; z: number };
  enemyFeet: { x: number; y: number; z: number };
  enemyChest: { x: number; y: number; z: number };
}

export interface Stats {
  win: boolean;
  ko: boolean;
  score: number;
  maxCombo: number;
  counts: Record<"perfect" | "great" | "ok" | "miss" | "cringe", number>;
  /** Accuracy 0..1 over judged events (Perfect 1, Great 0.7, Ok 0.3). */
  accuracy: number;
  bestBurst: number;
  stars: 0 | 1 | 2 | 3;
  meter: number;
}

/** Anything that follows a battle: the stage, the DOM HUD, the audio layers. */
export interface Listener {
  event(e: CoreEvent): void;
  frame?(f: Frame, realDt: number): void;
}

/** Raw input already mapped to the heard audio clock (see src/qte/input.ts heardTime). */
export type PlayInput =
  /** The game's only input (TAP ONLY): a press or a lift anywhere, any key, any click. */
  | { kind: "tap"; down: boolean; at: number }
  | { kind: "dir"; dir: Dir; at: number; key?: string }
  | { kind: "space"; down: boolean; at: number };

/** The battle driver in src/v2/game.ts, used by src/v2/main.ts. */
export interface GameApi {
  listen(l: Listener): void;
  /** Load the track, count in, play the level; resolves with the stats after the finish animation. */
  play(level: LevelV2, windowScale: number): Promise<Stats>;
  /** Abort the running battle (quit to map). */
  quit(): void;
  input(i: PlayInput): void;
  /** Pause on visibilitychange; resume restarts with a 3 beat count in. */
  pause(): void;
  resume(): void;
  /** Call once per animation frame with real seconds. */
  tick(realDt: number): void;
  /** Current QTE kind, for touch routing: "hit" | "mash" | "hold" | "none". */
  touchMode(): "hit" | "mash" | "hold" | "none";
  running(): boolean;
}
