// Seeded comment and handle pools for the TikTok LIVE overlay.
// Every line is invented: the handles are not real people and the comments are
// short, clean Gen Z chat filler tagged by the game event that triggers them.

export type LiveEventKind =
  | "perfect"
  | "great"
  | "miss"
  | "cringe"
  | "release"
  | "combo"
  | "taunt"
  | "win"
  | "lose";

export type CommentTag = LiveEventKind | "idle";

export interface CommentEntry {
  readonly text: string;
  readonly tags: readonly CommentTag[];
}

const entry = (text: string, ...tags: CommentTag[]): CommentEntry => ({ text, tags });

export const COMMENT_POOL: readonly CommentEntry[] = [
  // perfect
  entry("aura plus 1000", "perfect"),
  entry("he is so real", "perfect", "win"),
  entry("lock in achieved", "perfect"),
  entry("W tap", "perfect"),
  entry("no cap that was clean", "perfect"),
  entry("perfect fr", "perfect"),
  entry("dialed in", "perfect"),
  entry("six seven perfect", "perfect"),
  entry("main character moment", "perfect", "win"),
  entry("rizz overload", "perfect"),
  entry("clean W", "perfect"),
  entry("that hit different", "perfect"),
  entry("locked in fr", "perfect", "combo"),
  entry("holy timing", "perfect"),
  // great
  entry("solid W", "great"),
  entry("pretty clean", "great"),
  entry("ok that was nice", "great"),
  entry("decent lock in", "great"),
  entry("W but lowkey", "great"),
  entry("almost perfect", "great"),
  entry("he is cooking", "great", "combo"),
  entry("not bad fr", "great"),
  entry("respect the timing", "great"),
  entry("nice one no cap", "great"),
  entry("greatness lowkey", "great"),
  entry("he is warming up", "great"),
  // miss
  entry("holy airball", "miss"),
  entry("chopped", "miss", "cringe"),
  entry("nah he tweaking", "miss", "cringe"),
  entry("L tap", "miss"),
  entry("he is cooked", "miss", "lose"),
  entry("miss fr", "miss"),
  entry("bro whiffed", "miss"),
  entry("aura minus 500", "miss"),
  entry("NPC behavior", "miss", "cringe"),
  entry("that was rough", "miss"),
  entry("airball again", "miss"),
  entry("lowkey embarrassing", "miss", "cringe"),
  // cringe
  entry("it is giving cringe", "cringe"),
  entry("so chopped", "cringe"),
  entry("NPC behavior fr", "cringe"),
  entry("bro is tweaking", "cringe"),
  entry("secondhand cringe", "cringe"),
  entry("delete that", "cringe"),
  entry("L personality", "cringe"),
  entry("cringe plus 100", "cringe"),
  entry("nah that is wild", "cringe", "taunt"),
  entry("he is not him", "cringe", "lose"),
  entry("aura minus 1000", "cringe"),
  entry("put him in timeout", "cringe"),
  // release
  entry("gift dropped", "release"),
  entry("big drop", "release"),
  entry("chat go crazy", "release"),
  entry("the drop is here", "release"),
  entry("turn it up", "release"),
  entry("we eating good", "release"),
  entry("release W", "release"),
  entry("that beat is nasty", "release"),
  entry("drop of the year", "release"),
  entry("chat lock in", "release", "idle"),
  entry("so real for this", "release"),
  entry("here we go", "release"),
  // combo
  entry("combo cooking", "combo"),
  entry("chain it up", "combo"),
  entry("he is locked in", "combo"),
  entry("keep it going", "combo"),
  entry("unreal streak", "combo"),
  entry("combo W", "combo"),
  entry("do not drop it", "combo"),
  entry("he is him", "combo", "win"),
  entry("streak so clean", "combo"),
  entry("chat witnessing greatness", "combo"),
  entry("aura stacking", "combo"),
  entry("combo plus 1000", "combo"),
  // taunt
  entry("get him", "taunt"),
  entry("throw hands", "taunt"),
  entry("he is tweaking", "taunt"),
  entry("cook him", "taunt"),
  entry("no mercy", "taunt"),
  entry("clown him", "taunt"),
  entry("let him cook", "taunt"),
  entry("he is scared", "taunt"),
  entry("fold him", "taunt"),
  entry("lowkey disrespectful", "taunt"),
  entry("taunt W", "taunt"),
  entry("chat pick sides", "taunt"),
  // win
  entry("W in the chat", "win"),
  entry("big W", "win"),
  entry("crowned", "win"),
  entry("GOATed", "win"),
  entry("W forever", "win"),
  entry("unbeaten fr", "win"),
  entry("aura maxed", "win"),
  entry("chat we won", "win"),
  entry("victory no cap", "win"),
  entry("sealed it", "win"),
  entry("he is him fr", "win"),
  entry("peak performance", "win"),
  // lose
  entry("L in the chat", "lose"),
  entry("big L", "lose"),
  entry("cooked fr", "lose"),
  entry("chopped ending", "lose"),
  entry("aura wiped", "lose"),
  entry("he fell off", "lose"),
  entry("tough L", "lose"),
  entry("rough one", "lose"),
  entry("NPC ending", "lose"),
  entry("lowkey sad", "lose"),
  entry("L but respect", "lose"),
  entry("we move", "lose"),
  // idle
  entry("chat alive", "idle"),
  entry("who is winning", "idle"),
  entry("lowkey fun", "idle"),
  entry("first", "idle"),
  entry("hi chat", "idle"),
  entry("tuning in", "idle"),
  entry("this is peak", "idle"),
  entry("vibes immaculate", "idle"),
  entry("bring the hype", "idle"),
  entry("six seven", "idle"),
  entry("no cap this fire", "idle"),
  entry("locked in already", "idle"),
  entry("where is the drop", "idle"),
  entry("chat is chopped", "idle"),
  entry("send hearts", "idle"),
];

