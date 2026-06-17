<template>
  <section ref="sectionEl" class="hero-roadmap">
    <div class="hero-inner">
      <!-- Hero text -->
      <header class="hero-copy">
        <h1 class="hero-heading">ຂັ້ນຕອນການໂອນເງິນຂ້າມທະນາຄານຜ່ານຕູ້ ATM</h1>
        <p class="hero-subtitle">
          ການໂອນເງິນຂ້າມທະນາຄານຜ່ານຕູ້ ATM ສາມາດເຮັດທຸລະກຳການໂອນໄດ້ທີ່ຕູ້ ATM ດັ່ງລຸ່ມນີ້:
        </p>
      </header>

      <!-- Timeline -->
      <div class="timeline-wrapper">
        <div class="timeline-line"></div>

        <div
          v-for="(item, index) in timeline"
          :key="index"
          class="timeline-item"
          :class="item.side"
        >
          <article class="timeline-card">
            <p class="timeline-period">{{ item.period }}</p>
            <h3 class="timeline-title">{{ item.title }}</h3>
            <p class="timeline-text">
              {{ item.text }}
            </p>
          </article>

          <span class="timeline-node"></span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { gsap } from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const sectionEl = ref(null)

const timeline = [
  {
    period: 'ຂັ້ນຕອນທີ 1 ຈຸດໃຫ້ບໍລິການ',
  
    text: `1. ບັດ ATM ຂອງທະນາຄານ (A) ສາມາດນຳໃຊ້ຕູ້ຂອງທະນາຄານ (A) ເພື່ອໂອນຫາຜູ້ຮັບປາຍທາງທີ່ທະນາຄານ (B).

2. ບັດທະນາຄານ (A) ສາມາດນຳໃຊ້ຕູ້ຂອງທະນາຄານ (B) ເພື່ອໂອນຫາຜູ້ຮັບປາຍທາງທີ່ທະນາຄານ (C).`,
    side: 'left',
  },
  {
    period: 'ຂັ້ນຕອນທີ 2 ສະມາຊິກທີ່ໃຫ້ບໍລິການ',
    title:
      'ສາມາດເລືອກໃຊ້ຕູ້ ATM ໃດກໍໄດ້ ພາຍໃນ 14 ທະນາຄານທີ່ເປັນສະມາຊິກຂອງບໍລິສັດ LAPNet.',
    text: '',
    side: 'right',
  },
  {
    period: 'ຂັ້ນຕອນທີ 3 ການເຮັດທຸລະກຳ',
    title: '',
    text: `1. ນຳບັດເອທີເອັມປ່ອນເຂົ້າຕູ້ເອທີເອັມ ເຮັດຕາມຂັ້ນຕອນການໂອນເງິນ ແລະ
ປ້ອນເລກໜ້າບັດ 16 ໂຕເລກຂອງຜູ້ຮັບປາຍທາງ ກົດຈຳນວນເງິນ ແລ້ວຢືນຢັນ.

2. ຜູ້ຮັບປາຍທາງຈະໄດ້ຮັບເງິນໂອນທັນທີ ຫຼັງຈາກທຸລະກຳການໂອນເງິນສຳເລັດ.`,
    side: 'left',
  },
]

let ctx

onMounted(() => {
  ctx = gsap.context(() => {
    /* -----------------------------
     * Hero intro animations
     * --------------------------- */
    gsap.from('.hero-heading', {
      opacity: 0,
      y: 40,
      duration: 1,
      delay: 0.2,
      ease: 'power3.out',
    })

    gsap.from('.hero-subtitle', {
      opacity: 0,
      y: 24,
      duration: 1,
      delay: 0.35,
      ease: 'power3.out',
    })

    // subtle floating of the hero block
    gsap.to('.hero-inner', {
      y: -10,
      duration: 6,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true,
    })

    /* -----------------------------
     * Timeline line progress (ScrollTrigger)
     * Fills from top to bottom while scrolling
     * --------------------------- */
    gsap.fromTo(
      '.timeline-line',
      {
        scaleY: 0,
        transformOrigin: 'top center',
      },
      {
        scaleY: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: '.timeline-wrapper',
          start: 'top 70%',
          end: 'bottom 20%',
          scrub: 0.5,
        },
      }
    )

    /* Breathing glow on nodes */
    gsap.to('.timeline-node', {
      boxShadow: '0 0 28px rgba(37, 99, 235, 1)',
      duration: 1.6,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      stagger: 0.2,
    })

    /* -----------------------------
     * Cards & nodes reveal on scroll
     * slide from side (left/right)
     * --------------------------- */
    gsap.utils.toArray('.timeline-item').forEach((el, idx) => {
      const item = el
      const isLeft = item.classList.contains('left')
      const card = item.querySelector('.timeline-card')
      const node = item.querySelector('.timeline-node')

      // Card animation
      gsap.from(card, {
        opacity: 0,
        y: 60,
        x: isLeft ? 40 : -40,
        duration: 1,
        delay: idx * 0.05,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: item,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      })

      // Node pop-in
      if (node) {
        gsap.from(node, {
          scale: 0,
          opacity: 0,
          filter: 'blur(4px)',
          duration: 0.6,
          ease: 'back.out(1.8)',
          scrollTrigger: {
            trigger: item,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        })
      }
    })
  }, sectionEl)
})

