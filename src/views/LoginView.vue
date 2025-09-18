<template>
  <div class="login-container">
    <div class="back-home" @click="goHome">
      <el-icon><ArrowLeftBold /></el-icon>
      <span>返回主页</span>
    </div>

    <div class="aurora-background">
      <div class="aurora aurora-1"></div>
      <div class="aurora aurora-2"></div>
      <div class="aurora aurora-3"></div>
    </div>

    <el-card class="form-card">
      <transition name="slide-fade" mode="out-in">
        <div v-if="formMode === 'login'" key="login" class="form-wrapper">
          <div class="card-header">
            <h2>欢迎回来</h2>
            <p>登录您的账户</p>
          </div>
          <el-form ref="loginFormRef" :model="loginForm" :rules="loginRules" label-width="0px">
            <el-form-item prop="username">
              <el-input v-model="loginForm.username" placeholder="请输入用户名" :prefix-icon="User" size="large" />
            </el-form-item>
            <el-form-item prop="password">
              <el-input v-model="loginForm.password" type="password" placeholder="请输入密码" :prefix-icon="Lock" size="large" show-password @keyup.enter="handleLogin"/>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" :loading="loading" @click="handleLogin" class="form-button" size="large">登 录</el-button>
            </el-form-item>
            <div class="form-links">
              <span class="link-text" @click="switchMode('forgotPassword')">忘记密码?</span>
              <span class="link-text" @click="switchMode('register')">立即注册</span>
            </div>
          </el-form>
        </div>

        <div v-else-if="formMode === 'register'" key="register" class="form-wrapper">
          <div class="card-header">
            <h2>创建账户</h2>
          </div>
          <el-form ref="registerFormRef" :model="registerForm" :rules="registerRules" label-width="0px">
            <el-form-item prop="userName"><el-input v-model="registerForm.userName" placeholder="设置用户名" :prefix-icon="User" size="large" /></el-form-item>
            <el-form-item prop="email"><el-input v-model="registerForm.email" placeholder="输入QQ邮箱" :prefix-icon="Message" size="large" /></el-form-item>

            <el-form-item prop="phoneNumber">
              <el-input v-model="registerForm.phoneNumber" placeholder="输入手机号 (选填)" :prefix-icon="Phone" size="large" />
            </el-form-item>

            <el-form-item prop="password"><el-input v-model="registerForm.password" type="password" placeholder="设置密码" :prefix-icon="Lock" size="large" show-password /></el-form-item>
            <el-form-item prop="confirmPassword"><el-input v-model="registerForm.confirmPassword" type="password" placeholder="确认密码" :prefix-icon="Lock" size="large" show-password /></el-form-item>
            <el-form-item prop="verificationCode">
              <el-input v-model="registerForm.verificationCode" placeholder="邮箱验证码" :prefix-icon="Key" size="large">
                <template #append><el-button @click="handleGetCode('register')" :disabled="isCodeLoading">{{ codeButtonText }}</el-button></template>
              </el-input>
            </el-form-item>
            <el-form-item><el-button type="primary" :loading="loading" @click="handleRegister" class="form-button" size="large">注 册</el-button></el-form-item>
            <div class="form-links"><span class="link-text" @click="switchMode('login')">返回登录</span></div>
          </el-form>
        </div>

        <div v-else-if="formMode === 'forgotPassword'" key="forgotPassword" class="form-wrapper">
          <div class="card-header">
            <h2>找回密码</h2>
          </div>
          <el-form ref="resetFormRef" :model="resetForm" :rules="resetRules" label-width="0px">
            <el-form-item prop="email"><el-input v-model="resetForm.email" placeholder="输入您注册的QQ邮箱" :prefix-icon="Message" size="large" /></el-form-item>
            <el-form-item prop="verificationCode">
              <el-input v-model="resetForm.verificationCode" placeholder="邮箱验证码" :prefix-icon="Key" size="large">
                <template #append><el-button @click="handleGetCode('reset')" :disabled="isCodeLoading">{{ codeButtonText }}</el-button></template>
              </el-input>
            </el-form-item>
            <el-form-item prop="newPassword"><el-input v-model="resetForm.newPassword" type="password" placeholder="设置您的新密码" :prefix-icon="Lock" size="large" show-password /></el-form-item>
            <el-form-item><el-button type="primary" :loading="loading" @click="handleResetPassword" class="form-button" size="large">确认重置</el-button></el-form-item>
            <div class="form-links"><span class="link-text" @click="switchMode('login')">返回登录</span></div>
          </el-form>
        </div>
      </transition>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { User, Lock, Key, Message, Phone, ArrowLeftBold } from '@element-plus/icons-vue';
import { useUserStore } from '@/stores/user';
import { login, getRegisterCode, register, getPasswordResetCode, resetPassword } from '@/api/auth';

const router = useRouter();
const userStore = useUserStore();

const formMode = ref('login'); // login, register, forgotPassword
const loading = ref(false);
const isCodeLoading = ref(false);
const codeButtonText = ref('获取验证码');

const loginFormRef = ref(null);
const registerFormRef = ref(null);
const resetFormRef = ref(null);

const loginForm = reactive({ username: '', password: '' });
const loginRules = reactive({
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
});

