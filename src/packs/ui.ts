// The pack opening overlay: DOM plus CSS, no canvas. Tap to tear, cards fly out and flip one by one,
// a second tap skips to the reveal, the summary fills the Aura Pass, CONTINUE closes.
import { ITEM_BY_ID, RARITIES, RARITY_STYLE, type Item, type Rarity } from "./catalog";
import type { Card, PassState } from "./state";
import { PackSound } from "./sound";
import { PACK_CSS } from "./styles";

export interface OverlayInput {
  cards: Card[];
  before: PassState;
  after: PassState;
  equipped: string;
  /** Called when the player taps a revealed emote; returns the emote now equipped. */
  onEquip: (id: string) => string;
  onUnfathomable?: () => void;
  onReveal?: (card: Card, index: number) => void;
  audio?: AudioContext | null;
  parent?: HTMLElement;
}

const rank = (r: Rarity) => RARITIES.indexOf(r);
const TEASE_MS: Record<Rarity, number> = { common: 0, rare: 0, epic: 380, legendary: 650, unfathomable: 1000 };
const CONFETTI: Record<Rarity, number> = { common: 14, rare: 24, epic: 36, legendary: 54, unfathomable: 80 };

let styled = false;
export function injectStyle(): void {
  if (styled) return;
  styled = true;
  const s = document.createElement("style");
  s.id = "aura-packs-css";
  s.textContent = PACK_CSS;
  document.head.appendChild(s);
}

function el<K extends keyof HTMLElementTagNameMap>(tag: K, cls: string, html?: string): HTMLElementTagNameMap[K] {
  const e = document.createElement(tag);
  e.className = cls;
  if (html !== undefined) e.innerHTML = html;
  return e;
}

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);

// Arm angles in degrees (0 = down, 90 = out, 180 = up) so every emote card shows its own silhouette.
const POSES: Record<string, [number, number]> = {
  "chin-up": [28, 28], "watch-check": [12, 118], "shoulder-brush": [14, 150], "palm-push": [82, 82],
  "the-stare": [6, 6], "wrist-roll": [104, 22], catwalk: [26, -14], "point-at-lens": [10, 92],
  "boat-sweep": [96, 96], "look-back": [18, 12], "mewing-check": [10, 162], siuuu: [124, 124], "griddy-void": [150, 38],
};

function figure(id: string, color: string): string {
  const [la, ra] = POSES[id] ?? [20, 20];
  const arm = (a: number, side: -1 | 1) => {
    const r = (a * Math.PI) / 180;
    const x = 50 + side * 13, y = 44;
    return `<line x1="${x}" y1="${y}" x2="${(x + side * Math.sin(r) * 30).toFixed(1)}" y2="${(y + Math.cos(r) * 30).toFixed(1)}"/>`;
  };
  return `<svg viewBox="0 0 100 120" aria-hidden="true"><g stroke="#fff" stroke-width="9" stroke-linecap="round" fill="none">
${arm(la, -1)}${arm(ra, 1)}<line x1="43" y1="78" x2="38" y2="112"/><line x1="57" y1="78" x2="62" y2="112"/></g>
<rect x="35" y="38" width="30" height="44" rx="11" fill="#fff"/><circle cx="50" cy="22" r="14" fill="#fff"/>
<rect x="38" y="17" width="24" height="7" rx="3" fill="${color}"/><rect x="38" y="17" width="24" height="7" rx="3" fill="#000" opacity=".75"/></svg>`;
}

function cosmeticIcon(it: Item): string {
  const t = it.tint ?? "#fff";
  if (it.slot === "shades")
    return `<svg viewBox="0 0 120 60" aria-hidden="true"><path d="M6 14h108" stroke="#fff" stroke-width="7" stroke-linecap="round"/>
<path d="M10 14h40c0 22-8 32-22 32S10 36 10 14zM70 14h40c0 22-6 32-20 32S70 36 70 14z" fill="${t}" stroke="#fff" stroke-width="5"/>
<path d="M18 20l10 0M78 20l10 0" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".7"/></svg>`;
  if (it.slot === "head")
    return `<svg viewBox="0 0 120 90" aria-hidden="true"><path d="M10 78L4 20l30 24L60 6l26 38 30-24-6 58z" fill="${t}" stroke="#fff" stroke-width="5" stroke-linejoin="round"/>
<circle cx="60" cy="54" r="7" fill="#ff2340"/><circle cx="30" cy="60" r="5" fill="#2f8cff"/><circle cx="90" cy="60" r="5" fill="#2f8cff"/></svg>`;
  return `<svg viewBox="0 0 100 100" aria-hidden="true"><defs><radialGradient id="ag-${it.id}"><stop offset="35%" stop-color="${t}" stop-opacity="0"/>
<stop offset="62%" stop-color="${t}"/><stop offset="100%" stop-color="${t}" stop-opacity="0"/></radialGradient></defs>
<circle cx="50" cy="50" r="48" fill="url(#ag-${it.id})"/><circle cx="50" cy="50" r="24" fill="none" stroke="#fff" stroke-width="4" opacity=".8"/></svg>`;
}

