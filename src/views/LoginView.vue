<template>
  <div class="login-container">
    <el-card class="login-card">
      <template #header>
        <div class="card-header">
          <span>健康大数据应用创新研发中心</span>
        </div>
      </template>
      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginRules"
        label-width="0px"
      >
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            placeholder="请输入用户名"
            :prefix-icon="User"
            size="large"
            clearable
          />
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="请输入密码"
            :prefix-icon="Lock"
            size="large"
            show-password
            clearable
          />
        </el-form-item>
        <el-form-item prop="verificationCode">
          <el-input
            v-model="loginForm.verificationCode"
            placeholder="请输入验证码"
            :prefix-icon="Key"
            size="large"
            class="code-input"
          >
            <template #append>
              <el-button @click="handleGetCode" :disabled="isCodeLoading">
                {{ codeButtonText }}
              </el-button>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            :loading="loading"
            @click="handleLogin"
            style="width: 100%;"
            size="large"
          >
            登 录
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import type { FormInstance, FormRules } from 'element-plus';
import { User, Lock, Key } from '@element-plus/icons-vue';
import { useUserStore } from '@/stores/user';
import { getLoginCode } from '@/api/auth';

const loginFormRef = ref<FormInstance>();
const loading = ref(false);
const isCodeLoading = ref(false);
const codeButtonText = ref('获取验证码');
const router = useRouter();
const userStore = useUserStore();

const loginForm = reactive({
  username: 'admin',
  password: '123456',
  verificationCode: ''
});

const loginRules = reactive<FormRules>({
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  verificationCode: [{ required: true, message: '请输入验证码', trigger: 'blur' }],
});

// 获取验证码
const handleGetCode = () => {
  if (!loginForm.username) {
    ElMessage.warning('请先输入用户名');
    return;
  }
  isCodeLoading.value = true;
  codeButtonText.value = '发送中...';
  getLoginCode({ userName: loginForm.username }).then(res => {
    ElMessage.success(res.data); // 后端模拟返回了验证码，我们直接提示
    // 在真实场景中，这里会开始倒计时
    isCodeLoading.value = false;
    codeButtonText.value = '获取验证码';
  }).catch(() => {
    isCodeLoading.value = false;
    codeButtonText.value = '获取验证码';
  });
};

// 登录按钮点击事件
const handleLogin = () => {
  loginFormRef.value?.validate((valid) => {
    if (valid) {
      loading.value = true;
      userStore.login(loginForm).then(() => {
        router.push({ path: '/' });
        ElMessage.success('登录成功！');
        loading.value = false;
      }).catch(() => {
        loading.value = false;
      });
    }
  });
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(135deg, #71b7e6, #9b59b6);
}

.login-card {
  width: 420px;
  background-color: rgba(255, 255, 255, 0.85);
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.card-header {
  text-align: center;
  font-size: 1.6rem;
  font-weight: bold;
  color: #333;
}

.code-input .el-input-group__append {
  padding: 0 10px;
}
</style>
