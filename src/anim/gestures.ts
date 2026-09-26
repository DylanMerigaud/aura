// The aura farming canon keyed as gestures. Angles are character axes degrees (see poses.ts), timing is in
// beats so a level retimes them. Sources: docs/aura-farming-spec.md section 3 and docs/genz-canon-2026.md
// section 2 (the 2025 to 2026 moves). Every value stays under 120 degrees per joint and keeps the hands
// out of the torso (tests/anim/gestures.test.ts measures both on the James rig).
import { hand, mirrorPose, NEUTRAL, type Gesture, type Keyframe, type Pose, type Vec3 } from "./poses";

/** One pose for both sides: the left values as written, the right side mirrored. */
function both(left: Pose): Pose {
  return { ...left, ...mirrorPose(left) };
}

const lerp3 = (a: Vec3, b: Vec3, t: number): Vec3 => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];

/** n linear keys over one cycle, pose(phase) with phase 0 to 2 pi: a smooth, constant pace loop. */
function wave(beats: number, n: number, pose: (phase: number) => Pose): Keyframe[] {
  return Array.from({ length: n }, (_, i) => ({ at: (beats * i) / n, pose: pose((2 * Math.PI * i) / n), ease: "linear" as const }));
}

// 67 hand gesture (genz canon 2 move 1): palms up, forearms see saw, one rises as the other falls.
const SIX_UP: Pose = { LeftArm: [-38, -10, -80], LeftForeArm: [-95, -58, 0], LeftHand: [0, 0, 12] };
const SIX_DOWN: Pose = { LeftArm: [-30, -10, -80], LeftForeArm: [-95, -18, 0], LeftHand: [0, 0, -6] };
export const sixSevenHands: Gesture = {
  name: "sixSevenHands",
  source: "The 67 hand gesture (genz-canon-2026 section 2, move 1)",
  beats: 2,
  loop: true,
  mirror: false,
  layer: "upper",
  keys: [
    { at: 0, pose: { ...SIX_UP, ...mirrorPose(SIX_DOWN) } },
    { at: 1, pose: { ...SIX_DOWN, ...mirrorPose(SIX_UP) } },
  ],
};

// Boat dance slow symmetrical arm sweep (aura-farming-spec 3a move 1): hips to shoulder height and back,
// wrists leading, torso still; the head leans into the sweep, so the mirrored cycle alternates sides.
const SWEEP_LOW: Vec3 = [-20, 0, -72];
const SWEEP_HIGH: Vec3 = [0, -60, 0];
export const boatSweep: Gesture = {
  name: "boatSweep",
  source: "Slow symmetrical arm sweep, the boat dance (aura-farming-spec section 3, move 1)",
  beats: 4,
  loop: true,
  mirror: true,
  layer: "upper",
  keys: wave(4, 8, (ph) => {
    const lift = (1 - Math.cos(ph)) / 2;
    return {
      ...both({
        LeftArm: lerp3(SWEEP_LOW, SWEEP_HIGH, lift),
        LeftForeArm: [-20, -14, 0],
        // Wrist trails the arm: flexed on the way up, extended on the way down.
        LeftHand: [0, 0, -28 * Math.sin(ph)],
      }),
      Head: [0, 6 * lift, -5 * lift],
    };
  }),
};

// Palm push (aura-farming-spec 3a move 2): palms press out from the chest, elbows close, lands on the beat.
const PUSH_CHEST: Pose = both({ LeftArm: [-5, -20, -72], LeftForeArm: [60, -95, 0], LeftHand: [0, 18, 75] });
const PUSH_OUT: Pose = both({ LeftArm: [-65, -15, -82], LeftForeArm: [60, -22, 0], LeftHand: [0, 5, 75] });
export const palmPush: Gesture = {
  name: "palmPush",
  source: "Palm push (aura-farming-spec section 3, move 2)",
  beats: 2,
  loop: true,
  mirror: false,
  layer: "upper",
  keys: [
    { at: 0, pose: PUSH_CHEST },
    { at: 1, pose: PUSH_OUT, ease: "out" },
    { at: 2, pose: PUSH_CHEST, ease: "inOut" },
  ],
};

