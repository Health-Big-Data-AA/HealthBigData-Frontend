<template>
  <el-container class="layout-container">
    <el-aside width="220px">
      <div class="logo" @click="goHome">
        <el-icon><DataAnalysis /></el-icon>
        <span>智健数据平台</span>
      </div>
      <el-menu
        active-text-color="#409EFF"
        background-color="#1f2937"
        class="el-menu-vertical"
        :default-active="$route.path"
        text-color="#d1d5db"
        router
      >
        <el-menu-item index="/app/dashboard">
          <el-icon><DataLine /></el-icon>
          <span>仪表盘</span>
        </el-menu-item>
        <el-menu-item index="/app/users">
          <el-icon><User /></el-icon>
          <span>用户管理</span>
        </el-menu-item>
        <el-menu-item index="/app/roles">
          <el-icon><Postcard /></el-icon>
          <span>角色管理</span>
        </el-menu-item>
        <el-menu-item index="/app/tags">
          <el-icon><PriceTag /></el-icon>
          <span>标签管理</span>
        </el-menu-item>
        <el-menu-item index="/app/data">
          <el-icon><Document /></el-icon>
          <span>数据管理</span>
        </el-menu-item>
        <el-menu-item index="/app/statistics">
          <el-icon><PieChart /></el-icon>
          <span>统计分析</span>
        </el-menu-item>
        <el-menu-item index="/app/logs">
          <el-icon><Tickets /></el-icon>
          <span>日志审计</span>
        </el-menu-item>
        <el-menu-item index="/app/about">
          <el-icon><InfoFilled /></el-icon>
          <span>关于</span>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <el-container>
      <el-header>
        <div class="header-content">
          <span>欢迎您, {{ userStore.name }}</span>
          <el-button type="primary" link @click="handleLogout">退出登录</el-button>
        </div>
      </el-header>

      <el-main>
        <RouterView />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { RouterView, useRouter } from 'vue-router'
import { DataLine, Document, User, InfoFilled, PieChart, Tickets, Postcard, PriceTag } from '@element-plus/icons-vue'
import { ElMessageBox, ElMessage } from 'element-plus';
import { useUserStore } from '@/stores/user';

const userStore = useUserStore();
const router = useRouter();

const goHome = () => {
  router.push('/app/dashboard');
};

const handleLogout = () => {
  ElMessageBox.confirm('您确定要退出登录吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    userStore.logout().then(() => {
      ElMessage({
        type: 'success',
        message: '已成功退出',
      });
    });
  }).catch(() => {});
}
</script>

<style scoped>
.layout-container {
  height: 100vh;
}
.el-aside {
  background-color: #1f2937; /* 深灰蓝色 */
  color: #d1d5db; /* 浅灰色文字 */
  transition: width 0.3s;
}
.logo {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  font-weight: bold;
  background-color: #111827; /* 更深的背景 */
  color: white;
  cursor: pointer;
}
.logo .el-icon {
  margin-right: 8px;
}
.el-menu {
  border-right: none;
}
.el-menu-item:hover {
  background-color: #374151; /* 悬停时深灰色 */
}
.el-menu-item.is-active {
  background-color: #1d4ed8 !important; /* 选中时蓝色 */
  color: white !important;
}

.el-header {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  background-color: #fff;
  border-bottom: 1px solid #e5e7eb;
}
.header-content span {
  margin-right: 15px;
  color: #333;
}
.el-main {
  background-color: #f9fafb; /* 非常浅的灰色背景 */
  padding: 20px;
}
</style>
