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
  // --- Style Change Starts Here ---
  // 1. A slightly more complex dark background with a radial gradient to create a "spotlight" effect
  background-color: #0d1117;
  background-image: radial-gradient(ellipse 80% 50% at 50% -20%,rgba(120,119,198,0.3),hsla(0,0%,100%,0));
  position: relative; // Needed for the noise pseudo-element

  // 2. Add the subtle noise texture over the entire background
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    // A tiny, repeating noise pattern encoded as a data URL
    background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJub2lzZSI+PGZlVHVyYnVsZW5jZSB0eXBlPSJmcmFjdGFsTm9pc2UiIGJhc2VGcmVxdWVuY3k9IjAuOCIgbnVtT2N0YXZlcz0iNCIgc3RpdGNoVGlsZXM9InN0aXRjaCIvPjxmZUNvbG9yTWF0cml4IHR5cGU9Im1hdHJpeCIgdmFsdWVzPSIwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAtLjIgLjUiLz48L2ZpbHRlcj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWx0ZXI9InVybCgjbnoaXNlKSIvPjwvc3ZnPg==');
    opacity: 0.15;
    z-index: 0;
    pointer-events: none; // Make sure it doesn't interfere with clicks
  }

  // Ensure router-view content appears above the noise
  > :deep(*) {
    z-index: 1;
  }
  // --- Style Change Ends Here ---
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
