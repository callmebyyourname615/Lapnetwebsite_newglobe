<script setup>
import { defineProps } from "vue";
import product4_footerlogomember_tab2 from "../../components/footer/logomemberfooter/product4_footerlogomember_tab2.vue";
import product5tech from "../techbenetfit/product5tech.vue";
import tablefee_tab2 from "../../components/tablefee/tablefee_tab2.vue";
import hero_sectionproduct4_tab2 from "../../Views/products/product_herosection/hero_sectionproduct4_tab2.vue";

defineProps({
  memberLogos: { type: Array, default: () => [] },
});

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

  <div class="benetfix">
    <product5tech />
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
              ລຸກຄ້າສາມາດນຳໃຊ້ເລກບັນຊີທະນາຄານ ດຳເນີນທຸລະກຳໂອນເງິນຕາຕ່າງປະເທດ
              ຂ້າມທະນາຄານ ໂດຍຜ່ານ Applications ຂອງແຕ່ລະທະນາຄານທຸລະກິດທີ່ເປັນ
              ສະມາຊິກຂອງບໍລິສັດ LAPNet.
            </p>
            <p>
              ການໂອນເງິນສະກຸນເງິນຕາຕ່າງປະເທດ ຂ້າມທະນາຄານ ຜ່ານ LAPNet
              ໃຊ້ຮູບແບບການໂອນ ບັນຊີຫາບັນຊີ (Account Fund Transfer).
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
    <tablefee_tab2 />
  </div>

  <div class="boxmargin" style="width: 100%; height: 15vh"></div>

  <div class="footermemberproduct1">
    <product4_footerlogomember_tab2
      :subtitle="`  ບໍລິການໂອນເງິນຂ້າມທະນາຄານ ສະກຸນເງິນຕາຕ່າງປະເທດ ຜ່ານ LAPNet
            ໂດຍນຳໃຊ້ລະບົບ LMPS ໃນການເຊື່ອມໂຍງຜ່ານ Applications
            ຂອງແຕ່ລະທະນາຄານທີ່ເປັນສະມາຊິກຂອງບໍລິສັດລາວ
            ເນເຊີນນໍເພເມັ້ນ ເນັດເວີກ ໃຫ້ສາມາດໃຊ້ຟັງຊັ່ນການດຳເນີນທຸລະກຳໂອນ
            ເງິນຕາຕ່າງປະເທດຂ້າມທະນາຄານໄດ້.`"
      :features="[
        ' ຂອບເຂດການໂອນເງິນຕາຕ່າງປະເທດຂ້າມທະນາຄານ ແມ່ນສາມາດໂອນເງິນແຕ່ 1.000 ກີບ ຫາ 200.000.000 ກີບ/ຄັ້ງ. ',
      ]"
      :logos="memberLogos"
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
  0% { transform: translateY(0); }
  100% { transform: translateY(calc(-1 * var(--tile-h, 1000px))); }
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
  0%, 100% { transform: translateY(-8px) translateX(-4px); }
  50% { transform: translateY(8px) translateX(4px); }
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
</style>
