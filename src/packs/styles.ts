// The pack overlay stylesheet, injected once. Animations touch transform and opacity only.
export const PACK_CSS = `
.ap-root{position:fixed;inset:0;z-index:2147483000;display:flex;align-items:center;justify-content:center;overflow:hidden;
  font-family:"Anton","Bebas Neue","Impact","Futura-CondensedExtraBold","AvenirNextCondensed-Heavy","Haettenschweiler","Arial Narrow Bold",sans-serif;
  font-stretch:condensed;font-weight:900;font-synthesis:none;
  color:#fff;user-select:none;-webkit-user-select:none;-webkit-tap-highlight-color:transparent;touch-action:manipulation;cursor:pointer;
  background:radial-gradient(120% 90% at 50% 45%,#2a0f4d 0%,#12062a 45%,#050208 100%);opacity:0;transition:opacity .18s ease-out;
  --cw:min(24vw,36vh);--ch:calc(var(--cw)*1.4)}
.ap-root.ap-in{opacity:1}
.ap-root.ap-out{opacity:0;transition:opacity .22s ease-in}
.ap-root *{box-sizing:border-box}
.ap-bgrays{position:absolute;left:50%;top:50%;width:160vmax;height:160vmax;margin:-80vmax 0 0 -80vmax;pointer-events:none;opacity:.22;
  background:repeating-conic-gradient(from 0deg,rgba(186,120,255,.55) 0deg 6deg,transparent 6deg 18deg);
  -webkit-mask:radial-gradient(circle,#000 0%,transparent 55%);mask:radial-gradient(circle,#000 0%,transparent 55%);
  animation:ap-spin 40s linear infinite}
.ap-shake{animation:ap-screenshake .5s cubic-bezier(.36,.07,.19,.97)}
.ap-stage{position:relative;width:100%;height:100%;display:flex;align-items:center;justify-content:center;perspective:1100px;
  transform-style:preserve-3d}
.ap-tilt{position:relative;width:100%;height:100%;display:flex;align-items:center;justify-content:center;transform-style:preserve-3d;
  transform:rotateX(var(--ap-ry,0deg)) rotateY(var(--ap-rx,0deg));transition:transform .6s cubic-bezier(.2,.8,.2,1)}
.ap-hint{position:absolute;left:0;right:0;bottom:7vh;text-align:center;font-size:clamp(18px,3.4vh,30px);letter-spacing:.14em;
  text-shadow:0 0 18px rgba(200,140,255,.9);animation:ap-pulse 1.3s ease-in-out infinite;pointer-events:none;transition:opacity .15s}
.ap-title{position:absolute;left:0;right:0;top:5vh;text-align:center;font-size:clamp(22px,5vh,48px);letter-spacing:.06em;line-height:1;
  text-shadow:0 4px 0 #3b0d6e,0 0 26px rgba(190,110,255,.85);pointer-events:none;transition:opacity .2s}
.ap-title small{display:block;font-size:.42em;letter-spacing:.3em;opacity:.75;margin-top:.5em}

/* the pack */
.ap-pack{position:absolute;left:50%;top:50%;width:calc(var(--cw)*1.05);height:calc(var(--ch)*1.12);margin:calc(var(--ch)*-.56) 0 0 calc(var(--cw)*-.525);
  transform-style:preserve-3d;animation:ap-drop .5s cubic-bezier(.2,1.4,.4,1) both}
.ap-pack-body{position:absolute;inset:0;animation:ap-bob 2.4s ease-in-out .5s infinite;transform-style:preserve-3d}
.ap-pack-half{position:absolute;left:0;right:0;overflow:hidden;border-radius:22px;
  background:linear-gradient(155deg,#ff4fd8 0%,#8b2cff 38%,#2b0a7a 70%,#ffcf3a 130%);
  box-shadow:inset 0 0 0 3px rgba(255,255,255,.35),inset 0 -30px 60px rgba(0,0,0,.35)}
.ap-pack-top{top:0;height:18%;border-radius:22px 22px 6px 6px;background-size:100% 556%;background-position:0 0;transition:transform .45s cubic-bezier(.3,.6,.3,1),opacity .45s}
.ap-pack-bottom{top:18%;bottom:0;border-radius:6px 6px 22px 22px;background-size:100% 122%;background-position:0 100%;transition:transform .35s ease-in,opacity .35s}
.ap-pack-top::after{content:"";position:absolute;left:4%;right:4%;bottom:0;height:0;border-bottom:3px dashed rgba(255,255,255,.55)}
.ap-pack-shine{position:absolute;inset:0;overflow:hidden;border-radius:inherit;pointer-events:none}
.ap-pack-shine::before{content:"";position:absolute;top:-20%;bottom:-20%;left:-60%;width:45%;
  background:linear-gradient(100deg,transparent,rgba(255,255,255,.55),transparent);transform:translateX(0) skewX(-12deg);
  animation:ap-sweep 2.2s ease-in-out infinite}
.ap-pack-label{position:absolute;left:0;right:0;top:26%;text-align:center;line-height:.9;pointer-events:none}
.ap-pack-label b{display:block;font-size:calc(var(--cw)*.36);letter-spacing:.02em;text-shadow:0 5px 0 rgba(40,0,80,.6),0 0 30px #fff}
.ap-pack-label span{display:block;font-size:calc(var(--cw)*.12);letter-spacing:.3em;opacity:.9;margin-top:.4em}
.ap-pack-count{position:absolute;right:-6%;top:-5%;width:calc(var(--cw)*.3);height:calc(var(--cw)*.3);border-radius:50%;display:flex;align-items:center;
  justify-content:center;font-size:calc(var(--cw)*.15);background:#ffcf3a;color:#2a0a00;box-shadow:0 0 0 4px #fff,0 8px 20px rgba(0,0,0,.5);
  transform:rotate(12deg)}
.ap-pack-glow{position:absolute;inset:-40%;border-radius:50%;pointer-events:none;
  background:radial-gradient(circle,rgba(220,120,255,.65) 0%,rgba(140,40,255,.25) 35%,transparent 65%);animation:ap-glow 1.6s ease-in-out infinite}
.ap-torn .ap-pack-top{transform:translate3d(8%,-80vh,0) rotate(-38deg);opacity:0}
.ap-torn .ap-pack-bottom{transform:translate3d(0,14vh,0) scale(.7);opacity:0}
.ap-torn .ap-pack-body{animation:none}
.ap-torn .ap-pack-glow{animation:ap-burst .45s ease-out forwards}
.ap-torn .ap-pack-count{opacity:0;transition:opacity .1s}

/* the 3 frame flash */
.ap-flash{position:absolute;inset:0;background:#fff;opacity:0;pointer-events:none;z-index:5}
.ap-flash.ap-go{animation:ap-flash3 .1s steps(3,end) forwards}
.ap-flash.ap-go-big{background:radial-gradient(circle,#fff 30%,#ff2340 120%);animation:ap-flashbig .9s ease-out forwards}

/* cards */
.ap-slot{position:absolute;left:50%;top:50%;width:var(--cw);height:var(--ch);margin:calc(var(--ch)*-.5) 0 0 calc(var(--cw)*-.5);
  transform:translate3d(0,0,0) scale(.25) rotate(var(--ap-r0,0deg));opacity:0;
  transition:transform .5s cubic-bezier(.2,1.35,.35,1),opacity .2s;transform-style:preserve-3d;cursor:pointer}
.ap-slot.ap-out-card{transform:translate3d(var(--ap-x),var(--ap-y,0px),0) scale(1) rotate(0deg);opacity:1}
.ap-rays{position:absolute;left:50%;top:50%;width:calc(var(--cw)*3.2);height:calc(var(--cw)*3.2);margin:calc(var(--cw)*-1.6) 0 0 calc(var(--cw)*-1.6);
  pointer-events:none;opacity:0;transform:translateZ(-2px) scale(.2);transition:opacity .3s,transform .6s cubic-bezier(.2,1.2,.3,1);
  -webkit-mask:radial-gradient(circle,#000 18%,transparent 62%);mask:radial-gradient(circle,#000 18%,transparent 62%)}
.ap-rays::before{content:"";position:absolute;inset:0;border-radius:50%;
  background:repeating-conic-gradient(from 0deg,var(--ap-c) 0deg 9deg,transparent 9deg 24deg);animation:ap-spin 7s linear infinite}
.ap-slot.ap-revealed .ap-rays{opacity:.85;transform:translateZ(-2px) scale(1)}
.ap-slot.ap-r-common.ap-revealed .ap-rays{opacity:.3}
.ap-leak{position:absolute;inset:-18%;border-radius:30px;pointer-events:none;opacity:0;
  background:radial-gradient(closest-side,var(--ap-g) 0%,transparent 100%);transition:opacity .25s}
.ap-slot.ap-tease .ap-leak{opacity:.9}
.ap-slot.ap-tease .ap-card{animation:ap-tease .09s linear infinite alternate}
.ap-card{position:absolute;inset:0;transform-style:preserve-3d;transition:transform .55s cubic-bezier(.3,1.3,.4,1)}
.ap-slot.ap-revealed .ap-card{transform:rotateY(180deg)}
.ap-slot.ap-pop .ap-card{animation:ap-cardpop .35s ease-out}
.ap-face{position:absolute;inset:0;border-radius:calc(var(--cw)*.1);backface-visibility:hidden;-webkit-backface-visibility:hidden;overflow:hidden;
  box-shadow:0 18px 40px rgba(0,0,0,.55),inset 0 0 0 3px rgba(255,255,255,.28)}
.ap-back{background:radial-gradient(circle at 50% 38%,#6a2bd6 0%,#2b0a6a 55%,#12052e 100%);display:flex;align-items:center;justify-content:center}
.ap-back::before{content:"";position:absolute;inset:7%;border-radius:calc(var(--cw)*.07);border:2px solid rgba(255,255,255,.25)}
.ap-back b{font-size:calc(var(--cw)*.3);letter-spacing:.04em;color:#fff;text-shadow:0 0 22px #c68bff;transform:rotate(-8deg)}
.ap-front{transform:rotateY(180deg);display:flex;flex-direction:column;align-items:center;justify-content:space-between;
  padding:calc(var(--cw)*.07) calc(var(--cw)*.07) calc(var(--cw)*.08);background:linear-gradient(165deg,var(--ap-g) -20%,var(--ap-c) 38%,#0b0414 115%)}
.ap-front::after{content:"";position:absolute;top:-30%;bottom:-30%;left:-70%;width:40%;pointer-events:none;
  background:linear-gradient(100deg,transparent,rgba(255,255,255,.45),transparent);transform:skewX(-14deg)}
.ap-slot.ap-revealed .ap-front::after{animation:ap-foil 1.1s ease-out .25s}
.ap-r-legendary .ap-front::after,.ap-r-unfathomable .ap-front::after{animation:ap-foil 2.4s ease-in-out infinite!important}
.ap-rar{align-self:stretch;display:flex;justify-content:space-between;align-items:center;font-size:calc(var(--cw)*.085);letter-spacing:.14em;
  text-shadow:0 2px 0 rgba(0,0,0,.35)}
.ap-kind{font-size:.8em;padding:.2em .5em;border-radius:99px;background:rgba(0,0,0,.35);letter-spacing:.12em}
.ap-icon{width:62%;flex:1 1 auto;min-height:0;display:flex;align-items:center;justify-content:center;filter:drop-shadow(0 6px 0 rgba(0,0,0,.3))}
.ap-icon svg{width:100%;height:100%}
.ap-name{font-size:calc(var(--cw)*.15);line-height:.95;text-align:center;letter-spacing:.01em;text-transform:uppercase;
  text-shadow:0 3px 0 rgba(0,0,0,.45);max-width:100%;overflow-wrap:anywhere}
.ap-flavor{font-family:system-ui,-apple-system,"Segoe UI",sans-serif;font-stretch:normal;font-weight:600;font-size:calc(var(--cw)*.058);
  line-height:1.2;text-align:center;opacity:.88;margin-top:.45em;min-height:2.4em}
.ap-new{position:absolute;right:-9%;top:-6%;z-index:3;padding:.15em .5em;font-size:calc(var(--cw)*.12);background:#ffe600;color:#1a0033;
  border-radius:10px;box-shadow:0 0 0 3px #fff,0 6px 16px rgba(0,0,0,.5);transform:translateZ(2px) rotate(14deg) scale(0);transition:transform .3s cubic-bezier(.2,1.8,.4,1)}
.ap-slot.ap-show-tag .ap-new{transform:translateZ(2px) rotate(14deg) scale(1)}
.ap-dupe{position:absolute;left:50%;bottom:-8%;z-index:3;white-space:nowrap;padding:.25em .7em;font-size:calc(var(--cw)*.075);letter-spacing:.08em;
  background:#1a0636;color:#e7c8ff;border-radius:99px;box-shadow:0 0 0 2px #b77bff;transform:translateZ(2px) translateX(-50%) scale(0);transition:transform .3s cubic-bezier(.2,1.8,.4,1)}
.ap-slot.ap-show-tag .ap-dupe{transform:translateZ(2px) translateX(-50%) scale(1)}
.ap-equipped{position:absolute;left:50%;top:-7%;z-index:3;padding:.2em .6em;font-size:calc(var(--cw)*.07);letter-spacing:.14em;background:#fff;color:#12052e;
  border-radius:99px;transform:translateZ(2px) translateX(-50%) scale(0);transition:transform .25s cubic-bezier(.2,1.8,.4,1)}
.ap-slot.ap-is-equipped .ap-equipped{transform:translateZ(2px) translateX(-50%) scale(1)}

/* confetti */
.ap-confetti{position:absolute;left:50%;top:50%;width:0;height:0;pointer-events:none;z-index:4}
.ap-bit{position:absolute;left:0;top:0;width:9px;height:14px;margin:-7px 0 0 -4px;border-radius:2px;background:var(--c);
  transform:translate3d(0,0,0);animation:ap-bit var(--d,1s) cubic-bezier(.15,.7,.35,1) forwards}

/* summary */
.ap-sum{position:absolute;left:50%;bottom:4vh;width:min(560px,86vw);transform:translate3d(-50%,40px,0);opacity:0;
  transition:transform .35s cubic-bezier(.2,1.3,.4,1),opacity .25s;pointer-events:none;text-align:center;z-index:6}
.ap-sum.ap-on{transform:translate3d(-50%,0,0);opacity:1;pointer-events:auto}
.ap-pass-row{display:flex;justify-content:space-between;align-items:baseline;font-size:clamp(14px,2.6vh,22px);letter-spacing:.12em;margin-bottom:.35em}
.ap-pass-row em{font-style:normal;color:#ffd84a}
.ap-bar{position:relative;height:clamp(12px,2.2vh,18px);border-radius:99px;background:rgba(255,255,255,.12);overflow:hidden;
  box-shadow:inset 0 0 0 2px rgba(255,255,255,.2)}
.ap-fill{position:absolute;inset:0;transform-origin:0 50%;transform:scaleX(0);transition:transform .7s cubic-bezier(.3,.9,.3,1);
  background:linear-gradient(90deg,#8b2cff,#ff4fd8,#ffd84a)}
.ap-fill.ap-snap{transition:none}
.ap-tierup{margin-top:.5em;font-size:clamp(16px,3vh,26px);letter-spacing:.08em;color:#ffd84a;text-shadow:0 0 16px rgba(255,200,40,.8);
  transform:scale(0);transition:transform .3s cubic-bezier(.2,1.8,.4,1);height:1.3em}
.ap-tierup.ap-on{transform:scale(1)}
.ap-btn{margin-top:.7em;font:inherit;font-size:clamp(18px,3.4vh,28px);letter-spacing:.14em;color:#12052e;background:#fff;border:0;border-radius:99px;
  padding:.35em 1.6em;cursor:pointer;box-shadow:0 6px 0 #b77bff,0 0 30px rgba(200,140,255,.7);transition:transform .08s}
.ap-btn:active{transform:translateY(3px)}
.ap-btn:focus-visible{outline:3px solid #ffd84a;outline-offset:3px}
.ap-tip{font-family:system-ui,-apple-system,sans-serif;font-stretch:normal;font-size:clamp(11px,1.7vh,14px);opacity:.65;margin-top:.5em;letter-spacing:.02em}
.ap-summary-mode .ap-title{opacity:0}
.ap-callout{position:absolute;left:0;right:0;top:50%;margin-top:-.6em;text-align:center;font-size:clamp(40px,13vh,120px);line-height:1.2;
  letter-spacing:.04em;color:var(--ap-c);pointer-events:none;z-index:7;opacity:0;
  text-shadow:0 0 30px var(--ap-g),0 6px 0 rgba(0,0,0,.5)}
.ap-callout.ap-go{animation:ap-slam 1.1s cubic-bezier(.2,1,.3,1) forwards}
@keyframes ap-slam{0%{opacity:0;transform:scale(2.4) rotate(-4deg)}14%{opacity:1;transform:scale(.95) rotate(-4deg)}
  22%{transform:scale(1.04) rotate(-4deg)}70%{opacity:1;transform:scale(1) rotate(-4deg)}100%{opacity:0;transform:scale(1.15) rotate(-4deg)}}
.ap-stage{transition:transform .45s cubic-bezier(.2,1,.3,1)}
.ap-summary-mode .ap-stage{transform:translate3d(0,-9vh,0) scale(.9)}
@media (max-height:430px){.ap-tip{display:none}.ap-tierup{height:1.1em;margin-top:.25em}.ap-btn{margin-top:.35em}}

@keyframes ap-spin{to{transform:rotate(360deg)}}
@keyframes ap-pulse{0%,100%{opacity:.55;transform:scale(1)}50%{opacity:1;transform:scale(1.05)}}
@keyframes ap-drop{0%{transform:translate3d(0,-60vh,0) rotate(-14deg) scale(.6);opacity:0}100%{transform:none;opacity:1}}
@keyframes ap-bob{0%,100%{transform:translate3d(0,0,0) rotate(-2deg)}50%{transform:translate3d(0,-2.2vh,0) rotate(2deg)}}
@keyframes ap-sweep{0%{transform:translateX(0) skewX(-12deg)}60%,100%{transform:translateX(420%) skewX(-12deg)}}
@keyframes ap-glow{0%,100%{opacity:.55;transform:scale(.92)}50%{opacity:1;transform:scale(1.06)}}
@keyframes ap-burst{0%{opacity:1;transform:scale(1)}100%{opacity:0;transform:scale(2.6)}}
@keyframes ap-flash3{0%{opacity:1}100%{opacity:0}}
@keyframes ap-flashbig{0%{opacity:1}20%{opacity:.95}100%{opacity:0}}
@keyframes ap-tease{0%{transform:translate3d(-3px,1px,0) rotate(-1.4deg)}100%{transform:translate3d(3px,-1px,0) rotate(1.4deg)}}
@keyframes ap-cardpop{0%{transform:rotateY(180deg) scale(1)}40%{transform:rotateY(180deg) scale(1.12)}100%{transform:rotateY(180deg) scale(1)}}
@keyframes ap-foil{0%{transform:translateX(0) skewX(-14deg)}100%{transform:translateX(560%) skewX(-14deg)}}
@keyframes ap-bit{0%{transform:translate3d(0,0,0) rotate(0) scale(1);opacity:1}
  100%{transform:translate3d(var(--x),var(--y),0) rotate(var(--r)) scale(.6);opacity:0}}
@keyframes ap-screenshake{10%,90%{transform:translate3d(-2px,1px,0)}20%,80%{transform:translate3d(5px,-2px,0)}
  30%,50%,70%{transform:translate3d(-9px,3px,0)}40%,60%{transform:translate3d(9px,-3px,0)}}
@media (prefers-reduced-motion:reduce){
  .ap-bgrays,.ap-rays::before,.ap-pack-body,.ap-pack-shine::before,.ap-hint{animation:none!important}
  .ap-shake{animation:none}
}
/* debug panel */
.ap-debug{position:fixed;left:8px;bottom:8px;z-index:2147482999;display:flex;flex-wrap:wrap;gap:4px;max-width:340px;padding:6px;border-radius:10px;
  background:rgba(10,4,20,.85);color:#e7c8ff;font:12px/1.3 ui-monospace,Menlo,monospace}
.ap-debug button{font:inherit;color:#12052e;background:#e7c8ff;border:0;border-radius:6px;padding:3px 7px;cursor:pointer}
.ap-debug pre{margin:2px 0 0;width:100%;white-space:pre-wrap;font:inherit}
`;