onBeforeUnmount(() => {
  if (ctx) ctx.revert()
})
</script>

<style scoped>
.hero-roadmap {
  position: relative;
  min-height: auto;
  padding: 1.75rem 8vw 2rem;
  background: radial-gradient(circle at top left, #e0f2ff 0, #f5f7ff 45%, #e1e9ff 100%);
  color: #0f172a;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI',
    sans-serif;
  overflow: hidden;
}

.hero-inner {
  max-width: 1100px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

/* Hero text */
.hero-copy {
  max-width: 520px;
}

/* eyebrow now behaves as logo container */
.eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  margin-bottom: 0.8rem;
}

.eyebrow img {
  height: 52px; /* adjust size as you like */
  width: auto;
}

/* Heading & subtitle */
.hero-heading {
  font-size: clamp(2.4rem, 4vw, 3.1rem);
  font-weight: 700;
  letter-spacing: 0.03em;
  margin-bottom: 1rem;
  color: #0b1120;
}

.hero-subtitle {
  font-size : 1.2rem;;
  line-height: 1.7;
  color: #1f1f1f;
}

/* Timeline layout */
.timeline-wrapper {
  position: relative;
  margin-top: 1.25rem;
  padding-bottom: 0.5rem;
}

.timeline-line {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 50%;
  width: 2px;
  transform: translateX(-50%);
  background: linear-gradient(
    to bottom,
    rgba(59, 130, 246, 0.1),
    rgba(37, 99, 235, 0.75),
    rgba(59, 130, 246, 0.15)
  );
  box-shadow: 0 0 24px rgba(37, 99, 235, 0.4);
  opacity: 0.7;
}

.timeline-item {
  position: relative;
  margin: 1.5rem 0;
}

/* Cards */
.timeline-card {
  position: relative;
  max-width: 540px;
  padding: 1.3rem 1.6rem;
  border-radius: 1.1rem;
  border: 1px solid rgba(148, 163, 184, 0.45);
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(239, 246, 255, 0.96));
  box-shadow: 0 24px 60px rgba(15, 23, 42, 0.18);
  backdrop-filter: blur(16px);
}

.timeline-item.left .timeline-card {
  margin-right: calc(50% + 3rem);
  margin-left: auto;
  text-align: left;
}

.timeline-item.right .timeline-card {
  margin-left: calc(50% + 3rem);
}

.timeline-period {
  font-size: 1.2rem;
  font-weight: 500;
  text-transform: uppercase;
  color: #60a5fa;
  margin-bottom: 0.45rem;
}

.timeline-title {
  font-size: 1.02rem;
  font-weight: 600;
  margin-bottom: 0.3rem;
  color: #0f172a;
}

/* text with new lines */
.timeline-text {
  font-size: 1rem;
  line-height: 1.55;
  color: #475569;
  white-space: pre-line;
  
}

/* Node */
.timeline-node {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 16px;
  height: 16px;
  transform: translate(-50%, -50%);
  border-radius: 999px;
  background: radial-gradient(circle at 30% 20%, #eff6ff, #3b82f6 40%, #1d4ed8 80%);
  box-shadow: 0 0 18px rgba(37, 99, 235, 0.85);
}

/* Performance hint for smoother animation */
.timeline-card,
.timeline-node,
.timeline-line {
  will-change: transform, opacity, box-shadow;
}

.timeline-node::after {
  content: '';
  position: absolute;
  inset: -7px;
  border-radius: inherit;
  border: 1px solid rgba(129, 140, 248, 0.5);
}

/* Responsive timeline */
@media (max-width: 900px) {
  .hero-roadmap {
    padding-inline: 1.5rem;
  }

  .timeline-line {
    left: 1.2rem;
    transform: none;
  }

  .timeline-node {
    left: 1.2rem;
    transform: translate(-50%, -50%);
  }

  .timeline-item.left .timeline-card,
  .timeline-item.right .timeline-card {
    margin: 0;
    margin-left: 3.5rem;
    text-align: left;
  }

  .timeline-card {
    max-width: none;
  }
}

@media (max-width: 600px) {
  .hero-roadmap {
    padding-top: 4rem;
  }

  .timeline-item {
    margin: 2.4rem 0;
  }
}
</style>
