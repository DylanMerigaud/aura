// Shared jsdom helpers for the input tests: a root with known bounds, fake timers,
// and event factories that force a given timeStamp on synthesized events.
import { vi } from "vitest";
import { createInput, type Intent, type InputController, type InputOptions } from "../../src/input/index";

export const ROOT_WIDTH = 400;
export const ROOT_HEIGHT = 800;

export interface Harness {
  root: HTMLElement;
  input: InputController;
  intents: Intent[];
  destroy(): void;
}

export function makeHarness(options: Partial<InputOptions> = {}, width = ROOT_WIDTH, height = ROOT_HEIGHT): Harness {
  const root = document.createElement("div");
  document.body.appendChild(root);
  root.getBoundingClientRect = () =>
    ({ left: 0, top: 0, right: width, bottom: height, width, height, x: 0, y: 0, toJSON: () => ({}) }) as DOMRect;
  const intents: Intent[] = [];
  const input = createInput(root, {
    onIntent: (i) => intents.push({ kind: i.kind, direction: i.direction, t: i.t }),
    setTimeout: (fn, ms) => window.setTimeout(fn, ms),
    clearTimeout: (id) => window.clearTimeout(id),
    ...options,
  });
  return {
    root,
    input,
    intents,
    destroy() {
      input.destroy();
      root.remove();
    },
  };
}

function stamp<E extends Event>(e: E, t: number): E {
  Object.defineProperty(e, "timeStamp", { value: t, configurable: true });
  return e;
}

export interface PointerInit {
  id?: number;
  x?: number;
  y?: number;
  t?: number;
  type?: "touch" | "mouse" | "pen";
  button?: number;
}

export function pointer(target: EventTarget, name: string, init: PointerInit = {}): PointerEvent {
  const e = new PointerEvent(name, {
    pointerId: init.id ?? 1,
    pointerType: init.type ?? "touch",
    clientX: init.x ?? 0,
    clientY: init.y ?? 0,
    button: init.button ?? 0,
    bubbles: true,
    cancelable: true,
    isPrimary: true,
  });
  stamp(e, init.t ?? 0);
  target.dispatchEvent(e);
  return e;
}

export function key(target: EventTarget, name: "keydown" | "keyup", code: string, t: number, repeat = false): KeyboardEvent {
  const e = new KeyboardEvent(name, { code, key: code, repeat, bubbles: true, cancelable: true });
  stamp(e, t);
  target.dispatchEvent(e);
  return e;
}

/** A finger down at (x, y) and up at (x2, y2), advancing fake timers between. */
export function gesture(root: EventTarget, init: { id?: number; x: number; y: number; x2?: number; y2?: number; t0: number; t1: number }): void {
  const id = init.id ?? 1;
  pointer(root, "pointerdown", { id, x: init.x, y: init.y, t: init.t0 });
  const x2 = init.x2 ?? init.x;
  const y2 = init.y2 ?? init.y;
  if (x2 !== init.x || y2 !== init.y) pointer(root, "pointermove", { id, x: x2, y: y2, t: (init.t0 + init.t1) / 2 });
  vi.advanceTimersByTime(init.t1 - init.t0);
  pointer(root, "pointerup", { id, x: x2, y: y2, t: init.t1 });
}
