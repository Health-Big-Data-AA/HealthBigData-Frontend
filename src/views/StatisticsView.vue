<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="8">
        <el-card>
          <template #header>描述性统计 (身高)</template>
          <el-descriptions :column="1" border>
            <el-descriptions-item label="平均值">{{ stats.averageHeight }} cm</el-descriptions-item>
            <el-descriptions-item label="中位数">{{ stats.medianHeight }} cm</el-descriptions-item>
            <el-descriptions-item label="标准差">{{ stats.stdDevHeight }}</el-descriptions-item>
          </el-descriptions>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card>
          <template #header>描述性统计 (体重)</template>
          <el-descriptions :column="1" border>
            <el-descriptions-item label="平均值">{{ stats.averageWeight }} kg</el-descriptions-item>
            <el-descriptions-item label="中位数">{{ stats.medianWeight }} kg</el-descriptions-item>
            <el-descriptions-item label="标准差">{{ stats.stdDevWeight }}</el-descriptions-item>
          </el-descriptions>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card>
          <template #header>相关性分析 (身高/体重)</template>
          <el-descriptions :column="1" border>
            <el-descriptions-item label="相关系数">{{ correlation.correlationCoefficient }}</el-descriptions-item>
            <el-descriptions-item label="解释">{{ correlation.interpretation }}</el-descriptions-item>
          </el-descriptions>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top: 20px;">
      <el-col :lg="12" :sm="24">
        <el-card>
          <template #header>分组对比统计 (平均身高)</template>
          <BaseChart :option="groupedHeightOption" />
        </el-card>
      </el-col>
      <el-col :lg="12" :sm="24">
        <el-card>
          <template #header>月度平均体重趋势</template>
          <BaseChart :option="trendOption" />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue';
import BaseChart from '@/components/BaseChart.vue';
import { getStatistics, getGroupedStatistics, getCorrelation, getTrend } from '@/api/statistics';

const stats = ref({});
const correlation = ref({});
const groupedHeightOption = ref({});
const trendOption = ref({});

const fetchData = async () => {
  try {
    const statsRes = await getStatistics();
    stats.value = statsRes.data;

    const corrRes = await getCorrelation();
    correlation.value = corrRes.data;

    const groupedRes = await getGroupedStatistics();
    const groupedData = groupedRes.data;
    groupedHeightOption.value = {
      tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
      xAxis: { type: 'category', data: groupedData.map(item => item.groupKey) },
      yAxis: { type: 'value', name: '平均身高 (cm)' },
      series: [{ data: groupedData.map(item => item.averageHeight), type: 'bar' }]
    };

    const trendRes = await getTrend();
    const trendData = trendRes.data.dataPoints;
    trendOption.value = {
      tooltip: { trigger: 'axis' },
      xAxis: { type: 'category', data: trendData.map(item => item.timePeriod), boundaryGap: false },
      yAxis: { type: 'value', name: '平均体重 (kg)' },
      series: [{
        name: '体重',
        data: trendData.map(item => item.value),
        type: 'line',
        smooth: true,
        areaStyle: {}
      }]
    };
  } catch (error) {
    console.error("获取统计数据失败:", error);
  }
};

onMounted(() => {
  fetchData();
});
</script>

<style scoped>
.app-container {
  padding: 20px;
}
.el-descriptions {
  margin-top: 20px;
}
</style>
