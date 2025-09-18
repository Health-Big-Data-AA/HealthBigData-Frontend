<template>
  <div class="app-container">
    <el-card>
      <el-form :inline="true" @submit.prevent="handleQuery">
        <el-form-item style="float: right;">
          <el-button type="success" icon="Plus" @click="handleAdd">
            新增角色
          </el-button>
        </el-form-item>
      </el-form>

      <el-table v-loading="loading" :data="roleList">
        <el-table-column label="角色ID" align="center" prop="roleId" />
        <el-table-column label="角色名称" align="center" prop="roleName" />
        <el-table-column label="角色编码" align="center" prop="roleCode" />
        <el-table-column label="描述" align="center" prop="roleDescription" :show-overflow-tooltip="true" />
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
      <el-form ref="roleFormRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="form.roleName" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item label="角色编码" prop="roleCode">
          <el-input v-model="form.roleCode" placeholder="请输入角色编码" />
        </el-form-item>
        <el-form-item label="描述" prop="roleDescription">
          <el-input v-model="form.roleDescription" type="textarea" placeholder="请输入描述" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { listRoles, delRole, updateRole, addRole, getRole } from '@/api/role';

const loading = ref(true);
const roleList = ref([]);
const total = ref(0);
const roleFormRef = ref(null);

const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
});

const dialog = reactive({
  visible: false,
  title: ''
});

const form = ref({
  roleId: null,
  roleName: '',
  roleCode: '',
  roleDescription: ''
});

const rules = reactive({
  roleName: [{ required: true, message: "角色名称不能为空", trigger: "blur" }],
  roleCode: [{ required: true, message: "角色编码不能为空", trigger: "blur" }],
});

onMounted(() => {
  getList();
});

function getList() {
  loading.value = true;
  listRoles(queryParams).then(response => {
    roleList.value = response.data;
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
    roleId: null,
    roleName: '',
    roleCode: '',
    roleDescription: ''
  };
  roleFormRef.value?.resetFields();
}

function handleAdd() {
  resetForm();
  dialog.title = '新增角色';
  dialog.visible = true;
}

function handleUpdate(row) {
  resetForm();
  const roleId = row.roleId;
  getRole(roleId).then(response => {
    form.value = response.data;
    dialog.title = '编辑角色';
    dialog.visible = true;
  });
}

function handleDelete(row) {
  ElMessageBox.confirm(`确认要删除角色"${row.roleName}"吗？`, '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    return delRole(row.roleId);
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
  roleFormRef.value.validate(valid => {
    if (valid) {
      if (form.value.roleId) {
        updateRole(form.value).then(() => {
          ElMessage.success('修改成功');
          dialog.visible = false;
          getList();
        });
      } else {
        addRole(form.value).then(() => {
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
