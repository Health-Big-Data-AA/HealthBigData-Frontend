<template>
  <div class="app-container">
    <el-card>
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-upload
            action="/api/data/import"
            :show-file-list="false"
            accept=".xlsx, .xls, .csv"
            :on-success="handleUploadSuccess"
            :on-error="handleUploadError"
          >
            <el-button type="success" icon="Upload">导入数据</el-button>
          </el-upload>
        </el-col>
        <el-col :span="1.5">
          <el-button type="warning" icon="Download" @click="handleExport">导出数据</el-button>
        </el-col>
      </el-row>

      <el-table v-loading="loading" :data="recordList">
        <el-table-column type="expand">
          <template #default="props">
            <div class="record-details">
              <h4>记录详情 (JSON 数据)</h4>
              <el-descriptions border :column="2">
                <el-descriptions-item label="患者姓名">{{ props.row.record_data.patient_info.name }}</el-descriptions-item>
                <el-descriptions-item label="年龄">{{ props.row.record_data.patient_info.age }}</el-descriptions-item>
                <el-descriptions-item label="性别">{{ props.row.record_data.patient_info.gender }}</el-descriptions-item>

                <template v-if="props.row.record_data.vitals">
                  <el-descriptions-item label="身高/体重">{{ props.row.record_data.vitals.height_cm }}cm / {{ props.row.record_data.vitals.weight_kg }}kg</el-descriptions-item>
                  <el-descriptions-item label="血压">{{ props.row.record_data.vitals.blood_pressure }}</el-descriptions-item>
                  <el-descriptions-item label="心率">{{ props.row.record_data.vitals.heart_rate_bpm }} bpm</el-descriptions-item>
                </template>

                <template v-if="props.row.record_data.lab_results">
                  <el-descriptions-item label="血糖">{{ props.row.record_data.lab_results.blood_glucose_mmol_L }} mmol/L</el-descriptions-item>
                  <el-descriptions-item label="胆固醇">{{ props.row.record_data.lab_results.cholesterol_mmol_L }} mmol/L</el-descriptions-item>
                </template>

                <template v-if="props.row.record_data.diagnosis">
                  <el-descriptions-item label="诊断日期">{{ props.row.record_data.visit_date }}</el-descriptions-item>
                  <el-descriptions-item label="诊断结果">{{ props.row.record_data.diagnosis }}</el-descriptions-item>
                  <el-descriptions-item label="医嘱" :span="2">{{ props.row.record_data.doctor_advice }}</el-descriptions-item>
                </template>

              </el-descriptions>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="记录ID" align="center" prop="record_id" />
        <el-table-column label="患者标识" align="center" prop="patient_identifier" />
        <el-table-column label="记录类型" align="center" prop="record_type" />
        <el-table-column label="创建人ID" align="center" prop="created_by_user_id" />
        <el-table-column label="创建时间" align="center" prop="create_time" width="180"/>
        <el-table-column label="更新时间" align="center" prop="update_time" width="180"/>
      </el-table>

      <el-pagination
        v-show="total > 0"
        v-model:current-page="queryParams.pageNum"
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

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
// 假设你有一个封装好的 API 文件
// import { listRecords, exportRecords } from '@/api/data';

// --- 响应式数据 ---
const loading = ref(true);
const recordList = ref([]);
const total = ref(0);

const queryParams = reactive({
  pageNum: 1,
  pageSize: 10,
});

// --- 生命周期钩子 ---
onMounted(() => {
  getList();
});

// --- 方法 ---
function getList() {
  loading.value = true;
  // **API 调用**: listRecords(queryParams).then(response => { ... });
  // 模拟数据 (来自您提供的 SQL 文件)
  setTimeout(() => {
    const mockData = [
      { record_id: 1, patient_identifier: 'SN-PATIENT-001', record_type: '体检报告', record_data: '{"patient_info": {"name": "王先生", "age": 45, "gender": "男"}, "vitals": {"height_cm": 175, "weight_kg": 72, "blood_pressure": "120/80", "heart_rate_bpm": 75}, "lab_results": {"blood_glucose_mmol_L": 5.8, "cholesterol_mmol_L": 4.9}}', created_by_user_id: 2, create_time: '2025-09-16 10:10:00', update_time: '2025-09-16 10:10:00' },
      { record_id: 2, patient_identifier: 'SN-PATIENT-002', record_type: '电子病历', record_data: '{"patient_info": {"name": "李女士", "age": 62, "gender": "女"}, "visit_date": "2025-09-15", "diagnosis": "2型糖尿病", "medication": [{"name": "二甲双胍", "dosage": "500mg", "frequency": "每日两次"}], "doctor_advice": "低糖饮食，加强锻炼，定期监测血糖。"}', created_by_user_id: 2, create_time: '2025-09-15 11:20:00', update_time: '2025-09-15 11:20:00' },
      { record_id: 3, patient_identifier: 'SN-PATIENT-003', record_type: '体检报告', record_data: '{"patient_info": {"name": "张先生", "age": 35, "gender": "男"}, "vitals": {"height_cm": 180, "weight_kg": 85, "blood_pressure": "135/88", "heart_rate_bpm": 80}, "lab_results": {"blood_glucose_mmol_L": 6.5, "cholesterol_mmol_L": 6.2}, "summary": "血压和总胆固醇偏高，建议关注。"}', created_by_user_id: 2, create_time: '2025-09-14 09:30:00', update_time: '2025-09-14 09:30:00' },
    ];
    // **核心处理**: 将 record_data 字符串解析为 JSON 对象
    recordList.value = mockData.map(item => {
      try {
        item.record_data = JSON.parse(item.record_data);
      } catch (e) {
        console.error("解析 JSON 失败:", item.record_data);
        item.record_data = { error: "无效的JSON格式" }; // 解析失败时的降级处理
      }
      return item;
    });
    total.value = mockData.length;
    loading.value = false;
  }, 500);
}

// 文件上传成功处理
function handleUploadSuccess(response, file, fileList) {
  if (response.code === 200) { // 假设后端成功返回的 code 是 200
    ElMessage.success('数据导入成功！');
    getList(); // 刷新列表
  } else {
    ElMessage.error(response.msg || '数据导入失败！');
  }
}

// 文件上传失败处理
function handleUploadError() {
  ElMessage.error('文件上传失败，请检查网络或联系管理员！');
}

// 导出按钮操作
function handleExport() {
  ElMessageBox.confirm('您确定要导出当前查询结果的数据吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    // **API 调用**: exportRecords(queryParams).then(response => { ... });
    console.log("正在执行导出...");
    ElMessage.success("已开始导出任务，请稍后在下载中心查看。");
    // 这里通常会触发一个文件下载
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
</style>
