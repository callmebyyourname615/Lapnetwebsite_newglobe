<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import * as THREE from 'three'
import { Effect, EffectComposer, EffectPass, RenderPass } from 'postprocessing'

const props = defineProps({
  variant: { type: String, default: 'square' },
  pixelSize: { type: Number, default: 3 },
  color: { type: String, default: '#B497CF' },
  antialias: { type: Boolean, default: true },
  patternScale: { type: Number, default: 2 },
  patternDensity: { type: Number, default: 1 },
  liquid: { type: Boolean, default: false },
  liquidStrength: { type: Number, default: 0.1 },
  liquidRadius: { type: Number, default: 1 },
  pixelSizeJitter: { type: Number, default: 0 },
  enableRipples: { type: Boolean, default: true },
  rippleIntensityScale: { type: Number, default: 1 },
  rippleThickness: { type: Number, default: 0.1 },
  rippleSpeed: { type: Number, default: 0.3 },
  liquidWobbleSpeed: { type: Number, default: 4.5 },
  autoPauseOffscreen: { type: Boolean, default: true },
  speed: { type: Number, default: 0.5 },
  transparent: { type: Boolean, default: true },
  edgeFade: { type: Number, default: 0.5 },
  noiseAmount: { type: Number, default: 0 }
})

const containerRef = ref(null)
const SHAPE_MAP = { square: 0, circle: 1, triangle: 2, diamond: 3 }
const MAX_CLICKS = 10

const VERTEX_SRC = `
void main() {
  gl_Position = vec4(position, 1.0);
}
`

