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
        <p class="hero-subtitle">洞察数据价值，赋能智慧医疗</p >
      </section>

      <section class="news-section">
        <h2 class="section-title">最新资讯</h2>
        <div class="news-grid">
          <div class="news-card">
            <div class="card-content">
              <span class="card-date">2025-09-15</span>
              <h3 class="card-title">平台 2.0 版本上线</h3>
              <p class="card-description">新增高级分析与可视化功能，提升数据洞察力。</p >
            </div>
            <div class="card-footer">
              <span>查看详情</span>
              <el-icon><ArrowRightBold /></el-icon>
            </div>
          </div>
          <div class="news-card">
            <div class="card-content">
              <span class="card-date">2025-09-02</span>
              <h3 class="card-title">达成战略合作</h3>
              <p class="card-description">与XX医疗中心携手，共建新一代健康数据模型。</p >
            </div>
            <div class="card-footer">
              <span>查看详情</span>
              <el-icon><ArrowRightBold /></el-icon>
            </div>
          </div>
          <div class="news-card">
            <div class="card-content">
              <span class="card-date">2025-08-21</span>
              <h3 class="card-title">安全体系升级</h3>
              <p class="card-description">全面通过国家三级等保认证，保障数据安全。</p >
            </div>
            <div class="card-footer">
              <span>查看详情</span>
              <el-icon><ArrowRightBold /></el-icon>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ArrowRightBold } from '@element-plus/icons-vue';
// Note: AppHeader is no longer imported here. It's handled globally in App.vue
</script>

<style lang="scss" scoped>
.page-container {
  width: 100%;
  min-height: 100vh;
  position: relative;
  overflow: hidden;
  animation: fadeIn 1s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Aurora Background (from previous step) */
.aurora-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
}
.aurora {
  position: absolute;
  border-radius: 50%;
  filter: blur(120px);
  opacity: 0.25;
}
.aurora-1 { width: 600px; height: 600px; background: #0077ff; top: -25%; left: -15%; animation: move-aurora 20s infinite alternate; }
.aurora-2 { width: 500px; height: 500px; background: #ff3c78; bottom: -30%; right: -20%; animation: move-aurora 25s infinite alternate-reverse; }
.aurora-3 { width: 400px; height: 400px; background: #39ff14; bottom: 10%; right: 25%; animation: move-aurora 15s infinite alternate; }

@keyframes move-aurora {
  from { transform: translate(0, 0) rotate(0deg) scale(1); }
  to { transform: translate(100px, 50px) rotate(180deg) scale(1.2); }
}

/* Main Content */
.main-content {
  position: relative;
  z-index: 2;
  width: 100%;
  padding: 80px max(5vw, 20px) 40px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.hero-section {
  animation: fadeInUp 1s ease-in-out 0.5s forwards;
  opacity: 0;
  margin-bottom: 5rem;
}

.hero-title {
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 700;
  background: linear-gradient(90deg, #ffffff, #bbbbbb);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 1rem;
  letter-spacing: 1.5px; /* Add some letter spacing for a more solemn look */
}

.hero-subtitle {
  font-size: clamp(1rem, 2vw, 1.25rem);
  color: #a0aec0;
  margin-bottom: 3rem;
}

.news-section {
  width: 100%;
  max-width: 1200px;
  animation: fadeInUp 1s ease-in-out 0.8s forwards;
  opacity: 0;
}

.section-title {
  font-size: 1.8rem;
  font-weight: 600;
  color: #e2e8f0;
  margin-bottom: 2rem;
  text-align: center;
}

.news-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 25px;
}

/* --- Linear Style News Card --- */
.news-card {
  // 1. A container for the glowing border effect
  position: relative;
  background: #161b22; // A dark, solid background
  border-radius: 12px;
  border: 1px solid #30363d;
  padding: 25px;
  cursor: pointer;
  overflow: hidden; // Hide the parts of the glow that are outside the border
  transition: all 0.3s ease;
  z-index: 1;

  // 2. The glowing border pseudo-element
  &::before {
    content: '';
    position: absolute;
    top: 0; right: 0; bottom: 0; left: 0;
    // A conic gradient for the rotating glow effect
    background: conic-gradient(from 180deg at 50% 50%, #2a8af6 0deg, #a853ff 180deg, #2a8af6 360deg);
    z-index: -2;
    // Initially hidden
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  // 3. An inner background to overlay on top of the glow
  &::after {
    content: '';
    position: absolute;
    top: 1px; right: 1px; bottom: 1px; left: 1px;
    background: #161b22;
    border-radius: 11px;
    z-index: -1;
  }

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    // 4. On hover, show the glowing border
    &::before {
      opacity: 1;
    }
  }
}

.card-content {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
}

.card-date {
  color: #8b949e;
  font-size: 0.9rem;
  display: block;
  margin-bottom: 10px;
}

.card-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #e6edf3;
  margin: 0 0 10px 0;
}

.card-description {
  font-size: 1rem;
  color: #8b949e;
  flex-grow: 1;
  line-height: 1.6;
}

.card-footer {
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #58a6ff;
  font-weight: 500;
  transition: color 0.3s ease;
  .el-icon {
    transition: transform 0.3s ease;
  }
}

.news-card:hover .card-footer {
  .el-icon {
    transform: translateX(5px);
  }
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
