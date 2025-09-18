<template>
  <header class="app-header">
    <div class="header-left">
      <div class="logo" @click="goHome">
        <el-icon><DataAnalysis /></el-icon>
        <span>智健数据</span>
      </div>
    </div>

    <div v-if="userStore.token" class="header-center">
      <el-menu
        mode="horizontal"
        :ellipsis="false"
        :default-active="$route.path"
        background-color="transparent"
        text-color="#a7b1c2"
        active-text-color="#ffffff"
        router
        class="top-menu"
      >
        <el-menu-item index="/dashboard">仪表盘</el-menu-item>
        <el-menu-item index="/users">用户管理</el-menu-item>
        <el-menu-item index="/roles">角色管理</el-menu-item>
        <el-menu-item index="/data">数据管理</el-menu-item>
        <el-menu-item index="/statistics">统计分析</el-menu-item>
        <el-menu-item index="/logs">日志审计</el-menu-item>
      </el-menu>
    </div>

    <div class="header-right">
      <el-dropdown v-if="userStore.token" trigger="click">
        <span class="user-profile">
          <el-avatar :size="32" class="user-avatar">{{ userStore.name.charAt(0).toUpperCase() }}</el-avatar>
          <span class="user-name">{{ userStore.name }}</span>
          <el-icon class="el-icon--right"><arrow-down /></el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="goTo('/account')">账户中心</el-dropdown-item>
            <el-dropdown-item divided @click="handleLogout" class="logout-item">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>

      <el-button v-else type="primary" plain @click="goTo('/login')">登录 / 注册</el-button>
    </div>
  </header>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { DataAnalysis, ArrowDown } from '@element-plus/icons-vue'
import { ElMessageBox, ElMessage } from 'element-plus';
import { useUserStore } from '@/stores/user';

const userStore = useUserStore();
const router = useRouter();

const goTo = (path) => {
  router.push(path);
};

const goHome = () => {
  // If logged in, go to dashboard, otherwise go to landing page
  if (userStore.token) {
    router.push('/dashboard');
  } else {
    router.push('/');
  }
}

const handleLogout = () => {
  ElMessageBox.confirm('您确定要退出登录吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    userStore.logout().then(() => {
      ElMessage.success('已成功退出');
      // After logout, redirect to the landing page
      router.push('/');
    });
  }).catch(() => {});
}
</script>

<style lang="scss" scoped>
.app-header {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: rgba(11, 15, 25, 0.7);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  color: #fff;
  padding: 0 30px;
  position: sticky;
  top: 0;
  z-index: 100;
  width: 100%;
  box-sizing: border-box;
}

.header-left .logo {
  display: flex;
  align-items: center;
  font-size: 1.2rem;
  font-weight: bold;
  cursor: pointer;
  .el-icon {
    margin-right: 8px;
    color: #409EFF;
  }
}

.header-center {
  flex-grow: 1;
  display: flex;
  justify-content: center;
  .top-menu {
    border-bottom: none;
    .el-menu-item {
      font-size: 1rem;
      padding: 0 20px;
      background-color: transparent !important;
      &:hover {
        color: #ffffff;
      }
    }
  }
}

.header-right {
  .user-profile {
    cursor: pointer;
    display: flex;
    align-items: center;
    color: #e0e0e0;
    &:hover {
      color: #ffffff;
    }
    .user-avatar {
      margin-right: 10px;
      background-color: #409EFF;
      font-weight: bold;
    }
    .user-name {
      margin-right: 5px;
    }
  }
}

.logout-item {
  color: #F56C6C;
}
</style>
