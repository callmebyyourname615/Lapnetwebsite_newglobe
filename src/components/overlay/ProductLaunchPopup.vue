<template>
  <Teleport to="body">
    <div
      v-if="open"
      ref="overlayRef"
      class="plp-overlay"
      @click.self="close"
      role="presentation"
    >
      <!-- Fireworks layer -->
      <div ref="fireworksRef" class="plp-fireworks" aria-hidden="true"></div>

      <!-- Card -->
      <div
        ref="cardRef"
        class="plp-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="plp-title"
        aria-describedby="plp-subtitle"
      >
        <div class="plp-gold-line" aria-hidden="true"></div>
        <div class="plp-shine" aria-hidden="true"></div>

        <button
          ref="closeButtonRef"
          type="button"
          class="plp-close"
          aria-label="Close product launch popup"
          @click="close"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <div class="plp-grid">
          <!-- Left: text -->
          <div class="plp-text">
            <span :ref="registerText" class="plp-eyebrow">{{ eyebrow }}</span>
            <h2 id="plp-title" :ref="registerText" class="plp-title">{{ title }}</h2>
            <p id="plp-subtitle" :ref="registerText" class="plp-subtitle">{{ subtitle }}</p>

            <div :ref="registerText" class="plp-cta">
              <button type="button" class="plp-btn-primary" @click="handlePrimary">
                {{ primaryCtaLabel }}
              </button>
              <button type="button" class="plp-btn-secondary" @click="handleSecondary">
                {{ secondaryCtaLabel }}
              </button>
            </div>
          </div>

          <!-- Right: image -->
          <div class="plp-product">
            <div ref="glowRef" class="plp-product-glow" aria-hidden="true"></div>
            <div ref="imageRef" class="plp-product-imgwrap">
              <img :src="imageUrl" alt="New product" class="plp-product-img" />
              <div class="plp-reflection" aria-hidden="true"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch, nextTick } from "vue";
import { useRouter } from "vue-router";
import { gsap } from "gsap";

const router = useRouter();

const props = defineProps({
  eyebrow: { type: String, default: "NEW PRODUCT LAUNCH" },
  title: { type: String, default: "ບໍລິການໂອນເງິນຂ້າມທະນາຄານ ສະກຸນເງິນຕາຕ່າງປະເທດ" },
  subtitle: {
    type: String,
    default:
      "ບໍລິການໃໝ່ຈາກ LAPNet — ໂອນເງິນ USD ↔ USD ແລະ THB ↔ THB ຂ້າມທະນາຄານ ສະດວກ ວ່ອງໄວ ປອດໄພ 24/7.",
  },
  imageUrl: { type: String, default: "/product/product4/Transfer_Currentcy.png" },
  primaryCtaLabel: { type: String, default: "ອ່ານເພີ່ມເຕີມ" },
  secondaryCtaLabel: { type: String, default: "ປິດ" },
  primaryHref: { type: String, default: "/products_service/mobile-transfer" },
  secondaryHref: { type: String, default: "" },
  showOncePerSession: { type: Boolean, default: true },
  /** Hours to wait before showing again after dismissal. 0 disables cooldown. */
  cooldownHours: { type: Number, default: 3 },
});

const SESSION_KEY = "lapnet-product-launch-seen";
const COOLDOWN_KEY = "lapnet-product-launch-shown-at";

const open = ref(false);
const reduced = ref(false);

const overlayRef = ref(null);
const cardRef = ref(null);
const imageRef = ref(null);
const glowRef = ref(null);
const fireworksRef = ref(null);
const closeButtonRef = ref(null);
const textEls = [];

let ctx = null;
let prevFocus = null;
let fireworksTimers = [];

const registerText = (el) => {
  if (el && !textEls.includes(el)) textEls.push(el);
};

function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
}

const FIREWORK_COLORS = [
  "#2F80FF", "#38BDF8", "#FACC15", "#F8FAFC",
  "#A78BFA", "#F472B6", "#34D399", "#FB923C",
];