const registerForm = reactive({ userName: '', email: '', password: '', confirmPassword: '', verificationCode: '', phoneNumber: '' });
const validatePass = (rule, value, callback) => {
  if (value !== registerForm.password) callback(new Error("两次输入的密码不一致!"));
  else callback();
};
const registerRules = reactive({
  userName: [{ required: true, message: '用户名不能为空', trigger: 'blur' }],
  email: [
    { required: true, message: '邮箱不能为空', trigger: 'blur' },
    { pattern: /^[1-9][0-9]{4,9}@qq\.com$/, message: '请输入有效的QQ邮箱地址', trigger: 'blur' }
  ],
  // 【新增】手机号校验规则
  phoneNumber: [
    { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号码', trigger: 'blur' }
  ],
  password: [{ required: true, message: '密码不能为空', trigger: 'blur' }],
  confirmPassword: [{ required: true, validator: validatePass, trigger: 'blur' }],
  verificationCode: [{ required: true, message: '验证码不能为空', trigger: 'blur' }]
});

const resetForm = reactive({ email: '', verificationCode: '', newPassword: '' });
const resetRules = reactive({
  email: [
    { required: true, message: '邮箱不能为空', trigger: 'blur' },
    { type: 'email', message: '请输入有效的邮箱地址', trigger: 'blur' }
  ],
  verificationCode: [{ required: true, message: '验证码不能为空', trigger: 'blur' }],
  newPassword: [{ required: true, message: '新密码不能为空', trigger: 'blur' }],
});

const switchMode = (mode) => formMode.value = mode;
const goHome = () => router.push('/');

const handleGetCode = async (type) => {
  const email = type === 'register' ? registerForm.email : resetForm.email;
  if (!email) {
    ElMessage.warning('请先输入邮箱地址');
    return;
  }
  isCodeLoading.value = true;
  codeButtonText.value = '发送中...';
  try {
    const action = type === 'register' ? getRegisterCode : getPasswordResetCode;
    await action({ email });
    ElMessage.success('验证码发送成功！');
  } catch (error) {
    // Error message is handled by the request interceptor
  } finally {
    isCodeLoading.value = false;
    codeButtonText.value = '获取验证码';
  }
};

const handleLogin = () => {
  loginFormRef.value.validate((valid) => {
    if (valid) {
      loading.value = true;
      userStore.login(loginForm).catch(() => {}).finally(() => loading.value = false);
    }
  });
};

const handleRegister = () => {
  registerFormRef.value.validate((valid) => {
    if (valid) {
      loading.value = true;
      register(registerForm).then(() => {
        ElMessage.success('注册成功！请登录。');
        switchMode('login');
        registerFormRef.value.resetFields();
      }).finally(() => loading.value = false);
    }
  });
};

const handleResetPassword = () => {
  resetFormRef.value.validate((valid) => {
    if (valid) {
      loading.value = true;
      resetPassword(resetForm).then(() => {
        ElMessage.success('密码重置成功！请使用新密码登录。');
        switchMode('login');
        resetFormRef.value.resetFields();
      }).finally(() => loading.value = false);
    }
  });
};
</script>

<style scoped>
/* 样式部分没有变化，保持原样 */
.login-container{display:flex;justify-content:center;align-items:center;height:100vh;overflow:hidden;position:relative;background-color:#0d1117}
.back-home{position:absolute;top:30px;left:30px;z-index:10;display:flex;align-items:center;color:#8b949e;cursor:pointer;transition:color .3s ease}
.back-home:hover{color:#c9d1d9}
.back-home .el-icon{margin-right:8px}
.aurora-background{position:absolute;top:0;left:0;right:0;bottom:0;z-index:1}
.aurora{position:absolute;border-radius:50%;filter:blur(100px);opacity:.4}
.aurora-1{width:500px;height:500px;background:#0077ff;top:-20%;left:-10%;animation:move-aurora 20s infinite alternate}
.aurora-2{width:400px;height:400px;background:#ff3c78;bottom:-25%;right:-15%;animation:move-aurora 25s infinite alternate-reverse}
.aurora-3{width:300px;height:300px;background:#39ff14;bottom:20%;right:30%;animation:move-aurora 15s infinite alternate}
@keyframes move-aurora{from{transform:translate(0,0) rotate(0)}to{transform:translate(100px,50px) rotate(180deg)}}
.form-card{width:420px;min-height:520px;background:rgba(20,25,38,.5);box-shadow:0 8px 32px 0 rgba(0,0,0,.37);backdrop-filter:blur(15px);-webkit-backdrop-filter:blur(15px);border-radius:10px;border:1px solid rgba(255,255,255,.1);z-index:2;padding:20px;overflow:hidden}
.form-wrapper{width:100%}
.card-header{text-align:center;margin-bottom:25px;color:#e6edf3}
.card-header h2{font-size:2rem;font-weight:600;margin:0}
.card-header p{font-size:1rem;color:#8b949e;margin-top:5px}
:deep(.el-input__wrapper){background-color:rgba(30,36,50,.8)!important;box-shadow:none!important;border:1px solid #30363d}
:deep(.el-input__inner){color:#e6edf3!important}
:deep(.el-input__inner::placeholder){color:#8b949e}
:deep(.el-input-group__append){background-color:transparent!important;border:1px solid #30363d;box-shadow:none!important}
.form-button{width:100%;border:none;background:linear-gradient(90deg,#0077ff,#00c6ff);transition:transform .2s ease,box-shadow .2s ease}
.form-button:hover{transform:translateY(-2px);box-shadow:0 4px 15px rgba(0,150,255,.3)}
.form-links{margin-top:15px;display:flex;justify-content:space-between;font-size:14px;color:#8b949e}
.link-text{color:#58a6ff;cursor:pointer;font-weight:500}
.slide-fade-enter-active,.slide-fade-leave-active{transition:all .5s cubic-bezier(.25,.8,.25,1)}
.slide-fade-enter-from{opacity:0;transform:translateX(30px)}
.slide-fade-leave-to{opacity:0;transform:translateX(-30px)}
</style>
