<template>
  <div class="video-card" @click="$emit('play')">
    <div class="card-image-container">
      <img :src="video.imageUrl" :alt="video.title" class="card-image"/>
      <div class="play-icon-overlay">
        <el-icon><VideoPlay /></el-icon>
      </div>
    </div>
    <div class="card-content">
      <h3 class="card-title">{{ video.title }}</h3>
      <div class="card-footer">
        <span class="card-uploader">{{ video.uploader }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { VideoPlay } from '@element-plus/icons-vue';
defineProps({
  video: {
    type: Object,
    required: true
  }
});
defineEmits(['play']);
</script>

<style scoped lang="scss">
.video-card {
  display: flex;
  flex-direction: column;
  height: 100%;
  border-radius: 12px;
  overflow: hidden;
  background-color: #161b22;
  border: 1px solid #30363d;
  transition: box-shadow 0.3s ease;
  cursor: pointer;
  position: relative;

  &:hover {
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
    .card-image {
      transform: scale(1.05); /* 悬浮时，只放大图片 */
    }
    .play-icon-overlay {
      opacity: 1;
    }
  }
}

.card-image-container {
  width: 100%;
  padding-top: 56.25%;
  position: relative;
  overflow: hidden; /* 关键：隐藏图片放大的溢出部分 */
}

.card-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94); /* 平滑的放大动画 */
}

.play-icon-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.1) 50%, rgba(0, 0, 0, 0.7) 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 50px;
  color: rgba(255, 255, 255, 0.8);
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: 2;
}

.card-content {
  padding: 20px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.card-title {
  color: #e6edf3;
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0 0 10px 0;
  line-height: 1.5;
  height: 3em; /* 1.5 * 2 lines */
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  flex-grow: 1;
}

.card-footer {
  font-size: 0.9rem;
  color: #8b949e;
}
</style>
