<script setup>
import { defineProps, computed, ref, onMounted } from "vue";
import product4_footerlogomember_tab2 from "../../components/footer/logomemberfooter/product4_footerlogomember_tab2.vue";
import product4_footerlogomember from "../../components/footer/logomemberfooter/product4_footerlogomember.vue";
import product5tech from "../techbenetfit/product5tech.vue";
import tablefee_tab2 from "../../components/tablefee/tablefee_tab2.vue";
import hero_sectionproduct4_tab2 from "../../Views/products/product_herosection/hero_sectionproduct4_tab2.vue";

const props = defineProps({
  memberLogos: { type: Array, default: () => [] },
});

/** ===== Fetch member logos from API and match by bank code (app) ===== */
const API_BASE = String(import.meta.env.VITE_API_BASE_URL || "").trim().replace(/\/+$/, "");
const ASSET_BASE = API_BASE.endsWith("/api") ? API_BASE.slice(0, -4) : API_BASE;

function resolveUrl(src) {
  const s = String(src || "").trim();
  if (!s) return "";
  if (/^data:|^blob:|^https?:\/\//i.test(s)) return s;
  return ASSET_BASE + (s.startsWith("/") ? s : "/" + s);
}

const apiMembers = ref([]);

const fetchMembers = async () => {
  if (!API_BASE) return;
  try {
    const url = API_BASE.endsWith("/api") ? `${API_BASE}/members` : `${API_BASE}/api/members`;
    const res = await fetch(url, { headers: { Accept: "application/json" } });
    if (!res.ok) throw new Error(res.statusText);
    const json = await res.json();
    const list = Array.isArray(json) ? json : json?.data || json?.members || [];
    apiMembers.value = Array.isArray(list) ? list : [];
  } catch (e) {
    console.error("Failed to load members for FX footer:", e);
    apiMembers.value = [];
  }
};

onMounted(fetchMembers);

const normCode = (s) => String(s || "").toUpperCase().replace(/\s+/g, "").trim();

/** Match each MEMBER_BANKS entry to an API record by `Bankcode` (compared to bank.app).
 *  Use API `image_url` (absolute URL) when matched, otherwise fall back to local /logos/*. */
const serviceLogos = computed(() => {
  return MEMBER_BANKS.map((bank) => {
    const code = normCode(bank.app);
    const match = apiMembers.value.find((m) => normCode(m?.Bankcode) === code);
    const rawSrc = match?.image_url ?? match?.image ?? bank.logo;
    return { src: resolveUrl(rawSrc) || bank.logo, alt: bank.app || bank.name };
  });
});

/** ===== Orbiting integrations hero (ported from orbiting-integrations) ===== */
// Two innermost rings have no logos (only the guide circles).
// Explicit angles per ring give an organic Grafana-style spread
// (icons don't line up across rings, evenly distributed but not clock-like).
const ORBIT_RINGS_BASE = [
  { size: 420, duration: 60, direction: "clockwise", angles: [], badge: 70 },
  { size: 620, duration: 75, direction: "reverse", angles: [], badge: 68 },
  { size: 820, duration: 90, direction: "clockwise", angles: [-95, -25, 55, 130, 215], badge: 66 },
  { size: 1050, duration: 105, direction: "reverse", angles: [-160, -110, -40, 25, 95, 160, 220], badge: 62 },
  { size: 1280, duration: 120, direction: "clockwise", angles: [-170, -130, -85, -15, 35, 80, 150, 205], badge: 58 },
  { size: 1500, duration: 140, direction: "reverse", angles: [-155, -100, -50, 15, 70, 130, 190], badge: 56 },
  { size: 1750, duration: 160, direction: "clockwise", angles: [-145, -75, -10, 60, 125, 195, 255], badge: 52 },
];

/** ===== Member banks participating in the program ===== */
const MEMBER_BANKS = [
  { name: "ທະນາຄານການຄ້າຕ່າງປະເທດລາວ ມະຫາຊົນ", app: "BCEL ", logo: "/logos/logo1.png" },
  { name: "ທະນາຄານ ສົ່ງເສີມກະສິກຳ ຈຳກັດ", app: "APB", logo: "/logos/logo3.png" },
  { name: "ທະນາຄານ ຮ່ວມພັດທະນາ", app: "JDB ", logo: "/logos/logo4.png" },
  { name: "ທະນາຄານ ຮ່ວມທຸລະກິດ ລາວ - ຫວຽດ", app: "LVB ", logo: "/logos/logo6.png" },
  { name: "ທະນາຄານ ບີໄອຊີ ລາວ ຈຳກັດ", app: "BIC ", logo: "/logos/logo11.png" },
  { name: "ທະນາຄານ ເອສທີ ຈຳກັດ", app: "STB", logo: "/logos/logo17.png" },
  { name: "ທະນາຄານ ພົງສະຫວັນ", app: "PSVB", logo: "/logos/logo15.png" },
  { name: "ທະນາຄານ ອິນໂດຈີນ ຈຳກັດ", app: "IB", logo: "/logos/logo10.png" },
  { name: "ທະນາຄານ ລາວຝຣັ່ງ ຈຳກັດ", app: "BFL ", logo: "/logos/logo12.png" },
  { name: "ທະນາຄານ ຊາຄອມແບັງ ລາວ", app: "Sacom", logo: "/logos/logo13.png" },
];

const FALLBACK_LOGOS = [
  { src: "/logos/logo1.png", alt: "Bank 1" },
  { src: "/logos/logo3.png", alt: "Bank 3" },
  { src: "/logos/logo4.png", alt: "Bank 4" },
  { src: "/logos/logo6.png", alt: "Bank 6" },
  { src: "/logos/logo11.png", alt: "Bank 11" },
  { src: "/logos/logo17.png", alt: "Bank 17" },
  { src: "/logos/logo10.png", alt: "Bank 10" },
  { src: "/logos/logo15.png", alt: "Bank 15" },
  { src: "/logos/logo12.png", alt: "Bank 12" },
  { src: "/logos/logo13.png", alt: "Bank 13" },
];

const orbitRings = computed(() => {
  const pool = FALLBACK_LOGOS;
  let cursor = 0;
  return ORBIT_RINGS_BASE.map((ring) => {
    const icons = ring.angles.map((angle) => {
      const logo = pool[cursor++ % pool.length];
      return { angle, logo, opacity: 1, badge: ring.badge };
    });
    return { ...ring, icons };
  });
});

function ringMotionStyle(ring) {
  return {
    width: ring.size + "px",
    height: ring.size + "px",
    animationDuration: ring.duration + "s",
  };
}

function ringRootStyle(ring) {
  return { width: ring.size + "px", height: ring.size + "px" };
}

function pointStyle(ic, ring) {
  return {
    transform: `rotate(${ic.angle}deg) translateX(${ring.size / 2}px) rotate(${-ic.angle}deg)`,
  };
}

function badgeStyle(ic, ring) {
  return {
    width: ic.badge + "px",
    height: ic.badge + "px",
    opacity: ic.opacity,
    animationDuration: ring.duration + "s",
  };
}

const TILE_HEIGHT = 1000;

const COLUMN_X = {
  left: "6%",
  center: "38%",
  right: "62%",
  farRight: "84%",
};

const SIZE_PX = { small: 64, medium: 80, large: 104 };

const CLOUD_LOGOS = [
  { src: "/logos/logo1.png", alt: "Bank 1", column: "left", top: 40, size: "small", delay: 0 },
  { src: "/logos/logo2.png", alt: "Bank 2", column: "center", top: 80, size: "large", delay: 0.3 },
  { src: "/logos/logo3.png", alt: "Bank 3", column: "right", top: 20, size: "large", delay: 0.1 },
  { src: "/logos/logo4.png", alt: "Bank 4", column: "farRight", top: 160, size: "medium", delay: 0.8 },
  { src: "/logos/logo5.png", alt: "Bank 5", column: "left", top: 220, size: "medium", delay: 0.6 },
  { src: "/logos/logo6.png", alt: "Bank 6", column: "center", top: 300, size: "small", delay: 1.2 },
  { src: "/logos/logo7.png", alt: "Bank 7", column: "right", top: 240, size: "large", delay: 1.5 },
  { src: "/logos/logo8.png", alt: "Bank 8", column: "farRight", top: 340, size: "small", delay: 0.4 },
  { src: "/logos/logo9.png", alt: "Bank 9", column: "left", top: 400, size: "large", delay: 1.2 },
  { src: "/logos/logo10.png", alt: "Bank 10", column: "center", top: 460, size: "medium", delay: 0.9 },
  { src: "/logos/logo11.png", alt: "Bank 11", column: "right", top: 440, size: "small", delay: 1.0 },
  { src: "/logos/logo12.png", alt: "Bank 12", column: "farRight", top: 500, size: "large", delay: 1.8 },
  { src: "/logos/logo13.png", alt: "Bank 13", column: "left", top: 580, size: "small", delay: 2.1 },
  { src: "/logos/logo14.png", alt: "Bank 14", column: "center", top: 620, size: "large", delay: 1.5 },
  { src: "/logos/logo15.png", alt: "Bank 15", column: "right", top: 620, size: "medium", delay: 0.7 },
  { src: "/logos/logo16.png", alt: "Bank 16", column: "farRight", top: 680, size: "small", delay: 2.4 },
  { src: "/logos/logo17.png", alt: "Bank 17", column: "left", top: 760, size: "medium", delay: 1.8 },
  { src: "/logos/logo18.png", alt: "Bank 18", column: "center", top: 780, size: "small", delay: 2.7 },
  { src: "/logos/logo19.png", alt: "Bank 19", column: "right", top: 800, size: "medium", delay: 1.9 },
  { src: "/logos/logo20.png", alt: "Bank 20", column: "farRight", top: 860, size: "large", delay: 0.5 },
];

function bubbleStyle(logo) {
  const sizePx = SIZE_PX[logo.size];
  const isLarge = logo.size === "large";
  const isMedium = logo.size === "medium";
  return {
    position: "absolute",
    left: COLUMN_X[logo.column],
    top: logo.top + "px",
    width: sizePx + "px",
    height: sizePx + "px",
    "--float-delay": logo.delay + "s",
    "--float-dur": (4 + (logo.delay % 2)) + "s",
    boxShadow: isLarge
      ? "0 18px 40px rgba(15,23,42,0.14), 0 3px 8px rgba(15,23,42,0.06)"
      : "0 12px 28px rgba(15,23,42,0.12), 0 2px 6px rgba(15,23,42,0.06)",
    zIndex: isLarge ? 3 : isMedium ? 2 : 1,
  };
}
</script>

<template>
  <div class="tab2-root">
    <div class="productdiscription">
      <hero_sectionproduct4_tab2 />
    </div>



    <div class="condition_for_use">
      <section class="orbit-section">
        <!-- Orbit system -->
        <div class="orbit-system" aria-hidden="true">
          <div v-for="(ring, ri) in orbitRings" :key="'ring-' + ri" class="orbit-root" :style="ringRootStyle(ring)">
            <div class="orbit-guide"></div>
            <div class="orbit-motion" :class="ring.direction === 'reverse' ? 'spin-ccw' : 'spin-cw'"
              :style="ringMotionStyle(ring)">
              <div v-for="(ic, i) in ring.icons" :key="i" class="orbit-point" :style="pointStyle(ic, ring)">
                <div class="orbit-badge" :class="ring.direction === 'reverse' ? 'counter-ccw' : 'counter-cw'"
                  :style="badgeStyle(ic, ring)">
                  <img :src="ic.logo.src" :alt="ic.logo.alt || 'Member logo'" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Fade edges -->
        <div class="orbit-fade orbit-fade-top"></div>
        <div class="orbit-fade orbit-fade-bottom"></div>
        <div class="orbit-fade orbit-fade-left"></div>
        <div class="orbit-fade orbit-fade-right"></div>

        <!-- Center content -->
        <div class="orbit-content">
          <div class="orbit-spotlight" aria-hidden="true"></div>

          <p class="orbit-kicker">ລະບົບຮອງຮັບການໂອນເງິນລະຫວ່າງ</p>
          <h2 class="orbit-title">
            ບັນຊີສະກຸນເງິນດຽວກັນ
            <span class="orbit-title-accent">ຂ້າມທະນາຄານ</span>
          </h2>

          <ul class="currency-list">
            <li class="currency-item">
              <span class="currency-pair">
                <span class="currency-code">USD</span>
                <i class="fa-solid fa-left-right currency-swap"></i>
                <span class="currency-code">USD</span>
              </span>
              <span class="currency-desc">
                ໂອນຈາກບັນຊີສະກຸນເງິນໂດລາ ຫາ ບັນຊີສະກຸນເງິນໂດລາ
              </span>
            </li>
            <li class="currency-item">
              <span class="currency-pair">
                <span class="currency-code">THB</span>
                <i class="fa-solid fa-left-right currency-swap"></i>
                <span class="currency-code">THB</span>
              </span>
              <span class="currency-desc">
                ໂອນຈາກບັນຊີສະກຸນເງິນບາດ ຫາ ບັນຊີສະກຸນເງິນບາດ
              </span>
            </li>
          </ul>
        </div>
      </section>
    </div>

    <!-- ===== Limits & Fees Section ===== -->
    <section class="lf-section">
      <div class="lf-inner">
        <header class="lf-head">
        
          <h2 class="lf-title">
            ວົງເງິນ ແລະ
            <span class="lf-title-accent">ອັດຕາຄ່າທຳນຽມ</span>
          </h2>
          <p class="lf-sub">
            ຂໍ້ມູນວົງເງິນທີ່ສາມາດໂອນຕໍ່ຄັ້ງ / ຕໍ່ວັນ
            ແລະ ອັດຕາຄ່າທຳນຽມຂອງແຕ່ລະສະກຸນເງິນ.
          </p>
        </header>

        <div class="lf-grid">
          <!-- LIMITS CARD -->
          <article class="lf-card">
            <div class="lf-card-head">
              <span class="lf-chip">01</span>
              <div>
                <h3 class="lf-card-title">ວົງເງິນໃນການໂອນ </h3>
                <p class="lf-card-sub">ສູງສຸດຕໍ່ຄັ້ງ ແລະ ຕໍ່ວັນ</p>
              </div>
            </div>

            <div class="lf-table" role="table">
              <div class="lf-row lf-row-head" role="row">
                <div role="columnheader">ສະກຸນເງິນ</div>
                <div role="columnheader">ວົງເງິນສູງສຸດ / ຄັ້ງ</div>
                <div role="columnheader">ວົງເງິນສູງສຸດ / ວັນ</div>
              </div>
              <div class="lf-row" role="row">
                <div role="cell"><span class="lf-code">USD</span></div>
                <div role="cell"><strong>1,000</strong> <span class="lf-unit">USD</span></div>
                <div role="cell"><strong>10,000</strong> <span class="lf-unit">USD</span></div>
              </div>
              <div class="lf-row" role="row">
                <div role="cell"><span class="lf-code">THB</span></div>
                <div role="cell"><strong>30,000</strong> <span class="lf-unit">THB</span></div>
                <div role="cell"><strong>300,000</strong> <span class="lf-unit">THB</span></div>
              </div>
            </div>
          </article>

          <!-- FEES CARD -->
          <article class="lf-card">
            <div class="lf-card-head">
              <span class="lf-chip">02</span>
              <div>
                <h3 class="lf-card-title">ອັດຕາຄ່າທຳນຽມ</h3>
                <p class="lf-card-sub">Transaction Fees</p>
              </div>
            </div>

            <div class="lf-rate">
              <span class="lf-rate-value">0.3<small>%</small></span>
              <span class="lf-rate-label">ຂອງມູນຄ່າໂອນ</span>
            </div>

            <div class="lf-table lf-table--fees" role="table">
              <div class="lf-row lf-row-head" role="row">
                <div role="columnheader">ສະກຸນເງິນ</div>
                <div role="columnheader">ຄ່າທຳນຽມເລີ່ມຕົ້ນ</div>
                <div role="columnheader">ຄ່າທຳນຽມສູງສຸດ</div>
              </div>
              <div class="lf-row" role="row">
                <div role="cell"><span class="lf-code">USD</span></div>
                <div role="cell"><strong>1</strong> <span class="lf-unit">USD</span></div>
                <div role="cell"><strong>30</strong> <span class="lf-unit">USD</span></div>
              </div>
              <div class="lf-row" role="row">
                <div role="cell"><span class="lf-code">THB</span></div>
                <div role="cell"><strong>30</strong> <span class="lf-unit">THB</span></div>
                <div role="cell"><strong>1,000</strong> <span class="lf-unit">THB</span></div>
              </div>
            </div>
            <p class="lf-fee-foot">ຕໍ່ທຸລະກຳ</p>
          </article>
        </div>

        <!-- Warning note -->
        <div class="lf-note" role="note">
          <span class="lf-note-icon" aria-hidden="true">
            <i class="fa-solid fa-triangle-exclamation"></i>
          </span>
          <p>
            <strong>ໝາຍເຫດ:</strong>
            ບໍລິການນີ້ແມ່ນເພື່ອການໂອນເງິນລະຫວ່າງບັນຊີບຸກຄົນຫາບຸກຄົນເທົ່ານັ້ນ —
            ບໍ່ສາມາດນຳໃຊ້ຊຳລະກັບບັນດາຮ້ານຄ້າ ຫຼື ສະແກນ QR ຂອງຮ້ານຄ້າໄດ້.
          </p>
        </div>
      </div>
    </section>

    <!-- ===== Member Banks Section ===== -->
    <!-- <section class="mb-section">
      <div class="mb-decoration" aria-hidden="true"></div>

      <div class="mb-inner">
        <header class="mb-head">

          <h2 class="mb-title">
            ທະນາຄານສະມາຊິກ
            <span class="mb-title-accent">ທີ່ເຂົ້າຮ່ວມໂຄງການ</span>
          </h2>
          <p class="mb-sub">
            ປັດຈຸບັນ ທ່ານສາມາດນຳໃຊ້ບໍລິການນີ້ຜ່ານແອັບພລິເຄຊັນ
            ຂອງທະນາຄານສະມາຊິກ ດັ່ງຕໍ່ໄປນີ້:
          </p>
        </header>

        <ul class="mb-grid">
          <li v-for="(bank, i) in MEMBER_BANKS" :key="'bank-' + i" class="mb-card">
            <span class="mb-num">{{ String(i + 1).padStart(2, "0") }}</span>

            <div class="mb-logo">
              <img :src="bank.logo" :alt="bank.app" />
            </div>

            <div class="mb-meta">
              <p class="mb-name">{{ bank.name }}</p>
              <span class="mb-app">{{ bank.app }}</span>
            </div>

            <span class="mb-arrow" aria-hidden="true">
              <i class="fa-solid fa-arrow-up-right-from-square"></i>
            </span>
          </li>
        </ul>
      </div>
    </section> -->


   

    <div class="footermemberproduct1">
      <product4_footerlogomember
        :subtitle="`ບໍລິການໂອນເງິນ ສະກຸນເງິນຕາຕ່າງປະເທດ ຂ້າມທະນາຄານ ເພື່ອເພີ່ມທາງເລືອກ ແລະ ຕອບໂຈດຄວາມຕ້ອງການດ້ານທຸລະກຳການເງິນໃຫ້ມີຄວາມຫຼາກຫຼາຍ ແລະ ຄ່ອງຕົວຂຶ້ນກວ່າເກົ່າ ໂດຍສະເພາະສອງສະກຸນເງິນ ຄື: ສະກຸນເງິນ ໂດລາສະຫະລັດ (USD) ແລະ ສະກຸນເງິນ ບາດ (THB).`"
        :features="[
          `USD <i class='fa-solid fa-left-right currency-swap'></i> USD: ໂອນຈາກບັນຊີສະກຸນເງິນໂດລາ ຫາ ບັນຊີສະກຸນເງິນໂດລາ`,
          `THB <i class='fa-solid fa-left-right currency-swap'></i> THB: ໂອນຈາກບັນຊີສະກຸນເງິນບາດ ຫາ ບັນຊີສະກຸນເງິນບາດ`,
        ]"
        :logos="serviceLogos"
      />
    </div>
  </div>
