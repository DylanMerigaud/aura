// Pure parts of the v2 VFX: pool reuse, tier colors, flame rates, screen fx decay, and a smoke run
// of the Vfx class in node (no WebGLRenderer).
import { describe, expect, it } from "vitest";
import * as THREE from "three";
import { ParticlePool, enemyFlameRate, flameRate, tierColor } from "../src/render3d/vfx/pool";
import { kickPulse, newScreenFx, pulse, ScreenDriver } from "../src/render3d/vfx/screen";
import { createComposite } from "../src/render3d/vfx/composite";
import { Vfx } from "../src/render3d/vfx/index";
import type { Anchors, Frame } from "../src/v2/contracts";

describe("ParticlePool", () => {
  it("reuses dead slots before stealing live ones", () => {
    const p = new ParticlePool(4);
    const ids = [0, 1, 2, 3].map(() => p.spawn(0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1));
    expect(new Set(ids).size).toBe(4);
    p.life[2] = 0;
    expect(p.spawn(0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1)).toBe(2);
    // Full: steals the one with the least life left.
    p.life[1] = 0.1;
    expect(p.spawn(0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1)).toBe(1);
    expect(p.alive()).toBe(4);
  });

  it("setQuality halves the usable slots and kills the rest", () => {
    const p = new ParticlePool(100);
    for (let i = 0; i < 100; i++) p.spawn(0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1);
    p.setQuality(0.5);
    expect(p.active).toBe(50);
    expect(p.alive()).toBe(50);
    for (let i = 0; i < 200; i++) expect(p.spawn(0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1)).toBeLessThan(50);
  });
});

describe("colors and rates", () => {
  it("tier colors go faint blue, blue, purple, white hot", () => {
    const [r0, , b0, a0] = tierColor(0);
    const [r1, , b1, a1] = tierColor(1);
    const [r2, g2, b2] = tierColor(2);
    const [r3, g3, b3] = tierColor(3);
    expect(b0).toBeGreaterThan(r0);
    expect(a0).toBeLessThan(a1);
    expect(b1).toBeGreaterThan(r1);
    expect(r2).toBeGreaterThan(g2);
    expect(b2).toBeGreaterThan(g2);
    expect(Math.min(r3, g3, b3)).toBeGreaterThan(0.8);
    expect(tierColor(9)).toBe(tierColor(3));
  });

  it("flame rate grows with the meter, enemy flame with the enemy share", () => {
    expect(flameRate(1, 0.7, 0)).toBeGreaterThan(flameRate(-1, 0.7, 0));
    expect(flameRate(0, 0.7, 3)).toBeGreaterThan(flameRate(0, 0.7, 0));
    expect(enemyFlameRate(-1, 0.7)).toBeGreaterThan(enemyFlameRate(0, 0.7));
    expect(enemyFlameRate(1, 0.7)).toBe(0);
  });
});

