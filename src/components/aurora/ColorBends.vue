<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import * as THREE from 'three'

const MAX_COLORS = 8

const props = defineProps({
  rotation: { type: Number, default: 90 },
  autoRotate: { type: Number, default: 0 },
  speed: { type: Number, default: 0.2 },
  colors: { type: Array, default: () => [] },
  transparent: { type: Boolean, default: true },
  scale: { type: Number, default: 1 },
  frequency: { type: Number, default: 1 },
  warpStrength: { type: Number, default: 1 },
  mouseInfluence: { type: Number, default: 1 },
  parallax: { type: Number, default: 0.5 },
  noise: { type: Number, default: 0.15 },
  iterations: { type: Number, default: 1 },
  intensity: { type: Number, default: 1.5 },
  bandWidth: { type: Number, default: 6 }
})

const containerRef = ref(null)

const frag = `
#define MAX_COLORS ${MAX_COLORS}
uniform vec2 uCanvas;
uniform float uTime;
uniform float uSpeed;
uniform vec2 uRot;
uniform int uColorCount;
uniform vec3 uColors[MAX_COLORS];
uniform int uTransparent;
uniform float uScale;
uniform float uFrequency;
uniform float uWarpStrength;
uniform vec2 uPointer;
uniform float uMouseInfluence;
uniform float uParallax;
uniform float uNoise;
uniform int uIterations;
uniform float uIntensity;
uniform float uBandWidth;
varying vec2 vUv;

void main() {
  float t = uTime * uSpeed;
  vec2 p = vUv * 2.0 - 1.0;
  p += uPointer * uParallax * 0.1;
  vec2 rp = vec2(p.x * uRot.x - p.y * uRot.y, p.x * uRot.y + p.y * uRot.x);
  vec2 q = rp;
  q /= max(uScale, 0.0001);
  q /= 0.5 + 0.2 * dot(q, q);
  q += 0.2 * cos(t) - 7.56;
  vec2 toward = (uPointer - rp);
  q += toward * uMouseInfluence * 0.2;

  for (int j = 0; j < 5; j++) {
    if (j >= uIterations - 1) break;
    vec2 rr = sin(1.5 * (q.yx * uFrequency) + 2.0 * cos(q * uFrequency));
    q += (rr - q) * 0.15;
  }

  vec3 col = vec3(0.0);
  float a = 1.0;

  if (uColorCount > 0) {
    vec2 s = q;
    vec3 sumCol = vec3(0.0);
    float cover = 0.0;
    for (int i = 0; i < MAX_COLORS; ++i) {
      if (i >= uColorCount) break;
      s -= 0.01;
      vec2 r = sin(1.5 * (s.yx * uFrequency) + 2.0 * cos(s * uFrequency));
      float m0 = length(r + sin(5.0 * r.y * uFrequency - 3.0 * t + float(i)) / 4.0);
      float kBelow = clamp(uWarpStrength, 0.0, 1.0);
      float kMix = pow(kBelow, 0.3);
      float gain = 1.0 + max(uWarpStrength - 1.0, 0.0);
      vec2 disp = (r - s) * kBelow;
      vec2 warped = s + disp * gain;
      float m1 = length(warped + sin(5.0 * warped.y * uFrequency - 3.0 * t + float(i)) / 4.0);
      float m = mix(m0, m1, kMix);
      float w = 1.0 - exp(-uBandWidth / exp(uBandWidth * m));
      sumCol += uColors[i] * w;
      cover = max(cover, w);
    }
    col = clamp(sumCol, 0.0, 1.0);
    a = uTransparent > 0 ? cover : 1.0;
  } else {
    vec2 s = q;
    for (int k = 0; k < 3; ++k) {
      s -= 0.01;
      vec2 r = sin(1.5 * (s.yx * uFrequency) + 2.0 * cos(s * uFrequency));
      float m0 = length(r + sin(5.0 * r.y * uFrequency - 3.0 * t + float(k)) / 4.0);
      float kBelow = clamp(uWarpStrength, 0.0, 1.0);
      float kMix = pow(kBelow, 0.3);
      float gain = 1.0 + max(uWarpStrength - 1.0, 0.0);
      vec2 disp = (r - s) * kBelow;
      vec2 warped = s + disp * gain;
      float m1 = length(warped + sin(5.0 * warped.y * uFrequency - 3.0 * t + float(k)) / 4.0);
      float m = mix(m0, m1, kMix);
      col[k] = 1.0 - exp(-uBandWidth / exp(uBandWidth * m));
    }
    a = uTransparent > 0 ? max(max(col.r, col.g), col.b) : 1.0;
  }

  col *= uIntensity;

  if (uNoise > 0.0001) {
    float n = fract(sin(dot(gl_FragCoord.xy + vec2(uTime), vec2(12.9898, 78.233))) * 43758.5453123);
    col += (n - 0.5) * uNoise;
    col = clamp(col, 0.0, 1.0);
  }

  vec3 rgb = (uTransparent > 0) ? col * a : col;
  gl_FragColor = vec4(rgb, a);
}
`

