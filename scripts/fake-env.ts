// Headless stand-ins for the DOM and Web Audio so the real battle code runs in Node (snapshots and balance sims).
import { createCanvas, Image as NImage } from "@napi-rs/canvas";
import { readFileSync, existsSync } from "node:fs";

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
  img: NImage | null = null;
  set src(p: string) {
    const f = `public/${p}`;
    if (!existsSync(f)) return;
    const i = new NImage();
    i.src = readFileSync(f);
    this.img = i;
    this.complete = true;
    this.naturalWidth = i.width;
  }
};
g.fetch = () => Promise.reject(new Error("offline"));
g.setInterval = () => 0;

