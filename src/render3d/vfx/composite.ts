// Final fullscreen blit of the low res target: chroma split, glitch slices, fake radial blur,
// vignette, desaturation, scanlines and a white or black flash in a single pass.
// The vertex shader ignores the camera: use it on a PlaneGeometry(2, 2) (any camera, frustumCulled off).
import * as THREE from "three";
import type { ScreenFx } from "./screen";

const vertex = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;

const fragment = /* glsl */ `
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
uniform float uScanline;
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
  col *= 1.0 - uScanline * (0.5 + 0.5 * sin(vUv.y * uRes.y * 3.14159265));
  col = mix(col, vec3(1.0 - uFlashBlack), uFlash);
  gl_FragColor = vec4(max(col, 0.0), 1.0);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
`;

export function createComposite(): {
  material: THREE.ShaderMaterial;
  apply(fx: ScreenFx, time: number, resolution: THREE.Vector2): void;
} {
  const material = new THREE.ShaderMaterial({
    uniforms: {
      tDiffuse: { value: null },
      uRes: { value: new THREE.Vector2(640, 360) },
      uTime: { value: 0 },
      uFlash: { value: 0 },
      uFlashBlack: { value: 0 },
      uChroma: { value: 0 },
      uGlitch: { value: 0 },
      uRadial: { value: 0 },
      uVignette: { value: 0.25 },
      uDesat: { value: 0 },
      uScanline: { value: 0.08 },
    },
    vertexShader: vertex,
    fragmentShader: fragment,
    depthTest: false,
    depthWrite: false,
  });
  const u = material.uniforms;
  return {
    material,
    apply(fx, time, resolution) {
      u.uRes.value.copy(resolution);
      u.uTime.value = time;
      u.uFlash.value = fx.flash;
      u.uFlashBlack.value = fx.flashBlack ? 1 : 0;
      u.uChroma.value = fx.chroma;
      u.uGlitch.value = fx.glitch;
      u.uRadial.value = fx.radial;
      u.uVignette.value = fx.vignette;
      u.uDesat.value = fx.desat;
      u.uScanline.value = fx.scanline;
    },
  };
}
