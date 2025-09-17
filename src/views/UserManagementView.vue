<!--<template>-->
<!--  <div>-->
<!--    <h1>用户管理页面</h1>-->
<!--    <p>这里将放置用户管理的表格和相关操作。</p>-->
<!--  </div>-->
<!--</template>-->

<!--<script setup lang="ts">-->
<!--// 未来在这里添加逻辑-->
<!--</script>-->
<!--<template>-->
<!--  <div class="app-container">-->
<!--    <el-card>-->
<!--      <el-form :inline="true" :model="queryParams" @submit.prevent="handleQuery">-->
<!--        <el-form-item label="用户名">-->
<!--          <el-input v-model="queryParams.userName" placeholder="请输入用户名" clearable />-->
<!--        </el-form-item>-->
<!--        <el-form-item label="状态">-->
<!--          <el-select v-model="queryParams.status" placeholder="用户状态" clearable>-->
<!--            <el-option label="正常" :value="1" />-->
<!--            <el-option label="禁用" :value="2" />-->
<!--          </el-select>-->
<!--        </el-form-item>-->
<!--        <el-form-item>-->
<!--          <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>-->
<!--          <el-button icon="Refresh" @click="resetQuery">重置</el-button>-->
<!--        </el-form-item>-->
<!--        <el-form-item style="float: right;">-->
<!--          <el-button type="success" icon="Plus" @click="handleAdd">新增用户</el-button>-->
<!--        </el-form-item>-->
<!--      </el-form>-->

<!--      <el-table v-loading="loading" :data="userList">-->
<!--        <el-table-column label="用户名" align="center" prop="userName" />-->
<!--        <el-table-column label="邮箱" align="center" prop="email" />-->
<!--        <el-table-column label="手机号" align="center" prop="phoneNumber" />-->
<!--        <el-table-column label="状态" align="center">-->
<!--          <template #default="scope">-->
<!--            <el-switch-->
<!--              v-model="scope.row.status"-->
<!--              :active-value="1"-->
<!--              :inactive-value="2"-->
<!--              @change="handleStatusChange(scope.row)"-->
<!--            />-->
<!--          </template>-->
<!--        </el-table-column>-->
<!--        <el-table-column label="创建时间" align="center" prop="createTime" width="180"/>-->
<!--        <el-table-column label="操作" align="center" width="220">-->
<!--          <template #default="scope">-->
<!--            <el-button type="primary" link icon="Edit" @click="handleUpdate(scope.row)">编辑</el-button>-->
<!--            <el-button type="danger" link icon="Delete" @click="handleDelete(scope.row)">删除</el-button>-->
<!--            <el-button type="warning" link icon="Key" @click="handleAssignRole(scope.row)">分配角色</el-button>-->
<!--          </template>-->
<!--        </el-table-column>-->
<!--      </el-table>-->

<!--      <el-pagination-->
<!--        v-show="total > 0"-->
<!--        v-model:current-page="queryParams.pageNum"-->
<!--        v-model:page-size="queryParams.pageSize"-->
<!--        :page-sizes="[10, 20, 50, 100]"-->
<!--        :total="total"-->
<!--        layout="total, sizes, prev, pager, next, jumper"-->
<!--        @size-change="getList"-->
<!--        @current-change="getList"-->
<!--      />-->
<!--    </el-card>-->

<!--    <el-dialog :title="dialogTitle" v-model="dialogVisible" width="500px" append-to-body>-->
<!--    </el-dialog>-->

<!--    <el-dialog title="分配角色" v-model="roleDialogVisible" width="600px" append-to-body>-->
<!--    </el-dialog>-->
<!--  </div>-->
<!--</template>-->

<!--<script setup>-->
<!--import { ref, reactive, onMounted } from 'vue';-->
<!--// 假设你有一个封装好的 aioxs 实例-->
<!--// import { listUsers, delUser, updateUser, addUser, getUserRoles, assignUserRoles } from '@/api/user';-->

<!--// -&#45;&#45; 响应式数据 -&#45;&#45;-->
<!--const loading = ref(true);-->
<!--const userList = ref([]);-->
<!--const total = ref(0);-->
<!--const dialogVisible = ref(false);-->
<!--const roleDialogVisible = ref(false);-->
<!--const dialogTitle = ref('');-->

<!--const queryParams = reactive({-->
<!--  pageNum: 1,-->
<!--  pageSize: 10,-->
<!--  userName: '',-->
<!--  status: '',-->
<!--});-->

<!--// -&#45;&#45; 方法 -&#45;&#45;-->
<!--onMounted(() => {-->
<!--  getList();-->
<!--});-->

