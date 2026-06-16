<template>
  <router-view v-slot="{ Component, route }">
    <component :is="Component" :key="getRouteViewKey(route)" />
  </router-view>
  <!-- Product launch overlay — only on home path "/" -->
  <ProductLaunchPopup
    v-if="route.path === '/'"
    :show-once-per-session="false"
    primary-href="/products_service/mobile-transfer?tab=2"
  />
</template>

<script setup lang="ts">
import type { RouteLocationNormalizedLoaded } from "vue-router";
import { useRoute } from "vue-router";
import ProductLaunchPopup from "./components/overlay/ProductLaunchPopup.vue";

const route = useRoute();

function getRouteViewKey(route: RouteLocationNormalizedLoaded) {
  if (route.path.startsWith("/products_service/crossborder")) {
    return "products-crossborder";
  }

  return route.fullPath;
}
</script>

<style scoped>
:global(html, body, #app) {
  min-height: 100%;
}

:global(body) {
  margin: 0;
}
</style>
