<script setup>
import { ref, onMounted } from "vue";

import navbar from "../../components/miannavbar/main_navbar.vue";

import tagproduct from "../../components/tagproduct/tagproduct.vue";
import product4_footerlogomember from "../../components/footer/logomemberfooter/product4_footerlogomember.vue";

import logofloating from "../../components/logofloating/logofloating.vue";
import tablefee from "../../components/tablefee/tablefee.vue";
import hero_sectionproduct4 from "../../Views/products/product_herosection/hero_sectionproduct4.vue";
import secondfooter from "../../components/footer/mainfooter/secondfooter.vue";
import product4_tab2 from "./product4_tab2.vue";

const heroVideo = "/videos/productvdo-background.mp4";

/** =========================
 * ✅ Load member logos from API (env only)
 * API: {VITE_API_BASE_URL}/api/members
 * Condition: mobiletransfer = 1
 * ========================= */

// Required in .env:
//   VITE_API_BASE_URL=http://localhost:3000
function resolveEnvBaseUrl() {
  // IMPORTANT: Use direct access so Vite injects import.meta.env correctly.
  const raw = String(import.meta.env.VITE_API_BASE_URL || "").trim();
  return raw.replace(/\/+$/, "");
}

function normalizeBaseUrl(u) {
  return String(u || "").trim().replace(/\/+$/, "");
}

function joinBaseAndPath(baseUrl, path) {
  const b = normalizeBaseUrl(baseUrl);
  const p = String(path || "");

  if (!b) return p;

  // Prevent double "/api"
  if (b.endsWith("/api") && /^\/api(\/|$)/i.test(p)) {
    return b + p.replace(/^\/api/i, "");
  }

  if (!p) return b;
  if (p.startsWith("/")) return b + p;
  return b + "/" + p;
}

function isLoopbackHost(hostname) {
  const h = String(hostname || "").toLowerCase();
  return h === "localhost" || h === "127.0.0.1" || h === "0.0.0.0";
}

function isLikelyAssetPath(pathname) {
  const p = String(pathname || "");
  return /^\/(uploads|upload|images|files|static)\b/i.test(p) || p.includes("/uploads/") || p.includes("/images/");
}

const API_BASE = normalizeBaseUrl(resolveEnvBaseUrl());
const ASSET_BASE = API_BASE.endsWith("/api") ? API_BASE.slice(0, -4) : API_BASE;
const MEMBERS_API_URL = joinBaseAndPath(API_BASE, "/api/members");

const memberLogos = ref([]);

const ASSET_BASE_URL = (() => {
  try {
    return ASSET_BASE ? new URL(ASSET_BASE) : null;
  } catch {
    return null;
  }
})();

function rewriteBadAbsoluteToEnvBase(absoluteUrl) {
  try {
    const u = new URL(absoluteUrl);
    const fullPath = `${u.pathname || ""}${u.search || ""}`;

    // Rewrite when backend returns localhost
    if (isLoopbackHost(u.hostname)) {
      return ASSET_BASE ? joinBaseAndPath(ASSET_BASE, fullPath) : absoluteUrl;
    }

    // Rewrite when it looks like an asset path but host mismatches env base
    if (ASSET_BASE_URL && isLikelyAssetPath(u.pathname) && u.hostname !== ASSET_BASE_URL.hostname) {
      return joinBaseAndPath(ASSET_BASE, fullPath);
    }

    return absoluteUrl;
  } catch {
    return absoluteUrl;
  }
}