const vert = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 1.0);
}
`

let renderer, scene, camera, mesh, material, geometry, rafId, ro, resizeHandler, clock
const pointerTarget = new THREE.Vector2(0, 0)
const pointerCurrent = new THREE.Vector2(0, 0)
const pointerSmooth = 8

const hexToVec3 = (hex) => {
  const h = String(hex).replace('#', '').trim()
  const v = h.length === 3
    ? [parseInt(h[0] + h[0], 16), parseInt(h[1] + h[1], 16), parseInt(h[2] + h[2], 16)]
    : [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)]
  return new THREE.Vector3(v[0] / 255, v[1] / 255, v[2] / 255)
}

const syncColors = () => {
  if (!material) return
  const arr = (props.colors || []).filter(Boolean).slice(0, MAX_COLORS).map(hexToVec3)
  for (let i = 0; i < MAX_COLORS; i++) {
    const vec = material.uniforms.uColors.value[i]
    if (i < arr.length) vec.copy(arr[i])
    else vec.set(0, 0, 0)
  }
  material.uniforms.uColorCount.value = arr.length
}

onMounted(() => {
  const container = containerRef.value
  if (!container) return

  scene = new THREE.Scene()
  camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
  geometry = new THREE.PlaneGeometry(2, 2)

  const uColorsArray = Array.from({ length: MAX_COLORS }, () => new THREE.Vector3(0, 0, 0))

  material = new THREE.ShaderMaterial({
    vertexShader: vert,
    fragmentShader: frag,
    uniforms: {
      uCanvas: { value: new THREE.Vector2(1, 1) },
      uTime: { value: 0 },
      uSpeed: { value: props.speed },
      uRot: { value: new THREE.Vector2(1, 0) },
      uColorCount: { value: 0 },
      uColors: { value: uColorsArray },
      uTransparent: { value: props.transparent ? 1 : 0 },
      uScale: { value: props.scale },
      uFrequency: { value: props.frequency },
      uWarpStrength: { value: props.warpStrength },
      uPointer: { value: new THREE.Vector2(0, 0) },
      uMouseInfluence: { value: props.mouseInfluence },
      uParallax: { value: props.parallax },
      uNoise: { value: props.noise },
      uIterations: { value: props.iterations },
      uIntensity: { value: props.intensity },
      uBandWidth: { value: props.bandWidth }
    },
    premultipliedAlpha: true,
    transparent: true
  })

  mesh = new THREE.Mesh(geometry, material)
  scene.add(mesh)

  renderer = new THREE.WebGLRenderer({
    antialias: false,
    powerPreference: 'high-performance',
    alpha: true
  })
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
  renderer.setClearColor(0x000000, props.transparent ? 0 : 1)
  renderer.domElement.style.width = '100%'
  renderer.domElement.style.height = '100%'
  renderer.domElement.style.display = 'block'
  container.appendChild(renderer.domElement)

  resizeHandler = () => {
    const w = container.clientWidth || 1
    const h = container.clientHeight || 1
    renderer.setSize(w, h, false)
    material.uniforms.uCanvas.value.set(w, h)
  }
  resizeHandler()

  if ('ResizeObserver' in window) {
    ro = new ResizeObserver(resizeHandler)
    ro.observe(container)
  } else {
    window.addEventListener('resize', resizeHandler)
  }

  const onPointerMove = (e) => {
    const rect = container.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / (rect.width || 1)) * 2 - 1
    const y = -(((e.clientY - rect.top) / (rect.height || 1)) * 2 - 1)
    pointerTarget.set(x, y)
  }
  container.addEventListener('pointermove', onPointerMove)
  container._onPointerMove = onPointerMove

  syncColors()
  clock = new THREE.Clock()

  const loop = () => {
    const dt = clock.getDelta()
    const elapsed = clock.elapsedTime
    material.uniforms.uTime.value = elapsed

    const deg = (props.rotation % 360) + props.autoRotate * elapsed
    const rad = (deg * Math.PI) / 180
    material.uniforms.uRot.value.set(Math.cos(rad), Math.sin(rad))

    const amt = Math.min(1, dt * pointerSmooth)
    pointerCurrent.lerp(pointerTarget, amt)
    material.uniforms.uPointer.value.copy(pointerCurrent)

    renderer.render(scene, camera)
    rafId = requestAnimationFrame(loop)
  }
  rafId = requestAnimationFrame(loop)
})

watch(
  () => [
    props.speed, props.scale, props.frequency, props.warpStrength,
    props.mouseInfluence, props.parallax, props.noise, props.iterations,
    props.intensity, props.bandWidth, props.transparent
  ],
  () => {
    if (!material) return
    material.uniforms.uSpeed.value = props.speed
    material.uniforms.uScale.value = props.scale
    material.uniforms.uFrequency.value = props.frequency
    material.uniforms.uWarpStrength.value = props.warpStrength
    material.uniforms.uMouseInfluence.value = props.mouseInfluence
    material.uniforms.uParallax.value = props.parallax
    material.uniforms.uNoise.value = props.noise
    material.uniforms.uIterations.value = props.iterations
    material.uniforms.uIntensity.value = props.intensity
    material.uniforms.uBandWidth.value = props.bandWidth
    material.uniforms.uTransparent.value = props.transparent ? 1 : 0
    if (renderer) renderer.setClearColor(0x000000, props.transparent ? 0 : 1)
  }
)

watch(() => props.colors, syncColors, { deep: true })

onBeforeUnmount(() => {
  if (rafId) cancelAnimationFrame(rafId)
  if (ro) ro.disconnect()
  else window.removeEventListener('resize', resizeHandler)
  const container = containerRef.value
  if (container && container._onPointerMove) {
    container.removeEventListener('pointermove', container._onPointerMove)
  }
  geometry?.dispose()
  material?.dispose()
  renderer?.dispose()
  renderer?.forceContextLoss?.()
  if (renderer?.domElement?.parentElement === container) {
    container.removeChild(renderer.domElement)
  }
})
</script>

<template>
  <div ref="containerRef" class="color-bends-container"></div>
</template>

<style scoped>
.color-bends-container {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
