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
        <el-table-column label="操作" align="center" width="120">
          <template #default="scope">
            <el-button type="primary" link icon="PriceTag" @click="handleAssignTag(scope.row)">
              分配标签
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

    <el-dialog title="分配标签" v-model="tagDialog.visible" width="600px">
      <el-select
        v-model="tagDialog.assignedIds"
        multiple
        filterable
        placeholder="请选择或搜索标签"
        style="width: 100%"
      >
        <el-option
          v-for="item in tagDialog.allTags"
          :key="item.tagId"
          :label="item.tagName"
          :value="item.tagId"
        />
      </el-select>
      <template #footer>
        <el-button @click="tagDialog.visible = false">取 消</el-button>
        <el-button type="primary" @click="submitTagForm">保 存</el-button>
      </template>
    </el-dialog>
  </PageContainer>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue';
import PageContainer from '@/components/PageContainer.vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { listRecordsByPage, exportRecords } from '@/api/patientRecord.js';
import { cleanseData, deduplicateData } from '@/api/dataManagement.js';
import { getStorage } from '@/utils/localStorage';
import { getAllTags } from '@/api/tag.js';
import { getTagsByRecordId, addTagToRecord, removeTagFromRecord } from '@/api/patientRecordTag.js';

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

const tagDialog = reactive({
  visible: false,
  recordId: null,
  allTags: [],
  assignedIds: []
});

// --- 【核心修改】修正上传地址，去掉重复的 /api ---
const uploadUrl = ref('/api/records/import');

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

async function handleAssignTag(row) {
  tagDialog.recordId = row.recordId;
  const allTagsRes = await getAllTags();
  tagDialog.allTags = allTagsRes.data;
  const assignedTagsRes = await getTagsByRecordId(row.recordId);
  tagDialog.assignedIds = assignedTagsRes.data.map(t => t.tagId);
  tagDialog.visible = true;
}

async function submitTagForm() {
  const recordId = tagDialog.recordId;
  const newTagIds = new Set(tagDialog.assignedIds);
  const assignedTagsRes = await getTagsByRecordId(recordId);
  const oldTagIds = new Set(assignedTagsRes.data.map(t => t.tagId));

  const toAdd = [...newTagIds].filter(id => !oldTagIds.has(id));
  const toRemove = [...oldTagIds].filter(id => !newTagIds.has(id));

  try {
    await Promise.all([
      ...toAdd.map(tagId => addTagToRecord({ recordId, tagId })),
      ...toRemove.map(tagId => removeTagFromRecord({ recordId, tagId }))
    ]);
    ElMessage.success("标签分配成功");
    tagDialog.visible = false;
  } catch (error) {
    ElMessage.error("标签分配失败");
  }
}

function handleBeforeUpload(file) {
  const isExcel = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || file.type === 'application/vnd.ms-excel';
  const isLt10M = file.size / 1024 / 1024 < 10;
  if (!isExcel) ElMessage.error('上传文件只能是 Excel 格式!');
  if (!isLt10M) ElMessage.error('上传文件大小不能超过 10MB!');
  return isExcel && isLt10M;
}

// 修改成功回调，导入后刷新列表
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

// 修改清洗和去重回调，操作后刷新列表
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
