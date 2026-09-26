// The loadout: which character the player plays and which emote they flex on a win. One localStorage key,
// read by the stage when it builds the cast (src/render3d/fighters.ts) and by the victory beat.
export const LOADOUT_KEY = "aura.loadout.v1";

/** The player pool: every textured rig in assets/3d/characters that is not the rival. File paths are the
 * manifest's `file`, so the stage can find the entry. */
export const CHARACTER_POOL: { file: string; name: string }[] = [
  { file: "characters/james_player_streetwear.glb", name: "JAMES" },
  { file: "characters/michelle_crowd_darker.glb", name: "MICHELLE" },
  { file: "characters/adam_crowd_sporty.glb", name: "ADAM" },
  { file: "characters/sophie_crowd_casual.glb", name: "SOPHIE" },
  { file: "characters/josh_crowd_jacket.glb", name: "JOSH" },
  { file: "characters/elizabeth_crowd_darker.glb", name: "ELIZABETH" },
  { file: "characters/kaya_crowd.glb", name: "KAYA" },
  { file: "characters/sportygranny_crowd_older.glb", name: "GRANNY" },
];

export interface Loadout {
  /** A CHARACTER_POOL file, or undefined for the stage's own pick. */
  character?: string;
  /** A packs emote id (src/packs/catalog.ts), or undefined for the equipped one. */
  emote?: string;
}

export interface KV {
  getItem(k: string): string | null;
  setItem(k: string, v: string): void;
}

function store(): KV | null {
  try {
    return typeof localStorage === "undefined" ? null : localStorage;
  } catch {
    return null;
  }
}

let memory: Loadout = {};

/** The saved loadout; a corrupt value, an unknown character or a blocked storage reads as the defaults. */
export function getLoadout(kv: KV | null = store()): Loadout {
  try {
    const raw = kv?.getItem(LOADOUT_KEY);
    if (!raw) return { ...memory };
    const v = JSON.parse(raw) as Loadout;
    const character = CHARACTER_POOL.some((c) => c.file === v.character) ? v.character : undefined;
    const emote = typeof v.emote === "string" ? v.emote : undefined;
    return { character, emote };
  } catch {
    return { ...memory };
  }
}

export function setLoadout(patch: Loadout, kv: KV | null = store()): Loadout {
  const next = { ...getLoadout(kv), ...patch };
  memory = next;
  try {
    kv?.setItem(LOADOUT_KEY, JSON.stringify(next));
  } catch {
    /* private mode or full: the in memory copy holds for this session */
  }
  return next;
}
