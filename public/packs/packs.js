"use strict";(()=>{var _e=Object.defineProperty;var Ne=(a,e,t)=>e in a?_e(a,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):a[e]=t;var z=(a,e,t)=>Ne(a,typeof e!="symbol"?e+"":e,t);var T=["common","rare","epic","legendary","unfathomable"],j={common:60,rare:25,epic:10,legendary:4,unfathomable:1},G={common:10,rare:25,epic:60,legendary:150,unfathomable:500},R={common:{label:"COMMON",color:"#9aa3b2",glow:"#cfd6e2",tone:392},rare:{label:"RARE",color:"#2f8cff",glow:"#7cc0ff",tone:494},epic:{label:"EPIC",color:"#a24bff",glow:"#d39bff",tone:587},legendary:{label:"LEGENDARY",color:"#ffb21a",glow:"#ffe08a",tone:740},unfathomable:{label:"UNFATHOMABLE",color:"#ff2340",glow:"#ffffff",tone:988}},g=(a,e,t,r,n,p)=>({id:a,name:e,kind:"emote",rarity:t,flavor:p,event:`emote:${a}`,clip:null,mixamo:r,robot:n}),y=(a,e,t,r,n,p)=>({id:a,name:e,kind:"cosmetic",rarity:t,flavor:p,slot:r,tint:n}),v=[g("chin-up","Chin Up","common","Taunt","Yes","Chin at 45 degrees. Zero words."),g("watch-check","Watch Check","common","Looking Around","Standing","You are late to your own loss."),g("shoulder-brush","Shoulder Brush","common","Taunt","No","Dust off. Their aura, specifically."),g("palm-push","Palm Push","common","Arm Stretching","Wave","Slowly. Like it costs nothing."),y("shades-classic","Classic Shades","common","shades","#111111","Black lenses. Standard issue aura."),y("aura-ash","Ash Aura","common","aura","#b8bcc6","Quiet. For now."),g("the-stare","The Stare","rare","Taunt","Idle","Do not blink. Ever."),g("wrist-roll","Wrist Roll","rare","Snake Hip Hop Dance","Dance","Snake arms, lazy eyes."),g("catwalk","Catwalk","rare","Catwalk Walk Forward HighKnees","Walking","The floor is a runway now."),g("point-at-lens","Point At The Lens","rare","Taunt","Punch","You, at home. Yes, you."),y("shades-visor","Visor Shades","rare","shades","#2f8cff","Sees the drop before it drops."),y("aura-ice","Ice Blue Aura","rare","aura","#5ec8ff","Cold enough to freeze a crowd."),g("boat-sweep","Boat Sweep","epic","Wave Hip Hop Dance","Dance","The original. The prow of the canoe."),g("look-back","The Look Back","epic","Looking Around","Walking","Keep walking. Look once. Leave."),g("mewing-check","Mewing Check","epic","Taunt","ThumbsUp","Jawline first, questions later."),y("shades-mirror","Mirror Shades","epic","shades","#c9d3ff","They only see themselves losing."),y("aura-violet","Violet Aura","epic","aura","#a24bff","Main character purple."),g("siuuu","Siuuu","legendary","Jumping Dance","Jump","Jump, spin, land. The whole stadium hears it."),y("crown","The Crown","legendary","head","#ffcf3a","Heavy is the head. Not yours."),y("aura-gold","Gold Aura","legendary","aura","#ffb21a","Aura so loud it has a sound."),g("griddy-void","Griddy of the Void","unfathomable","Jumping Dance","Dance","The void griddies back."),y("aura-void","Void White Aura","unfathomable","aura","#fff4f4","Unfathomable. Literally.")],S=new Map(v.map(a=>[a.id,a])),tt=v.filter(a=>a.kind==="emote"),Z="chin-up",L=100,C=[{tier:1,name:"Title: Lowkey",id:"title:lowkey"},{tier:2,name:"Title: Unbothered",id:"title:unbothered"},{tier:3,name:"Badge: First Shard",id:"badge:first-shard"},{tier:4,name:"Title: Main Character",id:"title:main-character"},{tier:5,name:"Aura Trail: Sparks",id:"trail:sparks"},{tier:6,name:"Title: Aura Farmer",id:"title:aura-farmer"},{tier:7,name:"Badge: Crowd Favorite",id:"badge:crowd-favorite"},{tier:8,name:"Title: Certified Menace",id:"title:certified-menace"},{tier:9,name:"Aura Trail: Lightning",id:"trail:lightning"},{tier:10,name:"Title: Infinite Aura",id:"title:infinite-aura"}],q=C.length;function D(a){let e=a>>>0;return()=>{e=e+1831565813>>>0;let t=e;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}}var we="aura.packs.v1";function E(){return{v:1,owned:{[Z]:1},equipped:Z,shards:0,packsOpened:0}}function Ue(a){let e=0;for(let t of T)if(e+=j[t]/100,a<e)return t;return"common"}var Be=Object.fromEntries(T.map(a=>[a,v.filter(e=>e.rarity===a)]));function ke(a,e){let t=D(e),r=[];for(let n=0;n<a;n++){let p=Be[Ue(t())];r.push(p[Math.floor(t()*p.length)])}return r}function Te(a,e){return a.packsOpened++,e.map(t=>{let r=a.owned[t.id]??0;a.owned[t.id]=r+1;let n=r>0?G[t.rarity]:0;return a.shards+=n,{id:t.id,name:t.name,kind:t.kind,rarity:t.rarity,flavor:t.flavor,isNew:r===0,shards:n,event:t.event}})}function H(a){let e=Math.min(q,Math.floor(a/L)),t=e>=q,r=a-e*L;return{shards:a,tier:e,maxTier:q,progress:t?1:r/L,toNext:t?0:L-r,unlocked:C.filter(n=>n.tier<=e),next:t?null:C[e]}}function Re(a){if(!a)return E();try{let e=a.getItem(we);if(!e)return E();let t=JSON.parse(e);if(t.v!==1||typeof t.owned!="object"||!t.owned)return E();let r=E();for(let[n,p]of Object.entries(t.owned))S.has(n)&&typeof p=="number"&&p>0&&(r.owned[n]=Math.floor(p));return r.shards=typeof t.shards=="number"&&t.shards>=0?Math.floor(t.shards):0,r.packsOpened=typeof t.packsOpened=="number"&&t.packsOpened>=0?Math.floor(t.packsOpened):0,typeof t.equipped=="string"&&r.owned[t.equipped]&&S.get(t.equipped)?.kind==="emote"&&(r.equipped=t.equipped),r}catch{return E()}}function _(a,e){if(!a)return!1;try{return a.setItem(we,JSON.stringify(e)),!0}catch{return!1}}var Ae=null,N=class{constructor(e){z(this,"ctx");z(this,"out",null);z(this,"noise",null);this.ctx=e??Ae}unlock(){try{if(!this.ctx){let e=window.AudioContext??window.webkitAudioContext;if(!e)return;this.ctx=Ae=new e}this.ctx.state==="suspended"&&this.ctx.resume(),this.out||(this.out=this.ctx.createGain(),this.out.gain.value=.55,this.out.connect(this.ctx.destination))}catch{this.ctx=null}}noiseBuffer(e){if(this.noise)return this.noise;let t=e.createBuffer(1,e.sampleRate,e.sampleRate),r=t.getChannelData(0);for(let n=0;n<r.length;n++)r[n]=Math.random()*2-1;return this.noise=t}tone(e,t,r,n,p,s){let c=this.ctx,l=c.createOscillator(),m=c.createGain();l.type=n,l.frequency.setValueAtTime(e,t),s&&l.frequency.exponentialRampToValueAtTime(s,t+r),m.gain.setValueAtTime(1e-4,t),m.gain.exponentialRampToValueAtTime(p,t+.012),m.gain.exponentialRampToValueAtTime(1e-4,t+r),l.connect(m).connect(this.out),l.start(t),l.stop(t+r+.02)}hiss(e,t,r,n,p){let s=this.ctx,c=s.createBufferSource();c.buffer=this.noiseBuffer(s);let l=s.createBiquadFilter();l.type="bandpass",l.Q.value=1.2,l.frequency.setValueAtTime(r,e),l.frequency.exponentialRampToValueAtTime(n,e+t);let m=s.createGain();m.gain.setValueAtTime(1e-4,e),m.gain.exponentialRampToValueAtTime(p,e+.02),m.gain.exponentialRampToValueAtTime(1e-4,e+t),c.connect(l).connect(m).connect(this.out),c.start(e),c.stop(e+t+.02)}ready(){return!!this.ctx&&!!this.out}shimmer(){if(!this.ready())return;let e=this.ctx.currentTime;this.tone(1318,e,.5,"sine",.05),this.tone(1760,e+.07,.45,"sine",.035)}tear(){if(!this.ready())return;let e=this.ctx.currentTime;this.hiss(e,.35,900,7e3,.6),this.tone(110,e,.4,"sine",.7,45),this.tone(660,e+.02,.25,"triangle",.18,1320)}flip(e,t){if(!this.ready())return;let r=this.ctx.currentTime,n=R[e].tone*Math.pow(2,t/6);this.hiss(r,.12,3e3,9e3,.12),this.tone(n,r,.35,"triangle",.3),this.tone(n*1.5,r+.06,.4,"sine",.16),(e==="epic"||e==="legendary"||e==="unfathomable")&&(this.tone(n*2,r+.12,.7,"sine",.18),this.tone(n/2,r,.8,"sawtooth",.08))}unfathomable(){if(!this.ready())return;let e=this.ctx.currentTime;this.tone(70,e,1.4,"sine",.9,30),this.hiss(e,1.6,400,12e3,.5);for(let[t,r]of[523,659,784,1047,1319].entries())this.tone(r,e+.08*t,1.6,"sawtooth",.07)}newTag(){if(!this.ready())return;let e=this.ctx.currentTime;this.tone(1568,e,.12,"square",.06),this.tone(2093,e+.07,.16,"square",.05)}close(){if(!this.ready())return;let e=this.ctx.currentTime;this.hiss(e,.25,6e3,800,.15)}};var Se=`
.ap-root{position:fixed;inset:0;z-index:2147483000;display:flex;align-items:center;justify-content:center;overflow:hidden;
  font-family:"Anton","Bebas Neue","Impact","Futura-CondensedExtraBold","AvenirNextCondensed-Heavy","Haettenschweiler","Arial Narrow Bold",sans-serif;
  font-stretch:condensed;font-weight:900;font-synthesis:none;
  color:#fff;user-select:none;-webkit-user-select:none;-webkit-tap-highlight-color:transparent;touch-action:manipulation;cursor:pointer;
  background:radial-gradient(120% 90% at 50% 45%,#2a0f4d 0%,#12062a 45%,#050208 100%);opacity:0;transition:opacity .18s ease-out;
  --cw:min(24vw,36vh);--ch:calc(var(--cw)*1.4)}
.ap-root.ap-in{opacity:1}
.ap-root.ap-out{opacity:0;transition:opacity .22s ease-in}
.ap-root *{box-sizing:border-box}
.ap-bgrays{position:absolute;left:50%;top:50%;width:220vmax;height:220vmax;margin:-110vmax 0 0 -110vmax;pointer-events:none;opacity:.22;
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
.ap-icon{width:62%;flex:1 1 auto;display:flex;align-items:center;justify-content:center;filter:drop-shadow(0 6px 0 rgba(0,0,0,.3))}
.ap-icon svg{width:100%;height:auto;max-height:100%}
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
`;var U=a=>T.indexOf(a),Ye={common:0,rare:0,epic:380,legendary:650,unfathomable:1e3},Ee={common:14,rare:24,epic:36,legendary:54,unfathomable:80},Ie=!1;function J(){if(Ie)return;Ie=!0;let a=document.createElement("style");a.id="aura-packs-css",a.textContent=Se,document.head.appendChild(a)}function b(a,e,t){let r=document.createElement(a);return r.className=e,t!==void 0&&(r.innerHTML=t),r}var Le=a=>a.replace(/[&<>"]/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"})[e]),Xe={"chin-up":[28,28],"watch-check":[12,118],"shoulder-brush":[14,150],"palm-push":[82,82],"the-stare":[6,6],"wrist-roll":[104,22],catwalk:[26,-14],"point-at-lens":[10,92],"boat-sweep":[96,96],"look-back":[18,12],"mewing-check":[10,162],siuuu:[124,124],"griddy-void":[150,38]};function Fe(a,e){let[t,r]=Xe[a]??[20,20],n=(p,s)=>{let c=p*Math.PI/180,l=50+s*13,m=44;return`<line x1="${l}" y1="${m}" x2="${(l+s*Math.sin(c)*30).toFixed(1)}" y2="${(m+Math.cos(c)*30).toFixed(1)}"/>`};return`<svg viewBox="0 0 100 120" aria-hidden="true"><g stroke="#fff" stroke-width="9" stroke-linecap="round" fill="none">
${n(t,-1)}${n(r,1)}<line x1="43" y1="78" x2="38" y2="112"/><line x1="57" y1="78" x2="62" y2="112"/></g>
<rect x="35" y="38" width="30" height="44" rx="11" fill="#fff"/><circle cx="50" cy="22" r="14" fill="#fff"/>
<rect x="38" y="17" width="24" height="7" rx="3" fill="${e}"/><rect x="38" y="17" width="24" height="7" rx="3" fill="#000" opacity=".75"/></svg>`}function Ke(a){let e=a.tint??"#fff";return a.slot==="shades"?`<svg viewBox="0 0 120 60" aria-hidden="true"><path d="M6 14h108" stroke="#fff" stroke-width="7" stroke-linecap="round"/>
<path d="M10 14h40c0 22-8 32-22 32S10 36 10 14zM70 14h40c0 22-6 32-20 32S70 36 70 14z" fill="${e}" stroke="#fff" stroke-width="5"/>
<path d="M18 20l10 0M78 20l10 0" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".7"/></svg>`:a.slot==="head"?`<svg viewBox="0 0 120 90" aria-hidden="true"><path d="M10 78L4 20l30 24L60 6l26 38 30-24-6 58z" fill="${e}" stroke="#fff" stroke-width="5" stroke-linejoin="round"/>
<circle cx="60" cy="54" r="7" fill="#ff2340"/><circle cx="30" cy="60" r="5" fill="#2f8cff"/><circle cx="90" cy="60" r="5" fill="#2f8cff"/></svg>`:`<svg viewBox="0 0 100 100" aria-hidden="true"><defs><radialGradient id="ag-${a.id}"><stop offset="35%" stop-color="${e}" stop-opacity="0"/>
<stop offset="62%" stop-color="${e}"/><stop offset="100%" stop-color="${e}" stop-opacity="0"/></radialGradient></defs>
<circle cx="50" cy="50" r="48" fill="url(#ag-${a.id})"/><circle cx="50" cy="50" r="24" fill="none" stroke="#fff" stroke-width="4" opacity=".8"/></svg>`}function Ve(a){let e=S.get(a.id),t=R[a.rarity],r=a.kind==="emote"?Fe(a.id,t.color):Ke(e);return`<div class="ap-rays"></div><div class="ap-leak"></div>
<div class="ap-card"><div class="ap-face ap-back"><b>AURA</b></div>
<div class="ap-face ap-front"><div class="ap-rar"><span>${t.label}</span><span class="ap-kind">${a.kind==="emote"?"EMOTE":"COSMETIC"}</span></div>
<div class="ap-icon">${r}</div><div><div class="ap-name">${Le(a.name)}</div><div class="ap-flavor">${Le(a.flavor)}</div></div></div></div>
${a.isNew?'<div class="ap-new">NEW!</div>':`<div class="ap-dupe">DUPE +${a.shards} SHARDS</div>`}
${a.kind==="emote"?'<div class="ap-equipped">EQUIPPED</div>':""}`}function Me(a){J();let{cards:e}=a,t=e.length,r=new N(a.audio);r.unlock();let n=b("div","ap-root");n.setAttribute("role","dialog"),n.setAttribute("aria-modal","true"),n.setAttribute("aria-label","Aura Pack opening"),n.tabIndex=-1,n.style.setProperty("--cw",`min(24vw,36vh,${(86/(Math.max(t,3)*1.1)).toFixed(2)}vw)`);let p=b("div","ap-bgrays"),s=b("div","ap-stage"),c=b("div","ap-tilt"),l=b("div","ap-title",`AURA PACK<small>${t===1?"1 CARD":`${t} CARDS`}</small>`),m=b("div","ap-hint","TAP TO TEAR"),M=b("div","ap-flash"),$=b("div","");$.setAttribute("aria-live","polite"),$.style.cssText="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)";let I=b("div","ap-pack");I.innerHTML=`<div class="ap-pack-glow"></div><div class="ap-pack-body">
<div class="ap-pack-half ap-pack-top"><div class="ap-pack-shine"></div></div>
<div class="ap-pack-half ap-pack-bottom"><div class="ap-pack-shine"></div><div class="ap-pack-label"><b>AURA</b><span>PACK</span></div></div>
<div class="ap-pack-count">x${t}</div></div>`;let Pe=1.1,A=e.map((o,i)=>{let d=b("div",`ap-slot ap-r-${o.rarity}`,Ve(o)),f=R[o.rarity];return d.style.setProperty("--ap-c",f.color),d.style.setProperty("--ap-g",f.glow),d.style.setProperty("--ap-x",`calc(var(--cw) * ${((i-(t-1)/2)*Pe).toFixed(3)})`),d.style.setProperty("--ap-y",`${(Math.abs(i-(t-1)/2)*1.6-2).toFixed(2)}vh`),d.style.setProperty("--ap-r0",`${(i-(t-1)/2)*25}deg`),d.dataset.i=String(i),o.id===a.equipped&&d.classList.add("ap-is-equipped"),d}),x=b("div","ap-sum"),re=e.reduce((o,i)=>o+i.shards,0),Ce=e.some(o=>o.kind==="emote");x.innerHTML=`<div class="ap-pass-row"><span>AURA PASS <em class="ap-tier">TIER ${a.before.tier}</em></span>
<span>${re>0?`+${re} SHARDS`:"NO DUPES"}</span></div>
<div class="ap-bar"><div class="ap-fill"></div></div><div class="ap-tierup"></div>
<button class="ap-btn" type="button">CONTINUE</button>
${Ce?'<div class="ap-tip">Tap an emote to equip it for your flex.</div>':""}`;let w=x.querySelector(".ap-fill"),$e=x.querySelector(".ap-tier"),ne=x.querySelector(".ap-tierup"),oe=x.querySelector(".ap-btn");w.style.transform=`scaleX(${a.before.progress})`,c.append(I,...A),s.append(c),n.append(p,s,l,m,x,M,$),(a.parent??document.body).append(n),n.offsetWidth,n.classList.add("ap-in"),n.focus({preventScroll:!0});let O=new Set,h=(o,i)=>{let d=window.setTimeout(()=>{O.delete(d),i()},o);O.add(d)},ie=()=>{for(let o of O)clearTimeout(o);O.clear()},u="pack",F=0,se=!1,Oe=window.setInterval(()=>u==="pack"&&r.shimmer(),2200);function K(o,i,d=Ee[i],f=1){let k=R[i],P=b("div","ap-confetti"),He=i==="unfathomable"?["#ff2340","#ffffff","#ff8a9a"]:[k.color,k.glow,"#ffffff"],ye="";for(let W=0;W<d;W++){let ve=Math.random()*Math.PI*2,xe=(90+Math.random()*220)*f;ye+=`<i class="ap-bit" style="--c:${He[W%3]};--x:${(Math.cos(ve)*xe).toFixed(0)}px;--y:${(Math.sin(ve)*xe-60).toFixed(0)}px;--r:${(Math.random()*720-360).toFixed(0)}deg;--d:${(.8+Math.random()*.6).toFixed(2)}s"></i>`}P.innerHTML=ye,o.append(P),window.setTimeout(()=>P.remove(),1600)}function ze(){M.className="ap-flash",M.offsetWidth,M.className="ap-flash ap-go-big",n.classList.remove("ap-shake"),n.offsetWidth,n.classList.add("ap-shake")}function pe(o,i=!1){let d=A[o],f=e[o];if(!d.classList.contains("ap-revealed")){if(d.classList.remove("ap-tease"),d.classList.add("ap-revealed"),$.textContent=`${R[f.rarity].label}: ${f.name}${f.isNew?", new":`, duplicate, ${f.shards} shards`}`,(!i||U(f.rarity)>=U("legendary"))&&r.flip(f.rarity,o),K(d,f.rarity,i?Math.ceil(Ee[f.rarity]/2):void 0),f.rarity==="unfathomable"&&!se){se=!0,ze(),r.unfathomable(),K(c,"unfathomable",70,2.2);try{a.onUnfathomable?.()}catch(k){console.error("[packs] onUnfathomable threw",k)}}h(i?60:260,()=>{d.classList.add("ap-show-tag"),f.isNew&&!i&&r.newTag()});try{a.onReveal?.(f,o)}catch(k){console.error("[packs] onReveal threw",k)}}}function ce(){if(u!=="reveal")return;if(F>=t)return h(450,de);let o=F++,i=Ye[e[o].rarity];i&&A[o].classList.add("ap-tease"),h(i,()=>{pe(o),h(U(e[o].rarity)>=U("legendary")?900:560,ce)})}function qe(){u="reveal",r.unlock(),r.tear(),m.style.animation="none",m.style.opacity="0",M.className="ap-flash ap-go",I.classList.add("ap-torn"),A.forEach((o,i)=>h(160+i*90,()=>{o.classList.add("ap-out-card")})),h(160+t*90+520,ce),h(700,()=>I.remove())}function le(){if(!(u!=="pack"&&u!=="reveal")){u="reveal",ie(),m.style.animation="none",m.style.opacity="0",I.classList.add("ap-torn"),h(350,()=>I.remove());for(let o of A)o.classList.add("ap-out-card");for(let o=0;o<t;o++)pe(o,!0);F=t,h(60,()=>A.forEach(o=>o.classList.add("ap-show-tag"))),h(120,de)}}function de(){if(u==="done"||u==="closing")return;u="done",n.classList.add("ap-summary-mode"),x.classList.add("ap-on");let{before:o,after:i}=a;i.tier>o.tier?(w.style.transform="scaleX(1)",h(720,()=>{$e.textContent=`TIER ${i.tier}`;let d=i.unlocked.filter(f=>f.tier>o.tier).map(f=>f.name);ne.textContent=`TIER UP! ${d[d.length-1]??""}`.trim(),ne.classList.add("ap-on"),r.flip("legendary",2),K(x,"legendary",30,.8),w.classList.add("ap-snap"),w.style.transform="scaleX(0)",w.offsetWidth,w.classList.remove("ap-snap"),w.style.transform=`scaleX(${i.progress})`})):h(60,()=>w.style.transform=`scaleX(${i.progress})`),h(200,()=>oe.focus({preventScroll:!0}))}let fe,De=new Promise(o=>fe=o);function me(){u!=="closing"&&(u="closing",ie(),clearInterval(Oe),r.close(),n.classList.add("ap-out"),removeEventListener("keydown",he,!0),window.setTimeout(()=>{n.remove(),fe()},240))}function ue(o){if(u==="pack")return qe();if(u==="reveal")return le();if(u!=="done")return;let i=o?.closest?.(".ap-slot");if(!i)return;let d=e[Number(i.dataset.i)];if(d.kind!=="emote")return;let f=a.onEquip(d.id);A.forEach((k,P)=>k.classList.toggle("ap-is-equipped",e[P].id===f)),i.classList.remove("ap-pop"),i.offsetWidth,i.classList.add("ap-pop"),r.newTag()}n.addEventListener("pointerdown",o=>o.stopPropagation()),n.addEventListener("pointerup",o=>{o.stopPropagation(),!o.target.closest(".ap-btn")&&ue(o.target)}),oe.addEventListener("click",o=>{o.stopPropagation(),me()});function he(o){(o.key===" "||o.key==="Enter"||o.key==="Escape")&&(o.preventDefault(),o.stopPropagation(),u==="done"?me():o.key==="Escape"?le():ue(null))}addEventListener("keydown",he,!0);let V=0,ge=.5,be=.5;return n.addEventListener("pointermove",o=>{ge=o.clientX/innerWidth,be=o.clientY/innerHeight,!V&&(V=requestAnimationFrame(()=>{V=0,c.style.setProperty("--ap-rx",`${((ge-.5)*16).toFixed(2)}deg`),c.style.setProperty("--ap-ry",`${((.5-be)*10).toFixed(2)}deg`)}))}),De}var Q={};function Y(){try{return typeof localStorage>"u"?null:localStorage}catch{return null}}var te=null,X=()=>te??(te=Re(Y())),ee=!1;function We(a,e,t){let r=ke(a,e);if(!t?.length)return r;let n=D(e^2654435769);return r.map((p,s)=>{let c=t[s];if(!c)return p;let l=v.filter(m=>m.rarity===c);return l[Math.floor(n()*l.length)]})}async function B(a,e,t={}){let r=Math.max(1,Math.min(5,Math.floor(a)||1)),n=X(),p=H(n.shards),s=Te(n,We(r,e>>>0,t.force));if(_(Y(),n),typeof document>"u"||ee)return s;ee=!0;try{await Me({cards:s,before:p,after:H(n.shards),equipped:n.equipped,onEquip:c=>(Ge(c),n.equipped),onUnfathomable:t.onUnfathomable??Q.onUnfathomable,onReveal:t.onReveal??Q.onReveal,audio:t.audio??Q.audio,parent:t.parent})}finally{ee=!1}return s}function je(){let a=X(),e=v.filter(t=>a.owned[t.id]).map(t=>({...t,copies:a.owned[t.id]}));return{items:e,emotes:e.filter(t=>t.kind==="emote"),equipped:a.equipped,shards:a.shards,packsOpened:a.packsOpened}}function Ge(a){let e=X(),t=S.get(a);return!t||t.kind!=="emote"||!e.owned[a]?!1:(e.equipped=a,_(Y(),e),!0)}function Ze(){return H(X().shards)}function Je(){te=E(),_(Y(),te)}function Qe(a=document.body){let e=document.createElement("div");e.className="ap-debug";let t=document.createElement("pre"),r=()=>{let s=je(),c=Ze();t.textContent=`owned ${s.items.length}/${v.length}  packs ${s.packsOpened}
shards ${s.shards}  pass tier ${c.tier}/${c.maxTier}  equipped ${s.equipped}`},n=(s,c)=>{let l=document.createElement("button");l.type="button",l.textContent=s,l.addEventListener("click",async()=>{await c(),r()}),e.append(l)},p=()=>Math.random()*2**32>>>0;n("win x3",()=>B(3,p())),n("lose x1",()=>B(1,p()));for(let s of T.slice(1))n(s,()=>B(3,p(),{force:["rare",s==="rare"?"epic":"common",s]}));return n("reset",Je),e.append(t),J(),r(),a.append(e),e}function ae(){if(typeof location>"u")return!1;let a=new URLSearchParams(location.search);if(!a.has("packs"))return!1;let e=()=>{let t=Number(a.get("cards"))||3,r=a.get("rarity"),n=r&&T.includes(r)?[...Array(t-1).fill(void 0),r]:void 0,p=Number(a.get("seed"))||Date.now()>>>0;B(t,p,{force:n}),Qe()};return document.readyState==="loading"?document.addEventListener("DOMContentLoaded",e,{once:!0}):e(),!0}ae();if(!new URLSearchParams(location.search).has("packs")){let a=new URLSearchParams(location.search);a.set("packs","1"),history.replaceState(null,"",`${location.pathname}?${a}`),ae()}})();