const FRAGMENT_SRC = `
precision highp float;

uniform vec3  uColor;
uniform vec2  uResolution;
uniform float uTime;
uniform float uPixelSize;
uniform float uScale;
uniform float uDensity;
uniform float uPixelJitter;
uniform int   uEnableRipples;
uniform float uRippleSpeed;
uniform float uRippleThickness;
uniform float uRippleIntensity;
uniform float uEdgeFade;

uniform int   uShapeType;
const int SHAPE_SQUARE   = 0;
const int SHAPE_CIRCLE   = 1;
const int SHAPE_TRIANGLE = 2;
const int SHAPE_DIAMOND  = 3;

const int   MAX_CLICKS = 10;

uniform vec2  uClickPos  [MAX_CLICKS];
uniform float uClickTimes[MAX_CLICKS];

out vec4 fragColor;

float Bayer2(vec2 a) {
  a = floor(a);
  return fract(a.x / 2. + a.y * a.y * .75);
}
#define Bayer4(a) (Bayer2(.5*(a))*0.25 + Bayer2(a))
#define Bayer8(a) (Bayer4(.5*(a))*0.25 + Bayer2(a))

#define FBM_OCTAVES     5
#define FBM_LACUNARITY  1.25
#define FBM_GAIN        1.0

float hash11(float n){ return fract(sin(n)*43758.5453); }

float vnoise(vec3 p){
  vec3 ip = floor(p);
  vec3 fp = fract(p);
  float n000 = hash11(dot(ip + vec3(0.0,0.0,0.0), vec3(1.0,57.0,113.0)));
  float n100 = hash11(dot(ip + vec3(1.0,0.0,0.0), vec3(1.0,57.0,113.0)));
  float n010 = hash11(dot(ip + vec3(0.0,1.0,0.0), vec3(1.0,57.0,113.0)));
  float n110 = hash11(dot(ip + vec3(1.0,1.0,0.0), vec3(1.0,57.0,113.0)));
  float n001 = hash11(dot(ip + vec3(0.0,0.0,1.0), vec3(1.0,57.0,113.0)));
  float n101 = hash11(dot(ip + vec3(1.0,0.0,1.0), vec3(1.0,57.0,113.0)));
  float n011 = hash11(dot(ip + vec3(0.0,1.0,1.0), vec3(1.0,57.0,113.0)));
  float n111 = hash11(dot(ip + vec3(1.0,1.0,1.0), vec3(1.0,57.0,113.0)));
  vec3 w = fp*fp*fp*(fp*(fp*6.0-15.0)+10.0);
  float x00 = mix(n000, n100, w.x);
  float x10 = mix(n010, n110, w.x);
  float x01 = mix(n001, n101, w.x);
  float x11 = mix(n011, n111, w.x);
  float y0  = mix(x00, x10, w.y);
  float y1  = mix(x01, x11, w.y);
  return mix(y0, y1, w.z) * 2.0 - 1.0;
}

float fbm2(vec2 uv, float t){
  vec3 p = vec3(uv * uScale, t);
  float amp = 1.0;
  float freq = 1.0;
  float sum = 1.0;
  for (int i = 0; i < FBM_OCTAVES; ++i){
    sum  += amp * vnoise(p * freq);
    freq *= FBM_LACUNARITY;
    amp  *= FBM_GAIN;
  }
  return sum * 0.5 + 0.5;
}

float maskCircle(vec2 p, float cov){
  float r = sqrt(cov) * .25;
  float d = length(p - 0.5) - r;
  float aa = 0.5 * fwidth(d);
  return cov * (1.0 - smoothstep(-aa, aa, d * 2.0));
}

float maskTriangle(vec2 p, vec2 id, float cov){
  bool flip = mod(id.x + id.y, 2.0) > 0.5;
  if (flip) p.x = 1.0 - p.x;
  float r = sqrt(cov);
  float d  = p.y - r*(1.0 - p.x);
  float aa = fwidth(d);
  return cov * clamp(0.5 - d/aa, 0.0, 1.0);
}

float maskDiamond(vec2 p, float cov){
  float r = sqrt(cov) * 0.564;
  return step(abs(p.x - 0.49) + abs(p.y - 0.49), r);
}

void main(){
  float pixelSize = uPixelSize;
  vec2 fragCoord = gl_FragCoord.xy - uResolution * .5;
  float aspectRatio = uResolution.x / uResolution.y;

  vec2 pixelId = floor(fragCoord / pixelSize);
  vec2 pixelUV = fract(fragCoord / pixelSize);

  float cellPixelSize = 8.0 * pixelSize;
  vec2 cellId = floor(fragCoord / cellPixelSize);
  vec2 cellCoord = cellId * cellPixelSize;
  vec2 uv = cellCoord / uResolution * vec2(aspectRatio, 1.0);

  float base = fbm2(uv, uTime * 0.05);
  base = base * 0.5 - 0.65;

  float feed = base + (uDensity - 0.5) * 0.3;

  float speed     = uRippleSpeed;
  float thickness = uRippleThickness;
  const float dampT     = 1.0;
  const float dampR     = 10.0;

  if (uEnableRipples == 1) {
    for (int i = 0; i < MAX_CLICKS; ++i){
      vec2 pos = uClickPos[i];
      if (pos.x < 0.0) continue;
      float cellPixelSize = 8.0 * pixelSize;
      vec2 cuv = (((pos - uResolution * .5 - cellPixelSize * .5) / (uResolution))) * vec2(aspectRatio, 1.0);
      float t = max(uTime - uClickTimes[i], 0.0);
      float r = distance(uv, cuv);
      float waveR = speed * t;
      float ring  = exp(-pow((r - waveR) / thickness, 2.0));
      float atten = exp(-dampT * t) * exp(-dampR * r);
      feed = max(feed, ring * atten * uRippleIntensity);
    }
  }

  float bayer = Bayer8(fragCoord / uPixelSize) - 0.5;
  float bw = step(0.5, feed + bayer);

  float h = fract(sin(dot(floor(fragCoord / uPixelSize), vec2(127.1, 311.7))) * 43758.5453);
  float jitterScale = 1.0 + (h - 0.5) * uPixelJitter;
  float coverage = bw * jitterScale;
  float M;
  if      (uShapeType == SHAPE_CIRCLE)   M = maskCircle (pixelUV, coverage);
  else if (uShapeType == SHAPE_TRIANGLE) M = maskTriangle(pixelUV, pixelId, coverage);
  else if (uShapeType == SHAPE_DIAMOND)  M = maskDiamond(pixelUV, coverage);
  else                                   M = coverage;

  if (uEdgeFade > 0.0) {
    vec2 norm = gl_FragCoord.xy / uResolution;
    float edge = min(min(norm.x, norm.y), min(1.0 - norm.x, 1.0 - norm.y));
    float fade = smoothstep(0.0, uEdgeFade, edge);
    M *= fade;
  }

  vec3 color = uColor;
  vec3 srgbColor = mix(
    color * 12.92,
    1.055 * pow(color, vec3(1.0 / 2.4)) - 0.055,
    step(0.0031308, color)
  );

  fragColor = vec4(srgbColor, M);
}
`

