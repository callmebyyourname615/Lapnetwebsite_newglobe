<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { gsap } from 'gsap'
import sidebar from '../sidebar/sidebar.vue'
import overlaynavbar from './overlaynavbar.vue'
import { menuItems, menuColumns } from './menuItems'

const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  breadcrumb: {
    type: Array,
    default: () => []
  },
  backgroundImage: {
    type: String,
    default: '/overlaynav/product/navigatorcontent-bg.png'
  }
})

const navbarRef = ref(null)
const logoWrapperRef = ref(null)
const logoGlowRef = ref(null)
const sidebarRef = ref(null)

const route = useRoute()

const isMegaOpen = ref(false)

const isDesktop = () => {
  if (typeof window === 'undefined') return true
  return window.innerWidth > 768
}

const openSidebarFromNav = () => {
  sidebarRef.value?.toggleSidebar()
}

let closeTimer = null

const openMegaMenu = () => {
  if (!isDesktop()) return
  if (closeTimer) clearTimeout(closeTimer)
  isMegaOpen.value = true
}

const closeMegaMenu = () => {
  if (!isDesktop()) return
  if (closeTimer) clearTimeout(closeTimer)
  closeTimer = setTimeout(() => {
    isMegaOpen.value = false
  }, 100)
}

// ✅ เปลี่ยนหน้าแล้วปิด dropdown เสมอ กันค้าง
watch(
  () => route.fullPath,
  () => {
    isMegaOpen.value = false
  }
)

onMounted(() => {
  const tl = gsap.timeline({
    defaults: { duration: 0.8, ease: 'power3.out' }
  })

  tl.from(navbarRef.value, { y: -40, opacity: 0 })
    .from(logoGlowRef.value, { scale: 0.6, opacity: 0 }, '-=0.5')
    .from(logoWrapperRef.value, { x: -20, opacity: 0 }, '-=0.4')
    .from('.nav-group', { y: -10, opacity: 0, stagger: 0.08 }, '-=0.4')
})
</script>

<template>
  <header ref="navbarRef" class="nav-root">
    <!-- LEFT: LOGO -->
    <RouterLink to="/">
      <div class="nav-left">
        <div ref="logoGlowRef" class="logo-glow"></div>
        <div ref="logoWrapperRef" class="logo-wrapper">
          <img src="/logolapnet/logolapnet.PNG" alt="LapNet Logo" class="logo-img" />
          <div class="logo-text-col">
            <span class="logo-text-main">LAPNet</span>
            <span class="logo-text-sub">Lao National Payment Network CO., LTD</span>
          </div>
        </div>
      </div>
    </RouterLink>

    <!-- HAMBURGER + "MENU" LABEL (shows when hamburger is visible) -->
    <button class="nav-toggle" type="button" aria-label="Open menu" @click="openSidebarFromNav">
      <svg class="nav-toggle-icon" viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M4 6h16M4 12h16M4 18h16"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
        />
      </svg>
      <span class="nav-toggle-label">ເມນູ</span>
    </button>

    <!-- RIGHT: DESKTOP NAV -->
    <nav
      class="nav-right"
      :class="{ 'mega-open': isMegaOpen }"
      @mouseenter="openMegaMenu"
      @mouseleave="closeMegaMenu"
    >
      <div
        v-for="(item, index) in menuItems"
        :key="index"
        class="nav-group"
      >
        <RouterLink
          v-if="item.children"
          class="nav-item"
          :class="{ 'nav-cta': item.isCta, 'has-dropdown': item.children }"
          :to="item.to"
        >
          {{ item.label }}
          <span class="dropdown-arrow">▼</span>
        </RouterLink>

        <RouterLink
          v-else
          class="nav-item"
          :class="{ 'nav-cta': item.isCta }"
          :to="item.to"
        >
          {{ item.label }}
        </RouterLink>
      </div>

      <div class="mega-menu" @mouseenter="openMegaMenu" @mouseleave="closeMegaMenu">
        <div class="mega-shell">
          <section
            v-for="column in menuColumns"
            :key="column.label"
            class="mega-column"
          >
            <RouterLink class="mega-heading" :to="column.to">{{ column.label }}</RouterLink>
            <RouterLink
              v-for="child in column.children"
              :key="child.to"
              class="mega-link"
              :to="child.to"
            >
              <i :class="['mega-icon', child.icon]" aria-hidden="true"></i>
              <span>{{ child.label }}</span>
            </RouterLink>
          </section>
        </div>
      </div>
    </nav>
  </header>
  <div class="nav-backdrop" :class="{ active: isMegaOpen }"></div>

  <!-- MOBILE SIDEBAR -->
  <sidebar ref="sidebarRef" />
  <div class="box-margin" style="width: 100%; height: 11vh"></div>

  <!-- OVERLAY NAVBAR -->
  <overlaynavbar
    :title="props.title"
    :breadcrumb="props.breadcrumb"
    :background-image="props.backgroundImage"
  />
