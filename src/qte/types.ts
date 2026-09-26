// Campaign and QTE data types shared by the game, the Gemini generator and the validator.

export type Dir = "up" | "down" | "left" | "right";

/** Every event lives on the beat grid (integer beats from the song start). */
export type QteEvent =
  /**
   * `dir` is the arrow to swipe and the dance move played on the hit. `tap` (v2): a TAP note, any tap hits it,
   * `dir` is then only the dance move.
   */
  | { type: "hit"; beat: number; dir: Dir; tap?: boolean }
  /** Alternate LEFT/RIGHT from `beat` for `length` beats, release with SPACE on beat + length. */
  | { type: "mash"; beat: number; length: number }
  /** Press SPACE on `beat`, release exactly on beat + length. */
  | { type: "hold"; beat: number; length: number }
  /** Shown 2 beats ahead, input in order, the last press judged on `beat`. */
  | { type: "combo"; beat: number; dirs: Dir[] };

export interface Taunt {
  beat: number;
  text: string;
}

export interface Level {
  id: number;
  /** Title unlocked by winning the level. */
  title: string;
  place: string;
  /** Key of public/art/<artKey>.jpg */
  artKey: string;
  story: [string, string];
  opponent: {
    name: string;
    persona: string;
    color: string;
    /** Nameplate handle, e.g. "@boat_kid_riau". */
    handle?: string;
    /** Fixed rank word on his plate (a src/v2/xp.ts RANKS word), never read from the meter. */
    rank?: string;
    /** Arena light color for this opponent (CSS hex); the arena is the same black playground. */
    light?: string;
    /** Rig file under assets/3d/characters/ for this opponent. */
    rig?: string;
  };
  taunts: Taunt[];
  announcer: { intro: string; win: string; lose: string };
  bpm: number;
  windowScale: number;
  lengthBeats: number;
  seed: number;
  /** Beat where the boss phase 2 starts (music drops an octave, handheld camera). */
  phase2Beat?: number;
  events: QteEvent[];
}

export interface Campaign {
  levels: Level[];
}

/** Voice line id convention used by gen-voices and src/audio/voice.ts. */
export const lineId = {
  taunt: (level: number, i: number) => `l${level}-taunt-${i}`,
  intro: (level: number) => `l${level}-intro`,
  win: (level: number) => `l${level}-win`,
  lose: (level: number) => `l${level}-lose`,
};
