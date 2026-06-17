<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick, watch } from "vue";
import { gsap } from "gsap";

/**
 * Scrollspy / Table-of-Contents sidebar with progress + active marker.
 *
 * Usage:
 *   <ScrollspySidebar
 *     :items="[
 *       { id: 'intro',   label: 'ບົດແນະນຳ',  icon: 'overview' },
 *       { id: 'benefit', label: 'ຜົນປະໂຫຍດ', icon: 'spark' },
 *       { id: 'fee',     label: 'ຄ່າທຳນຽມ',  icon: 'tag' },
 *       { id: 'member',  label: 'ສະມາຊິກ',   icon: 'box' },
 *     ]"
 *   />
 *
 * Make sure each section in the page has `id="<the same id>"` set.
 */
const props = defineProps({
  items: { type: Array, default: () => [] },
  /** Anchor side. "left" | "right" */
  side: { type: String, default: "left" },
  /** Vertical anchor. "center" centers on the viewport; a number is px from top. */
  top: { type: [Number, String], default: "center" },
});

const active = ref(props.items[0]?.id || "");
const progress = ref(0);
const triangleY = ref(0);
const visible = ref(false);
const cardRef = ref(null);
const navRef = ref(null);
const fillRef = ref(null);
const triangleRef = ref(null);
const itemRefs = ref({});

let lastScrollY = 0;
const SHOW_AFTER_PX = 240; // start considering visibility after scrolling this far
const SCROLL_DELTA = 8;    // ignore tiny jitter

let observer = null;
let ctx = null;
let clickLockId = null;
let clickLockTimer = null;
let suppressShow = false;
let suppressTimer = null;
const itemElList = () => props.items.map((it) => itemRefs.value[it.id]).filter(Boolean);

const onItemRef = (el, id) => {
  if (el) itemRefs.value[id] = el;
};

function smoothScrollTo(id) {
  const el = document.getElementById(id);
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY - 80;
  window.scrollTo({ top, behavior: "smooth" });
}

function handleClick(e, id) {
  e.preventDefault();
  // Lock the active marker to the clicked target while smooth-scrolling
  // so the IntersectionObserver doesn't flick the arrow through every
  // section we pass on the way (no more bouncing between 1 → 2 → 3 → 4).
  clickLockId = id;
  if (clickLockTimer) clearTimeout(clickLockTimer);
  active.value = id;
  smoothScrollTo(id);
  // Release the lock once the smooth scroll likely settled.
  clickLockTimer = setTimeout(() => {
    clickLockId = null;
  }, 900);

  // Hide the sidebar after the user picks a menu item — and suppress the
  // scroll-down auto-show for a beat so it doesn't immediately bounce back.
  suppressShow = true;
  if (suppressTimer) clearTimeout(suppressTimer);
  setVisible(false);
  suppressTimer = setTimeout(() => {
    suppressShow = false;
  }, 1100);
}

function onScroll() {
  const h = document.documentElement;
  const y = window.scrollY;
  const max = h.scrollHeight - h.clientHeight;
  progress.value = max > 0 ? Math.min(1, Math.max(0, y / max)) : 0;

  // Show/hide based on scroll direction (with a small threshold to ignore jitter).
  const delta = y - lastScrollY;
  if (Math.abs(delta) > SCROLL_DELTA) {
    if (delta > 0 && y > SHOW_AFTER_PX && !suppressShow) {
      setVisible(true);  // scrolling DOWN past hero → reveal
    } else if (delta < 0) {
      setVisible(false); // scrolling UP → hide
    }
    lastScrollY = y;
  }

  // If user scrolls back to the very top, force-hide.
  if (y < SHOW_AFTER_PX / 2) setVisible(false);

  // Recompute fill so it tracks the current active item's centre even when
  // the page is resized / first item shifts due to lazy content loading.
  updateFill();
}

