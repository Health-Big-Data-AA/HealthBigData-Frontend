<template>
  <div class="app-container">
    <el-card>
      <el-form :inline="true">
        <el-form-item style="float: right;">
          <el-button type="success" icon="Plus" @click="handleAdd">
            新增标签
          </el-button>
        </el-form-item>
      </el-form>

      <el-table v-loading="loading" :data="tagList">
        <el-table-column label="标签ID" align="center" prop="tagId" />
        <el-table-column label="标签名称" align="center" prop="tagName" />
        <el-table-column label="描述" align="center" prop="tagDescription" :show-overflow-tooltip="true" />
        <el-table-column label="操作" align="center" width="150">
          <template #default="scope">
            <el-button type="danger" link icon="Delete" @click="handleDelete(scope.row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog :title="dialog.title" v-model="dialog.visible" width="600px" append-to-body @close="cancel">
      <el-form ref="tagFormRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="标签名称" prop="tagName">
          <el-input v-model="form.tagName" placeholder="请输入标签名称" />
        </el-form-item>
        <el-form-item label="描述" prop="tagDescription">
          <el-input v-model="form.tagDescription" type="textarea" placeholder="请输入描述" />
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
import { getAllTags, createTag, deleteTag } from '@/api/tag';

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

onMounted(() => {
  getList();
});

function getList() {
  loading.value = true;
  getAllTags().then(response => {
    tagList.value = response.data;
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
  ElMessageBox.confirm(`确认要删除标签"${row.tagName}"吗？`, '警告', {
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

<style scoped>
.app-container {
  padding: 20px;
}
</style>
