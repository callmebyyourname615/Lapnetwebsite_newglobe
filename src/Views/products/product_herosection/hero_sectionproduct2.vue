<template>
  <section class="hero" ref="heroRef">
    <div class="hero-inner">
      <!-- LEFT: TEXT -->
      <div class="hero-left">
        <h1 class="hero-title">
          <span> ຖອນເງິນສົດ</span> ຂ້າມ ທະນາຄານຜ່ານຕູ້ ATM
        </h1>

        <p class="hero-subtitle">
          ການຖອນເງິນສົດຜ່ານຕູ້ເອທີເອັມ ແມ່ນນຳໃຊ້ລະບົບແລັບໃນການ
          ເຊື່ອມໂຍງຕູ້ເອທີເອັມຂອງແຕ່ລະທະນາຄານທີ່ເປັນສະມາຊິກຂອງ
          ບໍລິສັດລາວ ເນເຊີນນໍເພເມັ້ນ ເນັດເວີກ ໃຫ້ສາມາດໃຊ້ຟັງຊັ່ນການຖອນ
          ເງິນຂ້າມທະນາຄານໄດ້.
        </p>

     
        <router-link :to="{ path: '/products_service/allproduct', query: { id: 2 } }">
          <tagproduct label="ຜະລິດຕະພັນ ແລະ ການບໍລິການ ທັງໝົດ" />
        </router-link>
      </div>

      <!-- RIGHT: SINGLE 3D MOCKUP FOLLOW MOUSE -->
      <div
        class="hero-right"
        ref="wrapperRef"
        @mousemove="onMouseMove"
        @mouseleave="onMouseLeave"
      >
        <!-- soft glowing shapes behind -->
        <div class="bg-orb bg-orb-1"></div>
        <div class="bg-orb bg-orb-2"></div>

        <div class="mockup-shadow"></div>

        <!-- gradient outer frame -->
        <div class="mockup-frame">
          <div class="mockup-glow-ring"></div>

          <div class="mockup-card" ref="mockupRef">
            <div class="mockup-top-bar">
              <div class="top-dots">
                <span></span><span></span><span></span>
              </div>
              <div class="top-status">
                <span class="status-dot"></span>
                <span class="status-text" style="display:flex; align-items: center;">
                  ຜະລິດຕະພັນຂອງ • LAPNet
                
                </span>
              </div>
            </div>

            <div class="mockup-inner">
              <img class="mockup-image" :src="imageSrc" alt="3D product mockup" />

              <!-- ✨ strong light sweep over image -->
              <div class="image-sweep"></div>

              <!-- top reflection -->
              <div class="mockup-reflection"></div>

              <!-- subtle diagonal shine -->
              <div class="mockup-overlay"></div>

              <div class="mockup-chip mockup-chip-bottom">
                <span class="chip-pill"></span>
                ຖອນເງິນສົດຂ້າມທະນາຄານຜ່ານຕູ້ ATM
              </div>
            </div>
          </div>
        </div>

        <!-- extra floating accents -->
        <div class="accent-pill accent-pill-1"></div>
        <div class="accent-pill accent-pill-2"></div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { gsap } from "gsap";
import tagproduct from "../../../components/tagproduct/tagproduct.vue";

const props = defineProps({
  imageSrc: {
    type: String,
    default: "/product/allatm/product3.webp",
  },
});

const heroRef = ref(null);
const wrapperRef = ref(null);
const mockupRef = ref(null);

let rotateXTo, rotateYTo, xTo, yTo;
let ctx;

const onMouseMove = (e) => {
  if (!wrapperRef.value || !mockupRef.value) return;

  const rect = wrapperRef.value.getBoundingClientRect();
  const relX = (e.clientX - rect.left) / rect.width - 0.5;
  const relY = (e.clientY - rect.top) / rect.height - 0.5;

  const maxRotation = 18;
  const maxTranslate = 18;

  const rotY = relX * maxRotation;
  const rotX = -relY * maxRotation;
  const tX = relX * maxTranslate;
  const tY = relY * maxTranslate;

  rotateXTo(rotX);
  rotateYTo(rotY);
  xTo(tX);
  yTo(tY);
};

