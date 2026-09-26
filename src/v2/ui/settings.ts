// Settings: latency calibration (the v1 flow in src/main.ts, on src/game/latency.ts), a volume
// slider on the master bus, and a static controls list. Up/down move the selection, left/right
// adjust the volume, enter confirms, escape backs out (also cancels a running calibration).
import { ctx, heardTime, master } from "../../audio/engine";
import { sfx } from "../../audio/sfx";
import { getOffset, setOffset } from "../../game/latency";
import { el } from "./dom";

const VOLUME_KEY = "aura.v2.volume";

function loadVolume(): number {
  try {
    const v = localStorage.getItem(VOLUME_KEY);
    if (v !== null) return Math.min(1, Math.max(0, parseFloat(v)));
  } catch {
    /* blocked */
  }
  return 0.9;
}

function saveVolume(v: number) {
  try {
    localStorage.setItem(VOLUME_KEY, String(v));
  } catch {
    /* blocked */
  }
}

export function buildSettings(onBack: () => void) {
  const root = el("section", "screen settings");
  root.appendChild(el("h2", "screen-title", "SETTINGS"));

  const list = el("div", "menu");
  root.appendChild(list);

  const calibItem = el("button", "menu-item");
  calibItem.type = "button";
  calibItem.appendChild(el("span", "label", "LATENCY CALIBRATION"));
  const calibHint = el("span", "hint", `offset ${(getOffset() * 1000).toFixed(0)} ms`);
  calibItem.appendChild(calibHint);
  list.appendChild(calibItem);

  const volItem = el("button", "menu-item");
  volItem.type = "button";
  volItem.appendChild(el("span", "label", "VOLUME"));
  const volBar = el("span", "hint volume-bar");
  const volFill = el("span", "volume-fill");
  volBar.appendChild(volFill);
  volItem.appendChild(volBar);
  list.appendChild(volItem);

  const backItem = el("button", "menu-item");
  backItem.type = "button";
  backItem.appendChild(el("span", "label", "BACK"));
  backItem.appendChild(el("span", "hint", "to the title"));
  list.appendChild(backItem);

  const items = [calibItem, volItem, backItem];
  let idx = 0;
  let volume = loadVolume();

  function paintVolume() {
    volFill.style.width = `${Math.round(volume * 100)}%`;
  }
  function applyVolume() {
    if (master) master.gain.value = volume;
    saveVolume(volume);
    paintVolume();
  }
  function setVolume(v: number) {
    volume = Math.min(1, Math.max(0, v));
    applyVolume();
  }

  const controls = el("div", "controls-list");
  controls.appendChild(el("p", "controls-row", "arrows or WASD: move / direction"));
  controls.appendChild(el("p", "controls-row", "space: hold, mash release"));
  controls.appendChild(el("p", "controls-row", "enter: confirm, escape: back"));
  controls.appendChild(el("p", "controls-row", "touch: tap edges for hit, halves for mash, hold anywhere, swipe for direction"));
  root.appendChild(controls);

  function paint() {
    items.forEach((it, i) => it.classList.toggle("selected", i === idx));
  }

  // ---------------------------------------------------------------- calibration
  let calib: { t0: number; taps: number[]; spb: number } | null = null;
  const calibOverlay = el("div", "calibrate-overlay hidden");
  const calibPulse = el("div", "calibrate-pulse");
  const calibCount = el("p", "calibrate-count", "0 / 8");
  calibOverlay.appendChild(el("h2", "screen-title", "LATENCY CALIBRATION"));
  calibOverlay.appendChild(el("p", "subtitle", "tap SPACE on each click after the first four"));
  calibOverlay.appendChild(calibPulse);
  calibOverlay.appendChild(calibCount);
  root.appendChild(calibOverlay);

  let pulseTimer: ReturnType<typeof requestAnimationFrame> | null = null;
  function pulseLoop() {
    if (!calib) return;
    const beat = (heardTime() - calib.t0) / calib.spb;
    const k = beat > 0 ? Math.exp(-(beat % 1) * 6) : 0;
    calibPulse.style.transform = `scale(${1 + k * 0.5})`;
    calibPulse.style.opacity = String(0.3 + k * 0.7);
    pulseTimer = requestAnimationFrame(pulseLoop);
  }

  function startCalibration() {
    calibOverlay.classList.remove("hidden");
    const spb = 0.5;
    calib = { t0: ctx.currentTime + 0.5, taps: [], spb };
    for (let i = 0; i < 16; i++) sfx.tick(calib.t0 + i * spb, i % 4 === 0);
    calibCount.textContent = "0 / 8";
    pulseLoop();
  }

  function endCalibration() {
    calib = null;
    if (pulseTimer !== null) cancelAnimationFrame(pulseTimer);
    pulseTimer = null;
    calibOverlay.classList.add("hidden");
  }

  function calibTap(at: number) {
    if (!calib) return;
    const k = Math.round((at - calib.t0) / calib.spb);
    if (k >= 4 && k < 16) calib.taps.push(at - (calib.t0 + k * calib.spb));
    calibCount.textContent = `${calib.taps.length} / 8`;
    if (calib.taps.length >= 8) {
      const s = [...calib.taps].sort((a, b) => a - b);
      setOffset((s[3] + s[4]) / 2);
      calibHint.textContent = `offset ${(getOffset() * 1000).toFixed(0)} ms`;
      sfx.snap();
      endCalibration();
    }
  }
  calibOverlay.addEventListener("pointerdown", (e) => calibTap(heardTime(e.timeStamp)));

  function confirm() {
    if (items[idx] === calibItem) {
      sfx.snap();
      startCalibration();
    } else if (items[idx] === backItem) {
      sfx.snap();
      onBack();
    }
  }

  function onKey(e: KeyboardEvent) {
    if (calib) {
      if (e.code === "Space") {
        e.preventDefault();
        calibTap(heardTime());
      } else if (e.code === "Escape") endCalibration();
      return;
    }
    if (e.code === "ArrowDown") {
      idx = (idx + 1) % items.length;
      sfx.tick();
      paint();
    } else if (e.code === "ArrowUp") {
      idx = (idx - 1 + items.length) % items.length;
      sfx.tick();
      paint();
    } else if (e.code === "ArrowRight" && items[idx] === volItem) setVolume(volume + 0.1);
    else if (e.code === "ArrowLeft" && items[idx] === volItem) setVolume(volume - 0.1);
    else if (e.code === "Enter" || e.code === "Space") confirm();
    else if (e.code === "Escape") onBack();
  }

  calibItem.addEventListener("click", () => {
    idx = 0;
    paint();
    confirm();
  });
  backItem.addEventListener("click", () => {
    idx = items.length - 1;
    paint();
    confirm();
  });
  volItem.addEventListener("click", () => setVolume(volume >= 0.95 ? 0 : volume + 0.2));

  paintVolume();
  paint();
  return {
    root,
    onKey,
    show() {
      endCalibration();
      idx = 0;
      applyVolume();
      calibHint.textContent = `offset ${(getOffset() * 1000).toFixed(0)} ms`;
      paint();
    },
    hide() {
      endCalibration();
    },
  };
}