// Wrist roll (aura-farming-spec 3a move 3): forearms held in front, the hands circle at the wrists, elbows fixed.
export const wristRoll: Gesture = {
  name: "wristRoll",
  source: "Wrist roll / snake arms (aura-farming-spec section 3, move 3)",
  beats: 2,
  loop: true,
  mirror: false,
  layer: "upper",
  keys: wave(2, 8, (ph) =>
    both({
      LeftArm: [-50, -20, -70],
      LeftForeArm: [-30 + 18 * Math.sin(ph), -20, 0],
      LeftHand: [0, 28 * Math.cos(ph), 28 * Math.sin(ph)],
    }),
  ),
};

// Reach and pull (aura-farming-spec 3a move 4): the right arm reaches to the crowd palm up, then pulls
// sharply back to the chest in a fist, landing on beat 2, weight shifting back; holds, does not loop.
const REACH: Pose = {
  RightArm: [-78, 30, 65],
  RightForeArm: [-85, 2, 0],
  RightHand: [0, 0, 0],
  RightShoulder: [0, 8, 0],
  Spine2: [4, 0, 0],
  ...hand("Right", 0),
};
const PULL: Pose = {
  RightArm: [-15, 40, 85],
  RightForeArm: [-30, 75, 0],
  RightHand: [0, 0, 0],
  RightShoulder: [0, -6, 0],
  Spine2: [-6, 0, 0],
  ...hand("Right", 1),
};
export const reachAndPull: Gesture = {
  name: "reachAndPull",
  source: "Reach and pull (aura-farming-spec section 3, move 4)",
  beats: 3,
  loop: false,
  mirror: false,
  layer: "upper",
  keys: [
    { at: 0, pose: { ...hand("Right", 0.2) } },
    { at: 1, pose: REACH, ease: "inOut" },
    { at: 2, pose: PULL, ease: "out" },
  ],
};

// Sigma stare (genz canon 2 move 4, aura-farming-spec 3c move 17): chin up 15, head turns 20 toward
// the camera side (the character's left; the mirrored clip turns right) over 2 beats, then holds.
const STARE: Pose = { Neck: [-5, 8, 0], Head: [-10, 12, 0] };
export const sigmaStare: Gesture = {
  name: "sigmaStare",
  source: "Sigma stare into mewing chin point (genz-canon-2026 section 2, move 4)",
  beats: 4,
  loop: false,
  mirror: false,
  layer: "upper",
  keys: [
    { at: 0, pose: { Neck: [0, 0, 0], Head: [0, 0, 0] } },
    { at: 2, pose: STARE, ease: "inOut" },
  ],
};

// Chin up standing taunt (aura-farming-spec 3b move 10): chest out, shoulders back, chin up, arms relaxed, holds 3 beats.
const TAUNT: Pose = {
  Spine2: [-6, 0, 0],
  Neck: [-5, 0, 0],
  Head: [-12, 0, 0],
  ...both({ LeftShoulder: [0, 10, 0], LeftArm: NEUTRAL.LeftArm, LeftForeArm: NEUTRAL.LeftForeArm }),
};
export const chinUpTaunt: Gesture = {
  name: "chinUpTaunt",
  source: "Chin up stare / standing taunt (aura-farming-spec section 3, move 10)",
  beats: 4,
  loop: false,
  mirror: false,
  layer: "upper",
  keys: [
    { at: 0, pose: { Spine2: [0, 0, 0], Neck: [0, 0, 0], Head: [0, 0, 0], LeftShoulder: [0, 0, 0], RightShoulder: [0, 0, 0] } },
    { at: 1, pose: TAUNT, ease: "out" },
    { at: 4, pose: TAUNT, ease: "linear" },
  ],
};

// The look back (aura-farming-spec 3b move 9): head and upper spine turn over the left shoulder toward
// the camera, hold 2 beats, then return; torso below stays facing forward.
const LOOK: Pose = { Spine1: [0, 10, 0], Spine2: [0, 15, 0], Neck: [0, 20, 0], Head: [4, 25, -6] };
const FRONT: Pose = { Spine1: [0, 0, 0], Spine2: [0, 0, 0], Neck: [0, 0, 0], Head: [0, 0, 0] };
export const lookBack: Gesture = {
  name: "lookBack",
  source: "Over the shoulder look back (aura-farming-spec section 3, move 9)",
  beats: 4,
  loop: false,
  mirror: false,
  layer: "upper",
  keys: [
    { at: 0, pose: FRONT },
    { at: 1, pose: LOOK, ease: "out" },
    { at: 3, pose: LOOK, ease: "linear" },
    { at: 4, pose: FRONT, ease: "inOut" },
  ],
};

