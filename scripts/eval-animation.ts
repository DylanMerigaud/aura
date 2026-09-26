// Animation gate: every clip of assets/3d/manifest.json parsed with @gltf-transform/core, measured (duration,
// bones, root drift, loop seam, stillness, arm symmetry) and checked against the beat windows and the mechanical
// half of the ten instant cringe kills (docs/aura-farming-spec.md section 5d). One ledger row per check, kind
// "animation". Thresholds and their reasons: docs/evals.md.
// Run: npx tsx scripts/eval-animation.ts [--dry]. Exit 1 on any fail or error.
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { basename, join } from "node:path";
import { NodeIO, type Document, type Node } from "@gltf-transform/core";
import { ROOT, check, finish, isMain, loadCharts, parseCli, sortedSlots, type Chart, type Check } from "./eval-lib";

export const ANIM = {
  /** Root (hips) horizontal travel allowed across an in place clip, meters. */
  maxDriftM: 0.05,
  /** Loop seam: first against last key of the hips and shoulder bones. */
  loopMaxDeg: 15,
  loopMaxHipsM: 0.05,
  /** Hero level BPM when no chart says otherwise, and the campaign range the windows must hold across. */
  heroBpm: 130,
  bpmRange: [99, 130] as [number, number],
  /** Clip length in beats per game event. */
  beatWindows: {
    hit_up: [0.5, 2],
    hit_down: [0.5, 2],
    hit_left: [0.5, 2],
    hit_right: [0.5, 2],
    mash_charge: [1, 4],
    hold_freeze: [2, Infinity],
    release: [1, 3],
  } as Record<string, [number, number]>,
  /** Cringe 4: a hit longer than this cannot resolve on its beat. */
  hitMaxS: 4,
  /** Cringe 5: a hold needs a still stretch of this length (every body bone under stillDegS). */
  stillWindowS: 0.5,
  stillDegS: 30,
  stillHipsMS: 0.1,
  /** Cringe 3: left and right arm travel of a symmetrical move, min over max. */
  symmetryMin: 0.6,
  /** Cringe 7: a held beat between two HIT moves. */
  minHitGapBeats: 2,
  sampleFps: 30,
};

/** Events the renderer addresses (src/render3d/fighters.ts ClipEvent), used when that file cannot be read. */
const CLIP_EVENTS_FALLBACK = [
  "idle_groove", "hit_up", "hit_down", "hit_left", "hit_right", "mash_charge", "release", "hold_freeze",
  "miss_cringe", "defeat", "victory", "enemy_idle", "enemy_taunt", "enemy_hit", "enemy_big_hit",
  "enemy_cringe", "enemy_victory",
];
const HIT_EVENTS = ["hit_up", "hit_down", "hit_left", "hit_right"];
/** Events where the player is winning: a stumble here is cringe 6. */
const WINNING_EVENTS = new Set([...HIT_EVENTS, "mash_charge", "release", "hold_freeze", "victory", "idle_groove", "entrance_walk"]);
/** Events the fighter plays on its mark: root travel slides it, so they must be in place (loops always are). */
const IN_PLACE_EVENTS = new Set([...HIT_EVENTS, "mash_charge", "hold_freeze", "idle_groove", "enemy_idle", "enemy_taunt", "release"]);
const STUMBLE_RE = /stumble|trip|slip|fall|knocked|defeat/i;
/** Documented pace of the canon moves (spec section 3): the clip may not run shorter (cringe 8). */
const PACE_MIN_S: [RegExp, number, string][] = [
  [/looking around/i, 1, "over the shoulder look back, 1 to 2 s"],
  [/wave hip hop/i, 1.5, "slow symmetrical arm sweep, 1.5 to 2 s per sweep"],
  [/snake hip hop/i, 2, "wrist roll / snake arms, 2 to 3 s"],
  [/boxing taunt/i, 2, "chin up stare, holds 2 to 3 s"],
  [/house danc/i, 1, "reach and pull, about 1 s per cycle"],
];
/** Moves the spec calls symmetrical (cringe 3): the arm sweep and the palm push. */
const SYMMETRIC_RE = /wave hip hop|arm stretching/i;

