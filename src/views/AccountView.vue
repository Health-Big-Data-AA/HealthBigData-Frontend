<template>
  <PageContainer title="个人中心">
    <div v-if="userInfo" class="account-grid">
      <div class="profile-card linear-card">
        <el-upload
          class="avatar-uploader"
          action="/api/files/upload/avatar"
          :headers="{ 'Authorization': 'Bearer ' + userStore.token }"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
        >
          <el-avatar :size="100" :src="userInfo.avatarUrl" class="user-avatar">{{ userInfo.userName.charAt(0).toUpperCase() }}</el-avatar>
          <div class="avatar-edit-mask">
            <el-icon><CameraFilled /></el-icon>
          </div>
        </el-upload>
        <h2 class="user-name">{{ userInfo.userName }}</h2>
        <p class="user-role">{{ userStore.roles.join(', ') }}</p >

        <div class="stats-grid">
          <div class="stat-item">
            <span class="stat-value">3</span>
            <span class="stat-label">数据条目</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">8</span>
            <span class="stat-label">操作日志</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">2</span>
            <span class="stat-label">持有角色</span>
          </div>
        </div>
      </div>

      <div class="action-list">
        <div class="action-item linear-card" @click="openDialog('profile')">
          <div class="item-icon-wrapper"><el-icon><User /></el-icon></div>
          <div class="item-content">
            <h3>基本资料</h3>
            <p>修改您的邮箱和手机号</p >
          </div>
          <el-icon class="item-arrow"><ArrowRight /></el-icon>
        </div>
        <div class="action-item linear-card" @click="openDialog('password')">
          <div class="item-icon-wrapper"><el-icon><Lock /></el-icon></div>
          <div class="item-content">
            <h3>安全设置</h3>
            <p>通过邮箱验证修改您的密码</p >
          </div>
          <el-icon class="item-arrow"><ArrowRight /></el-icon>
        </div>
        <div class="action-item linear-card" @click="handleLogout">
          <div class="item-icon-wrapper logout"><el-icon><SwitchButton /></el-icon></div>
          <div class="item-content">
            <h3 class="logout">退出登录</h3>
            <p>安全退出当前账户</p >
          </div>
          <el-icon class="item-arrow"><ArrowRight /></el-icon>
        </div>
      </div>
    </div>
    <div v-else class="loading-state">
      <el-skeleton :rows="10" animated />
    </div>

    <el-dialog v-model="dialog.visible" :title="dialog.title" width="500px">
      <el-form v-if="dialog.type === 'profile'" ref="profileFormRef" :model="profileForm" label-width="80px">
        <el-form-item label="邮箱" prop="email"><el-input v-model="profileForm.email" /></el-form-item>
        <el-form-item label="手机号" prop="phoneNumber"><el-input v-model="profileForm.phoneNumber" /></el-form-item>
      </el-form>
      <el-form v-if="dialog.type === 'password'" ref="passwordFormRef" :model="passwordForm" :rules="passwordRules" label-width="100px">
        <el-form-item label="验证码" prop="verificationCode">
          <el-input v-model="passwordForm.verificationCode" placeholder="请输入邮箱验证码">
            <template #append><el-button @click="handleGetCode" :disabled="isCodeLoading">{{ codeButtonText }}</el-button></template>
          </el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword"><el-input type="password" v-model="passwordForm.newPassword" show-password /></el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword"><el-input type="password" v-model="passwordForm.confirmPassword" show-password /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialog.visible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="dialog.loading">确认</el-button>
      </template>
    </el-dialog>
  </PageContainer>
</template>

