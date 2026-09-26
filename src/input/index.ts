// Unified touch, mouse and keyboard input for the QTE layer.
//
// Raw DOM events on a root element are turned into game intents that carry the
// original event timeStamp (plus a calibration offset). The hot path allocates
// nothing beyond the intent handed to the listener, and that intent comes from a
// small pool: it is only valid for the duration of the callback.

export type Direction = "up" | "down" | "left" | "right";

export type IntentKind =
  | "hit"
  | "mashLeft"
  | "mashRight"
  | "release"
  | "holdStart"
  | "holdEnd"
  | "confirm"
  | "cancel";

export interface Intent {
  kind: IntentKind;
  /** Only set for `hit`. */
  direction: Direction | null;
  /** Event timeStamp in ms (same clock as `performance.now()`), calibration applied. */
  t: number;
}

export type IntentListener = (intent: Intent) => void;

export interface InputOptions {
  onIntent: IntentListener;
  /** Added to every emitted timestamp. Can be changed later on the controller. */
  calibrationOffsetMs?: number;
  /** Start enabled (default true). */
  enabled?: boolean;
  /** Where key events are read from. Defaults to `window`. */
  keyboardTarget?: EventTarget;
  /** Timer hooks, mainly for tests. Default to the global set/clearTimeout. */
  setTimeout?: (fn: () => void, ms: number) => number;
  clearTimeout?: (id: number) => void;
}

export interface InputController {
  enabled: boolean;
  calibrationOffsetMs: number;
  /** Re-read the root bounds. Called automatically on resize and orientation change. */
  refreshBounds(): void;
  destroy(): void;
}

export const SWIPE_MIN_PX = 24;
export const SWIPE_MAX_MS = 250;
export const HOLD_MS = 180;
export const HOLD_SLOP_PX = 12;
export const CENTER_FRACTION = 0.3;
export const KEY_DEBOUNCE_MS = 30;
export const MAX_POINTERS = 10;

const DIRECTION_KEYS: Readonly<Record<string, Direction>> = {
  ArrowUp: "up",
  ArrowDown: "down",
  ArrowLeft: "left",
  ArrowRight: "right",
  KeyW: "up",
  KeyS: "down",
  KeyA: "left",
  KeyD: "right",
};

const HANDLED_KEYS: Readonly<Record<string, true>> = {
  ArrowUp: true,
  ArrowDown: true,
  ArrowLeft: true,
  ArrowRight: true,
  KeyW: true,
  KeyA: true,
  KeyS: true,
  KeyD: true,
  Space: true,
  Enter: true,
  Escape: true,
};

/** Key code (or `key`) as reported by the event, tolerating jsdom and old browsers. */
function keyCode(e: KeyboardEvent): string {
  if (e.code) return e.code;
  switch (e.key) {
    case " ":
      return "Space";
    case "w":
    case "W":
      return "KeyW";
    case "a":
    case "A":
      return "KeyA";
    case "s":
    case "S":
      return "KeyS";
    case "d":
    case "D":
      return "KeyD";
    default:
      return e.key;
  }
}

interface PointerSlot {
  active: boolean;
  id: number;
  touch: boolean;
  x0: number;
  y0: number;
  x: number;
  y: number;
  t0: number;
  moved: boolean;
  holding: boolean;
  holdTimer: number;
  /** Prebound hold timer callback so a press allocates nothing. */
  fire: () => void;
}

class IntentPool {
  private readonly free: Intent[] = [];

  constructor(size: number) {
    for (let i = 0; i < size; i++) this.free.push({ kind: "hit", direction: null, t: 0 });
  }

  acquire(kind: IntentKind, direction: Direction | null, t: number): Intent {
    const intent = this.free.length > 0 ? this.free.pop()! : { kind, direction, t };
    intent.kind = kind;
    intent.direction = direction;
    intent.t = t;
    return intent;
  }

  recycle(intent: Intent): void {
    this.free.push(intent);
  }
}

