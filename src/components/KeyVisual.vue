<template>
  <div class="key-visual-container" :class="{ 'fade-out': finished }">
    <h1 class="title">
      <span
        v-for="(char, index) in title"
        :key="index"
        :style="{ animationDelay: `${index * 0.1}s` }"
      >
        {{ char }}
      </span>
    </h1>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const emit = defineEmits(['animation-finished']);
const title = "健康大数据应用创新研发中心统计分析";
const finished = ref(false);

onMounted(() => {
  const animationDuration = title.length * 0.1; // Stagger delay
  const displayDuration = 2; // How long to display after animation
  const fadeOutDuration = 0.5; // CSS fade-out duration

  // Trigger fade-out class
  setTimeout(() => {
    finished.value = true;
  }, (animationDuration + displayDuration) * 1000);

  // Emit event to parent component to switch views
  setTimeout(() => {
    emit('animation-finished');
  }, (animationDuration + displayDuration + fadeOutDuration) * 1000);
});
</script>

<style scoped>
.key-visual-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100vh;
  background-color: #0a0a1a;
  opacity: 1;
  transition: opacity 0.5s ease-out;
}

.key-visual-container.fade-out {
  opacity: 0;
}

.title {
  font-size: 3rem;
  font-weight: 600;
  color: #fff;
  text-align: center;
  letter-spacing: 4px;
}

.title span {
  opacity: 0;
  animation: fadeInChar 0.8s ease-in-out forwards;
  display: inline-block; /* Needed for animation */
}

@keyframes fadeInChar {
  0% {
    opacity: 0;
    transform: translateY(20px) scale(0.9);
    text-shadow: 0 0 5px rgba(255, 255, 255, 0);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
    text-shadow: 0 0 15px rgba(255, 255, 255, 0.5);
  }
}

/* Responsive font size */
@media (max-width: 768px) {
  .title {
    font-size: 1.8rem;
  }
}
</style>
