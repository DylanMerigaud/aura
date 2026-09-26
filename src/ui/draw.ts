// Shared canvas text and panel helpers for the menus.
export function text(g: CanvasRenderingContext2D, s: string, x: number, y: number, color: string, size: number, align: CanvasTextAlign = "center", weight = 900) {
  g.font = `${weight} ${size}px "Arial Black", Impact, sans-serif`;
  g.textAlign = align;
  g.textBaseline = "middle";
  g.lineWidth = Math.max(3, size / 7);
  g.strokeStyle = "#000";
  g.lineJoin = "round";
  g.strokeText(s, x, y);
  g.fillStyle = color;
  g.fillText(s, x, y);
}

export function cover(g: CanvasRenderingContext2D, im: HTMLImageElement | null, W: number, H: number, drift = 0) {
  if (im) g.drawImage(im, -40 + drift, -20, W + 80, H + 40);
  else {
    const grd = g.createLinearGradient(0, 0, W, H);
    grd.addColorStop(0, "#2a0845");
    grd.addColorStop(1, "#05020a");
    g.fillStyle = grd;
    g.fillRect(0, 0, W, H);
  }
}

/** Word-wrapped text; returns the y after the last line. */
export function wrap(g: CanvasRenderingContext2D, s: string, x: number, y: number, maxW: number, size: number, color: string, weight = 800): number {
  g.font = `${weight} ${size}px "Arial Black", Impact, sans-serif`;
  const words = s.split(" ");
  let line = "";
  for (const w of words) {
    const t = line ? `${line} ${w}` : w;
    if (g.measureText(t).width > maxW && line) {
      text(g, line, x, y, color, size, "left", weight);
      y += size * 1.25;
      line = w;
    } else line = t;
  }
  if (line) text(g, line, x, y, color, size, "left", weight);
  return y + size * 1.25;
}
