// Balance sim: plays every level with bots of different skill through the real Battle code and prints who wins.
import "./fake-env";
import { readFileSync } from "node:fs";

const { initAudio } = await import("../src/audio/engine");
const ctx: any = initAudio();
const { Battle } = await import("../src/game/battle");
const levels = JSON.parse(readFileSync("src/campaign.json", "utf8")).levels;
const SCALE = [1, 0.9, 0.8, 0.7, 0.6];

// sigma: timing error std dev in seconds; miss: chance to skip an event; mashHz: alternations per second.
const BOTS = { pro: { sigma: 0.02, miss: 0.02, mashHz: 12 }, good: { sigma: 0.045, miss: 0.08, mashHz: 9 }, casual: { sigma: 0.07, miss: 0.2, mashHz: 6 }, bad: { sigma: 0.1, miss: 0.35, mashHz: 4 } };
const gauss = () => Math.sqrt(-2 * Math.log(Math.random() + 1e-9)) * Math.cos(2 * Math.PI * Math.random());

for (const [name, bot] of Object.entries(BOTS)) {
  const row: string[] = [];
  for (let li = 0; li < levels.length; li++) {
    const L = levels[li];
    let wins = 0, meterSum = 0;
    for (let rep = 0; rep < 6; rep++) {
    let stats: any = null;
    const b = new Battle(L, SCALE[li], (s) => (stats = s));
    b.start();
    const spb = 60 / L.bpm;
    const t0 = b.music.t0;
    const plan = new Map<number, { t: number; do: () => void }[]>();
    const at = (t: number, f: () => void) => {
      const k = Math.round(t * 60);
      if (!plan.has(k)) plan.set(k, []);
      plan.get(k)!.push({ t, do: f });
    };
    const inp = (i: any) => b.input(i);
    for (const ev of L.events) {
      if (Math.random() < bot.miss) continue;
      const T = ev.beat * spb;
      const e = () => gauss() * bot.sigma;
      if (ev.type === "hit") { const t = T + e(); at(t, () => inp({ kind: "dir", dir: ev.dir, t: t0 + t })); }
      else if (ev.type === "hold") {
        const a = T + e(), r = T + ev.length * spb + e();
        at(a, () => inp({ kind: "space", down: true, t: t0 + a }));
        at(r, () => inp({ kind: "space", down: false, t: t0 + r }));
      } else if (ev.type === "combo") {
        ev.dirs.forEach((d: string, i: number) => { const t = T - (ev.dirs.length - 1 - i) * spb * 0.5 + (i === ev.dirs.length - 1 ? e() : 0); at(t, () => inp({ kind: "dir", dir: d, t: t0 + t })); });
      } else if (ev.type === "mash") {
        const R = T + ev.length * spb;
        let k = 0;
        for (let t = T; t < R - 0.05; t += 1 / bot.mashHz) { const tt = t, d = k++ % 2 ? "right" : "left"; at(tt, () => inp({ kind: "dir", dir: d, t: t0 + tt })); }
        const r = R + e();
        at(r, () => inp({ kind: "space", down: true, t: t0 + r }));
      }
    }
    for (let f = -300; f < (L.lengthBeats + 12) * spb * 60 && !stats; f++) {
      ctx.currentTime = t0 + f / 60;
      for (const x of plan.get(f) ?? []) x.do();
      b.update(1 / 60);
    }
    const s = stats ?? { win: false, meter: b.meter };
    wins += s.win ? 1 : 0;
    meterSum += s.meter;
    }
    row.push(`L${L.id}: ${wins}/6 ${(meterSum / 6).toFixed(2).padStart(5)}`);
  }
  console.log(name.padEnd(7), row.join("  "));
}
