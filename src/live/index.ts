// A self contained TikTok LIVE style overlay for the browser rhythm game.
// DOM plus CSS over the full screen canvas: LIVE badge, viewer count, the two
// handles, a comment feed, floating hearts, a gift toast and a reaction burst.
//
// Rules the implementation keeps:
//  - every DOM write goes through a requestAnimationFrame batch;
//  - at most 6 comment nodes exist at any time (they are recycled);
//  - hearts and reactions come from small fixed node pools;
//  - nothing reads layout, so there is no layout thrash;
//  - the whole overlay is pointer events none, the game keeps every input.

// @ts-ignore - the bundler resolves the stylesheet, tsc has no CSS module types
import "./live.css";
import { createPicker, type CommentTag, type LiveEventKind } from "./comments";

export type { CommentTag, LiveEventKind } from "./comments";

export const MAX_COMMENTS = 6;
export const HEART_POOL_SIZE = 24;
export const REACTION_POOL_SIZE = 16;

export type ReactionKind = "fire" | "heart" | "skull" | "laugh" | "clap" | "shock";

export interface LiveUIOptions {
  playerHandle: string;
  opponentHandle: string;
  seed: number | string;
  /** Only the LIVE badge and the viewer count, small in the bottom left corner (the cut down battle HUD). */
  minimal?: boolean;
}

export interface LiveUI {
  setViewers(n: number): void;
  comment(handle: string, text: string, gift?: string): void;
  heart(count: number): void;
  gift(name: string, tier: number): void;
  reactions(kind: ReactionKind | string, count: number): void;
  event(kind: LiveEventKind, payload?: LiveEventPayload): void;
  destroy(): void;
}

export interface LiveEventPayload {
  hearts?: number;
  reactions?: number;
  gift?: string;
  tier?: number;
  text?: string;
  handle?: string;
}

const REACTION_EMOJI: Record<string, string> = {
  fire: "\u{1F525}",
  heart: "\u2764\uFE0F",
  skull: "\u{1F480}",
  laugh: "\u{1F602}",
  clap: "\u{1F44F}",
  shock: "\u{1F633}",
};

const GIFT_EMOJI = "\u{1F381}";
const HEART_EMOJI = "\u{1F495}";

const HEART_MS = 2400;
const REACTION_MS = 1100;
const TOAST_MS = 1600;
const VIEWER_TWEEN_MS = 600;

type Frame = (now: number) => void;

function rafOf(win: Window & typeof globalThis): {
  request: (cb: Frame) => number;
  cancel: (id: number) => void;
} {
  if (typeof win.requestAnimationFrame === "function") {
    return {
      request: (cb) => win.requestAnimationFrame(cb),
      cancel: (id) => win.cancelAnimationFrame(id),
    };
  }
  return {
    request: (cb) => win.setTimeout(() => cb(Date.now()), 16) as unknown as number,
    cancel: (id) => win.clearTimeout(id),
  };
}

export function formatViewers(n: number): string {
  const v = Math.max(0, Math.round(n));
  if (v < 1000) return String(v);
  if (v < 1000000) {
    const k = v / 1000;
    return `${k < 10 ? k.toFixed(1) : Math.round(k)}K`;
  }
  const m = v / 1000000;
  return `${m < 10 ? m.toFixed(1) : Math.round(m)}M`;
}

