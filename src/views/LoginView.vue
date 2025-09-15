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
            placeholder="请输入用户名 (admin)"
            :prefix-icon="User"
            size="large"
            clearable
          />
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="请输入密码 (password)"
            :prefix-icon="Lock"
            size="large"
            show-password
            clearable
          />
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
import { User, Lock } from '@element-plus/icons-vue';

// 表单引用
const loginFormRef = ref<FormInstance>();
const loading = ref(false);
const router = useRouter();

// 登录表单数据
const loginForm = reactive({
  username: 'admin',
  password: 'password',
});

// 表单验证规则
const loginRules = reactive<FormRules>({
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
});

// 登录按钮点击事件
const handleLogin = () => {
  loginFormRef.value?.validate((valid) => {
    if (!valid) {
      ElMessage.error('请填写完整的登录信息');
      return;
    }

    loading.value = true;
    setTimeout(() => {
      if (loginForm.username === 'admin' && loginForm.password === 'password') {
        ElMessage.success('登录成功！');
        localStorage.setItem('user-token', 'mock-token-string');
        router.push('/');
      } else {
        ElMessage.error('用户名或密码错误！');
      }
      loading.value = false;
    }, 1000);
  });
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  /* 替换为更美观的渐变背景 */
  background: linear-gradient(135deg, #71b7e6, #9b59b6);
}

.login-card {
  width: 420px;
  /* 添加毛玻璃效果和阴影 */
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
</style>
