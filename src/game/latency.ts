// Input latency offset: calibrated value from localStorage, else the audio output latency reported by the browser.
import { ctx } from "../audio/engine";

const KEY = "aura.latency";

export function getOffset(): number {
  try {
    const v = localStorage.getItem(KEY);
    if (v !== null) return parseFloat(v);
  } catch { /* storage blocked */ }
  return (ctx?.outputLatency || 0) + (ctx?.baseLatency || 0);
}

export function setOffset(v: number) {
  try { localStorage.setItem(KEY, String(v)); } catch { /* storage blocked */ }
}
