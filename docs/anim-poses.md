# Keyed gestures: the pose DSL and the aura farming canon

`src/anim/poses.ts` turns hand keyed poses into `THREE.AnimationClip`s for the Mixamo rigs, timed in
beats so every level retimes them to its BPM. `src/anim/gestures.ts` keys the canon moves of
`docs/aura-farming-spec.md` section 3 and `docs/genz-canon-2026.md` section 2 with it. Nothing in
`src/render3d` imports them yet: this page is how the main build plugs them in.

## The DSL

A **pose** maps a Mixamo bone (the name without its `mixamorig9:` prefix, typed: `Head`, `LeftArm`,
`RightHandIndex2`, `LeftUpLeg`...) to `[x, y, z]` degrees, plus an optional `hipsOffset: [x, y, z]` in
meters.

- The degrees are in **character axes**: +X is the character's left, +Y up, +Z where it faces. They
  rotate about those fixed axes, Z first, then X, then Y (THREE.Euler order `"YXZ"`).
- A value is a **delta from the rest T pose**, read as if the parent bone were still at rest (plain
  forward kinematics). So a pose means the same thing on every Mixamo character, whatever its bone
  local axes: `Head: [-15, 0, 0]` is chin up 15 degrees on James, Abe or the Ninja.
- Mirror rule: swap Left and Right, keep x, negate y and z (and the hips offset x).

Cheat sheet (left side, the right side is the mirror):

| Bone | x | y | z |
|---|---|---|---|
| Spine, Spine1, Spine2, Neck, Head | + bends forward (chin down) | + turns to the character's left | + tilts toward the right |
| LeftShoulder (clavicle) | | + pulls the shoulder back | - drops it |
| LeftArm (rest along +X, palm down) | after z: - swings forward, + back | then: - across the body; on a hanging arm + turns the palm forward | first: - lowers to the side, + raises |
| LeftForeArm | - supinates (palm up once flexed) | - elbow flexion | |
| LeftHand | twist | - bends toward the thumb | - flexes toward the palm, + extends (fingers up) |
| Fingers | | | - curls (`hand("Left", 0..1)` does all five) |
| Legs (rest along -Y) | - lifts forward | turns about the leg | tilts sideways |

`NEUTRAL` is the arms hanging relaxed at the sides; `hand(side, curl)` gives a finger curl from open
(0) to a loose fist (1).

A **gesture**:

```ts
interface Gesture {
  name: string; source: string;   // the canon move it keys
  beats: number;                  // one cycle; a non looping gesture holds its last key until then
  loop: boolean;                  // closed: a key equal to the first pose is added at `beats` if missing
  mirror: boolean;                // alternates sides: the clip holds the keyed cycle then its mirror (2 x beats)
  layer: "upper" | "full";        // upper: spine, neck, head, arms, fingers only; hips and legs stay with the idle
  base?: Pose;                    // what a key leaves out (default NEUTRAL, then rest)
  keys: { at: number /* beats */; pose: Pose; ease?: "inOut" | "out" | "linear" | "snap" }[];
}
```

- The ease belongs to the segment arriving INTO a key: `inOut` (default) and `out` both land with zero
  velocity on the key's beat (`out` starts fast: a push that lands on the beat), `linear` keeps a
  constant pace (the `wave` helper builds smooth loops out of linear keys), `snap` holds the previous
  pose and jumps on the key.
- Only bones some key names get a track: a head only gesture leaves the arms to whatever plays under it.
- `gestureProblems(g)` lists what is wrong (keys out of order, unknown bone, an upper gesture keying the
  hips or legs, a mirror gesture whose first pose is not symmetric); `buildClip` throws on any.

**Building a clip**: `buildClip(gesture, bpm, rig, { mirror?, additive?, fps? })`.

- Beats become seconds (60 / bpm each). Eased segments are baked at 30 fps into linear
  `QuaternionKeyframeTrack`s (three has no smooth quaternion interpolation), a gesture keyed only with
  `snap` gets `InterpolateDiscrete` tracks, a hips offset becomes a `VectorKeyframeTrack` on the hips.
- Track names are the model's own node names (`mixamorig9LeftArm.quaternion`), so the mixer binds
  them directly, no retarget.
- `mirror: true` builds the mirrored variant (Left and Right tracks swapped, reflected rotations).
- `additive: true` makes the clip relative to the gesture's base pose (`NEUTRAL`), with
  `blendMode = AdditiveAnimationBlendMode`: a key equal to NEUTRAL adds nothing.
- Same arguments return the same clip object (cached per gesture, rig and tempo), so
  `mixer.clipAction` reuses its action instead of piling new ones up.

**The rig**: `rigFromObject(model)` on the object the `AnimationMixer` is built on (the gltf scene, the
`model` a `Fighter` receives, reachable later as `mixer.getRoot()`). It reads the rest pose from the
skin's bind matrices, so it is right even after the idle has moved the bones and after the Fighter
scaled the model; cached per model. A model with no Mixamo bone (the RobotExpressive fallback) gives a
rig with no bones and clips with no tracks: harmless, nothing moves.

**Tempo**: `retime(clip, fromBpm, toBpm)` returns a copy with every time scaled by fromBpm / toBpm.
Building at the new BPM does the same and is cached; `action.setEffectiveTimeScale(toBpm / fromBpm)`
retimes a playing action without a new clip.

**Mask**: `maskClip(clip, "upper" | "lower")` keeps the spine up, or the hips and legs, of any clip,
including the manifest's idle.

## The canon

Durations are one clip at 100 and 130 BPM. "Play as" is the recommended layer (see below).

