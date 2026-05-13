<template>
  <section class="orbit-section">
    <div class="orbit-bg-glow" aria-hidden="true" />

    <div class="orbit-wrapper">
      <div class="orbit-heading">
        <span>ທະນາຄານສະມາຊິກຂອງເຮົາ</span>
      </div>

      <div class="orbit-stage">
        <!-- Rings -->
        <div
          v-for="(ring, ri) in RINGS"
          :key="ri"
          class="orbit-ring"
          :class="`orbit-ring--${ri}`"
          :style="{
            width:  ring.radius * 2 + 'px',
            height: ring.radius * 2 + 'px',
            marginLeft: -ring.radius + 'px',
            marginTop:  -ring.radius + 'px',
            animationDuration: ring.duration + 's',
            animationDirection: ring.reverse ? 'reverse' : 'normal',
          }"
        >
          <div
            v-for="(badge, bi) in ring.badges"
            :key="bi"
            class="badge-arm"
            :class="{
              'hide-mobile': badge.hideOnMobile,
              'hide-tablet': badge.hideOnTablet,
            }"
            :style="{ transform: `rotate(${badge.angle}deg) translate(${ring.radius}px)` }"
          >
            <!--
              badge-counter: positioned at the arm tip (ring circumference).
              The keyframe translate(-50%,-50%) centers this div on that tip.
              The rotating rotate() cancels the ring's spin so the logo stays upright.
            -->
            <div
              class="badge-counter"
              :style="{
                '--anti-angle':    `${-badge.angle}deg`,
                '--ring-duration': `${ring.duration}s`,
                animationDirection: ring.reverse ? 'normal' : 'reverse',
                opacity: badge.faded ? 0.35 : 1,
              }"
            >
              <div class="badge-box" :class="`badge-box--${badge.size ?? 'md'}`" :title="badge.label">
                <img :src="badge.logo" :alt="badge.label" />
              </div>
            </div>
          </div>
        </div>

        <!-- Center hub -->
        <div class="orbit-center">
          <img src="/logolapnet/fullcircle.png" alt="LAPNet" class="orbit-center-logo" />
          <div class="orbit-center-count">21</div>
          <div class="orbit-center-label">ສະມາຊິກ</div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const RINGS = [
  // Ring 1 — innermost, 3 major banks
  {
    radius: 95,
    duration: 55,
    reverse: false,
    badges: [
      { logo: '/logoallmember/circle_scale/BCEL.png',  label: 'BCEL',  angle: 30,  size: 'lg' },
      { logo: '/logoallmember/circle_scale/LDB.PNG',   label: 'LDB',   angle: 150, size: 'lg' },
      { logo: '/logoallmember/circle_scale/APBB.PNG',  label: 'APBB',  angle: 270, size: 'lg' },
    ],
  },
  // Ring 2 — 4 banks
  {
    radius: 178,
    duration: 72,
    reverse: true,
    badges: [
      { logo: '/logoallmember/retangle_scale/jdb.png',          label: 'JDB',  angle: 0,   size: 'md' },
      { logo: '/logoallmember/circle_scale/MJBL.png',           label: 'MJBL', angle: 90,  size: 'md' },
      { logo: '/logoallmember/retangle_scale/LVB.png',          label: 'LVB',  angle: 180, size: 'md' },
      { logo: '/logoallmember/retangle_scale/ICBC.svg.png',     label: 'ICBC', angle: 270, size: 'md' },
    ],
  },
  // Ring 3 — 4 banks
  {
    radius: 260,
    duration: 92,
    reverse: false,
    badges: [
      { logo: '/logoallmember/retangle_scale/bboc.png',  label: 'BBOC',       angle: 45,  size: 'md', hideOnMobile: true },
      { logo: '/logoallmember/retangle_scale/y-nghia-sau-sac-dang-sau-thiet-ke-logo-vietinbank-0.png', label: 'VietinBank', angle: 135, size: 'md', hideOnMobile: true },
      { logo: '/logoallmember/retangle_scale/IB.png',    label: 'IB',         angle: 225, size: 'md', hideOnMobile: true },
      { logo: '/logoallmember/retangle_scale/mmoney.png',label: 'mMoney',     angle: 315, size: 'md', hideOnMobile: true },
    ],
  },
  // Ring 4 — 4 banks / fintech
  {
    radius: 342,
    duration: 115,
    reverse: true,
    badges: [
      { logo: '/logoallmember/retangle_scale/umoney.png',   label: 'uMoney',   angle: 20,  size: 'sm', hideOnMobile: true },
      { logo: '/logoallmember/retangle_scale/aceleda.png',  label: 'Aceleda',  angle: 110, size: 'sm', hideOnMobile: true },
      { logo: '/logoallmember/retangle_scale/BIC.png',      label: 'BIC',      angle: 200, size: 'sm', hideOnMobile: true },
      { logo: '/logoallmember/retangle_scale/sacombank.png',label: 'Sacombank',angle: 290, size: 'sm', hideOnMobile: true },
    ],
  },
  // Ring 5 — 3 banks, faded
  {
    radius: 422,
    duration: 140,
    reverse: false,
    badges: [
      { logo: '/logoallmember/retangle_scale/Stbretangle.png', label: 'STB',        angle: 60,  size: 'sm', faded: true, hideOnMobile: true, hideOnTablet: true },
      { logo: '/logoallmember/retangle_scale/kkbank.PNG',       label: 'KKBank',     angle: 180, size: 'sm', faded: true, hideOnMobile: true, hideOnTablet: true },
      { logo: '/logoallmember/retangle_scale/publicbank.png',   label: 'PublicBank', angle: 300, size: 'sm', faded: true, hideOnMobile: true, hideOnTablet: true },
    ],
  },
  // Ring 6 — outermost, 3 banks, more faded
  {
    radius: 502,
    duration: 170,
    reverse: true,
    badges: [
      { logo: '/logoallmember/retangle_scale/BFL.png',    label: 'BFL',    angle: 0,   size: 'sm', faded: true, hideOnMobile: true, hideOnTablet: true },
      { logo: '/logoallmember/retangle_scale/psvb.PNG',   label: 'PSVB',   angle: 120, size: 'sm', faded: true, hideOnMobile: true, hideOnTablet: true },
      { logo: '/logoallmember/retangle_scale/mbbank.png', label: 'MBBank', angle: 240, size: 'sm', faded: true, hideOnMobile: true, hideOnTablet: true },
    ],
  },
]
</script>

