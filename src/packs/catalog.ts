// The Aura Packs catalog: data only. The main session binds emote clips to the 3D layer.
// Emote names come from the canon of moves (docs/aura-farming-spec.md section 3).

export type Rarity = "common" | "rare" | "epic" | "legendary" | "unfathomable";
export const RARITIES: readonly Rarity[] = ["common", "rare", "epic", "legendary", "unfathomable"];

/** Pack odds per card, in percent. Printed in docs/packs.md and meant for the README. */
export const PACK_RATES: Readonly<Record<Rarity, number>> = {
  common: 60,
  rare: 25,
  epic: 10,
  legendary: 4,
  unfathomable: 1,
};

/** A duplicate turns into this many aura shards. */
export const DUPLICATE_SHARDS: Readonly<Record<Rarity, number>> = {
  common: 10,
  rare: 25,
  epic: 60,
  legendary: 150,
  unfathomable: 500,
};

export const RARITY_STYLE: Readonly<Record<Rarity, { label: string; color: string; glow: string; tone: number }>> = {
  common: { label: "COMMON", color: "#9aa3b2", glow: "#cfd6e2", tone: 392 },
  rare: { label: "RARE", color: "#2f8cff", glow: "#7cc0ff", tone: 494 },
  epic: { label: "EPIC", color: "#a24bff", glow: "#d39bff", tone: 587 },
  legendary: { label: "LEGENDARY", color: "#ffb21a", glow: "#ffe08a", tone: 740 },
  unfathomable: { label: "UNFATHOMABLE", color: "#ff2340", glow: "#ffffff", tone: 988 },
};

export type ItemKind = "emote" | "cosmetic";

export interface Item {
  id: string;
  name: string;
  kind: ItemKind;
  rarity: Rarity;
  /** One line under the name, Gen Z voice. */
  flavor: string;
  /** Emotes only: the clip event the 3D layer plays, always `emote:<id>`. */
  event?: string;
  /** Emotes only: the Mixamo clip name from assets/3d/manifest.json, null until that manifest ships it. */
  clip?: string | null;
  /** Emotes only: the canon's proposed Mixamo catalog name, for whoever downloads the clip. */
  mixamo?: string;
  /** Emotes only: the RobotExpressive clip to play while the Mixamo clip is missing. */
  robot?: string;
  /** Cosmetics only: the slot it goes in. */
  slot?: "shades" | "aura" | "head";
  /** Cosmetics only: a color the renderer can use (aura colors, lens tints). */
  tint?: string;
}

const emote = (id: string, name: string, rarity: Rarity, mixamo: string, robot: string, flavor: string): Item => ({
  id,
  name,
  kind: "emote",
  rarity,
  flavor,
  event: `emote:${id}`,
  clip: null,
  mixamo,
  robot,
});

const cosmetic = (id: string, name: string, rarity: Rarity, slot: Item["slot"], tint: string, flavor: string): Item => ({
  id,
  name,
  kind: "cosmetic",
  rarity,
  flavor,
  slot,
  tint,
});

export const CATALOG: readonly Item[] = [
  // COMMON
  emote("chin-up", "Chin Up", "common", "Taunt", "Yes", "Chin at 45 degrees. Zero words."),
  emote("watch-check", "Watch Check", "common", "Looking Around", "Standing", "You are late to your own loss."),
  emote("shoulder-brush", "Shoulder Brush", "common", "Taunt", "No", "Dust off. Their aura, specifically."),
  emote("palm-push", "Palm Push", "common", "Arm Stretching", "Wave", "Slowly. Like it costs nothing."),
  cosmetic("shades-classic", "Classic Shades", "common", "shades", "#111111", "Black lenses. Standard issue aura."),
  cosmetic("aura-ash", "Ash Aura", "common", "aura", "#b8bcc6", "Quiet. For now."),
  // RARE
  emote("the-stare", "The Stare", "rare", "Taunt", "Idle", "Do not blink. Ever."),
  emote("wrist-roll", "Wrist Roll", "rare", "Snake Hip Hop Dance", "Dance", "Snake arms, lazy eyes."),
  emote("catwalk", "Catwalk", "rare", "Catwalk Walk Forward HighKnees", "Walking", "The floor is a runway now."),
  emote("point-at-lens", "Point At The Lens", "rare", "Taunt", "Punch", "You, at home. Yes, you."),
  cosmetic("shades-visor", "Visor Shades", "rare", "shades", "#2f8cff", "Sees the drop before it drops."),
  cosmetic("aura-ice", "Ice Blue Aura", "rare", "aura", "#5ec8ff", "Cold enough to freeze a crowd."),
  // EPIC
  emote("boat-sweep", "Boat Sweep", "epic", "Wave Hip Hop Dance", "Dance", "The original. The prow of the canoe."),
  emote("look-back", "The Look Back", "epic", "Looking Around", "Walking", "Keep walking. Look once. Leave."),
  emote("mewing-check", "Mewing Check", "epic", "Taunt", "ThumbsUp", "Jawline first, questions later."),
  cosmetic("shades-mirror", "Mirror Shades", "epic", "shades", "#c9d3ff", "They only see themselves losing."),
  cosmetic("aura-violet", "Violet Aura", "epic", "aura", "#a24bff", "Main character purple."),
  // LEGENDARY
  emote("siuuu", "Siuuu", "legendary", "Jumping Dance", "Jump", "Jump, spin, land. The whole stadium hears it."),
  cosmetic("crown", "The Crown", "legendary", "head", "#ffcf3a", "Heavy is the head. Not yours."),
  cosmetic("aura-gold", "Gold Aura", "legendary", "aura", "#ffb21a", "Aura so loud it has a sound."),
  // UNFATHOMABLE
  emote("griddy-void", "Griddy of the Void", "unfathomable", "Jumping Dance", "Dance", "The void griddies back."),
  cosmetic("aura-void", "Void White Aura", "unfathomable", "aura", "#fff4f4", "Unfathomable. Literally."),
];

export const ITEM_BY_ID: ReadonlyMap<string, Item> = new Map(CATALOG.map((i) => [i.id, i]));
export const EMOTES: readonly Item[] = CATALOG.filter((i) => i.kind === "emote");
/** The emote everyone owns from the start, so the flex slot is never empty. */
export const STARTER_EMOTE = "chin-up";

/** The Aura Pass: a tier every PASS_TIER_SHARDS shards, each with a named reward. */
export const PASS_TIER_SHARDS = 100;
export interface PassReward {
  tier: number;
  name: string;
  /** A title or a badge id the game can show next to the player name. */
  id: string;
}
export const PASS_REWARDS: readonly PassReward[] = [
  { tier: 1, name: "Title: Lowkey", id: "title:lowkey" },
  { tier: 2, name: "Title: Unbothered", id: "title:unbothered" },
  { tier: 3, name: "Badge: First Shard", id: "badge:first-shard" },
  { tier: 4, name: "Title: Main Character", id: "title:main-character" },
  { tier: 5, name: "Aura Trail: Sparks", id: "trail:sparks" },
  { tier: 6, name: "Title: Aura Farmer", id: "title:aura-farmer" },
  { tier: 7, name: "Badge: Crowd Favorite", id: "badge:crowd-favorite" },
  { tier: 8, name: "Title: Certified Menace", id: "title:certified-menace" },
  { tier: 9, name: "Aura Trail: Lightning", id: "trail:lightning" },
  { tier: 10, name: "Title: Infinite Aura", id: "title:infinite-aura" },
];
export const PASS_MAX_TIER = PASS_REWARDS.length;