| Gesture | Source move | Beats | 100 BPM | 130 BPM | Loop | Play as |
|---|---|---|---|---|---|---|
| `sixSevenHands` | The 67 hand gesture (genz canon 2.1): palms up, forearms see saw, one up as the other falls | 2 | 1.20 s | 0.92 s | yes | mask |
| `boatSweep` | Boat dance arm sweep (spec 3.1): hips to shoulder height and back, wrists leading, head leans into the sweep | 4 per sweep, clip 8 (alternates sides) | 4.80 s | 3.69 s | yes | mask |
| `palmPush` | Palm push (spec 3.2): palms forward, out landing on beat 1, back on beat 2 | 2 | 1.20 s | 0.92 s | yes | mask |
| `wristRoll` | Wrist roll (spec 3.3): hands circle at the wrists, elbows fixed | 2 | 1.20 s | 0.92 s | yes | mask |
| `reachAndPull` | Reach and pull (spec 3.4): right arm reaches palm up on beat 1, fist pulled to the chest on beat 2, holds | 3 | 1.80 s | 1.38 s | no | mask |
| `sigmaStare` | Sigma stare (genz canon 2.4): chin up 15, head 20 to the character's left over 2 beats, holds | 4 | 2.40 s | 1.85 s | no | additive |
| `chinUpTaunt` | Chin up taunt (spec 3.10): chest out, shoulders back, chin up by beat 1, holds 3 beats | 4 | 2.40 s | 1.85 s | no | additive |
| `lookBack` | Look back (spec 3.9): head and upper spine turn over the left shoulder by beat 1, hold 2 beats, return | 4 | 2.40 s | 1.85 s | no | additive |
| `chillGuyPockets` | Chill guy pockets (spec 3.8, genz canon 2.7): hands at the hip pockets, hips sway 2 cm, feet planted | 4 | 2.40 s | 1.85 s | yes | full (replaces the idle) |
| `shoulderBrush` | Shoulder brush (spec 3.13): right fingertips sweep over the left shoulder twice | 3 | 1.80 s | 1.38 s | no | mask |
| `cookedCollapse` | Cooked collapse (genz canon 2.15): upper body folds, head hangs, arms loose, by beat 0.75, holds | 2 | 1.20 s | 0.92 s | no | additive |

Every gesture has a mirrored variant (`{ mirror: true }`): `sigmaStare` and `lookBack` turn toward the
character's own left, use the mirror when the camera sits on the character's right; `reachAndPull` and
`shoulderBrush` use the right hand, the mirror uses the left.

## Playing them

Two ways to put an `upper` gesture over the idle; `full` gestures simply cross fade from the idle like
any manifest clip.

1. **Additive** (simplest, the idle keeps running untouched): build with `{ additive: true }` and play
   the action on top of the idle at weight 1. The gesture adds its delta from NEUTRAL to whatever the
   idle does, so the idle's breathing and bob stay alive under it. Exact for the head and spine moves;
   for the arm moves the hands land where the idle's arms put them plus the gesture, which can be off
   when the idle holds its arms far from hanging (the hip hop idle does).
2. **Per bone mask** (exact poses): fade the full idle out and, in its place, play
   `maskClip(idleClip, "lower")` synced with it (`lower.syncWith(idle)`), plus the gesture clip at
   weight 1. Hips and legs keep dancing, the upper body is exactly the gesture. Back to idle: the
   reverse cross fade. Use this for the arm moves, where palms and chest contact matter.

Timing: a key at beat N lands N beats after the action starts. To put `palmPush`'s push or
`reachAndPull`'s pull on a downbeat, start the action 1 (or 2) beats before it, or set
`action.time = beatsAlready * 60 / bpm`. The Fighter's mixer runs on the visual clock, so the drop
ramp slows a gesture with everything else.

Integration example (a method the main session could add to `Fighter`, additive path):

```ts
import { buildClip, rigFromObject, type Gesture } from "../anim/poses";
gesture(g: Gesture, bpm: number, mirror = false): THREE.AnimationAction {
  const rig = rigFromObject(this.mixer.getRoot() as THREE.Object3D);
  const clip = buildClip(g, bpm, rig, { mirror, additive: g.layer === "upper" });
  const a = this.mixer.clipAction(clip); // additive clip, additive action: the idle keeps playing
  a.setLoop(g.loop ? THREE.LoopRepeat : THREE.LoopOnce, Infinity);
  a.clampWhenFinished = !g.loop; // a one shot holds its last pose until faded out
  a.reset().setEffectiveWeight(1).fadeIn(0.1).play();
  return a; // stop with a.fadeOut(0.2); a full layer gesture goes through crossFadeFrom instead
}
```

For the mask path, the same method builds without `additive`, then
`const lower = this.mixer.clipAction(maskClip(idleAction.getClip(), "lower"));`
`lower.syncWith(idleAction).play(); idleAction.fadeOut(0.12); a.fadeIn(0.12).play();`.

## How it is checked

`tests/anim/` reads the real James rig from `assets/3d/characters/james_player_streetwear.glb` (bones
and inverse bind matrices, no loader, no DOM) and, for every gesture at 100 and 130 BPM: the duration,
unit quaternions and no NaN, `upper` gestures leaving hips and legs untouched, loops closing within 5
degrees on every bone, the mirror swapping Left and Right with the reflected rotation, every joint under
120 degrees, no elbow or wrist inside the torso over 32 samples, plus one check per move on what it
must read as (palms up for the 67, chin up 15 and turn 20 for the stare, fingertips crossing the left
shoulder twice for the brush, feet planted while the hips sway). `npx vitest run tests/anim`.
