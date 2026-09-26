// The 3D stage: the ring set, two fighters, the crowd, the camera director and the PS2 low res pipeline
// (scene -> 640x360 target with bloom -> nearest blit through lane B's composite). Reads CoreEvents and
// Frames only; owns the visual time scale (hit stop, drop ramp) and never touches audio.
import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import * as SkeletonUtils from "three/examples/jsm/utils/SkeletonUtils.js";
import type { Anchors, CoreEvent, Frame, LevelV2, Stage } from "../v2/contracts";
import { RingSet } from "./set";
import { Crowd } from "./crowd";
import { Fighter, loadCast, type CastSource, type ClipEvent } from "./fighters";
import { LAYOUT, isOts, pickShot, punchZoom, rampScale, shotPose, type Pose, type ShotKind } from "./director";
import { Vfx } from "./vfx";
import { createComposite } from "./vfx/composite";

const BASE_H = 360;
const WHIP = 0.1;

function bar(parent: HTMLElement, top: boolean): HTMLDivElement {
  const d = document.createElement("div");
  d.style.cssText = `position:fixed;left:0;right:0;${top ? "top" : "bottom"}:0;height:0;background:#000;pointer-events:none;z-index:2;transition:height .35s ease`;
  parent.appendChild(d);
  return d;
}

