// Entry point of lane D: every screen and the battle HUD, wired into one flow. main.ts creates
// the canvas, the stage and the game, calls startApp, registers the returned hud with
// game.listen, and drives the animation frame loop itself.
//
// The flow (addendum 16:15): LOADING (automatic, the current opponent fully preloaded), then the TITLE
// SCENE over the idling arena, whose first tap unlocks audio and starts the battle (the 4 beat count in
// is game.play's), then RESULTS. The title carries only small LOADOUT and SETTINGS corner buttons. The
// opponent sequence (addendum 16:40 point 3): a win moves to the next level, the roster loops with
// tighter windows each loop, a loss replays the same opponent; persisted in the progress store. The map,
// the VS card, the menu list and multiplayer are out of the flow (their modules stay, unreachable).
import type { GameApi, LevelV2, Listener, Stage, Stats } from "../contracts";
import { initAudio, ctx } from "../../audio/engine";
import { openPacks, setPackHooks } from "../../packs";
import { buildGate } from "./gate";
import { buildLoading } from "./loading";
import { trackSettled } from "./flow";
import { buildSettings } from "./settings";
import { buildLoadout } from "./loadout";
import { buildResults, setShareCard } from "./results";
import { shareCardFile } from "./sharecard";
import { playerRank } from "../xp";
import { buildHud } from "./hud/index";
import { bindBattleInput } from "./battleInput";
import { buildPlayZone } from "./playzone";
import { battleWindow, loadProgress, nextProgress, opponentSlot, saveProgress, type OpponentSlot } from "./progress";
import { buildBed } from "./bed";
import { liveListener } from "../../live/battle";
import { addXp, loadXp, saveXp, xpFor } from "../xp";
import cast from "../cast.json";

/** The battle starts without its fighters rather than wait longer than this on the models. */
const STAGE_WAIT_MS = 25000;
/** The loading screen gives up on a slow asset after this and shows the title scene anyway. */
const LOAD_WAIT_MS = 12000;

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
  /** The slot being fought (or last fought): RETRY replays it. */
  let slot = opponentSlot(progress.opp ?? 0, levels.length);
  let levelIdx = slot.index;

  const battleInput = bindBattleInput(canvas, game);
  const hudCtl = buildHud(base);
  const bed = buildBed(base);
  const zone = buildPlayZone(game);
  hudCtl.root.appendChild(zone.root);
  const handles = new Map((cast as { levels: { id: number; opponent?: { handle?: string } }[] }).levels.map((c) => [c.id, c.opponent?.handle]));
  const live = liveListener(hudCtl.root, () => handles.get(levels[levelIdx]?.id) ?? "@rival");
  // Battle keys are read by battleInput on window (capture phase), not through the screen switcher.
  const battle: ScreenCtl = { root: hudCtl.root };

  // Declared before anything calls stageLevel (preloadFirst runs synchronously from here).
  let staged: { level: LevelV2; ready: Promise<void> } | null = null;
  /** Bumped by every battle start: a battle whose number is no longer current never shows its results. */
  let battleGen = 0;
  const loading = buildLoading();
  const gate = buildGate(() => void startBattle(opponentSlot(progress.opp ?? 0, levels.length)), {
    loadout: () => openLoadout(goScene),
    settings: () => goSettings(),
  });
  const settings = buildSettings(() => goScene());
  let loadoutBack: () => void = () => goScene();
  const loadout = buildLoadout(() => loadoutBack(), base);
  setShareCard((stats, level) => shareCardFile({ stats, level, rank: playerRank(), url: location.href.split("?")[0] }));
  const results = buildResults({
    retry: () => void startBattle(slot),
    next: () => void startBattle(opponentSlot(progress.opp ?? 0, levels.length)),
    loadout: () => openLoadout(() => showScreen(results)),
    pack: (stats, level) => {
      setPackHooks({ audio: ctx ?? null });
      const seed = ((Date.now() >>> 0) ^ (level.id * 7919)) >>> 0;
      return openPacks(stats.win ? 3 : 1, seed).then(() => {});
    },
  });

  const screens: ScreenCtl[] = [loading, gate, settings, loadout, battle, results];
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

  /** The current opponent in full before the title scene: the set and fighters, the track and the voices.
   * The AudioContext is created now (suspended until the first tap) so the music decodes during loading. */
  async function preloadFirst() {
    const first = levels[slot.index] ?? levels[0];
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

  /** The title scene: the loaded stage idles behind the overlay, the next tap plays the current opponent. */
  function goScene() {
    bed.stop(0.4);
    gate.show();
    showScreen(gate);
  }

  function goSettings() {
    settings.show();
    showScreen(settings);
  }
  function openLoadout(back: () => void) {
    loadoutBack = back;
    loadout.show();
    showScreen(loadout);
  }
  // The stage builds the set and the fighters per level: started on the VS card, awaited by the battle,
  // dropped after each battle so a retry gets a fresh director.
  function stageLevel(l: LevelV2): Promise<void> {
    if (!staged || staged.level !== l) staged = { level: l, ready: stage.load(l).catch(() => {}) };
    return staged.ready;
  }

  function preloadLevel(l: LevelV2 | undefined) {
    if (!l) return;
    void stageLevel(l);
    void (game as GameApi & { preload?(l: LevelV2): Promise<unknown> | void }).preload?.(l);
  }

  async function startBattle(s: OpponentSlot) {
    // One battle at a time: the same tap seen twice (pointer down then click, a key and a click, a double
    // tap on RETRY) must not start a second game.play, whose quit() would orphan the first one.
    if (current === battle) return;
    const gen = ++battleGen;
    slot = s;
    levelIdx = s.index;
    const level = levels[levelIdx] ?? levels[0];
    hudCtl.prepare(level);
    showScreen(battle);
    battleInput.show();
    // The menu loop fades out across the count in bar: the kick and the level track take over.
    bed.stop((60 / level.bpm) * 4);
    await Promise.race([stageLevel(level), new Promise((r) => setTimeout(r, STAGE_WAIT_MS))]);
    if (gen !== battleGen) return;
    staged = null;
    const stats = await game.play(level, battleWindow(level, s));
    if (gen !== battleGen) return;
    battleInput.hide();
    finish(stats, level, s);
  }

  function finish(stats: Stats, level: LevelV2, s: OpponentSlot) {
    progress = nextProgress(
      progress,
      level.id,
      s.index,
      { score: stats.score, stars: stats.stars, accuracy: stats.accuracy, burst: stats.bestBurst },
      levels.length,
    );
    // A win moves the sequence on; a loss keeps the same opponent for RETRY.
    if (stats.win) progress = { ...progress, opp: s.opp + 1 };
    saveProgress(progress);
    const xpState = loadXp();
    const xp = addXp(xpState, xpFor(stats.score, stats.win));
    saveXp(xpState);
    const after = opponentSlot(s.opp + 1, levels.length);
    const nextLevel = levels[after.index];
    results.show(stats, level, {
      xp,
      nextOpponent: nextLevel ? { name: nextLevel.opponent?.name ?? nextLevel.title, locked: !stats.win, loop: after.loop } : null,
    });
    showScreen(results);
    if (stats.win) preloadLevel(nextLevel);
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
