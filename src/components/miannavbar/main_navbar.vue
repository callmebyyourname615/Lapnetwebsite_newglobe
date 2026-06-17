<script setup>
import { ref, onMounted, watch, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { gsap } from 'gsap'
import sidebar from '../sidebar/sidebar.vue'
import overlaynavbar from './overlaynavbar.vue'

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

// ✅ เมนู + route แยกแต่ละอันชัดเจน
const menuItems = [
  {
    label: 'ຜະລິດຕະພັນ ແລະ ການບໍລິການ',
    to: '/products',
    children: [
      {
        label: 'ຜະລິດຕະພັນ ແລະ ການບໍລິການ ທັງໝົດ',
        to: '/products_service/allproduct',
        icon: 'ri-layout-grid-fill'
      },
      {
        label: 'ກວດຍອດເງິນຂ້າມທະນາຄານຜ່ານຕູ້ ATM',
        to: '/products_service/atm-inquiry',
        icon: 'ri-qr-scan-2-line'
      },
      {
        label: 'ຖອນເງິນສົດຂ້າມທະນາຄານຜ່ານຕູ້ ATM',
        to: '/products_service/atm-cash-withdraw',
        icon: 'fa-solid fa-money-bill-transfer'
      },
      {
        label: 'ໂອນເງິນຂ້າມທະນາຄານຜ່ານຕູ້ ATM',
        to: '/products_service/atm-transfer',
        icon: 'fa-solid fa-right-left'
      },
      {
        label: 'ໂອນເງິນຂ້າມທະນາຄານເທິງມືຖື',
        to: '/products_service/mobile-transfer',
        icon: 'fa-solid fa-mobile-screen'
      },
      {
        label: 'ຊຳລະຂ້າມທະນາຄານຜ່ານ LAPNet',
        to: '/products_service/qr-payment',
        icon: 'fa-solid fa-money-bill-wave'
      },
      {
        label: 'ຊຳລະຂ້າມແດນຜ່ານ QR CODE  ',
        to: '/products_service/crossborder',
        icon: 'fa-solid fa-qrcode'
      }
    ]
  },
  {
    label: 'ສະມາຊິກ',
    to: '/members',
    children: [
      {
        label: 'ສະມາຊິກລະບົບບັດທະນາຄານຮ່ວມກັນ',
        to: '/member/membercardATM',
        icon: 'fa-solid fa-credit-card'
      },
      {
        label: 'ສະມາຊິກລະບົບຊຳລະຂ້າມທະນາຄານເທິງມືຖື',
        to: '/member/mobile_banking',
        icon: 'fa-solid fa-mobile-screen-button'
      },
      {
        label: 'ສະມາຊິກລະບົບຊຳລະຂ້າມແດນຜ່ານ QR Code',
        to: '/member/crossborder',
        icon: 'fa-solid fa-earth-asia'
      }
    ]
  },
  { label: 'ຂ່າວ ແລະ ກິດຈະກຳ', to: '/bloggrid' },
  { label: 'ຮ່ວມງານກັບເຮົາ', to: '/joinus' },
  {
    label: 'ກ່ຽວກັບພວກເຮົາ',
    to: '/about',
    children: [
      { label: 'ວິໄສທັດ ແລະ ພາລະກິດ', to: '/aboutus/vision', icon: 'fa-solid fa-lightbulb' },
      { label: 'ພາລະບົດບາດ', to: '/aboutus/role', icon: 'fa-solid fa-list-check' },
      { label: 'ຄວາມເປັນມາ', to: '/aboutus/history', icon: 'fa-solid fa-timeline' },
      {
        label: 'ສະພາບໍລິຫານ',
        to: '/aboutus/board_director',
        icon: 'fa-solid fa-users-between-lines'
      },
      {
        label: 'ໂຄງຮ່າງການຈັດຕັ້ງ',
        to: '/aboutus/companystructureimage',
        icon: 'fa-solid fa-sitemap'
      }
    ]
  },
  { label: 'ຕິດຕໍ່ພວກເຮົາ', to: '/contactus', isCta: true }
]

const isDesktop = () => {
  if (typeof window === 'undefined') return true
  return window.innerWidth > 768
}

const openSidebarFromNav = () => {
  sidebarRef.value?.toggleSidebar()
}

/** =========================
 * ✅ FIX HOVER BUG (stuck)
 * - ป้องกัน dropdown ค้าง / invisible overlay block
 * - ปิด dropdown เก่าทันทีเมื่อไป hover อันใหม่
 * - ใช้ pointer-events none ตอนปิด, auto ตอนเปิด
 * - overwrite auto + killTweens กัน tween ซ้อน
 * - ใส่ delay เล็กน้อยกันหลุด gap
 * ========================= */
const openDropdownEl = ref(null)
const closeTimers = new WeakMap()

const clearCloseTimer = (dropdown) => {
  const t = closeTimers.get(dropdown)
  if (t) {
    clearTimeout(t)
    closeTimers.delete(dropdown)
  }
}

const openDropdown = (dropdown, items) => {
  if (!dropdown) return

  clearCloseTimer(dropdown)

  gsap.killTweensOf(dropdown)
  gsap.killTweensOf(items)

  // เปิดแล้วค่อยให้รับเมาส์
  gsap.set(dropdown, { pointerEvents: 'auto' })

  gsap.to(dropdown, {
    autoAlpha: 1,
    y: 0,
    scale: 1,
    duration: 0.25,
    ease: 'power3.out',
    overwrite: 'auto'
  })

  if (items?.length) {
    gsap.fromTo(
      items,
      { x: -10, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 0.22,
        stagger: 0.04,
        ease: 'back.out(1.7)',
        overwrite: 'auto'
      }
    )
  }
}

const closeDropdown = (dropdown) => {
  if (!dropdown) return

  clearCloseTimer(dropdown)

  gsap.killTweensOf(dropdown)

  gsap.to(dropdown, {
    autoAlpha: 0,
    y: -8,
    scale: 0.98,
    duration: 0.18,
    ease: 'power2.in',
    overwrite: 'auto',
    onComplete: () => {
      // ปิดแล้ว “ห้ามทับ” เมนูอื่น
      gsap.set(dropdown, { pointerEvents: 'none' })
    }
  })
}

/* =========================================================================
 * Apple-style shared MEGA panel
 * - One single panel below the navbar that morphs to show the active group.
 * - Smooth GSAP height + fade + content stagger.
 * - Closes when the mouse leaves both the trigger AND the panel.
 * ========================================================================= */
const activeMenu = ref(null)
const megaPanelRef = ref(null)
const megaInnerRef = ref(null)
let megaCloseTimer = null
let firstOpen = true

const cancelMegaClose = () => {
  if (megaCloseTimer) {
    clearTimeout(megaCloseTimer)
    megaCloseTimer = null
  }
}

const openMega = (item) => {
  cancelMegaClose()
  if (!item?.children?.length) {
    closeMega()
    return
  }
  activeMenu.value = item
}

const closeMega = () => {
  activeMenu.value = null
}

const handleGroupEnter = (item) => {
  if (!isDesktop()) return
  openMega(item)
}

const handleGroupLeave = () => {
  if (!isDesktop()) return
  cancelMegaClose()
  megaCloseTimer = setTimeout(closeMega, 140)
}

const handlePanelEnter = () => {
  cancelMegaClose()
}

const handlePanelLeave = () => {
  cancelMegaClose()
  megaCloseTimer = setTimeout(closeMega, 120)
}

watch(activeMenu, async (item) => {
  const panel = megaPanelRef.value
  const inner = megaInnerRef.value
  if (!panel) return

  if (!item) {
    gsap.to(panel, {
      autoAlpha: 0,
      height: 0,
      duration: 0.32,
      ease: 'power3.inOut',
      overwrite: 'auto',
      onComplete: () => {
        gsap.set(panel, { pointerEvents: 'none' })
        firstOpen = true
      },
    })
    return
  }

  await nextTick()
  // Measure content height for `height: auto` animation.
  const targetHeight = inner ? inner.offsetHeight : 'auto'

  gsap.set(panel, { pointerEvents: 'auto' })
  gsap.to(panel, {
    autoAlpha: 1,
    height: targetHeight,
    duration: firstOpen ? 0.36 : 0.28,
    ease: 'power3.out',
    overwrite: 'auto',
  })

  const links = panel.querySelectorAll('.mega-link')
  if (links.length) {
    gsap.fromTo(
      links,
      { y: 14, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.4,
        stagger: 0.035,
        ease: 'power3.out',
        overwrite: 'auto',
      }
    )
  }
  firstOpen = false
})

// ✅ เปลี่ยนหน้าแล้วปิด dropdown / mega-panel เสมอ กันค้าง
watch(
  () => route.fullPath,
  () => {
    if (openDropdownEl.value) {
      closeDropdown(openDropdownEl.value)
      openDropdownEl.value = null
    }
    closeMega()
  }
)

onMounted(() => {
  // ✅ กัน state ค้างตั้งแต่เริ่ม: ซ่อน + ห้ามรับเมาส์
  gsap.set('.dropdown-menu', { autoAlpha: 0, y: -8, scale: 0.98, pointerEvents: 'none' })
  if (megaPanelRef.value) {
    gsap.set(megaPanelRef.value, { autoAlpha: 0, height: 0, pointerEvents: 'none' })
  }

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

    <!-- RIGHT: DESKTOP NAV (Apple-style triggers) -->
    <nav class="nav-right">
      <div
        v-for="(item, index) in menuItems"
        :key="index"
        class="nav-group"
        @mouseenter="handleGroupEnter(item)"
        @mouseleave="handleGroupLeave"
      >
        <button
          v-if="item.children"
          class="nav-item"
          type="button"
          :class="{ 'nav-cta': item.isCta, 'has-dropdown': true, 'is-active': activeMenu === item }"
        >
          {{ item.label }}
        </button>

        <RouterLink
          v-else
          class="nav-item"
          :class="{ 'nav-cta': item.isCta }"
          :to="item.to"
        >
          {{ item.label }}
        </RouterLink>
      </div>
    </nav>
  </header>

  <!-- ===== Apple-style MEGA PANEL ===== -->
  <div
    ref="megaPanelRef"
    class="mega-panel"
    @mouseenter="handlePanelEnter"
    @mouseleave="handlePanelLeave"
  >
    <div ref="megaInnerRef" class="mega-inner">
      <div v-if="activeMenu" class="mega-content">
        <p class="mega-eyebrow">{{ activeMenu.label }}</p>
        <ul class="mega-grid">
          <li
            v-for="(child, cIndex) in activeMenu.children"
            :key="cIndex"
            class="mega-link-wrap"
          >
            <RouterLink class="mega-link" :to="child.to">
              <i
                v-if="child.icon"
                :class="['mega-icon', child.icon]"
                aria-hidden="true"
              ></i>
              <span class="mega-label">{{ child.label }}</span>
              <span class="mega-arrow" aria-hidden="true">›</span>
            </RouterLink>
          </li>
        </ul>
      </div>
    </div>
  </div>

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

.nav-group:hover .dropdown-arrow {
  transform: rotate(180deg);
  opacity: 1;
}

/* Hover effects */
.nav-item:hover {
  background: radial-gradient(circle at top, rgba(40, 130, 255, 0.35), transparent 65%);
  color: #ffffff;
  text-shadow: 0 0 8px rgba(120, 200, 255, 0.6);
}

/* DROPDOWN MENU */
.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  min-width: 240px;
  padding-top: 15px;

  /* ✅ สำคัญมาก กัน invisible overlay block */
  pointer-events: none;

  /* (ปล่อยให้ GSAP คุม autoAlpha) */
  visibility: hidden;
  opacity: 0;

  z-index: 60;
}

.dropdown-list {
  list-style: none;
  padding: 0;
  margin: 0;
  width: 400px;
  background: rgba(5, 11, 27, 0.95);
  border: 1px solid rgba(80, 170, 255, 0.5);
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.8), 0 0 20px rgba(0, 80, 200, 0.3);
  backdrop-filter: blur(20px);
  overflow: hidden;
}

.dropdown-item {
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}
.dropdown-item:last-child {
  border-bottom: none;
}

/* ✅ Font Awesome icon in dropdown */
.dropdown-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  margin-right: 10px;
  font-size: 0.85rem;
  opacity: 0.9;
}

