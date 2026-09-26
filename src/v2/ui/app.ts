// Entry point of lane D: every screen and the battle HUD, wired into one flow. main.ts creates
// the canvas, the stage and the game, calls startApp, registers the returned hud with
// game.listen, and drives the animation frame loop itself.
import type { GameApi, LevelV2, Listener, Stage } from "../contracts";
import { buildGate } from "./gate";
import { buildTitle } from "./title";
import { buildSettings } from "./settings";
import { buildMap } from "./map";
import { buildVsCard } from "./vscard";
import { buildLoadout } from "./loadout";
import { buildResults } from "./results";
import { buildHud } from "./hud/index";
import { bindBattleInput } from "./battleInput";
import { loadProgress, nextProgress, saveProgress } from "./progress";

const WINDOW_SCALE = [1, 0.9, 0.8, 0.7, 0.6];

export interface StartOpts {
  game: GameApi;
  stage: Stage;
  levels: LevelV2[];
  base: string;
  debug: boolean;
  canvas: HTMLCanvasElement;
}

/** The minimal shape the screen switcher needs; each screen may carry its own, differently
 * shaped show(...) method beyond this, called directly by whoever navigates to it. */
interface ScreenCtl {
  root: HTMLElement;
  onKey?: (e: KeyboardEvent) => void;
  hide?: () => void;
}

export function startApp(opts: StartOpts): { hud: Listener } {
  const { game, levels, base, canvas, debug } = opts;
  const uiRoot = document.getElementById("ui")!;
  if (debug) uiRoot.classList.add("debug");

  let progress = loadProgress();
  let levelIdx = 0;
  let lastWin = false;

  const battleInput = bindBattleInput(canvas, game);
  const hudCtl = buildHud(base);
  const battle: ScreenCtl = { root: hudCtl.root, onKey: battleInput.onKey };

  const gate = buildGate(() => goTitle());
  const title = buildTitle(levels, () => progress, {
    play: () => goMap(),
    settings: () => goSettings(),
    loadout: () => showScreen(loadout),
  });
  const settings = buildSettings(() => goTitle());
  const map = buildMap(levels, base, () => progress, (i) => openVsCard(i));
  const vscard = buildVsCard(base, () => void startBattle());
  const loadout = buildLoadout(() => goTitle());
  const results = buildResults(() => afterResults());

  const screens: ScreenCtl[] = [gate, title, settings, map, vscard, loadout, battle, results];
  for (const s of screens) {
    s.root.classList.add("screen");
    uiRoot.appendChild(s.root);
  }

  let current: ScreenCtl | null = null;
  function showScreen(s: ScreenCtl) {
    if (current === s) return;
    current?.root.classList.remove("active");
    current?.hide?.();
    if (current === battle) battleInput.hide();
    current = s;
    s.root.classList.add("active");
  }

  addEventListener("keydown", (e) => current?.onKey?.(e));
  showScreen(gate);

  function goTitle() {
    title.show();
    showScreen(title);
  }
  function goSettings() {
    settings.show();
    showScreen(settings);
  }
  function goMap() {
    map.show();
    showScreen(map);
  }
  function openVsCard(i: number) {
    levelIdx = i;
    vscard.show(levels[i]);
    showScreen(vscard);
  }

  async function startBattle() {
    const level = levels[levelIdx];
    hudCtl.prepare(level);
    showScreen(battle);
    battleInput.show();
    const scale = WINDOW_SCALE[levelIdx] ?? 1;
    const stats = await game.play(level, scale);
    battleInput.hide();
    progress = nextProgress(
      progress,
      level.id,
      levelIdx,
      { score: stats.score, stars: stats.stars, accuracy: stats.accuracy, burst: stats.bestBurst },
      levels.length,
    );
    saveProgress(progress);
    lastWin = stats.win;
    results.show(stats, level);
    showScreen(results);
  }

  function afterResults() {
    if (lastWin) goMap();
    else void startBattle();
  }

  return { hud: hudCtl.listener };
}
