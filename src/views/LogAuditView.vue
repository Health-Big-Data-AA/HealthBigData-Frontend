<template>
  <div class="app-container">
    <el-card>
      <el-form :inline="true" :model="queryParams" @submit.prevent="handleQuery">
        <el-form-item label="操作用户">
          <el-input v-model="queryParams.userName" placeholder="请输入用户名" clearable />
        </el-form-item>
        <el-form-item label="操作类型">
          <el-input v-model="queryParams.operationType" placeholder="请输入操作类型" clearable />
        </el-form-item>
        <el-form-item label="操作时间">
          <el-date-picker
            v-model="dateRange"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            value-format="YYYY-MM-DDTHH:mm:ss"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
          <el-button icon="Refresh" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>

      <el-table v-loading="loading" :data="logList">
        <el-table-column label="日志ID" align="center" prop="logId" width="80" />
        <el-table-column label="操作用户" align="center" prop="userName" />
        <el-table-column label="操作类型" align="center" prop="operationType" />
        <el-table-column label="操作详情" align="center" prop="operationDetails" :show-overflow-tooltip="true" />
        <el-table-column label="状态" align="center" prop="operationStatus">
          <template #default="scope">
            <el-tag :type="scope.row.operationStatus === 'SUCCESS' ? 'success' : 'danger'">
              {{ scope.row.operationStatus === 'SUCCESS' ? '成功' : '失败' }}
            </el-tag>
          </template>
        </el-table-column>
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
      />
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { searchLogs } from '@/api/log';

const loading = ref(true);
const logList = ref([]);
const total = ref(0);
const dateRange = ref([]);

const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  userName: '',
  operationType: '',
  startTime: '',
  endTime: ''
});

onMounted(() => {
  getList();
});

function getList() {
  loading.value = true;
  if(dateRange.value && dateRange.value.length) {
    queryParams.startTime = dateRange.value[0];
    queryParams.endTime = dateRange.value[1];
  } else {
    queryParams.startTime = '';
    queryParams.endTime = '';
  }

  searchLogs(queryParams).then(response => {
    logList.value = response.data;
    total.value = response.total;
    loading.value = false;
  });
}

function handleQuery() {
  queryParams.pageNo = 1;
  getList();
}

function resetQuery() {
  dateRange.value = [];
  queryParams.userName = '';
  queryParams.operationType = '';
  handleQuery();
}
</script>

<style scoped>
.app-container {
  padding: 20px;
}
</style>
