<template>
  <PageContainer title="数据管理">
    <el-card>
      <el-row :gutter="10" class="action-buttons">
        <el-col :span="1.5">
          <el-upload
            :action="uploadUrl"
            :headers="uploadHeaders"
            :show-file-list="false"
            accept=".xlsx, .xls"
            :on-success="handleUploadSuccess"
            :on-error="handleUploadError"
            :before-upload="handleBeforeUpload"
          >
            <el-button type="success" icon="Upload">导入数据</el-button>
          </el-upload>
        </el-col>
        <el-col :span="1.5">
          <el-button type="warning" icon="Download" @click="handleExport" :loading="exportLoading">导出数据</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button type="primary" icon="MagicStick" @click="handleCleanse" :loading="cleanseLoading">数据清洗</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button type="info" icon="Delete" @click="handleDeduplicate" :loading="deduplicateLoading">数据去重</el-button>
        </el-col>
      </el-row>

      <el-table v-loading="loading" :data="recordList">
        <el-table-column label="记录ID" align="center" prop="recordId" />
        <el-table-column label="患者标识" align="center" prop="patientIdentifier" />
        <el-table-column label="记录类型" align="center" prop="recordType" />
        <el-table-column label="创建人ID" align="center" prop="createdByUserId" />
        <el-table-column label="创建时间" align="center" prop="createTime" width="180"/>
        <el-table-column label="更新时间" align="center" prop="updateTime" width="180"/>
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
  </PageContainer>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue';
import PageContainer from '@/components/PageContainer.vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { listRecordsByPage, exportRecords } from '@/api/patientRecord.js';
import { cleanseData, deduplicateData } from '@/api/dataManagement.js';
import { getStorage } from '@/utils/localStorage';

const loading = ref(true);
const exportLoading = ref(false);
const cleanseLoading = ref(false);
const deduplicateLoading = ref(false);
const recordList = ref([]);
const total = ref(0);

const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
});

const uploadUrl = ref('/api/api/records/import');
const uploadHeaders = computed(() => ({
  Authorization: 'Bearer ' + getStorage('user-token')
}));

onMounted(() => {
  getList();
});

function getList() {
  loading.value = true;
  listRecordsByPage(queryParams).then(response => {
    recordList.value = response.data;
    total.value = response.total;
    loading.value = false;
  });
}

function handleBeforeUpload(file) {
  const isExcel = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || file.type === 'application/vnd.ms-excel';
  const isLt10M = file.size / 1024 / 1024 < 10;
  if (!isExcel) ElMessage.error('上传文件只能是 Excel 格式!');
  if (!isLt10M) ElMessage.error('上传文件大小不能超过 10MB!');
  return isExcel && isLt10M;
}

function handleUploadSuccess(response) {
  ElMessage.success(response.data || '数据导入成功！');
  getList();
}

function handleUploadError() {
  ElMessage.error('文件上传失败，请检查文件格式或联系管理员！');
}

function handleExport() {
  ElMessageBox.confirm('您确定要导出所有患者记录吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    exportLoading.value = true;
    exportRecords().then(response => {
      const contentDisposition = response.headers['content-disposition'];
      let fileName = 'patient_records.xlsx';
      if (contentDisposition) {
        const fileNameMatch = contentDisposition.match(/filename="?(.+?)"?$/);
        if (fileNameMatch && fileNameMatch.length === 2)
          fileName = fileNameMatch[1];
      }
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    }).finally(() => {
      exportLoading.value = false;
    });
  }).catch(() => {});
}

function handleCleanse() {
  cleanseLoading.value = true;
  cleanseData().then(response => {
    const result = response.data;
    ElMessageBox.alert(
      `<strong>${result.message}</strong><br/>
       检查总数: ${result.totalRecordsChecked}<br/>
       发现不合规记录数: ${result.invalidRecordsFound}<br/>
       <small>详情请查看系统日志。</small>`,
      '数据清洗报告',
      { dangerouslyUseHTMLString: true }
    );
  }).finally(() => {
    cleanseLoading.value = false;
    getList();
  });
}

function handleDeduplicate() {
  deduplicateLoading.value = true;
  deduplicateData().then(response => {
    const result = response.data;
    ElMessageBox.alert(
      `<strong>${result.message}</strong><br/>
       发现重复数: ${result.totalDuplicatesFound}<br/>
       移除记录数: ${result.totalRecordsRemoved}<br/>
       <small>详情请查看系统日志。</small>`,
      '数据去重报告',
      { dangerouslyUseHTMLString: true }
    );
  }).finally(() => {
    deduplicateLoading.value = false;
    getList();
  });
}
</script>

<style scoped lang="scss">
.action-buttons {
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
