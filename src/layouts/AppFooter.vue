<template>
  <footer class="app-footer">
    <div class="footer-container">
      <div class="footer-links">
        <div class="link-column">
          <h4>关于项目</h4>
          <ul>
            <li><a href="#">项目简介</a></li>
            <li><a href="#">技术架构</a></li>
            <li><a href="#">核心团队</a></li>
            <li><a href="#">联系我们</a></li>
          </ul>
        </div>
        <div class="link-column">
          <h4>新闻与活动</h4>
          <ul>
            <li><a href="#">最新动态</a></li>
            <li><a href="#">技术分享会</a></li>
            <li><a href="#">开源社区</a></li>
          </ul>
        </div>
        <div class="link-column">
          <h4>相关资源</h4>
          <ul>
            <li><a href="#">API文档</a></li>
            <li><a href="#">开发博客</a></li>
            <li><a href="#">数据源说明</a></li>
            <li><a href="#">隐私政策</a></li>
          </ul>
        </div>
        <div class="link-column">
          <h4>技术支持</h4>
          <ul>
            <li><a href="#">常见问题</a></li>
            <li><a href="#">提交工单</a></li>
            <li><a href="#">安全应急响应</a></li>
          </ul>
        </div>
      </div>
      <div class="footer-search">
        <h4>订阅我们</h4>
        <p>获取项目最新的动态和技术更新。</p>
        <el-input placeholder="请输入您的邮箱" class="subscribe-input">
          <template #append>
            <el-button>订阅</el-button>
          </template>
        </el-input>
      </div>
    </div>
    <div class="footer-bottom">
      <div class="copyright">
        © 2025 Health Big Data Platform. All Rights Reserved.
      </div>
      <div class="bottom-links">
        <a href="#">隐私政策</a>
        <span>|</span>
        <a href="#">服务条款</a>
        <span>|</span>
        <a href="#">联系我们</a>
        <span>|</span>
        <a href="#">加入我们</a>
      </div>
    </div>
  </footer>
</template>

<script setup>
// No script logic needed for this static component yet.
</script>

<style lang="scss" scoped>
.app-footer {
  background-color: #f5f5f7;
  color: #515151;
  padding: 60px 0 20px 0;
  border-top: 1px solid #e0e0e0;
}

.footer-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}

.footer-links {
  display: flex;
  justify-content: space-around; // Distribute columns evenly
  flex-grow: 1; // Allow the container to fill available space
  margin-right: 5%; // Add some space next to the search bar
}

.link-column {
  text-align: center; // Center align the text in each column

  h4 {
    font-size: 1rem;
    color: #333;
    margin-bottom: 20px;
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;

    li {
      margin-bottom: 12px;

      a {
        text-decoration: none;
        color: #6c757d;
        font-size: 0.875rem;

        &:hover {
          color: #007bff;
        }
      }
    }
  }
}

.footer-search {
  max-width: 300px;

  h4 {
    font-size: 1rem;
    color: #333;
    margin-bottom: 20px;
  }

  p {
    font-size: 0.875rem;
    color: #6c757d;
    margin-bottom: 20px;
  }
}

.subscribe-input {
  :deep(.el-input-group__append) {
    background-color: #007bff;
    color: white;
    border-color: #007bff;

    &:hover {
      background-color: #0056b3;
    }
  }
}

.footer-bottom {
  max-width: 1400px;
  margin: 40px auto 0;
  padding: 20px;
  border-top: 1px solid #e0e0e0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.875rem;
  color: #6c757d;
}

.bottom-links {
  a {
    text-decoration: none;
    color: #6c757d;
    margin: 0 10px;

    &:hover {
      color: #007bff;
    }
  }

  span {
    color: #e0e0e0;
  }
}

@media (max-width: 1024px) {
  .footer-links {
    flex-wrap: wrap;
    justify-content: flex-start; // Adjust for smaller screens
    gap: 40px;
  }
  .footer-search {
    margin-top: 40px;
  }
}

@media (max-width: 768px) {
  .footer-container {
    flex-direction: column;
  }
  .link-column {
    flex: 1 1 40%; // Two columns on mobile
    margin-bottom: 30px;
    text-align: left; // Revert to left-align on mobile for readability
  }
  .footer-bottom {
    flex-direction: column;
    gap: 15px;
  }
}
</style>
