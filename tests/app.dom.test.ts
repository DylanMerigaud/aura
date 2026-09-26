// @vitest-environment jsdom
// The app flow in a DOM with a fake game: the title tap starts ONE battle even when the same tap arrives
// twice, the results card shows the Stats that game.play resolved with, a win moves the opponent on and
// adds XP, a loss keeps the same opponent for RETRY.
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../src/v2/net/live", () => ({ fetchRoast: () => Promise.resolve(null), speakLive: () => Promise.resolve(false) }));
vi.mock("../src/audio/engine", () => ({ initAudio: () => {}, ctx: null, heardTime: () => 0 }));
vi.mock("../src/packs", () => ({ openPacks: () => Promise.resolve(), setPackHooks: () => {} }));
vi.mock("../src/v2/ui/hud/index", () => ({
  buildHud: () => ({ root: document.createElement("div"), prepare: () => {}, listener: { event: () => {}, frame: () => {} } }),
}));
vi.mock("../src/live/battle", () => ({ liveListener: () => ({ event: () => {}, frame: () => {} }) }));
vi.mock("../src/v2/ui/playzone", () => ({ buildPlayZone: () => ({ root: document.createElement("div"), event: () => {}, frame: () => {} }) }));
vi.mock("../src/v2/ui/battleInput", () => ({ bindBattleInput: () => ({ show: () => {}, hide: () => {} }) }));
vi.mock("../src/v2/ui/bed", () => ({ buildBed: () => ({ start: () => {}, stop: () => {} }) }));
vi.mock("../src/v2/ui/loadout", () => ({
  buildLoadout: () => ({ root: document.createElement("section"), onKey: () => {}, show: () => {}, hide: () => {} }),
}));

import { startApp } from "../src/v2/ui/app";
import type { GameApi, LevelV2, Stage, Stats } from "../src/v2/contracts";
import { loadProgress } from "../src/v2/ui/progress";
import { loadXp } from "../src/v2/xp";

const lvl = (id: number, name: string) =>
  ({ id, title: `t${id}`, place: "ARENA", bpm: 120, windowScale: 1, opponent: { name, persona: "", color: "#fff" }, announcer: { win: "w", lose: "l" } }) as unknown as LevelV2;
const LEVELS = [lvl(1, "The Boat Kid"), lvl(2, "The Turnstile Ninja")];
const stats = (win: boolean, score: number): Stats => ({
  win, ko: false, score, maxCombo: 3, counts: { perfect: 0, great: 1, ok: 0, miss: 0, cringe: 0 }, accuracy: 0.7, bestBurst: 0, stars: win ? 1 : 0, meter: 0,
});
const flush = () => new Promise((r) => setTimeout(r, 0));

function setup() {
  document.body.innerHTML = '<div id="ui"></div>';
  const resolvers: ((s: Stats) => void)[] = [];
  const play = vi.fn((_l: LevelV2, _w: number) => new Promise<Stats>((r) => resolvers.push(r)));
  const game = { play, quit: vi.fn(), input: vi.fn(), pause: vi.fn(), resume: vi.fn(), tick: vi.fn(), touchMode: () => "none", running: () => false } as unknown as GameApi;
  const stage = { load: () => Promise.resolve() } as unknown as Stage;
  startApp({ game, stage, levels: LEVELS, base: "", debug: false, canvas: document.createElement("canvas") });
  return { play, resolvers };
}
const q = (s: string) => document.querySelector(s) as HTMLElement;

describe("app flow", () => {
  beforeEach(() => localStorage.clear());

  it("loading, title, one battle per tap, the card shows the resolved stats, a win moves on", async () => {
    const { play, resolvers } = setup();
    for (let i = 0; i < 5; i++) await flush();
    expect(q(".gate").classList.contains("active")).toBe(true);
    expect(document.body.textContent).not.toMatch(/multiplayer|world tour/i);
    q(".gate").dispatchEvent(new Event("pointerdown", { bubbles: true }));
    q(".gate").dispatchEvent(new MouseEvent("click", { bubbles: true }));
    for (let i = 0; i < 3; i++) await flush();
    expect(play).toHaveBeenCalledTimes(1);
    expect(play.mock.calls[0][0].id).toBe(1);
    resolvers[0](stats(true, 200));
    await flush();
    expect(q(".results").classList.contains("active")).toBe(true);
    expect(q(".rc-num.score .rc-val").textContent).toBe("200");
    expect(q(".results-btn.retry").textContent).toBe("NEXT");
    expect(q(".rc-next-name").textContent).toBe("THE TURNSTILE NINJA");
    expect(loadProgress().opp).toBe(1);
    expect(loadXp().xp).toBe(1200);
  });

  it("a loss keeps the same opponent; the roster loops with a tighter window", async () => {
    localStorage.setItem("aura.v2.progress", JSON.stringify({ unlocked: 2, best: {}, opp: 3 }));
    const { play, resolvers } = setup();
    for (let i = 0; i < 5; i++) await flush();
    q(".gate").dispatchEvent(new Event("pointerdown", { bubbles: true }));
    for (let i = 0; i < 3; i++) await flush();
    expect(play.mock.calls[0][0].id).toBe(2);
    expect(play.mock.calls[0][1]).toBeCloseTo(0.9);
    resolvers[0](stats(false, 50));
    await flush();
    expect(q(".results-heading").textContent).toBe("HUMBLED");
    expect(loadProgress().opp).toBe(3);
    expect(q(".rc-next").classList.contains("locked")).toBe(true);
  });
});