export function createStage(canvas: HTMLCanvasElement, opts: { base: string; debug: boolean }): Stage {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(1.5, devicePixelRatio || 1));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(48, 16 / 9, 0.1, 120);
  const set = new RingSet(scene, opts.base);
  const crowd = new Crowd();
  scene.add(crowd.group);
  const vfx = new Vfx(scene, camera);
  const glasses = vfx.sunglasses();
  scene.add(glasses);

  // Low res target with bloom, nearest filtered so the blit keeps the chunky pixels.
  const rt = new THREE.WebGLRenderTarget(640, 360, {
    type: THREE.HalfFloatType,
    minFilter: THREE.NearestFilter,
    magFilter: THREE.NearestFilter,
  });
  const composer = new EffectComposer(renderer, rt);
  composer.renderToScreen = false;
  composer.setPixelRatio(1);
  composer.addPass(new RenderPass(scene, camera));
  const bloom = new UnrealBloomPass(new THREE.Vector2(640, 360), 0.85, 0.35, 0.95);
  composer.addPass(bloom);

  const composite = createComposite();
  const blitScene = new THREE.Scene();
  const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), composite.material);
  quad.frustumCulled = false;
  blitScene.add(quad);
  const blitCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const lowRes = new THREE.Vector2(640, 360);

  const host = canvas.parentElement ?? document.body;
  const lbTop = bar(host, true);
  const lbBottom = bar(host, false);
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
  let shot: ShotKind = "ots";
  let shotT = 0;
  let whipT = -1;
  let whipFrom: Pose | null = null;
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
  let time = 0;
  let idleAngle = 0;
  /** True while battle VFX may be on screen; the first idle frame after a battle clears them. */
  let battleFx = false;

  // Fps and adaptive quality.
  let quality = 1;
  let fpsVal = 60;
  let fpsFrames = 0;
  let fpsAcc = 0;
  let lowSeconds = 0;

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

  function resize(): void {
    const w = Math.max(1, canvas.clientWidth || innerWidth);
    const h = Math.max(1, canvas.clientHeight || innerHeight);
    renderer.setSize(w, h, false);
    const aspect = w / h;
    let lw: number, lh: number;
    if (aspect >= 1) {
      lh = Math.round(BASE_H * quality);
      lw = Math.round(lh * aspect);
    } else {
      lw = Math.round(BASE_H * quality);
      lh = Math.round(lw / aspect);
    }
    composer.setSize(lw, lh);
    lowRes.set(lw, lh);
    vfx.setPixelHeight(lh);
    camera.aspect = aspect;
    camera.updateProjectionMatrix();
  }
  resize();

  function flash(amp: number, black: boolean, frames = 1): void {
    flashAmp = Math.max(flashAmp * (flashFrames > 0 ? 1 : 0), amp);
    flashBlack = black;
    flashFrames = Math.max(flashFrames, frames);
  }

  function cut(next: ShotKind): void {
    shot = next;
    shotT = 0;
    whipT = -1;
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
      pose = { pos: [cx + Math.sin(a) * 4.2, 1.5, cz + Math.cos(a) * 4.2 * front], target: [cx, 1.1, cz], fov: 42 };
    } else {
      pose = shotPose(shot, shotT, barPos, aspect);
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
    vPos.set(...pose.pos);
    vTgt.set(...pose.target);
    // Charge: push in on our hands (only from the shots that see them).
    if (charge > 0.001 && (isOts(shot) || shot === "heroLow") && !ending) {
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

  function measure(realDt: number): void {
    fpsFrames++;
    fpsAcc += realDt;
    if (fpsAcc >= 1) {
      fpsVal = fpsFrames / fpsAcc;
      fpsFrames = 0;
      fpsAcc = 0;
      if (fpsVal < 45) lowSeconds++;
      else lowSeconds = 0;
      if (lowSeconds >= 2 && quality > 0.5) {
        quality = 0.5;
        resize();
        vfx.setQuality(0.5);
      }
      if (fpsDiv) fpsDiv.textContent = `${fpsVal.toFixed(0)} fps ${lowRes.x}x${lowRes.y}${cast ? " " + cast.label : ""}`;
    }
  }

  function playP(ev: ClipEvent, speed = 1) {
    player?.play(ev, speed);
  }
  function playE(ev: ClipEvent, speed = 1) {
    enemy?.play(ev, speed);
  }

  let castTry: Promise<CastSource> | null = null;

  const stage: Stage = {
    async load(lv: LevelV2) {
      set.setLevel(lv);
      crowd.setTint(new THREE.Color(lv.neon[1]));
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
      player?.dispose();
      enemy?.dispose();
      player = new Fighter(SkeletonUtils.clone(cast.player), cast.clips, "player");
      enemy = new Fighter(SkeletonUtils.clone(cast.enemy), cast.clips, "enemy", new THREE.Color(lv.opponent.color || "#ff3366"));
      player.root.position.set(...LAYOUT.player);
      player.root.rotation.y = Math.PI;
      enemy.root.position.set(...LAYOUT.enemy);
      scene.add(player.root, enemy.root);
      // Fresh director for the battle.
      cut("ots");
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
      switch (e.kind) {
        case "beat":
          if (e.downbeat && !ending) {
            if (lastBarEnergy >= 0 && e.energy - lastBarEnergy > 0.3) flash(1, Math.random() < 0.4);
            lastBarEnergy = e.energy;
            if (whipT < 0 || whipT > WHIP) cut(pickShot(shot, Math.random));
          }
          break;
        case "judged": {
          const bad = e.cringe || e.grade === "miss";
          if (bad) {
            playP("miss_cringe");
            playE("enemy_taunt");
            cringeT = 0;
            trauma = Math.min(1, trauma + 0.25);
            break;
          }
          const dir = e.dir ?? ((hitAlt = !hitAlt) ? "left" : "right");
          playP(`hit_${dir}` as ClipEvent, 1.3);
          playE(e.big ? "enemy_big_hit" : "enemy_hit", 1.2);
          enemy?.knockback(e.big ? 1 : e.grade === "perfect" ? 0.55 : 0.3);
          crowd.jump(e.big ? 1 : e.grade === "perfect" ? 0.6 : 0.2);
          trauma = Math.min(1, trauma + (e.big ? 0.55 : e.grade === "perfect" ? 0.22 : 0.1));
          dutch *= 0.3;
          if (e.strong && e.grade === "perfect") hitStop = Math.max(hitStop, 0.08);
          if (e.big && !ending) {
            // Whip pan from where we are to the enemy close up, 6 frames.
            whipFrom = shotPose(shot, shotT, 0.5, camera.aspect);
            shot = "enemyClose";
            shotT = 0;
            whipT = 0;
          }
          break;
        }
        case "mashStart":
          playP("mash_charge", 1.5);
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
          break;
        case "holdStart":
          playP("hold_freeze");
          holdFreezeIn = 0.3;
          break;
        case "holdEnd":
          holdFreezeIn = -1;
          player?.freeze(false);
          if (e.grade === "miss") playP("miss_cringe");
          else {
            playP("hit_up");
            crowd.jump(0.7);
            enemy?.knockback(0.5);
          }
          break;
        case "taunt":
          playE("enemy_taunt");
          if (!ending) cut("dollyEnemy");
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
          if (!ending) cut(shot === "topDown" ? "ots" : "topDown");
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
      battleFx = true;
      const dt = Math.min(0.1, Math.max(0, realDt));
      time += dt;
      measure(dt);
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

      player?.update(vdt, f.beatPhase, f.energy);
      enemy?.update(vdt, f.beatPhase, f.energy);
      crowd.update(vdt, f.beatPos, f.energy, ending ? 0.6 : 1);
      set.update(f.beatPhase, f.energy, time);

      charge += ((f.mashing ? 1 : 0) - charge) * Math.min(1, dt * (f.mashing ? 3 : 8));
      crowd.ghost = charge;
      trauma = Math.max(0, trauma - dt * 1.6);
      cringeT += dt;
      punchT += dt;
      const dutchTarget = f.meter < -0.3 ? Math.min(8, (-f.meter - 0.3) * 14) : 0;
      dutch += (dutchTarget - dutch) * Math.min(1, dt * 0.8);

      setLetterbox(f.songTime < 0 || ending);
      computeAnchors();
      placeGlasses();
      applyCamera(f, dt, vdt);
      vfx.update(vdt, f, anchors);
      render(dt);
    },

    idle(realDt: number) {
      if (battleFx) {
        // Menus after a battle: no frozen flames, orb, sunglasses or loss grey behind the screens.
        battleFx = false;
        vfx.event({ kind: "countIn", n: 4, at: 0 }, anchors);
        glasses.visible = false;
      }
      const dt = Math.min(0.1, Math.max(0, realDt));
      time += dt;
      measure(dt);
      idleAngle += dt * 0.12;
      const beatPos = time * 2;
      player?.update(dt, beatPos % 1, 0.5);
      enemy?.update(dt, beatPos % 1, 0.5);
      crowd.update(dt, beatPos, 0.4, 0.6);
      set.update(beatPos % 1, 0.4, time);
      setLetterbox(false);
      camera.position.set(Math.sin(idleAngle) * 8.5, 3.2, Math.cos(idleAngle) * 8.5);
      camera.lookAt(0, 0.9, 0);
      const fov = camera.aspect < 1 ? 70 : 50;
      if (camera.fov !== fov) {
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
