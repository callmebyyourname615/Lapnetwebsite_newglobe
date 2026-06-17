<script setup>
import { ref, watch, onMounted, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { gsap } from 'gsap'

const route = useRoute()

const menuItems = [
  {
    label: 'ຜະລິດຕະພັນ ແລະ ການບໍລິການ',
    children: [
      { label: 'ຜະລິດຕະພັນ ແລະ ການບໍລິການ ທັງໝົດ', to: '/products_service/allproduct', icon: 'ri-layout-grid-fill' },
      { label: 'ກວດຍອດເງິນຂ້າມທະນາຄານຜ່ານຕູ້ ATM', to: '/products_service/atm-inquiry', icon: 'ri-qr-scan-2-line' },
      { label: 'ຖອນເງິນສົດຂ້າມທະນາຄານຜ່ານຕູ້ ATM', to: '/products_service/atm-cash-withdraw', icon: 'fa-solid fa-money-bill-transfer' },
      { label: 'ໂອນເງິນຂ້າມທະນາຄານຜ່ານຕູ້ ATM', to: '/products_service/atm-transfer', icon: 'fa-solid fa-right-left' },
      { label: 'ໂອນເງິນຂ້າມທະນາຄານເທິງມືຖື', to: '/products_service/mobile-transfer', icon: 'fa-solid fa-mobile-screen' },
      { label: 'ຊຳລະຂ້າມທະນາຄານຜ່ານ LAPNet', to: '/products_service/qr-payment', icon: 'fa-solid fa-money-bill-wave' },
      { label: 'ຊຳລະຂ້າມແດນຜ່ານ QR CODE', to: '/products_service/crossborder', icon: 'fa-solid fa-qrcode' },
    ],
  },
  {
    label: 'ສະມາຊິກ',
    children: [
      { label: 'ສະມາຊິກລະບົບບັດທະນາຄານຮ່ວມກັນ', to: '/member/membercardATM', icon: 'fa-solid fa-credit-card' },
      { label: 'ສະມາຊິກລະບົບຊຳລະຂ້າມທະນາຄານເທິງມືຖື', to: '/member/mobile_banking', icon: 'fa-solid fa-mobile-screen-button' },
      { label: 'ສະມາຊິກລະບົບຊຳລະຂ້າມແດນຜ່ານ QR Code', to: '/member/crossborder', icon: 'fa-solid fa-earth-asia' },
    ],
  },
  { label: 'ຂ່າວ ແລະ ກິດຈະກຳ', to: '/bloggrid' },
  { label: 'ຮ່ວມງານກັບເຮົາ', to: '/joinus' },
  {
    label: 'ກ່ຽວກັບພວກເຮົາ',
    children: [
      { label: 'ວິໄສທັດ ແລະ ພາລະກິດ', to: '/aboutus/vision', icon: 'fa-solid fa-lightbulb' },
      { label: 'ພາລະບົດບາດ', to: '/aboutus/role', icon: 'fa-solid fa-list-check' },
      { label: 'ຄວາມເປັນມາ', to: '/aboutus/history', icon: 'fa-solid fa-timeline' },
      { label: 'ສະພາບໍລິຫານ', to: '/aboutus/board_director', icon: 'fa-solid fa-users-between-lines' },
      { label: 'ໂຄງຮ່າງການຈັດຕັ້ງ', to: '/aboutus/companystructureimage', icon: 'fa-solid fa-sitemap' },
    ],
  },
  { label: 'ຕິດຕໍ່ພວກເຮົາ', to: '/contactus' },
]

const isDesktop = () => typeof window !== 'undefined' && window.innerWidth > 768

const activeMenu = ref(null)
const megaPanelRef = ref(null)
const megaInnerRef = ref(null)
let megaCloseTimer = null
let firstOpen = true

const cancelClose = () => {
  if (megaCloseTimer) { clearTimeout(megaCloseTimer); megaCloseTimer = null }
}

const handleGroupEnter = (item) => {
  if (!isDesktop()) return
  cancelClose()
  if (!item?.children?.length) { activeMenu.value = null; return }
  activeMenu.value = item
}
const handleGroupLeave = () => {
  if (!isDesktop()) return
  cancelClose()
  megaCloseTimer = setTimeout(() => { activeMenu.value = null }, 140)
}
const handlePanelEnter = () => cancelClose()
const handlePanelLeave = () => {
  cancelClose()
  megaCloseTimer = setTimeout(() => { activeMenu.value = null }, 120)
}

watch(activeMenu, async (item) => {
  const panel = megaPanelRef.value
  const inner = megaInnerRef.value
  if (!panel) return
  if (!item) {
    gsap.to(panel, {
      autoAlpha: 0, height: 0, duration: 0.32, ease: 'power3.inOut',
      overwrite: 'auto',
      onComplete: () => { gsap.set(panel, { pointerEvents: 'none' }); firstOpen = true },
    })
    return
  }
  await nextTick()
  const targetH = inner ? inner.offsetHeight : 'auto'
  gsap.set(panel, { pointerEvents: 'auto' })
  gsap.to(panel, {
    autoAlpha: 1, height: targetH,
    duration: firstOpen ? 0.36 : 0.28, ease: 'power3.out',
    overwrite: 'auto',
  })
  const links = panel.querySelectorAll('.hmega-link')
  if (links.length) {
    gsap.fromTo(links, { y: 14, opacity: 0 }, {
      y: 0, opacity: 1, duration: 0.4, stagger: 0.035,
      ease: 'power3.out', overwrite: 'auto',
    })
  }
  firstOpen = false
})

watch(() => route.fullPath, () => { activeMenu.value = null })

onMounted(() => {
  if (megaPanelRef.value) {
    gsap.set(megaPanelRef.value, { autoAlpha: 0, height: 0, pointerEvents: 'none' })
  }
})
</script>

<template>
  <nav class="hmega-nav">
    <div
      v-for="(item, i) in menuItems"
      :key="i"
      class="hmega-group"
      @mouseenter="handleGroupEnter(item)"
      @mouseleave="handleGroupLeave"
    >
      <button
        v-if="item.children"
        type="button"
        class="hmega-trigger"
        :class="{ 'is-active': activeMenu === item }"
      >
        {{ item.label }}
      </button>
      <RouterLink v-else class="hmega-trigger" :to="item.to">
        {{ item.label }}
      </RouterLink>
    </div>
  </nav>

  <div
    ref="megaPanelRef"
    class="hmega-panel"
    @mouseenter="handlePanelEnter"
    @mouseleave="handlePanelLeave"
  >
    <div ref="megaInnerRef" class="hmega-inner">
      <div v-if="activeMenu" class="hmega-content">
        <p class="hmega-eyebrow">{{ activeMenu.label }}</p>
        <ul class="hmega-grid">
          <li v-for="(c, ci) in activeMenu.children" :key="ci">
            <RouterLink class="hmega-link" :to="c.to">
              <i v-if="c.icon" :class="['hmega-icon', c.icon]" aria-hidden="true"></i>
              <span class="hmega-label">{{ c.label }}</span>
              <span class="hmega-arrow" aria-hidden="true">›</span>
            </RouterLink>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
.hmega-nav {
  display: flex;
  align-items: center;
  gap: 1.4rem;
}
.hmega-group { position: relative; }
.hmega-trigger {
  position: relative;
  display: inline-flex;
  align-items: center;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0.4rem 0.2rem;
  color: rgba(220, 232, 255, 0.88);
  font-size: 0.95rem;
  font-weight: 500;
  letter-spacing: 0.01em;
  text-decoration: none;
  transition: color 0.25s;
}
.hmega-trigger:hover,
.hmega-trigger.is-active { color: #ffffff; }
.hmega-trigger.is-active::after {
  content: "";
  position: absolute;
  left: 50%;
  bottom: -8px;
  width: 22px;
  height: 2px;
  border-radius: 2px;
  background: linear-gradient(90deg, #0078ff, #00c6ff);
  transform: translateX(-50%);
}

.hmega-panel {
  position: fixed;
  top: 0;
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
.hmega-inner {
  max-width: 1180px;
  margin: 0 auto;
  padding: 6.5rem 2.5rem 2.5rem;
}
.hmega-content { display: flex; flex-direction: column; gap: 1.25rem; }
.hmega-eyebrow {
  margin: 0;
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: #94a3c4;
}
.hmega-grid {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.4rem 1.5rem;
}
@media (min-width: 1100px) {
  .hmega-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
}
.hmega-link {
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
  transition: background 0.25s, color 0.25s, transform 0.25s;
}
.hmega-link:hover {
  background: linear-gradient(90deg, rgba(0, 120, 255, 0.18), rgba(0, 120, 255, 0));
  color: #ffffff;
  transform: translateX(4px);
}
.hmega-link:hover .hmega-arrow { opacity: 1; transform: translateX(2px); color: #00c6ff; }
.hmega-icon {
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
.hmega-link:hover .hmega-icon { transform: scale(1.06); }
.hmega-label { flex: 1; min-width: 0; }
.hmega-arrow {
  font-size: 1.2rem;
  color: rgba(180, 220, 255, 0.4);
  opacity: 0;
  transition: opacity 0.25s, transform 0.25s, color 0.25s;
}

@media (max-width: 768px) {
  .hmega-nav, .hmega-panel { display: none; }
}
</style>