</template>

<style scoped>
.tab2-root {
  background: #ffffff;
  margin-top: -1.5rem;
}

.tab2-root :deep(.hero) {
  background: transparent !important;
}

.tab2-root :deep(.hero)::before {
  display: none !important;
}

.condition_for_use {
  width: 100%;
  height: auto;
}

/* ===== Orbiting Integrations Section ===== */
.orbit-section {
  position: relative;
  width: 100%;
  overflow: hidden;
  background: #f7f7f8;
  min-height: 720px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.orbit-system {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 1;
}

.orbit-root {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
}

.orbit-guide {
  position: absolute;
  inset: 0;
  border-radius: 9999px;
  border: 1px solid rgba(15, 23, 42, 0.07);
}

.orbit-motion {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  animation-timing-function: linear;
  animation-iteration-count: infinite;
  will-change: transform;
}

.orbit-motion.spin-cw {
  animation-name: lapnetOrbitRotate;
}

.orbit-motion.spin-ccw {
  animation-name: lapnetOrbitRotateReverse;
}

.orbit-point {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 0;
  height: 0;
  transform-origin: 0 0;
}

.orbit-badge {
  position: absolute;
  left: 0;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  background: #ffffff;
  border: 1px solid rgba(15, 23, 42, 0.08);
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.08);
  animation-timing-function: linear;
  animation-iteration-count: infinite;
  will-change: transform;
  overflow: hidden;
}