describe("screen fx decay", () => {
  it("pulse holds then fades linearly", () => {
    expect(pulse(0, 0.05, 0.1)).toBe(1);
    expect(pulse(0.05, 0.05, 0.1)).toBe(1);
    expect(pulse(0.1, 0.05, 0.1)).toBeCloseTo(0.5);
    expect(pulse(0.2, 0.05, 0.1)).toBe(0);
  });

  it("kick pulse peaks on the beat and is gone by mid beat", () => {
    expect(kickPulse(0)).toBe(1);
    expect(kickPulse(0.5)).toBe(0);
    expect(kickPulse(0.9)).toBe(0);
  });

  it("chroma lasts about two frames, glitch three, then decay to 0", () => {
    const d = new ScreenDriver();
    d.chroma();
    d.glitch();
    d.tick(1 / 60, 0.5, 0.5);
    expect(d.fx.chroma).toBe(1);
    d.tick(1 / 60, 0.5, 0.5);
    expect(d.fx.chroma).toBe(1);
    expect(d.fx.glitch).toBe(1);
    for (let i = 0; i < 12; i++) d.tick(1 / 60, 0.5, 0.5);
    expect(d.fx.chroma).toBe(0);
    expect(d.fx.glitch).toBe(0);
  });

  it("a loss drains to grey and a reset brings color back", () => {
    const d = new ScreenDriver();
    d.setDesat(1);
    for (let i = 0; i < 60; i++) d.tick(1 / 60, 0.5, 0.5);
    expect(d.fx.desat).toBe(1);
    d.reset();
    d.tick(1 / 60, 0.5, 0.5);
    expect(d.fx.desat).toBe(0);
  });

  it("defaults and the vignette pump", () => {
    const fx = newScreenFx();
    expect(fx.scanline).toBe(0.08);
    expect(fx.vignette).toBe(0.25);
    const d = new ScreenDriver();
    d.tick(0, 0, 1);
    const onBeat = d.fx.vignette;
    d.tick(0, 0.6, 1);
    expect(onBeat).toBeGreaterThan(d.fx.vignette);
  });

  it("the composite copies the fx into uniforms", () => {
    const c = createComposite();
    const fx = newScreenFx();
    fx.flash = 0.5;
    fx.flashBlack = true;
    c.apply(fx, 1, new THREE.Vector2(640, 360));
    expect(c.material.uniforms.uFlash.value).toBe(0.5);
    expect(c.material.uniforms.uFlashBlack.value).toBe(1);
  });
});

function frame(over: Partial<Frame>): Frame {
  return {
    songTime: 1, beatPos: 2, beatPhase: 0, spb: 0.5, meter: 0, combo: 0, tier: 0, score: 0, rate: 1, energy: 0.7,
    beatsToDrop: Infinity, mashing: false, mashCount: 0, holding: false, holdProgress: 0, phase2: false, turn: "player",
    ending: false, win: null, prompts: [], showsAt: () => 0, targetAt: () => 0,
    level: {} as Frame["level"], ...over,
  };
}

const anchors: Anchors = {
  playerFeet: { x: 0, y: 0, z: 0 },
  playerHead: { x: 0, y: 1.7, z: 0 },
  playerHands: { x: 0, y: 1.2, z: 0.4 },
  enemyFeet: { x: 0, y: 0, z: 3 },
  enemyChest: { x: 0, y: 1.3, z: 3 },
};

describe("Vfx smoke", () => {
  it("runs a battle slice without throwing and shows the glasses at tier 3", () => {
    const scene = new THREE.Scene();
    const cam = new THREE.PerspectiveCamera(50, 16 / 9, 0.1, 100);
    const vfx = new Vfx(scene, cam);
    vfx.setQuality(0.5);
    vfx.event({ kind: "countIn", n: 4, at: 0 }, anchors);
    for (let i = 0; i < 30; i++) vfx.update(1 / 60, frame({ meter: 0.9, tier: 1 }), anchors);
    vfx.event({ kind: "judged", grade: "perfect", cringe: false, qte: "hit", combo: 6, score: 100, strong: true, big: true }, anchors);
    vfx.event({ kind: "mashStart", lengthBeats: 4 }, anchors);
    for (let i = 0; i < 10; i++) vfx.update(1 / 60, frame({ mashing: true, mashCount: i, tier: 2 }), anchors);
    vfx.event({ kind: "release", burst: 30, count: 30, mult: 1, grade: "perfect" }, anchors);
    vfx.update(0, frame({ tier: 3 }), anchors);
    for (let i = 0; i < 30; i++) vfx.update(1 / 60, frame({ tier: 3, meter: -0.8 }), anchors);
    expect(vfx.sunglasses().visible).toBe(true);
    vfx.event({ kind: "end", win: false, ko: false }, anchors);
    vfx.update(1 / 60, frame({ ending: true, win: false }), anchors);
    expect(vfx.screen.flashBlack).toBe(true);
  });
});
