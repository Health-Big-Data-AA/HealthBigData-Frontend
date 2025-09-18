<template>
  <div id="app-wrapper">
    <KeyVisual v-if="showKeyVisual" @animation-finished="handleAnimationFinish" />
    <transition name="fade" mode="out-in">
      <RouterView v-if="!showKeyVisual" />
    </transition>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { RouterView } from 'vue-router';
import KeyVisual from './components/KeyVisual.vue';

const showKeyVisual = ref(true);

const handleAnimationFinish = () => {
  showKeyVisual.value = false;
};
</script>

<style>
/* Global styles */
#app-wrapper {
  height: 100vh;
  width: 100vw;
}

/* Fade transition for RouterView */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