<!--function getList() {-->
<!--  loading.value = true;-->
<!--  // **API 调用**: listUsers(queryParams).then(response => { ... });-->
<!--  // 模拟数据-->
<!--  setTimeout(() => {-->
<!--    userList.value = [-->
<!--      { userId: 1, userName: 'admin', email: 'admin@example.com', phoneNumber: '13800138000', status: 1, createTime: '2025-09-16 10:00:00' },-->
<!--      { userId: 2, userName: 'researcher', email: 'researcher@example.com', phoneNumber: '13800138001', status: 1, createTime: '2025-09-15 11:30:00' },-->
<!--      { userId: 5, userName: 'disabled_user', email: 'disabled@example.com', phoneNumber: '13800138005', status: 2, createTime: '2025-09-14 09:00:00' }-->
<!--    ];-->
<!--    total.value = 3;-->
<!--    loading.value = false;-->
<!--  }, 500);-->
<!--}-->

<!--function handleQuery() {-->
<!--  queryParams.pageNum = 1;-->
<!--  getList();-->
<!--}-->

<!--function resetQuery() {-->
<!--  queryParams.userName = '';-->
<!--  queryParams.status = '';-->
<!--  handleQuery();-->
<!--}-->

<!--function handleStatusChange(row) {-->
<!--  // **API 调用**: updateUser(row)-->
<!--  console.log('状态改变', row);-->
<!--  // ElMessage.success('状态修改成功');-->
<!--}-->

<!--function handleAdd() {-->
<!--  dialogTitle.value = '新增用户';-->
<!--  dialogVisible.value = true;-->
<!--  // 重置表单-->
<!--}-->

<!--function handleUpdate(row) {-->
<!--  dialogTitle.value = '编辑用户';-->
<!--  dialogVisible.value = true;-->
<!--  // **API 调用**: getUser(row.userId) 获取最新数据并填充表单-->
<!--}-->

<!--function handleDelete(row) {-->
<!--  // ElMessageBox.confirm(...)-->
<!--  // **API 调用**: delUser(row.userId)-->
<!--}-->

<!--function handleAssignRole(row) {-->
<!--  roleDialogVisible.value = true;-->
<!--  // **API 调用**: getUserRoles(row.userId) 和 getAllRoles() 来填充穿梭框-->
<!--}-->
<!--</script>-->

<!--<style scoped>-->
<!--.app-container {-->
<!--  padding: 20px;-->
<!--}-->
<!--</style>-->


<!--*****************************************************************************-->
<!--*****************************************************************************-->
<!--*****************************************************************************-->
<!--修改后的-->
<template>
  <div class="app-container">
    <el-card>
      <el-form :inline="true" :model="queryParams" @submit.prevent="handleQuery">
        <el-form-item label="用户名">
          <el-input v-model="queryParams.userName" placeholder="请输入用户名" clearable />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="queryParams.status" placeholder="用户状态" clearable>
            <el-option label="正常" :value="1" />
            <el-option label="禁用" :value="2" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
          <el-button icon="Refresh" @click="resetQuery">重置</el-button>
        </el-form-item>
        <el-form-item style="float: right;">
          <el-button type="success" icon="Plus" @click="handleAdd" >
            新增用户
          </el-button>
        </el-form-item>
      </el-form>

      <el-table v-loading="loading" :data="userList">
        <el-table-column label="角色" align="center" prop="roleName">
          <template #default="scope">
            <el-tag :type="getRoleTagType(scope.row.roleName)">{{ scope.row.roleName || '未分配' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="用户名" align="center" prop="userName" />
        <el-table-column label="邮箱" align="center" prop="email" :show-overflow-tooltip="true" />
        <el-table-column label="手机号" align="center" prop="phoneNumber" />
        <el-table-column label="状态" align="center">
          <template #default="scope">
            <el-switch
              v-model="scope.row.status"
              :active-value="1"
              :inactive-value="2"
              @change="handleStatusChange(scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column label="创建时间" align="center" prop="createTime" width="160"/>
        <el-table-column label="修改时间" align="center" prop="updateTime" width="160"/>
        <el-table-column label="操作" align="center" width="150">
          <template #default="scope">
            <el-button type="primary" link icon="Edit" @click="handleUpdate(scope.row)">
              编辑
            </el-button>
            <el-button type="danger" link icon="Delete" @click="handleDelete(scope.row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        v-show="total > 0"
        v-model:current-page="queryParams.pageNum"
        v-model:page-size="queryParams.pageSize"
        :page-sizes="[10, 20, 50, 100]"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="getList"
        @current-change="getList"
      />
    </el-card>

    <el-dialog :title="dialog.title" v-model="dialog.visible" width="600px" append-to-body>
      <el-form ref="userFormRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="用户名" prop="userName">
          <el-input v-model="form.userName" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="form.password" placeholder="新增时必填，编辑时不填则不修改" type="password" show-password/>
        </el-form-item>
        <el-form-item label="角色" prop="roleId">
          <el-select v-model="form.roleId" placeholder="请选择角色">
            <el-option label="系统管理员" :value="1" />
            <el-option label="研究员" :value="2" />
            <el-option label="分析师" :value="3" />
            <el-option label="审核员" :value="4" />
          </el-select>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item label="手机号" prop="phoneNumber">
          <el-input v-model="form.phoneNumber" placeholder="请输入手机号码" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio :label="1">正常</el-radio>
            <el-radio :label="2">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
// import { ElMessage, ElMessageBox } from 'element-plus';
// import { listUsers, delUser, updateUser, addUser, getUser } from '@/api/user';

// --- 响应式数据 ---
const loading = ref(true);
const userList = ref([]);
const total = ref(0);
const userFormRef = ref(null); // 表单引用

const queryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  userName: '',
  status: '',
});

