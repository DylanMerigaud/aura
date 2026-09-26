"use strict";(()=>{var am=Object.defineProperty;var lm=(s,e,t)=>e in s?am(s,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):s[e]=t;var B=(s,e,t)=>lm(s,typeof e!="symbol"?e+"":e,t);var Vd=0,fh=1,Gd=2;var yo=1,Qa=2,dr=3,ti=0,Ft=1,xn=2,Cn=0,fr=1,ni=2,ph=3,mh=4,Wd=5;var ys=100,Xd=101,qd=102,Yd=103,Kd=104,Zd=200,$d=201,Jd=202,jd=203,gh=204,_h=205,Qd=206,ef=207,tf=208,nf=209,sf=210,rf=211,of=212,af=213,lf=214,Ea=0,wa=1,Aa=2,Zs=3,Ra=4,Ca=5,Pa=6,Ia=7,el=0,cf=1,hf=2,Vn=0,xh=1,vh=2,yh=3,bo=4,bh=5,Mh=6,Sh=7,sh="attached",uf="detached",Th=300,Gi=301,bs=302,tl=303,nl=304,Mo=306,zn=1e3,An=1001,$s=1002,Lt=1003,il=1004;var Ms=1005;var Ut=1006,pr=1007;var Gn=1008;var on=1009,Eh=1010,wh=1011,mr=1012,sl=1013,Wn=1014,Mn=1015,Vt=1016,rl=1017,ol=1018,gr=1020,Ah=35902,Rh=35899,Ch=1021,Ph=1022,Sn=1023,$n=1026,Wi=1027,_r=1028,al=1029,Xi=1030,ll=1031;var cl=1033,So=33776,To=33777,Eo=33778,wo=33779,hl=35840,ul=35841,dl=35842,fl=35843,pl=36196,ml=37492,gl=37496,_l=37488,xl=37489,Ao=37490,vl=37491,yl=37808,bl=37809,Ml=37810,Sl=37811,Tl=37812,El=37813,wl=37814,Al=37815,Rl=37816,Cl=37817,Pl=37818,Il=37819,Ll=37820,Dl=37821,Nl=36492,Ul=36494,Fl=36495,Bl=36283,Ol=36284,Ro=36285,kl=36286,Co=2200,df=2201,ff=2202,os=2300,as=2301,Ma=2302,rh=2303,is=2400,ss=2401,Kr=2402,zl=2500,pf=2501,Ih=0,Po=1,xr=2,mf=3200;var vr=0,gf=1,Si="",Mt="srgb",un="srgb-linear",Zr="linear",ct="srgb";var Sa=7680;var _f=519,xf=512,vf=513,yf=514,Hl=515,bf=516,Mf=517,Vl=518,Sf=519,Lh=35044,yr=35048;var Dh="300 es",On=2e3,Js=2001;function cm(s){for(let e=s.length-1;e>=0;--e)if(s[e]>=65535)return!0;return!1}function hm(s){return ArrayBuffer.isView(s)&&!(s instanceof DataView)}function js(s){return document.createElementNS("http://www.w3.org/1999/xhtml",s)}function Tf(){let s=js("canvas");return s.style.display="block",s}var rd={},Qs=null;function $r(...s){let e="THREE."+s.shift();Qs?Qs("log",e,...s):console.log(e,...s)}function Ef(s){let e=s[0];if(typeof e=="string"&&e.startsWith("TSL:")){let t=s[1];t&&t.isStackTrace?s[0]+=" "+t.getLocation():s[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return s}function De(...s){s=Ef(s);let e="THREE."+s.shift();if(Qs)Qs("warn",e,...s);else{let t=s[0];t&&t.isStackTrace?console.warn(t.getError(e)):console.warn(e,...s)}}function ke(...s){s=Ef(s);let e="THREE."+s.shift();if(Qs)Qs("error",e,...s);else{let t=s[0];t&&t.isStackTrace?console.error(t.getError(e)):console.error(e,...s)}}function rs(...s){let e=s.join(" ");e in rd||(rd[e]=!0,De(...s))}function wf(s,e,t){return new Promise(function(n,i){function r(){switch(s.clientWaitSync(e,s.SYNC_FLUSH_COMMANDS_BIT,0)){case s.WAIT_FAILED:i();break;case s.TIMEOUT_EXPIRED:setTimeout(r,t);break;default:n()}}setTimeout(r,t)})}var Af={[Ea]:wa,[Aa]:Pa,[Ra]:Ia,[Zs]:Ca,[wa]:Ea,[Pa]:Aa,[Ia]:Ra,[Ca]:Zs},Hn=class{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){let n=this._listeners;return n===void 0?!1:n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){let n=this._listeners;if(n===void 0)return;let i=n[e];if(i!==void 0){let r=i.indexOf(t);r!==-1&&i.splice(r,1)}}dispatchEvent(e){let t=this._listeners;if(t===void 0)return;let n=t[e.type];if(n!==void 0){e.target=this;let i=n.slice(0);for(let r=0,o=i.length;r<o;r++)i[r].call(this,e);e.target=null}}},tn=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],od=1234567,qr=Math.PI/180,ls=180/Math.PI;function kn(){let s=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(tn[s&255]+tn[s>>8&255]+tn[s>>16&255]+tn[s>>24&255]+"-"+tn[e&255]+tn[e>>8&255]+"-"+tn[e>>16&15|64]+tn[e>>24&255]+"-"+tn[t&63|128]+tn[t>>8&255]+"-"+tn[t>>16&255]+tn[t>>24&255]+tn[n&255]+tn[n>>8&255]+tn[n>>16&255]+tn[n>>24&255]).toLowerCase()}function je(s,e,t){return Math.max(e,Math.min(t,s))}function Nh(s,e){return(s%e+e)%e}function um(s,e,t,n,i){return n+(s-e)*(i-n)/(t-e)}function dm(s,e,t){return s!==e?(t-s)/(e-s):0}function Yr(s,e,t){return(1-t)*s+t*e}function fm(s,e,t,n){return Yr(s,e,1-Math.exp(-t*n))}function pm(s,e=1){return e-Math.abs(Nh(s,e*2)-e)}function mm(s,e,t){return s<=e?0:s>=t?1:(s=(s-e)/(t-e),s*s*(3-2*s))}function gm(s,e,t){return s<=e?0:s>=t?1:(s=(s-e)/(t-e),s*s*s*(s*(s*6-15)+10))}function _m(s,e){return s+Math.floor(Math.random()*(e-s+1))}function xm(s,e){return s+Math.random()*(e-s)}function vm(s){return s*(.5-Math.random())}function ym(s){s!==void 0&&(od=s);let e=od+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function bm(s){return s*qr}function Mm(s){return s*ls}function Sm(s){return s>0&&Number.isInteger(s)&&2**Math.round(Math.log2(s))===s}function Tm(s){return Math.pow(2,Math.ceil(Math.log(s)/Math.LN2))}function Em(s){return Math.pow(2,Math.floor(Math.log(s)/Math.LN2))}function wm(s,e,t,n,i){let r=Math.cos,o=Math.sin,a=r(t/2),l=o(t/2),c=r((e+n)/2),h=o((e+n)/2),u=r((e-n)/2),d=o((e-n)/2),f=r((n-e)/2),g=o((n-e)/2);switch(i){case"XYX":s.set(a*h,l*u,l*d,a*c);break;case"YZY":s.set(l*d,a*h,l*u,a*c);break;case"ZXZ":s.set(l*u,l*d,a*h,a*c);break;case"XZX":s.set(a*h,l*g,l*f,a*c);break;case"YXY":s.set(l*f,a*h,l*g,a*c);break;case"ZYZ":s.set(l*g,l*f,a*h,a*c);break;default:De("MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+i)}}function Bn(s,e){switch(e.constructor){case Float32Array:return s;case Uint32Array:return s/4294967295;case Uint16Array:return s/65535;case Uint8Array:case Uint8ClampedArray:return s/255;case Int32Array:return Math.max(s/2147483647,-1);case Int16Array:return Math.max(s/32767,-1);case Int8Array:return Math.max(s/127,-1);default:throw new Error("THREE.MathUtils: Invalid component type.")}}function ut(s,e){switch(e.constructor){case Float32Array:return s;case Uint32Array:return Math.round(s*4294967295);case Uint16Array:return Math.round(s*65535);case Uint8Array:case Uint8ClampedArray:return Math.round(s*255);case Int32Array:return Math.round(s*2147483647);case Int16Array:return Math.round(s*32767);case Int8Array:return Math.round(s*127);default:throw new Error("THREE.MathUtils: Invalid component type.")}}var qi={DEG2RAD:qr,RAD2DEG:ls,generateUUID:kn,clamp:je,euclideanModulo:Nh,mapLinear:um,inverseLerp:dm,lerp:Yr,damp:fm,pingpong:pm,smoothstep:mm,smootherstep:gm,randInt:_m,randFloat:xm,randFloatSpread:vm,seededRandom:ym,degToRad:bm,radToDeg:Mm,isPowerOfTwo:Sm,ceilPowerOfTwo:Tm,floorPowerOfTwo:Em,setQuaternionFromProperEuler:wm,normalize:ut,denormalize:Bn},kh=class kh{constructor(e=0,t=0){this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("THREE.Vector2: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("THREE.Vector2: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){let t=this.x,n=this.y,i=e.elements;return this.x=i[0]*t+i[3]*n+i[6],this.y=i[1]*t+i[4]*n+i[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=je(this.x,e.x,t.x),this.y=je(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=je(this.x,e,t),this.y=je(this.y,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(je(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(je(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){let n=Math.cos(t),i=Math.sin(t),r=this.x-e.x,o=this.y-e.y;return this.x=r*n-o*i+e.x,this.y=r*i+o*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}};kh.prototype.isVector2=!0;var Te=kh,Ht=class{constructor(e=0,t=0,n=0,i=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=i}static slerpFlat(e,t,n,i,r,o,a){let l=n[i+0],c=n[i+1],h=n[i+2],u=n[i+3],d=r[o+0],f=r[o+1],g=r[o+2],_=r[o+3];if(u!==_||l!==d||c!==f||h!==g){let m=l*d+c*f+h*g+u*_;m<0&&(d=-d,f=-f,g=-g,_=-_,m=-m);let p=1-a;if(m<.9995){let b=Math.acos(m),T=Math.sin(b);p=Math.sin(p*b)/T,a=Math.sin(a*b)/T,l=l*p+d*a,c=c*p+f*a,h=h*p+g*a,u=u*p+_*a}else{l=l*p+d*a,c=c*p+f*a,h=h*p+g*a,u=u*p+_*a;let b=1/Math.sqrt(l*l+c*c+h*h+u*u);l*=b,c*=b,h*=b,u*=b}}e[t]=l,e[t+1]=c,e[t+2]=h,e[t+3]=u}static multiplyQuaternionsFlat(e,t,n,i,r,o){let a=n[i],l=n[i+1],c=n[i+2],h=n[i+3],u=r[o],d=r[o+1],f=r[o+2],g=r[o+3];return e[t]=a*g+h*u+l*f-c*d,e[t+1]=l*g+h*d+c*u-a*f,e[t+2]=c*g+h*f+a*d-l*u,e[t+3]=h*g-a*u-l*d-c*f,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,i){return this._x=e,this._y=t,this._z=n,this._w=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){let n=e._x,i=e._y,r=e._z,o=e._order,a=Math.cos,l=Math.sin,c=a(n/2),h=a(i/2),u=a(r/2),d=l(n/2),f=l(i/2),g=l(r/2);switch(o){case"XYZ":this._x=d*h*u+c*f*g,this._y=c*f*u-d*h*g,this._z=c*h*g+d*f*u,this._w=c*h*u-d*f*g;break;case"YXZ":this._x=d*h*u+c*f*g,this._y=c*f*u-d*h*g,this._z=c*h*g-d*f*u,this._w=c*h*u+d*f*g;break;case"ZXY":this._x=d*h*u-c*f*g,this._y=c*f*u+d*h*g,this._z=c*h*g+d*f*u,this._w=c*h*u-d*f*g;break;case"ZYX":this._x=d*h*u-c*f*g,this._y=c*f*u+d*h*g,this._z=c*h*g-d*f*u,this._w=c*h*u+d*f*g;break;case"YZX":this._x=d*h*u+c*f*g,this._y=c*f*u+d*h*g,this._z=c*h*g-d*f*u,this._w=c*h*u-d*f*g;break;case"XZY":this._x=d*h*u-c*f*g,this._y=c*f*u-d*h*g,this._z=c*h*g+d*f*u,this._w=c*h*u+d*f*g;break;default:De("Quaternion: .setFromEuler() encountered an unknown order: "+o)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){let n=t/2,i=Math.sin(n);return this._x=e.x*i,this._y=e.y*i,this._z=e.z*i,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){let t=e.elements,n=t[0],i=t[4],r=t[8],o=t[1],a=t[5],l=t[9],c=t[2],h=t[6],u=t[10],d=n+a+u;if(d>0){let f=.5/Math.sqrt(d+1);this._w=.25/f,this._x=(h-l)*f,this._y=(r-c)*f,this._z=(o-i)*f}else if(n>a&&n>u){let f=2*Math.sqrt(1+n-a-u);this._w=(h-l)/f,this._x=.25*f,this._y=(i+o)/f,this._z=(r+c)/f}else if(a>u){let f=2*Math.sqrt(1+a-n-u);this._w=(r-c)/f,this._x=(i+o)/f,this._y=.25*f,this._z=(l+h)/f}else{let f=2*Math.sqrt(1+u-n-a);this._w=(o-i)/f,this._x=(r+c)/f,this._y=(l+h)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<1e-8?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(je(this.dot(e),-1,1)))}rotateTowards(e,t){let n=this.angleTo(e);if(n===0)return this;let i=Math.min(1,t/n);return this.slerp(e,i),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){let n=e._x,i=e._y,r=e._z,o=e._w,a=t._x,l=t._y,c=t._z,h=t._w;return this._x=n*h+o*a+i*c-r*l,this._y=i*h+o*l+r*a-n*c,this._z=r*h+o*c+n*l-i*a,this._w=o*h-n*a-i*l-r*c,this._onChangeCallback(),this}slerp(e,t){let n=e._x,i=e._y,r=e._z,o=e._w,a=this.dot(e);a<0&&(n=-n,i=-i,r=-r,o=-o,a=-a);let l=1-t;if(a<.9995){let c=Math.acos(a),h=Math.sin(c);l=Math.sin(l*c)/h,t=Math.sin(t*c)/h,this._x=this._x*l+n*t,this._y=this._y*l+i*t,this._z=this._z*l+r*t,this._w=this._w*l+o*t,this._onChangeCallback()}else this._x=this._x*l+n*t,this._y=this._y*l+i*t,this._z=this._z*l+r*t,this._w=this._w*l+o*t,this.normalize();return this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){let e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),i=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(i*Math.sin(e),i*Math.cos(e),r*Math.sin(t),r*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},zh=class zh{constructor(e=0,t=0,n=0){this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("THREE.Vector3: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("THREE.Vector3: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(ad.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(ad.setFromAxisAngle(e,t))}applyMatrix3(e){let t=this.x,n=this.y,i=this.z,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6]*i,this.y=r[1]*t+r[4]*n+r[7]*i,this.z=r[2]*t+r[5]*n+r[8]*i,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){let t=this.x,n=this.y,i=this.z,r=e.elements,o=1/(r[3]*t+r[7]*n+r[11]*i+r[15]);return this.x=(r[0]*t+r[4]*n+r[8]*i+r[12])*o,this.y=(r[1]*t+r[5]*n+r[9]*i+r[13])*o,this.z=(r[2]*t+r[6]*n+r[10]*i+r[14])*o,this}applyQuaternion(e){let t=this.x,n=this.y,i=this.z,r=e.x,o=e.y,a=e.z,l=e.w,c=2*(o*i-a*n),h=2*(a*t-r*i),u=2*(r*n-o*t);return this.x=t+l*c+o*u-a*h,this.y=n+l*h+a*c-r*u,this.z=i+l*u+r*h-o*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){let t=this.x,n=this.y,i=this.z,r=e.elements;return this.x=r[0]*t+r[4]*n+r[8]*i,this.y=r[1]*t+r[5]*n+r[9]*i,this.z=r[2]*t+r[6]*n+r[10]*i,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=je(this.x,e.x,t.x),this.y=je(this.y,e.y,t.y),this.z=je(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=je(this.x,e,t),this.y=je(this.y,e,t),this.z=je(this.z,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(je(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){let n=e.x,i=e.y,r=e.z,o=t.x,a=t.y,l=t.z;return this.x=i*l-r*a,this.y=r*o-n*l,this.z=n*a-i*o,this}projectOnVector(e){let t=e.lengthSq();if(t===0)return this.set(0,0,0);let n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return Nc.copy(this).projectOnVector(e),this.sub(Nc)}reflect(e){return this.sub(Nc.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(je(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y,i=this.z-e.z;return t*t+n*n+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){let i=Math.sin(t)*e;return this.x=i*Math.sin(n),this.y=Math.cos(t)*e,this.z=i*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){let t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),i=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=i,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}};zh.prototype.isVector3=!0;var D=zh,Nc=new D,ad=new Ht,Hh=class Hh{constructor(e,t,n,i,r,o,a,l,c){this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,i,r,o,a,l,c)}set(e,t,n,i,r,o,a,l,c){let h=this.elements;return h[0]=e,h[1]=i,h[2]=a,h[3]=t,h[4]=r,h[5]=l,h[6]=n,h[7]=o,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){let t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,i=t.elements,r=this.elements,o=n[0],a=n[3],l=n[6],c=n[1],h=n[4],u=n[7],d=n[2],f=n[5],g=n[8],_=i[0],m=i[3],p=i[6],b=i[1],T=i[4],x=i[7],S=i[2],M=i[5],A=i[8];return r[0]=o*_+a*b+l*S,r[3]=o*m+a*T+l*M,r[6]=o*p+a*x+l*A,r[1]=c*_+h*b+u*S,r[4]=c*m+h*T+u*M,r[7]=c*p+h*x+u*A,r[2]=d*_+f*b+g*S,r[5]=d*m+f*T+g*M,r[8]=d*p+f*x+g*A,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[1],i=e[2],r=e[3],o=e[4],a=e[5],l=e[6],c=e[7],h=e[8];return t*o*h-t*a*c-n*r*h+n*a*l+i*r*c-i*o*l}invert(){let e=this.elements,t=e[0],n=e[1],i=e[2],r=e[3],o=e[4],a=e[5],l=e[6],c=e[7],h=e[8],u=h*o-a*c,d=a*l-h*r,f=c*r-o*l,g=t*u+n*d+i*f;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);let _=1/g;return e[0]=u*_,e[1]=(i*c-h*n)*_,e[2]=(a*n-i*o)*_,e[3]=d*_,e[4]=(h*t-i*l)*_,e[5]=(i*r-a*t)*_,e[6]=f*_,e[7]=(n*l-c*t)*_,e[8]=(o*t-n*r)*_,this}transpose(){let e,t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){let t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,i,r,o,a){let l=Math.cos(r),c=Math.sin(r);return this.set(n*l,n*c,-n*(l*o+c*a)+o+e,-i*c,i*l,-i*(-c*o+l*a)+a+t,0,0,1),this}scale(e,t){return rs("Matrix3: .scale() is deprecated. Use .makeScale() instead."),this.premultiply(Uc.makeScale(e,t)),this}rotate(e){return rs("Matrix3: .rotate() is deprecated. Use .makeRotation() instead."),this.premultiply(Uc.makeRotation(-e)),this}translate(e,t){return rs("Matrix3: .translate() is deprecated. Use .makeTranslation() instead."),this.premultiply(Uc.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){let t=this.elements,n=e.elements;for(let i=0;i<9;i++)if(t[i]!==n[i])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}};Hh.prototype.isMatrix3=!0;var He=Hh,Uc=new He,ld=new He().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),cd=new He().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function Am(){let s={enabled:!0,workingColorSpace:un,spaces:{},convert:function(i,r,o){return this.enabled===!1||r===o||!r||!o||(this.spaces[r].transfer===ct&&(i.r=pi(i.r),i.g=pi(i.g),i.b=pi(i.b)),this.spaces[r].primaries!==this.spaces[o].primaries&&(i.applyMatrix3(this.spaces[r].toXYZ),i.applyMatrix3(this.spaces[o].fromXYZ)),this.spaces[o].transfer===ct&&(i.r=Ks(i.r),i.g=Ks(i.g),i.b=Ks(i.b))),i},workingToColorSpace:function(i,r){return this.convert(i,this.workingColorSpace,r)},colorSpaceToWorking:function(i,r){return this.convert(i,r,this.workingColorSpace)},getPrimaries:function(i){return this.spaces[i].primaries},getTransfer:function(i){return i===Si?Zr:this.spaces[i].transfer},getToneMappingMode:function(i){return this.spaces[i].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(i,r=this.workingColorSpace){return i.fromArray(this.spaces[r].luminanceCoefficients)},define:function(i){Object.assign(this.spaces,i)},_getMatrix:function(i,r,o){return i.copy(this.spaces[r].toXYZ).multiply(this.spaces[o].fromXYZ)},_getDrawingBufferColorSpace:function(i){return this.spaces[i].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(i=this.workingColorSpace){return this.spaces[i].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(i,r){return rs("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),s.workingToColorSpace(i,r)},toWorkingColorSpace:function(i,r){return rs("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),s.colorSpaceToWorking(i,r)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],n=[.3127,.329];return s.define({[un]:{primaries:e,whitePoint:n,transfer:Zr,toXYZ:ld,fromXYZ:cd,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:Mt},outputColorSpaceConfig:{drawingBufferColorSpace:Mt}},[Mt]:{primaries:e,whitePoint:n,transfer:ct,toXYZ:ld,fromXYZ:cd,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:Mt}}}),s}var Ke=Am();function pi(s){return s<.04045?s*.0773993808:Math.pow(s*.9478672986+.0521327014,2.4)}function Ks(s){return s<.0031308?s*12.92:1.055*Math.pow(s,.41666)-.055}var Ns,La=class{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{Ns===void 0&&(Ns=js("canvas")),Ns.width=e.width,Ns.height=e.height;let i=Ns.getContext("2d");e instanceof ImageData?i.putImageData(e,0,0):i.drawImage(e,0,0,e.width,e.height),n=Ns}return n.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){let t=js("canvas");t.width=e.width,t.height=e.height;let n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);let i=n.getImageData(0,0,e.width,e.height),r=i.data;for(let o=0;o<r.length;o++)r[o]=pi(r[o]/255)*255;return n.putImageData(i,0,0),t}else if(e.data){let t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(pi(t[n]/255)*255):t[n]=pi(t[n]);return{data:t,width:e.width,height:e.height}}else return De("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}},Rm=0,er=class{constructor(e=null){this.isTextureSource=!0,Object.defineProperty(this,"id",{value:Rm++}),this.uuid=kn(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){let t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):typeof VideoFrame<"u"&&t instanceof VideoFrame?e.set(t.displayWidth,t.displayHeight,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];let n={uuid:this.uuid,url:""},i=this.data;if(i!==null){let r;if(Array.isArray(i)){r=[];for(let o=0,a=i.length;o<a;o++)i[o].isDataTexture?r.push(Fc(i[o].image)):r.push(Fc(i[o]))}else r=Fc(i);n.url=r}return t||(e.images[this.uuid]=n),n}};function Fc(s){return typeof HTMLImageElement<"u"&&s instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&s instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&s instanceof ImageBitmap?La.getDataURL(s):s.data?{data:Array.from(s.data),width:s.width,height:s.height,type:s.data.constructor.name}:(De("Texture: Unable to serialize Texture."),{})}var Cm=0,Bc=new D,Wt=class s extends Hn{constructor(e=s.DEFAULT_IMAGE,t=s.DEFAULT_MAPPING,n=An,i=An,r=Ut,o=Gn,a=Sn,l=on,c=s.DEFAULT_ANISOTROPY,h=Si){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Cm++}),this.uuid=kn(),this.name="",this.source=new er(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=i,this.magFilter=r,this.minFilter=o,this.anisotropy=c,this.format=a,this.internalFormat=null,this.type=l,this.offset=new Te(0,0),this.repeat=new Te(1,1),this.center=new Te(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new He,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0,this.normalized=!1}get width(){return this.source.getSize(Bc).x}get height(){return this.source.getSize(Bc).y}get depth(){return this.source.getSize(Bc).z}get image(){return this.source.data}set image(e){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.normalized=e.normalized,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(let t in e){let n=e[t];if(n===void 0){De(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}let i=this[t];if(i===void 0){De(`Texture.setValues(): property '${t}' does not exist.`);continue}i&&n&&i.isVector2&&n.isVector2||i&&n&&i.isVector3&&n.isVector3||i&&n&&i.isMatrix3&&n.isMatrix3?i.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];let n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==Th)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case zn:e.x=e.x-Math.floor(e.x);break;case An:e.x=e.x<0?0:1;break;case $s:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case zn:e.y=e.y-Math.floor(e.y);break;case An:e.y=e.y<0?0:1;break;case $s:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}};Wt.DEFAULT_IMAGE=null;Wt.DEFAULT_MAPPING=Th;Wt.DEFAULT_ANISOTROPY=1;var Vh=class Vh{constructor(e=0,t=0,n=0,i=1){this.x=e,this.y=t,this.z=n,this.w=i}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,i){return this.x=e,this.y=t,this.z=n,this.w=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("THREE.Vector4: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("THREE.Vector4: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){let t=this.x,n=this.y,i=this.z,r=this.w,o=e.elements;return this.x=o[0]*t+o[4]*n+o[8]*i+o[12]*r,this.y=o[1]*t+o[5]*n+o[9]*i+o[13]*r,this.z=o[2]*t+o[6]*n+o[10]*i+o[14]*r,this.w=o[3]*t+o[7]*n+o[11]*i+o[15]*r,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);let t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,i,r,l=e.elements,c=l[0],h=l[4],u=l[8],d=l[1],f=l[5],g=l[9],_=l[2],m=l[6],p=l[10];if(Math.abs(h-d)<.01&&Math.abs(u-_)<.01&&Math.abs(g-m)<.01){if(Math.abs(h+d)<.1&&Math.abs(u+_)<.1&&Math.abs(g+m)<.1&&Math.abs(c+f+p-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;let T=(c+1)/2,x=(f+1)/2,S=(p+1)/2,M=(h+d)/4,A=(u+_)/4,v=(g+m)/4;return T>x&&T>S?T<.01?(n=0,i=.707106781,r=.707106781):(n=Math.sqrt(T),i=M/n,r=A/n):x>S?x<.01?(n=.707106781,i=0,r=.707106781):(i=Math.sqrt(x),n=M/i,r=v/i):S<.01?(n=.707106781,i=.707106781,r=0):(r=Math.sqrt(S),n=A/r,i=v/r),this.set(n,i,r,t),this}let b=Math.sqrt((m-g)*(m-g)+(u-_)*(u-_)+(d-h)*(d-h));return Math.abs(b)<.001&&(b=1),this.x=(m-g)/b,this.y=(u-_)/b,this.z=(d-h)/b,this.w=Math.acos((c+f+p-1)/2),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=je(this.x,e.x,t.x),this.y=je(this.y,e.y,t.y),this.z=je(this.z,e.z,t.z),this.w=je(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=je(this.x,e,t),this.y=je(this.y,e,t),this.z=je(this.z,e,t),this.w=je(this.w,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(je(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}};Vh.prototype.isVector4=!0;var dt=Vh,Da=class extends Hn{constructor(e=1,t=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Ut,depthBuffer:!0,stencilBuffer:!1,resolveColorBuffer:!0,resolveDepthBuffer:!0,resolveStencilBuffer:!0,storeMultisampledColorBuffer:!0,storeMultisampledDepthBuffer:!0,storeMultisampledStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},n),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=n.depth,this.scissor=new dt(0,0,e,t),this.scissorTest=!1,this.viewport=new dt(0,0,e,t),this.textures=[];let i={width:e,height:t,depth:n.depth},r=new Wt(i),o=n.count;for(let a=0;a<o;a++)this.textures[a]=r.clone(),this.textures[a].isRenderTargetTexture=!0,this.textures[a].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveColorBuffer=n.resolveColorBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.storeMultisampledColorBuffer=n.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=n.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=n.storeMultisampledStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview,this.useArrayDepthTexture=n.useArrayDepthTexture}_setTextureOptions(e={}){let t={minFilter:Ut,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&this._depthTexture.renderTarget===this&&(this._depthTexture.renderTarget=null),e!==null&&e.renderTarget===null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let i=0,r=this.textures.length;i<r;i++)this.textures[i].image.width=e,this.textures[i].image.height=t,this.textures[i].image.depth=n,this.textures[i].isData3DTexture!==!0&&(this.textures[i].isArrayTexture=this.textures[i].image.depth>1);this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,n=e.textures.length;t<n;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;let i=Object.assign({},e.textures[t].image);this.textures[t].source=new er(i)}if(this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveColorBuffer=e.resolveColorBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,this.storeMultisampledColorBuffer=e.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=e.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=e.storeMultisampledStencilBuffer,e.depthTexture!==null)if(e.depthTexture.renderTarget===e){let t=e.depthTexture.clone();t.renderTarget=null,this.depthTexture=t}else this.depthTexture=e.depthTexture;return this.samples=e.samples,this.multiview=e.multiview,this.useArrayDepthTexture=e.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:"dispose"})}},Dt=class extends Da{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}},Jr=class extends Wt{constructor(e=null,t=1,n=1,i=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:i},this.magFilter=Lt,this.minFilter=Lt,this.wrapR=An,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}};var Na=class extends Wt{constructor(e=null,t=1,n=1,i=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:i},this.magFilter=Lt,this.minFilter=Lt,this.wrapR=An,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}};var ja=class ja{constructor(e,t,n,i,r,o,a,l,c,h,u,d,f,g,_,m){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,i,r,o,a,l,c,h,u,d,f,g,_,m)}set(e,t,n,i,r,o,a,l,c,h,u,d,f,g,_,m){let p=this.elements;return p[0]=e,p[4]=t,p[8]=n,p[12]=i,p[1]=r,p[5]=o,p[9]=a,p[13]=l,p[2]=c,p[6]=h,p[10]=u,p[14]=d,p[3]=f,p[7]=g,p[11]=_,p[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new ja().fromArray(this.elements)}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){let t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){let t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return this.determinantAffine()===0?(e.set(1,0,0),t.set(0,1,0),n.set(0,0,1),this):(e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this)}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){if(e.determinantAffine()===0)return this.identity();let t=this.elements,n=e.elements,i=1/Us.setFromMatrixColumn(e,0).length(),r=1/Us.setFromMatrixColumn(e,1).length(),o=1/Us.setFromMatrixColumn(e,2).length();return t[0]=n[0]*i,t[1]=n[1]*i,t[2]=n[2]*i,t[3]=0,t[4]=n[4]*r,t[5]=n[5]*r,t[6]=n[6]*r,t[7]=0,t[8]=n[8]*o,t[9]=n[9]*o,t[10]=n[10]*o,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){let t=this.elements,n=e.x,i=e.y,r=e.z,o=Math.cos(n),a=Math.sin(n),l=Math.cos(i),c=Math.sin(i),h=Math.cos(r),u=Math.sin(r);if(e.order==="XYZ"){let d=o*h,f=o*u,g=a*h,_=a*u;t[0]=l*h,t[4]=-l*u,t[8]=c,t[1]=f+g*c,t[5]=d-_*c,t[9]=-a*l,t[2]=_-d*c,t[6]=g+f*c,t[10]=o*l}else if(e.order==="YXZ"){let d=l*h,f=l*u,g=c*h,_=c*u;t[0]=d+_*a,t[4]=g*a-f,t[8]=o*c,t[1]=o*u,t[5]=o*h,t[9]=-a,t[2]=f*a-g,t[6]=_+d*a,t[10]=o*l}else if(e.order==="ZXY"){let d=l*h,f=l*u,g=c*h,_=c*u;t[0]=d-_*a,t[4]=-o*u,t[8]=g+f*a,t[1]=f+g*a,t[5]=o*h,t[9]=_-d*a,t[2]=-o*c,t[6]=a,t[10]=o*l}else if(e.order==="ZYX"){let d=o*h,f=o*u,g=a*h,_=a*u;t[0]=l*h,t[4]=g*c-f,t[8]=d*c+_,t[1]=l*u,t[5]=_*c+d,t[9]=f*c-g,t[2]=-c,t[6]=a*l,t[10]=o*l}else if(e.order==="YZX"){let d=o*l,f=o*c,g=a*l,_=a*c;t[0]=l*h,t[4]=_-d*u,t[8]=g*u+f,t[1]=u,t[5]=o*h,t[9]=-a*h,t[2]=-c*h,t[6]=f*u+g,t[10]=d-_*u}else if(e.order==="XZY"){let d=o*l,f=o*c,g=a*l,_=a*c;t[0]=l*h,t[4]=-u,t[8]=c*h,t[1]=d*u+_,t[5]=o*h,t[9]=f*u-g,t[2]=g*u-f,t[6]=a*h,t[10]=_*u+d}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(Pm,e,Im)}lookAt(e,t,n){let i=this.elements;return yn.subVectors(e,t),yn.lengthSq()===0&&(yn.z=1),yn.normalize(),Li.crossVectors(n,yn),Li.lengthSq()===0&&(Math.abs(n.z)===1?yn.x+=1e-4:yn.z+=1e-4,yn.normalize(),Li.crossVectors(n,yn)),Li.normalize(),Jo.crossVectors(yn,Li),i[0]=Li.x,i[4]=Jo.x,i[8]=yn.x,i[1]=Li.y,i[5]=Jo.y,i[9]=yn.y,i[2]=Li.z,i[6]=Jo.z,i[10]=yn.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,i=t.elements,r=this.elements,o=n[0],a=n[4],l=n[8],c=n[12],h=n[1],u=n[5],d=n[9],f=n[13],g=n[2],_=n[6],m=n[10],p=n[14],b=n[3],T=n[7],x=n[11],S=n[15],M=i[0],A=i[4],v=i[8],w=i[12],R=i[1],L=i[5],P=i[9],N=i[13],I=i[2],H=i[6],V=i[10],q=i[14],ee=i[3],k=i[7],te=i[11],re=i[15];return r[0]=o*M+a*R+l*I+c*ee,r[4]=o*A+a*L+l*H+c*k,r[8]=o*v+a*P+l*V+c*te,r[12]=o*w+a*N+l*q+c*re,r[1]=h*M+u*R+d*I+f*ee,r[5]=h*A+u*L+d*H+f*k,r[9]=h*v+u*P+d*V+f*te,r[13]=h*w+u*N+d*q+f*re,r[2]=g*M+_*R+m*I+p*ee,r[6]=g*A+_*L+m*H+p*k,r[10]=g*v+_*P+m*V+p*te,r[14]=g*w+_*N+m*q+p*re,r[3]=b*M+T*R+x*I+S*ee,r[7]=b*A+T*L+x*H+S*k,r[11]=b*v+T*P+x*V+S*te,r[15]=b*w+T*N+x*q+S*re,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[4],i=e[8],r=e[12],o=e[1],a=e[5],l=e[9],c=e[13],h=e[2],u=e[6],d=e[10],f=e[14],g=e[3],_=e[7],m=e[11],p=e[15],b=l*f-c*d,T=a*f-c*u,x=a*d-l*u,S=o*f-c*h,M=o*d-l*h,A=o*u-a*h;return t*(_*b-m*T+p*x)-n*(g*b-m*S+p*M)+i*(g*T-_*S+p*A)-r*(g*x-_*M+m*A)}determinantAffine(){let e=this.elements,t=e[0],n=e[4],i=e[8],r=e[1],o=e[5],a=e[9],l=e[2],c=e[6],h=e[10];return t*(o*h-a*c)-n*(r*h-a*l)+i*(r*c-o*l)}transpose(){let e=this.elements,t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){let i=this.elements;return e.isVector3?(i[12]=e.x,i[13]=e.y,i[14]=e.z):(i[12]=e,i[13]=t,i[14]=n),this}invert(){let e=this.elements,t=e[0],n=e[1],i=e[2],r=e[3],o=e[4],a=e[5],l=e[6],c=e[7],h=e[8],u=e[9],d=e[10],f=e[11],g=e[12],_=e[13],m=e[14],p=e[15],b=t*a-n*o,T=t*l-i*o,x=t*c-r*o,S=n*l-i*a,M=n*c-r*a,A=i*c-r*l,v=h*_-u*g,w=h*m-d*g,R=h*p-f*g,L=u*m-d*_,P=u*p-f*_,N=d*p-f*m,I=b*N-T*P+x*L+S*R-M*w+A*v;if(I===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let H=1/I;return e[0]=(a*N-l*P+c*L)*H,e[1]=(i*P-n*N-r*L)*H,e[2]=(_*A-m*M+p*S)*H,e[3]=(d*M-u*A-f*S)*H,e[4]=(l*R-o*N-c*w)*H,e[5]=(t*N-i*R+r*w)*H,e[6]=(m*x-g*A-p*T)*H,e[7]=(h*A-d*x+f*T)*H,e[8]=(o*P-a*R+c*v)*H,e[9]=(n*R-t*P-r*v)*H,e[10]=(g*M-_*x+p*b)*H,e[11]=(u*x-h*M-f*b)*H,e[12]=(a*w-o*L-l*v)*H,e[13]=(t*L-n*w+i*v)*H,e[14]=(_*T-g*S-m*b)*H,e[15]=(h*S-u*T+d*b)*H,this}scale(e){let t=this.elements,n=e.x,i=e.y,r=e.z;return t[0]*=n,t[4]*=i,t[8]*=r,t[1]*=n,t[5]*=i,t[9]*=r,t[2]*=n,t[6]*=i,t[10]*=r,t[3]*=n,t[7]*=i,t[11]*=r,this}getMaxScaleOnAxis(){let e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],i=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,i))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){let t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){let n=Math.cos(t),i=Math.sin(t),r=1-n,o=e.x,a=e.y,l=e.z,c=r*o,h=r*a;return this.set(c*o+n,c*a-i*l,c*l+i*a,0,c*a+i*l,h*a+n,h*l-i*o,0,c*l-i*a,h*l+i*o,r*l*l+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,i,r,o){return this.set(1,n,r,0,e,1,o,0,t,i,1,0,0,0,0,1),this}compose(e,t,n){let i=this.elements,r=t._x,o=t._y,a=t._z,l=t._w,c=r+r,h=o+o,u=a+a,d=r*c,f=r*h,g=r*u,_=o*h,m=o*u,p=a*u,b=l*c,T=l*h,x=l*u,S=n.x,M=n.y,A=n.z;return i[0]=(1-(_+p))*S,i[1]=(f+x)*S,i[2]=(g-T)*S,i[3]=0,i[4]=(f-x)*M,i[5]=(1-(d+p))*M,i[6]=(m+b)*M,i[7]=0,i[8]=(g+T)*A,i[9]=(m-b)*A,i[10]=(1-(d+_))*A,i[11]=0,i[12]=e.x,i[13]=e.y,i[14]=e.z,i[15]=1,this}decompose(e,t,n){let i=this.elements;e.x=i[12],e.y=i[13],e.z=i[14];let r=this.determinantAffine();if(r===0)return n.set(1,1,1),t.identity(),this;let o=Us.set(i[0],i[1],i[2]).length(),a=Us.set(i[4],i[5],i[6]).length(),l=Us.set(i[8],i[9],i[10]).length();r<0&&(o=-o),Dn.copy(this);let c=1/o,h=1/a,u=1/l;return Dn.elements[0]*=c,Dn.elements[1]*=c,Dn.elements[2]*=c,Dn.elements[4]*=h,Dn.elements[5]*=h,Dn.elements[6]*=h,Dn.elements[8]*=u,Dn.elements[9]*=u,Dn.elements[10]*=u,t.setFromRotationMatrix(Dn),n.x=o,n.y=a,n.z=l,this}makePerspective(e,t,n,i,r,o,a=On,l=!1){let c=this.elements,h=2*r/(t-e),u=2*r/(n-i),d=(t+e)/(t-e),f=(n+i)/(n-i),g,_;if(l)g=r/(o-r),_=o*r/(o-r);else if(a===On)g=-(o+r)/(o-r),_=-2*o*r/(o-r);else if(a===Js)g=-o/(o-r),_=-o*r/(o-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return c[0]=h,c[4]=0,c[8]=d,c[12]=0,c[1]=0,c[5]=u,c[9]=f,c[13]=0,c[2]=0,c[6]=0,c[10]=g,c[14]=_,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,n,i,r,o,a=On,l=!1){let c=this.elements,h=2/(t-e),u=2/(n-i),d=-(t+e)/(t-e),f=-(n+i)/(n-i),g,_;if(l)g=1/(o-r),_=o/(o-r);else if(a===On)g=-2/(o-r),_=-(o+r)/(o-r);else if(a===Js)g=-1/(o-r),_=-r/(o-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return c[0]=h,c[4]=0,c[8]=0,c[12]=d,c[1]=0,c[5]=u,c[9]=0,c[13]=f,c[2]=0,c[6]=0,c[10]=g,c[14]=_,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){let t=this.elements,n=e.elements;for(let i=0;i<16;i++)if(t[i]!==n[i])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}};ja.prototype.isMatrix4=!0;var Ge=ja,Us=new D,Dn=new Ge,Pm=new D(0,0,0),Im=new D(1,1,1),Li=new D,Jo=new D,yn=new D,hd=new Ge,ud=new Ht,Jn=class s{constructor(e=0,t=0,n=0,i=s.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=i}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,i=this._order){return this._x=e,this._y=t,this._z=n,this._order=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){let i=e.elements,r=i[0],o=i[4],a=i[8],l=i[1],c=i[5],h=i[9],u=i[2],d=i[6],f=i[10];switch(t){case"XYZ":this._y=Math.asin(je(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-h,f),this._z=Math.atan2(-o,r)):(this._x=Math.atan2(d,c),this._z=0);break;case"YXZ":this._x=Math.asin(-je(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(a,f),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-u,r),this._z=0);break;case"ZXY":this._x=Math.asin(je(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-u,f),this._z=Math.atan2(-o,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-je(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(d,f),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-o,c));break;case"YZX":this._z=Math.asin(je(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-u,r)):(this._x=0,this._y=Math.atan2(a,f));break;case"XZY":this._z=Math.asin(-je(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(a,r)):(this._x=Math.atan2(-h,f),this._y=0);break;default:De("Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return hd.makeRotationFromQuaternion(e),this.setFromRotationMatrix(hd,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return ud.setFromEuler(this),this.setFromQuaternion(ud,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};Jn.DEFAULT_ORDER="XYZ";var jr=class{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}},Lm=0,dd=new D,Fs=new Ht,li=new Ge,jo=new D,Or=new D,Dm=new D,Nm=new Ht,fd=new D(1,0,0),pd=new D(0,1,0),md=new D(0,0,1),gd={type:"added"},Um={type:"removed"},Bs={type:"childadded",child:null},Oc={type:"childremoved",child:null},Tt=class s extends Hn{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Lm++}),this.uuid=kn(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=s.DEFAULT_UP.clone();let e=new D,t=new Jn,n=new Ht,i=new D(1,1,1);function r(){n.setFromEuler(t,!1)}function o(){t.setFromQuaternion(n,void 0,!1)}t._onChange(r),n._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:i},modelViewMatrix:{value:new Ge},normalMatrix:{value:new He}}),this.matrix=new Ge,this.matrixWorld=new Ge,this.matrixAutoUpdate=s.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=s.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new jr,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return Fs.setFromAxisAngle(e,t),this.quaternion.multiply(Fs),this}rotateOnWorldAxis(e,t){return Fs.setFromAxisAngle(e,t),this.quaternion.premultiply(Fs),this}rotateX(e){return this.rotateOnAxis(fd,e)}rotateY(e){return this.rotateOnAxis(pd,e)}rotateZ(e){return this.rotateOnAxis(md,e)}translateOnAxis(e,t){return dd.copy(e).applyQuaternion(this.quaternion),this.position.add(dd.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(fd,e)}translateY(e){return this.translateOnAxis(pd,e)}translateZ(e){return this.translateOnAxis(md,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(li.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?jo.copy(e):jo.set(e,t,n);let i=this.parent;this.updateWorldMatrix(!0,!1),Or.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?li.lookAt(Or,jo,this.up):li.lookAt(jo,Or,this.up),this.quaternion.setFromRotationMatrix(li),i&&(li.extractRotation(i.matrixWorld),Fs.setFromRotationMatrix(li),this.quaternion.premultiply(Fs.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(ke("Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(gd),Bs.child=e,this.dispatchEvent(Bs),Bs.child=null):ke("Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}let t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(Um),Oc.child=e,this.dispatchEvent(Oc),Oc.child=null),this}removeFromParent(){let e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),li.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),li.multiply(e.parent.matrixWorld)),e.applyMatrix4(li),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(gd),Bs.child=e,this.dispatchEvent(Bs),Bs.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,i=this.children.length;n<i;n++){let o=this.children[n].getObjectByProperty(e,t);if(o!==void 0)return o}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);let i=this.children;for(let r=0,o=i.length;r<o;r++)i[r].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Or,e,Dm),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Or,Nm,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);let t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}intersectsFrustum(){}traverse(e){e(this);let t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);let t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].traverseVisible(e)}traverseAncestors(e){let t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);let e=this.pivot;if(e!==null){let t=e.x,n=e.y,i=e.z,r=this.matrix.elements;r[12]+=t-r[0]*t-r[4]*n-r[8]*i,r[13]+=n-r[1]*t-r[5]*n-r[9]*i,r[14]+=i-r[2]*t-r[6]*n-r[10]*i}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);let t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t,n=!1){let i=this.parent;if(e===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||n)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,n=!0),t===!0){let r=this.children;for(let o=0,a=r.length;o<a;o++)r[o].updateWorldMatrix(!1,!0,n)}}toJSON(e){let t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});let i={};i.uuid=this.uuid,i.type=this.type,i.name=this.name,i.castShadow=this.castShadow,i.receiveShadow=this.receiveShadow,i.visible=this.visible,i.frustumCulled=this.frustumCulled,i.renderOrder=this.renderOrder,i.static=this.static,i.matrixAutoUpdate=this.matrixAutoUpdate,Object.keys(this.userData).length>0&&(i.userData=this.userData),i.layers=this.layers.mask,i.matrix=this.matrix.toArray(),i.up=this.up.toArray(),this.pivot!==null&&(i.pivot=this.pivot.toArray()),this.morphTargetDictionary!==void 0&&(i.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(i.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(i.type="InstancedMesh",i.count=this.count,i.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(i.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(i.type="BatchedMesh",i.perObjectFrustumCulled=this.perObjectFrustumCulled,i.sortObjects=this.sortObjects,i.drawRanges=this._drawRanges,i.reservedRanges=this._reservedRanges,i.geometryInfo=this._geometryInfo.map(a=>({...a,boundingBox:a.boundingBox?a.boundingBox.toJSON():void 0,boundingSphere:a.boundingSphere?a.boundingSphere.toJSON():void 0})),i.instanceInfo=this._instanceInfo.map(a=>({...a})),i.availableInstanceIds=this._availableInstanceIds.slice(),i.availableGeometryIds=this._availableGeometryIds.slice(),i.nextIndexStart=this._nextIndexStart,i.nextVertexStart=this._nextVertexStart,i.geometryCount=this._geometryCount,i.maxInstanceCount=this._maxInstanceCount,i.maxVertexCount=this._maxVertexCount,i.maxIndexCount=this._maxIndexCount,i.geometryInitialized=this._geometryInitialized,i.matricesTexture=this._matricesTexture.toJSON(e),i.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(i.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(i.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(i.boundingBox=this.boundingBox.toJSON()));function r(a,l){return a[l.uuid]===void 0&&(a[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?i.background=this.background.toJSON():this.background.isTexture&&(i.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(i.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){i.geometry=r(e.geometries,this.geometry);let a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){let l=a.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){let u=l[c];r(e.shapes,u)}else r(e.shapes,l)}}if(this.isSkinnedMesh&&(i.bindMode=this.bindMode,i.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),i.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let a=[];for(let l=0,c=this.material.length;l<c;l++)a.push(r(e.materials,this.material[l]));i.material=a}else i.material=r(e.materials,this.material);if(this.children.length>0){i.children=[];for(let a=0;a<this.children.length;a++)i.children.push(this.children[a].toJSON(e).object)}if(this.animations.length>0){i.animations=[];for(let a=0;a<this.animations.length;a++){let l=this.animations[a];i.animations.push(r(e.animations,l))}}if(t){let a=o(e.geometries),l=o(e.materials),c=o(e.textures),h=o(e.images),u=o(e.shapes),d=o(e.skeletons),f=o(e.animations),g=o(e.nodes);a.length>0&&(n.geometries=a),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),h.length>0&&(n.images=h),u.length>0&&(n.shapes=u),d.length>0&&(n.skeletons=d),f.length>0&&(n.animations=f),g.length>0&&(n.nodes=g)}return n.object=i,n;function o(a){let l=[];for(let c in a){let h=a[c];delete h.metadata,l.push(h)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.pivot=e.pivot!==null?e.pivot.clone():null,this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.static=e.static,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){let i=e.children[n];this.add(i.clone())}return this}dispose(){this.dispatchEvent({type:"dispose"})}};Tt.DEFAULT_UP=new D(0,1,0);Tt.DEFAULT_MATRIX_AUTO_UPDATE=!0;Tt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var St=class extends Tt{constructor(){super(),this.isGroup=!0,this.type="Group"}},Fm={type:"move"},tr=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new St,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new St,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new D,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new D),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new St,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new D,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new D,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){let t=this._hand;if(t)for(let n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let i=null,r=null,o=null,a=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){o=!0;for(let _ of e.hand.values()){let m=t.getJointPose(_,n),p=this._getHandJoint(c,_);m!==null&&(p.matrix.fromArray(m.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=m.radius),p.visible=m!==null}let h=c.joints["index-finger-tip"],u=c.joints["thumb-tip"],d=h.position.distanceTo(u.position),f=.02,g=.005;c.inputState.pinching&&d>f+g?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&d<=f-g&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,n),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1,l.eventsEnabled&&l.dispatchEvent({type:"gripUpdated",data:e,target:this})));a!==null&&(i=t.getPose(e.targetRaySpace,n),i===null&&r!==null&&(i=r),i!==null&&(a.matrix.fromArray(i.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,i.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(i.linearVelocity)):a.hasLinearVelocity=!1,i.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(i.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(Fm)))}return a!==null&&(a.visible=i!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=o!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){let n=new St;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}},Rf={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Di={h:0,s:0,l:0},Qo={h:0,s:0,l:0};function kc(s,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?s+(e-s)*6*t:t<1/2?e:t<2/3?s+(e-s)*6*(2/3-t):s}var de=class{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){let i=e;i&&i.isColor?this.copy(i):typeof i=="number"?this.setHex(i):typeof i=="string"&&this.setStyle(i)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=Mt){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,Ke.colorSpaceToWorking(this,t),this}setRGB(e,t,n,i=Ke.workingColorSpace){return this.r=e,this.g=t,this.b=n,Ke.colorSpaceToWorking(this,i),this}setHSL(e,t,n,i=Ke.workingColorSpace){if(e=Nh(e,1),t=je(t,0,1),n=je(n,0,1),t===0)this.r=this.g=this.b=n;else{let r=n<=.5?n*(1+t):n+t-n*t,o=2*n-r;this.r=kc(o,r,e+1/3),this.g=kc(o,r,e),this.b=kc(o,r,e-1/3)}return Ke.colorSpaceToWorking(this,i),this}setStyle(e,t=Mt){function n(r){r!==void 0&&parseFloat(r)<1&&De("Color: Alpha component of "+e+" will be ignored.")}let i;if(i=/^(\w+)\(([^\)]*)\)/.exec(e)){let r,o=i[1],a=i[2];switch(o){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,t);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:De("Color: Unknown color model "+e)}}else if(i=/^\#([A-Fa-f\d]+)$/.exec(e)){let r=i[1],o=r.length;if(o===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(o===6)return this.setHex(parseInt(r,16),t);De("Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=Mt){let n=Rf[e.toLowerCase()];return n!==void 0?this.setHex(n,t):De("Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=pi(e.r),this.g=pi(e.g),this.b=pi(e.b),this}copyLinearToSRGB(e){return this.r=Ks(e.r),this.g=Ks(e.g),this.b=Ks(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Mt){return Ke.workingToColorSpace(nn.copy(this),e),Math.round(je(nn.r*255,0,255))*65536+Math.round(je(nn.g*255,0,255))*256+Math.round(je(nn.b*255,0,255))}getHexString(e=Mt){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=Ke.workingColorSpace){Ke.workingToColorSpace(nn.copy(this),t);let n=nn.r,i=nn.g,r=nn.b,o=Math.max(n,i,r),a=Math.min(n,i,r),l,c,h=(a+o)/2;if(a===o)l=0,c=0;else{let u=o-a;switch(c=h<=.5?u/(o+a):u/(2-o-a),o){case n:l=(i-r)/u+(i<r?6:0);break;case i:l=(r-n)/u+2;break;case r:l=(n-i)/u+4;break}l/=6}return e.h=l,e.s=c,e.l=h,e}getRGB(e,t=Ke.workingColorSpace){return Ke.workingToColorSpace(nn.copy(this),t),e.r=nn.r,e.g=nn.g,e.b=nn.b,e}getStyle(e=Mt){Ke.workingToColorSpace(nn.copy(this),e);let t=nn.r,n=nn.g,i=nn.b;return e!==Mt?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${i.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(i*255)})`}offsetHSL(e,t,n){return this.getHSL(Di),this.setHSL(Di.h+e,Di.s+t,Di.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(Di),e.getHSL(Qo);let n=Yr(Di.h,Qo.h,t),i=Yr(Di.s,Qo.s,t),r=Yr(Di.l,Qo.l,t);return this.setHSL(n,i,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){let t=this.r,n=this.g,i=this.b,r=e.elements;return this.r=r[0]*t+r[3]*n+r[6]*i,this.g=r[1]*t+r[4]*n+r[7]*i,this.b=r[2]*t+r[5]*n+r[8]*i,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},nn=new de;de.NAMES=Rf;var Qr=class s{constructor(e,t=1,n=1e3){this.isFog=!0,this.name="",this.color=new de(e),this.near=t,this.far=n}clone(){return new s(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}},nr=class extends Tt{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Jn,this.environmentIntensity=1,this.environmentRotation=new Jn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){let t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),t.object.backgroundBlurriness=this.backgroundBlurriness,t.object.backgroundIntensity=this.backgroundIntensity,t.object.backgroundRotation=this.backgroundRotation.toArray(),t.object.environmentIntensity=this.environmentIntensity,t.object.environmentRotation=this.environmentRotation.toArray(),t}},Nn=new D,ci=new D,zc=new D,hi=new D,Os=new D,ks=new D,_d=new D,Hc=new D,Vc=new D,Gc=new D,Wc=new dt,Xc=new dt,qc=new dt,Oi=class s{constructor(e=new D,t=new D,n=new D){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,i){i.subVectors(n,t),Nn.subVectors(e,t),i.cross(Nn);let r=i.lengthSq();return r>0?i.multiplyScalar(1/Math.sqrt(r)):i.set(0,0,0)}static getBarycoord(e,t,n,i,r){Nn.subVectors(i,t),ci.subVectors(n,t),zc.subVectors(e,t);let o=Nn.dot(Nn),a=Nn.dot(ci),l=Nn.dot(zc),c=ci.dot(ci),h=ci.dot(zc),u=o*c-a*a;if(u===0)return r.set(0,0,0),null;let d=1/u,f=(c*l-a*h)*d,g=(o*h-a*l)*d;return r.set(1-f-g,g,f)}static containsPoint(e,t,n,i){return this.getBarycoord(e,t,n,i,hi)===null?!1:hi.x>=0&&hi.y>=0&&hi.x+hi.y<=1}static getInterpolation(e,t,n,i,r,o,a,l){return this.getBarycoord(e,t,n,i,hi)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,hi.x),l.addScaledVector(o,hi.y),l.addScaledVector(a,hi.z),l)}static getInterpolatedAttribute(e,t,n,i,r,o){return Wc.setScalar(0),Xc.setScalar(0),qc.setScalar(0),Wc.fromBufferAttribute(e,t),Xc.fromBufferAttribute(e,n),qc.fromBufferAttribute(e,i),o.setScalar(0),o.addScaledVector(Wc,r.x),o.addScaledVector(Xc,r.y),o.addScaledVector(qc,r.z),o}static isFrontFacing(e,t,n,i){return Nn.subVectors(n,t),ci.subVectors(e,t),Nn.cross(ci).dot(i)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,i){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[i]),this}setFromAttributeAndIndices(e,t,n,i){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,i),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return Nn.subVectors(this.c,this.b),ci.subVectors(this.a,this.b),Nn.cross(ci).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return s.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return s.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,n,i,r){return s.getInterpolation(e,this.a,this.b,this.c,t,n,i,r)}containsPoint(e){return s.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return s.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){let n=this.a,i=this.b,r=this.c,o,a;Os.subVectors(i,n),ks.subVectors(r,n),Hc.subVectors(e,n);let l=Os.dot(Hc),c=ks.dot(Hc);if(l<=0&&c<=0)return t.copy(n);Vc.subVectors(e,i);let h=Os.dot(Vc),u=ks.dot(Vc);if(h>=0&&u<=h)return t.copy(i);let d=l*u-h*c;if(d<=0&&l>=0&&h<=0)return o=l/(l-h),t.copy(n).addScaledVector(Os,o);Gc.subVectors(e,r);let f=Os.dot(Gc),g=ks.dot(Gc);if(g>=0&&f<=g)return t.copy(r);let _=f*c-l*g;if(_<=0&&c>=0&&g<=0)return a=c/(c-g),t.copy(n).addScaledVector(ks,a);let m=h*g-f*u;if(m<=0&&u-h>=0&&f-g>=0)return _d.subVectors(r,i),a=(u-h)/(u-h+(f-g)),t.copy(i).addScaledVector(_d,a);let p=1/(m+_+d);return o=_*p,a=d*p,t.copy(n).addScaledVector(Os,o).addScaledVector(ks,a)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}},dn=class{constructor(e=new D(1/0,1/0,1/0),t=new D(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(Un.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(Un.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){let n=Un.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);let n=e.geometry;if(n!==void 0){let r=n.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let o=0,a=r.count;o<a;o++)e.isMesh===!0?e.getVertexPosition(o,Un):Un.fromBufferAttribute(r,o),Un.applyMatrix4(e.matrixWorld),this.expandByPoint(Un);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),ea.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),ea.copy(n.boundingBox)),ea.applyMatrix4(e.matrixWorld),this.union(ea)}let i=e.children;for(let r=0,o=i.length;r<o;r++)this.expandByObject(i[r],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,Un),Un.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(kr),ta.subVectors(this.max,kr),zs.subVectors(e.a,kr),Hs.subVectors(e.b,kr),Vs.subVectors(e.c,kr),Ni.subVectors(Hs,zs),Ui.subVectors(Vs,Hs),Qi.subVectors(zs,Vs);let t=[0,-Ni.z,Ni.y,0,-Ui.z,Ui.y,0,-Qi.z,Qi.y,Ni.z,0,-Ni.x,Ui.z,0,-Ui.x,Qi.z,0,-Qi.x,-Ni.y,Ni.x,0,-Ui.y,Ui.x,0,-Qi.y,Qi.x,0];return!Yc(t,zs,Hs,Vs,ta)||(t=[1,0,0,0,1,0,0,0,1],!Yc(t,zs,Hs,Vs,ta))?!1:(na.crossVectors(Ni,Ui),t=[na.x,na.y,na.z],Yc(t,zs,Hs,Vs,ta))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,Un).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(Un).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(ui[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),ui[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),ui[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),ui[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),ui[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),ui[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),ui[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),ui[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(ui),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}},ui=[new D,new D,new D,new D,new D,new D,new D,new D],Un=new D,ea=new dn,zs=new D,Hs=new D,Vs=new D,Ni=new D,Ui=new D,Qi=new D,kr=new D,ta=new D,na=new D,es=new D;function Yc(s,e,t,n,i){for(let r=0,o=s.length-3;r<=o;r+=3){es.fromArray(s,r);let a=i.x*Math.abs(es.x)+i.y*Math.abs(es.y)+i.z*Math.abs(es.z),l=e.dot(es),c=t.dot(es),h=n.dot(es);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>a)return!1}return!0}var kt=new D,ia=new Te,Bm=0,Rt=class extends Hn{constructor(e,t,n=!1){if(super(),Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:Bm++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=Lh,this.updateRanges=[],this.gpuType=Mn,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let i=0,r=this.itemSize;i<r;i++)this.array[e+i]=t.array[n+i];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)ia.fromBufferAttribute(this,t),ia.applyMatrix3(e),this.setXY(t,ia.x,ia.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)kt.fromBufferAttribute(this,t),kt.applyMatrix3(e),this.setXYZ(t,kt.x,kt.y,kt.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)kt.fromBufferAttribute(this,t),kt.applyMatrix4(e),this.setXYZ(t,kt.x,kt.y,kt.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)kt.fromBufferAttribute(this,t),kt.applyNormalMatrix(e),this.setXYZ(t,kt.x,kt.y,kt.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)kt.fromBufferAttribute(this,t),kt.transformDirection(e),this.setXYZ(t,kt.x,kt.y,kt.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=Bn(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=ut(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=Bn(t,this.array)),t}setX(e,t){return this.normalized&&(t=ut(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=Bn(t,this.array)),t}setY(e,t){return this.normalized&&(t=ut(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=Bn(t,this.array)),t}setZ(e,t){return this.normalized&&(t=ut(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=Bn(t,this.array)),t}setW(e,t){return this.normalized&&(t=ut(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=ut(t,this.array),n=ut(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,i){return e*=this.itemSize,this.normalized&&(t=ut(t,this.array),n=ut(n,this.array),i=ut(i,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=i,this}setXYZW(e,t,n,i,r){return e*=this.itemSize,this.normalized&&(t=ut(t,this.array),n=ut(n,this.array),i=ut(i,this.array),r=ut(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=i,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return e.name=this.name,e.usage=this.usage,e.gpuType=this.gpuType,e}dispose(){this.dispatchEvent({type:"dispose"})}};var eo=class extends Rt{constructor(e,t,n){super(new Uint16Array(e),t,n)}};var to=class extends Rt{constructor(e,t,n){super(new Uint32Array(e),t,n)}};var Ze=class extends Rt{constructor(e,t,n){super(new Float32Array(e),t,n)}},Om=new dn,zr=new D,Kc=new D,mn=class{constructor(e=new D,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){let n=this.center;t!==void 0?n.copy(t):Om.setFromPoints(e).getCenter(n);let i=0;for(let r=0,o=e.length;r<o;r++)i=Math.max(i,n.distanceToSquared(e[r]));return this.radius=Math.sqrt(i),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){let t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){let n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;zr.subVectors(e,this.center);let t=zr.lengthSq();if(t>this.radius*this.radius){let n=Math.sqrt(t),i=(n-this.radius)*.5;this.center.addScaledVector(zr,i/n),this.radius+=i}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Kc.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(zr.copy(e.center).add(Kc)),this.expandByPoint(zr.copy(e.center).sub(Kc))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}},km=0,wn=new Ge,Zc=new Tt,Gs=new D,bn=new dn,Hr=new dn,$t=new D,yt=class s extends Hn{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:km++}),this.uuid=kn(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(cm(e)?to:eo)(e,1):this.index=e,this}setIndirect(e,t=0){return this.indirect=e,this.indirectOffset=t,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){let t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let r=new He().getNormalMatrix(e);n.applyNormalMatrix(r),n.needsUpdate=!0}let i=this.attributes.tangent;return i!==void 0&&(i.transformDirection(e),i.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(e){return wn.makeRotationFromQuaternion(e),this.applyMatrix4(wn),this}rotateX(e){return wn.makeRotationX(e),this.applyMatrix4(wn),this}rotateY(e){return wn.makeRotationY(e),this.applyMatrix4(wn),this}rotateZ(e){return wn.makeRotationZ(e),this.applyMatrix4(wn),this}translate(e,t,n){return wn.makeTranslation(e,t,n),this.applyMatrix4(wn),this}scale(e,t,n){return wn.makeScale(e,t,n),this.applyMatrix4(wn),this}lookAt(e){return Zc.lookAt(e),Zc.updateMatrix(),this.applyMatrix4(Zc.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Gs).negate(),this.translate(Gs.x,Gs.y,Gs.z),this}setFromPoints(e){let t=this.getAttribute("position");if(t===void 0){let n=[];for(let i=0,r=e.length;i<r;i++){let o=e[i];n.push(o.x,o.y,o.z||0)}this.setAttribute("position",new Ze(n,3))}else{let n=Math.min(e.length,t.count);for(let i=0;i<n;i++){let r=e[i];t.setXYZ(i,r.x,r.y,r.z||0)}e.length>t.count&&De("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new dn);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){ke("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new D(-1/0,-1/0,-1/0),new D(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,i=t.length;n<i;n++){let r=t[n];bn.setFromBufferAttribute(r),this.morphTargetsRelative?($t.addVectors(this.boundingBox.min,bn.min),this.boundingBox.expandByPoint($t),$t.addVectors(this.boundingBox.max,bn.max),this.boundingBox.expandByPoint($t)):(this.boundingBox.expandByPoint(bn.min),this.boundingBox.expandByPoint(bn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&ke('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new mn);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){ke("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new D,1/0);return}if(e){let n=this.boundingSphere.center;if(bn.setFromBufferAttribute(e),t)for(let r=0,o=t.length;r<o;r++){let a=t[r];Hr.setFromBufferAttribute(a),this.morphTargetsRelative?($t.addVectors(bn.min,Hr.min),bn.expandByPoint($t),$t.addVectors(bn.max,Hr.max),bn.expandByPoint($t)):(bn.expandByPoint(Hr.min),bn.expandByPoint(Hr.max))}bn.getCenter(n);let i=0;for(let r=0,o=e.count;r<o;r++)$t.fromBufferAttribute(e,r),i=Math.max(i,n.distanceToSquared($t));if(t)for(let r=0,o=t.length;r<o;r++){let a=t[r],l=this.morphTargetsRelative;for(let c=0,h=a.count;c<h;c++)$t.fromBufferAttribute(a,c),l&&(Gs.fromBufferAttribute(e,c),$t.add(Gs)),i=Math.max(i,n.distanceToSquared($t))}this.boundingSphere.radius=Math.sqrt(i),isNaN(this.boundingSphere.radius)&&ke('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){ke("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let n=t.position,i=t.normal,r=t.uv,o=this.getAttribute("tangent");(o===void 0||o.count!==n.count)&&(o=new Rt(new Float32Array(4*n.count),4),this.setAttribute("tangent",o));let a=[],l=[];for(let v=0;v<n.count;v++)a[v]=new D,l[v]=new D;let c=new D,h=new D,u=new D,d=new Te,f=new Te,g=new Te,_=new D,m=new D;function p(v,w,R){c.fromBufferAttribute(n,v),h.fromBufferAttribute(n,w),u.fromBufferAttribute(n,R),d.fromBufferAttribute(r,v),f.fromBufferAttribute(r,w),g.fromBufferAttribute(r,R),h.sub(c),u.sub(c),f.sub(d),g.sub(d);let L=1/(f.x*g.y-g.x*f.y);isFinite(L)&&(_.copy(h).multiplyScalar(g.y).addScaledVector(u,-f.y).multiplyScalar(L),m.copy(u).multiplyScalar(f.x).addScaledVector(h,-g.x).multiplyScalar(L),a[v].add(_),a[w].add(_),a[R].add(_),l[v].add(m),l[w].add(m),l[R].add(m))}let b=this.groups;b.length===0&&(b=[{start:0,count:e.count}]);for(let v=0,w=b.length;v<w;++v){let R=b[v],L=R.start,P=R.count;for(let N=L,I=L+P;N<I;N+=3)p(e.getX(N+0),e.getX(N+1),e.getX(N+2))}let T=new D,x=new D,S=new D,M=new D;function A(v){S.fromBufferAttribute(i,v),M.copy(S);let w=a[v];T.copy(w),T.sub(S.multiplyScalar(S.dot(w))).normalize(),x.crossVectors(M,w);let L=x.dot(l[v])<0?-1:1;o.setXYZW(v,T.x,T.y,T.z,L)}for(let v=0,w=b.length;v<w;++v){let R=b[v],L=R.start,P=R.count;for(let N=L,I=L+P;N<I;N+=3)A(e.getX(N+0)),A(e.getX(N+1)),A(e.getX(N+2))}this._transformed=!0}computeVertexNormals(){let e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0||n.count!==t.count)n=new Rt(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let d=0,f=n.count;d<f;d++)n.setXYZ(d,0,0,0);let i=new D,r=new D,o=new D,a=new D,l=new D,c=new D,h=new D,u=new D;if(e)for(let d=0,f=e.count;d<f;d+=3){let g=e.getX(d+0),_=e.getX(d+1),m=e.getX(d+2);i.fromBufferAttribute(t,g),r.fromBufferAttribute(t,_),o.fromBufferAttribute(t,m),h.subVectors(o,r),u.subVectors(i,r),h.cross(u),a.fromBufferAttribute(n,g),l.fromBufferAttribute(n,_),c.fromBufferAttribute(n,m),a.add(h),l.add(h),c.add(h),n.setXYZ(g,a.x,a.y,a.z),n.setXYZ(_,l.x,l.y,l.z),n.setXYZ(m,c.x,c.y,c.z)}else for(let d=0,f=t.count;d<f;d+=3)i.fromBufferAttribute(t,d+0),r.fromBufferAttribute(t,d+1),o.fromBufferAttribute(t,d+2),h.subVectors(o,r),u.subVectors(i,r),h.cross(u),n.setXYZ(d+0,h.x,h.y,h.z),n.setXYZ(d+1,h.x,h.y,h.z),n.setXYZ(d+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)$t.fromBufferAttribute(e,t),$t.normalize(),e.setXYZ(t,$t.x,$t.y,$t.z)}toNonIndexed(){function e(a,l){let c=a.array,h=a.itemSize,u=a.normalized,d=new c.constructor(l.length*h),f=0,g=0;for(let _=0,m=l.length;_<m;_++){a.isInterleavedBufferAttribute?f=l[_]*a.data.stride+a.offset:f=l[_]*h;for(let p=0;p<h;p++)d[g++]=c[f++]}return new Rt(d,h,u)}if(this.index===null)return De("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let t=new s,n=this.index.array,i=this.attributes;for(let a in i){let l=i[a],c=e(l,n);t.setAttribute(a,c)}let r=this.morphAttributes;for(let a in r){let l=[],c=r[a];for(let h=0,u=c.length;h<u;h++){let d=c[h],f=e(d,n);l.push(f)}t.morphAttributes[a]=l}t.morphTargetsRelative=this.morphTargetsRelative;let o=this.groups;for(let a=0,l=o.length;a<l;a++){let c=o[a];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){let e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.parameters!==void 0&&this._transformed===!0?"BufferGeometry":this.type,e.name=this.name,Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){let l=this.parameters;for(let c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};let t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});let n=this.attributes;for(let l in n){let c=n[l];e.data.attributes[l]=c.toJSON(e.data)}let i={},r=!1;for(let l in this.morphAttributes){let c=this.morphAttributes[l],h=[];for(let u=0,d=c.length;u<d;u++){let f=c[u];h.push(f.toJSON(e.data))}h.length>0&&(i[l]=h,r=!0)}r&&(e.data.morphAttributes=i,e.data.morphTargetsRelative=this.morphTargetsRelative);let o=this.groups;o.length>0&&(e.data.groups=JSON.parse(JSON.stringify(o)));let a=this.boundingSphere;return a!==null&&(e.data.boundingSphere=a.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let t={};this.name=e.name;let n=e.index;n!==null&&this.setIndex(n.clone());let i=e.attributes;for(let c in i){let h=i[c];this.setAttribute(c,h.clone(t))}let r=e.morphAttributes;for(let c in r){let h=[],u=r[c];for(let d=0,f=u.length;d<f;d++)h.push(u[d].clone(t));this.morphAttributes[c]=h}this.morphTargetsRelative=e.morphTargetsRelative;let o=e.groups;for(let c=0,h=o.length;c<h;c++){let u=o[c];this.addGroup(u.start,u.count,u.materialIndex)}let a=e.boundingBox;a!==null&&(this.boundingBox=a.clone());let l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this._transformed=e._transformed,this}dispose(){this.dispatchEvent({type:"dispose"})}},ir=class{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e!==void 0?e.length/t:0,this.usage=Lh,this.updateRanges=[],this.version=0,this.uuid=kn()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,n){e*=this.stride,n*=t.stride;for(let i=0,r=this.stride;i<r;i++)this.array[e+i]=t.array[n+i];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=kn()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);let t=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(t,this.stride);return n.setUsage(this.usage),n}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=kn()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer)));let t={uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride};return t.usage=this.usage,t}},hn=new D,sr=class s{constructor(e,t,n,i=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=e,this.itemSize=t,this.offset=n,this.normalized=i}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,n=this.data.count;t<n;t++)hn.fromBufferAttribute(this,t),hn.applyMatrix4(e),this.setXYZ(t,hn.x,hn.y,hn.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)hn.fromBufferAttribute(this,t),hn.applyNormalMatrix(e),this.setXYZ(t,hn.x,hn.y,hn.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)hn.fromBufferAttribute(this,t),hn.transformDirection(e),this.setXYZ(t,hn.x,hn.y,hn.z);return this}getComponent(e,t){let n=this.array[e*this.data.stride+this.offset+t];return this.normalized&&(n=Bn(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=ut(n,this.array)),this.data.array[e*this.data.stride+this.offset+t]=n,this}setX(e,t){return this.normalized&&(t=ut(t,this.array)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=ut(t,this.array)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=ut(t,this.array)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=ut(t,this.array)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=Bn(t,this.array)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=Bn(t,this.array)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=Bn(t,this.array)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=Bn(t,this.array)),t}setXY(e,t,n){return e=e*this.data.stride+this.offset,this.normalized&&(t=ut(t,this.array),n=ut(n,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this}setXYZ(e,t,n,i){return e=e*this.data.stride+this.offset,this.normalized&&(t=ut(t,this.array),n=ut(n,this.array),i=ut(i,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=i,this}setXYZW(e,t,n,i,r){return e=e*this.data.stride+this.offset,this.normalized&&(t=ut(t,this.array),n=ut(n,this.array),i=ut(i,this.array),r=ut(r,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=i,this.data.array[e+3]=r,this}clone(e){if(e===void 0){$r("InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");let t=[];for(let n=0;n<this.count;n++){let i=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[i+r])}return new Rt(new this.array.constructor(t),this.itemSize,this.normalized)}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new s(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){$r("InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");let t=[];for(let n=0;n<this.count;n++){let i=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[i+r])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:t,normalized:this.normalized}}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}},$c=new D,zm=new D,Hm=new He,Fn=class{constructor(e=new D(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,i){return this.normal.set(e,t,n),this.constant=i,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){let i=$c.subVectors(n,t).cross(zm.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(i,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){let e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t,n=!0){let i=e.delta($c),r=this.normal.dot(i);if(r===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;let o=-(e.start.dot(this.normal)+this.constant)/r;return n===!0&&(o<0||o>1)?null:t.copy(e.start).addScaledVector(i,o)}intersectsLine(e){let t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){let n=t||Hm.getNormalMatrix(e),i=this.coplanarPoint($c).applyMatrix4(e),r=this.normal.applyMatrix3(n).normalize();return this.constant=-i.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}toJSON(){return{normal:this.normal.toArray(),constant:this.constant}}fromJSON(e){return this.normal.fromArray(e.normal),this.constant=e.constant,this}},Vm=0,sn=class extends Hn{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Vm++}),this.uuid=kn(),this.name="",this.type="Material",this.blending=fr,this.side=ti,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=gh,this.blendDst=_h,this.blendEquation=ys,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new de(0,0,0),this.blendAlpha=0,this.depthFunc=Zs,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=_f,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Sa,this.stencilZFail=Sa,this.stencilZPass=Sa,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(let t in e){let n=e[t];if(n===void 0){De(`Material: parameter '${t}' has value of undefined.`);continue}let i=this[t];if(i===void 0){De(`Material: '${t}' is not a property of THREE.${this.type}.`);continue}i&&i.isColor?i.set(n):i&&i.isVector2&&n&&n.isVector2||i&&i.isEuler&&n&&n.isEuler||i&&i.isVector3&&n&&n.isVector3?i.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});let n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,n.blending=this.blending,n.side=this.side,n.shadowSide=this.shadowSide,n.vertexColors=this.vertexColors,n.opacity=this.opacity,n.transparent=this.transparent,n.blendSrc=this.blendSrc,n.blendDst=this.blendDst,n.blendEquation=this.blendEquation,n.blendSrcAlpha=this.blendSrcAlpha,n.blendDstAlpha=this.blendDstAlpha,n.blendEquationAlpha=this.blendEquationAlpha,n.blendColor=this.blendColor.getHex(),n.blendAlpha=this.blendAlpha,n.depthFunc=this.depthFunc,n.depthTest=this.depthTest,n.depthWrite=this.depthWrite,n.colorWrite=this.colorWrite,n.clipIntersection=this.clipIntersection,n.clipShadows=this.clipShadows,n.stencilWriteMask=this.stencilWriteMask,n.stencilFunc=this.stencilFunc,n.stencilRef=this.stencilRef,n.stencilFuncMask=this.stencilFuncMask,n.stencilFail=this.stencilFail,n.stencilZFail=this.stencilZFail,n.stencilZPass=this.stencilZPass,n.stencilWrite=this.stencilWrite,n.polygonOffset=this.polygonOffset,n.polygonOffsetFactor=this.polygonOffsetFactor,n.polygonOffsetUnits=this.polygonOffsetUnits,n.dithering=this.dithering,n.alphaTest=this.alphaTest,n.alphaHash=this.alphaHash,n.alphaToCoverage=this.alphaToCoverage,n.premultipliedAlpha=this.premultipliedAlpha,n.forceSinglePass=this.forceSinglePass,n.allowOverride=this.allowOverride,n.visible=this.visible,n.toneMapped=this.toneMapped,n.name=this.name,this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.retroreflectivity!==void 0&&(n.retroreflectivity=this.retroreflectivity),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),Array.isArray(this.clippingPlanes)&&this.clippingPlanes.length>0&&(n.clippingPlanes=this.clippingPlanes.map(r=>r.toJSON())),this.rotation!==void 0&&(n.rotation=this.rotation),this.depthPacking!==void 0&&(n.depthPacking=this.depthPacking),this.linewidth!==void 0&&(n.linewidth=this.linewidth),this.linecap!==void 0&&(n.linecap=this.linecap),this.linejoin!==void 0&&(n.linejoin=this.linejoin),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.wireframe!==void 0&&(n.wireframe=this.wireframe),this.wireframeLinewidth!==void 0&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!==void 0&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!==void 0&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading!==void 0&&(n.flatShading=this.flatShading),this.fog!==void 0&&(n.fog=this.fog),Object.keys(this.userData).length>0&&(n.userData=this.userData);function i(r){let o=[];for(let a in r){let l=r[a];delete l.metadata,o.push(l)}return o}if(t){let r=i(e.textures),o=i(e.images);r.length>0&&(n.textures=r),o.length>0&&(n.images=o)}return n}fromJSON(e,t){if(e.uuid!==void 0&&(this.uuid=e.uuid),e.name!==void 0&&(this.name=e.name),e.color!==void 0&&this.color!==void 0&&this.color.setHex(e.color),e.roughness!==void 0&&(this.roughness=e.roughness),e.metalness!==void 0&&(this.metalness=e.metalness),e.sheen!==void 0&&(this.sheen=e.sheen),e.sheenColor!==void 0&&(this.sheenColor=new de().setHex(e.sheenColor)),e.sheenRoughness!==void 0&&(this.sheenRoughness=e.sheenRoughness),e.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(e.emissive),e.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(e.specular),e.specularIntensity!==void 0&&(this.specularIntensity=e.specularIntensity),e.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(e.specularColor),e.shininess!==void 0&&(this.shininess=e.shininess),e.clearcoat!==void 0&&(this.clearcoat=e.clearcoat),e.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=e.clearcoatRoughness),e.dispersion!==void 0&&(this.dispersion=e.dispersion),e.retroreflectivity!==void 0&&(this.retroreflectivity=e.retroreflectivity),e.iridescence!==void 0&&(this.iridescence=e.iridescence),e.iridescenceIOR!==void 0&&(this.iridescenceIOR=e.iridescenceIOR),e.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessRange=e.iridescenceThicknessRange),e.transmission!==void 0&&(this.transmission=e.transmission),e.thickness!==void 0&&(this.thickness=e.thickness),e.attenuationDistance!==void 0&&(this.attenuationDistance=e.attenuationDistance),e.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(e.attenuationColor),e.anisotropy!==void 0&&(this.anisotropy=e.anisotropy),e.anisotropyRotation!==void 0&&(this.anisotropyRotation=e.anisotropyRotation),e.fog!==void 0&&(this.fog=e.fog),e.flatShading!==void 0&&(this.flatShading=e.flatShading),e.blending!==void 0&&(this.blending=e.blending),e.combine!==void 0&&(this.combine=e.combine),e.side!==void 0&&(this.side=e.side),e.shadowSide!==void 0&&(this.shadowSide=e.shadowSide),e.opacity!==void 0&&(this.opacity=e.opacity),e.transparent!==void 0&&(this.transparent=e.transparent),e.alphaTest!==void 0&&(this.alphaTest=e.alphaTest),e.alphaHash!==void 0&&(this.alphaHash=e.alphaHash),e.depthFunc!==void 0&&(this.depthFunc=e.depthFunc),e.depthTest!==void 0&&(this.depthTest=e.depthTest),e.depthWrite!==void 0&&(this.depthWrite=e.depthWrite),e.colorWrite!==void 0&&(this.colorWrite=e.colorWrite),e.clippingPlanes!==void 0&&(this.clippingPlanes=e.clippingPlanes.map(n=>new Fn().fromJSON(n))),e.clipIntersection!==void 0&&(this.clipIntersection=e.clipIntersection),e.clipShadows!==void 0&&(this.clipShadows=e.clipShadows),e.depthPacking!==void 0&&(this.depthPacking=e.depthPacking),e.blendSrc!==void 0&&(this.blendSrc=e.blendSrc),e.blendDst!==void 0&&(this.blendDst=e.blendDst),e.blendEquation!==void 0&&(this.blendEquation=e.blendEquation),e.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=e.blendSrcAlpha),e.blendDstAlpha!==void 0&&(this.blendDstAlpha=e.blendDstAlpha),e.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=e.blendEquationAlpha),e.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(e.blendColor),e.blendAlpha!==void 0&&(this.blendAlpha=e.blendAlpha),e.stencilWriteMask!==void 0&&(this.stencilWriteMask=e.stencilWriteMask),e.stencilFunc!==void 0&&(this.stencilFunc=e.stencilFunc),e.stencilRef!==void 0&&(this.stencilRef=e.stencilRef),e.stencilFuncMask!==void 0&&(this.stencilFuncMask=e.stencilFuncMask),e.stencilFail!==void 0&&(this.stencilFail=e.stencilFail),e.stencilZFail!==void 0&&(this.stencilZFail=e.stencilZFail),e.stencilZPass!==void 0&&(this.stencilZPass=e.stencilZPass),e.stencilWrite!==void 0&&(this.stencilWrite=e.stencilWrite),e.wireframe!==void 0&&(this.wireframe=e.wireframe),e.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=e.wireframeLinewidth),e.wireframeLinecap!==void 0&&(this.wireframeLinecap=e.wireframeLinecap),e.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=e.wireframeLinejoin),e.rotation!==void 0&&(this.rotation=e.rotation),e.linewidth!==void 0&&(this.linewidth=e.linewidth),e.linecap!==void 0&&(this.linecap=e.linecap),e.linejoin!==void 0&&(this.linejoin=e.linejoin),e.dashSize!==void 0&&(this.dashSize=e.dashSize),e.gapSize!==void 0&&(this.gapSize=e.gapSize),e.scale!==void 0&&(this.scale=e.scale),e.polygonOffset!==void 0&&(this.polygonOffset=e.polygonOffset),e.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=e.polygonOffsetFactor),e.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=e.polygonOffsetUnits),e.dithering!==void 0&&(this.dithering=e.dithering),e.alphaToCoverage!==void 0&&(this.alphaToCoverage=e.alphaToCoverage),e.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=e.premultipliedAlpha),e.forceSinglePass!==void 0&&(this.forceSinglePass=e.forceSinglePass),e.allowOverride!==void 0&&(this.allowOverride=e.allowOverride),e.visible!==void 0&&(this.visible=e.visible),e.toneMapped!==void 0&&(this.toneMapped=e.toneMapped),e.userData!==void 0&&(this.userData=e.userData),e.vertexColors!==void 0&&(typeof e.vertexColors=="number"?this.vertexColors=e.vertexColors>0:this.vertexColors=e.vertexColors),e.size!==void 0&&(this.size=e.size),e.sizeAttenuation!==void 0&&(this.sizeAttenuation=e.sizeAttenuation),e.map!==void 0&&(this.map=t[e.map]||null),e.matcap!==void 0&&(this.matcap=t[e.matcap]||null),e.alphaMap!==void 0&&(this.alphaMap=t[e.alphaMap]||null),e.bumpMap!==void 0&&(this.bumpMap=t[e.bumpMap]||null),e.bumpScale!==void 0&&(this.bumpScale=e.bumpScale),e.normalMap!==void 0&&(this.normalMap=t[e.normalMap]||null),e.normalMapType!==void 0&&(this.normalMapType=e.normalMapType),e.normalScale!==void 0){let n=e.normalScale;Array.isArray(n)===!1&&(n=[n,n]),this.normalScale=new Te().fromArray(n)}return e.displacementMap!==void 0&&(this.displacementMap=t[e.displacementMap]||null),e.displacementScale!==void 0&&(this.displacementScale=e.displacementScale),e.displacementBias!==void 0&&(this.displacementBias=e.displacementBias),e.roughnessMap!==void 0&&(this.roughnessMap=t[e.roughnessMap]||null),e.metalnessMap!==void 0&&(this.metalnessMap=t[e.metalnessMap]||null),e.emissiveMap!==void 0&&(this.emissiveMap=t[e.emissiveMap]||null),e.emissiveIntensity!==void 0&&(this.emissiveIntensity=e.emissiveIntensity),e.specularMap!==void 0&&(this.specularMap=t[e.specularMap]||null),e.specularIntensityMap!==void 0&&(this.specularIntensityMap=t[e.specularIntensityMap]||null),e.specularColorMap!==void 0&&(this.specularColorMap=t[e.specularColorMap]||null),e.envMap!==void 0&&(this.envMap=t[e.envMap]||null),e.envMapRotation!==void 0&&this.envMapRotation.fromArray(e.envMapRotation),e.envMapIntensity!==void 0&&(this.envMapIntensity=e.envMapIntensity),e.reflectivity!==void 0&&(this.reflectivity=e.reflectivity),e.refractionRatio!==void 0&&(this.refractionRatio=e.refractionRatio),e.lightMap!==void 0&&(this.lightMap=t[e.lightMap]||null),e.lightMapIntensity!==void 0&&(this.lightMapIntensity=e.lightMapIntensity),e.aoMap!==void 0&&(this.aoMap=t[e.aoMap]||null),e.aoMapIntensity!==void 0&&(this.aoMapIntensity=e.aoMapIntensity),e.gradientMap!==void 0&&(this.gradientMap=t[e.gradientMap]||null),e.clearcoatMap!==void 0&&(this.clearcoatMap=t[e.clearcoatMap]||null),e.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=t[e.clearcoatRoughnessMap]||null),e.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=t[e.clearcoatNormalMap]||null),e.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new Te().fromArray(e.clearcoatNormalScale)),e.iridescenceMap!==void 0&&(this.iridescenceMap=t[e.iridescenceMap]||null),e.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=t[e.iridescenceThicknessMap]||null),e.transmissionMap!==void 0&&(this.transmissionMap=t[e.transmissionMap]||null),e.thicknessMap!==void 0&&(this.thicknessMap=t[e.thicknessMap]||null),e.anisotropyMap!==void 0&&(this.anisotropyMap=t[e.anisotropyMap]||null),e.sheenColorMap!==void 0&&(this.sheenColorMap=t[e.sheenColorMap]||null),e.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=t[e.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;let t=e.clippingPlanes,n=null;if(t!==null){let i=t.length;n=new Array(i);for(let r=0;r!==i;++r)n[r]=t[r].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}};var di=new D,Jc=new D,sa=new D,ra=new D,cs=class{constructor(e=new D,t=new D(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,di)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);let n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){let t=di.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(di.copy(this.origin).addScaledVector(this.direction,t),di.distanceToSquared(e))}distanceSqToSegment(e,t,n,i){Jc.copy(e).add(t).multiplyScalar(.5),sa.copy(t).sub(e).normalize(),ra.copy(this.origin).sub(Jc);let r=e.distanceTo(t)*.5,o=-this.direction.dot(sa),a=ra.dot(this.direction),l=-ra.dot(sa),c=ra.lengthSq(),h=Math.abs(1-o*o),u,d,f,g;if(h>0)if(u=o*l-a,d=o*a-l,g=r*h,u>=0)if(d>=-g)if(d<=g){let _=1/h;u*=_,d*=_,f=u*(u+o*d+2*a)+d*(o*u+d+2*l)+c}else d=r,u=Math.max(0,-(o*d+a)),f=-u*u+d*(d+2*l)+c;else d=-r,u=Math.max(0,-(o*d+a)),f=-u*u+d*(d+2*l)+c;else d<=-g?(u=Math.max(0,-(-o*r+a)),d=u>0?-r:Math.min(Math.max(-r,-l),r),f=-u*u+d*(d+2*l)+c):d<=g?(u=0,d=Math.min(Math.max(-r,-l),r),f=d*(d+2*l)+c):(u=Math.max(0,-(o*r+a)),d=u>0?r:Math.min(Math.max(-r,-l),r),f=-u*u+d*(d+2*l)+c);else d=o>0?-r:r,u=Math.max(0,-(o*d+a)),f=-u*u+d*(d+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,u),i&&i.copy(Jc).addScaledVector(sa,d),f}intersectSphere(e,t){if(e.radius<0)return null;di.subVectors(e.center,this.origin);let n=di.dot(this.direction),i=di.dot(di)-n*n,r=e.radius*e.radius;if(i>r)return null;let o=Math.sqrt(r-i),a=n-o,l=n+o;return l<0?null:a<0?this.at(l,t):this.at(a,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){let t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){let n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){let t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,i,r,o,a,l,c=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,d=this.origin;return c>=0?(n=(e.min.x-d.x)*c,i=(e.max.x-d.x)*c):(n=(e.max.x-d.x)*c,i=(e.min.x-d.x)*c),h>=0?(r=(e.min.y-d.y)*h,o=(e.max.y-d.y)*h):(r=(e.max.y-d.y)*h,o=(e.min.y-d.y)*h),n>o||r>i||((r>n||isNaN(n))&&(n=r),(o<i||isNaN(i))&&(i=o),u>=0?(a=(e.min.z-d.z)*u,l=(e.max.z-d.z)*u):(a=(e.max.z-d.z)*u,l=(e.min.z-d.z)*u),n>l||a>i)||((a>n||n!==n)&&(n=a),(l<i||i!==i)&&(i=l),i<0)?null:this.at(n>=0?n:i,t)}intersectsBox(e){return this.intersectBox(e,di)!==null}intersectTriangle(e,t,n,i,r){let o=this.origin,a=this.direction,l=a.x,c=a.y,h=a.z,u=e.x-o.x,d=e.y-o.y,f=e.z-o.z,g=t.x-o.x,_=t.y-o.y,m=t.z-o.z,p=n.x-o.x,b=n.y-o.y,T=n.z-o.z,x=Math.abs(l),S=Math.abs(c),M=Math.abs(h),A,v,w,R,L,P,N,I,H,V,q,ee;if(x>=S&&x>=M?(w=l,P=u,H=g,ee=p,l>=0?(A=c,v=h,R=d,L=f,N=_,I=m,V=b,q=T):(A=h,v=c,R=f,L=d,N=m,I=_,V=T,q=b)):S>=M?(w=c,P=d,H=_,ee=b,c>=0?(A=h,v=l,R=f,L=u,N=m,I=g,V=T,q=p):(A=l,v=h,R=u,L=f,N=g,I=m,V=p,q=T)):(w=h,P=f,H=m,ee=T,h>=0?(A=l,v=c,R=u,L=d,N=g,I=_,V=p,q=b):(A=c,v=l,R=d,L=u,N=_,I=g,V=b,q=p)),w===0)return null;let k=A/w,te=v/w,re=1/w,Ee=R-k*P,Re=L-te*P,ht=N-k*H,et=I-te*H,tt=V-k*ee,Z=q-te*ee,Q=tt*et-Z*ht,ye=Ee*Z-Re*tt,Oe=ht*Re-et*Ee;if(i){if(Q<0||ye<0||Oe<0)return null}else if((Q<0||ye<0||Oe<0)&&(Q>0||ye>0||Oe>0))return null;let ve=Q+ye+Oe;if(ve===0)return null;let ze=re*(Q*P+ye*H+Oe*ee);return(ve>0?ze<0:ze>0)?null:this.at(ze/ve,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},st=class extends sn{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new de(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Jn,this.combine=el,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}},xd=new Ge,ts=new cs,oa=new mn,vd=new D,aa=new D,la=new D,ca=new D,jc=new D,ha=new D,yd=new D,ua=new D,Be=class extends Tt{constructor(e=new yt,t=new st){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let i=t[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=i.length;r<o;r++){let a=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}getVertexPosition(e,t){let n=this.geometry,i=n.attributes.position,r=n.morphAttributes.position,o=n.morphTargetsRelative;t.fromBufferAttribute(i,e);let a=this.morphTargetInfluences;if(r&&a){ha.set(0,0,0);for(let l=0,c=r.length;l<c;l++){let h=a[l],u=r[l];h!==0&&(jc.fromBufferAttribute(u,e),o?ha.addScaledVector(jc,h):ha.addScaledVector(jc.sub(t),h))}t.add(ha)}return t}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){let n=this.geometry,i=this.material,r=this.matrixWorld;i!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),oa.copy(n.boundingSphere),oa.applyMatrix4(r),ts.copy(e.ray).recast(e.near),!(oa.containsPoint(ts.origin)===!1&&(ts.intersectSphere(oa,vd)===null||ts.origin.distanceToSquared(vd)>(e.far-e.near)**2))&&(xd.copy(r).invert(),ts.copy(e.ray).applyMatrix4(xd),!(n.boundingBox!==null&&ts.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,ts)))}_computeIntersections(e,t,n){let i,r=this.geometry,o=this.material,a=r.index,l=r.attributes.position,c=r.attributes.uv,h=r.attributes.uv1,u=r.attributes.normal,d=r.groups,f=r.drawRange;if(a!==null)if(Array.isArray(o))for(let g=0,_=d.length;g<_;g++){let m=d[g],p=o[m.materialIndex],b=Math.max(m.start,f.start),T=Math.min(a.count,Math.min(m.start+m.count,f.start+f.count));for(let x=b,S=T;x<S;x+=3){let M=a.getX(x),A=a.getX(x+1),v=a.getX(x+2);i=da(this,p,e,n,c,h,u,M,A,v),i&&(i.faceIndex=Math.floor(x/3),i.face.materialIndex=m.materialIndex,t.push(i))}}else{let g=Math.max(0,f.start),_=Math.min(a.count,f.start+f.count);for(let m=g,p=_;m<p;m+=3){let b=a.getX(m),T=a.getX(m+1),x=a.getX(m+2);i=da(this,o,e,n,c,h,u,b,T,x),i&&(i.faceIndex=Math.floor(m/3),t.push(i))}}else if(l!==void 0)if(Array.isArray(o))for(let g=0,_=d.length;g<_;g++){let m=d[g],p=o[m.materialIndex],b=Math.max(m.start,f.start),T=Math.min(l.count,Math.min(m.start+m.count,f.start+f.count));for(let x=b,S=T;x<S;x+=3){let M=x,A=x+1,v=x+2;i=da(this,p,e,n,c,h,u,M,A,v),i&&(i.faceIndex=Math.floor(x/3),i.face.materialIndex=m.materialIndex,t.push(i))}}else{let g=Math.max(0,f.start),_=Math.min(l.count,f.start+f.count);for(let m=g,p=_;m<p;m+=3){let b=m,T=m+1,x=m+2;i=da(this,o,e,n,c,h,u,b,T,x),i&&(i.faceIndex=Math.floor(m/3),t.push(i))}}}};function Gm(s,e,t,n,i,r,o,a){let l;if(e.side===Ft?l=n.intersectTriangle(o,r,i,!0,a):l=n.intersectTriangle(i,r,o,e.side===ti,a),l===null)return null;ua.copy(a),ua.applyMatrix4(s.matrixWorld);let c=t.ray.origin.distanceTo(ua);return c<t.near||c>t.far?null:{distance:c,point:ua.clone(),object:s}}function da(s,e,t,n,i,r,o,a,l,c){s.getVertexPosition(a,aa),s.getVertexPosition(l,la),s.getVertexPosition(c,ca);let h=Gm(s,e,t,n,aa,la,ca,yd);if(h){let u=new D;Oi.getBarycoord(yd,aa,la,ca,u),i&&(h.uv=Oi.getInterpolatedAttribute(i,a,l,c,u,new Te)),r&&(h.uv1=Oi.getInterpolatedAttribute(r,a,l,c,u,new Te)),o&&(h.normal=Oi.getInterpolatedAttribute(o,a,l,c,u,new D),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));let d={a,b:l,c,normal:new D,materialIndex:0};Oi.getNormal(aa,la,ca,d.normal),h.face=d,h.barycoord=u}return h}var Vr=new dt,bd=new dt,Md=new dt,Wm=new dt,Sd=new Ge,fa=new D,Qc=new mn,Td=new Ge,eh=new cs,no=class extends Be{constructor(e,t){super(e,t),this.isSkinnedMesh=!0,this.type="SkinnedMesh",this.bindMode=sh,this.bindMatrix=new Ge,this.bindMatrixInverse=new Ge,this.boundingBox=null,this.boundingSphere=null}computeBoundingBox(){let e=this.geometry;this.boundingBox===null&&(this.boundingBox=new dn),this.boundingBox.makeEmpty();let t=e.getAttribute("position");for(let n=0;n<t.count;n++)this.getVertexPosition(n,fa),this.boundingBox.expandByPoint(fa)}computeBoundingSphere(){let e=this.geometry;this.boundingSphere===null&&(this.boundingSphere=new mn),this.boundingSphere.makeEmpty();let t=e.getAttribute("position");for(let n=0;n<t.count;n++)this.getVertexPosition(n,fa),this.boundingSphere.expandByPoint(fa)}copy(e,t){return super.copy(e,t),this.bindMode=e.bindMode,this.bindMatrix.copy(e.bindMatrix),this.bindMatrixInverse.copy(e.bindMatrixInverse),this.skeleton=e.skeleton,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}raycast(e,t){let n=this.material,i=this.matrixWorld;n!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Qc.copy(this.boundingSphere),Qc.applyMatrix4(i),e.ray.intersectsSphere(Qc)!==!1&&(Td.copy(i).invert(),eh.copy(e.ray).applyMatrix4(Td),!(this.boundingBox!==null&&eh.intersectsBox(this.boundingBox)===!1)&&this._computeIntersections(e,t,eh)))}getVertexPosition(e,t){return super.getVertexPosition(e,t),this.applyBoneTransform(e,t),t}bind(e,t){this.skeleton=e,t===void 0&&(this.updateMatrixWorld(!0),this.skeleton.calculateInverses(),t=this.matrixWorld),this.bindMatrix.copy(t),this.bindMatrixInverse.copy(t).invert()}pose(){this.skeleton.pose()}normalizeSkinWeights(){let e=new dt,t=this.geometry.attributes.skinWeight;for(let n=0,i=t.count;n<i;n++){e.fromBufferAttribute(t,n);let r=1/e.manhattanLength();r!==1/0?e.multiplyScalar(r):e.set(1,0,0,0),t.setXYZW(n,e.x,e.y,e.z,e.w)}}updateMatrixWorld(e){super.updateMatrixWorld(e),this.bindMode===sh?this.bindMatrixInverse.copy(this.matrixWorld).invert():this.bindMode===uf?this.bindMatrixInverse.copy(this.bindMatrix).invert():De("SkinnedMesh: Unrecognized bindMode: "+this.bindMode)}applyBoneTransform(e,t){let n=this.skeleton,i=this.geometry;bd.fromBufferAttribute(i.attributes.skinIndex,e),Md.fromBufferAttribute(i.attributes.skinWeight,e),t.isVector4?(Vr.copy(t),t.set(0,0,0,0)):(Vr.set(...t,1),t.set(0,0,0)),Vr.applyMatrix4(this.bindMatrix);for(let r=0;r<4;r++){let o=Md.getComponent(r);if(o!==0){let a=bd.getComponent(r);Sd.multiplyMatrices(n.bones[a].matrixWorld,n.boneInverses[a]),t.addScaledVector(Wm.copy(Vr).applyMatrix4(Sd),o)}}return t.isVector4&&(t.w=Vr.w),t.applyMatrix4(this.bindMatrixInverse)}},rr=class extends Tt{constructor(){super(),this.isBone=!0,this.type="Bone"}},ki=class extends Wt{constructor(e=null,t=1,n=1,i,r,o,a,l,c=Lt,h=Lt,u,d){super(null,o,a,l,c,h,i,r,u,d),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}},Ed=new Ge,Xm=new Ge,io=class s{constructor(e=[],t=[]){this.uuid=kn(),this.bones=e.slice(0),this.boneInverses=t,this.boneMatrices=null,this.boneTexture=null,this.init()}init(){let e=this.bones,t=this.boneInverses;if(this.boneMatrices=new Float32Array(e.length*16),t.length===0)this.calculateInverses();else if(e.length!==t.length){De("Skeleton: Number of inverse bone matrices does not match amount of bones."),this.boneInverses=[];for(let n=0,i=this.bones.length;n<i;n++)this.boneInverses.push(new Ge)}}calculateInverses(){this.boneInverses.length=0;for(let e=0,t=this.bones.length;e<t;e++){let n=new Ge;this.bones[e]&&n.copy(this.bones[e].matrixWorld).invert(),this.boneInverses.push(n)}}pose(){for(let e=0,t=this.bones.length;e<t;e++){let n=this.bones[e];n&&n.matrixWorld.copy(this.boneInverses[e]).invert()}for(let e=0,t=this.bones.length;e<t;e++){let n=this.bones[e];n&&(n.parent&&n.parent.isBone?(n.matrix.copy(n.parent.matrixWorld).invert(),n.matrix.multiply(n.matrixWorld)):n.matrix.copy(n.matrixWorld),n.matrix.decompose(n.position,n.quaternion,n.scale))}}update(){let e=this.bones,t=this.boneInverses,n=this.boneMatrices,i=this.boneTexture;for(let r=0,o=e.length;r<o;r++){let a=e[r]?e[r].matrixWorld:Xm;Ed.multiplyMatrices(a,t[r]),Ed.toArray(n,r*16)}i!==null&&(i.needsUpdate=!0)}clone(){return new s(this.bones,this.boneInverses)}computeBoneTexture(){let e=Math.sqrt(this.bones.length*4);e=Math.ceil(e/4)*4,e=Math.max(e,4);let t=new Float32Array(e*e*4);t.set(this.boneMatrices);let n=new ki(t,e,e,Sn,Mn);return n.needsUpdate=!0,this.boneMatrices=t,this.boneTexture=n,this}getBoneByName(e){for(let t=0,n=this.bones.length;t<n;t++){let i=this.bones[t];if(i.name===e)return i}}dispose(){this.boneTexture!==null&&(this.boneTexture.dispose(),this.boneTexture=null)}fromJSON(e,t){this.uuid=e.uuid;for(let n=0,i=e.bones.length;n<i;n++){let r=e.bones[n],o=t[r];o===void 0&&(De("Skeleton: No bone found with UUID:",r),o=new rr),this.bones.push(o),this.boneInverses.push(new Ge().fromArray(e.boneInverses[n]))}return this.init(),this}toJSON(){let e={metadata:{version:4.7,type:"Skeleton",generator:"Skeleton.toJSON"},bones:[],boneInverses:[]};e.uuid=this.uuid;let t=this.bones,n=this.boneInverses;for(let i=0,r=t.length;i<r;i++){let o=t[i];e.bones.push(o.uuid);let a=n[i];e.boneInverses.push(a.toArray())}return e}},mi=class extends Rt{constructor(e,t,n,i=1){super(e,t,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=i}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){let e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}},Ws=new Ge,wd=new Ge,pa=[],Ad=new dn,qm=new Ge,Gr=new Be,Wr=new mn,jn=class extends Be{constructor(e,t,n){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new mi(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let i=0;i<n;i++)this.setMatrixAt(i,qm)}computeBoundingBox(){let e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new dn),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,Ws),Ad.copy(e.boundingBox).applyMatrix4(Ws),this.boundingBox.union(Ad)}computeBoundingSphere(){let e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new mn),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,Ws),Wr.copy(e.boundingSphere).applyMatrix4(Ws),this.boundingSphere.union(Wr)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){return this.instanceColor===null?t.setRGB(1,1,1):t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){return t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){let n=t.morphTargetInfluences,i=this.morphTexture.source.data.data,r=n.length+1,o=e*r+1;for(let a=0;a<n.length;a++)n[a]=i[o+a]}raycast(e,t){let n=this.matrixWorld,i=this.count;if(Gr.geometry=this.geometry,Gr.material=this.material,Gr.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Wr.copy(this.boundingSphere),Wr.applyMatrix4(n),e.ray.intersectsSphere(Wr)!==!1))for(let r=0;r<i;r++){this.getMatrixAt(r,Ws),wd.multiplyMatrices(n,Ws),Gr.matrixWorld=wd,Gr.raycast(e,pa);for(let o=0,a=pa.length;o<a;o++){let l=pa[o];l.instanceId=r,l.object=this,t.push(l)}pa.length=0}}setColorAt(e,t){return this.instanceColor===null&&(this.instanceColor=new mi(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3),this}setMatrixAt(e,t){return t.toArray(this.instanceMatrix.array,e*16),this}setMorphAt(e,t){let n=t.morphTargetInfluences,i=n.length+1;this.morphTexture===null&&(this.morphTexture=new ki(new Float32Array(i*this.count),i,this.count,_r,Mn));let r=this.morphTexture.source.data.data,o=0;for(let c=0;c<n.length;c++)o+=n[c];let a=this.geometry.morphTargetsRelative?1:1-o,l=i*e;return r[l]=a,r.set(n,l+1),this}updateMorphTargets(){}dispose(){super.dispose(),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}},ns=new mn,Ym=new Te(.5,.5),ma=new D,or=class{constructor(e=new Fn,t=new Fn,n=new Fn,i=new Fn,r=new Fn,o=new Fn){this.planes=[e,t,n,i,r,o]}set(e,t,n,i,r,o){let a=this.planes;return a[0].copy(e),a[1].copy(t),a[2].copy(n),a[3].copy(i),a[4].copy(r),a[5].copy(o),this}copy(e){let t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=On,n=!1){let i=this.planes,r=e.elements,o=r[0],a=r[1],l=r[2],c=r[3],h=r[4],u=r[5],d=r[6],f=r[7],g=r[8],_=r[9],m=r[10],p=r[11],b=r[12],T=r[13],x=r[14],S=r[15];if(i[0].setComponents(c-o,f-h,p-g,S-b).normalize(),i[1].setComponents(c+o,f+h,p+g,S+b).normalize(),i[2].setComponents(c+a,f+u,p+_,S+T).normalize(),i[3].setComponents(c-a,f-u,p-_,S-T).normalize(),n)i[4].setComponents(l,d,m,x).normalize(),i[5].setComponents(c-l,f-d,p-m,S-x).normalize();else if(i[4].setComponents(c-l,f-d,p-m,S-x).normalize(),t===On)i[5].setComponents(c+l,f+d,p+m,S+x).normalize();else if(t===Js)i[5].setComponents(l,d,m,x).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),ns.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{let t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),ns.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(ns)}intersectsSprite(e){ns.center.set(0,0,0);let t=Ym.distanceTo(e.center);return ns.radius=.7071067811865476+t,ns.applyMatrix4(e.matrixWorld),this.intersectsSphere(ns)}intersectsSphere(e){let t=this.planes,n=e.center,i=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(n)<i)return!1;return!0}intersectsBox(e){let t=this.planes;for(let n=0;n<6;n++){let i=t[n];if(ma.x=i.normal.x>0?e.max.x:e.min.x,ma.y=i.normal.y>0?e.max.y:e.min.y,ma.z=i.normal.z>0?e.max.z:e.min.z,i.distanceToPoint(ma)<0)return!1}return!0}containsPoint(e){let t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}};var ar=class extends sn{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new de(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}},Ua=new D,Fa=new D,Rd=new Ge,Xr=new cs,ga=new mn,th=new D,Cd=new D,hs=class extends Tt{constructor(e=new yt,t=new ar){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,n=[0];for(let i=1,r=t.count;i<r;i++)Ua.fromBufferAttribute(t,i-1),Fa.fromBufferAttribute(t,i),n[i]=n[i-1],n[i]+=Ua.distanceTo(Fa);e.setAttribute("lineDistance",new Ze(n,1))}else De("Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){let n=this.geometry,i=this.matrixWorld,r=e.params.Line.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),ga.copy(n.boundingSphere),ga.applyMatrix4(i),ga.radius+=r,e.ray.intersectsSphere(ga)===!1)return;Rd.copy(i).invert(),Xr.copy(e.ray).applyMatrix4(Rd);let a=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=a*a,c=this.isLineSegments?2:1,h=n.index,d=n.attributes.position;if(h!==null){let f=Math.max(0,o.start),g=Math.min(h.count,o.start+o.count);for(let _=f,m=g-1;_<m;_+=c){let p=h.getX(_),b=h.getX(_+1),T=_a(this,e,Xr,l,p,b,_);T&&t.push(T)}if(this.isLineLoop){let _=h.getX(g-1),m=h.getX(f),p=_a(this,e,Xr,l,_,m,g-1);p&&t.push(p)}}else{let f=Math.max(0,o.start),g=Math.min(d.count,o.start+o.count);for(let _=f,m=g-1;_<m;_+=c){let p=_a(this,e,Xr,l,_,_+1,_);p&&t.push(p)}if(this.isLineLoop){let _=_a(this,e,Xr,l,g-1,f,g-1);_&&t.push(_)}}}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let i=t[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=i.length;r<o;r++){let a=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}};function _a(s,e,t,n,i,r,o){let a=s.geometry.attributes.position;if(Ua.fromBufferAttribute(a,i),Fa.fromBufferAttribute(a,r),t.distanceSqToSegment(Ua,Fa,th,Cd)>n)return;th.applyMatrix4(s.matrixWorld);let c=e.ray.origin.distanceTo(th);if(!(c<e.near||c>e.far))return{distance:c,point:Cd.clone().applyMatrix4(s.matrixWorld),index:o,face:null,faceIndex:null,barycoord:null,object:s}}var Pd=new D,Id=new D,so=class extends hs{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,n=[];for(let i=0,r=t.count;i<r;i+=2)Pd.fromBufferAttribute(t,i),Id.fromBufferAttribute(t,i+1),n[i]=i===0?0:n[i-1],n[i+1]=n[i]+Pd.distanceTo(Id);e.setAttribute("lineDistance",new Ze(n,1))}else De("LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}},ro=class extends hs{constructor(e,t){super(e,t),this.isLineLoop=!0,this.type="LineLoop"}},lr=class extends sn{constructor(e){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new de(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}},Ld=new Ge,oh=new cs,xa=new mn,va=new D,us=class extends Tt{constructor(e=new yt,t=new lr){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){let n=this.geometry,i=this.matrixWorld,r=e.params.Points.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),xa.copy(n.boundingSphere),xa.applyMatrix4(i),xa.radius+=r,e.ray.intersectsSphere(xa)===!1)return;Ld.copy(i).invert(),oh.copy(e.ray).applyMatrix4(Ld);let a=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=a*a,c=n.index,u=n.attributes.position;if(c!==null){let d=Math.max(0,o.start),f=Math.min(c.count,o.start+o.count);for(let g=d,_=f;g<_;g++){let m=c.getX(g);va.fromBufferAttribute(u,m),Dd(va,m,l,i,e,t,this)}}else{let d=Math.max(0,o.start),f=Math.min(u.count,o.start+o.count);for(let g=d,_=f;g<_;g++)va.fromBufferAttribute(u,g),Dd(va,g,l,i,e,t,this)}}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let i=t[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=i.length;r<o;r++){let a=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}};function Dd(s,e,t,n,i,r,o){let a=oh.distanceSqToPoint(s);if(a<t){let l=new D;oh.closestPointToPoint(s,l),l.applyMatrix4(n);let c=i.ray.origin.distanceTo(l);if(c<i.near||c>i.far)return;r.push({distance:c,distanceToRay:Math.sqrt(a),point:l,index:e,face:null,faceIndex:null,barycoord:null,object:o})}}var oo=class extends Wt{constructor(e=[],t=Gi,n,i,r,o,a,l,c,h){super(e,t,n,i,r,o,a,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}},gi=class extends Wt{constructor(e,t,n,i,r,o,a,l,c){super(e,t,n,i,r,o,a,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}};var zi=class extends Wt{constructor(e,t,n=Wn,i,r,o,a=Lt,l=Lt,c,h=$n,u=1){if(h!==$n&&h!==Wi)throw new Error("THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat");let d={width:e,height:t,depth:u};super(d,i,r,o,a,l,h,n,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new er(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){let t=super.toJSON(e);return t.compareFunction=this.compareFunction,t}},Ba=class extends zi{constructor(e,t=Wn,n=Gi,i,r,o=Lt,a=Lt,l,c=$n){let h={width:e,height:e,depth:1},u=[h,h,h,h,h,h];super(e,e,t,n,i,r,o,a,l,c),this.image=u,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(e){this.image=e}},ao=class extends Wt{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}},rn=class s extends yt{constructor(e=1,t=1,n=1,i=1,r=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:i,heightSegments:r,depthSegments:o};let a=this;i=Math.floor(i),r=Math.floor(r),o=Math.floor(o);let l=[],c=[],h=[],u=[],d=0,f=0;g("z","y","x",-1,-1,n,t,e,o,r,0),g("z","y","x",1,-1,n,t,-e,o,r,1),g("x","z","y",1,1,e,n,t,i,o,2),g("x","z","y",1,-1,e,n,-t,i,o,3),g("x","y","z",1,-1,e,t,n,i,r,4),g("x","y","z",-1,-1,e,t,-n,i,r,5),this.setIndex(l),this.setAttribute("position",new Ze(c,3)),this.setAttribute("normal",new Ze(h,3)),this.setAttribute("uv",new Ze(u,2));function g(_,m,p,b,T,x,S,M,A,v,w){let R=x/A,L=S/v,P=x/2,N=S/2,I=M/2,H=A+1,V=v+1,q=0,ee=0,k=new D;for(let te=0;te<V;te++){let re=te*L-N;for(let Ee=0;Ee<H;Ee++){let Re=Ee*R-P;k[_]=Re*b,k[m]=re*T,k[p]=I,c.push(k.x,k.y,k.z),k[_]=0,k[m]=0,k[p]=M>0?1:-1,h.push(k.x,k.y,k.z),u.push(Ee/A),u.push(1-te/v),q+=1}}for(let te=0;te<v;te++)for(let re=0;re<A;re++){let Ee=d+re+H*te,Re=d+re+H*(te+1),ht=d+(re+1)+H*(te+1),et=d+(re+1)+H*te;l.push(Ee,Re,et),l.push(Re,ht,et),ee+=6}a.addGroup(f,ee,w),f+=ee,d+=q}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new s(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}},ds=class s extends yt{constructor(e=1,t=1,n=4,i=8,r=1){super(),this.type="CapsuleGeometry",this.parameters={radius:e,height:t,capSegments:n,radialSegments:i,heightSegments:r},t=Math.max(0,t),n=Math.max(1,Math.floor(n)),i=Math.max(3,Math.floor(i)),r=Math.max(1,Math.floor(r));let o=[],a=[],l=[],c=[],h=t/2,u=Math.PI/2*e,d=t,f=2*u+d,g=n*2+r,_=i+1,m=new D,p=new D;for(let b=0;b<=g;b++){let T=0,x=0,S=0,M=0;if(b<=n){let w=b/n,R=w*Math.PI/2;x=-h-e*Math.cos(R),S=e*Math.sin(R),M=-e*Math.cos(R),T=w*u}else if(b<=n+r){let w=(b-n)/r;x=-h+w*t,S=e,M=0,T=u+w*d}else{let w=(b-n-r)/n,R=w*Math.PI/2;x=h+e*Math.sin(R),S=e*Math.cos(R),M=e*Math.sin(R),T=u+d+w*u}let A=Math.max(0,Math.min(1,T/f)),v=0;b===0?v=.5/i:b===g&&(v=-.5/i);for(let w=0;w<=i;w++){let R=w/i,L=R*Math.PI*2,P=Math.sin(L),N=Math.cos(L);p.x=-S*N,p.y=x,p.z=S*P,a.push(p.x,p.y,p.z),m.set(-S*N,M,S*P),m.normalize(),l.push(m.x,m.y,m.z),c.push(R+v,A)}if(b>0){let w=(b-1)*_;for(let R=0;R<i;R++){let L=w+R,P=w+R+1,N=b*_+R,I=b*_+R+1;o.push(L,P,N),o.push(P,I,N)}}}this.setIndex(o),this.setAttribute("position",new Ze(a,3)),this.setAttribute("normal",new Ze(l,3)),this.setAttribute("uv",new Ze(c,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new s(e.radius,e.height,e.capSegments,e.radialSegments,e.heightSegments)}},cr=class s extends yt{constructor(e=1,t=32,n=0,i=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:e,segments:t,thetaStart:n,thetaLength:i},t=Math.max(3,t);let r=[],o=[],a=[],l=[],c=new D,h=new Te;o.push(0,0,0),a.push(0,0,1),l.push(.5,.5);for(let u=0,d=3;u<=t;u++,d+=3){let f=n+u/t*i;c.x=e*Math.cos(f),c.y=e*Math.sin(f),o.push(c.x,c.y,c.z),a.push(0,0,1),h.x=(o[d]/e+1)/2,h.y=(o[d+1]/e+1)/2,l.push(h.x,h.y)}for(let u=1;u<=t;u++)r.push(u,u+1,0);this.setIndex(r),this.setAttribute("position",new Ze(o,3)),this.setAttribute("normal",new Ze(a,3)),this.setAttribute("uv",new Ze(l,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new s(e.radius,e.segments,e.thetaStart,e.thetaLength)}},fs=class s extends yt{constructor(e=1,t=1,n=1,i=32,r=1,o=!1,a=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:n,radialSegments:i,heightSegments:r,openEnded:o,thetaStart:a,thetaLength:l};let c=this;i=Math.floor(i),r=Math.floor(r);let h=[],u=[],d=[],f=[],g=0,_=[],m=n/2,p=0;b(),o===!1&&(e>0&&T(!0),t>0&&T(!1)),this.setIndex(h),this.setAttribute("position",new Ze(u,3)),this.setAttribute("normal",new Ze(d,3)),this.setAttribute("uv",new Ze(f,2));function b(){let x=new D,S=new D,M=0,A=(t-e)/n;for(let v=0;v<=r;v++){let w=[],R=v/r,L=R*(t-e)+e;for(let P=0;P<=i;P++){let N=P/i,I=N*l+a,H=Math.sin(I),V=Math.cos(I);S.x=L*H,S.y=-R*n+m,S.z=L*V,u.push(S.x,S.y,S.z),x.set(H,A,V).normalize(),d.push(x.x,x.y,x.z),f.push(N,1-R),w.push(g++)}_.push(w)}for(let v=0;v<i;v++)for(let w=0;w<r;w++){let R=_[w][v],L=_[w+1][v],P=_[w+1][v+1],N=_[w][v+1];(e>0||w!==0)&&(h.push(R,L,N),M+=3),(t>0||w!==r-1)&&(h.push(L,P,N),M+=3)}c.addGroup(p,M,0),p+=M}function T(x){let S=g,M=new Te,A=new D,v=0,w=x===!0?e:t,R=x===!0?1:-1;for(let P=1;P<=i;P++)u.push(0,m*R,0),d.push(0,R,0),f.push(.5,.5),g++;let L=g;for(let P=0;P<=i;P++){let I=P/i*l+a,H=Math.cos(I),V=Math.sin(I);A.x=w*V,A.y=m*R,A.z=w*H,u.push(A.x,A.y,A.z),d.push(0,R,0),M.x=H*.5+.5,M.y=V*.5*R+.5,f.push(M.x,M.y),g++}for(let P=0;P<i;P++){let N=S+P,I=L+P;x===!0?h.push(I,I+1,N):h.push(I+1,I,N),v+=3}c.addGroup(p,v,x===!0?1:2),p+=v}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new s(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}};var Oa=class s extends yt{constructor(e=[],t=[],n=1,i=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:e,indices:t,radius:n,detail:i};let r=[],o=[];a(i),c(n),h(),this.setAttribute("position",new Ze(r,3)),this.setAttribute("normal",new Ze(r.slice(),3)),this.setAttribute("uv",new Ze(o,2)),i===0?this.computeVertexNormals():this.normalizeNormals();function a(b){let T=new D,x=new D,S=new D;for(let M=0;M<t.length;M+=3)f(t[M+0],T),f(t[M+1],x),f(t[M+2],S),l(T,x,S,b)}function l(b,T,x,S){let M=S+1,A=[];for(let v=0;v<=M;v++){A[v]=[];let w=b.clone().lerp(x,v/M),R=T.clone().lerp(x,v/M),L=M-v;for(let P=0;P<=L;P++)P===0&&v===M?A[v][P]=w:A[v][P]=w.clone().lerp(R,P/L)}for(let v=0;v<M;v++)for(let w=0;w<2*(M-v)-1;w++){let R=Math.floor(w/2);w%2===0?(d(A[v][R+1]),d(A[v+1][R]),d(A[v][R])):(d(A[v][R+1]),d(A[v+1][R+1]),d(A[v+1][R]))}}function c(b){let T=new D;for(let x=0;x<r.length;x+=3)T.x=r[x+0],T.y=r[x+1],T.z=r[x+2],T.normalize().multiplyScalar(b),r[x+0]=T.x,r[x+1]=T.y,r[x+2]=T.z}function h(){let b=new D;for(let T=0;T<r.length;T+=3){b.x=r[T+0],b.y=r[T+1],b.z=r[T+2];let x=m(b)/2/Math.PI+.5,S=p(b)/Math.PI+.5;o.push(x,1-S)}g(),u()}function u(){for(let b=0;b<o.length;b+=6){let T=o[b+0],x=o[b+2],S=o[b+4],M=Math.max(T,x,S),A=Math.min(T,x,S);M>.9&&A<.1&&(T<.2&&(o[b+0]+=1),x<.2&&(o[b+2]+=1),S<.2&&(o[b+4]+=1))}}function d(b){r.push(b.x,b.y,b.z)}function f(b,T){let x=b*3;T.x=e[x+0],T.y=e[x+1],T.z=e[x+2]}function g(){let b=new D,T=new D,x=new D,S=new D,M=new Te,A=new Te,v=new Te;for(let w=0,R=0;w<r.length;w+=9,R+=6){b.set(r[w+0],r[w+1],r[w+2]),T.set(r[w+3],r[w+4],r[w+5]),x.set(r[w+6],r[w+7],r[w+8]),M.set(o[R+0],o[R+1]),A.set(o[R+2],o[R+3]),v.set(o[R+4],o[R+5]),S.copy(b).add(T).add(x).divideScalar(3);let L=m(S);_(M,R+0,b,L),_(A,R+2,T,L),_(v,R+4,x,L)}}function _(b,T,x,S){S<0&&b.x===1&&(o[T]=b.x-1),x.x===0&&x.z===0&&(o[T]=S/2/Math.PI+.5)}function m(b){return Math.atan2(b.z,-b.x)}function p(b){return Math.atan2(-b.y,Math.sqrt(b.x*b.x+b.z*b.z))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new s(e.vertices,e.indices,e.radius,e.detail)}};var ps=class s extends Oa{constructor(e=1,t=0){let n=(1+Math.sqrt(5))/2,i=[-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1],r=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(i,r,e,t),this.type="IcosahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new s(e.radius,e.detail)}};var Qt=class s extends yt{constructor(e=1,t=1,n=1,i=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:i};let r=e/2,o=t/2,a=Math.floor(n),l=Math.floor(i),c=a+1,h=l+1,u=e/a,d=t/l,f=[],g=[],_=[],m=[];for(let p=0;p<h;p++){let b=p*d-o;for(let T=0;T<c;T++){let x=T*u-r;g.push(x,-b,0),_.push(0,0,1),m.push(T/a),m.push(1-p/l)}}for(let p=0;p<l;p++)for(let b=0;b<a;b++){let T=b+c*p,x=b+c*(p+1),S=b+1+c*(p+1),M=b+1+c*p;f.push(T,x,M),f.push(x,S,M)}this.setIndex(f),this.setAttribute("position",new Ze(g,3)),this.setAttribute("normal",new Ze(_,3)),this.setAttribute("uv",new Ze(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new s(e.width,e.height,e.widthSegments,e.heightSegments)}},ms=class s extends yt{constructor(e=.5,t=1,n=32,i=1,r=0,o=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:e,outerRadius:t,thetaSegments:n,phiSegments:i,thetaStart:r,thetaLength:o},n=Math.max(3,n),i=Math.max(1,i);let a=[],l=[],c=[],h=[],u=e,d=(t-e)/i,f=new D,g=new Te;for(let _=0;_<=i;_++){for(let m=0;m<=n;m++){let p=r+m/n*o;f.x=u*Math.cos(p),f.y=u*Math.sin(p),l.push(f.x,f.y,f.z),c.push(0,0,1),g.x=(f.x/t+1)/2,g.y=(f.y/t+1)/2,h.push(g.x,g.y)}u+=d}for(let _=0;_<i;_++){let m=_*(n+1);for(let p=0;p<n;p++){let b=p+m,T=b,x=b+n+1,S=b+n+2,M=b+1;a.push(T,x,M),a.push(x,S,M)}}this.setIndex(a),this.setAttribute("position",new Ze(l,3)),this.setAttribute("normal",new Ze(c,3)),this.setAttribute("uv",new Ze(h,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new s(e.innerRadius,e.outerRadius,e.thetaSegments,e.phiSegments,e.thetaStart,e.thetaLength)}};var lo=class s extends yt{constructor(e=1,t=32,n=16,i=0,r=Math.PI*2,o=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:i,phiLength:r,thetaStart:o,thetaLength:a},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));let l=Math.min(o+a,Math.PI),c=0,h=[],u=new D,d=new D,f=[],g=[],_=[],m=[];for(let p=0;p<=n;p++){let b=[],T=p/n,x=o+T*a,S=e*Math.cos(x),M=Math.sqrt(e*e-S*S),A=0;p===0&&o===0?A=.5/t:p===n&&l===Math.PI&&(A=-.5/t);for(let v=0;v<=t;v++){let w=v/t,R=i+w*r;u.x=-M*Math.cos(R),u.y=S,u.z=M*Math.sin(R),g.push(u.x,u.y,u.z),d.copy(u).normalize(),_.push(d.x,d.y,d.z),m.push(w+A,1-T),b.push(c++)}h.push(b)}for(let p=0;p<n;p++)for(let b=0;b<t;b++){let T=h[p][b+1],x=h[p][b],S=h[p+1][b],M=h[p+1][b+1];(p!==0||o>0)&&f.push(T,x,M),(p!==n-1||l<Math.PI)&&f.push(x,S,M)}this.setIndex(f),this.setAttribute("position",new Ze(g,3)),this.setAttribute("normal",new Ze(_,3)),this.setAttribute("uv",new Ze(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new s(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}};var co=class s extends yt{constructor(e=1,t=.4,n=12,i=48,r=Math.PI*2,o=0,a=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:e,tube:t,radialSegments:n,tubularSegments:i,arc:r,thetaStart:o,thetaLength:a},n=Math.floor(n),i=Math.floor(i);let l=[],c=[],h=[],u=[],d=new D,f=new D,g=new D;for(let _=0;_<=n;_++){let m=o+_/n*a;for(let p=0;p<=i;p++){let b=p/i*r;f.x=(e+t*Math.cos(m))*Math.cos(b),f.y=(e+t*Math.cos(m))*Math.sin(b),f.z=t*Math.sin(m),c.push(f.x,f.y,f.z),d.x=e*Math.cos(b),d.y=e*Math.sin(b),g.subVectors(f,d).normalize(),h.push(g.x,g.y,g.z),u.push(p/i),u.push(_/n)}}for(let _=1;_<=n;_++)for(let m=1;m<=i;m++){let p=(i+1)*_+m-1,b=(i+1)*(_-1)+m-1,T=(i+1)*(_-1)+m,x=(i+1)*_+m;l.push(p,b,x),l.push(b,T,x)}this.setIndex(l),this.setAttribute("position",new Ze(c,3)),this.setAttribute("normal",new Ze(h,3)),this.setAttribute("uv",new Ze(u,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new s(e.radius,e.tube,e.radialSegments,e.tubularSegments,e.arc,e.thetaStart,e.thetaLength)}};function Ss(s){let e={};for(let t in s){e[t]={};for(let n in s[t]){let i=s[t][n];if(Nd(i))i.isRenderTargetTexture?(De("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=i.clone();else if(Array.isArray(i))if(Nd(i[0])){let r=[];for(let o=0,a=i.length;o<a;o++)r[o]=i[o].clone();e[t][n]=r}else e[t][n]=i.slice();else e[t][n]=i}}return e}function an(s){let e={};for(let t=0;t<s.length;t++){let n=Ss(s[t]);for(let i in n)e[i]=n[i]}return e}function Nd(s){return s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)}function Km(s){let e=[];for(let t=0;t<s.length;t++)e.push(s[t].clone());return e}function Uh(s){let e=s.getRenderTarget();return e===null?s.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:Ke.workingColorSpace}var Ts={clone:Ss,merge:an},Zm=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,$m=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,ft=class extends sn{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Zm,this.fragmentShader=$m,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Ss(e.uniforms),this.uniformsGroups=Km(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){let t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(let i in this.uniforms){let o=this.uniforms[i].value;o&&o.isTexture?t.uniforms[i]={type:"t",value:o.toJSON(e).uuid}:o&&o.isColor?t.uniforms[i]={type:"c",value:o.getHex()}:o&&o.isVector2?t.uniforms[i]={type:"v2",value:o.toArray()}:o&&o.isVector3?t.uniforms[i]={type:"v3",value:o.toArray()}:o&&o.isVector4?t.uniforms[i]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?t.uniforms[i]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?t.uniforms[i]={type:"m4",value:o.toArray()}:t.uniforms[i]={value:o}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;let n={};for(let i in this.extensions)this.extensions[i]===!0&&(n[i]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}fromJSON(e,t){if(super.fromJSON(e,t),e.uniforms!==void 0)for(let n in e.uniforms){let i=e.uniforms[n];switch(this.uniforms[n]={},i.type){case"t":this.uniforms[n].value=t[i.value]||null;break;case"c":this.uniforms[n].value=new de().setHex(i.value);break;case"v2":this.uniforms[n].value=new Te().fromArray(i.value);break;case"v3":this.uniforms[n].value=new D().fromArray(i.value);break;case"v4":this.uniforms[n].value=new dt().fromArray(i.value);break;case"m3":this.uniforms[n].value=new He().fromArray(i.value);break;case"m4":this.uniforms[n].value=new Ge().fromArray(i.value);break;default:this.uniforms[n].value=i.value}}if(e.defines!==void 0&&(this.defines=e.defines),e.vertexShader!==void 0&&(this.vertexShader=e.vertexShader),e.fragmentShader!==void 0&&(this.fragmentShader=e.fragmentShader),e.glslVersion!==void 0&&(this.glslVersion=e.glslVersion),e.extensions!==void 0)for(let n in e.extensions)this.extensions[n]=e.extensions[n];return e.lights!==void 0&&(this.lights=e.lights),e.clipping!==void 0&&(this.clipping=e.clipping),this}},ka=class extends ft{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}},gs=class extends sn{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new de(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new de(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=vr,this.normalScale=new Te(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Jn,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}},gn=class extends gs{constructor(e){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.type="MeshPhysicalMaterial",this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new Te(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return je(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(t){this.ior=(1+.4*t)/(1-.4*t)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new de(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new de(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new de(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._dispersion=0,this._iridescence=0,this._retroreflectivity=0,this._sheen=0,this._transmission=0,this.setValues(e)}get anisotropy(){return this._anisotropy}set anisotropy(e){this._anisotropy>0!=e>0&&this.version++,this._anisotropy=e}get clearcoat(){return this._clearcoat}set clearcoat(e){this._clearcoat>0!=e>0&&this.version++,this._clearcoat=e}get iridescence(){return this._iridescence}set iridescence(e){this._iridescence>0!=e>0&&this.version++,this._iridescence=e}get dispersion(){return this._dispersion}set dispersion(e){this._dispersion>0!=e>0&&this.version++,this._dispersion=e}get retroreflectivity(){return this._retroreflectivity}set retroreflectivity(e){this._retroreflectivity>0!=e>0&&this.version++,this._retroreflectivity=e}get sheen(){return this._sheen}set sheen(e){this._sheen>0!=e>0&&this.version++,this._sheen=e}get transmission(){return this._transmission}set transmission(e){this._transmission>0!=e>0&&this.version++,this._transmission=e}copy(e){return super.copy(e),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=e.anisotropy,this.anisotropyRotation=e.anisotropyRotation,this.anisotropyMap=e.anisotropyMap,this.clearcoat=e.clearcoat,this.clearcoatMap=e.clearcoatMap,this.clearcoatRoughness=e.clearcoatRoughness,this.clearcoatRoughnessMap=e.clearcoatRoughnessMap,this.clearcoatNormalMap=e.clearcoatNormalMap,this.clearcoatNormalScale.copy(e.clearcoatNormalScale),this.dispersion=e.dispersion,this.ior=e.ior,this.iridescence=e.iridescence,this.iridescenceMap=e.iridescenceMap,this.iridescenceIOR=e.iridescenceIOR,this.iridescenceThicknessRange=[...e.iridescenceThicknessRange],this.iridescenceThicknessMap=e.iridescenceThicknessMap,this.retroreflectivity=e.retroreflectivity,this.sheen=e.sheen,this.sheenColor.copy(e.sheenColor),this.sheenColorMap=e.sheenColorMap,this.sheenRoughness=e.sheenRoughness,this.sheenRoughnessMap=e.sheenRoughnessMap,this.transmission=e.transmission,this.transmissionMap=e.transmissionMap,this.thickness=e.thickness,this.thicknessMap=e.thicknessMap,this.attenuationDistance=e.attenuationDistance,this.attenuationColor.copy(e.attenuationColor),this.specularIntensity=e.specularIntensity,this.specularIntensityMap=e.specularIntensityMap,this.specularColor.copy(e.specularColor),this.specularColorMap=e.specularColorMap,this}};var ho=class extends sn{constructor(e){super(),this.isMeshToonMaterial=!0,this.defines={TOON:""},this.type="MeshToonMaterial",this.color=new de(16777215),this.map=null,this.gradientMap=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new de(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=vr,this.normalScale=new Te(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.alphaMap=null,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.gradientMap=e.gradientMap,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.alphaMap=e.alphaMap,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}};var fn=class extends sn{constructor(e){super(),this.isMeshLambertMaterial=!0,this.type="MeshLambertMaterial",this.color=new de(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new de(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=vr,this.normalScale=new Te(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Jn,this.combine=el,this.reflectivity=1,this.envMapIntensity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.envMapIntensity=e.envMapIntensity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}},za=class extends sn{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=mf,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}},Ha=class extends sn{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}};function Bi(s,e){return!s||s.constructor===e?s:typeof e.BYTES_PER_ELEMENT=="number"?new e(s):Array.prototype.slice.call(s)}function Ta(s){return s!==void 0&&s.inTangents!==void 0&&s.outTangents!==void 0}function Jm(s){function e(i,r){return s[i]-s[r]}let t=s.length,n=new Array(t);for(let i=0;i!==t;++i)n[i]=i;return n.sort(e),n}function Ud(s,e,t){let n=s.length,i=new s.constructor(n);for(let r=0,o=0;o!==n;++r){let a=t[r]*e;for(let l=0;l!==e;++l)i[o++]=s[a+l]}return i}function jm(s,e,t,n){let i=1,r=s[0];for(;r!==void 0&&r[n]===void 0;)r=s[i++];if(r===void 0)return;let o=r[n];if(o!==void 0)if(Array.isArray(o))do o=r[n],o!==void 0&&(e.push(r.time),t.push(...o)),r=s[i++];while(r!==void 0);else if(o.toArray!==void 0)do o=r[n],o!==void 0&&(e.push(r.time),o.toArray(t,t.length)),r=s[i++];while(r!==void 0);else do o=r[n],o!==void 0&&(e.push(r.time),t.push(o)),r=s[i++];while(r!==void 0)}var Qn=class{constructor(e,t,n,i){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=i!==void 0?i:new t.constructor(n),this.sampleValues=t,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(e){let t=this.parameterPositions,n=this._cachedIndex,i=t[n],r=t[n-1];e:{t:{let o;n:{i:if(!(e<i)){for(let a=n+2;;){if(i===void 0){if(e<r)break i;return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===a)break;if(r=i,i=t[++n],e<i)break t}o=t.length;break n}if(!(e>=r)){let a=t[1];e<a&&(n=2,r=a);for(let l=n-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===l)break;if(i=r,r=t[--n-1],e>=r)break t}o=n,n=0;break n}break e}for(;n<o;){let a=n+o>>>1;e<t[a]?o=a:n=a+1}if(i=t[n],r=t[n-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(i===void 0)return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,r,i)}return this.interpolate_(n,r,e,i)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){let t=this.resultBuffer,n=this.sampleValues,i=this.valueSize,r=e*i;for(let o=0;o!==i;++o)t[o]=n[r+o];return t}interpolate_(){throw new Error("THREE.Interpolant: Call to abstract method.")}intervalChanged_(){}},Va=class extends Qn{constructor(e,t,n,i){super(e,t,n,i),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:is,endingEnd:is}}intervalChanged_(e,t,n){let i=this.parameterPositions,r=e-2,o=e+1,a=i[r],l=i[o];if(a===void 0)switch(this.getSettings_().endingStart){case ss:r=e,a=2*t-n;break;case Kr:r=i.length-2,a=t+i[r]-i[r+1];break;default:r=e,a=n}if(l===void 0)switch(this.getSettings_().endingEnd){case ss:o=e,l=2*n-t;break;case Kr:o=1,l=n+i[1]-i[0];break;default:o=e-1,l=t}let c=(n-t)*.5,h=this.valueSize;this._weightPrev=c/(t-a),this._weightNext=c/(l-n),this._offsetPrev=r*h,this._offsetNext=o*h}interpolate_(e,t,n,i){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=e*a,c=l-a,h=this._offsetPrev,u=this._offsetNext,d=this._weightPrev,f=this._weightNext,g=(n-t)/(i-t),_=g*g,m=_*g,p=-d*m+2*d*_-d*g,b=(1+d)*m+(-1.5-2*d)*_+(-.5+d)*g+1,T=(-1-f)*m+(1.5+f)*_+.5*g,x=f*m-f*_;for(let S=0;S!==a;++S)r[S]=p*o[h+S]+b*o[c+S]+T*o[l+S]+x*o[u+S];return r}},uo=class extends Qn{constructor(e,t,n,i){super(e,t,n,i)}interpolate_(e,t,n,i){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=e*a,c=l-a,h=(n-t)/(i-t),u=1-h;for(let d=0;d!==a;++d)r[d]=o[c+d]*u+o[l+d]*h;return r}},Ga=class extends Qn{constructor(e,t,n,i){super(e,t,n,i)}interpolate_(e){return this.copySampleValue_(e-1)}},Wa=class extends Qn{interpolate_(e,t,n,i){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=e*a,c=l-a,h=this.inTangents,u=this.outTangents;if(!h||!u){let g=(n-t)/(i-t),_=1-g;for(let m=0;m!==a;++m)r[m]=o[c+m]*_+o[l+m]*g;return r}let d=a*2,f=e-1;for(let g=0;g!==a;++g){let _=o[c+g],m=o[l+g],p=f*d+g*2,b=u[p],T=u[p+1],x=e*d+g*2,S=h[x],M=h[x+1],A=eg(n,t,b,S,i);r[g]=Cf(A,_,T,M,m)}return r}};function Cf(s,e,t,n,i){let r=1-s;return r*r*r*e+3*r*r*s*t+3*r*s*s*n+s*s*s*i}function Qm(s,e,t,n,i){let r=1-s;return 3*r*r*(t-e)+6*r*s*(n-t)+3*s*s*(i-n)}function eg(s,e,t,n,i){let r=(s-e)/(i-e);for(let o=0;o<8;o++){let a=Cf(r,e,t,n,i)-s;if(Math.abs(a)<1e-10)break;let l=Qm(r,e,t,n,i);if(Math.abs(l)<1e-10)break;r=Math.max(0,Math.min(1,r-a/l))}return r}var _n=class{constructor(e,t,n,i){if(e===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(t===void 0||t.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+e);this.name=e,this.times=Bi(t,this.TimeBufferType),this.values=Bi(n,this.ValueBufferType),this.setInterpolation(i||this.DefaultInterpolation)}static toJSON(e){let t=e.constructor,n;if(t.toJSON!==this.toJSON)n=t.toJSON(e);else{n={name:e.name,times:Bi(e.times,Array),values:Bi(e.values,Array)};let i=e.getInterpolation();i!==e.DefaultInterpolation&&(n.interpolation=i),Ta(e.settings)&&(n.settings={inTangents:Bi(e.settings.inTangents,Array),outTangents:Bi(e.settings.outTangents,Array)})}return n.type=e.ValueTypeName,n}InterpolantFactoryMethodDiscrete(e){return new Ga(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new uo(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new Va(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodBezier(e){let t=new Wa(this.times,this.values,this.getValueSize(),e);return this.settings&&(t.inTangents=this.settings.inTangents,t.outTangents=this.settings.outTangents),t}setInterpolation(e){let t;switch(e){case os:t=this.InterpolantFactoryMethodDiscrete;break;case as:t=this.InterpolantFactoryMethodLinear;break;case Ma:t=this.InterpolantFactoryMethodSmooth;break;case rh:t=this.InterpolantFactoryMethodBezier;break}if(t===void 0){let n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return De("KeyframeTrack:",n),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return os;case this.InterpolantFactoryMethodLinear:return as;case this.InterpolantFactoryMethodSmooth:return Ma;case this.InterpolantFactoryMethodBezier:return rh}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){let t=this.times;for(let n=0,i=t.length;n!==i;++n)t[n]+=e}return this}scale(e){if(e!==1){let t=this.times;for(let n=0,i=t.length;n!==i;++n)t[n]*=e;Ta(this.settings)&&(Fd(this.settings.inTangents,e),Fd(this.settings.outTangents,e))}return this}trim(e,t){let n=this.times,i=n.length,r=0,o=i-1;for(;r!==i&&n[r]<e;)++r;for(;o!==-1&&n[o]>t;)--o;if(++o,r!==0||o!==i){r>=o&&(o=Math.max(o,1),r=o-1);let a=this.getValueSize();this.times=n.slice(r,o),this.values=this.values.slice(r*a,o*a)}return this}validate(){let e=!0,t=this.getValueSize();t-Math.floor(t)!==0&&(ke("KeyframeTrack: Invalid value size in track.",this),e=!1);let n=this.times,i=this.values,r=n.length;r===0&&(ke("KeyframeTrack: Track is empty.",this),e=!1);let o=null;for(let a=0;a!==r;a++){let l=n[a];if(typeof l=="number"&&isNaN(l)){ke("KeyframeTrack: Time is not a valid number.",this,a,l),e=!1;break}if(o!==null&&o>l){ke("KeyframeTrack: Out of order keys.",this,a,l,o),e=!1;break}o=l}if(i!==void 0&&hm(i))for(let a=0,l=i.length;a!==l;++a){let c=i[a];if(isNaN(c)){ke("KeyframeTrack: Value is not a valid number.",this,a,c),e=!1;break}}return e}optimize(){let e=this.times.slice(),t=this.values.slice(),n=this.getValueSize(),i=this.getInterpolation()===Ma,r=e.length-1,o=1;for(let a=1;a<r;++a){let l=!1,c=e[a],h=e[a+1];if(c!==h&&(a!==1||c!==e[0]))if(i)l=!0;else{let u=a*n,d=u-n,f=u+n;for(let g=0;g!==n;++g){let _=t[u+g];if(_!==t[d+g]||_!==t[f+g]){l=!0;break}}}if(l){if(a!==o){e[o]=e[a];let u=a*n,d=o*n;for(let f=0;f!==n;++f)t[d+f]=t[u+f]}++o}}if(r>0){e[o]=e[r];for(let a=r*n,l=o*n,c=0;c!==n;++c)t[l+c]=t[a+c];++o}return o!==e.length?(this.times=e.slice(0,o),this.values=t.slice(0,o*n)):(this.times=e,this.values=t),this}clone(){let e=this.times.slice(),t=this.values.slice(),n=this.constructor,i=new n(this.name,e,t);return i.createInterpolant=this.createInterpolant,Ta(this.settings)&&(i.settings={inTangents:this.settings.inTangents.slice(),outTangents:this.settings.outTangents.slice()}),i}};function Fd(s,e){for(let t=0,n=s.length;t!==n;t+=2)s[t]*=e}_n.prototype.ValueTypeName="";_n.prototype.TimeBufferType=Float32Array;_n.prototype.ValueBufferType=Float32Array;_n.prototype.DefaultInterpolation=as;var _i=class extends _n{constructor(e,t,n){super(e,t,n)}};_i.prototype.ValueTypeName="bool";_i.prototype.ValueBufferType=Array;_i.prototype.DefaultInterpolation=os;_i.prototype.InterpolantFactoryMethodLinear=void 0;_i.prototype.InterpolantFactoryMethodSmooth=void 0;var fo=class extends _n{constructor(e,t,n,i){super(e,t,n,i)}};fo.prototype.ValueTypeName="color";var xi=class extends _n{constructor(e,t,n,i){super(e,t,n,i)}};xi.prototype.ValueTypeName="number";var Xa=class extends Qn{constructor(e,t,n,i){super(e,t,n,i)}interpolate_(e,t,n,i){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=(n-t)/(i-t),c=e*a;for(let h=c+a;c!==h;c+=4)Ht.slerpFlat(r,0,o,c-a,o,c,l);return r}},vi=class extends _n{constructor(e,t,n,i){super(e,t,n,i)}InterpolantFactoryMethodLinear(e){return new Xa(this.times,this.values,this.getValueSize(),e)}};vi.prototype.ValueTypeName="quaternion";vi.prototype.InterpolantFactoryMethodSmooth=void 0;var yi=class extends _n{constructor(e,t,n){super(e,t,n)}};yi.prototype.ValueTypeName="string";yi.prototype.ValueBufferType=Array;yi.prototype.DefaultInterpolation=os;yi.prototype.InterpolantFactoryMethodLinear=void 0;yi.prototype.InterpolantFactoryMethodSmooth=void 0;var Hi=class extends _n{constructor(e,t,n,i){super(e,t,n,i)}};Hi.prototype.ValueTypeName="vector";var bi=class{constructor(e="",t=-1,n=[],i=zl){this.name=e,this.tracks=n,this.duration=t,this.blendMode=i,this.uuid=kn(),this.userData={},this.duration<0&&this.resetDuration()}static parse(e){let t=[],n=e.tracks,i=1/(e.fps||1);for(let o=0,a=n.length;o!==a;++o)t.push(ng(n[o]).scale(i));let r=new this(e.name,e.duration,t,e.blendMode);return r.uuid=e.uuid,r.userData=JSON.parse(e.userData||"{}"),r}static toJSON(e){let t=[],n=e.tracks,i={name:e.name,duration:e.duration,tracks:t,uuid:e.uuid,blendMode:e.blendMode,userData:JSON.stringify(e.userData)};for(let r=0,o=n.length;r!==o;++r)t.push(_n.toJSON(n[r]));return i}static CreateFromMorphTargetSequence(e,t,n,i){let r=t.length,o=[];for(let a=0;a<r;a++){let l=[],c=[];l.push((a+r-1)%r,a,(a+1)%r),c.push(0,1,0);let h=Jm(l);l=Ud(l,1,h),c=Ud(c,1,h),!i&&l[0]===0&&(l.push(r),c.push(c[0])),o.push(new xi(".morphTargetInfluences["+t[a].name+"]",l,c).scale(1/n))}return new this(e,-1,o)}static findByName(e,t){let n=e;if(!Array.isArray(e)){let i=e;n=i.geometry&&i.geometry.animations||i.animations}for(let i=0;i<n.length;i++)if(n[i].name===t)return n[i];return null}static CreateClipsFromMorphTargetSequences(e,t,n){let i={},r=/^([\w-]*?)([\d]+)$/;for(let a=0,l=e.length;a<l;a++){let c=e[a],h=c.name.match(r);if(h&&h.length>1){let u=h[1],d=i[u];d||(i[u]=d=[]),d.push(c)}}let o=[];for(let a in i)o.push(this.CreateFromMorphTargetSequence(a,i[a],t,n));return o}resetDuration(){let e=this.tracks,t=0;for(let n=0,i=e.length;n!==i;++n){let r=this.tracks[n];t=Math.max(t,r.times[r.times.length-1])}return this.duration=t,this}trim(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].trim(0,this.duration);return this}validate(){let e=!0;for(let t=0;t<this.tracks.length;t++)e=e&&this.tracks[t].validate();return e}optimize(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].optimize();return this}clone(){let e=[];for(let n=0;n<this.tracks.length;n++)e.push(this.tracks[n].clone());let t=new this.constructor(this.name,this.duration,e,this.blendMode);return t.userData=JSON.parse(JSON.stringify(this.userData)),t}toJSON(){return this.constructor.toJSON(this)}};function tg(s){switch(s.toLowerCase()){case"scalar":case"double":case"float":case"number":case"integer":return xi;case"vector":case"vector2":case"vector3":case"vector4":return Hi;case"color":return fo;case"quaternion":return vi;case"bool":case"boolean":return _i;case"string":return yi}throw new Error("THREE.KeyframeTrack: Unsupported typeName: "+s)}function ng(s){if(s.type===void 0)throw new Error("THREE.KeyframeTrack: track type undefined, can not parse");let e=tg(s.type);if(s.times===void 0){let n=[],i=[];jm(s.keys,n,i,"value"),s.times=n,s.values=i}let t;return e.parse!==void 0?t=e.parse(s):t=new e(s.name,s.times,s.values,s.interpolation),Ta(s.settings)&&(t.settings={inTangents:Bi(s.settings.inTangents,Float32Array),outTangents:Bi(s.settings.outTangents,Float32Array)}),t}var Zn={enabled:!1,files:{},add:function(s,e){this.enabled!==!1&&(Bd(s)||(this.files[s]=e))},get:function(s){if(this.enabled!==!1&&!Bd(s))return this.files[s]},remove:function(s){delete this.files[s]},clear:function(){this.files={}}};function Bd(s){try{let e=s.slice(s.indexOf(":")+1);return new URL(e).protocol==="blob:"}catch{return!1}}var qa=class{constructor(e,t,n){let i=this,r=!1,o=0,a=0,l,c=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=n,this._abortController=null,this.itemStart=function(h){a++,r===!1&&i.onStart!==void 0&&i.onStart(h,o,a),r=!0},this.itemEnd=function(h){o++,i.onProgress!==void 0&&i.onProgress(h,o,a),o===a&&(r=!1,i.onLoad!==void 0&&i.onLoad())},this.itemError=function(h){i.onError!==void 0&&i.onError(h)},this.resolveURL=function(h){return h=h.normalize("NFC"),l?l(h):h},this.setURLModifier=function(h){return l=h,this},this.addHandler=function(h,u){return c.push(h,u),this},this.removeHandler=function(h){let u=c.indexOf(h);return u!==-1&&c.splice(u,2),this},this.getHandler=function(h){for(let u=0,d=c.length;u<d;u+=2){let f=c[u],g=c[u+1];if(f.global&&(f.lastIndex=0),f.test(h))return g}return null},this.abort=function(){return this.abortController.abort(),this._abortController=null,this}}get abortController(){return this._abortController||(this._abortController=new AbortController),this._abortController}},Pf=new qa,ei=class{constructor(e){this.manager=e!==void 0?e:Pf,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}load(){}loadAsync(e,t){let n=this;return new Promise(function(i,r){n.load(e,i,t,r)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}abort(){return this}};ei.DEFAULT_MATERIAL_NAME="__DEFAULT";var fi={},ah=class extends Error{constructor(e,t){super(e),this.response=t}},hr=class extends ei{constructor(e){super(e),this.mimeType="",this.responseType="",this._abortController=new AbortController}load(e,t,n,i){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);let r=Zn.get(`file:${e}`);if(r!==void 0){this.manager.itemStart(e),setTimeout(()=>{t&&t(r),this.manager.itemEnd(e)},0);return}if(fi[e]!==void 0){fi[e].push({onLoad:t,onProgress:n,onError:i});return}fi[e]=[],fi[e].push({onLoad:t,onProgress:n,onError:i});let o=new Request(e,{headers:new Headers(this.requestHeader),credentials:this.withCredentials?"include":"same-origin",signal:typeof AbortSignal.any=="function"?AbortSignal.any([this._abortController.signal,this.manager.abortController.signal]):this._abortController.signal}),a=this.mimeType,l=this.responseType;fetch(o).then(c=>{if(c.status===200||c.status===0){if(c.status===0&&De("FileLoader: HTTP Status 0 received."),typeof ReadableStream>"u"||c.body===void 0||c.body.getReader===void 0)return c;let h=fi[e],u=c.body.getReader(),d=c.headers.get("X-File-Size")||c.headers.get("Content-Length"),f=d?parseInt(d):0,g=f!==0,_=0,m=new ReadableStream({start(p){b();function b(){u.read().then(({done:T,value:x})=>{if(T)p.close();else{_+=x.byteLength;let S=new ProgressEvent("progress",{lengthComputable:g,loaded:_,total:f});for(let M=0,A=h.length;M<A;M++){let v=h[M];v.onProgress&&v.onProgress(S)}p.enqueue(x),b()}},T=>{p.error(T)})}}});return new Response(m)}else throw new ah(`fetch for "${c.url}" responded with ${c.status}: ${c.statusText}`,c)}).then(c=>{switch(l){case"arraybuffer":return c.arrayBuffer();case"blob":return c.blob();case"document":return c.text().then(h=>new DOMParser().parseFromString(h,a));case"json":return c.json();default:if(a==="")return c.text();{let u=/charset="?([^;"\s]*)"?/i.exec(a),d=u&&u[1]?u[1].toLowerCase():void 0,f=new TextDecoder(d);return c.arrayBuffer().then(g=>f.decode(g))}}}).then(c=>{Zn.add(`file:${e}`,c);let h=fi[e];delete fi[e];for(let u=0,d=h.length;u<d;u++){let f=h[u];f.onLoad&&f.onLoad(c)}}).catch(c=>{let h=fi[e];if(h===void 0)throw this.manager.itemError(e),c;delete fi[e];for(let u=0,d=h.length;u<d;u++){let f=h[u];f.onError&&f.onError(c)}this.manager.itemError(e)}).finally(()=>{this.manager.itemEnd(e)}),this.manager.itemStart(e)}setResponseType(e){return this.responseType=e,this}setMimeType(e){return this.mimeType=e,this}abort(){return this._abortController.abort(),this._abortController=new AbortController,this}};var Xs=new WeakMap,Ya=class extends ei{constructor(e){super(e)}load(e,t,n,i){this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);let r=this,o=Zn.get(`image:${e}`);if(o!==void 0){if(o.complete===!0)r.manager.itemStart(e),setTimeout(function(){t&&t(o),r.manager.itemEnd(e)},0);else{let u=Xs.get(o);u===void 0&&(u=[],Xs.set(o,u)),u.push({onLoad:t,onError:i})}return o}let a=js("img");function l(){h(),t&&t(this);let u=Xs.get(this)||[];for(let d=0;d<u.length;d++){let f=u[d];f.onLoad&&f.onLoad(this)}Xs.delete(this),r.manager.itemEnd(e)}function c(u){h(),i&&i(u),Zn.remove(`image:${e}`);let d=Xs.get(this)||[];for(let f=0;f<d.length;f++){let g=d[f];g.onError&&g.onError(u)}Xs.delete(this),r.manager.itemError(e),r.manager.itemEnd(e)}function h(){a.removeEventListener("load",l,!1),a.removeEventListener("error",c,!1)}return a.addEventListener("load",l,!1),a.addEventListener("error",c,!1),e.slice(0,5)!=="data:"&&this.crossOrigin!==void 0&&(a.crossOrigin=this.crossOrigin),Zn.add(`image:${e}`,a),r.manager.itemStart(e),a.src=e,a}};var _s=class extends ei{constructor(e){super(e)}load(e,t,n,i){let r=new Wt,o=new Ya(this.manager);return o.setCrossOrigin(this.crossOrigin),o.setPath(this.path),o.load(e,function(a){r.image=a,r.needsUpdate=!0,t!==void 0&&t(r)},n,i),r}},xs=class extends Tt{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new de(e),this.intensity=t}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){let t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,t}},po=class extends xs{constructor(e,t,n){super(e,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Tt.DEFAULT_UP),this.updateMatrix(),this.groundColor=new de(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}toJSON(e){let t=super.toJSON(e);return t.object.groundColor=this.groundColor.getHex(),t}},nh=new Ge,Od=new D,kd=new D,ur=class{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Te(512,512),this.mapType=on,this.map=null,this.mapPass=null,this.matrix=new Ge,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new or,this._frameExtents=new Te(1,1),this._viewportCount=1,this._viewports=[new dt(0,0,1,1)]}getViewportCount(){return this._viewportCount}getCamera(){return this.camera}getFrustum(){return this._frustum}updateMatrices(e){let t=this.camera;Od.setFromMatrixPosition(e.matrixWorld),t.position.copy(Od),kd.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(kd),t.updateMatrixWorld(),this._updateMatrix(t,this.matrix,this._frustum)}_updateMatrix(e,t,n,i){nh.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),n.setFromProjectionMatrix(nh,e.coordinateSystem,e.reversedDepth);let r=this._frameExtents,o=i?i.z/r.x:1,a=i?i.w/r.y:1,l=i?i.x/r.x:0,c=i?i.y/r.y:0;e.coordinateSystem===Js||e.reversedDepth?t.set(.5*o,0,0,.5*o+l,0,.5*a,0,.5*a+c,0,0,1,0,0,0,0,1):t.set(.5*o,0,0,.5*o+l,0,.5*a,0,.5*a+c,0,0,.5,.5,0,0,0,1),t.multiply(nh)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this.biasNode=e.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){let e={};return e.intensity=this.intensity,e.bias=this.bias,e.normalBias=this.normalBias,e.radius=this.radius,e.blurSamples=this.blurSamples,e.mapSize=this.mapSize.toArray(),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}},ya=new D,ba=new Ht,Kn=new D,mo=class extends Tt{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Ge,this.projectionMatrix=new Ge,this.projectionMatrixInverse=new Ge,this.coordinateSystem=On,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorld.decompose(ya,ba,Kn),Kn.x===1&&Kn.y===1&&Kn.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(ya,ba,Kn.set(1,1,1)).invert()}updateWorldMatrix(e,t,n=!1){super.updateWorldMatrix(e,t,n),this.matrixWorld.decompose(ya,ba,Kn),Kn.x===1&&Kn.y===1&&Kn.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(ya,ba,Kn.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}},Fi=new D,zd=new Te,Hd=new Te,zt=class extends mo{constructor(e=50,t=1,n=.1,i=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=i,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){let t=.5*this.getFilmHeight()/e;this.fov=ls*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){let e=Math.tan(qr*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return ls*2*Math.atan(Math.tan(qr*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){Fi.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(Fi.x,Fi.y).multiplyScalar(-e/Fi.z),Fi.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Fi.x,Fi.y).multiplyScalar(-e/Fi.z)}getViewSize(e,t){return this.getViewBounds(e,zd,Hd),t.subVectors(Hd,zd)}setViewOffset(e,t,n,i,r,o){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=i,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=this.near,t=e*Math.tan(qr*.5*this.fov)/this.zoom,n=2*t,i=this.aspect*n,r=-.5*i,o=this.view;if(this.view!==null&&this.view.enabled){let l=o.fullWidth,c=o.fullHeight;r+=o.offsetX*i/l,t-=o.offsetY*n/c,i*=o.width/l,n*=o.height/c}let a=this.filmOffset;a!==0&&(r+=e*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+i,t,t-n,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}},lh=class extends ur{constructor(){super(new zt(50,1,.5,500)),this.isSpotLightShadow=!0,this.focus=1,this.aspect=1}updateMatrices(e){let t=this.camera,n=ls*2*e.angle*this.focus,i=this.mapSize.width/this.mapSize.height*this.aspect,r=e.distance||t.far;(n!==t.fov||i!==t.aspect||r!==t.far)&&(t.fov=n,t.aspect=i,t.far=r,t.updateProjectionMatrix()),super.updateMatrices(e)}copy(e){return super.copy(e),this.focus=e.focus,this.aspect=e.aspect,this}toJSON(){let e=super.toJSON();return e.focus=this.focus,e.aspect=this.aspect,e}},go=class extends xs{constructor(e,t,n=0,i=Math.PI/3,r=0,o=2){super(e,t),this.isSpotLight=!0,this.type="SpotLight",this.position.copy(Tt.DEFAULT_UP),this.updateMatrix(),this.target=new Tt,this.distance=n,this.angle=i,this.penumbra=r,this.decay=o,this.map=null,this.shadow=new lh}get power(){return this.intensity*Math.PI}set power(e){this.intensity=e/Math.PI}dispose(){super.dispose(),this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.angle=e.angle,this.penumbra=e.penumbra,this.decay=e.decay,this.target=e.target.clone(),this.map=e.map,this.shadow=e.shadow.clone(),this}toJSON(e){let t=super.toJSON(e);return t.object.distance=this.distance,t.object.angle=this.angle,t.object.decay=this.decay,t.object.penumbra=this.penumbra,t.object.target=this.target.uuid,this.map&&this.map.isTexture&&(t.object.map=this.map.toJSON(e).uuid),t.object.shadow=this.shadow.toJSON(),t}},ch=class extends ur{constructor(){super(new zt(90,1,.5,500)),this.isPointLightShadow=!0}},vs=class extends xs{constructor(e,t,n=0,i=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=i,this.shadow=new ch}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){super.dispose(),this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}toJSON(e){let t=super.toJSON(e);return t.object.distance=this.distance,t.object.decay=this.decay,t.object.shadow=this.shadow.toJSON(),t}},Rn=class extends mo{constructor(e=-1,t=1,n=1,i=-1,r=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=i,this.near=r,this.far=o,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,i,r,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=i,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,i=(this.top+this.bottom)/2,r=n-e,o=n+e,a=i+t,l=i-t;if(this.view!==null&&this.view.enabled){let c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,o=r+c*this.view.width,a-=h*this.view.offsetY,l=a-h*this.view.height}this.projectionMatrix.makeOrthographic(r,o,a,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}},hh=class extends ur{constructor(){super(new Rn(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},Vi=class extends xs{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Tt.DEFAULT_UP),this.updateMatrix(),this.target=new Tt,this.shadow=new hh}dispose(){super.dispose(),this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}toJSON(e){let t=super.toJSON(e);return t.object.shadow=this.shadow.toJSON(),t.object.target=this.target.uuid,t}};var Mi=class{static extractUrlBase(e){let t=e.lastIndexOf("/");return t===-1?"./":e.slice(0,t+1)}static resolveURL(e,t){return typeof e!="string"||e===""?"":(/^https?:\/\//i.test(t)&&/^\//.test(e)&&(t=t.replace(/(^https?:\/\/[^\/]+).*/i,"$1")),/^(https?:)?\/\//i.test(e)||/^data:.*,.*$/i.test(e)||/^blob:.*$/i.test(e)?e:t+e)}};var ih=new WeakMap,_o=class extends ei{constructor(e){super(e),this.isImageBitmapLoader=!0,typeof createImageBitmap>"u"&&De("ImageBitmapLoader: createImageBitmap() not supported."),typeof fetch>"u"&&De("ImageBitmapLoader: fetch() not supported."),this.options={premultiplyAlpha:"none"},this._abortController=new AbortController}setOptions(e){return this.options=e,this}load(e,t,n,i){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);let r=this,o=Zn.get(`image-bitmap:${e}`);if(o!==void 0){if(r.manager.itemStart(e),o.then){o.then(c=>{ih.has(o)===!0?(i&&i(ih.get(o)),r.manager.itemError(e),r.manager.itemEnd(e)):(t&&t(c),r.manager.itemEnd(e))});return}setTimeout(function(){t&&t(o),r.manager.itemEnd(e)},0);return}let a={};a.credentials=this.crossOrigin==="anonymous"?"same-origin":"include",a.headers=this.requestHeader,a.signal=typeof AbortSignal.any=="function"?AbortSignal.any([this._abortController.signal,this.manager.abortController.signal]):this._abortController.signal;let l=fetch(e,a).then(function(c){return c.blob()}).then(function(c){return createImageBitmap(c,Object.assign({},r.options,{colorSpaceConversion:"none"}))}).then(function(c){return Zn.add(`image-bitmap:${e}`,c),t&&t(c),r.manager.itemEnd(e),c}).catch(function(c){i&&i(c),ih.set(l,c),Zn.remove(`image-bitmap:${e}`),r.manager.itemError(e),r.manager.itemEnd(e)});Zn.add(`image-bitmap:${e}`,l),r.manager.itemStart(e)}abort(){return this._abortController.abort(),this._abortController=new AbortController,this}};var qs=-90,Ys=1,Ka=class extends Tt{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;let i=new zt(qs,Ys,e,t);i.layers=this.layers,this.add(i);let r=new zt(qs,Ys,e,t);r.layers=this.layers,this.add(r);let o=new zt(qs,Ys,e,t);o.layers=this.layers,this.add(o);let a=new zt(qs,Ys,e,t);a.layers=this.layers,this.add(a);let l=new zt(qs,Ys,e,t);l.layers=this.layers,this.add(l);let c=new zt(qs,Ys,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){let e=this.coordinateSystem,t=this.children.concat(),[n,i,r,o,a,l]=t;for(let c of t)this.remove(c);if(e===On)n.up.set(0,1,0),n.lookAt(1,0,0),i.up.set(0,1,0),i.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===Js)n.up.set(0,-1,0),n.lookAt(-1,0,0),i.up.set(0,-1,0),i.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(let c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();let{renderTarget:n,activeMipmapLevel:i}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());let[r,o,a,l,c,h]=this.children,u=e.getRenderTarget(),d=e.getActiveCubeFace(),f=e.getActiveMipmapLevel(),g=e.xr.enabled;e.xr.enabled=!1;let _=n.texture.generateMipmaps;n.texture.generateMipmaps=!1;let m=!1;e.isWebGLRenderer===!0?m=e.state.buffers.depth.getReversed():m=e.reversedDepthBuffer,e.setRenderTarget(n,0,i),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,r),e.setRenderTarget(n,1,i),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,o),e.setRenderTarget(n,2,i),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,a),e.setRenderTarget(n,3,i),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,l),e.setRenderTarget(n,4,i),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,c),n.texture.generateMipmaps=_,e.setRenderTarget(n,5,i),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,h),e.setRenderTarget(u,d,f),e.xr.enabled=g,n.texture.needsPMREMUpdate=!0}},Za=class extends zt{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}},xo=class{constructor(){this._previousTime=0,this._currentTime=0,this._startTime=performance.now(),this._delta=0,this._elapsed=0,this._timescale=1,this._document=null,this._pageVisibilityHandler=null}connect(e){this._document=e,e.hidden!==void 0&&(this._pageVisibilityHandler=ig.bind(this),e.addEventListener("visibilitychange",this._pageVisibilityHandler,!1))}disconnect(){this._pageVisibilityHandler!==null&&(this._document.removeEventListener("visibilitychange",this._pageVisibilityHandler),this._pageVisibilityHandler=null),this._document=null}getDelta(){return this._delta/1e3}getElapsed(){return this._elapsed/1e3}getTimescale(){return this._timescale}setTimescale(e){return this._timescale=e,this}reset(){return this._currentTime=performance.now()-this._startTime,this}dispose(){this.disconnect()}update(e){return this._pageVisibilityHandler!==null&&this._document.hidden===!0?this._delta=0:(this._previousTime=this._currentTime,this._currentTime=(e!==void 0?e:performance.now())-this._startTime,this._delta=(this._currentTime-this._previousTime)*this._timescale,this._elapsed+=this._delta),this}};function ig(){this._document.hidden===!1&&this.reset()}var $a=class{constructor(e,t,n){this.binding=e,this.valueSize=n;let i,r,o;switch(t){case"quaternion":i=this._slerp,r=this._slerpAdditive,o=this._setAdditiveIdentityQuaternion,this.buffer=new Float64Array(n*6),this._workIndex=5;break;case"string":case"bool":i=this._select,r=this._select,o=this._setAdditiveIdentityOther,this.buffer=new Array(n*5);break;default:i=this._lerp,r=this._lerpAdditive,o=this._setAdditiveIdentityNumeric,this.buffer=new Float64Array(n*5)}this._mixBufferRegion=i,this._mixBufferRegionAdditive=r,this._setIdentity=o,this._origIndex=3,this._addIndex=4,this.cumulativeWeight=0,this.cumulativeWeightAdditive=0,this.useCount=0,this.referenceCount=0}accumulate(e,t){let n=this.buffer,i=this.valueSize,r=e*i+i,o=this.cumulativeWeight;if(o===0){for(let a=0;a!==i;++a)n[r+a]=n[a];o=t}else{o+=t;let a=t/o;this._mixBufferRegion(n,r,0,a,i)}this.cumulativeWeight=o}accumulateAdditive(e){let t=this.buffer,n=this.valueSize,i=n*this._addIndex;this.cumulativeWeightAdditive===0&&this._setIdentity(),this._mixBufferRegionAdditive(t,i,0,e,n),this.cumulativeWeightAdditive+=e}apply(e){let t=this.valueSize,n=this.buffer,i=e*t+t,r=this.cumulativeWeight,o=this.cumulativeWeightAdditive,a=this.binding;if(this.cumulativeWeight=0,this.cumulativeWeightAdditive=0,r<1){let l=t*this._origIndex;this._mixBufferRegion(n,i,l,1-r,t)}o>0&&this._mixBufferRegionAdditive(n,i,this._addIndex*t,1,t);for(let l=t,c=t+t;l!==c;++l)if(n[l]!==n[l+t]){a.setValue(n,i);break}}saveOriginalState(){let e=this.binding,t=this.buffer,n=this.valueSize,i=n*this._origIndex;e.getValue(t,i);for(let r=n,o=i;r!==o;++r)t[r]=t[i+r%n];this._setIdentity(),this.cumulativeWeight=0,this.cumulativeWeightAdditive=0}restoreOriginalState(){let e=this.valueSize*3;this.binding.setValue(this.buffer,e)}_setAdditiveIdentityNumeric(){let e=this._addIndex*this.valueSize,t=e+this.valueSize;for(let n=e;n<t;n++)this.buffer[n]=0}_setAdditiveIdentityQuaternion(){this._setAdditiveIdentityNumeric(),this.buffer[this._addIndex*this.valueSize+3]=1}_setAdditiveIdentityOther(){let e=this._origIndex*this.valueSize,t=this._addIndex*this.valueSize;for(let n=0;n<this.valueSize;n++)this.buffer[t+n]=this.buffer[e+n]}_select(e,t,n,i,r){if(i>=.5)for(let o=0;o!==r;++o)e[t+o]=e[n+o]}_slerp(e,t,n,i){Ht.slerpFlat(e,t,e,t,e,n,i)}_slerpAdditive(e,t,n,i,r){let o=this._workIndex*r;Ht.multiplyQuaternionsFlat(e,o,e,t,e,n),Ht.slerpFlat(e,t,e,t,e,o,i)}_lerp(e,t,n,i,r){let o=1-i;for(let a=0;a!==r;++a){let l=t+a;e[l]=e[l]*o+e[n+a]*i}}_lerpAdditive(e,t,n,i,r){for(let o=0;o!==r;++o){let a=t+o;e[a]=e[a]+e[n+o]*i}}},Fh="\\[\\]\\.:\\/",sg=new RegExp("["+Fh+"]","g"),Bh="[^"+Fh+"]",rg="[^"+Fh.replace("\\.","")+"]",og=/((?:WC+[\/:])*)/.source.replace("WC",Bh),ag=/(WCOD+)?/.source.replace("WCOD",rg),lg=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",Bh),cg=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",Bh),hg=new RegExp("^"+og+ag+lg+cg+"$"),ug=["material","materials","bones","map"],uh=class{constructor(e,t,n){let i=n||_t.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,i)}getValue(e,t){this.bind();let n=this._targetGroup.nCachedObjects_,i=this._bindings[n];i!==void 0&&i.getValue(e,t)}setValue(e,t){let n=this._bindings;for(let i=this._targetGroup.nCachedObjects_,r=n.length;i!==r;++i)n[i].setValue(e,t)}bind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].bind()}unbind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].unbind()}},_t=class s{constructor(e,t,n){this.path=t,this.parsedPath=n||s.parseTrackName(t),this.node=s.findNode(e,this.parsedPath.nodeName),this.rootNode=e,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(e,t,n){return e&&e.isAnimationObjectGroup?new s.Composite(e,t,n):new s(e,t,n)}static sanitizeNodeName(e){return e.replace(/\s/g,"_").replace(sg,"")}static parseTrackName(e){let t=hg.exec(e);if(t===null)throw new Error("THREE.PropertyBinding: Cannot parse trackName: "+e);let n={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},i=n.nodeName&&n.nodeName.lastIndexOf(".");if(i!==void 0&&i!==-1){let r=n.nodeName.substring(i+1);ug.indexOf(r)!==-1&&(n.nodeName=n.nodeName.substring(0,i),n.objectName=r)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("THREE.PropertyBinding: can not parse propertyName from trackName: "+e);return n}static findNode(e,t){if(t===void 0||t===""||t==="."||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){let n=e.skeleton.getBoneByName(t);if(n!==void 0)return n}if(e.children){let n=function(r){for(let o=0;o<r.length;o++){let a=r[o];if(a.name===t||a.uuid===t)return a;let l=n(a.children);if(l)return l}return null},i=n(e.children);if(i)return i}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){let n=this.resolvedProperty;for(let i=0,r=n.length;i!==r;++i)e[t++]=n[i]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){let n=this.resolvedProperty;for(let i=0,r=n.length;i!==r;++i)n[i]=e[t++]}_setValue_array_setNeedsUpdate(e,t){let n=this.resolvedProperty;for(let i=0,r=n.length;i!==r;++i)n[i]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){let n=this.resolvedProperty;for(let i=0,r=n.length;i!==r;++i)n[i]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let e=this.node,t=this.parsedPath,n=t.objectName,i=t.propertyName,r=t.propertyIndex;if(e||(e=s.findNode(this.rootNode,t.nodeName),this.node=e),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!e){De("PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let c=t.objectIndex;switch(n){case"materials":if(!e.material){ke("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.materials){ke("PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}e=e.material.materials;break;case"bones":if(!e.skeleton){ke("PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}e=e.skeleton.bones;for(let h=0;h<e.length;h++)if(e[h].name===c){c=h;break}break;case"map":if("map"in e){e=e.map;break}if(!e.material){ke("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.map){ke("PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}e=e.material.map;break;default:if(e[n]===void 0){ke("PropertyBinding: Can not bind to objectName of node undefined.",this);return}e=e[n]}if(c!==void 0){if(e[c]===void 0){ke("PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,e);return}e=e[c]}}let o=e[i];if(o===void 0){let c=t.nodeName;ke("PropertyBinding: Trying to update property for track: "+c+"."+i+" but it wasn't found.",e);return}let a=this.Versioning.None;this.targetObject=e,e.isMaterial===!0?a=this.Versioning.NeedsUpdate:e.isObject3D===!0&&(a=this.Versioning.MatrixWorldNeedsUpdate);let l=this.BindingType.Direct;if(r!==void 0){if(i==="morphTargetInfluences"){if(!e.geometry){ke("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!e.geometry.morphAttributes){ke("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}e.morphTargetDictionary[r]!==void 0&&(r=e.morphTargetDictionary[r])}l=this.BindingType.ArrayElement,this.resolvedProperty=o,this.propertyIndex=r}else o.fromArray!==void 0&&o.toArray!==void 0?(l=this.BindingType.HasFromToArray,this.resolvedProperty=o):Array.isArray(o)?(l=this.BindingType.EntireArray,this.resolvedProperty=o):this.propertyName=i;this.getValue=this.GetterByBindingType[l],this.setValue=this.SetterByBindingTypeAndVersioning[l][a]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};_t.Composite=uh;_t.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};_t.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};_t.prototype.GetterByBindingType=[_t.prototype._getValue_direct,_t.prototype._getValue_array,_t.prototype._getValue_arrayElement,_t.prototype._getValue_toArray];_t.prototype.SetterByBindingTypeAndVersioning=[[_t.prototype._setValue_direct,_t.prototype._setValue_direct_setNeedsUpdate,_t.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[_t.prototype._setValue_array,_t.prototype._setValue_array_setNeedsUpdate,_t.prototype._setValue_array_setMatrixWorldNeedsUpdate],[_t.prototype._setValue_arrayElement,_t.prototype._setValue_arrayElement_setNeedsUpdate,_t.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[_t.prototype._setValue_fromArray,_t.prototype._setValue_fromArray_setNeedsUpdate,_t.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var Ja=class{constructor(e,t,n=null,i=t.blendMode){this._mixer=e,this._clip=t,this._localRoot=n,this.blendMode=i;let r=t.tracks,o=r.length,a=new Array(o),l={endingStart:is,endingEnd:is};for(let c=0;c!==o;++c){let h=r[c].createInterpolant(null);a[c]=h,h.settings=l}this._interpolantSettings=l,this._interpolants=a,this._propertyBindings=new Array(o),this._cacheIndex=null,this._byClipCacheIndex=null,this._timeScaleInterpolant=null,this._restoreTimeScale=null,this._weightInterpolant=null,this.loop=df,this._loopCount=-1,this._startTime=null,this.time=0,this.timeScale=1,this._effectiveTimeScale=1,this.weight=1,this._effectiveWeight=1,this.repetitions=1/0,this.paused=!1,this.enabled=!0,this.clampWhenFinished=!1,this.zeroSlopeAtStart=!0,this.zeroSlopeAtEnd=!0}play(){return this._mixer._activateAction(this),this}stop(){return this._mixer._deactivateAction(this),this.reset()}reset(){return this.paused=!1,this.enabled=!0,this.time=0,this._loopCount=-1,this._startTime=null,this.stopFading().stopWarping()}isRunning(){return this.enabled&&!this.paused&&this.timeScale!==0&&this._startTime===null&&this._mixer._isActiveAction(this)}isScheduled(){return this._mixer._isActiveAction(this)}startAt(e){return this._startTime=e,this}setLoop(e,t){return this.loop=e,this.repetitions=t,this}setEffectiveWeight(e){return this.weight=e,this._effectiveWeight=this.enabled?e:0,this.stopFading()}getEffectiveWeight(){return this._effectiveWeight}fadeIn(e){return this._scheduleFading(e,0,1)}fadeOut(e){return this._scheduleFading(e,1,0)}crossFadeFrom(e,t,n=!1){if(e.fadeOut(t),this.fadeIn(t),n===!0){let i=this._clip.duration,r=e._clip.duration,o=r/i,a=i/r;e._restoreTimeScale=e.timeScale,this._restoreTimeScale=this.timeScale,e.warp(1,o,t),this.warp(a,1,t)}return this}crossFadeTo(e,t,n=!1){return e.crossFadeFrom(this,t,n)}stopFading(){let e=this._weightInterpolant;return e!==null&&(this._weightInterpolant=null,this._mixer._takeBackControlInterpolant(e)),this}setEffectiveTimeScale(e){return this.timeScale=e,this._effectiveTimeScale=this.paused?0:e,this.stopWarping()}getEffectiveTimeScale(){return this._effectiveTimeScale}setDuration(e){return this.timeScale=this._clip.duration/e,this.stopWarping()}syncWith(e){return this.time=e.time,this.timeScale=e.timeScale,this.stopWarping()}halt(e){return this.warp(this._effectiveTimeScale,0,e)}warp(e,t,n){let i=this._mixer,r=i.time,o=this.timeScale,a=this._timeScaleInterpolant;a===null&&(a=i._lendControlInterpolant(),this._timeScaleInterpolant=a);let l=a.parameterPositions,c=a.sampleValues;return l[0]=r,l[1]=r+n,c[0]=e/o,c[1]=t/o,this}stopWarping(){let e=this._timeScaleInterpolant;return e!==null&&(this._timeScaleInterpolant=null,this._mixer._takeBackControlInterpolant(e)),this._restoreTimeScale=null,this}getMixer(){return this._mixer}getClip(){return this._clip}getRoot(){return this._localRoot||this._mixer._root}_update(e,t,n,i){if(!this.enabled){this._updateWeight(e);return}let r=this._startTime;if(r!==null){let l=(e-r)*n;l<0||n===0?t=0:(this._startTime=null,t=n*l)}t*=this._updateTimeScale(e);let o=this._updateTime(t),a=this._updateWeight(e);if(a>0){let l=this._interpolants,c=this._propertyBindings;switch(this.blendMode){case pf:for(let h=0,u=l.length;h!==u;++h)l[h].evaluate(o),c[h].accumulateAdditive(a);break;case zl:default:for(let h=0,u=l.length;h!==u;++h)l[h].evaluate(o),c[h].accumulate(i,a)}}}_updateWeight(e){let t=0;if(this.enabled){t=this.weight;let n=this._weightInterpolant;if(n!==null){let i=n.evaluate(e)[0];t*=i,e>n.parameterPositions[1]&&(this.stopFading(),i===0&&(this.enabled=!1))}}return this._effectiveWeight=t,t}_updateTimeScale(e){let t=0;if(!this.paused){t=this.timeScale;let n=this._timeScaleInterpolant;if(n!==null){let i=n.evaluate(e)[0];t*=i,e>n.parameterPositions[1]&&(t===0?this.paused=!0:(this._restoreTimeScale!==null&&(t=this._restoreTimeScale),this.timeScale=t),this.stopWarping())}}return this._effectiveTimeScale=t,t}_updateTime(e){let t=this._clip.duration,n=this.loop,i=this.time+e,r=this._loopCount,o=n===ff;if(e===0)return r===-1?i:o&&(r&1)===1?t-i:i;if(n===Co){r===-1&&(this._loopCount=0,this._setEndings(!0,!0,!1));e:{if(i>=t)i=t;else if(i<0)i=0;else{this.time=i;break e}this.clampWhenFinished?this.paused=!0:this.enabled=!1,this.time=i,this._mixer.dispatchEvent({type:"finished",action:this,direction:e<0?-1:1})}}else{if(r===-1&&(e>=0?(r=0,this._setEndings(!0,this.repetitions===0,o)):this._setEndings(this.repetitions===0,!0,o)),i>=t||i<0){let a=Math.floor(i/t);i-=t*a,r+=Math.abs(a);let l=this.repetitions-r;if(l<=0)this.clampWhenFinished?this.paused=!0:this.enabled=!1,i=e>0?t:0,this.time=i,this._mixer.dispatchEvent({type:"finished",action:this,direction:e>0?1:-1});else{if(l===1){let c=e<0;this._setEndings(c,!c,o)}else this._setEndings(!1,!1,o);this._loopCount=r,this.time=i,this._mixer.dispatchEvent({type:"loop",action:this,loopDelta:a})}}else this._loopCount=r,this.time=i;if(o&&(r&1)===1)return t-i}return i}_setEndings(e,t,n){let i=this._interpolantSettings;n?(i.endingStart=ss,i.endingEnd=ss):(e?i.endingStart=this.zeroSlopeAtStart?ss:is:i.endingStart=Kr,t?i.endingEnd=this.zeroSlopeAtEnd?ss:is:i.endingEnd=Kr)}_scheduleFading(e,t,n){let i=this._mixer,r=i.time,o=this._weightInterpolant;o===null&&(o=i._lendControlInterpolant(),this._weightInterpolant=o);let a=o.parameterPositions,l=o.sampleValues;return a[0]=r,l[0]=t,a[1]=r+e,l[1]=n,this}},dg=new Float32Array(1),vo=class extends Hn{constructor(e){super(),this._root=e,this._initMemoryManager(),this._accuIndex=0,this.time=0,this.timeScale=1,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}_bindAction(e,t){let n=e._localRoot||this._root,i=e._clip.tracks,r=i.length,o=e._propertyBindings,a=e._interpolants,l=n.uuid,c=this._bindingsByRootAndName,h=c[l];h===void 0&&(h={},c[l]=h);for(let u=0;u!==r;++u){let d=i[u],f=d.name,g=h[f];if(g!==void 0)++g.referenceCount,o[u]=g;else{if(g=o[u],g!==void 0){g._cacheIndex===null&&(++g.referenceCount,this._addInactiveBinding(g,l,f));continue}let _=t&&t._propertyBindings[u].binding.parsedPath;g=new $a(_t.create(n,f,_),d.ValueTypeName,d.getValueSize()),++g.referenceCount,this._addInactiveBinding(g,l,f),o[u]=g}a[u].resultBuffer=g.buffer}}_activateAction(e){if(!this._isActiveAction(e)){if(e._cacheIndex===null){let n=(e._localRoot||this._root).uuid,i=e._clip.uuid,r=this._actionsByClip[i];this._bindAction(e,r&&r.knownActions[0]),this._addInactiveAction(e,i,n)}let t=e._propertyBindings;for(let n=0,i=t.length;n!==i;++n){let r=t[n];r.useCount++===0&&(this._lendBinding(r),r.saveOriginalState())}this._lendAction(e)}}_deactivateAction(e){if(this._isActiveAction(e)){let t=e._propertyBindings;for(let n=0,i=t.length;n!==i;++n){let r=t[n];--r.useCount===0&&(r.restoreOriginalState(),this._takeBackBinding(r))}this._takeBackAction(e)}}_initMemoryManager(){this._actions=[],this._nActiveActions=0,this._actionsByClip={},this._bindings=[],this._nActiveBindings=0,this._bindingsByRootAndName={},this._controlInterpolants=[],this._nActiveControlInterpolants=0;let e=this;this.stats={actions:{get total(){return e._actions.length},get inUse(){return e._nActiveActions}},bindings:{get total(){return e._bindings.length},get inUse(){return e._nActiveBindings}},controlInterpolants:{get total(){return e._controlInterpolants.length},get inUse(){return e._nActiveControlInterpolants}}}}_isActiveAction(e){let t=e._cacheIndex;return t!==null&&t<this._nActiveActions}_addInactiveAction(e,t,n){let i=this._actions,r=this._actionsByClip,o=r[t];if(o===void 0)o={knownActions:[e],actionByRoot:{}},e._byClipCacheIndex=0,r[t]=o;else{let a=o.knownActions;e._byClipCacheIndex=a.length,a.push(e)}e._cacheIndex=i.length,i.push(e),o.actionByRoot[n]=e}_removeInactiveAction(e){let t=this._actions,n=t[t.length-1],i=e._cacheIndex;n._cacheIndex=i,t[i]=n,t.pop(),e._cacheIndex=null;let r=e._clip.uuid,o=this._actionsByClip,a=o[r],l=a.knownActions,c=l[l.length-1],h=e._byClipCacheIndex;c._byClipCacheIndex=h,l[h]=c,l.pop(),e._byClipCacheIndex=null;let u=a.actionByRoot,d=(e._localRoot||this._root).uuid;delete u[d],l.length===0&&delete o[r],this._removeInactiveBindingsForAction(e)}_removeInactiveBindingsForAction(e){let t=e._propertyBindings;for(let n=0,i=t.length;n!==i;++n){let r=t[n];--r.referenceCount===0&&this._removeInactiveBinding(r)}}_lendAction(e){let t=this._actions,n=e._cacheIndex,i=this._nActiveActions++,r=t[i];e._cacheIndex=i,t[i]=e,r._cacheIndex=n,t[n]=r}_takeBackAction(e){let t=this._actions,n=e._cacheIndex,i=--this._nActiveActions,r=t[i];e._cacheIndex=i,t[i]=e,r._cacheIndex=n,t[n]=r}_addInactiveBinding(e,t,n){let i=this._bindingsByRootAndName,r=this._bindings,o=i[t];o===void 0&&(o={},i[t]=o),o[n]=e,e._cacheIndex=r.length,r.push(e)}_removeInactiveBinding(e){let t=this._bindings,n=e.binding,i=n.rootNode.uuid,r=n.path,o=this._bindingsByRootAndName,a=o[i],l=t[t.length-1],c=e._cacheIndex;l._cacheIndex=c,t[c]=l,t.pop(),delete a[r],Object.keys(a).length===0&&delete o[i]}_lendBinding(e){let t=this._bindings,n=e._cacheIndex,i=this._nActiveBindings++,r=t[i];e._cacheIndex=i,t[i]=e,r._cacheIndex=n,t[n]=r}_takeBackBinding(e){let t=this._bindings,n=e._cacheIndex,i=--this._nActiveBindings,r=t[i];e._cacheIndex=i,t[i]=e,r._cacheIndex=n,t[n]=r}_lendControlInterpolant(){let e=this._controlInterpolants,t=this._nActiveControlInterpolants++,n=e[t];return n===void 0&&(n=new uo(new Float32Array(2),new Float32Array(2),1,dg),n.__cacheIndex=t,e[t]=n),n}_takeBackControlInterpolant(e){let t=this._controlInterpolants,n=e.__cacheIndex,i=--this._nActiveControlInterpolants,r=t[i];e.__cacheIndex=i,t[i]=e,r.__cacheIndex=n,t[n]=r}clipAction(e,t,n){let i=t||this._root,r=i.uuid,o=typeof e=="string"?bi.findByName(i,e):e,a=o!==null?o.uuid:e,l=this._actionsByClip[a],c=null;if(n===void 0&&(o!==null?n=o.blendMode:n=zl),l!==void 0){let u=l.actionByRoot[r];if(u!==void 0&&u.blendMode===n)return u;c=l.knownActions[0],o===null&&(o=c._clip)}if(o===null)return null;let h=new Ja(this,o,t,n);return this._bindAction(h,c),this._addInactiveAction(h,a,r),h}existingAction(e,t){let n=t||this._root,i=n.uuid,r=typeof e=="string"?bi.findByName(n,e):e,o=r?r.uuid:e,a=this._actionsByClip[o];return a!==void 0&&a.actionByRoot[i]||null}stopAllAction(){let e=this._actions,t=this._nActiveActions;for(let n=t-1;n>=0;--n)e[n].stop();return this}update(e){e*=this.timeScale;let t=this._actions,n=this._nActiveActions,i=this.time+=e,r=Math.sign(e),o=this._accuIndex^=1;for(let c=0;c!==n;++c)t[c]._update(i,e,r,o);let a=this._bindings,l=this._nActiveBindings;for(let c=0;c!==l;++c)a[c].apply(o);return this}setTime(e){this.time=0;for(let t=0;t<this._actions.length;t++)this._actions[t].time=0;return this.update(e)}getRoot(){return this._root}uncacheClip(e){let t=this._actions,n=e.uuid,i=this._actionsByClip,r=i[n];if(r!==void 0){let o=r.knownActions;for(let a=0,l=o.length;a!==l;++a){let c=o[a];this._deactivateAction(c);let h=c._cacheIndex,u=t[t.length-1];c._cacheIndex=null,c._byClipCacheIndex=null,u._cacheIndex=h,t[h]=u,t.pop(),this._removeInactiveBindingsForAction(c)}delete i[n]}}uncacheRoot(e){let t=e.uuid,n=this._actionsByClip;for(let o in n){let a=n[o].actionByRoot,l=a[t];l!==void 0&&(this._deactivateAction(l),this._removeInactiveAction(l))}let i=this._bindingsByRootAndName,r=i[t];if(r!==void 0)for(let o in r){let a=r[o];a.restoreOriginalState(),this._removeInactiveBinding(a)}}uncacheAction(e,t){let n=this.existingAction(e,t);n!==null&&(this._deactivateAction(n),this._removeInactiveAction(n))}};var Gh=class Gh{constructor(e,t,n,i){this.elements=[1,0,0,1],e!==void 0&&this.set(e,t,n,i)}identity(){return this.set(1,0,0,1),this}fromArray(e,t=0){for(let n=0;n<4;n++)this.elements[n]=e[n+t];return this}set(e,t,n,i){let r=this.elements;return r[0]=e,r[2]=t,r[1]=n,r[3]=i,this}};Gh.prototype.isMatrix2=!0;var dh=Gh;function Oh(s,e,t,n){let i=fg(n);switch(t){case Ch:return s*e;case _r:return s*e/i.components*i.byteLength;case al:return s*e/i.components*i.byteLength;case Xi:return s*e*2/i.components*i.byteLength;case ll:return s*e*2/i.components*i.byteLength;case Ph:return s*e*3/i.components*i.byteLength;case Sn:return s*e*4/i.components*i.byteLength;case cl:return s*e*4/i.components*i.byteLength;case So:case To:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*8;case Eo:case wo:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*16;case ul:case fl:return Math.max(s,16)*Math.max(e,8)/4;case hl:case dl:return Math.max(s,8)*Math.max(e,8)/2;case pl:case ml:case _l:case xl:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*8;case gl:case Ao:case vl:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*16;case yl:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*16;case bl:return Math.floor((s+4)/5)*Math.floor((e+3)/4)*16;case Ml:return Math.floor((s+4)/5)*Math.floor((e+4)/5)*16;case Sl:return Math.floor((s+5)/6)*Math.floor((e+4)/5)*16;case Tl:return Math.floor((s+5)/6)*Math.floor((e+5)/6)*16;case El:return Math.floor((s+7)/8)*Math.floor((e+4)/5)*16;case wl:return Math.floor((s+7)/8)*Math.floor((e+5)/6)*16;case Al:return Math.floor((s+7)/8)*Math.floor((e+7)/8)*16;case Rl:return Math.floor((s+9)/10)*Math.floor((e+4)/5)*16;case Cl:return Math.floor((s+9)/10)*Math.floor((e+5)/6)*16;case Pl:return Math.floor((s+9)/10)*Math.floor((e+7)/8)*16;case Il:return Math.floor((s+9)/10)*Math.floor((e+9)/10)*16;case Ll:return Math.floor((s+11)/12)*Math.floor((e+9)/10)*16;case Dl:return Math.floor((s+11)/12)*Math.floor((e+11)/12)*16;case Nl:case Ul:case Fl:return Math.ceil(s/4)*Math.ceil(e/4)*16;case Bl:case Ol:return Math.ceil(s/4)*Math.ceil(e/4)*8;case Ro:case kl:return Math.ceil(s/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function fg(s){switch(s){case on:case Eh:return{byteLength:1,components:1};case mr:case wh:case Vt:return{byteLength:2,components:1};case rl:case ol:return{byteLength:2,components:4};case Wn:case sl:case Mn:return{byteLength:4,components:1};case Ah:case Rh:return{byteLength:4,components:3}}throw new Error(`THREE.TextureUtils: Unknown texture type ${s}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:"186"}}));typeof window<"u"&&(window.__THREE__?De("WARNING: Multiple instances of Three.js being imported."):window.__THREE__="186");function jf(){let s=null,e=!1,t=null,n=null;function i(r,o){n=s.requestAnimationFrame(i),t(r,o)}return{start:function(){e!==!0&&t!==null&&s!==null&&(n=s.requestAnimationFrame(i),e=!0)},stop:function(){s!==null&&s.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){s=r}}}function mg(s){let e=new WeakMap;function t(a,l){let c=a.array,h=a.usage,u=c.byteLength,d=s.createBuffer();s.bindBuffer(l,d),s.bufferData(l,c,h),a.onUploadCallback();let f;if(c instanceof Float32Array)f=s.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)f=s.HALF_FLOAT;else if(c instanceof Uint16Array)a.isFloat16BufferAttribute?f=s.HALF_FLOAT:f=s.UNSIGNED_SHORT;else if(c instanceof Int16Array)f=s.SHORT;else if(c instanceof Uint32Array)f=s.UNSIGNED_INT;else if(c instanceof Int32Array)f=s.INT;else if(c instanceof Int8Array)f=s.BYTE;else if(c instanceof Uint8Array)f=s.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)f=s.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:d,type:f,bytesPerElement:c.BYTES_PER_ELEMENT,version:a.version,size:u}}function n(a,l,c){let h=l.array,u=l.updateRanges;if(s.bindBuffer(c,a),u.length===0)s.bufferSubData(c,0,h);else{u.sort((f,g)=>f.start-g.start);let d=0;for(let f=1;f<u.length;f++){let g=u[d],_=u[f];_.start<=g.start+g.count+1?g.count=Math.max(g.count,_.start+_.count-g.start):(++d,u[d]=_)}u.length=d+1;for(let f=0,g=u.length;f<g;f++){let _=u[f];s.bufferSubData(c,_.start*h.BYTES_PER_ELEMENT,h,_.start,_.count)}l.clearUpdateRanges()}l.onUploadCallback()}function i(a){return a.isInterleavedBufferAttribute&&(a=a.data),e.get(a)}function r(a){a.isInterleavedBufferAttribute&&(a=a.data);let l=e.get(a);l&&(s.deleteBuffer(l.buffer),e.delete(a))}function o(a,l){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){let h=e.get(a);(!h||h.version<a.version)&&e.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}let c=e.get(a);if(c===void 0)e.set(a,t(a,l));else if(c.version<a.version){if(c.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,a,l),c.version=a.version}}return{get:i,remove:r,update:o}}var gg=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,_g=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,xg=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,vg=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,yg=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,bg=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Mg=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,Sg=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Tg=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec4 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 );
	}
#endif`,Eg=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,wg=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Ag=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Rg=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,Cg=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,Pg=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,Ig=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,Lg=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Dg=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Ng=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Ug=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,Fg=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,Bg=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,Og=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec4( 1.0 );
#endif
#ifdef USE_COLOR_ALPHA
	vColor *= color;
#elif defined( USE_COLOR )
	vColor.rgb *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.rgb *= instanceColor.rgb;
#endif
#ifdef USE_BATCHING_COLOR
	vColor *= getBatchingColor( getIndirectIndex( gl_DrawID ) );
#endif`,kg=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
#define inverseTransformDirection transformDirectionByInverseViewMatrix
vec3 transformNormalByInverseViewMatrix( in vec3 normal, in mat4 viewMatrix ) {
	return normalize( ( vec4( normal, 0.0 ) * viewMatrix ).xyz );
}
vec3 transformDirectionByInverseViewMatrix( in vec3 dir, in mat4 viewMatrix ) {
	return normalize( ( vec4( dir, 0.0 ) * viewMatrix ).xyz );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,zg=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,Hg=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
#endif`,Vg=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Gg=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Wg=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Xg=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,qg="gl_FragColor = linearToOutputTexel( gl_FragColor );",Yg=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Kg=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * reflectVec );
		#ifdef ENVMAP_BLENDING_MULTIPLY
			outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_MIX )
			outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_ADD )
			outgoingLight += envColor.xyz * specularStrength * reflectivity;
		#endif
	#endif
#endif`,Zg=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,$g=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,Jg=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,jg=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,Qg=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,e1=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,t1=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,n1=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,i1=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,s1=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,r1=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,o1=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,a1=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_SUN_LIGHTS > 0
	struct SunLight {
		vec3 direction;
		vec3 color;
	};
	uniform SunLight sunLights[ NUM_SUN_LIGHTS ];
	void getSunLightInfo( const in SunLight sunLight, out IncidentLight light ) {
		light.color = sunLight.color;
		light.direction = sunLight.direction;
		light.visible = true;
	}
#endif
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif
#include <lightprobes_pars_fragment>`,l1=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = transformDirectionByInverseViewMatrix( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_RETROREFLECTION
		vec3 getIBLRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 retroVec = normalize( mix( viewDir, normal, pow4( roughness ) ) );
				retroVec = transformDirectionByInverseViewMatrix( retroVec, viewMatrix );
				vec4 envMapColor = textureCubeUV( envMap, envMapRotation * retroVec, roughness );
				return envMapColor.rgb * envMapIntensity;
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
		#ifdef USE_RETROREFLECTION
			vec3 getIBLAnisotropyRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
				#ifdef ENVMAP_TYPE_CUBE_UV
					vec3 bentNormal = cross( bitangent, viewDir );
					bentNormal = normalize( cross( bentNormal, bitangent ) );
					bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
					return getIBLRetroRadiance( viewDir, bentNormal, roughness );
				#else
					return vec3( 0.0 );
				#endif
			}
		#endif
	#endif
#endif`,c1=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,h1=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,u1=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,d1=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,f1=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_RETROREFLECTION
	material.retroreflectivity = retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,p1=`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
	float specularF90;
	float dispersion;
	vec2 dfg;
	vec3 multiScatteringCompensation;
	#ifdef USE_RETROREFLECTION
		float retroreflectivity;
	#endif
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0Dielectric;
		vec3 iridescenceF0Metallic;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		return 0.5 / max( gv + gl, EPSILON );
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColorBlended;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec2 fab, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec2 fab, const in vec3 specularColor, const in float specularF90, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( material.specularF90 - material.specularColorBlended ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
		#ifdef USE_CLEARCOAT
			vec3 Ncc = geometryClearcoatNormal;
			vec2 uvClearcoat = LTC_Uv( Ncc, viewDir, material.clearcoatRoughness );
			vec4 t1Clearcoat = texture2D( ltc_1, uvClearcoat );
			vec4 t2Clearcoat = texture2D( ltc_2, uvClearcoat );
			mat3 mInvClearcoat = mat3(
				vec3( t1Clearcoat.x, 0, t1Clearcoat.y ),
				vec3(             0, 1,             0 ),
				vec3( t1Clearcoat.z, 0, t1Clearcoat.w )
			);
			vec3 fresnelClearcoat = material.clearcoatF0 * t2Clearcoat.x + ( material.clearcoatF90 - material.clearcoatF0 ) * t2Clearcoat.y;
			clearcoatSpecularDirect += lightColor * fresnelClearcoat * LTC_Evaluate( Ncc, viewDir, position, mInvClearcoat, rectCoords );
		#endif
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
 
 		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
 
 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );
 
 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );
 
 		irradiance *= sheenEnergyComp;
 
 	#endif
	vec3 specularBRDF = BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	#ifdef USE_RETROREFLECTION
		vec3 retroViewDir = reflect( - geometryViewDir, geometryNormal );
		vec3 retroSpecularBRDF = BRDF_GGX( directLight.direction, retroViewDir, geometryNormal, material );
		specularBRDF = mix( specularBRDF, retroSpecularBRDF, saturate( material.retroreflectivity ) );
	#endif
	reflectedLight.directSpecular += irradiance * specularBRDF * material.multiScatteringCompensation;
	vec3 halfDir = normalize( directLight.direction + geometryViewDir );
	float dotVH = saturate( dot( geometryViewDir, halfDir ) );
	vec3 F = F_Schlick( material.specularColor, material.specularF90, dotVH );
	#ifdef USE_RETROREFLECTION
		vec3 retroHalfDir = normalize( directLight.direction + retroViewDir );
		float dotRetroVH = saturate( dot( retroViewDir, retroHalfDir ) );
		vec3 retroF = F_Schlick( material.specularColor, material.specularF90, dotRetroVH );
		F = mix( F, retroF, saturate( material.retroreflectivity ) );
	#endif
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - F );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScattering, multiScattering );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScattering, multiScattering );
	#endif
	vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - singleScattering - multiScattering );
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		sheenSpecularIndirect += irradiance * material.sheenColor * sheenAlbedo * RECIPROCAL_PI;
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
 	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( material.dfg, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceF0Metallic, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( material.dfg, material.diffuseColor, material.specularF90, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,m1=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		vec3 iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		vec3 iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( iridescenceFresnelDielectric, iridescenceFresnelMetallic, material.metalness );
		material.iridescenceF0Dielectric = Schlick_to_F0( iridescenceFresnelDielectric, 1.0, dotNVi );
		material.iridescenceF0Metallic = Schlick_to_F0( iridescenceFresnelMetallic, 1.0, dotNVi );
	}
#endif
#ifdef STANDARD
	float dotNVms = saturate( dot( geometryNormal, geometryViewDir ) );
	material.dfg = texture2D( dfgLUT, vec2( material.roughness, dotNVms ) ).rg;
	#if ( NUM_SUN_LIGHTS > 0 || NUM_DIR_LIGHTS > 0 || NUM_POINT_LIGHTS > 0 || NUM_SPOT_LIGHTS > 0 )
		float EssMs = material.dfg.x + material.dfg.y;
		material.multiScatteringCompensation = 1.0 + material.specularColorBlended * ( 1.0 / EssMs - 1.0 );
	#endif
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SUN_LIGHTS > 0 ) && defined( RE_Direct )
	SunLight sunLight;
	#if defined( USE_SHADOWMAP ) && NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHTS; i ++ ) {
		sunLight = sunLights[ i ];
		getSunLightInfo( sunLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SUN_LIGHT_SHADOWS )
		sunLightShadow = sunLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getSunShadow( sunShadowMap[ i ], sunLightShadow, UNROLLED_LOOP_INDEX ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
	#ifdef USE_LIGHT_PROBES_GRID
		vec3 probeWorldPos = ( ( vec4( geometryPosition, 1.0 ) - viewMatrix[ 3 ] ) * viewMatrix ).xyz;
		vec3 probeWorldNormal = transformNormalByInverseViewMatrix( geometryNormal, viewMatrix );
		irradiance += getLightProbeGridIrradiance( probeWorldPos, probeWorldNormal );
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,g1=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( ENVMAP_TYPE_CUBE_UV )
		#if defined( STANDARD ) || defined( LAMBERT ) || defined( PHONG )
			iblIrradiance += getIBLIrradiance( geometryNormal );
		#endif
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		vec3 iblRadiance = getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		vec3 iblRadiance = getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_RETROREFLECTION
		#ifdef USE_ANISOTROPY
			vec3 retroIBLRadiance = getIBLAnisotropyRetroRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
		#else
			vec3 retroIBLRadiance = getIBLRetroRadiance( geometryViewDir, geometryNormal, material.roughness );
		#endif
		iblRadiance = mix( iblRadiance, retroIBLRadiance, saturate( material.retroreflectivity ) );
	#endif
	radiance += iblRadiance;
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,_1=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,x1=`#ifdef USE_LIGHT_PROBES_GRID
uniform highp sampler3D probesSH;
uniform vec3 probesMin;
uniform vec3 probesMax;
uniform vec3 probesResolution;
vec3 getLightProbeGridIrradiance( vec3 worldPos, vec3 worldNormal ) {
	vec3 res = probesResolution;
	vec3 gridRange = probesMax - probesMin;
	vec3 resMinusOne = res - 1.0;
	vec3 probeSpacing = gridRange / resMinusOne;
	vec3 samplePos = worldPos + worldNormal * probeSpacing * 0.5;
	vec3 uvw = clamp( ( samplePos - probesMin ) / gridRange, 0.0, 1.0 );
	uvw = uvw * resMinusOne / res + 0.5 / res;
	float nz          = res.z;
	float paddedSlices = nz + 2.0;
	float atlasDepth  = 7.0 * paddedSlices;
	float uvZBase     = uvw.z * nz + 1.0;
	vec4 s0 = texture( probesSH, vec3( uvw.xy, ( uvZBase                       ) / atlasDepth ) );
	vec4 s1 = texture( probesSH, vec3( uvw.xy, ( uvZBase +       paddedSlices   ) / atlasDepth ) );
	vec4 s2 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 2.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s3 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 3.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s4 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 4.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s5 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 5.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s6 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 6.0 * paddedSlices   ) / atlasDepth ) );
	vec3 c0 = s0.xyz;
	vec3 c1 = vec3( s0.w, s1.xy );
	vec3 c2 = vec3( s1.zw, s2.x );
	vec3 c3 = s2.yzw;
	vec3 c4 = s3.xyz;
	vec3 c5 = vec3( s3.w, s4.xy );
	vec3 c6 = vec3( s4.zw, s5.x );
	vec3 c7 = s5.yzw;
	vec3 c8 = s6.xyz;
	float x = worldNormal.x, y = worldNormal.y, z = worldNormal.z;
	vec3 result = c0 * 0.886227;
	result += c1 * 2.0 * 0.511664 * y;
	result += c2 * 2.0 * 0.511664 * z;
	result += c3 * 2.0 * 0.511664 * x;
	result += c4 * 2.0 * 0.429043 * x * y;
	result += c5 * 2.0 * 0.429043 * y * z;
	result += c6 * ( 0.743125 * z * z - 0.247708 );
	result += c7 * 2.0 * 0.429043 * x * z;
	result += c8 * 0.429043 * ( x * x - y * y );
	return max( result, vec3( 0.0 ) );
}
#endif`,v1=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,y1=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,b1=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,M1=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,S1=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,T1=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,E1=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,w1=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,A1=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,R1=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,C1=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,P1=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,I1=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,L1=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,D1=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,N1=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#ifdef DOUBLE_SIDED
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#ifdef DOUBLE_SIDED
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,U1=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#if defined( USE_PACKED_NORMALMAP )
		mapN = vec3( mapN.xy, sqrt( saturate( 1.0 - dot( mapN.xy, mapN.xy ) ) ) );
	#endif
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,F1=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,B1=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,O1=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,k1=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,z1=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,H1=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,V1=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,G1=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,W1=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,X1=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	#ifdef USE_REVERSED_DEPTH_BUFFER
	
		return depth * ( far - near ) - far;
	#else
		return depth * ( near - far ) - near;
	#endif
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	
	#ifdef USE_REVERSED_DEPTH_BUFFER
		return ( near * far ) / ( ( near - far ) * depth - near );
	#else
		return ( near * far ) / ( ( far - near ) * depth - far );
	#endif
}`,q1=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Y1=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,K1=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Z1=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,$1=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,J1=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,j1=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		#define SUN_LIGHT_CASCADES 2
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#else
			uniform sampler2D sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#endif
		uniform mat4 sunShadowMatrix[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		uniform vec4 sunShadowCascade[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
		struct SunLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SunLightShadow sunLightShadows[ NUM_SUN_LIGHT_SHADOWS ];
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#else
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#endif
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#else
			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#endif
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#elif defined( SHADOWMAP_TYPE_BASIC )
			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#endif
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {
			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;
		}
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			shadowCoord.z += shadowBias;
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				float radius = shadowRadius * texelSize.x;
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#elif defined( SHADOWMAP_TYPE_VSM )
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;
				float mean = distribution.x;
				float variance = distribution.y * distribution.y;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					float hard_shadow = step( mean, shadowCoord.z );
				#else
					float hard_shadow = step( shadowCoord.z, mean );
				#endif
				
				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				float depth = texture2D( shadowMap, shadowCoord.xy ).r;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					shadow = step( depth, shadowCoord.z );
				#else
					shadow = step( shadowCoord.z, depth );
				#endif
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#endif
	#if NUM_SUN_LIGHT_SHADOWS > 0
		float getSunShadow(
			#if defined( SHADOWMAP_TYPE_PCF )
				sampler2DShadow shadowMap,
			#else
				sampler2D shadowMap,
			#endif
			SunLightShadow sunLightShadow,
			int shadowIndex
		) {
			vec4 shadowWorldPosition = vec4( vSunShadowWorldPosition.xyz + vSunShadowWorldNormal * sunLightShadow.shadowNormalBias, 1.0 );
			float viewDepth = vSunShadowWorldPosition.w;
			int cascadeOffset = shadowIndex * SUN_LIGHT_CASCADES;
			float shadow = 1.0;
			for ( int i = SUN_LIGHT_CASCADES - 1; i >= 0; i -- ) {
				vec4 cascade = sunShadowCascade[ cascadeOffset + i ];
				if ( viewDepth >= cascade.x && viewDepth < cascade.y ) {
					float cascadeShadow = getShadow(
						shadowMap,
						sunLightShadow.shadowMapSize,
						sunLightShadow.shadowIntensity,
						sunLightShadow.shadowBias,
						sunLightShadow.shadowRadius,
						sunShadowMatrix[ cascadeOffset + i ] * shadowWorldPosition
					);
					shadow = mix( cascadeShadow, shadow, smoothstep( cascade.z, cascade.y, viewDepth ) );
				}
			}
			return shadow;
		}
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#if defined( SHADOWMAP_TYPE_PCF )
	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			#ifdef USE_REVERSED_DEPTH_BUFFER
				float dp = ( shadowCameraNear * ( shadowCameraFar - viewSpaceZ ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp -= shadowBias;
			#else
				float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp += shadowBias;
			#endif
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
			vec2 sample0 = vogelDiskSample( 0, 5, phi );
			vec2 sample1 = vogelDiskSample( 1, 5, phi );
			vec2 sample2 = vogelDiskSample( 2, 5, phi );
			vec2 sample3 = vogelDiskSample( 3, 5, phi );
			vec2 sample4 = vogelDiskSample( 4, 5, phi );
			shadow = (
				texture( shadowMap, vec4( bd3D + ( tangent * sample0.x + bitangent * sample0.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample1.x + bitangent * sample1.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample2.x + bitangent * sample2.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample3.x + bitangent * sample3.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample4.x + bitangent * sample4.y ) * texelSize, dp ) )
			) * 0.2;
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#elif defined( SHADOWMAP_TYPE_BASIC )
	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			float depth = textureCube( shadowMap, bd3D ).r;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				depth = 1.0 - depth;
			#endif
			shadow = step( dp, depth );
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#endif
	#endif
#endif`,Q1=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,e_=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_SUN_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	#ifdef HAS_NORMAL
		vec3 shadowWorldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
	#else
		vec3 shadowWorldNormal = vec3( 0.0 );
	#endif
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_SUN_LIGHT_SHADOWS > 0
		vSunShadowWorldPosition = vec4( worldPosition.xyz, - mvPosition.z );
		vSunShadowWorldNormal = shadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,t_=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHT_SHADOWS; i ++ ) {
		sunLight = sunLightShadows[ i ];
		shadow *= receiveShadow ? getSunShadow( sunShadowMap[ i ], sunLight, UNROLLED_LOOP_INDEX ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,n_=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,i_=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,s_=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,r_=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,o_=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,a_=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,l_=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,c_=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,h_=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,u_=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,d_=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,f_=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,p_=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,m_=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,g_=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,__=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,x_=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,v_=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vWorldDirection );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,y_=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,b_=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,M_=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,S_=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,T_=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,E_=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`,w_=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,A_=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,R_=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,C_=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,P_=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,I_=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,L_=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,D_=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,N_=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,U_=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,F_=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,B_=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,O_=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,k_=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,z_=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,H_=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_RETROREFLECTION
	uniform float retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
 
		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;
 
 	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,V_=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,G_=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,W_=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,X_=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,q_=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Y_=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,K_=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Z_=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,qe={alphahash_fragment:gg,alphahash_pars_fragment:_g,alphamap_fragment:xg,alphamap_pars_fragment:vg,alphatest_fragment:yg,alphatest_pars_fragment:bg,aomap_fragment:Mg,aomap_pars_fragment:Sg,batching_pars_vertex:Tg,batching_vertex:Eg,begin_vertex:wg,beginnormal_vertex:Ag,bsdfs:Rg,iridescence_fragment:Cg,bumpmap_pars_fragment:Pg,clipping_planes_fragment:Ig,clipping_planes_pars_fragment:Lg,clipping_planes_pars_vertex:Dg,clipping_planes_vertex:Ng,color_fragment:Ug,color_pars_fragment:Fg,color_pars_vertex:Bg,color_vertex:Og,common:kg,cube_uv_reflection_fragment:zg,defaultnormal_vertex:Hg,displacementmap_pars_vertex:Vg,displacementmap_vertex:Gg,emissivemap_fragment:Wg,emissivemap_pars_fragment:Xg,colorspace_fragment:qg,colorspace_pars_fragment:Yg,envmap_fragment:Kg,envmap_common_pars_fragment:Zg,envmap_pars_fragment:$g,envmap_pars_vertex:Jg,envmap_physical_pars_fragment:l1,envmap_vertex:jg,fog_vertex:Qg,fog_pars_vertex:e1,fog_fragment:t1,fog_pars_fragment:n1,gradientmap_pars_fragment:i1,lightmap_pars_fragment:s1,lights_lambert_fragment:r1,lights_lambert_pars_fragment:o1,lights_pars_begin:a1,lights_toon_fragment:c1,lights_toon_pars_fragment:h1,lights_phong_fragment:u1,lights_phong_pars_fragment:d1,lights_physical_fragment:f1,lights_physical_pars_fragment:p1,lights_fragment_begin:m1,lights_fragment_maps:g1,lights_fragment_end:_1,lightprobes_pars_fragment:x1,logdepthbuf_fragment:v1,logdepthbuf_pars_fragment:y1,logdepthbuf_pars_vertex:b1,logdepthbuf_vertex:M1,map_fragment:S1,map_pars_fragment:T1,map_particle_fragment:E1,map_particle_pars_fragment:w1,metalnessmap_fragment:A1,metalnessmap_pars_fragment:R1,morphinstance_vertex:C1,morphcolor_vertex:P1,morphnormal_vertex:I1,morphtarget_pars_vertex:L1,morphtarget_vertex:D1,normal_fragment_begin:N1,normal_fragment_maps:U1,normal_pars_fragment:F1,normal_pars_vertex:B1,normal_vertex:O1,normalmap_pars_fragment:k1,clearcoat_normal_fragment_begin:z1,clearcoat_normal_fragment_maps:H1,clearcoat_pars_fragment:V1,iridescence_pars_fragment:G1,opaque_fragment:W1,packing:X1,premultiplied_alpha_fragment:q1,project_vertex:Y1,dithering_fragment:K1,dithering_pars_fragment:Z1,roughnessmap_fragment:$1,roughnessmap_pars_fragment:J1,shadowmap_pars_fragment:j1,shadowmap_pars_vertex:Q1,shadowmap_vertex:e_,shadowmask_pars_fragment:t_,skinbase_vertex:n_,skinning_pars_vertex:i_,skinning_vertex:s_,skinnormal_vertex:r_,specularmap_fragment:o_,specularmap_pars_fragment:a_,tonemapping_fragment:l_,tonemapping_pars_fragment:c_,transmission_fragment:h_,transmission_pars_fragment:u_,uv_pars_fragment:d_,uv_pars_vertex:f_,uv_vertex:p_,worldpos_vertex:m_,background_vert:g_,background_frag:__,backgroundCube_vert:x_,backgroundCube_frag:v_,cube_vert:y_,cube_frag:b_,depth_vert:M_,depth_frag:S_,distance_vert:T_,distance_frag:E_,equirect_vert:w_,equirect_frag:A_,linedashed_vert:R_,linedashed_frag:C_,meshbasic_vert:P_,meshbasic_frag:I_,meshlambert_vert:L_,meshlambert_frag:D_,meshmatcap_vert:N_,meshmatcap_frag:U_,meshnormal_vert:F_,meshnormal_frag:B_,meshphong_vert:O_,meshphong_frag:k_,meshphysical_vert:z_,meshphysical_frag:H_,meshtoon_vert:V_,meshtoon_frag:G_,points_vert:W_,points_frag:X_,shadow_vert:q_,shadow_frag:Y_,sprite_vert:K_,sprite_frag:Z_},ge={common:{diffuse:{value:new de(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new He},alphaMap:{value:null},alphaMapTransform:{value:new He},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new He}},envmap:{envMap:{value:null},envMapRotation:{value:new He},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new He}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new He}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new He},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new He},normalScale:{value:new Te(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new He},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new He}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new He}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new He}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new de(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},sunLights:{value:[],properties:{direction:{},color:{}}},sunLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},sunShadowMatrix:{value:[]},sunShadowCascade:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new D},probesMax:{value:new D},probesResolution:{value:new D}},points:{diffuse:{value:new de(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new He},alphaTest:{value:0},uvTransform:{value:new He}},sprite:{diffuse:{value:new de(16777215)},opacity:{value:1},center:{value:new Te(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new He},alphaMap:{value:null},alphaMapTransform:{value:new He},alphaTest:{value:0}}},si={basic:{uniforms:an([ge.common,ge.specularmap,ge.envmap,ge.aomap,ge.lightmap,ge.fog]),vertexShader:qe.meshbasic_vert,fragmentShader:qe.meshbasic_frag},lambert:{uniforms:an([ge.common,ge.specularmap,ge.envmap,ge.aomap,ge.lightmap,ge.emissivemap,ge.bumpmap,ge.normalmap,ge.displacementmap,ge.fog,ge.lights,{emissive:{value:new de(0)},envMapIntensity:{value:1}}]),vertexShader:qe.meshlambert_vert,fragmentShader:qe.meshlambert_frag},phong:{uniforms:an([ge.common,ge.specularmap,ge.envmap,ge.aomap,ge.lightmap,ge.emissivemap,ge.bumpmap,ge.normalmap,ge.displacementmap,ge.fog,ge.lights,{emissive:{value:new de(0)},specular:{value:new de(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:qe.meshphong_vert,fragmentShader:qe.meshphong_frag},standard:{uniforms:an([ge.common,ge.envmap,ge.aomap,ge.lightmap,ge.emissivemap,ge.bumpmap,ge.normalmap,ge.displacementmap,ge.roughnessmap,ge.metalnessmap,ge.fog,ge.lights,{emissive:{value:new de(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:qe.meshphysical_vert,fragmentShader:qe.meshphysical_frag},toon:{uniforms:an([ge.common,ge.aomap,ge.lightmap,ge.emissivemap,ge.bumpmap,ge.normalmap,ge.displacementmap,ge.gradientmap,ge.fog,ge.lights,{emissive:{value:new de(0)}}]),vertexShader:qe.meshtoon_vert,fragmentShader:qe.meshtoon_frag},matcap:{uniforms:an([ge.common,ge.bumpmap,ge.normalmap,ge.displacementmap,ge.fog,{matcap:{value:null}}]),vertexShader:qe.meshmatcap_vert,fragmentShader:qe.meshmatcap_frag},points:{uniforms:an([ge.points,ge.fog]),vertexShader:qe.points_vert,fragmentShader:qe.points_frag},dashed:{uniforms:an([ge.common,ge.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:qe.linedashed_vert,fragmentShader:qe.linedashed_frag},depth:{uniforms:an([ge.common,ge.displacementmap]),vertexShader:qe.depth_vert,fragmentShader:qe.depth_frag},normal:{uniforms:an([ge.common,ge.bumpmap,ge.normalmap,ge.displacementmap,{opacity:{value:1}}]),vertexShader:qe.meshnormal_vert,fragmentShader:qe.meshnormal_frag},sprite:{uniforms:an([ge.sprite,ge.fog]),vertexShader:qe.sprite_vert,fragmentShader:qe.sprite_frag},background:{uniforms:{uvTransform:{value:new He},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:qe.background_vert,fragmentShader:qe.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new He}},vertexShader:qe.backgroundCube_vert,fragmentShader:qe.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:qe.cube_vert,fragmentShader:qe.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:qe.equirect_vert,fragmentShader:qe.equirect_frag},distance:{uniforms:an([ge.common,ge.displacementmap,{referencePosition:{value:new D},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:qe.distance_vert,fragmentShader:qe.distance_frag},shadow:{uniforms:an([ge.lights,ge.fog,{color:{value:new de(0)},opacity:{value:1}}]),vertexShader:qe.shadow_vert,fragmentShader:qe.shadow_frag}};si.physical={uniforms:an([si.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new He},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new He},clearcoatNormalScale:{value:new Te(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new He},dispersion:{value:0},retroreflectivity:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new He},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new He},sheen:{value:0},sheenColor:{value:new de(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new He},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new He},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new He},transmissionSamplerSize:{value:new Te},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new He},attenuationDistance:{value:0},attenuationColor:{value:new de(0)},specularColor:{value:new de(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new He},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new He},anisotropyVector:{value:new Te},anisotropyMap:{value:null},anisotropyMapTransform:{value:new He}}]),vertexShader:qe.meshphysical_vert,fragmentShader:qe.meshphysical_frag};var Gl={r:0,b:0,g:0},$_=new Ge,Qf=new He;Qf.set(-1,0,0,0,1,0,0,0,1);function J_(s,e,t,n,i,r){let o=new de(0),a=i===!0?0:1,l,c,h=null,u=0,d=null;function f(b){let T=b.isScene===!0?b.background:null;if(T&&T.isTexture){let x=b.backgroundBlurriness>0;T=e.get(T,x)}return T}function g(b){let T=!1,x=f(b);x===null?m(o,a):x&&x.isColor&&(m(x,1),T=!0);let S=s.xr.getEnvironmentBlendMode();S==="additive"?t.buffers.color.setClear(0,0,0,1,r):S==="alpha-blend"&&t.buffers.color.setClear(0,0,0,0,r),(s.autoClear||T)&&(t.buffers.depth.setTest(!0),t.buffers.depth.setMask(!0),t.buffers.color.setMask(!0),s.clear(s.autoClearColor,s.autoClearDepth,s.autoClearStencil))}function _(b,T){let x=f(T);x&&(x.isCubeTexture||x.mapping===Mo)?(c===void 0&&(c=new Be(new rn(1,1,1),new ft({name:"BackgroundCubeMaterial",uniforms:Ss(si.backgroundCube.uniforms),vertexShader:si.backgroundCube.vertexShader,fragmentShader:si.backgroundCube.fragmentShader,side:Ft,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),c.geometry.deleteAttribute("uv"),c.onBeforeRender=function(S,M,A){this.matrixWorld.copyPosition(A.matrixWorld)},Object.defineProperty(c.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),n.update(c)),c.material.uniforms.envMap.value=x,c.material.uniforms.backgroundBlurriness.value=T.backgroundBlurriness,c.material.uniforms.backgroundIntensity.value=T.backgroundIntensity,c.material.uniforms.backgroundRotation.value.setFromMatrix4($_.makeRotationFromEuler(T.backgroundRotation)).transpose(),x.isCubeTexture&&x.isRenderTargetTexture===!1&&c.material.uniforms.backgroundRotation.value.premultiply(Qf),c.material.toneMapped=Ke.getTransfer(x.colorSpace)!==ct,(h!==x||u!==x.version||d!==s.toneMapping)&&(c.material.needsUpdate=!0,h=x,u=x.version,d=s.toneMapping),c.layers.enableAll(),b.unshift(c,c.geometry,c.material,0,0,null)):x&&x.isTexture&&(l===void 0&&(l=new Be(new Qt(2,2),new ft({name:"BackgroundMaterial",uniforms:Ss(si.background.uniforms),vertexShader:si.background.vertexShader,fragmentShader:si.background.fragmentShader,side:ti,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),n.update(l)),l.material.uniforms.t2D.value=x,l.material.uniforms.backgroundIntensity.value=T.backgroundIntensity,l.material.toneMapped=Ke.getTransfer(x.colorSpace)!==ct,x.matrixAutoUpdate===!0&&x.updateMatrix(),l.material.uniforms.uvTransform.value.copy(x.matrix),(h!==x||u!==x.version||d!==s.toneMapping)&&(l.material.needsUpdate=!0,h=x,u=x.version,d=s.toneMapping),l.layers.enableAll(),b.unshift(l,l.geometry,l.material,0,0,null))}function m(b,T){b.getRGB(Gl,Uh(s)),t.buffers.color.setClear(Gl.r,Gl.g,Gl.b,T,r)}function p(){c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return o},setClearColor:function(b,T=1){o.set(b),a=T,m(o,a)},getClearAlpha:function(){return a},setClearAlpha:function(b){a=b,m(o,a)},render:g,addToRenderList:_,dispose:p}}function j_(s,e){let t=s.getParameter(s.MAX_VERTEX_ATTRIBS),n={},i=d(null),r=i,o=!1;function a(L,P,N,I,H){let V=!1,q=u(L,I,N,P);r!==q&&(r=q,c(r.object)),V=f(L,I,N,H),V&&g(L,I,N,H),H!==null&&e.update(H,s.ELEMENT_ARRAY_BUFFER),(V||o)&&(o=!1,x(L,P,N,I),H!==null&&s.bindBuffer(s.ELEMENT_ARRAY_BUFFER,e.get(H).buffer))}function l(){return s.createVertexArray()}function c(L){return s.bindVertexArray(L)}function h(L){return s.deleteVertexArray(L)}function u(L,P,N,I){let H=I.wireframe===!0,V=n[P.id];V===void 0&&(V={},n[P.id]=V);let q=L.isInstancedMesh===!0?L.id:0,ee=V[q];ee===void 0&&(ee={},V[q]=ee);let k=ee[N.id];k===void 0&&(k={},ee[N.id]=k);let te=k[H];return te===void 0&&(te=d(l()),k[H]=te),te}function d(L){let P=[],N=[],I=[];for(let H=0;H<t;H++)P[H]=0,N[H]=0,I[H]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:P,enabledAttributes:N,attributeDivisors:I,object:L,attributes:{},index:null}}function f(L,P,N,I){let H=r.attributes,V=P.attributes,q=0,ee=N.getAttributes();for(let k in ee)if(ee[k].location>=0){let re=H[k],Ee=V[k];if(Ee===void 0&&(k==="instanceMatrix"&&L.instanceMatrix&&(Ee=L.instanceMatrix),k==="instanceColor"&&L.instanceColor&&(Ee=L.instanceColor)),re===void 0||re.attribute!==Ee||Ee&&re.data!==Ee.data)return!0;q++}return r.attributesNum!==q||r.index!==I}function g(L,P,N,I){let H={},V=P.attributes,q=0,ee=N.getAttributes();for(let k in ee)if(ee[k].location>=0){let re=V[k];re===void 0&&(k==="instanceMatrix"&&L.instanceMatrix&&(re=L.instanceMatrix),k==="instanceColor"&&L.instanceColor&&(re=L.instanceColor));let Ee={};Ee.attribute=re,re&&re.data&&(Ee.data=re.data),H[k]=Ee,q++}r.attributes=H,r.attributesNum=q,r.index=I}function _(){let L=r.newAttributes;for(let P=0,N=L.length;P<N;P++)L[P]=0}function m(L){p(L,0)}function p(L,P){let N=r.newAttributes,I=r.enabledAttributes,H=r.attributeDivisors;N[L]=1,I[L]===0&&(s.enableVertexAttribArray(L),I[L]=1),H[L]!==P&&(s.vertexAttribDivisor(L,P),H[L]=P)}function b(){let L=r.newAttributes,P=r.enabledAttributes;for(let N=0,I=P.length;N<I;N++)P[N]!==L[N]&&(s.disableVertexAttribArray(N),P[N]=0)}function T(L,P,N,I,H,V,q){q===!0?s.vertexAttribIPointer(L,P,N,H,V):s.vertexAttribPointer(L,P,N,I,H,V)}function x(L,P,N,I){_();let H=I.attributes,V=N.getAttributes(),q=P.defaultAttributeValues;for(let ee in V){let k=V[ee];if(k.location>=0){let te=H[ee];if(te===void 0&&(ee==="instanceMatrix"&&L.instanceMatrix&&(te=L.instanceMatrix),ee==="instanceColor"&&L.instanceColor&&(te=L.instanceColor)),te!==void 0){let re=te.normalized,Ee=te.itemSize,Re=e.get(te);if(Re===void 0)continue;let ht=Re.buffer,et=Re.type,tt=Re.bytesPerElement,Z=et===s.INT||et===s.UNSIGNED_INT||te.gpuType===sl;if(te.isInterleavedBufferAttribute){let Q=te.data,ye=Q.stride,Oe=te.offset;if(Q.isInstancedInterleavedBuffer){for(let ve=0;ve<k.locationSize;ve++)p(k.location+ve,Q.meshPerAttribute);L.isInstancedMesh!==!0&&I._maxInstanceCount===void 0&&(I._maxInstanceCount=Q.meshPerAttribute*Q.count)}else for(let ve=0;ve<k.locationSize;ve++)m(k.location+ve);s.bindBuffer(s.ARRAY_BUFFER,ht);for(let ve=0;ve<k.locationSize;ve++)T(k.location+ve,Ee/k.locationSize,et,re,ye*tt,(Oe+Ee/k.locationSize*ve)*tt,Z)}else{if(te.isInstancedBufferAttribute){for(let Q=0;Q<k.locationSize;Q++)p(k.location+Q,te.meshPerAttribute);L.isInstancedMesh!==!0&&I._maxInstanceCount===void 0&&(I._maxInstanceCount=te.meshPerAttribute*te.count)}else for(let Q=0;Q<k.locationSize;Q++)m(k.location+Q);s.bindBuffer(s.ARRAY_BUFFER,ht);for(let Q=0;Q<k.locationSize;Q++)T(k.location+Q,Ee/k.locationSize,et,re,Ee*tt,Ee/k.locationSize*Q*tt,Z)}}else if(q!==void 0){let re=q[ee];if(re!==void 0)switch(re.length){case 2:s.vertexAttrib2fv(k.location,re);break;case 3:s.vertexAttrib3fv(k.location,re);break;case 4:s.vertexAttrib4fv(k.location,re);break;default:s.vertexAttrib1fv(k.location,re)}}}}b()}function S(){w();for(let L in n){let P=n[L];for(let N in P){let I=P[N];for(let H in I){let V=I[H];for(let q in V)h(V[q].object),delete V[q];delete I[H]}}delete n[L]}}function M(L){if(n[L.id]===void 0)return;let P=n[L.id];for(let N in P){let I=P[N];for(let H in I){let V=I[H];for(let q in V)h(V[q].object),delete V[q];delete I[H]}}delete n[L.id]}function A(L){for(let P in n){let N=n[P];for(let I in N){let H=N[I];if(H[L.id]===void 0)continue;let V=H[L.id];for(let q in V)h(V[q].object),delete V[q];delete H[L.id]}}}function v(L){for(let P in n){let N=n[P],I=L.isInstancedMesh===!0?L.id:0,H=N[I];if(H!==void 0){for(let V in H){let q=H[V];for(let ee in q)h(q[ee].object),delete q[ee];delete H[V]}delete N[I],Object.keys(N).length===0&&delete n[P]}}}function w(){R(),o=!0,r!==i&&(r=i,c(r.object))}function R(){i.geometry=null,i.program=null,i.wireframe=!1}return{setup:a,reset:w,resetDefaultState:R,dispose:S,releaseStatesOfGeometry:M,releaseStatesOfObject:v,releaseStatesOfProgram:A,initAttributes:_,enableAttribute:m,disableUnusedAttributes:b}}function Q_(s,e,t){let n;function i(l){n=l}function r(l,c){s.drawArrays(n,l,c),t.update(c,n,1)}function o(l,c,h){h!==0&&(s.drawArraysInstanced(n,l,c,h),t.update(c,n,h))}function a(l,c,h){if(h===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,l,0,c,0,h);let d=0;for(let f=0;f<h;f++)d+=c[f];t.update(d,n,1)}this.setMode=i,this.render=r,this.renderInstances=o,this.renderMultiDraw=a}function ex(s,e,t,n){let i;function r(){if(i!==void 0)return i;if(e.has("EXT_texture_filter_anisotropic")===!0){let A=e.get("EXT_texture_filter_anisotropic");i=s.getParameter(A.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else i=0;return i}function o(A){return!(A!==Sn&&n.convert(A)!==s.getParameter(s.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(A){let v=A===Vt&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(A!==on&&A!==Mn&&!v&&n.convert(A)!==s.getParameter(s.IMPLEMENTATION_COLOR_READ_TYPE))}function l(A){if(A==="highp"){if(s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.HIGH_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.HIGH_FLOAT).precision>0)return"highp";A="mediump"}return A==="mediump"&&s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.MEDIUM_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=t.precision!==void 0?t.precision:"highp",h=l(c);h!==c&&(De("WebGLRenderer:",c,"not supported, using",h,"instead."),c=h);let u=t.logarithmicDepthBuffer===!0,d=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control");t.reversedDepthBuffer===!0&&d===!1&&De("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.");let f=s.getParameter(s.MAX_TEXTURE_IMAGE_UNITS),g=s.getParameter(s.MAX_VERTEX_TEXTURE_IMAGE_UNITS),_=s.getParameter(s.MAX_TEXTURE_SIZE),m=s.getParameter(s.MAX_CUBE_MAP_TEXTURE_SIZE),p=s.getParameter(s.MAX_VERTEX_ATTRIBS),b=s.getParameter(s.MAX_VERTEX_UNIFORM_VECTORS),T=s.getParameter(s.MAX_VARYING_VECTORS),x=s.getParameter(s.MAX_FRAGMENT_UNIFORM_VECTORS),S=s.getParameter(s.MAX_SAMPLES),M=s.getParameter(s.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:o,textureTypeReadable:a,precision:c,logarithmicDepthBuffer:u,reversedDepthBuffer:d,maxTextures:f,maxVertexTextures:g,maxTextureSize:_,maxCubemapSize:m,maxAttributes:p,maxVertexUniforms:b,maxVaryings:T,maxFragmentUniforms:x,maxSamples:S,samples:M}}function tx(s){let e=this,t=null,n=0,i=!1,r=!1,o=new Fn,a=new He,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(u,d){let f=u.length!==0||d||n!==0||i;return i=d,n=u.length,f},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(u,d){t=h(u,d,0)},this.setState=function(u,d,f){let g=u.clippingPlanes,_=u.clipIntersection,m=u.clipShadows,p=s.get(u);if(!i||g===null||g.length===0||r&&!m)r?h(null):c();else{let b=r?0:n,T=b*4,x=p.clippingState||null;l.value=x,x=h(g,d,T,f);for(let S=0;S!==T;++S)x[S]=t[S];p.clippingState=x,this.numIntersection=_?this.numPlanes:0,this.numPlanes+=b}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function h(u,d,f,g){let _=u!==null?u.length:0,m=null;if(_!==0){if(m=l.value,g!==!0||m===null){let p=f+_*4,b=d.matrixWorldInverse;a.getNormalMatrix(b),(m===null||m.length<p)&&(m=new Float32Array(p));for(let T=0,x=f;T!==_;++T,x+=4)o.copy(u[T]).applyMatrix4(b,a),o.normal.toArray(m,x),m[x+3]=o.constant}l.value=m,l.needsUpdate=!0}return e.numPlanes=_,e.numIntersection=0,m}}var Mr=4,nx=6,ix=20,sx=256,Io=new Rn,If=new de,Wh=null,Xh=0,qh=0,Yh=!1,rx=new D,Es=new D,Xl=class{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(e,t=0,n=.1,i=100,r={}){let{size:o=256,position:a=rx}=r;Wh=this._renderer.getRenderTarget(),Xh=this._renderer.getActiveCubeFace(),qh=this._renderer.getActiveMipmapLevel(),Yh=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(o);let l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(e,n,i,l,a),t>0&&this._blur(l,0,0,t),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Nf(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Df(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodMeshes.length;e++)this._lodMeshes[e].geometry.dispose()}_cleanup(e){this._renderer.setRenderTarget(Wh,Xh,qh),this._renderer.xr.enabled=Yh,e.scissorTest=!1,br(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===Gi||e.mapping===bs?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),Wh=this._renderer.getRenderTarget(),Xh=this._renderer.getActiveCubeFace(),qh=this._renderer.getActiveMipmapLevel(),Yh=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){let e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:Ut,minFilter:Ut,generateMipmaps:!1,type:Vt,format:Sn,colorSpace:un,depthBuffer:!1},i=Lf(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Lf(e,t,n);let{_lodMax:r}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods}=ox(r)),this._blurMaterial=lx(r,e,t),this._ggxMaterial=ax(r,e,t)}return i}_compileMaterial(e){let t=new Be(new yt,e);this._renderer.compile(t,Io)}_sceneToCubeUV(e,t,n,i,r){let l=new zt(90,1,t,n),c=[1,-1,1,1,1,1],h=[1,1,1,-1,-1,-1],u=this._renderer,d=u.autoClear,f=u.toneMapping;u.getClearColor(If),u.toneMapping=Vn,u.autoClear=!1,u.state.buffers.depth.getReversed()&&(u.setRenderTarget(i),u.clearDepth(),u.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new Be(new rn,new st({name:"PMREM.Background",side:Ft,depthWrite:!1,depthTest:!1})));let _=this._backgroundBox,m=_.material,p=!1,b=e.background;b?b.isColor&&(m.color.copy(b),e.background=null,p=!0):(m.color.copy(If),p=!0);for(let T=0;T<6;T++){let x=T%3;x===0?(l.up.set(0,c[T],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x+h[T],r.y,r.z)):x===1?(l.up.set(0,0,c[T]),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y+h[T],r.z)):(l.up.set(0,c[T],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y,r.z+h[T]));let S=this._cubeSize;br(i,x*S,T>2?S:0,S,S),u.setRenderTarget(i),p&&u.render(_,l),u.render(e,l)}u.toneMapping=f,u.autoClear=d,e.background=b}_textureToCubeUV(e,t){let n=this._renderer,i=e.mapping===Gi||e.mapping===bs;i?(this._cubemapMaterial===null&&(this._cubemapMaterial=Nf()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Df());let r=i?this._cubemapMaterial:this._equirectMaterial,o=this._lodMeshes[0];o.material=r;let a=r.uniforms;a.envMap.value=e;let l=this._cubeSize;br(t,0,0,3*l,2*l),n.setRenderTarget(t),n.render(o,Io)}_applyPMREM(e){let t=this._renderer,n=t.autoClear;t.autoClear=!1;let i=this._lodMeshes.length;for(let r=1;r<i;r++)this._applyGGXFilter(e,r-1,r);t.autoClear=n}_applyGGXFilter(e,t,n){let i=this._renderer,r=this._pingPongRenderTarget,o=this._ggxMaterial,a=this._lodMeshes[n];a.material=o;let l=o.uniforms,c=n/(this._lodMeshes.length-1),h=t/(this._lodMeshes.length-1),u=Math.sqrt(c*c-h*h),d=c*1.25,f=u*d,{_lodMax:g}=this,_=this._sizeLods[n],m=3*_*(n>g-Mr?n-g+Mr:0),p=4*(this._cubeSize-_);l.envMap.value=e.texture,l.roughness.value=f,l.mipInt.value=g-t,br(r,m,p,3*_,2*_),i.setRenderTarget(r),i.render(a,Io),l.envMap.value=r.texture,l.roughness.value=0,l.mipInt.value=g-n,br(e,m,p,3*_,2*_),i.setRenderTarget(e),i.render(a,Io)}_blur(e,t,n,i){let r=this._pingPongRenderTarget,o=Math.min(i,Math.PI)/Math.SQRT2;this._blurPass(e,r,t,n,o),this._blurPass(r,e,n,n,o)}_blurPass(e,t,n,i,r){let o=this._renderer,a=this._blurMaterial,l=this._lodMeshes[i];l.material=a;let c=a.uniforms;c.envMap.value=e.texture,c.sigma.value=r,c.mipInt.value=this._lodMax-n;let h=this._sizeLods[i],u=3*h*(i>this._lodMax-Mr?i-this._lodMax+Mr:0),d=4*(this._cubeSize-h);br(t,u,d,3*h,2*h),o.setRenderTarget(t),o.render(l,Io)}};function ox(s){let e=[],t=[],n=s,i=s-Mr+1+nx;for(let r=0;r<i;r++){let o=Math.pow(2,n);e.push(o);let a=1/(o-2),l=-a,c=1+a,h=[l,l,c,l,c,c,l,l,c,c,l,c],u=6,d=6,f=3,g=new Float32Array(f*d*u),_=new Float32Array(f*d*u);for(let p=0;p<u;p++){let b=p%3*2/3-1,T=p>2?0:-1,x=[b,T,0,b+2/3,T,0,b+2/3,T+1,0,b,T,0,b+2/3,T+1,0,b,T+1,0];g.set(x,f*d*p);for(let S=0;S<d;S++){let M=h[S*2]*2-1,A=h[S*2+1]*2-1;p===0?Es.set(1,A,M):p===1?Es.set(-M,1,-A):p===2?Es.set(-M,A,1):p===3?Es.set(-1,A,-M):p===4?Es.set(-M,-1,A):Es.set(M,A,-1),Es.toArray(_,(p*d+S)*f)}}let m=new yt;m.setAttribute("position",new Rt(g,f)),m.setAttribute("outputDirection",new Rt(_,f)),t.push(new Be(m,null)),n>Mr&&n--}return{lodMeshes:t,sizeLods:e}}function Lf(s,e,t){let n=new Dt(s,e,t);return n.texture.mapping=Mo,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function br(s,e,t,n,i){s.viewport.set(e,t,n,i),s.scissor.set(e,t,n,i)}function ax(s,e,t){return new ft({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:sx,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${s}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:Kl(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float roughness;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359

			// Van der Corput radical inverse
			float radicalInverse_VdC(uint bits) {
				bits = (bits << 16u) | (bits >> 16u);
				bits = ((bits & 0x55555555u) << 1u) | ((bits & 0xAAAAAAAAu) >> 1u);
				bits = ((bits & 0x33333333u) << 2u) | ((bits & 0xCCCCCCCCu) >> 2u);
				bits = ((bits & 0x0F0F0F0Fu) << 4u) | ((bits & 0xF0F0F0F0u) >> 4u);
				bits = ((bits & 0x00FF00FFu) << 8u) | ((bits & 0xFF00FF00u) >> 8u);
				return float(bits) * 2.3283064365386963e-10; // / 0x100000000
			}

			// Hammersley sequence
			vec2 hammersley(uint i, uint N) {
				return vec2(float(i) / float(N), radicalInverse_VdC(i));
			}

			// GGX VNDF importance sampling (Eric Heitz 2018)
			// "Sampling the GGX Distribution of Visible Normals"
			// https://jcgt.org/published/0007/04/01/
			vec3 importanceSampleGGX_VNDF(vec2 Xi, vec3 V, float roughness) {
				float alpha = roughness * roughness;

				// Section 4.1: Orthonormal basis
				vec3 T1 = vec3(1.0, 0.0, 0.0);
				vec3 T2 = cross(V, T1);

				// Section 4.2: Parameterization of projected area
				float r = sqrt(Xi.x);
				float phi = 2.0 * PI * Xi.y;
				float t1 = r * cos(phi);
				float t2 = r * sin(phi);
				float s = 0.5 * (1.0 + V.z);
				t2 = (1.0 - s) * sqrt(1.0 - t1 * t1) + s * t2;

				// Section 4.3: Reprojection onto hemisphere
				vec3 Nh = t1 * T1 + t2 * T2 + sqrt(max(0.0, 1.0 - t1 * t1 - t2 * t2)) * V;

				// Section 3.4: Transform back to ellipsoid configuration
				return normalize(vec3(alpha * Nh.x, alpha * Nh.y, max(0.0, Nh.z)));
			}

			void main() {
				vec3 N = normalize(vOutputDirection);
				vec3 V = N; // Assume view direction equals normal for pre-filtering

				vec3 prefilteredColor = vec3(0.0);
				float totalWeight = 0.0;

				// For very low roughness, just sample the environment directly
				if (roughness < 0.001) {
					gl_FragColor = vec4(bilinearCubeUV(envMap, N, mipInt), 1.0);
					return;
				}

				// Tangent space basis for VNDF sampling
				vec3 up = abs(N.z) < 0.999 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0);
				vec3 tangent = normalize(cross(up, N));
				vec3 bitangent = cross(N, tangent);

				for(uint i = 0u; i < uint(GGX_SAMPLES); i++) {
					vec2 Xi = hammersley(i, uint(GGX_SAMPLES));

					// For PMREM, V = N, so in tangent space V is always (0, 0, 1)
					vec3 H_tangent = importanceSampleGGX_VNDF(Xi, vec3(0.0, 0.0, 1.0), roughness);

					// Transform H back to world space
					vec3 H = normalize(tangent * H_tangent.x + bitangent * H_tangent.y + N * H_tangent.z);
					vec3 L = normalize(2.0 * dot(V, H) * H - V);

					float NdotL = max(dot(N, L), 0.0);

					if(NdotL > 0.0) {
						// Sample environment at fixed mip level
						// VNDF importance sampling handles the distribution filtering
						vec3 sampleColor = bilinearCubeUV(envMap, L, mipInt);

						// Weight by NdotL for the split-sum approximation
						// VNDF PDF naturally accounts for the visible microfacet distribution
						prefilteredColor += sampleColor * NdotL;
						totalWeight += NdotL;
					}
				}

				if (totalWeight > 0.0) {
					prefilteredColor = prefilteredColor / totalWeight;
				}

				gl_FragColor = vec4(prefilteredColor, 1.0);
			}
		`,blending:Cn,depthTest:!1,depthWrite:!1})}function lx(s,e,t){return new ft({name:"SphericalGaussianBlur",defines:{SAMPLES:ix,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${s}.0`},uniforms:{envMap:{value:null},sigma:{value:0},mipInt:{value:0}},vertexShader:Kl(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float sigma;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359
			#define GOLDEN_ANGLE 2.39996322973

			void main() {

				if ( sigma == 0.0 ) {

					gl_FragColor = vec4( bilinearCubeUV( envMap, vOutputDirection, mipInt ), 1.0 );
					return;

				}

				vec3 outputDirection = normalize( vOutputDirection );

				vec3 up = abs( outputDirection.z ) < 0.999 ? vec3( 0.0, 0.0, 1.0 ) : vec3( 1.0, 0.0, 0.0 );
				vec3 tangent = normalize( cross( up, outputDirection ) );
				vec3 bitangent = cross( outputDirection, tangent );

				// Truncate the kernel at three standard deviations or at the antipode.
				float thetaMax = min( 3.0 * sigma, PI );
				float truncation = 1.0 - exp( - 0.5 * thetaMax * thetaMax / ( sigma * sigma ) );

				vec3 accumColor = vec3( 0.0 );
				float accumWeight = 0.0;

				for ( int i = 0; i < SAMPLES; i ++ ) {

					// Stratified inverse-CDF sampling of the Gaussian, placed on a golden-angle spiral.
					float stratum = ( float( i ) + 0.5 ) / float( SAMPLES );
					float theta = sigma * sqrt( - 2.0 * log( 1.0 - stratum * truncation ) );
					float phi = float( i ) * GOLDEN_ANGLE;

					vec3 offset = cos( phi ) * tangent + sin( phi ) * bitangent;
					vec3 sampleDirection = cos( theta ) * outputDirection + sin( theta ) * offset;

					// Correct the planar sample density to solid angle.
					float weight = sin( theta ) / theta;

					accumColor += weight * bilinearCubeUV( envMap, sampleDirection, mipInt );
					accumWeight += weight;

				}

				gl_FragColor = vec4( accumColor / accumWeight, 1.0 );

			}
		`,blending:Cn,depthTest:!1,depthWrite:!1})}function Df(){return new ft({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Kl(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:Cn,depthTest:!1,depthWrite:!1})}function Nf(){return new ft({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Kl(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Cn,depthTest:!1,depthWrite:!1})}function Kl(){return`

		precision mediump float;
		precision mediump int;

		attribute vec3 outputDirection;

		varying vec3 vOutputDirection;

		void main() {

			vOutputDirection = outputDirection;
			gl_Position = vec4( position, 1.0 );

		}
	`}var ql=class extends Dt{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;let n={width:e,height:e,depth:1},i=[n,n,n,n,n,n];this.texture=new oo(i),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},i=new rn(5,5,5),r=new ft({name:"CubemapFromEquirect",uniforms:Ss(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:Ft,blending:Cn});r.uniforms.tEquirect.value=t;let o=new Be(i,r),a=t.minFilter;return t.minFilter===Gn&&(t.minFilter=Ut),new Ka(1,10,this).update(e,o),t.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(e,t=!0,n=!0,i=!0){let r=e.getRenderTarget();for(let o=0;o<6;o++)e.setRenderTarget(this,o),e.clear(t,n,i);e.setRenderTarget(r)}};function cx(s){let e=new WeakMap,t=new WeakMap,n=null;function i(d,f=!1){return d==null?null:f?o(d):r(d)}function r(d){if(d&&d.isTexture){let f=d.mapping;if(f===tl||f===nl)if(e.has(d)){let g=e.get(d).texture;return a(g,d.mapping)}else{let g=d.image;if(g&&g.height>0){let _=new ql(g.height);return _.fromEquirectangularTexture(s,d),e.set(d,_),d.addEventListener("dispose",c),a(_.texture,d.mapping)}else return null}}return d}function o(d){if(d&&d.isTexture){let f=d.mapping,g=f===tl||f===nl,_=f===Gi||f===bs;if(g||_){let m=t.get(d),p=m!==void 0?m.texture.pmremVersion:0;if(d.isRenderTargetTexture&&d.pmremVersion!==p)return n===null&&(n=new Xl(s)),m=g?n.fromEquirectangular(d,m):n.fromCubemap(d,m),m.texture.pmremVersion=d.pmremVersion,t.set(d,m),m.texture;if(m!==void 0)return m.texture;{let b=d.image;return g&&b&&b.height>0||_&&b&&l(b)?(n===null&&(n=new Xl(s)),m=g?n.fromEquirectangular(d):n.fromCubemap(d),m.texture.pmremVersion=d.pmremVersion,t.set(d,m),d.addEventListener("dispose",h),m.texture):null}}}return d}function a(d,f){return f===tl?d.mapping=Gi:f===nl&&(d.mapping=bs),d}function l(d){let f=0,g=6;for(let _=0;_<g;_++)d[_]!==void 0&&f++;return f===g}function c(d){let f=d.target;f.removeEventListener("dispose",c);let g=e.get(f);g!==void 0&&(e.delete(f),g.dispose())}function h(d){let f=d.target;f.removeEventListener("dispose",h);let g=t.get(f);g!==void 0&&(t.delete(f),g.dispose())}function u(){e=new WeakMap,t=new WeakMap,n!==null&&(n.dispose(),n=null)}return{get:i,dispose:u}}function hx(s){let e={};function t(n){if(e[n]!==void 0)return e[n];let i=s.getExtension(n);return e[n]=i,i}return{has:function(n){return t(n)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(n){let i=t(n);return i===null&&rs("WebGLRenderer: "+n+" extension not supported."),i}}}function ux(s,e,t,n){let i={},r=new WeakMap;function o(u){let d=u.target;d.index!==null&&e.remove(d.index);for(let g in d.attributes)e.remove(d.attributes[g]);d.removeEventListener("dispose",o),delete i[d.id];let f=r.get(d);f&&(e.remove(f),r.delete(d)),n.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,t.memory.geometries--}function a(u,d){return i[d.id]===!0||(d.addEventListener("dispose",o),i[d.id]=!0,t.memory.geometries++),d}function l(u){let d=u.attributes;for(let f in d)e.update(d[f],s.ARRAY_BUFFER)}function c(u){let d=[],f=u.index,g=u.attributes.position,_=0;if(g===void 0)return;if(f!==null){let b=f.array;_=f.version;for(let T=0,x=b.length;T<x;T+=3){let S=b[T+0],M=b[T+1],A=b[T+2];d.push(S,M,M,A,A,S)}}else{let b=g.array;_=g.version;for(let T=0,x=b.length/3-1;T<x;T+=3){let S=T+0,M=T+1,A=T+2;d.push(S,M,M,A,A,S)}}let m=new(g.count>=65535?to:eo)(d,1);m.version=_;let p=r.get(u);p&&e.remove(p),r.set(u,m)}function h(u){let d=r.get(u);if(d){let f=u.index;f!==null&&d.version<f.version&&c(u)}else c(u);return r.get(u)}return{get:a,update:l,getWireframeAttribute:h}}function dx(s,e,t){let n;function i(u){n=u}let r,o;function a(u){r=u.type,o=u.bytesPerElement}function l(u,d){s.drawElements(n,d,r,u*o),t.update(d,n,1)}function c(u,d,f){f!==0&&(s.drawElementsInstanced(n,d,r,u*o,f),t.update(d,n,f))}function h(u,d,f){if(f===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,d,0,r,u,0,f);let _=0;for(let m=0;m<f;m++)_+=d[m];t.update(_,n,1)}this.setMode=i,this.setIndex=a,this.render=l,this.renderInstances=c,this.renderMultiDraw=h}function fx(s){let e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,o,a){switch(t.calls++,o){case s.TRIANGLES:t.triangles+=a*(r/3);break;case s.LINES:t.lines+=a*(r/2);break;case s.LINE_STRIP:t.lines+=a*(r-1);break;case s.LINE_LOOP:t.lines+=a*r;break;case s.POINTS:t.points+=a*r;break;default:ke("WebGLInfo: Unknown draw mode:",o);break}}function i(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:i,update:n}}function px(s,e,t){let n=new WeakMap,i=new dt;function r(o,a,l){let c=o.morphTargetInfluences,h=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,u=h!==void 0?h.length:0,d=n.get(a);if(d===void 0||d.count!==u){let w=function(){A.dispose(),n.delete(a),a.removeEventListener("dispose",w)};d!==void 0&&d.texture.dispose();let f=a.morphAttributes.position!==void 0,g=a.morphAttributes.normal!==void 0,_=a.morphAttributes.color!==void 0,m=a.morphAttributes.position||[],p=a.morphAttributes.normal||[],b=a.morphAttributes.color||[],T=0;f===!0&&(T=1),g===!0&&(T=2),_===!0&&(T=3);let x=a.attributes.position.count*T,S=1;x>e.maxTextureSize&&(S=Math.ceil(x/e.maxTextureSize),x=e.maxTextureSize);let M=new Float32Array(x*S*4*u),A=new Jr(M,x,S,u);A.type=Mn,A.needsUpdate=!0;let v=T*4;for(let R=0;R<u;R++){let L=m[R],P=p[R],N=b[R],I=x*S*4*R;for(let H=0;H<L.count;H++){let V=H*v;f===!0&&(i.fromBufferAttribute(L,H),M[I+V+0]=i.x,M[I+V+1]=i.y,M[I+V+2]=i.z,M[I+V+3]=0),g===!0&&(i.fromBufferAttribute(P,H),M[I+V+4]=i.x,M[I+V+5]=i.y,M[I+V+6]=i.z,M[I+V+7]=0),_===!0&&(i.fromBufferAttribute(N,H),M[I+V+8]=i.x,M[I+V+9]=i.y,M[I+V+10]=i.z,M[I+V+11]=N.itemSize===4?i.w:1)}}d={count:u,texture:A,size:new Te(x,S)},n.set(a,d),a.addEventListener("dispose",w)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)l.getUniforms().setValue(s,"morphTexture",o.morphTexture,t);else{let f=0;for(let _=0;_<c.length;_++)f+=c[_];let g=a.morphTargetsRelative?1:1-f;l.getUniforms().setValue(s,"morphTargetBaseInfluence",g),l.getUniforms().setValue(s,"morphTargetInfluences",c)}l.getUniforms().setValue(s,"morphTargetsTexture",d.texture,t),l.getUniforms().setValue(s,"morphTargetsTextureSize",d.size)}return{update:r}}function mx(s,e,t,n,i){let r=new WeakMap;function o(c){let h=i.render.frame,u=c.geometry,d=e.get(c,u);if(r.get(d)!==h&&(e.update(d),r.set(d,h)),c.isInstancedMesh&&(c.hasEventListener("dispose",l)===!1&&c.addEventListener("dispose",l),r.get(c)!==h&&(t.update(c.instanceMatrix,s.ARRAY_BUFFER),c.instanceColor!==null&&t.update(c.instanceColor,s.ARRAY_BUFFER),r.set(c,h))),c.isSkinnedMesh){let f=c.skeleton;r.get(f)!==h&&(f.update(),r.set(f,h))}return d}function a(){r=new WeakMap}function l(c){let h=c.target;h.removeEventListener("dispose",l),n.releaseStatesOfObject(h),t.remove(h.instanceMatrix),h.instanceColor!==null&&t.remove(h.instanceColor)}return{update:o,dispose:a}}var gx={[xh]:"LINEAR_TONE_MAPPING",[vh]:"REINHARD_TONE_MAPPING",[yh]:"CINEON_TONE_MAPPING",[bo]:"ACES_FILMIC_TONE_MAPPING",[Mh]:"AGX_TONE_MAPPING",[Sh]:"NEUTRAL_TONE_MAPPING",[bh]:"CUSTOM_TONE_MAPPING"};function _x(s,e,t,n,i,r){let o=new Dt(e,t,{type:s,depthBuffer:i,stencilBuffer:r,samples:n?4:0,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,resolveDepthBuffer:!1,resolveStencilBuffer:!1}),a=null,l=null,c=new yt;c.setAttribute("position",new Ze([-1,3,0,-1,-1,0,3,-1,0],3)),c.setAttribute("uv",new Ze([0,2,0,0,2,0],2));let h=new ka({uniforms:{tDiffuse:{value:null}},vertexShader:`
			precision highp float;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`,fragmentShader:`
			precision highp float;

			uniform sampler2D tDiffuse;

			varying vec2 vUv;

			#include <tonemapping_pars_fragment>
			#include <colorspace_pars_fragment>

			void main() {
				gl_FragColor = texture2D( tDiffuse, vUv );

				#ifdef LINEAR_TONE_MAPPING
					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );
				#elif defined( REINHARD_TONE_MAPPING )
					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );
				#elif defined( CINEON_TONE_MAPPING )
					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );
				#elif defined( ACES_FILMIC_TONE_MAPPING )
					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );
				#elif defined( AGX_TONE_MAPPING )
					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );
				#elif defined( NEUTRAL_TONE_MAPPING )
					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );
				#elif defined( CUSTOM_TONE_MAPPING )
					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );
				#endif

				#ifdef SRGB_TRANSFER
					gl_FragColor = sRGBTransferOETF( gl_FragColor );
				#endif
			}`,depthTest:!1,depthWrite:!1}),u=new Be(c,h),d=new Rn(-1,1,1,-1,0,1),f=null,g=null,_=!1,m,p=null,b=[],T=!1;this.setSize=function(x,S){o.setSize(x,S),a!==null&&a.setSize(x,S),l!==null&&l.setSize(x,S);for(let M=0;M<b.length;M++){let A=b[M];A.setSize&&A.setSize(x,S)}},this.setEffects=function(x){b=x,T=b.length>0&&b[0].isRenderPass===!0;let S=o.width,M=o.height;b.length>0&&a===null&&(a=new Dt(S,M,{type:Vt,depthBuffer:!1,stencilBuffer:!1}),l=new Dt(S,M,{type:Vt,depthBuffer:!1,stencilBuffer:!1}));for(let A=0;A<b.length;A++){let v=b[A];v.setSize&&v.setSize(S,M)}},this.begin=function(x,S){if(_||x.toneMapping===Vn&&b.length===0)return!1;if(p=S,S!==null){let M=S.width,A=S.height;(o.width!==M||o.height!==A)&&this.setSize(M,A)}return T===!1&&x.setRenderTarget(o),m=x.toneMapping,x.toneMapping=Vn,!0},this.hasRenderPass=function(){return T},this.end=function(x,S){x.toneMapping=m,_=!0;let M=o,A=a;for(let v=0;v<b.length;v++){let w=b[v];w.enabled!==!1&&(w.render(x,A,M,S),w.needsSwap!==!1&&(M=A,A=A===a?l:a))}if(f!==x.outputColorSpace||g!==x.toneMapping){f=x.outputColorSpace,g=x.toneMapping,h.defines={},Ke.getTransfer(f)===ct&&(h.defines.SRGB_TRANSFER="");let v=gx[g];v&&(h.defines[v]=""),h.needsUpdate=!0}h.uniforms.tDiffuse.value=M.texture,x.setRenderTarget(p),x.render(u,d),p=null,_=!1},this.isCompositing=function(){return _},this.dispose=function(){o.dispose(),a!==null&&a.dispose(),l!==null&&l.dispose(),c.dispose(),h.dispose()}}var ep=new Wt,$h=new zi(1,1),tp=new Jr,np=new Na,ip=new oo,Uf=[],Ff=[],Bf=new Float32Array(16),Of=new Float32Array(9),kf=new Float32Array(4);function Tr(s,e,t){let n=s[0];if(n<=0||n>0)return s;let i=e*t,r=Uf[i];if(r===void 0&&(r=new Float32Array(i),Uf[i]=r),e!==0){n.toArray(r,0);for(let o=1,a=0;o!==e;++o)a+=t,s[o].toArray(r,a)}return r}function Xt(s,e){if(s.length!==e.length)return!1;for(let t=0,n=s.length;t<n;t++)if(s[t]!==e[t])return!1;return!0}function qt(s,e){for(let t=0,n=e.length;t<n;t++)s[t]=e[t]}function Zl(s,e){let t=Ff[e];t===void 0&&(t=new Int32Array(e),Ff[e]=t);for(let n=0;n!==e;++n)t[n]=s.allocateTextureUnit();return t}function xx(s,e){let t=this.cache;t[0]!==e&&(s.uniform1f(this.addr,e),t[0]=e)}function vx(s,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(s.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Xt(t,e))return;s.uniform2fv(this.addr,e),qt(t,e)}}function yx(s,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(s.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(s.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(Xt(t,e))return;s.uniform3fv(this.addr,e),qt(t,e)}}function bx(s,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(s.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Xt(t,e))return;s.uniform4fv(this.addr,e),qt(t,e)}}function Mx(s,e){let t=this.cache,n=e.elements;if(n===void 0){if(Xt(t,e))return;s.uniformMatrix2fv(this.addr,!1,e),qt(t,e)}else{if(Xt(t,n))return;kf.set(n),s.uniformMatrix2fv(this.addr,!1,kf),qt(t,n)}}function Sx(s,e){let t=this.cache,n=e.elements;if(n===void 0){if(Xt(t,e))return;s.uniformMatrix3fv(this.addr,!1,e),qt(t,e)}else{if(Xt(t,n))return;Of.set(n),s.uniformMatrix3fv(this.addr,!1,Of),qt(t,n)}}function Tx(s,e){let t=this.cache,n=e.elements;if(n===void 0){if(Xt(t,e))return;s.uniformMatrix4fv(this.addr,!1,e),qt(t,e)}else{if(Xt(t,n))return;Bf.set(n),s.uniformMatrix4fv(this.addr,!1,Bf),qt(t,n)}}function Ex(s,e){let t=this.cache;t[0]!==e&&(s.uniform1i(this.addr,e),t[0]=e)}function wx(s,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(s.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Xt(t,e))return;s.uniform2iv(this.addr,e),qt(t,e)}}function Ax(s,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(s.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Xt(t,e))return;s.uniform3iv(this.addr,e),qt(t,e)}}function Rx(s,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(s.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Xt(t,e))return;s.uniform4iv(this.addr,e),qt(t,e)}}function Cx(s,e){let t=this.cache;t[0]!==e&&(s.uniform1ui(this.addr,e),t[0]=e)}function Px(s,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(s.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Xt(t,e))return;s.uniform2uiv(this.addr,e),qt(t,e)}}function Ix(s,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(s.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Xt(t,e))return;s.uniform3uiv(this.addr,e),qt(t,e)}}function Lx(s,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(s.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Xt(t,e))return;s.uniform4uiv(this.addr,e),qt(t,e)}}function Dx(s,e,t){let n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i);let r;this.type===s.SAMPLER_2D_SHADOW?($h.compareFunction=t.isReversedDepthBuffer()?Vl:Hl,r=$h):r=ep,t.setTexture2D(e||r,i)}function Nx(s,e,t){let n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),t.setTexture3D(e||np,i)}function Ux(s,e,t){let n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),t.setTextureCube(e||ip,i)}function Fx(s,e,t){let n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),t.setTexture2DArray(e||tp,i)}function Bx(s){switch(s){case 5126:return xx;case 35664:return vx;case 35665:return yx;case 35666:return bx;case 35674:return Mx;case 35675:return Sx;case 35676:return Tx;case 5124:case 35670:return Ex;case 35667:case 35671:return wx;case 35668:case 35672:return Ax;case 35669:case 35673:return Rx;case 5125:return Cx;case 36294:return Px;case 36295:return Ix;case 36296:return Lx;case 35678:case 36198:case 36298:case 36306:case 35682:return Dx;case 35679:case 36299:case 36307:return Nx;case 35680:case 36300:case 36308:case 36293:return Ux;case 36289:case 36303:case 36311:case 36292:return Fx}}function Ox(s,e){s.uniform1fv(this.addr,e)}function kx(s,e){let t=Tr(e,this.size,2);s.uniform2fv(this.addr,t)}function zx(s,e){let t=Tr(e,this.size,3);s.uniform3fv(this.addr,t)}function Hx(s,e){let t=Tr(e,this.size,4);s.uniform4fv(this.addr,t)}function Vx(s,e){let t=Tr(e,this.size,4);s.uniformMatrix2fv(this.addr,!1,t)}function Gx(s,e){let t=Tr(e,this.size,9);s.uniformMatrix3fv(this.addr,!1,t)}function Wx(s,e){let t=Tr(e,this.size,16);s.uniformMatrix4fv(this.addr,!1,t)}function Xx(s,e){s.uniform1iv(this.addr,e)}function qx(s,e){s.uniform2iv(this.addr,e)}function Yx(s,e){s.uniform3iv(this.addr,e)}function Kx(s,e){s.uniform4iv(this.addr,e)}function Zx(s,e){s.uniform1uiv(this.addr,e)}function $x(s,e){s.uniform2uiv(this.addr,e)}function Jx(s,e){s.uniform3uiv(this.addr,e)}function jx(s,e){s.uniform4uiv(this.addr,e)}function Qx(s,e,t){let n=this.cache,i=e.length,r=Zl(t,i);Xt(n,r)||(s.uniform1iv(this.addr,r),qt(n,r));let o;this.type===s.SAMPLER_2D_SHADOW?o=$h:o=ep;for(let a=0;a!==i;++a)t.setTexture2D(e[a]||o,r[a])}function ev(s,e,t){let n=this.cache,i=e.length,r=Zl(t,i);Xt(n,r)||(s.uniform1iv(this.addr,r),qt(n,r));for(let o=0;o!==i;++o)t.setTexture3D(e[o]||np,r[o])}function tv(s,e,t){let n=this.cache,i=e.length,r=Zl(t,i);Xt(n,r)||(s.uniform1iv(this.addr,r),qt(n,r));for(let o=0;o!==i;++o)t.setTextureCube(e[o]||ip,r[o])}function nv(s,e,t){let n=this.cache,i=e.length,r=Zl(t,i);Xt(n,r)||(s.uniform1iv(this.addr,r),qt(n,r));for(let o=0;o!==i;++o)t.setTexture2DArray(e[o]||tp,r[o])}function iv(s){switch(s){case 5126:return Ox;case 35664:return kx;case 35665:return zx;case 35666:return Hx;case 35674:return Vx;case 35675:return Gx;case 35676:return Wx;case 5124:case 35670:return Xx;case 35667:case 35671:return qx;case 35668:case 35672:return Yx;case 35669:case 35673:return Kx;case 5125:return Zx;case 36294:return $x;case 36295:return Jx;case 36296:return jx;case 35678:case 36198:case 36298:case 36306:case 35682:return Qx;case 35679:case 36299:case 36307:return ev;case 35680:case 36300:case 36308:case 36293:return tv;case 36289:case 36303:case 36311:case 36292:return nv}}var Jh=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=Bx(t.type)}},jh=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=iv(t.type)}},Qh=class{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){let i=this.seq;for(let r=0,o=i.length;r!==o;++r){let a=i[r];a.setValue(e,t[a.id],n)}}},Kh=/(\w+)(\])?(\[|\.)?/g;function zf(s,e){s.seq.push(e),s.map[e.id]=e}function sv(s,e,t){let n=s.name,i=n.length;for(Kh.lastIndex=0;;){let r=Kh.exec(n),o=Kh.lastIndex,a=r[1],l=r[2]==="]",c=r[3];if(l&&(a=a|0),c===void 0||c==="["&&o+2===i){zf(t,c===void 0?new Jh(a,s,e):new jh(a,s,e));break}else{let u=t.map[a];u===void 0&&(u=new Qh(a),zf(t,u)),t=u}}}var Sr=class{constructor(e,t){this.seq=[],this.map={};let n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let o=0;o<n;++o){let a=e.getActiveUniform(t,o),l=e.getUniformLocation(t,a.name);sv(a,l,this)}let i=[],r=[];for(let o of this.seq)o.type===e.SAMPLER_2D_SHADOW||o.type===e.SAMPLER_CUBE_SHADOW||o.type===e.SAMPLER_2D_ARRAY_SHADOW?i.push(o):r.push(o);i.length>0&&(this.seq=i.concat(r))}setValue(e,t,n,i){let r=this.map[t];r!==void 0&&r.setValue(e,n,i)}setOptional(e,t,n){let i=t[n];i!==void 0&&this.setValue(e,n,i)}static upload(e,t,n,i){for(let r=0,o=t.length;r!==o;++r){let a=t[r],l=n[a.id];l.needsUpdate!==!1&&a.setValue(e,l.value,i)}}static seqWithValue(e,t){let n=[];for(let i=0,r=e.length;i!==r;++i){let o=e[i];o.id in t&&n.push(o)}return n}};function Hf(s,e,t){let n=s.createShader(e);return s.shaderSource(n,t),s.compileShader(n),n}var rv=37297,ov=0;function av(s,e){let t=s.split(`
`),n=[],i=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let o=i;o<r;o++){let a=o+1;n.push(`${a===e?">":" "} ${a}: ${t[o]}`)}return n.join(`
`)}var Vf=new He;function lv(s){Ke._getMatrix(Vf,Ke.workingColorSpace,s);let e=`mat3( ${Vf.elements.map(t=>t.toFixed(4))} )`;switch(Ke.getTransfer(s)){case Zr:return[e,"LinearTransferOETF"];case ct:return[e,"sRGBTransferOETF"];default:return De("WebGLProgram: Unsupported color space: ",s),[e,"LinearTransferOETF"]}}function Gf(s,e,t){let n=s.getShaderParameter(e,s.COMPILE_STATUS),r=(s.getShaderInfoLog(e)||"").trim();if(n&&r==="")return"";let o=/ERROR: 0:(\d+)/.exec(r);if(o){let a=parseInt(o[1]);return t.toUpperCase()+`

`+r+`

`+av(s.getShaderSource(e),a)}else return r}function cv(s,e){let t=lv(e);return[`vec4 ${s}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}var hv={[xh]:"Linear",[vh]:"Reinhard",[yh]:"Cineon",[bo]:"ACESFilmic",[Mh]:"AgX",[Sh]:"Neutral",[bh]:"Custom"};function uv(s,e){let t=hv[e];return t===void 0?(De("WebGLProgram: Unsupported toneMapping:",e),"vec3 "+s+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+s+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}var Wl=new D;function dv(){Ke.getLuminanceCoefficients(Wl);let s=Wl.x.toFixed(4),e=Wl.y.toFixed(4),t=Wl.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${s}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function fv(s){return[s.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",s.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Do).join(`
`)}function pv(s){let e=[];for(let t in s){let n=s[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function mv(s,e){let t={},n=s.getProgramParameter(e,s.ACTIVE_ATTRIBUTES);for(let i=0;i<n;i++){let r=s.getActiveAttrib(e,i),o=r.name,a=1;r.type===s.FLOAT_MAT2&&(a=2),r.type===s.FLOAT_MAT3&&(a=3),r.type===s.FLOAT_MAT4&&(a=4),t[o]={type:r.type,location:s.getAttribLocation(e,o),locationSize:a}}return t}function Do(s){return s!==""}function Wf(s,e){let t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return s.replace(/NUM_SUN_LIGHTS/g,e.numSunLights).replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_SUN_LIGHT_SHADOWS/g,e.numSunLightShadows).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function Xf(s,e){return s.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}var gv=/^[ \t]*#include +<([\w\d./]+)>/gm;function eu(s){return s.replace(gv,xv)}var _v=new Map;function xv(s,e){let t=qe[e];if(t===void 0){let n=_v.get(e);if(n!==void 0)t=qe[n],De('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,n);else throw new Error("THREE.WebGLProgram: Can not resolve #include <"+e+">")}return eu(t)}var vv=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function qf(s){return s.replace(vv,yv)}function yv(s,e,t,n){let i="";for(let r=parseInt(e);r<parseInt(t);r++)i+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return i}function Yf(s){let e=`precision ${s.precision} float;
	precision ${s.precision} int;
	precision ${s.precision} sampler2D;
	precision ${s.precision} samplerCube;
	precision ${s.precision} sampler3D;
	precision ${s.precision} sampler2DArray;
	precision ${s.precision} sampler2DShadow;
	precision ${s.precision} samplerCubeShadow;
	precision ${s.precision} sampler2DArrayShadow;
	precision ${s.precision} isampler2D;
	precision ${s.precision} isampler3D;
	precision ${s.precision} isamplerCube;
	precision ${s.precision} isampler2DArray;
	precision ${s.precision} usampler2D;
	precision ${s.precision} usampler3D;
	precision ${s.precision} usamplerCube;
	precision ${s.precision} usampler2DArray;
	`;return s.precision==="highp"?e+=`
#define HIGH_PRECISION`:s.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:s.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}var bv={[yo]:"SHADOWMAP_TYPE_PCF",[dr]:"SHADOWMAP_TYPE_VSM"};function Mv(s){return bv[s.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}var Sv={[Gi]:"ENVMAP_TYPE_CUBE",[bs]:"ENVMAP_TYPE_CUBE",[Mo]:"ENVMAP_TYPE_CUBE_UV"};function Tv(s){return s.envMap===!1?"ENVMAP_TYPE_CUBE":Sv[s.envMapMode]||"ENVMAP_TYPE_CUBE"}var Ev={[bs]:"ENVMAP_MODE_REFRACTION"};function wv(s){return s.envMap===!1?"ENVMAP_MODE_REFLECTION":Ev[s.envMapMode]||"ENVMAP_MODE_REFLECTION"}var Av={[el]:"ENVMAP_BLENDING_MULTIPLY",[cf]:"ENVMAP_BLENDING_MIX",[hf]:"ENVMAP_BLENDING_ADD"};function Rv(s){return s.envMap===!1?"ENVMAP_BLENDING_NONE":Av[s.combine]||"ENVMAP_BLENDING_NONE"}function Cv(s){let e=s.envMapCubeUVHeight;if(e===null)return null;let t=Math.log2(e)-2,n=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:n,maxMip:t}}function Pv(s,e,t,n){let i=s.getContext(),r=t.defines,o=t.vertexShader,a=t.fragmentShader,l=Mv(t),c=Tv(t),h=wv(t),u=Rv(t),d=Cv(t),f=fv(t),g=pv(r),_=i.createProgram(),m,p,b=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(m=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(Do).join(`
`),m.length>0&&(m+=`
`),p=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(Do).join(`
`),p.length>0&&(p+=`
`)):(m=[Yf(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+h:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexNormals?"#define HAS_NORMAL":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Do).join(`
`),p=[Yf(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+h:"",t.envMap?"#define "+u:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.retroreflection?"#define USE_RETROREFLECTION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor?"#define USE_COLOR":"",t.vertexAlphas||t.batchingColor?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.numLightProbeGrids>0?"#define USE_LIGHT_PROBES_GRID":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==Vn?"#define TONE_MAPPING":"",t.toneMapping!==Vn?qe.tonemapping_pars_fragment:"",t.toneMapping!==Vn?uv("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",qe.colorspace_pars_fragment,cv("linearToOutputTexel",t.outputColorSpace),dv(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(Do).join(`
`)),o=eu(o),o=Wf(o,t),o=Xf(o,t),a=eu(a),a=Wf(a,t),a=Xf(a,t),o=qf(o),a=qf(a),t.isRawShaderMaterial!==!0&&(b=`#version 300 es
`,m=[f,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,p=["#define varying in",t.glslVersion===Dh?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===Dh?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);let T=b+m+o,x=b+p+a,S=Hf(i,i.VERTEX_SHADER,T),M=Hf(i,i.FRAGMENT_SHADER,x);i.attachShader(_,S),i.attachShader(_,M),t.index0AttributeName!==void 0?i.bindAttribLocation(_,0,t.index0AttributeName):t.hasPositionAttribute===!0&&i.bindAttribLocation(_,0,"position"),i.linkProgram(_);function A(L){if(s.debug.checkShaderErrors){let P=i.getProgramInfoLog(_)||"",N=i.getShaderInfoLog(S)||"",I=i.getShaderInfoLog(M)||"",H=P.trim(),V=N.trim(),q=I.trim(),ee=!0,k=!0;if(i.getProgramParameter(_,i.LINK_STATUS)===!1)if(ee=!1,typeof s.debug.onShaderError=="function")s.debug.onShaderError(i,_,S,M);else{let te=Gf(i,S,"vertex"),re=Gf(i,M,"fragment");ke("WebGLProgram: Shader Error "+i.getError()+" - VALIDATE_STATUS "+i.getProgramParameter(_,i.VALIDATE_STATUS)+`

Material Name: `+L.name+`
Material Type: `+L.type+`

Program Info Log: `+H+`
`+te+`
`+re)}else H!==""?De("WebGLProgram: Program Info Log:",H):(V===""||q==="")&&(k=!1);k&&(L.diagnostics={runnable:ee,programLog:H,vertexShader:{log:V,prefix:m},fragmentShader:{log:q,prefix:p}})}i.deleteShader(S),i.deleteShader(M),v=new Sr(i,_),w=mv(i,_)}let v;this.getUniforms=function(){return v===void 0&&A(this),v};let w;this.getAttributes=function(){return w===void 0&&A(this),w};let R=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return R===!1&&(R=i.getProgramParameter(_,rv)),R},this.destroy=function(){n.releaseStatesOfProgram(this),i.deleteProgram(_),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=ov++,this.cacheKey=e,this.usedTimes=1,this.program=_,this.vertexShader=S,this.fragmentShader=M,this}var Iv=0,tu=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e,t,n){let i=this._getShaderCacheForMaterial(e);return i.has(t)===!1&&(i.add(t),t.usedTimes++),i.has(n)===!1&&(i.add(n),n.usedTimes++),this}remove(e){let t=this.materialCache.get(e);for(let n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderStage(e){return this._getShaderStage(e.vertexShader)}getFragmentShaderStage(e){return this._getShaderStage(e.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){let t=this.materialCache,n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){let t=this.shaderCache,n=t.get(e);return n===void 0&&(n=new nu(e),t.set(e,n)),n}},nu=class{constructor(e){this.id=Iv++,this.code=e,this.usedTimes=0}};function Lv(s){return s===Xi||s===Ao||s===Ro}function Dv(s,e,t,n,i,r){let o=new jr,a=new tu,l=new Set,c=[],h=new Map,u=n.logarithmicDepthBuffer,d=n.precision,f={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function g(v){return l.add(v),v===0?"uv":`uv${v}`}function _(v,w,R,L,P,N){let I=L.fog,H=P.geometry,V=v.isMeshStandardMaterial||v.isMeshLambertMaterial||v.isMeshPhongMaterial?L.environment:null,q=v.isMeshStandardMaterial||v.isMeshLambertMaterial&&!v.envMap||v.isMeshPhongMaterial&&!v.envMap,ee=e.get(v.envMap||V,q),k=ee&&ee.mapping===Mo?ee.image.height:null,te=f[v.type];v.precision!==null&&(d=n.getMaxPrecision(v.precision),d!==v.precision&&De("WebGLProgram.getParameters:",v.precision,"not supported, using",d,"instead."));let re=H.morphAttributes.position||H.morphAttributes.normal||H.morphAttributes.color,Ee=re!==void 0?re.length:0,Re=0;H.morphAttributes.position!==void 0&&(Re=1),H.morphAttributes.normal!==void 0&&(Re=2),H.morphAttributes.color!==void 0&&(Re=3);let ht,et,tt,Z;if(te){let be=si[te];ht=be.vertexShader,et=be.fragmentShader}else{ht=v.vertexShader,et=v.fragmentShader;let be=a.getVertexShaderStage(v),Le=a.getFragmentShaderStage(v);a.update(v,be,Le),tt=be.id,Z=Le.id}let Q=s.getRenderTarget(),ye=s.state.buffers.depth.getReversed(),Oe=P.isInstancedMesh===!0,ve=P.isBatchedMesh===!0,ze=!!v.map,pt=!!v.matcap,Fe=!!ee,Ye=!!v.aoMap,rt=!!v.lightMap,We=!!v.bumpMap&&v.wireframe===!1,ot=!!v.normalMap,Pt=!!v.displacementMap,Jt=!!v.emissiveMap,at=!!v.metalnessMap,It=!!v.roughnessMap,O=v.anisotropy>0,Et=v.clearcoat>0,nt=v.dispersion>0,C=v.retroreflectivity>0,y=v.iridescence>0,z=v.sheen>0,X=v.transmission>0,$=O&&!!v.anisotropyMap,le=Et&&!!v.clearcoatMap,ae=Et&&!!v.clearcoatNormalMap,J=Et&&!!v.clearcoatRoughnessMap,se=y&&!!v.iridescenceMap,ue=y&&!!v.iridescenceThicknessMap,Ce=z&&!!v.sheenColorMap,pe=z&&!!v.sheenRoughnessMap,he=!!v.specularMap,Pe=!!v.specularColorMap,Ue=!!v.specularIntensityMap,Ve=X&&!!v.transmissionMap,F=X&&!!v.thicknessMap,fe=!!v.gradientMap,ie=!!v.alphaMap,ce=v.alphaTest>0,me=!!v.alphaHash,oe=!!v.extensions,Ne=Vn;v.toneMapped&&(Q===null||Q.isXRRenderTarget===!0)&&(Ne=s.toneMapping);let Y={shaderID:te,shaderType:v.type,shaderName:v.name,vertexShader:ht,fragmentShader:et,defines:v.defines,customVertexShaderID:tt,customFragmentShaderID:Z,isRawShaderMaterial:v.isRawShaderMaterial===!0,glslVersion:v.glslVersion,precision:d,batching:ve,batchingColor:ve&&P._colorsTexture!==null,instancing:Oe,instancingColor:Oe&&P.instanceColor!==null,instancingMorph:Oe&&P.morphTexture!==null,outputColorSpace:Q===null?s.outputColorSpace:Q.isXRRenderTarget===!0?Q.texture.colorSpace:Ke.workingColorSpace,alphaToCoverage:!!v.alphaToCoverage,map:ze,matcap:pt,envMap:Fe,envMapMode:Fe&&ee.mapping,envMapCubeUVHeight:k,aoMap:Ye,lightMap:rt,bumpMap:We,normalMap:ot,displacementMap:Pt,emissiveMap:Jt,normalMapObjectSpace:ot&&v.normalMapType===gf,normalMapTangentSpace:ot&&v.normalMapType===vr,packedNormalMap:ot&&v.normalMapType===vr&&Lv(v.normalMap.format),metalnessMap:at,roughnessMap:It,anisotropy:O,anisotropyMap:$,clearcoat:Et,clearcoatMap:le,clearcoatNormalMap:ae,clearcoatRoughnessMap:J,dispersion:nt,retroreflection:C,iridescence:y,iridescenceMap:se,iridescenceThicknessMap:ue,sheen:z,sheenColorMap:Ce,sheenRoughnessMap:pe,specularMap:he,specularColorMap:Pe,specularIntensityMap:Ue,transmission:X,transmissionMap:Ve,thicknessMap:F,gradientMap:fe,opaque:v.transparent===!1&&v.blending===fr&&v.alphaToCoverage===!1,alphaMap:ie,alphaTest:ce,alphaHash:me,combine:v.combine,mapUv:ze&&g(v.map.channel),aoMapUv:Ye&&g(v.aoMap.channel),lightMapUv:rt&&g(v.lightMap.channel),bumpMapUv:We&&g(v.bumpMap.channel),normalMapUv:ot&&g(v.normalMap.channel),displacementMapUv:Pt&&g(v.displacementMap.channel),emissiveMapUv:Jt&&g(v.emissiveMap.channel),metalnessMapUv:at&&g(v.metalnessMap.channel),roughnessMapUv:It&&g(v.roughnessMap.channel),anisotropyMapUv:$&&g(v.anisotropyMap.channel),clearcoatMapUv:le&&g(v.clearcoatMap.channel),clearcoatNormalMapUv:ae&&g(v.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:J&&g(v.clearcoatRoughnessMap.channel),iridescenceMapUv:se&&g(v.iridescenceMap.channel),iridescenceThicknessMapUv:ue&&g(v.iridescenceThicknessMap.channel),sheenColorMapUv:Ce&&g(v.sheenColorMap.channel),sheenRoughnessMapUv:pe&&g(v.sheenRoughnessMap.channel),specularMapUv:he&&g(v.specularMap.channel),specularColorMapUv:Pe&&g(v.specularColorMap.channel),specularIntensityMapUv:Ue&&g(v.specularIntensityMap.channel),transmissionMapUv:Ve&&g(v.transmissionMap.channel),thicknessMapUv:F&&g(v.thicknessMap.channel),alphaMapUv:ie&&g(v.alphaMap.channel),vertexTangents:!!H.attributes.tangent&&(ot||O),vertexNormals:!!H.attributes.normal,vertexColors:v.vertexColors,vertexAlphas:v.vertexColors===!0&&!!H.attributes.color&&H.attributes.color.itemSize===4,pointsUvs:P.isPoints===!0&&!!H.attributes.uv&&(ze||ie),fog:!!I,useFog:v.fog===!0,fogExp2:!!I&&I.isFogExp2,flatShading:v.wireframe===!1&&(v.flatShading===!0||H.attributes.normal===void 0&&ot===!1&&(v.isMeshLambertMaterial||v.isMeshPhongMaterial||v.isMeshStandardMaterial||v.isMeshPhysicalMaterial)),sizeAttenuation:v.sizeAttenuation===!0,logarithmicDepthBuffer:u,reversedDepthBuffer:ye,skinning:P.isSkinnedMesh===!0,hasPositionAttribute:H.attributes.position!==void 0,morphTargets:H.morphAttributes.position!==void 0,morphNormals:H.morphAttributes.normal!==void 0,morphColors:H.morphAttributes.color!==void 0,morphTargetsCount:Ee,morphTextureStride:Re,numSunLights:w.sun.length,numDirLights:w.directional.length,numPointLights:w.point.length,numSpotLights:w.spot.length,numSpotLightMaps:w.spotLightMap.length,numRectAreaLights:w.rectArea.length,numHemiLights:w.hemi.length,numSunLightShadows:w.sunShadowMap.length,numDirLightShadows:w.directionalShadowMap.length,numPointLightShadows:w.pointShadowMap.length,numSpotLightShadows:w.spotShadowMap.length,numSpotLightShadowsWithMaps:w.numSpotLightShadowsWithMaps,numLightProbes:w.numLightProbes,numLightProbeGrids:N.length,numClippingPlanes:r.numPlanes,numClipIntersection:r.numIntersection,dithering:v.dithering,shadowMapEnabled:s.shadowMap.enabled&&R.length>0,shadowMapType:s.shadowMap.type,toneMapping:Ne,decodeVideoTexture:ze&&v.map.isVideoTexture===!0&&Ke.getTransfer(v.map.colorSpace)===ct,decodeVideoTextureEmissive:Jt&&v.emissiveMap.isVideoTexture===!0&&Ke.getTransfer(v.emissiveMap.colorSpace)===ct,premultipliedAlpha:v.premultipliedAlpha,doubleSided:v.side===xn,flipSided:v.side===Ft,useDepthPacking:v.depthPacking>=0,depthPacking:v.depthPacking||0,index0AttributeName:v.index0AttributeName,extensionClipCullDistance:oe&&v.extensions.clipCullDistance===!0&&t.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(oe&&v.extensions.multiDraw===!0||ve)&&t.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:t.has("KHR_parallel_shader_compile"),customProgramCacheKey:v.customProgramCacheKey()};return Y.vertexUv1s=l.has(1),Y.vertexUv2s=l.has(2),Y.vertexUv3s=l.has(3),l.clear(),Y}function m(v){let w=[];if(v.shaderID?w.push(v.shaderID):(w.push(v.customVertexShaderID),w.push(v.customFragmentShaderID)),v.defines!==void 0)for(let R in v.defines)w.push(R),w.push(v.defines[R]);return v.isRawShaderMaterial===!1&&(p(w,v),b(w,v),w.push(s.outputColorSpace)),w.push(v.customProgramCacheKey),w.join()}function p(v,w){v.push(w.precision),v.push(w.outputColorSpace),v.push(w.envMapMode),v.push(w.envMapCubeUVHeight),v.push(w.mapUv),v.push(w.alphaMapUv),v.push(w.lightMapUv),v.push(w.aoMapUv),v.push(w.bumpMapUv),v.push(w.normalMapUv),v.push(w.displacementMapUv),v.push(w.emissiveMapUv),v.push(w.metalnessMapUv),v.push(w.roughnessMapUv),v.push(w.anisotropyMapUv),v.push(w.clearcoatMapUv),v.push(w.clearcoatNormalMapUv),v.push(w.clearcoatRoughnessMapUv),v.push(w.iridescenceMapUv),v.push(w.iridescenceThicknessMapUv),v.push(w.sheenColorMapUv),v.push(w.sheenRoughnessMapUv),v.push(w.specularMapUv),v.push(w.specularColorMapUv),v.push(w.specularIntensityMapUv),v.push(w.transmissionMapUv),v.push(w.thicknessMapUv),v.push(w.combine),v.push(w.fogExp2),v.push(w.sizeAttenuation),v.push(w.morphTargetsCount),v.push(w.morphAttributeCount),v.push(w.numSunLights),v.push(w.numDirLights),v.push(w.numPointLights),v.push(w.numSpotLights),v.push(w.numSpotLightMaps),v.push(w.numHemiLights),v.push(w.numRectAreaLights),v.push(w.numSunLightShadows),v.push(w.numDirLightShadows),v.push(w.numPointLightShadows),v.push(w.numSpotLightShadows),v.push(w.numSpotLightShadowsWithMaps),v.push(w.numLightProbes),v.push(w.shadowMapType),v.push(w.toneMapping),v.push(w.numClippingPlanes),v.push(w.numClipIntersection),v.push(w.depthPacking)}function b(v,w){o.disableAll(),w.instancing&&o.enable(0),w.instancingColor&&o.enable(1),w.instancingMorph&&o.enable(2),w.matcap&&o.enable(3),w.envMap&&o.enable(4),w.normalMapObjectSpace&&o.enable(5),w.normalMapTangentSpace&&o.enable(6),w.clearcoat&&o.enable(7),w.iridescence&&o.enable(8),w.alphaTest&&o.enable(9),w.vertexColors&&o.enable(10),w.vertexAlphas&&o.enable(11),w.vertexUv1s&&o.enable(12),w.vertexUv2s&&o.enable(13),w.vertexUv3s&&o.enable(14),w.vertexTangents&&o.enable(15),w.anisotropy&&o.enable(16),w.alphaHash&&o.enable(17),w.batching&&o.enable(18),w.dispersion&&o.enable(19),w.retroreflection&&o.enable(24),w.batchingColor&&o.enable(20),w.gradientMap&&o.enable(21),w.packedNormalMap&&o.enable(22),w.vertexNormals&&o.enable(23),v.push(o.mask),o.disableAll(),w.fog&&o.enable(0),w.useFog&&o.enable(1),w.flatShading&&o.enable(2),w.logarithmicDepthBuffer&&o.enable(3),w.reversedDepthBuffer&&o.enable(4),w.skinning&&o.enable(5),w.morphTargets&&o.enable(6),w.morphNormals&&o.enable(7),w.morphColors&&o.enable(8),w.premultipliedAlpha&&o.enable(9),w.shadowMapEnabled&&o.enable(10),w.doubleSided&&o.enable(11),w.flipSided&&o.enable(12),w.useDepthPacking&&o.enable(13),w.dithering&&o.enable(14),w.transmission&&o.enable(15),w.sheen&&o.enable(16),w.opaque&&o.enable(17),w.pointsUvs&&o.enable(18),w.decodeVideoTexture&&o.enable(19),w.decodeVideoTextureEmissive&&o.enable(20),w.alphaToCoverage&&o.enable(21),w.numLightProbeGrids>0&&o.enable(22),w.hasPositionAttribute&&o.enable(23),v.push(o.mask)}function T(v){let w=f[v.type],R;if(w){let L=si[w];R=Ts.clone(L.uniforms)}else R=v.uniforms;return R}function x(v,w){let R=h.get(w);return R!==void 0?++R.usedTimes:(R=new Pv(s,w,v,i),c.push(R),h.set(w,R)),R}function S(v){if(--v.usedTimes===0){let w=c.indexOf(v);c[w]=c[c.length-1],c.pop(),h.delete(v.cacheKey),v.destroy()}}function M(v){a.remove(v)}function A(){a.dispose()}return{getParameters:_,getProgramCacheKey:m,getUniforms:T,acquireProgram:x,releaseProgram:S,releaseShaderCache:M,programs:c,dispose:A}}function Nv(){let s=new WeakMap;function e(o){return s.has(o)}function t(o){let a=s.get(o);return a===void 0&&(a={},s.set(o,a)),a}function n(o){s.delete(o)}function i(o,a,l){s.get(o)[a]=l}function r(){s=new WeakMap}return{has:e,get:t,remove:n,update:i,dispose:r}}function Uv(s,e){return s.groupOrder!==e.groupOrder?s.groupOrder-e.groupOrder:s.renderOrder!==e.renderOrder?s.renderOrder-e.renderOrder:s.material.id!==e.material.id?s.material.id-e.material.id:s.materialVariant!==e.materialVariant?s.materialVariant-e.materialVariant:s.z!==e.z?s.z-e.z:s.id-e.id}function Kf(s,e){return s.groupOrder!==e.groupOrder?s.groupOrder-e.groupOrder:s.renderOrder!==e.renderOrder?s.renderOrder-e.renderOrder:s.z!==e.z?e.z-s.z:s.id-e.id}function Zf(){let s=[],e=0,t=[],n=[],i=[];function r(){e=0,t.length=0,n.length=0,i.length=0}function o(d){let f=0;return d.isInstancedMesh&&(f+=2),d.isSkinnedMesh&&(f+=1),f}function a(d,f,g,_,m,p){let b=s[e];return b===void 0?(b={id:d.id,object:d,geometry:f,material:g,materialVariant:o(d),groupOrder:_,renderOrder:d.renderOrder,z:m,group:p},s[e]=b):(b.id=d.id,b.object=d,b.geometry=f,b.material=g,b.materialVariant=o(d),b.groupOrder=_,b.renderOrder=d.renderOrder,b.z=m,b.group=p),e++,b}function l(d,f,g,_,m,p,b){b.reversedDepth===!0&&(m=-m);let T=a(d,f,g,_,m,p);g.transmission>0?n.push(T):g.transparent===!0?i.push(T):t.push(T)}function c(d,f,g,_,m,p){let b=a(d,f,g,_,m,p);g.transmission>0?n.unshift(b):g.transparent===!0?i.unshift(b):t.unshift(b)}function h(d,f){t.length>1&&t.sort(d||Uv),n.length>1&&n.sort(f||Kf),i.length>1&&i.sort(f||Kf)}function u(){for(let d=e,f=s.length;d<f;d++){let g=s[d];if(g.id===null)break;g.id=null,g.object=null,g.geometry=null,g.material=null,g.group=null}}return{opaque:t,transmissive:n,transparent:i,init:r,push:l,unshift:c,finish:u,sort:h}}function Fv(){let s=new WeakMap;function e(n,i){let r=s.get(n),o;return r===void 0?(o=new Zf,s.set(n,[o])):i>=r.length?(o=new Zf,r.push(o)):o=r[i],o}function t(){s=new WeakMap}return{get:e,dispose:t}}function Bv(){let s={};return{get:function(e){if(s[e.id]!==void 0)return s[e.id];let t;switch(e.type){case"SunLight":case"DirectionalLight":t={direction:new D,color:new de};break;case"SpotLight":t={position:new D,direction:new D,color:new de,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new D,color:new de,distance:0,decay:0};break;case"HemisphereLight":t={direction:new D,skyColor:new de,groundColor:new de};break;case"RectAreaLight":t={color:new de,position:new D,halfWidth:new D,halfHeight:new D};break}return s[e.id]=t,t}}}function Ov(){let s={};return{get:function(e){if(s[e.id]!==void 0)return s[e.id];let t;switch(e.type){case"SunLight":case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Te};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Te};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Te,shadowCameraNear:1,shadowCameraFar:1e3};break}return s[e.id]=t,t}}}var kv=0;function zv(s,e){return(e.castShadow?2:0)-(s.castShadow?2:0)+(e.map?1:0)-(s.map?1:0)}function Hv(s){let e=new Bv,t=Ov(),n={version:0,hash:{sunLength:-1,directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numSunShadows:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],sun:[],sunShadow:[],sunShadowMap:[],sunShadowMatrix:[],sunShadowCascade:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new D);let i=new D,r=new Ge,o=new Ge;function a(c){let h=0,u=0,d=0;for(let P=0;P<9;P++)n.probe[P].set(0,0,0);let f=0,g=0,_=0,m=0,p=0,b=0,T=0,x=0,S=0,M=0,A=0,v=0,w=0,R=0;c.sort(zv);for(let P=0,N=c.length;P<N;P++){let I=c[P],H=I.color,V=I.intensity,q=I.distance,ee=null;if(I.shadow&&I.shadow.map&&(I.shadow.map.texture.format===Xi?ee=I.shadow.map.texture:ee=I.shadow.map.depthTexture||I.shadow.map.texture),I.isAmbientLight)h+=H.r*V,u+=H.g*V,d+=H.b*V;else if(I.isLightProbe){for(let k=0;k<9;k++)n.probe[k].addScaledVector(I.sh.coefficients[k],V);R++}else if(I.isSunLight){let k=e.get(I);if(k.color.copy(I.color).multiplyScalar(I.intensity),I.castShadow){let te=I.shadow,re=t.get(I);re.shadowIntensity=te.intensity,re.shadowBias=te.bias,re.shadowNormalBias=te.normalBias,re.shadowRadius=te.radius,re.shadowMapSize.copy(te.mapSize).multiply(te.getFrameExtents()),n.sunShadow[g]=re,n.sunShadowMap[g]=ee;let Ee=te.getViewportCount();for(let Re=0;Re<Ee;Re++)n.sunShadowMatrix[_+Re]=te.getMatrix(Re),n.sunShadowCascade[_+Re]=te._cascadeData[Re];_+=Ee,g++}n.sun[f]=k,f++}else if(I.isDirectionalLight){let k=e.get(I);if(k.color.copy(I.color).multiplyScalar(I.intensity),I.castShadow){let te=I.shadow,re=t.get(I);re.shadowIntensity=te.intensity,re.shadowBias=te.bias,re.shadowNormalBias=te.normalBias,re.shadowRadius=te.radius,re.shadowMapSize=te.mapSize,n.directionalShadow[m]=re,n.directionalShadowMap[m]=ee,n.directionalShadowMatrix[m]=I.shadow.matrix,S++}n.directional[m]=k,m++}else if(I.isSpotLight){let k=e.get(I);k.position.setFromMatrixPosition(I.matrixWorld),k.color.copy(H).multiplyScalar(V),k.distance=q,k.coneCos=Math.cos(I.angle),k.penumbraCos=Math.cos(I.angle*(1-I.penumbra)),k.decay=I.decay,n.spot[b]=k;let te=I.shadow;if(I.map&&(n.spotLightMap[v]=I.map,v++,te.updateMatrices(I),I.castShadow&&w++),n.spotLightMatrix[b]=te.matrix,I.castShadow){let re=t.get(I);re.shadowIntensity=te.intensity,re.shadowBias=te.bias,re.shadowNormalBias=te.normalBias,re.shadowRadius=te.radius,re.shadowMapSize=te.mapSize,n.spotShadow[b]=re,n.spotShadowMap[b]=ee,A++}b++}else if(I.isRectAreaLight){let k=e.get(I);k.color.copy(H).multiplyScalar(V),k.halfWidth.set(I.width*.5,0,0),k.halfHeight.set(0,I.height*.5,0),n.rectArea[T]=k,T++}else if(I.isPointLight){let k=e.get(I);if(k.color.copy(I.color).multiplyScalar(I.intensity),k.distance=I.distance,k.decay=I.decay,I.castShadow){let te=I.shadow,re=t.get(I);re.shadowIntensity=te.intensity,re.shadowBias=te.bias,re.shadowNormalBias=te.normalBias,re.shadowRadius=te.radius,re.shadowMapSize=te.mapSize,re.shadowCameraNear=te.camera.near,re.shadowCameraFar=te.camera.far,n.pointShadow[p]=re,n.pointShadowMap[p]=ee,n.pointShadowMatrix[p]=I.shadow.matrix,M++}n.point[p]=k,p++}else if(I.isHemisphereLight){let k=e.get(I);k.skyColor.copy(I.color).multiplyScalar(V),k.groundColor.copy(I.groundColor).multiplyScalar(V),n.hemi[x]=k,x++}}T>0&&(s.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=ge.LTC_FLOAT_1,n.rectAreaLTC2=ge.LTC_FLOAT_2):(n.rectAreaLTC1=ge.LTC_HALF_1,n.rectAreaLTC2=ge.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=u,n.ambient[2]=d;let L=n.hash;(L.sunLength!==f||L.directionalLength!==m||L.pointLength!==p||L.spotLength!==b||L.rectAreaLength!==T||L.hemiLength!==x||L.numSunShadows!==g||L.numDirectionalShadows!==S||L.numPointShadows!==M||L.numSpotShadows!==A||L.numSpotMaps!==v||L.numLightProbes!==R)&&(n.sun.length=f,n.directional.length=m,n.spot.length=b,n.rectArea.length=T,n.point.length=p,n.hemi.length=x,n.sunShadow.length=g,n.sunShadowMap.length=g,n.sunShadowMatrix.length=_,n.sunShadowCascade.length=_,n.directionalShadow.length=S,n.directionalShadowMap.length=S,n.directionalShadowMatrix.length=S,n.pointShadow.length=M,n.pointShadowMap.length=M,n.pointShadowMatrix.length=M,n.spotShadow.length=A,n.spotShadowMap.length=A,n.spotLightMatrix.length=A+v-w,n.spotLightMap.length=v,n.numSpotLightShadowsWithMaps=w,n.numLightProbes=R,L.sunLength=f,L.directionalLength=m,L.pointLength=p,L.spotLength=b,L.rectAreaLength=T,L.hemiLength=x,L.numSunShadows=g,L.numDirectionalShadows=S,L.numPointShadows=M,L.numSpotShadows=A,L.numSpotMaps=v,L.numLightProbes=R,n.version=kv++)}function l(c,h){let u=0,d=0,f=0,g=0,_=0,m=0,p=h.matrixWorldInverse;for(let b=0,T=c.length;b<T;b++){let x=c[b];if(x.isSunLight){let S=n.sun[u];S.direction.setFromMatrixPosition(x.matrixWorld),S.direction.transformDirection(p),u++}else if(x.isDirectionalLight){let S=n.directional[d];S.direction.setFromMatrixPosition(x.matrixWorld),i.setFromMatrixPosition(x.target.matrixWorld),S.direction.sub(i),S.direction.transformDirection(p),d++}else if(x.isSpotLight){let S=n.spot[g];S.position.setFromMatrixPosition(x.matrixWorld),S.position.applyMatrix4(p),S.direction.setFromMatrixPosition(x.matrixWorld),i.setFromMatrixPosition(x.target.matrixWorld),S.direction.sub(i),S.direction.transformDirection(p),g++}else if(x.isRectAreaLight){let S=n.rectArea[_];S.position.setFromMatrixPosition(x.matrixWorld),S.position.applyMatrix4(p),o.identity(),r.copy(x.matrixWorld),r.premultiply(p),o.extractRotation(r),S.halfWidth.set(x.width*.5,0,0),S.halfHeight.set(0,x.height*.5,0),S.halfWidth.applyMatrix4(o),S.halfHeight.applyMatrix4(o),_++}else if(x.isPointLight){let S=n.point[f];S.position.setFromMatrixPosition(x.matrixWorld),S.position.applyMatrix4(p),f++}else if(x.isHemisphereLight){let S=n.hemi[m];S.direction.setFromMatrixPosition(x.matrixWorld),S.direction.transformDirection(p),m++}}}return{setup:a,setupView:l,state:n}}function $f(s){let e=new Hv(s),t=[],n=[],i=[];function r(d){u.camera=d,t.length=0,n.length=0,i.length=0}function o(d){t.push(d)}function a(d){n.push(d)}function l(d){i.push(d)}function c(){e.setup(t)}function h(d){e.setupView(t,d)}let u={lightsArray:t,shadowsArray:n,lightProbeGridArray:i,camera:null,lights:e,transmissionRenderTarget:{},textureUnits:0};return{init:r,state:u,setupLights:c,setupLightsView:h,pushLight:o,pushShadow:a,pushLightProbeGrid:l}}function Vv(s){let e=new WeakMap;function t(i,r=0){let o=e.get(i),a;return o===void 0?(a=new $f(s),e.set(i,[a])):r>=o.length?(a=new $f(s),o.push(a)):a=o[r],a}function n(){e=new WeakMap}return{get:t,dispose:n}}var Gv=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Wv=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );
	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );
}`,Xv=[new D(1,0,0),new D(-1,0,0),new D(0,1,0),new D(0,-1,0),new D(0,0,1),new D(0,0,-1)],qv=[new D(0,-1,0),new D(0,-1,0),new D(0,0,1),new D(0,0,-1),new D(0,-1,0),new D(0,-1,0)],Jf=new Ge,Lo=new D,Zh=new D;function Yv(s,e,t){let n=new or,i=new Te,r=new Te,o=new dt,a=new za,l=new Ha,c={},h=t.maxTextureSize,u={[ti]:Ft,[Ft]:ti,[xn]:xn},d=new ft({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Te},radius:{value:4}},vertexShader:Gv,fragmentShader:Wv}),f=d.clone();f.defines.HORIZONTAL_PASS=1;let g=new yt;g.setAttribute("position",new Rt(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let _=new Be(g,d),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=yo;let p=this.type;this.render=function(M,A,v){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||M.length===0)return;this.type===Qa&&(De("WebGLShadowMap: PCFSoftShadowMap has been removed. Using PCFShadowMap instead."),this.type=yo);let w=s.getRenderTarget(),R=s.getActiveCubeFace(),L=s.getActiveMipmapLevel(),P=s.state;P.setBlending(Cn),P.buffers.depth.getReversed()===!0?P.buffers.color.setClear(0,0,0,0):P.buffers.color.setClear(1,1,1,1),P.buffers.depth.setTest(!0),P.setScissorTest(!1);let N=p!==this.type;N&&A.traverse(function(I){I.material&&(Array.isArray(I.material)?I.material.forEach(H=>H.needsUpdate=!0):I.material.needsUpdate=!0)});for(let I=0,H=M.length;I<H;I++){let V=M[I],q=V.shadow;if(q===void 0){De("WebGLShadowMap:",V,"has no shadow.");continue}if(q.autoUpdate===!1&&q.needsUpdate===!1)continue;i.copy(q.mapSize);let ee=q.getFrameExtents();i.multiply(ee),r.copy(q.mapSize),(i.x>h||i.y>h)&&(i.x>h&&(r.x=Math.floor(h/ee.x),i.x=r.x*ee.x,q.mapSize.x=r.x),i.y>h&&(r.y=Math.floor(h/ee.y),i.y=r.y*ee.y,q.mapSize.y=r.y));let k=s.state.buffers.depth.getReversed();if(q.camera._reversedDepth=k,q.map===null||N===!0){if(q.map!==null&&(q.map.depthTexture!==null&&(q.map.depthTexture.dispose(),q.map.depthTexture=null),q.map.dispose()),this.type===dr){if(V.isPointLight){De("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}q.map=new Dt(i.x,i.y,{format:Xi,type:Vt,minFilter:Ut,magFilter:Ut,generateMipmaps:!1}),q.map.texture.name=V.name+".shadowMap",q.map.depthTexture=new zi(i.x,i.y,Mn),q.map.depthTexture.name=V.name+".shadowMapDepth",q.map.depthTexture.format=$n,q.map.depthTexture.compareFunction=null,q.map.depthTexture.minFilter=Lt,q.map.depthTexture.magFilter=Lt}else V.isPointLight?(q.map=new ql(i.x),q.map.depthTexture=new Ba(i.x,Wn)):(q.map=new Dt(i.x,i.y),q.map.depthTexture=new zi(i.x,i.y,Wn)),q.map.depthTexture.name=V.name+".shadowMap",q.map.depthTexture.format=$n,this.type===yo?(q.map.depthTexture.compareFunction=k?Vl:Hl,q.map.depthTexture.minFilter=Ut,q.map.depthTexture.magFilter=Ut):(q.map.depthTexture.compareFunction=null,q.map.depthTexture.minFilter=Lt,q.map.depthTexture.magFilter=Lt);q.camera.updateProjectionMatrix()}q.map.isWebGLCubeRenderTarget!==!0&&(q.map.width!==i.x||q.map.height!==i.y)&&q.map.setSize(i.x,i.y);let te=q.map.isWebGLCubeRenderTarget?6:q.getViewportCount();V.isPointLight!==!0&&q.updateMatrices(V,v);for(let re=0;re<te;re++){let Ee=q.getCamera(re);if(V.isPointLight){let Re=q.camera,ht=q.matrix,et=V.distance||Re.far;et!==Re.far&&(Re.far=et,Re.updateProjectionMatrix()),Lo.setFromMatrixPosition(V.matrixWorld),Re.position.copy(Lo),Zh.copy(Re.position),Zh.add(Xv[re]),Re.up.copy(qv[re]),Re.lookAt(Zh),Re.updateMatrixWorld(),ht.makeTranslation(-Lo.x,-Lo.y,-Lo.z),Jf.multiplyMatrices(Re.projectionMatrix,Re.matrixWorldInverse),q._frustum.setFromProjectionMatrix(Jf,Re.coordinateSystem,Re.reversedDepth)}if(q.map.isWebGLCubeRenderTarget)s.setRenderTarget(q.map,re),s.clear();else{re===0&&(s.setRenderTarget(q.map),s.clear());let Re=q.getViewport(re);o.set(r.x*Re.x,r.y*Re.y,r.x*Re.z,r.y*Re.w),P.viewport(o)}n=q.getFrustum(re),x(A,v,Ee,V,this.type)}q.isPointLightShadow!==!0&&this.type===dr&&b(q,v),q.needsUpdate=!1}p=this.type,m.needsUpdate=!1,s.setRenderTarget(w,R,L)};function b(M,A){let v=e.update(_);d.defines.VSM_SAMPLES!==M.blurSamples&&(d.defines.VSM_SAMPLES=M.blurSamples,f.defines.VSM_SAMPLES=M.blurSamples,d.needsUpdate=!0,f.needsUpdate=!0),M.mapPass===null?M.mapPass=new Dt(i.x,i.y,{format:Xi,type:Vt}):(M.mapPass.width!==M.map.width||M.mapPass.height!==M.map.height)&&M.mapPass.setSize(M.map.width,M.map.height),d.uniforms.shadow_pass.value=M.map.depthTexture,d.uniforms.resolution.value.set(M.map.width,M.map.height),d.uniforms.radius.value=M.radius,s.setRenderTarget(M.mapPass),s.clear(),s.renderBufferDirect(A,null,v,d,_,null),f.uniforms.shadow_pass.value=M.mapPass.texture,f.uniforms.resolution.value.set(M.map.width,M.map.height),f.uniforms.radius.value=M.radius,s.setRenderTarget(M.map),s.clear(),s.renderBufferDirect(A,null,v,f,_,null)}function T(M,A,v,w){let R=null,L=v.isPointLight===!0?M.customDistanceMaterial:M.customDepthMaterial;if(L!==void 0)R=L;else if(R=v.isPointLight===!0?l:a,s.localClippingEnabled&&A.clipShadows===!0&&Array.isArray(A.clippingPlanes)&&A.clippingPlanes.length!==0||A.displacementMap&&A.displacementScale!==0||A.alphaMap&&A.alphaTest>0||A.map&&A.alphaTest>0||A.alphaToCoverage===!0){let P=R.uuid,N=A.uuid,I=c[P];I===void 0&&(I={},c[P]=I);let H=I[N];H===void 0&&(H=R.clone(),I[N]=H,A.addEventListener("dispose",S)),R=H}if(R.visible=A.visible,R.wireframe=A.wireframe,w===dr?R.side=A.shadowSide!==null?A.shadowSide:A.side:R.side=A.shadowSide!==null?A.shadowSide:u[A.side],R.alphaMap=A.alphaMap,R.alphaTest=A.alphaToCoverage===!0?.5:A.alphaTest,R.map=A.map,R.clipShadows=A.clipShadows,R.clippingPlanes=A.clippingPlanes,R.clipIntersection=A.clipIntersection,R.displacementMap=A.displacementMap,R.displacementScale=A.displacementScale,R.displacementBias=A.displacementBias,R.wireframeLinewidth=A.wireframeLinewidth,R.linewidth=A.linewidth,v.isPointLight===!0&&R.isMeshDistanceMaterial===!0){let P=s.properties.get(R);P.light=v}return R}function x(M,A,v,w,R){if(M.visible===!1)return;if(M.layers.test(A.layers)&&(M.isMesh||M.isLine||M.isPoints)&&(M.castShadow||M.receiveShadow&&R===dr)&&(!M.frustumCulled||M.intersectsFrustum(n))){M.modelViewMatrix.multiplyMatrices(v.matrixWorldInverse,M.matrixWorld);let N=e.update(M),I=M.material;if(Array.isArray(I)){let H=N.groups;for(let V=0,q=H.length;V<q;V++){let ee=H[V],k=I[ee.materialIndex];if(k&&k.visible){let te=T(M,k,w,R);M.onBeforeShadow(s,M,A,v,N,te,ee),s.renderBufferDirect(v,null,N,te,M,ee),M.onAfterShadow(s,M,A,v,N,te,ee)}}}else if(I.visible){let H=T(M,I,w,R);M.onBeforeShadow(s,M,A,v,N,H,null),s.renderBufferDirect(v,null,N,H,M,null),M.onAfterShadow(s,M,A,v,N,H,null)}}let P=M.children;for(let N=0,I=P.length;N<I;N++)x(P[N],A,v,w,R)}function S(M){M.target.removeEventListener("dispose",S);for(let v in c){let w=c[v],R=M.target.uuid;R in w&&(w[R].dispose(),delete w[R])}}}function Kv(s,e){function t(){let F=!1,fe=new dt,ie=null,ce=new dt(0,0,0,0);return{setMask:function(me){ie!==me&&!F&&(s.colorMask(me,me,me,me),ie=me)},setLocked:function(me){F=me},setClear:function(me,oe,Ne,Y,be){be===!0&&(me*=Y,oe*=Y,Ne*=Y),fe.set(me,oe,Ne,Y),ce.equals(fe)===!1&&(s.clearColor(me,oe,Ne,Y),ce.copy(fe))},reset:function(){F=!1,ie=null,ce.set(-1,0,0,0)}}}function n(){let F=!1,fe=!1,ie=null,ce=null,me=null;return{setReversed:function(oe){if(fe!==oe){let Ne=e.get("EXT_clip_control");oe?Ne.clipControlEXT(Ne.LOWER_LEFT_EXT,Ne.ZERO_TO_ONE_EXT):Ne.clipControlEXT(Ne.LOWER_LEFT_EXT,Ne.NEGATIVE_ONE_TO_ONE_EXT),fe=oe;let Y=me;me=null,this.setClear(Y)}},getReversed:function(){return fe},setTest:function(oe){oe?Q(s.DEPTH_TEST):ye(s.DEPTH_TEST)},setMask:function(oe){ie!==oe&&!F&&(s.depthMask(oe),ie=oe)},setFunc:function(oe){if(fe&&(oe=Af[oe]),ce!==oe){switch(oe){case Ea:s.depthFunc(s.NEVER);break;case wa:s.depthFunc(s.ALWAYS);break;case Aa:s.depthFunc(s.LESS);break;case Zs:s.depthFunc(s.LEQUAL);break;case Ra:s.depthFunc(s.EQUAL);break;case Ca:s.depthFunc(s.GEQUAL);break;case Pa:s.depthFunc(s.GREATER);break;case Ia:s.depthFunc(s.NOTEQUAL);break;default:s.depthFunc(s.LEQUAL)}ce=oe}},setLocked:function(oe){F=oe},setClear:function(oe){me!==oe&&(me=oe,fe&&(oe=1-oe),s.clearDepth(oe))},reset:function(){F=!1,ie=null,ce=null,me=null,fe=!1}}}function i(){let F=!1,fe=null,ie=null,ce=null,me=null,oe=null,Ne=null,Y=null,be=null;return{setTest:function(Le){F||(Le?Q(s.STENCIL_TEST):ye(s.STENCIL_TEST))},setMask:function(Le){fe!==Le&&!F&&(s.stencilMask(Le),fe=Le)},setFunc:function(Le,mt,Zt){(ie!==Le||ce!==mt||me!==Zt)&&(s.stencilFunc(Le,mt,Zt),ie=Le,ce=mt,me=Zt)},setOp:function(Le,mt,Zt){(oe!==Le||Ne!==mt||Y!==Zt)&&(s.stencilOp(Le,mt,Zt),oe=Le,Ne=mt,Y=Zt)},setLocked:function(Le){F=Le},setClear:function(Le){be!==Le&&(s.clearStencil(Le),be=Le)},reset:function(){F=!1,fe=null,ie=null,ce=null,me=null,oe=null,Ne=null,Y=null,be=null}}}let r=new t,o=new n,a=new i,l=new WeakMap,c=new WeakMap,h={},u={},d={},f=new WeakMap,g=[],_=null,m=!1,p=null,b=null,T=null,x=null,S=null,M=null,A=null,v=new de(0,0,0),w=0,R=!1,L=null,P=null,N=null,I=null,H=null,V=s.getParameter(s.MAX_COMBINED_TEXTURE_IMAGE_UNITS),q=!1,ee=0,k=s.getParameter(s.VERSION);k.indexOf("WebGL")!==-1?(ee=parseFloat(/^WebGL (\d)/.exec(k)[1]),q=ee>=1):k.indexOf("OpenGL ES")!==-1&&(ee=parseFloat(/^OpenGL ES (\d)/.exec(k)[1]),q=ee>=2);let te=null,re={},Ee=s.getParameter(s.SCISSOR_BOX),Re=s.getParameter(s.VIEWPORT),ht=new dt().fromArray(Ee),et=new dt().fromArray(Re);function tt(F,fe,ie,ce){let me=new Uint8Array(4),oe=s.createTexture();s.bindTexture(F,oe),s.texParameteri(F,s.TEXTURE_MIN_FILTER,s.NEAREST),s.texParameteri(F,s.TEXTURE_MAG_FILTER,s.NEAREST);for(let Ne=0;Ne<ie;Ne++)F===s.TEXTURE_3D||F===s.TEXTURE_2D_ARRAY?s.texImage3D(fe,0,s.RGBA,1,1,ce,0,s.RGBA,s.UNSIGNED_BYTE,me):s.texImage2D(fe+Ne,0,s.RGBA,1,1,0,s.RGBA,s.UNSIGNED_BYTE,me);return oe}let Z={};Z[s.TEXTURE_2D]=tt(s.TEXTURE_2D,s.TEXTURE_2D,1),Z[s.TEXTURE_CUBE_MAP]=tt(s.TEXTURE_CUBE_MAP,s.TEXTURE_CUBE_MAP_POSITIVE_X,6),Z[s.TEXTURE_2D_ARRAY]=tt(s.TEXTURE_2D_ARRAY,s.TEXTURE_2D_ARRAY,1,1),Z[s.TEXTURE_3D]=tt(s.TEXTURE_3D,s.TEXTURE_3D,1,1),r.setClear(0,0,0,1),o.setClear(1),a.setClear(0),Q(s.DEPTH_TEST),o.setFunc(Zs),We(!1),ot(fh),Q(s.CULL_FACE),Ye(Cn);function Q(F){h[F]!==!0&&(s.enable(F),h[F]=!0)}function ye(F){h[F]!==!1&&(s.disable(F),h[F]=!1)}function Oe(F,fe){return d[F]!==fe?(s.bindFramebuffer(F,fe),d[F]=fe,F===s.DRAW_FRAMEBUFFER&&(d[s.FRAMEBUFFER]=fe),F===s.FRAMEBUFFER&&(d[s.DRAW_FRAMEBUFFER]=fe),!0):!1}function ve(F,fe){let ie=g,ce=!1;if(F){ie=f.get(fe),ie===void 0&&(ie=[],f.set(fe,ie));let me=F.textures;if(ie.length!==me.length||ie[0]!==s.COLOR_ATTACHMENT0){for(let oe=0,Ne=me.length;oe<Ne;oe++)ie[oe]=s.COLOR_ATTACHMENT0+oe;ie.length=me.length,ce=!0}}else ie[0]!==s.BACK&&(ie[0]=s.BACK,ce=!0);ce&&s.drawBuffers(ie)}function ze(F){return _!==F?(s.useProgram(F),_=F,!0):!1}let pt={[ys]:s.FUNC_ADD,[Xd]:s.FUNC_SUBTRACT,[qd]:s.FUNC_REVERSE_SUBTRACT};pt[Yd]=s.MIN,pt[Kd]=s.MAX;let Fe={[Zd]:s.ZERO,[$d]:s.ONE,[Jd]:s.SRC_COLOR,[gh]:s.SRC_ALPHA,[sf]:s.SRC_ALPHA_SATURATE,[tf]:s.DST_COLOR,[Qd]:s.DST_ALPHA,[jd]:s.ONE_MINUS_SRC_COLOR,[_h]:s.ONE_MINUS_SRC_ALPHA,[nf]:s.ONE_MINUS_DST_COLOR,[ef]:s.ONE_MINUS_DST_ALPHA,[rf]:s.CONSTANT_COLOR,[of]:s.ONE_MINUS_CONSTANT_COLOR,[af]:s.CONSTANT_ALPHA,[lf]:s.ONE_MINUS_CONSTANT_ALPHA};function Ye(F,fe,ie,ce,me,oe,Ne,Y,be,Le){if(F===Cn){m===!0&&(ye(s.BLEND),m=!1);return}if(m===!1&&(Q(s.BLEND),m=!0),F!==Wd){if(F!==p||Le!==R){if((b!==ys||S!==ys)&&(s.blendEquation(s.FUNC_ADD),b=ys,S=ys),Le)switch(F){case fr:s.blendFuncSeparate(s.ONE,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case ni:s.blendFunc(s.ONE,s.ONE);break;case ph:s.blendFuncSeparate(s.ZERO,s.ONE_MINUS_SRC_COLOR,s.ZERO,s.ONE);break;case mh:s.blendFuncSeparate(s.DST_COLOR,s.ONE_MINUS_SRC_ALPHA,s.ZERO,s.ONE);break;default:ke("WebGLState: Invalid blending: ",F);break}else switch(F){case fr:s.blendFuncSeparate(s.SRC_ALPHA,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case ni:s.blendFuncSeparate(s.SRC_ALPHA,s.ONE,s.ONE,s.ONE);break;case ph:ke("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case mh:ke("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:ke("WebGLState: Invalid blending: ",F);break}T=null,x=null,M=null,A=null,v.set(0,0,0),w=0,p=F,R=Le}return}me=me||fe,oe=oe||ie,Ne=Ne||ce,(fe!==b||me!==S)&&(s.blendEquationSeparate(pt[fe],pt[me]),b=fe,S=me),(ie!==T||ce!==x||oe!==M||Ne!==A)&&(s.blendFuncSeparate(Fe[ie],Fe[ce],Fe[oe],Fe[Ne]),T=ie,x=ce,M=oe,A=Ne),(Y.equals(v)===!1||be!==w)&&(s.blendColor(Y.r,Y.g,Y.b,be),v.copy(Y),w=be),p=F,R=!1}function rt(F,fe){F.side===xn?ye(s.CULL_FACE):Q(s.CULL_FACE);let ie=F.side===Ft;fe&&(ie=!ie),We(ie),F.blending===fr&&F.transparent===!1?Ye(Cn):Ye(F.blending,F.blendEquation,F.blendSrc,F.blendDst,F.blendEquationAlpha,F.blendSrcAlpha,F.blendDstAlpha,F.blendColor,F.blendAlpha,F.premultipliedAlpha),o.setFunc(F.depthFunc),o.setTest(F.depthTest),o.setMask(F.depthWrite),r.setMask(F.colorWrite);let ce=F.stencilWrite;a.setTest(ce),ce&&(a.setMask(F.stencilWriteMask),a.setFunc(F.stencilFunc,F.stencilRef,F.stencilFuncMask),a.setOp(F.stencilFail,F.stencilZFail,F.stencilZPass)),Jt(F.polygonOffset,F.polygonOffsetFactor,F.polygonOffsetUnits),F.alphaToCoverage===!0?Q(s.SAMPLE_ALPHA_TO_COVERAGE):ye(s.SAMPLE_ALPHA_TO_COVERAGE)}function We(F){L!==F&&(F?s.frontFace(s.CW):s.frontFace(s.CCW),L=F)}function ot(F){F!==Vd?(Q(s.CULL_FACE),F!==P&&(F===fh?s.cullFace(s.BACK):F===Gd?s.cullFace(s.FRONT):s.cullFace(s.FRONT_AND_BACK))):ye(s.CULL_FACE),P=F}function Pt(F){F!==N&&(q&&s.lineWidth(F),N=F)}function Jt(F,fe,ie){F?(Q(s.POLYGON_OFFSET_FILL),(I!==fe||H!==ie)&&(I=fe,H=ie,o.getReversed()&&(fe=-fe),s.polygonOffset(fe,ie))):ye(s.POLYGON_OFFSET_FILL)}function at(F){F?Q(s.SCISSOR_TEST):ye(s.SCISSOR_TEST)}function It(F){F===void 0&&(F=s.TEXTURE0+V-1),te!==F&&(s.activeTexture(F),te=F)}function O(F,fe,ie){ie===void 0&&(te===null?ie=s.TEXTURE0+V-1:ie=te);let ce=re[ie];ce===void 0&&(ce={type:void 0,texture:void 0},re[ie]=ce),(ce.type!==F||ce.texture!==fe)&&(te!==ie&&(s.activeTexture(ie),te=ie),s.bindTexture(F,fe||Z[F]),ce.type=F,ce.texture=fe)}function Et(){let F=re[te];F!==void 0&&F.type!==void 0&&(s.bindTexture(F.type,null),F.type=void 0,F.texture=void 0)}function nt(){try{s.compressedTexImage2D(...arguments)}catch(F){ke("WebGLState:",F)}}function C(){try{s.compressedTexImage3D(...arguments)}catch(F){ke("WebGLState:",F)}}function y(){try{s.texSubImage2D(...arguments)}catch(F){ke("WebGLState:",F)}}function z(){try{s.texSubImage3D(...arguments)}catch(F){ke("WebGLState:",F)}}function X(){try{s.compressedTexSubImage2D(...arguments)}catch(F){ke("WebGLState:",F)}}function $(){try{s.compressedTexSubImage3D(...arguments)}catch(F){ke("WebGLState:",F)}}function le(){try{s.texStorage2D(...arguments)}catch(F){ke("WebGLState:",F)}}function ae(){try{s.texStorage3D(...arguments)}catch(F){ke("WebGLState:",F)}}function J(){try{s.texImage2D(...arguments)}catch(F){ke("WebGLState:",F)}}function se(){try{s.texImage3D(...arguments)}catch(F){ke("WebGLState:",F)}}function ue(F){return u[F]!==void 0?u[F]:s.getParameter(F)}function Ce(F,fe){u[F]!==fe&&(s.pixelStorei(F,fe),u[F]=fe)}function pe(F){ht.equals(F)===!1&&(s.scissor(F.x,F.y,F.z,F.w),ht.copy(F))}function he(F){et.equals(F)===!1&&(s.viewport(F.x,F.y,F.z,F.w),et.copy(F))}function Pe(F,fe){let ie=c.get(fe);ie===void 0&&(ie=new WeakMap,c.set(fe,ie));let ce=ie.get(F);ce===void 0&&(ce=s.getUniformBlockIndex(fe,F.name),ie.set(F,ce))}function Ue(F,fe){let ce=c.get(fe).get(F);l.get(fe)!==ce&&(s.uniformBlockBinding(fe,ce,F.__bindingPointIndex),l.set(fe,ce))}function Ve(){s.disable(s.BLEND),s.disable(s.CULL_FACE),s.disable(s.DEPTH_TEST),s.disable(s.POLYGON_OFFSET_FILL),s.disable(s.SCISSOR_TEST),s.disable(s.STENCIL_TEST),s.disable(s.SAMPLE_ALPHA_TO_COVERAGE),s.blendEquation(s.FUNC_ADD),s.blendFunc(s.ONE,s.ZERO),s.blendFuncSeparate(s.ONE,s.ZERO,s.ONE,s.ZERO),s.blendColor(0,0,0,0),s.colorMask(!0,!0,!0,!0),s.clearColor(0,0,0,0),s.depthMask(!0),s.depthFunc(s.LESS),o.setReversed(!1),s.clearDepth(1),s.stencilMask(4294967295),s.stencilFunc(s.ALWAYS,0,4294967295),s.stencilOp(s.KEEP,s.KEEP,s.KEEP),s.clearStencil(0),s.cullFace(s.BACK),s.frontFace(s.CCW),s.polygonOffset(0,0),s.activeTexture(s.TEXTURE0),s.bindFramebuffer(s.FRAMEBUFFER,null),s.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),s.bindFramebuffer(s.READ_FRAMEBUFFER,null),s.useProgram(null),s.lineWidth(1),s.scissor(0,0,s.canvas.width,s.canvas.height),s.viewport(0,0,s.canvas.width,s.canvas.height),s.pixelStorei(s.PACK_ALIGNMENT,4),s.pixelStorei(s.UNPACK_ALIGNMENT,4),s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,!1),s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),s.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,s.BROWSER_DEFAULT_WEBGL),s.pixelStorei(s.PACK_ROW_LENGTH,0),s.pixelStorei(s.PACK_SKIP_PIXELS,0),s.pixelStorei(s.PACK_SKIP_ROWS,0),s.pixelStorei(s.UNPACK_ROW_LENGTH,0),s.pixelStorei(s.UNPACK_IMAGE_HEIGHT,0),s.pixelStorei(s.UNPACK_SKIP_PIXELS,0),s.pixelStorei(s.UNPACK_SKIP_ROWS,0),s.pixelStorei(s.UNPACK_SKIP_IMAGES,0),h={},u={},te=null,re={},d={},f=new WeakMap,g=[],_=null,m=!1,p=null,b=null,T=null,x=null,S=null,M=null,A=null,v=new de(0,0,0),w=0,R=!1,L=null,P=null,N=null,I=null,H=null,ht.set(0,0,s.canvas.width,s.canvas.height),et.set(0,0,s.canvas.width,s.canvas.height),r.reset(),o.reset(),a.reset()}return{buffers:{color:r,depth:o,stencil:a},enable:Q,disable:ye,bindFramebuffer:Oe,drawBuffers:ve,useProgram:ze,setBlending:Ye,setMaterial:rt,setFlipSided:We,setCullFace:ot,setLineWidth:Pt,setPolygonOffset:Jt,setScissorTest:at,activeTexture:It,bindTexture:O,unbindTexture:Et,compressedTexImage2D:nt,compressedTexImage3D:C,texImage2D:J,texImage3D:se,pixelStorei:Ce,getParameter:ue,updateUBOMapping:Pe,uniformBlockBinding:Ue,texStorage2D:le,texStorage3D:ae,texSubImage2D:y,texSubImage3D:z,compressedTexSubImage2D:X,compressedTexSubImage3D:$,scissor:pe,viewport:he,reset:Ve}}function Zv(s,e,t,n,i,r,o){let a=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new Te,h=new WeakMap,u=new Set,d,f=new WeakMap,g=!1;try{g=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function _(C,y){return g?new OffscreenCanvas(C,y):js("canvas")}function m(C,y,z){let X=1,$=nt(C);if(($.width>z||$.height>z)&&(X=z/Math.max($.width,$.height)),X<1)if(typeof HTMLImageElement<"u"&&C instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&C instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&C instanceof ImageBitmap||typeof VideoFrame<"u"&&C instanceof VideoFrame){let le=Math.floor(X*$.width),ae=Math.floor(X*$.height);d===void 0&&(d=_(le,ae));let J=y?_(le,ae):d;return J.width=le,J.height=ae,J.getContext("2d").drawImage(C,0,0,le,ae),De("WebGLRenderer: Texture has been resized from ("+$.width+"x"+$.height+") to ("+le+"x"+ae+")."),J}else return"data"in C&&De("WebGLRenderer: Image in DataTexture is too big ("+$.width+"x"+$.height+")."),C;return C}function p(C){return C.generateMipmaps}function b(C){s.generateMipmap(C)}function T(C){return C.isWebGLCubeRenderTarget?s.TEXTURE_CUBE_MAP:C.isWebGL3DRenderTarget?s.TEXTURE_3D:C.isWebGLArrayRenderTarget||C.isCompressedArrayTexture?s.TEXTURE_2D_ARRAY:s.TEXTURE_2D}function x(C,y,z,X,$,le=!1){if(C!==null){if(s[C]!==void 0)return s[C];De("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+C+"'")}let ae;X&&(ae=e.get("EXT_texture_norm16"),ae||De("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let J=y;if(y===s.RED&&(z===s.FLOAT&&(J=s.R32F),z===s.HALF_FLOAT&&(J=s.R16F),z===s.UNSIGNED_BYTE&&(J=s.R8),z===s.UNSIGNED_SHORT&&ae&&(J=ae.R16_EXT),z===s.SHORT&&ae&&(J=ae.R16_SNORM_EXT)),y===s.RED_INTEGER&&(z===s.UNSIGNED_BYTE&&(J=s.R8UI),z===s.UNSIGNED_SHORT&&(J=s.R16UI),z===s.UNSIGNED_INT&&(J=s.R32UI),z===s.BYTE&&(J=s.R8I),z===s.SHORT&&(J=s.R16I),z===s.INT&&(J=s.R32I)),y===s.RG&&(z===s.FLOAT&&(J=s.RG32F),z===s.HALF_FLOAT&&(J=s.RG16F),z===s.UNSIGNED_BYTE&&(J=s.RG8),z===s.UNSIGNED_SHORT&&ae&&(J=ae.RG16_EXT),z===s.SHORT&&ae&&(J=ae.RG16_SNORM_EXT)),y===s.RG_INTEGER&&(z===s.UNSIGNED_BYTE&&(J=s.RG8UI),z===s.UNSIGNED_SHORT&&(J=s.RG16UI),z===s.UNSIGNED_INT&&(J=s.RG32UI),z===s.BYTE&&(J=s.RG8I),z===s.SHORT&&(J=s.RG16I),z===s.INT&&(J=s.RG32I)),y===s.RGB_INTEGER&&(z===s.UNSIGNED_BYTE&&(J=s.RGB8UI),z===s.UNSIGNED_SHORT&&(J=s.RGB16UI),z===s.UNSIGNED_INT&&(J=s.RGB32UI),z===s.BYTE&&(J=s.RGB8I),z===s.SHORT&&(J=s.RGB16I),z===s.INT&&(J=s.RGB32I)),y===s.RGBA_INTEGER&&(z===s.UNSIGNED_BYTE&&(J=s.RGBA8UI),z===s.UNSIGNED_SHORT&&(J=s.RGBA16UI),z===s.UNSIGNED_INT&&(J=s.RGBA32UI),z===s.BYTE&&(J=s.RGBA8I),z===s.SHORT&&(J=s.RGBA16I),z===s.INT&&(J=s.RGBA32I)),y===s.RGB&&(z===s.UNSIGNED_SHORT&&ae&&(J=ae.RGB16_EXT),z===s.SHORT&&ae&&(J=ae.RGB16_SNORM_EXT),z===s.UNSIGNED_INT_5_9_9_9_REV&&(J=s.RGB9_E5),z===s.UNSIGNED_INT_10F_11F_11F_REV&&(J=s.R11F_G11F_B10F)),y===s.RGBA){let se=le?Zr:Ke.getTransfer($);z===s.FLOAT&&(J=s.RGBA32F),z===s.HALF_FLOAT&&(J=s.RGBA16F),z===s.UNSIGNED_BYTE&&(J=se===ct?s.SRGB8_ALPHA8:s.RGBA8),z===s.UNSIGNED_SHORT&&ae&&(J=ae.RGBA16_EXT),z===s.SHORT&&ae&&(J=ae.RGBA16_SNORM_EXT),z===s.UNSIGNED_SHORT_4_4_4_4&&(J=s.RGBA4),z===s.UNSIGNED_SHORT_5_5_5_1&&(J=s.RGB5_A1)}return(J===s.R16F||J===s.R32F||J===s.RG16F||J===s.RG32F||J===s.RGBA16F||J===s.RGBA32F)&&e.get("EXT_color_buffer_float"),J}function S(C,y){let z;return C?y===null||y===Wn||y===gr?z=s.DEPTH24_STENCIL8:y===Mn?z=s.DEPTH32F_STENCIL8:y===mr&&(z=s.DEPTH24_STENCIL8,De("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):y===null||y===Wn||y===gr?z=s.DEPTH_COMPONENT24:y===Mn?z=s.DEPTH_COMPONENT32F:y===mr&&(z=s.DEPTH_COMPONENT16),z}function M(C,y){return p(C)===!0||C.isFramebufferTexture&&C.minFilter!==Lt&&C.minFilter!==Ut?Math.log2(Math.max(y.width,y.height))+1:C.mipmaps!==void 0&&C.mipmaps.length>0?C.mipmaps.length:C.isCompressedTexture&&Array.isArray(C.image)?y.mipmaps.length:1}function A(C){let y=C.target;y.removeEventListener("dispose",A),w(y),y.isVideoTexture&&h.delete(y),y.isHTMLTexture&&u.delete(y)}function v(C){let y=C.target;y.removeEventListener("dispose",v),L(y)}function w(C){let y=n.get(C);if(y.__webglInit===void 0)return;let z=C.source,X=f.get(z);if(X){let $=X[y.__cacheKey];$.usedTimes--,$.usedTimes===0&&R(C),Object.keys(X).length===0&&f.delete(z)}n.remove(C)}function R(C){let y=n.get(C);s.deleteTexture(y.__webglTexture);let z=C.source,X=f.get(z);delete X[y.__cacheKey],o.memory.textures--}function L(C){let y=n.get(C);if(C.depthTexture&&(C.depthTexture.dispose(),n.remove(C.depthTexture)),C.isWebGLCubeRenderTarget)for(let X=0;X<6;X++){if(Array.isArray(y.__webglFramebuffer[X]))for(let $=0;$<y.__webglFramebuffer[X].length;$++)s.deleteFramebuffer(y.__webglFramebuffer[X][$]);else s.deleteFramebuffer(y.__webglFramebuffer[X]);y.__webglDepthbuffer&&s.deleteRenderbuffer(y.__webglDepthbuffer[X])}else{if(Array.isArray(y.__webglFramebuffer))for(let X=0;X<y.__webglFramebuffer.length;X++)s.deleteFramebuffer(y.__webglFramebuffer[X]);else s.deleteFramebuffer(y.__webglFramebuffer);if(y.__webglDepthbuffer&&s.deleteRenderbuffer(y.__webglDepthbuffer),y.__webglMultisampledFramebuffer&&s.deleteFramebuffer(y.__webglMultisampledFramebuffer),y.__webglColorRenderbuffer)for(let X=0;X<y.__webglColorRenderbuffer.length;X++)y.__webglColorRenderbuffer[X]&&s.deleteRenderbuffer(y.__webglColorRenderbuffer[X]);y.__webglDepthRenderbuffer&&s.deleteRenderbuffer(y.__webglDepthRenderbuffer)}let z=C.textures;for(let X=0,$=z.length;X<$;X++){let le=n.get(z[X]);le.__webglTexture&&(s.deleteTexture(le.__webglTexture),o.memory.textures--),n.remove(z[X])}n.remove(C)}let P=0;function N(){P=0}function I(){return P}function H(C){P=C}function V(){let C=P;return C>=i.maxTextures&&De("WebGLTextures: Trying to use "+(C+1)+" texture units while this GPU supports only "+i.maxTextures),P+=1,C}function q(C){let y=[];return y.push(C.wrapS),y.push(C.wrapT),y.push(C.wrapR||0),y.push(C.magFilter),y.push(C.minFilter),y.push(C.anisotropy),y.push(C.internalFormat),y.push(C.format),y.push(C.type),y.push(C.generateMipmaps),y.push(C.premultiplyAlpha),y.push(C.flipY),y.push(C.unpackAlignment),y.push(C.colorSpace),y.join()}function ee(C,y){let z=n.get(C);if(C.isVideoTexture&&O(C),C.isRenderTargetTexture===!1&&C.isExternalTexture!==!0&&C.version>0&&z.__version!==C.version){let X=C.image;if(X===null)De("WebGLRenderer: Texture marked for update but no image data found.");else if(X.complete===!1)De("WebGLRenderer: Texture marked for update but image is incomplete");else{ye(z,C,y);return}}else C.isExternalTexture&&(z.__webglTexture=C.sourceTexture?C.sourceTexture:null);t.bindTexture(s.TEXTURE_2D,z.__webglTexture,s.TEXTURE0+y)}function k(C,y){let z=n.get(C);if(C.isRenderTargetTexture===!1&&C.version>0&&z.__version!==C.version){ye(z,C,y);return}else C.isExternalTexture&&(z.__webglTexture=C.sourceTexture?C.sourceTexture:null);t.bindTexture(s.TEXTURE_2D_ARRAY,z.__webglTexture,s.TEXTURE0+y)}function te(C,y){let z=n.get(C);if(C.isRenderTargetTexture===!1&&C.version>0&&z.__version!==C.version){ye(z,C,y);return}t.bindTexture(s.TEXTURE_3D,z.__webglTexture,s.TEXTURE0+y)}function re(C,y){let z=n.get(C);if(C.isCubeDepthTexture!==!0&&C.version>0&&z.__version!==C.version){Oe(z,C,y);return}t.bindTexture(s.TEXTURE_CUBE_MAP,z.__webglTexture,s.TEXTURE0+y)}let Ee={[zn]:s.REPEAT,[An]:s.CLAMP_TO_EDGE,[$s]:s.MIRRORED_REPEAT},Re={[Lt]:s.NEAREST,[il]:s.NEAREST_MIPMAP_NEAREST,[Ms]:s.NEAREST_MIPMAP_LINEAR,[Ut]:s.LINEAR,[pr]:s.LINEAR_MIPMAP_NEAREST,[Gn]:s.LINEAR_MIPMAP_LINEAR},ht={[xf]:s.NEVER,[Sf]:s.ALWAYS,[vf]:s.LESS,[Hl]:s.LEQUAL,[yf]:s.EQUAL,[Vl]:s.GEQUAL,[bf]:s.GREATER,[Mf]:s.NOTEQUAL};function et(C,y){if(y.type===Mn&&e.has("OES_texture_float_linear")===!1&&(y.magFilter===Ut||y.magFilter===pr||y.magFilter===Ms||y.magFilter===Gn||y.minFilter===Ut||y.minFilter===pr||y.minFilter===Ms||y.minFilter===Gn)&&De("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),s.texParameteri(C,s.TEXTURE_WRAP_S,Ee[y.wrapS]),s.texParameteri(C,s.TEXTURE_WRAP_T,Ee[y.wrapT]),(C===s.TEXTURE_3D||C===s.TEXTURE_2D_ARRAY)&&s.texParameteri(C,s.TEXTURE_WRAP_R,Ee[y.wrapR]),s.texParameteri(C,s.TEXTURE_MAG_FILTER,Re[y.magFilter]),s.texParameteri(C,s.TEXTURE_MIN_FILTER,Re[y.minFilter]),y.compareFunction&&(s.texParameteri(C,s.TEXTURE_COMPARE_MODE,s.COMPARE_REF_TO_TEXTURE),s.texParameteri(C,s.TEXTURE_COMPARE_FUNC,ht[y.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(y.magFilter===Lt||y.minFilter!==Ms&&y.minFilter!==Gn||y.type===Mn&&e.has("OES_texture_float_linear")===!1)return;if(y.anisotropy>1||n.get(y).__currentAnisotropy){let z=e.get("EXT_texture_filter_anisotropic");s.texParameterf(C,z.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(y.anisotropy,i.getMaxAnisotropy())),n.get(y).__currentAnisotropy=y.anisotropy}}}function tt(C,y){let z=!1;C.__webglInit===void 0&&(C.__webglInit=!0,y.addEventListener("dispose",A));let X=y.source,$=f.get(X);$===void 0&&($={},f.set(X,$));let le=q(y);if(le!==C.__cacheKey){$[le]===void 0&&($[le]={texture:s.createTexture(),usedTimes:0},o.memory.textures++,z=!0),$[le].usedTimes++;let ae=$[C.__cacheKey];ae!==void 0&&($[C.__cacheKey].usedTimes--,ae.usedTimes===0&&R(y)),C.__cacheKey=le,C.__webglTexture=$[le].texture}return z}function Z(C,y,z){return Math.floor(Math.floor(C/z)/y)}function Q(C,y,z,X){let le=C.updateRanges;if(le.length===0)t.texSubImage2D(s.TEXTURE_2D,0,0,0,y.width,y.height,z,X,y.data);else{le.sort((Ce,pe)=>Ce.start-pe.start);let ae=0;for(let Ce=1;Ce<le.length;Ce++){let pe=le[ae],he=le[Ce],Pe=pe.start+pe.count,Ue=Z(he.start,y.width,4),Ve=Z(pe.start,y.width,4);he.start<=Pe+1&&Ue===Ve&&Z(he.start+he.count-1,y.width,4)===Ue?pe.count=Math.max(pe.count,he.start+he.count-pe.start):(++ae,le[ae]=he)}le.length=ae+1;let J=t.getParameter(s.UNPACK_ROW_LENGTH),se=t.getParameter(s.UNPACK_SKIP_PIXELS),ue=t.getParameter(s.UNPACK_SKIP_ROWS);t.pixelStorei(s.UNPACK_ROW_LENGTH,y.width);for(let Ce=0,pe=le.length;Ce<pe;Ce++){let he=le[Ce],Pe=Math.floor(he.start/4),Ue=Math.ceil(he.count/4),Ve=Pe%y.width,F=Math.floor(Pe/y.width),fe=Ue,ie=1;t.pixelStorei(s.UNPACK_SKIP_PIXELS,Ve),t.pixelStorei(s.UNPACK_SKIP_ROWS,F),t.texSubImage2D(s.TEXTURE_2D,0,Ve,F,fe,ie,z,X,y.data)}C.clearUpdateRanges(),t.pixelStorei(s.UNPACK_ROW_LENGTH,J),t.pixelStorei(s.UNPACK_SKIP_PIXELS,se),t.pixelStorei(s.UNPACK_SKIP_ROWS,ue)}}function ye(C,y,z){let X=s.TEXTURE_2D;(y.isDataArrayTexture||y.isCompressedArrayTexture)&&(X=s.TEXTURE_2D_ARRAY),y.isData3DTexture&&(X=s.TEXTURE_3D);let $=tt(C,y),le=y.source;t.bindTexture(X,C.__webglTexture,s.TEXTURE0+z);let ae=n.get(le);if(le.version!==ae.__version||$===!0){if(t.activeTexture(s.TEXTURE0+z),(typeof ImageBitmap<"u"&&y.image instanceof ImageBitmap)===!1){let ie=Ke.getPrimaries(Ke.workingColorSpace),ce=y.colorSpace===Si?null:Ke.getPrimaries(y.colorSpace),me=y.colorSpace===Si||ie===ce?s.NONE:s.BROWSER_DEFAULT_WEBGL;t.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,y.flipY),t.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,y.premultiplyAlpha),t.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,me)}t.pixelStorei(s.UNPACK_ALIGNMENT,y.unpackAlignment);let se=m(y.image,!1,i.maxTextureSize);se=Et(y,se);let ue=r.convert(y.format,y.colorSpace),Ce=r.convert(y.type),pe=x(y.internalFormat,ue,Ce,y.normalized,y.colorSpace,y.isVideoTexture);et(X,y);let he,Pe=y.mipmaps,Ue=y.isVideoTexture!==!0,Ve=ae.__version===void 0||$===!0,F=le.dataReady,fe=M(y,se);if(y.isDepthTexture)pe=S(y.format===Wi,y.type),Ve&&(Ue?t.texStorage2D(s.TEXTURE_2D,1,pe,se.width,se.height):t.texImage2D(s.TEXTURE_2D,0,pe,se.width,se.height,0,ue,Ce,null));else if(y.isDataTexture)if(Pe.length>0){Ue&&Ve&&t.texStorage2D(s.TEXTURE_2D,fe,pe,Pe[0].width,Pe[0].height);for(let ie=0,ce=Pe.length;ie<ce;ie++)he=Pe[ie],Ue?F&&t.texSubImage2D(s.TEXTURE_2D,ie,0,0,he.width,he.height,ue,Ce,he.data):t.texImage2D(s.TEXTURE_2D,ie,pe,he.width,he.height,0,ue,Ce,he.data);y.generateMipmaps=!1}else Ue?(Ve&&t.texStorage2D(s.TEXTURE_2D,fe,pe,se.width,se.height),F&&Q(y,se,ue,Ce)):t.texImage2D(s.TEXTURE_2D,0,pe,se.width,se.height,0,ue,Ce,se.data);else if(y.isCompressedTexture)if(y.isCompressedArrayTexture){Ue&&Ve&&t.texStorage3D(s.TEXTURE_2D_ARRAY,fe,pe,Pe[0].width,Pe[0].height,se.depth);for(let ie=0,ce=Pe.length;ie<ce;ie++)if(he=Pe[ie],y.format!==Sn)if(ue!==null)if(Ue){if(F)if(y.layerUpdates.size>0){let me=Oh(he.width,he.height,y.format,y.type);for(let oe of y.layerUpdates){let Ne=he.data.subarray(oe*me/he.data.BYTES_PER_ELEMENT,(oe+1)*me/he.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,ie,0,0,oe,he.width,he.height,1,ue,Ne)}}else t.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,ie,0,0,0,he.width,he.height,se.depth,ue,he.data)}else t.compressedTexImage3D(s.TEXTURE_2D_ARRAY,ie,pe,he.width,he.height,se.depth,0,he.data,0,0);else De("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Ue?F&&t.texSubImage3D(s.TEXTURE_2D_ARRAY,ie,0,0,0,he.width,he.height,se.depth,ue,Ce,he.data):t.texImage3D(s.TEXTURE_2D_ARRAY,ie,pe,he.width,he.height,se.depth,0,ue,Ce,he.data);y.layerUpdates.size>0&&y.clearLayerUpdates()}else{Ue&&Ve&&t.texStorage2D(s.TEXTURE_2D,fe,pe,Pe[0].width,Pe[0].height);for(let ie=0,ce=Pe.length;ie<ce;ie++)he=Pe[ie],y.format!==Sn?ue!==null?Ue?F&&t.compressedTexSubImage2D(s.TEXTURE_2D,ie,0,0,he.width,he.height,ue,he.data):t.compressedTexImage2D(s.TEXTURE_2D,ie,pe,he.width,he.height,0,he.data):De("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Ue?F&&t.texSubImage2D(s.TEXTURE_2D,ie,0,0,he.width,he.height,ue,Ce,he.data):t.texImage2D(s.TEXTURE_2D,ie,pe,he.width,he.height,0,ue,Ce,he.data)}else if(y.isDataArrayTexture)if(Ue){if(Ve&&t.texStorage3D(s.TEXTURE_2D_ARRAY,fe,pe,se.width,se.height,se.depth),F)if(y.layerUpdates.size>0){let ie=Oh(se.width,se.height,y.format,y.type);for(let ce of y.layerUpdates){let me=se.data.subarray(ce*ie/se.data.BYTES_PER_ELEMENT,(ce+1)*ie/se.data.BYTES_PER_ELEMENT);t.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,ce,se.width,se.height,1,ue,Ce,me)}y.clearLayerUpdates()}else t.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,0,se.width,se.height,se.depth,ue,Ce,se.data)}else t.texImage3D(s.TEXTURE_2D_ARRAY,0,pe,se.width,se.height,se.depth,0,ue,Ce,se.data);else if(y.isData3DTexture)Ue?(Ve&&t.texStorage3D(s.TEXTURE_3D,fe,pe,se.width,se.height,se.depth),F&&t.texSubImage3D(s.TEXTURE_3D,0,0,0,0,se.width,se.height,se.depth,ue,Ce,se.data)):t.texImage3D(s.TEXTURE_3D,0,pe,se.width,se.height,se.depth,0,ue,Ce,se.data);else if(y.isFramebufferTexture){if(Ve)if(Ue)t.texStorage2D(s.TEXTURE_2D,fe,pe,se.width,se.height);else{let ie=se.width,ce=se.height;for(let me=0;me<fe;me++)t.texImage2D(s.TEXTURE_2D,me,pe,ie,ce,0,ue,Ce,null),ie>>=1,ce>>=1}}else if(y.isHTMLTexture){if("texElementImage2D"in s){let ie=s.canvas;if(ie.hasAttribute("layoutsubtree")||ie.setAttribute("layoutsubtree","true"),se.parentNode!==ie){ie.appendChild(se),u.add(y),ie.onpaint=ce=>{let me=ce.changedElements;for(let oe of u)me.includes(oe.image)&&(oe.needsUpdate=!0)},ie.requestPaint();return}if(s.texElementImage2D.length===3)s.texElementImage2D(s.TEXTURE_2D,s.RGBA8,se);else{let me=s.RGBA,oe=s.RGBA,Ne=s.UNSIGNED_BYTE;s.texElementImage2D(s.TEXTURE_2D,0,me,oe,Ne,se)}s.texParameteri(s.TEXTURE_2D,s.TEXTURE_MIN_FILTER,s.LINEAR),s.texParameteri(s.TEXTURE_2D,s.TEXTURE_WRAP_S,s.CLAMP_TO_EDGE),s.texParameteri(s.TEXTURE_2D,s.TEXTURE_WRAP_T,s.CLAMP_TO_EDGE)}}else if(Pe.length>0){if(Ue&&Ve){let ie=nt(Pe[0]);t.texStorage2D(s.TEXTURE_2D,fe,pe,ie.width,ie.height)}for(let ie=0,ce=Pe.length;ie<ce;ie++)he=Pe[ie],Ue?F&&t.texSubImage2D(s.TEXTURE_2D,ie,0,0,ue,Ce,he):t.texImage2D(s.TEXTURE_2D,ie,pe,ue,Ce,he);y.generateMipmaps=!1}else if(Ue){if(Ve){let ie=nt(se);t.texStorage2D(s.TEXTURE_2D,fe,pe,ie.width,ie.height)}F&&t.texSubImage2D(s.TEXTURE_2D,0,0,0,ue,Ce,se)}else t.texImage2D(s.TEXTURE_2D,0,pe,ue,Ce,se);p(y)&&b(X),ae.__version=le.version,y.onUpdate&&y.onUpdate(y)}C.__version=y.version}function Oe(C,y,z){if(y.image.length!==6)return;let X=tt(C,y),$=y.source;t.bindTexture(s.TEXTURE_CUBE_MAP,C.__webglTexture,s.TEXTURE0+z);let le=n.get($);if($.version!==le.__version||X===!0){t.activeTexture(s.TEXTURE0+z);let ae=Ke.getPrimaries(Ke.workingColorSpace),J=y.colorSpace===Si?null:Ke.getPrimaries(y.colorSpace),se=y.colorSpace===Si||ae===J?s.NONE:s.BROWSER_DEFAULT_WEBGL;t.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,y.flipY),t.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,y.premultiplyAlpha),t.pixelStorei(s.UNPACK_ALIGNMENT,y.unpackAlignment),t.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,se);let ue=y.isCompressedTexture||y.image[0].isCompressedTexture,Ce=y.image[0]&&y.image[0].isDataTexture,pe=[];for(let oe=0;oe<6;oe++)!ue&&!Ce?pe[oe]=m(y.image[oe],!0,i.maxCubemapSize):pe[oe]=Ce?y.image[oe].image:y.image[oe],pe[oe]=Et(y,pe[oe]);let he=pe[0],Pe=r.convert(y.format,y.colorSpace),Ue=r.convert(y.type),Ve=x(y.internalFormat,Pe,Ue,y.normalized,y.colorSpace),F=y.isVideoTexture!==!0,fe=le.__version===void 0||X===!0,ie=$.dataReady,ce=M(y,he);et(s.TEXTURE_CUBE_MAP,y);let me;if(ue){F&&fe&&t.texStorage2D(s.TEXTURE_CUBE_MAP,ce,Ve,he.width,he.height);for(let oe=0;oe<6;oe++){me=pe[oe].mipmaps;for(let Ne=0;Ne<me.length;Ne++){let Y=me[Ne];y.format!==Sn?Pe!==null?F?ie&&t.compressedTexSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+oe,Ne,0,0,Y.width,Y.height,Pe,Y.data):t.compressedTexImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+oe,Ne,Ve,Y.width,Y.height,0,Y.data):De("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):F?ie&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+oe,Ne,0,0,Y.width,Y.height,Pe,Ue,Y.data):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+oe,Ne,Ve,Y.width,Y.height,0,Pe,Ue,Y.data)}}}else{if(me=y.mipmaps,F&&fe){me.length>0&&ce++;let oe=nt(pe[0]);t.texStorage2D(s.TEXTURE_CUBE_MAP,ce,Ve,oe.width,oe.height)}for(let oe=0;oe<6;oe++)if(Ce){F?ie&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+oe,0,0,0,pe[oe].width,pe[oe].height,Pe,Ue,pe[oe].data):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+oe,0,Ve,pe[oe].width,pe[oe].height,0,Pe,Ue,pe[oe].data);for(let Ne=0;Ne<me.length;Ne++){let be=me[Ne].image[oe].image;F?ie&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+oe,Ne+1,0,0,be.width,be.height,Pe,Ue,be.data):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+oe,Ne+1,Ve,be.width,be.height,0,Pe,Ue,be.data)}}else{F?ie&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+oe,0,0,0,Pe,Ue,pe[oe]):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+oe,0,Ve,Pe,Ue,pe[oe]);for(let Ne=0;Ne<me.length;Ne++){let Y=me[Ne];F?ie&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+oe,Ne+1,0,0,Pe,Ue,Y.image[oe]):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+oe,Ne+1,Ve,Pe,Ue,Y.image[oe])}}}p(y)&&b(s.TEXTURE_CUBE_MAP),le.__version=$.version,y.onUpdate&&y.onUpdate(y)}C.__version=y.version}function ve(C,y,z,X,$,le){let ae=r.convert(z.format,z.colorSpace),J=r.convert(z.type),se=x(z.internalFormat,ae,J,z.normalized,z.colorSpace),ue=n.get(y),Ce=n.get(z);if(Ce.__renderTarget=y,!ue.__hasExternalTextures){let pe=Math.max(1,y.width>>le),he=Math.max(1,y.height>>le);$===s.TEXTURE_3D||$===s.TEXTURE_2D_ARRAY?t.texImage3D($,le,se,pe,he,y.depth,0,ae,J,null):t.texImage2D($,le,se,pe,he,0,ae,J,null)}t.bindFramebuffer(s.FRAMEBUFFER,C),It(y)?a.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,X,$,Ce.__webglTexture,0,at(y)):($===s.TEXTURE_2D||$>=s.TEXTURE_CUBE_MAP_POSITIVE_X&&$<=s.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&s.framebufferTexture2D(s.FRAMEBUFFER,X,$,Ce.__webglTexture,le),t.bindFramebuffer(s.FRAMEBUFFER,null)}function ze(C,y,z){if(s.bindRenderbuffer(s.RENDERBUFFER,C),y.depthBuffer){let X=y.depthTexture,$=X&&X.isDepthTexture?X.type:null,le=S(y.stencilBuffer,$),ae=y.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT;It(y)?a.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,at(y),le,y.width,y.height):z?s.renderbufferStorageMultisample(s.RENDERBUFFER,at(y),le,y.width,y.height):s.renderbufferStorage(s.RENDERBUFFER,le,y.width,y.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,ae,s.RENDERBUFFER,C)}else{let X=y.textures;for(let $=0;$<X.length;$++){let le=X[$],ae=r.convert(le.format,le.colorSpace),J=r.convert(le.type),se=x(le.internalFormat,ae,J,le.normalized,le.colorSpace);It(y)?a.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,at(y),se,y.width,y.height):z?s.renderbufferStorageMultisample(s.RENDERBUFFER,at(y),se,y.width,y.height):s.renderbufferStorage(s.RENDERBUFFER,se,y.width,y.height)}}s.bindRenderbuffer(s.RENDERBUFFER,null)}function pt(C,y,z){let X=y.isWebGLCubeRenderTarget===!0;if(t.bindFramebuffer(s.FRAMEBUFFER,C),!(y.depthTexture&&y.depthTexture.isDepthTexture))throw new Error("THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.");let $=n.get(y.depthTexture);if($.__renderTarget=y,(!$.__webglTexture||y.depthTexture.image.width!==y.width||y.depthTexture.image.height!==y.height)&&(y.depthTexture.image.width=y.width,y.depthTexture.image.height=y.height,y.depthTexture.needsUpdate=!0),X){if($.__webglInit===void 0&&($.__webglInit=!0,y.depthTexture.addEventListener("dispose",A)),$.__webglTexture===void 0){$.__webglTexture=s.createTexture(),t.bindTexture(s.TEXTURE_CUBE_MAP,$.__webglTexture),et(s.TEXTURE_CUBE_MAP,y.depthTexture);let ue=r.convert(y.depthTexture.format),Ce=r.convert(y.depthTexture.type),pe;y.depthTexture.format===$n?pe=s.DEPTH_COMPONENT24:y.depthTexture.format===Wi&&(pe=s.DEPTH24_STENCIL8);for(let he=0;he<6;he++)s.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+he,0,pe,y.width,y.height,0,ue,Ce,null)}}else ee(y.depthTexture,0);let le=$.__webglTexture,ae=at(y),J=X?s.TEXTURE_CUBE_MAP_POSITIVE_X+z:s.TEXTURE_2D,se=y.depthTexture.format===Wi?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT;if(y.depthTexture.format===$n)It(y)?a.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,se,J,le,0,ae):s.framebufferTexture2D(s.FRAMEBUFFER,se,J,le,0);else if(y.depthTexture.format===Wi)It(y)?a.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,se,J,le,0,ae):s.framebufferTexture2D(s.FRAMEBUFFER,se,J,le,0);else throw new Error("THREE.WebGLTextures: Unknown depthTexture format.")}function Fe(C){let y=n.get(C),z=C.isWebGLCubeRenderTarget===!0;if(y.__boundDepthTexture!==C.depthTexture){let X=C.depthTexture;if(y.__depthDisposeCallback&&y.__depthDisposeCallback(),X){let $=()=>{delete y.__boundDepthTexture,delete y.__depthDisposeCallback,X.removeEventListener("dispose",$)};X.addEventListener("dispose",$),y.__depthDisposeCallback=$}y.__boundDepthTexture=X}if(C.depthTexture&&!y.__autoAllocateDepthBuffer)if(z)for(let X=0;X<6;X++)pt(y.__webglFramebuffer[X],C,X);else{let X=C.texture.mipmaps;X&&X.length>0?pt(y.__webglFramebuffer[0],C,0):pt(y.__webglFramebuffer,C,0)}else if(z){y.__webglDepthbuffer=[];for(let X=0;X<6;X++)if(t.bindFramebuffer(s.FRAMEBUFFER,y.__webglFramebuffer[X]),y.__webglDepthbuffer[X]===void 0)y.__webglDepthbuffer[X]=s.createRenderbuffer(),ze(y.__webglDepthbuffer[X],C,!1);else{let $=C.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,le=y.__webglDepthbuffer[X];s.bindRenderbuffer(s.RENDERBUFFER,le),s.framebufferRenderbuffer(s.FRAMEBUFFER,$,s.RENDERBUFFER,le)}}else{let X=C.texture.mipmaps;if(X&&X.length>0?t.bindFramebuffer(s.FRAMEBUFFER,y.__webglFramebuffer[0]):t.bindFramebuffer(s.FRAMEBUFFER,y.__webglFramebuffer),y.__webglDepthbuffer===void 0)y.__webglDepthbuffer=s.createRenderbuffer(),ze(y.__webglDepthbuffer,C,!1);else{let $=C.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,le=y.__webglDepthbuffer;s.bindRenderbuffer(s.RENDERBUFFER,le),s.framebufferRenderbuffer(s.FRAMEBUFFER,$,s.RENDERBUFFER,le)}}t.bindFramebuffer(s.FRAMEBUFFER,null)}function Ye(C,y,z){let X=n.get(C);y!==void 0&&ve(X.__webglFramebuffer,C,C.texture,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,0),z!==void 0&&Fe(C)}function rt(C){let y=C.texture,z=n.get(C),X=n.get(y);C.addEventListener("dispose",v);let $=C.textures,le=C.isWebGLCubeRenderTarget===!0,ae=$.length>1;if(ae||(X.__webglTexture===void 0&&(X.__webglTexture=s.createTexture()),X.__version=y.version,o.memory.textures++),le){z.__webglFramebuffer=[];for(let J=0;J<6;J++)if(y.mipmaps&&y.mipmaps.length>0){z.__webglFramebuffer[J]=[];for(let se=0;se<y.mipmaps.length;se++)z.__webglFramebuffer[J][se]=s.createFramebuffer()}else z.__webglFramebuffer[J]=s.createFramebuffer()}else{if(y.mipmaps&&y.mipmaps.length>0){z.__webglFramebuffer=[];for(let J=0;J<y.mipmaps.length;J++)z.__webglFramebuffer[J]=s.createFramebuffer()}else z.__webglFramebuffer=s.createFramebuffer();if(ae)for(let J=0,se=$.length;J<se;J++){let ue=n.get($[J]);ue.__webglTexture===void 0&&(ue.__webglTexture=s.createTexture(),o.memory.textures++)}if(C.samples>0&&It(C)===!1){z.__webglMultisampledFramebuffer=s.createFramebuffer(),z.__webglColorRenderbuffer=[],t.bindFramebuffer(s.FRAMEBUFFER,z.__webglMultisampledFramebuffer);for(let J=0;J<$.length;J++){let se=$[J];z.__webglColorRenderbuffer[J]=s.createRenderbuffer(),s.bindRenderbuffer(s.RENDERBUFFER,z.__webglColorRenderbuffer[J]);let ue=r.convert(se.format,se.colorSpace),Ce=r.convert(se.type),pe=x(se.internalFormat,ue,Ce,se.normalized,se.colorSpace,C.isXRRenderTarget===!0),he=at(C);s.renderbufferStorageMultisample(s.RENDERBUFFER,he,pe,C.width,C.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+J,s.RENDERBUFFER,z.__webglColorRenderbuffer[J])}s.bindRenderbuffer(s.RENDERBUFFER,null),C.depthBuffer&&(z.__webglDepthRenderbuffer=s.createRenderbuffer(),ze(z.__webglDepthRenderbuffer,C,!0)),t.bindFramebuffer(s.FRAMEBUFFER,null)}}if(le){t.bindTexture(s.TEXTURE_CUBE_MAP,X.__webglTexture),et(s.TEXTURE_CUBE_MAP,y);for(let J=0;J<6;J++)if(y.mipmaps&&y.mipmaps.length>0)for(let se=0;se<y.mipmaps.length;se++)ve(z.__webglFramebuffer[J][se],C,y,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+J,se);else ve(z.__webglFramebuffer[J],C,y,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+J,0);p(y)&&b(s.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(ae){for(let J=0,se=$.length;J<se;J++){let ue=$[J],Ce=n.get(ue),pe=s.TEXTURE_2D;(C.isWebGL3DRenderTarget||C.isWebGLArrayRenderTarget)&&(pe=C.isWebGL3DRenderTarget?s.TEXTURE_3D:s.TEXTURE_2D_ARRAY),t.bindTexture(pe,Ce.__webglTexture),et(pe,ue),ve(z.__webglFramebuffer,C,ue,s.COLOR_ATTACHMENT0+J,pe,0),p(ue)&&b(pe)}t.unbindTexture()}else{let J=s.TEXTURE_2D;if((C.isWebGL3DRenderTarget||C.isWebGLArrayRenderTarget)&&(J=C.isWebGL3DRenderTarget?s.TEXTURE_3D:s.TEXTURE_2D_ARRAY),t.bindTexture(J,X.__webglTexture),et(J,y),y.mipmaps&&y.mipmaps.length>0)for(let se=0;se<y.mipmaps.length;se++)ve(z.__webglFramebuffer[se],C,y,s.COLOR_ATTACHMENT0,J,se);else ve(z.__webglFramebuffer,C,y,s.COLOR_ATTACHMENT0,J,0);p(y)&&b(J),t.unbindTexture()}C.depthBuffer&&Fe(C)}function We(C){let y=C.textures;for(let z=0,X=y.length;z<X;z++){let $=y[z];if(p($)){let le=T(C),ae=n.get($).__webglTexture;t.bindTexture(le,ae),b(le),t.unbindTexture()}}}let ot=[],Pt=[];function Jt(C){if(C.samples>0){if(It(C)===!1){let y=C.textures,z=C.width,X=C.height,$=s.COLOR_BUFFER_BIT,le=C.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,ae=n.get(C),J=y.length>1;if(J)for(let ue=0;ue<y.length;ue++)t.bindFramebuffer(s.FRAMEBUFFER,ae.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+ue,s.RENDERBUFFER,null),t.bindFramebuffer(s.FRAMEBUFFER,ae.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+ue,s.TEXTURE_2D,null,0);t.bindFramebuffer(s.READ_FRAMEBUFFER,ae.__webglMultisampledFramebuffer);let se=C.texture.mipmaps;se&&se.length>0?t.bindFramebuffer(s.DRAW_FRAMEBUFFER,ae.__webglFramebuffer[0]):t.bindFramebuffer(s.DRAW_FRAMEBUFFER,ae.__webglFramebuffer);for(let ue=0;ue<y.length;ue++){if(C.resolveDepthBuffer&&(C.depthBuffer&&($|=s.DEPTH_BUFFER_BIT),C.stencilBuffer&&C.resolveStencilBuffer&&($|=s.STENCIL_BUFFER_BIT)),J){s.framebufferRenderbuffer(s.READ_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.RENDERBUFFER,ae.__webglColorRenderbuffer[ue]);let Ce=n.get(y[ue]).__webglTexture;s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,Ce,0)}s.blitFramebuffer(0,0,z,X,0,0,z,X,$,s.NEAREST),l===!0&&(ot.length=0,Pt.length=0,ot.push(s.COLOR_ATTACHMENT0+ue),C.depthBuffer&&C.storeMultisampledDepthBuffer===!1&&(ot.push(le),Pt.push(le),s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER,Pt)),s.invalidateFramebuffer(s.READ_FRAMEBUFFER,ot))}if(t.bindFramebuffer(s.READ_FRAMEBUFFER,null),t.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),J)for(let ue=0;ue<y.length;ue++){t.bindFramebuffer(s.FRAMEBUFFER,ae.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+ue,s.RENDERBUFFER,ae.__webglColorRenderbuffer[ue]);let Ce=n.get(y[ue]).__webglTexture;t.bindFramebuffer(s.FRAMEBUFFER,ae.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+ue,s.TEXTURE_2D,Ce,0)}t.bindFramebuffer(s.DRAW_FRAMEBUFFER,ae.__webglMultisampledFramebuffer)}else if(C.depthBuffer&&C.storeMultisampledDepthBuffer===!1&&l){let y=C.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT;s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER,[y])}}}function at(C){return Math.min(i.maxSamples,C.samples)}function It(C){let y=n.get(C);return C.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&y.__useRenderToTexture!==!1}function O(C){let y=o.render.frame;h.get(C)!==y&&(h.set(C,y),C.update())}function Et(C,y){let z=C.colorSpace,X=C.format,$=C.type;return C.isCompressedTexture===!0||C.isVideoTexture===!0||z!==un&&z!==Si&&(Ke.getTransfer(z)===ct?(X!==Sn||$!==on)&&De("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):ke("WebGLTextures: Unsupported texture color space:",z)),y}function nt(C){return typeof HTMLImageElement<"u"&&C instanceof HTMLImageElement?(c.width=C.naturalWidth||C.width,c.height=C.naturalHeight||C.height):typeof VideoFrame<"u"&&C instanceof VideoFrame?(c.width=C.displayWidth,c.height=C.displayHeight):(c.width=C.width,c.height=C.height),c}this.allocateTextureUnit=V,this.resetTextureUnits=N,this.getTextureUnits=I,this.setTextureUnits=H,this.setTexture2D=ee,this.setTexture2DArray=k,this.setTexture3D=te,this.setTextureCube=re,this.rebindTextures=Ye,this.setupRenderTarget=rt,this.updateRenderTargetMipmap=We,this.updateMultisampleRenderTarget=Jt,this.setupDepthRenderbuffer=Fe,this.setupFrameBufferTexture=ve,this.useMultisampledRTT=It,this.isReversedDepthBuffer=function(){return t.buffers.depth.getReversed()}}function $v(s,e){function t(n,i=Si){let r,o=Ke.getTransfer(i);if(n===on)return s.UNSIGNED_BYTE;if(n===rl)return s.UNSIGNED_SHORT_4_4_4_4;if(n===ol)return s.UNSIGNED_SHORT_5_5_5_1;if(n===Ah)return s.UNSIGNED_INT_5_9_9_9_REV;if(n===Rh)return s.UNSIGNED_INT_10F_11F_11F_REV;if(n===Eh)return s.BYTE;if(n===wh)return s.SHORT;if(n===mr)return s.UNSIGNED_SHORT;if(n===sl)return s.INT;if(n===Wn)return s.UNSIGNED_INT;if(n===Mn)return s.FLOAT;if(n===Vt)return s.HALF_FLOAT;if(n===Ch)return s.ALPHA;if(n===Ph)return s.RGB;if(n===Sn)return s.RGBA;if(n===$n)return s.DEPTH_COMPONENT;if(n===Wi)return s.DEPTH_STENCIL;if(n===_r)return s.RED;if(n===al)return s.RED_INTEGER;if(n===Xi)return s.RG;if(n===ll)return s.RG_INTEGER;if(n===cl)return s.RGBA_INTEGER;if(n===So||n===To||n===Eo||n===wo)if(o===ct)if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===So)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===To)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===Eo)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===wo)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=e.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===So)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===To)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===Eo)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===wo)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===hl||n===ul||n===dl||n===fl)if(r=e.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===hl)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===ul)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===dl)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===fl)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===pl||n===ml||n===gl||n===_l||n===xl||n===Ao||n===vl)if(r=e.get("WEBGL_compressed_texture_etc"),r!==null){if(n===pl||n===ml)return o===ct?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===gl)return o===ct?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC;if(n===_l)return r.COMPRESSED_R11_EAC;if(n===xl)return r.COMPRESSED_SIGNED_R11_EAC;if(n===Ao)return r.COMPRESSED_RG11_EAC;if(n===vl)return r.COMPRESSED_SIGNED_RG11_EAC}else return null;if(n===yl||n===bl||n===Ml||n===Sl||n===Tl||n===El||n===wl||n===Al||n===Rl||n===Cl||n===Pl||n===Il||n===Ll||n===Dl)if(r=e.get("WEBGL_compressed_texture_astc"),r!==null){if(n===yl)return o===ct?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===bl)return o===ct?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===Ml)return o===ct?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===Sl)return o===ct?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===Tl)return o===ct?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===El)return o===ct?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===wl)return o===ct?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===Al)return o===ct?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===Rl)return o===ct?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===Cl)return o===ct?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===Pl)return o===ct?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===Il)return o===ct?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===Ll)return o===ct?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===Dl)return o===ct?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===Nl||n===Ul||n===Fl)if(r=e.get("EXT_texture_compression_bptc"),r!==null){if(n===Nl)return o===ct?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===Ul)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===Fl)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===Bl||n===Ol||n===Ro||n===kl)if(r=e.get("EXT_texture_compression_rgtc"),r!==null){if(n===Bl)return r.COMPRESSED_RED_RGTC1_EXT;if(n===Ol)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===Ro)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===kl)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===gr?s.UNSIGNED_INT_24_8:s[n]!==void 0?s[n]:null}return{convert:t}}var Jv=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,jv=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`,iu=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){let n=new ao(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=n}}getMesh(e){if(this.texture!==null&&this.mesh===null){let t=e.cameras[0].viewport,n=new ft({vertexShader:Jv,fragmentShader:jv,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new Be(new Qt(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},su=class extends Hn{constructor(e,t){super();let n=this,i=null,r=1,o=null,a="local-floor",l=1,c=null,h=null,u=null,d=null,f=null,g=null,_=typeof XRWebGLBinding<"u",m=new iu,p={},b=t.getContextAttributes(),T=null,x=null,S=[],M=[],A=new Te,v=null,w=null,R=new zt;R.viewport=new dt;let L=new zt;L.viewport=new dt;let P=[R,L],N=new Za,I=null,H=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(Z){let Q=S[Z];return Q===void 0&&(Q=new tr,S[Z]=Q),Q.getTargetRaySpace()},this.getControllerGrip=function(Z){let Q=S[Z];return Q===void 0&&(Q=new tr,S[Z]=Q),Q.getGripSpace()},this.getHand=function(Z){let Q=S[Z];return Q===void 0&&(Q=new tr,S[Z]=Q),Q.getHandSpace()};function V(Z){let Q=M.indexOf(Z.inputSource);if(Q===-1)return;let ye=S[Q];ye!==void 0&&(ye.update(Z.inputSource,Z.frame,c||o),ye.dispatchEvent({type:Z.type,data:Z.inputSource}))}function q(){i.removeEventListener("select",V),i.removeEventListener("selectstart",V),i.removeEventListener("selectend",V),i.removeEventListener("squeeze",V),i.removeEventListener("squeezestart",V),i.removeEventListener("squeezeend",V),i.removeEventListener("end",q),i.removeEventListener("inputsourceschange",ee);for(let Z=0;Z<S.length;Z++){let Q=M[Z];Q!==null&&(M[Z]=null,S[Z].disconnect(Q))}I=null,H=null,m.reset();for(let Z in p)delete p[Z];if(e.setRenderTarget(T),f=null,d=null,u=null,i=null,x=null,tt.stop(),n.isPresenting=!1,e.setPixelRatio(v),e.setSize(A.width,A.height,!1),w!==null){let Z=w.camera;Z.fov=w.fov,Z.zoom=w.zoom,Z.updateProjectionMatrix(),w=null}n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(Z){r=Z,n.isPresenting===!0&&De("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(Z){a=Z,n.isPresenting===!0&&De("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||o},this.setReferenceSpace=function(Z){c=Z},this.getBaseLayer=function(){return d!==null?d:f},this.getBinding=function(){return u===null&&_&&(u=new XRWebGLBinding(i,t)),u},this.getFrame=function(){return g},this.getSession=function(){return i},this.setSession=async function(Z){if(i=Z,i!==null){if(T=e.getRenderTarget(),i.addEventListener("select",V),i.addEventListener("selectstart",V),i.addEventListener("selectend",V),i.addEventListener("squeeze",V),i.addEventListener("squeezestart",V),i.addEventListener("squeezeend",V),i.addEventListener("end",q),i.addEventListener("inputsourceschange",ee),b.xrCompatible!==!0&&await t.makeXRCompatible(),v=e.getPixelRatio(),e.getSize(A),_&&"createProjectionLayer"in XRWebGLBinding.prototype){let ye=null,Oe=null,ve=null;b.depth&&(ve=b.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,ye=b.stencil?Wi:$n,Oe=b.stencil?gr:Wn);let ze={colorFormat:t.RGBA8,depthFormat:ve,scaleFactor:r};u=this.getBinding(),d=u.createProjectionLayer(ze),i.updateRenderState({layers:[d]}),e.setPixelRatio(1),e.setSize(d.textureWidth,d.textureHeight,!1),x=new Dt(d.textureWidth,d.textureHeight,{format:Sn,type:on,depthTexture:new zi(d.textureWidth,d.textureHeight,Oe,void 0,void 0,void 0,void 0,void 0,void 0,ye),stencilBuffer:b.stencil,colorSpace:e.outputColorSpace,samples:b.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1,storeMultisampledDepthBuffer:d.ignoreDepthValues===!1,storeMultisampledStencilBuffer:d.ignoreDepthValues===!1})}else{let ye={antialias:b.antialias,alpha:!0,depth:b.depth,stencil:b.stencil,framebufferScaleFactor:r};f=new XRWebGLLayer(i,t,ye),i.updateRenderState({baseLayer:f}),e.setPixelRatio(1),e.setSize(f.framebufferWidth,f.framebufferHeight,!1),x=new Dt(f.framebufferWidth,f.framebufferHeight,{format:Sn,type:on,colorSpace:e.outputColorSpace,stencilBuffer:b.stencil,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1,storeMultisampledDepthBuffer:f.ignoreDepthValues===!1,storeMultisampledStencilBuffer:f.ignoreDepthValues===!1})}x.isXRRenderTarget=!0,this.setFoveation(l),c=null,o=await i.requestReferenceSpace(a),tt.setContext(i),tt.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(i!==null)return i.environmentBlendMode},this.getDepthTexture=function(){return m.getDepthTexture()};function ee(Z){for(let Q=0;Q<Z.removed.length;Q++){let ye=Z.removed[Q],Oe=M.indexOf(ye);Oe>=0&&(M[Oe]=null,S[Oe].disconnect(ye))}for(let Q=0;Q<Z.added.length;Q++){let ye=Z.added[Q],Oe=M.indexOf(ye);if(Oe===-1){for(let ze=0;ze<S.length;ze++)if(ze>=M.length){M.push(ye),Oe=ze;break}else if(M[ze]===null){M[ze]=ye,Oe=ze;break}if(Oe===-1)break}let ve=S[Oe];ve&&ve.connect(ye)}}let k=new D,te=new D;function re(Z,Q,ye){k.setFromMatrixPosition(Q.matrixWorld),te.setFromMatrixPosition(ye.matrixWorld);let Oe=k.distanceTo(te),ve=Q.projectionMatrix.elements,ze=ye.projectionMatrix.elements,pt=ve[14]/(ve[10]-1),Fe=ve[14]/(ve[10]+1),Ye=(ve[9]+1)/ve[5],rt=(ve[9]-1)/ve[5],We=(ve[8]-1)/ve[0],ot=(ze[8]+1)/ze[0],Pt=pt*We,Jt=pt*ot,at=Oe/(-We+ot),It=at*-We;if(Q.matrixWorld.decompose(Z.position,Z.quaternion,Z.scale),Z.translateX(It),Z.translateZ(at),Z.matrixWorld.compose(Z.position,Z.quaternion,Z.scale),Z.matrixWorldInverse.copy(Z.matrixWorld).invert(),ve[10]===-1)Z.projectionMatrix.copy(Q.projectionMatrix),Z.projectionMatrixInverse.copy(Q.projectionMatrixInverse);else{let O=pt+at,Et=Fe+at,nt=Pt-It,C=Jt+(Oe-It),y=Ye*Fe/Et*O,z=rt*Fe/Et*O;Z.projectionMatrix.makePerspective(nt,C,y,z,O,Et),Z.projectionMatrixInverse.copy(Z.projectionMatrix).invert()}}function Ee(Z,Q){Q===null?Z.matrixWorld.copy(Z.matrix):Z.matrixWorld.multiplyMatrices(Q.matrixWorld,Z.matrix),Z.matrixWorldInverse.copy(Z.matrixWorld).invert()}this.updateCamera=function(Z){if(i===null)return;let Q=Z.near,ye=Z.far;m.texture!==null&&(m.depthNear>0&&(Q=m.depthNear),m.depthFar>0&&(ye=m.depthFar)),N.near=L.near=R.near=Q,N.far=L.far=R.far=ye,(I!==N.near||H!==N.far)&&(i.updateRenderState({depthNear:N.near,depthFar:N.far}),I=N.near,H=N.far),N.layers.mask=Z.layers.mask|6,R.layers.mask=N.layers.mask&-5,L.layers.mask=N.layers.mask&-3;let Oe=Z.parent,ve=N.cameras;Ee(N,Oe);for(let ze=0;ze<ve.length;ze++)Ee(ve[ze],Oe);ve.length===2?re(N,R,L):N.projectionMatrix.copy(R.projectionMatrix),w===null&&Z.isPerspectiveCamera&&(w={camera:Z,fov:Z.fov,zoom:Z.zoom}),Re(Z,N,Oe)};function Re(Z,Q,ye){ye===null?Z.matrix.copy(Q.matrixWorld):(Z.matrix.copy(ye.matrixWorld),Z.matrix.invert(),Z.matrix.multiply(Q.matrixWorld)),Z.matrix.decompose(Z.position,Z.quaternion,Z.scale),Z.updateMatrixWorld(!0),Z.projectionMatrix.copy(Q.projectionMatrix),Z.projectionMatrixInverse.copy(Q.projectionMatrixInverse),Z.isPerspectiveCamera&&(Z.fov=ls*2*Math.atan(1/Z.projectionMatrix.elements[5]),Z.zoom=1)}this.getCamera=function(){return N},this.getFoveation=function(){if(!(d===null&&f===null))return l},this.setFoveation=function(Z){l=Z,d!==null&&(d.fixedFoveation=Z),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=Z)},this.hasDepthSensing=function(){return m.texture!==null},this.getDepthSensingMesh=function(){return m.getMesh(N)},this.getCameraTexture=function(Z){return p[Z]};let ht=null;function et(Z,Q){if(h=Q.getViewerPose(c||o),g=Q,h!==null){let ye=h.views;f!==null&&(e.setRenderTargetFramebuffer(x,f.framebuffer),e.setRenderTarget(x));let Oe=!1;ye.length!==N.cameras.length&&(N.cameras.length=0,Oe=!0);for(let Fe=0;Fe<ye.length;Fe++){let Ye=ye[Fe],rt=null;if(f!==null)rt=f.getViewport(Ye);else{let ot=u.getViewSubImage(d,Ye);rt=ot.viewport,Fe===0&&(e.setRenderTargetTextures(x,ot.colorTexture,ot.depthStencilTexture),e.setRenderTarget(x))}let We=P[Fe];We===void 0&&(We=new zt,We.layers.enable(Fe),We.viewport=new dt,P[Fe]=We),We.matrix.fromArray(Ye.transform.matrix),We.matrix.decompose(We.position,We.quaternion,We.scale),We.projectionMatrix.fromArray(Ye.projectionMatrix),We.projectionMatrixInverse.copy(We.projectionMatrix).invert(),We.viewport.set(rt.x,rt.y,rt.width,rt.height),Fe===0&&(N.matrix.copy(We.matrix),N.matrix.decompose(N.position,N.quaternion,N.scale)),Oe===!0&&N.cameras.push(We)}let ve=i.enabledFeatures;if(ve&&ve.includes("depth-sensing")&&i.depthUsage=="gpu-optimized"&&_){u=n.getBinding();let Fe=u.getDepthInformation(ye[0]);Fe&&Fe.isValid&&Fe.texture&&m.init(Fe,i.renderState)}if(ve&&ve.includes("camera-access")&&_){e.state.unbindTexture(),u=n.getBinding();for(let Fe=0;Fe<ye.length;Fe++){let Ye=ye[Fe].camera;if(Ye){let rt=p[Ye];rt||(rt=new ao,p[Ye]=rt);let We=u.getCameraImage(Ye);rt.sourceTexture=We}}}}for(let ye=0;ye<S.length;ye++){let Oe=M[ye],ve=S[ye];Oe!==null&&ve!==void 0&&ve.update(Oe,Q,c||o)}ht&&ht(Z,Q),Q.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:Q}),g=null}let tt=new jf;tt.setAnimationLoop(et),this.setAnimationLoop=function(Z){ht=Z},this.dispose=function(){}}},Qv=new Ge,sp=new He;sp.set(-1,0,0,0,1,0,0,0,1);function ey(s,e){function t(m,p){m.matrixAutoUpdate===!0&&m.updateMatrix(),p.value.copy(m.matrix)}function n(m,p){p.color.getRGB(m.fogColor.value,Uh(s)),p.isFog?(m.fogNear.value=p.near,m.fogFar.value=p.far):p.isFogExp2&&(m.fogDensity.value=p.density)}function i(m,p,b,T,x){p.isNodeMaterial?p.uniformsNeedUpdate=!1:p.isMeshBasicMaterial?r(m,p):p.isMeshLambertMaterial?(r(m,p),p.envMap&&(m.envMapIntensity.value=p.envMapIntensity)):p.isMeshToonMaterial?(r(m,p),u(m,p)):p.isMeshPhongMaterial?(r(m,p),h(m,p),p.envMap&&(m.envMapIntensity.value=p.envMapIntensity)):p.isMeshStandardMaterial?(r(m,p),d(m,p),p.isMeshPhysicalMaterial&&f(m,p,x)):p.isMeshMatcapMaterial?(r(m,p),g(m,p)):p.isMeshDepthMaterial?r(m,p):p.isMeshDistanceMaterial?(r(m,p),_(m,p)):p.isMeshNormalMaterial?r(m,p):p.isLineBasicMaterial?(o(m,p),p.isLineDashedMaterial&&a(m,p)):p.isPointsMaterial?l(m,p,b,T):p.isSpriteMaterial?c(m,p):p.isShadowMaterial?(m.color.value.copy(p.color),m.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function r(m,p){m.opacity.value=p.opacity,p.color&&m.diffuse.value.copy(p.color),p.emissive&&m.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(m.map.value=p.map,t(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.bumpMap&&(m.bumpMap.value=p.bumpMap,t(p.bumpMap,m.bumpMapTransform),m.bumpScale.value=p.bumpScale,p.side===Ft&&(m.bumpScale.value*=-1)),p.normalMap&&(m.normalMap.value=p.normalMap,t(p.normalMap,m.normalMapTransform),m.normalScale.value.copy(p.normalScale),p.side===Ft&&m.normalScale.value.negate()),p.displacementMap&&(m.displacementMap.value=p.displacementMap,t(p.displacementMap,m.displacementMapTransform),m.displacementScale.value=p.displacementScale,m.displacementBias.value=p.displacementBias),p.emissiveMap&&(m.emissiveMap.value=p.emissiveMap,t(p.emissiveMap,m.emissiveMapTransform)),p.specularMap&&(m.specularMap.value=p.specularMap,t(p.specularMap,m.specularMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest);let b=e.get(p),T=b.envMap,x=b.envMapRotation;T&&(m.envMap.value=T,m.envMapRotation.value.setFromMatrix4(Qv.makeRotationFromEuler(x)).transpose(),T.isCubeTexture&&T.isRenderTargetTexture===!1&&m.envMapRotation.value.premultiply(sp),m.reflectivity.value=p.reflectivity,m.ior.value=p.ior,m.refractionRatio.value=p.refractionRatio),p.lightMap&&(m.lightMap.value=p.lightMap,m.lightMapIntensity.value=p.lightMapIntensity,t(p.lightMap,m.lightMapTransform)),p.aoMap&&(m.aoMap.value=p.aoMap,m.aoMapIntensity.value=p.aoMapIntensity,t(p.aoMap,m.aoMapTransform))}function o(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,p.map&&(m.map.value=p.map,t(p.map,m.mapTransform))}function a(m,p){m.dashSize.value=p.dashSize,m.totalSize.value=p.dashSize+p.gapSize,m.scale.value=p.scale}function l(m,p,b,T){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.size.value=p.size*b,m.scale.value=T*.5,p.map&&(m.map.value=p.map,t(p.map,m.uvTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function c(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.rotation.value=p.rotation,p.map&&(m.map.value=p.map,t(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function h(m,p){m.specular.value.copy(p.specular),m.shininess.value=Math.max(p.shininess,1e-4)}function u(m,p){p.gradientMap&&(m.gradientMap.value=p.gradientMap)}function d(m,p){m.metalness.value=p.metalness,p.metalnessMap&&(m.metalnessMap.value=p.metalnessMap,t(p.metalnessMap,m.metalnessMapTransform)),m.roughness.value=p.roughness,p.roughnessMap&&(m.roughnessMap.value=p.roughnessMap,t(p.roughnessMap,m.roughnessMapTransform)),p.envMap&&(m.envMapIntensity.value=p.envMapIntensity)}function f(m,p,b){m.ior.value=p.ior,p.sheen>0&&(m.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),m.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(m.sheenColorMap.value=p.sheenColorMap,t(p.sheenColorMap,m.sheenColorMapTransform)),p.sheenRoughnessMap&&(m.sheenRoughnessMap.value=p.sheenRoughnessMap,t(p.sheenRoughnessMap,m.sheenRoughnessMapTransform))),p.clearcoat>0&&(m.clearcoat.value=p.clearcoat,m.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(m.clearcoatMap.value=p.clearcoatMap,t(p.clearcoatMap,m.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,t(p.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(m.clearcoatNormalMap.value=p.clearcoatNormalMap,t(p.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===Ft&&m.clearcoatNormalScale.value.negate())),p.dispersion>0&&(m.dispersion.value=p.dispersion),p.retroreflectivity>0&&(m.retroreflectivity.value=p.retroreflectivity),p.iridescence>0&&(m.iridescence.value=p.iridescence,m.iridescenceIOR.value=p.iridescenceIOR,m.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(m.iridescenceMap.value=p.iridescenceMap,t(p.iridescenceMap,m.iridescenceMapTransform)),p.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=p.iridescenceThicknessMap,t(p.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),p.transmission>0&&(m.transmission.value=p.transmission,m.transmissionSamplerMap.value=b.texture,m.transmissionSamplerSize.value.set(b.width,b.height),p.transmissionMap&&(m.transmissionMap.value=p.transmissionMap,t(p.transmissionMap,m.transmissionMapTransform)),m.thickness.value=p.thickness,p.thicknessMap&&(m.thicknessMap.value=p.thicknessMap,t(p.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=p.attenuationDistance,m.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(m.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(m.anisotropyMap.value=p.anisotropyMap,t(p.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=p.specularIntensity,m.specularColor.value.copy(p.specularColor),p.specularColorMap&&(m.specularColorMap.value=p.specularColorMap,t(p.specularColorMap,m.specularColorMapTransform)),p.specularIntensityMap&&(m.specularIntensityMap.value=p.specularIntensityMap,t(p.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,p){p.matcap&&(m.matcap.value=p.matcap)}function _(m,p){let b=e.get(p).light;m.referencePosition.value.setFromMatrixPosition(b.matrixWorld),m.nearDistance.value=b.shadow.camera.near,m.farDistance.value=b.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:i}}function ty(s,e,t,n){let i={},r={},o=[],a=s.getParameter(s.MAX_UNIFORM_BUFFER_BINDINGS);function l(x,S){let M=S.program;n.uniformBlockBinding(x,M)}function c(x,S){let M=i[x.id];M===void 0&&(m(x),M=h(x),i[x.id]=M,x.addEventListener("dispose",b));let A=S.program;n.updateUBOMapping(x,A);let v=e.render.frame;r[x.id]!==v&&(d(x),r[x.id]=v)}function h(x){let S=u();x.__bindingPointIndex=S;let M=s.createBuffer(),A=x.__size,v=x.usage;return s.bindBuffer(s.UNIFORM_BUFFER,M),s.bufferData(s.UNIFORM_BUFFER,A,v),s.bindBuffer(s.UNIFORM_BUFFER,null),s.bindBufferBase(s.UNIFORM_BUFFER,S,M),M}function u(){for(let x=0;x<a;x++)if(o.indexOf(x)===-1)return o.push(x),x;return ke("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(x){let S=i[x.id],M=x.uniforms,A=x.__cache;s.bindBuffer(s.UNIFORM_BUFFER,S);for(let v=0,w=M.length;v<w;v++){let R=M[v];if(Array.isArray(R))for(let L=0,P=R.length;L<P;L++)f(R[L],v,L,A);else f(R,v,0,A)}s.bindBuffer(s.UNIFORM_BUFFER,null)}function f(x,S,M,A){if(_(x,S,M,A)===!0){let v=x.__offset,w=x.value;if(Array.isArray(w)){let R=0;for(let L=0;L<w.length;L++){let P=w[L],N=p(P);g(P,x.__data,R),typeof P!="number"&&typeof P!="boolean"&&!P.isMatrix3&&!ArrayBuffer.isView(P)&&(R+=N.storage/Float32Array.BYTES_PER_ELEMENT)}}else g(w,x.__data,0);s.bufferSubData(s.UNIFORM_BUFFER,v,x.__data)}}function g(x,S,M){typeof x=="number"||typeof x=="boolean"?S[0]=x:x.isMatrix3?(S[0]=x.elements[0],S[1]=x.elements[1],S[2]=x.elements[2],S[3]=0,S[4]=x.elements[3],S[5]=x.elements[4],S[6]=x.elements[5],S[7]=0,S[8]=x.elements[6],S[9]=x.elements[7],S[10]=x.elements[8],S[11]=0):ArrayBuffer.isView(x)?S.set(new x.constructor(x.buffer,x.byteOffset,S.length)):x.toArray(S,M)}function _(x,S,M,A){let v=x.value,w=S+"_"+M;if(A[w]===void 0)return typeof v=="number"||typeof v=="boolean"?A[w]=v:ArrayBuffer.isView(v)?A[w]=v.slice():A[w]=v.clone(),!0;{let R=A[w];if(typeof v=="number"||typeof v=="boolean"){if(R!==v)return A[w]=v,!0}else{if(ArrayBuffer.isView(v))return!0;if(R.equals(v)===!1)return R.copy(v),!0}}return!1}function m(x){let S=x.uniforms,M=0,A=16;for(let w=0,R=S.length;w<R;w++){let L=Array.isArray(S[w])?S[w]:[S[w]];for(let P=0,N=L.length;P<N;P++){let I=L[P],H=Array.isArray(I.value)?I.value:[I.value];for(let V=0,q=H.length;V<q;V++){let ee=H[V],k=p(ee),te=M%A,re=te%k.boundary,Ee=te+re;M+=re,Ee!==0&&A-Ee<k.storage&&(M+=A-Ee),I.__data=new Float32Array(k.storage/Float32Array.BYTES_PER_ELEMENT),I.__offset=M,M+=k.storage}}}let v=M%A;return v>0&&(M+=A-v),x.__size=M,x.__cache={},this}function p(x){let S={boundary:0,storage:0};return typeof x=="number"||typeof x=="boolean"?(S.boundary=4,S.storage=4):x.isVector2?(S.boundary=8,S.storage=8):x.isVector3||x.isColor?(S.boundary=16,S.storage=12):x.isVector4?(S.boundary=16,S.storage=16):x.isMatrix3?(S.boundary=48,S.storage=48):x.isMatrix4?(S.boundary=64,S.storage=64):x.isTexture?De("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(x)?(S.boundary=16,S.storage=x.byteLength):De("WebGLRenderer: Unsupported uniform value type.",x),S}function b(x){let S=x.target;S.removeEventListener("dispose",b);let M=o.indexOf(S.__bindingPointIndex);o.splice(M,1),s.deleteBuffer(i[S.id]),delete i[S.id],delete r[S.id]}function T(){for(let x in i)s.deleteBuffer(i[x]);o=[],i={},r={}}return{bind:l,update:c,dispose:T}}var ny=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]),ii=null;function iy(){return ii===null&&(ii=new ki(ny,16,16,Xi,Vt),ii.name="DFG_LUT",ii.minFilter=Ut,ii.magFilter=Ut,ii.wrapS=An,ii.wrapT=An,ii.generateMipmaps=!1,ii.needsUpdate=!0),ii}var Yl=class{constructor(e={}){let{canvas:t=Tf(),context:n=null,depth:i=!0,stencil:r=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:u=!1,reversedDepthBuffer:d=!1,outputBufferType:f=on}=e;this.isWebGLRenderer=!0;let g;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");g=n.getContextAttributes().alpha}else g=o;let _=f,m=new Set([cl,ll,al]),p=new Set([on,Wn,mr,gr,rl,ol]),b=new Uint32Array(4),T=new Int32Array(4),x=new D,S=null,M=null,A=[],v=[],w=null;this.domElement=t,this.debug={checkShaderErrors:!0,diagnostics:{keywords:!1},onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=Vn,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let R=this,L=!1,P=null,N=null,I=null,H=null;this._outputColorSpace=Mt;let V=0,q=0,ee=null,k=-1,te=null,re=new dt,Ee=new dt,Re=null,ht=new de(0),et=0,tt=t.width,Z=t.height,Q=1,ye=null,Oe=null,ve=new dt(0,0,tt,Z),ze=new dt(0,0,tt,Z),pt=!1,Fe=new or,Ye=!1,rt=!1,We=new Ge,ot=new D,Pt=new dt,Jt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},at=!1;function It(){return ee===null?Q:1}let O=n;function Et(E,U){return t.getContext(E,U)}let nt,C,y,z,X,$,le,ae,J,se,ue,Ce,pe,he,Pe,Ue,Ve,F,fe,ie,ce,me,oe;try{let E={alpha:!0,depth:i,stencil:r,antialias:a,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:u};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${"186"}`),t.addEventListener("webglcontextlost",be,!1),t.addEventListener("webglcontextrestored",Le,!1),t.addEventListener("webglcontextcreationerror",mt,!1),O===null){let U="webgl2";if(O=Et(U,E),O===null)throw Et(U)?new Error("THREE.WebGLRenderer: Error creating WebGL context with your selected attributes."):new Error("THREE.WebGLRenderer: Error creating WebGL context.")}Ne()}catch(E){throw t.removeEventListener("webglcontextlost",be,!1),t.removeEventListener("webglcontextrestored",Le,!1),t.removeEventListener("webglcontextcreationerror",mt,!1),ke("WebGLRenderer: "+E.message),E}function Ne(){nt=new hx(O),nt.init(),ce=new $v(O,nt),C=new ex(O,nt,e,ce),y=new Kv(O,nt),C.reversedDepthBuffer&&d&&y.buffers.depth.setReversed(!0),N=O.createFramebuffer(),I=O.createFramebuffer(),H=O.createFramebuffer(),z=new fx(O),X=new Nv,$=new Zv(O,nt,y,X,C,ce,z),le=new cx(R),ae=new mg(O),me=new j_(O,ae),J=new ux(O,ae,z,me),se=new mx(O,J,ae,me,z),F=new px(O,C,$),Pe=new tx(X),ue=new Dv(R,le,nt,C,me,Pe),Ce=new ey(R,X),pe=new Fv,he=new Vv(nt),Ve=new J_(R,le,y,se,g,l),Ue=new Yv(R,se,C),oe=new ty(O,z,C,y),fe=new Q_(O,nt,z),ie=new dx(O,nt,z),z.programs=ue.programs,R.capabilities=C,R.extensions=nt,R.properties=X,R.renderLists=pe,R.shadowMap=Ue,R.state=y,R.info=z}_!==on&&(w=new _x(_,t.width,t.height,a,i,r));let Y=new su(R,O);this.xr=Y,this.getContext=function(){return O},this.getContextAttributes=function(){return O.getContextAttributes()},this.forceContextLoss=function(){let E=nt.get("WEBGL_lose_context");E&&E.loseContext()},this.forceContextRestore=function(){let E=nt.get("WEBGL_lose_context");E&&E.restoreContext()},this.getPixelRatio=function(){return Q},this.setPixelRatio=function(E){E!==void 0&&(Q=E,this.setSize(tt,Z,!1))},this.getSize=function(E){return E.set(tt,Z)},this.setSize=function(E,U,K=!0){if(Y.isPresenting){De("WebGLRenderer: Can't change size while VR device is presenting.");return}tt=E,Z=U,t.width=Math.floor(E*Q),t.height=Math.floor(U*Q),K===!0&&(t.style.width=E+"px",t.style.height=U+"px"),w!==null&&w.setSize(t.width,t.height),this.setViewport(0,0,E,U)},this.getDrawingBufferSize=function(E){return E.set(tt*Q,Z*Q).floor()},this.setDrawingBufferSize=function(E,U,K){tt=E,Z=U,Q=K,t.width=Math.floor(E*K),t.height=Math.floor(U*K),this.setViewport(0,0,E,U)},this.setEffects=function(E){if(_===on){ke("WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(E){for(let U=0;U<E.length;U++)if(E[U].isOutputPass===!0){De("WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}w.setEffects(E||[])},this.getCurrentViewport=function(E){return E.copy(re)},this.getViewport=function(E){return E.copy(ve)},this.setViewport=function(E,U,K,G){E.isVector4?ve.set(E.x,E.y,E.z,E.w):ve.set(E,U,K,G),y.viewport(re.copy(ve).multiplyScalar(Q).round())},this.getScissor=function(E){return E.copy(ze)},this.setScissor=function(E,U,K,G){E.isVector4?ze.set(E.x,E.y,E.z,E.w):ze.set(E,U,K,G),y.scissor(Ee.copy(ze).multiplyScalar(Q).round())},this.getScissorTest=function(){return pt},this.setScissorTest=function(E){y.setScissorTest(pt=E)},this.setOpaqueSort=function(E){ye=E},this.setTransparentSort=function(E){Oe=E},this.getClearColor=function(E){return E.copy(Ve.getClearColor())},this.setClearColor=function(){Ve.setClearColor(...arguments)},this.getClearAlpha=function(){return Ve.getClearAlpha()},this.setClearAlpha=function(){Ve.setClearAlpha(...arguments)},this.clear=function(E=!0,U=!0,K=!0){let G=0;if(E){let W=!1;if(ee!==null){let xe=ee.texture.format;W=m.has(xe)}if(W){let xe=ee.texture.type,Se=p.has(xe),_e=Ve.getClearColor(),we=Ve.getClearAlpha(),Ie=_e.r,Xe=_e.g,Je=_e.b;Se?(b[0]=Ie,b[1]=Xe,b[2]=Je,b[3]=we,O.clearBufferuiv(O.COLOR,0,b)):(T[0]=Ie,T[1]=Xe,T[2]=Je,T[3]=we,O.clearBufferiv(O.COLOR,0,T))}else G|=O.COLOR_BUFFER_BIT}U&&(G|=O.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),K&&(G|=O.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),G!==0&&O.clear(G)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(E){E.setRenderer(this),P=E},this.dispose=function(){t.removeEventListener("webglcontextlost",be,!1),t.removeEventListener("webglcontextrestored",Le,!1),t.removeEventListener("webglcontextcreationerror",mt,!1),Ve.dispose(),pe.dispose(),he.dispose(),X.dispose(),le.dispose(),se.dispose(),me.dispose(),oe.dispose(),ue.dispose(),Y.dispose(),Y.removeEventListener("sessionstart",Br),Y.removeEventListener("sessionend",ln),pn.stop()};function be(E){E.preventDefault(),$r("WebGLRenderer: Context Lost."),L=!0}function Le(){$r("WebGLRenderer: Context Restored."),L=!1;let E=z.autoReset,U=Ue.enabled,K=Ue.autoUpdate,G=Ue.needsUpdate,W=Ue.type;Ne(),z.autoReset=E,Ue.enabled=U,Ue.autoUpdate=K,Ue.needsUpdate=G,Ue.type=W}function mt(E){ke("WebGLRenderer: A WebGL context could not be created. Reason: ",E.statusMessage)}function Zt(E){let U=E.target;U.removeEventListener("dispose",Zt),At(U)}function At(E){Yo(E),X.remove(E)}function Yo(E){let U=X.get(E).programs;U!==void 0&&(U.forEach(function(K){ue.releaseProgram(K)}),E.isShaderMaterial&&ue.releaseShaderCache(E))}this.renderBufferDirect=function(E,U,K,G,W,xe){U===null&&(U=Jt);let Se=W.isMesh&&W.matrixWorld.determinantAffine()<0,_e=sm(E,U,K,G,W);y.setMaterial(G,Se);let we=K.index,Ie=1;if(G.wireframe===!0){if(we=J.getWireframeAttribute(K),we===void 0)return;Ie=2}let Xe=K.drawRange,Je=K.attributes.position,Ae=Xe.start*Ie,lt=(Xe.start+Xe.count)*Ie;xe!==null&&(Ae=Math.max(Ae,xe.start*Ie),lt=Math.min(lt,(xe.start+xe.count)*Ie)),we!==null?(Ae=Math.max(Ae,0),lt=Math.min(lt,we.count)):Je!=null&&(Ae=Math.max(Ae,0),lt=Math.min(lt,Je.count));let Ot=lt-Ae;if(Ot<0||Ot===1/0)return;me.setup(W,G,_e,K,we);let wt,vt=fe;if(we!==null&&(wt=ae.get(we),vt=ie,vt.setIndex(wt)),W.isMesh)G.wireframe===!0?(y.setLineWidth(G.wireframeLinewidth*It()),vt.setMode(O.LINES)):vt.setMode(O.TRIANGLES);else if(W.isLine){let en=G.linewidth;en===void 0&&(en=1),y.setLineWidth(en*It()),W.isLineSegments?vt.setMode(O.LINES):W.isLineLoop?vt.setMode(O.LINE_LOOP):vt.setMode(O.LINE_STRIP)}else W.isPoints?vt.setMode(O.POINTS):W.isSprite&&vt.setMode(O.TRIANGLES);if(W.isBatchedMesh)if(nt.get("WEBGL_multi_draw"))vt.renderMultiDraw(W._multiDrawStarts,W._multiDrawCounts,W._multiDrawCount);else{let en=W._multiDrawStarts,Me=W._multiDrawCounts,cn=W._multiDrawCount,it=we?ae.get(we).bytesPerElement:1,En=X.get(G).currentProgram.getUniforms();for(let Yn=0;Yn<cn;Yn++)En.setValue(O,"_gl_DrawID",Yn),vt.render(en[Yn]/it,Me[Yn])}else if(W.isInstancedMesh)vt.renderInstances(Ae,Ot,W.count);else if(K.isInstancedBufferGeometry){let en=K._maxInstanceCount!==void 0?K._maxInstanceCount:1/0,Me=Math.min(K.instanceCount,en);vt.renderInstances(Ae,Ot,Me)}else vt.render(Ae,Ot)};function Fr(E,U,K,G){P!==null&&E.isNodeMaterial&&P.setObject(G,E),Ye===!0&&Pe.setState(E,K,!1),E.transparent===!0&&E.side===xn&&E.forceSinglePass===!1?(E.side=Ft,E.needsUpdate=!0,$o(E,U,G),E.side=ti,E.needsUpdate=!0,$o(E,U,G),E.side=xn):$o(E,U,G)}this.compile=function(E,U,K=null){K===null&&(K=E),P!==null&&P.renderStart(E,U,K),M=he.get(K),M.init(U),v.push(M),K.traverseVisible(function(W){W.isLight&&W.layers.test(U.layers)&&(M.pushLight(W),W.castShadow&&M.pushShadow(W))}),E!==K&&E.traverseVisible(function(W){W.isLight&&W.layers.test(U.layers)&&(M.pushLight(W),W.castShadow&&M.pushShadow(W))}),M.setupLights(),P!==null&&P.updateLights(M.state.lightsArray),rt=this.localClippingEnabled,Ye=Pe.init(this.clippingPlanes,rt),Ye===!0&&Pe.setGlobalState(this.clippingPlanes,U),P!==null&&Ue.render(M.state.shadowsArray,K,U);let G=new Set;return E.traverse(function(W){if(!(W.isMesh||W.isPoints||W.isLine||W.isSprite))return;let xe=W.material;if(xe)if(Array.isArray(xe))for(let Se=0;Se<xe.length;Se++){let _e=xe[Se];Fr(_e,K,U,W),G.add(_e)}else Fr(xe,K,U,W),G.add(xe)}),M=v.pop(),P!==null&&P.renderEnd(),G},this.compileAsync=function(E,U,K=null){let G=this.compile(E,U,K);return new Promise(W=>{function xe(){if(G.forEach(function(Se){let we=X.get(Se).currentProgram;(we===void 0||we.isReady())&&G.delete(Se)}),G.size===0){W(E);return}setTimeout(xe,10)}nt.get("KHR_parallel_shader_compile")!==null?xe():setTimeout(xe,10)})};let Ri=null;function Dc(E){Ri&&Ri(E)}function Br(){pn.stop()}function ln(){pn.start()}let pn=new jf;pn.setAnimationLoop(Dc),typeof self<"u"&&pn.setContext(self),this.setAnimationLoop=function(E){Ri=E,Y.setAnimationLoop(E),E===null?pn.stop():pn.start()},Y.addEventListener("sessionstart",Br),Y.addEventListener("sessionend",ln),this.render=function(E,U){if(U!==void 0&&U.isCamera!==!0){ke("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(L===!0)return;P!==null&&P.renderStart(E,U);let K=Y.enabled===!0&&Y.isPresenting===!0,G=w!==null&&(ee===null||K)&&w.begin(R,ee);if(E.matrixWorldAutoUpdate===!0&&E.updateMatrixWorld(),U.parent===null&&U.matrixWorldAutoUpdate===!0&&U.updateMatrixWorld(),Y.enabled===!0&&Y.isPresenting===!0&&(w===null||w.isCompositing()===!1)&&(Y.cameraAutoUpdate===!0&&Y.updateCamera(U),U=Y.getCamera()),E.isScene===!0&&E.onBeforeRender(R,E,U,ee),M=he.get(E,v.length),M.init(U),M.state.textureUnits=$.getTextureUnits(),v.push(M),We.multiplyMatrices(U.projectionMatrix,U.matrixWorldInverse),Fe.setFromProjectionMatrix(We,On,U.reversedDepth),rt=this.localClippingEnabled,Ye=Pe.init(this.clippingPlanes,rt),S=pe.get(E,A.length),S.init(),A.push(S),Y.enabled===!0&&Y.isPresenting===!0){let Se=R.xr.getDepthSensingMesh();Se!==null&&jt(Se,U,-1/0,R.sortObjects)}jt(E,U,0,R.sortObjects),S.finish(),P!==null&&P.updateLights(M.state.lightsArray),R.sortObjects===!0&&S.sort(ye,Oe),at=Y.enabled===!1||Y.isPresenting===!1||Y.hasDepthSensing()===!1,at&&Ve.addToRenderList(S,E),this.info.render.frame++,this.info.autoReset===!0&&this.info.reset(),Ye===!0&&Pe.beginShadows();let W=M.state.shadowsArray;if(Ue.render(W,E,U),Ye===!0&&Pe.endShadows(),(G&&w.hasRenderPass())===!1){let Se=S.opaque,_e=S.transmissive;if(M.setupLights(),U.isArrayCamera){let we=U.cameras;if(_e.length>0)for(let Ie=0,Xe=we.length;Ie<Xe;Ie++){let Je=we[Ie];Qu(Se,_e,E,Je)}at&&Ve.render(E);for(let Ie=0,Xe=we.length;Ie<Xe;Ie++){let Je=we[Ie];Ko(S,E,Je,Je.viewport)}}else _e.length>0&&Qu(Se,_e,E,U),at&&Ve.render(E),Ko(S,E,U)}ee!==null&&q===0&&($.updateMultisampleRenderTarget(ee),$.updateRenderTargetMipmap(ee)),G&&w.end(R),E.isScene===!0&&E.onAfterRender(R,E,U),me.resetDefaultState(),k=-1,te=null,v.pop(),v.length>0?(M=v[v.length-1],$.setTextureUnits(M.state.textureUnits),Ye===!0&&Pe.setGlobalState(R.clippingPlanes,M.state.camera)):M=null,A.pop(),A.length>0?S=A[A.length-1]:S=null,P!==null&&P.renderEnd()};function jt(E,U,K,G){if(E.visible===!1)return;if(E.layers.test(U.layers)){if(E.isGroup)K=E.renderOrder;else if(E.isLOD)E.autoUpdate===!0&&E.update(U);else if(E.isLightProbeGrid)M.pushLightProbeGrid(E);else if(E.isLight)M.pushLight(E),E.castShadow&&M.pushShadow(E);else if(E.isSprite){if(!E.frustumCulled||E.intersectsFrustum(Fe)){G&&Pt.setFromMatrixPosition(E.matrixWorld).applyMatrix4(We);let Se=se.update(E),_e=E.material;_e.visible&&S.push(E,Se,_e,K,Pt.z,null,U)}}else if((E.isMesh||E.isLine||E.isPoints)&&(!E.frustumCulled||E.intersectsFrustum(Fe))){let Se=se.update(E),_e=E.material;if(G&&(E.boundingSphere!==void 0?(E.boundingSphere===null&&E.computeBoundingSphere(),Pt.copy(E.boundingSphere.center)):(Se.boundingSphere===null&&Se.computeBoundingSphere(),Pt.copy(Se.boundingSphere.center)),Pt.applyMatrix4(E.matrixWorld).applyMatrix4(We)),Array.isArray(_e)){let we=Se.groups;for(let Ie=0,Xe=we.length;Ie<Xe;Ie++){let Je=we[Ie],Ae=_e[Je.materialIndex];Ae&&Ae.visible&&S.push(E,Se,Ae,K,Pt.z,Je,U)}}else _e.visible&&S.push(E,Se,_e,K,Pt.z,null,U)}}let xe=E.children;for(let Se=0,_e=xe.length;Se<_e;Se++)jt(xe[Se],U,K,G)}function Ko(E,U,K,G){let{opaque:W,transmissive:xe,transparent:Se}=E;M.setupLightsView(K),Ye===!0&&Pe.setGlobalState(R.clippingPlanes,K),G&&y.viewport(re.copy(G)),W.length>0&&Zo(W,U,K),xe.length>0&&Zo(xe,U,K),Se.length>0&&Zo(Se,U,K),y.buffers.depth.setTest(!0),y.buffers.depth.setMask(!0),y.buffers.color.setMask(!0),y.setPolygonOffset(!1)}function Qu(E,U,K,G){if((K.isScene===!0?K.overrideMaterial:null)!==null)return;if(M.state.transmissionRenderTarget[G.id]===void 0){let Ae=nt.has("EXT_color_buffer_half_float")||nt.has("EXT_color_buffer_float");M.state.transmissionRenderTarget[G.id]=new Dt(1,1,{generateMipmaps:!0,type:Ae?Vt:on,minFilter:Gn,samples:Math.max(4,C.samples),stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,colorSpace:Ke.workingColorSpace})}let xe=M.state.transmissionRenderTarget[G.id],Se=G.viewport||re;xe.setSize(Se.z*R.transmissionResolutionScale,Se.w*R.transmissionResolutionScale);let _e=R.getRenderTarget(),we=R.getActiveCubeFace(),Ie=R.getActiveMipmapLevel();R.setRenderTarget(xe),R.getClearColor(ht),et=R.getClearAlpha(),et<1&&R.setClearColor(16777215,.5),R.clear(),at&&Ve.render(K);let Xe=R.toneMapping;R.toneMapping=Vn;let Je=G.viewport;if(G.viewport!==void 0&&(G.viewport=void 0),M.setupLightsView(G),Ye===!0&&Pe.setGlobalState(R.clippingPlanes,G),Zo(E,K,G),$.updateMultisampleRenderTarget(xe),$.updateRenderTargetMipmap(xe),nt.has("WEBGL_multisampled_render_to_texture")===!1){let Ae=!1;for(let lt=0,Ot=U.length;lt<Ot;lt++){let wt=U[lt],{object:vt,geometry:en,material:Me,group:cn}=wt;if(Me.side===xn&&vt.layers.test(G.layers)){let it=Me.side;Me.side=Ft,Me.needsUpdate=!0,ed(vt,K,G,en,Me,cn),Me.side=it,Me.needsUpdate=!0,Ae=!0}}Ae===!0&&($.updateMultisampleRenderTarget(xe),$.updateRenderTargetMipmap(xe))}R.setRenderTarget(_e,we,Ie),R.setClearColor(ht,et),Je!==void 0&&(G.viewport=Je),R.toneMapping=Xe}function Zo(E,U,K){let G=U.isScene===!0?U.overrideMaterial:null;for(let W=0,xe=E.length;W<xe;W++){let Se=E[W],{object:_e,geometry:we,group:Ie}=Se,Xe=Se.material;Xe.allowOverride===!0&&G!==null&&(Xe=G),_e.layers.test(K.layers)&&ed(_e,U,K,we,Xe,Ie)}}function ed(E,U,K,G,W,xe){P!==null&&W.isNodeMaterial&&P.setObject(E,W),E.onBeforeRender(R,U,K,G,W,xe),E.modelViewMatrix.multiplyMatrices(K.matrixWorldInverse,E.matrixWorld),E.normalMatrix.getNormalMatrix(E.modelViewMatrix),W.onBeforeRender(R,U,K,G,E,xe),W.transparent===!0&&W.side===xn&&W.forceSinglePass===!1?(W.side=Ft,W.needsUpdate=!0,R.renderBufferDirect(K,U,G,W,E,xe),W.side=ti,W.needsUpdate=!0,R.renderBufferDirect(K,U,G,W,E,xe),W.side=xn):R.renderBufferDirect(K,U,G,W,E,xe),E.onAfterRender(R,U,K,G,W,xe)}function $o(E,U,K){U.isScene!==!0&&(U=Jt);let G=X.get(E),W=M.state.lights,xe=M.state.shadowsArray,Se=W.state.version,_e=ue.getParameters(E,W.state,xe,U,K,M.state.lightProbeGridArray),we=ue.getProgramCacheKey(_e),Ie=G.programs;G.environment=E.isMeshStandardMaterial||E.isMeshLambertMaterial||E.isMeshPhongMaterial?U.environment:null,G.fog=U.fog;let Xe=E.isMeshStandardMaterial||E.isMeshLambertMaterial&&!E.envMap||E.isMeshPhongMaterial&&!E.envMap;G.envMap=le.get(E.envMap||G.environment,Xe),G.envMapRotation=G.environment!==null&&E.envMap===null?U.environmentRotation:E.envMapRotation,Ie===void 0&&(E.addEventListener("dispose",Zt),Ie=new Map,G.programs=Ie);let Je=Ie.get(we);if(Je!==void 0){if(G.currentProgram===Je&&G.lightsStateVersion===Se)return nd(E,_e),Je}else _e.uniforms=ue.getUniforms(E),P!==null&&E.isNodeMaterial&&P.build(E,K,_e),E.onBeforeCompile(_e,R),Je=ue.acquireProgram(_e,we),Ie.set(we,Je),G.uniforms=_e.uniforms;let Ae=G.uniforms;return(!E.isShaderMaterial&&!E.isRawShaderMaterial||E.clipping===!0)&&(Ae.clippingPlanes=Pe.uniform),nd(E,_e),G.needsLights=om(E),G.lightsStateVersion=Se,G.needsLights&&(Ae.ambientLightColor.value=W.state.ambient,Ae.lightProbe.value=W.state.probe,Ae.sunLights.value=W.state.sun,Ae.sunLightShadows.value=W.state.sunShadow,Ae.directionalLights.value=W.state.directional,Ae.directionalLightShadows.value=W.state.directionalShadow,Ae.spotLights.value=W.state.spot,Ae.spotLightShadows.value=W.state.spotShadow,Ae.rectAreaLights.value=W.state.rectArea,Ae.ltc_1.value=W.state.rectAreaLTC1,Ae.ltc_2.value=W.state.rectAreaLTC2,Ae.pointLights.value=W.state.point,Ae.pointLightShadows.value=W.state.pointShadow,Ae.hemisphereLights.value=W.state.hemi,Ae.sunShadowMatrix.value=W.state.sunShadowMatrix,Ae.sunShadowCascade.value=W.state.sunShadowCascade,Ae.directionalShadowMatrix.value=W.state.directionalShadowMatrix,Ae.spotLightMatrix.value=W.state.spotLightMatrix,Ae.spotLightMap.value=W.state.spotLightMap,Ae.pointShadowMatrix.value=W.state.pointShadowMatrix),G.lightProbeGrid=M.state.lightProbeGridArray.length>0,G.currentProgram=Je,G.uniformsList=null,Je}function td(E){if(E.uniformsList===null){let U=E.currentProgram.getUniforms();E.uniformsList=Sr.seqWithValue(U.seq,E.uniforms)}return E.uniformsList}function nd(E,U){let K=X.get(E);K.outputColorSpace=U.outputColorSpace,K.batching=U.batching,K.batchingColor=U.batchingColor,K.instancing=U.instancing,K.instancingColor=U.instancingColor,K.instancingMorph=U.instancingMorph,K.skinning=U.skinning,K.morphTargets=U.morphTargets,K.morphNormals=U.morphNormals,K.morphColors=U.morphColors,K.morphTargetsCount=U.morphTargetsCount,K.numClippingPlanes=U.numClippingPlanes,K.numIntersection=U.numClipIntersection,K.vertexAlphas=U.vertexAlphas,K.vertexTangents=U.vertexTangents,K.toneMapping=U.toneMapping}function im(E,U){if(E.length===0)return null;if(E.length===1)return E[0].texture!==null?E[0]:null;x.setFromMatrixPosition(U.matrixWorld);for(let K=0,G=E.length;K<G;K++){let W=E[K];if(W.texture!==null&&W.boundingBox.containsPoint(x))return W}return null}function sm(E,U,K,G,W){U.isScene!==!0&&(U=Jt),$.resetTextureUnits();let xe=U.fog,Se=G.isMeshStandardMaterial||G.isMeshLambertMaterial||G.isMeshPhongMaterial?U.environment:null,_e=ee===null?R.outputColorSpace:ee.isXRRenderTarget===!0?ee.texture.colorSpace:Ke.workingColorSpace,we=G.isMeshStandardMaterial||G.isMeshLambertMaterial&&!G.envMap||G.isMeshPhongMaterial&&!G.envMap,Ie=le.get(G.envMap||Se,we),Xe=G.vertexColors===!0&&!!K.attributes.color&&K.attributes.color.itemSize===4,Je=!!K.attributes.tangent&&(!!G.normalMap||G.anisotropy>0),Ae=!!K.morphAttributes.position,lt=!!K.morphAttributes.normal,Ot=!!K.morphAttributes.color,wt=Vn;G.toneMapped&&(ee===null||ee.isXRRenderTarget===!0)&&(wt=R.toneMapping);let vt=K.morphAttributes.position||K.morphAttributes.normal||K.morphAttributes.color,en=vt!==void 0?vt.length:0,Me=X.get(G),cn=M.state.lights;if(Ye===!0&&(rt===!0||E!==te)){let bt=E===te&&G.id===k;Pe.setState(G,E,bt)}let it=!1;G.version===Me.__version?(Me.needsLights&&Me.lightsStateVersion!==cn.state.version||Me.outputColorSpace!==_e||W.isBatchedMesh&&Me.batching===!1||!W.isBatchedMesh&&Me.batching===!0||W.isBatchedMesh&&Me.batchingColor===!0&&W._colorsTexture===null||W.isBatchedMesh&&Me.batchingColor===!1&&W._colorsTexture!==null||W.isInstancedMesh&&Me.instancing===!1||!W.isInstancedMesh&&Me.instancing===!0||W.isSkinnedMesh&&Me.skinning===!1||!W.isSkinnedMesh&&Me.skinning===!0||W.isInstancedMesh&&Me.instancingColor===!0&&W.instanceColor===null||W.isInstancedMesh&&Me.instancingColor===!1&&W.instanceColor!==null||W.isInstancedMesh&&Me.instancingMorph===!0&&W.morphTexture===null||W.isInstancedMesh&&Me.instancingMorph===!1&&W.morphTexture!==null||Me.envMap!==Ie||G.fog===!0&&Me.fog!==xe||Me.numClippingPlanes!==void 0&&(Me.numClippingPlanes!==Pe.numPlanes||Me.numIntersection!==Pe.numIntersection)||Me.vertexAlphas!==Xe||Me.vertexTangents!==Je||Me.morphTargets!==Ae||Me.morphNormals!==lt||Me.morphColors!==Ot||Me.toneMapping!==wt||Me.morphTargetsCount!==en||!!Me.lightProbeGrid!=M.state.lightProbeGridArray.length>0)&&(it=!0):(it=!0,Me.__version=G.version);let En=Me.currentProgram;it===!0&&(En=$o(G,U,W),P&&G.isNodeMaterial&&P.onUpdateProgram(G,En,Me));let Yn=!1,Ci=!1,Ls=!1,gt=En.getUniforms(),Nt=Me.uniforms;if(y.useProgram(En.program)&&(Yn=!0,Ci=!0,Ls=!0),G.id!==k&&(k=G.id,Ci=!0),Me.needsLights){let bt=im(M.state.lightProbeGridArray,W);Me.lightProbeGrid!==bt&&(Me.lightProbeGrid=bt,Ci=!0)}if(Yn||te!==E){y.buffers.depth.getReversed()&&E.reversedDepth!==!0&&(E._reversedDepth=!0,E.updateProjectionMatrix()),gt.setValue(O,"projectionMatrix",E.projectionMatrix),gt.setValue(O,"viewMatrix",E.matrixWorldInverse);let Ii=gt.map.cameraPosition;Ii!==void 0&&Ii.setValue(O,ot.setFromMatrixPosition(E.matrixWorld)),C.logarithmicDepthBuffer&&gt.setValue(O,"logDepthBufFC",2/(Math.log(E.far+1)/Math.LN2)),(G.isMeshPhongMaterial||G.isMeshToonMaterial||G.isMeshLambertMaterial||G.isMeshBasicMaterial||G.isMeshStandardMaterial||G.isShaderMaterial)&&gt.setValue(O,"isOrthographic",E.isOrthographicCamera===!0),te!==E&&(te=E,Ci=!0,Ls=!0)}if(Me.needsLights&&(cn.state.sunShadowMap.length>0&&gt.setValue(O,"sunShadowMap",cn.state.sunShadowMap,$),cn.state.directionalShadowMap.length>0&&gt.setValue(O,"directionalShadowMap",cn.state.directionalShadowMap,$),cn.state.spotShadowMap.length>0&&gt.setValue(O,"spotShadowMap",cn.state.spotShadowMap,$),cn.state.pointShadowMap.length>0&&gt.setValue(O,"pointShadowMap",cn.state.pointShadowMap,$)),W.isSkinnedMesh){gt.setOptional(O,W,"bindMatrix"),gt.setOptional(O,W,"bindMatrixInverse");let bt=W.skeleton;bt&&(bt.boneTexture===null&&bt.computeBoneTexture(),gt.setValue(O,"boneTexture",bt.boneTexture,$))}W.isBatchedMesh&&(gt.setOptional(O,W,"batchingTexture"),gt.setValue(O,"batchingTexture",W._matricesTexture,$),gt.setOptional(O,W,"batchingIdTexture"),gt.setValue(O,"batchingIdTexture",W._indirectTexture,$),gt.setOptional(O,W,"batchingColorTexture"),W._colorsTexture!==null&&gt.setValue(O,"batchingColorTexture",W._colorsTexture,$));let Pi=K.morphAttributes;if((Pi.position!==void 0||Pi.normal!==void 0||Pi.color!==void 0)&&F.update(W,K,En),(Ci||Me.receiveShadow!==W.receiveShadow)&&(Me.receiveShadow=W.receiveShadow,gt.setValue(O,"receiveShadow",W.receiveShadow)),(G.isMeshStandardMaterial||G.isMeshLambertMaterial||G.isMeshPhongMaterial)&&G.envMap===null&&U.environment!==null&&(Nt.envMapIntensity.value=U.environmentIntensity),Nt.dfgLUT!==void 0&&(Nt.dfgLUT.value=iy()),Ci){if(gt.setValue(O,"toneMappingExposure",R.toneMappingExposure),Me.needsLights&&rm(Nt,Ls),xe&&G.fog===!0&&Ce.refreshFogUniforms(Nt,xe),Ce.refreshMaterialUniforms(Nt,G,Q,Z,M.state.transmissionRenderTarget[E.id]),Me.needsLights&&Me.lightProbeGrid){let bt=Me.lightProbeGrid;Nt.probesSH.value=bt.texture,Nt.probesMin.value.copy(bt.boundingBox.min),Nt.probesMax.value.copy(bt.boundingBox.max),Nt.probesResolution.value.copy(bt.resolution)}Sr.upload(O,td(Me),Nt,$)}if(G.isShaderMaterial&&G.uniformsNeedUpdate===!0&&(Sr.upload(O,td(Me),Nt,$),G.uniformsNeedUpdate=!1),G.isSpriteMaterial&&gt.setValue(O,"center",W.center),gt.setValue(O,"modelViewMatrix",W.modelViewMatrix),gt.setValue(O,"normalMatrix",W.normalMatrix),gt.setValue(O,"modelMatrix",W.matrixWorld),G.uniformsGroups!==void 0){let bt=G.uniformsGroups;for(let Ii=0,Ds=bt.length;Ii<Ds;Ii++){let sd=bt[Ii];oe.update(sd,En),oe.bind(sd,En)}}return En}function rm(E,U){E.ambientLightColor.needsUpdate=U,E.lightProbe.needsUpdate=U,E.sunLights.needsUpdate=U,E.sunLightShadows.needsUpdate=U,E.directionalLights.needsUpdate=U,E.directionalLightShadows.needsUpdate=U,E.pointLights.needsUpdate=U,E.pointLightShadows.needsUpdate=U,E.spotLights.needsUpdate=U,E.spotLightShadows.needsUpdate=U,E.rectAreaLights.needsUpdate=U,E.hemisphereLights.needsUpdate=U}function om(E){return E.isMeshLambertMaterial||E.isMeshToonMaterial||E.isMeshPhongMaterial||E.isMeshStandardMaterial||E.isShadowMaterial||E.isShaderMaterial&&E.lights===!0}this.getActiveCubeFace=function(){return V},this.getActiveMipmapLevel=function(){return q},this.getRenderTarget=function(){return ee},this.setRenderTargetTextures=function(E,U,K){let G=X.get(E);G.__autoAllocateDepthBuffer=E.resolveDepthBuffer===!1,G.__autoAllocateDepthBuffer===!1&&(G.__useRenderToTexture=!1),X.get(E.texture).__webglTexture=U,X.get(E.depthTexture).__webglTexture=G.__autoAllocateDepthBuffer?void 0:K,G.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(E,U){let K=X.get(E);K.__webglFramebuffer=U,K.__useDefaultFramebuffer=U===void 0},this.setRenderTarget=function(E,U=0,K=0){ee=E,V=U,q=K;let G=null,W=!1,xe=!1;if(E){let _e=X.get(E);if(_e.__useDefaultFramebuffer!==void 0){y.bindFramebuffer(O.FRAMEBUFFER,_e.__webglFramebuffer),re.copy(E.viewport),Ee.copy(E.scissor),Re=E.scissorTest,y.viewport(re),y.scissor(Ee),y.setScissorTest(Re),k=-1;return}else if(_e.__webglFramebuffer===void 0)$.setupRenderTarget(E);else if(_e.__hasExternalTextures)$.rebindTextures(E,X.get(E.texture).__webglTexture,X.get(E.depthTexture).__webglTexture);else if(E.depthBuffer){let Xe=E.depthTexture;if(_e.__boundDepthTexture!==Xe){if(Xe!==null&&X.has(Xe)&&(E.width!==Xe.image.width||E.height!==Xe.image.height))throw new Error("THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.");$.setupDepthRenderbuffer(E)}}let we=E.texture;(we.isData3DTexture||we.isDataArrayTexture||we.isCompressedArrayTexture)&&(xe=!0);let Ie=X.get(E).__webglFramebuffer;E.isWebGLCubeRenderTarget?(Array.isArray(Ie[U])?G=Ie[U][K]:G=Ie[U],W=!0):E.samples>0&&$.useMultisampledRTT(E)===!1?G=X.get(E).__webglMultisampledFramebuffer:Array.isArray(Ie)?G=Ie[K]:G=Ie,re.copy(E.viewport),Ee.copy(E.scissor),Re=E.scissorTest}else re.copy(ve).multiplyScalar(Q).floor(),Ee.copy(ze).multiplyScalar(Q).floor(),Re=pt;if(K!==0&&(G=N),y.bindFramebuffer(O.FRAMEBUFFER,G)&&y.drawBuffers(E,G),y.viewport(re),y.scissor(Ee),y.setScissorTest(Re),W){let _e=X.get(E.texture);O.framebufferTexture2D(O.FRAMEBUFFER,O.COLOR_ATTACHMENT0,O.TEXTURE_CUBE_MAP_POSITIVE_X+U,_e.__webglTexture,K)}else if(xe){let _e=U;for(let we=0;we<E.textures.length;we++){let Ie=X.get(E.textures[we]);O.framebufferTextureLayer(O.FRAMEBUFFER,O.COLOR_ATTACHMENT0+we,Ie.__webglTexture,K,_e)}}else if(E!==null&&K!==0){let _e=X.get(E.texture);O.framebufferTexture2D(O.FRAMEBUFFER,O.COLOR_ATTACHMENT0,O.TEXTURE_2D,_e.__webglTexture,K)}k=-1};function id(E){let U=X.get(E);return(U.__readFormat!==E.format||U.__readType!==E.type)&&(U.__readFormat=E.format,U.__readType=E.type,U.__formatReadable=C.textureFormatReadable(E.format),U.__typeReadable=C.textureTypeReadable(E.type)),U}this.readRenderTargetPixels=function(E,U,K,G,W,xe,Se,_e=0){if(!(E&&E.isWebGLRenderTarget)){ke("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let we=X.get(E).__webglFramebuffer;if(E.isWebGLCubeRenderTarget&&Se!==void 0&&(we=we[Se]),we){y.bindFramebuffer(O.FRAMEBUFFER,we);try{let Ie=E.textures[_e],Xe=Ie.format,Je=Ie.type;E.textures.length>1&&O.readBuffer(O.COLOR_ATTACHMENT0+_e);let Ae=id(Ie);if(Ae.__formatReadable===!1){ke("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(Ae.__typeReadable===!1){ke("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}U>=0&&U<=E.width-G&&K>=0&&K<=E.height-W&&O.readPixels(U,K,G,W,ce.convert(Xe),ce.convert(Je),xe)}finally{let Ie=ee!==null?X.get(ee).__webglFramebuffer:null;y.bindFramebuffer(O.FRAMEBUFFER,Ie)}}},this.readRenderTargetPixelsAsync=async function(E,U,K,G,W,xe,Se,_e=0){if(!(E&&E.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let we=X.get(E).__webglFramebuffer;if(E.isWebGLCubeRenderTarget&&Se!==void 0&&(we=we[Se]),we)if(U>=0&&U<=E.width-G&&K>=0&&K<=E.height-W){y.bindFramebuffer(O.FRAMEBUFFER,we);let Ie=E.textures[_e],Xe=Ie.format,Je=Ie.type;E.textures.length>1&&O.readBuffer(O.COLOR_ATTACHMENT0+_e);let Ae=id(Ie);if(Ae.__formatReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(Ae.__typeReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");let lt=O.createBuffer();O.bindBuffer(O.PIXEL_PACK_BUFFER,lt),O.bufferData(O.PIXEL_PACK_BUFFER,xe.byteLength,O.STREAM_READ),O.readPixels(U,K,G,W,ce.convert(Xe),ce.convert(Je),0),O.bindBuffer(O.PIXEL_PACK_BUFFER,null);let Ot=ee!==null?X.get(ee).__webglFramebuffer:null;y.bindFramebuffer(O.FRAMEBUFFER,Ot);let wt=O.fenceSync(O.SYNC_GPU_COMMANDS_COMPLETE,0);return O.flush(),await wf(O,wt,4),O.bindBuffer(O.PIXEL_PACK_BUFFER,lt),O.getBufferSubData(O.PIXEL_PACK_BUFFER,0,xe),O.bindBuffer(O.PIXEL_PACK_BUFFER,null),O.deleteBuffer(lt),O.deleteSync(wt),xe}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(E,U=null,K=0){let G=Math.pow(2,-K),W=Math.floor(E.image.width*G),xe=Math.floor(E.image.height*G),Se=U!==null?U.x:0,_e=U!==null?U.y:0;$.setTexture2D(E,0),O.copyTexSubImage2D(O.TEXTURE_2D,K,0,0,Se,_e,W,xe),y.unbindTexture()},this.copyTextureToTexture=function(E,U,K=null,G=null,W=0,xe=0){let Se,_e,we,Ie,Xe,Je,Ae,lt,Ot,wt=E.isCompressedTexture?E.mipmaps[xe]:E.image;if(K!==null)Se=K.max.x-K.min.x,_e=K.max.y-K.min.y,we=K.isBox3?K.max.z-K.min.z:1,Ie=K.min.x,Xe=K.min.y,Je=K.isBox3?K.min.z:0;else{let Nt=Math.pow(2,-W);Se=Math.floor(wt.width*Nt),_e=Math.floor(wt.height*Nt),E.isDataArrayTexture?we=wt.depth:E.isData3DTexture?we=Math.floor(wt.depth*Nt):we=1,Ie=0,Xe=0,Je=0}G!==null?(Ae=G.x,lt=G.y,Ot=G.z):(Ae=0,lt=0,Ot=0);let vt=ce.convert(U.format),en=ce.convert(U.type),Me;U.isData3DTexture?($.setTexture3D(U,0),Me=O.TEXTURE_3D):U.isDataArrayTexture||U.isCompressedArrayTexture?($.setTexture2DArray(U,0),Me=O.TEXTURE_2D_ARRAY):($.setTexture2D(U,0),Me=O.TEXTURE_2D),y.activeTexture(O.TEXTURE0),y.pixelStorei(O.UNPACK_FLIP_Y_WEBGL,U.flipY),y.pixelStorei(O.UNPACK_PREMULTIPLY_ALPHA_WEBGL,U.premultiplyAlpha),y.pixelStorei(O.UNPACK_ALIGNMENT,U.unpackAlignment);let cn=y.getParameter(O.UNPACK_ROW_LENGTH),it=y.getParameter(O.UNPACK_IMAGE_HEIGHT),En=y.getParameter(O.UNPACK_SKIP_PIXELS),Yn=y.getParameter(O.UNPACK_SKIP_ROWS),Ci=y.getParameter(O.UNPACK_SKIP_IMAGES);y.pixelStorei(O.UNPACK_ROW_LENGTH,wt.width),y.pixelStorei(O.UNPACK_IMAGE_HEIGHT,wt.height),y.pixelStorei(O.UNPACK_SKIP_PIXELS,Ie),y.pixelStorei(O.UNPACK_SKIP_ROWS,Xe),y.pixelStorei(O.UNPACK_SKIP_IMAGES,Je);let Ls=E.isDataArrayTexture||E.isData3DTexture,gt=U.isDataArrayTexture||U.isData3DTexture;if(E.isDepthTexture){let Nt=X.get(E),Pi=X.get(U),bt=X.get(Nt.__renderTarget),Ii=X.get(Pi.__renderTarget);y.bindFramebuffer(O.READ_FRAMEBUFFER,bt.__webglFramebuffer),y.bindFramebuffer(O.DRAW_FRAMEBUFFER,Ii.__webglFramebuffer);for(let Ds=0;Ds<we;Ds++)Ls&&(O.framebufferTextureLayer(O.READ_FRAMEBUFFER,O.COLOR_ATTACHMENT0,X.get(E).__webglTexture,W,Je+Ds),O.framebufferTextureLayer(O.DRAW_FRAMEBUFFER,O.COLOR_ATTACHMENT0,X.get(U).__webglTexture,xe,Ot+Ds)),O.blitFramebuffer(Ie,Xe,Se,_e,Ae,lt,Se,_e,O.DEPTH_BUFFER_BIT,O.NEAREST);y.bindFramebuffer(O.READ_FRAMEBUFFER,null),y.bindFramebuffer(O.DRAW_FRAMEBUFFER,null)}else if(W!==0||E.isRenderTargetTexture||X.has(E)){let Nt=X.get(E),Pi=X.get(U);y.bindFramebuffer(O.READ_FRAMEBUFFER,I),y.bindFramebuffer(O.DRAW_FRAMEBUFFER,H);for(let bt=0;bt<we;bt++)Ls?O.framebufferTextureLayer(O.READ_FRAMEBUFFER,O.COLOR_ATTACHMENT0,Nt.__webglTexture,W,Je+bt):O.framebufferTexture2D(O.READ_FRAMEBUFFER,O.COLOR_ATTACHMENT0,O.TEXTURE_2D,Nt.__webglTexture,W),gt?O.framebufferTextureLayer(O.DRAW_FRAMEBUFFER,O.COLOR_ATTACHMENT0,Pi.__webglTexture,xe,Ot+bt):O.framebufferTexture2D(O.DRAW_FRAMEBUFFER,O.COLOR_ATTACHMENT0,O.TEXTURE_2D,Pi.__webglTexture,xe),W!==0?O.blitFramebuffer(Ie,Xe,Se,_e,Ae,lt,Se,_e,O.COLOR_BUFFER_BIT,O.NEAREST):gt?O.copyTexSubImage3D(Me,xe,Ae,lt,Ot+bt,Ie,Xe,Se,_e):O.copyTexSubImage2D(Me,xe,Ae,lt,Ie,Xe,Se,_e);y.bindFramebuffer(O.READ_FRAMEBUFFER,null),y.bindFramebuffer(O.DRAW_FRAMEBUFFER,null)}else gt?E.isDataTexture||E.isData3DTexture?O.texSubImage3D(Me,xe,Ae,lt,Ot,Se,_e,we,vt,en,wt.data):U.isCompressedArrayTexture?O.compressedTexSubImage3D(Me,xe,Ae,lt,Ot,Se,_e,we,vt,wt.data):O.texSubImage3D(Me,xe,Ae,lt,Ot,Se,_e,we,vt,en,wt):E.isDataTexture?O.texSubImage2D(O.TEXTURE_2D,xe,Ae,lt,Se,_e,vt,en,wt.data):E.isCompressedTexture?O.compressedTexSubImage2D(O.TEXTURE_2D,xe,Ae,lt,wt.width,wt.height,vt,wt.data):O.texSubImage2D(O.TEXTURE_2D,xe,Ae,lt,Se,_e,vt,en,wt);y.pixelStorei(O.UNPACK_ROW_LENGTH,cn),y.pixelStorei(O.UNPACK_IMAGE_HEIGHT,it),y.pixelStorei(O.UNPACK_SKIP_PIXELS,En),y.pixelStorei(O.UNPACK_SKIP_ROWS,Yn),y.pixelStorei(O.UNPACK_SKIP_IMAGES,Ci),xe===0&&U.generateMipmaps&&O.generateMipmap(Me),y.unbindTexture()},this.initRenderTarget=function(E){X.get(E).__webglFramebuffer===void 0&&$.setupRenderTarget(E)},this.initTexture=function(E){E.isCubeTexture?$.setTextureCube(E,0):E.isData3DTexture?$.setTexture3D(E,0):E.isDataArrayTexture||E.isCompressedArrayTexture?$.setTexture2DArray(E,0):$.setTexture2D(E,0),y.unbindTexture()},this.resetState=function(){V=0,q=0,ee=null,y.reset(),me.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return On}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;let t=this.getContext();t.drawingBufferColorSpace=Ke._getDrawingBufferColorSpace(e),t.unpackColorSpace=Ke._getUnpackColorSpace()}};var Er={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform float opacity;

		uniform sampler2D tDiffuse;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );
			gl_FragColor = opacity * texel;


		}`};var Xn=class{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}},sy=new Rn(-1,1,1,-1,0,1),ru=class extends yt{constructor(){super(),this.setAttribute("position",new Ze([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new Ze([0,2,0,0,2,0],2))}},ry=new ru,wr=class{constructor(e){this._mesh=new Be(ry,e)}dispose(){this._mesh.geometry.dispose()}render(e){e.render(this._mesh,sy)}get material(){return this._mesh.material}set material(e){this._mesh.material=e}};var $l=class extends Xn{constructor(e,t="tDiffuse"){super(),this.textureID=t,this.uniforms=null,this.material=null,e instanceof ft?(this.uniforms=e.uniforms,this.material=e):e&&(this.uniforms=Ts.clone(e.uniforms),this.material=new ft({name:e.name!==void 0?e.name:"unspecified",defines:Object.assign({},e.defines),uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader})),this._fsQuad=new wr(this.material)}render(e,t,n){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=n.texture),this._fsQuad.material=this.material,this.renderToScreen?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}};var No=class extends Xn{constructor(e,t){super(),this.scene=e,this.camera=t,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(e,t,n){let i=e.getContext(),r=e.state;r.buffers.color.setMask(!1),r.buffers.depth.setMask(!1),r.buffers.color.setLocked(!0),r.buffers.depth.setLocked(!0);let o,a;this.inverse?(o=0,a=1):(o=1,a=0),r.buffers.stencil.setTest(!0),r.buffers.stencil.setOp(i.REPLACE,i.REPLACE,i.REPLACE),r.buffers.stencil.setFunc(i.ALWAYS,o,4294967295),r.buffers.stencil.setClear(a),r.buffers.stencil.setLocked(!0),e.setRenderTarget(n),this.clear&&e.clear(),e.render(this.scene,this.camera),e.setRenderTarget(t),this.clear&&e.clear(),e.render(this.scene,this.camera),r.buffers.color.setLocked(!1),r.buffers.depth.setLocked(!1),r.buffers.color.setMask(!0),r.buffers.depth.setMask(!0),r.buffers.stencil.setLocked(!1),r.buffers.stencil.setFunc(i.EQUAL,1,4294967295),r.buffers.stencil.setOp(i.KEEP,i.KEEP,i.KEEP),r.buffers.stencil.setLocked(!0)}},Jl=class extends Xn{constructor(){super(),this.needsSwap=!1}render(e){e.state.buffers.stencil.setLocked(!1),e.state.buffers.stencil.setTest(!1)}};var jl=class{constructor(e,t){if(this.renderer=e,this._pixelRatio=e.getPixelRatio(),t===void 0){let n=e.getSize(new Te);this._width=n.width,this._height=n.height,t=new Dt(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:Vt}),t.texture.name="EffectComposer.rt1"}else this._width=t.width,this._height=t.height;this.renderTarget1=t,this.renderTarget2=t.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new $l(Er),this.copyPass.material.blending=Cn,this.timer=new xo}swapBuffers(){let e=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=e}addPass(e){this.passes.push(e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(e,t){this.passes.splice(t,0,e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(e){let t=this.passes.indexOf(e);t!==-1&&this.passes.splice(t,1)}isLastEnabledPass(e){for(let t=e+1;t<this.passes.length;t++)if(this.passes[t].enabled)return!1;return!0}render(e){this.timer.update(),e===void 0&&(e=this.timer.getDelta());let t=this.renderer.getRenderTarget(),n=!1;for(let i=0,r=this.passes.length;i<r;i++){let o=this.passes[i];if(o.enabled!==!1){if(o.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(i),o.render(this.renderer,this.writeBuffer,this.readBuffer,e,n),o.needsSwap){if(n){let a=this.renderer.getContext(),l=this.renderer.state.buffers.stencil;l.setFunc(a.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,e),l.setFunc(a.EQUAL,1,4294967295)}this.swapBuffers()}No!==void 0&&(o instanceof No?n=!0:o instanceof Jl&&(n=!1))}}this.renderer.setRenderTarget(t)}reset(e){if(e===void 0){let t=this.renderer.getSize(new Te);this._pixelRatio=this.renderer.getPixelRatio(),this._width=t.width,this._height=t.height,e=this.renderTarget1.clone(),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=e,this.renderTarget2=e.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(e,t){this._width=e,this._height=t;let n=this._width*this._pixelRatio,i=this._height*this._pixelRatio;this.renderTarget1.setSize(n,i),this.renderTarget2.setSize(n,i);for(let r=0;r<this.passes.length;r++)this.passes[r].setSize(n,i)}setPixelRatio(e){this._pixelRatio=e,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}};var Ql=class extends Xn{constructor(e,t,n=null,i=null,r=null){super(),this.scene=e,this.camera=t,this.overrideMaterial=n,this.clearColor=i,this.clearAlpha=r,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this.isRenderPass=!0,this._oldClearColor=new de}render(e,t,n){let i=e.autoClear;e.autoClear=!1;let r,o;this.overrideMaterial!==null&&(o=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(e.getClearColor(this._oldClearColor),e.setClearColor(this.clearColor,e.getClearAlpha())),this.clearAlpha!==null&&(r=e.getClearAlpha(),e.setClearAlpha(this.clearAlpha)),this.clearDepth==!0&&e.clearDepth(),e.setRenderTarget(this.renderToScreen?null:n),this.clear===!0&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),e.render(this.scene,this.camera),this.clearColor!==null&&e.setClearColor(this._oldClearColor),this.clearAlpha!==null&&e.setClearAlpha(r),this.overrideMaterial!==null&&(this.scene.overrideMaterial=o),e.autoClear=i}};var rp={name:"LuminosityHighPassShader",uniforms:{tDiffuse:{value:null},luminosityThreshold:{value:1},smoothWidth:{value:1},defaultColor:{value:new de(0)},defaultOpacity:{value:0}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform sampler2D tDiffuse;
		uniform vec3 defaultColor;
		uniform float defaultOpacity;
		uniform float luminosityThreshold;
		uniform float smoothWidth;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );

			float v = luminance( texel.xyz );

			vec4 outputColor = vec4( defaultColor.rgb, defaultOpacity );

			float alpha = smoothstep( luminosityThreshold, luminosityThreshold + smoothWidth, v );

			gl_FragColor = mix( outputColor, texel, alpha );

		}`};var Ar=class s extends Xn{constructor(e,t=1,n,i){super(),this.strength=t,this.radius=n,this.threshold=i,this.resolution=e!==void 0?new Te(e.x,e.y):new Te(256,256),this.clearColor=new de(0,0,0),this.needsSwap=!1,this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let r=Math.round(this.resolution.x/2),o=Math.round(this.resolution.y/2);this.renderTargetBright=new Dt(r,o,{type:Vt,depthBuffer:!1}),this.renderTargetBright.texture.name="UnrealBloomPass.bright",this.renderTargetBright.texture.generateMipmaps=!1;for(let h=0;h<this.nMips;h++){let u=new Dt(r,o,{type:Vt,depthBuffer:!1});u.texture.name="UnrealBloomPass.h"+h,u.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(u);let d=new Dt(r,o,{type:Vt,depthBuffer:!1});d.texture.name="UnrealBloomPass.v"+h,d.texture.generateMipmaps=!1,this.renderTargetsVertical.push(d),r=Math.round(r/2),o=Math.round(o/2)}let a=rp;this.highPassUniforms=Ts.clone(a.uniforms),this.highPassUniforms.luminosityThreshold.value=i,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new ft({uniforms:this.highPassUniforms,vertexShader:a.vertexShader,fragmentShader:a.fragmentShader}),this.separableBlurMaterials=[];let l=[6,10,14,18,22];r=Math.round(this.resolution.x/2),o=Math.round(this.resolution.y/2);for(let h=0;h<this.nMips;h++)this.separableBlurMaterials.push(this._getSeparableBlurMaterial(l[h])),this.separableBlurMaterials[h].uniforms.invSize.value=new Te(1/r,1/o),r=Math.round(r/2),o=Math.round(o/2);this.compositeMaterial=this._getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=t,this.compositeMaterial.uniforms.bloomRadius.value=.1;let c=[1,.8,.6,.4,.2];this.compositeMaterial.uniforms.bloomFactors.value=c,this.bloomTintColors=[new D(1,1,1),new D(1,1,1),new D(1,1,1),new D(1,1,1),new D(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,this.copyUniforms=Ts.clone(Er.uniforms),this.blendMaterial=new ft({uniforms:this.copyUniforms,vertexShader:Er.vertexShader,fragmentShader:Er.fragmentShader,premultipliedAlpha:!0,blending:ni,depthTest:!1,depthWrite:!1,transparent:!0}),this._oldClearColor=new de,this._oldClearAlpha=1,this._basic=new st,this._fsQuad=new wr(null)}dispose(){for(let e=0;e<this.renderTargetsHorizontal.length;e++)this.renderTargetsHorizontal[e].dispose();for(let e=0;e<this.renderTargetsVertical.length;e++)this.renderTargetsVertical[e].dispose();this.renderTargetBright.dispose();for(let e=0;e<this.separableBlurMaterials.length;e++)this.separableBlurMaterials[e].dispose();this.compositeMaterial.dispose(),this.blendMaterial.dispose(),this._basic.dispose(),this._fsQuad.dispose()}setSize(e,t){let n=Math.round(e/2),i=Math.round(t/2);this.renderTargetBright.setSize(n,i);for(let r=0;r<this.nMips;r++)this.renderTargetsHorizontal[r].setSize(n,i),this.renderTargetsVertical[r].setSize(n,i),this.separableBlurMaterials[r].uniforms.invSize.value=new Te(1/n,1/i),n=Math.round(n/2),i=Math.round(i/2)}render(e,t,n,i,r){e.getClearColor(this._oldClearColor),this._oldClearAlpha=e.getClearAlpha();let o=e.autoClear;e.autoClear=!1,e.setClearColor(this.clearColor,0),r&&e.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this._fsQuad.material=this._basic,this._basic.map=n.texture,e.setRenderTarget(null),e.clear(),this._fsQuad.render(e)),this.highPassUniforms.tDiffuse.value=n.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this._fsQuad.material=this.materialHighPassFilter,e.setRenderTarget(this.renderTargetBright),e.clear(),this._fsQuad.render(e);let a=this.renderTargetBright;for(let l=0;l<this.nMips;l++)this._fsQuad.material=this.separableBlurMaterials[l],this.separableBlurMaterials[l].uniforms.colorTexture.value=a.texture,this.separableBlurMaterials[l].uniforms.direction.value=s.BlurDirectionX,e.setRenderTarget(this.renderTargetsHorizontal[l]),e.clear(),this._fsQuad.render(e),this.separableBlurMaterials[l].uniforms.colorTexture.value=this.renderTargetsHorizontal[l].texture,this.separableBlurMaterials[l].uniforms.direction.value=s.BlurDirectionY,e.setRenderTarget(this.renderTargetsVertical[l]),e.clear(),this._fsQuad.render(e),a=this.renderTargetsVertical[l];this._fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,e.setRenderTarget(this.renderTargetsHorizontal[0]),e.clear(),this._fsQuad.render(e),this._fsQuad.material=this.blendMaterial,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,r&&e.state.buffers.stencil.setTest(!0),this.renderToScreen?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(n),this._fsQuad.render(e)),e.setClearColor(this._oldClearColor,this._oldClearAlpha),e.autoClear=o}_getSeparableBlurMaterial(e){let t=[],n=e/3;for(let o=0;o<e;o++)t.push(.39894*Math.exp(-.5*o*o/(n*n))/n);let i=[],r=[];for(let o=1;o<e;o+=2){let a=t[o],l=o+1<e?t[o+1]:0,c=a+l;i.push((o*a+(o+1)*l)/c),r.push(c)}return new ft({defines:{KERNEL_PAIRS:i.length},uniforms:{colorTexture:{value:null},invSize:{value:new Te(.5,.5)},direction:{value:new Te(.5,.5)},centerWeight:{value:t[0]},gaussianOffsets:{value:i},gaussianWeights:{value:r}},vertexShader:`

				varying vec2 vUv;

				void main() {

					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

				}`,fragmentShader:`

				#include <common>

				varying vec2 vUv;

				uniform sampler2D colorTexture;
				uniform vec2 invSize;
				uniform vec2 direction;
				uniform float centerWeight;
				uniform float gaussianOffsets[KERNEL_PAIRS];
				uniform float gaussianWeights[KERNEL_PAIRS];

				void main() {

					vec3 diffuseSum = texture2D( colorTexture, vUv ).rgb * centerWeight;

					for ( int i = 0; i < KERNEL_PAIRS; i ++ ) {

						vec2 uvOffset = direction * invSize * gaussianOffsets[ i ];
						vec3 sample1 = texture2D( colorTexture, vUv + uvOffset ).rgb;
						vec3 sample2 = texture2D( colorTexture, vUv - uvOffset ).rgb;
						diffuseSum += ( sample1 + sample2 ) * gaussianWeights[ i ];

					}

					gl_FragColor = vec4( diffuseSum, 1.0 );

				}`})}_getCompositeMaterial(e){return new ft({defines:{NUM_MIPS:e},uniforms:{blurTexture1:{value:null},blurTexture2:{value:null},blurTexture3:{value:null},blurTexture4:{value:null},blurTexture5:{value:null},bloomStrength:{value:1},bloomFactors:{value:null},bloomTintColors:{value:null},bloomRadius:{value:0}},vertexShader:`

				varying vec2 vUv;

				void main() {

					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

				}`,fragmentShader:`

				varying vec2 vUv;

				uniform sampler2D blurTexture1;
				uniform sampler2D blurTexture2;
				uniform sampler2D blurTexture3;
				uniform sampler2D blurTexture4;
				uniform sampler2D blurTexture5;
				uniform float bloomStrength;
				uniform float bloomRadius;
				uniform float bloomFactors[NUM_MIPS];
				uniform vec3 bloomTintColors[NUM_MIPS];

				float lerpBloomFactor( const in float factor ) {

					float mirrorFactor = 1.2 - factor;
					return mix( factor, mirrorFactor, bloomRadius );

				}

				void main() {

					// 3.0 for backwards compatibility with previous alpha-based intensity
					vec3 bloom = 3.0 * bloomStrength * (
						lerpBloomFactor( bloomFactors[ 0 ] ) * bloomTintColors[ 0 ] * texture2D( blurTexture1, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 1 ] ) * bloomTintColors[ 1 ] * texture2D( blurTexture2, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 2 ] ) * bloomTintColors[ 2 ] * texture2D( blurTexture3, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 3 ] ) * bloomTintColors[ 3 ] * texture2D( blurTexture4, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 4 ] ) * bloomTintColors[ 4 ] * texture2D( blurTexture5, vUv ).rgb
					);

					float bloomAlpha = max( bloom.r, max( bloom.g, bloom.b ) );
					gl_FragColor = vec4( bloom, bloomAlpha );

				}`})}};Ar.BlurDirectionX=new Te(1,0);Ar.BlurDirectionY=new Te(0,1);function Ki(s){let e=new Map,t=new Map,n=s.clone();return op(s,n,function(i,r){e.set(r,i),t.set(i,r)}),n.traverse(function(i){if(!i.isSkinnedMesh)return;let r=i,o=e.get(i),a=o.skeleton.bones;r.skeleton=o.skeleton.clone(),r.bindMatrix.copy(o.bindMatrix),r.skeleton.bones=a.map(function(l){return t.get(l)}),r.bind(r.skeleton,r.bindMatrix)}),n}function op(s,e,t){t(s,e);for(let n=0;n<s.children.length;n++)op(s.children[n],e.children[n],t)}var lp=["ots","otsWide"],cp=["enemyClose","heroLow","hands"],Rr={ots:"behind",otsWide:"behind",enemyClose:"enemy",dollyEnemy:"enemy",heroLow:"hero",topDown:"top",hands:"hands"};function ou(s,e){return Rr[s]===Rr[e]}function au(s){return s==="ots"||s==="otsWide"}function oy(s,e){return s[Math.min(s.length-1,Math.floor(e*s.length))]}function hp(s,e,t={}){if(t.drop&&Rr[s]!=="top")return"topDown";if(t.taunt&&Rr[s]!=="enemy")return"dollyEnemy";let i=(au(s)?cp:e()<.85?lp:cp).filter(r=>Rr[r]!==Rr[s]);return oy(i.length?i:lp,e())}function up(s){let e=Math.min(1,Math.max(0,s));return e*e*(3-2*e)}function dp(s){return!(s>0)||s>1?1:1-.65*up(1-s)}function fp(s,e=12){return s<0||s>=.36?0:s<.06?-e*(s/.06):-e*(1-up((s-.06)/.3))}var Pn={player:[0,0,3],enemy:[0,0,-3.2],height:1.8},pp=8;function vn(s,e,t,n,i,r,o,a){return s.pos[0]=e,s.pos[1]=t,s.pos[2]=n,s.target[0]=i,s.target[1]=r,s.target[2]=o,s.fov=a,s}function lu(s,e,t,n,i){let r=i??{pos:[0,0,0],target:[0,0,0],fov:48};if(n<1)return ly(s,e,n,r);let[o,,a]=Pn.player,[l,,c]=Pn.enemy,h=Pn.height,u=Math.sin(e*.9)*.06,d=Math.min(Math.max(0,e),pp),f=d*.05;switch(s){case"ots":vn(r,o+.75+u+f*3,h*.95,a+1.9-d*.15,l-.35,h*.62,c,48);break;case"otsWide":vn(r,o+1.3-f*3,h*1.15+u-d*.05,a+2.8-d*.2,l-.5,h*.55,c,52);break;case"enemyClose":{let g=f*3;vn(r,l+Math.sin(g)*2.1,h*.45,c+Math.cos(g)*2.1,l,h*.7+u*.3,c,40);break}case"heroLow":{let g=Math.PI-f*3;vn(r,o+Math.sin(g)*2.2+u,h*.35,a+Math.cos(g)*2.2,o,h*.72,a,42);break}case"topDown":{let g=e*.35;vn(r,Math.sin(g)*1.5,10,Math.cos(g)*1.5,0,0,(a+c)/2,55);break}case"dollyEnemy":{let g=4.5-Math.min(1,e/2)*2.3;vn(r,l+.3-f*2,h*.55,c+g,l,h*.72,c,38);break}case"hands":{let g=Math.PI-.5+f*3;vn(r,o+Math.sin(g)*1.5+u,h*.5,a+Math.cos(g)*1.5,o,h*.58,a,40);break}}return r}function ay(s,e){let t=Math.min(.5625,Math.max(.3,e)),n=Math.atan(Math.tan(s*Math.PI/360)*(9/16/t));return Math.min(80,n*360/Math.PI)}function ly(s,e,t,n){let[i,,r]=Pn.player,[o,,a]=Pn.enemy,l=Pn.height,c=Math.sin(e*.9)*.05,h=Math.min(Math.max(0,e),pp),u=h*.05;switch(s){case"ots":vn(n,i+Qe.otsX+c+u*.6,l*Qe.otsY+h*.03,r+Qe.otsZ+h*.09,o+Qe.otsAimX,Qe.otsAimY,a,Qe.otsFov);break;case"otsWide":vn(n,i+Qe.wideX-u*.8,l*Qe.wideY+c-h*.04,r+Qe.wideZ-h*.16,o+Qe.wideAimX,Qe.wideAimY,a,Qe.wideFov);break;case"enemyClose":{let d=u*3;vn(n,o+Math.sin(d)*Qe.ecD,l*Qe.ecY,a+Math.cos(d)*Qe.ecD,o,Qe.ecAimY+c*.3,a,Qe.ecFov);break}case"heroLow":{let d=Math.PI-u*3;vn(n,i+Math.sin(d)*Qe.hlD+c,l*Qe.hlY,r+Math.cos(d)*Qe.hlD,i,Qe.hlAimY,r,Qe.hlFov);break}case"topDown":{let d=e*.3;vn(n,Math.sin(d)*1.2,Qe.tdY,r+Qe.tdZ+Math.cos(d)*.8,0,0,Qe.tdAimZ,Qe.tdFov);break}case"dollyEnemy":{let d=Qe.deFar-Math.min(1,e/2)*(Qe.deFar-Qe.deNear);vn(n,o+.25-u*2,l*Qe.deY,a+d,o,Qe.deAimY,a,Qe.deFov);break}case"hands":{let d=Math.PI-.5+u*3;vn(n,i+Math.sin(d)*Qe.haD+c,l*Qe.haY,r+Math.cos(d)*Qe.haD,i,Qe.haAimY,r,Qe.haFov);break}}return n.fov=ay(n.fov,t),n}var Qe={otsX:.45,otsY:1.08,otsZ:1.8,otsAimX:-.2,otsAimY:.55,otsFov:50,wideX:.9,wideY:1.3,wideZ:3,wideAimX:-.3,wideAimY:.45,wideFov:46,ecD:2.4,ecY:.55,ecAimY:1.05,ecFov:50,hlD:2.6,hlY:.3,hlAimY:1.05,hlFov:55,tdY:9,tdZ:3.5,tdAimZ:.4,tdFov:58,deFar:4.8,deNear:2.6,deY:.55,deAimY:1.05,deFov:48,haD:2,haY:.5,haAimY:1.05,haFov:50};var mp=6;function cy(s){let e=document.createElement("canvas");e.width=256,e.height=64;let t=e.getContext("2d");t.font="bold 44px sans-serif",t.textAlign="center",t.textBaseline="middle",t.strokeStyle="#fff",t.lineWidth=3,t.strokeRect(4,4,248,56),t.fillStyle="#fff",t.fillText(s,128,34);let n=new gi(e);return n.colorSpace=Mt,n}function hy(){let s=document.createElement("canvas");s.width=128,s.height=64;let e=s.getContext("2d");e.fillStyle="#3a3a36",e.fillRect(0,0,128,64);for(let n=0;n<2;n++)for(let i=-1;i<2;i++){let r=i*64+n%2*32+2,o=n*32+2,a=e.createLinearGradient(r,o,r,o+28);a.addColorStop(0,"#f4f1e8"),a.addColorStop(1,"#cfcabd"),e.fillStyle=a,e.fillRect(r,o,60,28)}let t=new gi(s);return t.colorSpace=Mt,t.wrapS=t.wrapT=zn,t.repeat.set(26,10),t}function uy(s){let e=document.createElement("canvas");e.width=512,e.height=96;let t=e.getContext("2d");t.fillStyle="#16307a",t.fillRect(0,0,512,96),t.strokeStyle="#e9e4d4",t.lineWidth=5,t.strokeRect(6,6,500,84),t.fillStyle="#f4f1e8",t.font="bold 58px sans-serif",t.textAlign="center",t.textBaseline="middle",t.fillText(s,256,52);let n=new gi(e);return n.colorSpace=Mt,n}function dy(){let s=new St,e=9.5,t=-2,n=new Be(new fs(e,e,26,24,1,!0,0,Math.PI/2),new fn({map:hy(),side:Ft}));n.rotation.z=Math.PI/2,n.rotation.y=Math.PI,n.position.set(0,0,t),s.add(n);let i=T=>t-Math.sqrt(e*e-T*T)+.15,r=-8.6,o=new Be(new Qt(26,3.2),new fn({color:723468}));o.rotation.x=-Math.PI/2,o.position.set(0,.012,r-1.6),s.add(o);let a=new Be(new Qt(26,.28),new st({color:14201600}));a.rotation.x=-Math.PI/2,a.position.set(0,.03,r+.14),s.add(a);let l=new fn({color:9079440});for(let T of[-.9,-2.3]){let x=new Be(new rn(26,.06,.07),l);x.position.set(0,.05,r+T),s.add(x)}let c=new Be(new Qt(3.4,.64),new st({map:uy("CHATELET")}));c.position.set(0,2.8,i(2.8)),s.add(c);let h=new st({color:16760944});for(let T of[-4.6,4.6]){let x=new Be(new Qt(2.2,1.5),h);x.position.set(T,1.9,i(1.9)),s.add(x)}let u=new st({color:13628671});for(let T of[-7,0,7]){let x=new Be(new rn(3,.08,.08),u);x.position.set(T,6,i(6)+.1),s.add(x)}let d=new rn(.28,1,.9),f=new fn({color:10133672}),g=new fs(.025,.025,.55,5),_=new fn({color:13685978}),m=new rn(.1,.06,.12),p=new st({color:16724016}),b=new st({color:3211120});for(let T of[-1,1])for(let x=0;x<3;x++){let S=new St,M=new Be(d,f);M.position.y=.5,S.add(M);let A=new Be(g,_);A.rotation.z=Math.PI/2,A.position.set(.4*-T,.85,0),S.add(A);let v=new Be(m,x===1?b:p);v.position.set(0,1.03,.3),S.add(v),S.position.set(T*(2.5+x*.85),0,-5.4),s.add(S)}return s.visible=!1,s}var ec=class{constructor(e,t){this.scene=e;this.base=t;B(this,"group",new St);B(this,"rim");B(this,"rim2");B(this,"floor");B(this,"sky");B(this,"backdrop");B(this,"signs",[]);B(this,"lights",[]);B(this,"key");B(this,"neon",[new de("#00e5ff"),new de("#ff2bd6")]);B(this,"loader",new _s);B(this,"artKey","");B(this,"metro",dy());e.fog=new Qr(656916,9,30),e.add(this.group),this.group.add(this.metro),this.floor=new fn({color:2827829});let n=new Be(new cr(mp,40),this.floor);n.receiveShadow=!0,n.rotation.x=-Math.PI/2,this.group.add(n);let i=new Be(new cr(30,24),new fn({color:460043}));i.rotation.x=-Math.PI/2,i.position.y=-.02,this.group.add(i),this.rim=new st({color:16777215});let r=new Be(new co(mp,.07,6,64),this.rim);r.rotation.x=-Math.PI/2,r.position.y=.04,this.group.add(r),this.rim2=new st({color:16777215});let o=new Be(new ms(1.1,1.18,40),this.rim2);o.rotation.x=-Math.PI/2,o.position.y=.01,this.group.add(o),this.sky=new ft({side:Ft,depthWrite:!1,fog:!1,uniforms:{top:{value:new de(328458)},bottom:{value:new de(2756410)}},vertexShader:"varying float vY; void main(){ vY = normalize(position).y; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }",fragmentShader:"uniform vec3 top; uniform vec3 bottom; varying float vY; void main(){ gl_FragColor = vec4(mix(bottom, top, smoothstep(-0.05, 0.6, vY)), 1.0); }"}),this.group.add(new Be(new lo(60,16,8),this.sky)),this.backdrop=new st({color:7829367,side:Ft,fog:!1});let a=Math.PI*.62,l=new Be(new fs(15,15,9,24,1,!0,Math.PI-a/2,a),this.backdrop);l.position.set(0,3.2,0),this.group.add(l),["AURA","FARM","69"].forEach((g,_)=>{let m=new st({map:cy(g),transparent:!0,depthWrite:!1,fog:!1}),p=new Be(new Qt(2.4,.6),m),b=Math.PI+(_-1)*.55;p.position.set(Math.sin(b)*11,4.2+_%2*.9,Math.cos(b)*11),p.lookAt(0,3,0),this.group.add(p),this.signs.push({mat:m,base:new de,phase:_*1.7})}),this.scene.add(new po(11845340,2761267,1.1));let h=new Vi(16765600,2.4);h.position.set(3,7,7),h.castShadow=!0,h.shadow.mapSize.set(1024,1024);let u=h.shadow.camera;u.left=u.bottom=-5,u.right=u.top=5,u.near=1,u.far=25,h.shadow.bias=-5e-4,h.shadow.normalBias=.02,this.scene.add(h,h.target),this.key=h;let d=new Vi(8368383,2);d.position.set(-4,5,-9),this.scene.add(d);let f=[[-4,3.2,-2],[4,3.2,-2],[0,3.5,4.5]];for(let g of f){let _=new vs(16777215,8,14,1.2);_.position.set(...g),this.scene.add(_),this.lights.push(_)}this.applyColors()}setLevel(e){this.neon=[new de(e.neon[0]),new de(e.neon[1])],this.applyColors(),this.metro.visible=e.stage==="metro";let t=e.stage==="parvis"?"rooftop":e.artKey||e.stage;t!==this.artKey&&(this.artKey=t,this.loader.load(`${this.base}art/${t}.jpg`,n=>{n.colorSpace=Mt,n.wrapS=zn,n.repeat.x=-1,this.backdrop.map?.dispose(),this.backdrop.map=n,this.backdrop.needsUpdate=!0},void 0,()=>{}))}applyColors(){let[e,t]=this.neon;this.rim.color.copy(e).multiplyScalar(1.6),this.rim2.color.copy(t).multiplyScalar(1.2),this.signs.forEach((n,i)=>n.base.copy(i%2?t:e).multiplyScalar(1.6)),this.lights[0].color.copy(e),this.lights[1].color.copy(t),this.lights[2].color.copy(e).lerp(t,.5).lerp(new de(1,1,1),.4),this.sky.uniforms.bottom.value.copy(t).multiplyScalar(.18),this.scene.fog.color.copy(t).multiplyScalar(.08)}update(e,t,n){let i=Math.pow(1-Math.min(1,e*2),3),r=.35+.65*t;this.lights[0].intensity=(3+7*i)*r,this.lights[1].intensity=(3+7*(1-i)*.5+3*i)*r,this.lights[2].intensity=3+3*i*r,this.rim.color.copy(this.neon[0]).multiplyScalar(1.1+.9*i*r);for(let o of this.signs){let a=Math.sin(n*13+o.phase)>.97?.3:1;o.mat.color.copy(o.base).multiplyScalar(a*(.7+.5*i*r))}}};var Zi=28,fy=7.4,tc=class{constructor(){B(this,"group",new St);B(this,"body");B(this,"head");B(this,"ghostBody");B(this,"ghostHead");B(this,"angle",[]);B(this,"phase",[]);B(this,"jumpV",[]);B(this,"jumpY",[]);B(this,"delay",[]);B(this,"pending",[]);B(this,"m",new Ge);B(this,"q",new Ht);B(this,"s",new D(1,1,1));B(this,"p",new D);B(this,"ghostMat");B(this,"ghost",0);let e=new ds(.26,.75,2,6);e.translate(0,.64,0);let t=new ps(.2,0);t.translate(0,1.42,0);let n=new fn({color:16777215});this.body=new jn(e,n,Zi),this.head=new jn(t,n,Zi),this.ghostMat=new st({color:3153984,transparent:!0,opacity:.35,depthWrite:!1}),this.ghostBody=new jn(e,this.ghostMat,Zi),this.ghostHead=new jn(t,this.ghostMat,Zi),this.ghostBody.visible=this.ghostHead.visible=!1;let i=new de;for(let r=0;r<Zi;r++)this.angle.push(r/Zi*Math.PI*2+(Math.random()-.5)*.12),this.phase.push(r%3),this.jumpV.push(0),this.jumpY.push(0),this.delay.push(.09+Math.random()*.1),this.pending.push(-1),i.setHSL(.7+Math.random()*.2,.3,.12+Math.random()*.12),this.body.setColorAt(r,i),i.offsetHSL(0,0,.1),this.head.setColorAt(r,i);for(let r of[this.body,this.head,this.ghostBody,this.ghostHead])r.frustumCulled=!1;this.group.add(this.body,this.head,this.ghostBody,this.ghostHead)}jump(e=1){for(let t=0;t<Zi;t++)Math.random()<.5+.5*e&&(this.pending[t]=this.delay[t]*(.8+Math.random()*.4))}update(e,t,n,i){for(let o=0;o<Zi;o++){this.pending[o]>=0&&(this.pending[o]-=e,this.pending[o]<0&&(this.jumpV[o]=3.2+Math.random()*1.3)),(this.jumpV[o]!==0||this.jumpY[o]>0)&&(this.jumpY[o]+=this.jumpV[o]*e,this.jumpV[o]-=14*e,this.jumpY[o]<=0&&(this.jumpY[o]=0,this.jumpV[o]=0));let a=t+this.phase[o]/3,l=Math.abs(Math.sin(Math.PI*a))*(.06+.16*n)*i,c=this.angle[o],h=fy+o%2*.9;this.p.set(Math.sin(c)*h,l+this.jumpY[o],Math.cos(c)*h),this.q.setFromAxisAngle(Tt.DEFAULT_UP,c+Math.PI+Math.sin(a*Math.PI)*.15);let u=1-l*.4;this.s.set(1/Math.sqrt(u),u,1/Math.sqrt(u)),this.m.compose(this.p,this.q,this.s),this.body.setMatrixAt(o,this.m),this.head.setMatrixAt(o,this.m),this.ghost>.01&&(this.p.x+=.35*this.ghost,this.m.compose(this.p,this.q,this.s),this.ghostBody.setMatrixAt(o,this.m),this.ghostHead.setMatrixAt(o,this.m))}this.body.instanceMatrix.needsUpdate=!0,this.head.instanceMatrix.needsUpdate=!0;let r=this.ghost>.01;this.ghostBody.visible=this.ghostHead.visible=r,r&&(this.ghostMat.opacity=.4*this.ghost,this.ghostBody.instanceMatrix.needsUpdate=!0,this.ghostHead.instanceMatrix.needsUpdate=!0)}setTint(e){this.ghostMat.color.copy(e).multiplyScalar(.5)}};function cu(s,e){if(e===Ih)return console.warn("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Geometry already defined as triangles."),s;if(e===xr||e===Po){let t=s.getIndex();if(t===null){let r=[],o=s.getAttribute("position");if(o!==void 0){for(let a=0;a<o.count;a++)r.push(a);s.setIndex(r),t=s.getIndex()}else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Undefined position attribute. Processing not possible."),s}let n=t.count-2,i=[];if(e===xr)for(let r=1;r<=n;r++)i.push(t.getX(0)),i.push(t.getX(r)),i.push(t.getX(r+1));else for(let r=0;r<n;r++)r%2===0?(i.push(t.getX(r)),i.push(t.getX(r+1)),i.push(t.getX(r+2))):(i.push(t.getX(r+2)),i.push(t.getX(r+1)),i.push(t.getX(r)));return i.length/3!==n&&console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unable to generate correct amount of triangles."),s.setIndex(i),s.clearGroups(),s}else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unknown draw mode:",e),s}var nc=class extends ei{constructor(e){super(e),this.dracoLoader=null,this.ktx2Loader=null,this.meshoptDecoder=null,this.pluginCallbacks=[],this.register(function(t){return new gu(t)}),this.register(function(t){return new _u(t)}),this.register(function(t){return new wu(t)}),this.register(function(t){return new Au(t)}),this.register(function(t){return new Ru(t)}),this.register(function(t){return new vu(t)}),this.register(function(t){return new yu(t)}),this.register(function(t){return new bu(t)}),this.register(function(t){return new Mu(t)}),this.register(function(t){return new mu(t)}),this.register(function(t){return new Su(t)}),this.register(function(t){return new xu(t)}),this.register(function(t){return new Eu(t)}),this.register(function(t){return new Tu(t)}),this.register(function(t){return new fu(t)}),this.register(function(t){return new ic(t,$e.EXT_MESHOPT_COMPRESSION)}),this.register(function(t){return new ic(t,$e.KHR_MESHOPT_COMPRESSION)}),this.register(function(t){return new Cu(t)})}load(e,t,n,i){let r=this,o;if(this.resourcePath!=="")o=this.resourcePath;else if(this.path!==""){let c=Mi.extractUrlBase(e);o=Mi.resolveURL(c,this.path)}else o=Mi.extractUrlBase(e);this.manager.itemStart(e);let a=function(c){i?i(c):console.error(c),r.manager.itemError(e),r.manager.itemEnd(e)},l=new hr(this.manager);l.setPath(this.path),l.setResponseType("arraybuffer"),l.setRequestHeader(this.requestHeader),l.setWithCredentials(this.withCredentials),l.load(e,function(c){try{r.parse(c,o,function(h){t(h),r.manager.itemEnd(e)},a)}catch(h){a(h)}},n,a)}setDRACOLoader(e){return this.dracoLoader=e,this}setKTX2Loader(e){return this.ktx2Loader=e,this}setMeshoptDecoder(e){return this.meshoptDecoder=e,this}register(e){return this.pluginCallbacks.indexOf(e)===-1&&this.pluginCallbacks.push(e),this}unregister(e){return this.pluginCallbacks.indexOf(e)!==-1&&this.pluginCallbacks.splice(this.pluginCallbacks.indexOf(e),1),this}parse(e,t,n,i){let r,o={},a={},l=new TextDecoder;if(typeof e=="string")r=JSON.parse(e);else if(e instanceof ArrayBuffer)if(l.decode(new Uint8Array(e,0,4))===yp){try{o[$e.KHR_BINARY_GLTF]=new Pu(e)}catch(u){i&&i(u);return}r=JSON.parse(o[$e.KHR_BINARY_GLTF].content)}else r=JSON.parse(l.decode(e));else r=e;if(r.asset===void 0||r.asset.version[0]<2){i&&i(new Error("THREE.GLTFLoader: Unsupported asset. glTF versions >=2.0 are supported."));return}let c=new Bu(r,{path:t||this.resourcePath||"",crossOrigin:this.crossOrigin,requestHeader:this.requestHeader,manager:this.manager,ktx2Loader:this.ktx2Loader,meshoptDecoder:this.meshoptDecoder});c.fileLoader.setRequestHeader(this.requestHeader);for(let h=0;h<this.pluginCallbacks.length;h++){let u=this.pluginCallbacks[h](c);u.name||console.error("THREE.GLTFLoader: Invalid plugin found: missing name"),a[u.name]=u,o[u.name]=!0}if(r.extensionsUsed)for(let h=0;h<r.extensionsUsed.length;++h){let u=r.extensionsUsed[h],d=r.extensionsRequired||[];switch(u){case $e.KHR_MATERIALS_UNLIT:o[u]=new pu;break;case $e.KHR_DRACO_MESH_COMPRESSION:o[u]=new Iu(r,this.dracoLoader);break;case $e.KHR_TEXTURE_TRANSFORM:o[u]=new Lu;break;case $e.KHR_MESH_QUANTIZATION:o[u]=new Du;break;default:d.indexOf(u)>=0&&a[u]===void 0&&console.warn('THREE.GLTFLoader: Unknown extension "'+u+'".')}}c.setExtensions(o),c.setPlugins(a),c.parse(n,i)}parseAsync(e,t){let n=this;return new Promise(function(i,r){n.parse(e,t,i,r)})}};function py(){let s={};return{get:function(e){return s[e]},add:function(e,t){s[e]=t},remove:function(e){delete s[e]},removeAll:function(){s={}}}}function Bt(s,e,t){let n=s.json.materials[e];return n.extensions&&n.extensions[t]?n.extensions[t]:null}var $e={KHR_BINARY_GLTF:"KHR_binary_glTF",KHR_DRACO_MESH_COMPRESSION:"KHR_draco_mesh_compression",KHR_LIGHTS_PUNCTUAL:"KHR_lights_punctual",KHR_MATERIALS_CLEARCOAT:"KHR_materials_clearcoat",KHR_MATERIALS_DISPERSION:"KHR_materials_dispersion",KHR_MATERIALS_IOR:"KHR_materials_ior",KHR_MATERIALS_SHEEN:"KHR_materials_sheen",KHR_MATERIALS_SPECULAR:"KHR_materials_specular",KHR_MATERIALS_TRANSMISSION:"KHR_materials_transmission",KHR_MATERIALS_IRIDESCENCE:"KHR_materials_iridescence",KHR_MATERIALS_ANISOTROPY:"KHR_materials_anisotropy",KHR_MATERIALS_UNLIT:"KHR_materials_unlit",KHR_MATERIALS_VOLUME:"KHR_materials_volume",KHR_TEXTURE_BASISU:"KHR_texture_basisu",KHR_TEXTURE_TRANSFORM:"KHR_texture_transform",KHR_MESH_QUANTIZATION:"KHR_mesh_quantization",KHR_MATERIALS_EMISSIVE_STRENGTH:"KHR_materials_emissive_strength",EXT_MATERIALS_BUMP:"EXT_materials_bump",EXT_TEXTURE_WEBP:"EXT_texture_webp",EXT_TEXTURE_AVIF:"EXT_texture_avif",EXT_MESHOPT_COMPRESSION:"EXT_meshopt_compression",KHR_MESHOPT_COMPRESSION:"KHR_meshopt_compression",EXT_MESH_GPU_INSTANCING:"EXT_mesh_gpu_instancing"},fu=class{constructor(e){this.parser=e,this.name=$e.KHR_LIGHTS_PUNCTUAL,this.cache={refs:{},uses:{}}}_markDefs(){let e=this.parser,t=this.parser.json.nodes||[];for(let n=0,i=t.length;n<i;n++){let r=t[n];r.extensions&&r.extensions[this.name]&&r.extensions[this.name].light!==void 0&&e._addNodeRef(this.cache,r.extensions[this.name].light)}}_loadLight(e){let t=this.parser,n="light:"+e,i=t.cache.get(n);if(i)return i;let r=t.json,l=((r.extensions&&r.extensions[this.name]||{}).lights||[])[e],c,h=new de(16777215);l.color!==void 0&&h.setRGB(l.color[0],l.color[1],l.color[2],un);let u=l.range!==void 0?l.range:0;switch(l.type){case"directional":c=new Vi(h),c.target.position.set(0,0,-1),c.add(c.target);break;case"point":c=new vs(h),c.distance=u;break;case"spot":c=new go(h),c.distance=u,l.spot=l.spot||{},l.spot.innerConeAngle=l.spot.innerConeAngle!==void 0?l.spot.innerConeAngle:0,l.spot.outerConeAngle=l.spot.outerConeAngle!==void 0?l.spot.outerConeAngle:Math.PI/4,c.angle=l.spot.outerConeAngle,c.penumbra=1-l.spot.innerConeAngle/l.spot.outerConeAngle,c.target.position.set(0,0,-1),c.add(c.target);break;default:throw new Error("THREE.GLTFLoader: Unexpected light type: "+l.type)}return c.position.set(0,0,0),ri(c,l),l.intensity!==void 0&&(c.intensity=l.intensity),c.name=t.createUniqueName(l.name||"light_"+e),i=Promise.resolve(c),t.cache.add(n,i),i}getDependency(e,t){if(e==="light")return this._loadLight(t)}createNodeAttachment(e){let t=this,n=this.parser,r=n.json.nodes[e],a=(r.extensions&&r.extensions[this.name]||{}).light;return a===void 0?null:this._loadLight(a).then(function(l){return n._getNodeRef(t.cache,a,l)})}},pu=class{constructor(){this.name=$e.KHR_MATERIALS_UNLIT}getMaterialType(){return st}extendParams(e,t,n){let i=[];e.color=new de(1,1,1),e.opacity=1;let r=t.pbrMetallicRoughness;if(r){if(Array.isArray(r.baseColorFactor)){let o=r.baseColorFactor;e.color.setRGB(o[0],o[1],o[2],un),e.opacity=o[3]}r.baseColorTexture!==void 0&&i.push(n.assignTexture(e,"map",r.baseColorTexture,Mt))}return Promise.all(i)}},mu=class{constructor(e){this.parser=e,this.name=$e.KHR_MATERIALS_EMISSIVE_STRENGTH}extendMaterialParams(e,t){let n=Bt(this.parser,e,this.name);return n===null||n.emissiveStrength!==void 0&&(t.emissiveIntensity=n.emissiveStrength),Promise.resolve()}},gu=class{constructor(e){this.parser=e,this.name=$e.KHR_MATERIALS_CLEARCOAT}getMaterialType(e){return Bt(this.parser,e,this.name)!==null?gn:null}extendMaterialParams(e,t){let n=Bt(this.parser,e,this.name);if(n===null)return Promise.resolve();let i=[];if(n.clearcoatFactor!==void 0&&(t.clearcoat=n.clearcoatFactor),n.clearcoatTexture!==void 0&&i.push(this.parser.assignTexture(t,"clearcoatMap",n.clearcoatTexture)),n.clearcoatRoughnessFactor!==void 0&&(t.clearcoatRoughness=n.clearcoatRoughnessFactor),n.clearcoatRoughnessTexture!==void 0&&i.push(this.parser.assignTexture(t,"clearcoatRoughnessMap",n.clearcoatRoughnessTexture)),n.clearcoatNormalTexture!==void 0&&(i.push(this.parser.assignTexture(t,"clearcoatNormalMap",n.clearcoatNormalTexture)),n.clearcoatNormalTexture.scale!==void 0)){let r=n.clearcoatNormalTexture.scale;t.clearcoatNormalScale=new Te(r,r)}return Promise.all(i)}},_u=class{constructor(e){this.parser=e,this.name=$e.KHR_MATERIALS_DISPERSION}getMaterialType(e){return Bt(this.parser,e,this.name)!==null?gn:null}extendMaterialParams(e,t){let n=Bt(this.parser,e,this.name);return n===null||(t.dispersion=n.dispersion!==void 0?n.dispersion:0),Promise.resolve()}},xu=class{constructor(e){this.parser=e,this.name=$e.KHR_MATERIALS_IRIDESCENCE}getMaterialType(e){return Bt(this.parser,e,this.name)!==null?gn:null}extendMaterialParams(e,t){let n=Bt(this.parser,e,this.name);if(n===null)return Promise.resolve();let i=[];return n.iridescenceFactor!==void 0&&(t.iridescence=n.iridescenceFactor),n.iridescenceTexture!==void 0&&i.push(this.parser.assignTexture(t,"iridescenceMap",n.iridescenceTexture)),n.iridescenceIor!==void 0&&(t.iridescenceIOR=n.iridescenceIor),t.iridescenceThicknessRange===void 0&&(t.iridescenceThicknessRange=[100,400]),n.iridescenceThicknessMinimum!==void 0&&(t.iridescenceThicknessRange[0]=n.iridescenceThicknessMinimum),n.iridescenceThicknessMaximum!==void 0&&(t.iridescenceThicknessRange[1]=n.iridescenceThicknessMaximum),n.iridescenceThicknessTexture!==void 0&&i.push(this.parser.assignTexture(t,"iridescenceThicknessMap",n.iridescenceThicknessTexture)),Promise.all(i)}},vu=class{constructor(e){this.parser=e,this.name=$e.KHR_MATERIALS_SHEEN}getMaterialType(e){return Bt(this.parser,e,this.name)!==null?gn:null}extendMaterialParams(e,t){let n=Bt(this.parser,e,this.name);if(n===null)return Promise.resolve();let i=[];if(t.sheenColor=new de(0,0,0),t.sheenRoughness=0,t.sheen=1,n.sheenColorFactor!==void 0){let r=n.sheenColorFactor;t.sheenColor.setRGB(r[0],r[1],r[2],un)}return n.sheenRoughnessFactor!==void 0&&(t.sheenRoughness=n.sheenRoughnessFactor),n.sheenColorTexture!==void 0&&i.push(this.parser.assignTexture(t,"sheenColorMap",n.sheenColorTexture,Mt)),n.sheenRoughnessTexture!==void 0&&i.push(this.parser.assignTexture(t,"sheenRoughnessMap",n.sheenRoughnessTexture)),Promise.all(i)}},yu=class{constructor(e){this.parser=e,this.name=$e.KHR_MATERIALS_TRANSMISSION}getMaterialType(e){return Bt(this.parser,e,this.name)!==null?gn:null}extendMaterialParams(e,t){let n=Bt(this.parser,e,this.name);if(n===null)return Promise.resolve();let i=[];return n.transmissionFactor!==void 0&&(t.transmission=n.transmissionFactor),n.transmissionTexture!==void 0&&i.push(this.parser.assignTexture(t,"transmissionMap",n.transmissionTexture)),Promise.all(i)}},bu=class{constructor(e){this.parser=e,this.name=$e.KHR_MATERIALS_VOLUME}getMaterialType(e){return Bt(this.parser,e,this.name)!==null?gn:null}extendMaterialParams(e,t){let n=Bt(this.parser,e,this.name);if(n===null)return Promise.resolve();let i=[];t.thickness=n.thicknessFactor!==void 0?n.thicknessFactor:0,n.thicknessTexture!==void 0&&i.push(this.parser.assignTexture(t,"thicknessMap",n.thicknessTexture)),t.attenuationDistance=n.attenuationDistance||1/0;let r=n.attenuationColor||[1,1,1];return t.attenuationColor=new de().setRGB(r[0],r[1],r[2],un),Promise.all(i)}},Mu=class{constructor(e){this.parser=e,this.name=$e.KHR_MATERIALS_IOR}getMaterialType(e){return Bt(this.parser,e,this.name)!==null?gn:null}extendMaterialParams(e,t){let n=Bt(this.parser,e,this.name);return n===null||(t.ior=n.ior!==void 0?n.ior:1.5,t.ior===0&&(t.ior=1e3)),Promise.resolve()}},Su=class{constructor(e){this.parser=e,this.name=$e.KHR_MATERIALS_SPECULAR}getMaterialType(e){return Bt(this.parser,e,this.name)!==null?gn:null}extendMaterialParams(e,t){let n=Bt(this.parser,e,this.name);if(n===null)return Promise.resolve();let i=[];t.specularIntensity=n.specularFactor!==void 0?n.specularFactor:1,n.specularTexture!==void 0&&i.push(this.parser.assignTexture(t,"specularIntensityMap",n.specularTexture));let r=n.specularColorFactor||[1,1,1];return t.specularColor=new de().setRGB(r[0],r[1],r[2],un),n.specularColorTexture!==void 0&&i.push(this.parser.assignTexture(t,"specularColorMap",n.specularColorTexture,Mt)),Promise.all(i)}},Tu=class{constructor(e){this.parser=e,this.name=$e.EXT_MATERIALS_BUMP}getMaterialType(e){return Bt(this.parser,e,this.name)!==null?gn:null}extendMaterialParams(e,t){let n=Bt(this.parser,e,this.name);if(n===null)return Promise.resolve();let i=[];return t.bumpScale=n.bumpFactor!==void 0?n.bumpFactor:1,n.bumpTexture!==void 0&&i.push(this.parser.assignTexture(t,"bumpMap",n.bumpTexture)),Promise.all(i)}},Eu=class{constructor(e){this.parser=e,this.name=$e.KHR_MATERIALS_ANISOTROPY}getMaterialType(e){return Bt(this.parser,e,this.name)!==null?gn:null}extendMaterialParams(e,t){let n=Bt(this.parser,e,this.name);if(n===null)return Promise.resolve();let i=[];return n.anisotropyStrength!==void 0&&(t.anisotropy=n.anisotropyStrength),n.anisotropyRotation!==void 0&&(t.anisotropyRotation=n.anisotropyRotation),n.anisotropyTexture!==void 0&&i.push(this.parser.assignTexture(t,"anisotropyMap",n.anisotropyTexture)),Promise.all(i)}},wu=class{constructor(e){this.parser=e,this.name=$e.KHR_TEXTURE_BASISU}loadTexture(e){let t=this.parser,n=t.json,i=n.textures[e];if(!i.extensions||!i.extensions[this.name])return null;let r=i.extensions[this.name],o=t.options.ktx2Loader;if(!o){if(n.extensionsRequired&&n.extensionsRequired.indexOf(this.name)>=0)throw new Error("THREE.GLTFLoader: setKTX2Loader must be called before loading KTX2 textures");return null}return t.loadTextureImage(e,r.source,o)}},Au=class{constructor(e){this.parser=e,this.name=$e.EXT_TEXTURE_WEBP}loadTexture(e){let t=this.name,n=this.parser,i=n.json,r=i.textures[e];if(!r.extensions||!r.extensions[t])return null;let o=r.extensions[t],a=i.images[o.source],l=n.textureLoader;if(a.uri){let c=n.options.manager.getHandler(a.uri);c!==null&&(l=c)}return n.loadTextureImage(e,o.source,l)}},Ru=class{constructor(e){this.parser=e,this.name=$e.EXT_TEXTURE_AVIF}loadTexture(e){let t=this.name,n=this.parser,i=n.json,r=i.textures[e];if(!r.extensions||!r.extensions[t])return null;let o=r.extensions[t],a=i.images[o.source],l=n.textureLoader;if(a.uri){let c=n.options.manager.getHandler(a.uri);c!==null&&(l=c)}return n.loadTextureImage(e,o.source,l)}},ic=class{constructor(e,t){this.name=t,this.parser=e}loadBufferView(e){let t=this.parser.json,n=t.bufferViews[e];if(n.extensions&&n.extensions[this.name]){let i=n.extensions[this.name],r=this.parser.getDependency("buffer",i.buffer),o=this.parser.options.meshoptDecoder;if(!o||!o.supported){if(t.extensionsRequired&&t.extensionsRequired.indexOf(this.name)>=0)throw new Error("THREE.GLTFLoader: setMeshoptDecoder must be called before loading compressed files");return null}return r.then(function(a){let l=i.byteOffset||0,c=i.byteLength||0,h=i.count,u=i.byteStride,d=new Uint8Array(a,l,c);return o.decodeGltfBufferAsync?o.decodeGltfBufferAsync(h,u,d,i.mode,i.filter).then(function(f){return f.buffer}):o.ready.then(function(){let f=new ArrayBuffer(h*u);return o.decodeGltfBuffer(new Uint8Array(f),h,u,d,i.mode,i.filter),f})})}else return null}},Cu=class{constructor(e){this.name=$e.EXT_MESH_GPU_INSTANCING,this.parser=e}createNodeMesh(e){let t=this.parser.json,n=t.nodes[e];if(!n.extensions||!n.extensions[this.name]||n.mesh===void 0)return null;let i=t.meshes[n.mesh];for(let c of i.primitives)if(c.mode!==In.TRIANGLES&&c.mode!==In.TRIANGLE_STRIP&&c.mode!==In.TRIANGLE_FAN&&c.mode!==void 0)return null;let o=n.extensions[this.name].attributes,a=[],l={};for(let c in o)a.push(this.parser.getDependency("accessor",o[c]).then(h=>(l[c]=h,l[c])));return a.length<1?null:(a.push(this.parser.createNodeMesh(e)),Promise.all(a).then(c=>{let h=c.pop(),u=h.isGroup?h.children:[h],d=c[0].count,f=[];for(let g of u){let _=new Ge,m=new D,p=new Ht,b=new D(1,1,1),T=new jn(g.geometry,g.material,d);for(let S=0;S<d;S++)l.TRANSLATION&&m.fromBufferAttribute(l.TRANSLATION,S),l.ROTATION&&p.fromBufferAttribute(l.ROTATION,S),l.SCALE&&b.fromBufferAttribute(l.SCALE,S),T.setMatrixAt(S,_.compose(m,p,b));let x=null;for(let S in l)if(S==="_COLOR_0"){let M=l[S];T.instanceColor=new mi(M.array,M.itemSize,M.normalized)}else if(S!=="TRANSLATION"&&S!=="ROTATION"&&S!=="SCALE"){if(x===null){let A=T.geometry;x=new yt,x.name=A.name;for(let v in A.attributes)x.setAttribute(v,A.attributes[v]);for(let v in A.morphAttributes)x.morphAttributes[v]=A.morphAttributes[v];A.index!==null&&x.setIndex(A.index),x.morphTargetsRelative=A.morphTargetsRelative;for(let v of A.groups)x.addGroup(v.start,v.count,v.materialIndex);A.boundingBox!==null&&(x.boundingBox=A.boundingBox.clone()),A.boundingSphere!==null&&(x.boundingSphere=A.boundingSphere.clone()),x.drawRange.start=A.drawRange.start,x.drawRange.count=A.drawRange.count,x.userData=Object.assign({},A.userData),T.geometry=x}let M=l[S];x.setAttribute(S,new mi(M.array,M.itemSize,M.normalized))}Tt.prototype.copy.call(T,g),this.parser.assignFinalMaterial(T),f.push(T)}return h.isGroup?(h.clear(),h.add(...f),h):f[0]}))}},yp="glTF",Uo=12,gp={JSON:1313821514,BIN:5130562},Pu=class{constructor(e){this.name=$e.KHR_BINARY_GLTF,this.content=null,this.body=null;let t=new DataView(e,0,Uo),n=new TextDecoder;if(this.header={magic:n.decode(new Uint8Array(e.slice(0,4))),version:t.getUint32(4,!0),length:t.getUint32(8,!0)},this.header.magic!==yp)throw new Error("THREE.GLTFLoader: Unsupported glTF-Binary header.");if(this.header.version<2)throw new Error("THREE.GLTFLoader: Legacy binary file detected.");let i=this.header.length-Uo,r=new DataView(e,Uo),o=0;for(;o<i;){let a=r.getUint32(o,!0);o+=4;let l=r.getUint32(o,!0);if(o+=4,l===gp.JSON){let c=new Uint8Array(e,Uo+o,a);this.content=n.decode(c)}else if(l===gp.BIN){let c=Uo+o;this.body=e.slice(c,c+a)}o+=a}if(this.content===null)throw new Error("THREE.GLTFLoader: JSON content not found.")}},Iu=class{constructor(e,t){if(!t)throw new Error("THREE.GLTFLoader: No DRACOLoader instance provided.");this.name=$e.KHR_DRACO_MESH_COMPRESSION,this.json=e,this.dracoLoader=t,this.dracoLoader.preload()}decodePrimitive(e,t){let n=this.json,i=this.dracoLoader,r=e.extensions[this.name].bufferView,o=e.extensions[this.name].attributes,a={},l={},c={};for(let h in o){let u=Uu[h]||h.toLowerCase();a[u]=o[h]}for(let h in e.attributes){let u=Uu[h]||h.toLowerCase();if(o[h]!==void 0){let d=n.accessors[e.attributes[h]],f=Cr[d.componentType];c[u]=f.name,l[u]=d.normalized===!0}}return t.getDependency("bufferView",r).then(function(h){return new Promise(function(u,d){i.decodeDracoFile(h,function(f){for(let g in f.attributes){let _=f.attributes[g],m=l[g];m!==void 0&&(_.normalized=m)}u(f)},a,c,un,d)})})}},Lu=class{constructor(){this.name=$e.KHR_TEXTURE_TRANSFORM}extendTexture(e,t){if((t.texCoord===void 0||t.texCoord===e.channel)&&t.offset===void 0&&t.rotation===void 0&&t.scale===void 0)return e;if(e=e.clone(),t.texCoord!==void 0&&(e.channel=t.texCoord),t.offset!==void 0&&e.offset.fromArray(t.offset),t.rotation!==void 0&&(e.rotation=t.rotation),t.scale!==void 0&&e.repeat.fromArray(t.scale),t.rotation!==void 0){let n=Math.cos(e.rotation),i=Math.sin(e.rotation);e.matrix.set(e.repeat.x*n,e.repeat.y*i,e.offset.x,-e.repeat.x*i,e.repeat.y*n,e.offset.y,0,0,1),e.matrixAutoUpdate=!1}return e.needsUpdate=!0,e}},Du=class{constructor(){this.name=$e.KHR_MESH_QUANTIZATION}},sc=class extends Qn{constructor(e,t,n,i){super(e,t,n,i)}copySampleValue_(e){let t=this.resultBuffer,n=this.sampleValues,i=this.valueSize,r=e*i*3+i;for(let o=0;o!==i;o++)t[o]=n[r+o];return t}interpolate_(e,t,n,i){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=a*2,c=a*3,h=i-t,u=(n-t)/h,d=u*u,f=d*u,g=e*c,_=g-c,m=-2*f+3*d,p=f-d,b=1-m,T=p-d+u;for(let x=0;x!==a;x++){let S=o[_+x+a],M=o[_+x+l]*h,A=o[g+x+a],v=o[g+x]*h;r[x]=b*S+T*M+m*A+p*v}return r}},my=new Ht,Nu=class extends sc{interpolate_(e,t,n,i){let r=super.interpolate_(e,t,n,i);return my.fromArray(r).normalize().toArray(r),r}},In={FLOAT:5126,FLOAT_MAT3:35675,FLOAT_MAT4:35676,FLOAT_VEC2:35664,FLOAT_VEC3:35665,FLOAT_VEC4:35666,LINEAR:9729,REPEAT:10497,SAMPLER_2D:35678,POINTS:0,LINES:1,LINE_LOOP:2,LINE_STRIP:3,TRIANGLES:4,TRIANGLE_STRIP:5,TRIANGLE_FAN:6,UNSIGNED_BYTE:5121,UNSIGNED_SHORT:5123},Cr={5120:Int8Array,5121:Uint8Array,5122:Int16Array,5123:Uint16Array,5125:Uint32Array,5126:Float32Array},_p={9728:Lt,9729:Ut,9984:il,9985:pr,9986:Ms,9987:Gn},xp={33071:An,33648:$s,10497:zn},hu={SCALAR:1,VEC2:2,VEC3:3,VEC4:4,MAT2:4,MAT3:9,MAT4:16},Uu={POSITION:"position",NORMAL:"normal",TANGENT:"tangent",TEXCOORD_0:"uv",TEXCOORD_1:"uv1",TEXCOORD_2:"uv2",TEXCOORD_3:"uv3",COLOR_0:"color",WEIGHTS_0:"skinWeight",JOINTS_0:"skinIndex"},$i={scale:"scale",translation:"position",rotation:"quaternion",weights:"morphTargetInfluences"},gy={CUBICSPLINE:void 0,LINEAR:as,STEP:os},uu={OPAQUE:"OPAQUE",MASK:"MASK",BLEND:"BLEND"};function _y(s){return s.DefaultMaterial===void 0&&(s.DefaultMaterial=new gs({color:16777215,emissive:0,metalness:1,roughness:1,transparent:!1,depthTest:!0,side:ti})),s.DefaultMaterial}function ws(s,e,t){for(let n in t.extensions)s[n]===void 0&&(e.userData.gltfExtensions=e.userData.gltfExtensions||{},e.userData.gltfExtensions[n]=t.extensions[n])}function ri(s,e){e.extras!==void 0&&(typeof e.extras=="object"?Object.assign(s.userData,e.extras):console.warn("THREE.GLTFLoader: Ignoring primitive type .extras, "+e.extras))}function xy(s,e,t){let n=!1,i=!1,r=!1;for(let c=0,h=e.length;c<h;c++){let u=e[c];if(u.POSITION!==void 0&&(n=!0),u.NORMAL!==void 0&&(i=!0),u.COLOR_0!==void 0&&(r=!0),n&&i&&r)break}if(!n&&!i&&!r)return Promise.resolve(s);let o=[],a=[],l=[];for(let c=0,h=e.length;c<h;c++){let u=e[c];if(n){let d=u.POSITION!==void 0?t.getDependency("accessor",u.POSITION):s.attributes.position;o.push(d)}if(i){let d=u.NORMAL!==void 0?t.getDependency("accessor",u.NORMAL):s.attributes.normal;a.push(d)}if(r){let d=u.COLOR_0!==void 0?t.getDependency("accessor",u.COLOR_0):s.attributes.color;l.push(d)}}return Promise.all([Promise.all(o),Promise.all(a),Promise.all(l)]).then(function(c){let h=c[0],u=c[1],d=c[2];return n&&(s.morphAttributes.position=h),i&&(s.morphAttributes.normal=u),r&&(s.morphAttributes.color=d),s.morphTargetsRelative=!0,s})}function vy(s,e){if(s.updateMorphTargets(),e.weights!==void 0)for(let t=0,n=e.weights.length;t<n;t++)s.morphTargetInfluences[t]=e.weights[t];if(e.extras&&Array.isArray(e.extras.targetNames)){let t=e.extras.targetNames;if(s.morphTargetInfluences.length===t.length){s.morphTargetDictionary={};for(let n=0,i=t.length;n<i;n++)s.morphTargetDictionary[t[n]]=n}else console.warn("THREE.GLTFLoader: Invalid extras.targetNames length. Ignoring names.")}}function yy(s){let e,t=s.extensions&&s.extensions[$e.KHR_DRACO_MESH_COMPRESSION];if(t?e="draco:"+t.bufferView+":"+t.indices+":"+du(t.attributes):e=s.indices+":"+du(s.attributes)+":"+s.mode,s.targets!==void 0)for(let n=0,i=s.targets.length;n<i;n++)e+=":"+du(s.targets[n]);return e}function du(s){let e="",t=Object.keys(s).sort();for(let n=0,i=t.length;n<i;n++)e+=t[n]+":"+s[t[n]]+";";return e}function Fu(s){switch(s){case Int8Array:return 1/127;case Uint8Array:return 1/255;case Int16Array:return 1/32767;case Uint16Array:return 1/65535;default:throw new Error("THREE.GLTFLoader: Unsupported normalized accessor component type.")}}function by(s){return s.search(/\.jpe?g($|\?)/i)>0||s.search(/^data\:image\/jpeg/)===0?"image/jpeg":s.search(/\.webp($|\?)/i)>0||s.search(/^data\:image\/webp/)===0?"image/webp":s.search(/\.ktx2($|\?)/i)>0||s.search(/^data\:image\/ktx2/)===0?"image/ktx2":"image/png"}var My=new Ge,Bu=class{constructor(e={},t={}){this.json=e,this.extensions={},this.plugins={},this.options=t,this.cache=new py,this.associations=new Map,this.primitiveCache={},this.nodeCache={},this.meshCache={refs:{},uses:{}},this.cameraCache={refs:{},uses:{}},this.lightCache={refs:{},uses:{}},this.sourceCache={},this.textureCache={},this.nodeNamesUsed={};let n=!1,i=-1,r=!1,o=-1;if(typeof navigator<"u"&&typeof navigator.userAgent<"u"){let a=navigator.userAgent;n=/^((?!chrome|android).)*safari/i.test(a)===!0;let l=a.match(/Version\/(\d+)/);i=n&&l?parseInt(l[1],10):-1,r=a.indexOf("Firefox")>-1,o=r?a.match(/Firefox\/([0-9]+)\./)[1]:-1}typeof createImageBitmap>"u"||n&&i<17||r&&o<98?this.textureLoader=new _s(this.options.manager):this.textureLoader=new _o(this.options.manager),this.textureLoader.setCrossOrigin(this.options.crossOrigin),this.textureLoader.setRequestHeader(this.options.requestHeader),this.fileLoader=new hr(this.options.manager),this.fileLoader.setResponseType("arraybuffer"),this.options.crossOrigin==="use-credentials"&&this.fileLoader.setWithCredentials(!0)}setExtensions(e){this.extensions=e}setPlugins(e){this.plugins=e}parse(e,t){let n=this,i=this.json,r=this.extensions;this.cache.removeAll(),this.nodeCache={},this._invokeAll(function(o){return o._markDefs&&o._markDefs()}),Promise.all(this._invokeAll(function(o){return o.beforeRoot&&o.beforeRoot()})).then(function(){return Promise.all([n.getDependencies("scene"),n.getDependencies("animation"),n.getDependencies("camera")])}).then(function(o){let a={scene:o[0][i.scene||0],scenes:o[0],animations:o[1],cameras:o[2],asset:i.asset,parser:n,userData:{}};return ws(r,a,i),ri(a,i),Promise.all(n._invokeAll(function(l){return l.afterRoot&&l.afterRoot(a)})).then(function(){for(let l of a.scenes)l.updateMatrixWorld();e(a)})}).catch(t)}_markDefs(){let e=this.json.nodes||[],t=this.json.skins||[],n=this.json.meshes||[];for(let i=0,r=t.length;i<r;i++){let o=t[i].joints;for(let a=0,l=o.length;a<l;a++)e[o[a]].isBone=!0}for(let i=0,r=e.length;i<r;i++){let o=e[i];o.mesh!==void 0&&(this._addNodeRef(this.meshCache,o.mesh),o.skin!==void 0&&(n[o.mesh].isSkinnedMesh=!0)),o.camera!==void 0&&this._addNodeRef(this.cameraCache,o.camera)}}_addNodeRef(e,t){t!==void 0&&(e.refs[t]===void 0&&(e.refs[t]=e.uses[t]=0),e.refs[t]++)}_getNodeRef(e,t,n){if(e.refs[t]<=1)return n;let i=n.clone(),r=(o,a)=>{let l=this.associations.get(o);l!=null&&this.associations.set(a,l);for(let[c,h]of o.children.entries())r(h,a.children[c])};return r(n,i),i.name+="_instance_"+e.uses[t]++,i}_invokeOne(e){let t=Object.values(this.plugins);t.push(this);for(let n=0;n<t.length;n++){let i=e(t[n]);if(i)return i}return null}_invokeAll(e){let t=Object.values(this.plugins);t.unshift(this);let n=[];for(let i=0;i<t.length;i++){let r=e(t[i]);r&&n.push(r)}return n}getDependency(e,t){let n=e+":"+t,i=this.cache.get(n);if(!i){switch(e){case"scene":i=this.loadScene(t);break;case"node":i=this._invokeOne(function(r){return r.loadNode&&r.loadNode(t)});break;case"mesh":i=this._invokeOne(function(r){return r.loadMesh&&r.loadMesh(t)});break;case"accessor":i=this.loadAccessor(t);break;case"bufferView":i=this._invokeOne(function(r){return r.loadBufferView&&r.loadBufferView(t)});break;case"buffer":i=this.loadBuffer(t);break;case"material":i=this._invokeOne(function(r){return r.loadMaterial&&r.loadMaterial(t)});break;case"texture":i=this._invokeOne(function(r){return r.loadTexture&&r.loadTexture(t)});break;case"skin":i=this.loadSkin(t);break;case"animation":i=this._invokeOne(function(r){return r.loadAnimation&&r.loadAnimation(t)});break;case"camera":i=this.loadCamera(t);break;default:if(i=this._invokeOne(function(r){return r!=this&&r.getDependency&&r.getDependency(e,t)}),!i)throw new Error("Unknown type: "+e);break}this.cache.add(n,i)}return i}getDependencies(e){let t=this.cache.get(e);if(!t){let n=this,i=this.json[e+(e==="mesh"?"es":"s")]||[];t=Promise.all(i.map(function(r,o){return n.getDependency(e,o)})),this.cache.add(e,t)}return t}loadBuffer(e){let t=this.json.buffers[e],n=this.fileLoader;if(t.type&&t.type!=="arraybuffer")throw new Error("THREE.GLTFLoader: "+t.type+" buffer type is not supported.");if(t.uri===void 0&&e===0)return Promise.resolve(this.extensions[$e.KHR_BINARY_GLTF].body);let i=this.options;return new Promise(function(r,o){n.load(Mi.resolveURL(t.uri,i.path),r,void 0,function(){o(new Error('THREE.GLTFLoader: Failed to load buffer "'+t.uri+'".'))})})}loadBufferView(e){let t=this.json.bufferViews[e];return this.getDependency("buffer",t.buffer).then(function(n){let i=t.byteLength||0,r=t.byteOffset||0;return n.slice(r,r+i)})}loadAccessor(e){let t=this,n=this.json,i=this.json.accessors[e];if(i.bufferView===void 0&&i.sparse===void 0){let o=hu[i.type],a=Cr[i.componentType],l=i.normalized===!0,c=new a(i.count*o);return Promise.resolve(new Rt(c,o,l))}let r=[];return i.bufferView!==void 0?r.push(this.getDependency("bufferView",i.bufferView)):r.push(null),i.sparse!==void 0&&(r.push(this.getDependency("bufferView",i.sparse.indices.bufferView)),r.push(this.getDependency("bufferView",i.sparse.values.bufferView))),Promise.all(r).then(function(o){let a=o[0],l=hu[i.type],c=Cr[i.componentType],h=c.BYTES_PER_ELEMENT,u=h*l,d=i.byteOffset||0,f=i.bufferView!==void 0?n.bufferViews[i.bufferView].byteStride:void 0,g=i.normalized===!0,_,m;if(f&&f!==u){let p=Math.floor(d/f),b="InterleavedBuffer:"+i.bufferView+":"+i.componentType+":"+p+":"+i.count,T=t.cache.get(b);T||(_=new c(a,p*f,i.count*f/h),T=new ir(_,f/h),t.cache.add(b,T)),m=new sr(T,l,d%f/h,g)}else a===null?_=new c(i.count*l):_=new c(a,d,i.count*l),m=new Rt(_,l,g);if(i.sparse!==void 0){let p=hu.SCALAR,b=Cr[i.sparse.indices.componentType],T=i.sparse.indices.byteOffset||0,x=i.sparse.values.byteOffset||0,S=new b(o[1],T,i.sparse.count*p),M=new c(o[2],x,i.sparse.count*l);a!==null&&(m=new Rt(m.array.slice(),m.itemSize,m.normalized)),m.normalized=!1;for(let A=0,v=S.length;A<v;A++){let w=S[A];if(m.setX(w,M[A*l]),l>=2&&m.setY(w,M[A*l+1]),l>=3&&m.setZ(w,M[A*l+2]),l>=4&&m.setW(w,M[A*l+3]),l>=5)throw new Error("THREE.GLTFLoader: Unsupported itemSize in sparse BufferAttribute.")}m.normalized=g}return m})}loadTexture(e){let t=this.json,n=this.options,r=t.textures[e].source,o=t.images[r],a=this.textureLoader;if(o.uri){let l=n.manager.getHandler(o.uri);l!==null&&(a=l)}return this.loadTextureImage(e,r,a)}loadTextureImage(e,t,n){let i=this,r=this.json,o=r.textures[e],a=r.images[t],l=(a.uri||a.bufferView)+":"+o.sampler;if(this.textureCache[l])return this.textureCache[l];let c=this.loadImageSource(t,n).then(function(h){h.flipY=!1,h.name=o.name||a.name||"",h.name===""&&typeof a.uri=="string"&&a.uri.startsWith("data:image/")===!1&&(h.name=a.uri);let d=(r.samplers||{})[o.sampler]||{};return h.magFilter=_p[d.magFilter]||Ut,h.minFilter=_p[d.minFilter]||Gn,h.wrapS=xp[d.wrapS]||zn,h.wrapT=xp[d.wrapT]||zn,h.generateMipmaps=!h.isCompressedTexture&&h.minFilter!==Lt&&h.minFilter!==Ut,i.associations.set(h,{textures:e}),h}).catch(function(){return null});return this.textureCache[l]=c,c}loadImageSource(e,t){let n=this,i=this.json,r=this.options;if(this.sourceCache[e]!==void 0)return this.sourceCache[e].then(u=>u.clone());let o=i.images[e],a=self.URL||self.webkitURL,l=o.uri||"",c=!1;if(o.bufferView!==void 0)l=n.getDependency("bufferView",o.bufferView).then(function(u){c=!0;let d=new Blob([u],{type:o.mimeType});return l=a.createObjectURL(d),l});else if(o.uri===void 0)throw new Error("THREE.GLTFLoader: Image "+e+" is missing URI and bufferView");let h=Promise.resolve(l).then(function(u){return new Promise(function(d,f){let g=d;t.isImageBitmapLoader===!0&&(g=function(_){let m=new Wt(_);m.needsUpdate=!0,d(m)}),t.load(Mi.resolveURL(u,r.path),g,void 0,f)})}).then(function(u){return c===!0&&a.revokeObjectURL(l),ri(u,o),u.userData.mimeType=o.mimeType||by(o.uri),u}).catch(function(u){throw console.error("THREE.GLTFLoader: Couldn't load texture",l),u});return this.sourceCache[e]=h,h}assignTexture(e,t,n,i){let r=this;return this.getDependency("texture",n.index).then(function(o){if(!o)return null;if(n.texCoord!==void 0&&n.texCoord>0&&(o=o.clone(),o.channel=n.texCoord),r.extensions[$e.KHR_TEXTURE_TRANSFORM]){let a=n.extensions!==void 0?n.extensions[$e.KHR_TEXTURE_TRANSFORM]:void 0;if(a){let l=r.associations.get(o);o=r.extensions[$e.KHR_TEXTURE_TRANSFORM].extendTexture(o,a),r.associations.set(o,l)}}return i!==void 0&&(o.colorSpace=i),e[t]=o,o})}assignFinalMaterial(e){let t=e.geometry,n=e.material,i=t.attributes.tangent===void 0,r=t.attributes.color!==void 0,o=t.attributes.normal===void 0;if(e.isPoints){let a="PointsMaterial:"+n.uuid,l=this.cache.get(a);l||(l=new lr,sn.prototype.copy.call(l,n),l.color.copy(n.color),l.map=n.map,l.sizeAttenuation=!1,this.cache.add(a,l)),n=l}else if(e.isLine){let a="LineBasicMaterial:"+n.uuid,l=this.cache.get(a);l||(l=new ar,sn.prototype.copy.call(l,n),l.color.copy(n.color),l.map=n.map,this.cache.add(a,l)),n=l}if(i||r||o){let a="ClonedMaterial:"+n.uuid+":";i&&(a+="derivative-tangents:"),r&&(a+="vertex-colors:"),o&&(a+="flat-shading:");let l=this.cache.get(a);l||(l=n.clone(),r&&(l.vertexColors=!0),o&&(l.flatShading=!0),i&&(l.normalScale&&(l.normalScale.y*=-1),l.clearcoatNormalScale&&(l.clearcoatNormalScale.y*=-1)),this.cache.add(a,l),this.associations.set(l,this.associations.get(n))),n=l}e.material=n}getMaterialType(){return gs}loadMaterial(e){let t=this,n=this.json,i=this.extensions,r=n.materials[e],o,a={},l=r.extensions||{},c=[];if(l[$e.KHR_MATERIALS_UNLIT]){let u=i[$e.KHR_MATERIALS_UNLIT];o=u.getMaterialType(),c.push(u.extendParams(a,r,t))}else{let u=r.pbrMetallicRoughness||{};if(a.color=new de(1,1,1),a.opacity=1,Array.isArray(u.baseColorFactor)){let d=u.baseColorFactor;a.color.setRGB(d[0],d[1],d[2],un),a.opacity=d[3]}u.baseColorTexture!==void 0&&c.push(t.assignTexture(a,"map",u.baseColorTexture,Mt)),a.metalness=u.metallicFactor!==void 0?u.metallicFactor:1,a.roughness=u.roughnessFactor!==void 0?u.roughnessFactor:1,u.metallicRoughnessTexture!==void 0&&(c.push(t.assignTexture(a,"metalnessMap",u.metallicRoughnessTexture)),c.push(t.assignTexture(a,"roughnessMap",u.metallicRoughnessTexture))),o=this._invokeOne(function(d){return d.getMaterialType&&d.getMaterialType(e)}),c.push(Promise.all(this._invokeAll(function(d){return d.extendMaterialParams&&d.extendMaterialParams(e,a)})))}r.doubleSided===!0&&(a.side=xn);let h=r.alphaMode||uu.OPAQUE;if(h===uu.BLEND?(a.transparent=!0,a.depthWrite=!1):(a.transparent=!1,h===uu.MASK&&(a.alphaTest=r.alphaCutoff!==void 0?r.alphaCutoff:.5)),r.normalTexture!==void 0&&o!==st&&(c.push(t.assignTexture(a,"normalMap",r.normalTexture)),a.normalScale=new Te(1,1),r.normalTexture.scale!==void 0)){let u=r.normalTexture.scale;a.normalScale.set(u,u)}if(r.occlusionTexture!==void 0&&o!==st&&(c.push(t.assignTexture(a,"aoMap",r.occlusionTexture)),r.occlusionTexture.strength!==void 0&&(a.aoMapIntensity=r.occlusionTexture.strength)),r.emissiveFactor!==void 0&&o!==st){let u=r.emissiveFactor;a.emissive=new de().setRGB(u[0],u[1],u[2],un)}return r.emissiveTexture!==void 0&&o!==st&&c.push(t.assignTexture(a,"emissiveMap",r.emissiveTexture,Mt)),Promise.all(c).then(function(){let u=new o(a);return r.name&&(u.name=r.name),ri(u,r),t.associations.set(u,{materials:e}),r.extensions&&ws(i,u,r),u})}createUniqueName(e){let t=_t.sanitizeNodeName(e||"");return t in this.nodeNamesUsed?t+"_"+ ++this.nodeNamesUsed[t]:(this.nodeNamesUsed[t]=0,t)}loadGeometries(e){let t=this,n=this.extensions,i=this.primitiveCache;function r(a){return n[$e.KHR_DRACO_MESH_COMPRESSION].decodePrimitive(a,t).then(function(l){return vp(l,a,t)})}let o=[];for(let a=0,l=e.length;a<l;a++){let c=e[a],h=yy(c),u=i[h];if(u)o.push(u.promise);else{let d;c.extensions&&c.extensions[$e.KHR_DRACO_MESH_COMPRESSION]?d=r(c):d=vp(new yt,c,t),c.mode===In.TRIANGLE_STRIP?d=d.then(f=>cu(f,Po)):c.mode===In.TRIANGLE_FAN&&(d=d.then(f=>cu(f,xr))),i[h]={primitive:c,promise:d},o.push(d)}}return Promise.all(o)}loadMesh(e){let t=this,n=this.json,i=this.extensions,r=n.meshes[e],o=r.primitives,a=[];for(let l=0,c=o.length;l<c;l++){let h=o[l].material===void 0?_y(this.cache):this.getDependency("material",o[l].material);a.push(h)}return a.push(t.loadGeometries(o)),Promise.all(a).then(async function(l){let c=l.slice(0,l.length-1),h=l[l.length-1],u=[];for(let f=0,g=h.length;f<g;f++){let _=h[f],m=o[f],p,b=c[f];if(m.mode===In.TRIANGLES||m.mode===In.TRIANGLE_STRIP||m.mode===In.TRIANGLE_FAN||m.mode===void 0){let T=r.isSkinnedMesh===!0,x=_.hasAttribute("skinIndex")&&_.hasAttribute("skinWeight");T&&x===!1&&console.warn("THREE.GLTFLoader: Missing skinIndex or skinWeight attributes. Skinning disabled."),p=T&&x?new no(_,b):new Be(_,b),p.isSkinnedMesh===!0&&p.normalizeSkinWeights()}else if(m.mode===In.LINES)p=new so(_,b);else if(m.mode===In.LINE_STRIP)p=new hs(_,b);else if(m.mode===In.LINE_LOOP)p=new ro(_,b);else if(m.mode===In.POINTS)p=new us(_,b);else throw new Error("THREE.GLTFLoader: Primitive mode unsupported: "+m.mode);Object.keys(p.geometry.morphAttributes).length>0&&vy(p,r),p.name=t.createUniqueName(r.name||"mesh_"+e),ri(p,r),m.extensions&&ws(i,p,m),t.assignFinalMaterial(p),u.push(p)}for(let f=0,g=u.length;f<g;f++)t.associations.set(u[f],{meshes:e,primitives:f});if(u.length===1)return r.extensions&&ws(i,u[0],r),u[0];let d=new St;r.extensions&&ws(i,d,r),t.associations.set(d,{meshes:e});for(let f=0,g=u.length;f<g;f++)d.add(u[f]);return d})}loadCamera(e){let t,n=this.json.cameras[e],i=n[n.type];if(!i){console.warn("THREE.GLTFLoader: Missing camera parameters.");return}return n.type==="perspective"?t=new zt(qi.radToDeg(i.yfov),i.aspectRatio||1,i.znear||1,i.zfar||2e6):n.type==="orthographic"&&(t=new Rn(-i.xmag,i.xmag,i.ymag,-i.ymag,i.znear,i.zfar)),n.name&&(t.name=this.createUniqueName(n.name)),ri(t,n),Promise.resolve(t)}loadSkin(e){let t=this.json.skins[e],n=[];for(let i=0,r=t.joints.length;i<r;i++)n.push(this._loadNodeShallow(t.joints[i]));return t.inverseBindMatrices!==void 0?n.push(this.getDependency("accessor",t.inverseBindMatrices)):n.push(null),Promise.all(n).then(function(i){let r=i.pop(),o=i,a=[],l=[];for(let c=0,h=o.length;c<h;c++){let u=o[c];if(u){a.push(u);let d=new Ge;r!==null&&d.fromArray(r.array,c*16),l.push(d)}else console.warn('THREE.GLTFLoader: Joint "%s" could not be found.',t.joints[c])}return new io(a,l)})}loadAnimation(e){let t=this.json,n=this,i=t.animations[e],r=i.name?i.name:"animation_"+e,o=[],a=[],l=[],c=[],h=[];for(let u=0,d=i.channels.length;u<d;u++){let f=i.channels[u],g=i.samplers[f.sampler],_=f.target,m=_.node,p=i.parameters!==void 0?i.parameters[g.input]:g.input,b=i.parameters!==void 0?i.parameters[g.output]:g.output;_.node!==void 0&&(o.push(this.getDependency("node",m)),a.push(this.getDependency("accessor",p)),l.push(this.getDependency("accessor",b)),c.push(g),h.push(_))}return Promise.all([Promise.all(o),Promise.all(a),Promise.all(l),Promise.all(c),Promise.all(h)]).then(function(u){let d=u[0],f=u[1],g=u[2],_=u[3],m=u[4],p=[];for(let T=0,x=d.length;T<x;T++){let S=d[T],M=f[T],A=g[T],v=_[T],w=m[T];if(S===void 0)continue;S.updateMatrix&&S.updateMatrix();let R=n._createAnimationTracks(S,M,A,v,w);if(R)for(let L=0;L<R.length;L++)p.push(R[L])}let b=new bi(r,void 0,p);return ri(b,i),b})}createNodeMesh(e){let t=this.json,n=this,i=t.nodes[e];return i.mesh===void 0?null:n.getDependency("mesh",i.mesh).then(function(r){let o=n._getNodeRef(n.meshCache,i.mesh,r);return i.weights!==void 0&&o.traverse(function(a){if(a.isMesh)for(let l=0,c=i.weights.length;l<c;l++)a.morphTargetInfluences[l]=i.weights[l]}),o})}loadNode(e){let t=this.json,n=this,i=t.nodes[e],r=n._loadNodeShallow(e),o=[],a=i.children||[];for(let c=0,h=a.length;c<h;c++)o.push(n.getDependency("node",a[c]));let l=i.skin===void 0?Promise.resolve(null):n.getDependency("skin",i.skin);return Promise.all([r,Promise.all(o),l]).then(function(c){let h=c[0],u=c[1],d=c[2];d!==null&&h.traverse(function(f){f.isSkinnedMesh&&f.bind(d,My)});for(let f=0,g=u.length;f<g;f++)h.add(u[f]);if(h.userData.pivot!==void 0&&u.length>0){let f=h.userData.pivot,g=u[0];h.pivot=new D().fromArray(f),h.position.x-=f[0],h.position.y-=f[1],h.position.z-=f[2],g.position.set(0,0,0),delete h.userData.pivot}return h})}_loadNodeShallow(e){let t=this.json,n=this.extensions,i=this;if(this.nodeCache[e]!==void 0)return this.nodeCache[e];let r=t.nodes[e],o=r.name?i.createUniqueName(r.name):"",a=[],l=i._invokeOne(function(c){return c.createNodeMesh&&c.createNodeMesh(e)});return l&&a.push(l),r.camera!==void 0&&a.push(i.getDependency("camera",r.camera).then(function(c){return i._getNodeRef(i.cameraCache,r.camera,c)})),i._invokeAll(function(c){return c.createNodeAttachment&&c.createNodeAttachment(e)}).forEach(function(c){a.push(c)}),this.nodeCache[e]=Promise.all(a).then(function(c){let h;if(r.isBone===!0?h=new rr:c.length>1?h=new St:c.length===1?h=c[0]:h=new Tt,h!==c[0])for(let u=0,d=c.length;u<d;u++)h.add(c[u]);if(r.name&&(h.userData.name=r.name,h.name=o),ri(h,r),r.extensions&&ws(n,h,r),r.matrix!==void 0){let u=new Ge;u.fromArray(r.matrix),h.applyMatrix4(u)}else r.translation!==void 0&&h.position.fromArray(r.translation),r.rotation!==void 0&&h.quaternion.fromArray(r.rotation),r.scale!==void 0&&h.scale.fromArray(r.scale);if(!i.associations.has(h))i.associations.set(h,{});else if(r.mesh!==void 0&&i.meshCache.refs[r.mesh]>1){let u=i.associations.get(h);i.associations.set(h,{...u})}return i.associations.get(h).nodes=e,h}),this.nodeCache[e]}loadScene(e){let t=this.extensions,n=this.json.scenes[e],i=this,r=new St;n.name&&(r.name=i.createUniqueName(n.name)),ri(r,n),n.extensions&&ws(t,r,n);let o=n.nodes||[],a=[];for(let l=0,c=o.length;l<c;l++)a.push(i.getDependency("node",o[l]));return Promise.all(a).then(function(l){for(let h=0,u=l.length;h<u;h++){let d=l[h];d.parent!==null?r.add(Ki(d)):r.add(d)}let c=h=>{let u=new Map;for(let[d,f]of i.associations)(d instanceof sn||d instanceof Wt)&&u.set(d,f);return h.traverse(d=>{let f=i.associations.get(d);f!=null&&u.set(d,f)}),u};return i.associations=c(r),r})}_createAnimationTracks(e,t,n,i,r){let o=[],a=e.name?e.name:e.uuid,l=[];function c(f){f.morphTargetInfluences&&l.push(f.name?f.name:f.uuid)}$i[r.path]===$i.weights?(c(e),e.isGroup&&e.children.forEach(c)):l.push(a);let h;switch($i[r.path]){case $i.weights:h=xi;break;case $i.rotation:h=vi;break;case $i.translation:case $i.scale:h=Hi;break;default:switch(n.itemSize){case 1:h=xi;break;case 2:case 3:default:h=Hi;break}break}let u=i.interpolation!==void 0?gy[i.interpolation]:as,d=this._getArrayFromAccessor(n);for(let f=0,g=l.length;f<g;f++){let _=new h(l[f]+"."+$i[r.path],t.array,d,u);i.interpolation==="CUBICSPLINE"&&this._createCubicSplineTrackInterpolant(_),o.push(_)}return o}_getArrayFromAccessor(e){let t=e.array;if(e.normalized){let n=Fu(t.constructor),i=new Float32Array(t.length);for(let r=0,o=t.length;r<o;r++)i[r]=t[r]*n;t=i}return t}_createCubicSplineTrackInterpolant(e){e.createInterpolant=function(n){let i=this instanceof vi?Nu:sc;return new i(this.times,this.values,this.getValueSize()/3,n)},e.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline=!0}};function Sy(s,e,t){let n=e.attributes,i=new dn;if(n.POSITION!==void 0){let a=t.json.accessors[n.POSITION],l=a.min,c=a.max;if(l!==void 0&&c!==void 0){if(i.set(new D(l[0],l[1],l[2]),new D(c[0],c[1],c[2])),a.normalized){let h=Fu(Cr[a.componentType]);i.min.multiplyScalar(h),i.max.multiplyScalar(h)}}else{console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.");return}}else return;let r=e.targets;if(r!==void 0){let a=new D,l=new D;for(let c=0,h=r.length;c<h;c++){let u=r[c];if(u.POSITION!==void 0){let d=t.json.accessors[u.POSITION],f=d.min,g=d.max;if(f!==void 0&&g!==void 0){if(l.setX(Math.max(Math.abs(f[0]),Math.abs(g[0]))),l.setY(Math.max(Math.abs(f[1]),Math.abs(g[1]))),l.setZ(Math.max(Math.abs(f[2]),Math.abs(g[2]))),d.normalized){let _=Fu(Cr[d.componentType]);l.multiplyScalar(_)}a.max(l)}else console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.")}}i.expandByVector(a)}s.boundingBox=i;let o=new mn;i.getCenter(o.center),o.radius=i.min.distanceTo(i.max)/2,s.boundingSphere=o}function vp(s,e,t){let n=e.attributes,i=[];function r(o,a){return t.getDependency("accessor",o).then(function(l){s.setAttribute(a,l)})}for(let o in n){let a=Uu[o]||o.toLowerCase();a in s.attributes||i.push(r(n[o],a))}if(e.indices!==void 0&&!s.index){let o=t.getDependency("accessor",e.indices).then(function(a){s.setIndex(a)});i.push(o)}return Ke.workingColorSpace!==un&&"COLOR_0"in n&&console.warn(`THREE.GLTFLoader: Converting vertex colors from "srgb-linear" to "${Ke.workingColorSpace}" not supported.`),ri(s,e),Sy(s,e,t),Promise.all(i).then(function(){return e.targets!==void 0?xy(s,e.targets,t):s})}var Tp={idle_groove:"Idle",hit_up:"Yes",hit_down:"Punch",hit_left:"Punch",hit_right:"ThumbsUp",mash_charge:"Running",release:"Jump",hold_freeze:"Dance",miss_cringe:"No",defeat:"Death",victory:"Dance",enemy_idle:"Idle",enemy_taunt:"Wave",enemy_hit:"No",enemy_big_hit:"No",enemy_cringe:"No",enemy_victory:"Dance"},ku=new Set(["idle_groove","enemy_idle","mash_charge","victory","enemy_victory","hold_freeze"]),Ty=new nc,Fo=s=>s.replace(/^mixamorig\d*:?/,"");function Ep(s){let e;return s.traverse(t=>{e===void 0&&Fo(t.name)==="Hips"&&(e=t.position.y)}),e}function Ey(s){let e=s.times.length;if(e<2||s.values.length!==e*3)return;let t=s.times[0],n=s.times[e-1]-t;if(!(n>0))return;let i=s.values[(e-1)*3]-s.values[0],r=s.values[(e-1)*3+2]-s.values[2];for(let o=0;o<e;o++){let a=(s.times[o]-t)/n;s.values[o*3]-=i*a,s.values[o*3+2]-=r*a}}var bp=new WeakMap;function wy(s,e,t){let n=`${e.get("Hips")??""}|${t}`,i=bp.get(s);i||bp.set(s,i=new Map);let r=i.get(n);if(r)return r;let o=[];for(let l of s.tracks){let c=l.name.lastIndexOf("."),h=e.get(Fo(l.name.slice(0,c)));if(!h)continue;let u=l.clone();if(u.name=h+l.name.slice(c),Fo(h)==="Hips"&&l.name.endsWith(".position")){if(t!==1)for(let d=0;d<u.values.length;d++)u.values[d]*=t;Ey(u)}o.push(u)}let a=new bi(s.name,s.duration,o);return i.set(n,a),a}function rc(s,e,t="load"){return new Promise((n,i)=>{let r=setTimeout(()=>i(new Error(`${t} timed out after ${e} ms`)),e);s.then(o=>(clearTimeout(r),n(o)),o=>(clearTimeout(r),i(o)))})}var Ou=new Map;function oc(s){let e=Ou.get(s);return e||(e=Ty.loadAsync(s),e.catch(()=>Ou.delete(s)),Ou.set(s,e)),e}var Ay=new Set(Object.keys(Tp)),Ry=new Set(["idle_groove","enemy_idle"]),Cy=2e4,Py=6e3,Iy=3e4;function Ly(s){let e=[];for(let t of s){if(!Ay.has(t.event)||e.some(i=>i.event===t.event))continue;let n=s.filter(i=>i.event===t.event);e.push(n.find(i=>i.canon&&i.canon!=="generic")??t)}return e}async function Dy(s){let e=await rc(fetch(`${s}models/manifest.json`,{cache:"no-cache"}),8e3,"manifest");if(!e.ok)throw new Error(`manifest ${e.status}`);let t=await e.json();if(!t.characters?.length)throw new Error("manifest has no character");let n=f=>{let g=t.characters.filter(_=>_.role&&f.test(_.role));return g.find(_=>_.preferred)??g[0]},i=n(/player|hero/i)??t.characters[0],r=n(/enemy|opponent|boss/i)??t.characters.find(f=>f!==i)??i,o=new Map,a=Ly(t.clips),l=a.map(f=>{let g=rc(oc(`${s}models/${f.file}`),Iy,f.file).then(_=>{let m=f.name&&_.animations.find(p=>p.name===f.name)||_.animations[0];m&&o.set(f.event,{clip:m,loop:f.loop??ku.has(f.event),hipsY:Ep(_.scene)})}).catch(()=>{});return{event:f.event,p:g}}),[c,h]=await rc(Promise.all([oc(`${s}models/${i.file}`),r===i?null:oc(`${s}models/${r.file}`)]),Cy,"characters");await Promise.race([Promise.all(l.filter(f=>Ry.has(f.event)).map(f=>f.p)),new Promise(f=>setTimeout(f,Py))]);for(let f of c.animations)!o.has(f.name)&&!a.some(g=>g.event===f.name)&&o.set(f.name,{clip:f,loop:ku.has(f.name)});let u=c.scene,d=h?h.scene:Ki(c.scene);return{player:u,enemy:d,clips:o,label:`manifest ${i.name} vs ${r.name}`}}async function Ny(s){let e=await rc(oc(`${s}models/fallback/RobotExpressive.glb`),12e3,"robot"),t=new Map;for(let[n,i]of Object.entries(Tp)){let r=e.animations.find(o=>o.name===i);r&&t.set(n,{clip:r,loop:ku.has(n)})}return{player:e.scene,enemy:Ki(e.scene),clips:t,label:"RobotExpressive fallback"}}async function wp(s){try{return await Dy(s)}catch{try{return await Ny(s)}catch{let e=()=>{let t=new Be(new ds(.35,1,2,8),new fn({color:14540253}));t.position.y=.85;let n=new St;return n.add(t),n};return{player:e(),enemy:e(),clips:new Map,label:"capsules"}}}}function Uy(){let s=document.createElement("canvas");s.width=s.height=64;let e=s.getContext("2d"),t=e.createRadialGradient(32,32,2,32,32,32);return t.addColorStop(0,"rgba(0,0,0,0.75)"),t.addColorStop(1,"rgba(0,0,0,0)"),e.fillStyle=t,e.fillRect(0,0,64,64),new gi(s)}var Mp=null,Sp=null;function Fy(){let s=new ki(new Uint8Array([90,170,255]),3,1,_r);return s.minFilter=s.magFilter=Lt,s.generateMipmaps=!1,s.needsUpdate=!0,s}function By(s,e){Sp??(Sp=Fy());let t=Sp;s.traverse(n=>{let i=n;if(!i.isMesh)return;i.frustumCulled=!1,i.castShadow=!0;let r=o=>{let a=o,l=new ho({gradientMap:t,color:a.color?a.color.clone():new de(16777215),map:a.map??null,emissive:a.emissive?a.emissive.clone():new de(0),emissiveMap:a.emissiveMap??null,transparent:a.transparent,opacity:a.opacity,side:a.side});return e&&l.color.lerp(e,.55),l};i.material=Array.isArray(i.material)?i.material.map(r):r(i.material)})}var oi=new D,Oy=new D,ky=.12,zy=.3,Hy=8;function Vy(s,e,t){return s?e<Hy?!0:t>=e-.001:!1}var Bo=class{constructor(e,t,n,i){this.clips=t;this.role=n;B(this,"root",new St);B(this,"body",new St);B(this,"mixer");B(this,"actions",new Map);B(this,"current",null);B(this,"names");B(this,"modelHips");B(this,"head",null);B(this,"hands",[]);B(this,"feet",[]);B(this,"squash",0);B(this,"knock",0);B(this,"frozen",!1);B(this,"height",1.8);By(e,i),e.updateMatrixWorld(!0),e.traverse(u=>u.isSkinnedMesh&&u.skeleton.update());let r=new dn().setFromObject(e),o=r.max.y-r.min.y,a=Number.isFinite(o)&&o>.05,l=a?this.height/o:1;a||(r.min.y=0),e.scale.multiplyScalar(l),e.position.y-=r.min.y*l,this.body.add(e),this.root.add(this.body),Mp??(Mp=Uy());let c=new Be(new Qt(1.4,1.4),new st({map:Mp,transparent:!0,depthWrite:!1}));c.rotation.x=-Math.PI/2,c.position.y=.015,this.root.add(c),e.traverse(u=>{if(!u.isBone)return;let d=u.name;/_end$|top/i.test(d)||(!this.head&&/head/i.test(d)&&(this.head=u),/hand$|hand\.|palm2/i.test(d)&&this.hands.length<2&&!/index|thumb|middle|ring|pinky/i.test(d)&&this.hands.push(u),/foot/i.test(d)&&this.feet.length<2&&this.feet.push(u))}),this.mixer=new vo(e);let h=new Map;e.traverse(u=>{u.name&&!h.has(Fo(u.name))&&h.set(Fo(u.name),u.name)}),this.names=h,this.modelHips=Ep(e),this.mixer.addEventListener("finished",u=>{u.action===this.current&&this.play(this.idleName)}),this.play(this.idleName)}action(e){let t=this.actions.get(e);if(t)return t;let n=this.clips.get(e);if(!n)return;let i=this.modelHips&&n.hipsY?this.modelHips/n.hipsY:1;return t=this.mixer.clipAction(wy(n.clip,this.names,i)),n.loop||(t.setLoop(Co,1),t.clampWhenFinished=!0),this.actions.set(e,t),t}get idleName(){return this.role==="enemy"&&this.clips.has("enemy_idle")?"enemy_idle":"idle_groove"}play(e,t=1){this.frozen=!1;let n=this.action(e),i=this.action(this.idleName),r=n??i??null;if(n||(this.squash=1),!r)return;let o=this.current,a=Vy(r.loop===Co,r.getClip().duration,r.time);r.enabled=!0,r.paused=!1,r.setEffectiveTimeScale(t),r.setEffectiveWeight(1),a&&r.reset(),o&&o!==r&&r.crossFadeFrom(o,r===i?zy:ky,!1),r.play(),this.current=r}freeze(e){this.frozen=e,this.current&&(this.current.paused=e)}knockback(e){this.knock=Math.max(this.knock,e),this.squash=Math.max(this.squash,.6)}bump(){this.squash=Math.max(this.squash,.5)}update(e,t,n){!this.current&&this.clips.has(this.idleName)&&this.play(this.idleName),this.mixer.update(e),this.squash=Math.max(0,this.squash-e*4),this.knock=Math.max(0,this.knock-e*3);let i=this.frozen?0:Math.pow(1-t,3)*(.03+.04*n),r=this.squash*Math.sin(this.squash*9)*.12;this.body.scale.set(1+r*.5+i*.5,1-r-i,1+r*.5+i*.5),this.body.position.z=-this.knock*.6,this.body.rotation.x=-this.knock*.25}world(e,t,n){e?e.getWorldPosition(oi):this.root.localToWorld(oi.set(0,t,0)),n.x=oi.x,n.y=oi.y,n.z=oi.z}headPos(e){this.world(this.head??void 0,this.height*.92,e)}chestPos(e){this.world(void 0,this.height*.62,e)}handsPos(e){if(this.hands.length===2){let t=this.hands[0].getWorldPosition(Oy),n=this.hands[1].getWorldPosition(oi);e.x=(t.x+n.x)/2,e.y=(t.y+n.y)/2,e.z=(t.z+n.z)/2}else this.world(this.hands[0],this.height*.55,e)}feetPos(e){this.root.getWorldPosition(oi),e.x=oi.x,e.y=oi.y,e.z=oi.z}headBone(){return this.head??this.body}get kind(){return this.role}dispose(){this.mixer.stopAllAction(),this.mixer.uncacheRoot(this.mixer.getRoot()),this.root.removeFromParent(),this.root.traverse(e=>{let t=e;if(t.isMesh){for(let n of Array.isArray(t.material)?t.material:[t.material])n.dispose();t.geometry.type==="PlaneGeometry"&&t.geometry.dispose()}})}};var Oo=new D;function Ln(s,e,t,n,i,r){let o=2*Math.PI*i/4,a=Math.max(r-2*i,0),l=Math.PI/4;Oo.copy(e),Oo[n]=0,Oo.normalize();let c=.5*o/(o+a),h=1-Oo.angleTo(s)/l;return Math.sign(Oo[t])===1?h*c:a/(o+a)+c+c*(1-h)}var ac=class s extends rn{constructor(e=1,t=1,n=1,i=2,r=.1){let o=i*2+1;if(r=Math.min(e/2,t/2,n/2,r),super(1,1,1,o,o,o),this.type="RoundedBoxGeometry",this.parameters={width:e,height:t,depth:n,segments:i,radius:r},o===1)return;let a=this.toNonIndexed();this.index=null,this.attributes.position=a.attributes.position,this.attributes.normal=a.attributes.normal,this.attributes.uv=a.attributes.uv;let l=new D,c=new D,h=new D(e,t,n).divideScalar(2).subScalar(r),u=this.attributes.position.array,d=this.attributes.normal.array,f=this.attributes.uv.array,g=u.length/6,_=new D,m=.5/o;for(let p=0,b=0;p<u.length;p+=3,b+=2)switch(l.fromArray(u,p),c.copy(l),c.x-=Math.sign(c.x)*m,c.y-=Math.sign(c.y)*m,c.z-=Math.sign(c.z)*m,c.normalize(),u[p+0]=h.x*Math.sign(l.x)+c.x*r,u[p+1]=h.y*Math.sign(l.y)+c.y*r,u[p+2]=h.z*Math.sign(l.z)+c.z*r,d[p+0]=c.x,d[p+1]=c.y,d[p+2]=c.z,Math.floor(p/g)){case 0:_.set(1,0,0),f[b+0]=Ln(_,c,"z","y",r,n),f[b+1]=1-Ln(_,c,"y","z",r,t);break;case 1:_.set(-1,0,0),f[b+0]=1-Ln(_,c,"z","y",r,n),f[b+1]=1-Ln(_,c,"y","z",r,t);break;case 2:_.set(0,1,0),f[b+0]=1-Ln(_,c,"x","z",r,e),f[b+1]=Ln(_,c,"z","x",r,n);break;case 3:_.set(0,-1,0),f[b+0]=1-Ln(_,c,"x","z",r,e),f[b+1]=1-Ln(_,c,"z","x",r,n);break;case 4:_.set(0,0,1),f[b+0]=1-Ln(_,c,"x","y",r,e),f[b+1]=1-Ln(_,c,"y","x",r,t);break;case 5:_.set(0,0,-1),f[b+0]=Ln(_,c,"x","y",r,e),f[b+1]=1-Ln(_,c,"y","x",r,t);break}}static fromJSON(e){return new s(e.width,e.height,e.depth,e.segments,e.radius)}};var lc=class{constructor(e){B(this,"capacity");B(this,"active");B(this,"pos");B(this,"vel");B(this,"color");B(this,"life");B(this,"maxLife");B(this,"size");B(this,"seed");B(this,"cursor",0);this.capacity=e,this.active=e,this.pos=new Float32Array(e*3),this.vel=new Float32Array(e*3),this.color=new Float32Array(e*3),this.life=new Float32Array(e),this.maxLife=new Float32Array(e),this.size=new Float32Array(e),this.seed=new Float32Array(e)}setQuality(e){this.active=Math.max(1,Math.min(this.capacity,Math.floor(this.capacity*e)));for(let t=this.active;t<this.capacity;t++)this.life[t]=0;this.cursor>=this.active&&(this.cursor=0)}alloc(){let e=this.active;for(let n=0;n<e;n++){let i=(this.cursor+n)%e;if(this.life[i]<=0)return this.cursor=(i+1)%e,i}let t=0;for(let n=1;n<e;n++)this.life[n]<this.life[t]&&(t=n);return this.cursor=(t+1)%e,t}spawn(e,t,n,i,r,o,a,l,c,h,u){let d=this.alloc(),f=d*3;return this.pos[f]=e,this.pos[f+1]=t,this.pos[f+2]=n,this.vel[f]=i,this.vel[f+1]=r,this.vel[f+2]=o,this.color[f]=c,this.color[f+1]=h,this.color[f+2]=u,this.life[d]=a,this.maxLife[d]=a,this.size[d]=l,this.seed[d]=Math.random()*100,d}alive(){let e=0;for(let t=0;t<this.capacity;t++)this.life[t]>0&&e++;return e}clear(){this.life.fill(0)}},Gy=[[.25,.4,1,.35],[.2,.6,1,.85],[.65,.3,1,.95],[1,.95,.85,1]];function ko(s){return Gy[Math.max(0,Math.min(3,Math.floor(s)))]}function Ap(s,e,t){return(60+260*((Math.max(-1,Math.min(1,s))+1)/2))*(.6+.6*e)*(1+.25*t)}function Rp(s,e){let t=(1-Math.max(-1,Math.min(1,s)))/2;return 180*t*t*(.6+.6*e)}var Wy=`
attribute vec3 aColor;
attribute float aSize;
attribute float aAlpha;
uniform float uPx;
varying vec3 vColor;
varying float vAlpha;
void main() {
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  gl_PointSize = aSize * uPx / max(-mv.z, 0.1);
  vColor = aColor;
  vAlpha = aAlpha;
  gl_Position = projectionMatrix * mv;
}
`,Xy=`
uniform float uStar;
varying vec3 vColor;
varying float vAlpha;
void main() {
  if (vAlpha <= 0.0) discard;
  vec2 p = gl_PointCoord - 0.5;
  float d = length(p) * 2.0;
  float a;
  if (uStar > 0.5) {
    vec2 q = abs(p) * 2.0;
    a = max(0.0, 1.0 - q.x * q.y * 14.0 - d * 0.75);
  } else {
    a = pow(max(0.0, 1.0 - d), 1.6);
  }
  vec3 col = vColor + vec3(pow(max(0.0, 1.0 - d), 6.0)) * 0.8;
  gl_FragColor = vec4(col, a * vAlpha);
}
`,As=class{constructor(e){B(this,"pool");B(this,"points");B(this,"sizeOut");B(this,"alphaOut");B(this,"geo");B(this,"mat");B(this,"opts");B(this,"time",0);B(this,"gain",1);this.opts={star:!1,gravity:0,drag:1,drift:0,endSize:1,...e};let t=e.capacity;this.pool=new lc(t),this.sizeOut=new Float32Array(t),this.alphaOut=new Float32Array(t),this.geo=new yt,this.geo.setAttribute("position",new Rt(this.pool.pos,3).setUsage(yr)),this.geo.setAttribute("aColor",new Rt(this.pool.color,3).setUsage(yr)),this.geo.setAttribute("aSize",new Rt(this.sizeOut,1).setUsage(yr)),this.geo.setAttribute("aAlpha",new Rt(this.alphaOut,1).setUsage(yr)),this.mat=new ft({uniforms:{uPx:{value:400},uStar:{value:this.opts.star?1:0}},vertexShader:Wy,fragmentShader:Xy,transparent:!0,depthWrite:!1,blending:ni}),this.points=new us(this.geo,this.mat),this.points.frustumCulled=!1,this.points.renderOrder=10}setPx(e){this.mat.uniforms.uPx.value=e}setQuality(e){this.pool.setQuality(e)}update(e){let t=this.pool,n=this.opts;this.time+=e;let i=e>0?Math.pow(n.drag,e):1;for(let o=0;o<t.capacity;o++){let a=t.life[o];if(a<=0){this.alphaOut[o]=0,this.sizeOut[o]=0;continue}let l=o*3;if(e>0){let u=t.seed[o];n.drift&&(t.vel[l]+=Math.sin(this.time*2.7+u)*n.drift*e,t.vel[l+2]+=Math.cos(this.time*2.1+u*1.3)*n.drift*e),t.vel[l+1]+=n.gravity*e,t.vel[l]*=i,t.vel[l+1]*=i,t.vel[l+2]*=i,t.pos[l]+=t.vel[l]*e,t.pos[l+1]+=t.vel[l+1]*e,t.pos[l+2]+=t.vel[l+2]*e,t.life[o]=a-e}let c=1-Math.max(0,t.life[o])/t.maxLife[o],h=c<.15?c/.15:1-(c-.15)/.85;this.alphaOut[o]=t.life[o]>0?Math.max(0,h)*this.gain:0,this.sizeOut[o]=t.size[o]*(1+(n.endSize-1)*c)}let r=this.geo.attributes;r.position.needsUpdate=!0,r.aColor.needsUpdate=!0,r.aSize.needsUpdate=!0,r.aAlpha.needsUpdate=!0}clear(){this.pool.clear()}};function qy(){return{flash:0,flashBlack:!1,chroma:0,glitch:0,radial:0,vignette:.25,desat:0,scanline:.08}}var Yy=1/60,Ky=.25;function zo(s,e,t){return s<0?0:s<=e?1:t<=0?0:Math.max(0,1-(s-e)/t)}function zu(s){let t=1-Math.min(1,Math.max(0,s))*2;return t>0?t*t*t:0}function Ji(){return{t:1e9,hold:0,fade:0,amp:0}}var cc=class{constructor(e=qy()){B(this,"fx");B(this,"chromaP",Ji());B(this,"glitchP",Ji());B(this,"radialP",Ji());B(this,"flashP",Ji());B(this,"flashBlack",!1);B(this,"desatTarget",0);B(this,"desat",0);this.fx=e}fire(e,t,n,i){e.amp*zo(e.t,e.hold,e.fade)>i||(e.t=0,e.hold=t*Yy,e.fade=n,e.amp=i)}chroma(e=1){this.fire(this.chromaP,2,.08,e)}glitch(e=1){this.fire(this.glitchP,3,.06,e)}radial(e=1){this.fire(this.radialP,3,.12,e)}flash(e=1,t=!1,n=1){this.flashBlack=t,this.flashP.amp=0,this.fire(this.flashP,n,.06,e)}setDesat(e){this.desatTarget=e}reset(){this.chromaP=Ji(),this.glitchP=Ji(),this.radialP=Ji(),this.flashP=Ji(),this.desatTarget=0,this.desat=0}tick(e,t,n){let i=Math.max(0,Math.min(.1,e));this.chromaP.t+=i,this.glitchP.t+=i,this.radialP.t+=i,this.flashP.t+=i;let r=this.fx;r.chroma=this.chromaP.amp*zo(this.chromaP.t,this.chromaP.hold,this.chromaP.fade),r.glitch=this.glitchP.amp*zo(this.glitchP.t,this.glitchP.hold,this.glitchP.fade),r.radial=this.radialP.amp*zo(this.radialP.t,this.radialP.hold,this.radialP.fade),r.flash=this.flashP.amp*zo(this.flashP.t,this.flashP.hold,this.flashP.fade),r.flashBlack=this.flashBlack;let o=i/.8;this.desat+=Math.max(-o,Math.min(o,this.desatTarget-this.desat)),r.desat=this.desat,r.vignette=Math.min(1,Ky+.22*zu(t)*(.4+.6*n)+.35*this.desat)}};var Zy=.45,$y=.25,Jy=.3,Hu=[1,.2,.7],Ct=(s,e)=>s+Math.random()*(e-s),Cp=s=>s<0?0:s>1?1:s,uc=class{constructor(e,t){B(this,"screen");B(this,"driver");B(this,"camera");B(this,"flame",new As({capacity:520,gravity:.6,drag:.5,drift:2.2,endSize:.35}));B(this,"enemyFlame",new As({capacity:180,gravity:.4,drag:.5,drift:2,endSize:.35}));B(this,"sparks",new As({capacity:360,gravity:-7,drag:.15,endSize:.25}));B(this,"stars",new As({capacity:64,star:!0,gravity:-1.2,drag:.35,endSize:.5}));B(this,"rings",[]);B(this,"orb");B(this,"orbMat");B(this,"orbHaloMat");B(this,"burst");B(this,"burstMat");B(this,"leak");B(this,"leakMat");B(this,"glasses");B(this,"glassesDrop");B(this,"flameAcc",0);B(this,"enemyAcc",0);B(this,"scale",1);B(this,"tier",0);B(this,"lastReal",-1);B(this,"pixelHeight",360);B(this,"orbSize",0);B(this,"orbBump",0);B(this,"orbTime",0);B(this,"burstT",-1);B(this,"burstSize",.3);B(this,"burstPower",0);B(this,"burstFrom",new D);B(this,"burstTo",new D);B(this,"dropT",1);B(this,"tmp",new D);B(this,"tmpQ",new Ht);this.camera=t,this.driver=new cc,this.screen=this.driver.fx;for(let a of[this.flame,this.enemyFlame,this.sparks,this.stars])e.add(a.points);let n=new ms(.82,1,48);n.rotateX(-Math.PI/2);for(let a=0;a<3;a++){let l=hc(10475775);l.side=xn;let c=new Be(n,l);c.visible=!1,c.renderOrder=9,e.add(c),this.rings.push({mesh:c,mat:l,t:1e9,scale:1})}let i=new ps(1,2);this.orbMat=hc(6732031),this.orbHaloMat=hc(3828991,.35),this.orb=new St,this.orb.add(new Be(i,this.orbMat));let r=new Be(i,this.orbHaloMat);r.scale.setScalar(1.7),this.orb.add(r),this.orb.visible=!1,e.add(this.orb),this.burstMat=hc(16773328),this.burst=new St,this.burst.add(new Be(i,this.burstMat));let o=new Be(i,this.orbHaloMat);o.scale.setScalar(1.9),this.burst.add(o),this.burst.visible=!1,e.add(this.burst),this.leakMat=new ft({uniforms:{uColor:{value:new de(1,.75,.5)},uOpacity:{value:0}},vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",fragmentShader:"uniform vec3 uColor; uniform float uOpacity; varying vec2 vUv; void main(){ float d = length(vUv - 0.5) * 2.0; float a = pow(max(0.0, 1.0 - d), 2.2); gl_FragColor = vec4(uColor, a * uOpacity); }",transparent:!0,depthWrite:!1,depthTest:!1,blending:ni}),this.leak=new Be(new Qt(1,1),this.leakMat),this.leak.frustumCulled=!1,this.leak.renderOrder=20,this.leak.visible=!1,e.add(this.leak),this.glassesDrop=Qy(),this.glasses=new St,this.glasses.name="sunglasses",this.glasses.add(this.glassesDrop),this.glasses.visible=!1}sunglasses(){return this.glasses}setQuality(e){for(let t of[this.flame,this.enemyFlame,this.sparks,this.stars])t.setQuality(e)}setPixelHeight(e){this.pixelHeight=e}event(e,t){let n=this.driver;switch(e.kind){case"countIn":e.n>=3&&this.resetBattle();break;case"judged":e.cringe&&n.glitch(1),e.grade==="perfect"?(this.sparkBurst(t.enemyChest,22,4.5),this.starBurst(t.enemyChest,3,2.5),this.starBurst(t.playerHead,4,1.8)):e.grade==="great"&&this.sparkBurst(t.enemyChest,10,3.5),(e.big||e.strong)&&(n.chroma(1),e.grade==="perfect"&&n.flash(.45));break;case"mashStart":this.orbSize=0;break;case"mashStep":this.orbBump=1;break;case"release":{this.orb.visible=!1,this.ring(t.playerFeet,1,.9+Math.min(1,e.burst/40)),n.chroma(1),n.radial(1),n.flash(.7,!1,2),this.launchBurst(t,e.burst);break}case"holdEnd":e.grade==="perfect"&&this.starBurst(t.playerHead,6,2.2);break;case"drop":n.flash(.6),n.chroma(.8),n.radial(.6),this.ring(t.playerFeet,.8,1.2);break;case"phase2":n.glitch(1),n.chroma(1);break;case"end":this.orb.visible=!1,e.win?(n.flash(1,!1,2),n.radial(1)):(n.flash(.8,!0,2),n.setDesat(1));break;default:break}}update(e,t,n){let i=typeof performance<"u"?performance.now()/1e3:0,r=this.lastReal<0?0:Math.min(.1,i-this.lastReal);this.lastReal=i,this.driver.tick(r,t.beatPhase,t.energy);let o=this.scale=Math.max(.3,(n.playerHead.y-n.playerFeet.y)/1.7)||1,a=this.pixelHeight/(2*Math.tan(qi.degToRad(this.camera.fov)/2));this.flame.setPx(a),this.enemyFlame.setPx(a),this.sparks.setPx(a),this.stars.setPx(a),t.tier>this.tier&&(this.ring(n.playerFeet,.7,1),this.starBurst(n.playerHead,5,2),t.tier===3&&(this.dropT=0)),this.tier=t.tier,this.emitFlames(e,t,n,o),this.flame.update(e),this.enemyFlame.update(e),this.updateBurst(e,n,o),this.sparks.update(e),this.stars.update(e),this.updateRings(e),this.updateOrb(e,t,n,o),this.updateLeak(t),this.glasses.visible=t.tier===3,this.dropT<1&&(this.dropT=Math.min(1,this.dropT+r/Jy)),this.glassesDrop.position.y=.35*(1-jy(this.dropT))}resetBattle(){this.driver.reset(),this.flame.clear(),this.enemyFlame.clear(),this.sparks.clear(),this.stars.clear(),this.orb.visible=!1,this.burst.visible=!1,this.burstT=-1,this.tier=0}emitFlames(e,t,n,i){if(e<=0)return;let r=(t.meter+1)/2,[o,a,l,c]=ko(t.tier);this.flame.gain+=(c-this.flame.gain)*Math.min(1,e*4),this.flameAcc=Math.min(40,this.flameAcc+Ap(t.meter,t.energy,t.tier)*e);let h=i*(.7+.8*r)*(1+.25*t.tier),[u,d,f]=ko(1);for(;this.flameAcc>=1;){this.flameAcc-=1;let m=Math.random()*Math.PI*2,p=Math.random()<.6,b=(p?.35:.22)*i*Ct(.6,1.1),T=p?n.playerFeet.y+Ct(0,.15)*i:n.playerHead.y-Ct(.2,.4)*i,x=p?n.playerFeet.x:n.playerHead.x,S=p?n.playerFeet.z:n.playerHead.z,M=Math.cos(m),A=Math.sin(m),v=Ct(1,2)*i*(.7+.6*r),w=t.tier===3&&Math.random()<.25,R=Ct(.85,1.1);this.flame.pool.spawn(x+M*b,T,S+A*b,M*.25*i,v,A*.25*i,Ct(.5,1),Ct(.18,.34)*h,(w?u:o)*R,(w?d:a)*R,(w?f:l)*R)}this.enemyAcc=Math.min(30,this.enemyAcc+Rp(t.meter,t.energy)*e);let g=(1-t.meter)/2;this.enemyFlame.gain=.3+.7*g;let _=Math.max(n.enemyChest.y-n.enemyFeet.y,.5*i);for(;this.enemyAcc>=1;){this.enemyAcc-=1;let m=Math.random()*Math.PI*2,p=.3*i*Ct(.6,1.1),b=Math.cos(m),T=Math.sin(m);this.enemyFlame.pool.spawn(n.enemyFeet.x+b*p,n.enemyFeet.y+Math.random()*_,n.enemyFeet.z+T*p,b*.2*i,Ct(.8,1.6)*i,T*.2*i,Ct(.4,.8),Ct(.14,.26)*i*(.6+.8*g),Hu[0],Hu[1],Hu[2])}}sparkBurst(e,t,n){let i=this.scale;for(let r=0;r<t;r++){let o=Ct(-1,1),a=Math.random()*Math.PI*2,l=Math.sqrt(1-o*o),c=Ct(.4,1)*n*i,h=Math.random();this.sparks.pool.spawn(e.x,e.y,e.z,l*Math.cos(a)*c,o*c+1.5*i,l*Math.sin(a)*c,Ct(.3,.6),Ct(.05,.1)*i,1,.8+.2*h,.4+.5*h)}}starBurst(e,t,n){let i=this.scale;for(let r=0;r<t;r++){let o=Math.random()*Math.PI*2,a=Ct(.5,1)*n*i;this.stars.pool.spawn(e.x,e.y+.1*i,e.z,Math.cos(o)*a,Ct(1,2.5)*i,Math.sin(o)*a,Ct(.5,.8),Ct(.18,.28)*i,1,.9,.45)}}ring(e,t,n){let i=this.rings[0];for(let r of this.rings)r.t>i.t&&(i=r);i.t=0,i.scale=n,i.mat.opacity=t,i.mesh.position.set(e.x,e.y+.03*this.scale,e.z),i.mesh.visible=!0}updateRings(e){for(let t of this.rings){if(!t.mesh.visible)continue;t.t+=e;let n=t.t/Zy;if(n>=1){t.mesh.visible=!1;continue}let i=1-(1-n)*(1-n)*(1-n);t.mesh.scale.setScalar(this.scale*t.scale*(.3+3.7*i)),t.mat.opacity=(1-n)*(1-n)}}launchBurst(e,t){let n=this.scale;this.burstFrom.set(e.playerHands.x,e.playerHands.y,e.playerHands.z),this.burstTo.set(e.enemyChest.x,e.enemyChest.y,e.enemyChest.z),this.burstPower=Cp(t/50),this.burstSize=n*(.12+.3*this.burstPower),this.burstT=0,this.burst.visible=!0,this.burst.position.copy(this.burstFrom),this.burst.scale.setScalar(this.burstSize)}updateBurst(e,t,n){if(this.burstT<0)return;this.burstT+=e,this.burstTo.set(t.enemyChest.x,t.enemyChest.y,t.enemyChest.z);let i=Math.min(1,this.burstT/$y),r=i*i;if(this.burst.position.lerpVectors(this.burstFrom,this.burstTo,r),this.burst.position.y+=Math.sin(i*Math.PI)*.25*n,this.burst.scale.setScalar(this.burstSize*(1+.15*Math.sin(this.burstT*60))),e>0){let o=this.burst.position;for(let a=0;a<3;a++)this.sparks.pool.spawn(o.x+Ct(-.05,.05)*n,o.y+Ct(-.05,.05)*n,o.z+Ct(-.05,.05)*n,0,.5*n,0,Ct(.15,.3),this.burstSize*Ct(.5,.9),.7,.85,1)}i>=1&&(this.burstT=-1,this.burst.visible=!1,this.sparkBurst(t.enemyChest,30+Math.round(40*this.burstPower),5+3*this.burstPower),this.starBurst(t.enemyChest,4+Math.round(4*this.burstPower),3),this.driver.chroma(1),this.driver.flash(.35+.4*this.burstPower))}updateOrb(e,t,n,i){if(!t.mashing){this.orb.visible=!1;return}this.orb.visible=!0,this.orbTime+=e;let r=i*(.06+Math.min(t.mashCount,50)*.006);this.orbSize+=(r-this.orbSize)*Math.min(1,e*12),this.orbBump=Math.max(0,this.orbBump-e*8);let o=this.orbSize*(1+.25*this.orbBump),a=this.orbTime;this.orb.position.set(n.playerHands.x,n.playerHands.y,n.playerHands.z),this.orb.scale.set(o*(1+.1*Math.sin(a*17)),o*(1+.1*Math.cos(a*13)),o*(1+.08*Math.sin(a*11+1)));let[l,c,h]=ko(Math.max(1,t.tier));this.orbMat.color.setRGB(l,c,h)}updateLeak(e){let t=Cp((e.meter-.6)/.4);if(t<=0||e.ending){this.leak.visible=!1;return}let n=this.camera,i=Math.tan(qi.degToRad(n.fov)/2),r=i*n.aspect;this.tmp.set(r*.8,i*.75,-1).applyMatrix4(n.matrixWorld),this.leak.position.copy(this.tmp),this.tmpQ.setFromRotationMatrix(n.matrixWorld),this.leak.quaternion.copy(this.tmpQ),this.leak.scale.setScalar(i*2.2);let[o,a,l]=ko(e.tier);this.leakMat.uniforms.uColor.value.setRGB(.55+.45*o,.45+.4*a,.35+.3*l),this.leakMat.uniforms.uOpacity.value=t*(.35+.25*zu(e.beatPhase)),this.leak.visible=!0}};function hc(s,e=1){return new st({color:s,transparent:!0,opacity:e,depthWrite:!1,blending:ni})}function jy(s){let t=s-1;return 1+(1.9+1)*t*t*t+1.9*t*t}function Qy(){let s=new St,e=new ac(.062,.036,.01,2,.009),t=new st({color:328968}),n=new st({color:8382719,side:Ft});for(let o of[-.036,.036]){let a=new Be(e,t);a.position.x=o,s.add(a);let l=new Be(e,n);l.position.x=o,l.scale.set(1.12,1.18,1.3),s.add(l)}let i=new Be(new rn(.016,.006,.008),t);i.position.y=.01,s.add(i);let r=new rn(.006,.006,.1);for(let o of[-.068,.068]){let a=new Be(r,t);a.position.set(o,.008,-.05),s.add(a)}return s}var eb=`
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`,tb=`
uniform sampler2D tDiffuse;
uniform vec2 uRes;
uniform float uTime;
uniform float uFlash;
uniform float uFlashBlack;
uniform float uChroma;
uniform float uGlitch;
uniform float uRadial;
uniform float uVignette;
uniform float uDesat;
varying vec2 vUv;

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

void main() {
  vec2 uv = vUv;
  if (uGlitch > 0.001) {
    float t = floor(uTime * 30.0);
    float row = floor(uv.y * (12.0 + 20.0 * hash(vec2(t, 3.0))));
    float h = hash(vec2(row, t));
    if (h > 0.55) uv.x += (hash(vec2(t, row + 7.0)) - 0.5) * 0.18 * uGlitch;
    uv.x = fract(uv.x);
  }
  vec2 dir = uv - 0.5;
  float ca = uChroma * 0.014 + uGlitch * 0.008;
  vec3 col;
  col.r = texture2D(tDiffuse, uv + dir * ca).r;
  col.g = texture2D(tDiffuse, uv).g;
  col.b = texture2D(tDiffuse, uv - dir * ca).b;
  if (uRadial > 0.001) {
    vec3 acc = col;
    for (int i = 1; i <= 5; i++) {
      float s = 1.0 - float(i) * 0.035 * uRadial;
      acc += texture2D(tDiffuse, 0.5 + dir * s).rgb;
    }
    col = mix(col, acc / 6.0 * (1.0 + 0.25 * uRadial), min(1.0, uRadial * 1.5));
  }
  float aspect = uRes.x / max(uRes.y, 1.0);
  float d = length(dir * vec2(aspect, 1.0)) / length(vec2(aspect * 0.5, 0.5));
  col *= 1.0 - uVignette * smoothstep(0.35, 1.05, d) * 1.3;
  float lum = dot(col, vec3(0.299, 0.587, 0.114));
  col = mix(col, vec3(lum), uDesat);
  col = mix(col, vec3(1.0 - uFlashBlack), uFlash);
  gl_FragColor = vec4(max(col, 0.0), 1.0);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
`;function Pp(){let s=new ft({uniforms:{tDiffuse:{value:null},uRes:{value:new Te(640,360)},uTime:{value:0},uFlash:{value:0},uFlashBlack:{value:0},uChroma:{value:0},uGlitch:{value:0},uRadial:{value:0},uVignette:{value:.25},uDesat:{value:0}},vertexShader:eb,fragmentShader:tb,depthTest:!1,depthWrite:!1}),e=s.uniforms;return{material:s,apply(t,n,i){e.uRes.value.copy(i),e.uTime.value=n,e.uFlash.value=t.flash,e.uFlashBlack.value=t.flashBlack?1:0,e.uChroma.value=t.chroma,e.uGlitch.value=t.glitch,e.uRadial.value=t.radial,e.uVignette.value=t.vignette,e.uDesat.value=t.desat}}}var Vu=["NPC","Side character","Main character","Sigma","Aura 9000"];function Ip(s){let e=Number.isFinite(s)?Math.max(-1,Math.min(1,s)):0;return Vu[Math.min(Vu.length-1,Math.floor((e+1)/2*Vu.length))]}var dc=class{constructor(e,t){B(this,"el",document.createElement("div"));B(this,"handle",document.createElement("div"));B(this,"rank",document.createElement("div"));B(this,"last","");this.el.style.cssText="position:absolute;left:0;top:0;transform:translate(-50%,-100%);pointer-events:none;text-align:center;font:700 12px/1.15 system-ui,sans-serif;color:#fff;white-space:nowrap;text-shadow:0 1px 3px #000,0 0 6px #000;will-change:transform;display:none",this.rank.style.cssText=`font-size:11px;letter-spacing:.06em;text-transform:uppercase;color:${t}`,this.el.append(this.handle,this.rank),e.appendChild(this.el)}set(e,t){let n=e+"|"+t;n!==this.last&&(this.last=n,this.handle.textContent=e,this.rank.textContent=t)}place(e,t,n){this.el.style.display=n?"block":"none",n&&(this.el.style.transform=`translate(${e.toFixed(1)}px,${t.toFixed(1)}px) translate(-50%,-100%)`)}},Ho=new D,fc=class{constructor(e){this.canvas=e;B(this,"layer",document.createElement("div"));B(this,"player");B(this,"enemy");B(this,"playerHandle","@you");B(this,"enemyHandle","@rival");this.layer.style.cssText="position:fixed;left:0;top:0;width:0;height:0;pointer-events:none;z-index:3",(e.parentElement??document.body).appendChild(this.layer),this.player=new dc(this.layer,"#7dfcff"),this.enemy=new dc(this.layer,"#ff6bd6")}update(e,t,n,i,r){let o=this.canvas.getBoundingClientRect();this.player.set(this.playerHandle,Ip(i)),this.enemy.set(this.enemyHandle,Ip(-i)),this.put(this.player,e,t,o,r),this.put(this.enemy,e,n,o,r)}hide(){this.player.place(0,0,!1),this.enemy.place(0,0,!1)}put(e,t,n,i,r){if(!r||!n)return e.place(0,0,!1);Ho.set(n.x,n.y+.28,n.z).project(t);let o=Ho.z>-1&&Ho.z<1,a=i.left+(Ho.x+1)/2*i.width,l=i.top+(1-Ho.y)/2*i.height,c=a>i.left-40&&a<i.right+40&&l>i.top&&l<i.bottom;e.place(a,l,o&&c)}dispose(){this.layer.remove()}};var Lp=.1;function Dp(s,e){let t=document.createElement("div");return t.style.cssText=`position:fixed;left:0;right:0;${e?"top":"bottom"}:0;height:0;background:#000;pointer-events:none;z-index:2;transition:height .35s ease`,s.appendChild(t),t}function nb(s){return Math.min(2,s||1)}var Np=40;function ib(s,e,t){return s.low=e<Np?s.low+1:0,s.low<2||s.step>=2?!1:(s.low=0,s.step=s.step===0&&t>1?1:2,!0)}function sb(s){let e=s.extensions;if(!e.has("EXT_color_buffer_float")&&!e.has("EXT_color_buffer_half_float"))return!1;let t=new Dt(4,4,{type:Vt});try{s.setRenderTarget(t);let n=s.getContext();return n.checkFramebufferStatus(n.FRAMEBUFFER)===n.FRAMEBUFFER_COMPLETE}catch{return!1}finally{s.setRenderTarget(null),t.dispose()}}function rb(s){let e=document.createElement("div");return e.style.cssText="position:fixed;inset:0;background:#000;opacity:0;pointer-events:none;z-index:2",s.appendChild(e),e}function Up(s,e){let t=new Yl({canvas:s,antialias:!1,powerPreference:"high-performance"}),n=typeof matchMedia=="function"&&matchMedia("(pointer: coarse)").matches;t.setPixelRatio(nb(devicePixelRatio)),t.toneMapping=bo,t.toneMappingExposure=1.1,t.shadowMap.enabled=!0,t.shadowMap.type=Qa,t.outputColorSpace=Mt;let i=new nr,r=new zt(48,16/9,.1,120),o=new ec(i,e.base),a=new fc(s),l={x:0,y:0,z:0},c=new tc;i.add(c.group);let h=new uc(i,r),u=h.sunglasses();i.add(u);let d=sb(t),f=new Dt(640,360,{type:d?Vt:on,samples:n?2:4}),g=new jl(t,f);g.renderToScreen=!1,g.setPixelRatio(1),g.addPass(new Ql(i,r));let _=d?new Ar(new Te(640,360),.4,.3,1.05):null;_&&g.addPass(_);let m=Pp(),p=new nr,b=new Be(new Qt(2,2),m.material);b.frustumCulled=!1,p.add(b);let T=new Rn(-1,1,1,-1,0,1),x=new Te(640,360),S=new Te;h.screen.scanline=0;let M=s.parentElement??document.body,A=Dp(M,!0),v=Dp(M,!1),w=rb(M),R=0,L=(Y,be)=>{Y!==R&&(R=Y,w.style.transition=be>0?`opacity ${be.toFixed(3)}s linear`:"none",w.style.opacity=String(Y))},P=.5,N=!1,I=Y=>{Y!==N&&(N=Y,A.style.height=v.style.height=Y?"10vh":"0")},H=null;e.debug&&(H=document.createElement("div"),H.style.cssText="position:fixed;top:4px;right:6px;z-index:50;font:12px monospace;color:#0f0;background:#0008;padding:2px 5px;pointer-events:none",document.body.appendChild(H));let V=null,q=null,ee=null,k="ots",te=0,re=-1,Ee=null,Re=!1,ht={pos:[0,0,0],target:[0,0,0],fov:48},et={pos:[0,0,0],target:[0,0,0],fov:48},tt=9,Z=0,Q=0,ye=9,Oe=0,ve=!1,ze=1,pt=0,Fe=!1,Ye=0,rt=!0,We=-1,ot=0,Pt=0,Jt=!1,at=-1,It=!1,O=0,Et=0,nt=0,C=!1,y={step:0,low:0},z=!1,X=60,$=0,le=0,ae={playerFeet:{x:0,y:0,z:0},playerHead:{x:0,y:0,z:0},playerHands:{x:0,y:0,z:0},enemyFeet:{x:0,y:0,z:0},enemyChest:{x:0,y:0,z:0}},J=new D,se=new D,ue=new D;function Ce(){let Y=Math.max(1,s.clientWidth||innerWidth),be=Math.max(1,s.clientHeight||innerHeight);t.setSize(Y,be,!1);let Le=Y/be;t.getDrawingBufferSize(S);let mt=Math.max(1,Math.round(S.x)),Zt=Math.max(1,Math.round(S.y));g.setSize(mt,Zt),x.set(mt,Zt),h.setPixelHeight(Zt),r.aspect=Le,r.updateProjectionMatrix()}Ce();function pe(Y,be,Le=1){Pt=Math.max(Pt*(ot>0?1:0),Y),Jt=be,ot=Math.max(ot,Le)}function he(Y){k=Y,te=0,re=-1,Re=!1}function Pe(Y){ou(Y,k)||he(Y)}function Ue(){!q||!ee||(q.feetPos(ae.playerFeet),q.headPos(ae.playerHead),q.handsPos(ae.playerHands),ee.feetPos(ae.enemyFeet),ee.chestPos(ae.enemyChest))}function Ve(){let Y=ae.playerHead,be=!!V&&V.label.startsWith("Robot"),Le=be?.36:.1,mt=be?.3:.12;u.position.set(Y.x,Y.y+Le,Y.z-mt),u.rotation.set(0,Math.PI,0),u.scale.setScalar(be?2.4:1)}function F(Y,be,Le){let mt=r.aspect,Zt=Y?(Y.beatPos/4%1+1)%1:.5,At;if(Fe){let ln=Math.max(0,Ye-.5)*.25+.5,[pn,,jt]=rt?Pn.player:Pn.enemy,Ko=rt?-1:1;At=ht,At.pos[0]=pn+Math.sin(ln)*4.2,At.pos[1]=1.5,At.pos[2]=jt+Math.cos(ln)*4.2*Ko,At.target[0]=pn,At.target[1]=1.1,At.target[2]=jt,At.fov=42}else if(At=lu(k,te,Zt,mt,ht),re>=0&&Ee){let ln=Math.min(1,re/Lp),pn=ln*ln*(3-2*ln);for(let jt=0;jt<3;jt++)At.pos[jt]=Ee.pos[jt]+(At.pos[jt]-Ee.pos[jt])*pn,At.target[jt]=Ee.target[jt]+(At.target[jt]-Ee.target[jt])*pn;At.fov=Ee.fov+(At.fov-Ee.fov)*pn}J.set(At.pos[0],At.pos[1],At.pos[2]),se.set(At.target[0],At.target[1],At.target[2]),pt>.001&&(au(k)||k==="heroLow")&&!Fe&&(ue.set(ae.playerHands.x,ae.playerHands.y,ae.playerHands.z),J.lerp(ue,.28*pt),se.lerp(ue,.35*pt));let Yo=ye<.6?1-ye/.6:0;J.y-=.18*Yo;let Fr=Y?.phase2?.25:0,Ri=Q*Q+Fr*.12;if(Ri>0){let ln=Et*23;J.x+=(Math.sin(ln*1.3)+Math.sin(ln*2.9)*.5)*.12*Ri,J.y+=(Math.sin(ln*1.7+2)+Math.sin(ln*3.1)*.5)*.1*Ri,se.x+=Math.sin(ln*.9+1)*.08*Ri}r.position.copy(J),r.lookAt(se);let Dc=qi.degToRad(3*Yo+Oe+(Fr?Math.sin(Et*1.1)*1.2:0));r.rotateZ(Dc);let Br=At.fov+fp(tt)-4*pt;Math.abs(r.fov-Br)>.01&&(r.fov=Br,r.updateProjectionMatrix()),te+=Le,re>=0&&(re+=be)}function fe(Y){g.render(Y),m.material.uniforms.tDiffuse.value=g.readBuffer.texture;let be=h.screen;ot>0&&(be.flash=Math.max(be.flash,Pt),Pt>=be.flash&&(be.flashBlack=Jt),ot--),m.apply(be,Et,x),t.setRenderTarget(null),t.render(p,T)}function ie(Y,be){$++,le+=Y,le>=1&&(X=$/le,$=0,le=0,be&&ib(y,X,t.getPixelRatio())&&(y.step>=1&&t.getPixelRatio()>1&&(t.setPixelRatio(1),Ce()),y.step>=2&&(o.key.castShadow=!1,_&&(_.enabled=!1),h.setQuality(.5)),z||(z=!0,console.info(`[aura] under ${Np} fps for 2 s: quality step ${y.step} (1 = pixel ratio 1, 2 = no shadows nor bloom)`))),H&&(H.textContent=`${X.toFixed(0)} fps ${x.x}x${x.y} q${y.step}${_?.enabled?"":" nobloom"}${V?" "+V.label:""}`))}function ce(Y,be=1){q?.play(Y,be)}function me(Y,be=1){ee?.play(Y,be)}let oe=null;return{async load(Y){if(o.setLevel(Y),c.setTint(new de(Y.neon[1])),!V||!V.label.startsWith("manifest")){oe??(oe=wp(e.base));let be=await oe;oe=null,be!==V&&(V=be,q?.dispose(),ee?.dispose(),q=ee=null)}V&&(q?.dispose(),ee?.dispose(),q=new Bo(Ki(V.player),V.clips,"player"),ee=new Bo(Ki(V.enemy),V.clips,"enemy",new de(Y.opponent.color||"#ff3366")),q.root.position.set(...Pn.player),q.root.rotation.y=Math.PI,ee.root.position.set(...Pn.enemy),i.add(q.root,ee.root),a.enemyHandle=Y.opponent.handle??"@"+Y.opponent.name.toLowerCase().replace(/\W+/g,"_"),he("ots"),Fe=!1,Ye=0,ve=!1,ze=1,Z=0,Q=0,Oe=0,pt=0,We=-1,Ue())},event(Y){switch(h.event(Y,ae),(Y.kind==="judged"||Y.kind==="release"||Y.kind==="mashStart"||Y.kind==="holdStart"||Y.kind==="holdEnd")&&(Re=!0),Y.kind){case"countIn":L(Math.min(R,(Y.n-1)/4),P);break;case"beat":if(Y.downbeat&&!Fe){let be=We>=0&&Y.energy-We>.3;be&&pe(1,Math.random()<.4),We=Y.energy,(Re||be)&&(re<0||re>Lp)&&he(hp(k,Math.random))}break;case"judged":{if(Y.cringe||Y.grade==="miss"){ce("miss_cringe"),me("enemy_taunt"),ye=0,Q=Math.min(1,Q+.25);break}let Le=Y.dir??((It=!It)?"left":"right");ce(`hit_${Le}`),me(Y.big?"enemy_big_hit":"enemy_hit",1.2),ee?.knockback(Y.big?1:Y.grade==="perfect"?.55:.3),c.jump(Y.big?1:Y.grade==="perfect"?.6:.2),Q=Math.min(1,Q+(Y.big?.55:Y.grade==="perfect"?.22:.1)),Oe*=.3,Y.strong&&Y.grade==="perfect"&&(Z=Math.max(Z,.08)),Y.big&&!Fe&&!ou(k,"enemyClose")&&(Ee=lu(k,te,.5,r.aspect,et),k="enemyClose",te=0,re=0,Re=!1);break}case"mashStart":ce("mash_charge",1.5),Fe||Pe("hands");break;case"mashStep":Q=Math.min(.35,Q+.03),q?.bump();break;case"release":ce("release"),me("enemy_big_hit"),ee?.knockback(1.3),tt=0,Z=Math.max(Z,.08),Q=Math.min(1,Q+.7),pe(.8,!1,2),c.jump(1);break;case"holdStart":ce("hold_freeze"),at=.3;break;case"holdEnd":at=-1,q?.freeze(!1),Y.grade==="miss"?ce("miss_cringe"):(ce("hit_up"),c.jump(.7),ee?.knockback(.5));break;case"taunt":me("enemy_taunt"),Fe||Pe("dollyEnemy");break;case"dropSoon":ve=!0;break;case"drop":ve=!1,ze=1,tt=0,Q=Math.min(1,Q+.6),pe(1,!1,2),c.jump(1),Fe||he(k==="topDown"?"ots":"topDown");break;case"end":Fe=!0,Ye=0,rt=Y.win,ve=!1,Y.win?(ce("victory"),me("defeat"),c.jump(1)):(ce("defeat"),me("enemy_victory"));break;default:break}},frame(Y,be){C||(L(1,0),O=0),Y.tier===3&&O<3&&!Fe&&re<0&&Pe("heroLow"),O=Y.tier,C=!0,P=Y.spb;let Le=Math.min(.1,Math.max(0,be));Et+=Le,ie(Le,!0),Z>0?(ze=0,Z-=Le):Fe?(Ye+=Le,ze=Ye<.5?0:rt?.8:.5):ve&&Number.isFinite(Y.beatsToDrop)?ze=dp(Y.beatsToDrop):ze=1;let mt=Le*ze;at>=0&&(at-=mt,at<0&&q?.freeze(!0)),!Y.holding&&at<0&&q?.freeze(!1),q?.update(mt,Y.beatPhase,Y.energy),ee?.update(mt,Y.beatPhase,Y.energy),c.update(mt,Y.beatPos,Y.energy,Fe?.6:1),o.update(Y.beatPhase,Y.energy,Et),pt+=((Y.mashing?1:0)-pt)*Math.min(1,Le*(Y.mashing?3:8)),c.ghost=pt,Q=Math.max(0,Q-Le*1.6),ye+=Le,tt+=Le;let Zt=Y.meter<-.3?Math.min(8,(-Y.meter-.3)*14):0;Oe+=(Zt-Oe)*Math.min(1,Le*.8),I(Y.songTime<0||Fe),Fe&&Ye>2.5&&L(1,.6),Ue(),Ve(),F(Y,Le,mt),ee?.headPos(l),a.update(r,q?ae.playerHead:null,ee?l:null,Y.meter,!Fe),h.update(mt,Y,ae),fe(Le)},idle(Y){C&&(C=!1,h.event({kind:"countIn",n:4,at:0},ae),u.visible=!1,L(0,.6));let be=Math.min(.1,Math.max(0,Y));Et+=be,ie(be,!1),nt+=be*.12;let Le=Et*2;q?.update(be,Le%1,.5),ee?.update(be,Le%1,.5),c.update(be,Le,.4,.6),o.update(Le%1,.4,Et),I(!1),a.hide(),r.position.set(Math.sin(nt)*8.5,3.2,Math.cos(nt)*8.5),r.lookAt(0,.9,0);let mt=r.aspect<1?70:50;r.fov!==mt&&(r.fov=mt,r.updateProjectionMatrix()),fe(be)},resize:Ce,fps(){return X}}}var Vo=.4878048780487805,Gu=72,Pr={id:1,title:"Demo",place:"The club",artKey:"club",story:["",""],opponent:{name:"DJ Demo",persona:"",color:"#ff3b8d"},taunts:[],announcer:{intro:"",win:"",lose:""},bpm:123,windowScale:1,lengthBeats:Gu,seed:1,events:[],track:"level4",stage:"club",dropBeats:[32,56],breakdownBeats:[[24,32]],neon:["#22e1ff","#b026ff"]},ob=["left","up","right","down"];function Fp(s){let e=-4*Vo,t=-5,n=0,i=0,r=0,o=!1,a=0,l=!1,c=!1,h=-1,u=!1,d=performance.now(),f=!1,g=x=>x>=24&&x<32?.25:x>=32?.95:.6+.1*Math.sin(x),_=x=>s.event(x);function m(x){if(x<0){_({kind:"countIn",n:-x,at:0});return}_({kind:"beat",beat:x,downbeat:x%4===0,energy:g(x),bar:Math.floor(x/4)});let S=Pr.dropBeats.find(A=>A-x===2);if(S!==void 0&&_({kind:"dropSoon",beat:S}),Pr.dropBeats.includes(x)&&_({kind:"drop",beat:x}),x===10&&_({kind:"taunt",text:"Is that all?",index:0}),x===40&&(o=!0,a=0,_({kind:"mashStart",lengthBeats:6})),x===46&&(o=!1,_({kind:"release",burst:18,count:a,mult:1,grade:"perfect"}),n=Math.min(1,n+.3)),x===26&&(l=!0,_({kind:"holdStart"})),x===30&&(l=!1,_({kind:"holdEnd",grade:"great"})),x>=2&&x<24&&x%2===0||x>=32&&x<40||x>=48&&x<Gu-4&&x%2===1){let A=Math.random()<.12,v=A?"miss":Math.random()<.55?"perfect":"great";i=A?0:i+1,r+=A?0:300,n=Math.max(-1,Math.min(1,n+(A?-.15:.05))),_({kind:"judged",grade:v,cringe:A,qte:"hit",dir:ob[x%4],combo:i,score:r,strong:x%4===0,big:x%8===0&&!A})}x===Gu&&(c=!0,_({kind:"end",win:n>=0,ko:!1}),h=4)}function p(){let x=e/Vo,S=Math.floor(x),M=Pr.dropBeats.find(A=>A>x);return{songTime:e,beatPos:x,beatPhase:x-S,spb:Vo,meter:n,combo:i,tier:i>=25?3:i>=15?2:i>=5?1:0,score:r,rate:1,energy:g(Math.max(0,S)),beatsToDrop:M===void 0?1/0:M-x,mashing:o,mashCount:a,holding:l,holdProgress:l?(x-26)/4:0,phase2:!1,turn:"player",ending:c,win:c?n>=0:null,prompts:[],showsAt:()=>0,targetAt:()=>0,level:Pr}}function b(){e=-4*Vo,t=-5,n=i=r=0,o=l=c=!1,h=-1}function T(x){if(u)return;requestAnimationFrame(T);let S=Math.min(.05,(x-d)/1e3);if(d=x,!f){s.idle(S);return}e+=S;let M=Math.floor(e/Vo);for(;t<M;)m(++t);o&&Math.random()<S*10&&(a++,s.event({kind:"mashStep",count:a,side:a%2?"left":"right"})),s.frame(p(),S),h>=0&&(h-=S,h<0&&s.load(Pr).then(b))}return s.load(Pr).then(()=>{b(),f=!0}),requestAnimationFrame(T),()=>{u=!0}}var ne,Gt,Ti,Yt,Wu;function Bp(){if(ne)return ne;let s=navigator.audioSession;s&&(s.type="playback"),ne=new AudioContext({latencyHint:"interactive"});let e=ne.createDynamicsCompressor();e.threshold.value=-10,e.ratio.value=8,Gt=ne.createGain(),Gt.gain.value=.9,Gt.connect(e).connect(ne.destination),Ti=ne.createGain(),Ti.gain.value=.7,Ti.connect(Gt),Yt=ne.createGain(),Yt.connect(Gt),Wu=ne.createBuffer(1,ne.sampleRate*2,ne.sampleRate);let t=Wu.getChannelData(0);for(let n=0;n<t.length;n++)t[n]=Math.random()*2-1;return ne}function Kt(s,e,t,n,i){t=Math.max(t,2e-4),s.gain.setValueAtTime(1e-4,e),s.gain.exponentialRampToValueAtTime(t,e+n),s.gain.exponentialRampToValueAtTime(1e-4,e+n+i)}function Ei(s,e){let t=ne.createBufferSource();return t.buffer=Wu,t.loop=!0,t.start(s,Math.random()*1.5),t.stop(s+e),t}function Tn(s){let e=typeof ne.getOutputTimestamp=="function"?ne.getOutputTimestamp():null;if(e&&e.performanceTime&&e.contextTime)return e.contextTime+((s??performance.now())-e.performanceTime)/1e3;let t=typeof s=="number"?Math.max(0,performance.now()-s)/1e3:0;return ne.currentTime-t-(ne.outputLatency||0)-(ne.baseLatency||0)}function Rs(){ne&&ne.state!=="running"&&ne.resume().catch(()=>{})}function Cs(s,e,t,n,i,r){let o=ne.createOscillator();o.type=s,o.frequency.setValueAtTime(e,n),o.frequency.exponentialRampToValueAtTime(t,n+i);let a=ne.createGain();Kt(a,n,r,.004,i),o.connect(a).connect(Yt),o.start(n),o.stop(n+i+.05)}function Go(s,e,t,n,i,r=1){let o=Ei(s,e+.05),a=ne.createBiquadFilter();a.type="bandpass",a.Q.value=r,a.frequency.setValueAtTime(t,s),a.frequency.exponentialRampToValueAtTime(n,s+e);let l=ne.createGain();Kt(l,s,i,e*.4,e*.6),o.connect(a).connect(l).connect(Yt)}var wi=()=>ne.currentTime,xt={whoosh(s=wi()){Go(s,.35,400,3e3,.25,2)},snap(s=wi()){Go(s,.05,3500,5e3,.9,3),Cs("triangle",1760,880,s,.12,.35)},great(s=wi()){Cs("triangle",1320,990,s,.1,.3),Go(s,.04,3e3,4e3,.5,3)},ok(s=wi()){Cs("sine",880,700,s,.09,.25)},thud(s=wi()){Cs("sine",120,40,s,.25,.9),Go(s,.12,300,120,.5,1)},boom(s=wi(),e=1){Cs("sine",90,28,s,.9+e*.4,1),Go(s,1.2,1800,80,.9*Math.min(1.5,e),.7),Cs("sawtooth",220,55,s,.5,.25)},scratch(s=wi()){let e=ne.createOscillator();e.type="sawtooth",e.frequency.setValueAtTime(600,s),e.frequency.linearRampToValueAtTime(180,s+.12),e.frequency.linearRampToValueAtTime(700,s+.2),e.frequency.linearRampToValueAtTime(90,s+.38);let t=ne.createBiquadFilter();t.type="bandpass",t.frequency.value=900;let n=ne.createGain();Kt(n,s,.5,.005,.4),e.connect(t).connect(n).connect(Yt),e.start(s),e.stop(s+.45)},tick(s=wi(),e=!1){Cs("square",e?1600:1e3,e?1500:950,s,.03,.15)},charge(){let s=wi(),e=ne.createOscillator();e.type="sawtooth",e.frequency.value=110;let t=ne.createOscillator();t.type="square",t.frequency.value=111.5;let n=ne.createBiquadFilter();n.type="lowpass",n.frequency.value=600,n.Q.value=6;let i=ne.createGain();return i.gain.setValueAtTime(1e-4,s),i.gain.exponentialRampToValueAtTime(.18,s+.2),e.connect(n),t.connect(n),n.connect(i).connect(Yt),e.start(s),t.start(s),{set(r){let o=Math.min(1,r),a=ne.currentTime;e.frequency.setTargetAtTime(110+o*660,a,.05),t.frequency.setTargetAtTime(111.5+o*670,a,.05),n.frequency.setTargetAtTime(600+o*4e3,a,.05)},stop(){let r=ne.currentTime;i.gain.cancelScheduledValues(r),i.gain.setTargetAtTime(1e-4,r,.03),e.stop(r+.2),t.stop(r+.2)}}}};function ab(s,e,t){let n=ne.createOscillator();n.type="sawtooth",n.frequency.setValueAtTime(140*t,s),n.frequency.linearRampToValueAtTime(200*t,s+.12);let i=ne.createGain();Kt(i,s,e,.03,.2);let r=ne.createBiquadFilter();r.type="bandpass",r.frequency.value=650+Math.random()*200,r.Q.value=5;let o=ne.createBiquadFilter();o.type="bandpass",o.frequency.value=1500+Math.random()*500,o.Q.value=6,n.connect(r).connect(i),n.connect(o).connect(i),i.connect(Gt),n.start(s),n.stop(s+.3)}function Op(s=1){let e=ne.currentTime,t=Ei(e,2.2),n=ne.createBiquadFilter();n.type="bandpass",n.frequency.setValueAtTime(900,e),n.frequency.linearRampToValueAtTime(1400,e+.5);let i=ne.createGain();Kt(i,e,.25*s,.15,1.8),t.connect(n).connect(i).connect(Gt);let r=Math.round(6+s*10);for(let o=0;o<r;o++)ab(e+Math.random()*.7,.07,.9+Math.random()*.9)}function Xu(){let s=ne.currentTime;for(let e=0;e<8;e++){let t=ne.createOscillator();t.type="sawtooth";let n=90+Math.random()*70;t.frequency.setValueAtTime(n,s),t.frequency.linearRampToValueAtTime(n*.8,s+.9);let i=ne.createBiquadFilter();i.type="bandpass",i.frequency.value=400,i.Q.value=4;let r=ne.createGain();Kt(r,s+Math.random()*.2,.05,.15,.8),t.connect(i).connect(r).connect(Gt),t.start(s),t.stop(s+1.3)}}var ai=()=>ne.currentTime;function qu(s=ai(),e=.2,t=1){for(let[n,i]of[[1760,1],[2637,.5],[3520,.3]]){let r=ne.createOscillator();r.type="sine",r.frequency.value=n*t;let o=ne.createGain();Kt(o,s,e*i,.005,.35),r.connect(o).connect(Yt),r.start(s),r.stop(s+.4)}}function kp(s=ai()){for(let e=0;e<5;e++){let t=s+e*.03+Math.random()*.01,n=ne.createOscillator();n.type="triangle",n.frequency.value=3e3+Math.random()*2500;let i=ne.createGain();Kt(i,t,.08,.002,.09),n.connect(i).connect(Yt),n.start(t),n.stop(t+.12)}}function zp(s=ai(),e=0,t=1){let n=ne.createOscillator();n.type="square",n.frequency.value=Math.min(1800,500+e*45)*t;let i=ne.createGain();Kt(i,s,.14,.002,.04),n.connect(i).connect(Yt),n.start(s),n.stop(s+.06)}function Hp(s=ai(),e=1){for(let t of[0,4,7]){let n=ne.createOscillator();n.type="sawtooth",n.frequency.value=220*Math.pow(2,t/12)*e;let i=ne.createGain();Kt(i,s,.18,.004,.12),n.connect(i).connect(Yt),n.start(s),n.stop(s+.16)}}function Vp(s=ai(),e=1){let t=ne.createOscillator();t.type="sine",t.frequency.setValueAtTime(160,s),t.frequency.exponentialRampToValueAtTime(35,s+.35);let n=ne.createGain();Kt(n,s,Math.min(1,.5+e*.4),.003,.4),t.connect(n).connect(Yt),t.start(s),t.stop(s+.45)}function Gp(s=ai(),e=.3){let t=Ei(s,e+.05),n=ne.createBiquadFilter();n.type="bandpass",n.Q.value=1.2,n.frequency.setValueAtTime(200,s),n.frequency.exponentialRampToValueAtTime(2500,s+e);let i=ne.createGain();Kt(i,s,.4,e*.3,e*.7),t.connect(n).connect(i).connect(Yt)}function Wp(s=ai()){let e=ne.createOscillator();e.type="sawtooth",e.frequency.setValueAtTime(500,s),e.frequency.exponentialRampToValueAtTime(60,s+.6);let t=ne.createBiquadFilter();t.type="lowpass",t.frequency.setValueAtTime(3e3,s),t.frequency.exponentialRampToValueAtTime(200,s+.6);let n=ne.createGain();Kt(n,s,.35,.01,.6),e.connect(t).connect(n).connect(Yt),e.start(s),e.stop(s+.65)}function Xp(s=ai()){let e=Ei(s,.6),t=ne.createBiquadFilter();t.type="bandpass",t.frequency.setValueAtTime(500,s),t.frequency.linearRampToValueAtTime(350,s+.5),t.Q.value=4;let n=ne.createBiquadFilter();n.type="bandpass",n.frequency.value=900,n.Q.value=5;let i=ne.createGain();Kt(i,s,.22,.05,.5),e.connect(t).connect(i),e.connect(n).connect(i),i.connect(Gt)}function qp(s=ai()){let e=ne.createOscillator();e.frequency.setValueAtTime(130,s),e.frequency.exponentialRampToValueAtTime(45,s+.1);let t=ne.createGain();Kt(t,s,.6,.002,.14),e.connect(t).connect(Yt),e.start(s),e.stop(s+.16)}function Yp(s=ai(),e=4){let t=550+(4-e)*180,n=ne.createOscillator();n.type="triangle",n.frequency.setValueAtTime(t,s),n.frequency.exponentialRampToValueAtTime(t*1.6,s+.08);let i=ne.createGain();Kt(i,s,.16,.003,.09),n.connect(i).connect(Yt),n.start(s),n.stop(s+.12)}var Wo=2e4;function pc(s=Math.random){return 1+(s()*2-1)*.03}var Yu=class{constructor(e=.25){this.cooldown=e;B(this,"last",-1/0)}allow(e){return e-this.last<this.cooldown?!1:(this.last=e,!0)}};function lb(s,e=4,t=400,n=Wo){let i=Math.min(1,Math.max(0,1-s/e));return t*Math.pow(n/t,i)}function cb(s,e,t,n,i){return Math.max(s,e+Math.max(0,t)*n/Math.max(.1,i))}var mc=class{constructor(){B(this,"musicIn");B(this,"lowpass");B(this,"duck");B(this,"spb",.5);B(this,"cringeUntil",0);B(this,"duckCrowdToSilence",!1);B(this,"ended",!1);B(this,"bedGain",null);B(this,"bedFilter",null);B(this,"bedSrc",null);B(this,"bedBase",.16);B(this,"holdOsc",null);B(this,"holdFilter",null);B(this,"holdGain",null);B(this,"whooshed",new WeakSet);B(this,"dropArmed",!1);B(this,"dropBoomAt",-1);B(this,"crowdGate",new Yu(.25));this.musicIn=ne.createGain(),this.lowpass=ne.createBiquadFilter(),this.lowpass.type="lowpass",this.lowpass.frequency.value=Wo,this.duck=ne.createGain(),this.duck.gain.value=1,this.musicIn.connect(this.lowpass).connect(this.duck).connect(Ti)}event(e){let t=ne.currentTime;switch(e.kind){case"judged":this.judged(t,e.grade,e.cringe);break;case"mashStep":zp(t,e.count,pc());break;case"release":this.release(t,e.burst);break;case"holdStart":this.startHoldRiser(t);break;case"holdEnd":this.stopHoldRiser(t,e.grade);break;case"taunt":Hp(t,pc());break;case"dropSoon":this.dropArmed=!0;break;case"drop":this.dropBoomAt<0&&(xt.boom(t),this.duckMusic(t)),this.dropBoomAt=-1;break;case"phase2":Wp(t);break;case"end":this.end(t,e.win);break;default:break}}frame(e,t){this.spb=e.spb,this.updateDropRiser(e),this.updateCrowdBed(e),this.updateAnticipation(e),this.scheduleDropBoom(e)}scheduleDropBoom(e){if(!this.dropArmed||!Number.isFinite(e.beatsToDrop)||e.beatsToDrop>1)return;this.dropArmed=!1;let t=cb(ne.currentTime,Tn(),e.beatsToDrop,e.spb,e.rate);xt.boom(t),this.duckMusic(t),this.dropBoomAt=t}judged(e,t,n){if(n)return this.cringe(e);t==="perfect"?(xt.snap(e),qu(e,.24,pc()),kp(e)):t==="great"?(xt.snap(e),qu(e,.16,pc())):t==="ok"?xt.tick(e):xt.thud(e)}cringe(e){xt.scratch(e),this.queueCrowd(e,"ooh");let t=Math.max(this.lowpass.frequency.value,400);this.lowpass.frequency.cancelScheduledValues(e),this.lowpass.frequency.setValueAtTime(600,e),this.lowpass.frequency.setValueAtTime(600,e+this.spb*.85),this.lowpass.frequency.linearRampToValueAtTime(t,e+this.spb),this.cringeUntil=e+this.spb}release(e,t){Vp(e,Math.min(2,t/20)),Gp(e,.35),this.queueCrowd(e,"cheer",Math.max(.4,Math.min(2.2,t/14)))}end(e,t){this.ended=!0,t?(xt.boom(e,1.4),this.duckMusic(e),this.queueCrowd(e,"cheer",2.2),this.bedGain?.gain.cancelScheduledValues(e),this.bedGain?.gain.setTargetAtTime(this.bedBase*1.6,e,.05),this.bedGain?.gain.setTargetAtTime(1e-4,e+this.spb*2,.4)):(xt.scratch(e),this.queueCrowd(e,"ooh"),window.setTimeout(()=>Xu(),700),this.bedGain?.gain.cancelScheduledValues(e),this.bedGain?.gain.setTargetAtTime(1e-4,e+this.spb,.5))}startHoldRiser(e){this.stopHoldRiser(e,null);let t=ne.createOscillator();t.type="sawtooth",t.frequency.setValueAtTime(140,e),t.frequency.exponentialRampToValueAtTime(900,e+4);let n=ne.createBiquadFilter();n.type="lowpass",n.frequency.setValueAtTime(500,e),n.frequency.exponentialRampToValueAtTime(4e3,e+4);let i=ne.createGain();i.gain.setValueAtTime(1e-4,e),i.gain.exponentialRampToValueAtTime(.16,e+.15),t.connect(n).connect(i).connect(Yt),t.start(e),this.holdOsc=t,this.holdFilter=n,this.holdGain=i}stopHoldRiser(e,t){!this.holdOsc||!this.holdGain||(this.holdGain.gain.cancelScheduledValues(e),this.holdGain.gain.setTargetAtTime(1e-4,e,t==="miss"?.05:.12),(t==="perfect"||t==="great")&&this.holdFilter?.frequency.setTargetAtTime(6e3,e,.05),this.holdOsc.stop(e+.4),this.holdOsc=null,this.holdGain=null,this.holdFilter=null)}countIn(e,t){this.ended=!1,this.ensureBed(e),qp(e),Yp(e,t);let n=Math.min(1,(5-t)/4);this.bedGain?.gain.setTargetAtTime(this.bedBase*n,e,.15)}ensureBed(e){if(this.bedGain)return;let t=ne.createGain();t.gain.value=1e-4;let n=ne.createBiquadFilter();n.type="bandpass",n.frequency.value=600,n.Q.value=.6;let i=Ei(e,36e3);i.connect(n).connect(t).connect(Gt),this.bedGain=t,this.bedFilter=n,this.bedSrc=i}updateDropRiser(e){let t=ne.currentTime;this.duckCrowdToSilence=e.beatsToDrop<=1,!(t<this.cringeUntil)&&(e.beatsToDrop<=4?this.lowpass.frequency.setValueAtTime(lb(e.beatsToDrop),t):this.lowpass.frequency.value<Wo-1&&this.lowpass.frequency.setTargetAtTime(Wo,t,.2))}updateCrowdBed(e){if(!this.bedGain||!this.bedFilter||this.ended)return;let t=ne.currentTime;if(this.duckCrowdToSilence){this.bedGain.gain.setTargetAtTime(1e-4,t,.06);return}let n=Math.min(1,.3+Math.abs(e.meter)*.4+e.energy*.3);this.bedFilter.frequency.setTargetAtTime(500+n*900,t,.3),this.bedGain.gain.setTargetAtTime(this.bedBase*n,t,.3)}updateAnticipation(e){for(let t of e.prompts){if(t.phase==="done"||t.ev.type!=="mash"&&t.ev.type!=="combo"||this.whooshed.has(t.ev))continue;let n=e.targetAt(t.ev)-e.spb;if(n<=e.songTime)continue;let i=ne.currentTime+(n-e.songTime)/Math.max(.1,e.rate);xt.whoosh(i),this.whooshed.add(t.ev)}}duckMusic(e){let t=this.duck.gain;t.cancelScheduledValues(e),t.setValueAtTime(1,e),t.linearRampToValueAtTime(.35,e+.02),t.linearRampToValueAtTime(1,e+.15)}queueCrowd(e,t,n=1){let i=e+.09+Math.random()*.03;if(!this.crowdGate.allow(i))return;let r=Math.max(0,i-ne.currentTime)*1e3;window.setTimeout(()=>{t==="cheer"?Op(n):t==="boo"?Xu():Xp(ne.currentTime)},r)}stopAll(){let e=ne.currentTime;this.stopHoldRiser(e,null),this.bedGain&&this.bedGain.gain.cancelScheduledValues(e),this.bedGain?.gain.setTargetAtTime(1e-4,e,.2),this.bedSrc?.stop(e+1),this.bedGain=null,this.bedFilter=null,this.bedSrc=null,this.duck.gain.cancelScheduledValues(e),this.duck.gain.setTargetAtTime(1,e,.05),this.lowpass.frequency.cancelScheduledValues(e),this.lowpass.frequency.setTargetAtTime(Wo,e,.05),this.duckCrowdToSilence=!1,this.cringeUntil=0,this.ended=!1,this.dropArmed=!1,this.dropBoomAt=-1}};function j(s,e,t){let n=document.createElement(s);return e&&(n.className=e),t!==void 0&&(n.textContent=t),n}function gc(s,e){s.textContent!==e&&(s.textContent=e)}function qn(s,e){s.classList.remove(e),s.offsetWidth,s.classList.add(e)}function Kp(s){let e=j("section","screen gate");e.appendChild(j("h1","logo","AURA")),e.appendChild(j("p","gate-prompt","TAP TO START"));let t=!1;async function n(){t||(t=!0,Bp(),await Promise.race([ne.resume().catch(()=>{}),new Promise(r=>setTimeout(r,800))]),Rs(),s())}e.addEventListener("pointerup",n);function i(){n()}return{root:e,onKey:i}}function Zp(s,e,t){let n=j("section","screen title");n.appendChild(j("h1","logo","AURA"));let i=j("p","subtitle");n.appendChild(i);let r=j("div","menu");n.appendChild(r);function o(T){return s.every(x=>(T.best[x.id]?.stars??0)>0)}function a(){let T=e(),x=s.filter(M=>(T.best[M.id]?.stars??0)>0);i.textContent=x.length?`current title: ${x[x.length-1].title}`:"you have zero aura. fix that.";let S=o(T);u.enabled=S,u.root.classList.toggle("disabled",!S),u.root.querySelector(".hint").textContent=S?"read only":"unlock: finish the campaign"}function l(T,x,S,M){let A=j("button","menu-item"+(S?"":" disabled"));A.type="button",A.appendChild(j("span","label",T)),A.appendChild(j("span","hint",x));let v={root:A,enabled:S,action:M};return A.addEventListener("click",()=>{g=f.indexOf(v),_(),m(v)}),r.appendChild(A),v}let c=l("PLAY","start the campaign",!0,t.play),h=l("MULTIPLAYER","coming soon: same room, same beat",!1,()=>{}),u=l("LOADOUT","unlock: finish the campaign",!1,t.loadout),d=l("SETTINGS","calibration, volume, controls",!0,t.settings),f=[c,h,u,d],g=0;function _(){f.forEach((T,x)=>T.root.classList.toggle("selected",x===g))}function m(T){if(!T.enabled){xt.thud(),qn(T.root,"shake");return}xt.snap(),T.action()}function p(T){g=(g+T+f.length)%f.length,xt.tick(),_()}function b(T){T.code==="ArrowDown"||T.code==="ArrowRight"?p(1):T.code==="ArrowUp"||T.code==="ArrowLeft"?p(-1):(T.code==="Enter"||T.code==="Space")&&m(f[g])}return _(),{root:n,onKey:b,show(){a(),g=0,_()}}}var $p="aura.latency.v2";function Ir(){try{let s=localStorage.getItem($p);if(s!==null)return parseFloat(s)||0}catch{}return 0}function Jp(s){try{localStorage.setItem($p,String(s))}catch{}}var jp="aura.v2.volume";function hb(){try{let s=localStorage.getItem(jp);if(s!==null)return Math.min(1,Math.max(0,parseFloat(s)))}catch{}return .9}function ub(s){try{localStorage.setItem(jp,String(s))}catch{}}function Qp(s){let e=j("section","screen settings");e.appendChild(j("h2","screen-title","SETTINGS"));let t=j("div","menu");e.appendChild(t);let n=j("button","menu-item");n.type="button",n.appendChild(j("span","label","LATENCY CALIBRATION"));let i=j("span","hint",`offset ${(Ir()*1e3).toFixed(0)} ms`);n.appendChild(i),t.appendChild(n);let r=j("button","menu-item");r.type="button",r.appendChild(j("span","label","VOLUME"));let o=j("span","hint volume-bar"),a=j("span","volume-fill");o.appendChild(a),r.appendChild(o),t.appendChild(r);let l=j("button","menu-item");l.type="button",l.appendChild(j("span","label","BACK")),l.appendChild(j("span","hint","to the title")),t.appendChild(l);let c=[n,r,l],h=0,u=hb();function d(){a.style.width=`${Math.round(u*100)}%`}function f(){Gt&&(Gt.gain.value=u),ub(u),d()}function g(P){u=Math.min(1,Math.max(0,P)),f()}let _=j("div","controls-list");_.appendChild(j("p","controls-row","arrows or WASD: move / direction")),_.appendChild(j("p","controls-row","space: hold, mash release")),_.appendChild(j("p","controls-row","enter: confirm, escape: back")),_.appendChild(j("p","controls-row","touch: tap edges for hit, halves for mash, hold anywhere, swipe for direction")),e.appendChild(_);function m(){c.forEach((P,N)=>P.classList.toggle("selected",N===h))}let p=null,b=j("div","calibrate-overlay hidden"),T=j("div","calibrate-pulse"),x=j("p","calibrate-count","0 / 8");b.appendChild(j("h2","screen-title","LATENCY CALIBRATION")),b.appendChild(j("p","subtitle","tap SPACE on each click after the first four")),b.appendChild(T),b.appendChild(x),e.appendChild(b);let S=null;function M(){if(!p)return;let P=(Tn()-p.t0)/p.spb,N=P>0?Math.exp(-(P%1)*6):0;T.style.transform=`scale(${1+N*.5})`,T.style.opacity=String(.3+N*.7),S=requestAnimationFrame(M)}function A(){b.classList.remove("hidden");let P=.5;p={t0:ne.currentTime+.5,taps:[],spb:P};for(let N=0;N<16;N++)xt.tick(p.t0+N*P,N%4===0);x.textContent="0 / 8",M()}function v(){p=null,S!==null&&cancelAnimationFrame(S),S=null,b.classList.add("hidden")}function w(P){if(!p)return;let N=Math.round((P-p.t0)/p.spb);if(N>=4&&N<16&&p.taps.push(P-(p.t0+N*p.spb)),x.textContent=`${p.taps.length} / 8`,p.taps.length>=8){let I=[...p.taps].sort((H,V)=>H-V);Jp((I[3]+I[4])/2),i.textContent=`offset ${(Ir()*1e3).toFixed(0)} ms`,xt.snap(),v()}}b.addEventListener("pointerdown",P=>w(Tn(P.timeStamp)));function R(){c[h]===n?(xt.snap(),A()):c[h]===l&&(xt.snap(),s())}function L(P){if(p){P.code==="Space"?(P.preventDefault(),w(Tn())):P.code==="Escape"&&v();return}P.code==="ArrowDown"?(h=(h+1)%c.length,xt.tick(),m()):P.code==="ArrowUp"?(h=(h-1+c.length)%c.length,xt.tick(),m()):P.code==="ArrowRight"&&c[h]===r?g(u+.1):P.code==="ArrowLeft"&&c[h]===r?g(u-.1):P.code==="Enter"||P.code==="Space"?R():P.code==="Escape"&&s()}return n.addEventListener("click",()=>{h=0,m(),R()}),l.addEventListener("click",()=>{h=c.length-1,m(),R()}),r.addEventListener("click",()=>g(u>=.95?0:u+.2)),d(),m(),{root:e,onKey:L,show(){v(),h=0,f(),i.textContent=`offset ${(Ir()*1e3).toFixed(0)} ms`,m()},hide(){v()}}}function e0(s,e,t,n=8){let i=1-Math.exp(-n*t);return s+(e-s)*i}function _c(s){return"\u2605".repeat(s)+"\u2606".repeat(3-s)}var Lr=[[22,84],[68,70],[28,52],[72,33],[50,13]];function t0(s,e,t,n){let i=j("section","screen map"),r=j("div","map-bg");r.style.backgroundImage=`linear-gradient(rgba(5,2,15,0.55), rgba(5,2,15,0.75)), url("${e}art/title.jpg")`,i.appendChild(r),i.appendChild(j("h2","screen-title map-heading","CAMPAIGN"));let o=j("div","map-path");i.appendChild(o);let a="http://www.w3.org/2000/svg",l=document.createElementNS(a,"svg");l.setAttribute("class","map-line"),l.setAttribute("viewBox","0 0 100 100"),l.setAttribute("preserveAspectRatio","none");let c=document.createElementNS(a,"polyline");c.setAttribute("points",Lr.map(([T,x])=>`${T},${x}`).join(" ")),c.setAttribute("class","map-line-path"),l.appendChild(c),o.appendChild(l);let h=j("div","map-pin","\u{1F464}");o.appendChild(h);let u=s.map((T,x)=>{let[S,M]=Lr[x]??Lr[Lr.length-1],A=j("button","map-node");A.type="button",A.style.left=`${S}%`,A.style.top=`${M}%`;let v=j("span","map-node-num",String(T.id)),w=j("span","map-node-lock","\u{1F512}"),R=j("span","map-node-stars");return A.appendChild(v),A.appendChild(w),A.appendChild(R),A.addEventListener("click",()=>m(x)),o.appendChild(A),{btn:A,num:v,lock:w,stars:R}}),d=0;function f(T){return Math.min(s.length,Math.max(1,T.unlocked))}function g(){let T=t(),x=f(T);u.forEach((S,M)=>{let A=M>=x;S.btn.classList.toggle("locked",A),S.lock.classList.toggle("hidden",!A),S.num.classList.toggle("hidden",A);let v=T.best[s[M].id]?.stars??0;S.stars.textContent=A?"":_c(v)}),d>=x&&(d=x-1),_()}function _(){u.forEach((S,M)=>S.btn.classList.toggle("selected",M===d));let[T,x]=Lr[d]??Lr[0];h.style.left=`${T}%`,h.style.top=`${x}%`}function m(T){d=T,_();let x=t();if(T>=f(x)){xt.thud(),qn(u[T].btn,"shake");return}xt.snap(),n(T)}function p(T){let x=t(),S=f(x);d=(d+T+S)%S,xt.tick(),_()}function b(T){T.code==="ArrowRight"||T.code==="ArrowDown"?p(1):T.code==="ArrowLeft"||T.code==="ArrowUp"?p(-1):(T.code==="Enter"||T.code==="Space")&&m(d)}return{root:i,onKey:b,show(){g()}}}var db=`<svg viewBox="0 0 100 160" preserveAspectRatio="xMidYMax meet">
  <circle cx="50" cy="26" r="20" fill="currentColor" />
  <path d="M20 150 L26 78 Q28 58 50 58 Q72 58 74 78 L80 150 Z" fill="currentColor" />
</svg>`;function n0(s,e){let t=j("section","screen vscard"),n=j("div","vs-stage"),i=j("div","vs-side us");i.innerHTML=db;let r=j("div","vs-versus","VS"),o=j("div","vs-side them"),a=j("div","vs-portrait");o.appendChild(a),n.appendChild(i),n.appendChild(r),n.appendChild(o),t.appendChild(n);let l=j("div","vs-info"),c=j("h2","vs-level-name"),h=j("p","vs-place"),u=j("p","vs-bpm"),d=j("p","vs-prompt","PRESS SPACE OR TAP TO FIGHT");l.appendChild(c),l.appendChild(h),l.appendChild(u),l.appendChild(d),t.appendChild(l);let f=!1;t.addEventListener("click",()=>{f&&e()});function g(m){a.style.backgroundImage=`url("${s}art/opp-${m.artKey}.jpg")`,o.style.setProperty("--opp-color",m.opponent.color||"#ff3df2"),c.textContent=m.opponent.name.toUpperCase(),h.textContent=m.place,u.textContent=`${Math.round(m.bpm)} BPM`;let p=typeof matchMedia=="function"&&matchMedia("(pointer: coarse)").matches;d.textContent=p?"TAP TO FIGHT":"PRESS SPACE OR TAP TO FIGHT",f=!1,setTimeout(()=>f=!0,350)}function _(m){f&&(m.code==="Enter"||m.code==="Space")&&e()}return{root:t,onKey:_,show:g}}var fb=[["HIT","press the arrow when it lands in the ring."],["COMBO","type the sequence in order, the last one on the beat."],["HOLD","press and hold, release exactly on time."],["MASH","alternate left and right, then release for the burst."]];function i0(s){let e=j("section","screen loadout");e.appendChild(j("h2","screen-title","LOADOUT")),e.appendChild(j("p","subtitle","read only, unlocked by finishing the campaign"));let t=j("div","loadout-grid");for(let[i,r]of fb){let o=j("div","loadout-card");o.appendChild(j("h3","loadout-card-name",i)),o.appendChild(j("p","loadout-card-desc",r)),t.appendChild(o)}e.appendChild(t),e.appendChild(j("p","results-prompt","PRESS ESCAPE OR TAP TO GO BACK")),e.addEventListener("click",s);function n(i){(i.code==="Escape"||i.code==="Enter"||i.code==="Space")&&s()}return{root:e,onKey:n}}var Ku="https://aura-proxy.dylanmerigaud-pro.workers.dev",pb="r2sIQdqqoqgRJuXw",s0=new RegExp("[\u2014\u2013]","g");async function r0(s,e,t){let n=new AbortController,i=setTimeout(()=>n.abort(),t);try{let r=await fetch(`${Ku}${s}`,{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify(e),signal:n.signal});return r.ok?r:null}catch{return null}finally{clearTimeout(i)}}async function o0(s,e){if(!Ku)return null;let t=s.win?s.stars===3?"S":s.stars===2?"A":"B":"F",n=await r0("/roast",{level:e.id,score:s.score,rank:t,combo:s.maxCombo,...s.counts},3e3);if(!n)return null;try{let i=await n.json();return typeof i.roast=="string"?{roast:i.roast.replace(s0,","),title:String(i.title??"").replace(s0," ")}:null}catch{return null}}async function a0(s){if(!Ku||!ne)return!1;let e=await r0("/voice",{text:s,voice:pb},6e3);if(!e)return!1;try{let t=await ne.decodeAudioData(await e.arrayBuffer()),n=ne.createBufferSource();return n.buffer=t,n.connect(Gt),n.start(),!0}catch{return!1}}function l0(s){let e=j("section","screen results"),t=j("h1","results-heading");e.appendChild(t);let n=j("p","results-stars");e.appendChild(n);let i=j("p","results-title");e.appendChild(i);let r=j("div","results-rows");e.appendChild(r);let o={perfect:j("p","results-row"),great:j("p","results-row"),ok:j("p","results-row"),miss:j("p","results-row"),cringe:j("p","results-row"),accuracy:j("p","results-row"),score:j("p","results-row"),burst:j("p","results-row")};Object.values(o).forEach(_=>r.appendChild(_));let a=j("p","results-roast"),l=j("p","results-roast-tag hidden","roast written live by Gemini, voiced live by Gradium");e.appendChild(a),e.appendChild(l);let c=j("p","results-prompt");e.appendChild(c);let h=!1,u=0;e.addEventListener("click",()=>{h&&s()});function d(_,m,p){_.textContent=`${m}   ${p}`}function f(_,m){h=!1,u++;let p=u;t.textContent=_.win?"VICTORY":"YOU HAVE BEEN HUMBLED",t.classList.toggle("win",_.win),t.classList.toggle("lose",!_.win),n.textContent=_c(_.stars),i.textContent=_.win?`TITLE UNLOCKED: ${m.title.toUpperCase()}`:"",i.classList.toggle("hidden",!_.win),d(o.perfect,"PERFECT",String(_.counts.perfect)),d(o.great,"GREAT",String(_.counts.great)),d(o.ok,"OK",String(_.counts.ok)),d(o.miss,"MISS",String(_.counts.miss)),d(o.cringe,"CRINGE",String(_.counts.cringe)),d(o.accuracy,"ACCURACY",`${Math.round(_.accuracy*100)}%`),d(o.score,"SCORE",String(Math.round(_.score))),d(o.burst,"BEST BURST",String(_.bestBurst)),a.textContent=_.win?m.announcer.win:m.announcer.lose,l.classList.add("hidden");let b=typeof matchMedia=="function"&&matchMedia("(pointer: coarse)").matches;c.textContent=`${b?"TAP":"PRESS SPACE"} TO ${_.win?"CONTINUE":"RETRY"}`,setTimeout(()=>h=!0,300),o0(_,m).then(T=>{if(!(p!==u||!T))return a.textContent=T.roast,l.textContent="roast written live by Gemini",l.classList.remove("hidden"),a0(T.roast).then(x=>{x&&p===u&&(l.textContent="roast written live by Gemini, voiced live by Gradium")})}).catch(()=>{})}function g(_){h&&(_.code==="Enter"||_.code==="Space")&&s()}return{root:e,onKey:g,show:f}}var Xo={perfect:.045,great:.09,ok:.13};function Dr(s,e=1){let t=Math.abs(s);return t<=Xo.perfect*e?"perfect":t<=Xo.great*e?"great":t<=Xo.ok*e?"ok":"miss"}function xc(s){return s==="perfect"?2:s==="great"?1.5:s==="ok"?1:.5}function vc(s){return s>=50?4:s>=25?3:s>=10?2:1}function yc(s){return s>=25?3:s>=15?2:s>=5?1:0}function c0(){let s=j("div","hud-top"),e=j("div","meter-track"),t=j("div","meter-fill meter-you"),n=j("div","meter-fill meter-them"),i=j("div","meter-thumb");e.appendChild(t),e.appendChild(n),e.appendChild(i),s.appendChild(e);let r=j("div","hud-right-box"),o=j("div","hud-score","0"),a=j("div","hud-combo hidden"),l=j("span","hud-combo-num","0"),c=j("span","hud-combo-mult","");a.appendChild(l),a.appendChild(j("span","hud-combo-label","COMBO")),a.appendChild(c),r.appendChild(o),r.appendChild(a),s.appendChild(r);let h=j("div","tachometer"),u=j("div","tach-needle");h.appendChild(u),h.appendChild(j("div","tach-face")),s.appendChild(h);let d=1,f=NaN;function g(_,m){let p=Math.round((50+_.meter*50)*10)/10;if(p!==f&&(f=p,t.style.width=`${p}%`,n.style.width=`${100-p}%`,i.style.left=`${p}%`),gc(o,String(Math.round(_.score))),_.combo>=2){a.classList.remove("hidden"),gc(l,String(_.combo));let T=vc(_.combo);gc(c,T>1?`x${T}`:"");let x=String(yc(_.combo));a.dataset.tier!==x&&(a.dataset.tier=x)}else a.classList.add("hidden");d=e0(d,_.rate,m,6);let b=(d-1.025)/.125*50;u.style.transform=`rotate(${b}deg)`}return{root:s,frame:g}}function h0(){return{panel:null,silentUntil:-1/0}}function u0(s,e,t,n,i=[]){if(i.length=0,n.panel&&n.panel.phase==="done"&&(n.panel=null,n.silentUntil=e+t),e<n.silentUntil)return i;let r;for(let o of s)if(o.phase!=="done"){r=o;break}return r&&(r.ev.type!=="hit"&&(n.panel=r),i.push(r)),i}var Ps="#35e0ff",Zu="#1b5b70",bc="#ff3df2",ji="#fff36b",$u=260,mb={right:0,down:Math.PI/2,left:Math.PI,up:-Math.PI/2};function gb(s,e=64){let t=document.createElement("canvas");t.width=t.height=e;let n=t.getContext("2d"),i=n.createRadialGradient(e/2,e/2,0,e/2,e/2,e/2);return i.addColorStop(0,"rgba(255,255,255,1)"),i.addColorStop(.2,s),i.addColorStop(1,"rgba(0,0,0,0)"),n.fillStyle=i,n.fillRect(0,0,e,e),t}function d0(s){let e=j("canvas","hud-arrows"),t=e.getContext("2d"),n=j("div","hud-safe-probe"),i=[Ps,bc,ji,"#ffffff"].map(R=>gb(R)),r=0,o=0,a=1,l=!1,c=0,h=0,u=1,d=$u,f=!1,g=h0(),_=[];function m(){if(r=window.innerWidth,o=window.innerHeight,a=Math.min(window.devicePixelRatio||1,3),e.width=Math.round(r*a),e.height=Math.round(o*a),l=o>=r,!l)u=Math.min(r/1280,o/720),c=r/3,h=o*(300/720),d=$u;else{n.parentNode||s.appendChild(n);let R=getComputedStyle(n),L=parseFloat(R.paddingLeft)||0,P=parseFloat(R.paddingRight)||0,N=parseFloat(R.paddingTop)||0,I=r-L-P;u=Math.min(r*.92,420,I)/480,c=L+I/2,h=o*.6,d=Math.min($u,(h-(N+90))/2/u)}s.style.setProperty("--ring-x",`${c}px`),s.style.setProperty("--ring-y",`${h}px`),s.style.setProperty("--ring-r",`${52*u}px`)}window.addEventListener("resize",m),window.addEventListener("orientationchange",m);function p(R,L,P,N,I,H=1){t.save(),t.translate(R,L),t.rotate(mb[P]),t.globalAlpha=H,t.globalCompositeOperation="lighter",t.drawImage(i[I===Ps||I===Zu?0:I===ji?2:1],-N*1.8,-N*1.8,N*3.6,N*3.6),t.globalCompositeOperation="source-over",t.fillStyle=I,t.beginPath();let V=N;t.moveTo(V,0),t.lineTo(0,-V*.8),t.lineTo(0,-V*.35),t.lineTo(-V*.85,-V*.35),t.lineTo(-V*.85,V*.35),t.lineTo(0,V*.35),t.lineTo(0,V*.8),t.closePath(),t.fill(),t.strokeStyle="#fff",t.lineWidth=3,t.stroke(),t.restore()}function b(R,L,P,N){P=Math.max(0,Math.min(1,P)),t.strokeStyle=N,t.lineWidth=6,t.beginPath(),t.arc(R,L,50+P*80,0,Math.PI*2),t.globalAlpha=1-P*.6,t.stroke(),t.globalAlpha=1}function T(R,L,P,N,I){t.font=`900 ${I}px "Arial Black", Impact, sans-serif`,t.textAlign="center",t.textBaseline="middle",t.lineWidth=I/6,t.strokeStyle="#000",t.strokeText(R,L,P),t.fillStyle=N,t.fillText(R,L,P)}function x(R,L){let P=Math.min(110,20+R*2.4),N=1+L*.06;t.globalCompositeOperation="lighter",t.drawImage(i[0],-P*2*N,-P*2*N,P*4*N,P*4*N),t.drawImage(i[3],-P*.8,-P*.8,P*1.6,P*1.6),t.globalCompositeOperation="source-over"}function S(R){return l?[0,-R*d]:[R*d,0]}function M(R,L){let P=L.songTime,N=L.spb,I=R.ev;if(P<L.showsAt(I))return;let H=I.beat*N;if(I.type==="hit"){let[V,q]=S((H-P)/N);p(V,q,I.dir,38,Ps)}else if(I.type==="combo"){let V=I.dirs.length,q=l?Math.min(84,440/Math.max(1,V)):84,ee=-((V-1)*q)/2;for(let k=0;k<V;k++){let te=k<R.progress;p(ee+k*q,-110,I.dirs[k],te?30:34,te?ji:bc,te?.5:1)}b(0,0,(H-P)/((V+2)*N),bc),T("COMBO",0,8,bc,26)}else if(I.type==="hold")if(!R.held)b(0,0,(H-P)/(2*N),ji),T("HOLD SPACE",0,10,ji,24);else{let V=L.holdProgress;t.strokeStyle=ji,t.lineWidth=12,t.beginPath(),t.arc(0,0,58,-Math.PI/2,-Math.PI/2+V*Math.PI*2),t.stroke(),T(V>=.97?"RELEASE!":"HOLD...",0,10,"#fff",26)}else if(I.type==="mash"){let V=L.targetAt(I);if(L.mashing){let q=Math.sin(performance.now()/1e3*30);x(L.mashCount,q);let ee=R.lastDir!=="left";p(-90,0,"left",ee?44:32,ee?Ps:Zu),p(90,0,"right",ee?32:44,ee?Zu:Ps),T(`${L.mashCount}`,0,4,"#fff",44+Math.min(30,L.mashCount)),T("MASH",0,-90,Ps,44),b(0,0,(V-P)/(V-H),ji),V-P<1.5*N&&T("SPACE TO RELEASE!",0,130,ji,(l?26:34)+q*3)}else T("MASH INCOMING",0,0,Ps,30)}}function A(){f&&(t.setTransform(1,0,0,1,0,0),t.clearRect(0,0,e.width,e.height),f=!1)}function v(R){(window.innerWidth!==r||window.innerHeight!==o)&&m(),t.setTransform(1,0,0,1,0,0),t.clearRect(0,0,e.width,e.height),f=!0;let L=a*u;t.setTransform(L,0,0,L,a*c,a*h);let P=R.turn==="opponent",N=P?0:Math.exp(-R.beatPhase*R.spb*7);if(t.strokeStyle=P?"rgba(255,255,255,0.12)":`rgba(255,255,255,${.35+N*.5})`,t.lineWidth=4,t.beginPath(),t.arc(0,0,46+N*6,0,Math.PI*2),t.stroke(),!(P||R.ending))for(let I of u0(R.prompts,R.songTime,R.spb,g,_))M(I,R)}function w(){g.panel=null,g.silentUntil=-1/0,A()}return{root:e,frame:v,clear:A,reset:w}}var f0={perfect:"#fff36b",great:"#5dfcff",ok:"#b98cff",miss:"#ff4d6d"},p0="#ff3df2";var _b=6;function m0(s){let e=j("div","hud-popups"),t=j("div","grade-lane");e.appendChild(t);let n=Array.from({length:_b},()=>{let M=j("div","grade-popup");return t.appendChild(M),M}),i=0,r=j("div","burst-popup"),o=j("div","burst-num"),a=j("div","burst-label");r.appendChild(o),r.appendChild(a),e.appendChild(r);let l=j("div","combo-popup");e.appendChild(l);let c=j("div","taunt-bar hidden"),h=j("div","taunt-portrait"),u=j("div","taunt-text"),d=j("div","taunt-name");c.appendChild(h);let f=j("div","taunt-body");f.appendChild(d),f.appendChild(u),c.appendChild(f),e.appendChild(c);let g=null,_=j("div","count-in hidden"),m=j("div","count-num");_.appendChild(m),e.appendChild(_);let p=j("div","level-title-punch hidden");e.appendChild(p);function b(M,A,v){let w=n[i];i=(i+1)%n.length,w.textContent=M,w.style.color=A,w.classList.toggle("big",v),qn(w,"pop")}function T(M){l.textContent=`${M} COMBO`,qn(l,"pop")}function x(M,A){if(M.kind==="judged"){M.cringe?b("CRINGE",p0,!0):b(M.grade.toUpperCase(),f0[M.grade],M.big),!M.cringe&&M.grade!=="miss"&&M.combo>0&&M.combo%10===0&&T(M.combo);return}if(M.kind==="release"){let v=M.mult>=2?"PERFECT RELEASE":M.mult>=1.5?"GREAT RELEASE":M.mult>=1?"RELEASE":"WEAK RELEASE";o.textContent=String(M.burst),a.textContent=v,qn(r,"pop-big");return}if(M.kind==="taunt"){h.style.backgroundImage=`url("${s}art/opp-${A.artKey}.jpg")`,h.style.setProperty("--opp-color",A.opponent.color||"#ff3df2"),d.textContent=A.opponent.name.toUpperCase(),u.textContent=M.text,c.classList.remove("hidden"),qn(c,"slide-up"),g&&clearTimeout(g),g=setTimeout(()=>c.classList.add("hidden"),3200);return}if(M.kind==="countIn"){_.classList.remove("hidden"),m.textContent=M.n===1?"FIGHT!":String(M.n-1),qn(m,"pop"),M.n===2&&(p.textContent=`${A.place.toUpperCase()}  VS  ${A.opponent.name.toUpperCase()}`,p.classList.remove("hidden"),qn(p,"punch")),M.n===1&&setTimeout(()=>_.classList.add("hidden"),700);return}M.kind==="end"&&(p.classList.add("hidden"),c.classList.add("hidden"),g&&clearTimeout(g))}function S(){_.classList.add("hidden"),p.classList.add("hidden"),c.classList.add("hidden"),g&&clearTimeout(g)}return{root:e,event:x,reset:S}}function g0(s){let e=j("div","hud screen"),t=c0(),n=d0(e),i=m0(s);e.appendChild(n.root),e.appendChild(t.root),e.appendChild(i.root);let r=j("div","hud-loading hidden","LOADING");e.appendChild(r);let o=null;function a(h){o=h,e.classList.remove("shown"),r.classList.remove("hidden"),i.reset(),n.reset()}function l(h){"vibrate"in navigator&&navigator.vibrate(h)}return{root:e,listener:{event(h){h.kind==="countIn"&&r.classList.add("hidden"),h.kind==="countIn"&&h.n===1&&e.classList.add("shown"),o&&i.event(h,o),h.kind==="judged"&&h.grade!=="miss"?l(h.big?30:15):(h.kind==="release"||h.kind==="drop")&&l(45),h.kind==="end"&&(e.classList.remove("shown"),n.clear())},frame(h,u){o=h.level,t.frame(h,u),e.classList.contains("shown")?n.frame(h):n.clear()}},prepare:a}}function _0(s,e,t){return e==="opponent"?"opponent":s==="mash"&&t?"release":s}function x0(s){return s>=.45}function xb(s){return{kind:"dir",dir:s<.5?"left":"right"}}function v0(s,e,t=30){return s*s+e*e<t*t?null:Math.abs(s)>Math.abs(e)?s<0?"left":"right":e<0?"up":"down"}function y0(s,e,t){return x0(t)?s==="mash"?xb(e):s==="release"||s==="hold"?{kind:"space",down:!0}:null:null}function b0(s,e){return s==="hit"&&x0(e)}var vb={ArrowUp:"up",ArrowDown:"down",ArrowLeft:"left",ArrowRight:"right",KeyW:"up",KeyS:"down",KeyA:"left",KeyD:"right"},yb=new Set(["Space","Enter","NumpadEnter"]);function Mc(){return{held:new Set}}function M0(s,e,t=n=>n){let n=vb[e.code],i=yb.has(e.code);if(!n&&!i)return{prevent:!1,input:null};if(e.type==="keydown"){if(e.repeat)return{prevent:!0,input:null};if(n)return{prevent:!0,input:{kind:"dir",dir:n,at:t(e.timeStamp)}};let r=s.held.size===0;return s.held.add(e.code),{prevent:!0,input:r?{kind:"space",down:!0,at:t(e.timeStamp)}:null}}return e.type==="keyup"&&i?!s.held.delete(e.code)||s.held.size?{prevent:!0,input:null}:{prevent:!0,input:{kind:"space",down:!1,at:t(e.timeStamp)}}:{prevent:!0,input:null}}function Sc(s){let e=s;return _0(s.touchMode(),e.turn?.()??"player",e.releasing?.(1.5)??!1)}function Mb(s){typeof navigator<"u"&&"vibrate"in navigator&&navigator.vibrate(s)}function S0(s,e){let t=Mc(),n=new Map,i=null,r=!1;function o(g){let _=M0(t,g,Tn);_.prevent&&(g.preventDefault(),g.stopImmediatePropagation(),_.input&&e.input(_.input))}function a(g){let _=s.getBoundingClientRect();return{fx:(g.clientX-_.left)/_.width,fy:(g.clientY-_.top)/_.height}}function l(g){g.preventDefault();let _=Sc(e),{fx:m,fy:p}=a(g);try{s.setPointerCapture(g.pointerId)}catch{}if(b0(_,p)){n.set(g.pointerId,{x:g.clientX,y:g.clientY,fired:!1});return}let b=y0(_,m,p);if(!b)return;let T=Tn(g.timeStamp);b.kind==="dir"?(Mb(8),e.input({kind:"dir",dir:b.dir,at:T})):i===null&&(i=g.pointerId,e.input({kind:"space",down:!0,at:T}))}function c(g){let _=n.get(g.pointerId);if(!_||_.fired)return;let m=v0(g.clientX-_.x,g.clientY-_.y);m&&(_.fired=!0,Sc(e)!=="opponent"&&e.input({kind:"dir",dir:m,at:Tn(g.timeStamp)}))}function h(g){n.delete(g.pointerId),g.pointerId===i&&(i=null,e.input({kind:"space",down:!1,at:Tn(g.timeStamp)}))}function u(){document.hidden?e.pause():e.resume()}function d(){if(r)return;r=!0,t=Mc(),n.clear(),i=null;let g=document.activeElement;g instanceof HTMLElement&&g.blur(),s.addEventListener("pointerdown",l),s.addEventListener("pointermove",c),s.addEventListener("pointerup",h),s.addEventListener("pointercancel",h),addEventListener("keydown",o,!0),addEventListener("keyup",o,!0),document.addEventListener("visibilitychange",u)}function f(){r&&(r=!1,s.removeEventListener("pointerdown",l),s.removeEventListener("pointermove",c),s.removeEventListener("pointerup",h),s.removeEventListener("pointercancel",h),removeEventListener("keydown",o,!0),removeEventListener("keyup",o,!0),document.removeEventListener("visibilitychange",u),t=Mc(),n.clear(),i=null)}return{show:d,hide:f}}function T0(s){let e=j("div","playzone zone-none");e.setAttribute("aria-hidden","true");let t=j("div","pz-swipe","SWIPE"),n=j("div","pz-pad pz-left","L"),i=j("div","pz-pad pz-right","R"),r=j("div","pz-pad pz-release","RELEASE"),o=j("div","pz-pad pz-hold","HOLD"),a=j("div","pz-his","HIS MOVE");for(let h of[t,n,i,r,o,a])e.appendChild(h);let l="none";function c(){let h=Sc(s);h!==l&&(e.classList.remove(`zone-${l}`),e.classList.add(`zone-${h}`),l=h)}return{root:e,frame:c}}var w0="aura.v2.progress",E0=new Map;function A0(){try{if(typeof localStorage<"u")return localStorage}catch{}return{getItem:s=>E0.get(s)??null,setItem:(s,e)=>void E0.set(s,e)}}function R0(){try{let s=A0().getItem(w0);if(s){let e=JSON.parse(s);return{unlocked:e.unlocked??1,best:e.best??{}}}}catch{}return{unlocked:1,best:{}}}function C0(s){try{A0().setItem(w0,JSON.stringify(s))}catch{}}function P0(s,e,t,n,i){let r=s.best[e],o={score:Math.max(n.score,r?.score??0),stars:Math.max(n.stars,r?.stars??0),accuracy:Math.max(n.accuracy,r?.accuracy??0),burst:Math.max(n.burst,r?.burst??0)};return{unlocked:n.stars>0?Math.max(s.unlocked,Math.min(i,t+2)):s.unlocked,best:{...s.best,[e]:o}}}var I0=.55;function L0(s){let e=null,t=null,n=null,i=!1;function r(){return e??(e=fetch(`${s}music/title.mp3`).then(l=>l.ok?l.arrayBuffer():Promise.reject(l.status)).then(l=>ne.decodeAudioData(l)).catch(()=>(e=null,null))),e}function o(l=1){if(i=!0,!!ne){if(n&&t){n.gain.cancelScheduledValues(ne.currentTime),n.gain.setTargetAtTime(I0,ne.currentTime,l/3);return}r().then(c=>{if(!c||!i||t)return;let h=ne.currentTime,u=ne.createBufferSource();u.buffer=c,u.loop=!0;let d=ne.createGain();d.gain.setValueAtTime(1e-4,h),d.gain.setTargetAtTime(I0,h,l/3),u.connect(d).connect(Ti),u.start(h),t=u,n=d})}}function a(l){i=!1;let c=t,h=n;if(t=null,n=null,!c||!h||!ne)return;let u=ne.currentTime;h.gain.cancelScheduledValues(u),h.gain.setValueAtTime(h.gain.value,u),h.gain.linearRampToValueAtTime(1e-4,u+Math.max(.05,l)),c.stop(u+Math.max(.05,l)+.05)}return{start:o,stop:a}}var Sb=[1,.9,.8,.7,.6],Tb=25e3;function D0(s){let{game:e,stage:t,levels:n,base:i,canvas:r,debug:o}=s,a=document.getElementById("ui");o&&a.classList.add("debug");let l=R0(),c=0,h=!1,u=S0(r,e),d=g0(i),f=L0(i),g=T0(e);d.root.appendChild(g.root);let _={root:d.root},m=Kp(()=>R()),p=Zp(n,()=>l,{play:()=>P(),settings:()=>L(),loadout:()=>w(S)}),b=Qp(()=>R()),T=t0(n,i,()=>l,k=>H(k)),x=n0(i,()=>void V()),S=i0(()=>R()),M=l0(()=>q()),A=[m,p,b,T,x,S,_,M];for(let k of A)k.root.classList.add("screen"),a.appendChild(k.root);let v=null;function w(k){v!==k&&(v?.root.classList.remove("active"),v?.hide?.(),v===_&&u.hide(),v=k,k.root.classList.add("active"))}addEventListener("keydown",k=>v?.onKey?.(k)),w(m);function R(){f.start(),I(n[Math.min(n.length-1,Math.max(0,l.unlocked-1))]??n[0]),p.show(),w(p)}function L(){b.show(),w(b)}function P(){f.start(),T.show(),w(T)}let N=null;function I(k){return(!N||N.level!==k)&&(N={level:k,ready:t.load(k).catch(()=>{})}),N.ready}function H(k){c=k,I(n[k]),e.preload?.(n[k]),x.show(n[k]),w(x)}async function V(){let k=n[c];d.prepare(k),w(_),u.show(),f.stop(60/k.bpm*4),await Promise.race([I(k),new Promise(Ee=>setTimeout(Ee,Tb))]),N=null;let te=Sb[c]??1,re=await e.play(k,te);u.hide(),l=P0(l,k.id,c,{score:re.score,stars:re.stars,accuracy:re.accuracy,burst:re.bestBurst},n.length),C0(l),h=re.win,M.show(re,k),w(M)}function q(){h?P():V()}return{hud:{event:k=>d.listener.event(k),frame:(k,te)=>{d.listener.frame?.(k,te),g.frame()}}}}var Tc=class{constructor(e,t=0,n=1){B(this,"segs");this.segs=[{t:e,p:t,r:n}]}seg(e){for(let t=this.segs.length-1;t>0;t--)if(this.segs[t].t<=e)return this.segs[t];return this.segs[0]}pos(e){let t=this.seg(e);return t.p+(e-t.t)*t.r}rate(){return this.segs[this.segs.length-1].r}setRate(e,t){let n=this.segs[this.segs.length-1];for(e<n.t&&(e=n.t),this.segs.push({t:e,p:this.pos(e),r:t});this.segs.length>2&&this.segs[1].t<e-3;)this.segs.shift()}timeOf(e){let t=this.segs[this.segs.length-1];return t.t+(e-t.p)/t.r}};var Eb=.25,N0=2,Ec=class{constructor(e,t,n,i){this.spb=t;this.windowScale=n;this.emit=i;B(this,"states");B(this,"next",0);this.states=e.map(r=>({ev:r,phase:"pending",held:!1,progress:0,lastDir:null,result:null}))}get ok(){return Xo.ok*this.windowScale}opensAt(e){let t=e.beat*this.spb;return e.type==="hit"?t-this.ok:e.type==="mash"?t-Eb:e.type==="hold"?t-this.spb:t-(e.dirs.length+N0)*this.spb}showsAt(e){return e.type==="combo"?(e.beat-e.dirs.length-N0)*this.spb:e.beat*this.spb-2*this.spb}targetAt(e){let t=e.beat*this.spb;return e.type==="mash"||e.type==="hold"?t+e.length*this.spb:t}current(){return this.next<this.states.length?this.states[this.next]:null}finish(e,t){e.phase="done",e.result={ev:e.ev,...t},this.next++,this.emit(e.result)}input(e){let t=this.current();if(!t||e.t<this.opensAt(t.ev))return;t.phase="active";let n=t.ev,i=n.beat*this.spb;if(n.type==="hit"){if(e.kind!=="dir")return;let r=Dr(e.t-i,this.windowScale);if(e.dir!==n.dir)return this.finish(t,{grade:"miss",cringe:!0});this.finish(t,{grade:r,cringe:!1})}else if(n.type==="mash"){let r=this.targetAt(n);if(e.kind==="dir")(e.dir==="left"||e.dir==="right")&&e.dir!==t.lastDir&&(t.progress++,t.lastDir=e.dir);else if(e.down){let o=Dr(e.t-r,this.windowScale);if(t.progress===0)return this.finish(t,{grade:"miss",cringe:!1,mashCount:0,mashMult:0});this.finish(t,{grade:o==="miss"?"ok":o,cringe:!1,mashCount:t.progress,mashMult:xc(o)})}}else if(n.type==="hold"){if(e.kind!=="space")return;if(e.down&&!t.held){if(Dr(e.t-i,this.windowScale)==="miss")return this.finish(t,{grade:"miss",cringe:!1});t.held=!0}else!e.down&&t.held&&this.finish(t,{grade:Dr(e.t-this.targetAt(n),this.windowScale),cringe:!1})}else{if(e.kind!=="dir")return;if(e.dir!==n.dirs[t.progress])return this.finish(t,{grade:"miss",cringe:!0});t.progress++,t.progress===n.dirs.length&&this.finish(t,{grade:Dr(e.t-i,this.windowScale),cringe:!1})}}update(e){for(;;){let t=this.current();if(!t)return;let n=t.ev,i=this.targetAt(n)+this.ok;if(e<i)return;if(n.type==="mash"){if(e<this.targetAt(n)+.35)return;this.finish(t,{grade:t.progress===0?"miss":"ok",cringe:!1,mashCount:t.progress,mashMult:.5})}else this.finish(t,{grade:"miss",cringe:!1})}}};var U0={perfect:.006,great:.003,ok:0,miss:-.015},F0=.01,wb=12,wc=class{constructor(){B(this,"target",1);B(this,"rate",1)}nudge(e,t=!1){let n=t?U0.miss:U0[e];this.target=Math.min(1.15,Math.max(.9,this.target+n))}update(e){this.target>1?this.target=Math.max(1,this.target-F0*e):this.target<1&&(this.target=Math.min(1,this.target+F0*e)),this.rate+=(this.target-this.rate)*(1-Math.exp(-wb*e)),this.rate=Math.min(1.15,Math.max(.9,this.rate))}reset(){this.target=this.rate=1}};var Ab=[0,.003,.006,.009,.011],Rb=3,Cb=.03,Pb=.6,Ib=.05,B0={perfect:300,great:200,ok:100,miss:0},Ac=class{constructor(e,t,n,i,r=0){this.level=e;this.track=t;this.emit=i;this.tauntShift=r;B(this,"runner");B(this,"tempo",new wc);B(this,"meter",0);B(this,"score",0);B(this,"combo",0);B(this,"maxCombo",0);B(this,"bestBurst",0);B(this,"counts",{perfect:0,great:0,ok:0,miss:0,cringe:0});B(this,"spb");B(this,"ended",!1);B(this,"win",null);B(this,"gain");B(this,"lastBeat",-99);B(this,"tauntIdx",0);B(this,"dropIdx",0);B(this,"dropSoonIdx",0);B(this,"phase2Fired",!1);B(this,"lastKey",{});B(this,"mashStarted",-1);B(this,"holdStarted",-1);B(this,"songTime",-99);B(this,"showsAt",e=>this.runner.showsAt(e));B(this,"targetAt",e=>this.runner.targetAt(e));B(this,"prompts",[]);this.spb=60/e.bpm,this.runner=new Ec(e.events,this.spb,n,o=>this.onResult(o)),this.gain=1.15/Math.max(8,e.events.length)}input(e){if(this.ended)return;let t=e.kind==="dir"?e.dir:e.down?"space":"space-up",n=this.lastKey[t];if(n!==void 0&&e.t-n<Cb&&e.t>=n)return;this.lastKey[t]=e.t;let i=this.runner.current(),r=i?i.progress:0,o=i?i.held:!1;this.runner.input(e),!(!i||i.phase==="done")&&(i.ev.type==="mash"&&i.progress>r&&e.kind==="dir"&&this.emit({kind:"mashStep",count:Math.min(i.progress,this.mashCap(i.ev.length)),side:e.dir==="left"?"left":"right"}),i.ev.type==="hold"&&i.held&&!o&&this.emit({kind:"holdStart"}))}mashCap(e){return Rb*e}push(e){this.meter=Math.max(-1,Math.min(1,this.meter+e))}strongAt(e){let t=e+this.track.firstBeat;for(let n of this.track.onsets)if(Math.abs(n.t-t)<=Ib&&n.s>=Pb)return!0;return!1}onResult(e){let t=e.ev,n=this.runner.targetAt(t);if(t.type==="hold"&&e.grade!=="miss"&&this.emit({kind:"holdEnd",grade:e.grade}),e.cringe||e.grade==="miss"){this.combo=0,e.cringe?this.counts.cringe++:this.counts.miss++,this.push(-this.gain*(e.cringe?1.4:1.1)),this.tempo.nudge("miss",e.cringe),t.type==="hold"&&this.emit({kind:"holdEnd",grade:"miss"}),this.emit({kind:"judged",grade:"miss",cringe:e.cringe,qte:t.type,dir:t.type==="hit"?t.dir:void 0,combo:0,score:this.score,strong:!1,big:!1});return}this.combo++,this.maxCombo=Math.max(this.maxCombo,this.combo),this.counts[e.grade]++,this.tempo.nudge(e.grade);let i=vc(this.combo),r=1+(i-1)*.15;if(t.type==="mash"){let a=Math.min(e.mashCount??0,this.mashCap(t.length)),l=e.mashMult??xc(e.grade),c=Math.round(a*l);this.bestBurst=Math.max(this.bestBurst,c),this.score+=B0[e.grade]*i+c*30*i,this.push(Math.min(.4,c*.006+this.gain)*r),this.emit({kind:"release",burst:c,count:a,mult:l,grade:e.grade});return}let o=e.grade==="perfect"?1:e.grade==="great"?.75:.4;this.score+=B0[e.grade]*i,this.push(this.gain*o*r),this.emit({kind:"judged",grade:e.grade,cringe:!1,qte:t.type,dir:t.type==="hit"?t.dir:void 0,combo:this.combo,score:this.score,strong:e.grade==="perfect"&&this.strongAt(n),big:t.type==="combo"||t.type==="hold"})}energyAt(e){let t=this.track.energyPerBeat;return t.length?t[Math.max(0,Math.min(t.length-1,e))]:.7}update(e,t){if(this.songTime=e,this.tempo.update(t),this.ended)return;this.runner.update(e);let n=this.level,i=e/this.spb,r=Math.floor(i);r>this.lastBeat&&r>=0&&(this.lastBeat=r,this.emit({kind:"beat",beat:r,downbeat:r%4===0,energy:this.energyAt(r),bar:Math.floor(r/4)})),i>0&&i<n.lengthBeats&&this.push(-(t/this.spb)*Ab[Math.min(4,n.id-1)]);let o=n.taunts[this.tauntIdx];if(o&&i>=o.beat){let c=(this.tauntIdx+this.tauntShift)%n.taunts.length;this.emit({kind:"taunt",text:n.taunts[c].text,index:c}),this.tauntIdx++,this.push(-.05)}let a=n.dropBeats;for(;this.dropSoonIdx<a.length&&i>=a[this.dropSoonIdx]-1;)i<a[this.dropSoonIdx]&&this.emit({kind:"dropSoon",beat:a[this.dropSoonIdx]}),this.dropSoonIdx++;for(;this.dropIdx<a.length&&i>=a[this.dropIdx];)i<a[this.dropIdx]+1&&this.emit({kind:"drop",beat:a[this.dropIdx]}),this.dropIdx++;n.phase2Beat!==void 0&&!this.phase2Fired&&i>=n.phase2Beat&&(this.phase2Fired=!0,this.emit({kind:"phase2"}));let l=this.runner.current();l&&l.ev.type==="mash"&&e>=this.runner.opensAt(l.ev)&&this.mashStarted!==l.ev.beat&&(this.mashStarted=l.ev.beat,this.emit({kind:"mashStart",lengthBeats:l.ev.length})),(Math.abs(this.meter)>=1||i>=n.lengthBeats+1)&&this.finish()}finish(){this.ended=!0,this.win=this.meter>0,this.emit({kind:"end",win:this.win,ko:Math.abs(this.meter)>=1})}stats(){let e=this.counts,t=e.perfect+e.great+e.ok+e.miss+e.cringe||1,n=(e.perfect+e.great*.7+e.ok*.3)/t,i=!!this.win,r=i?n>=.9&&e.cringe===0?3:n>=.8?2:1:0;return{win:i,ko:Math.abs(this.meter)>=1,score:this.score,maxCombo:this.maxCombo,counts:{...e},accuracy:n,bestBurst:this.bestBurst,stars:r,meter:this.meter}}frame(){let e=this.songTime,t=e/this.spb,n=this.runner.current(),i=!!n&&n.ev.type==="mash"&&e>=this.runner.opensAt(n.ev)&&!this.ended,r=!!n&&n.ev.type==="hold"&&n.held,o=0;r&&n&&n.ev.type==="hold"&&(o=Math.max(0,Math.min(1,(e-n.ev.beat*this.spb)/(n.ev.length*this.spb))));let a;for(let c of this.level.dropBeats)if(c>t){a=c;break}let l=this.prompts;l.length=0;for(let c=0;c<this.runner.states.length;c++){let h=this.runner.states[c];if(h.phase!=="done"){if(this.runner.showsAt(h.ev)>e+2*this.spb)break;l.push(h)}}return{songTime:e,beatPos:t,beatPhase:t-Math.floor(t),spb:this.spb,meter:this.meter,combo:this.combo,tier:yc(this.combo),score:this.score,rate:this.tempo.rate,energy:this.energyAt(Math.floor(t)),beatsToDrop:a===void 0?1/0:a-t,mashing:i,mashCount:i&&n?Math.min(n.progress,this.mashCap(n.ev.length)):0,holding:r,holdProgress:o,phase2:this.phase2Fired,turn:"player",ending:this.ended,win:this.win,prompts:l,showsAt:this.showsAt,targetAt:this.targetAt,level:this.level}}};var Lb=4,Db=3,Nb=3.2,Ub=12e3,Rc=class{constructor(e){this.deps=e;B(this,"listeners",[]);B(this,"core",null);B(this,"clock",null);B(this,"src",null);B(this,"srcGain",null);B(this,"track",null);B(this,"buffers",new Map);B(this,"voices",null);B(this,"voiceBufs",new Map);B(this,"offset",0);B(this,"paused",!1);B(this,"pausePos",0);B(this,"endAt",-1);B(this,"done",null);B(this,"setRate",1);B(this,"pendingCount",[]);B(this,"attempts",new Map);B(this,"lastTurn","player");B(this,"emit",e=>{for(let t of this.listeners)t.event(e);this.react(e)})}listen(e){this.listeners.push(e)}buffer(e){let t=this.buffers.get(e);return t||(t=fetch(`${this.deps.base}music/${e}`).then(n=>n.ok?n.arrayBuffer():Promise.reject(n.status)).then(n=>ne.decodeAudioData(n)).catch(()=>(this.buffers.delete(e),null)),this.buffers.set(e,t)),t}preload(e){this.buffer(this.deps.trackInfo(e.track).file),this.loadVoices(e)}async loadVoices(e){if(!this.voices)try{let n=await fetch(`${this.deps.base}voice/v2/index.json`);this.voices=n.ok?await n.json():{}}catch{this.voices={}}let t=[`v2-l${e.id}-intro`,`v2-l${e.id}-win`,`v2-l${e.id}-lose`,...e.taunts.map((n,i)=>`v2-l${e.id}-taunt-${i}`)];await Promise.all(t.map(async n=>{let i=this.voices?.[n];if(!(!i||this.voiceBufs.has(n)))try{let r=await(await fetch(`${this.deps.base}voice/v2/${i}`)).arrayBuffer();this.voiceBufs.set(n,await ne.decodeAudioData(r))}catch{}}))}voice(e,t=ne.currentTime){let n=this.voiceBufs.get(e);if(!n)return;let i=ne.createBufferSource();i.buffer=n;let r=ne.createGain();r.gain.value=1.2,i.connect(r).connect(Gt),i.start(t)}async play(e,t){this.quit();let n=this.deps.trackInfo(e.track);this.track=n,this.offset=Ir(),this.loadVoices(e);let i=await Promise.race([this.buffer(n.file),new Promise(o=>setTimeout(()=>o(null),Ub))]),r=this.attempts.get(e.id)??0;return this.attempts.set(e.id,r+1),this.lastTurn="player",this.core=new Ac(e,n,t,this.emit,r),this.endAt=-1,this.paused=!1,this.startSource(i,0,Lb,.25),this.voice(`v2-l${e.id}-intro`),new Promise(o=>this.done=o)}startSource(e,t,n,i){let r=this.track,o=60/r.bpm,a=this.core?this.core.tempo.rate:1,l=ne.currentTime+i,c=t>0?t:r.firstBeat,h=l+n*o;this.clock=new Tc(h,c,a),this.setRate=a;for(let _=0;_<n;_++){let m=l+_*o;this.deps.countIn?this.deps.countIn(m,n-_):xt.tick(m,_===n-1)}if(this.pendingCount=Array.from({length:n},(_,m)=>({n:n-m,at:l+m*o})),!e)return;let u=ne.createBufferSource();u.buffer=e,u.playbackRate.value=a;let d=ne.createGain();u.connect(d).connect(this.deps.musicIn?this.deps.musicIn():Ti);let f=t>0?t:0,g=this.clock.timeOf(f);u.start(Math.max(ne.currentTime,g),f),this.src=u,this.srcGain=d}stopSource(e=0){let t=this.src,n=this.srcGain;if(this.src=null,this.srcGain=null,!t||!n)return;let i=ne.currentTime;if(e>0)n.gain.setValueAtTime(n.gain.value,i),n.gain.linearRampToValueAtTime(1e-4,i+e),t.stop(i+e+.02);else try{t.stop()}catch{}}songAt(e){return this.clock.pos(e-this.offset)-this.track.firstBeat}input(e){if(!this.core||!this.clock||this.paused||this.endAt>0)return;let t=this.songAt(e.at);e.kind==="dir"?this.core.input({kind:"dir",dir:e.dir,t}):this.core.input({kind:"space",down:e.down,t})}touchMode(){let e=this.core?.runner.current();return!e||!this.core?"none":this.core.songTime<this.core.runner.opensAt(e.ev)-.3?"hit":e.ev.type==="mash"?"mash":e.ev.type==="hold"?"hold":"hit"}turn(){return this.core?this.lastTurn:"player"}releasing(e=1.5){let t=this.core?.runner.current();return!t||!this.core||t.ev.type!=="mash"?!1:this.core.songTime>=this.core.runner.targetAt(t.ev)-e*this.core.runner.spb}running(){return!!this.core}pause(){!this.core||!this.clock||this.paused||this.endAt>0||(this.paused=!0,this.pendingCount=[],this.pausePos=this.clock.pos(ne.currentTime),this.stopSource())}resume(){!this.core||!this.paused||(this.paused=!1,this.buffer(this.track.file).then(e=>{this.core&&!this.paused&&this.startSource(e,this.pausePos,Db,.3)}))}quit(){this.stopSource(.15),this.deps.stopAll?.(),this.core=null,this.clock=null,this.done=null,this.pendingCount=[]}react(e){let t=this.core?.level;if(t){if(e.kind==="taunt")this.voice(`v2-l${t.id}-taunt-${e.index}`);else if(e.kind==="end"){this.endAt=ne.currentTime+Nb;let n=60/t.bpm*4;!e.win&&this.src&&this.src.playbackRate.setTargetAtTime(this.setRate*.5,ne.currentTime,n/3),this.stopSource(n),this.voice(`v2-l${t.id}-${e.win?"win":"lose"}`,ne.currentTime+.4)}}}tick(e){let t=this.core;if(!t||!this.clock||this.paused)return;let n=ne.currentTime,i=t.tempo.rate;this.src&&Math.abs(i-this.setRate)>5e-4&&this.endAt<0&&(this.clock.setRate(n,i),this.src.playbackRate.setValueAtTime(i,n),this.setRate=i);let r=Tn();for(;this.pendingCount.length&&this.pendingCount[0].at<=r;){let a=this.pendingCount.shift();this.emit({kind:"countIn",n:a.n,at:a.at})}t.update(this.songAt(r),e);let o=t.frame();this.lastTurn=o.turn;for(let a of this.listeners)a.frame?.(o,e);if(this.endAt>0&&n>=this.endAt&&this.done){let a=this.done,l=t.stats();this.core=null,this.clock=null,this.done=null,this.deps.stopAll?.(),a(l)}}};var O0=[{file:"title.mp3",role:"title screen loop",bpm_requested:100,bpm_measured:99.38,first_beat_s:.163,first_beat_method:"librosa.beat.beat_track first beat, snapped to the nearest onset_detect(backtrack=True) onset within 0.3s",duration_s:30,rms_db:-15.48,model:"lyria-3-clip-preview",confidence:"high",confidence_note:"free tracker, 100 BPM hinted tracker and autocorrelation estimate all agree exactly at 99.38 BPM",bpm_confidence:"high",beats_s:[.197,.801,1.393,1.997,2.589,3.193,3.796,4.4,4.992,5.596,6.2,6.803,7.396,7.999,8.603,9.195,9.799,10.403,10.995,11.598,12.19,12.794,13.398,14.002,14.617,15.209,15.801,16.405,16.997,17.601,18.193,18.797,19.389,19.992,20.596,21.2,21.792,22.396,22.999,23.603,24.195,24.799,25.391,25.995,26.598,27.202,27.794,28.398,28.979],downbeats_s:[.197,2.589,4.992,7.396,9.799,12.19,14.617,16.997,19.389,21.792,24.195,26.598,28.979],onsets_s:[[.418,.055],[1.01,.035],[1.37,.028],[1.614,.075],[1.962,.03],[4.226,.038],[4.377,.035],[5.19,.029],[5.735,.026],[5.968,.028],[6.397,.026],[6.606,.028],[6.769,.036],[7.082,.054],[7.198,.026],[7.535,.04],[7.616,.05],[8.406,.033],[8.789,.032],[9.009,.026],[9.601,.034],[9.776,.031],[9.927,.036],[10.205,.027],[10.971,.027],[11.192,.037],[11.575,.028],[11.993,.033],[13.201,.038],[13.595,.033],[13.804,.036],[14.28,.043],[14.396,.041],[16.196,.028],[16.533,.042],[16.684,.074],[16.962,.025],[17.194,.028],[17.438,.208],[17.821,.025],[17.879,.09],[18.889,.034],[19.017,.031],[19.075,.048],[19.83,.249],[20.108,.03],[20.283,.093],[21.002,.025],[21.037,.123],[21.316,.05],[21.478,.068],[22.001,.027],[22.686,.092],[23.394,.035],[23.429,.236],[23.673,.028],[23.812,.033],[23.882,.07],[24.59,.035],[24.636,.136],[24.903,.032],[25.078,.033],[25.379,.043],[25.612,.029],[25.797,.028],[25.832,.152],[26.076,.03],[26.273,.069],[26.564,.031],[26.807,.027],[26.993,.026],[27.04,.171],[27.481,.071],[28.235,.143],[28.479,.031],[28.607,.035],[28.677,.043],[29.385,.033],[29.431,.171],[29.884,.068]],energy_per_beat:[.89,.92,.96,.898,.879,.878,.941,.852,.85,.467,.95,.901,.904,.873,.951,.876,.881,.932,.947,.896,.91,.867,.975,.827,.258,.383,.968,.924,1,.937,.991,.905,.967,.976,.972,.912,.98,.952,.985,.911,.975,.953,.977,.928,.99,.957,.973,.894,.893],drops_s:[[7.396,.09],[9.799,.014],[16.997,.261],[24.195,.001]],breakdowns:[],eval:{passed:!0,score:5,attempts:2,checks:{energy_first_4s:{passed:!0,value:.494,threshold:.35},drop_before_12s:{passed:!0,value:7.396,threshold:12},no_long_silent_gap:{passed:!0,value:[],threshold_s:.5,threshold_energy:.05},bpm_within_8pct:{passed:!0,value:99.38,requested:100,ratio:.006},duration_within_20pct:{passed:!0,value:30,requested:30,ratio:0}}},regeneration_note:"regenerated once, attempt 1 removed the slow moody intro language so the groove hits from the first bar, eval passed 5 of 5",prompt:"Instrumental Brazilian funk montagem phonk track for a video game title screen. Tempo exactly 100 BPM. The full tamborzao drum pattern, a sidechained 808 bass slide and a cowbell hit immediately from the very first second, no slow intro, no gradual build, full energy from the first bar straight through, dark and confident aura farming edit feel, loopable thirty second clip. No lyrics, no vocals with words, instrumental only, no spoken words."},{file:"level1.mp3",role:"level 1, metro platform at 2am",bpm_requested:96,bpm_measured:99.38,first_beat_s:.046,first_beat_method:"librosa.beat.beat_track first beat, snapped to the nearest onset_detect(backtrack=True) onset within 0.3s",duration_s:40,rms_db:-19.71,model:"lyria-3.5",confidence:"high",confidence_note:"free tracker, 96 BPM hinted tracker and autocorrelation estimate all agree exactly at 99.38 BPM after two regenerations targeted at the tempo, within 3.5 percent of the request, resolves the earlier 126 BPM mismatch",bpm_confidence:"high",beats_s:[.07,.662,1.231,1.788,2.357,2.914,3.518,4.122,4.679,5.294,5.886,6.478,7.07,7.674,8.29,8.882,9.462,10.054,10.67,11.273,11.865,12.283,12.875,13.468,14.071,14.489,15.07,15.673,16.184,16.672,17.276,17.868,18.483,19.273,19.876,20.468,20.979,21.478,22.071,22.581,23.081,23.673,24.079,24.671,25.275,25.89,26.471,27.063,27.713,28.363,28.874,29.466,30.07,30.557,31.068,31.672,32.183,32.67,33.274,33.866,34.47,35.062,35.654,36.27,36.873,37.477,38.174],downbeats_s:[.07,2.357,4.679,7.07,9.462,11.865,14.071,16.184,18.483,20.979,23.081,25.275,27.713,30.07,32.183,34.47,36.873],onsets_s:[[6.444,.051],[8.046,.055],[8.197,.051],[11.25,.053],[11.552,.066],[11.656,.065],[11.842,.069],[12.04,.057],[12.249,.06],[12.841,.056],[13.804,.052],[15.441,.057],[15.824,.057],[17.833,.07],[18.808,.055],[18.855,.06],[19.052,.062],[19.841,.058],[21.409,.052],[21.85,.069],[22.256,.074],[23.034,.054],[24.253,.051],[24.648,.056],[25.054,.066],[25.635,.087],[26.598,.059],[27.249,.072],[27.829,.064],[28.038,.071],[28.34,.056],[28.63,.062],[29.443,.073],[30.047,.055],[31.242,.065],[31.858,.132],[32.055,.115],[32.647,.064],[34.226,.064],[34.447,.066],[34.749,.061],[35.248,.053],[35.84,.059],[37.129,.056],[37.849,.053],[38.15,.071],[38.452,.072]],energy_per_beat:[.103,.103,.083,.098,.086,.092,.095,.094,.094,.081,.113,.164,.141,.104,.098,.094,.097,.089,.141,.178,.26,.43,.895,.368,.247,.251,.829,.981,.617,.339,.464,1,.912,.885,.339,.232,.249,.867,.955,.622,.322,.276,.986,.922,.868,.728,.223,.121,.492,.728,.436,.128,.11,.111,.648,.762,.76,.454,.122,.22,.649,.638,.141,.177,.203,.271,.692],drops_s:[[11.865,.585],[14.071,.158],[18.483,.057],[36.873,.116]],breakdowns:[[.07,11.865]],eval:{passed:!1,score:4,attempts:3,checks:{energy_first_4s:{passed:!1,value:.052,threshold:.35},drop_before_12s:{passed:!0,value:11.865,threshold:12},no_long_silent_gap:{passed:!0,value:[],threshold_s:.5,threshold_energy:.05},bpm_within_8pct:{passed:!0,value:99.38,requested:96,ratio:.035},duration_within_20pct:{passed:!0,value:40,requested:40,ratio:0}}},regeneration_note:"regenerated twice, attempt 1 tightened only the tempo language and got worse (120 BPM, weaker start), attempt 2 tightened tempo plus an explicit loud from the first second instruction and landed at 99.38 BPM with the best score of the three, kept as final despite still failing the slow start check",prompt:"Instrumental Brazilian funk montagem phonk game level track for a metro platform at 2am, 96 BPM, a slow moving hip hop style tempo, not a fast dance tempo. The full tamborzao drum pattern and a heavy sidechained 808 bass slide hit immediately and loudly from the very first second, loudest section of the whole track is the first four seconds, no slow intro, no fade in, no build up, cowbell hits, distorted vocal chop textures with no intelligible words, dark and confident aura farming edit energy at full intensity throughout, forty seconds long. No lyrics, no vocals with words, instrumental only, no spoken words."},{file:"level2.mp3",role:"level 2, kebab shop at 4am",bpm_requested:104,bpm_measured:103.36,first_beat_s:.081,first_beat_method:"librosa.beat.beat_track first beat, snapped to the nearest onset_detect(backtrack=True) onset within 0.3s",duration_s:40,rms_db:-15.67,model:"lyria-3.5",confidence:"high",confidence_note:"free tracker, 104 BPM hinted tracker and autocorrelation estimate all agree exactly at 103.36 BPM",bpm_confidence:"high",beats_s:[.104,.685,1.265,1.834,2.392,2.844,3.286,3.855,4.423,5.004,5.584,6.165,6.734,7.314,7.895,8.464,9.044,9.625,10.194,10.762,11.204,11.645,12.225,12.794,13.375,13.944,14.524,15.105,15.673,16.254,16.834,17.415,17.995,18.564,19.145,19.714,20.294,20.875,21.455,22.024,22.616,23.162,23.742,24.323,24.903,25.484,26.053,26.633,27.214,27.794,28.375,28.955,29.524,30.105,30.685,31.254,31.835,32.403,32.984,33.564,34.133,34.714,35.294,35.863,36.444,37.024,37.605,38.185,38.754,39.323],downbeats_s:[.104,2.392,4.423,6.734,9.044,11.204,13.375,15.673,17.995,20.294,22.616,24.903,27.214,29.524,31.835,34.133,36.444,38.754],onsets_s:[[.522,.037],[.94,.042],[2.078,.036],[2.345,.042],[2.821,.045],[3.541,.043],[4.261,.038],[5.561,.038],[6.002,.038],[6.142,.046],[7.001,.034],[7.152,.053],[7.291,.035],[7.43,.042],[9.021,.04],[9.16,.035],[9.741,.04],[10.17,.042],[12.748,.04],[13.793,.039],[14.93,.046],[15.36,.043],[15.778,.046],[15.952,.038],[16.509,.035],[16.66,.038],[17.357,.036],[17.67,.049],[17.961,.039],[18.251,.039],[18.68,.035],[18.947,.041],[19.4,.037],[20.271,.046],[20.41,.035],[20.701,.042],[20.979,.037],[22.639,.044],[23.104,.043],[24.021,.038],[24.892,.05],[25.182,.043],[25.472,.037],[25.751,.038],[26.331,.034],[27.33,.055],[27.492,.037],[28.201,.036],[28.642,.046],[28.909,.034],[29.211,.059],[29.501,.055],[29.652,.045],[30.047,.051],[30.232,.067],[30.511,.037],[30.766,.045],[31.811,.046],[31.927,.033],[32.81,.04],[33.541,.036],[34.099,.044],[34.4,.036],[34.691,.054],[35.283,.059],[35.84,.043],[36.56,.041],[36.85,.053],[37.419,.039],[38.15,.036],[38.441,.051],[38.731,.05],[38.882,.057],[39.311,.066],[39.451,.039]],energy_per_beat:[.276,.212,.219,.477,.767,.729,.528,.682,.661,.691,.549,.712,.797,.701,.539,.461,.657,.675,.649,.719,.752,.798,.668,.511,.668,.781,.68,.506,.826,.804,.668,.48,.497,.784,.672,.578,.818,.529,.283,.562,.441,.859,.714,.51,.692,.839,.711,.52,.807,.813,.678,.488,.498,.563,.34,.816,1,.838,.687,.512,.688,.817,.701,.531,.832,.822,.676,.491,.505,.62],drops_s:[[2.392,.463],[22.616,.095],[24.903,.056],[31.835,.255]],breakdowns:[],eval:{passed:!1,score:4,attempts:3,checks:{energy_first_4s:{passed:!1,value:.319,threshold:.35},drop_before_12s:{passed:!0,value:2.392,threshold:12},no_long_silent_gap:{passed:!0,value:[],threshold_s:.5,threshold_energy:.05},bpm_within_8pct:{passed:!0,value:103.36,requested:104,ratio:.006},duration_within_20pct:{passed:!0,value:40,requested:40,ratio:0}}},regeneration_note:"regenerated twice, attempt 1 (starts on the drop language) improved the first four seconds energy from 0.234 to 0.319 and is kept, attempt 2 pushed the tempo off target (139.67 BPM) and scored worse",prompt:"Instrumental Brazilian funk montagem phonk game level track for a kebab shop at 4am. Tempo exactly 104 BPM. Starts on the drop, the full tamborzao drum pattern and heavy sidechained 808 bass slide hit immediately from the first bar, no slow intro, no build up, cowbell rolls, distorted vocal chop textures with no intelligible words, dark and confident aura farming edit energy at full intensity throughout, forty seconds long. No lyrics, no vocals with words, instrumental only, no spoken words."},{file:"level3.mp3",role:"level 3, rooftop",bpm_requested:112,bpm_measured:109.96,first_beat_s:.058,first_beat_method:"librosa.beat.beat_track first beat, snapped to the nearest onset_detect(backtrack=True) onset within 0.3s",duration_s:40,rms_db:-16.22,model:"lyria-3.5",confidence:"high",confidence_note:"free tracker, 112 BPM hinted tracker and autocorrelation estimate all agree exactly at 109.96 BPM",bpm_confidence:"high",beats_s:[.093,.639,1.184,1.73,2.276,2.821,3.367,3.913,4.458,5.004,5.55,6.084,6.641,7.187,7.721,8.266,8.812,9.369,9.903,10.449,10.995,11.54,12.086,12.632,13.177,13.723,14.269,14.814,15.36,15.906,16.451,16.997,17.543,18.088,18.634,19.18,19.725,20.271,20.817,21.362,21.908,22.454,22.999,23.545,24.091,24.636,25.182,25.728,26.273,26.819,27.365,27.91,28.456,29.002,29.547,30.093,30.639,31.184,31.73,32.276,32.821,33.367,33.901,34.447,34.992,35.55,36.084,36.629,37.175,37.721,38.266,38.812,39.358],downbeats_s:[.093,2.276,4.458,6.641,8.812,10.995,13.177,15.36,17.543,19.725,21.908,24.091,26.273,28.456,30.639,32.821,34.992,37.175,39.358],onsets_s:[[.441,.036],[1.277,.024],[1.695,.041],[1.985,.026],[2.531,.025],[2.647,.045],[3.042,.023],[3.344,.024],[3.599,.023],[3.889,.031],[4.168,.042],[4.818,.038],[5.224,.026],[5.666,.041],[6.351,.024],[6.618,.038],[7.024,.038],[7.407,.029],[7.941,.033],[8.243,.038],[9.067,.025],[9.207,.027],[9.601,.023],[10.019,.033],[10.844,.038],[10.948,.024],[10.983,.031],[11.389,.026],[13.549,.023],[14.396,.027],[15.209,.042],[15.348,.036],[16.161,.026],[16.567,.026],[17.659,.023],[17.798,.025],[17.926,.031],[18.739,.029],[19.435,.022],[19.702,.042],[20.085,.026],[20.933,.031],[21.618,.037],[22.291,.029],[23.104,.039],[23.51,.025],[23.8,.027],[24.067,.037],[24.439,.027],[24.892,.03],[25.298,.025],[25.704,.033],[25.983,.041],[26.622,.03],[26.796,.022],[27.341,.028],[28.7,.03],[28.816,.039],[29.513,.025],[30.058,.028],[30.348,.03],[31.161,.023],[31.707,.036],[31.846,.05],[31.962,.024],[32.253,.031],[32.531,.028],[32.81,.037],[33.205,.029],[33.576,.028],[34.157,.031],[34.424,.026],[34.888,.103],[35.248,.025],[35.364,.023],[36.188,.028],[37.164,.032],[37.976,.022],[39.729,.022]],energy_per_beat:[.574,.616,.417,.283,.303,.286,.353,.368,.601,.578,.392,.278,.303,.363,.314,.425,.992,.743,.73,.685,.936,.708,.917,.934,.949,.715,.71,.692,.722,.924,1,.835,.968,.728,.732,.697,.942,.71,.888,.941,.945,.712,.704,.68,.72,.922,.984,.788,.556,.606,.408,.275,.305,.283,.353,.36,.594,.574,.406,.281,.305,.359,.302,.441,.997,.74,.713,.674,.949,.713,.894,.93,.765],drops_s:[[4.458,.173],[8.812,.506],[30.639,.176],[34.992,.497]],breakdowns:[],eval:{passed:!1,score:4,attempts:3,checks:{energy_first_4s:{passed:!1,value:.25,threshold:.35},drop_before_12s:{passed:!0,value:4.458,threshold:12},no_long_silent_gap:{passed:!0,value:[],threshold_s:.5,threshold_energy:.05},bpm_within_8pct:{passed:!0,value:109.96,requested:112,ratio:.018},duration_within_20pct:{passed:!0,value:40,requested:40,ratio:0}}},regeneration_note:"regenerated twice, attempt 1 improved the first four seconds energy from 0.212 to 0.25 and is kept, attempt 2 over corrected and dropped it further to 0.15",prompt:"Instrumental Brazilian funk montagem phonk game level track for a rooftop at night. Tempo exactly 112 BPM. Starts on the drop, the full aggressive tamborzao drum pattern and wide sidechained 808 bass slide hit immediately from the first bar, no slow intro, no build up, cowbell, distorted vocal chop textures with no intelligible words, dark and confident aura farming edit energy at full intensity throughout, forty seconds long. No lyrics, no vocals with words, instrumental only, no spoken words."},{file:"level4.mp3",role:"level 4, club",bpm_requested:120,bpm_measured:129.2,first_beat_s:.058,first_beat_method:"librosa.beat.beat_track first beat, snapped to the nearest onset_detect(backtrack=True) onset within 0.3s",duration_s:40,rms_db:-16.81,model:"lyria-3.5",confidence:"high",confidence_note:"free tracker, 120 BPM hinted tracker and autocorrelation estimate all agree exactly at 129.2 BPM, an 8 BPM overshoot the eval gate still accepts within its 8 percent tolerance",bpm_confidence:"high",beats_s:[.093,.557,1.022,1.474,1.927,2.392,2.856,3.32,3.785,4.238,4.702,5.166,5.631,6.084,6.548,7.001,7.465,7.93,8.394,8.847,9.323,9.776,10.24,10.704,11.169,11.622,12.086,12.55,13.015,13.468,13.932,14.396,14.861,15.314,15.778,16.242,16.695,17.171,17.636,18.088,18.553,19.029,19.482,19.934,20.399,20.863,21.328,21.78,22.245,22.709,23.174,23.626,24.091,24.555,25.02,25.472,25.937,26.401,26.865,27.318,27.783,28.247,28.711,29.164,29.64,30.093,30.557,31.01,31.463,31.927,32.392,32.856,33.321,33.785,34.238,34.702,35.167,35.619,36.084,36.548,37.013,37.477,37.93,38.394,38.847,39.207],downbeats_s:[.093,1.927,3.785,5.631,7.465,9.323,11.169,13.015,14.861,16.695,18.553,20.399,22.245,24.091,25.937,27.783,29.64,31.463,33.321,35.167,37.013,38.847],onsets_s:[[.499,.031],[.743,.033],[.987,.038],[1.463,.056],[2.81,.025],[3.274,.025],[3.529,.025],[4.098,.029],[5.584,.023],[5.933,.023],[6.966,.025],[7.338,.025],[7.779,.046],[9.288,.03],[12.167,.024],[12.992,.024],[13.34,.025],[13.688,.028],[15.058,.028],[15.151,.023],[15.523,.029],[15.999,.022],[16.115,.035],[17.38,.031],[18.286,.024],[18.518,.028],[21.525,.024],[21.722,.029],[21.989,.029],[23.382,.028],[23.487,.025],[23.975,.022],[24.532,.027],[24.996,.027],[25.217,.023],[25.449,.029],[26.239,.024],[26.61,.029],[26.831,.024],[27.295,.026],[27.759,.032],[28.212,.023],[29.129,.032],[29.362,.028],[29.814,.027],[30.302,.041],[30.639,.028],[30.999,.042],[31.417,.044],[31.463,.139],[32.148,.028],[32.38,.023],[32.589,.028],[32.833,.028],[33.054,.035],[33.286,.024],[33.982,.027],[35.828,.031],[36.049,.025],[36.27,.041],[36.525,.033],[36.757,.035],[37.314,.039],[37.663,.026],[37.907,.023],[38.603,.025],[38.801,.024],[39.184,.031],[39.52,.025]],energy_per_beat:[.265,.288,.276,.295,.942,.736,.754,.716,.72,.764,.784,.701,.932,.745,.749,.747,.766,.787,.726,.45,.94,.749,.753,.731,.735,.765,.807,1,.929,.771,.741,.743,.748,.744,.819,.421,.868,.588,.511,.466,.388,.367,.459,.4,.865,.304,.286,.337,.338,.342,.429,.426,.905,.371,.34,.407,.391,.404,.471,.44,.896,.392,.374,.431,.323,.397,.496,.368,.955,.937,.948,.927,.926,.919,.955,.681,.943,.918,.953,.938,.933,.918,.944,.369,.995,.781],drops_s:[[1.927,.543],[24.091,.182],[27.783,.147],[31.463,.574]],breakdowns:[],eval:{passed:!1,score:4,attempts:3,checks:{energy_first_4s:{passed:!1,value:.281,threshold:.35},drop_before_12s:{passed:!0,value:1.927,threshold:12},no_long_silent_gap:{passed:!0,value:[],threshold_s:.5,threshold_energy:.05},bpm_within_8pct:{passed:!0,value:129.2,requested:120,ratio:.077},duration_within_20pct:{passed:!0,value:40,requested:40,ratio:0}}},regeneration_note:"regenerated twice, attempt 1 made the slow start worse (0.183), attempt 2 with an explicit loudest in the first four seconds instruction reached 0.281 and is kept, both keep the same 129.2 BPM overshoot which the 8 percent gate still accepts",prompt:"Instrumental Brazilian funk montagem phonk game level track for a nightclub. Tempo exactly 120 BPM. The loudest section of the whole track is the first four seconds, everything hits at full volume immediately at time zero, no fade in, no slow intro, no build up, dense club energy from the first instant, driving layered tamborzao groove, big sidechained 808 stabs and slides, cowbell rolls, distorted vocal chop textures with no intelligible words, dark and confident aura farming edit energy at full intensity throughout, forty seconds long. No lyrics, no vocals with words, instrumental only, no spoken words."},{file:"boss.mp3",role:"final boss, Voodoo stage",bpm_requested:128,bpm_measured:136,first_beat_s:.093,first_beat_method:"librosa.beat.beat_track first beat, snapped to the nearest onset_detect(backtrack=True) onset within 0.3s",duration_s:45,rms_db:-15.64,model:"lyria-3.5",confidence:"high",confidence_note:"free tracker, 128 BPM hinted tracker and autocorrelation estimate all agree exactly at 136.0 BPM",bpm_confidence:"high",beats_s:[.116,.569,.998,1.451,1.881,2.334,2.763,3.216,3.646,4.087,4.528,4.981,5.41,5.851,6.293,6.734,7.175,7.616,8.057,8.499,8.94,9.381,9.822,10.263,10.704,11.146,11.587,12.028,12.469,12.922,13.351,13.793,14.222,14.675,15.116,15.557,15.999,16.44,16.881,17.322,17.763,18.204,18.646,19.087,19.528,19.969,20.41,20.863,21.293,21.734,22.175,22.616,23.057,23.499,23.94,24.381,24.822,25.263,25.704,26.146,26.587,27.04,27.469,27.91,28.352,28.793,29.234,29.675,30.116,30.557,30.999,31.44,31.881,32.322,32.763,33.205,33.646,34.087,34.528,34.969,35.41,35.852,36.293,36.734,37.175,37.616,38.058,38.499,38.94,39.381,39.822,40.263,40.705,41.146,41.587,42.028,42.469,42.91,43.352,43.793,44.222,44.571],downbeats_s:[.116,1.881,3.646,5.41,7.175,8.94,10.704,12.469,14.222,15.999,17.763,19.528,21.293,23.057,24.822,26.587,28.352,30.116,31.881,33.646,35.41,37.175,38.94,40.705,42.469,44.222],onsets_s:[[.43,.022],[.975,.028],[1.312,.023],[1.614,.02],[1.858,.048],[2.194,.029],[2.74,.041],[2.961,.026],[3.077,.033],[3.39,.02],[4.261,.023],[4.47,.024],[4.841,.045],[5.132,.019],[5.387,.049],[5.724,.03],[6.269,.031],[6.571,.037],[6.606,.02],[6.92,.021],[7.117,.049],[7.593,.022],[8.022,.023],[8.475,.022],[8.591,.019],[8.707,.02],[8.893,.021],[9.091,.023],[9.369,.025],[9.567,.02],[9.81,.023],[10.019,.019],[10.646,.021],[11.029,.083],[11.122,.023],[11.784,.021],[12.446,.037],[13.305,.031],[13.758,.023],[14.187,.061],[14.501,.023],[15.093,.02],[15.685,.063],[15.975,.025],[16.277,.02],[16.602,.019],[16.858,.044],[17.067,.02],[17.194,.089],[17.531,.026],[17.74,.021],[18.622,.019],[19.215,.081],[19.505,.03],[20.05,.019],[20.724,.095],[20.979,.046],[21.258,.024],[21.931,.022],[22.152,.023],[22.489,.02],[23.034,.042],[23.15,.02],[23.917,.055],[24.114,.019],[24.799,.025],[26.564,.027],[28.317,.031],[28.63,.028],[29.211,.02],[30.093,.034],[30.743,.023],[31.173,.023],[31.312,.075],[31.637,.02],[31.858,.022],[32.16,.02],[33.924,.023],[35.364,.044],[36.943,.023],[37.129,.021],[37.814,.022],[38.325,.026],[38.905,.02],[39.799,.019],[40.02,.025],[40.681,.023],[41.03,.021],[41.25,.019],[42.446,.057],[42.736,.023],[43.085,.021],[43.328,.021],[43.886,.02],[43.979,.022],[44.211,.034],[44.547,.098]],energy_per_beat:[.627,.672,.605,.53,.474,.433,.373,.341,.287,.221,.238,.214,.287,.304,.277,.349,.7,.654,.697,.755,.863,.887,.748,.483,.561,.443,.359,.394,.816,.666,.919,.937,.985,.97,1,.972,.983,.944,.982,.968,.965,.955,.999,.978,.983,.962,.912,.421,.97,.945,.939,.969,.954,.903,.948,.922,.975,.972,.979,1,.64,.144,.204,.693,.956,.965,.959,.96,.955,.943,.959,.943,.975,.959,.973,.95,.944,.943,.898,.406,.992,.969,.977,.972,.98,.971,.972,.956,.975,.951,.971,.922,.293,.374,.364,.487,.957,.951,.97,.956,.995,.636],drops_s:[[7.175,.404],[12.469,.402],[28.352,.477],[42.469,.583]],breakdowns:[[3.646,7.175]],eval:{passed:!1,score:4,attempts:3,checks:{energy_first_4s:{passed:!1,value:.335,threshold:.35},drop_before_12s:{passed:!0,value:7.175,threshold:12},no_long_silent_gap:{passed:!0,value:[],threshold_s:.5,threshold_energy:.05},bpm_within_8pct:{passed:!0,value:136,requested:128,ratio:.062},duration_within_20pct:{passed:!0,value:45,requested:45,ratio:0}}},regeneration_note:"regenerated twice, attempt 1 raised the first four seconds energy from 0.203 to 0.335, nearly passing, and is kept, attempt 2 passed the energy check outright (0.408) but pushed the drop to 21.3s past the 12s window, a worse overall score",prompt:"Instrumental Brazilian funk montagem phonk boss battle track for the final boss on a Voodoo themed stage. Tempo exactly 128 BPM. Starts on the drop, maximum intensity immediately from the very first bar, no slow intro, no build up, intense tamborzao drum pattern, aggressive sidechained 808 bass slides, cowbell rolls, dark ritualistic percussion accents, distorted vocal chop textures with no intelligible words, dark and confident aura farming edit energy at maximum intensity throughout, forty five seconds long. No lyrics, no vocals with words, instrumental only, no spoken words."},{file:"boss2.mp3",role:"final boss, phase two",bpm_requested:128,bpm_measured:129.2,first_beat_s:.325,first_beat_method:"librosa.beat.beat_track first beat, snapped to the nearest onset_detect(backtrack=True) onset within 0.3s",duration_s:30,rms_db:-15.08,model:"lyria-3-clip-preview",confidence:"high",confidence_note:"free tracker, 128 BPM hinted tracker and autocorrelation estimate all agree exactly at 129.2 BPM",bpm_confidence:"high",beats_s:[.348,.813,1.277,1.753,2.218,2.694,3.158,3.634,4.098,4.563,5.039,5.503,5.979,6.444,6.92,7.384,7.86,8.324,8.8,9.265,9.741,10.205,10.681,11.146,11.622,12.086,12.562,13.026,13.502,13.967,14.431,14.907,15.372,15.836,16.312,16.776,17.252,17.717,18.181,18.646,19.122,19.586],downbeats_s:[.348,2.218,4.098,5.979,7.86,9.741,11.622,13.502,15.372,17.252,19.122],onsets_s:[[.093,.082],[4.075,.037],[4.957,.036],[5.375,.04],[5.724,.039],[5.956,.035],[8.905,.033],[9.95,.041],[10.194,.032],[10.658,.035],[10.902,.039],[11.018,.125],[11.598,.043],[12.539,.03],[12.783,.047],[13.479,.039],[13.711,.034],[13.944,.035],[15.116,.031],[15.813,.04],[16.045,.03],[16.985,.032],[17.218,.035],[17.461,.038],[18.146,.04],[18.866,.032],[19.075,.032],[19.574,.038],[19.807,.043],[20.271,.042],[20.399,.042],[20.747,.043],[20.979,.046],[21.188,.047],[21.444,.037],[22.814,.031],[23.29,.035],[23.533,.031],[23.777,.033],[24.021,.032],[24.149,.033],[24.265,.031],[24.497,.033],[24.729,.036],[24.95,.052],[25.194,.033],[25.67,.034],[25.89,.045],[26.134,.034],[26.366,.036],[26.575,.032],[26.831,.053],[27.063,.035],[27.516,.039],[28.015,.043]],energy_per_beat:[.757,.806,.79,.832,.805,.776,.851,.795,.747,.965,.824,.818,.759,.788,.832,.814,.728,.766,.782,.82,.825,.782,.837,.871,.726,1,.732,.786,.766,.783,.766,.805,.734,.726,.792,.762,.793,.743,.775,.852,.735,.719],drops_s:[[2.218,.012],[4.098,.042],[9.741,.064],[17.252,.046]],breakdowns:[],eval:{passed:!0,score:5,attempts:1,checks:{energy_first_4s:{passed:!0,value:.625,threshold:.35},drop_before_12s:{passed:!0,value:2.218,threshold:12},no_long_silent_gap:{passed:!0,value:[],threshold_s:.5,threshold_energy:.05},bpm_within_8pct:{passed:!0,value:129.2,requested:128,ratio:.009},duration_within_20pct:{passed:!0,value:30,requested:30,ratio:0}}},regeneration_note:"not regenerated, passed on the first generation",prompt:"Instrumental Brazilian funk montagem phonk boss battle phase two track, the same aura battle theme transposed one octave lower and darker than a normal phonk track. Tempo exactly 128 BPM. Tamborzao drum pattern, deep sidechained 808 bass slides pitched one octave lower, cowbell, heavily distorted growling low pitched vocal chop textures with no intelligible words, dark ominous confident energy, thirty seconds long. No lyrics, no vocals with words, instrumental only, no spoken words."},{file:"victory.mp3",role:"victory stinger",bpm_requested:128,bpm_measured:136,first_beat_s:.186,first_beat_method:"librosa.beat.beat_track first beat, snapped to the nearest onset_detect(backtrack=True) onset within 0.3s",duration_s:6,rms_db:-21.78,model:"lyria-3.5",confidence:"medium",confidence_note:"all three methods agree exactly at 136.0 BPM, but the clip is only 6 seconds, about 12 beats, too short for a statistically strong tempo read even with method agreement",bpm_confidence:"medium",beats_s:[.209,.662,1.103,1.544,1.985,2.438,2.879,3.32,3.762,4.214,4.656,5.097],downbeats_s:[.209,1.985,3.762],onsets_s:[[.615,.029],[1.219,.025],[1.382,.038],[1.533,.04],[1.707,.029],[3.065,.022],[3.274,.021],[3.75,.025],[5.085,.022],[5.283,.024],[5.526,.033],[5.863,.023]],energy_per_beat:[.197,.299,.395,.628,1,.922,.798,.717,.655,.495,.44,.48],drops_s:[[1.985,.526]],breakdowns:[],eval:{passed:!0,score:5,attempts:1,checks:{energy_first_4s:{passed:!0,value:.499,threshold:.35},drop_before_12s:{passed:!0,value:1.985,threshold:12},no_long_silent_gap:{passed:!0,value:[],threshold_s:.5,threshold_energy:.05},bpm_within_8pct:{passed:!0,value:136,requested:128,ratio:.062},duration_within_20pct:{passed:!0,value:6,requested:6,ratio:0}}},regeneration_note:"not regenerated, passed on the first generation",prompt:"Instrumental Brazilian funk montagem phonk victory stinger for a video game. Tempo 128 BPM. Opens immediately at the very first instant with one triumphant sidechained 808 hit, a bright cowbell and a fast tamborzao snare roll, confident and celebratory aura farming edit feel, very short musical stinger, six seconds long. No lyrics, no vocals with words, instrumental only, no spoken words."}];var k0={title:{manifest_bpm:99.38,bpm_refined:99.994,beats_s:[.163,.763,1.3631,1.9631,2.5631,3.1632,3.7632,4.3633,4.9633,5.5633,6.1634,6.7634,7.3634,7.9635,8.5635,9.1635,9.7636,10.3636,10.9636,11.5637,12.1637,12.7638,13.3638,13.9638,14.5639,15.1639,15.7639,16.364,16.964,17.564,18.1641,18.7641,19.3642,19.9642,20.5642,21.1643,21.7643,22.3643,22.9644,23.5644,24.1644,24.7645,25.3645,25.9645,26.5646,27.1646,27.7647,28.3647,28.9647,29.5648],downbeats_s:[.163,2.5631,4.9633,7.3634,9.7636,12.1637,14.5639,16.964,19.3642,21.7643,24.1644,26.5646,28.9647],onsets_s:[{t:.0697,s:1},{t:.209,s:1},{t:.4412,s:.498},{t:.6502,s:.62},{t:.8127,s:1},{t:1.0681,s:.301},{t:1.1146,s:.266},{t:1.2539,s:.233},{t:1.4164,s:.807},{t:1.6486,s:.502},{t:1.8576,s:.906},{t:1.9969,s:.567},{t:2.1827,s:.274},{t:2.322,s:.406},{t:2.4845,s:.432},{t:2.6006,s:.779},{t:2.8328,s:.339},{t:3.065,s:.957},{t:3.2044,s:1},{t:3.4598,s:.603},{t:3.5294,s:.417},{t:3.6688,s:.447},{t:3.8081,s:.998},{t:4.0403,s:.613},{t:4.2493,s:.653},{t:4.4118,s:1},{t:4.7137,s:.3},{t:4.8762,s:.48},{t:5.0155,s:.952},{t:5.2477,s:.366},{t:5.3174,s:.317},{t:5.4567,s:.34},{t:5.6192,s:.889},{t:5.7818,s:.246},{t:5.9211,s:.387},{t:6.1997,s:.3},{t:6.4551,s:.353},{t:6.6409,s:.695},{t:6.8034,s:.685},{t:7.0589,s:.359},{t:7.2446,s:.278},{t:7.4072,s:.785},{t:7.5697,s:.311},{t:7.6626,s:.488},{t:7.8483,s:.754},{t:8.0109,s:1},{t:8.2663,s:.712},{t:8.4521,s:.538},{t:8.6146,s:1},{t:8.8468,s:.485},{t:9.0326,s:.701},{t:9.1951,s:.39},{t:9.4737,s:.527},{t:9.6363,s:.321},{t:9.6827,s:.237},{t:9.7988,s:.641},{t:9.9614,s:.463},{t:10.0542,s:.529},{t:10.24,s:.782},{t:10.4025,s:.773},{t:10.658,s:.532},{t:10.8437,s:.405},{t:11.0063,s:1},{t:11.2385,s:.345},{t:11.4474,s:.775},{t:11.61,s:1},{t:11.8654,s:.452},{t:12.0512,s:.254},{t:12.2137,s:.899},{t:12.4459,s:.405},{t:12.6317,s:.46},{t:12.7942,s:.404},{t:13.0728,s:.728},{t:13.2354,s:.277},{t:13.3979,s:.517},{t:13.6533,s:.401},{t:13.8391,s:.714},{t:14.0016,s:.66},{t:14.2571,s:.349},{t:14.4428,s:.283},{t:14.6286,s:.427},{t:14.884,s:.436},{t:14.9537,s:.314},{t:15.0233,s:.504},{t:15.093,s:.382},{t:15.2323,s:.681},{t:15.5109,s:1},{t:15.6735,s:.489},{t:15.8128,s:1},{t:16.254,s:.475},{t:16.4165,s:.399},{t:16.7184,s:.646},{t:16.997,s:.552},{t:17.2524,s:.275},{t:17.4382,s:.441},{t:17.6239,s:.466},{t:17.8794,s:.423},{t:18.2044,s:.9},{t:18.4599,s:.321},{t:18.6456,s:.567},{t:18.8082,s:.405},{t:18.9707,s:.365},{t:19.11,s:.66},{t:19.3887,s:.365},{t:19.6441,s:.276},{t:19.8298,s:.536},{t:20.0156,s:.521},{t:20.271,s:.525},{t:20.3175,s:.705},{t:20.5961,s:.384},{t:20.8515,s:.255},{t:21.0373,s:.482},{t:21.223,s:.605},{t:21.3624,s:.382},{t:21.5017,s:.514},{t:21.8035,s:.997},{t:22.059,s:.348},{t:22.2447,s:.672},{t:22.4073,s:.385},{t:22.6627,s:.437},{t:22.7091,s:.857},{t:23.011,s:1},{t:23.2664,s:.335},{t:23.4289,s:.377},{t:23.6147,s:.635},{t:23.754,s:.377},{t:23.9166,s:.7},{t:24.1952,s:.68},{t:24.4506,s:.31},{t:24.6364,s:.548},{t:24.8221,s:.509},{t:25.1008,s:.648},{t:25.2633,s:.216},{t:25.4026,s:.495},{t:25.658,s:.297},{t:25.8438,s:.434},{t:26.0063,s:.32},{t:26.1689,s:.365},{t:26.3082,s:.701},{t:26.6101,s:1},{t:26.8655,s:.348},{t:27.0512,s:.558},{t:27.2138,s:.523},{t:27.4692,s:.521},{t:27.5156,s:.815},{t:27.7943,s:.405},{t:28.0497,s:.242},{t:28.2355,s:.451},{t:28.4212,s:.607},{t:28.5605,s:.439},{t:28.6999,s:.387},{t:29.0017,s:.913},{t:29.2571,s:.285},{t:29.4429,s:.482},{t:29.6054,s:.34},{t:29.8841,s:.346}],energy_per_beat:[.864,.938,.958,.905,.864,.869,.936,.858,.847,.433,.945,.912,.891,.867,.963,.874,.867,.959,.953,.904,.905,.861,.976,.873,.258,.264,.967,.93,1,.956,.993,.911,.964,.988,.979,.92,.98,.953,.984,.921,.972,.983,.98,.928,.983,.976,.971,.918,.983,.629],drops_s:[16.964],breakdowns:[],duration_s:30,drift:{ms_per_bar:.17,mean_abs_ms:51.4,tracker_bpm:99.38}},level1:{manifest_bpm:99.38,bpm_refined:99.984,beats_s:[.046,.6461,1.2462,1.8463,2.4464,3.0465,3.6466,4.2467,4.8468,5.4469,6.047,6.6471,7.2472,7.8472,8.4473,9.0474,9.6475,10.2476,10.8477,11.4478,12.0479,12.648,13.2481,13.8482,14.4483,15.0484,15.6485,16.2486,16.8487,17.4488,18.0489,18.649,19.2491,19.8492,20.4493,21.0494,21.6495,22.2496,22.8496,23.4497,24.0498,24.6499,25.25,25.8501,26.4502,27.0503,27.6504,28.2505,28.8506,29.4507,30.0508,30.6509,31.251,31.8511,32.4512,33.0513,33.6514,34.2515,34.8516,35.4517,36.0518,36.6519,37.252,37.852,38.4521,39.0522,39.6523],downbeats_s:[.046,2.4464,4.8468,7.2472,9.6475,12.0479,14.4483,16.8487,19.2491,21.6495,24.0498,26.4502,28.8506,31.251,33.6514,36.0518,38.4521],onsets_s:[{t:.0697,s:.855},{t:.6966,s:.294},{t:2.2756,s:.261},{t:3.901,s:.249},{t:5.5031,s:.483},{t:5.6889,s:.673},{t:5.8979,s:.275},{t:6.4784,s:.335},{t:6.6409,s:.238},{t:7.2911,s:.515},{t:7.4304,s:.231},{t:8.1038,s:.386},{t:11.2849,s:1},{t:11.4707,s:.583},{t:11.5635,s:.605},{t:11.7029,s:.404},{t:11.8886,s:1},{t:12.0744,s:.67},{t:12.2834,s:.862},{t:12.5852,s:.356},{t:12.7013,s:.467},{t:12.8871,s:.808},{t:13.4908,s:.959},{t:13.6998,s:.926},{t:14.0713,s:.431},{t:14.4893,s:.666},{t:14.884,s:.397},{t:15.093,s:.861},{t:15.2787,s:.808},{t:15.6735,s:.57},{t:15.8824,s:.25},{t:16.0914,s:.695},{t:16.5094,s:.431},{t:16.6719,s:.497},{t:16.9041,s:.363},{t:17.2756,s:1},{t:17.4846,s:.288},{t:17.6936,s:1},{t:17.8794,s:.448},{t:18.0883,s:1},{t:18.2741,s:.48},{t:18.4831,s:.577},{t:18.6921,s:.432},{t:18.8778,s:.56},{t:19.11,s:.322},{t:19.2958,s:.944},{t:19.4351,s:.256},{t:19.8763,s:.621},{t:20.0853,s:.557},{t:20.48,s:1},{t:20.898,s:.628},{t:21.2927,s:.28},{t:21.4785,s:.76},{t:21.6874,s:.653},{t:21.8964,s:.313},{t:22.0822,s:1},{t:22.2912,s:.256},{t:22.4769,s:.407},{t:22.8949,s:.328},{t:23.0806,s:.894},{t:23.3128,s:.351},{t:23.6844,s:1},{t:24.0791,s:.755},{t:24.2881,s:.386},{t:24.4971,s:.671},{t:24.6828,s:1},{t:24.8918,s:.677},{t:25.0776,s:.286},{t:25.2865,s:1},{t:25.4026,s:.321},{t:25.4955,s:.272},{t:25.6813,s:.39},{t:26.285,s:.548},{t:26.494,s:.417},{t:26.6333,s:.23},{t:26.8887,s:.401},{t:27.2834,s:.306},{t:27.8872,s:.646},{t:28.0729,s:.351},{t:28.3748,s:.394},{t:28.4909,s:.542},{t:28.6766,s:.546},{t:28.8856,s:.635},{t:29.4893,s:.779},{t:30.0931,s:.464},{t:30.2788,s:.259},{t:31.0915,s:1},{t:31.2773,s:.832},{t:31.4863,s:.681},{t:31.672,s:.359},{t:31.881,s:.618},{t:32.09,s:.459},{t:32.6937,s:.709},{t:33.2974,s:.422},{t:34.2727,s:.417},{t:34.4816,s:.56},{t:34.7835,s:.586},{t:34.8996,s:.596},{t:35.0854,s:.608},{t:35.2943,s:.468},{t:35.8748,s:.34},{t:36.5018,s:.368},{t:36.8733,s:.457},{t:37.1984,s:.683},{t:37.477,s:.686},{t:37.686,s:1},{t:37.895,s:.879},{t:38.1968,s:.701},{t:38.3129,s:.319},{t:38.4755,s:.343},{t:38.8934,s:.533},{t:39.2882,s:.372},{t:39.7061,s:.492}],energy_per_beat:[.098,.1,.083,.094,.084,.094,.086,.091,.089,.075,.15,.11,.125,.105,.094,.09,.09,.094,.116,.179,.279,.738,.438,.21,.212,.711,.885,.499,.222,.598,.836,.847,.785,.315,.205,.314,.792,.796,.388,.211,.908,.825,.824,.724,.215,.124,.343,.574,.295,.118,.108,.132,.557,.818,.581,.13,.11,.513,.6,.14,.14,.188,.208,.314,1,.398,.075],drops_s:[12.0479,21.6495,31.251],breakdowns:[],duration_s:40,drift:{ms_per_bar:12.95,mean_abs_ms:114.1,tracker_bpm:99.38}},level2:{manifest_bpm:103.36,bpm_refined:103.999,beats_s:[.081,.6579,1.2349,1.8118,2.3887,2.9656,3.5426,4.1195,4.6964,5.2734,5.8503,6.4272,7.0041,7.5811,8.158,8.7349,9.3119,9.8888,10.4657,11.0426,11.6196,12.1965,12.7734,13.3504,13.9273,14.5042,15.0811,15.6581,16.235,16.8119,17.3889,17.9658,18.5427,19.1196,19.6966,20.2735,20.8504,21.4274,22.0043,22.5812,23.1581,23.7351,24.312,24.8889,25.4659,26.0428,26.6197,27.1966,27.7736,28.3505,28.9274,29.5044,30.0813,30.6582,31.2351,31.8121,32.389,32.9659,33.5429,34.1198,34.6967,35.2736,35.8506,36.4275,37.0044,37.5814,38.1583,38.7352,39.3121,39.8891],downbeats_s:[.081,2.3887,4.6964,7.0041,9.3119,11.6196,13.9273,16.235,18.5427,20.8504,23.1581,25.4659,27.7736,30.0813,32.389,34.6967,37.0044,39.3121],onsets_s:[{t:.1161,s:1},{t:.418,s:.517},{t:.5805,s:.577},{t:.9752,s:.886},{t:1.2771,s:.862},{t:1.5557,s:.816},{t:1.8576,s:.989},{t:2.1362,s:.646},{t:2.4149,s:.992},{t:2.5774,s:.454},{t:2.8561,s:.712},{t:3.2972,s:.957},{t:3.5759,s:.543},{t:3.8545,s:1},{t:4.1564,s:.733},{t:4.3189,s:.466},{t:4.435,s:.624},{t:4.7369,s:1},{t:5.0387,s:.51},{t:5.1548,s:.714},{t:5.596,s:1},{t:6.0372,s:.506},{t:6.1765,s:.575},{t:6.4551,s:.597},{t:6.5945,s:.663},{t:6.757,s:.694},{t:6.8963,s:.435},{t:7.0356,s:.882},{t:7.1982,s:.435},{t:7.4768,s:.893},{t:7.8948,s:.654},{t:8.1966,s:.841},{t:8.4753,s:1},{t:8.7771,s:.658},{t:9.0558,s:1},{t:9.3576,s:.927},{t:9.497,s:.537},{t:9.7756,s:.926},{t:10.2168,s:1},{t:10.658,s:.57},{t:10.7973,s:.867},{t:11.0759,s:.705},{t:11.2152,s:.72},{t:11.3778,s:.729},{t:11.6564,s:1},{t:12.0976,s:.678},{t:12.2369,s:.655},{t:12.5156,s:.738},{t:12.8174,s:.854},{t:13.0961,s:1},{t:13.3979,s:.65},{t:13.5372,s:.784},{t:13.6766,s:.88},{t:13.9552,s:.6},{t:14.1177,s:.429},{t:14.3964,s:1},{t:14.5589,s:.528},{t:14.8143,s:.598},{t:14.9769,s:.433},{t:15.1162,s:.712},{t:15.418,s:.532},{t:15.5574,s:.458},{t:15.6967,s:.947},{t:15.836,s:.953},{t:15.9985,s:.562},{t:16.1146,s:.482},{t:16.2772,s:.975},{t:16.6951,s:.756},{t:16.8577,s:.787},{t:17.1363,s:.999},{t:17.4382,s:.847},{t:17.7168,s:1},{t:18.0187,s:.574},{t:18.158,s:.758},{t:18.2973,s:1},{t:18.576,s:.768},{t:18.7385,s:.491},{t:18.8778,s:.524},{t:19.0171,s:.964},{t:19.1565,s:.667},{t:19.4351,s:.894},{t:19.5976,s:.416},{t:19.737,s:.74},{t:20.0156,s:.689},{t:20.1781,s:.423},{t:20.3175,s:.705},{t:20.4568,s:.685},{t:20.5961,s:.545},{t:20.898,s:.692},{t:21.0373,s:.433},{t:22.0357,s:1},{t:22.7323,s:.576},{t:23.011,s:.748},{t:23.1735,s:.594},{t:24.0559,s:.544},{t:24.6364,s:.659},{t:24.915,s:.476},{t:25.2169,s:.718},{t:25.7974,s:.704},{t:26.5172,s:.591},{t:27.0977,s:.497},{t:27.237,s:.464},{t:27.3763,s:.487},{t:27.5389,s:.547},{t:27.6782,s:.474},{t:27.8175,s:.774},{t:28.2587,s:.452},{t:28.398,s:.495},{t:28.6766,s:1},{t:28.9785,s:.625},{t:29.2571,s:.835},{t:29.5358,s:.644},{t:29.8376,s:1},{t:30.1163,s:.762},{t:30.5575,s:.841},{t:30.8361,s:.601},{t:31.2773,s:1},{t:31.4166,s:.493},{t:31.5559,s:.579},{t:31.9971,s:.721},{t:32.1364,s:.732},{t:32.4151,s:.531},{t:32.8562,s:.557},{t:33.2974,s:.806},{t:33.8779,s:.606},{t:34.1566,s:.662},{t:34.2959,s:.571},{t:34.4352,s:.482},{t:34.7371,s:.627},{t:35.0157,s:.467},{t:35.155,s:.562},{t:35.3176,s:.543},{t:35.5962,s:.547},{t:36.5946,s:.508},{t:36.7572,s:.669},{t:37.0358,s:.68},{t:37.477,s:.57},{t:37.6163,s:.44},{t:37.895,s:.704},{t:38.1968,s:.677},{t:38.4755,s:.592},{t:38.7773,s:.564},{t:38.9166,s:.558},{t:39.056,s:.67},{t:39.3346,s:.498},{t:39.4971,s:.48},{t:39.7758,s:.938}],energy_per_beat:[.267,.204,.214,.41,.781,.62,.401,.627,.751,.61,.414,.782,.765,.619,.404,.417,.749,.632,.521,.771,.781,.638,.447,.655,.754,.655,.482,.794,.777,.649,.453,.471,.761,.641,.566,.783,.437,.153,.449,.342,.831,.693,.473,.662,.807,.698,.494,.784,.787,.678,.462,.462,.505,.29,.786,1,.822,.668,.489,.656,.786,.678,.493,.805,.802,.656,.475,.508,.629,.118],drops_s:[4.6964,23.1581],breakdowns:[[20.8504,23.1581]],duration_s:40,drift:{ms_per_bar:15.92,mean_abs_ms:99.2,tracker_bpm:103.36}},level3:{manifest_bpm:109.96,bpm_refined:109.996,beats_s:[.058,.6035,1.1489,1.6944,2.2399,2.7854,3.3308,3.8763,4.4218,4.9673,5.5127,6.0582,6.6037,7.1492,7.6946,8.2401,8.7856,9.3311,9.8765,10.422,10.9675,11.513,12.0584,12.6039,13.1494,13.6949,14.2403,14.7858,15.3313,15.8768,16.4222,16.9677,17.5132,18.0587,18.6041,19.1496,19.6951,20.2406,20.786,21.3315,21.877,22.4224,22.9679,23.5134,24.0589,24.6043,25.1498,25.6953,26.2408,26.7862,27.3317,27.8772,28.4227,28.9681,29.5136,30.0591,30.6046,31.15,31.6955,32.241,32.7865,33.3319,33.8774,34.4229,34.9684,35.5138,36.0593,36.6048,37.1503,37.6957,38.2412,38.7867,39.3322,39.8776],downbeats_s:[.058,2.2399,4.4218,6.6037,8.7856,10.9675,13.1494,15.3313,17.5132,19.6951,21.877,24.0589,26.2408,28.4227,30.6046,32.7865,34.9684,37.1503,39.3322],onsets_s:[{t:.0929,s:1},{t:.5108,s:.479},{t:.6502,s:.577},{t:.9056,s:.548},{t:1.2074,s:.601},{t:1.3235,s:.234},{t:1.4629,s:.492},{t:1.7415,s:1},{t:2.0201,s:.339},{t:2.2988,s:.272},{t:2.5774,s:.311},{t:2.6935,s:.594},{t:2.8328,s:.548},{t:3.0883,s:.802},{t:3.3669,s:.438},{t:3.5294,s:.271},{t:3.6455,s:.218},{t:3.9242,s:1},{t:4.2028,s:.221},{t:4.4582,s:.499},{t:4.8762,s:.399},{t:5.0155,s:.274},{t:5.2709,s:.575},{t:5.5728,s:.396},{t:5.6889,s:.244},{t:5.8282,s:.458},{t:6.1068,s:.874},{t:6.3855,s:.234},{t:6.6641,s:.278},{t:7.0589,s:.326},{t:7.1982,s:.394},{t:7.4768,s:.304},{t:8.0341,s:.211},{t:8.2895,s:.489},{t:8.5449,s:.664},{t:8.8236,s:1},{t:8.9861,s:.184},{t:9.1254,s:.194},{t:9.2415,s:.715},{t:9.3809,s:.469},{t:9.6363,s:.594},{t:9.9149,s:.61},{t:10.0542,s:.468},{t:10.1936,s:1},{t:10.449,s:.987},{t:10.7508,s:.667},{t:10.8902,s:.393},{t:11.0063,s:.331},{t:11.3081,s:.279},{t:11.4242,s:.742},{t:11.5635,s:.413},{t:11.819,s:1},{t:12.0976,s:1},{t:12.2369,s:.443},{t:12.3762,s:.98},{t:12.5388,s:.22},{t:12.6317,s:.332},{t:12.9335,s:.519},{t:13.0728,s:.227},{t:13.1889,s:.628},{t:13.3515,s:.283},{t:13.4676,s:.305},{t:13.6069,s:.767},{t:13.7462,s:.428},{t:14.0016,s:1},{t:14.2803,s:.77},{t:14.4196,s:.539},{t:14.5589,s:1},{t:14.8143,s:1},{t:15.093,s:.361},{t:15.2555,s:.404},{t:15.3716,s:.322},{t:15.6502,s:.365},{t:15.7896,s:1},{t:15.9289,s:.54},{t:16.1843,s:.757},{t:16.4629,s:.989},{t:16.6255,s:.228},{t:16.7416,s:.885},{t:16.997,s:.499},{t:17.2756,s:.857},{t:17.5543,s:1},{t:17.7168,s:.215},{t:17.8329,s:.242},{t:17.9722,s:.654},{t:18.1116,s:.528},{t:18.367,s:.44},{t:18.6456,s:.715},{t:18.7849,s:.237},{t:18.9243,s:.8},{t:19.1797,s:.774},{t:19.4815,s:.368},{t:19.6209,s:.211},{t:19.737,s:.401},{t:20.0388,s:.244},{t:20.1549,s:.588},{t:20.2942,s:.418},{t:20.5497,s:.654},{t:20.8283,s:.946},{t:20.9676,s:.265},{t:21.1069,s:.772},{t:21.2463,s:.193},{t:21.3624,s:.45},{t:21.6642,s:.355},{t:21.8035,s:.186},{t:21.9196,s:.66},{t:22.0822,s:.205},{t:22.1983,s:.262},{t:22.3376,s:.639},{t:22.4769,s:.485},{t:22.7323,s:.58},{t:23.011,s:.793},{t:23.1503,s:.247},{t:23.2896,s:.767},{t:23.545,s:.991},{t:23.8469,s:.353},{t:23.9862,s:.237},{t:24.1023,s:.413},{t:24.4042,s:.229},{t:24.5203,s:.681},{t:24.6596,s:.47},{t:24.915,s:.49},{t:25.1937,s:.621},{t:25.333,s:.229},{t:25.4723,s:.644},{t:25.7277,s:.453},{t:26.0063,s:.303},{t:26.285,s:.291},{t:26.6797,s:.365},{t:26.8423,s:.619},{t:27.0977,s:.652},{t:27.3763,s:.559},{t:27.5156,s:.469},{t:27.655,s:.526},{t:27.9104,s:.842},{t:28.2122,s:.339},{t:28.4909,s:.257},{t:28.7463,s:.306},{t:28.8624,s:.481},{t:29.0249,s:.586},{t:29.2571,s:.367},{t:29.559,s:.873},{t:29.6983,s:.252},{t:29.8376,s:.368},{t:30.0931,s:.782},{t:30.3949,s:.234},{t:30.6503,s:1},{t:31.0451,s:.238},{t:31.2076,s:.342},{t:31.463,s:.683},{t:31.7417,s:.333},{t:31.881,s:.354},{t:32.0203,s:.534},{t:32.2757,s:.634},{t:32.5776,s:.243},{t:32.8562,s:.24},{t:33.251,s:.376},{t:33.3903,s:.424},{t:33.6457,s:.28},{t:33.9244,s:.221},{t:34.203,s:.296},{t:34.4584,s:.353},{t:34.6442,s:.35},{t:34.7371,s:1},{t:35.0157,s:1},{t:35.2943,s:.191},{t:35.4104,s:.443},{t:35.573,s:.512},{t:35.8284,s:.994},{t:36.107,s:.847},{t:36.2463,s:.662},{t:36.3624,s:.587},{t:36.6411,s:1},{t:36.9197,s:.616},{t:37.059,s:.288},{t:37.1984,s:.397},{t:37.477,s:.249},{t:37.5931,s:.399},{t:37.7556,s:.345},{t:38.0111,s:1},{t:38.2897,s:.938},{t:38.429,s:.614},{t:38.5451,s:.466},{t:38.7077,s:.258},{t:38.8238,s:.91},{t:39.1024,s:.423},{t:39.2649,s:.228},{t:39.381,s:.683},{t:39.5204,s:.267},{t:39.6597,s:.275},{t:39.7758,s:.503},{t:39.9383,s:.326}],energy_per_beat:[.586,.624,.406,.291,.293,.262,.333,.366,.616,.583,.394,.261,.306,.346,.306,.394,.972,.701,.59,.54,.921,.614,.873,.924,.946,.615,.551,.541,.595,.916,1,.806,.963,.669,.608,.571,.93,.61,.85,.936,.942,.618,.565,.568,.6,.917,.99,.787,.572,.612,.396,.279,.291,.263,.333,.362,.609,.586,.387,.273,.305,.343,.3,.399,.98,.678,.591,.522,.935,.601,.857,.92,.802,.222],drops_s:[8.7856,34.9684],breakdowns:[[5.5127,8.7856],[27.3317,30.6046],[31.6955,34.9684]],duration_s:40,drift:{ms_per_bar:.03,mean_abs_ms:49.2,tracker_bpm:109.96}},level4:{manifest_bpm:129.2,bpm_refined:130.014,beats_s:[.058,.5195,.981,1.4425,1.904,2.3654,2.8269,3.2884,3.7499,4.2114,4.6729,5.1344,5.5959,6.0574,6.5188,6.9803,7.4418,7.9033,8.3648,8.8263,9.2878,9.7493,10.2108,10.6722,11.1337,11.5952,12.0567,12.5182,12.9797,13.4412,13.9027,14.3642,14.8256,15.2871,15.7486,16.2101,16.6716,17.1331,17.5946,18.0561,18.5176,18.979,19.4405,19.902,20.3635,20.825,21.2865,21.748,22.2095,22.6709,23.1324,23.5939,24.0554,24.5169,24.9784,25.4399,25.9014,26.3629,26.8243,27.2858,27.7473,28.2088,28.6703,29.1318,29.5933,30.0548,30.5163,30.9777,31.4392,31.9007,32.3622,32.8237,33.2852,33.7467,34.2082,34.6697,35.1311,35.5926,36.0541,36.5156,36.9771,37.4386,37.9001,38.3616,38.8231,39.2845,39.746],downbeats_s:[.058,1.904,3.7499,5.5959,7.4418,9.2878,11.1337,12.9797,14.8256,16.6716,18.5176,20.3635,22.2095,24.0554,25.9014,27.7473,29.5933,31.4392,33.2852,35.1311,36.9771,38.8231],onsets_s:[{t:.0929,s:1},{t:.3483,s:.236},{t:.5573,s:1},{t:.7895,s:.344},{t:1.0217,s:.571},{t:1.4861,s:.616},{t:1.9273,s:1},{t:2.2988,s:.59},{t:2.4149,s:.675},{t:2.6471,s:.956},{t:2.8561,s:.326},{t:3.1115,s:1},{t:3.3205,s:1},{t:3.5759,s:.854},{t:3.7849,s:.748},{t:4.0403,s:.413},{t:4.1332,s:.436},{t:4.2493,s:.642},{t:4.4815,s:.986},{t:4.7137,s:.675},{t:4.8298,s:.462},{t:4.9459,s:.783},{t:5.062,s:.309},{t:5.178,s:1},{t:5.6192,s:.473},{t:5.9675,s:.438},{t:6.1068,s:.708},{t:6.3158,s:.524},{t:6.548,s:.389},{t:6.7802,s:.895},{t:7.0124,s:1},{t:7.2678,s:.951},{t:7.3839,s:.476},{t:7.4768,s:.46},{t:7.7322,s:.516},{t:7.8251,s:.847},{t:7.9412,s:.632},{t:8.1734,s:1},{t:8.4056,s:1},{t:8.5217,s:.4},{t:8.661,s:.576},{t:8.7307,s:.408},{t:8.87,s:1},{t:9.3344,s:.836},{t:9.6827,s:.547},{t:9.7988,s:.74},{t:10.031,s:.94},{t:10.2632,s:.571},{t:10.4954,s:1},{t:10.7044,s:1},{t:10.9366,s:.329},{t:11.1688,s:.403},{t:11.401,s:.288},{t:11.5403,s:.71},{t:11.6332,s:.504},{t:11.8654,s:.822},{t:12.0976,s:.399},{t:12.2137,s:.418},{t:12.3298,s:.58},{t:12.562,s:1},{t:12.7942,s:.453},{t:13.0264,s:.834},{t:13.3747,s:.526},{t:13.4908,s:.732},{t:13.723,s:.898},{t:13.9552,s:.418},{t:14.1874,s:.91},{t:14.3964,s:.732},{t:14.6518,s:.608},{t:14.8608,s:.351},{t:15.1162,s:.388},{t:15.2323,s:.588},{t:15.3252,s:.47},{t:15.5574,s:.464},{t:15.7896,s:.405},{t:15.9289,s:.256},{t:16.045,s:.501},{t:16.1611,s:.259},{t:16.254,s:.45},{t:16.6951,s:.338},{t:17.415,s:.569},{t:18.0883,s:.308},{t:18.3438,s:.386},{t:18.576,s:.463},{t:19.2493,s:.445},{t:19.5048,s:.446},{t:19.5976,s:.309},{t:19.737,s:.435},{t:19.8298,s:.322},{t:19.9459,s:.46},{t:20.4103,s:.595},{t:21.1069,s:.652},{t:21.5713,s:.322},{t:21.7803,s:.286},{t:22.0357,s:.511},{t:22.2679,s:.553},{t:22.9413,s:.44},{t:23.1967,s:.444},{t:23.2896,s:.274},{t:23.4289,s:.481},{t:23.5218,s:.286},{t:23.6379,s:.557},{t:24.1023,s:.538},{t:24.5667,s:.321},{t:24.7989,s:.409},{t:25.0311,s:.238},{t:25.2633,s:.301},{t:25.4955,s:.6},{t:25.7277,s:.331},{t:25.9599,s:.462},{t:26.3082,s:.384},{t:26.6565,s:.355},{t:26.8887,s:.427},{t:27.1209,s:.414},{t:27.3299,s:.484},{t:27.7943,s:.599},{t:28.2587,s:.305},{t:28.4909,s:.47},{t:28.9553,s:.415},{t:29.1875,s:.444},{t:29.4197,s:.327},{t:29.8841,s:.379},{t:30.0698,s:.271},{t:30.3485,s:.306},{t:30.5575,s:.347},{t:30.6736,s:.293},{t:30.8129,s:.427},{t:31.463,s:.551},{t:31.8346,s:.416},{t:31.9507,s:.668},{t:32.1829,s:.833},{t:32.4151,s:.283},{t:32.624,s:.435},{t:32.8562,s:.381},{t:33.1117,s:.574},{t:33.3206,s:.35},{t:33.6689,s:.456},{t:33.8083,s:.406},{t:34.0172,s:.289},{t:34.2494,s:.425},{t:34.3888,s:.355},{t:34.4816,s:.546},{t:34.7138,s:.733},{t:35.1782,s:1},{t:35.3176,s:.188},{t:35.5265,s:.82},{t:35.6426,s:.715},{t:35.8516,s:.304},{t:36.107,s:.303},{t:36.316,s:.874},{t:36.5482,s:.692},{t:36.8036,s:.572},{t:36.9197,s:.286},{t:37.0358,s:.516},{t:37.3609,s:.604},{t:37.5002,s:.42},{t:37.7092,s:.5},{t:37.9414,s:.628},{t:38.0807,s:.38},{t:38.1968,s:.472},{t:38.4058,s:.876},{t:38.6612,s:.305},{t:38.8702,s:.983},{t:39.2185,s:.442},{t:39.3346,s:.734},{t:39.5668,s:.614},{t:39.799,s:.302}],energy_per_beat:[.176,.247,.247,.128,.94,.634,.619,.615,.648,.678,.723,.499,.95,.638,.653,.685,.685,.725,.668,.258,.958,.678,.663,.668,.68,.711,.744,1,.946,.692,.656,.669,.698,.686,.798,.331,.877,.617,.52,.483,.4,.364,.454,.277,.914,.313,.248,.338,.338,.339,.425,.324,.955,.389,.325,.415,.391,.408,.469,.341,.945,.409,.356,.44,.327,.377,.505,.297,.961,.941,.953,.932,.924,.943,.956,.498,.963,.925,.956,.949,.935,.942,.949,.29,.957,.92,.377],drops_s:[3.7499,11.1337,31.4392],breakdowns:[[18.5176,20.3635],[20.825,24.0554],[24.5169,27.7473],[28.2088,30.5163]],duration_s:40,drift:{ms_per_bar:.1,mean_abs_ms:52.7,tracker_bpm:129.2}},boss:{manifest_bpm:136,bpm_refined:135.97,beats_s:[.093,.5343,.9755,1.4168,1.8581,2.2994,2.7406,3.1819,3.6232,4.0645,4.5057,4.947,5.3883,5.8296,6.2708,6.7121,7.1534,7.5947,8.0359,8.4772,8.9185,9.3598,9.801,10.2423,10.6836,11.1248,11.5661,12.0074,12.4487,12.8899,13.3312,13.7725,14.2138,14.655,15.0963,15.5376,15.9789,16.4201,16.8614,17.3027,17.744,18.1852,18.6265,19.0678,19.509,19.9503,20.3916,20.8329,21.2741,21.7154,22.1567,22.598,23.0392,23.4805,23.9218,24.3631,24.8043,25.2456,25.6869,26.1282,26.5694,27.0107,27.452,27.8933,28.3345,28.7758,29.2171,29.6583,30.0996,30.5409,30.9822,31.4234,31.8647,32.306,32.7473,33.1885,33.6298,34.0711,34.5124,34.9536,35.3949,35.8362,36.2775,36.7187,37.16,37.6013,38.0425,38.4838,38.9251,39.3664,39.8076,40.2489,40.6902,41.1315,41.5727,42.014,42.4553,42.8966,43.3378,43.7791,44.2204,44.6617],downbeats_s:[.093,1.8581,3.6232,5.3883,7.1534,8.9185,10.6836,12.4487,14.2138,15.9789,17.744,19.509,21.2741,23.0392,24.8043,26.5694,28.3345,30.0996,31.8647,33.6298,35.3949,37.16,38.9251,40.6902,42.4553,44.2204],onsets_s:[{t:.1161,s:1},{t:.7895,s:.506},{t:1.0217,s:.737},{t:1.3468,s:.446},{t:1.6718,s:.539},{t:1.8808,s:.463},{t:2.2291,s:.789},{t:2.3684,s:.377},{t:2.5542,s:1},{t:2.7632,s:.468},{t:3.1115,s:.801},{t:3.2276,s:.446},{t:3.4366,s:.643},{t:3.6688,s:.74},{t:3.9938,s:.478},{t:4.3189,s:.768},{t:4.5279,s:.494},{t:4.8762,s:.672},{t:5.2013,s:1},{t:5.4102,s:.477},{t:5.7585,s:.506},{t:6.0836,s:.818},{t:6.3158,s:.471},{t:6.4784,s:.486},{t:6.6177,s:.487},{t:6.757,s:.514},{t:6.966,s:1},{t:7.1982,s:.554},{t:7.5233,s:.393},{t:7.6394,s:.418},{t:7.8483,s:.648},{t:8.0805,s:1},{t:8.4056,s:.414},{t:8.5217,s:.502},{t:8.9397,s:.454},{t:9.1719,s:.612},{t:9.288,s:.481},{t:9.4041,s:.453},{t:9.6131,s:1},{t:9.8453,s:.55},{t:10.0542,s:.623},{t:10.2864,s:.511},{t:10.7276,s:.905},{t:11.0527,s:.554},{t:11.1688,s:.375},{t:11.2849,s:.554},{t:11.3778,s:.674},{t:11.61,s:.946},{t:11.9351,s:.667},{t:12.0512,s:.403},{t:12.1673,s:.407},{t:12.2834,s:.417},{t:12.4923,s:.54},{t:13.1425,s:.447},{t:13.3515,s:.487},{t:13.6069,s:.364},{t:13.8159,s:.468},{t:14.2338,s:1},{t:14.5821,s:.614},{t:14.6982,s:.404},{t:14.9072,s:1},{t:15.1394,s:.925},{t:15.4413,s:.493},{t:15.5806,s:.473},{t:15.7199,s:.531},{t:15.9985,s:.443},{t:16.1379,s:.47},{t:16.3236,s:.552},{t:16.4629,s:.512},{t:16.6719,s:1},{t:16.8809,s:.543},{t:17.2292,s:.695},{t:17.3453,s:.582},{t:17.7633,s:.431},{t:18.0883,s:.459},{t:18.2277,s:.4},{t:18.4366,s:1},{t:18.6688,s:.928},{t:18.9707,s:.639},{t:19.11,s:.534},{t:19.2261,s:.554},{t:19.528,s:.571},{t:19.6673,s:.541},{t:19.8531,s:.551},{t:19.9924,s:.496},{t:20.2014,s:1},{t:20.4103,s:.629},{t:20.7586,s:.703},{t:21.0141,s:.57},{t:21.2927,s:.673},{t:21.641,s:.538},{t:21.7571,s:.511},{t:21.9661,s:.845},{t:22.1751,s:.495},{t:22.5234,s:.66},{t:22.6395,s:.507},{t:22.8484,s:.779},{t:23.0574,s:.608},{t:23.1967,s:.467},{t:23.3128,s:.529},{t:23.4057,s:.824},{t:23.5218,s:.656},{t:23.7308,s:1},{t:23.9398,s:.675},{t:24.172,s:.501},{t:24.2881,s:.854},{t:24.4042,s:.591},{t:24.6132,s:.73},{t:24.8221,s:.574},{t:25.1704,s:.714},{t:25.2865,s:.388},{t:25.4026,s:.579},{t:25.4955,s:.742},{t:25.7277,s:.584},{t:25.8438,s:.677},{t:26.0528,s:.863},{t:26.1689,s:.43},{t:26.285,s:.491},{t:26.4011,s:.503},{t:26.6101,s:.43},{t:27.2602,s:.485},{t:27.7246,s:.382},{t:27.9336,s:.702},{t:28.1658,s:.568},{t:28.3748,s:.602},{t:28.6766,s:.477},{t:28.816,s:.613},{t:29.0249,s:.897},{t:29.2571,s:.844},{t:29.5822,s:.459},{t:29.6983,s:.584},{t:29.8376,s:.48},{t:30.1163,s:.462},{t:30.4414,s:.682},{t:30.5807,s:.834},{t:30.7897,s:1},{t:31.0219,s:.803},{t:31.2541,s:.522},{t:31.3469,s:.634},{t:31.463,s:.686},{t:31.5791,s:.428},{t:31.9042,s:.811},{t:32.2061,s:.489},{t:32.3454,s:.652},{t:32.5544,s:.912},{t:32.7866,s:.829},{t:33.0188,s:.52},{t:33.1117,s:.499},{t:33.2278,s:.659},{t:33.3671,s:.513},{t:33.4367,s:.452},{t:33.6457,s:.502},{t:33.9708,s:.721},{t:34.1101,s:.847},{t:34.3191,s:.575},{t:34.5513,s:.745},{t:34.7835,s:.468},{t:34.9925,s:.854},{t:35.155,s:.402},{t:35.4104,s:.478},{t:35.7355,s:.397},{t:35.8748,s:.568},{t:36.0838,s:.817},{t:36.316,s:.776},{t:36.6411,s:.559},{t:36.7572,s:.548},{t:36.9662,s:.489},{t:37.1751,s:.427},{t:37.5002,s:.593},{t:37.6395,s:.644},{t:37.8485,s:1},{t:38.0807,s:.518},{t:38.3129,s:.53},{t:38.4058,s:.653},{t:38.5219,s:.592},{t:38.638,s:.434},{t:38.9631,s:.812},{t:39.2649,s:.486},{t:39.4043,s:.584},{t:39.6132,s:.99},{t:39.8454,s:.741},{t:40.1705,s:.579},{t:40.2866,s:.478},{t:40.4259,s:.493},{t:40.4956,s:.561},{t:40.7278,s:.898},{t:41.0064,s:.535},{t:41.169,s:.717},{t:41.3083,s:.631},{t:41.4012,s:.691},{t:41.6102,s:.647},{t:41.7495,s:.469},{t:42.0513,s:.701},{t:42.1907,s:.479},{t:42.2835,s:.503},{t:42.4693,s:.44},{t:42.8176,s:.53},{t:42.9337,s:.454},{t:43.1427,s:.994},{t:43.3517,s:.656},{t:43.6767,s:.479},{t:43.8161,s:.606},{t:44.234,s:.518},{t:44.4662,s:.462},{t:44.5591,s:.508},{t:44.6984,s:.572},{t:44.9074,s:1}],energy_per_beat:[.627,.683,.622,.538,.488,.434,.385,.34,.297,.218,.241,.196,.292,.293,.28,.314,.703,.654,.695,.762,.867,.9,.731,.455,.568,.456,.365,.325,.784,.655,.906,.895,.985,.973,.993,.977,.978,.949,.979,.97,.964,.956,.999,.978,.983,.963,.928,.385,.966,.949,.942,.97,.955,.913,.944,.928,.975,.975,.981,1,.529,.137,.198,.587,.96,.96,.958,.961,.951,.941,.954,.95,.969,.964,.97,.949,.942,.937,.907,.36,.991,.97,.977,.972,.978,.973,.974,.964,.972,.955,.97,.928,.3,.372,.368,.456,.956,.949,.972,.968,.959,.489],drops_s:[7.1534,14.2138,30.0996],breakdowns:[[10.2423,12.4487],[26.5694,28.3346],[40.6902,42.4553]],duration_s:45,drift:{ms_per_bar:-.72,mean_abs_ms:41.7,tracker_bpm:136}},boss2:{manifest_bpm:129.2,bpm_refined:127.804,beats_s:[.325,.7945,1.2639,1.7334,2.2029,2.6723,3.1418,3.6113,4.0808,4.5502,5.0197,5.4892,5.9586,6.4281,6.8976,7.367,7.8365,8.306,8.7754,9.2449,9.7144,10.1838,10.6533,11.1228,11.5923,12.0617,12.5312,13.0007,13.4701,13.9396,14.4091,14.8785,15.348,15.8175,16.2869,16.7564,17.2259,17.6953,18.1648,18.6343,19.1038,19.5732,20.0427,20.5122,20.9816,21.4511,21.9206,22.39,22.8595,23.329,23.7984,24.2679,24.7374,25.2069,25.6763,26.1458,26.6153,27.0847,27.5542,28.0237,28.4931,28.9626,29.4321,29.9015],downbeats_s:[.325,2.2029,4.0808,5.9586,7.8365,9.7144,11.5923,13.4701,15.348,17.2259,19.1038,20.9816,22.8595,24.7374,26.6153,28.4931],onsets_s:[{t:.0697,s:.547},{t:.1161,s:1},{t:.3483,s:.526},{t:.5805,s:.602},{t:.8127,s:.425},{t:1.0681,s:.384},{t:1.3003,s:.993},{t:1.4164,s:.459},{t:1.5325,s:.512},{t:1.6486,s:.506},{t:1.7647,s:.464},{t:1.9969,s:1},{t:2.2291,s:.881},{t:2.4613,s:.963},{t:2.6935,s:.792},{t:2.9489,s:.296},{t:3.1579,s:.603},{t:3.5062,s:.354},{t:3.6455,s:.508},{t:3.7849,s:.384},{t:3.8777,s:.969},{t:4.1099,s:.979},{t:4.3421,s:1},{t:4.5743,s:.906},{t:4.8298,s:.185},{t:5.0387,s:.645},{t:5.4102,s:.87},{t:5.5263,s:.519},{t:5.7585,s:1},{t:5.9907,s:1},{t:6.2229,s:1},{t:6.4551,s:1},{t:6.9195,s:.915},{t:7.2678,s:.725},{t:7.4072,s:.553},{t:7.6161,s:.372},{t:7.8716,s:1},{t:8.1038,s:1},{t:8.336,s:1},{t:8.8004,s:1},{t:8.9397,s:.416},{t:9.0558,s:.467},{t:9.1719,s:.564},{t:9.288,s:.412},{t:9.5202,s:.995},{t:9.7524,s:.834},{t:9.9846,s:.766},{t:10.2168,s:.62},{t:10.6812,s:.543},{t:10.9366,s:.393},{t:11.0527,s:.528},{t:11.1688,s:.403},{t:11.3081,s:.401},{t:11.401,s:.648},{t:11.6332,s:.644},{t:11.7725,s:.464},{t:11.8654,s:.551},{t:12.0047,s:.404},{t:12.0976,s:.412},{t:12.2369,s:.399},{t:12.353,s:.396},{t:12.4691,s:.499},{t:12.5852,s:.509},{t:12.8174,s:.25},{t:12.9335,s:.341},{t:13.0496,s:.386},{t:13.2818,s:.538},{t:13.514,s:.527},{t:13.7462,s:.512},{t:13.9784,s:.604},{t:14.2106,s:.236},{t:14.4428,s:.437},{t:14.6982,s:.284},{t:14.8143,s:.412},{t:14.9304,s:.489},{t:15.1626,s:.485},{t:15.3716,s:.323},{t:15.627,s:.594},{t:15.8592,s:.709},{t:16.0914,s:.315},{t:16.3236,s:.343},{t:16.5558,s:.225},{t:16.6951,s:.272},{t:16.788,s:.3},{t:17.0202,s:.319},{t:17.2524,s:.316},{t:17.5078,s:.519},{t:17.7168,s:.292},{t:17.9722,s:.225},{t:18.2044,s:.487},{t:18.4366,s:.352},{t:18.5527,s:.387},{t:18.6688,s:.404},{t:18.901,s:.493},{t:19.1332,s:.52},{t:19.3654,s:.397},{t:19.5976,s:.518},{t:19.8531,s:.215},{t:20.0853,s:.512},{t:20.3175,s:.23},{t:20.4336,s:.316},{t:20.5497,s:.401},{t:20.7819,s:.532},{t:21.0141,s:.53},{t:21.2463,s:.52},{t:21.4785,s:.533},{t:21.7107,s:.258},{t:21.9429,s:.363},{t:22.1983,s:.28},{t:22.3144,s:.422},{t:22.4305,s:.448},{t:22.6627,s:.515},{t:22.8717,s:.229},{t:23.1271,s:.555},{t:23.3593,s:.674},{t:23.5915,s:.286},{t:23.8237,s:.302},{t:24.0791,s:.224},{t:24.1952,s:.243},{t:24.2881,s:.274},{t:24.5203,s:.302},{t:24.7525,s:.236},{t:25.0079,s:.462},{t:25.2401,s:.508},{t:25.7045,s:.39},{t:25.9367,s:.256},{t:26.0528,s:.447},{t:26.1689,s:.305},{t:26.4011,s:.556},{t:26.6333,s:.375},{t:26.8655,s:.502},{t:27.0977,s:.268},{t:27.5853,s:.335},{t:29.0017,s:.193},{t:29.9305,s:.179}],energy_per_beat:[.769,.796,.777,.843,.809,.77,.845,.803,.744,.931,.837,.816,.766,.781,.825,.813,.726,.752,.777,.827,.836,.767,.841,.871,.725,1,.737,.778,.763,.778,.739,.809,.738,.705,.791,.743,.801,.739,.763,.85,.725,.755,.762,.822,.78,.795,.751,.857,.753,.762,.814,.79,.724,.77,.765,.801,.74,.671,.76,.542,.481,.298,.136,.028],drops_s:[],breakdowns:[[28.0237,30.371]],duration_s:30,drift:{ms_per_bar:.67,mean_abs_ms:38.9,tracker_bpm:129.2}},victory:{manifest_bpm:136,bpm_refined:134.775,beats_s:[.186,.6312,1.0764,1.5216,1.9667,2.4119,2.8571,3.3023,3.7475,4.1927,4.6379,5.0831,5.5282,5.9734],downbeats_s:[.186,1.9667,3.7475,5.5282],onsets_s:[{t:.209,s:1},{t:.3947,s:.49},{t:.4644,s:.59},{t:.6734,s:1},{t:.9056,s:.422},{t:1.1146,s:.361},{t:1.2539,s:.492},{t:1.4164,s:.685},{t:1.5557,s:.483},{t:1.7879,s:.709},{t:2.3452,s:.309},{t:2.4613,s:.323},{t:2.6703,s:.362},{t:2.9025,s:.508},{t:3.1347,s:.366},{t:3.3437,s:.487},{t:3.5759,s:.38},{t:3.7849,s:.577},{t:4.0171,s:.342},{t:4.1099,s:.395},{t:4.226,s:.344},{t:4.4582,s:.63},{t:4.6672,s:.463},{t:4.8994,s:.516},{t:5.1084,s:.385},{t:5.3406,s:.815},{t:5.5728,s:.56},{t:5.8979,s:.442}],energy_per_beat:[.154,.296,.368,.594,1,.932,.802,.717,.663,.492,.435,.454,.474,.074],drops_s:[],breakdowns:[],duration_s:6,drift:{ms_per_bar:2.81,mean_abs_ms:47.4,tracker_bpm:136}}};var Ob=O0,kb=k0,z0=new Map;function H0(s){if(!s.onsets_s?.length)return;let e=s.onsets_s.map(n=>typeof n=="number"?{t:n,s:1}:Array.isArray(n)?{t:n[0],s:n[1]}:n),t=Math.max(...e.map(n=>n.s))||1;return t>1||t<.5?e.map(n=>({t:n.t,s:n.s/t})):e}function V0(s){return s.drops_s?.length?s.drops_s.map(e=>Array.isArray(e)?e[0]:e):void 0}function G0(s){return s.breakdowns?.map(e=>Array.isArray(e)?[e[0],e[1]]:[e.start_s,e.end_s])}function qo(s){let e=z0.get(s);if(e)return e;let t=`${s}.mp3`,n=Ob.find(_=>_.file===t);if(!n)throw new Error(`unknown track ${s}`);let i=kb[s],r=!!i&&i.manifest_bpm===n.bpm_measured&&i.bpm_refined!==void 0,o=r?i:{},a=r?o.bpm_refined:n.bpm_measured??120,l=n.first_beat_s??0,c=n.duration_s??40,h=60/a,u=Math.floor((c-l)/h)+1,d=Array.from({length:u},(_,m)=>l+m*h),f=o.energy_per_beat?.length?o.energy_per_beat:n.energy_per_beat,g={file:t,bpm:a,firstBeat:l,duration:c,beats:d,downbeats:d.filter((_,m)=>m%4===0),drops:V0(o)??V0(n)??[],breakdowns:G0(r?o:n)??[],energyPerBeat:f?.length?f:Array.from({length:u},()=>.7),onsets:H0(o)??H0(n)??[]};return z0.set(s,g),g}function Cc(s,e){return(e-s.firstBeat)*s.bpm/60}var W0={levels:[{id:1,model:"gemini-3.1-pro-preview",title:"Turnstile Sigma",place:"Chatelet, 2am",story:["Chatelet at 2am, face the ultimate gatekeeper."],opponent:{name:"THE TURNSTILE NINJA",handle:"@turnstile_ninja",persona:"Silent, cocky, hands in pockets, chin up. Never paid a metro ticket.",color:"#35e0ff"},taunts:["Wesh, you validated your ticket?","T'es cuit, your aura's gone.","Controllers literally fear my jumps.","Tickets are for NPCs, frerot.","C'est carre, I mog you.","Navigo? Never heard of it.","No pass, just sigma energy.","Gate hopping is main character."],announcer:{intro:"Lock in.",win:"Aura strictly secured.",lose:"You are totally cooked."},references:["aura farming","mog and NPC"],edited:"3 taunts swapped for the seed lines, persona completed by hand"},{id:2,title:"Corporate Synergy God",place:"Metro platform, 2am",story:["The 2am metro platform echoes with empty buzzwords.","Kevin adjusts his branded lanyard and challenges your vibe."],opponent:{name:"Kevin from Marketing",persona:"Overcaffeinated intern flexing negative aura and secondhand buzzwords.",color:"#39ff14"},taunts:["Frerot, your beat drop lacks pure synergy.","Let us circle back, you total NPC.","My rhythm roadmap has maximum rizz."],announcer:{intro:"Lanyard on, thinks he has main character energy.",win:"Massive W, you sent him back to HR.",lose:"Unbelievable L, outpaced by an unpaid intern."}},{id:3,title:"Sauce Boss",place:"Kebab shop, 4am",story:["Neon lights flicker over sizzling spit at 4am.","Mehdi Aura spins the tongs without blinking."],opponent:{name:"Mehdi Aura",persona:"Late night grillmaster with effortless main character energy.",color:"#ff5e36"},taunts:["T'es cuit, extra onions won't save you.","My spit spins faster than your delulu combo.","Too much sauce, your rhythm got ratioed."],announcer:{intro:"Midnight snack battle, clock in for pure aura.",win:"Massive W, you earned the chef's special.",lose:"You got chopped up by the grillmaster."}},{id:4,title:"Aura Saint",place:"Parvis de Notre-Dame, dawn",story:["Dawn breaks over Notre-Dame as supreme stillness approaches.","His motionless presence radiates impossible main character energy."],opponent:{name:"His Holiness",persona:"A serene presence exuding pure main character energy.",color:"#fff275"},taunts:["Receive this peaceful W for your soul.","May your inner rhythm find true peace, friend.","Breathe gently, your aura is completely restored."],announcer:{intro:"Dawn breaks, face the ultimate aura test!",win:"Massive W, you have been absolved.",lose:"Rest now, your rhythm was completely cooked."}},{id:5,title:"Algorithm Breaker",place:"The Voodoo stage",story:["The feed detects zero retention in your rhythm.","Survive the sudden patch note before you vanish."],opponent:{name:"The Algorithm",persona:"Cold corporate feed engine that has killed more than 2,000 prototypes this year.",color:"#00ff66"},taunts:["Phase two drops down, your frame rate collapses.","It is giving zero engagement, strictly unindexed.","Massive L on retention, terminating feed access."],announcer:{intro:"Final feed gatekeeper approaches, show main character energy.",win:"Infinite aura unlocked, you broke the entire feed!",lose:"Shadowbanned forever, total loss of user momentum."}}]};var X0=W0.levels,Ai=8;function Is(s){return s.type==="hit"?[s.beat,s.beat]:s.type==="combo"?[s.beat-s.dirs.length+1,s.beat]:[s.beat,s.beat+s.length]}function Hb(s,e){let t=s.firstBeat+e*60/s.bpm,n=12/s.bpm,i=0;for(let r of s.onsets)Math.abs(r.t-t)<=n&&r.s>i&&(i=r.s);return i}function K0(s,e,t){let n=i=>s.some(r=>i>=Is(r)[0]-1&&i<=Is(r)[1]);return e.map((i,r)=>{let o=t[r];for(let a=0;a<16&&n(o);a++)o=t[r]+(a%2?-(a+1)/2:a/2+1);return{beat:o,text:i}})}function Z0(s,e,t,n,i,r,o){let a=X0.find(c=>c.id===s)??X0[s-1],l=qo(e);return{info:l,c:a,level:{id:s,title:a.title,place:a.place,artKey:n,story:[a.story[0]??"",a.story[1]??""],opponent:{...a.opponent},announcer:{...a.announcer},bpm:l.bpm,windowScale:r,lengthBeats:o,seed:s*1009,track:e,stage:t,neon:i}}}var q0=[{type:"hit",beat:8,dir:"right"},{type:"hit",beat:12,dir:"up"},{type:"hit",beat:15,dir:"left"},{type:"hit",beat:19,dir:"down"},{type:"hit",beat:23,dir:"right"},{type:"combo",beat:28,dirs:["left","up","right"]},{type:"hit",beat:31,dir:"down"},{type:"hit",beat:36,dir:"up"},{type:"hold",beat:40,length:4},{type:"hit",beat:47,dir:"left"},{type:"combo",beat:52,dirs:["up","down","left","right"]},{type:"hold",beat:56,length:4},{type:"mash",beat:62,length:6},{type:"hit",beat:71,dir:"up"},{type:"combo",beat:76,dirs:["down","left","right"]},{type:"hit",beat:79,dir:"right"},{type:"hit",beat:82,dir:"up"}];function Vb(){let{c:s,level:e}=Z0(1,"level4","metro","metro",["#ffb347","#35e0ff"],1,86);return{...e,events:q0,taunts:K0(q0,s.taunts,[3,14,24,33,46,58,76,84]),dropBeats:[4,68],breakdownBeats:[[37,44],[45,52],[53,60],[61,68]]}}function Gb(s){let e=s>>>0;return()=>{e=e+1831565813>>>0;let t=e;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}}var Wb=["up","down","left","right"];function $0(s,e){return s.drops.map(t=>Math.round(Cc(s,t))).filter(t=>t>=Ai+4&&t<=e-4)}function J0(s,e){return s.breakdowns.map(([t,n])=>[Math.ceil(Cc(s,t)),Math.round(Cc(s,n))]).filter(([t,n])=>n-t>=2&&t>=Ai&&n<=e-4)}function Y0(s,e){let t=s.energyPerBeat,n=i=>[0,1,2,3].reduce((r,o)=>r+(t[i+o]??0),0)/4;return n(e)-n(e-4)}function Xb(s,e,t,n){let i=Gb(t),r=e-4,o=[],a=(_,m)=>o.every(p=>m<Is(p)[0]-1||_>Is(p)[1]+1),l=$0(s,e).sort((_,m)=>Y0(s,m)-Y0(s,_));l.length||l.push(Math.round(e/8)*4);for(let _ of l.slice(0,n.mashes)){let m=_-n.mashLen;m>=Ai&&a(m,_)&&o.push({type:"mash",beat:m,length:n.mashLen})}if(n.holdOnDrops)for(let _ of l){let m=_+3<=r?3:2;_+m<=r&&a(_,_+m)&&o.push({type:"hold",beat:_,length:m})}if(n.holdOnBreakdowns)for(let[_,m]of J0(s,e)){let p=Math.max(1,Math.min(4,m-_));a(_,_+p)&&o.push({type:"hold",beat:_,length:p})}o.sort((_,m)=>_.beat-m.beat);let c=[],h=Ai-2,u=null,d=()=>{let _=Wb.filter(m=>m!==u);return u=_[Math.floor(i()*_.length)],u},f=(_,m)=>{let p=-1,b=-1;for(let T=_;T<=m;T++){let x=Hb(s,T)+(s.energyPerBeat[T]??.5)*.2+i()*.05;x>b&&(b=x,p=T)}return p},g=_=>{for(;;){let m=n.phase2!==void 0&&h>=n.phase2,p=m?Math.max(1,n.gapMin-1):n.gapMin,b=m?Math.max(p,n.gapMax-1):n.gapMax,T=i();if(T<n.combo){let M=i()<.4?4:3,A=Math.max(h+p+M-1,Ai+M-1),v=f(A,Math.min(A+2,_));if(v>=0){c.push({type:"combo",beat:v,dirs:Array.from({length:M},d)}),h=v;continue}}let x=Math.max(h+p,Ai);if(x>_)return;let S=f(x,Math.min(h+b,_));if(S<0)return;if(T>1-n.hold&&S+2<=_){c.push({type:"hold",beat:S,length:2}),h=S+2;continue}c.push({type:"hit",beat:S,dir:d()}),h=S}};o.some(_=>Is(_)[0]<=Ai+1)||(c.push({type:"hit",beat:Ai,dir:d()}),h=Ai);for(let _ of o)g(Is(_)[0]-2),c.push(_),h=Is(_)[1]+1;return g(r),c}function qb(s){return Math.min(Math.floor((s.duration-s.firstBeat-.25)*s.bpm/60),Math.floor(50*s.bpm/60))}function Pc(s,e,t,n,i,r,o,a=!1){let l=qb(qo(e)),{info:c,c:h,level:u}=Z0(s,e,t,n,i,r,l),d=a?Math.round(l/8)*4:void 0,f=Xb(c,l,u.seed,{...o,phase2:d});return{...u,...d!==void 0?{phase2Beat:d}:{},events:f,taunts:K0(f,h.taunts,[Math.round(l*.2),Math.round(l*.5),Math.round(l*.8)]),dropBeats:$0(c,l),breakdownBeats:J0(c,l)}}var j0=[Vb(),Pc(2,"level1","metro","metro",["#39ff14","#00b3ff"],.95,{mashes:1,mashLen:4,holdOnDrops:!1,holdOnBreakdowns:!1,combo:0,hold:0,gapMin:2,gapMax:4}),Pc(3,"level2","kebab","kebab",["#ff9f1c","#ff3b30"],.9,{mashes:1,mashLen:5,holdOnDrops:!1,holdOnBreakdowns:!1,combo:.12,hold:0,gapMin:2,gapMax:4}),Pc(4,"level3","parvis","rooftop",["#ffe066","#8ecbff"],.85,{mashes:0,mashLen:4,holdOnDrops:!0,holdOnBreakdowns:!0,combo:.1,hold:.45,gapMin:2,gapMax:4}),Pc(5,"boss","stage","stage",["#ff007f","#00e5ff"],.75,{mashes:2,mashLen:5,holdOnDrops:!1,holdOnBreakdowns:!0,combo:.3,hold:.1,gapMin:2,gapMax:4},!0)];var Ju=new URLSearchParams(location.search),tm=Ju.has("debug"),ju=/\/v2\/?/.test(location.pathname)?"../":"",Lc=document.getElementById("stage");function Yb(){let s=document.createElement("div");throw s.className="no-webgl",s.innerHTML='<h1 class="logo">AURA</h1><p>This browser could not start 3D graphics (WebGL).</p><a href="../">PLAY THE 2D VERSION</a>',document.body.appendChild(s),new Error("WebGL unavailable")}var Nr;try{Nr=Up(Lc,{base:ju,debug:tm})}catch(s){console.error(s),Yb()}Lc.addEventListener("webglcontextlost",s=>{s.preventDefault(),document.querySelector(".no-webgl")||Kb()});function Kb(){let s=document.createElement("div");s.className="no-webgl soft",s.innerHTML='<p>3D graphics were interrupted.</p><a href="">RELOAD</a> <a href="../">2D VERSION</a>',document.body.appendChild(s),Lc.addEventListener("webglcontextrestored",()=>s.remove(),{once:!0})}addEventListener("resize",()=>Nr.resize());addEventListener("pointerdown",Rs);addEventListener("pointerup",Rs);addEventListener("keydown",Rs);document.addEventListener("visibilitychange",()=>{document.hidden||Rs()});var Ic=null,Q0=()=>Ic??(Ic=new mc),Ur=new Rc({base:ju,trackInfo:qo,musicIn:()=>Q0().musicIn,countIn:(s,e)=>Q0().countIn(s,e),stopAll:()=>Ic?.stopAll()});Ur.listen(Nr);Ur.listen({event:s=>Ic?.event(s),frame:(s,e)=>Ic?.frame(s,e)});if(Ju.has("demo"))Fp(Nr);else{let{hud:s}=D0({game:Ur,stage:Nr,levels:j0,base:ju,debug:tm,canvas:Lc});Ur.listen(s)}var em=performance.now();function nm(s){requestAnimationFrame(nm);let e=Math.min(.05,(s-em)/1e3);em=s,!Ju.has("demo")&&(Ur.running()&&ne?Ur.tick(e):Nr.idle(e))}requestAnimationFrame(nm);})();
/*! Bundled license information:

three/build/three.core.js:
three/build/three.module.js:
  (**
   * @license
   * Copyright 2010-2026 Three.js Authors
   * SPDX-License-Identifier: MIT
   *)
*/
