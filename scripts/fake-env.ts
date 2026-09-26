// Headless stand-ins for the DOM and Web Audio so the real battle code runs in Node (snapshots and balance sims).
import { createCanvas, loadImage } from "@napi-rs/canvas";
import { readdirSync } from "node:fs";

// Decode every art file up front so the first frames already have their images.
const art = new Map<string, any>();
for (const f of readdirSync("public/art")) art.set(`art/${f}`, await loadImage(`public/art/${f}`));

// Minimal DOM and Web Audio stand-ins: every audio node is an inert proxy, the clock is driven by hand.
const inert: any = new Proxy(function () {}, { get: (_t, k) => (k === Symbol.toPrimitive ? () => 0 : inert), apply: () => inert, set: () => true });
class FakeAudioContext {
  currentTime = 0;
  sampleRate = 44100;
  outputLatency = 0;
  baseLatency = 0;
  destination = inert;
  createBuffer() { return { getChannelData: () => new Float32Array(10) }; }
  resume() { return Promise.resolve(); }
  decodeAudioData() { return Promise.reject(new Error("no")); }
}
for (const m of ["createGain", "createOscillator", "createBiquadFilter", "createBufferSource", "createDynamicsCompressor"]) {
  (FakeAudioContext.prototype as any)[m] = () => inert;
}
const g: any = globalThis;
g.AudioContext = FakeAudioContext;
g.window = g;
g.document = { createElement: () => createCanvas(64, 64) };
g.Image = class {
  complete = false;
  naturalWidth = 0;
  img: any = null;
  set src(p: string) {
    const i = art.get(p);
    if (!i) return;
    this.img = i;
    this.complete = true;
    this.naturalWidth = i.width;
  }
};
g.fetch = () => Promise.reject(new Error("offline"));
g.setInterval = () => 0;

