<script setup>
import { computed } from 'vue'
import DarkVeil from '../aurora/DarkVeil.vue'

const props = defineProps({
  // Main title at the top
  title: {
    type: String,
    required: true
  },
  // Breadcrumb / navigator path
  breadcrumb: {
    type: Array,
    default: () => []
  },
  // Background image url
  backgroundImage: {
    type: String,
    default: '/overlaynav/product/navigatorcontent-bg.png'
  }
})

const containerStyle = computed(() => ({
  backgroundImage: `url(${props.backgroundImage})`
}))
</script>

<template>
  <header class="hero">
    <div class="hero__aurora" aria-hidden="true">
      <DarkVeil :hue-shift="20" :speed="0.6" />
    </div>
    <div class="hero__overlay">
      <div class="hero__inner">
        <!-- Title -->
        <h1 class="hero__title">
          {{ title }}
        </h1>

        <!-- Breadcrumb -->
        <nav
          v-if="breadcrumb.length"
          class="hero__breadcrumb"
          aria-label="Breadcrumb"
        >
          <ol class="hero__breadcrumb-list">
            <li
              v-for="(item, index) in breadcrumb"
              :key="index"
              class="hero__breadcrumb-item"
            >
              <span class="hero__breadcrumb-text">{{ item }}</span>

              <i
                v-if="index !== breadcrumb.length - 1"
                class="fa-solid fa-chevron-right hero__breadcrumb-separator"
                aria-hidden="true"
              ></i>
            </li>
          </ol>
        </nav>
      </div>
    </div>
  </header>
</template>

<style scoped>
/* ===== Layout base ===== */
.hero {
  width: 100%;
  min-height: 180px;
  display: flex;
  align-items: flex-end;
  position: relative;
  overflow: hidden;
  background: #050b1b;
}

.hero__aurora {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
}

.hero__overlay {
  position: relative;
  z-index: 1;
}

.hero__overlay {
  width: 100%;
  background: transparent;
  padding: clamp(1.25rem, 2.5vw, 2rem) 1.5rem 2.25rem;
  box-sizing: border-box;
}

/* center content + control width */
.hero__inner {
  max-width: 1140px;
  margin: 0 auto;
  text-align: center;
}

/* ===== Title ===== */
.hero__title {
  color: #fff;
  font-weight: bold;
  font-size: clamp(2rem, 4vw, 3.25rem); /* responsive font size */
  line-height: 1.2;
  margin: 0 0 1rem;
}

/* ===== Breadcrumb ===== */
.hero__breadcrumb {
  display: flex;
  justify-content: center;
}

.hero__breadcrumb-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem 1.5rem; /* row gap / column gap */
  padding: 0;
  margin: 0;
  list-style: none;
  align-items: center;
}

.hero__breadcrumb-item {
  display: inline-flex;
  align-items: center;
  color: #fff;
  font-size: var(--fs-base, 0.875rem);
}

.hero__breadcrumb-text {
  white-space: nowrap;
}

.hero__breadcrumb-separator {
  margin-left: 0.75rem;
  font-size: var(--fs-base, 0.875rem);
}

/* ===== Responsiveness ===== */
@media (max-width: 768px) {
  .hero__inner {
    text-align: left;
  }

  .hero__breadcrumb {
    justify-content: flex-start;
  }

  .hero__breadcrumb-text {
    white-space: normal; /* allow wrap on very small screens */
  }
  .hero__overlay {
    padding: 1rem 1rem 1.75rem;
  }
}

@media (max-width: 480px) {
  .hero__overlay {
    padding: 1rem 1rem 1.75rem;
  }

  .hero__title {
    font-size: 1.75rem;
  }

  .hero__breadcrumb-list {
    gap: 0.4rem 0.75rem;
  }
}
</style>
