<template>
  <section ref="sectionRef" class="tech-section">
    <!-- Glowing background -->
    <div class="orb orb-main"></div>
    <div class="orb orb-left"></div>
    <div class="orb orb-right"></div>

    <div class="section-inner">
      <!-- Main heading -->
      <h1 class="hero-title">
        ຜົນປະໂຫຍດທີ່ໄດ້ຮັບ <br />
        <span style="font-size: var(--fs-md);">ດ້ານທະນາຄານສະມາຊິກ ແລະ ດ້ານລູກຄ້າຂອງທະນາຄານ.</span>
      </h1>

      <!-- Two large cards -->
      <div class="card-row">
        <article
          class="big-card"
          v-for="card in cards"
          :key="card.title"
          @click="openCard(card)"
        >
          <div class="big-card-header">
            <div class="icon-wrap">
              <i :class="card.icon"></i>
            </div>
            <h2 class="big-card-title">{{ card.title }}</h2>
          </div>

          <p class="big-card-text">
            {{ card.text }}
          </p>
        </article>
      </div>
    </div>

    <!-- Overlay Pop-up -->
    <div
      v-if="showOverlay && selectedCard"
      class="overlay-mask"
      @click.self="closeOverlay"
    >
      <div class="overlay-modal">
        <button class="overlay-close" @click="closeOverlay">
          <i class="fa-solid fa-xmark"></i>
        </button>

        <div class="overlay-icon">
          <i :class="selectedCard.icon"></i>
        </div>

        <h2 class="overlay-title">
          {{ selectedCard.title }}
        </h2>

        <p class="overlay-text">
          {{ selectedCard.text }}
        </p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import gsap from 'gsap'

const sectionRef = ref(null)

const showOverlay = ref(false)
const selectedCard = ref(null)

const cards = [
  {
    icon: 'fa-solid fa-building-columns',
    title: 'ດ້ານທະນາຄານສະມາຊິກ',
    text: 'ຊ່ວຍຫຼຸດຜ່ອນຕົ້ນທຶນທາງດ້ານບຸກຄະລາກອນທີ່ໃຫ້ບໍລິການໂອນເງິນຂ້າມທະນາຄານຜ່ານໜ່ວຍງານບໍລິການ ຫຼື ຕູ້ ATM ຂອງແຕ່ລະທະນາຄານທຸລະກິດທີ່ເປັນສະມາຊິກຂອງບໍລິສັດ LAPNet ນັ້ນ, ໃຫ້ລູກຄ້າຫັນມານຳໃຊ້ ການໂອນເງິນຂ້າມທະນາຄານເທິງມືຖື ໃນການດຳເນີນທຸລະກຳ.',
  },
  {
    icon: 'fa-solid fa-users',
    title: 'ດ້ານລູກຄ້າຂອງທະນາຄານ',
    text: 'ຜະລິດຕະພັນ ການໂອນເງິນຂ້າມທະນາຄານເທິງມືຖືນີ້ ຈະຊ່ວຍອຳນວຍຄວາມສະດວກໃຫ້ແກ່ມວນຊົນໃນການດຳເນີນທຸລະກຳທາງການເງິນຢູ່ເທິງມືຖືໄດ້ງ່າຍ ແລະ ວ່ອງໄວຂື້ນ ໂດຍນຳໃຊ້ Applications ຂອງແຕ່ລະທະນາຄານທຸລະກິດທີ່ເປັນສະມາຊິກຂອງບໍລິສັດ LAPNet, ຕາມຄຳຂວັນທີ່ກ່າວໄວ້ວ່າ: “ ທຸກທີ່ ທຸກເວລາ ທຸກຊ່ອງທາງການຊຳລະ”',
  },
]

const openCard = (card) => {
  selectedCard.value = card
  showOverlay.value = true

  nextTick(() => {
    // fade-in mask
    gsap.fromTo(
      '.overlay-mask',
      { opacity: 0 },
      { opacity: 1, duration: 0.25, ease: 'power2.out' }
    )

    // pop-up modal: animate in with slight scale-up
    gsap.fromTo(
      '.overlay-modal',
      { y: 40, opacity: 0, scale: 0.85 },
      {
        y: 0,
        opacity: 1,
        scale: 1.05,
        duration: 0.35,
        ease: 'power3.out',
        onComplete: () => {
          gsap.to('.overlay-modal', {
            scale: 1,
            duration: 0.15,
            ease: 'power1.out',
          })
        },
      }
    )
  })
}

const closeOverlay = () => {
  gsap.to('.overlay-modal', {
    y: 20,
    opacity: 0,
    scale: 0.9,
    duration: 0.25,
    ease: 'power2.in',
  })

  gsap.to('.overlay-mask', {
    opacity: 0,
    duration: 0.2,
    ease: 'power2.in',
    onComplete: () => {
      showOverlay.value = false
      selectedCard.value = null
    },
  })
}

onMounted(() => {
  const ctx = gsap.context(() => {
    const tl = gsap.timeline({
      defaults: { duration: 0.9, ease: 'power3.out' },
    })

    tl.from('.hero-title', { y: 40, opacity: 0 })
      .from('.card-row', { y: 40, opacity: 0 }, '-=0.4')
      .from('.big-card', { y: 30, opacity: 0, stagger: 0.2 }, '-=0.4')

    // Floating animation for light orbs
    gsap.to('.orb-main', {
      y: -20,
      duration: 6,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    })
    gsap.to('.orb-left', {
      y: 15,
      x: -10,
      duration: 5,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    })
    gsap.to('.orb-right', {
      y: -10,
      x: 12,
      duration: 7,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    })
  }, sectionRef)

  onBeforeUnmount(() => {
    ctx.revert()
  })
})
</script>

