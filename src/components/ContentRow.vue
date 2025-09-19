<template>
  <section
    class="content-row"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <h2 class="section-title">{{ title }}</h2>
    <div class="horizontal-scroll-container" ref="scrollContainer">
      <div class="card-list" ref="cardList">
        <slot></slot>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';

defineProps({
  title: String
});

// [新增] 定义 emit 事件，用于通知父组件
const emit = defineEmits(['update:active']);

const scrollContainer = ref(null);
const cardList = ref(null); // Add a new ref for the card list
const isHovering = ref(false);

// --- [新增] 惯性滚动所需变量 ---
const velocity = ref(0); // 滚动速度
const animationFrame = ref(null); // requestAnimationFrame 的 ID
const friction = 0.92; // 摩擦力系数，值越小，停止得越快

// --- [修改] 滚轮事件处理 ---
const handleWheel = (event) => {
  // If the event target is the card list container itself (the gap), do not prevent default scrolling.
  if (event.target === cardList.value) {
    return;
  }

  if (Math.abs(event.deltaY) > Math.abs(event.deltaX)) {
    event.preventDefault();
    // 不再直接滚动，而是给一个“推力”（速度）
    velocity.value += event.deltaY * 0.5; // 乘以0.5降低灵敏度
    startMomentumScroll();
  }
};

// --- [新增] 动感滚动循环 ---
const momentumScrollLoop = () => {
  if (Math.abs(velocity.value) < 0.1) {
    // 速度足够小，停止动画
    cancelAnimationFrame(animationFrame.value);
    animationFrame.value = null;
    return;
  }
  // 根据当前速度进行滚动
  scrollContainer.value.scrollLeft += velocity.value;
  // 施加摩擦力，让速度衰减
  velocity.value *= friction;
  // 继续下一帧动画
  animationFrame.value = requestAnimationFrame(momentumScrollLoop);
};

// --- [新增] 启动动感滚动 ---
const startMomentumScroll = () => {
  if (!animationFrame.value) {
    animationFrame.value = requestAnimationFrame(momentumScrollLoop);
  }
};

// --- [新增] 鼠标进入和离开的处理 ---
const handleMouseEnter = () => {
  isHovering.value = true;
  emit('update:active', true); // 通知父组件，背景变暗
  if (scrollContainer.value) {
    scrollContainer.value.addEventListener('wheel', handleWheel, { passive: false });
  }
};
const handleMouseLeave = () => {
  isHovering.value = false;
  emit('update:active', false); // 通知父组件，背景恢复
  if (scrollContainer.value) {
    scrollContainer.value.removeEventListener('wheel', handleWheel);
  }
};

onMounted(() => {
  // No longer adding the event listener on mount
});

onBeforeUnmount(() => {
  if (scrollContainer.value) {
    scrollContainer.value.removeEventListener('wheel', handleWheel);
  }
  if (animationFrame.value) {
    cancelAnimationFrame(animationFrame.value);
  }
});
</script>

<style scoped lang="scss">
.content-row {
  width: 100%;
  margin-bottom: 5rem; /* 增大行间距 */
}

.section-title {
  font-size: 2.2rem; /* 增大标题字号 */
  font-weight: 600;
  color: #e2e8f0;
  margin-bottom: 2rem; /* 增大标题与卡片间距 */
  padding-left: max(5vw, 20px);
}

.horizontal-scroll-container {
  overflow-x: auto;
  overflow-y: hidden;
  white-space: nowrap;
  padding-bottom: 20px;

  &::-webkit-scrollbar {
    height: 8px;
  }
  &::-webkit-scrollbar-track {
    background: #161b22;
    border-radius: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: #30363d;
    border-radius: 4px;
  }
}

.card-list {
  display: inline-flex;
  gap: 30px; /* 增大卡片间距 */
  padding: 0 max(5vw, 20px);
  > :deep(*) {
    width: 40vw; /* 【核心修改】卡片宽度为视口宽度的40% */
    max-width: 500px; /* 限制最大宽度 */
    height: 60vh; /* 【核心修改】卡片高度为视口高度的60% */
    max-height: 450px; /* 限制最大高度 */
    flex-shrink: 0;
    white-space: normal;
  }
}

@media (max-width: 768px) {
  .section-title {
    font-size: 1.8rem;
    padding-left: 20px;
  }

  .horizontal-scroll-container {
    overflow-x: hidden; /* Hide horizontal scrollbar on mobile */
  }

  .card-list {
    display: flex;
    flex-direction: column; /* Stack cards vertically */
    gap: 20px;
    padding: 0 20px;

    > :deep(*) {
      width: 100%; /* Make cards full-width */
      height: auto; /* Adjust height automatically */
      max-height: none;
    }
  }
}
</style>
