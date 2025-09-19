<template>
  <PageContainer title="统计分析">
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-title">总记录数</div>
          <div class="stat-value">{{ descriptiveStats.totalRecords }}</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-title">平均身高 (cm)</div>
          <div class="stat-value">{{ descriptiveStats.averageHeight }}</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-title">平均体重 (kg)</div>
          <div class="stat-value">{{ descriptiveStats.averageWeight }}</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-title">身高-体重相关性</div>
          <div class="stat-value small">{{ correlationData.interpretation }}</div>
          <div class="stat-sub-value">系数: {{ correlationData.correlationCoefficient }}</div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top: 20px;">
      <el-col :span="12">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">按类型分组对比</div>
          </template>
          <BaseChart :option="groupedBarOption" height="400px"/>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">月度平均体重趋势</div>
          </template>
          <BaseChart :option="trendLineOption" height="400px"/>
        </el-card>
      </el-col>
    </el-row>
  </PageContainer>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import PageContainer from '@/components/PageContainer.vue';
import BaseChart from '@/components/BaseChart.vue';
import {
  getPatientRecordStatistics,
  getGroupedStatistics,
  getCorrelation,
  getWeightTrendByMonth
} from '@/api/statistics.js';

// 存储描述性统计数据
const descriptiveStats = reactive({
  totalRecords: 0,
  averageHeight: 0,
  medianHeight: 0,
  stdDevHeight: 0,
  averageWeight: 0,
  medianWeight: 0,
  stdDevWeight: 0,
});

// 存储相关性分析数据
const correlationData = reactive({
  correlationCoefficient: 0,
  interpretation: '加载中...'
});

// ECharts 图表配置
const groupedBarOption = ref({});
const trendLineOption = ref({});

// 获取所有统计数据
const fetchAllStatistics = async () => {
  try {
    const [statsRes, groupedRes, correlationRes, trendRes] = await Promise.all([
      getPatientRecordStatistics(),
      getGroupedStatistics(),
      getCorrelation(),
      getWeightTrendByMonth()
    ]);

    // 1. 处理描述性统计
    Object.assign(descriptiveStats, statsRes.data);

    // 2. 处理相关性分析
    Object.assign(correlationData, correlationRes.data);

    // 3. 处理分组对比数据并生成柱状图配置
    const groupedData = groupedRes.data;
    groupedBarOption.value = {
      tooltip: { trigger: 'axis' },
      legend: { data: ['平均身高(cm)', '平均体重(kg)'], textStyle: { color: '#ccc' } },
      xAxis: {
        type: 'category',
        data: groupedData.map(item => item.groupKey),
        axisLabel: { color: '#ccc' }
      },
      yAxis: { type: 'value', axisLabel: { color: '#ccc' } },
      series: [
        { name: '平均身高(cm)', type: 'bar', data: groupedData.map(item => item.averageHeight) },
        { name: '平均体重(kg)', type: 'bar', data: groupedData.map(item => item.averageWeight) }
      ]
    };

    // 4. 处理趋势数据并生成折线图配置
    const trendData = trendRes.data.dataPoints;
    trendLineOption.value = {
      tooltip: { trigger: 'axis' },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: trendData.map(item => item.timePeriod),
        axisLabel: { color: '#ccc' }
      },
      yAxis: { type: 'value', axisLabel: { color: '#ccc' } },
      series: [{
        name: '平均体重(kg)',
        type: 'line',
        smooth: true,
        data: trendData.map(item => item.value),
        areaStyle: {},
        itemStyle: { color: '#5470C6' }
      }]
    };

  } catch (error) {
    console.error("获取统计数据失败:", error);
  }
};

onMounted(fetchAllStatistics);
</script>

<style scoped lang="scss">
.stat-card {
  background-color: #161b22;
  border: 1px solid #30363d;
  color: #c9d1d9;

  .stat-title {
    font-size: 1rem;
    color: #8b949e;
    margin-bottom: 10px;
  }
  .stat-value {
    font-size: 2rem;
    font-weight: bold;
    color: #f0f0f0;

    &.small {
      font-size: 1.2rem;
    }
  }
  .stat-sub-value {
    font-size: 0.9rem;
    color: #8b949e;
    margin-top: 5px;
  }
}

.chart-card {
  background-color: #161b22;
  border: 1px solid #30363d;

  :deep(.el-card__header) {
    border-bottom: 1px solid #30363d;
  }

  .card-header {
    color: #f0f0f0;
    font-weight: bold;
  }
}
</style>
