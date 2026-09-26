// Calibrated residual input offset (seconds) on top of the browser's own output latency, stored in localStorage.

const KEY = "aura.latency.v2";

export function getOffset(): number {
  try {
    const v = localStorage.getItem(KEY);
    if (v !== null) return parseFloat(v) || 0;
  } catch { /* storage blocked */ }
  return 0;
}

export function setOffset(v: number) {
  try { localStorage.setItem(KEY, String(v)); } catch { /* storage blocked */ }
}