const onMouseLeave = () => {
  if (!mockupRef.value) return;
  gsap.to(mockupRef.value, {
    rotationX: 0,
    rotationY: 0,
    x: 0,
    y: 0,
    duration: 0.7,
    ease: "power3.out",
  });
};

onMounted(() => {
  ctx = gsap.context(() => {
    gsap.from(".hero-left", {
      y: 30,
      opacity: 0,
      duration: 0.8,
      ease: "power3.out",
    });

    gsap.from(".mockup-frame", {
      y: 50,
      opacity: 0,
      duration: 1,
      ease: "power3.out",
      delay: 0.1,
    });

    rotateXTo = gsap.quickTo(mockupRef.value, "rotationX", {
      duration: 0.6,
      ease: "power3.out",
    });
    rotateYTo = gsap.quickTo(mockupRef.value, "rotationY", {
      duration: 0.6,
      ease: "power3.out",
    });
    xTo = gsap.quickTo(mockupRef.value, "x", {
      duration: 0.6,
      ease: "power3.out",
    });
    yTo = gsap.quickTo(mockupRef.value, "y", {
      duration: 0.6,
      ease: "power3.out",
    });

    gsap.to(".mockup-frame", {
      y: -10,
      duration: 3,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
      delay: 1.1,
    });

    gsap.fromTo(
      ".image-sweep",
      { x: "-140%", opacity: 0 },
      {
        x: "140%",
        opacity: 1,
        duration: 1.8,
        ease: "power2.inOut",
        repeat: -1,
        repeatDelay: 1.2,
      }
    );
  }, heroRef);
});

onBeforeUnmount(() => {
  ctx && ctx.revert();
});
</script>

<style scoped>
/* ✅ style ทั้งหมดของคุณเหมือนเดิม (ผมไม่แตะ) */
.hero {
  min-height: 78vh;
  display: flex;
  align-items: center;
  padding: 2.25rem 6vw;
  background: linear-gradient(135deg, #ffffff 0%, #ffffff 45%, #ffffff 100%);
  color: #0b1020;
  position: relative;
  overflow: hidden;
}

.hero::before {
  content: "";
  position: absolute;
  inset: -40%;
  background: radial-gradient(circle at 10% 0%, rgba(0, 51, 171, 0.1), transparent 55%),
    radial-gradient(circle at 100% 100%, rgba(0, 3, 41, 0.12), transparent 55%);
  opacity: 0.9;
  pointer-events: none;
}

.hero-inner {
  position: relative;
  z-index: 1;
  display: flex;
  gap: 4rem;
  align-items: center;
  justify-content: space-between;
  max-width: 1100px;
  margin: 0 auto;
}

.hero-left {
  flex: 1;
  max-width: 520px;
}

.hero-title {
  margin-top: 1.4rem;
  font-size: clamp(2.5rem, 3.8vw, 5.3rem);
  line-height: 1.1;
  font-weight: 700;
  color: #0b1020;
}

.hero-title span {
  background: linear-gradient(120deg, #0033ab 0%, #0078ff 40%, #00c6ff 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.hero-subtitle {
  margin-top: 1rem;

  font-size: 0.98rem;
  line-height: 1.7;
  margin-bottom: 40px;
  color: #566280;
}

.hero-right {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  perspective: 1100px;
}

.bg-orb {
  position: absolute;
  border-radius: 999px;
  filter: blur(28px);
  opacity: 0.7;
  pointer-events: none;
}

.bg-orb-1 {
  width: 220px;
  height: 220px;
  background: linear-gradient(95deg, rgba(0, 3, 41, 0.2) 0%, rgba(0, 51, 171, 0.35) 46%);
  top: -10%;
  left: 10%;
}

.bg-orb-2 {
  width: 260px;
  height: 260px;
  background: radial-gradient(circle at 30% 30%, rgba(0, 51, 171, 0.25), rgba(0, 3, 41, 0.15));
  bottom: -12%;
  right: 0;
}

.mockup-shadow {
  position: absolute;
  width: 280px;
  height: 70px;
  border-radius: 999px;
  background: rgba(8, 16, 40, 0.2);
  filter: blur(24px);
  bottom: -8px;
  z-index: 0;
}

.mockup-frame {
  position: relative;
  z-index: 1;
  padding: 1px;
  border-radius: 28px;
  background: linear-gradient(95deg, rgba(0, 3, 41, 1) 0%, rgba(0, 51, 171, 1) 46%);
  box-shadow: 0 24px 70px rgba(0, 15, 45, 0.18), 0 0 0 1px rgba(10, 20, 60, 0.08);
  overflow: hidden;
}

.mockup-glow-ring {
  position: absolute;
  inset: -16px;
  border-radius: 36px;
  background: radial-gradient(circle at 50% -10%, rgba(255, 255, 255, 0.3), transparent 65%);
  opacity: 0.9;
  pointer-events: none;
}

.mockup-card {
  position: relative;
  width: 430px;
  height: 620px;
  border-radius: 26px;
  overflow: hidden;
}

.mockup-top-bar {
  position: absolute;
  top: 8px;
  left: 10px;
  right: 10px;
  height: 26px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 0.6rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(14px);
  border: 1px solid rgba(180, 195, 245, 0.9);
  transform: translateZ(40px);
}

.top-dots {
  display: flex;
  gap: 0.25rem;
}

.top-status {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.68rem;
  color: #3f4c7a;
}

.mockup-inner {
  position: absolute;
  inset: 38px 16px 16px 16px;
  border-radius: 18px;
  overflow: hidden;
  transform: translateZ(30px);
  box-shadow: 0 16px 45px rgba(9, 22, 70, 0.22);
  background: #000;
}

.mockup-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-sweep {
  position: absolute;
  top: -20%;
  left: -40%;
  width: 60%;
  height: 140%;
  background: linear-gradient(
    120deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.9) 45%,
    rgba(255, 255, 255, 0) 100%
  );
  transform: skewX(-20deg);
  mix-blend-mode: screen;
  pointer-events: none;
  opacity: 0;
  z-index: 3;
}

.mockup-reflection {
  position: absolute;
  top: -18%;
  left: -10%;
  width: 130%;
  height: 40%;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.3), transparent 80%);
  transform: skewY(-10deg);
  pointer-events: none;
  z-index: 1;
}

