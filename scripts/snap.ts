// Renders key battle frames headlessly with @napi-rs/canvas (fake audio clock) into .cache/snap/*.png for visual review.
import { createCanvas } from "@napi-rs/canvas";
import { readFileSync, mkdirSync } from "node:fs";

import "./fake-env";

const { initAudio } = await import("../src/audio/engine");
const ctx = initAudio();
const { Battle } = await import("../src/game/battle");
const campaign = JSON.parse(readFileSync("src/campaign.json", "utf8"));
const levelIdx = Number(process.argv[2] ?? 0);
const level = campaign.levels[levelIdx];
mkdirSync(".cache/snap", { recursive: true });

const canvas = createCanvas(1280, 720);
const c = canvas.getContext("2d") as any;
// Unwrap stand-in images so drawImage receives real napi images.
const draw = c.drawImage.bind(c);
c.drawImage = (im: any, ...a: any[]) => draw(im.img ?? im, ...a);

const b = new Battle(level, 1, () => {});
b.start();
const spb = 60 / level.bpm;
const shots: [string, number, (bt: any) => void][] = [
  ["countin", -1.5 * spb, () => {}],
  ["hit", level.events[0].beat * spb - 0.6 * spb, () => {}],
  ["mash", 0, () => {}],
  ["taunt", level.taunts[1].beat * spb + 0.3, () => {}],
];
const mash = level.events.find((e: any) => e.type === "mash");
if (mash) shots[2][1] = (mash.beat + mash.length * 0.6) * spb;
if (mash) shots.push(["release", (mash.beat + mash.length) * spb + 0.25, () => {}]);
shots.push(["end", (level.lengthBeats + 1) * spb + 0.6, () => {}]);
shots.sort((a, b) => a[1] - b[1]);
let t = -4 * spb;
for (const [name, at] of shots) {
  while (t < at) {
    t += 1 / 60;
    (ctx as any).currentTime = b.music.t0 + t;
    // Simulate a mashing player during the MASH.
    const cur = b.runner.current();
    if (cur && cur.ev.type === "mash" && Math.random() < 0.4) b.input({ kind: "dir", dir: Math.random() < 0.5 ? "left" : "right", t: (ctx as any).currentTime });
    else if (cur && cur.ev.type === "hit" && Math.abs(t - cur.ev.beat * spb) < 0.01) b.input({ kind: "dir", dir: cur.ev.dir, t: (ctx as any).currentTime });
    if (cur && cur.ev.type === "mash" && Math.abs(t - (cur.ev.beat + cur.ev.length) * spb) < 0.01) b.input({ kind: "space", down: true, t: (ctx as any).currentTime });
    if (cur && cur.ev.type === "hold" && Math.abs(t - cur.ev.beat * spb) < 0.01) b.input({ kind: "space", down: true, t: (ctx as any).currentTime });
    if (cur && cur.ev.type === "hold" && Math.abs(t - (cur.ev.beat + cur.ev.length) * spb) < 0.01) b.input({ kind: "space", down: false, t: (ctx as any).currentTime });
    if (cur && cur.ev.type === "combo") {
      const n = cur.ev.dirs.length;
      for (let i = 0; i < n; i++) if (Math.abs(t - (cur.ev.beat - (n - 1 - i) * 0.5) * spb) < 0.009) b.input({ kind: "dir", dir: cur.ev.dirs[i], t: (ctx as any).currentTime });
    }
    b.update(1 / 60);
  }
  b.draw(c);
  const out = `.cache/snap/l${level.id}-${name}.png`;
  (await import("node:fs")).writeFileSync(out, canvas.toBuffer("image/png"));
  console.log(out);
}