<style scoped>
/* ===========================
   Section shell
   =========================== */
.orbit-section {
  position: relative;
  width: 100%;
  background: #f4f5f7;
  overflow: hidden;
}

.orbit-bg-glow {
  pointer-events: none;
  position: absolute;
  inset: 0;
  background: radial-gradient(60% 55% at 50% 50%, rgba(255,255,255,0.92) 0%, rgba(244,245,247,0) 70%);
}

/* ===========================
   Wrapper + heading
   =========================== */
.orbit-wrapper {
  position: relative;
  z-index: 1;
  max-width: 1200px;
  margin: 0 auto;
  padding: 60px 16px 56px;
}

.orbit-heading {
  text-align: center;
  margin-bottom: 8px;
  font-family: "Noto Sans Lao", sans-serif;
  font-size: var(--fs-xxl, 2rem);
  font-weight: 700;
}

.orbit-heading span {
  background: linear-gradient(120deg, #0033ab 0%, #0078ff 45%, #00c6ff 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

/* ===========================
   Stage
   =========================== */
.orbit-stage {
  position: relative;
  width: 100%;
  height: 580px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* ===========================
   Ring circles
   =========================== */
.orbit-ring {
  position: absolute;
  left: 50%;
  top: 50%;
  border-radius: 50%;
  border: 1px solid rgba(15, 23, 42, 0.08);
  animation: orbit-spin linear infinite;
}

/* Outer rings slightly more transparent */
.orbit-ring--4,
.orbit-ring--5 {
  border-color: rgba(15, 23, 42, 0.05);
}

/* ===========================
   Badge arm
   Positions the badge origin exactly on the ring circumference.
   width/height 0 so the arm has no layout footprint.
   =========================== */
.badge-arm {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 0;
  height: 0;
  transform-origin: 0 0;
}

/* ===========================
   Badge counter
   Sits at the arm tip (= ring circumference point).
   The keyframe translate(-50%,-50%) shifts it so its CENTER lands on the
   ring line. The rotating rotate() cancels the ring spin → logo stays upright.
   =========================== */
.badge-counter {
  position: absolute;
  left: 0;
  top: 0;
  animation: badge-counter-spin var(--ring-duration, 60s) linear infinite;
}

/* ===========================
   Badge box — NO extra transform here.
   Centering is done entirely by badge-counter's keyframe.
   =========================== */
.badge-box {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: #ffffff;
  border: 1px solid rgba(15, 23, 42, 0.07);
  box-shadow:
    0 1px 3px rgba(15, 23, 42, 0.07),
    0 6px 18px rgba(15, 23, 42, 0.08);
  transition: box-shadow 0.25s ease;
  cursor: default;
  overflow: hidden;
}

.badge-box img {
  width: 72%;
  height: 72%;
  object-fit: contain;
  display: block;
}

.badge-box--sm { width: 40px; height: 40px; }
.badge-box--md { width: 54px; height: 54px; }
.badge-box--lg { width: 66px; height: 66px; }

/* ===========================
   Center hub
   =========================== */
.orbit-center {
  position: relative;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 116px;
  height: 116px;
  border-radius: 50%;
  background: #ffffff;
  box-shadow:
    0 2px 8px rgba(15, 23, 42, 0.08),
    0 16px 48px rgba(15, 23, 42, 0.1);
  border: 1px solid rgba(15, 23, 42, 0.06);
}

.orbit-center-logo {
  width: 44px;
  height: 44px;
  object-fit: contain;
}

.orbit-center-count {
  margin-top: 2px;
  font-size: 1.05rem;
  font-weight: 700;
  color: #0033ab;
  line-height: 1;
}

.orbit-center-label {
  font-size: 0.6rem;
  color: #64748b;
  font-family: "Noto Sans Lao", sans-serif;
  margin-top: 2px;
}

/* ===========================
   Keyframes
   =========================== */
@keyframes orbit-spin {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}

/*
  badge-counter-spin:
  - translate(-50%, -50%)  → center the badge on the ring line
  - rotate(anti-angle ∓ t) → cancel the ring's rotation so logo stays upright
*/
@keyframes badge-counter-spin {
  from { transform: translate(-50%, -50%) rotate(calc(var(--anti-angle) + 0deg)); }
  to   { transform: translate(-50%, -50%) rotate(calc(var(--anti-angle) - 360deg)); }
}

/* ===========================
   Responsive
   =========================== */
.hide-mobile { display: block; }
.hide-tablet { display: block; }

/* Tablet — hide rings 5–6 */
@media (max-width: 960px) {
  .hide-tablet { display: none; }
  .orbit-stage { height: 460px; }
}

/* Mobile — hide rings 3–6 */
@media (max-width: 560px) {
  .hide-mobile { display: none; }

  .orbit-wrapper { padding: 44px 12px 40px; }
  .orbit-stage   { height: 300px; }

  .orbit-heading {
    font-size: var(--fs-memberxl, 1.4rem);
  }
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .orbit-ring,
  .badge-counter {
    animation: none !important;
  }
}
</style>