function launchBurst(opts = {}) {
  const container = fireworksRef.value;
  if (!container) return;
  const originX = opts.x ?? gsap.utils.random(6, 94);
  const originY = opts.y ?? gsap.utils.random(8, 65);
  const color = opts.color ?? gsap.utils.random(FIREWORK_COLORS);
  const count = opts.count ?? gsap.utils.random(22, 30);
  const minDist = opts.minDist ?? 90;
  const maxDist = opts.maxDist ?? 200;
  for (let i = 0; i < count; i++) {
    const dot = document.createElement("span");
    const size = gsap.utils.random(3, 7);
    dot.style.cssText = `
      position:absolute;border-radius:9999px;pointer-events:none;
      width:${size}px;height:${size}px;
      left:${originX}%;top:${originY}%;background:${color};
      box-shadow:0 0 10px ${color},0 0 20px ${color};
    `;
    container.appendChild(dot);
    const angle = (Math.PI * 2 * i) / count + gsap.utils.random(-0.15, 0.15);
    const distance = gsap.utils.random(minDist, maxDist);
    gsap.to(dot, {
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance + 30, // slight gravity drift
      opacity: 0,
      scale: gsap.utils.random(0.4, 1.1),
      duration: gsap.utils.random(1.1, 1.7),
      ease: "power2.out",
      onComplete: () => dot.remove(),
    });
  }
}

function multiBurst() {
  const n = gsap.utils.random(2, 4, 1);
  for (let i = 0; i < n; i++) {
    const id = window.setTimeout(() => launchBurst(), i * gsap.utils.random(120, 280));
    fireworksTimers.push(id);
  }
}

function startFireworks() {
  if (reduced.value) return;
  const schedule = (delay, fn = launchBurst) => {
    const id = window.setTimeout(fn, delay);
    fireworksTimers.push(id);
  };
  // Opening celebration cascade only — no infinite loop (keeps the UI smooth)
  schedule(200);
  schedule(450);
  schedule(750);
  schedule(1050, multiBurst);
  schedule(1500, multiBurst);
  schedule(2000);
  // Fade out the fireworks layer after the last burst's particles finish (~3.7s)
  fireworksTimers.push(window.setTimeout(() => {
    const container = fireworksRef.value;
    if (!container) return;
    gsap.to(container, {
      opacity: 0,
      duration: 0.6,
      ease: "power1.out",
      onComplete: () => {
        container.innerHTML = "";
        container.style.display = "none";
      },
    });
  }, 3700));
}

function stopFireworks() {
  fireworksTimers.forEach((id) => clearTimeout(id));
  fireworksTimers = [];
  if (fireworksRef.value) fireworksRef.value.innerHTML = "";
}

async function runOpenAnimation() {
  await nextTick();
  ctx?.revert();
  ctx = gsap.context(() => {
    if (reduced.value) {
      gsap.set([overlayRef.value, cardRef.value], { opacity: 1 });
      gsap.fromTo(overlayRef.value, { opacity: 0 }, { opacity: 1, duration: 0.3 });
      return;
    }
    const tl = gsap.timeline();
    tl.from(overlayRef.value, { opacity: 0, duration: 0.45, ease: "power2.out" });
    tl.from(cardRef.value, { opacity: 0, scale: 0.88, y: 40, duration: 0.8, ease: "back.out(1.2)" }, "-=0.2");
    tl.from(imageRef.value, { opacity: 0, scale: 0.8, rotateY: -10, x: 40, duration: 0.9, ease: "power3.out" }, "-=0.65");
    if (textEls.length) {
      tl.from(textEls, { opacity: 0, y: 18, duration: 0.55, stagger: 0.1, ease: "power2.out" }, "-=0.7");
    }
    gsap.to(imageRef.value, { y: 8, duration: 3, repeat: -1, yoyo: true, ease: "sine.inOut" });
    gsap.fromTo(
      glowRef.value,
      { opacity: 0.45, scale: 1 },
      { opacity: 0.75, scale: 1.08, duration: 2.5, repeat: -1, yoyo: true, ease: "sine.inOut" }
    );
  });
  startFireworks();
}

function close() {
  if (props.showOncePerSession) {
    try { sessionStorage.setItem(SESSION_KEY, "1"); } catch { /* ignore */ }
  }
  if (props.cooldownHours > 0) {
    try { localStorage.setItem(COOLDOWN_KEY, String(Date.now())); } catch { /* ignore */ }
  }
  const finish = () => {
    open.value = false;
    stopFireworks();
    document.body.style.overflow = "";
    if (prevFocus instanceof HTMLElement) prevFocus.focus();
  };
  if (reduced.value) {
    gsap.to(overlayRef.value, { opacity: 0, duration: 0.2, onComplete: finish });
    return;
  }
  const tl = gsap.timeline({ onComplete: finish });
  tl.to(cardRef.value, { opacity: 0, scale: 0.92, y: 30, duration: 0.35, ease: "power2.in" });
  tl.to(overlayRef.value, { opacity: 0, duration: 0.3 }, "-=0.15");
}