export interface ManifestClip {
  file: string;
  event: string;
  name?: string;
  loop?: boolean;
  canon?: string;
  source?: string;
}

export interface ClipStats {
  animations: number;
  duration: number;
  /** Nodes of the skeleton (the hips and everything under them). */
  bones: number;
  animatedBones: number;
  hips: boolean;
  /** Horizontal (XZ) hips travel first to last key, and the widest it strays from the first key, meters. */
  driftM: number;
  excursionM: number;
  /** First against last key: worst rotation over the hips and shoulder bones (degrees), hips translation (m). */
  loopDeg: number;
  loopBones: Record<string, number>;
  loopHipsM: number;
  /** Longest stretch where every body bone turns under stillDegS and the hips move under stillHipsMS. */
  stillestS: number;
  /** Total rotation travel (degrees) of the upper and fore arm, per side. */
  armTravel: { left: number; right: number };
  /** Hash of every channel's target, keys and values: equal fingerprints are the same motion. */
  fingerprint: string;
}

// ---------------------------------------------------------------------------------------------------------
// Sampling

interface Chan {
  node: string;
  path: string;
  times: Float32Array | number[];
  values: Float32Array | number[];
  size: number;
  interp: string;
}

function valueAt(c: Chan, t: number): number[] {
  const { times, values, size } = c;
  const stride = c.interp === "CUBICSPLINE" ? size * 3 : size;
  const off = c.interp === "CUBICSPLINE" ? size : 0;
  const at = (k: number) => Array.from({ length: size }, (_, i) => values[k * stride + off + i]);
  const n = times.length;
  if (t <= times[0]) return at(0);
  if (t >= times[n - 1]) return at(n - 1);
  let lo = 0;
  let hi = n - 1;
  while (hi - lo > 1) {
    const mid = (lo + hi) >> 1;
    if (times[mid] <= t) lo = mid;
    else hi = mid;
  }
  if (c.interp === "STEP") return at(lo);
  const u = (t - times[lo]) / (times[hi] - times[lo] || 1);
  const a = at(lo);
  const b = at(hi);
  if (size === 4) {
    // nlerp on the short arc, close enough to slerp at 30 fps keys.
    const sign = a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3] < 0 ? -1 : 1;
    const q = a.map((x, i) => x + (sign * b[i] - x) * u);
    const len = Math.hypot(...q) || 1;
    return q.map((x) => x / len);
  }
  return a.map((x, i) => x + (b[i] - x) * u);
}

export function quatAngleDeg(a: number[], b: number[]): number {
  const dot = Math.abs(a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3]);
  return (2 * Math.acos(Math.min(1, dot)) * 180) / Math.PI;
}

const stripRig = (name: string) => name.replace(/^.*[:|]/, "").replace(/^mixamorig/i, "");
const isFinger = (name: string) => /thumb|index|middle|ring|pinky|_end$|top_end/i.test(name);

/** Product of the ancestors' scale (x), so hips translation reads in meters whatever the armature scale. */
function parentScale(n: Node): number {
  let s = 1;
  for (let p = n.getParentNode(); p; p = p.getParentNode()) s *= p.getScale()[0];
  return s;
}

function subtreeSize(n: Node): number {
  return 1 + n.listChildren().reduce((s, c) => s + subtreeSize(c), 0);
}

