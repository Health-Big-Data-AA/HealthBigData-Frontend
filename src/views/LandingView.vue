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
        <div class="search-container">
          <el-input
            v-model="searchQuery"
            placeholder="搜索内容或输入页面名称按回车跳转..."
            clearable
            size="large"
            @keyup.enter="handleSearch"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
        </div>
      </section>

      <section class="about-section">
        <h2 class="section-title">关于我们</h2>
        <p class="about-text">
          我们致力于构建一个高效、安全且功能完善的健康数据统计分析平台。通过整合、分析与可视化健康医疗数据，我们助力医疗科研机构与健康管理部门深度挖掘数据价值，为科研创新与决策支持提供强有力的工具。
        </p>
      </section>

      <ContentRow title="健康资讯">
        <NewsCard v-for="news in filteredNewsItems" :key="news.id" :news="news" />
        <p v-if="filteredNewsItems.length === 0" class="no-results">没有找到相关资讯。</p>
      </ContentRow>

      <ContentRow title="健康视频">
        <VideoCard v-for="video in filteredVideoItems" :key="video.id" :video="video" @play="playVideo(video.bvid)" />
        <p v-if="filteredVideoItems.length === 0" class="no-results">没有找到相关视频。</p>
      </ContentRow>
    </main>

    <AppFooter />

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
import { ref, reactive, computed } from 'vue';
import { useRouter } from 'vue-router';
import { Search } from '@element-plus/icons-vue';
import ContentRow from '@/components/ContentRow.vue';
import NewsCard from '@/components/NewsCard.vue';
import VideoCard from '@/components/VideoCard.vue';
import AppFooter from '@/layouts/AppFooter.vue';
import { healthNews } from '@/data/newsData.js';
import { healthVideos } from '@/data/videoData.js';

const router = useRouter();
const searchQuery = ref('');
const newsItems = ref(healthNews);
const videoItems = ref(healthVideos);

const filteredNewsItems = computed(() => {
  if (!searchQuery.value) {
    return newsItems.value;
  }
  return newsItems.value.filter(news =>
    news.title.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const filteredVideoItems = computed(() => {
  if (!searchQuery.value) {
    return videoItems.value;
  }
  return videoItems.value.filter(video =>
    video.title.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const navigationMap = {
  '仪表盘': '/dashboard',
  'dashboard': '/dashboard',
  '用户管理': '/users',
  'users': '/users',
  '角色管理': '/roles',
  'roles': '/roles',
  '权限管理': '/permissions',
  'permissions': '/permissions',
  '数据管理': '/data',
  'data': '/data',
  '标签管理': '/tags',
  'tags': '/tags',
  '统计分析': '/statistics',
  'statistics': '/statistics',
  '日志审计': '/logs',
  'logs': '/logs',
  '账户中心': '/account',
  'account': '/account',
  '登录': '/login',
  'login': '/login',
};

const handleSearch = () => {
  const query = searchQuery.value.trim().toLowerCase();
  if (navigationMap[query]) {
    router.push(navigationMap[query]);
  }
};

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
  overflow-y: auto; /* Changed from overflow-x: hidden to allow vertical scrolling */
  animation: fadeIn 1s ease-in-out;
  isolation: isolate; /* Create a new stacking context to contain the aurora background */
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
  margin-bottom: 2rem; /* Add margin to separate from search bar */
}

.search-container {
  max-width: 600px;
  margin: 0 auto;
}

.about-section {
  max-width: 900px;
  margin: 0 auto 5rem;
  padding: 2rem;
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  text-align: center;
}

.section-title {
  font-size: clamp(1.5rem, 3vw, 2rem);
  font-weight: 600;
  color: #e0e6f1;
  margin-bottom: 1rem;
}

.about-text {
  font-size: clamp(0.9rem, 1.5vw, 1.1rem);
  color: #a0aec0;
  line-height: 1.8;
}

.no-results {
  color: #a0aec0;
  width: 100%;
  text-align: center;
  padding: 2rem;
}

@media (max-width: 768px) {
  .hero-section {
    margin-bottom: 3rem;
  }
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
