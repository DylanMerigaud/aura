# Mocap clips vs keyed gestures

Side by side list for a human comparison of the three own capture mocap clips (`assets/3d/mocap/*.glb`,
described in `assets/3d/mocap/manifest.json`) and the keyed canon gestures of `src/anim/gestures.ts`.
Open `index.html` from a static server at the repo root (`npx serve .`, then `/samples/anim/`) for the
same table with links to the files; nothing here is part of the build.

## Pairs (same canon move)

| Canon move | Mocap clip (event, fps) | Keyed gesture (beats, layer, loop) |
| --- | --- | --- |
| Boat dance arm sweep (spec 3, move 1) | `mocap/boat_arm_sweep.glb` (hit_right, 15 fps) | `boatSweep` (4, upper, loop) |
| Over the shoulder look back (spec 3, move 9) | `mocap/over_shoulder_look.glb` (hit_up, 17.72 fps) | `lookBack` (4, upper, once) |
| Chin up stare (spec 3, move 10) | `mocap/chinup_stare.glb` (hit_down, 15.34 fps) | `chinUpTaunt` (4, upper, once), also `sigmaStare` (4, upper, once) |

What to look at: the mocap carries forearm jitter (boat sweep), whole body turns where the canon wants
a head only glance (look back) and incidental raised arms (chin up); the keyed versions are clean but
stylized. The mocap manifest's `quality` field lists each clip's known defects.

## Keyed gestures with no mocap counterpart

| Gesture | Source | Beats | Layer | Loop |
| --- | --- | --- | --- | --- |
| `sixSevenHands` | genz-canon-2026 section 2, move 1 | 2 | upper | yes |
| `palmPush` | aura-farming-spec section 3, move 2 | 2 | upper | yes |
| `wristRoll` | aura-farming-spec section 3, move 3 | 2 | upper | yes |
| `reachAndPull` | aura-farming-spec section 3, move 4 | 3 | upper | no |
| `chillGuyPockets` | aura-farming-spec section 3, move 8 | 4 | full | yes |
| `shoulderBrush` | aura-farming-spec section 3, move 13 | 3 | upper | no |
| `cookedCollapse` | genz-canon-2026 section 2, move 15 | 2 | upper | no |