function cardHtml(c: Card): string {
  const it = ITEM_BY_ID.get(c.id)!;
  const st = RARITY_STYLE[c.rarity];
  const icon = c.kind === "emote" ? figure(c.id, st.color) : cosmeticIcon(it);
  return `<div class="ap-rays"></div><div class="ap-leak"></div>
<div class="ap-card"><div class="ap-face ap-back"><b>AURA</b></div>
<div class="ap-face ap-front"><div class="ap-rar"><span>${st.label}</span><span class="ap-kind">${c.kind === "emote" ? "EMOTE" : "COSMETIC"}</span></div>
<div class="ap-icon">${icon}</div><div><div class="ap-name">${esc(c.name)}</div><div class="ap-flavor">${esc(c.flavor)}</div></div></div></div>
${c.isNew ? `<div class="ap-new">NEW!</div>` : `<div class="ap-dupe">DUPE +${c.shards} SHARDS</div>`}
${c.kind === "emote" ? `<div class="ap-equipped">EQUIPPED</div>` : ""}`;
}

export function showOverlay(input: OverlayInput): Promise<void> {
  injectStyle();
  const { cards } = input;
  const n = cards.length;
  const sound = new PackSound(input.audio);
  sound.unlock();

  const root = el("div", "ap-root");
  root.setAttribute("role", "dialog");
  root.setAttribute("aria-modal", "true");
  root.setAttribute("aria-label", "Aura Pack opening");
  root.tabIndex = -1;
  root.style.setProperty("--cw", `min(24vw,36vh,${(86 / (Math.max(n, 3) * 1.1)).toFixed(2)}vw)`);
  const bgrays = el("div", "ap-bgrays");
  const stage = el("div", "ap-stage");
  const tilt = el("div", "ap-tilt");
  const title = el("div", "ap-title", `AURA PACK<small>${n === 1 ? "1 CARD" : `${n} CARDS`}</small>`);
  const hint = el("div", "ap-hint", "TAP TO TEAR");
  const flash = el("div", "ap-flash");
  const callout = el("div", "ap-callout");
  const live = el("div", "");
  live.setAttribute("aria-live", "polite");
  live.style.cssText = "position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)";

  const pack = el("div", "ap-pack");
  pack.innerHTML = `<div class="ap-pack-glow"></div><div class="ap-pack-body">
<div class="ap-pack-half ap-pack-top"><div class="ap-pack-shine"></div></div>
<div class="ap-pack-half ap-pack-bottom"><div class="ap-pack-shine"></div><div class="ap-pack-label"><b>AURA</b><span>PACK</span></div></div>
<div class="ap-pack-count">x${n}</div></div>`;

  const spacing = 1.1;
  const slots = cards.map((c, i) => {
    const s = el("div", `ap-slot ap-r-${c.rarity}`, cardHtml(c));
    const st = RARITY_STYLE[c.rarity];
    s.style.setProperty("--ap-c", st.color);
    s.style.setProperty("--ap-g", st.glow);
    s.style.setProperty("--ap-x", `calc(var(--cw) * ${((i - (n - 1) / 2) * spacing).toFixed(3)})`);
    s.style.setProperty("--ap-y", `${(Math.abs(i - (n - 1) / 2) * 1.6 - 2).toFixed(2)}vh`);
    s.style.setProperty("--ap-r0", `${(i - (n - 1) / 2) * 25}deg`);
    s.dataset.i = String(i);
    if (c.id === input.equipped) s.classList.add("ap-is-equipped");
    return s;
  });

  const sum = el("div", "ap-sum");
  const shardsGained = cards.reduce((a, c) => a + c.shards, 0);
  const hasEmote = cards.some((c) => c.kind === "emote");
  sum.innerHTML = `<div class="ap-pass-row"><span>AURA PASS <em class="ap-tier">TIER ${input.before.tier}</em></span>
<span>${shardsGained > 0 ? `+${shardsGained} SHARDS` : "NO DUPES"}</span></div>
<div class="ap-bar"><div class="ap-fill"></div></div><div class="ap-tierup"></div>
<button class="ap-btn" type="button">CONTINUE</button>
${hasEmote ? `<div class="ap-tip">Tap an emote to equip it for your flex.</div>` : ""}`;
  const fill = sum.querySelector(".ap-fill") as HTMLElement;
  const tierLabel = sum.querySelector(".ap-tier") as HTMLElement;
  const tierUp = sum.querySelector(".ap-tierup") as HTMLElement;
  const btn = sum.querySelector(".ap-btn") as HTMLButtonElement;
  fill.style.transform = `scaleX(${input.before.progress})`;

  tilt.append(pack, ...slots);
  stage.append(tilt);
  root.append(bgrays, stage, title, hint, sum, flash, callout, live);
  (input.parent ?? document.body).append(root);
  void root.offsetWidth;
  root.classList.add("ap-in");
  root.focus({ preventScroll: true });

  // timers are tracked so a skip can cancel the sequence
  const timers = new Set<number>();
  const later = (ms: number, fn: () => void) => {
    const t = window.setTimeout(() => {
      timers.delete(t);
      fn();
    }, ms);
    timers.add(t);
  };
  const clearTimers = () => {
    for (const t of timers) clearTimeout(t);
    timers.clear();
  };

  type Phase = "pack" | "reveal" | "done" | "closing";
  let phase: Phase = "pack";
  let revealed = 0;
  let unfathomableFired = false;
  const idleShimmer = window.setInterval(() => phase === "pack" && sound.shimmer(), 2200);

  function confetti(host: HTMLElement, rarity: Rarity, count = CONFETTI[rarity], spread = 1): void {
    const st = RARITY_STYLE[rarity];
    const box = el("div", "ap-confetti");
    const colors = rarity === "unfathomable" ? ["#ff2340", "#ffffff", "#ff8a9a"] : [st.color, st.glow, "#ffffff"];
    let html = "";
    for (let i = 0; i < count; i++) {
      const a = Math.random() * Math.PI * 2;
      const d = (90 + Math.random() * 220) * spread;
      html += `<i class="ap-bit" style="--c:${colors[i % 3]};--x:${(Math.cos(a) * d).toFixed(0)}px;--y:${(Math.sin(a) * d - 60).toFixed(0)}px;--r:${(Math.random() * 720 - 360).toFixed(0)}deg;--d:${(0.8 + Math.random() * 0.6).toFixed(2)}s"></i>`;
    }
    box.innerHTML = html;
    host.append(box);
    window.setTimeout(() => box.remove(), 1600);
  }

  function bigFlash(): void {
    flash.className = "ap-flash";
    void flash.offsetWidth;
    flash.className = "ap-flash ap-go-big";
    root.classList.remove("ap-shake");
    void root.offsetWidth;
    root.classList.add("ap-shake");
  }

  function reveal(i: number, quiet = false): void {
    const s = slots[i];
    const c = cards[i];
    if (s.classList.contains("ap-revealed")) return;
    s.classList.remove("ap-tease");
    s.classList.add("ap-revealed");
    live.textContent = `${RARITY_STYLE[c.rarity].label}: ${c.name}${c.isNew ? ", new" : `, duplicate, ${c.shards} shards`}`;
    if (!quiet || rank(c.rarity) >= rank("legendary")) sound.flip(c.rarity, i);
    confetti(s, c.rarity, quiet ? Math.ceil(CONFETTI[c.rarity] / 2) : undefined);
    if (!quiet && rank(c.rarity) >= rank("epic")) {
      const st = RARITY_STYLE[c.rarity];
      callout.textContent = `${st.label}!`;
      callout.style.setProperty("--ap-c", st.color);
      callout.style.setProperty("--ap-g", st.glow);
      callout.classList.remove("ap-go");
      void callout.offsetWidth;
      callout.classList.add("ap-go");
    }
    if (c.rarity === "unfathomable" && !unfathomableFired) {
      unfathomableFired = true;
      bigFlash();
      sound.unfathomable();
      confetti(tilt, "unfathomable", 70, 2.2);
      try {
        input.onUnfathomable?.();
      } catch (e) {
        console.error("[packs] onUnfathomable threw", e);
      }
    }
    later(quiet ? 60 : 260, () => {
      s.classList.add("ap-show-tag");
      if (c.isNew && !quiet) sound.newTag();
    });
    try {
      input.onReveal?.(c, i);
    } catch (e) {
      console.error("[packs] onReveal threw", e);
    }
  }

  function flipNext(): void {
    if (phase !== "reveal") return;
    if (revealed >= n) return later(450, summary);
    const i = revealed++;
    const tease = TEASE_MS[cards[i].rarity];
    if (tease) slots[i].classList.add("ap-tease");
    later(tease, () => {
      reveal(i);
      later(rank(cards[i].rarity) >= rank("legendary") ? 900 : 560, flipNext);
    });
  }

  function tear(): void {
    phase = "reveal";
    sound.unlock();
    sound.tear();
    hint.style.animation = "none";
    hint.style.opacity = "0";
    flash.className = "ap-flash ap-go";
    pack.classList.add("ap-torn");
    slots.forEach((s, i) =>
      later(160 + i * 90, () => {
        s.classList.add("ap-out-card");
      }),
    );
    later(160 + n * 90 + 520, flipNext);
    later(700, () => pack.remove());
  }

  function skip(): void {
    if (phase !== "pack" && phase !== "reveal") return;
    phase = "reveal";
    clearTimers();
    hint.style.animation = "none";
    hint.style.opacity = "0";
    pack.classList.add("ap-torn");
    later(350, () => pack.remove());
    for (const s of slots) s.classList.add("ap-out-card");
    for (let i = 0; i < n; i++) reveal(i, true);
    revealed = n;
    later(60, () => slots.forEach((s) => s.classList.add("ap-show-tag")));
    later(120, summary);
  }

  function summary(): void {
    if (phase === "done" || phase === "closing") return;
    phase = "done";
    root.classList.add("ap-summary-mode");
    sum.classList.add("ap-on");
    const { before, after } = input;
    if (after.tier > before.tier) {
      fill.style.transform = "scaleX(1)";
      later(720, () => {
        tierLabel.textContent = `TIER ${after.tier}`;
        const got = after.unlocked.filter((r) => r.tier > before.tier).map((r) => r.name);
        tierUp.textContent = `TIER UP! ${got[got.length - 1] ?? ""}`.trim();
        tierUp.classList.add("ap-on");
        sound.flip("legendary", 2);
        confetti(sum, "legendary", 30, 0.8);
        fill.classList.add("ap-snap");
        fill.style.transform = "scaleX(0)";
        void fill.offsetWidth;
        fill.classList.remove("ap-snap");
        fill.style.transform = `scaleX(${after.progress})`;
      });
    } else {
      later(60, () => (fill.style.transform = `scaleX(${after.progress})`));
    }
    later(200, () => btn.focus({ preventScroll: true }));
  }

  let resolveClose!: () => void;
  const closed = new Promise<void>((r) => (resolveClose = r));

  function close(): void {
    if (phase === "closing") return;
    phase = "closing";
    clearTimers();
    clearInterval(idleShimmer);
    sound.close();
    root.classList.add("ap-out");
    removeEventListener("keydown", onKey, true);
    window.setTimeout(() => {
      root.remove();
      resolveClose();
    }, 240);
  }

  function tap(target: EventTarget | null): void {
    if (phase === "pack") return tear();
    if (phase === "reveal") return skip();
    if (phase !== "done") return;
    const slot = (target as HTMLElement | null)?.closest?.(".ap-slot") as HTMLElement | null;
    if (!slot) return;
    const c = cards[Number(slot.dataset.i)];
    if (c.kind !== "emote") return;
    const now = input.onEquip(c.id);
    slots.forEach((s, i) => s.classList.toggle("ap-is-equipped", cards[i].id === now));
    slot.classList.remove("ap-pop");
    void slot.offsetWidth;
    slot.classList.add("ap-pop");
    sound.newTag();
  }

  // the overlay owns input while open: nothing reaches the game underneath
  root.addEventListener("pointerdown", (e) => e.stopPropagation());
  root.addEventListener("pointerup", (e) => {
    e.stopPropagation();
    if ((e.target as HTMLElement).closest(".ap-btn")) return;
    tap(e.target);
  });
  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    close();
  });
  function onKey(e: KeyboardEvent): void {
    if (e.key === " " || e.key === "Enter" || e.key === "Escape") {
      e.preventDefault();
      e.stopPropagation();
      if (phase === "done") close();
      else if (e.key === "Escape") skip();
      else tap(null);
    }
  }
  addEventListener("keydown", onKey, true);

  // slow 3D tilt that follows the pointer, one style write per frame at most
  let raf = 0;
  let px = 0.5, py = 0.5;
  root.addEventListener("pointermove", (e) => {
    px = e.clientX / innerWidth;
    py = e.clientY / innerHeight;
    if (raf) return;
    raf = requestAnimationFrame(() => {
      raf = 0;
      tilt.style.setProperty("--ap-rx", `${((px - 0.5) * 16).toFixed(2)}deg`);
      tilt.style.setProperty("--ap-ry", `${((0.5 - py) * 10).toFixed(2)}deg`);
    });
  });

  return closed;
}