// 对话框状态
const dialog = reactive({
  visible: false,
  title: ''
});

// 表单数据
const form = ref({
  userId: null,
  userName: '',
  password: '',
  roleId: null,
  email: '',
  phoneNumber: '',
  status: 1
});

// 表单校验规则
const rules = reactive({
  userName: [{ required: true, message: "用户名不能为空", trigger: "blur" }],
  roleId: [{ required: true, message: "必须分配一个角色", trigger: "change" }],
  email: [{ type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }],
  // 更多规则...
});


// --- 生命周期钩子 ---
onMounted(() => {
  getList();
});

// --- 方法 ---
function getList() {
  loading.value = true;
  // **API 调用**: listUsers(queryParams).then(response => { ... });
  // 模拟数据（已按您的要求更新）
  setTimeout(() => {
    userList.value = [
      { userId: 1, userName: 'admin', roleName: '系统管理员', email: 'admin@example.com', phoneNumber: '13800138000', status: 1, createTime: '2025-09-16 10:00:00', updateTime: '2025-09-16 11:05:00' },
      { userId: 2, userName: 'researcher', roleName: '研究员', email: 'researcher@example.com', phoneNumber: '13800138001', status: 1, createTime: '2025-09-15 11:30:00', updateTime: '2025-09-16 09:12:00' },
      { userId: 3, userName: 'analyst', roleName: '分析师', email: 'analyst@example.com', phoneNumber: '13800138002', status: 1, createTime: '2025-09-15 14:20:00', updateTime: '2025-09-15 14:20:00' },
      { userId: 5, userName: 'disabled_user', roleName: '研究员', email: 'disabled@example.com', phoneNumber: '13800138005', status: 2, createTime: '2025-09-14 09:00:00', updateTime: '2025-09-15 18:45:00' }
    ];
    total.value = 4;
    loading.value = false;
  }, 500);
}

// 根据角色名返回不同的 el-tag 类型
function getRoleTagType(roleName) {
  if (roleName === '系统管理员') return 'primary';
  if (roleName === '研究员') return 'success';
  if (roleName === '分析师') return 'danger';
  if (roleName === '审核员') return 'warning';
  return 'info';
}

function handleQuery() {
  queryParams.pageNum = 1;
  getList();
}

// 重置表单
function resetForm() {
  form.value = {
    userId: null,
    userName: '',
    password: '',
    roleId: null,
    email: '',
    phoneNumber: '',
    status: 1
  };
  userFormRef.value?.resetFields();
}

function resetQuery() {
  queryParams.userName = '';
  queryParams.status = '';
  handleQuery();
}

function handleStatusChange(row) {
  // **API 调用**: updateUser({ userId: row.userId, status: row.status })
  console.log('状态改变', row);
  // ElMessage.success('状态修改成功');
}

// 新增按钮操作
function handleAdd() {
  resetForm();
  dialog.title = '新增用户';
  dialog.visible = true;
}

// 编辑按钮操作
function handleUpdate(row) {
  resetForm();
  // **API 调用**: getUser(row.userId).then(response => { form.value = response.data; });
  // 模拟数据回显
  form.value = {
    userId: row.userId,
    userName: row.userName,
    password: '', // 密码不回显
    // 假设后端能返回roleId
    roleId: userList.value.findIndex(u => u.roleName === row.roleName) + 1,
    email: row.email,
    phoneNumber: row.phoneNumber,
    status: row.status,
  };
  dialog.title = '编辑用户';
  dialog.visible = true;
}

