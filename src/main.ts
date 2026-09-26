// Entry point: canvas setup, the screen state machine (title, story, battle, results, calibration) and the frame loop.
import campaignData from "./campaign.json";
import type { Campaign, Level } from "./qte/types";
import { initAudio, ctx } from "./audio/engine";
import { loadVoices } from "./audio/voice";
import { sfx } from "./audio/sfx";
import { bindInput, type RawInput, type TouchMode } from "./qte/input";
import { Battle, type BattleStats } from "./game/battle";
import { W, H } from "./game/camera";
import { img } from "./game/assets";
import { setOffset, getOffset } from "./game/latency";
import { loadProgress, saveProgress, rank } from "./ui/progress";
import { text, cover, wrap } from "./ui/draw";
import { Particles } from "./game/particles";

const campaign = campaignData as unknown as Campaign;
const levels = campaign.levels;
const WINDOW_SCALE = [1, 0.9, 0.8, 0.7, 0.6];
const debug = new URLSearchParams(location.search).has("debug");

const canvas = document.getElementById("game") as HTMLCanvasElement;
const g = canvas.getContext("2d", { alpha: false })!;

function resize() {
  const dpr = Math.min(2, devicePixelRatio || 1);
  const s = Math.min(innerWidth / W, innerHeight / H);
  canvas.style.width = `${W * s}px`;
  canvas.style.height = `${H * s}px`;
  canvas.width = Math.round(W * s * dpr);
  canvas.height = Math.round(H * s * dpr);
}
addEventListener("resize", resize);
resize();

type Screen = "title" | "select" | "story" | "battle" | "results" | "calibrate";
let screen: Screen = "title";
let progress = loadProgress();
let levelIdx = 0;
let selIdx = 0;
let cringeMode = false;
let battle: Battle | null = null;
let last: BattleStats | null = null;
let screenT = 0;
let audioReady = false;

async function ensureAudio() {
  if (audioReady) return;
  initAudio();
  await ctx.resume();
  audioReady = true;
  loadVoices();
}

function startLevel(i: number) {
  levelIdx = i;
  screen = "story";
  screenT = 0;
  sfx.whoosh();
}

function beginBattle() {
  const lvl: Level = levels[levelIdx];
  const scale = (WINDOW_SCALE[levelIdx] ?? lvl.windowScale) * (cringeMode ? 0.5 : 1);
  battle = new Battle(lvl, scale, (s) => {
    last = s;
    if (s.win) {
      progress.unlocked = Math.max(progress.unlocked, Math.min(levels.length, levelIdx + 2));
      if (levelIdx === levels.length - 1) progress.cringeMode = true;
    }
    const prev = progress.best[lvl.id];
    const r = rank(s.counts, s.win);
    const order = "SABCDF";
    const bestRank = prev && order.indexOf(prev.rank) < order.indexOf(r) ? prev.rank : r;
    progress.best[lvl.id] = { score: Math.max(s.score, prev?.score ?? 0), combo: Math.max(s.maxCombo, prev?.combo ?? 0), rank: bestRank };
    saveProgress(progress);
    screen = "results";
    screenT = 0;
  });
  battle.start();
  screen = "battle";
}

// Calibration: 8 taps on a metronome, keep the median offset.
let calib: { t0: number; taps: number[]; spb: number } | null = null;
function startCalibration() {
  screen = "calibrate";
  const spb = 0.5;
  calib = { t0: ctx.currentTime + 0.5, taps: [], spb };
  for (let i = 0; i < 16; i++) sfx.tick(calib.t0 + i * spb, i % 4 === 0);
}

function onInput(i: RawInput) {
  if (screen === "battle" && battle) {
    if (i.kind === "dir") battle.input({ kind: "dir", dir: i.dir, t: i.at });
    else if (i.kind === "space") battle.input({ kind: "space", down: i.down, t: i.at });
    return;
  }
  const press = i.kind === "confirm" || (i.kind === "space" && i.down);
  ensureAudio().then(() => {
    if (screen === "title") {
      if (press) {
        sfx.snap();
        if (progress.unlocked > 1 || progress.cringeMode) { screen = "select"; selIdx = progress.unlocked - 1; }
        else startLevel(0);
      } else if (i.kind === "dir" && i.dir === "down") startCalibration();
    } else if (screen === "select") {
      const n = levels.length + (progress.cringeMode ? 1 : 0);
      if (i.kind === "dir") {
        if (i.dir === "left" || i.dir === "up") selIdx = (selIdx + n - 1) % n;
        if (i.dir === "right" || i.dir === "down") selIdx = (selIdx + 1) % n;
        sfx.tick();
      } else if (press) {
        if (selIdx === levels.length) { cringeMode = !cringeMode; sfx.scratch(); return; }
        if (selIdx < progress.unlocked) startLevel(selIdx);
        else sfx.thud();
      } else if (i.kind === "back") screen = "title";
    } else if (screen === "story") {
      if (press && screenT > 0.4) beginBattle();
    } else if (screen === "results") {
      if (!press || screenT < 0.8) return;
      if (last?.win && levelIdx + 1 < levels.length) startLevel(levelIdx + 1);
      else if (last?.win) { screen = "select"; selIdx = levels.length - 1; }
      else startLevel(levelIdx);
    } else if (screen === "calibrate" && calib) {
      if (i.kind === "space" && i.down) {
        const k = Math.round((i.at - calib.t0) / calib.spb);
        if (k >= 4) calib.taps.push(i.at - (calib.t0 + k * calib.spb));
        if (calib.taps.length >= 8) {
          const s = [...calib.taps].sort((a, b) => a - b);
          setOffset((s[3] + s[4]) / 2);
          sfx.snap();
          screen = "title";
        }
      } else if (i.kind === "back") screen = "title";
    }
  });
}