const createTouchTexture = () => {
  const size = 64
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  ctx.fillStyle = 'black'
  ctx.fillRect(0, 0, size, size)
  const texture = new THREE.Texture(canvas)
  texture.minFilter = THREE.LinearFilter
  texture.magFilter = THREE.LinearFilter
  texture.generateMipmaps = false
  const trail = []
  let last = null
  const maxAge = 64
  let radius = 0.1 * size
  const speed = 1 / maxAge
  const clear = () => { ctx.fillStyle = 'black'; ctx.fillRect(0, 0, size, size) }
  const drawPoint = (p) => {
    const pos = { x: p.x * size, y: (1 - p.y) * size }
    let intensity = 1
    const easeOutSine = (t) => Math.sin((t * Math.PI) / 2)
    const easeOutQuad = (t) => -t * (t - 2)
    if (p.age < maxAge * 0.3) intensity = easeOutSine(p.age / (maxAge * 0.3))
    else intensity = easeOutQuad(1 - (p.age - maxAge * 0.3) / (maxAge * 0.7)) || 0
    intensity *= p.force
    const color = `${((p.vx + 1) / 2) * 255}, ${((p.vy + 1) / 2) * 255}, ${intensity * 255}`
    const offset = size * 5
    ctx.shadowOffsetX = offset
    ctx.shadowOffsetY = offset
    ctx.shadowBlur = radius
    ctx.shadowColor = `rgba(${color},${0.22 * intensity})`
    ctx.beginPath()
    ctx.fillStyle = 'rgba(255,0,0,1)'
    ctx.arc(pos.x - offset, pos.y - offset, radius, 0, Math.PI * 2)
    ctx.fill()
  }
  return {
    canvas, texture,
    addTouch(norm) {
      let force = 0, vx = 0, vy = 0
      if (last) {
        const dx = norm.x - last.x
        const dy = norm.y - last.y
        if (dx === 0 && dy === 0) return
        const dd = dx * dx + dy * dy
        const d = Math.sqrt(dd)
        vx = dx / (d || 1)
        vy = dy / (d || 1)
        force = Math.min(dd * 10000, 1)
      }
      last = { x: norm.x, y: norm.y }
      trail.push({ x: norm.x, y: norm.y, age: 0, force, vx, vy })
    },
    update() {
      clear()
      for (let i = trail.length - 1; i >= 0; i--) {
        const point = trail[i]
        const f = point.force * speed * (1 - point.age / maxAge)
        point.x += point.vx * f
        point.y += point.vy * f
        point.age++
        if (point.age > maxAge) trail.splice(i, 1)
      }
      for (let i = 0; i < trail.length; i++) drawPoint(trail[i])
      texture.needsUpdate = true
    },
    set radiusScale(v) { radius = 0.1 * size * v },
    get radiusScale() { return radius / (0.1 * size) },
    size
  }
}

const createLiquidEffect = (texture, opts) => {
  const fragment = `
    uniform sampler2D uTexture;
    uniform float uStrength;
    uniform float uTime;
    uniform float uFreq;
    void mainUv(inout vec2 uv) {
      vec4 tex = texture2D(uTexture, uv);
      float vx = tex.r * 2.0 - 1.0;
      float vy = tex.g * 2.0 - 1.0;
      float intensity = tex.b;
      float wave = 0.5 + 0.5 * sin(uTime * uFreq + intensity * 6.2831853);
      float amt = uStrength * intensity * wave;
      uv += vec2(vx, vy) * amt;
    }
  `
  return new Effect('LiquidEffect', fragment, {
    uniforms: new Map([
      ['uTexture', new THREE.Uniform(texture)],
      ['uStrength', new THREE.Uniform(opts?.strength ?? 0.025)],
      ['uTime', new THREE.Uniform(0)],
      ['uFreq', new THREE.Uniform(opts?.freq ?? 4.5)]
    ])
  })
}