/* ใช้กับ RouterLink */
.dropdown-link {
  display: block;
  padding: 12px 20px;
  color: #b0d0ff;
  text-decoration: none;
  font-size: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
}

.dropdown-link:hover {
  background: linear-gradient(90deg, rgba(0, 60, 150, 0.4), transparent);
  color: #fff;
  padding-left: 28px;
  text-shadow: 0 0 5px rgba(0, 200, 255, 0.8);
}

.dropdown-link:hover .dropdown-icon {
  transform: translateX(2px);
}

.dropdown-link::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background: #00d4ff;
  opacity: 0;
  transition: opacity 0.2s;
}

.dropdown-link:hover::before {
  opacity: 1;
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

  /* show hamburger on mobile */
  .nav-toggle {
    display: inline-flex;
  }
}

/* =========================================================================
   Apple-style MEGA panel
   ========================================================================= */
.mega-panel {
  position: fixed;
  top: 11vh; /* sits right under the nav-root */
  left: 0;
  right: 0;
  z-index: 49;
  height: 0;
  overflow: hidden;
  visibility: hidden;
  opacity: 0;
  pointer-events: none;
  background: rgba(5, 11, 27, 0.92);
  backdrop-filter: blur(22px) saturate(160%);
  -webkit-backdrop-filter: blur(22px) saturate(160%);
  border-top: 1px solid rgba(80, 170, 255, 0.16);
  border-bottom: 1px solid rgba(80, 170, 255, 0.16);
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.45);
}