function handleDelete(row) {
  // ElMessageBox.confirm(...)
  // **API 调用**: delUser(row.userId)
}

// 对话框取消
function cancel(){
  dialog.visible = false;
  resetForm();
}

// 表单提交
function submitForm() {
  userFormRef.value.validate(valid => {
    if (valid) {
      if (form.value.userId) {
        // 编辑逻辑
        // **API 调用**: updateUser(form.value)
        console.log('提交编辑', form.value);
        // ElMessage.success('修改成功');
      } else {
        // 新增逻辑
        // **API 调用**: addUser(form.value)
        console.log('提交新增', form.value);
        // ElMessage.success('新增成功');
      }
      dialog.visible = false;
      getList();
    }
  });
}

</script>

<style scoped>
.app-container {
  padding: 20px;
}
</style>



<!--文件增添权限控制*****************************************-->
<!--文件增添权限控制*****************************************-->
<!--文件增添权限控制*****************************************-->
<!--<template>-->
<!--  <div class="app-container">-->
<!--    <el-card>-->
<!--      <el-form :inline="true" :model="queryParams" @submit.prevent="handleQuery">-->
<!--        <el-form-item style="float: right;">-->
<!--          <el-button-->
<!--            type="success"-->
<!--            icon="Plus"-->
<!--            @click="handleAdd"-->
<!--            v-permission="'user:manage'"-->
<!--          >-->
<!--            新增用户-->
<!--          </el-button>-->
<!--        </el-form-item>-->
<!--      </el-form>-->

<!--      <el-table v-loading="loading" :data="userList">-->
<!--        <el-table-column label="操作" align="center" width="150">-->
<!--          <template #default="scope">-->
<!--            <el-button-->
<!--              type="primary"-->
<!--              link-->
<!--              icon="Edit"-->
<!--              @click="handleUpdate(scope.row)"-->
<!--              v-permission="'user:manage'"-->
<!--            >-->
<!--              编辑-->
<!--            </el-button>-->
<!--            <el-button-->
<!--              type="danger"-->
<!--              link-->
<!--              icon="Delete"-->
<!--              @click="handleDelete(scope.row)"-->
<!--              v-permission="'user:manage'"-->
<!--            >-->
<!--              删除-->
<!--            </el-button>-->
<!--          </template>-->
<!--        </el-table-column>-->
<!--      </el-table>-->

<!--    </el-card>-->

<!--  </div>-->
<!--</template>-->

<!--<script setup>-->
<!--import { ref, reactive, onMounted } from 'vue';-->
<!--// import { ElMessage, ElMessageBox } from 'element-plus';-->
<!--// import { listUsers, delUser, updateUser, addUser, getUser } from '@/api/user';-->

<!--// -&#45;&#45; 响应式数据 -&#45;&#45;-->
<!--const loading = ref(true);-->
<!--const userList = ref([]);-->
<!--const total = ref(0);-->
<!--const userFormRef = ref(null); // 表单引用-->

<!--const queryParams = reactive({-->
<!--  pageNum: 1,-->
<!--  pageSize: 10,-->
<!--  userName: '',-->
<!--  status: '',-->
<!--});-->

<!--// 对话框状态-->
<!--const dialog = reactive({-->
<!--  visible: false,-->
<!--  title: ''-->
<!--});-->

<!--// 表单数据-->
<!--const form = ref({-->
<!--  userId: null,-->
<!--  userName: '',-->
<!--  password: '',-->
<!--  roleId: null,-->
<!--  email: '',-->
<!--  phoneNumber: '',-->
<!--  status: 1-->
<!--});-->

<!--// 表单校验规则-->
<!--const rules = reactive({-->
<!--  userName: [{ required: true, message: "用户名不能为空", trigger: "blur" }],-->
<!--  roleId: [{ required: true, message: "必须分配一个角色", trigger: "change" }],-->
<!--  email: [{ type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }],-->
<!--  // 更多规则...-->
<!--});-->


<!--// -&#45;&#45; 生命周期钩子 -&#45;&#45;-->
<!--onMounted(() => {-->
<!--  getList();-->
<!--});-->

