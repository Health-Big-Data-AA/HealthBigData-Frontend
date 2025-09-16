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
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { listUsers, delUser, updateUser, addUser, getUser } from '@/api/user';

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

const rules = reactive({
  userName: [{ required: true, message: "用户名不能为空", trigger: "blur" }],
  passwordHash: [{ required: true, message: "密码不能为空", trigger: "blur" }],
  email: [{ type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }],
});

onMounted(() => {
  getList();
});

function getList() {
  loading.value = true;
  listUsers(queryParams).then(response => {
    userList.value = response.data;
    total.value = response.total;
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
  getUser(userId).then(response => {
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
    return delUser(row.userId);
  }).then(() => {
    getList();
    ElMessage.success("删除成功");
  }).catch(() => {});
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

<style scoped>
.app-container {
  padding: 20px;
}
</style>
