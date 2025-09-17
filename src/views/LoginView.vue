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
          autocomplete="on"
          name="loginForm"
      >
        <el-form-item prop="empName">
          <el-input
              v-model="loginForm.empName"
              placeholder="请输入用户名 (admin)"
              :prefix-icon="User"
              size="large"
              clearable
              name="emp-name"
              autocomplete="name"
          />
        </el-form-item>
        <el-form-item prop="empId">
          <el-input
              v-model.number="loginForm.empId"
              placeholder="请输入员工ID (例如: 1)"
              :prefix-icon="Key"
              size="large"
              clearable
              name="emp-id"
              autocomplete="username"
          />
        </el-form-item>

        <el-form-item class="form-actions">
          <el-checkbox v-model="rememberMe" size="small">记住我</el-checkbox>
          <el-link type="primary" :underline="false" class="forgot-link">忘记密码？</el-link>
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
import { User, Key } from '@element-plus/icons-vue';
// 1. 不再直接导入通用的 request 实例
// import api from '@/api/request'; // 导入我们创建的axios实例
import { login } from '@/api/Auth';

// 表单引用
const loginFormRef = ref<FormInstance>();
const loading = ref(false);
const router = useRouter();
// 记住密码
const rememberMe = ref(false);

// 登录表单数据 (与后端Employees实体对应)
const loginForm = reactive({
  empId: null,
  empName: null,
  dummyPassword: 'password'
});

// 表单验证规则
const loginRules = reactive<FormRules>({
  empId: [{ required: true, message: '请输入员工ID', trigger: 'blur' }],
  empName: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
});

// 登录按钮点击事件
// @ts-ignore
const handleLogin = async () => {
  if (!loginFormRef.value) return;

  const valid = await loginFormRef.value.validate();

    if (!valid) {
      ElMessage.error('请填写完整的登录信息');
      return;
    }

    loading.value = true;
    try {
      // 发起真实的API请求
      // 2. 将原来的 api.post 调用替换为我们封装的 login 函数
      // const response = await api.post('/api/employees/login', {
      //   empName: loginForm.empName,
      //   empId: loginForm.empId,
      // });
      const response = await login({
        empName: loginForm.empName,
        empId: loginForm.empId,
      });

      // 后端返回 boolean 值
      // @ts-ignore
      if (response === true) {
        ElMessage.success('登录成功！');
        // 登录成功，存储一个标记
        localStorage.setItem('user-token', `user-${loginForm.empId}`);
        router.push({ name: 'users' });
      } else {
        ElMessage.error('员工ID或用户名不匹配！');
      }
    } catch (error) {
      console.error("登录请求失败:", error);
      // ElMessage 已经在拦截器中处理了
    } finally {
      loading.value = false;
    }
};

// 页面加载时，如果有记住的用户名则自动填充
const initForm = () => {
  const savedUsername = localStorage.getItem('username');
  if (savedUsername) {
    loginForm.username = savedUsername;
    rememberMe.value = true;
  }
};
// 初始化表单
initForm();
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

.form-actions {
  display: flex; /* 开启 Flexbox */
  justify-content: space-between; /* 子元素之间平均分配空间，第一个在最左，最后一个在最右 */
  align-items: center; /* 垂直居中对齐，确保 el-checkbox 和 el-link 在同一水平线上 */
  margin-bottom: 20px; /* 根据需要调整间距 */
}

.form-actions .el-checkbox {
  margin-right: auto;
}

</style>