let state = null
const visibility = { visible: true }

const init = () => {
  const container = containerRef.value
  if (!container) return

  const renderer = new THREE.WebGLRenderer({
    antialias: props.antialias,
    alpha: true,
    powerPreference: 'high-performance'
  })
  renderer.domElement.style.width = '100%'
  renderer.domElement.style.height = '100%'
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
  container.appendChild(renderer.domElement)
  if (props.transparent) renderer.setClearAlpha(0)
  else renderer.setClearColor(0x000000, 1)

  const uniforms = {
    uResolution: { value: new THREE.Vector2(0, 0) },
    uTime: { value: 0 },
    uColor: { value: new THREE.Color(props.color) },
    uClickPos: { value: Array.from({ length: MAX_CLICKS }, () => new THREE.Vector2(-1, -1)) },
    uClickTimes: { value: new Float32Array(MAX_CLICKS) },
    uShapeType: { value: SHAPE_MAP[props.variant] ?? 0 },
    uPixelSize: { value: props.pixelSize * renderer.getPixelRatio() },
    uScale: { value: props.patternScale },
    uDensity: { value: props.patternDensity },
    uPixelJitter: { value: props.pixelSizeJitter },
    uEnableRipples: { value: props.enableRipples ? 1 : 0 },
    uRippleSpeed: { value: props.rippleSpeed },
    uRippleThickness: { value: props.rippleThickness },
    uRippleIntensity: { value: props.rippleIntensityScale },
    uEdgeFade: { value: props.edgeFade }
  }

  const scene = new THREE.Scene()
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
  const material = new THREE.ShaderMaterial({
    vertexShader: VERTEX_SRC,
    fragmentShader: FRAGMENT_SRC,
    uniforms,
    transparent: true,
    depthTest: false,
    depthWrite: false,
    glslVersion: THREE.GLSL3
  })
  const geometry = new THREE.PlaneGeometry(2, 2)
  const quad = new THREE.Mesh(geometry, material)
  scene.add(quad)

  let composer, touch, liquidEffect
  if (props.liquid) {
    touch = createTouchTexture()
    touch.radiusScale = props.liquidRadius
    composer = new EffectComposer(renderer)
    composer.addPass(new RenderPass(scene, camera))
    liquidEffect = createLiquidEffect(touch.texture, {
      strength: props.liquidStrength,
      freq: props.liquidWobbleSpeed
    })
    const effectPass = new EffectPass(camera, liquidEffect)
    effectPass.renderToScreen = true
    composer.addPass(effectPass)
  }
  if (props.noiseAmount > 0) {
    if (!composer) {
      composer = new EffectComposer(renderer)
      composer.addPass(new RenderPass(scene, camera))
    }
    const noiseEffect = new Effect(
      'NoiseEffect',
      `uniform float uTime; uniform float uAmount; float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453);} void mainUv(inout vec2 uv){} void mainImage(const in vec4 inputColor,const in vec2 uv,out vec4 outputColor){ float n=hash(floor(uv*vec2(1920.0,1080.0))+floor(uTime*60.0)); float g=(n-0.5)*uAmount; outputColor=inputColor+vec4(vec3(g),0.0);} `,
      {
        uniforms: new Map([
          ['uTime', new THREE.Uniform(0)],
          ['uAmount', new THREE.Uniform(props.noiseAmount)]
        ])
      }
    )
    const noisePass = new EffectPass(camera, noiseEffect)
    noisePass.renderToScreen = true
    composer.passes.forEach((p) => (p.renderToScreen = false))
    composer.addPass(noisePass)
  }

  const setSize = () => {
    const w = container.clientWidth || 1
    const h = container.clientHeight || 1
    renderer.setSize(w, h, false)
    uniforms.uResolution.value.set(renderer.domElement.width, renderer.domElement.height)
    composer?.setSize(renderer.domElement.width, renderer.domElement.height)
    uniforms.uPixelSize.value = props.pixelSize * renderer.getPixelRatio()
  }
  setSize()
  const ro = new ResizeObserver(setSize)
  ro.observe(container)

  const mapToPixels = (e) => {
    const rect = renderer.domElement.getBoundingClientRect()
    const scaleX = renderer.domElement.width / rect.width
    const scaleY = renderer.domElement.height / rect.height
    return {
      fx: (e.clientX - rect.left) * scaleX,
      fy: (rect.height - (e.clientY - rect.top)) * scaleY,
      w: renderer.domElement.width,
      h: renderer.domElement.height
    }
  }
  const onPointerDown = (e) => {
    const { fx, fy } = mapToPixels(e)
    const ix = state?.clickIx ?? 0
    uniforms.uClickPos.value[ix].set(fx, fy)
    uniforms.uClickTimes.value[ix] = uniforms.uTime.value
    if (state) state.clickIx = (ix + 1) % MAX_CLICKS
  }
  const onPointerMove = (e) => {
    if (!touch) return
    const { fx, fy, w, h } = mapToPixels(e)
    touch.addTouch({ x: fx / w, y: fy / h })
  }
  renderer.domElement.addEventListener('pointerdown', onPointerDown, { passive: true })
  renderer.domElement.addEventListener('pointermove', onPointerMove, { passive: true })

  const clock = new THREE.Clock()
  const timeOffset = Math.random() * 1000
  let raf = 0
  const animate = () => {
    if (props.autoPauseOffscreen && !visibility.visible) {
      raf = requestAnimationFrame(animate)
      return
    }
    uniforms.uTime.value = timeOffset + clock.getElapsedTime() * props.speed
    if (liquidEffect) liquidEffect.uniforms.get('uTime').value = uniforms.uTime.value
    if (composer) {
      if (touch) touch.update()
      composer.passes.forEach((p) => {
        const effs = p.effects
        if (effs) effs.forEach((eff) => {
          const u = eff.uniforms?.get('uTime')
          if (u) u.value = uniforms.uTime.value
        })
      })
      composer.render()
    } else {
      renderer.render(scene, camera)
    }
    raf = requestAnimationFrame(animate)
  }
  raf = requestAnimationFrame(animate)

  state = {
    renderer, scene, camera, material, geometry, quad, uniforms,
    composer, touch, liquidEffect, ro, raf, clickIx: 0,
    onPointerDown, onPointerMove
  }
}