.mockup-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(0, 51, 171, 0.12), transparent 45%, rgba(0, 3, 41, 0.32) 100%);
  mix-blend-mode: screen;
  pointer-events: none;
  z-index: 2;
}

.mockup-chip {
  position: absolute;
  padding: 0.4rem 0.8rem;
  border-radius: 999px;
  font-size: 0.7rem;
  background: rgba(255, 255, 255, 0.94);
  color: #2c3555;
  border: 1px solid rgba(0, 51, 171, 0.25);
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  backdrop-filter: blur(12px);
  transform: translateZ(55px);
  box-shadow: 0 8px 25px rgba(9, 22, 70, 0.15);
  z-index: 4;
}

.mockup-chip-bottom {
  bottom: 12px;
  left: 16px;
}

.chip-pill {
  width: 16px;
  height: 8px;
  border-radius: 999px;
  background: linear-gradient(95deg, rgba(0, 3, 41, 1) 0%, rgba(0, 51, 171, 1) 46%);
}

.accent-pill {
  position: absolute;
  border-radius: 999px;
  backdrop-filter: blur(12px);
  border: 1px solid rgba(0, 51, 171, 0.25);
  background: rgba(255, 255, 255, 0.8);
  box-shadow: 0 12px 30px rgba(9, 22, 70, 0.12);
}

@media (max-width: 960px) {
  .hero {
    padding: 3.4rem 7vw 4.2rem;
  }
  .hero-inner {
    flex-direction: column;
    text-align: left;
    gap: 3rem;
  }
  .hero-left {
    max-width: 100%;
  }
  .hero-right {
    width: 100%;
  }
  .mockup-card {
    width: 300px;
    height: 420px;
  }
  .mockup-frame {
    transform: scale(0.96);
  }
}

@media (max-width: 640px) {
  .hero {
    padding: 2.7rem 6vw 3.4rem;
  }
  .mockup-frame {
    transform: scale(0.9);
  }
}
</style>
