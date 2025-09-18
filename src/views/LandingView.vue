<template>
  <div class="landing-container">
    <div class="background-overlay"></div>

    <header class="main-header">
      <div class="logo">
        <el-icon><DataAnalysis /></el-icon>
        <span>智健数据</span>
      </div>
      <nav class="main-nav">
        <el-button type="primary" plain @click="goToLogin">登录 / 注册</el-button>
      </nav>
    </header>

    <main class="main-content">
      <section class="hero-section">
        <h1 class="hero-title">健康大数据平台</h1>
        <p class="hero-subtitle">洞察数据价值，赋能智慧医疗</p>
      </section>

      <section class="news-section">
        <h2 class="section-title">最新资讯</h2>
        <ul class="news-list">
          <li class="news-item">
            <span class="news-date">2025-09-15</span>
            <span class="news-title">平台 2.0 版本上线，新增高级分析功能</span>
            <el-icon><ArrowRightBold /></el-icon>
          </li>
          <li class="news-item">
            <span class="news-date">2025-09-02</span>
            <span class="news-title">与XX医疗中心达成战略合作，共建数据模型</span>
            <el-icon><ArrowRightBold /></el-icon>
          </li>
          <li class="news-item">
            <span class="news-date">2025-08-21</span>
            <span class="news-title">安全体系全面升级，通过国家三级等保认证</span>
            <el-icon><ArrowRightBold /></el-icon>
          </li>
        </ul>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { DataAnalysis, ArrowRightBold } from '@element-plus/icons-vue';

const router = useRouter();

const goToLogin = () => {
  router.push('/login');
};
</script>

<style scoped>
.landing-container {
  height: 100vh;
  width: 100vw;
  background-color: #0b0f19;
  display: flex;
  flex-direction: column;
  color: #fff;
  overflow-x: hidden;
  animation: fadeIn 1s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.background-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(ellipse at top, #1b2735 0%, #090a0f 100%);
  z-index: 1;
}

.main-header, .main-content {
  position: relative;
  z-index: 2;
  width: 100%;
  padding-left: max(5vw, 20px);
  padding-right: max(5vw, 20px);
  box-sizing: border-box;
}

.main-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 20px;
  padding-bottom: 20px;
  background-color: rgba(11, 15, 25, 0.5);
  backdrop-filter: blur(8px);
}

.logo {
  display: flex;
  align-items: center;
  font-size: 1.5rem;
  font-weight: bold;
}

.logo .el-icon {
  margin-right: 10px;
  color: #00bcd4;
}

.main-content {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.hero-section {
  animation: fadeInUp 1s ease-in-out 0.5s forwards;
  opacity: 0;
  margin-bottom: 4rem;
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.hero-title {
  font-size: 3.8rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 1rem;
}

.hero-subtitle {
  font-size: 1.25rem;
  color: #a0aec0;
  margin-bottom: 3rem;
}

.news-section {
  width: 100%;
  max-width: 800px;
  animation: fadeInUp 1s ease-in-out 0.8s forwards;
  opacity: 0;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #e2e8f0;
  margin-bottom: 1.5rem;
  text-align: left;
}

.news-list {
  list-style: none;
  padding: 0;
  margin: 0;
  text-align: left;
}

.news-item {
  display: flex;
  align-items: center;
  padding: 20px 15px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.news-item:hover {
  background-color: rgba(255, 255, 255, 0.05);
}

.news-date {
  color: #a0aec0;
  font-size: 0.9rem;
  width: 120px;
}

.news-title {
  flex-grow: 1;
  color: #e2e8f0;
  font-size: 1.1rem;
}

.news-item .el-icon {
  color: #a0aec0;
  transition: transform 0.3s ease;
}

.news-item:hover .el-icon {
  transform: translateX(5px);
}
</style>