export function analyzeDocument(doc: Document): ClipStats {
  const root = doc.getRoot();
  const anims = root.listAnimations();
  const nodes = root.listNodes();
  const hipsNode = nodes.find((n) => /hips$/i.test(stripRig(n.getName())));
  const hash = createHash("sha1");
  const chans: Chan[] = [];
  const anim = anims[0];
  for (const ch of anim?.listChannels() ?? []) {
    const s = ch.getSampler();
    const node = ch.getTargetNode();
    const input = s?.getInput()?.getArray();
    const output = s?.getOutput()?.getArray();
    if (!s || !node || !input || !output) continue;
    const size = s.getOutput()!.getElementSize();
    const c: Chan = { node: stripRig(node.getName()), path: ch.getTargetPath() ?? "", times: input as Float32Array, values: output as Float32Array, size, interp: s.getInterpolation() };
    chans.push(c);
    hash.update(`${c.node}/${c.path}/`);
    hash.update(Buffer.from(new Float32Array(input as ArrayLike<number>).buffer));
    hash.update(Buffer.from(new Float32Array(output as ArrayLike<number>).buffer));
  }
  const t0 = chans.length ? Math.min(...chans.map((c) => c.times[0])) : 0;
  const t1 = chans.length ? Math.max(...chans.map((c) => c.times[c.times.length - 1])) : 0;
  const rot = (re: RegExp) => chans.find((c) => c.path === "rotation" && re.test(c.node));
  const hipsT = chans.find((c) => c.path === "translation" && /^hips$/i.test(c.node));
  const scale = hipsNode ? parentScale(hipsNode) : 1;

  // Root drift, horizontal only: a crouch or a jump moves the hips up and down on the spot.
  let driftM = 0;
  let excursionM = 0;
  let loopHipsM = 0;
  if (hipsT) {
    const first = valueAt(hipsT, t0);
    const last = valueAt(hipsT, t1);
    driftM = Math.hypot(last[0] - first[0], last[2] - first[2]) * scale;
    loopHipsM = Math.hypot(last[0] - first[0], last[1] - first[1], last[2] - first[2]) * scale;
    for (let k = 0; k < hipsT.times.length; k++) {
      const v = valueAt(hipsT, hipsT.times[k]);
      excursionM = Math.max(excursionM, Math.hypot(v[0] - first[0], v[2] - first[2]) * scale);
    }
  }

  // Loop seam over the hips and the shoulder bones (clavicle and upper arm, the Mixamo shoulder joint).
  const loopBones: Record<string, number> = {};
  for (const [label, re] of [["Hips", /^hips$/i], ["LeftShoulder", /^leftshoulder$/i], ["RightShoulder", /^rightshoulder$/i], ["LeftArm", /^leftarm$/i], ["RightArm", /^rightarm$/i]] as const) {
    const c = rot(re);
    if (c) loopBones[label] = +quatAngleDeg(valueAt(c, t0), valueAt(c, t1)).toFixed(2);
  }
  const loopDeg = Math.max(0, ...Object.values(loopBones));

  // Stillness and arm travel on a fixed grid.
  const dt = 1 / ANIM.sampleFps;
  const body = chans.filter((c) => c.path === "rotation" && !isFinger(c.node));
  const travel = { left: 0, right: 0 };
  const arms = { left: [rot(/^leftarm$/i), rot(/^leftforearm$/i)], right: [rot(/^rightarm$/i), rot(/^rightforearm$/i)] };
  let run = 0;
  let stillestS = 0;
  for (let t = t0; t + dt <= t1 + 1e-6; t += dt) {
    let worst = 0;
    for (const c of body) worst = Math.max(worst, quatAngleDeg(valueAt(c, t), valueAt(c, t + dt)) / dt);
    let hipsSpeed = 0;
    if (hipsT) {
      const a = valueAt(hipsT, t);
      const b = valueAt(hipsT, t + dt);
      hipsSpeed = (Math.hypot(b[0] - a[0], b[1] - a[1], b[2] - a[2]) * scale) / dt;
    }
    run = worst < ANIM.stillDegS && hipsSpeed < ANIM.stillHipsMS ? run + dt : 0;
    stillestS = Math.max(stillestS, run);
    for (const side of ["left", "right"] as const) {
      for (const c of arms[side]) if (c) travel[side] += quatAngleDeg(valueAt(c, t), valueAt(c, t + dt));
    }
  }

  return {
    animations: anims.length,
    duration: +(t1 - t0).toFixed(4),
    bones: hipsNode ? subtreeSize(hipsNode) : new Set(chans.map((c) => c.node)).size,
    animatedBones: new Set(chans.map((c) => c.node)).size,
    hips: !!hipsNode,
    driftM: +driftM.toFixed(4),
    excursionM: +excursionM.toFixed(4),
    loopDeg: +loopDeg.toFixed(2),
    loopBones,
    loopHipsM: +loopHipsM.toFixed(4),
    stillestS: +stillestS.toFixed(3),
    armTravel: { left: Math.round(travel.left), right: Math.round(travel.right) },
    fingerprint: hash.digest("hex").slice(0, 16),
  };
}

