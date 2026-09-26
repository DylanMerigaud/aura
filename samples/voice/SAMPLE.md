# Voice bake off sample

One announcer call (AURA FARMING) and one Ninja taunt (Navigo? Never heard of it.) per candidate, post processed (trim, atempo 1.08, slap reverb, compression, sub thump on the call). Judge gemini-3.1-pro-preview, 1 to 5, ship at 4 on every axis.

| file | role | model id | voice or direction | judge (energy, emotion, stereotype, genz) |
|---|---|---|---|---|
| sample/announcer-aura-farming-gemini-flash.mp3 | announcer | gemini-3.8-flash-tts | Fenrir, per line direction | E5 Em4 S5 G5 (mean 4.75) |
| sample/announcer-aura-farming-gemini-pro.mp3 | announcer | gemini-2.5-pro-preview-tts | Sadachbia, per line direction | E4 Em3 S2 G2 (mean 2.75) |
| sample/announcer-aura-farming-gradium.mp3 | announcer | gradium-default (voice design) | designed announcer-2 vox_emb_IcBdtT87hIHTiUX9 | E5 Em5 S5 G5 (mean 5) |
| sample/ninja-taunt-5-gemini-flash.mp3 | ninja | gemini-3.8-flash-tts | Algenib, per line direction | E4 Em5 S5 G4 (mean 4.5) |
| sample/ninja-taunt-5-gemini-pro.mp3 | ninja | gemini-2.5-pro-preview-tts | Algenib, per line direction | E3 Em4 S4 G3 (mean 3.5) |
| sample/ninja-taunt-5-gradium.mp3 | ninja | gradium-default (voice design) | designed ninja-3 vox_emb_fDfTMIAGrwZmE0jG | E3 Em4 S4 G3 (mean 3.5) |

Best candidate per role (mean over the sample): announcer gradium + gemini-flash, ninja gemini-flash

## Auditions (every voice option tried, the best per candidate is the row above)

| file | voice | judge |
|---|---|---|
| sample/audition/announcer-gradium-announcer.mp3 | designed announcer vox_emb_jbdpbSTR00bpsaFC | E2 Em2 S2 G2 (mean 2) |
| sample/audition/announcer-gradium-announcer-2.mp3 | designed announcer-2 vox_emb_IcBdtT87hIHTiUX9 | E5 Em5 S5 G5 (mean 5) |
| sample/audition/announcer-gradium-announcer-3.mp3 | designed announcer-3 vox_emb_WRnjwHGX1IVvkpkg | E4 Em3 S2 G2 (mean 2.75) |
| sample/audition/announcer-gemini-flash-Fenrir.mp3 | Fenrir | E5 Em4 S5 G5 (mean 4.75) |
| sample/audition/announcer-gemini-flash-Puck.mp3 | Puck | E3 Em3 S2 G2 (mean 2.5) |
| sample/audition/announcer-gemini-flash-Sadachbia.mp3 | Sadachbia | E4 Em3 S2 G2 (mean 2.75) |
| sample/audition/announcer-gemini-pro-Fenrir.mp3 | Fenrir | E2 Em2 S2 G2 (mean 2) |
| sample/audition/announcer-gemini-pro-Sadachbia.mp3 | Sadachbia | E4 Em3 S2 G2 (mean 2.75) |
| sample/audition/ninja-gradium-ninja.mp3 | designed ninja vox_emb_c38g9y2pYQ46QVfV | E3 Em3 S3 G2 (mean 2.75) |
| sample/audition/ninja-gradium-ninja-2.mp3 | designed ninja-2 vox_emb_bszuD31GnZDJ2pvd | E2 Em2 S3 G2 (mean 2.25) |
| sample/audition/ninja-gradium-ninja-3.mp3 | designed ninja-3 vox_emb_fDfTMIAGrwZmE0jG | E3 Em4 S4 G3 (mean 3.5) |
| sample/audition/ninja-gemini-flash-Algenib.mp3 | Algenib | E4 Em5 S5 G4 (mean 4.5) |
| sample/audition/ninja-gemini-flash-Zubenelgenubi.mp3 | Zubenelgenubi | E3 Em3 S3 G2 (mean 2.75) |
| sample/audition/ninja-gemini-flash-Umbriel.mp3 | Umbriel | E2 Em3 S3 G2 (mean 2.5) |
| sample/audition/ninja-gemini-pro-Algenib.mp3 | Algenib | E3 Em4 S4 G3 (mean 3.5) |
| sample/audition/ninja-gemini-pro-Zubenelgenubi.mp3 | Zubenelgenubi | E2 Em2 S3 G2 (mean 2.25) |
| sample/audition/ninja-gemini-pro-Umbriel.mp3 | Umbriel | E2 Em2 S3 G2 (mean 2.25) |
| sample/audition/announcer-gemini-pro-Puck.mp3 | Puck | E3 Em3 S2 G2 (mean 2.5) |
