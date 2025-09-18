<template>
  <div class="page-container">
    <div v-if="title" class="page-header">
      <h1 class="page-title">{{ title }}</h1>
    </div>
    <div class="page-content">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: ''
  }
});
</script>

<style lang="scss" scoped>
.page-container {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 40px;
  box-sizing: border-box;
  animation: fadeIn 0.5s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.page-header {
  margin-bottom: 30px;
}

.page-title {
  font-size: 2rem;
  font-weight: 600;
  color: #f0f0f0;
  letter-spacing: 1px;
}
</style>
