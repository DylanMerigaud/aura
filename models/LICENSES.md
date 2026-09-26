# Asset licenses

All characters and most animations in this pack come from Adobe Mixamo (https://www.mixamo.com), downloaded through a logged in Mixamo account and converted from FBX to glb locally. The three clips under `mocap/` are the one exception: our own motion capture, listed in their own section below.

Adobe's own FAQ (https://helpx.adobe.com/creative-cloud/faq/mixamo-faq.html, "What type of projects can I create with Mixamo?") states: "You can use both characters and animations royalty free for personal, commercial, and non-profit projects including: Incorporate characters into illustrations and graphic art. 3D print characters. Create films. Create video games." This covers AURA's use as a game asset, commercial or not, with no attribution requirement and no per-asset fee.

One line per source file below, all Mixamo, same license as stated above.

## Characters

- characters/mannequin_player.glb, Mixamo "Mannequin", https://www.mixamo.com
- characters/ninja_enemy.glb, Mixamo "Ninja", https://www.mixamo.com
- characters/kaya_crowd.glb, Mixamo "Kaya", https://www.mixamo.com
- characters/james_player_streetwear.glb, Mixamo "James", https://www.mixamo.com
- characters/abe_enemy_elder.glb, Mixamo "Abe", https://www.mixamo.com
- characters/sophie_crowd_casual.glb, Mixamo "Sophie", https://www.mixamo.com
- characters/sportygranny_crowd_older.glb, Mixamo "Sporty Granny", https://www.mixamo.com
- characters/michelle_crowd_darker.glb, Mixamo "Michelle", https://www.mixamo.com
- characters/elizabeth_crowd_darker.glb, Mixamo "Elizabeth", https://www.mixamo.com
- characters/adam_crowd_sporty.glb, Mixamo "Adam", https://www.mixamo.com
- characters/josh_crowd_jacket.glb, Mixamo "Josh", https://www.mixamo.com

## Animation clips

- anims/pose_looking_around.glb, Mixamo "Looking Around" (Idle Stand Looking Around), https://www.mixamo.com
- anims/hit_up_hiphop_kickstep.glb, Mixamo "Hip Hop Dancing" (Kick Step Range), https://www.mixamo.com
- anims/boat_wave_hiphop.glb, Mixamo "Wave Hip Hop Dance" (Variation One), https://www.mixamo.com
- anims/hit_right_runningman.glb, Mixamo "Dancing Running Man", https://www.mixamo.com
- anims/boat_snake_hiphop.glb, Mixamo "Snake Hip Hop Dance", https://www.mixamo.com
- anims/hit_left_housedance.glb, Mixamo "House Dancing" (Variation Two), https://www.mixamo.com
- anims/pose_taunt_chinup.glb, Mixamo "Taunt" (Boxing Taunt), https://www.mixamo.com
- anims/hit_down_hiphop.glb, Mixamo "Hip Hop Dancing", https://www.mixamo.com
- anims/mash_charge_twerk.glb, Mixamo "Dancing Twerk", https://www.mixamo.com
- anims/boat_arms_hiphop.glb, Mixamo "Arms Hip Hop Dance" (Hip Hop Dancing With Arms), https://www.mixamo.com
- anims/boat_locking_hiphop.glb, Mixamo "Locking Hip Hop Dance" (Variation Two), https://www.mixamo.com
- anims/release_backflip.glb, Mixamo "Backflip" (Standing Backflip), https://www.mixamo.com
- anims/hold_freeze_breakdance.glb, Mixamo "Breakdance Freeze Var 1" (Single Handstand Freeze), https://www.mixamo.com
- anims/miss_cringe_stumble.glb, Mixamo "Stumble Backwards" (Slip And Fall Backwards), https://www.mixamo.com
- anims/defeat.glb, Mixamo "Defeated", https://www.mixamo.com
- anims/victory.glb, Mixamo "Victory" (Victory From A Boxing Win), https://www.mixamo.com
- anims/celebration_siuuu_jump.glb, Mixamo "Joyful Jump" (Ecstatic Jumping With Both Legs And Arms), https://www.mixamo.com
- anims/boat_rumba_sway.glb, Mixamo "Rumba Dancing" (Female Rumba Dancing, Loop), https://www.mixamo.com
- anims/idle_groove_hiphop.glb, Mixamo "Hip Hop Dancing" (Just Listening Dancing Variation), https://www.mixamo.com
- anims/enemy_idle.glb, Mixamo "Standing Idle", https://www.mixamo.com
- anims/enemy_taunt.glb, Mixamo "Taunt" (Flexing Muscles), https://www.mixamo.com
- anims/enemy_hit.glb, Mixamo "Hit Reaction", https://www.mixamo.com
- anims/enemy_big_hit.glb, Mixamo "Knocked Out" (Falling To Back), https://www.mixamo.com
- anims/enemy_cringe.glb, Mixamo "Shoved Reaction With Spin", https://www.mixamo.com
- anims/enemy_victory.glb, Mixamo "Victory Idle" (Big Vegas Victory Idle), https://www.mixamo.com
- anims/crowd_cheer.glb, Mixamo "Cheering" (Male Cheering With Two Fists Pump), https://www.mixamo.com
- anims/crowd_clap.glb, Mixamo "Clapping" (Clap While Standing), https://www.mixamo.com
- anims/crowd_jump_excited.glb, Mixamo "Excited" (Super Excited), https://www.mixamo.com
- anims/crowd_idle.glb, Mixamo "Happy Idle" (Variation 1), https://www.mixamo.com
- anims/walk_catwalk_strut.glb, Mixamo "Catwalk Walk Forward HighKnees" (In Place), https://www.mixamo.com
- anims/crowd_bounce_bboy.glb, Mixamo "Bboy Hip Hop Move" (Variation One), https://www.mixamo.com

## Motion capture clips (our own capture)

- mocap/boat_arm_sweep.glb, mocap/over_shoulder_look.glb, mocap/chinup_stare.glb: our own motion capture, not Mixamo. Real reference footage (the original Pacu Jalur boat dancer TikTok and two real aura-battle recreation TikToks, credited in `mocap/manifest.json`'s `source` field per clip) run through MediaPipe Pose to extract 3D body landmarks, retargeted by hand onto the `mixamorig:` bone names and rest pose of `characters/mannequin_player.glb`. The reference video files themselves were never copied into this repo, only the motion (joint rotations) derived from them, on our own rig. See `mocap/manifest.json` for the `quality` note on each clip (jitter, approximation, what is and is not animated).

## Notes

- All characters downloaded "with skin", FBX Binary, then resized to 512x512 textures during glb conversion to fit the size budget (a purely technical resize, license unaffected). Two characters (adam_crowd_sporty.glb, sportygranny_crowd_older.glb) also got webp texture compression on top to clear the 4 MB cap, same technical note.
- All animation clips downloaded "without skin", FBX Binary, 30 fps, no keyframe reduction, then converted to glb (no mesh, rig and curves only, same Mixamo skeleton as the three characters).
- No commercial license was purchased and none was needed: Mixamo access itself is free, and the FAQ line above confirms royalty free use with no attribution requirement.