export async function analyzeFile(path: string): Promise<ClipStats> {
  return analyzeDocument(await new NodeIO().read(path));
}

// ---------------------------------------------------------------------------------------------------------
// Checks

/** The event names the renderer addresses, read from src/render3d/fighters.ts (the ClipEvent union). */
export function clipEvents(root = ROOT): string[] {
  const p = join(root, "src", "render3d", "fighters.ts");
  if (!existsSync(p)) return CLIP_EVENTS_FALLBACK;
  const m = /type\s+ClipEvent\s*=([^;]+);/.exec(readFileSync(p, "utf8"));
  const names = m ? [...m[1].matchAll(/"([a-z_]+)"/g)].map((x) => x[1]) : [];
  return names.length ? names : CLIP_EVENTS_FALLBACK;
}

export interface AnimationInput {
  clips: ManifestClip[];
  /** Stats per manifest file path, or the parse error. */
  stats: Map<string, ClipStats | Error>;
  requiredEvents: string[];
  heroBpm?: number;
  charts?: Chart[];
}

const idOf = (file: string) => basename(file).replace(/\.glb$/i, "");

export function animationChecks(input: AnimationInput): Check[] {
  const out: Check[] = [];
  const { clips, stats } = input;
  const hero = input.heroBpm ?? ANIM.heroBpm;
  const bpmLo = Math.min(ANIM.bpmRange[0], hero);
  const bpmHi = Math.max(ANIM.bpmRange[1], hero);
  const ok = (f: string) => {
    const s = stats.get(f);
    return s && !(s instanceof Error) ? s : null;
  };
  const r2 = (x: number) => +x.toFixed(2);

  // Per file: parse, one animation, root drift, loop seam.
  for (const file of [...new Set(clips.map((c) => c.file))]) {
    const id = idOf(file);
    const entries = clips.filter((c) => c.file === file);
    const s = stats.get(file);
    if (!s || s instanceof Error) {
      out.push({ id, gate: "parse", verdict: "error", score: 0, evidence: { note: s ? s.message : "not analyzed", file } });
      continue;
    }
    out.push(check(id, "one_animation", s.animations === 1, {
      note: `${s.animations} animation(s), ${r2(s.duration)} s, ${s.bones} bones (${s.animatedBones} animated)`,
      file, animations: s.animations, duration: s.duration, bones: s.bones, animatedBones: s.animatedBones,
    }));
    const loop = entries.some((c) => c.loop);
    const inPlace = loop || entries.some((c) => IN_PLACE_EVENTS.has(c.event));
    const drifting = s.driftM > ANIM.maxDriftM;
    out.push(check(id, "root_drift", !(inPlace && drifting), {
      note: `hips travel ${r2(s.driftM * 100)} cm first to last (max stray ${r2(s.excursionM * 100)} cm), ${inPlace ? `in place, max ${ANIM.maxDriftM * 100} cm` : "reaction clip, travel allowed"}`,
      driftM: s.driftM, excursionM: s.excursionM, inPlace, hips: s.hips,
    }));
    if (loop) {
      const clean = s.loopDeg <= ANIM.loopMaxDeg && s.loopHipsM <= ANIM.loopMaxHipsM;
      out.push(check(id, "loop_clean", clean, {
        note: `seam ${s.loopDeg} deg (max ${ANIM.loopMaxDeg}), hips ${r2(s.loopHipsM * 100)} cm (max ${ANIM.loopMaxHipsM * 100})`,
        loopDeg: s.loopDeg, loopBones: s.loopBones, loopHipsM: s.loopHipsM,
      }));
    }
  }

  // Per event: a readable clip exists, and no generic alternate can replace the canon move.
  const events = [...new Set([...input.requiredEvents, ...clips.map((c) => c.event)])];
  for (const ev of events) {
    const entries = clips.filter((c) => c.event === ev);
    const readable = entries.filter((c) => ok(c.file));
    out.push(check(ev, "clip_exists", readable.length > 0, {
      note: readable.length ? readable.map((c) => idOf(c.file)).join(", ") : entries.length ? "every mapped file failed to parse" : "no clip mapped in the manifest",
      files: entries.map((c) => c.file),
      required: input.requiredEvents.includes(ev),
    }));
    // src/render3d/fighters.ts loads every manifest clip in parallel and keeps one per event, the file that
    // finishes loading last: with a generic alternate listed next to the canon move, the alternate can win.
    const canon = readable.filter((c) => c.canon && c.canon !== "generic");
    if (readable.length > 1 && canon.length) {
      const generic = readable.filter((c) => !c.canon || c.canon === "generic");
      out.push(check(ev, "canon_only", generic.length === 0, {
        note: generic.length
          ? `generic ${generic.map((c) => idOf(c.file)).join(", ")} can replace canon ${canon.map((c) => idOf(c.file)).join(", ")} (one clip per event, last loaded wins)`
          : `${readable.length} clips, all canon`,
        clips: readable.map((c) => `${idOf(c.file)}:${c.canon ?? "none"}`),
      }));
    }
  }

  // Per mapped clip: beat window and the per clip cringe kills.
  for (const c of clips) {
    const s = ok(c.file);
    if (!s) continue;
    const id = `${c.event}:${idOf(c.file)}`;
    const win = ANIM.beatWindows[c.event];
    if (win) {
      const lo = (s.duration * bpmLo) / 60;
      const hi = (s.duration * bpmHi) / 60;
      const atHero = (s.duration * hero) / 60;
      out.push(check(id, "beat_window", lo >= win[0] && hi <= win[1], {
        note: `${r2(s.duration)} s = ${r2(atHero)} beats at ${r2(hero)} BPM (${r2(lo)} to ${r2(hi)} over ${r2(bpmLo)} to ${r2(bpmHi)} BPM), window ${win[0]} to ${win[1] === Infinity ? "any" : win[1]}`,
        seconds: s.duration, beatsAtHero: r2(atHero), beatsRange: [r2(lo), r2(hi)], window: [win[0], win[1] === Infinity ? null : win[1]],
      }));
    }
    if (HIT_EVENTS.includes(c.event)) {
      out.push(check(id, "k4_hit_resolves", s.duration <= ANIM.hitMaxS, {
        note: `${r2(s.duration)} s, max ${ANIM.hitMaxS} s (cringe 4, a pose off its beat)`,
        seconds: s.duration,
      }));
    }
    if (c.event === "hold_freeze") {
      out.push(check(id, "k5_hold_still", s.stillestS >= ANIM.stillWindowS, {
        note: `stillest stretch ${r2(s.stillestS)} s, need ${ANIM.stillWindowS} s under ${ANIM.stillDegS} deg/s (cringe 5, wobble in a hold)`,
        stillestS: s.stillestS,
      }));
    }
    const pace = PACE_MIN_S.find(([re]) => re.test(c.name ?? ""));
    if (pace) {
      out.push(check(id, "k8_pace", s.duration >= pace[1], {
        note: `${r2(s.duration)} s, documented ${pace[2]} (cringe 8, faster than its pace)`,
        seconds: s.duration, minS: pace[1],
      }));
    }
    if (SYMMETRIC_RE.test(c.name ?? "")) {
      const { left, right } = s.armTravel;
      const ratio = Math.max(left, right) ? Math.min(left, right) / Math.max(left, right) : 1;
      out.push(check(id, "k3_symmetry", ratio >= ANIM.symmetryMin, {
        note: `arm travel left ${left} deg, right ${right} deg, ratio ${r2(ratio)} (min ${ANIM.symmetryMin}, cringe 3)`,
        armTravel: s.armTravel, ratio: r2(ratio),
      }, Math.min(1, ratio / ANIM.symmetryMin)));
    }
  }

  // Manifest level kills.
  const stumbles = clips.filter((c) => WINNING_EVENTS.has(c.event) && (STUMBLE_RE.test(c.name ?? "") || STUMBLE_RE.test(c.file)));
  out.push(check("manifest", "k6_no_stumble_winning", stumbles.length === 0, {
    note: stumbles.length ? stumbles.map((c) => `${idOf(c.file)} on ${c.event}`).join(", ") : "no stumble or fall mapped to a winning event (cringe 6)",
    offenders: stumbles.map((c) => ({ file: c.file, event: c.event })),
  }));

  const idles = clips.filter((c) => c.event === "idle_groove" && c.loop && (c.canon === "boat" || c.canon === "pose") && ok(c.file));
  const enemyIdle = clips.some((c) => c.event === "enemy_idle" && ok(c.file));
  out.push(check("manifest", "serious_idle", idles.length > 0 && enemyIdle, {
    note: `player serious idle: ${idles.map((c) => idOf(c.file)).join(", ") || "none (needs a looping boat or pose idle_groove)"}; enemy idle: ${enemyIdle ? "yes" : "none"}`,
    idles: idles.map((c) => c.file),
    enemyIdle,
  }));

  const hitClips = clips.filter((c) => HIT_EVENTS.includes(c.event) && ok(c.file));
  const shared: string[] = [];
  for (let i = 0; i < hitClips.length; i++) {
    for (let j = i + 1; j < hitClips.length; j++) {
      const a = hitClips[i];
      const b = hitClips[j];
      if (a.event === b.event) continue;
      if (a.file === b.file || ok(a.file)!.fingerprint === ok(b.file)!.fingerprint) shared.push(`${idOf(a.file)} on ${a.event} and ${b.event}`);
    }
  }
  out.push(check("manifest", "k10_distinct_hit_clips", shared.length === 0, {
    note: shared.length ? shared.join(", ") : `${hitClips.length} hit clips, no motion shared across two directions`,
    shared,
  }));

  // Chart level kills: held beat between HIT moves (7), the same HIT move twice in a row (10) after the onboarding.
  for (const chart of input.charts ?? []) {
    const hits = sortedSlots(chart).filter((s) => s.type === "hit");
    const all = sortedSlots(chart);
    if (hits.length < 2) continue;
    const tight: string[] = [];
    const repeats: string[] = [];
    for (let i = 1; i < all.length; i++) {
      const a = all[i - 1];
      const b = all[i];
      if (a.type !== "hit" || b.type !== "hit") continue;
      if (b.b - a.b < ANIM.minHitGapBeats) tight.push(`${a.move}@${a.b} then ${b.move}@${b.b}`);
      // The onboarding repeats one direction on purpose (Dylan, 17:15: the first 4 bars teach a single swipe).
      if (a.move && a.move === b.move && b.b >= ONBOARDING_BEATS) repeats.push(`${a.move}@${a.b} and @${b.b}`);
    }
    out.push(check(chart.id, "k7_held_beat", tight.length === 0, {
      note: tight.length ? tight.join(", ") : `every HIT pair at least ${ANIM.minHitGapBeats} beats apart`,
      tight,
    }));
    out.push(check(chart.id, "k10_no_repeat", repeats.length === 0, {
      note: repeats.length ? repeats.join(", ") : `${hits.length} HITs, no direction twice in a row`,
      repeats,
    }));
  }
  return out;
}

/** The first 4 bars are the onboarding: k10 does not count a repeated direction there. */
export const ONBOARDING_BEATS = 16;

export async function runAnimation(root = ROOT): Promise<Check[]> {
  const mPath = join(root, "assets", "3d", "manifest.json");
  if (!existsSync(mPath)) return [{ id: "manifest", gate: "load", verdict: "error", score: 0, evidence: { note: `${mPath} missing` } }];
  const manifest = JSON.parse(readFileSync(mPath, "utf8")) as { clips?: ManifestClip[] };
  const clips = manifest.clips ?? [];
  const stats = new Map<string, ClipStats | Error>();
  for (const file of new Set(clips.map((c) => c.file))) {
    try {
      stats.set(file, await analyzeFile(join(root, "assets", "3d", file)));
    } catch (err) {
      stats.set(file, err as Error);
    }
  }
  const { charts } = await loadCharts([], root);
  const hero = charts.find((c) => c.id === "v2-level1") ?? charts[0];
  return animationChecks({ clips, stats, requiredEvents: clipEvents(root), heroBpm: hero?.bpm, charts });
}

if (isMain(import.meta.url)) {
  const cli = parseCli();
  process.exit(finish("animation", "ANIMATION", await runAnimation(), cli));
}