function setVisible(v) {
  if (visible.value === v) return;
  visible.value = v;
  if (!cardRef.value) return;
  if (v) {
    gsap.to(cardRef.value, {
      x: 0,
      opacity: 1,
      duration: 0.55,
      ease: "power3.out",
      pointerEvents: "auto",
      overwrite: "auto",
    });
  } else {
    gsap.to(cardRef.value, {
      x: props.side === "right" ? 60 : -60,
      opacity: 0,
      duration: 0.4,
      ease: "power2.in",
      pointerEvents: "none",
      overwrite: "auto",
    });
  }
}

function updateFill() {
  if (!fillRef.value || !navRef.value) return;
  // Fill ends exactly where the arrow points — so the coloured line never
  // overshoots / undershoots the active marker.
  const target = Math.max(0, triangleY.value);
  gsap.to(fillRef.value, {
    height: target + "px",
    duration: 0.5,
    ease: "power2.out",
    overwrite: "auto",
  });
}

function updateTriangle() {
  const nav = navRef.value;
  const el = itemRefs.value[active.value];
  if (!nav || !el || !triangleRef.value) return;
  const navRect = nav.getBoundingClientRect();
  const elRect = el.getBoundingClientRect();
  const y = elRect.top - navRect.top + elRect.height / 2;
  triangleY.value = y;
  // Use GSAP `y` (transform) instead of CSS `top` so it composes with
  // `yPercent: -50` for proper vertical centering.
  gsap.to(triangleRef.value, {
    y,
    duration: 0.5,
    ease: "power3.out",
    overwrite: "auto",
  });
  // Sync the progress fill with the arrow.
  updateFill();
}

watch(active, (id, oldId) => {
  nextTick(updateTriangle);
  // Pulse highlight on newly active item
  const el = itemRefs.value[id];
  if (el) {
    gsap.fromTo(
      el,
      { scale: 0.96 },
      { scale: 1, duration: 0.45, ease: "back.out(2)" }
    );
  }
  // Soft fade-out of the previously active item
  const oldEl = oldId && itemRefs.value[oldId];
  if (oldEl) {
    gsap.fromTo(oldEl, { scale: 1.02 }, { scale: 1, duration: 0.3, ease: "power2.out" });
  }
});

function setupObserver() {
  observer?.disconnect();
  observer = new IntersectionObserver(
    (entries) => {
      // While a click-jump is in progress, hold the active marker on the target.
      if (clickLockId) return;
      const inView = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
      if (inView[0]) {
        active.value = inView[0].target.id;
      }
    },
    { rootMargin: "-30% 0px -55% 0px", threshold: [0, 0.25, 0.5, 1] }
  );
  props.items.forEach(({ id }) => {
    const el = document.getElementById(id);
    if (el) observer.observe(el);
  });
}

onMounted(async () => {
  await nextTick();
  setupObserver();

  // Start hidden off-screen — revealed on scroll-down behaviour.
  ctx = gsap.context(() => {
    if (cardRef.value) {
      gsap.set(cardRef.value, {
        x: props.side === "right" ? 60 : -60,
        opacity: 0,
        pointerEvents: "none",
      });
    }
    if (triangleRef.value) {
      // Centre the triangle on its target via GSAP transforms so subsequent
      // scale / y animations compose correctly (CSS translateY would be wiped).
      gsap.set(triangleRef.value, { yPercent: -50 });
      gsap.from(triangleRef.value, {
        opacity: 0,
        scale: 0.6,
        duration: 0.5,
        delay: 0.45,
        ease: "back.out(2)",
        transformOrigin: "left center",
      });
    }
  });

  onScroll();
  // Set initial triangle position immediately (before animation), then animate after entrance delay.
  updateTriangle();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", updateTriangle);
});

onBeforeUnmount(() => {
  ctx?.revert();
  observer?.disconnect();
  if (clickLockTimer) clearTimeout(clickLockTimer);
  if (suppressTimer) clearTimeout(suppressTimer);
  window.removeEventListener("scroll", onScroll);
  window.removeEventListener("resize", updateTriangle);
});

