<template>
  <el-container class="layout-container">
    <el-aside width="220px">
      <div class="logo">
        <span>智健数据平台</span>
      </div>
      <el-menu
        active-text-color="#ffd04b"
        background-color="#222d32"
        class="el-menu-vertical"
        :default-active="$route.path"
        text-color="#fff"
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
          <el-icon><Tickets /></el-icon>
          <span>标签管理</span>
        </el-menu-item>
        <el-menu-item index="/app/data">
          <el-icon><Document /></el-icon>
          <span>数据管理</span>
        </el-menu-item>
        <el-menu-item index="/app/statistics">
          <el-icon><PieChart /></el-icon> <span>统计分析</span>
        </el-menu-item>
        <el-menu-item index="/app/logs">
          <el-icon><Tickets /></el-icon> <span>日志审计</span>
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
import { RouterView, useRouter } from 'vue-router' // 引入 useRouter
import { DataLine, Document, User, InfoFilled, PieChart, Tickets, Postcard } from '@element-plus/icons-vue'
import { ElMessageBox, ElMessage } from 'element-plus';
import { useUserStore } from '@/stores/user';

const userStore = useUserStore();
const router = useRouter(); // 获取 router 实例

// 【新增】点击 Logo 返回仪表盘
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
  cursor: pointer; /* 新增鼠标手势 */
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
.header-content span {
  margin-right: 15px;
}
.el-main {
  background-color: #f4f4f5;
  padding: 20px;
}
</style>
