// Lazy image cache for the generated art in public/art/.
const cache = new Map<string, HTMLImageElement>();

export function img(key: string): HTMLImageElement | null {
  let i = cache.get(key);
  if (!i) {
    i = new Image();
    i.src = `art/${key}.jpg`;
    cache.set(key, i);
  }
  return i.complete && i.naturalWidth > 0 ? i : null;
}
