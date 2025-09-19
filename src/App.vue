<template>
  <div class="app-container">
    <AppHeader />

    <router-view v-slot="{ Component }">
      <transition name="fade-transform" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

<script setup>
import AppHeader from '@/layouts/AppHeader.vue';
</script>

<style lang="scss">
/* Global styles for the entire application */
body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
}

.app-container {
  min-height: 100vh;
  background: linear-gradient(180deg, #1c233c, #0d1117); /* A deep blue to near-black gradient */
  color: #e0e6f1; /* A light text color for better readability */
}


/* A beautiful transition for page switching */
.fade-transform-enter-active,
.fade-transform-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-transform-enter-from {
  opacity: 0;
  transform: translateY(15px);
}

.fade-transform-leave-to {
  opacity: 0;
  transform: translateY(-15px);
}
</style>