// Minimal inline icon set
const ICONS = {
  overview:
    "M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z",
  spark:
    "M12 3l1.8 5.4L19 10l-5.2 1.6L12 17l-1.8-5.4L5 10l5.2-1.6L12 3z",
  box:
    "M3 7l9-4 9 4-9 4-9-4zM3 7v10l9 4M21 7v10l-9 4",
  tag:
    "M20 12V5h-7L3 15l6 6 11-9zM7 9a2 2 0 11.001-.001",
  help:
    "M9.1 9a3 3 0 015.84.85c0 2-3 2.5-3 4M12 17h.01M12 22a10 10 0 110-20 10 10 0 010 20z",
  mail:
    "M4 6h16v12H4zM4 6l8 7 8-7",
  layers:
    "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5",
};

function iconPath(name) {
  return ICONS[name] || ICONS.overview;
}
</script>

<template>
  <!-- Desktop sticky sidebar -->
  <aside
    class="ss-sidebar"
    :class="['ss-' + side, top === 'center' ? 'ss-center' : '']"
    :style="top !== 'center' ? { top: top + 'px' } : null"
    aria-label="Section navigation"
  >
    <div ref="cardRef" class="ss-card">
      <!-- <div class="ss-brand">
        <span class="ss-brand-dot"></span>
        <span class="ss-brand-text">Sections</span>
      </div> -->
      <div class="ss-divider"></div>

      <div ref="navRef" class="ss-nav">
        <!-- progress track -->
        <div class="ss-track">
          <div ref="fillRef" class="ss-fill"></div>
          <span class="ss-track-cap ss-track-cap--start">START</span>
          <span class="ss-track-cap ss-track-cap--end">END</span>
        </div>

        <!-- triangle marker (GSAP-animated position) -->
        <div ref="triangleRef" class="ss-triangle" aria-hidden="true"></div>

        <nav>
          <a
            v-for="item in items"
            :key="item.id"
            :ref="(el) => onItemRef(el, item.id)"
            :href="'#' + item.id"
            class="ss-item"
            :class="{ 'ss-item--active': active === item.id }"
            @click="(e) => handleClick(e, item.id)"
          >
            <svg
              class="ss-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <path :d="iconPath(item.icon)" />
            </svg>
            <span class="ss-label">{{ item.label }}</span>
            <span v-if="item.badge" class="ss-badge">{{ item.badge }}</span>
          </a>
        </nav>
      </div>
    </div>
  </aside>

  <!-- Mobile horizontal sticky tracker -->
  <nav class="ss-mobile" aria-label="Section navigation (mobile)">
    <div class="ss-mobile-track">
      <a
        v-for="item in items"
        :key="'m-' + item.id"
        :href="'#' + item.id"
        class="ss-mobile-pill"
        :class="{ 'ss-mobile-pill--active': active === item.id }"
        @click="(e) => handleClick(e, item.id)"
      >
        {{ item.label }}
      </a>
    </div>
  </nav>
</template>

<style scoped>
/* ===== Desktop sidebar ===== */
.ss-sidebar {
  position: fixed;
  z-index: 40;
  width: 210px;
  pointer-events: none; /* card itself re-enables */
}
.ss-left { left: 0; }
.ss-right { right: 0; }

/* Vertically centred on the viewport — independent of `top` prop. */
.ss-center {
  top: 50%;
  transform: translateY(-50%);
}

.ss-card {
  pointer-events: auto;
  background: #ffffff;
  padding: 0.85rem 0.85rem 1rem;
  box-shadow:
    0 30px 60px -30px rgba(17, 17, 17, 0.18),
    0 2px 8px rgba(17, 17, 17, 0.05);
  border: 1px solid rgba(15, 23, 42, 0.05);
}
.ss-left .ss-card {
  border-radius: 0 24px 24px 0;
  border-left: 0;
}
.ss-right .ss-card {
  border-radius: 24px 0 0 24px;
  border-right: 0;
}