// Chill guy hands in pockets (aura-farming-spec 3b move 8, genz canon 2 move 7): arms down and a little
// back, hands at the hip pockets, a slow weight shift side to side. Full body: it replaces the idle.
const POCKETS: Pose = both({
  LeftArm: [8, -40, -84],
  LeftForeArm: [0, -32, 0],
  LeftHand: [0, 0, -20],
  ...hand("Left", 0.45),
});
/**
 * Hips shifted `d` meters to the left with a matching roll; the legs lean back onto the planted feet
 * (Mixamo hip joint 6.5 cm below the hips, hip to ankle 0.77 m) and the feet stay flat.
 */
function sway(d: number): Pose {
  const roll = d * 75; // 2 cm, 1.5 degrees
  const shift = d + 0.065 * Math.sin((roll * Math.PI) / 180);
  const lean = (Math.atan2(shift, 0.77) * 180) / Math.PI;
  return {
    hipsOffset: [d, 0, 0],
    Hips: [0, 0, roll],
    Spine: [0, 0, -roll * 0.8],
    Head: [0, 0, -roll * 0.4],
    LeftUpLeg: [0, 0, -roll - lean],
    RightUpLeg: [0, 0, -roll - lean],
    LeftFoot: [0, 0, lean],
    RightFoot: [0, 0, lean],
  };
}
export const chillGuyPockets: Gesture = {
  name: "chillGuyPockets",
  source: "Chill guy hands in pockets (aura-farming-spec section 3, move 8; genz-canon-2026 section 2, move 7)",
  beats: 4,
  loop: true,
  mirror: false,
  layer: "full",
  keys: [
    { at: 0, pose: { ...POCKETS, ...sway(0.02) } },
    { at: 2, pose: { ...POCKETS, ...sway(-0.02) } },
  ],
};

// Shoulder brush (aura-farming-spec 3b move 13): the right hand brushes the left shoulder twice, quick.
const BRUSH_IN: Pose = { RightArm: [-15, 60, 50], RightForeArm: [0, 108, 0], RightHand: [0, 10, 20], ...hand("Right", 0.1) };
const BRUSH_OUT: Pose = { RightArm: [-25, 60, 85], RightForeArm: [0, 96, 0], RightHand: [0, -10, 40], ...hand("Right", 0.1) };
export const shoulderBrush: Gesture = {
  name: "shoulderBrush",
  source: "Shoulder brush / collar pop (aura-farming-spec section 3, move 13)",
  beats: 3,
  loop: false,
  mirror: false,
  layer: "upper",
  keys: [
    { at: 0, pose: {} },
    { at: 0.75, pose: BRUSH_IN, ease: "inOut" },
    { at: 1.25, pose: BRUSH_OUT, ease: "out" },
    { at: 1.5, pose: BRUSH_IN, ease: "inOut" },
    { at: 2, pose: BRUSH_OUT, ease: "out" },
    { at: 3, pose: { RightArm: NEUTRAL.RightArm, RightForeArm: NEUTRAL.RightForeArm }, ease: "inOut" },
  ],
};

// The cooked collapse (genz canon 2 move 15): the upper body folds forward, shoulders drop, head hangs,
// arms loose; collapses fast, holds, does not loop. Knees stay with the idle (upper layer).
export const cookedCollapse: Gesture = {
  name: "cookedCollapse",
  source: "The cooked collapse (genz-canon-2026 section 2, move 15)",
  beats: 2,
  loop: false,
  mirror: false,
  layer: "upper",
  keys: [
    { at: 0, pose: { Spine: [0, 0, 0], Spine1: [0, 0, 0], Spine2: [0, 0, 0], Neck: [0, 0, 0], Head: [0, 0, 0] } },
    {
      at: 0.75,
      ease: "out",
      pose: {
        Spine: [12, 0, 0],
        Spine1: [12, 0, 0],
        Spine2: [10, 0, 0],
        Neck: [14, 0, 0],
        Head: [22, 0, 4],
        ...both({ LeftShoulder: [0, 0, -10], LeftArm: [-28, 0, -84], LeftForeArm: [0, -18, 0], ...hand("Left", 0.25) }),
      },
    },
  ],
};

/** Every canon gesture by name. */
export const GESTURES: Record<string, Gesture> = {
  sixSevenHands,
  boatSweep,
  palmPush,
  wristRoll,
  reachAndPull,
  sigmaStare,
  chinUpTaunt,
  lookBack,
  chillGuyPockets,
  shoulderBrush,
  cookedCollapse,
};