<style scoped>
.tech-section {
  width: 100%;
  height: auto;
  padding: 3rem 0 3.5rem;
  position: relative;
  overflow: hidden;
  color: #f7fbff;
  background: radial-gradient(circle at top, #1b2b4c 0%, #020713 55%, #00020a 100%);
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'SF Pro Text',
    'Inter', sans-serif;
}

/* Background light orbs */
.orb {
  position: absolute;
  border-radius: 999px;
  filter: blur(40px);
  opacity: 0.8;
  pointer-events: none;
}
.orb-main {
  width: 900px;
  height: 900px;
  left: 50%;
  top: 40%;
  transform: translate(-50%, -50%);
  background: radial-gradient(circle, rgba(94, 140, 255, 0.9), transparent 60%);
}
.orb-left {
  width: 260px;
  height: 260px;
  left: -60px;
  bottom: 40px;
  background: radial-gradient(circle, rgba(0, 255, 255, 0.7), transparent 70%);
}
.orb-right {
  width: 260px;
  height: 260px;
  right: -40px;
  top: 120px;
  background: radial-gradient(circle, rgba(0, 119, 255, 0.9), transparent 70%);
}

/* Inner content */
.section-inner {
  position: relative;
  z-index: 1;
  max-width: 1160px;
  height: auto;
  margin: 0 auto;
  padding: 16px 32px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 24px;
}

/* Main heading */
.hero-title {
  font-size: clamp(2.7rem, 4vw, 3.6rem);
  line-height: 1.15;
  margin: 0 0 10px;
  font-weight: 700;
  color: #eef4ff;
}
.hero-title span {
  background: linear-gradient(120deg, #5fd4ff, #9baeff, #ffffff);
  -webkit-background-clip: text;
  color: transparent;
}

/* Card row */
.card-row {
  display: flex;
  gap: 28px;
  flex-wrap: wrap;
}

/* Large cards - slightly enlarged */
.big-card {
  flex: 1;
  min-width: 320px;
  min-height: 210px;
  background: radial-gradient(circle at top left, #202956, #050818);
  border-radius: 26px;
  padding: 26px 26px 22px;
  box-shadow: 0 22px 48px rgba(0, 0, 0, 0.9);
  border: 1px solid rgba(132, 168, 255, 0.65);
  position: relative;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
}
.big-card::before {
  content: '';
  position: absolute;
  inset: -40%;
  background: radial-gradient(circle at top, rgba(115, 177, 255, 0.22), transparent 60%);
  opacity: 0.9;
  pointer-events: none;
}
.big-card:hover {
  transform: translateY(-8px) scale(1.01);
  box-shadow: 0 28px 60px rgba(0, 0, 0, 0.95);
  border-color: rgba(185, 215, 255, 0.95);
}
.big-card-header {
  position: relative;
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 14px;
}
.icon-wrap {
  width: 48px;
  height: 48px;
  border-radius: 999px;
  background: radial-gradient(circle at top, #4fc3ff, #1b37ff);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 16px 32px rgba(74, 151, 255, 0.95);
}
.icon-wrap i {
  font-size: 22px;
}
.big-card-title {
  font-size: 20px;
  font-weight: 600;
  margin: 0;
}
.big-card-text {
  position: relative;
  margin: 10px 0 4px;
  font-size: var( --fs-xs);
  line-height: 1.7;
  color: rgba(214, 227, 255, 0.96);
}

/* ------ Overlay Pop-up ------- */
.overlay-mask {
  position: fixed;
  inset: 0;
  background: radial-gradient(circle at top, rgba(36, 60, 120, 0.9), rgba(0, 0, 0, 0.94));
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
}

.overlay-modal {
  position: relative;
  width: min(780px, 94vw); /* Make overlay a bit larger */
  padding: 32px 32px 26px;
  border-radius: 26px;
  background: radial-gradient(circle at top left, #24305a, #050816);
  border: 1px solid rgba(180, 215, 255, 0.95);
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.98);
  color: #eef4ff;
}

/* Close button */
.overlay-close {
  position: absolute;
  top: 14px;
  right: 14px;
  width: 34px;
  height: 34px;
  border-radius: 999px;
  border: none;
  background: rgba(5, 12, 40, 0.95);
  color: #ffffff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s ease, transform 0.2s ease;
}
.overlay-close:hover {
  background: rgba(50, 90, 180, 0.98);
  transform: scale(1.06);
}

/* Larger icon */
.overlay-icon {
  width: 60px;
  height: 60px;
  border-radius: 999px;
  background: radial-gradient(circle at top, #4fc3ff, #1b37ff);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 18px 40px rgba(74, 151, 255, 0.95);
  margin-bottom: 18px;
}
.overlay-icon i {
  font-size: 26px;
}

.overlay-title {
  font-size: 22px;
  font-weight: 600;
  margin: 0 0 12px;
}

.overlay-text {
  font-size: 15px;
  line-height: 1.8;
  color: rgba(216, 228, 255, 0.98);
}

/* responsive */
@media (max-width: 900px) {
  .section-inner {
    padding-inline: 20px;
  }
  .big-card {
    min-width: 100%;
  }
}
</style>