function el<K extends keyof HTMLElementTagNameMap>(
  doc: Document,
  tag: K,
  className: string,
  text?: string,
): HTMLElementTagNameMap[K] {
  const node = doc.createElement(tag);
  node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

export function createLiveUI(root: HTMLElement, opts: LiveUIOptions): LiveUI {
  const doc = root.ownerDocument;
  const win = (doc.defaultView ?? globalThis) as Window & typeof globalThis;
  const raf = rafOf(win);
  const picker = createPicker(opts.seed);

  const shell = el(doc, "div", opts.minimal ? "live-root live-root--minimal" : "live-root");
  shell.setAttribute("aria-hidden", "true");

  // Top left: badge and viewers.
  const topLeft = el(doc, "div", "live-topleft");
  const badge = el(doc, "div", "live-badge");
  badge.append(el(doc, "span", "live-dot"), el(doc, "span", "live-badge-label", "Live"));
  const viewers = el(doc, "div", "live-viewers");
  const viewersEye = el(doc, "span", "live-viewers-eye", "\u{1F441}");
  const viewersValue = el(doc, "span", "live-viewers-value", "0");
  viewers.append(viewersEye, viewersValue);
  topLeft.append(badge, viewers);

  // Top center: the two handles.
  const handles = el(doc, "div", "live-handles");
  const player = el(doc, "div", "live-handle live-handle--player");
  player.append(el(doc, "span", "live-avatar", "\u{1F464}"), el(doc, "span", "live-handle-name", opts.playerHandle));
  const opponent = el(doc, "div", "live-handle live-handle--opponent");
  opponent.append(
    el(doc, "span", "live-avatar", "\u{1F464}"),
    el(doc, "span", "live-handle-name", opts.opponentHandle),
  );
  handles.append(player, el(doc, "span", "live-vs", "VS"), opponent);

  // Bottom left: the comment feed.
  const feed = el(doc, "ul", "live-feed");

  // Bottom right: hearts.
  const heartsLayer = el(doc, "div", "live-hearts");
  const heartNodes: HTMLElement[] = [];
  for (let i = 0; i < HEART_POOL_SIZE; i++) {
    const heartNode = el(doc, "span", "live-heart", HEART_EMOJI);
    heartNodes.push(heartNode);
    heartsLayer.append(heartNode);
  }

  // Right edge: the hype bar reaction burst.
  const reactionsLayer = el(doc, "div", "live-reactions");
  const reactionNodes: HTMLElement[] = [];
  for (let i = 0; i < REACTION_POOL_SIZE; i++) {
    const reactionNode = el(doc, "span", "live-reaction", REACTION_EMOJI.fire);
    reactionNodes.push(reactionNode);
    reactionsLayer.append(reactionNode);
  }

  // Center: the gift toast.
  const toast = el(doc, "div", "live-toast");
  const toastIcon = el(doc, "span", "live-toast-icon", GIFT_EMOJI);
  const toastName = el(doc, "span", "live-toast-name", "");
  const toastTier = el(doc, "span", "live-toast-tier", "");
  toast.append(toastIcon, toastName, toastTier);

  shell.append(topLeft, handles, feed, heartsLayer, reactionsLayer, toast);
  root.append(shell);

  // ---- batching -----------------------------------------------------------

  let destroyed = false;
  let frameId: number | null = null;
  const writes: Array<() => void> = [];
  const timers = new Set<number>();

  const later = (fn: () => void, ms: number): void => {
    const id: number = win.setTimeout(() => {
      timers.delete(id);
      if (!destroyed) fn();
    }, ms) as unknown as number;
    timers.add(id);
  };

  const schedule = (write: () => void): void => {
    if (destroyed) return;
    writes.push(write);
    if (frameId === null) frameId = raf.request(flush);
  };

  let viewerFrom = 0;
  let viewerTo = 0;
  let viewerStart = 0;
  let viewerTweening = false;

  function flush(now: number): void {
    frameId = null;
    const batch = writes.splice(0, writes.length);
    for (const write of batch) write();
    if (viewerTweening) {
      if (viewerStart < 0) viewerStart = now;
      const t = Math.max(0, Math.min(1, (now - viewerStart) / VIEWER_TWEEN_MS));
      const eased = 1 - Math.pow(1 - t, 3);
      const value = viewerFrom + (viewerTo - viewerFrom) * eased;
      viewersValue.textContent = formatViewers(value);
      if (t >= 1) viewerTweening = false;
    }
    if (!destroyed && (writes.length > 0 || viewerTweening)) frameId = raf.request(flush);
  }

  // ---- comments -----------------------------------------------------------

  const commentNodes: HTMLLIElement[] = [];

  function buildComment(): HTMLLIElement {
    const li = el(doc, "li", "live-comment");
    li.append(
      el(doc, "span", "live-comment-handle", ""),
      el(doc, "span", "live-comment-text", ""),
      el(doc, "span", "live-comment-gift", ""),
    );
    return li;
  }

  function pushComment(handle: string, text: string, gift?: string): void {
    schedule(() => {
      let node: HTMLLIElement;
      if (commentNodes.length >= MAX_COMMENTS) {
        node = commentNodes.shift() as HTMLLIElement;
        node.classList.remove("live-comment--fading");
      } else {
        node = buildComment();
      }
      const [handleEl, textEl, giftEl] = Array.from(node.children) as HTMLElement[];
      handleEl.textContent = handle;
      textEl.textContent = text;
      giftEl.textContent = gift ? `${GIFT_EMOJI} ${gift}` : "";
      // Re-appending restarts the enter animation and keeps the newest last.
      feed.append(node);
      commentNodes.push(node);
      if (commentNodes.length > 0) commentNodes[0].classList.add("live-comment--fading");
    });
  }

  // ---- hearts and reactions ----------------------------------------------

  let heartCursor = 0;
  const heartBusy = new Set<HTMLElement>();

  function flyHeart(index: number): void {
    for (let probe = 0; probe < HEART_POOL_SIZE; probe++) {
      const node = heartNodes[heartCursor];
      heartCursor = (heartCursor + 1) % HEART_POOL_SIZE;
      if (heartBusy.has(node)) continue;
      heartBusy.add(node);
      const delay = index * 90;
      node.style.setProperty("--live-heart-x", `${6 + ((index * 17) % 60)}px`);
      node.style.setProperty("--live-heart-size", `${16 + ((index * 5) % 14)}px`);
      node.style.setProperty("--live-heart-dur", `${HEART_MS - ((index * 130) % 700)}ms`);
      node.style.setProperty("--live-heart-delay", `${delay}ms`);
      node.classList.remove("live-heart--fly");
      // Reading nothing: the class is re-added on the next batched frame.
      schedule(() => node.classList.add("live-heart--fly"));
      later(() => {
        node.classList.remove("live-heart--fly");
        heartBusy.delete(node);
      }, HEART_MS + delay + 60);
      return;
    }
  }

  let reactionCursor = 0;
  const reactionBusy = new Set<HTMLElement>();

  function popReaction(emoji: string, index: number): void {
    for (let probe = 0; probe < REACTION_POOL_SIZE; probe++) {
      const node = reactionNodes[reactionCursor];
      reactionCursor = (reactionCursor + 1) % REACTION_POOL_SIZE;
      if (reactionBusy.has(node)) continue;
      reactionBusy.add(node);
      const delay = index * 70;
      node.textContent = emoji;
      node.style.setProperty("--live-reaction-y", `${(index * 13) % 90}%`);
      node.style.setProperty("--live-reaction-size", `${18 + ((index * 3) % 10)}px`);
      node.style.setProperty("--live-reaction-delay", `${delay}ms`);
      node.classList.remove("live-reaction--pop");
      schedule(() => node.classList.add("live-reaction--pop"));
      later(() => {
        node.classList.remove("live-reaction--pop");
        reactionBusy.delete(node);
      }, REACTION_MS + delay + 60);
      return;
    }
  }

  // ---- public API ---------------------------------------------------------

  const api: LiveUI = {
    setViewers(n: number) {
      if (destroyed) return;
      const target = Math.max(0, Math.round(n));
      viewerFrom = viewerTweening ? viewerFrom + (viewerTo - viewerFrom) * 0.5 : viewerTo;
      viewerTo = target;
      viewerStart = -1; // stamped from the first frame so any clock works
      viewerTweening = true;
      schedule(() => {});
    },

    comment(handle: string, text: string, gift?: string) {
      if (destroyed) return;
      pushComment(handle, text, gift);
    },

    heart(count: number) {
      if (destroyed) return;
      const n = Math.max(0, Math.min(HEART_POOL_SIZE, Math.round(count)));
      for (let i = 0; i < n; i++) flyHeart(i);
    },

    gift(name: string, tier: number) {
      if (destroyed) return;
      schedule(() => {
        toastName.textContent = name;
        toastTier.textContent = tier > 0 ? `T${Math.round(tier)}` : "";
        toast.classList.remove("live-toast--show");
        schedule(() => toast.classList.add("live-toast--show"));
      });
      later(() => toast.classList.remove("live-toast--show"), TOAST_MS + 120);
    },

    reactions(kind: ReactionKind | string, count: number) {
      if (destroyed) return;
      const emoji = REACTION_EMOJI[kind] ?? REACTION_EMOJI.fire;
      const n = Math.max(0, Math.min(REACTION_POOL_SIZE, Math.round(count)));
      for (let i = 0; i < n; i++) popReaction(emoji, i);
    },

    event(kind: LiveEventKind, payload: LiveEventPayload = {}) {
      if (destroyed) return;
      const handle = payload.handle ?? picker.handle();
      const text = payload.text ?? picker.comment(kind as CommentTag);
      switch (kind) {
        case "perfect":
          api.heart(payload.hearts ?? 6);
          api.comment(handle, text);
          break;
        case "great":
          api.heart(payload.hearts ?? 3);
          api.comment(handle, text);
          break;
        case "miss":
          api.comment(handle, text);
          api.reactions("skull", payload.reactions ?? 4);
          break;
        case "cringe":
          api.comment(handle, text);
          api.reactions("laugh", payload.reactions ?? 8);
          break;
        case "release":
          api.gift(payload.gift ?? "Aura Drop", payload.tier ?? 3);
          api.comment(handle, text, payload.gift ?? "Aura Drop");
          api.heart(payload.hearts ?? 8);
          break;
        case "combo":
          api.reactions("fire", payload.reactions ?? 6);
          api.comment(handle, text);
          break;
        case "taunt":
          api.comment(handle, text);
          api.reactions("shock", payload.reactions ?? 5);
          break;
        case "win":
          api.gift(payload.gift ?? "Crown", payload.tier ?? 5);
          api.heart(payload.hearts ?? 12);
          api.reactions("clap", payload.reactions ?? 8);
          api.comment(handle, text);
          break;
        case "lose":
          api.reactions("skull", payload.reactions ?? 8);
          api.comment(handle, text);
          break;
      }
    },

    destroy() {
      if (destroyed) return;
      destroyed = true;
      if (frameId !== null) raf.cancel(frameId);
      frameId = null;
      writes.length = 0;
      for (const id of timers) win.clearTimeout(id);
      timers.clear();
      commentNodes.length = 0;
      shell.remove();
    },
  };

  return api;
}

export default createLiveUI;