function handlePrimary() {
  if (!props.primaryHref) {
    close();
    return;
  }
  // Internal SPA navigation when href is a path; external goes via window.location
  if (/^https?:\/\//i.test(props.primaryHref)) {
    window.location.assign(props.primaryHref);
    return;
  }
  close();
  router.push(props.primaryHref);
}
function handleSecondary() {
  if (props.secondaryHref) window.location.assign(props.secondaryHref);
  else close();
}

function onKey(e) {
  if (!open.value) return;
  if (e.key === "Escape") {
    e.preventDefault();
    close();
    return;
  }
  if (e.key === "Tab") {
    const card = cardRef.value;
    if (!card) return;
    const focusable = card.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }
}

watch(open, async (v) => {
  if (v) {
    prevFocus = document.activeElement;
    document.body.style.overflow = "hidden";
    await runOpenAnimation();
    setTimeout(() => closeButtonRef.value?.focus(), 100);
  }
});

onMounted(() => {
  if (props.showOncePerSession) {
    try { if (sessionStorage.getItem(SESSION_KEY)) return; } catch { /* ignore */ }
  }
  if (props.cooldownHours > 0) {
    try {
      const last = Number(localStorage.getItem(COOLDOWN_KEY) || 0);
      if (last && Date.now() - last < props.cooldownHours * 3600 * 1000) return;
    } catch { /* ignore */ }
  }
  reduced.value = !!prefersReducedMotion();
  open.value = true;
  document.addEventListener("keydown", onKey);
});

onBeforeUnmount(() => {
  ctx?.revert();
  stopFireworks();
  document.removeEventListener("keydown", onKey);
  document.body.style.overflow = "";
});
</script>

<style scoped>
.plp-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background: rgba(2, 8, 23, 0.75);
  background-image: radial-gradient(circle at center, rgba(47, 128, 255, 0.18), rgba(2, 8, 23, 0.88));
  backdrop-filter: blur(12px);
  font-family: "Inter", "Plus Jakarta Sans", system-ui, sans-serif;
}

.plp-fireworks {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}

.plp-card {
  position: relative;
  width: 92vw;
  max-width: 1200px;
  padding: 1.75rem;
  border-radius: 28px;
  overflow: hidden;
  background: linear-gradient(135deg, #06142e 0%, #0a1f44 45%, #03111f 100%);
  border: 1px solid rgba(96, 165, 250, 0.35);
  box-shadow:
    0 30px 100px rgba(0, 0, 0, 0.45),
    0 0 80px rgba(47, 128, 255, 0.25),
    inset 0 1px 0 rgba(248, 250, 252, 0.08);
}
@media (min-width: 640px) { .plp-card { padding: 2.5rem; } }
@media (min-width: 768px) { .plp-card { padding: 3rem; } }

.plp-card::after {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  border-radius: inherit;
  background:
    radial-gradient(ellipse at top right, rgba(56, 189, 248, 0.12), transparent 55%),
    radial-gradient(ellipse at bottom left, rgba(47, 128, 255, 0.1), transparent 55%);
}

.plp-gold-line {
  position: absolute;
  inset: 0 0 auto 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(250, 204, 21, 0.7), rgba(56, 189, 248, 0.5), transparent);
}

.plp-shine {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: linear-gradient(
    115deg,
    transparent 30%,
    rgba(248, 250, 252, 0.07) 48%,
    rgba(248, 250, 252, 0.12) 50%,
    transparent 70%
  );
  background-size: 250% 100%;
  animation: plp-shine-move 6s ease-in-out infinite;
  border-radius: inherit;
}
@keyframes plp-shine-move {
  0% { background-position: 150% 0; }
  60%, 100% { background-position: -150% 0; }
}