const dispose = () => {
  if (!state) return
  const container = containerRef.value
  cancelAnimationFrame(state.raf)
  state.ro?.disconnect()
  state.renderer.domElement.removeEventListener('pointerdown', state.onPointerDown)
  state.renderer.domElement.removeEventListener('pointermove', state.onPointerMove)
  state.geometry.dispose()
  state.material.dispose()
  state.composer?.dispose()
  state.renderer.dispose()
  state.renderer.forceContextLoss?.()
  if (state.renderer.domElement.parentElement === container) {
    container.removeChild(state.renderer.domElement)
  }
  state = null
}

onMounted(init)
onBeforeUnmount(dispose)

watch(
  () => [props.color, props.variant, props.pixelSize, props.patternScale, props.patternDensity,
    props.pixelSizeJitter, props.enableRipples, props.rippleIntensityScale,
    props.rippleThickness, props.rippleSpeed, props.edgeFade, props.transparent],
  () => {
    if (!state) return
    const u = state.uniforms
    u.uShapeType.value = SHAPE_MAP[props.variant] ?? 0
    u.uPixelSize.value = props.pixelSize * state.renderer.getPixelRatio()
    u.uColor.value.set(props.color)
    u.uScale.value = props.patternScale
    u.uDensity.value = props.patternDensity
    u.uPixelJitter.value = props.pixelSizeJitter
    u.uEnableRipples.value = props.enableRipples ? 1 : 0
    u.uRippleIntensity.value = props.rippleIntensityScale
    u.uRippleThickness.value = props.rippleThickness
    u.uRippleSpeed.value = props.rippleSpeed
    u.uEdgeFade.value = props.edgeFade
    if (props.transparent) state.renderer.setClearAlpha(0)
    else state.renderer.setClearColor(0x000000, 1)
  }
)
</script>

<template>
  <div ref="containerRef" class="pixel-blast-container" aria-label="PixelBlast interactive background"></div>
</template>

<style scoped>
.pixel-blast-container {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
}
.pixel-blast-container :deep(canvas) {
  display: block;
  width: 100% !important;
  height: 100% !important;
}
</style>
