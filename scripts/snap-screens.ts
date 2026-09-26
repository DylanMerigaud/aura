// Drives the real main.ts headlessly (title, story, battle, results) with synthetic key events and saves frames.
import "./fake-env";
import { createCanvas } from "@napi-rs/canvas";
import { mkdirSync, writeFileSync } from "node:fs";

const g: any = globalThis;
const canvas: any = createCanvas(1280, 720);
canvas.style = {};
canvas.addEventListener = () => {};
canvas.getBoundingClientRect = () => ({ left: 0, top: 0, width: 1280, height: 720 });
const c2d = canvas.getContext("2d");
const draw = c2d.drawImage.bind(c2d);
c2d.drawImage = (im: any, ...a: any[]) => draw(im.img ?? im, ...a);
canvas.getContext = () => c2d;
const handlers: Record<string, ((e: any) => void)[]> = {};
g.document.getElementById = () => canvas;
g.addEventListener = (k: string, f: any) => (handlers[k] ??= []).push(f);
g.innerWidth = 1280;
g.innerHeight = 720;
g.devicePixelRatio = 1;
g.location = { search: "?debug=1" };
g.localStorage = { getItem: () => null, setItem: () => {} };
g.URLSearchParams = URLSearchParams;
let raf: ((t: number) => void) | null = null;
g.requestAnimationFrame = (f: any) => (raf = f);
let clock = 0;
g.performance = { now: () => clock * 1000 };

const { initAudio } = await import("../src/audio/engine");
const ctx: any = initAudio();
await import("../src/main");
mkdirSync(".cache/snap", { recursive: true });

const step = (sec: number, fps = 60) => {
  for (let i = 0; i < sec * fps; i++) {
    clock += 1 / fps;
    ctx.currentTime = clock;
    raf?.(clock * 1000);
  }
};
const key = async (code: string, type = "keydown") => {
  for (const h of handlers[type] ?? []) h({ code, timeStamp: clock * 1000, repeat: false, preventDefault() {} });
  await new Promise((r) => setTimeout(r, 5));
};
const shot = (name: string) => writeFileSync(`.cache/snap/screen-${name}.png`, canvas.toBuffer("image/png"));

step(1);
shot("title");
await key("Space");
step(1.5);
shot("story");
await key("Space");
step(4);
shot("battle-start");
step(45, 20);
step(1);
shot("results");
console.log("ok");
