<template>
  <PageContainer title="角色管理">
    <el-card>
      <el-form :inline="true" style="text-align: right;">
        <el-form-item>
          <el-button type="success" icon="Plus" @click="handleAdd">
            新增角色
          </el-button>
        </el-form-item>
      </el-form>

      <el-table v-loading="loading" :data="roleList">
        <el-table-column label="角色ID" align="center" prop="roleId" />
        <el-table-column label="角色名称" align="center" prop="roleName" />
        <el-table-column label="角色编码" align="center" prop="roleCode" />
        <el-table-column label="角色描述" align="center" prop="roleDescription" :show-overflow-tooltip="true" />
        <el-table-column label="操作" align="center" width="220">
          <template #default="scope">
            <el-button type="success" link icon="Key" @click="handleAssignPermission(scope.row)">
              分配权限
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
        class="pagination-container"
      />
    </el-card>

    <el-dialog :title="dialog.title" v-model="dialog.visible" width="600px" append-to-body @close="cancel">
      <el-form ref="roleFormRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="form.roleName" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item label="角色编码" prop="roleCode">
          <el-input v-model="form.roleCode" placeholder="例如：ANALYST" />
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDescription">
          <el-input v-model="form.roleDescription" type="textarea" placeholder="请输入描述信息" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </template>
    </el-dialog>

    <el-dialog title="分配权限" v-model="permissionDialog.visible" width="700px">
      <el-transfer
        v-model="permissionDialog.assignedIds"
        :data="permissionDialog.allPermissions"
        :titles="['未分配', '已分配']"
        :props="{ key: 'permissionId', label: 'permissionName' }"
        filterable
        target-order="push"
      />
      <template #footer>
        <el-button @click="permissionDialog.visible = false">取 消</el-button>
        <el-button type="primary" @click="submitPermissionForm">保 存</el-button>
      </template>
    </el-dialog>

  </PageContainer>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import PageContainer from '@/components/PageContainer.vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { listRolesByPage, deleteRole, updateRole, addRole, getRoleById } from '@/api/role.js';
import { listPermissionsByPage } from '@/api/permission.js';
import {
  getPermissionsByRoleId,
  assignPermissionToRole,
  removePermissionFromRole
} from '@/api/rolePermission.js';

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

const permissionDialog = reactive({
  visible: false,
  roleId: null,
  allPermissions: [],
  assignedIds: []
});

const rules = reactive({
  roleName: [{ required: true, message: "角色名称不能为空", trigger: "blur" }],
  roleCode: [{ required: true, message: "角色编码不能为空", trigger: "blur" }],
});

onMounted(() => {
  getList();
});

async function handleAssignPermission(row) {
  permissionDialog.roleId = row.roleId;
  const allPermissionsRes = await listPermissionsByPage({ pageNo: 1, pageSize: 1000 });
  permissionDialog.allPermissions = allPermissionsRes.data;
  const assignedPermissionsRes = await getPermissionsByRoleId(row.roleId);
  permissionDialog.assignedIds = assignedPermissionsRes.data.map(p => p.permissionId);
  permissionDialog.visible = true;
}

async function submitPermissionForm() {
  const roleId = permissionDialog.roleId;
  const newPermissionIds = new Set(permissionDialog.assignedIds);
  const assignedPermissionsRes = await getPermissionsByRoleId(roleId);
  const oldPermissionIds = new Set(assignedPermissionsRes.data.map(p => p.permissionId));
  const toAdd = [...newPermissionIds].filter(id => !oldPermissionIds.has(id));
  const toRemove = [...oldPermissionIds].filter(id => !newPermissionIds.has(id));

  try {
    await Promise.all([
      ...toAdd.map(permissionId => assignPermissionToRole({ roleId, permissionId })),
      ...toRemove.map(permissionId => removePermissionFromRole({ roleId, permissionId }))
    ]);
    ElMessage.success("权限分配成功");
    permissionDialog.visible = false;
  } catch (error) {
    ElMessage.error("权限分配失败");
  }
}

function getList() {
  loading.value = true;
  listRolesByPage(queryParams).then(response => {
    roleList.value = response.data;
    total.value = response.total;
    loading.value = false;
  }).catch(() => {
    loading.value = false;
  });
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
  getRoleById(roleId).then(response => {
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
    return deleteRole(row.roleId);
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

<style scoped lang="scss">
.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
:deep(.el-card) {
  background-color: #161b22;
  border: 1px solid #30363d;
  color: #c9d1d9;
}
:deep(.el-table) {
  background-color: transparent;
  --el-table-border-color: #30363d;
  --el-table-header-bg-color: transparent;
  --el-table-header-text-color: #a7b1c2;
  --el-table-tr-bg-color: transparent;
  --el-table-row-hover-bg-color: rgba(255, 255, 255, 0.05);
  --el-table-text-color: #c9d1d9;
}
:deep(.el-table th.el-table__cell) {
  background-color: transparent;
}
:deep(.el-table tr) {
  background-color: transparent;
}
:deep(.el-pagination) {
  --el-pagination-bg-color: transparent;
  --el-pagination-text-color: #a7b1c2;
  --el-pagination-button-bg-color: transparent;
  --el-pagination-button-disabled-bg-color: transparent;
}
</style>