.ss-brand {
  display: flex;
  align-items: center;
  gap: 0.55rem;
  padding: 0.45rem 0.65rem;
  border-radius: 12px;
  border: 1px dashed #dedede;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: #111;
}
.ss-brand-dot {
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: linear-gradient(135deg, #0033ab, #00c6ff);
  box-shadow: 0 0 0 3px rgba(0, 120, 255, 0.15);
}

.ss-divider {
  height: 0;
  margin: 0.85rem 0;
  border-top: 1px dashed #e5e5e5;
}

.ss-nav {
  position: relative;
  padding-left: 1.1rem;
}

/* progress track — spans the nav so triangle stays within it for every item */
.ss-track {
  position: absolute;
  left: 4px;
  top: 0;
  bottom: 0;
  width: 2px;
  background: #ececec;
  border-radius: 2px;
}
.ss-fill {
  position: absolute;
  left: 0;
  top: 0;
  width: 2px;
  height: 0;
  background: linear-gradient(180deg, #0033ab, #00c6ff);
  border-radius: 2px;
}
.ss-track-cap {
  position: absolute;
  left: -3px;
  font-size: 9px;
  letter-spacing: 0.14em;
  color: #bdbdbd;
  font-weight: 600;
}
.ss-track-cap--start { top: -20px; }
.ss-track-cap--end { bottom: -20px; }

/* triangle marker */
/* Triangle is GSAP-centered via yPercent:-50; do NOT set CSS transform
   here or scale/y animations will fight it. */
.ss-triangle {
  position: absolute;
  left: -2px;
  top: 0;
  width: 0;
  height: 0;
  border-top: 6px solid transparent;
  border-bottom: 6px solid transparent;
  border-left: 8px solid #0033ab;
  filter: drop-shadow(0 1px 2px rgba(0, 51, 171, 0.35));
  will-change: transform;
}

/* items */
.ss-item {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  padding: 0.6rem 0.7rem;
  border-radius: 12px;
  color: #111;
  text-decoration: none;
  transition: background 0.2s;
  cursor: pointer;
}
.ss-item:hover { background: #f6f6f6; }
.ss-item--active { background: #f1f1f1; }
.ss-icon { width: 18px; height: 18px; flex-shrink: 0; }
.ss-label {
  flex: 1;
  font-size: 0.84rem;
  font-weight: 600;
  line-height: 1.3;
  letter-spacing: -0.005em;
}
.ss-badge {
  font-size: 0.65rem;
  font-weight: 600;
  color: #7a7a7a;
  background: #fff;
  border: 1px solid #e5e5e5;
  border-radius: 6px;
  padding: 0.1rem 0.4rem;
}

/* ===== Mobile horizontal tracker (sticky top) ===== */
.ss-mobile {
  display: none;
  position: sticky;
  top: 0;
  z-index: 30;
  background: rgba(244, 244, 244, 0.92);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid #e5e5e5;
  padding: 0.55rem 0.75rem;
}
.ss-mobile-track {
  display: flex;
  gap: 0.4rem;
  overflow-x: auto;
  scrollbar-width: none;
}
.ss-mobile-track::-webkit-scrollbar { display: none; }

.ss-mobile-pill {
  flex-shrink: 0;
  padding: 0.4rem 0.85rem;
  border-radius: 999px;
  border: 1px solid #e5e5e5;
  background: #fff;
  color: #7a7a7a;
  font-size: 0.74rem;
  font-weight: 600;
  text-decoration: none;
  white-space: nowrap;
  transition: all 0.2s;
}
.ss-mobile-pill--active {
  background: #111;
  color: #fff;
  border-color: #111;
}

@media (max-width: 1100px) {
  .ss-sidebar { display: none; }
  .ss-mobile { display: block; }
}
</style>
