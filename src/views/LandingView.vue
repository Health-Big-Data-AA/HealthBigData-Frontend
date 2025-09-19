<template>
  <div class="page-container">
    <div class="aurora-background">
      <div class="aurora aurora-1"></div>
      <div class="aurora aurora-2"></div>
      <div class="aurora aurora-3"></div>
    </div>

    <main class="main-content">
      <section class="hero-section">
        <h1 class="hero-title">健康大数据平台</h1>
        <p class="hero-subtitle">洞察数据价值，赋能智慧医疗</p>
      </section>

      <ContentRow title="健康资讯">
        <NewsCard v-for="news in newsItems" :key="news.id" :news="news" />
      </ContentRow>

      <ContentRow title="健康视频">
        <VideoCard v-for="video in videoItems" :key="video.id" :video="video" @play="playVideo(video.bvid)" />
      </ContentRow>
    </main>

    <el-dialog
      v-model="videoPlayer.visible"
      title="视频播放"
      width="60%"
      destroy-on-close
      custom-class="video-dialog"
    >
      <div class="video-iframe-container">
        <iframe
          :src="videoPlayer.url"
          scrolling="no"
          border="0"
          frameborder="no"
          framespacing="0"
          allowfullscreen="true">
        </iframe>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import ContentRow from '@/components/ContentRow.vue';
import NewsCard from '@/components/NewsCard.vue';
import VideoCard from '@/components/VideoCard.vue';
import { healthNews } from '@/data/newsData.js';
import { healthVideos } from '@/data/videoData.js';

const newsItems = ref(healthNews);
const videoItems = ref(healthVideos);

const videoPlayer = reactive({
  visible: false,
  url: ''
});

const playVideo = (bvid) => {
  videoPlayer.url = `//player.bilibili.com/player.html?bvid=${bvid}&page=1&as_wide=1&high_quality=1&danmaku=0`;
  videoPlayer.visible = true;
};
</script>

<style lang="scss" scoped>
.page-container {
  width: 100%;
  min-height: 100vh;
  position: relative;
  overflow-x: hidden;
  animation: fadeIn 1s ease-in-out;
}
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

.aurora-background{position:fixed;top:0;left:0;right:0;bottom:0;z-index: -1}
.aurora{position:absolute;border-radius:50%;filter:blur(120px);opacity:.25}
.aurora-1{width:600px;height:600px;background:#0077ff;top:-25%;left:-15%;animation:move-aurora 20s infinite alternate}
.aurora-2{width:500px;height:500px;background:#ff3c78;bottom:-30%;right:-20%;animation:move-aurora 25s infinite alternate-reverse}
.aurora-3{width:400px;height:400px;background:#39ff14;bottom:10%;right:25%;animation:move-aurora 15s infinite alternate}
@keyframes move-aurora{from{transform:translate(0,0) rotate(0) scale(1)}to{transform:translate(100px,50px) rotate(180deg) scale(1.2)}}

.main-content {
  position: relative;
  z-index: 2;
  width: 100%;
  padding: 80px 0 40px;
  box-sizing: border-box;
}

.hero-section {
  text-align: center;
  margin-bottom: 5rem;
}
.hero-title {
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 700;
  background: linear-gradient(90deg, #ffffff, #bbbbbb);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 1rem;
}
.hero-subtitle {
  font-size: clamp(1rem, 2vw, 1.25rem);
  color: #a0aec0;
}

.video-iframe-container {
  position: relative;
  padding-bottom: 56.25%;
  height: 0;
  overflow: hidden;

  iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
}
:deep(.video-dialog) {
  background-color: #161b22;
  border: 1px solid #30363d;
  .el-dialog__title { color: #e6edf3; }
  .el-dialog__headerbtn .el-dialog__close { color: #e6edf3; }
}
</style>
