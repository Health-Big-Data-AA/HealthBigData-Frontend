<template>
  <a :href="news.articleUrl" target="_blank" rel="noopener noreferrer" class="news-card">
    <div class="card-image-container">
      <img :src="news.imageUrl" :alt="news.title" class="card-image"/>
    </div>
    <div class="card-content">
      <h3 class="card-title">{{ news.title }}</h3>
      <div class="card-footer">
        <span class="card-source">{{ news.source }}</span>
        <span class="card-date">{{ news.date }}</span>
      </div>
    </div>
  </a>
</template>

<script setup>
defineProps({
  news: {
    type: Object,
    required: true
  }
});
</script>

<style scoped lang="scss">
.news-card {
  display: flex; /* 改为 flex 布局 */
  flex-direction: column; /* 垂直排列 */
  height: 100%; /* 占满父容器高度 */
  border-radius: 12px;
  overflow: hidden;
  background-color: #161b22;
  border: 1px solid #30363d;
  transition: box-shadow 0.3s ease;
  text-decoration: none;

  &:hover {
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
    .card-image {
      transform: scale(1.05); /* 悬浮时，只放大图片 */
    }
    .card-image-container::after {
      opacity: 1;
    }
  }
}

.card-image-container {
  width: 100%;
  padding-top: 56.25%;
  position: relative;
  overflow: hidden; /* 关键：隐藏图片放大的溢出部分 */

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.4);
    opacity: 0;
    transition: opacity 0.3s ease;
    z-index: 1;
  }
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

.card-content {
  padding: 20px; /* 增大内边距 */
  display: flex;
  flex-direction: column;
  flex-grow: 1; /* 占据剩余空间 */
}

.card-title {
  color: #e6edf3;
  font-size: 1.25rem; /* 增大标题字号 */
  font-weight: 600;
  margin: 0 0 15px 0; /* 增大了下边距 */
  line-height: 1.5;
  height: 4.5em; /* 1.5 * 3 lines */
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  flex-grow: 1; /* 占据主要空间，将 footer 推到底部 */
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem; /* 增大底部字号 */
  color: #8b949e;
  padding-top: 15px; /* 增大上边距 */
  border-top: 1px solid #30363d;
}
</style>
