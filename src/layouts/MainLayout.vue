<template>
  <el-container class="layout-container">
    <el-aside width="220px">
      <div class="logo">
        <span>健康大数据分析平台</span>
      </div>
      <el-menu
        active-text-color="#ffd04b"
        background-color="#222d32"
        class="el-menu-vertical"
        :default-active="$route.path"
        text-color="#fff"
        router
      >
        <el-menu-item index="/">
          <el-icon><DataLine /></el-icon>
          <span>仪表盘</span>
        </el-menu-item>
        <el-menu-item index="/users">
          <el-icon><User /></el-icon>
          <span>用户管理</span>
        </el-menu-item>
        <el-menu-item index="/data">
          <el-icon><Document /></el-icon>
          <span>数据管理</span>
        </el-menu-item>

        <el-menu-item index="/statistics">
          <el-icon><DataLine /></el-icon> <span>统计分析</span>
        </el-menu-item>

        <el-menu-item index="/logs">
          <el-icon><Tickets /></el-icon> <span>日志审计</span>
        </el-menu-item>

        <el-menu-item index="/about">
          <el-icon><InfoFilled /></el-icon>
          <span>关于</span>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <el-container>
      <el-header>
        <div class="header-content">
          <span>欢迎您, admin</span>
          <el-button type="primary" link @click="logout">退出登录</el-button>
        </div>
      </el-header>

      <el-main>
        <RouterView />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { RouterView, useRouter } from 'vue-router'
import { DataLine, Document, User, InfoFilled } from '@element-plus/icons-vue'
import { ElMessageBox, ElMessage } from 'element-plus';

const router = useRouter();

const logout = () => {
  ElMessageBox.confirm('您确定要退出登录吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    // 在这里执行登出操作，例如清除token
    localStorage.removeItem('user-token');
    ElMessage({
      type: 'success',
      message: '已成功退出',
    });
    router.push('/login');
  }).catch(() => {
    // 用户点击了取消
  });
}

</script>

<style scoped>
.layout-container {
  height: 100vh;
}

.el-aside {
  background-color: #222d32;
  color: white;
}

.logo {
  height: 60px;
  line-height: 60px;
  text-align: center;
  font-size: 1.2rem;
  font-weight: bold;
  background-color: #1e282c;
}

.el-menu {
  border-right: none;
}

.el-header {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  background-color: #fff;
  border-bottom: 1px solid #dcdfe6;
}

.el-main {
  background-color: #f4f4f5;
  padding: 20px;
}
</style>
