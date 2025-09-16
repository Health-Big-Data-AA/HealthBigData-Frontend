<template>
  <div class="app-container">
    <el-card class="filter-card">
      <el-form :inline="true">
        <el-form-item label="时间范围">
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
          <el-button type="primary" icon="Search" @click="handleQuery">查询</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-row :gutter="20" style="margin-top: 20px;">
      <el-col :lg="12" :sm="24">
        <el-card>
          <template #header>患者年龄分布</template>
          <BaseChart :option="ageDistributionOption" />
        </el-card>
      </el-col>

      <el-col :lg="12" :sm="24">
        <el-card>
          <template #header>记录类型统计</template>
          <BaseChart :option="recordTypeOption" />
        </el-card>
      </el-col>
    </el-row>

    <el-row style="margin-top: 20px;">
      <el-col :span="24">
        <el-card>
          <template #header>每日新增记录趋势</template>
          <BaseChart :option="dailyTrendOption" />
        </el-card>
      </el-col>
    </el-row>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import BaseChart from '@/components/BaseChart.vue'; // 引入我们刚创建的组件
// import { getAgeDistribution, getRecordTypeStats, getDailyTrend } from '@/api/statistics';

// --- 响应式数据 ---
const dateRange = ref([]); // 日期范围筛选

// 各个图表的 ECharts 配置项
const ageDistributionOption = ref({});
const recordTypeOption = ref({});
const dailyTrendOption = ref({});

// --- 方法 ---

// 获取所有图表数据
const getAllChartsData = () => {
  // 模拟从API获取数据
  // 1. 获取年龄分布数据
  const ageData = {
    categories: ['0-18岁', '19-35岁', '36-50岁', '51-65岁', '65岁以上'],
    values: [15, 45, 80, 62, 35]
  };
  ageDistributionOption.value = {
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    xAxis: { type: 'category', data: ageData.categories },
    yAxis: { type: 'value' },
    series: [{ data: ageData.values, type: 'bar' }]
  };

  // 2. 获取记录类型数据
  const recordTypeData = [
    { value: 125, name: '体检报告' },
    { value: 98, name: '电子病历' },
    { value: 45, name: '化验单' },
    { value: 30, name: '其他' }
  ];
  recordTypeOption.value = {
    tooltip: { trigger: 'item' },
    legend: { top: '5%', left: 'center' },
    series: [{
      name: '记录类型',
      type: 'pie',
      radius: ['40%', '70%'],
      avoidLabelOverlap: false,
      itemStyle: { borderRadius: 10, borderColor: '#fff', borderWidth: 2 },
      label: { show: false, position: 'center' },
      emphasis: { label: { show: true, fontSize: '20', fontWeight: 'bold' } },
      data: recordTypeData
    }]
  };

  // 3. 获取每日新增趋势数据
  const trendData = {
    dates: ['2025-09-09', '2025-09-10', '2025-09-11', '2025-09-12', '2025-09-13', '2025-09-14', '2025-09-15'],
    counts: [10, 15, 8, 20, 18, 25, 22]
  };
  dailyTrendOption.value = {
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: trendData.dates, boundaryGap: false, },
    yAxis: { type: 'value' },
    series: [{ data: trendData.counts, type: 'line', areaStyle: {} }]
  };
};

// 查询按钮点击事件
const handleQuery = () => {
  console.log("根据时间范围查询:", dateRange.value);
  // 在这里你可以调用 API，并传入 dateRange.value 作为参数
  // 然后更新上面的 option ref
  getAllChartsData();
};

onMounted(() => {
  // 页面加载时，获取一次初始数据
  getAllChartsData();
});
</script>

<style scoped>
.app-container {
  padding: 20px;
}
.filter-card {
  margin-bottom: 20px;
}
</style>