<!--// -&#45;&#45; 方法 -&#45;&#45;-->
<!--function getList() {-->
<!--  loading.value = true;-->
<!--  // **API 调用**: listUsers(queryParams).then(response => { ... });-->
<!--  // 模拟数据（已按您的要求更新）-->
<!--  setTimeout(() => {-->
<!--    userList.value = [-->
<!--      { userId: 1, userName: 'admin', roleName: '系统管理员', email: 'admin@example.com', phoneNumber: '13800138000', status: 1, createTime: '2025-09-16 10:00:00', updateTime: '2025-09-16 11:05:00' },-->
<!--      { userId: 2, userName: 'researcher', roleName: '研究员', email: 'researcher@example.com', phoneNumber: '13800138001', status: 1, createTime: '2025-09-15 11:30:00', updateTime: '2025-09-16 09:12:00' },-->
<!--      { userId: 3, userName: 'analyst', roleName: '分析师', email: 'analyst@example.com', phoneNumber: '13800138002', status: 1, createTime: '2025-09-15 14:20:00', updateTime: '2025-09-15 14:20:00' },-->
<!--      { userId: 5, userName: 'disabled_user', roleName: '研究员', email: 'disabled@example.com', phoneNumber: '13800138005', status: 2, createTime: '2025-09-14 09:00:00', updateTime: '2025-09-15 18:45:00' }-->
<!--    ];-->
<!--    total.value = 4;-->
<!--    loading.value = false;-->
<!--  }, 500);-->
<!--}-->

<!--// 根据角色名返回不同的 el-tag 类型-->
<!--function getRoleTagType(roleName) {-->
<!--  if (roleName === '系统管理员') return 'primary';-->
<!--  if (roleName === '研究员') return 'success';-->
<!--  if (roleName === '分析师') return 'danger';-->
<!--  if (roleName === '审核员') return 'warning';-->
<!--  return 'info';-->
<!--}-->

<!--function handleQuery() {-->
<!--  queryParams.pageNum = 1;-->
<!--  getList();-->
<!--}-->

<!--// 重置表单-->
<!--function resetForm() {-->
<!--  form.value = {-->
<!--    userId: null,-->
<!--    userName: '',-->
<!--    password: '',-->
<!--    roleId: null,-->
<!--    email: '',-->
<!--    phoneNumber: '',-->
<!--    status: 1-->
<!--  };-->
<!--  userFormRef.value?.resetFields();-->
<!--}-->

<!--function resetQuery() {-->
<!--  queryParams.userName = '';-->
<!--  queryParams.status = '';-->
<!--  handleQuery();-->
<!--}-->

<!--function handleStatusChange(row) {-->
<!--  // **API 调用**: updateUser({ userId: row.userId, status: row.status })-->
<!--  console.log('状态改变', row);-->
<!--  // ElMessage.success('状态修改成功');-->
<!--}-->

<!--// 新增按钮操作-->
<!--function handleAdd() {-->
<!--  resetForm();-->
<!--  dialog.title = '新增用户';-->
<!--  dialog.visible = true;-->
<!--}-->

<!--// 编辑按钮操作-->
<!--function handleUpdate(row) {-->
<!--  resetForm();-->
<!--  // **API 调用**: getUser(row.userId).then(response => { form.value = response.data; });-->
<!--  // 模拟数据回显-->
<!--  form.value = {-->
<!--    userId: row.userId,-->
<!--    userName: row.userName,-->
<!--    password: '', // 密码不回显-->
<!--    // 假设后端能返回roleId-->
<!--    roleId: userList.value.findIndex(u => u.roleName === row.roleName) + 1,-->
<!--    email: row.email,-->
<!--    phoneNumber: row.phoneNumber,-->
<!--    status: row.status,-->
<!--  };-->
<!--  dialog.title = '编辑用户';-->
<!--  dialog.visible = true;-->
<!--}-->

<!--function handleDelete(row) {-->
<!--  // ElMessageBox.confirm(...)-->
<!--  // **API 调用**: delUser(row.userId)-->
<!--}-->

<!--// 对话框取消-->
<!--function cancel(){-->
<!--  dialog.visible = false;-->
<!--  resetForm();-->
<!--}-->

<!--// 表单提交-->
<!--function submitForm() {-->
<!--  userFormRef.value.validate(valid => {-->
<!--    if (valid) {-->
<!--      if (form.value.userId) {-->
<!--        // 编辑逻辑-->
<!--        // **API 调用**: updateUser(form.value)-->
<!--        console.log('提交编辑', form.value);-->
<!--        // ElMessage.success('修改成功');-->
<!--      } else {-->
<!--        // 新增逻辑-->
<!--        // **API 调用**: addUser(form.value)-->
<!--        console.log('提交新增', form.value);-->
<!--        // ElMessage.success('新增成功');-->
<!--      }-->
<!--      dialog.visible = false;-->
<!--      getList();-->
<!--    }-->
<!--  });-->
<!--}-->

<!--</script>-->

<!--<style scoped>-->
<!--.app-container {-->
<!--  padding: 20px;-->
<!--}-->
<!--</style>-->
