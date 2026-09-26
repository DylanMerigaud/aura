// AURA v2 entry: the WebGL stage, the battle driver, the audio layers and the DOM app, one frame loop.
import { createStage } from "../render3d/stage";
import { runDemo } from "../render3d/demo";
import { AudioFx } from "../audio/layers";
import { ctx, wake } from "../audio/engine";
import { startApp } from "./ui/app";
import { Game } from "./game";
import { LEVELS_V2 } from "./levels";
import { trackInfo } from "./tracks";
import type { CoreEvent, Frame } from "./contracts";

const params = new URLSearchParams(location.search);
const debug = params.has("debug");
// Shared media (music, models, art, voice) sits next to the v1 build: one level up from /v2/.
const base = /\/v2\/?/.test(location.pathname) ? "../" : "";

const canvas = document.getElementById("stage") as HTMLCanvasElement;
const stage = createStage(canvas, { base, debug });
addEventListener("resize", () => stage.resize());
// iOS suspends or interrupts the context (calls, lock screen, app switch): any gesture or coming back resumes it.
addEventListener("pointerdown", wake);
addEventListener("keydown", wake);
document.addEventListener("visibilitychange", () => {
  if (!document.hidden) wake();
});

// The audio layers need a running AudioContext: created on the first battle, after the tap to start.
let fx: AudioFx | null = null;
const audioFx = () => (fx ??= new AudioFx());

const game = new Game({
  base,
  trackInfo,
  musicIn: () => audioFx().musicIn,
  countIn: (at, n) => audioFx().countIn(at, n),
  stopAll: () => fx?.stopAll(),
});
game.listen(stage);
game.listen({
  event: (e: CoreEvent) => fx?.event(e),
  frame: (f: Frame, dt: number) => fx?.frame(f, dt),
});

if (params.has("demo")) runDemo(stage);
else {
  const { hud } = startApp({ game, stage, levels: LEVELS_V2, base, debug, canvas });
  game.listen(hud);
}

let prev = performance.now();
function loop(now: number) {
  requestAnimationFrame(loop);
  const dt = Math.min(0.05, (now - prev) / 1000);
  prev = now;
  if (params.has("demo")) return;
  if (game.running() && ctx) game.tick(dt);
  else stage.idle(dt);
}
requestAnimationFrame(loop);