function touchMode(): TouchMode {
  if (screen === "battle" && battle) return battle.touchMode();
  if (screen === "calibrate") return "hold";
  return "menu";
}

bindInput(canvas, onInput, touchMode);
// Touch taps on menus arrive as "confirm"; a calibration tap arrives as space down.

// ---------------------------------------------------------------- drawing screens

const titleParts = new Particles(["#35e0ff", "#ff3df2", "#fff36b"]);
function drawTitle(t: number) {
  cover(g, img("title"), W, H, Math.sin(t * 0.3) * 20);
  g.fillStyle = "rgba(5,2,15,0.35)";
  g.fillRect(0, 0, W, H);
  // Two auras clashing under the logo.
  for (let i = 0; i < 3; i++) {
    titleParts.emit(W * 0.2 + Math.random() * 80, 560 + Math.random() * 60, 260 + Math.random() * 200, -60 - Math.random() * 120, 1.2, 40, 0);
    titleParts.emit(W * 0.8 - Math.random() * 80, 560 + Math.random() * 60, -260 - Math.random() * 200, -60 - Math.random() * 120, 1.2, 40, 1);
  }
  if (Math.random() < 0.3) titleParts.burst(W / 2, 480, 4, 200, 2, 30);
  titleParts.update(1 / 60);
  titleParts.draw(g);
  const pulse = 1 + Math.sin(t * 4) * 0.03;
  g.save();
  g.translate(W / 2, 250);
  g.scale(pulse, pulse);
  g.shadowColor = "#ff3df2";
  g.shadowBlur = 40;
  text(g, "AURA", 0, 0, "#fff", 190);
  g.shadowBlur = 0;
  g.restore();
  const won = levels.filter((L) => progress.best[L.id]?.rank && progress.best[L.id].rank !== "F");
  const title = won.length ? won[won.length - 1].title : null;
  text(g, title ? `current title: ${title}` : "you have zero aura. fix that.", W / 2, 380, "#35e0ff", 30, "center", 800);
  if (Math.sin(t * 5) > -0.3) text(g, "PRESS SPACE OR TAP", W / 2, 540, "#fff36b", 40);
  text(g, "arrows / WASD, SPACE    |    down arrow: latency calibration", W / 2, 670, "#ccc", 18, "center", 700);
}

function drawSelect(t: number) {
  cover(g, img(levels[Math.min(selIdx, levels.length - 1)].artKey), W, H, Math.sin(t * 0.3) * 20);
  g.fillStyle = "rgba(5,2,15,0.6)";
  g.fillRect(0, 0, W, H);
  text(g, "CAMPAIGN", W / 2, 70, "#fff", 56);
  const n = levels.length;
  const cw = 220;
  for (let i = 0; i < n; i++) {
    const L = levels[i];
    const x = W / 2 + (i - (n - 1) / 2) * (cw + 16);
    const locked = i >= progress.unlocked;
    const sel = i === selIdx;
    g.fillStyle = sel ? "rgba(255,61,242,0.35)" : "rgba(0,0,0,0.55)";
    g.strokeStyle = sel ? "#ff3df2" : "#444";
    g.lineWidth = sel ? 5 : 2;
    g.beginPath();
    g.roundRect(x - cw / 2, 150, cw, 380, 16);
    g.fill();
    g.stroke();
    const p = img(`opp-${L.artKey}`);
    if (p && !locked) g.drawImage(p, x - 90, 170, 180, 180);
    text(g, locked ? "LOCKED" : L.opponent.name, x, 380, locked ? "#666" : "#fff", 20);
    text(g, `LEVEL ${L.id}`, x, 415, "#35e0ff", 18);
    text(g, `${L.bpm} BPM`, x, 445, "#aaa", 16, "center", 700);
    const b = progress.best[L.id];
    if (b) {
      text(g, `${b.rank}  ${b.score}`, x, 480, "#fff36b", 20);
      text(g, `best combo ${b.combo}`, x, 508, "#ccc", 14, "center", 700);
    }
  }
  if (progress.cringeMode) {
    const sel = selIdx === n;
    text(g, `CRINGE MODE (half windows): ${cringeMode ? "ON" : "OFF"}`, W / 2, 590, sel ? "#ff4d6d" : "#aaa", sel ? 30 : 24);
  }
  text(g, "arrows to choose, SPACE to fight", W / 2, 660, "#ccc", 20, "center", 700);
}

