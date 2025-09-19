<template>
  <header class="app-header">
    <div class="header-left">
      <div class="logo" @click="goHome">
        <el-icon><DataAnalysis /></el-icon>
        <span class="logo-text">智健数据</span>
      </div>
    </div>

    <!-- Desktop Menu -->
    <div v-if="userStore.token" class="header-center desktop-only">
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
        <el-menu-item index="/">首页</el-menu-item>
        <el-menu-item index="/dashboard">仪表盘</el-menu-item>
        <el-menu-item index="/users" v-if="hasRole(['ADMIN'])">用户管理</el-menu-item>
        <el-menu-item index="/roles" v-if="hasRole(['ADMIN'])">角色管理</el-menu-item>
        <el-menu-item index="/permissions" v-if="hasRole(['ADMIN'])">权限管理</el-menu-item>
        <el-menu-item index="/data" v-if="hasRole(['ADMIN', 'RESEARCHER', 'ANALYST'])">数据管理</el-menu-item>
        <el-menu-item index="/tags" v-if="hasRole(['ADMIN', 'RESEARCHER', 'ANALYST'])">标签管理</el-menu-item>
        <el-menu-item index="/statistics" v-if="hasRole(['ADMIN', 'ANALYST'])">统计分析</el-menu-item>
        <el-menu-item index="/logs" v-if="hasRole(['ADMIN', 'AUDITOR'])">日志审计</el-menu-item>
      </el-menu>
    </div>

    <div class="header-right">
      <el-dropdown v-if="userStore.token" trigger="click">
        <span class="user-profile">
          <el-avatar :size="32" :src="userStore.avatarUrl" class="user-avatar">{{ userStore.name.charAt(0).toUpperCase() }}</el-avatar>
          <span class="user-name desktop-only">{{ userStore.name }}</span>
          <el-icon class="el-icon--right desktop-only"><arrow-down /></el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="goTo('/account')">账户中心</el-dropdown-item>
            <el-dropdown-item divided @click="handleLogout" class="logout-item">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>

      <el-button v-else type="primary" plain @click="goTo('/login')">登录 / 注册</el-button>

      <!-- Mobile Menu Icon -->
      <el-icon v-if="userStore.token" class="mobile-menu-icon mobile-only" @click="drawerVisible = true">
        <Menu />
      </el-icon>
    </div>

    <!-- Mobile Drawer Menu -->
    <el-drawer
      v-model="drawerVisible"
      title="导航"
      direction="rtl"
      size="250px"
      class="mobile-drawer"
    >
      <el-menu
        :default-active="$route.path"
        @select="handleDrawerSelect"
        router
      >
        <el-menu-item index="/">首页</el-menu-item>
        <el-menu-item index="/dashboard">仪表盘</el-menu-item>
        <el-menu-item index="/users" v-if="hasRole(['ADMIN'])">用户管理</el-menu-item>
        <el-menu-item index="/roles" v-if="hasRole(['ADMIN'])">角色管理</el-menu-item>
        <el-menu-item index="/permissions" v-if="hasRole(['ADMIN'])">权限管理</el-menu-item>
        <el-menu-item index="/data" v-if="hasRole(['ADMIN', 'RESEARCHER', 'ANALYST'])">数据管理</el-menu-item>
        <el-menu-item index="/tags" v-if="hasRole(['ADMIN', 'RESEARCHER', 'ANALYST'])">标签管理</el-menu-item>
        <el-menu-item index="/statistics" v-if="hasRole(['ADMIN', 'ANALYST'])">统计分析</el-menu-item>
        <el-menu-item index="/logs" v-if="hasRole(['ADMIN', 'AUDITOR'])">日志审计</el-menu-item>
      </el-menu>
    </el-drawer>
  </header>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router'
import { DataAnalysis, ArrowDown, Menu } from '@element-plus/icons-vue'
import { ElMessageBox, ElMessage } from 'element-plus';
import { useUserStore } from '@/stores/user';

const userStore = useUserStore();
const router = useRouter();
const drawerVisible = ref(false);

const handleDrawerSelect = () => {
  drawerVisible.value = false;
};

// --- [新增] 权限判断辅助函数 ---
/**
 * 检查当前用户是否拥有指定角色之一
 * @param {string[]} requiredRoles - 所需角色的数组, e.g., ['ADMIN', 'RESEARCHER']
 * @returns {boolean}
 */
const hasRole = (requiredRoles) => {
  if (!userStore.roles || userStore.roles.length === 0) {
    return false;
  }
  // 如果用户是 ADMIN，则拥有所有权限
  if (userStore.roles.includes('ADMIN')) {
    return true;
  }
  // 检查用户的角色列表是否至少包含一个所需角色
  return userStore.roles.some(userRole => requiredRoles.includes(userRole));
};


const goTo = (path) => {
  router.push(path);
};

const goHome = () => {
  router.push('/');
}

const handleLogout = () => {
  ElMessageBox.confirm('您确定要退出登录吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    userStore.logout().then(() => {
      ElMessage.success('已成功退出');
      router.push('/');
    });
  }).catch(() => {});
}
</script>

<style lang="scss" scoped>
/* Base Styles (unchanged) */
.app-header {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px; /* Reduced padding for smaller screens */
  position: sticky;
  top: 0;
  z-index: 100;
  width: 100%;
  box-sizing: border-box;
  background-color: rgba(18, 24, 38, 0.7);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.2), rgba(255,255,255,0));
  }
}

.header-left .logo {
  display: flex;
  align-items: center;
  font-size: 1.2rem;
  font-weight: 600;
  cursor: pointer;
  color: #f0f0f0;
  transition: color 0.3s ease;

  &:hover {
    color: #fff;
  }
  .el-icon {
    margin-right: 8px;
    color: #409EFF;
  }
}

.header-center .top-menu {
  border-bottom: none;
  .el-menu-item {
    font-size: 1rem;
    font-weight: 500;
    padding: 0 15px; /* Reduced padding */
    background-color: transparent !important;
    color: #a7b1c2;
    transition: color 0.3s ease;

    &:hover {
      color: #ffffff;
    }
    &.is-active {
      color: #ffffff !important;
    }
  }
}

.header-right {
  display: flex;
  align-items: center;
  gap: 15px;
}

.header-right .user-profile {
  cursor: pointer;
  display: flex;
  align-items: center;
  color: #e0e0e0;
  font-weight: 500;
  transition: color 0.3s ease;
  &:hover {
    color: #ffffff;
  }
  .user-avatar {
    margin-right: 10px;
    background-color: #409EFF;
    font-weight: bold;
  }
}

.logout-item {
  color: #F56C6C;
}

/* Responsive Styles */
.mobile-only {
  display: none;
}
.mobile-menu-icon {
  font-size: 24px;
  color: #f0f0f0;
  cursor: pointer;
}

/* Using a breakpoint for tablets and smaller devices */
@media (max-width: 1024px) {
  .desktop-only {
    display: none;
  }
  .mobile-only {
    display: inline-flex; /* Use inline-flex for icons */
  }
  .header-left .logo-text {
    display: none; /* Hide logo text on small screens */
  }
  .header-right .user-avatar {
    margin-right: 0;
  }
}

:deep(.mobile-drawer) {
  .el-drawer__header {
    margin-bottom: 0;
    color: #e0e6f1;
  }
  .el-drawer__body {
    padding: 20px 0;
  }
  .el-menu {
    border-right: none;
  }
}
</style>
