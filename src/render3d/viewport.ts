// The one place the stage's sizes come from: the canvas's CSS box, the device pixel ratio and the adaptive
// quality step give the drawing buffer, the camera aspect and every render target size. Pure (no DOM, no GL)
// so the resize rules are unit tested: a landscape window gets a landscape buffer and target, a portrait one
// a portrait buffer, and a 0 x 0 canvas (hidden, not laid out yet) never yields a NaN aspect or a 0 target.

export interface StageSize {
  /** CSS pixels of the canvas box (at least 1). */
  cssW: number;
  cssH: number;
  /** Pixel ratio the renderer is set to. */
  pixelRatio: number;
  /** Drawing buffer in device pixels: what the canvas's width and height attributes become. */
  bufferW: number;
  bufferH: number;
  /** Camera aspect, always finite and positive. */
  aspect: number;
  /** Scene render target (and composite uRes): the drawing buffer's own size, full resolution. */
  targetW: number;
  targetH: number;
  /** False when the measured box was empty and the fallback size was used. */
  measured: boolean;
}

/** Pixel ratio cap: the device's, at most 2; quality step 1 and up drops it to 1. */
export function stagePixelRatio(dpr: number, qualityStep = 0): number {
  const d = Number.isFinite(dpr) && dpr > 0 ? dpr : 1;
  return qualityStep >= 1 ? 1 : Math.min(2, d);
}

const finitePos = (v: number): boolean => Number.isFinite(v) && v > 0;

/**
 * Sizes for a canvas box of `cssW` x `cssH` CSS pixels. An empty or invalid box falls back to
 * `fallbackW` x `fallbackH` (the window), then to 16:9 at 640 x 360, so the result is always usable.
 */
export function stageSize(
  cssW: number,
  cssH: number,
  dpr: number,
  qualityStep = 0,
  fallbackW = 0,
  fallbackH = 0,
): StageSize {
  let w = cssW;
  let h = cssH;
  let measured = true;
  if (!finitePos(w) || !finitePos(h)) {
    measured = false;
    w = finitePos(fallbackW) && finitePos(fallbackH) ? fallbackW : 640;
    h = finitePos(fallbackW) && finitePos(fallbackH) ? fallbackH : 360;
  }
  w = Math.max(1, Math.round(w));
  h = Math.max(1, Math.round(h));
  const pixelRatio = stagePixelRatio(dpr, qualityStep);
  // three's setSize(w, h, false) sets canvas.width = floor(w * pixelRatio): match it exactly.
  const bufferW = Math.max(1, Math.floor(w * pixelRatio));
  const bufferH = Math.max(1, Math.floor(h * pixelRatio));
  return { cssW: w, cssH: h, pixelRatio, bufferW, bufferH, aspect: w / h, targetW: bufferW, targetH: bufferH, measured };
}

/** True when the applied size no longer matches a fresh measure (a missed resize event): resize again. */
export function sizeChanged(a: StageSize | null, b: StageSize): boolean {
  return !a || a.bufferW !== b.bufferW || a.bufferH !== b.bufferH || a.cssW !== b.cssW || a.cssH !== b.cssH || a.pixelRatio !== b.pixelRatio;
}
