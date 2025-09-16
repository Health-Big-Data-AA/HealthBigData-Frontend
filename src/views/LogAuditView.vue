<template>
  <div class="app-container">
    <el-card>
      <el-form :inline="true" :model="queryParams" @submit.prevent="handleQuery">
        <el-form-item label="操作用户">
          <el-input v-model="queryParams.userName" placeholder="请输入用户名" clearable />
        </el-form-item>
        <el-form-item label="操作类型">
          <el-select v-model="queryParams.operationType" placeholder="请选择类型" clearable>
            <el-option label="用户登录" value="USER_LOGIN" />
            <el-option label="数据导入" value="DATA_IMPORT" />
            <el-option label="数据导出" value="DATA_EXPORT" />
            <el-option label="用户管理" value="USER_MANAGEMENT" />
          </el-select>
        </el-form-item>
        <el-form-item label="操作状态">
          <el-select v-model="queryParams.status" placeholder="请选择状态" clearable>
            <el-option label="成功" value="SUCCESS" />
            <el-option label="失败" value="FAILED" />
          </el-select>
        </el-form-item>
        <el-form-item label="操作时间">
          <el-date-picker
            v-model="dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
          <el-button icon="Refresh" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>

      <el-table v-loading="loading" :data="logList">
        <el-table-column label="日志ID" align="center" prop="log_id" width="80" />
        <el-table-column label="操作用户" align="center" prop="user_name" />
        <el-table-column label="操作类型" align="center" prop="operation_type" />
        <el-table-column label="操作详情" align="center" prop="operation_details" :show-overflow-tooltip="true" />
        <el-table-column label="状态" align="center" prop="operation_status">
          <template #default="scope">
            <el-tag :type="scope.row.operation_status === 'SUCCESS' ? 'success' : 'danger'">
              {{ scope.row.operation_status === 'SUCCESS' ? '成功' : '失败' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作时间" align="center" prop="operation_time" width="180"/>
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
// import { listLogs } from '@/api/log';

// --- 响应式数据 ---
const loading = ref(true);
const logList = ref([]);
const total = ref(0);
const dateRange = ref([]); // 日期范围

const queryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  userName: '',
  operationType: '',
  status: ''
});

// --- 生命周期钩子 ---
onMounted(() => {
  getList();
});

// --- 方法 ---
function getList() {
  loading.value = true;
  // **API 调用**:
  // let params = {...queryParams, beginTime: dateRange.value[0], endTime: dateRange.value[1]};
  // listLogs(params).then(response => { ... });

  // 模拟数据 (来自您提供的 SQL 文件)
  setTimeout(() => {
    logList.value = [
      { log_id: 1, user_id: 1, user_name: 'admin', operation_type: 'USER_LOGIN', operation_details: '用户 admin 从 IP 192.168.1.10 登录系统', operation_status: 'SUCCESS', operation_time: '2025-09-16 10:00:00' },
      { log_id: 2, user_id: 2, user_name: 'researcher', operation_type: 'DATA_IMPORT', operation_details: '导入了文件 patient_batch_01.csv, 共 1024 条记录', operation_status: 'SUCCESS', operation_time: '2025-09-15 11:30:00' },
      { log_id: 3, user_id: 3, user_name: 'analyst', operation_type: 'DATA_EXPORT', operation_details: '导出了研究项目 [Project-Alpha] 的分析结果报表', operation_status: 'SUCCESS', operation_time: '2025-09-15 14:20:00' },
      { log_id: 4, user_id: 1, user_name: 'admin', operation_type: 'USER_MANAGEMENT', operation_details: '将用户 researcher 的角色权限更新为“研究员”', operation_status: 'SUCCESS', operation_time: '2025-09-14 09:00:00' },
      { log_id: 5, user_id: null, user_name: 'unknown_user', operation_type: 'USER_LOGIN', operation_details: '尝试使用错误的密码从 IP 202.108.22.5 登录失败', operation_status: 'FAILED', operation_time: '2025-09-13 18:45:00' }
    ];
    total.value = 5;
    loading.value = false;
  }, 500);
}

// 搜索按钮操作
function handleQuery() {
  queryParams.pageNum = 1;
  getList();
}

// 重置按钮操作
function resetQuery() {
  dateRange.value = [];
  queryParams.userName = '';
  queryParams.operationType = '';
  queryParams.status = '';
  handleQuery();
}
</script>

<style scoped>
.app-container {
  padding: 20px;
}
</style>
