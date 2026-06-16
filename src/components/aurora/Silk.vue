<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import {
  WebGLRenderer,
  Scene,
  OrthographicCamera,
  Mesh,
  PlaneGeometry,
  ShaderMaterial,
  Color
} from 'three'

const props = defineProps({
  speed: { type: Number, default: 5 },
  scale: { type: Number, default: 1 },
  color: { type: String, default: '#7B7481' },
  noiseIntensity: { type: Number, default: 1.5 },
  rotation: { type: Number, default: 0 }
})

const ctnDom = ref(null)

const vertexShader = `
varying vec2 vUv;
varying vec3 vPosition;
void main() {
  vPosition = position;
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

const fragmentShader = `
varying vec2 vUv;
varying vec3 vPosition;

uniform float uTime;
uniform vec3  uColor;
uniform float uSpeed;
uniform float uScale;
uniform float uRotation;
uniform float uNoiseIntensity;

const float e = 2.71828182845904523536;

float noise(vec2 texCoord) {
  float G = e;
  vec2  r = (G * sin(G * texCoord));
  return fract(r.x * r.y * (1.0 + texCoord.x));
}

vec2 rotateUvs(vec2 uv, float angle) {
  float c = cos(angle);
  float s = sin(angle);
  mat2  rot = mat2(c, -s, s, c);
  return rot * uv;
}

void main() {
  float rnd        = noise(gl_FragCoord.xy);
  vec2  uv         = rotateUvs(vUv * uScale, uRotation);
  vec2  tex        = uv * uScale;
  float tOffset    = uSpeed * uTime;

  tex.y += 0.03 * sin(8.0 * tex.x - tOffset);

  float pattern = 0.6 +
                  0.4 * sin(5.0 * (tex.x + tex.y +
                                   cos(3.0 * tex.x + 5.0 * tex.y) +
                                   0.02 * tOffset) +
                           sin(20.0 * (tex.x + tex.y - 0.1 * tOffset)));

  vec4 col = vec4(uColor, 1.0) * vec4(pattern) - rnd / 15.0 * uNoiseIntensity;
  col.a = 1.0;
  gl_FragColor = col;
}
`

let renderer, scene, camera, mesh, material, rafId, resizeHandler, lastTime

onMounted(() => {
  const ctn = ctnDom.value
  if (!ctn) return

  const width = ctn.offsetWidth || 1
  const height = ctn.offsetHeight || 1

  renderer = new WebGLRenderer({ antialias: true, alpha: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
  renderer.setSize(width, height, false)
  ctn.appendChild(renderer.domElement)

  scene = new Scene()
  camera = new OrthographicCamera(-0.5, 0.5, 0.5, -0.5, 0, 1)

  material = new ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      uSpeed: { value: props.speed },
      uScale: { value: props.scale },
      uNoiseIntensity: { value: props.noiseIntensity },
      uColor: { value: new Color(props.color) },
      uRotation: { value: props.rotation },
      uTime: { value: 0 }
    }
  })

  mesh = new Mesh(new PlaneGeometry(1, 1, 1, 1), material)
  scene.add(mesh)

  resizeHandler = () => {
    if (!ctn) return
    const w = ctn.offsetWidth || 1
    const h = ctn.offsetHeight || 1
    renderer.setSize(w, h, false)
  }
  window.addEventListener('resize', resizeHandler)

  lastTime = performance.now()
  const animate = (now) => {
    rafId = requestAnimationFrame(animate)
    const delta = (now - lastTime) / 1000
    lastTime = now
    material.uniforms.uTime.value += 0.1 * delta
    material.uniforms.uSpeed.value = props.speed
    material.uniforms.uScale.value = props.scale
    material.uniforms.uNoiseIntensity.value = props.noiseIntensity
    material.uniforms.uRotation.value = props.rotation
    material.uniforms.uColor.value.set(props.color)
    renderer.render(scene, camera)
  }
  rafId = requestAnimationFrame(animate)
})

onBeforeUnmount(() => {
  cancelAnimationFrame(rafId)
  window.removeEventListener('resize', resizeHandler)
  mesh?.geometry?.dispose()
  material?.dispose()
  renderer?.dispose()
  const ctn = ctnDom.value
  if (ctn && renderer?.domElement?.parentNode === ctn) {
    ctn.removeChild(renderer.domElement)
  }
})
</script>

<template>
  <div ref="ctnDom" class="silk-container"></div>
</template>

<style scoped>
.silk-container {
  width: 100%;
  height: 100%;
}
.silk-container :deep(canvas) {
  display: block;
  width: 100% !important;
  height: 100% !important;
}
</style>