const normalizeUrl = (p) => {
  const s = String(p || "").trim();
  if (!s) return "";

  if (/^data:/i.test(s) || /^blob:/i.test(s)) return s;

  // Absolute URL
  if (/^https?:\/\//i.test(s)) return rewriteBadAbsoluteToEnvBase(s);

  // Absolute path
  if (s.startsWith("/")) return joinBaseAndPath(ASSET_BASE, s);

  // Relative path
  return joinBaseAndPath(ASSET_BASE, "/" + s);
};

const getMemberId = (m) => Number(m?.idmember ?? m?.id ?? m?.member_id ?? 0);

const fetchMemberLogos = async () => {
  try {
    if (!API_BASE) {
      throw new Error("Missing VITE_API_BASE_URL in .env");
    }

    const res = await fetch(MEMBERS_API_URL, { headers: { Accept: "application/json" } });
    if (!res.ok) throw new Error(`Fetch failed: ${res.status} ${res.statusText}`);

    const json = await res.json();
    const list = Array.isArray(json) ? json : json?.data || json?.members || [];
    const arr = Array.isArray(list) ? list : [];

    memberLogos.value = arr
      // where mobiletransfer = 1
      .filter((m) => String(m?.mobiletransfer) === "1" || m?.mobiletransfer === true)
      // order by idmember asc
      .sort((a, b) => getMemberId(a) - getMemberId(b))
      // map to {src, alt}
      .map((m) => {
        const rawSrc = m?.image ?? m?.image_url ?? m?.logo ?? m?.img ?? m?.photo ?? m?.path ?? m?.src ?? "";
        const alt = m?.alt ?? m?.name ?? m?.bank_name ?? m?.title ?? "Member logo";
        return { src: normalizeUrl(rawSrc), alt };
      })
      .filter((x) => !!x.src);
  } catch (err) {
    console.error("Error loading member logos:", err);
    memberLogos.value = [];
  }
};

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

onMounted(() => {
  window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  fetchMemberLogos();
});

const activeTab = ref(1);
const setTab = (n) => {
  activeTab.value = n;
  window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
};
</script>
<template>
  <navbar
    title="ຜະລິດຕະພັນ ແລະ ການບໍລິການ"
    :breadcrumb="[
      'ໜ້າຫຼັກ',
      'ຜະລິດຕະພັນ ແລະ ການບໍລິການ',
      activeTab === 1
        ? 'ໂອນເງິນຂ້າມທະນາຄານເທິງມືຖື'
        : 'ບໍລິການໂອນເງິນຂ້າມທະນາຄານ ສະກຸນເງິນຕາຕ່າງປະເທດ ຜ່ານ LAPNet'
    ]"
    background-image="/overlaynav/product/navigatorcontent-bg.png"
  />

  <div class="hero-shell">
    <nav class="product-tabbar" role="tablist" aria-label="Product sections">
      <button
        type="button"
        role="tab"
        :aria-selected="activeTab === 1"
        :class="['product-tab', { active: activeTab === 1 }]"
        @click="setTab(1)"
      >
        ໂອນເງິນຂ້າມທະນາຄານເທິງມືຖື
      </button>
      <button
        type="button"
        role="tab"
        :aria-selected="activeTab === 2"
        :class="['product-tab', { active: activeTab === 2 }]"
        @click="setTab(2)"
      >
        ບໍລິການໂອນເງິນຂ້າມທະນາຄານ ສະກຸນເງິນຕາຕ່າງປະເທດ ຜ່ານ LAPNet
      </button>
    </nav>

    <template v-if="activeTab === 1">
      <div class="productdiscription">
        <hero_sectionproduct4 />
      </div>
    </template>
  </div>

  <!-- ============================================================
       TAB 1: ໂອນເງິນຂ້າມທະນາຄານເທິງມືຖື
       ============================================================ -->
  <template v-if="activeTab === 1">
    <div class="benetfix">
      <product4tech />
    </div>

    <div class="condition_for_use">
      <section class="intg-section">
        <div class="intg-grid" aria-hidden="true"></div>

        <div class="intg-inner">
          <div class="intg-left">
            <h2 class="intg-title">
              <span class="intg-title-accent">ເງື່ອນໄຂ</span> ການໃຊ້ບໍລິການ
            </h2>
            <div class="intg-desc">
              <p>
                ລຸກຄ້າສາມາດນຳໃຊ້ເລກບັນຊີທະນາຄານ ດຳເນີນທຸລະກຳເທິງມືຖື ໂດຍຜ່ານ Applications
                ຂອງແຕ່ລະທະນາຄານທຸລະກິດທີ່ເປັນສະມາຊິກຂອງບໍລິສັດ LAPNet
                ໄດ້ໃນໄລຍະທີ່ເປີດຕົວຜະລິດຕະພັນການໂອນເງິນຂ້າມທະນາຄານເທິງມືຖື.
              </p>
              <p>
                ການໂອນເງິນເທີງມືຖືໂດຍນຳໃຊ້ຮູບແບບການໂອນ ບັນຊີຫາບັນຊີ (Account Fund Transfer)
                ແມ່ນມີສະມາຊິກທັງໝົດ 18 ທະນາຄານ ແລະ 2 Fintech ທີ່ໃຫ້ບໍລິການ.
              </p>
            </div>
          </div>

          <div class="intg-right">
            <div class="logo-cloud">
              <div class="logo-track" :style="{ '--tile-h': TILE_HEIGHT + 'px' }">
                <div class="logo-tile" :style="{ height: TILE_HEIGHT + 'px' }">
                  <div
                    v-for="(logo, i) in CLOUD_LOGOS"
                    :key="'a-' + i"
                    class="logo-bubble"
                    :style="bubbleStyle(logo)"
                  >
                    <img :src="logo.src" :alt="logo.alt" />
                  </div>
                </div>
                <div class="logo-tile" :style="{ height: TILE_HEIGHT + 'px' }" aria-hidden="true">
                  <div
                    v-for="(logo, i) in CLOUD_LOGOS"
                    :key="'b-' + i"
                    class="logo-bubble"
                    :style="bubbleStyle(logo)"
                  >
                    <img :src="logo.src" :alt="logo.alt" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>

    <div class="boxmargin" style="width: 100%; height: 15vh"></div>

    <div class="tablefee">
      <tablefee />
    </div>

    <div class="boxmargin" style="width: 100%; height: 15vh"></div>

    <div class="footermemberproduct1">
      <product4_footerlogomember
        :subtitle="`  ການໂອນເງິນຂ້າມທະນາຄານເທິງມືຖື (Fund Transfer via Mobile
            Application) ໂດຍນຳໃຊ້ລະບົບ LMPS ໃນການເຊື່ອມໂຍງຜ່ານ
            Applications ຂອງແຕ່ລະທະນາຄານທີ່ເປັນສະມາຊິກຂອງບໍລິສັດລາວ
            ເນເຊີນນໍເພເມັ້ນ ເນັດເວີກ ໃຫ້ສາມາດໃຊ້ຟັງຊັ່ນການດຳເນີນທຸລະກຳໂອນ
            ເງິນຂ້າມທະນາຄານໄດ້.`"
        :features="[
          ' ຂອບເຂດການໂອນເງິນຂ້າມທະນາຄານເທິງມືຖື ແມ່ນສາມາດໂອນເງິນແຕ່ 1.000 ກີບ ຫາ 200.000.000 ກີບ/ຄັ້ງ. ',
        ]"
        :logos="memberLogos"
      />
    </div>
  </template>

  <!-- ============================================================
       TAB 2: ບໍລິການໂອນເງິນຂ້າມທະນາຄານ ສະກຸນເງິນຕາຕ່າງປະເທດ ຜ່ານ LAPNet
       Content lives in product4_tab2.vue — edit there freely.
       ============================================================ -->
  <template v-else>
    <product4_tab2 :member-logos="memberLogos" />
  </template>

  <secondfooter />
</template>

<style scoped>
.hero-shell {
  position: relative;
  background: #ffffff;
}
.hero-shell :deep(.hero) {
  background: transparent !important;
}
.hero-shell :deep(.hero)::before {
  display: none !important;
}
.product-tabbar {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  padding: 6rem 1rem 2.5rem;
  margin-bottom: -1.5rem;
  background: transparent;
}
.product-tab {
  appearance: none;
  border: 2px solid rgba(0, 51, 171, 0.5);
  background: #fff;
  color: #0033ab;
  font-size: 1rem;
  font-weight: 700;
  padding: 0.75rem 1.7rem;
  border-radius: 999px;
  cursor: pointer;
  letter-spacing: 0.02em;
  box-shadow: 0 6px 18px rgba(9, 22, 70, 0.08);
  transition: all 0.2s ease;
}
.product-tab:hover {
  background: rgba(0, 51, 171, 0.08);
  transform: translateY(-1px);
  box-shadow: 0 10px 24px rgba(9, 22, 70, 0.14);
}
.product-tab.active {
  background: linear-gradient(95deg, #00033a 0%, #0033ab 60%, #2a6dff 100%);
  color: #fff;
  border-color: transparent;
  box-shadow: 0 12px 28px rgba(0, 51, 171, 0.5), 0 0 0 4px rgba(0, 51, 171, 0.12);
  transform: translateY(-1px);
}
.container2 {
  min-height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: 700;
  color: #0b1020;
}

.tablefee {
  width: 100%;
  height: auto;
}

@media (max-width: 720px) {
}

.tablefee {
  width: 100%;
  height: auto;
}

@media (max-width: 921px) {
  .logofloatings {
    display: none;
  }

  #titlecondition {
    width: 100%;
    height: 100%;
  }
}

@media (max-width: 1140px) {
  #redponsivetitlebox {
    font-size: 3.3rem;
    font-weight: bold;
  }
}

@media (max-width: 515) {
  #redponsivetitlebox {
    font-size: 2rem;
    font-weight: bold;
  }
}

.condition_for_use {
  width: 100%;
  height: auto;
}

/* ===== Integration Section (zip style) ===== */
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

.intg-desc p + p {
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

/* Logo Cloud */
.logo-cloud {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  mask-image: linear-gradient(to bottom, transparent 0%, black 12%, black 88%, transparent 100%);
  -webkit-mask-image: linear-gradient(
    to bottom,
    transparent 0%,
    black 12%,
    black 88%,
    transparent 100%
  );
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

.techbtn {
  width: 100%;
  height: 15%;
}

.warning p i {
  font-size: 10px;
  margin-right: 10px;
  color: rgb(0, 76, 255);
}

.warning p {
  font-weight: 500;
}

.warning {
  font-size: var(--fs-base);
  width: 100%;
  height: 15%;
}

.script {
  width: 100%;
  height: 15%;
  font-size: var(--fs-base);
}

.titlebox h1 {
  font-size: 5rem;
  font-weight: bold;
}

.titlebox {
  width: 100%;
  height: 20%;
}

.logofloatings {
  width: 45%;
  height: 90%;
}

.footermemberproduct1 {
  width: 100%;
  height: auto;
}

.benetfitcontent p {
  width: 100%;
  padding-top: 40px;
  width: 80%;
  font-size: var(--fs-base);
  text-align: center;
}

.benetfitcontent h1 {
  text-align: center;
  width: 100%;
  font-size: var(--fs-xxl);
  font-weight: bold;
}

.benetfitcontent {
  width: 100%;
  color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 40%;
}

.benetfitcontainer {
  width: 80%;
  display: flex;
  justify-content: space-around;
  flex-direction: column;
  height: 100%;
}

.benetfix {
  width: 100%;
  height: auto;
}

.productdiscription {
  width: 100%;
  height: auto;
}
</style>