.plp-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  z-index: 20;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  color: #f8fafc;
  cursor: pointer;
  background: rgba(248, 250, 252, 0.08);
  border: 1px solid rgba(96, 165, 250, 0.3);
  backdrop-filter: blur(8px);
  transition: all 0.3s ease;
}
@media (min-width: 640px) { .plp-close { top: 1.5rem; right: 1.5rem; } }
.plp-close:hover {
  background: rgba(47, 128, 255, 0.25);
  border-color: rgba(56, 189, 248, 0.6);
  box-shadow: 0 0 18px rgba(56, 189, 248, 0.4);
  transform: rotate(90deg) scale(1.05);
}
.plp-close:focus-visible { outline: 2px solid #38bdf8; outline-offset: 2px; }

.plp-grid {
  position: relative;
  z-index: 10;
  display: grid;
  grid-template-columns: 1fr;
  align-items: center;
  gap: 2rem;
}
@media (min-width: 768px) {
  .plp-grid { grid-template-columns: 1fr 1fr; gap: 2.5rem; }
}

.plp-text { order: 2; text-align: center; }
.plp-product { order: 1; position: relative; display: flex; align-items: center; justify-content: center; }
@media (min-width: 768px) {
  .plp-text { order: 1; text-align: left; }
  .plp-product { order: 2; }
}

.plp-eyebrow {
  display: inline-block;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.25em;
  background: linear-gradient(90deg, #38bdf8, #facc15);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
.plp-title {
  margin-top: 1rem;
  margin-bottom: 0;
  font-size: 1.875rem;
  font-weight: 700;
  line-height: 1.2;
  color: #f8fafc;
}
@media (min-width: 640px) { .plp-title { font-size: 2.25rem; } }
@media (min-width: 768px) { .plp-title { font-size: 2.75rem; } }
.plp-subtitle {
  margin-top: 1.25rem;
  margin-bottom: 0;
  font-size: 1rem;
  line-height: 1.75;
  letter-spacing: 0.005em;
  color: #c7d2e9;
  max-width: 52ch;
  text-wrap: pretty;
  font-weight: 400;
}
@media (min-width: 768px) {
  .plp-subtitle {
    font-size: 1.125rem;
    line-height: 1.7;
  }
}
.plp-subtitle :deep(strong),
.plp-subtitle strong {
  color: #f8fafc;
  font-weight: 600;
}

.plp-cta {
  margin-top: 1.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
@media (min-width: 640px) {
  .plp-cta { flex-direction: row; justify-content: center; }
}
@media (min-width: 768px) {
  .plp-cta { justify-content: flex-start; }
}

.plp-btn-primary,
.plp-btn-secondary {
  width: 100%;
  border-radius: 9999px;
  padding: 0.75rem 1.75rem;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  border: 0;
  transition: all 0.25s ease;
}
@media (min-width: 640px) {
  .plp-btn-primary, .plp-btn-secondary { width: auto; }
}
.plp-btn-primary {
  background: linear-gradient(135deg, #2f80ff, #38bdf8);
  color: #f8fafc;
  box-shadow: 0 8px 24px rgba(47, 128, 255, 0.35);
}
.plp-btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 34px rgba(56, 189, 248, 0.55);
}
.plp-btn-secondary {
  background: rgba(248, 250, 252, 0.04);
  color: #f8fafc;
  border: 1px solid rgba(96, 165, 250, 0.45);
  backdrop-filter: blur(8px);
}
.plp-btn-secondary:hover {
  background: rgba(47, 128, 255, 0.14);
  border-color: rgba(56, 189, 248, 0.8);
}

.plp-product-glow {
  position: absolute;
  width: 80%;
  height: 80%;
  border-radius: 9999px;
  background: radial-gradient(circle, rgba(47, 128, 255, 0.55), rgba(56, 189, 248, 0.25) 45%, transparent 70%);
  filter: blur(24px);
  pointer-events: none;
}
.plp-product-imgwrap {
  position: relative;
  perspective: 1000px;
}
.plp-product-img {
  position: relative;
  z-index: 10;
  width: 100%;
  max-width: 820px;
  border-radius: 1rem;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
}
.plp-reflection {
  position: absolute;
  left: 1.5rem;
  right: 1.5rem;
  bottom: -1.5rem;
  height: 4rem;
  border-radius: 9999px;
  pointer-events: none;
  background: radial-gradient(ellipse at center, rgba(56, 189, 248, 0.35), transparent 70%);
  filter: blur(10px);
}

@media (prefers-reduced-motion: reduce) {
  .plp-shine { animation: none; }
}
</style>