</template>

<style scoped>
/* ROOT NAVBAR */
.nav-root {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
  padding: 0.55rem 2.5rem;
  height: 11vh;

  background: linear-gradient(
    95deg,
    rgba(0, 18, 61, 1) 0%,
    rgba(0, 51, 171, 1) 35%,
    rgba(6, 0, 120, 1) 100%
  );
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-bottom: 1px solid rgba(72, 164, 255, 0.85);
  box-shadow: 0 14px 35px rgba(0, 0, 0, 0.7), 0 0 22px rgba(0, 60, 200, 0.5);
}

/* LEFT: LOGO CONTAINER */
.nav-left {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.85rem;
}
.logo-text-col {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.logo-glow {
  position: absolute;
  inset: -16px -26px;
  background: conic-gradient(
    from 210deg,
    rgba(0, 120, 255, 0.18),
    rgba(0, 220, 255, 0.3),
    rgba(0, 120, 255, 0.18)
  );
  filter: blur(14px);
  opacity: 0.9;
  pointer-events: none;
  z-index: 0;
}

.logo-wrapper {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.45rem 1.1rem;
  border-radius: 999px;
  background: linear-gradient(120deg, #050b1bdd, #050b1bcc);
  border: 1px solid rgba(80, 170, 255, 0.9);
  box-shadow: 0 0 20px rgba(40, 140, 255, 0.45), inset 0 0 10px rgba(0, 110, 255, 0.3);
}

.logo-img {
  width: 40px;
  height: 40px;
  object-fit: contain;
  filter: drop-shadow(0 0 8px rgba(90, 190, 255, 0.9));
}

.logo-text-main {
  font-size: 1.1rem;
  letter-spacing: 0.15em;

  color: #eef5ff;
  font-weight: 600;
  line-height: 1;
}

.logo-text-sub {
  font-size: 0.55rem;
  text-transform: uppercase;
  letter-spacing: 0.25em;
  color: rgba(158, 205, 255, 0.95);
  margin-top: 2px;
}

/* RIGHT: NAV ITEMS (desktop only) */
.nav-right {
  position: relative;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.nav-group {
  position: relative;
  display: flex;
  align-items: center;
  height: 100%;
}

.nav-item {
  position: relative;
  border: none;
  outline: none;
  background: transparent;
  padding: 0.45rem 0.9rem;
  font-size: 1rem;
  text-transform: uppercase;
  color: #e5f0ff;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  gap: 6px;
  transition: all 0.2s ease;
}

.dropdown-arrow {
  font-size: 0.5rem;
  transition: transform 0.3s ease, opacity 0.3s ease;
  opacity: 0.7;
}

.mega-open .dropdown-arrow,
.nav-right:hover .dropdown-arrow {
  transform: rotate(180deg);
  opacity: 1;
}

/* Hover effects */
.nav-item:hover {
  background: radial-gradient(circle at top, rgba(40, 130, 255, 0.35), transparent 65%);
  color: #ffffff;
  text-shadow: 0 0 8px rgba(120, 200, 255, 0.6);
}

.mega-menu {
  position: fixed;
  top: 11vh;
  left: 50%;
  right: auto;
  width: 100vw;
  z-index: 49;
  padding: 0 0 22px;
  pointer-events: none;
  opacity: 0;
  transform: translate(-50%, -18px);
  transition: opacity 0.26s ease, transform 0.32s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.mega-open .mega-menu,
.nav-right:hover .mega-menu {
  pointer-events: auto;
  opacity: 1;
  transform: translate(-50%, 0);
}

.mega-shell {
  width: 100%;
  margin: 0;
  display: grid;
  grid-template-columns: minmax(380px, 500px) minmax(260px, 320px) minmax(280px, 340px);
  justify-content: center;
  align-items: start;
  gap: clamp(34px, 5vw, 76px);
  padding: 36px clamp(52px, 8vw, 132px) 42px;
  border: 0;
  border-top: 1px solid rgba(138, 194, 255, 0.24);
  border-bottom: 1px solid rgba(138, 194, 255, 0.14);
  border-radius: 0;
  background: rgba(8, 14, 34, 0.9);
  box-shadow: 0 26px 70px rgba(0, 0, 0, 0.34);
  backdrop-filter: blur(24px) saturate(1.2);
  -webkit-backdrop-filter: blur(24px) saturate(1.2);
}

.mega-column {
  min-width: 0;
  max-width: 100%;
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 0 10px;
}

.mega-heading,
.mega-link {
  text-decoration: none;
}

.mega-heading {
  display: inline-flex;
  margin: 0 0 16px;
  padding-left: 10px;
  color: rgba(255, 255, 255, 0.58);
  font-size: 0.74rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.mega-link {
  min-height: 42px;
  display: grid;
  grid-template-columns: 30px 1fr;
  align-items: center;
  gap: 12px;
  padding: 8px 14px 8px 10px;
  border-radius: 8px;
  color: rgba(213, 232, 255, 0.82);
  font-size: 0.9rem;
  line-height: 1.42;
  transition: background 0.18s ease, color 0.18s ease, transform 0.18s ease;
}

.mega-link:hover {
  color: #ffffff;
  background: rgba(255, 255, 255, 0.055);
  transform: translateX(2px);
}

.mega-icon {
  width: 30px;
  height: 30px;
  display: inline-grid;
  place-items: center;
  text-align: center;
  color: rgba(142, 215, 255, 0.72);
  font-size: 0.82rem;
  border: 1px solid rgba(142, 215, 255, 0.12);
  background: rgba(142, 215, 255, 0.055);
  border-radius: 8px;
}

.nav-backdrop {
  position: fixed;
  inset: 0;
  z-index: 40;
  pointer-events: none;
  opacity: 0;
  background: rgba(2, 7, 18, 0.2);
  backdrop-filter: blur(0);
  -webkit-backdrop-filter: blur(0);
  transition: opacity 0.24s ease, backdrop-filter 0.24s ease;
}

.nav-backdrop.active,
.nav-root:has(.nav-right:hover) + .nav-backdrop {
  opacity: 1;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

/* CTA BUTTON */
.nav-cta {
  background: linear-gradient(135deg, #3a9bff, #7ce3ff);
  color: #021325;
  font-weight: 600;
  box-shadow: 0 0 22px rgba(100, 190, 255, 0.7);
}
.nav-cta:hover {
  transform: translateY(-1px) scale(1.02);
  box-shadow: 0 0 26px rgba(120, 205, 255, 0.9);
}

/* HAMBURGER (icon + Menu label) */
.nav-toggle {
  display: none; /* show on mobile only */
  border: none;
  background: rgba(5, 11, 27, 0.45);
  border: 1px solid rgba(80, 170, 255, 0.55);
  color: #e5f0ff;
  cursor: pointer;

  padding: 0.55rem 0.85rem;
  border-radius: 12px;

  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  box-shadow: 0 0 18px rgba(40, 140, 255, 0.35), inset 0 0 10px rgba(0, 110, 255, 0.18);

  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.nav-toggle:hover {
  transform: translateY(-1px);
  box-shadow: 0 0 22px rgba(120, 205, 255, 0.55), inset 0 0 12px rgba(0, 110, 255, 0.22);
}

.nav-toggle-icon {
  width: 22px;
  height: 22px;
}

.nav-toggle-label {
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

/* RESPONSIVE */
@media (max-width: 992px) {
  .logo-text-sub {
    display: none;
  }
  .nav-item {
    font-size: 0.8rem;
  }

  .mega-shell {
    grid-template-columns: minmax(320px, 430px) minmax(220px, 280px) minmax(240px, 300px);
    gap: 28px;
    padding-left: 34px;
    padding-right: 34px;
  }
}

@media (max-width: 768px) {
  .nav-root {
    height: auto;
    flex-direction: row;
    align-items: center;
    padding: 0.6rem 1.25rem;
  }

  .nav-right {
    display: none;
  }

  .mega-menu,
  .nav-backdrop {
    display: none;
  }

  /* show hamburger on mobile */
  .nav-toggle {
    display: inline-flex;
  }
}
</style>
