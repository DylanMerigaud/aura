// The SHARE CARD (1080x1920, a story sized image): the black playground's warm pool, the result word, the
// three numbers, the rank and the opponent, drawn on a 2D canvas and shared as a PNG through Web Share
// (files), else downloaded. No WebGL read back: the card is drawn, so it works on every phone.
import type { LevelV2, Stats } from "../contracts";

export const CARD_W = 1080;
export const CARD_H = 1920;
const ACCENT = "#ffd400";

export interface CardData {
  stats: Stats;
  level: LevelV2;
  rank: string;
  url: string;
}

/** The lines on the card, pure (unit tested). */
export function cardLines(d: CardData): { word: string; numbers: [string, string][]; vs: string; rank: string } {
  const s = d.stats;
  return {
    word: s.win ? "AURA FARMED" : "HUMBLED",
    numbers: [
      ["SCORE", Math.round(s.score).toLocaleString("en-US")],
      ["ACCURACY", `${Math.round(s.accuracy * 100)}%`],
      ["BEST COMBO", String(s.maxCombo)],
    ],
    vs: `VS ${d.level.opponent.name.toUpperCase()}`,
    rank: d.rank.toUpperCase(),
  };
}

function text(g: CanvasRenderingContext2D, t: string, x: number, y: number, size: number, color: string, stroke = size / 10) {
  g.font = `900 ${size}px Anton, "Arial Black", Impact, sans-serif`;
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.lineJoin = "round";
  g.lineWidth = stroke;
  g.strokeStyle = "#000";
  g.strokeText(t, x, y);
  g.fillStyle = color;
  g.fillText(t, x, y);
}

export function drawShareCard(d: CardData, canvas: HTMLCanvasElement = document.createElement("canvas")): HTMLCanvasElement {
  canvas.width = CARD_W;
  canvas.height = CARD_H;
  const g = canvas.getContext("2d");
  if (!g) return canvas;
  const L = cardLines(d);
  g.fillStyle = "#000";
  g.fillRect(0, 0, CARD_W, CARD_H);
  // The warm white pool of light from above.
  const pool = g.createRadialGradient(CARD_W / 2, 1180, 40, CARD_W / 2, 1180, 760);
  pool.addColorStop(0, "rgba(255,244,220,0.55)");
  pool.addColorStop(0.55, "rgba(255,236,200,0.18)");
  pool.addColorStop(1, "rgba(0,0,0,0)");
  g.fillStyle = pool;
  g.fillRect(0, 0, CARD_W, CARD_H);
  g.strokeStyle = "rgba(255,255,255,0.8)";
  g.lineWidth = 6;
  g.beginPath();
  g.ellipse(CARD_W / 2, 1300, 420, 110, 0, 0, Math.PI * 2);
  g.stroke();

  text(g, "AURA", CARD_W / 2, 250, 230, "#fff", 18);
  text(g, L.word, CARD_W / 2, 560, L.word.length > 8 ? 130 : 160, d.stats.win ? ACCENT : "#fff", 14);
  const stars = "★".repeat(d.stats.stars) + "☆".repeat(3 - d.stats.stars);
  text(g, stars, CARD_W / 2, 720, 110, ACCENT, 8);
  L.numbers.forEach(([k, v], i) => {
    const x = CARD_W / 2 + (i - 1) * 330;
    text(g, v, x, 1180, 96, "#fff", 10);
    text(g, k, x, 1270, 38, "rgba(255,255,255,0.75)", 6);
  });
  text(g, L.vs, CARD_W / 2, 1520, 64, "#fff", 8);
  text(g, `RANK: ${L.rank}`, CARD_W / 2, 1620, 58, ACCENT, 8);
  text(g, d.url.replace(/^https?:\/\//, ""), CARD_W / 2, 1810, 40, "rgba(255,255,255,0.7)", 5);
  return canvas;
}

/** Share the card as a PNG file when the phone supports it, else download it. Resolves what happened. */
export async function shareCard(d: CardData): Promise<"shared" | "downloaded" | "failed"> {
  try {
    const c = drawShareCard(d);
    const blob = await new Promise<Blob | null>((res) => c.toBlob(res, "image/png"));
    if (!blob) return "failed";
    const file = new File([blob], "aura.png", { type: "image/png" });
    const nav = navigator as Navigator & { canShare?(data: ShareData): boolean };
    const data: ShareData = { files: [file], title: "AURA", text: `${cardLines(d).word} vs ${d.level.opponent.name}`, url: d.url };
    if (nav.share && nav.canShare?.(data)) {
      await nav.share(data);
      return "shared";
    }
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "aura.png";
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 4000);
    return "downloaded";
  } catch {
    return "failed";
  }
}

/** The card as a File for the results SHARE hook (src/v2/ui/results.ts setShareCard). */
export async function shareCardFile(d: CardData): Promise<File | null> {
  const c = drawShareCard(d);
  const blob = await new Promise<Blob | null>((res) => c.toBlob(res, "image/png"));
  return blob ? new File([blob], "aura.png", { type: "image/png" }) : null;
}
