<template>
  <PageContainer title="日志审计">
    <el-card>
      <el-form :inline="true" :model="queryParams" @submit.prevent="handleQuery" class="search-form">
        <el-form-item label="用户名">
          <el-input v-model="queryParams.userName" placeholder="请输入用户名" clearable />
        </el-form-item>
        <el-form-item label="操作类型">
          <el-select v-model="queryParams.operationType" placeholder="请选择类型" clearable>
            <el-option label="DATA_IMPORT" value="DATA_IMPORT" />
            <el-option label="DATA_EXPORT" value="DATA_EXPORT" />
            <el-option label="USER_LOGIN" value="USER_LOGIN" />
            <el-option label="USER_MANAGEMENT" value="USER_MANAGEMENT" />
          </el-select>
        </el-form-item>
        <el-form-item label="操作时间">
          <el-date-picker
            v-model="timeRange"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="YYYY-MM-DDTHH:mm:ss"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
          <el-button icon="Refresh" @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>

      <el-table v-loading="loading" :data="logList">
        <el-table-column label="日志ID" align="center" prop="logId" />
        <el-table-column label="用户名" align="center" prop="userName" />
        <el-table-column label="操作类型" align="center" prop="operationType" />
        <el-table-column label="操作状态" align="center">
          <template #default="scope">
            <el-tag :type="scope.row.operationStatus === 'SUCCESS' ? 'success' : 'danger'">
              {{ scope.row.operationStatus }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作详情" align="center" prop="operationDetails" :show-overflow-tooltip="true" />
        <el-table-column label="操作时间" align="center" prop="operationTime" width="180"/>
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
import { ref, reactive, onMounted } from 'vue';
import PageContainer from '@/components/PageContainer.vue';
import { searchLogs } from '@/api/operationLog.js';

const loading = ref(true);
const logList = ref([]);
const total = ref(0);
const timeRange = ref([]); // 用于 el-date-picker 的 v-model

// 查询参数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  userName: '',
  operationType: '',
  startTime: '',
  endTime: ''
});

// 获取日志列表
const getList = async () => {
  loading.value = true;
  // 更新查询参数中的时间
  queryParams.startTime = timeRange.value ? timeRange.value[0] : '';
  queryParams.endTime = timeRange.value ? timeRange.value[1] : '';

  try {
    const response = await searchLogs(queryParams);
    logList.value = response.data;
    total.value = response.total;
  } finally {
    loading.value = false;
  }
};

// 搜索按钮操作
const handleQuery = () => {
  queryParams.pageNo = 1;
  getList();
};

// 重置按钮操作
const handleReset = () => {
  queryParams.pageNo = 1;
  queryParams.userName = '';
  queryParams.operationType = '';
  queryParams.startTime = '';
  queryParams.endTime = '';
  timeRange.value = [];
  getList();
};

onMounted(() => {
  getList();
});
</script>

<style scoped lang="scss">
.search-form {
  margin-bottom: 20px;
}
.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

// 深度选择器 :deep() 用于覆盖 Element Plus 组件的内部样式
:deep(.el-card) {
  background-color: #161b22;
  border: 1px solid #30363d;
  color: #c9d1d9;
}

:deep(.el-form-item__label) {
  color: #a7b1c2;
}

:deep(.el-input__wrapper),
:deep(.el-select__wrapper) {
  background-color: rgba(30, 36, 50, 0.8) !important;
  box-shadow: none !important;
  border: 1px solid #30363d;
}

:deep(.el-input__inner) {
  color: #e6edf3 !important;
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
