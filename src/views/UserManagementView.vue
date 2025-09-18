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
            <el-option label="禁用" :value="0" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
          <el-button icon="Refresh" @click="resetQuery">重置</el-button>
        </el-form-item>
        <el-form-item style="float: right;">
          <el-button type="success" icon="Plus" @click="handleAdd">
            新增用户
          </el-button>
        </el-form-item>
      </el-form>

      <el-table v-loading="loading" :data="userList">
        <el-table-column label="用户ID" align="center" prop="userId" />
        <el-table-column label="用户名" align="center" prop="userName" />
        <el-table-column label="邮箱" align="center" prop="email" :show-overflow-tooltip="true" />
        <el-table-column label="手机号" align="center" prop="phoneNumber" />
        <el-table-column label="状态" align="center">
          <template #default="scope">
            <el-switch
              v-model="scope.row.status"
              :active-value="1"
              :inactive-value="0"
              @change="handleStatusChange(scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column label="创建时间" align="center" prop="createTime" width="160"/>
        <el-table-column label="操作" align="center" width="220">
          <template #default="scope">
            <el-button type="success" link icon="User" @click="handleAssignRole(scope.row)">
              分配角色
            </el-button>
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
        v-model:current-page="queryParams.pageNo"
        v-model:page-size="queryParams.pageSize"
        :page-sizes="[10, 20, 50, 100]"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="getList"
        @current-change="getList"
      />
    </el-card>

    <el-dialog :title="dialog.title" v-model="dialog.visible" width="600px" append-to-body @close="cancel">
      <el-form ref="userFormRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="用户名" prop="userName">
          <el-input v-model="form.userName" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="密码" prop="passwordHash" v-if="!form.userId">
          <el-input v-model="form.passwordHash" placeholder="请输入密码" type="password" show-password/>
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
            <el-radio :label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </template>
    </el-dialog>

    <el-dialog title="分配角色" v-model="roleDialog.visible" width="500px">
      <el-select v-model="roleDialog.assignedIds" multiple placeholder="请选择角色" style="width: 100%">
        <el-option
          v-for="item in roleDialog.allRoles"
          :key="item.roleId"
          :label="item.roleName"
          :value="item.roleId"
        />
      </el-select>
      <template #footer>
        <el-button @click="roleDialog.visible = false">取 消</el-button>
        <el-button type="primary" @click="submitRoleForm">保 存</el-button>
      </template>
    </el-dialog>

  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { listUsersByPage, deleteUser, updateUser, addUser, getUserById } from '@/api/user.js';
// 【新增】导入角色和用户角色API
import { listRolesByPage } from '@/api/role.js';
import { getRolesByUserId, assignRoleToUser, removeRoleFromUser } from '@/api/userRole.js';

// ... (大部分 <script> 内容不变) ...
const loading = ref(true);
const userList = ref([]);
const total = ref(0);
const userFormRef = ref(null);

const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  userName: '',
  status: '',
});

const dialog = reactive({
  visible: false,
  title: ''
});

const form = ref({
  userId: null,
  userName: '',
  passwordHash: '',
  email: '',
  phoneNumber: '',
  status: 1
});

// 【新增】分配角色的对话框数据
const roleDialog = reactive({
  visible: false,
  userId: null,
  allRoles: [],
  assignedIds: []
});

const rules = reactive({
  userName: [{ required: true, message: "用户名不能为空", trigger: "blur" }],
  passwordHash: [{ required: true, message: "密码不能为空", trigger: "blur" }],
  email: [{ type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }],
});


onMounted(() => {
  getList();
});


// --- 【新增】角色分配相关方法 ---

/** 点击“分配角色”按钮 */
async function handleAssignRole(row) {
  roleDialog.userId = row.userId;

  // 1. 获取所有角色列表
  const allRolesRes = await listRolesByPage({ pageNo: 1, pageSize: 1000 });
  roleDialog.allRoles = allRolesRes.data;

  // 2. 获取当前用户已分配的角色
  const assignedRolesRes = await getRolesByUserId(row.userId);
  roleDialog.assignedIds = assignedRolesRes.data.map(ur => ur.roleId);

  roleDialog.visible = true;
}

/** 提交角色分配表单 */
async function submitRoleForm() {
  const userId = roleDialog.userId;
  const newRoleIds = new Set(roleDialog.assignedIds);

  const assignedRolesRes = await getRolesByUserId(userId);
  const oldRoleIds = new Set(assignedRolesRes.data.map(ur => ur.roleId));

  const toAdd = [...newRoleIds].filter(id => !oldRoleIds.has(id));
  const toRemove = [...oldRoleIds].filter(id => !newRoleIds.has(id));

  try {
    // 并行执行所有分配和移除操作
    await Promise.all([
      ...toAdd.map(roleId => assignRoleToUser({ userId, roleId })),
      ...toRemove.map(roleId => removeRoleFromUser({ userId, roleId }))
    ]);
    ElMessage.success("角色分配成功");
    roleDialog.visible = false;
    getList(); // 刷新列表以更新用户角色信息
  } catch (error) {
    ElMessage.error("角色分配失败");
  }
}

// --- 原有用户管理方法 (基本不变) ---

function getList() {
  loading.value = true;
  listUsersByPage(queryParams).then(response => {
    userList.value = response.data;
    total.value = response.total;
    loading.value = false;
  }).catch(() => {
    loading.value = false;
  });
}

function handleQuery() {
  queryParams.pageNo = 1;
  getList();
}

function resetForm() {
  form.value = {
    userId: null,
    userName: '',
    passwordHash: '',
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
  let text = row.status === 1 ? "启用" : "禁用";
  ElMessageBox.confirm(`确认要"${text}""${row.userName}"用户吗？`, '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    return updateUser({ userId: row.userId, status: row.status });
  }).then(() => {
    ElMessage.success(text + "成功");
  }).catch(() => {
    row.status = row.status === 1 ? 0 : 1;
  });
}

function handleAdd() {
  resetForm();
  dialog.title = '新增用户';
  dialog.visible = true;
}

function handleUpdate(row) {
  resetForm();
  const userId = row.userId;
  getUserById(userId).then(response => {
    form.value = response.data;
    dialog.title = '编辑用户';
    dialog.visible = true;
  });
}

function handleDelete(row) {
  ElMessageBox.confirm(`确认要删除用户"${row.userName}"吗？`, '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    return deleteUser(row.userId);
  }).then(() => {
    getList();
    ElMessage.success("删除成功");
  }).catch(() => {
  });
}

function cancel() {
  dialog.visible = false;
  resetForm();
}

function submitForm() {
  userFormRef.value.validate(valid => {
    if (valid) {
      if (form.value.userId) {
        updateUser(form.value).then(() => {
          ElMessage.success('修改成功');
          dialog.visible = false;
          getList();
        });
      } else {
        addUser(form.value).then(() => {
          ElMessage.success('新增成功');
          dialog.visible = false;
          getList();
        });
      }
    }
  });
}
</script>
