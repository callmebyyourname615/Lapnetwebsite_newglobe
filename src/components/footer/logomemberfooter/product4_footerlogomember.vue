<template>
  <section class="section">
    <div class="main-card">
      <!-- LEFT: Description -->
      <div class="left-pane" ref="leftPane">
        <p class="eyebrow">Our Members</p>
        <h1 class="title">
          ທະນາຄານທີ່ໃຫ້ບໍລິການ
        </h1>

        <!-- 🔹 subtitle from props -->
        <p class="subtitle">
          {{ subtitle }}
        </p>

        <!-- 🔹 feature-list from props -->
        <ul class="feature-list">
          <li v-for="(feature, index) in features" :key="index" v-html="feature"></li>
        </ul>

      </div>

      <!-- RIGHT: Logo grid -->
      <div class="right-pane">
        <div class="right-overlay"></div>

        <div class="logo-grid" ref="logoGrid">
          <button
            v-for="(logo, index) in logos"
            :key="index"
            class="logo-item"
            ref="logoItems"
            type="button"
            :aria-label="logo.alt || logo.label || 'member logo'"
          >
            <div class="logo-circle">
              <img
                v-if="logo.src"
                :src="logo.src"
                :alt="logo.alt || logo.label || 'member logo'"
                class="logo-img"
                loading="lazy"
              />

              <span v-else class="logo-label">
                {{ logo.label }}
              </span>
            </div>
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, nextTick } from "vue";
import { gsap } from "gsap";

const props = defineProps({
  // 🔹 subtitle text from parent
  subtitle: {
    type: String,
    default:
      "ການກວດຍອດເງິນຂ້າມທະນາຄານຜ່ານຕູ້ ATM ແມ່ນນຳໃຊ້ລະບົບ ແລັບໃນການເຊື່ອມໂຍງຕູ້ເອທີເອັມຂອງແຕ່ລະທະນາຄານທີ່ເປັນສະມາຊິກ ຂອງບໍລິສັດລາວ ເນເຊີນນໍເພເມັ້ນ ເນັດເວີກ ໃຫ້ສາມາດໃຊ້ຟັງຊັ່ນການກວດ ຍອດເງິນຂ້າມທະນາຄານໄດ້.",
  },
  // 🔹 feature list from parent
  features: {
    type: Array,
    default: () => ["Free ຄ່າທຳນຽມ 0 ກີບ"],
  },
  // existing logos prop
  logos: {
    type: Array,
    default: () =>
      Array.from({ length: 16 }, (_, i) => ({
        label: `M${i + 1}`,
        // src: "/logos/member-1.svg",
      })),
  },
});

const leftPane = ref(null);
const logoGrid = ref(null);
const logoItems = ref([]);

onMounted(async () => {
  await nextTick();

  // Left description animation
  gsap.from(leftPane.value, {
    duration: 0.9,
    opacity: 0,
    x: -30,
    ease: "power3.out",
  });

  // Logo entrance
  gsap.from(logoItems.value, {
    duration: 0.7,
    opacity: 0,
    scale: 0.85,
    y: 24,
    ease: "power3.out",
    stagger: 0.06,
  });

  // Floating animation on logos
  gsap.to(logoItems.value, {
    y: -8,
    duration: 2.6,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut",
    stagger: {
      from: "center",
      amount: 1.6,
    },
  });
});
</script>

<style scoped>
/* (styles unchanged) */
.section {
  min-height: auto;
  padding: 24px 20px 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fcfdff;
  box-sizing: border-box;
}

.main-card {
  width: 100%;
  max-width: 1280px;
  min-height: auto;
  border-radius: 32px;
  background: #ffffff;
  box-shadow:
    0 32px 90px rgba(15, 23, 42, 0.14),
    0 0 0 1px rgba(148, 163, 184, 0.24);
  display: grid;
  grid-template-columns: 1fr;
  overflow: hidden;
}

