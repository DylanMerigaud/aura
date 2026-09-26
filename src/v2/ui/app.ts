// Entry point of lane D: every screen and the battle HUD, wired into one flow. main.ts creates
// the canvas, the stage and the game, calls startApp, registers the returned hud with
// game.listen, and drives the animation frame loop itself.
//
// The flow (addendum 15:20, one input to play): LOADING (automatic, level 1 fully preloaded) then
// the TITLE SCENE over the idling stage, whose first tap unlocks audio and starts the level 1
// battle (the 4 beat count in is game.play's), then RESULTS: RETRY (one input), PACK, MAP, SHARE.
// The menu (MENU corner button of the title scene) and the map (from the results) are never on
// the way in.
import type { GameApi, LevelV2, Listener, Stage } from "../contracts";
import { initAudio, ctx } from "../../audio/engine";
import { openPacks, setPackHooks } from "../../packs";
import { buildGate } from "./gate";
import { buildLoading } from "./loading";
import { trackSettled } from "./flow";
import { buildTitle } from "./title";
import { buildSettings } from "./settings";
import { buildMap } from "./map";
import { buildVsCard } from "./vscard";
import { buildLoadout } from "./loadout";
import { buildResults } from "./results";
import { buildHud } from "./hud/index";
import { bindBattleInput } from "./battleInput";
import { buildPlayZone } from "./playzone";
import { loadProgress, nextProgress, saveProgress } from "./progress";
import { buildBed } from "./bed";
import { liveListener } from "../../live/battle";
import cast from "../cast.json";

const WINDOW_SCALE = [1, 0.9, 0.8, 0.7, 0.6];
/** The battle starts without its fighters rather than wait longer than this on the models. */
const STAGE_WAIT_MS = 25000;
/** The loading screen gives up on a slow asset after this and shows the title scene anyway. */
const LOAD_WAIT_MS = 20000;

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
  const { game, stage, levels, base, canvas, debug } = opts;
  const uiRoot = document.getElementById("ui")!;
  if (debug) uiRoot.classList.add("debug");

  let progress = loadProgress();
  let levelIdx = 0;

  const battleInput = bindBattleInput(canvas, game);
  const hudCtl = buildHud(base);
  const bed = buildBed(base);
  const zone = buildPlayZone(game);
  hudCtl.root.appendChild(zone.root);
  const handles = new Map((cast as { levels: { id: number; opponent?: { handle?: string } }[] }).levels.map((c) => [c.id, c.opponent?.handle]));
  const live = liveListener(hudCtl.root, () => handles.get(levels[levelIdx]?.id) ?? "@rival");
  // Battle keys are read by battleInput on window (capture phase), not through the screen switcher.
  const battle: ScreenCtl = { root: hudCtl.root };

  const loading = buildLoading();
  const gate = buildGate(
    () => {
      levelIdx = 0;
      void startBattle();
    },
    () => goTitle(),
  );
  const title = buildTitle(levels, () => progress, {
    play: () => goMap(),
    settings: () => goSettings(),
    loadout: () => {
      loadout.show();
      showScreen(loadout);
    },
    back: () => goScene(),
  });
  const settings = buildSettings(() => goTitle());
  const map = buildMap(levels, base, () => progress, (i) => openVsCard(i));
  const vscard = buildVsCard(base, () => void startBattle());
  const loadout = buildLoadout(() => goTitle(), base);
  const results = buildResults({
    retry: () => void startBattle(),
    map: () => goMap(),
    pack: (stats, level) => {
      setPackHooks({ audio: ctx ?? null });
      const seed = ((Date.now() >>> 0) ^ (level.id * 7919)) >>> 0;
      return openPacks(stats.win ? 3 : 1, seed).then(() => {});
    },
  });

  const screens: ScreenCtl[] = [loading, gate, title, settings, map, vscard, loadout, battle, results];
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
  showScreen(loading);
  void preloadFirst();

  /** Level 1 in full before the title scene: the set and fighters, the track and the voices. The
   * AudioContext is created now (suspended until the first tap) so the music decodes during loading. */
  async function preloadFirst() {
    const first = levels[0];
    try {
      initAudio();
    } catch {
      /* no Web Audio: the track job fails fast and the battle runs on its visuals */
    }
    const jobs: Promise<unknown>[] = [stageLevel(first)];
    const pre = (game as GameApi & { preload?(l: LevelV2): Promise<unknown> | void }).preload?.(first);
    if (pre) jobs.push(pre);
    // Fonts are part of the look: the logo in Anton, not in the fallback face.
    const fonts = (document as Document & { fonts?: { ready: Promise<unknown> } }).fonts;
    if (fonts?.ready) jobs.push(fonts.ready);
    await trackSettled(jobs, (f) => loading.set(f), LOAD_WAIT_MS);
    loading.set(1);
    goScene();
  }

  /** The title scene: the loaded stage idles behind the overlay, the next tap plays level 1. */
  function goScene() {
    bed.stop(0.4);
    gate.show();
    showScreen(gate);
  }

  function goTitle() {
    bed.start();
    title.show();
    showScreen(title);
  }
  function goSettings() {
    settings.show();
    showScreen(settings);
  }
  function goMap() {
    bed.start();
    map.show();
    showScreen(map);
  }
  // The stage builds the set and the fighters per level: started on the VS card, awaited by the battle,
  // dropped after each battle so a retry gets a fresh director.
  let staged: { level: LevelV2; ready: Promise<void> } | null = null;
  function stageLevel(l: LevelV2): Promise<void> {
    if (!staged || staged.level !== l) staged = { level: l, ready: stage.load(l).catch(() => {}) };
    return staged.ready;
  }

  function openVsCard(i: number) {
    levelIdx = i;
    void stageLevel(levels[i]);
    void (game as GameApi & { preload?(l: LevelV2): Promise<unknown> | void }).preload?.(levels[i]);
    vscard.show(levels[i]);
    showScreen(vscard);
  }

  async function startBattle() {
    const level = levels[levelIdx];
    hudCtl.prepare(level);
    showScreen(battle);
    battleInput.show();
    // The menu loop fades out across the count in bar: the kick and the level track take over.
    bed.stop((60 / level.bpm) * 4);
    await Promise.race([stageLevel(level), new Promise((r) => setTimeout(r, STAGE_WAIT_MS))]);
    staged = null;
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
    results.show(stats, level);
    showScreen(results);
  }

  const hud: Listener = {
    event: (e) => {
      hudCtl.listener.event(e);
      live.event(e);
      zone.event(e);
    },
    frame: (f, dt) => {
      hudCtl.listener.frame?.(f, dt);
      live.frame?.(f, dt);
      zone.frame();
    },
  };
  return { hud };
}