// src/views/AccountView.vue
<script setup>
import { ref, onMounted, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';
import { useUserStore } from '@/stores/user';
import { getAccountInfo, updateAccountInfo, requestPasswordChangeCode, changePassword } from '@/api/account.js';
import PageContainer from '@/components/PageContainer.vue';
import { CameraFilled, User, Lock, SwitchButton, ArrowRight } from '@element-plus/icons-vue';

const router = useRouter();
const userStore = useUserStore(); // 引入 userStore

const userInfo = ref(null);
const profileFormRef = ref(null);
const passwordFormRef = ref(null);
const isCodeLoading = ref(false);
const codeButtonText = ref('获取验证码');

const dialog = reactive({ visible: false, title: '', type: '', loading: false });
const profileForm = reactive({ email: '', phoneNumber: '' });
const passwordForm = reactive({ verificationCode: '', newPassword: '', confirmPassword: '' });

const validateConfirmPassword = (rule, value, callback) => {
  if (value !== passwordForm.newPassword) callback(new Error('两次输入的密码不一致'));
  else callback();
};
const passwordRules = {
  verificationCode: [{ required: true, message: '请输入验证码', trigger: 'blur' }],
  newPassword: [{ required: true, message: '请输入新密码', trigger: 'blur' }],
  confirmPassword: [{ required: true, message: '请再次输入新密码', trigger: 'blur' }, { validator: validateConfirmPassword, trigger: 'blur' }],
};

const fetchUserInfo = async () => {
  try {
    const res = await getAccountInfo();
    userInfo.value = res.data;
    profileForm.email = res.data.email;
    profileForm.phoneNumber = res.data.phoneNumber;
  } catch (error) {
    ElMessage.error('获取用户信息失败');
  }
};

onMounted(fetchUserInfo);

const openDialog = (type) => {
  dialog.type = type;
  if (type === 'profile') {
    dialog.title = '修改基本资料';
  } else if (type === 'password') {
    dialog.title = '修改密码';
  }
  dialog.visible = true;
};

const handleGetCode = async () => {
  isCodeLoading.value = true;
  codeButtonText.value = '发送中...';
  try {
    await requestPasswordChangeCode();
    ElMessage.success('验证码已发送，请检查邮箱');
    let count = 60;
    codeButtonText.value = `${count}秒后重试`;
    const timer = setInterval(() => {
      count--;
      if (count > 0) {
        codeButtonText.value = `${count}秒后重试`;
      } else {
        clearInterval(timer);
        codeButtonText.value = '获取验证码';
        isCodeLoading.value = false;
      }
    }, 1000);
  } catch (error) {
    isCodeLoading.value = false;
    codeButtonText.value = '获取验证码';
  }
};

const handleSubmit = async () => {
  dialog.loading = true;
  try {
    if (dialog.type === 'profile') {
      await updateAccountInfo(profileForm);
      ElMessage.success('资料更新成功');
    } else if (dialog.type === 'password') {
      await changePassword(passwordForm);
      ElMessage.success('密码修改成功，请重新登录');
      await userStore.logout();
      router.push('/login');
    }
    dialog.visible = false;
    await fetchUserInfo(); // Refresh data
  } finally {
    dialog.loading = false;
  }
};

const beforeAvatarUpload = (rawFile) => {
  if (rawFile.type !== 'image/jpeg' && rawFile.type !== 'image/png') {
    ElMessage.error('头像必须是 JPG 或 PNG 格式!');
    return false;
  } else if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error('头像大小不能超过 2MB!');
    return false;
  }
  return true;
};

// --- 【重大修改】上传成功后，调用 store action 更新全局状态 ---
const handleAvatarSuccess = (response) => {
  const newAvatarUrl = response.data;
  // 调用 store 的 action 来更新全局的 avatarUrl
  userStore.setAvatar(newAvatarUrl);
  // 同时更新本地页面的 userInfo，以确保立即响应
  if (userInfo.value) {
    userInfo.value.avatarUrl = newAvatarUrl;
  }
  ElMessage.success('头像上传成功!');
};

const handleLogout = () => {
  ElMessageBox.confirm('您确定要退出登录吗？', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' })
    .then(() => userStore.logout().then(() => {
      ElMessage.success('已成功退出');
      router.push('/');
    }));
};
</script>

<style lang="scss" scoped>
.account-grid {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 40px;
}
.linear-card {
  background: #161b22;
  border: 1px solid #30363d;
  border-radius: 12px;
  color: #c9d1d9;
}
.profile-card {
  padding: 30px;
  text-align: center;
  .user-avatar {
    background-color: #409EFF;
    font-size: 2.5rem;
    margin-bottom: 20px;
  }
  .user-name {
    font-size: 1.8rem;
    font-weight: 600; margin: 0; color: #f0f0f0;
  }
  .user-role {
    font-size: 1rem; color: #8b949e; margin-top: 5px; margin-bottom: 20px;
  }
}
.avatar-uploader {
  position: relative;
  display: inline-block;
  cursor: pointer;
  border-radius: 50%;
  &:hover .avatar-edit-mask {
    opacity: 1;
  }
}
.avatar-edit-mask {
  position: absolute;
  top: 0; left: 0;
  width: 100px; height: 100px;
  border-radius: 50%;
  background-color: rgba(0,0,0,0.5);
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 24px;
  opacity: 0;
  transition: opacity 0.3s ease;
}
.stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 10px;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #30363d;
}
.stat-item {
  display: flex;
  flex-direction: column;
}
.stat-value {
  font-size: 1.5rem; font-weight: 600; color: #f0f0f0;
}
.stat-label {
  font-size: 0.9rem; color: #8b949e;
}
.action-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.action-item {
  display: flex;
  align-items: center;
  padding: 20px;
  cursor: pointer;
  transition: all 0.2s ease;
  &:hover {
    transform: translateY(-2px);
    border-color: #58a6ff;
  }
}
.item-icon-wrapper {
  width: 48px; height: 48px;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(88, 166, 255, 0.1);
  color: #58a6ff;
  font-size: 24px;
  margin-right: 20px;
  &.logout {
    background-color: rgba(245, 108, 108, 0.1);
    color: #F56C6C;
  }
}
.item-content {
  flex-grow: 1;
  h3 { margin: 0 0 5px 0; font-size: 1.1rem; color: #f0f0f0; }
  p { margin: 0; color: #8b949e; }
  .logout { color: #F56C6C; }
}
.item-arrow { color: #8b949e; }
</style>