.orbit-badge.counter-cw {
  animation-name: lapnetOrbitCounterRotate;
}

.orbit-badge.counter-ccw {
  animation-name: lapnetOrbitCounterRotateReverse;
}

.orbit-badge img {
  width: 78%;
  height: 78%;
  object-fit: contain;
}

/* keyframes moved to non-scoped <style> below */

/* Fade overlays */
.orbit-fade {
  position: absolute;
  pointer-events: none;
  z-index: 2;
}

.orbit-fade-top {
  inset: 0 0 auto 0;
  height: 160px;
  background: linear-gradient(to bottom, #f7f7f8, rgba(247, 247, 248, 0));
}

.orbit-fade-bottom {
  inset: auto 0 0 0;
  height: 160px;
  background: linear-gradient(to top, #f7f7f8, rgba(247, 247, 248, 0));
}

.orbit-fade-left {
  inset: 0 auto 0 0;
  width: 128px;
  background: linear-gradient(to right, #f7f7f8, rgba(247, 247, 248, 0));
}

.orbit-fade-right {
  inset: 0 0 0 auto;
  width: 128px;
  background: linear-gradient(to left, #f7f7f8, rgba(247, 247, 248, 0));
}

/* Center content */
.orbit-content {
  position: relative;
  z-index: 5;
  max-width: 720px;
  padding: 6rem 1.5rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.orbit-spotlight {
  position: absolute;
  inset: 50% auto auto 50%;
  width: 520px;
  max-width: 100%;
  height: 260px;
  transform: translate(-50%, -50%);
  border-radius: 9999px;
  background: radial-gradient(closest-side, rgba(247, 247, 248, 0.95), rgba(247, 247, 248, 0));
  z-index: -1;
}

/* eyebrow chip */
.orbit-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.4rem 0.9rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(15, 23, 42, 0.08);
  color: #334155;
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-bottom: 1.25rem;
  box-shadow: 0 4px 14px rgba(15, 23, 42, 0.05);
}

.orbit-eyebrow-dot {
  width: 6px;
  height: 6px;
  border-radius: 999px;
  background: linear-gradient(120deg, #0033ab, #00c6ff);
  box-shadow: 0 0 0 3px rgba(0, 120, 255, 0.15);
}

.orbit-kicker {
  margin: 0 0 0.65rem;
  color: #64748b;
  font-size: clamp(18px, 1vw, 20px);
  font-weight: 500;
  letter-spacing: 0.02em;
  line-height: 1.4;
}

.orbit-title {
  color: #0b1020;
  font-weight: 700;
  font-size: clamp(28px, 3vw, 44px);
  line-height: 1.15;
  letter-spacing: -0.02em;
  margin: 0 0 2rem;
  max-width: 24ch;
  text-wrap: balance;
}

.orbit-title-accent {
  background: linear-gradient(110deg, #0033ab 0%, #0078ff 55%, #00c6ff 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  font-weight: 700;
  white-space: nowrap;
}

.orbit-title-soft {
  color: #0b1020;
  font-weight: 700;
  position: relative;
  display: inline-block;
  padding: 0 0.1em;
}

.orbit-title-soft::after {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0.08em;
  height: 0.18em;
  background: linear-gradient(110deg, rgba(0, 120, 255, 0.18), rgba(0, 198, 255, 0.18));
  border-radius: 2px;
  z-index: -1;
}

.orbit-desc {
  margin-top: 1.5rem;
  color: #475569;
  font-size: clamp(15px, 1.05vw, 17px);
  line-height: 1.7;
  max-width: 56ch;
  letter-spacing: 0.005em;
}

/* ===== Currency support list ===== */
.currency-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  width: 100%;
  max-width: 560px;
}

.currency-item {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  padding: 1rem 1.25rem;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(15, 23, 42, 0.06);
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 16px rgba(15, 23, 42, 0.04);
  text-align: left;
  transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
}

.currency-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 28px rgba(15, 23, 42, 0.08);
  border-color: rgba(0, 120, 255, 0.18);
}

.currency-pair {
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  flex-shrink: 0;
}

.currency-code {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 54px;
  height: 32px;
  padding: 0 0.65rem;
  border-radius: 8px;
  background: linear-gradient(135deg, #0033ab 0%, #0078ff 100%);
  color: #ffffff;
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  box-shadow: 0 6px 14px rgba(0, 51, 171, 0.22);
}

.currency-swap {
  color: #94a3b8;
  font-size: 0.85rem;
}

.currency-desc {
  color: #475569;
  font-size: clamp(14px, 1vw, 15.5px);
  line-height: 1.55;
  letter-spacing: 0.003em;
}

@media (max-width: 560px) {
  .currency-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.6rem;
    padding: 0.9rem 1rem;
  }
}

/* ===== Mobile / small screens — match Grafana reference layout ===== */
@media (max-width: 900px) {
  .orbit-section {
    min-height: 640px;
  }

  .orbit-content {
    padding: 4rem 1.25rem;
    max-width: 92vw;
  }

  .orbit-kicker {
    font-size: 12.5px;
  }

  .orbit-title {
    font-size: clamp(24px, 6.5vw, 32px);
    max-width: 18ch;
    margin-bottom: 1.4rem;
  }

  .currency-list {
    gap: 0.65rem;
  }

  .currency-item {
    padding: 0.8rem 0.95rem;
    gap: 0.85rem;
  }

  .currency-code {
    min-width: 48px;
    height: 28px;
    font-size: 0.74rem;
  }

  .currency-desc {
    font-size: 13.5px;
  }

  /* Fade edges scale down so icons stay visible above/below */
  .orbit-fade-top,
  .orbit-fade-bottom {
    height: 110px;
  }

  .orbit-fade-left,
  .orbit-fade-right {
    width: 64px;
  }
}

@media (max-width: 900px) {

  /* Scale the whole orbit system so rings + badges shrink proportionally,
     keeping the Grafana-style spread above/below the centered content. */
  .orbit-system {
    transform: scale(0.72);
    transform-origin: center center;
  }
}

/* =====================================================================
   Limits & Fees Section
   ===================================================================== */
.lf-section {
  position: relative;
  width: 100%;
  padding: 6rem 1.5rem;
  background:
    radial-gradient(1200px 600px at 80% -10%, rgba(0, 120, 255, 0.07), transparent 60%),
    radial-gradient(900px 500px at -10% 100%, rgba(0, 51, 171, 0.06), transparent 60%),
    #ffffff;
  overflow: hidden;
}

.lf-inner {
  max-width: 1140px;
  margin: 0 auto;
}

/* ----- Header ----- */
.lf-head {
  text-align: center;
  margin-bottom: 3rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.lf-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.4rem 0.9rem;
  border-radius: 999px;
  background: rgba(0, 51, 171, 0.06);
  border: 1px solid rgba(0, 51, 171, 0.12);
  color: #0033ab;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.lf-eyebrow-dot {
  width: 6px;
  height: 6px;
  border-radius: 999px;
  background: linear-gradient(120deg, #0033ab, #00c6ff);
  box-shadow: 0 0 0 3px rgba(0, 120, 255, 0.15);
}

.lf-title {
  margin: 1rem 0 0.75rem;
  font-size: clamp(28px, 3vw, 42px);
  font-weight: 700;
  letter-spacing: -0.02em;
  color: #0b1020;
  line-height: 1.2;
}

.lf-title-accent {
  background: linear-gradient(110deg, #0033ab 0%, #0078ff 55%, #00c6ff 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.lf-sub {
  max-width: 58ch;
  margin: 0;
  color: #64748b;
  font-size: clamp(14.5px, 1vw, 16px);
  line-height: 1.7;
}

/* ----- Grid ----- */
.lf-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

/* ----- Card ----- */
.lf-card {
  position: relative;
  background: #ffffff;
  border: 1px solid rgba(15, 23, 42, 0.07);
  border-radius: 22px;
  padding: 2rem;
  box-shadow:
    0 1px 0 rgba(255, 255, 255, 0.7) inset,
    0 18px 40px rgba(15, 23, 42, 0.05);
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
}

.lf-card::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  padding: 1px;
  background: linear-gradient(135deg, rgba(0, 51, 171, 0.18), rgba(0, 198, 255, 0) 60%);
  -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
}

.lf-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 24px 50px rgba(15, 23, 42, 0.09);
  border-color: rgba(0, 120, 255, 0.18);
}

.lf-card-head {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

.lf-chip {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: linear-gradient(135deg, #0033ab 0%, #0078ff 100%);
  color: #ffffff;
  font-weight: 700;
  font-size: 0.95rem;
  letter-spacing: 0.04em;
  box-shadow: 0 10px 22px rgba(0, 51, 171, 0.25);
  flex-shrink: 0;
}

.lf-card-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 700;
  color: #0b1020;
  letter-spacing: -0.01em;
}

.lf-card-sub {
  margin: 0.15rem 0 0;
  font-size: 0.85rem;
  color: #64748b;
}

/* ----- Limits table ----- */
.lf-table {
  display: grid;
  gap: 0;
  border-radius: 14px;
  overflow: hidden;
  border: 1px solid rgba(15, 23, 42, 0.06);
}

.lf-row {
  display: grid;
  grid-template-columns: minmax(80px, 0.7fr) 1fr 1fr;
  align-items: center;
  padding: 0.95rem 1.1rem;
  font-size: 0.95rem;
  color: #1e293b;
  border-top: 1px solid rgba(15, 23, 42, 0.05);
}

.lf-row:first-child {
  border-top: 0;
}

.lf-row-head {
  background: linear-gradient(180deg, rgba(0, 51, 171, 0.04), rgba(0, 120, 255, 0.02));
  color: #64748b;
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.lf-row strong {
  font-weight: 700;
  font-size: 1.05rem;
  color: #0b1020;
  letter-spacing: -0.01em;
}

.lf-unit {
  margin-left: 0.25rem;
  color: #94a3b8;
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.04em;
}

.lf-code {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 52px;
  height: 30px;
  padding: 0 0.65rem;
  border-radius: 8px;
  background: linear-gradient(135deg, #0033ab 0%, #0078ff 100%);
  color: #fff;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  box-shadow: 0 6px 14px rgba(0, 51, 171, 0.22);
}

.lf-code-sm {
  min-width: 44px;
  height: 26px;
  font-size: 0.7rem;
}

/* ----- Fees rate hero ----- */
.lf-rate {
  display: flex;
  align-items: baseline;
  gap: 0.85rem;
  padding: 1.5rem 1.25rem;
  border-radius: 14px;
  background:
    linear-gradient(120deg, rgba(0, 51, 171, 0.04), rgba(0, 198, 255, 0.04));
  border: 1px solid rgba(0, 120, 255, 0.1);
}

.lf-rate-value {
  font-size: clamp(40px, 4vw, 56px);
  font-weight: 800;
  line-height: 1;
  letter-spacing: -0.03em;
  background: linear-gradient(110deg, #0033ab 0%, #0078ff 55%, #00c6ff 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.lf-rate-value small {
  font-size: 0.5em;
  margin-left: 0.05em;
  font-weight: 700;
}

.lf-rate-label {
  color: #475569;
  font-size: 0.95rem;
  font-weight: 500;
}

/* ----- Fee table footer caption ----- */
.lf-fee-foot {
  margin: 0.65rem 0 0;
  text-align: right;
  color: #94a3b8;
  font-size: 0.78rem;
  font-weight: 500;
  letter-spacing: 0.04em;
}

/* ----- Warning note ----- */
.lf-note {
  margin-top: 2rem;
  display: flex;
  align-items: flex-start;
  gap: 0.85rem;
  padding: 1.1rem 1.25rem;
  border-radius: 14px;
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.06), rgba(251, 191, 36, 0.04));
  border: 1px solid rgba(245, 158, 11, 0.18);
}

.lf-note-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 999px;
  background: rgba(245, 158, 11, 0.15);
  color: #d97706;
  flex-shrink: 0;
  font-size: 0.85rem;
}

.lf-note p {
  margin: 0;
  color: #475569;
  font-size: 0.92rem;
  line-height: 1.65;
}

.lf-note strong {
  color: #b45309;
  font-weight: 700;
  margin-right: 0.2rem;
}

/* ----- Responsive ----- */
@media (max-width: 860px) {
  .lf-section {
    padding: 4rem 1rem;
  }

  .lf-grid {
    grid-template-columns: 1fr;
    gap: 1.1rem;
  }

  .lf-card {
    padding: 1.5rem;
    border-radius: 18px;
  }

  .lf-row {
    grid-template-columns: 80px 1fr 1fr;
    padding: 0.85rem 0.9rem;
    font-size: 0.9rem;
  }

  .lf-rate {
    padding: 1.2rem 1rem;
  }

  .lf-fee-item {
    grid-template-columns: auto 1fr;
    padding: 0.75rem 0.9rem;
  }

  .lf-fee-note {
    grid-column: 2;
    justify-self: end;
  }
}

@media (max-width: 480px) {
  .lf-row {
    grid-template-columns: 1fr;
    gap: 0.35rem;
    padding: 0.85rem 0.9rem;
  }

  .lf-row-head {
    display: none;
  }

  .lf-row [role="cell"]:not(:first-child)::before {
    content: attr(data-label);
    display: inline-block;
    width: 60px;
    color: #94a3b8;
    font-size: 0.72rem;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    font-weight: 600;
    margin-right: 0.5rem;
  }

  .lf-fee-range {
    flex-wrap: wrap;
  }
}

/* =====================================================================
   Member Banks Section
   ===================================================================== */
.mb-section {
  position: relative;
  width: 100%;
  padding: 6rem 1.5rem;
  background:
    linear-gradient(180deg, #fafbff 0%, #ffffff 100%);
  overflow: hidden;
}

.mb-decoration {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background:
    radial-gradient(700px 380px at 100% 0%, rgba(0, 120, 255, 0.05), transparent 60%),
    radial-gradient(620px 360px at 0% 100%, rgba(0, 51, 171, 0.04), transparent 60%);
}

.mb-inner {
  position: relative;
  max-width: 1140px;
  margin: 0 auto;
}

/* ----- Header ----- */
.mb-head {
  text-align: center;
  margin-bottom: 3rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.mb-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.4rem 0.9rem;
  border-radius: 999px;
  background: rgba(0, 51, 171, 0.06);
  border: 1px solid rgba(0, 51, 171, 0.12);
  color: #0033ab;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.mb-eyebrow-dot {
  width: 6px;
  height: 6px;
  border-radius: 999px;
  background: linear-gradient(120deg, #0033ab, #00c6ff);
  box-shadow: 0 0 0 3px rgba(0, 120, 255, 0.15);
}

.mb-title {
  margin: 1rem 0 0.75rem;
  font-size: clamp(28px, 3vw, 42px);
  font-weight: 700;
  letter-spacing: -0.02em;
  color: #0b1020;
  line-height: 1.2;
  max-width: 24ch;
  text-wrap: balance;
}

.mb-title-accent {
  background: linear-gradient(110deg, #0033ab 0%, #0078ff 55%, #00c6ff 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.mb-sub {
  max-width: 58ch;
  margin: 0;
  color: #64748b;
  font-size: clamp(14.5px, 1vw, 16px);
  line-height: 1.7;
}

/* ----- Grid ----- */
.mb-grid {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}

/* ----- Card ----- */
.mb-card {
  position: relative;
  display: grid;
  grid-template-columns: auto auto 1fr auto;
  align-items: center;
  gap: 1rem;
  padding: 1.1rem 1.25rem;
  border-radius: 16px;
  background: #ffffff;
  border: 1px solid rgba(15, 23, 42, 0.07);
  box-shadow: 0 6px 18px rgba(15, 23, 42, 0.04);
  transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
  overflow: hidden;
}

.mb-card::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  padding: 1px;
  background: linear-gradient(135deg, rgba(0, 51, 171, 0.18), rgba(0, 198, 255, 0) 60%);
  -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.25s ease;
}

.mb-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 18px 36px rgba(15, 23, 42, 0.08);
  border-color: rgba(0, 120, 255, 0.18);
}

.mb-card:hover::before {
  opacity: 1;
}

.mb-card:hover .mb-arrow {
  transform: translate(2px, -2px);
  color: #0078ff;
}

.mb-num {
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: #94a3b8;
  min-width: 22px;
  text-align: right;
}

.mb-logo {
  width: 52px;
  height: 52px;
  border-radius: 12px;
  background: linear-gradient(135deg, #f1f5ff 0%, #ffffff 100%);
  border: 1px solid rgba(15, 23, 42, 0.06);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  overflow: hidden;
}

.mb-logo img {
  width: 70%;
  height: 70%;
  object-fit: contain;
}

.mb-meta {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  min-width: 0;
}

.mb-name {
  margin: 0;
  font-size: 0.95rem;
  font-weight: 600;
  color: #0b1020;
  letter-spacing: -0.005em;
  line-height: 1.35;
  overflow: hidden;
  text-overflow: ellipsis;
}

.mb-app {
  align-self: flex-start;
  display: inline-flex;
  align-items: center;
  padding: 0.18rem 0.55rem;
  border-radius: 999px;
  background: rgba(0, 120, 255, 0.08);
  color: #0033ab;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.04em;
}

.mb-arrow {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: #f1f5ff;
  color: #94a3b8;
  font-size: 0.78rem;
  transition: transform 0.25s ease, color 0.25s ease, background 0.25s ease;
  flex-shrink: 0;
}

/* ----- Responsive ----- */
@media (max-width: 860px) {
  .mb-section {
    padding: 4rem 1rem;
  }

  .mb-grid {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }

  .mb-card {
    padding: 0.95rem 1rem;
    gap: 0.85rem;
  }

  .mb-logo {
    width: 44px;
    height: 44px;
    border-radius: 10px;
  }

  .mb-name {
    font-size: 0.9rem;
  }
}

@media (max-width: 480px) {
  .mb-card {
    grid-template-columns: auto auto 1fr;
  }

  .mb-arrow {
    display: none;
  }
}

@media (max-width: 560px) {
  .orbit-section {
    min-height: 600px;
  }

  .orbit-content {
    padding: 3rem 1rem;
  }

  .orbit-title {
    font-size: clamp(22px, 7vw, 28px);
  }

  .orbit-system {
    transform: scale(0.55);
  }

  .orbit-fade-top,
  .orbit-fade-bottom {
    height: 90px;
  }

  .orbit-fade-left,
  .orbit-fade-right {
    width: 48px;
  }
}

@media (prefers-reduced-motion: reduce) {

  .orbit-motion,
  .orbit-badge {
    animation: none !important;
  }
}

.intg-section {
  position: relative;
  width: 100%;
  overflow: hidden;
  background: #ffffff;
  min-height: 560px;
}

.intg-grid {
  pointer-events: none;
  position: absolute;
  inset: 0;
  background-image: linear-gradient(to right, #e8ecf3 1px, transparent 1px);
  background-size: calc(100% / 6) 100%;
  opacity: 0.55;
}

.intg-inner {
  position: relative;
  margin: 0 auto;
  max-width: 1180px;
  display: flex;
  flex-direction: column;
  gap: 3rem;
  padding: 5rem 1.5rem;
}

@media (min-width: 768px) {
  .intg-inner {
    flex-direction: row;
    align-items: center;
    gap: 2.5rem;
    padding: 7rem 1.5rem;
  }
}

.intg-left {
  width: 100%;
}

@media (min-width: 768px) {
  .intg-left {
    width: 42%;
  }
}

.intg-title {
  color: #0f172a;
  font-weight: 800;
  font-size: clamp(34px, 4vw, 52px);
  line-height: 1.2;
  letter-spacing: -0.01em;
  margin: 0;
}

.intg-title-accent {
  background: linear-gradient(120deg, #0033ab 0%, #0078ff 40%, #00c6ff 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.intg-desc {
  margin-top: 1.5rem;
  color: #475569;
  font-size: var(--fs-base, 16px);
  line-height: 1.65;
  max-width: 460px;
}

.intg-desc p+p {
  margin-top: 1.25rem;
}

.intg-right {
  width: 100%;
  height: clamp(380px, 56vw, 580px);
  position: relative;
}

@media (min-width: 768px) {
  .intg-right {
    width: 58%;
  }
}

.logo-cloud {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  mask-image: linear-gradient(to bottom, transparent 0%, black 12%, black 88%, transparent 100%);
  -webkit-mask-image: linear-gradient(to bottom,
      transparent 0%,
      black 12%,
      black 88%,
      transparent 100%);
}

.logo-track {
  display: flex;
  flex-direction: column;
  will-change: transform;
  animation: marqueeUp 28s linear infinite;
}

@keyframes marqueeUp {
  0% {
    transform: translateY(0);
  }

  100% {
    transform: translateY(calc(-1 * var(--tile-h, 1000px)));
  }
}

.logo-tile {
  position: relative;
  width: 100%;
  flex-shrink: 0;
}

.logo-bubble {
  border-radius: 50%;
  background: #ffffff;
  border: 1px solid rgba(15, 23, 42, 0.06);
  display: flex;
  align-items: center;
  justify-content: center;
  animation: floatBubble var(--float-dur, 4s) var(--float-delay, 0s) ease-in-out infinite;
}

@keyframes floatBubble {

  0%,
  100% {
    transform: translateY(-8px) translateX(-4px);
  }

  50% {
    transform: translateY(8px) translateX(4px);
  }
}

.logo-bubble img {
  width: 70%;
  height: 70%;
  object-fit: contain;
}

.tablefee {
  width: 100%;
  height: auto;
}

.footermemberproduct1 {
  width: 100%;
  height: auto;
}

.benetfix {
  width: 100%;
  height: auto;
}

.productdiscription {
  width: 100%;
  height: auto;
}

/* =====================================================================
   Closing CTA Section — modern minimal blue gradient
   ===================================================================== */
.cta-section {
  position: relative;
  width: 100%;
  padding: 6rem 1.5rem 7rem;
  background: #ffffff;
}

.cta-card {
  position: relative;
  max-width: 1140px;
  margin: 0 auto;
  border-radius: 28px;
  padding: 4rem 3rem;
  background:
    radial-gradient(900px 500px at 100% 0%, rgba(0, 198, 255, 0.18), transparent 60%),
    radial-gradient(700px 500px at 0% 100%, rgba(0, 120, 255, 0.22), transparent 60%),
    linear-gradient(135deg, #00033a 0%, #0033ab 55%, #0066d6 100%);
  color: #ffffff;
  overflow: hidden;
  box-shadow:
    0 30px 70px rgba(0, 51, 171, 0.25),
    0 0 0 1px rgba(255, 255, 255, 0.05) inset;
}

.cta-glow {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at 50% -10%, rgba(255, 255, 255, 0.16), transparent 55%),
    radial-gradient(circle at 80% 110%, rgba(0, 198, 255, 0.15), transparent 55%);
  pointer-events: none;
}

.cta-body {
  position: relative;
  max-width: 760px;
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
}

.cta-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.4rem 0.9rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.18);
  color: #e0f2ff;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  align-self: flex-start;
  backdrop-filter: blur(8px);
}

.cta-eyebrow-dot {
  width: 6px;
  height: 6px;
  border-radius: 999px;
  background: linear-gradient(120deg, #ffffff, #00c6ff);
  box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.18);
}

.cta-title {
  margin: 0;
  font-size: clamp(26px, 3vw, 40px);
  font-weight: 700;
  line-height: 1.25;
  letter-spacing: -0.02em;
  color: #ffffff;
  text-wrap: balance;
}

.cta-title-accent {
  background: linear-gradient(110deg, #ffffff 0%, #b3e5ff 50%, #00c6ff 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.cta-sub {
  margin: 0;
  font-size: clamp(14.5px, 1vw, 16px);
  line-height: 1.7;
  color: rgba(255, 255, 255, 0.78);
  max-width: 62ch;
}

.cta-features {
  list-style: none;
  margin: 1rem 0 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 0.65rem;
}

.cta-features li {
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  padding: 0.55rem 0.95rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.14);
  color: #ffffff;
  font-size: 0.88rem;
  font-weight: 500;
  backdrop-filter: blur(6px);
}

.cta-features strong {
  font-weight: 700;
  color: #e0f2ff;
}

.cta-tick {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  border-radius: 999px;
  background: linear-gradient(135deg, #00c6ff, #0078ff);
  color: #ffffff;
  font-size: 0.6rem;
  box-shadow: 0 4px 10px rgba(0, 120, 255, 0.4);
}

/* Service banks logo strip inside CTA */
.cta-banks {
  margin-top: 2.25rem;
  padding-top: 1.75rem;
  border-top: 1px solid rgba(255, 255, 255, 0.12);
}

.cta-banks-label {
  margin: 0 0 1rem;
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: rgba(224, 242, 255, 0.7);
}

.cta-bank-grid {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.cta-bank {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid rgba(255, 255, 255, 0.6);
  box-shadow: 0 8px 20px rgba(0, 15, 60, 0.25);
  transition: transform 0.25s ease, box-shadow 0.25s ease, background 0.25s ease;
  cursor: pointer;
  overflow: hidden;
}

.cta-bank img {
  width: 72%;
  height: 72%;
  object-fit: contain;
}

.cta-bank:hover {
  transform: translateY(-3px) scale(1.04);
  background: #ffffff;
  box-shadow: 0 14px 28px rgba(0, 15, 60, 0.35), 0 0 0 1px rgba(0, 198, 255, 0.4);
}

@media (max-width: 860px) {
  .cta-section {
    padding: 4rem 1rem 5rem;
  }

  .cta-card {
    padding: 2.5rem 1.75rem;
    border-radius: 22px;
  }

  .cta-features li {
    font-size: 0.82rem;
    padding: 0.45rem 0.8rem;
  }

  .cta-bank {
    width: 48px;
    height: 48px;
    border-radius: 12px;
  }

  .cta-banks-label {
    font-size: 0.68rem;
  }
}
</style>

<!-- Non-scoped keyframes so Vue doesn't hash the @keyframes name out of sync with animation-name -->
<style>
@keyframes lapnetOrbitRotate {
  from {
    transform: translate(-50%, -50%) rotate(0deg);
  }

  to {
    transform: translate(-50%, -50%) rotate(360deg);
  }
}

@keyframes lapnetOrbitRotateReverse {
  from {
    transform: translate(-50%, -50%) rotate(0deg);
  }

  to {
    transform: translate(-50%, -50%) rotate(-360deg);
  }
}

@keyframes lapnetOrbitCounterRotate {
  from {
    transform: translate(-50%, -50%) rotate(0deg);
  }

  to {
    transform: translate(-50%, -50%) rotate(-360deg);
  }
}

@keyframes lapnetOrbitCounterRotateReverse {
  from {
    transform: translate(-50%, -50%) rotate(0deg);
  }

  to {
    transform: translate(-50%, -50%) rotate(360deg);
  }
}
</style>