export function createInput(root: HTMLElement, options: InputOptions): InputController {
  const onIntent = options.onIntent;
  const keyboardTarget: EventTarget = options.keyboardTarget ?? window;
  const setTimer = options.setTimeout ?? ((fn: () => void, ms: number) => window.setTimeout(fn, ms));
  const clearTimer = options.clearTimeout ?? ((id: number) => window.clearTimeout(id));

  const pool = new IntentPool(8);
  const slots: PointerSlot[] = [];
  for (let i = 0; i < MAX_POINTERS; i++) {
    const s: PointerSlot = {
      active: false,
      id: 0,
      touch: false,
      x0: 0,
      y0: 0,
      x: 0,
      y: 0,
      t0: 0,
      moved: false,
      holding: false,
      holdTimer: 0,
      fire: () => {
        s.holdTimer = 0;
        if (!s.active || s.moved || multiTouch) return;
        s.holding = true;
        emit("holdStart", null, s.t0 + HOLD_MS);
      },
    };
    slots.push(s);
  }
  const keyLastDown: Record<string, number> = {};
  const keyHeld: Record<string, boolean> = {};
  for (const k in HANDLED_KEYS) {
    keyLastDown[k] = -Infinity;
    keyHeld[k] = false;
  }

  let enabled = options.enabled ?? true;
  let offset = options.calibrationOffsetMs ?? 0;
  let destroyed = false;
  let left = 0;
  let width = 0;
  let activeCount = 0;
  let multiTouch = false;
  let multiMoved = false;
  let multiT0 = 0;
  let spaceHoldTimer = 0;
  let spaceHolding = false;
  let spaceT0 = 0;

  const emit = (kind: IntentKind, direction: Direction | null, rawT: number): void => {
    const intent = pool.acquire(kind, direction, rawT + offset);
    try {
      onIntent(intent);
    } finally {
      pool.recycle(intent);
    }
  };

  const refreshBounds = (): void => {
    const r = root.getBoundingClientRect();
    left = r.left;
    width = r.width;
  };

  const findSlot = (id: number): PointerSlot | null => {
    for (let i = 0; i < MAX_POINTERS; i++) {
      const s = slots[i];
      if (s.active && s.id === id) return s;
    }
    return null;
  };

  const freeSlot = (): PointerSlot | null => {
    for (let i = 0; i < MAX_POINTERS; i++) if (!slots[i].active) return slots[i];
    return null;
  };

  const releaseSlot = (s: PointerSlot): void => {
    if (s.holdTimer !== 0) {
      clearTimer(s.holdTimer);
      s.holdTimer = 0;
    }
    if (s.active) activeCount--;
    s.active = false;
    s.holding = false;
    s.moved = false;
    if (activeCount === 0) {
      multiTouch = false;
      multiMoved = false;
    }
  };

  const resetPointers = (): void => {
    for (let i = 0; i < MAX_POINTERS; i++) if (slots[i].active) releaseSlot(slots[i]);
  };

  const resetKeys = (): void => {
    if (spaceHoldTimer !== 0) {
      clearTimer(spaceHoldTimer);
      spaceHoldTimer = 0;
    }
    spaceHolding = false;
    for (const k in keyHeld) keyHeld[k] = false;
  };

  const cancelHoldTimer = (s: PointerSlot): void => {
    if (s.holdTimer !== 0) {
      clearTimer(s.holdTimer);
      s.holdTimer = 0;
    }
  };

  const onPointerDown = (e: PointerEvent): void => {
    if (!enabled) return;
    if (e.pointerType === "mouse" && e.button !== 0) return;
    e.preventDefault();
    if (findSlot(e.pointerId) !== null) return;
    const s = freeSlot();
    if (s === null) return;
    s.active = true;
    s.id = e.pointerId;
    s.touch = e.pointerType !== "mouse";
    s.x0 = s.x = e.clientX;
    s.y0 = s.y = e.clientY;
    s.t0 = e.timeStamp;
    s.moved = false;
    s.holding = false;
    activeCount++;
    if (typeof root.setPointerCapture === "function") {
      try {
        root.setPointerCapture(e.pointerId);
      } catch {
        // Capture is best effort: the pointer may already be gone.
      }
    }
    if (activeCount >= 2 && s.touch) {
      multiTouch = true;
      multiT0 = e.timeStamp;
      for (let i = 0; i < MAX_POINTERS; i++) if (slots[i].active) cancelHoldTimer(slots[i]);
      return;
    }
    s.holdTimer = setTimer(s.fire, HOLD_MS);
  };

  const onPointerMove = (e: PointerEvent): void => {
    if (!enabled) return;
    const s = findSlot(e.pointerId);
    if (s === null) return;
    s.x = e.clientX;
    s.y = e.clientY;
    if (!s.moved) {
      const dx = s.x - s.x0;
      const dy = s.y - s.y0;
      if (dx * dx + dy * dy >= HOLD_SLOP_PX * HOLD_SLOP_PX) {
        s.moved = true;
        if (multiTouch) multiMoved = true;
        if (!s.holding) cancelHoldTimer(s);
      }
    }
  };

  const onPointerUp = (e: PointerEvent): void => {
    if (!enabled) return;
    const s = findSlot(e.pointerId);
    if (s === null) return;
    const t = e.timeStamp;
    const dx = e.clientX - s.x0;
    const dy = e.clientY - s.y0;
    const holding = s.holding;
    const moved = s.moved;
    const wasMulti = multiTouch;
    releaseSlot(s);

    if (wasMulti) {
      if (activeCount === 0 && !multiMoved && !moved && t - multiT0 <= SWIPE_MAX_MS) emit("cancel", null, t);
      return;
    }
    if (holding) {
      emit("holdEnd", null, t);
      return;
    }
    const adx = dx < 0 ? -dx : dx;
    const ady = dy < 0 ? -dy : dy;
    if ((adx >= SWIPE_MIN_PX || ady >= SWIPE_MIN_PX) && t - s.t0 <= SWIPE_MAX_MS) {
      const dir: Direction = adx >= ady ? (dx < 0 ? "left" : "right") : dy < 0 ? "up" : "down";
      emit("hit", dir, t);
      return;
    }
    if (moved) return;
    if (width <= 0) refreshBounds();
    const fx = width > 0 ? (e.clientX - left) / width : 0.5;
    const half = CENTER_FRACTION / 2;
    if (fx >= 0.5 - half && fx <= 0.5 + half) emit("release", null, t);
    else if (fx < 0.5) emit("mashLeft", null, t);
    else emit("mashRight", null, t);
  };

  const onPointerCancel = (e: PointerEvent): void => {
    const s = findSlot(e.pointerId);
    if (s === null) return;
    const holding = s.holding;
    releaseSlot(s);
    if (holding && enabled) emit("holdEnd", null, e.timeStamp);
  };

  const fireSpaceHold = (): void => {
    spaceHoldTimer = 0;
    if (keyHeld.Space !== true) return;
    spaceHolding = true;
    emit("holdStart", null, spaceT0 + HOLD_MS);
  };

  const onKeyDown = (e: KeyboardEvent): void => {
    if (!enabled) return;
    const code = keyCode(e);
    if (HANDLED_KEYS[code] !== true) return;
    e.preventDefault();
    if (e.repeat) return;
    const t = e.timeStamp;
    if (t - keyLastDown[code] < KEY_DEBOUNCE_MS) return;
    keyLastDown[code] = t;
    if (keyHeld[code] === true) return;
    keyHeld[code] = true;

    const dir = DIRECTION_KEYS[code];
    if (dir !== undefined) {
      emit("hit", dir, t);
      if (dir === "left") emit("mashLeft", null, t);
      else if (dir === "right") emit("mashRight", null, t);
      return;
    }
    if (code === "Enter") {
      emit("confirm", null, t);
      return;
    }
    if (code === "Escape") {
      emit("cancel", null, t);
      return;
    }
    // Space: a short press is release, a long press is holdStart then holdEnd.
    spaceT0 = t;
    spaceHolding = false;
    spaceHoldTimer = setTimer(fireSpaceHold, HOLD_MS);
  };

  const onKeyUp = (e: KeyboardEvent): void => {
    const code = keyCode(e);
    if (HANDLED_KEYS[code] !== true) return;
    e.preventDefault();
    if (keyHeld[code] !== true) return;
    keyHeld[code] = false;
    if (code !== "Space") return;
    if (spaceHoldTimer !== 0) {
      clearTimer(spaceHoldTimer);
      spaceHoldTimer = 0;
    }
    if (!enabled) return;
    if (spaceHolding) {
      spaceHolding = false;
      emit("holdEnd", null, e.timeStamp);
    } else {
      emit("release", null, e.timeStamp);
    }
  };

  const prevent = (e: Event): void => {
    e.preventDefault();
  };

  const onBlur = (): void => {
    resetPointers();
    resetKeys();
  };

  root.style.touchAction = "none";
  root.style.userSelect = "none";
  // Older iOS Safari ignores touch-action for double tap zoom.
  root.style.setProperty("-webkit-user-select", "none");
  root.style.setProperty("-webkit-touch-callout", "none");
  refreshBounds();

  const active: AddEventListenerOptions = { passive: false };
  const passive: AddEventListenerOptions = { passive: true };
  root.addEventListener("pointerdown", onPointerDown, active);
  root.addEventListener("pointermove", onPointerMove, passive);
  root.addEventListener("pointerup", onPointerUp, passive);
  root.addEventListener("pointercancel", onPointerCancel, passive);
  root.addEventListener("touchend", prevent, active);
  root.addEventListener("dblclick", prevent, active);
  root.addEventListener("contextmenu", prevent, active);
  keyboardTarget.addEventListener("keydown", onKeyDown as EventListener, active);
  keyboardTarget.addEventListener("keyup", onKeyUp as EventListener, active);
  window.addEventListener("blur", onBlur);
  window.addEventListener("resize", refreshBounds);
  window.addEventListener("orientationchange", refreshBounds);

  return {
    get enabled() {
      return enabled;
    },
    set enabled(v: boolean) {
      if (enabled === v) return;
      enabled = v;
      if (!v) {
        resetPointers();
        resetKeys();
      }
    },
    get calibrationOffsetMs() {
      return offset;
    },
    set calibrationOffsetMs(v: number) {
      offset = v;
    },
    refreshBounds,
    destroy() {
      if (destroyed) return;
      destroyed = true;
      resetPointers();
      resetKeys();
      root.removeEventListener("pointerdown", onPointerDown);
      root.removeEventListener("pointermove", onPointerMove);
      root.removeEventListener("pointerup", onPointerUp);
      root.removeEventListener("pointercancel", onPointerCancel);
      root.removeEventListener("touchend", prevent);
      root.removeEventListener("dblclick", prevent);
      root.removeEventListener("contextmenu", prevent);
      keyboardTarget.removeEventListener("keydown", onKeyDown as EventListener);
      keyboardTarget.removeEventListener("keyup", onKeyUp as EventListener);
      window.removeEventListener("blur", onBlur);
      window.removeEventListener("resize", refreshBounds);
      window.removeEventListener("orientationchange", refreshBounds);
      root.style.touchAction = "";
    },
  };
}
