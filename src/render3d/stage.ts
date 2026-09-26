// The 3D stage: the black playground (set.ts), two fighters, the crowd, the camera director and the render pipeline
// (scene -> full resolution MSAA target with bloom -> linear blit through lane B's composite). Reads
// CoreEvents and Frames only; owns the visual time scale (hit stop, drop ramp) and never touches audio.
import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import * as SkeletonUtils from "three/examples/jsm/utils/SkeletonUtils.js";
import type { Anchors, CoreEvent, Frame, LevelV2, Stage } from "../v2/contracts";
import { RIM_COLOR, RingSet } from "./set";
import { Crowd } from "./crowd";
import { crowdBudget } from "./crowdRoster";
import { Fighter, loadCast, loadRig, type CastSource, type ClipEvent } from "./fighters";
import { cosmeticsFor, dress, opponentLook } from "./dress";
import { LAYOUT, MOVE_S, SUBJECT, pickShot, punchZoom, rampScale, sameFamily, shotPose, turnShot, type Pose, type ShotKind } from "./director";
import { Vfx } from "./vfx";
import { createComposite } from "./vfx/composite";
import { sizeChanged, stagePixelRatio, stageSize, type StageSize } from "./viewport";
import { Nameplates } from "./nameplates";
import { playerRank } from "../v2/xp";
import { DEFAULT_HANDLE, getLoadout } from "../loadout/state";

const WHIP = 0.1;

function bar(parent: HTMLElement, top: boolean): HTMLDivElement {
  const d = document.createElement("div");
  d.style.cssText = `position:fixed;left:0;right:0;${top ? "top" : "bottom"}:0;height:0;background:#000;pointer-events:none;z-index:2;transition:height .35s ease`;
  parent.appendChild(d);
  return d;
}

/** Pixel ratio of the canvas, which the scene target matches (full resolution): the device's, capped at 2. */
export function pixelRatioCap(dpr: number): number {
  return stagePixelRatio(dpr);
}

/** Adaptive quality: 0 full, 1 pixel ratio 1, 2 also no shadows and no bloom. Never a lower resolution than the screen's CSS pixels. */
export interface QualityState {
  step: number;
  /** Consecutive one second fps samples under the floor. */
  low: number;
}
export const QUALITY_FPS_FLOOR = 40;

/**
 * One fps sample a second. Two seconds in a row under 40 fps step the quality down once (and restart the
 * count); a pixel ratio already at 1 skips straight to step 2. Returns true when the step changed.
 */
export function stepQuality(q: QualityState, fps: number, pixelRatio: number): boolean {
  q.low = fps < QUALITY_FPS_FLOOR ? q.low + 1 : 0;
  if (q.low < 2 || q.step >= 2) return false;
  q.low = 0;
  q.step = q.step === 0 && pixelRatio > 1 ? 1 : 2;
  return true;
}

/**
 * Whether a half float render target is complete on this GPU (iOS Safari and some Android GLES3 drivers
 * lack EXT_color_buffer_float / _half_float). Bloom's own targets are half float, so no support means no bloom.
 */
function halfFloatOk(renderer: THREE.WebGLRenderer): boolean {
  const ext = renderer.extensions;
  if (!ext.has("EXT_color_buffer_float") && !ext.has("EXT_color_buffer_half_float")) return false;
  const probe = new THREE.WebGLRenderTarget(4, 4, { type: THREE.HalfFloatType });
  try {
    renderer.setRenderTarget(probe);
    const gl = renderer.getContext();
    return gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE;
  } catch {
    return false;
  } finally {
    renderer.setRenderTarget(null);
    probe.dispose();
  }
}

function overlay(parent: HTMLElement): HTMLDivElement {
  const d = document.createElement("div");
  d.style.cssText = "position:fixed;inset:0;background:#000;opacity:0;pointer-events:none;z-index:2";
  parent.appendChild(d);
  return d;
}

