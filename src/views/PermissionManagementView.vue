<template>
  <PageContainer title="权限管理">
    <el-card>
      <div class="action-bar">
        <el-button type="success" icon="Plus" @click="handleAdd">
          新增权限
        </el-button>
      </div>

      <el-table v-loading="loading" :data="permissionList">
        <el-table-column label="权限ID" align="center" prop="permissionId" />
        <el-table-column label="权限名称" align="center" prop="permissionName" />
        <el-table-column label="权限编码" align="center" prop="permissionCode" />
        <el-table-column label="权限描述" align="center" prop="permissionDescription" :show-overflow-tooltip="true" />
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
        class="pagination-container"
      />
    </el-card>

    <el-dialog :title="dialog.title" v-model="dialog.visible" width="600px" @close="cancel">
      <el-form ref="permissionFormRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="权限名称" prop="permissionName">
          <el-input v-model="form.permissionName" placeholder="例如：数据查看" />
        </el-form-item>
        <el-form-item label="权限编码" prop="permissionCode">
          <el-input v-model="form.permissionCode" placeholder="例如：data:view" />
        </el-form-item>
        <el-form-item label="权限描述" prop="permissionDescription">
          <el-input v-model="form.permissionDescription" type="textarea" placeholder="请输入详细描述" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </template>
    </el-dialog>
  </PageContainer>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import PageContainer from '@/components/PageContainer.vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { listPermissionsByPage, deletePermission, updatePermission, addPermission, getPermissionById } from '@/api/permission.js';

const loading = ref(true);
const permissionList = ref([]);
const total = ref(0);
const permissionFormRef = ref(null);

const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
});

const dialog = reactive({
  visible: false,
  title: ''
});

const form = ref({
  permissionId: null,
  permissionName: '',
  permissionCode: '',
  permissionDescription: ''
});

const rules = reactive({
  permissionName: [{ required: true, message: "权限名称不能为空", trigger: "blur" }],
  permissionCode: [{ required: true, message: "权限编码不能为空", trigger: "blur" }],
});

onMounted(getList);

function getList() {
  loading.value = true;
  listPermissionsByPage(queryParams).then(response => {
    permissionList.value = response.data;
    total.value = response.total;
    loading.value = false;
  }).catch(() => {
    loading.value = false;
  });
}

function resetForm() {
  form.value = {
    permissionId: null,
    permissionName: '',
    permissionCode: '',
    permissionDescription: ''
  };
  permissionFormRef.value?.resetFields();
}

function handleAdd() {
  resetForm();
  dialog.title = '新增权限';
  dialog.visible = true;
}

function handleUpdate(row) {
  resetForm();
  getPermissionById(row.permissionId).then(response => {
    form.value = response.data;
    dialog.title = '编辑权限';
    dialog.visible = true;
  });
}

function handleDelete(row) {
  ElMessageBox.confirm(`确认要删除权限 "${row.permissionName}" 吗？`, '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    return deletePermission(row.permissionId);
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
  permissionFormRef.value.validate(valid => {
    if (valid) {
      if (form.value.permissionId) {
        updatePermission(form.value).then(() => {
          ElMessage.success('修改成功');
          dialog.visible = false;
          getList();
        });
      } else {
        addPermission(form.value).then(() => {
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
.action-bar {
  text-align: right;
  margin-bottom: 20px;
}
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