.left-pane {
  padding: 28px 30px 24px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  background: radial-gradient(circle at top left, #e0f2fe 0%, #ffffff 55%);
}

.eyebrow {
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.22em;
  color: #1d4ed8;
  font-weight: 600;
}

.title {
  font-size: var(--fs-xxl);
  line-height: 1.08;
  color: #020617;
  font-weight: 700;
}

.subtitle {
  font-size: var(--fs-sm);
  color: #4b5563;
  max-width: 520px;
}

.feature-list {
  list-style: none;
  padding: 0;
  margin: 8px 0 4px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  font-size: var(--fs-base);
  font-weight: bold;
  color: #374151;
}

.feature-list li::before {
  content: "•";
  margin-right: 8px;
  color: #2563eb;
}

.cta-btn {
  margin-top: 10px;
  padding: 12px 22px;
  align-self: flex-start;
  border-radius: 999px;
  border: none;
  cursor: pointer;
  font-size: 0.95rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #ffffff;
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  box-shadow: 0 14px 28px rgba(37, 99, 235, 0.45);
  transition:
    transform 0.15s ease,
    box-shadow 0.15s ease;
}

.cta-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 18px 34px rgba(37, 99, 235, 0.6);
}

.right-pane {
  position: relative;
  padding: 24px 26px;
  background: radial-gradient(circle at 10% 0%, #1d4ed8 0%, #020617 65%);
  overflow: hidden;
}

.right-overlay {
  position: absolute;
  inset: -40%;
  background:
    radial-gradient(circle at 10% 0%, rgba(59, 130, 246, 0.6), transparent 55%),
    radial-gradient(circle at 90% 100%, rgba(56, 189, 248, 0.4), transparent 55%);
  opacity: 0.7;
  pointer-events: none;
}

.logo-grid {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 20px;
}

.logo-item {
  background: transparent;
  border: none;
  padding: 0;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  outline: none;
}

.logo-circle {
  width: clamp(80px, 8.5vw, 120px);
  aspect-ratio: 1 / 1;
  border-radius: 999px;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  background: conic-gradient(
    from 210deg,
    #bfdbfe,
    #60a5fa,
    #2563eb,
    #1d4ed8,
    #93c5fd
  );
  box-shadow:
    0 18px 32px rgba(15, 23, 42, 0.7),
    0 0 0 1px rgba(191, 219, 254, 0.4);
  overflow: hidden;
  transition:
    transform 0.22s ease,
    box-shadow 0.22s ease,
    background 0.22s ease;
}

.logo-circle::before {
  content: "";
  position: absolute;
  inset: 14%;
  border-radius: inherit;
  background: radial-gradient(
    circle at 28% 18%,
    rgba(248, 250, 252, 0.8),
    transparent 60%
  );
  mix-blend-mode: screen;
}

.logo-circle::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: linear-gradient(
    150deg,
    rgba(15, 23, 42, 0.15),
    rgba(15, 23, 42, 0.8)
  );
  opacity: 0.4;
}

.logo-label {
  position: relative;
  z-index: 1;
  font-size: 0.9rem;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #f9fafb;
}

.logo-img {
  position: relative;
  z-index: 1;
  width: 65%;
  height: 65%;
  object-fit: contain;
  filter: drop-shadow(0 5px 12px rgba(15, 23, 42, 0.65));
}

.logo-item:hover .logo-circle,
.logo-item:focus-visible .logo-circle {
  transform: translateY(-7px) scale(1.06);
  box-shadow:
    0 26px 46px rgba(15, 23, 42, 0.9),
    0 0 0 1px rgba(219, 234, 254, 0.75);
  background: conic-gradient(
    from 210deg,
    #e0f2fe,
    #60a5fa,
    #2563eb,
    #1d4ed8,
    #38bdf8
  );
}

@media (min-width: 768px) {
  .main-card {
    grid-template-columns: minmax(0, 1.05fr) minmax(0, 1.2fr);
  }

  .left-pane {
    padding: 30px 40px;
  }

  .right-pane {
    padding: 26px 32px;
  }
}

@media (max-width: 640px) {
  .section {
    padding: 24px 14px;
  }

  .left-pane {
    padding: 32px 22px 24px;
  }

  .logo-grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 12px;
  }
}
</style>