export const HANDLE_POOL: readonly string[] = [
  "@auramaxxer",
  "@npc_no_cap",
  "@sixseven_fan",
  "@lockedin_lily",
  "@chopped_chad",
  "@rizzlord404",
  "@cringe_patrol",
  "@mainchar_mia",
  "@lowkey_leo",
  "@big_w_only",
  "@tweaking_tom",
  "@airball_andy",
  "@no_cap_nina",
  "@combo_carl",
  "@hype_hana",
  "@dripcheck_dev",
  "@glazing_greg",
  "@aura_farmer",
  "@bot_but_real",
  "@peak_poster",
];

/** How many recent picks a picker refuses to repeat. */
export const NO_REPEAT_WINDOW = 8;

/** Deterministic 32 bit PRNG (mulberry32) seeded from a number or a string. */
export function createRng(seed: number | string): () => number {
  let a = typeof seed === "number" ? seed >>> 0 : hashString(seed);
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashString(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export interface CommentPicker {
  /** A comment for the given tag, never one of the last 8 comments picked. */
  comment(tag?: CommentTag): string;
  /** A handle, never one of the last 8 handles picked. */
  handle(): string;
}

export function commentsFor(tag: CommentTag): string[] {
  return COMMENT_POOL.filter((c) => c.tags.includes(tag)).map((c) => c.text);
}

export function createPicker(seed: number | string): CommentPicker {
  const rng = createRng(seed);
  const commentHistory: string[] = [];
  const handleHistory: string[] = [];

  const take = (options: readonly string[], history: string[]): string => {
    const fresh = options.filter((o) => !history.includes(o));
    const from = fresh.length > 0 ? fresh : options.slice();
    const picked = from[Math.floor(rng() * from.length) % from.length];
    history.push(picked);
    if (history.length > NO_REPEAT_WINDOW) history.shift();
    return picked;
  };

  return {
    comment(tag: CommentTag = "idle") {
      const options = commentsFor(tag);
      return take(options.length > 0 ? options : commentsFor("idle"), commentHistory);
    },
    handle() {
      return take(HANDLE_POOL, handleHistory);
    },
  };
}