export function createStage(canvas: HTMLCanvasElement, opts: { base: string; debug: boolean }): Stage {
  // Throws when WebGL is unavailable: main.ts catches it and offers the 2D version.
  // antialias off on the canvas on purpose: the scene renders into the MSAA target below and the canvas
  // only receives a fullscreen quad, so a multisampled default framebuffer would cost memory for nothing.
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, powerPreference: "high-performance" });
  const coarse = typeof matchMedia === "function" && matchMedia("(pointer: coarse)").matches;
  renderer.setPixelRatio(pixelRatioCap(typeof devicePixelRatio === "number" ? devicePixelRatio : 1));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;
  // One soft shadow map (1024, the key light only); the adaptive quality turns it off.
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(48, 16 / 9, 0.1, 120);
  const set = new RingSet(scene);
  const plates = new Nameplates(canvas);
  const enemyHead = { x: 0, y: 0, z: 0 };
  const crowd = new Crowd();
  // Rigs per quality tier: 16 on a desktop, 12 on a touch screen or at step 1, 8 at step 2.
  crowd.setBudget(crowdBudget(0, coarse));
  scene.add(crowd.group);
  const vfx = new Vfx(scene, camera);
  const glasses = vfx.sunglasses();
  scene.add(glasses);

  // Full resolution target with bloom and MSAA (the blit is a fullscreen quad, so the canvas's own
  // antialias would do nothing: the edges are resolved here), linear filtered for a clean look.
  const floatOk = halfFloatOk(renderer);
  const rt = new THREE.WebGLRenderTarget(640, 360, {
    type: floatOk ? THREE.HalfFloatType : THREE.UnsignedByteType,
    samples: coarse ? 2 : 4,
  });
  const composer = new EffectComposer(renderer, rt);
  composer.renderToScreen = false;
  composer.setPixelRatio(1);
  composer.addPass(new RenderPass(scene, camera));
  // Subtle bloom on emissives only: in the half float target only the ring line and the VFX go above the
  // threshold. No half float, no bloom (its own targets are half float).
  const bloom = floatOk ? new UnrealBloomPass(new THREE.Vector2(640, 360), 0.4, 0.3, 1.05) : null;
  if (bloom) composer.addPass(bloom);

  const composite = createComposite();
  const blitScene = new THREE.Scene();
  const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), composite.material);
  quad.frustumCulled = false;
  blitScene.add(quad);
  const blitCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  /** Size of the scene target in pixels (the canvas's drawing buffer). */
  const lowRes = new THREE.Vector2(640, 360);
  const drawSize = new THREE.Vector2();
  // Clean look at full resolution: scanlines at pixel pitch only add a moire.
  vfx.screen.scanline = 0;

  const host = canvas.parentElement ?? document.body;
  const lbTop = bar(host, true);
  const lbBottom = bar(host, false);
  // Fade to and from black: in from black across the count in, out to black before the results.
  const fade = overlay(host);
  let fadeLevel = 0;
  const setFade = (v: number, seconds: number) => {
    if (v === fadeLevel) return;
    fadeLevel = v;
    fade.style.transition = seconds > 0 ? `opacity ${seconds.toFixed(3)}s linear` : "none";
    fade.style.opacity = String(v);
  };
  let spb = 0.5;
  let letterbox = false;
  const setLetterbox = (on: boolean) => {
    if (on === letterbox) return;
    letterbox = on;
    lbTop.style.height = lbBottom.style.height = on ? "10vh" : "0";
  };

  let fpsDiv: HTMLDivElement | null = null;
  if (opts.debug) {
    fpsDiv = document.createElement("div");
    fpsDiv.style.cssText = "position:fixed;top:4px;right:6px;z-index:50;font:12px monospace;color:#0f0;background:#0008;padding:2px 5px;pointer-events:none";
    document.body.appendChild(fpsDiv);
  }

  // Cast and fighters.
  let cast: CastSource | null = null;
  let player: Fighter | null = null;
  let enemy: Fighter | null = null;

  // Director state.
  let shot: ShotKind = "twoShot";
  let shotT = 0;
  let whipT = -1;
  let whipFrom: Pose | null = null;
  /** A game event landed since the last cut: the next downbeat may cut (cuts follow the fight, not a metronome). */
  let cutCue = false;
  /** His turn in the dance battle: the camera stays on him, the downbeat cuts wait for yours. */
  let hisTurn = false;
  /** Beat the current turn ends on, and whether its closing two shot already played. */
  let turnEnd = Infinity;
  let turnLen = 0;
  let turnClosed = false;
  // Reused poses: the frame loop allocates none.
  const camPose: Pose = { pos: [0, 0, 0], target: [0, 0, 0], fov: 48 };
  const whipPose: Pose = { pos: [0, 0, 0], target: [0, 0, 0], fov: 48 };
  let punchT = 9;
  let hitStop = 0;
  let trauma = 0;
  let cringeT = 9;
  let dutch = 0;
  let rampArmed = false;
  let timeScale = 1;
  let charge = 0;
  let ending = false;
  let endT = 0;
  let endWin = true;
  let lastBarEnergy = -1;
  let flashFrames = 0;
  let flashAmp = 0;
  let flashBlack = false;
  let holdFreezeIn = -1;
  let hitAlt = false;
  let lastTier = 0;
  let time = 0;
  let idleAngle = 0;
  /** True while battle VFX may be on screen; the first idle frame after a battle clears them. */
  let battleFx = false;

  // Fps and adaptive quality.
  const quality: QualityState = { step: 0, low: 0 };
  let qualityLogged = false;
  let fpsVal = 60;
  let fpsFrames = 0;
  let fpsAcc = 0;

  const anchors: Anchors = {
    playerFeet: { x: 0, y: 0, z: 0 },
    playerHead: { x: 0, y: 0, z: 0 },
    playerHands: { x: 0, y: 0, z: 0 },
    enemyFeet: { x: 0, y: 0, z: 0 },
    enemyChest: { x: 0, y: 0, z: 0 },
  };
  const vPos = new THREE.Vector3();
  const vTgt = new THREE.Vector3();
  const vHands = new THREE.Vector3();

  /** The size last applied to the renderer, the targets, the composite and the camera (viewport.ts). */
  let applied: StageSize | null = null;
  const dprNow = () => (typeof devicePixelRatio === "number" ? devicePixelRatio : 1);
  const measureSize = (): StageSize =>
    stageSize(canvas.clientWidth, canvas.clientHeight, dprNow(), quality.step, typeof innerWidth === "number" ? innerWidth : 0, typeof innerHeight === "number" ? innerHeight : 0);

  /**
   * Every consumer follows the canvas's real box, landscape or portrait: the drawing buffer (and so the
   * default viewport), the MSAA scene target and bloom's targets, the composite's uRes, the VFX pixel height
   * and the camera aspect. Called on window resize, orientationchange, a ResizeObserver on the canvas, and by
   * the per frame watchdog when any of them went stale (a missed event would leave a stale viewport: the
   * scene in a corner of a larger buffer, the rest black).
   */
  function resize(): void {
    const s = measureSize();
    // Keep the last good size while the canvas is hidden (0 x 0) once a real one was applied.
    if (!s.measured && applied?.measured) return;
    if (renderer.getPixelRatio() !== s.pixelRatio) renderer.setPixelRatio(s.pixelRatio);
    renderer.setSize(s.cssW, s.cssH, false);
    renderer.setViewport(0, 0, s.cssW, s.cssH);
    renderer.setScissorTest(false);
    renderer.getDrawingBufferSize(drawSize);
    const tw = Math.max(1, Math.round(drawSize.x)) || s.targetW;
    const th = Math.max(1, Math.round(drawSize.y)) || s.targetH;
    composer.setSize(tw, th);
    lowRes.set(tw, th);
    vfx.setPixelHeight(th);
    camera.aspect = Number.isFinite(s.aspect) && s.aspect > 0 ? s.aspect : 16 / 9;
    camera.updateProjectionMatrix();
    applied = { ...s, targetW: tw, targetH: th, bufferW: tw, bufferH: th };
  }
  resize();
  if (typeof ResizeObserver === "function") {
    try {
      new ResizeObserver(() => resize()).observe(canvas);
    } catch {
      // No observer: the window events and the watchdog still cover it.
    }
  }
  if (typeof addEventListener === "function") addEventListener("orientationchange", () => resize());
  let watchFrames = 0;
  /** Cheap per frame check (no layout read except every 30 frames): resize when anything drifted. */
  function watchSize(): void {
    const a = applied;
    const drift =
      !a ||
      canvas.width !== a.bufferW ||
      canvas.height !== a.bufferH ||
      a.pixelRatio !== stagePixelRatio(dprNow(), quality.step) ||
      composer.readBuffer.width !== a.targetW ||
      composer.readBuffer.height !== a.targetH;
    if (drift || ++watchFrames >= 30) {
      watchFrames = 0;
      const s = measureSize();
      if (drift || (s.measured && sizeChanged(a, s))) resize();
    }
  }

  function flash(amp: number, black: boolean, frames = 1): void {
    flashAmp = Math.max(flashAmp * (flashFrames > 0 ? 1 : 0), amp);
    flashBlack = black;
    flashFrames = Math.max(flashFrames, frames);
  }

  function cut(next: ShotKind): void {
    shot = next;
    shotT = 0;
    whipT = -1;
    cutCue = false;
  }

  /** An event's own shot, skipped when that family is already on screen (never the same family twice). */
  function cutTo(next: ShotKind): void {
    if (!sameFamily(next, shot)) cut(next);
  }

  function computeAnchors(): void {
    if (!player || !enemy) return;
    player.feetPos(anchors.playerFeet);
    player.headPos(anchors.playerHead);
    player.handsPos(anchors.playerHands);
    enemy.feetPos(anchors.enemyFeet);
    enemy.chestPos(anchors.enemyChest);
  }

  function placeGlasses(): void {
    const h = anchors.playerHead;
    // Player faces -z: the eyes sit up and forward of the head bone. The robot has a huge head.
    const robot = !!cast && cast.label.startsWith("Robot");
    const up = robot ? 0.36 : 0.1;
    const fwd = robot ? 0.3 : 0.12;
    glasses.position.set(h.x, h.y + up, h.z - fwd);
    glasses.rotation.set(0, Math.PI, 0);
    glasses.scale.setScalar(robot ? 2.4 : 1);
  }

  function applyCamera(f: Frame | null, realDt: number, vdt: number): void {
    const aspect = camera.aspect;
    const barPos = f ? (((f.beatPos / 4) % 1) + 1) % 1 : 0.5;
    let pose: Pose;
    if (ending) {
      // Freeze frame, then a slow orbit around the winner, seen from the front.
      const a = Math.max(0, endT - 0.5) * 0.25 + 0.5;
      const [cx, , cz] = endWin ? LAYOUT.player : LAYOUT.enemy;
      const front = endWin ? -1 : 1;
      pose = camPose;
      pose.pos[0] = cx + Math.sin(a) * 4.2;
      pose.pos[1] = 1.5;
      pose.pos[2] = cz + Math.cos(a) * 4.2 * front;
      pose.target[0] = cx;
      pose.target[1] = 1.1;
      pose.target[2] = cz;
      pose.fov = 42;
    } else {
      pose = shotPose(shot, shotT, barPos, aspect, camPose);
      if (whipT >= 0 && whipFrom) {
        const k = Math.min(1, whipT / WHIP);
        const e = k * k * (3 - 2 * k);
        for (let i = 0; i < 3; i++) {
          pose.pos[i] = whipFrom.pos[i] + (pose.pos[i] - whipFrom.pos[i]) * e;
          pose.target[i] = whipFrom.target[i] + (pose.target[i] - whipFrom.target[i]) * e;
        }
        pose.fov = whipFrom.fov + (pose.fov - whipFrom.fov) * e;
      }
    }
    vPos.set(pose.pos[0], pose.pos[1], pose.pos[2]);
    vTgt.set(pose.target[0], pose.target[1], pose.target[2]);
    // Charge: push in on our hands (only from the shots that see them).
    if (charge > 0.001 && SUBJECT[shot] === "player" && !ending) {
      vHands.set(anchors.playerHands.x, anchors.playerHands.y, anchors.playerHands.z);
      vPos.lerp(vHands, 0.28 * charge);
      vTgt.lerp(vHands, 0.35 * charge);
    }
    // Cringe: the camera drops.
    const cr = cringeT < 0.6 ? 1 - cringeT / 0.6 : 0;
    vPos.y -= 0.18 * cr;
    // Shake: trauma squared, handheld noise in phase 2.
    const hand = f?.phase2 ? 0.25 : 0;
    const sh = trauma * trauma + hand * 0.12;
    if (sh > 0) {
      const t = time * 23;
      vPos.x += (Math.sin(t * 1.3) + Math.sin(t * 2.9) * 0.5) * 0.12 * sh;
      vPos.y += (Math.sin(t * 1.7 + 2) + Math.sin(t * 3.1) * 0.5) * 0.1 * sh;
      vTgt.x += Math.sin(t * 0.9 + 1) * 0.08 * sh;
    }
    camera.position.copy(vPos);
    camera.lookAt(vTgt);
    const roll = THREE.MathUtils.degToRad(3 * cr + dutch + (hand ? Math.sin(time * 1.1) * 1.2 : 0));
    camera.rotateZ(roll);
    const fov = pose.fov + punchZoom(punchT) - 4 * charge;
    if (Math.abs(camera.fov - fov) > 0.01) {
      camera.fov = fov;
      camera.updateProjectionMatrix();
    }
    shotT += vdt;
    if (whipT >= 0) whipT += realDt;
  }

  function render(realDt: number): void {
    watchSize();
    composer.render(realDt);
    composite.material.uniforms.tDiffuse.value = composer.readBuffer.texture;
    const fx = vfx.screen;
    if (flashFrames > 0) {
      fx.flash = Math.max(fx.flash, flashAmp);
      if (flashAmp >= fx.flash) fx.flashBlack = flashBlack;
      flashFrames--;
    }
    composite.apply(fx, time, lowRes);
    renderer.setRenderTarget(null);
    renderer.render(blitScene, blitCam);
  }

  /** `adapt`: only battle frames step the quality down (a model load stalling the menu is not the fight's fps). */
  function measure(realDt: number, adapt: boolean): void {
    fpsFrames++;
    fpsAcc += realDt;
    if (fpsAcc >= 1) {
      fpsVal = fpsFrames / fpsAcc;
      fpsFrames = 0;
      fpsAcc = 0;
      if (adapt && stepQuality(quality, fpsVal, renderer.getPixelRatio())) {
        if (quality.step >= 1 && renderer.getPixelRatio() > 1) resize();
        crowd.setBudget(crowdBudget(quality.step, coarse));
        if (quality.step >= 2) {
          set.key.castShadow = false;
          set.setQuality(quality.step);
          if (bloom) bloom.enabled = false;
          vfx.setQuality(0.5);
        }
        if (!qualityLogged) {
          qualityLogged = true;
          console.info(`[aura] under ${QUALITY_FPS_FLOOR} fps for 2 s: quality step ${quality.step} (1 = pixel ratio 1, 2 = no shadows nor bloom)`);
        }
      }
      if (fpsDiv)
        fpsDiv.textContent = `${fpsVal.toFixed(0)} fps ${lowRes.x}x${lowRes.y} q${quality.step}${bloom?.enabled ? "" : " nobloom"}${cast ? " " + cast.label : ""} ${crowd.label}`;
    }
  }

  /**
   * A failed QTE, any type (a miss, a cringe, a missed hold end): the player cringes in place (the keyed
   * cooked collapse over the idle's legs, the stumble clip when the rig cannot key it), the crowd goes
   * "ooh" (a small recoil), the camera drops and tilts. Nothing travels, nobody changes size.
   */
  function fail(): void {
    if (!player?.gesture("cookedCollapse", 60 / spb, Math.max(0.8, 3 * spb))) playP("miss_cringe");
    if (enemy && !enemy.gesturing) playE("enemy_taunt");
    crowd.recoil(1);
    cringeT = 0;
    trauma = Math.min(1, trauma + 0.25);
  }

  function playP(ev: ClipEvent, speed = 1) {
    player?.play(ev, speed);
  }
  function playE(ev: ClipEvent, speed = 1) {
    enemy?.play(ev, speed);
  }

  let castTry: Promise<CastSource> | null = null;
  /** 0..1 grow in of freshly placed fighters (no loading screen: they pop into the idling arena). */
  let popT = 1;
  function popIn(dt: number) {
    if (popT >= 1) return;
    popT = Math.min(1, popT + dt / 0.35);
    const k = 1 - (1 - popT) ** 3;
    player?.root.scale.setScalar(Math.max(0.01, k));
    enemy?.root.scale.setScalar(Math.max(0.01, k));
  }

  const stage: Stage = {
    async load(lv: LevelV2) {
      set.setLevel(lv);
      // No neon (addendum 16:00): the charge ghost of the crowd takes the cool rim color.
      crowd.setTint(new THREE.Color(RIM_COLOR));
      // Poll the manifest again while we are still on a fallback cast.
      if (!cast || !cast.label.startsWith("manifest")) {
        castTry ??= loadCast(opts.base);
        const c = await castTry;
        castTry = null;
        if (c !== cast) {
          cast = c;
          player?.dispose();
          enemy?.dispose();
          player = enemy = null;
        }
      }
      if (!cast) return;
      // His own rig for this opponent (cast.json opponent.rig); a missing or broken file keeps the current one.
      const rig = lv.opponent.rig ? `characters/${lv.opponent.rig}` : undefined;
      if (rig && cast.enemyFile && rig !== cast.enemyFile) {
        try {
          cast = { ...cast, enemy: await loadRig(opts.base, rig), enemyFile: rig };
        } catch {
          // Keep the manifest's enemy.
        }
      }
      // The animated crowd streams in after the fighters (once, cached); the capsules hold the ring until then.
      void crowd.load(opts.base);
      player?.dispose();
      enemy?.dispose();
      player = new Fighter(SkeletonUtils.clone(cast.player), cast.clips, "player");
      const look = opponentLook(cast.enemyFile === rig ? lv.opponent : { color: lv.opponent.color });
      enemy = new Fighter(SkeletonUtils.clone(cast.enemy), cast.clips, "enemy", look.tint, look.height);
      // Kevin wears his rank (the lanyard, then the sunglasses, then the chain); the Boat Kid his sunglasses.
      dress(player.root, cosmeticsFor(playerRank()));
      dress(enemy.root, look.cosmetics, look.height);
      player.root.position.set(...LAYOUT.player);
      player.root.rotation.y = Math.PI;
      enemy.root.position.set(...LAYOUT.enemy);
      scene.add(player.root, enemy.root);
      popT = 0;
      popIn(0);
      plates.enemyHandle = lv.opponent.handle ?? "@" + lv.opponent.name.toLowerCase().replace(/\W+/g, "_");
      plates.enemyRank = lv.opponent.rank ?? "Sigma";
      plates.playerHandle = getLoadout().handle ?? DEFAULT_HANDLE;
      plates.playerRank = playerRank();
      // Fresh director for the battle: the count in on the two shot, both fighters facing across the pool.
      cut("twoShot");
      hisTurn = false;
      turnEnd = Infinity;
      turnLen = 0;
      turnClosed = false;
      ending = false;
      endT = 0;
      rampArmed = false;
      timeScale = 1;
      hitStop = 0;
      trauma = 0;
      dutch = 0;
      charge = 0;
      lastBarEnergy = -1;
      computeAnchors();
    },

    event(e: CoreEvent) {
      vfx.event(e, anchors);
      if (e.kind === "judged" || e.kind === "release" || e.kind === "mashStart" || e.kind === "holdStart" || e.kind === "holdEnd") cutCue = true;
      switch (e.kind) {
        case "countIn":
          // n = 4..1: a quarter of the black lifts on each click, clear on the downbeat.
          setFade(Math.min(fadeLevel, (e.n - 1) / 4), spb);
          break;
        case "beat":
          if (e.downbeat && !ending) {
            const jump = lastBarEnergy >= 0 && e.energy - lastBarEnergy > 0.3;
            // A downbeat energy jump: a short, subtle WHITE pulse (addendum 16:40 item 6), never black nor tinted.
            if (jump) flash(0.3, false);
            lastBarEnergy = e.energy;
            const free = whipT < 0 || whipT > WHIP;
            if (!turnClosed && turnLen >= 8 && e.beat >= turnEnd - 4 && e.beat < turnEnd) {
              // Between turns: the last bar of a turn goes to the two shot in profile.
              turnClosed = true;
              cutTo("twoShot");
            } else if (free && (jump || (cutCue && !hisTurn))) {
              // Cut on the downbeat only after a game event in the bar or on an energy jump; otherwise the
              // shot keeps moving. The pick frames the performer of the turn.
              cut(pickShot(shot, Math.random, { who: hisTurn ? "opponent" : "player" }));
            }
          }
          break;
        case "judged": {
          if (e.cringe || e.grade === "miss") {
            fail();
            break;
          }
          const dir = e.dir ?? ((hitAlt = !hitAlt) ? "left" : "right");
          // The canon moves at their documented pace (spec cringe 8: a move played fast reads as trying hard).
          playP(`hit_${dir}` as ClipEvent);
          playE(e.big ? "enemy_big_hit" : "enemy_hit", 1.2);
          enemy?.knockback(e.big ? 1 : e.grade === "perfect" ? 0.55 : 0.3);
          crowd.jump(e.big ? 1 : e.grade === "perfect" ? 0.6 : 0.2);
          trauma = Math.min(1, trauma + (e.big ? 0.55 : e.grade === "perfect" ? 0.22 : 0.1));
          dutch *= 0.3;
          if (e.strong && e.grade === "perfect") hitStop = Math.max(hitStop, 0.08);
          if (e.big) punchT = 0;
          if (e.big && !ending && !sameFamily(shot, "twoShot")) {
            // A big hit is a big moment: whip pan to the two shot, 6 frames (the move and his knockback together).
            whipFrom = shotPose(shot, shotT, 0.5, camera.aspect, whipPose);
            shot = "twoShot";
            shotT = 0;
            whipT = 0;
            cutCue = false;
          }
          break;
        }
        case "mashStart":
          // THE 67: the six seven hands (palms up, see saw) over the whole charge, the legs keep the groove.
          if (!player?.gesture("sixSevenHands", 60 / spb, e.lengthBeats * spb)) playP("mash_charge", 1.5);
          // The hands family: the charge seen on our hands.
          if (!ending) cutTo("hands");
          break;
        case "mashStep":
          trauma = Math.min(0.35, trauma + 0.03);
          player?.bump();
          break;
        case "release":
          playP("release");
          playE("enemy_big_hit");
          enemy?.knockback(1.3);
          punchT = 0;
          hitStop = Math.max(hitStop, 0.08);
          trauma = Math.min(1, trauma + 0.7);
          flash(0.8, false, 2);
          crowd.jump(1);
          // The release of the 67: the two shot, the burst crossing the pool.
          if (!ending) cutTo("twoShot");
          break;
        case "holdStart":
          playP("hold_freeze");
          holdFreezeIn = 0.3;
          break;
        case "holdEnd":
          holdFreezeIn = -1;
          player?.freeze(false);
          if (e.grade === "miss") fail();
          else {
            playP("hit_up");
            crowd.jump(0.7);
            enemy?.knockback(0.5);
          }
          break;
        case "turn":
          hisTurn = e.who === "opponent";
          turnEnd = e.beat + e.lengthBeats;
          turnLen = e.lengthBeats;
          turnClosed = false;
          if (!ending) {
            const next = turnShot(e.who, shot);
            if (next !== shot) cut(next);
          }
          break;
        case "opponentMove":
          // His canon move for the whole turn (visual seconds at the level tempo), then back to his idle.
          enemy?.gesture(e.move, 60 / spb, e.lengthBeats * spb);
          crowd.jump(0.4);
          break;
        case "taunt":
          // He talks over his move without breaking it: a speech bubble on his head for 2 s.
          plates.say(e.text);
          if (!enemy?.gesturing) playE("enemy_taunt");
          if (!ending) cutTo(pickShot(shot, Math.random, { taunt: true }));
          break;
        case "dropSoon":
          rampArmed = true;
          break;
        case "drop":
          rampArmed = false;
          timeScale = 1;
          punchT = 0;
          trauma = Math.min(1, trauma + 0.6);
          flash(1, false, 2);
          crowd.jump(1);
          // The drop: the two shot in profile (the top shot when the two shot is already on).
          if (!ending) cut(pickShot(shot, Math.random, { drop: true }));
          break;
        case "end":
          ending = true;
          endT = 0;
          endWin = e.win;
          rampArmed = false;
          if (e.win) {
            playP("victory");
            playE("defeat");
            crowd.jump(1);
          } else {
            playP("defeat");
            playE("enemy_victory");
          }
          break;
        default:
          break;
      }
    },

    frame(f: Frame, realDt: number) {
      if (!battleFx) {
        setFade(1, 0);
        lastTier = 0;
      }
      // Combo 25: the sunglasses drop, seen from the hero low angle in front of us.
      if (f.tier === 3 && lastTier < 3 && !ending && whipT < 0) cutTo("heroLow");
      lastTier = f.tier;
      battleFx = true;
      spb = f.spb;
      const dt = Math.min(0.1, Math.max(0, realDt));
      time += dt;
      measure(dt, true);
      // Visual time scale: hit stop, then the drop ramp, the ending freeze and slow motion.
      if (hitStop > 0) {
        timeScale = 0;
        hitStop -= dt;
      } else if (ending) {
        endT += dt;
        timeScale = endT < 0.5 ? 0 : endWin ? 0.8 : 0.5;
      } else if (rampArmed && Number.isFinite(f.beatsToDrop)) {
        timeScale = rampScale(f.beatsToDrop);
      } else timeScale = 1;
      const vdt = dt * timeScale;

      if (holdFreezeIn >= 0) {
        holdFreezeIn -= vdt;
        if (holdFreezeIn < 0) player?.freeze(true);
      }
      if (!f.holding && holdFreezeIn < 0) player?.freeze(false);

      popIn(realDt);
      player?.update(vdt, f.beatPhase, f.energy);
      enemy?.update(vdt, f.beatPhase, f.energy);
      crowd.update(vdt, f.beatPos, f.energy, ending ? 0.6 : 1);
      set.update(f.beatPhase, f.energy, time, vdt);

      charge += ((f.mashing ? 1 : 0) - charge) * Math.min(1, dt * (f.mashing ? 3 : 8));
      crowd.ghost = charge;
      trauma = Math.max(0, trauma - dt * 1.6);
      cringeT += dt;
      punchT += dt;
      const dutchTarget = f.meter < -0.3 ? Math.min(8, (-f.meter - 0.3) * 14) : 0;
      dutch += (dutchTarget - dutch) * Math.min(1, dt * 0.8);

      setLetterbox(f.songTime < 0 || ending);
      // The game hands over to the results 3.2 s after the end: the last 0.7 s go to black.
      if (ending && endT > 2.5) setFade(1, 0.6);
      computeAnchors();
      placeGlasses();
      applyCamera(f, dt, vdt);
      enemy?.headPos(enemyHead);
      plates.update(camera, player ? anchors.playerHead : null, enemy ? enemyHead : null, f.meter, !ending);
      vfx.update(vdt, f, anchors);
      render(dt);
    },

    idle(realDt: number) {
      if (battleFx) {
        // Menus after a battle: no frozen flames, orb, sunglasses or loss grey behind the screens.
        battleFx = false;
        vfx.event({ kind: "countIn", n: 4, at: 0 }, anchors);
        glasses.visible = false;
        setFade(0, 0.6);
      }
      const dt = Math.min(0.1, Math.max(0, realDt));
      time += dt;
      measure(dt, false);
      idleAngle += dt * 0.12;
      const beatPos = time * 2;
      popIn(dt);
      player?.update(dt, beatPos % 1, 0.5);
      enemy?.update(dt, beatPos % 1, 0.5);
      crowd.update(dt, beatPos, 0.4, 0.6);
      set.update(beatPos % 1, 0.4, time, dt);
      setLetterbox(false);
      plates.hide();
      // The title is the arena: the two shot swaying back and forth on its own move (never through the crowd).
      const pose = shotPose("twoShot", MOVE_S / 2 + Math.sin(idleAngle * 2) * (MOVE_S / 2), 0, camera.aspect, camPose);
      camera.position.set(pose.pos[0], pose.pos[1], pose.pos[2]);
      camera.lookAt(pose.target[0], pose.target[1], pose.target[2]);
      const fov = pose.fov;
      if (Math.abs(camera.fov - fov) > 0.01) {
        camera.fov = fov;
        camera.updateProjectionMatrix();
      }
      render(dt);
    },

    resize,

    fps() {
      return fpsVal;
    },
  };
  return stage;
}
