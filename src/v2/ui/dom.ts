// Tiny DOM builder helpers used across the v2 UI screens. No framework, no virtual DOM: the
// hackathon budget goes to the effects, not to plumbing.

export function el<K extends keyof HTMLElementTagNameMap>(tag: K, className?: string, text?: string): HTMLElementTagNameMap[K] {
  const n = document.createElement(tag);
  if (className) n.className = className;
  if (text !== undefined) n.textContent = text;
  return n;
}

/** Write a text only when it changed: the same string written again still replaces the text node and dirties layout. */
export function setText(n: Node, v: string) {
  if (n.textContent !== v) n.textContent = v;
}

export function clear(n: Element) {
  while (n.firstChild) n.removeChild(n.firstChild);
}

/** Restart a CSS animation or transition on a node that is reused across triggers: drop the
 * class, force a reflow, then re-add it (the standard trick, since re-adding the same class
 * name alone does not restart an already running animation). */
export function replay(n: HTMLElement, className: string) {
  n.classList.remove(className);
  void n.offsetWidth;
  n.classList.add(className);
}