function drawStory(t: number) {
  const L = levels[levelIdx];
  cover(g, img(L.artKey), W, H, -t * 10);
  g.fillStyle = "rgba(5,2,15,0.55)";
  g.fillRect(0, 0, W, H);
  g.fillStyle = "#000";
  g.fillRect(0, 0, W, 80);
  g.fillRect(0, H - 80, W, 80);
  const p = img(`opp-${L.artKey}`);
  const slide = Math.min(1, t * 2);
  if (p) {
    g.save();
    g.globalAlpha = slide;
    g.drawImage(p, W - 470 + (1 - slide) * 200, 130, 400, 400);
    g.restore();
  }
  text(g, `LEVEL ${L.id}  ${L.place.toUpperCase()}`, 80, 150, "#35e0ff", 26, "left");
  let y = wrap(g, L.story[0], 80, 205, 720, 27, "#fff");
  if (t > 0.6) y = wrap(g, L.story[1], 80, y + 4, 720, 22, "#ddd", 700);
  text(g, `VS ${L.opponent.name.toUpperCase()}`, 80, y + 40, L.opponent.color || "#ff3df2", 50, "left");
  wrap(g, L.opponent.persona, 80, y + 90, 720, 18, "#ccc", 700);
  if (t > 0.8 && Math.sin(t * 5) > -0.3) text(g, "SPACE / TAP TO FIGHT", 80, 612, "#fff36b", 30, "left");
}

function drawResults(t: number) {
  const L = levels[levelIdx];
  const s = last!;
  cover(g, img(L.artKey), W, H);
  g.fillStyle = s.win ? "rgba(10,20,40,0.72)" : "rgba(40,5,15,0.78)";
  g.fillRect(0, 0, W, H);
  text(g, s.win ? "VICTORY" : "YOU HAVE BEEN HUMBLED", W / 2, 110, s.win ? "#fff36b" : "#ff4d6d", s.win ? 90 : 64);
  if (s.win) text(g, `TITLE: ${L.title.toUpperCase()}`, W / 2, 190, "#35e0ff", 34);
  const r = rank(s.counts, s.win);
  text(g, r, 300, 400, r === "S" ? "#fff36b" : "#fff", 200);
  const rows: [string, string][] = [
    ["SCORE", String(Math.round(Math.min(1, t) * s.score))],
    ["BEST COMBO", String(s.maxCombo)],
    ["PERFECT", String(s.counts.perfect)],
    ["GREAT", String(s.counts.great)],
    ["OK", String(s.counts.ok)],
    ["MISS", String(s.counts.miss)],
    ["CRINGE", String(s.counts.cringe)],
  ];
  rows.forEach(([k, v], i) => {
    text(g, k, 560, 270 + i * 44, "#aaa", 26, "left");
    text(g, v, 1000, 270 + i * 44, "#fff", 28, "right");
  });
  if (t > 0.8) text(g, s.win ? (levelIdx + 1 < levels.length ? "SPACE: NEXT LEVEL" : "SPACE: PLAY AGAIN") : "SPACE: RETRY", W / 2, 640, "#fff36b", 34);
}

function drawCalibrate() {
  g.fillStyle = "#07040f";
  g.fillRect(0, 0, W, H);
  text(g, "LATENCY CALIBRATION", W / 2, 150, "#fff", 50);
  text(g, "tap SPACE on each click after the first four", W / 2, 240, "#35e0ff", 26, "center", 800);
  if (calib) {
    const beat = (ctx.currentTime - calib.t0) / calib.spb;
    const pulse = beat > 0 ? Math.exp(-(beat % 1) * 6) : 0;
    g.fillStyle = `rgba(255,243,107,${0.2 + pulse * 0.8})`;
    g.beginPath();
    g.arc(W / 2, 400, 60 + pulse * 20, 0, Math.PI * 2);
    g.fill();
    text(g, `${calib.taps.length} / 8`, W / 2, 540, "#fff", 40);
  }
  text(g, `current offset ${(getOffset() * 1000).toFixed(0)} ms    ESC to cancel`, W / 2, 640, "#aaa", 20, "center", 700);
}

// ---------------------------------------------------------------- loop

let prev = performance.now();
let fpsT = 0, fpsN = 0, fps = 0;
function frame(nowMs: number) {
  const dt = Math.min(0.05, (nowMs - prev) / 1000);
  prev = nowMs;
  screenT += dt;
  const sx = canvas.width / W;
  g.setTransform(sx, 0, 0, sx, 0, 0);
  if (screen === "battle" && battle) {
    battle.update(dt);
    battle.draw(g);
  } else if (screen === "title") drawTitle(screenT);
  else if (screen === "select") drawSelect(screenT);
  else if (screen === "story") drawStory(screenT);
  else if (screen === "results") drawResults(screenT);
  else if (screen === "calibrate") drawCalibrate();
  fpsN++;
  fpsT += dt;
  if (fpsT >= 0.5) { fps = fpsN / fpsT; fpsN = 0; fpsT = 0; }
  if (debug) text(g, `${fps.toFixed(0)} fps`, W - 20, 20, "#0f0", 16, "right", 700);
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
