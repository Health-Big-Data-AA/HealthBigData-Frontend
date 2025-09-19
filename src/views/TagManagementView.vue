<template>
  <PageContainer title="标签管理">
    <el-card>
      <div class="action-bar">
        <el-button type="success" icon="Plus" @click="handleAdd">
          新增标签
        </el-button>
      </div>

      <el-table v-loading="loading" :data="tagList">
        <el-table-column label="标签ID" align="center" prop="tagId" width="100" />
        <el-table-column label="标签名称" align="center" prop="tagName" />
        <el-table-column label="标签描述" align="center" prop="tagDescription" :show-overflow-tooltip="true" />
        <el-table-column label="创建者ID" align="center" prop="createdByUserId" />
        <el-table-column label="创建时间" align="center" prop="createTime" width="180"/>
        <el-table-column label="操作" align="center" width="100">
          <template #default="scope">
            <el-button
              type="danger"
              link
              icon="Delete"
              @click="handleDelete(scope.row)"
              v-if="userStore.roles.includes('ADMIN')"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog :title="dialog.title" v-model="dialog.visible" width="600px" @close="cancel">
      <el-form ref="tagFormRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="标签名称" prop="tagName">
          <el-input v-model="form.tagName" placeholder="例如：高血压" />
        </el-form-item>
        <el-form-item label="标签描述" prop="tagDescription">
          <el-input v-model="form.tagDescription" type="textarea" placeholder="请输入详细描述" />
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
import { useUserStore } from '@/stores/user';
import { getAllTags, createTag, deleteTag } from '@/api/tag.js';

const userStore = useUserStore();
const loading = ref(true);
const tagList = ref([]);
const tagFormRef = ref(null);

const dialog = reactive({
  visible: false,
  title: ''
});

const form = ref({
  tagId: null,
  tagName: '',
  tagDescription: ''
});

const rules = reactive({
  tagName: [{ required: true, message: "标签名称不能为空", trigger: "blur" }],
});

onMounted(getList);

function getList() {
  loading.value = true;
  getAllTags().then(response => {
    tagList.value = response.data;
    loading.value = false;
  }).catch(() => {
    loading.value = false;
  });
}

function resetForm() {
  form.value = {
    tagId: null,
    tagName: '',
    tagDescription: ''
  };
  tagFormRef.value?.resetFields();
}

function handleAdd() {
  resetForm();
  dialog.title = '新增标签';
  dialog.visible = true;
}

function handleDelete(row) {
  ElMessageBox.confirm(`确认要删除标签 "${row.tagName}" 吗？`, '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    return deleteTag(row.tagId);
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
  tagFormRef.value.validate(valid => {
    if (valid) {
      createTag(form.value).then(() => {
        ElMessage.success('新增成功');
        dialog.visible = false;
        getList();
      });
    }
  });
}
</script>

<style scoped lang="scss">
.action-bar {
  text-align: right;
  margin-bottom: 20px;
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
</style>