.mega-inner {
  max-width: 1180px;
  margin: 0 auto;
  padding: 2.25rem 2.5rem 2.5rem;
}

.mega-content {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.mega-eyebrow {
  margin: 0;
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: #94a3c4;
}

.mega-grid {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.4rem 1.5rem;
}
@media (min-width: 1100px) {
  .mega-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

.mega-link-wrap { margin: 0; }

.mega-link {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.85rem;
  padding: 0.85rem 1rem;
  border-radius: 14px;
  color: #d3e1ff;
  text-decoration: none;
  font-size: 1.02rem;
  font-weight: 500;
  letter-spacing: 0.005em;
  line-height: 1.3;
  transition: background 0.25s, color 0.25s, transform 0.25s;
}
.mega-link:hover {
  background: linear-gradient(90deg, rgba(0, 120, 255, 0.18), rgba(0, 120, 255, 0));
  color: #ffffff;
  transform: translateX(4px);
}
.mega-link:hover .mega-arrow {
  opacity: 1;
  transform: translateX(2px);
  color: #00c6ff;
}

.mega-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 12px;
  background: linear-gradient(135deg, rgba(0, 51, 171, 0.4), rgba(0, 198, 255, 0.18));
  border: 1px solid rgba(96, 165, 250, 0.28);
  color: #b3e5ff;
  font-size: 0.95rem;
  flex-shrink: 0;
  transition: transform 0.25s;
}
.mega-link:hover .mega-icon {
  transform: scale(1.06);
}

.mega-label {
  flex: 1;
  min-width: 0;
}

.mega-arrow {
  font-size: 1.2rem;
  color: rgba(180, 220, 255, 0.4);
  opacity: 0;
  transition: opacity 0.25s, transform 0.25s, color 0.25s;
}

/* Active-trigger underline (subtle hint while the panel is open) */
.nav-item.is-active {
  color: #ffffff;
}
.nav-item.is-active::after {
  content: "";
  position: absolute;
  left: 50%;
  bottom: -2px;
  width: 24px;
  height: 2px;
  border-radius: 2px;
  background: linear-gradient(90deg, #0078ff, #00c6ff);
  transform: translateX(-50%);
}

@media (max-width: 768px) {
  .mega-panel { display: none; }
}
</style>
