<template>
  <div class="app-container">
    <el-card>
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-upload
            :action="uploadUrl"
            :headers="uploadHeaders"
            :show-file-list="false"
            accept=".xlsx, .xls"
            :on-success="handleUploadSuccess"
            :on-error="handleUploadError"
          >
            <el-button type="success" icon="Upload">导入数据</el-button>
          </el-upload>
        </el-col>
        <el-col :span="1.5">
          <el-button type="warning" icon="Download" @click="handleExport">导出数据</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button type="primary" icon="MagicStick" @click="handleCleanse">数据清洗</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button type="info" icon="Delete" @click="handleDeduplicate">数据去重</el-button>
        </el-col>
      </el-row>

      <el-table v-loading="loading" :data="recordList">
        <el-table-column type="expand">
          <template #default="props">
            <div class="record-details">
              <h4>记录详情 (JSON 数据)</h4>
              <pre>{{ formatJson(props.row.recordData) }}</pre>
            </div>
          </template>
        </el-table-column>
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
      />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue';
import type { AxiosResponse } from 'axios';
import { ElMessage, ElMessageBox } from 'element-plus';
import { useUserStore } from '@/stores/user';
import { listRecords, exportRecords } from '@/api/record.js';
import { cleanseData, deduplicateData } from '@/api/dataManagement.js';

// --- 类型定义 ---
interface PatientRecord {
  recordId: number;
  patientIdentifier: string;
  recordType: string;
  recordData: string;
  createdByUserId: number;
  createTime: string;
  updateTime: string;
}

// Corrected: 使用泛型 <T> 来避免 data: any
interface ApiResponse<T> {
  code: number;
  data: T;
  msg: string;
  total?: number; // 分页接口会有 total
}

interface PageData {
  data: PatientRecord[];
  total: number;
}

// --- 组件逻辑 ---
const userStore = useUserStore();
const loading = ref(true);
const recordList = ref<PatientRecord[]>([]);
const total = ref(0);

const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
});

const uploadUrl = ref(`${import.meta.env.VITE_APP_BASE_API}/records/import`);
const uploadHeaders = computed(() => {
  return { 'Authorization': 'Bearer ' + userStore.token }
});

onMounted(() => {
  getList();
});

function getList() {
  loading.value = true;
  listRecords(queryParams).then((response: ApiResponse<PatientRecord[]>) => {
    recordList.value = response.data;
    total.value = response.total;
    loading.value = false;
  });
}

function formatJson(jsonString: string) {
  try {
    const obj = JSON.parse(jsonString);
    return JSON.stringify(obj, null, 2);
  } catch {
    return jsonString;
  }
}

function handleUploadSuccess(response: ApiResponse<string>) {
  if (response.code === 200) {
    ElMessage.success(response.msg || '数据导入成功！');
    getList();
  } else {
    ElMessage.error(response.msg || '数据导入失败！');
  }
}

function handleUploadError() {
  ElMessage.error('文件上传失败，请检查网络或联系管理员！');
}

function handleExport() {
  ElMessageBox.confirm('您确定要导出所有数据吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    exportRecords().then((response: AxiosResponse) => {
      const blob = new Blob([response.data], { type: response.headers['content-type'] });
      const downloadLink = document.createElement('a');
      const href = window.URL.createObjectURL(blob);
      const contentDisposition = response.headers['content-disposition'];
      let fileName = 'records.xlsx';
      if (contentDisposition) {
        const fileNameMatch = contentDisposition.match(/filename="(.+)"/);
        if (fileNameMatch && fileNameMatch.length === 2)
          fileName = fileNameMatch[1];
      }
      downloadLink.href = href;
      downloadLink.download = fileName;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      window.URL.revokeObjectURL(href);
    });
  }).catch(() => {});
}

function handleCleanse() {
  ElMessageBox.confirm('确认要执行数据清洗吗？此操作将扫描并报告无效数据。', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    cleanseData().then((response: ApiResponse<{ message: string }>) => {
      ElMessageBox.alert(response.data.message, '清洗报告', {
        confirmButtonText: '好的',
      });
    });
  }).catch(() => {});
}

function handleDeduplicate() {
  ElMessageBox.confirm('确认要执行数据去重吗？此操作将移除重复记录。', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    deduplicateData().then((response: ApiResponse<{ message: string }>) => {
      ElMessage.success(response.data.message);
      getList();
    });
  }).catch(() => {});
}
</script>

<style scoped>
.app-container {
  padding: 20px;
}
.mb8 {
  margin-bottom: 10px;
}
.record-details {
  padding: 10px 20px;
  background-color: #f8f8f9;
}
.record-details pre {
  white-space: pre-wrap;
  word-wrap: break-word;
}
</style>
