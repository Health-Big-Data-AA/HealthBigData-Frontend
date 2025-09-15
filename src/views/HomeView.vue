<template>
  <div class="dashboard-container">
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card shadow="hover" class="data-card">
          <div class="card-content">
            <div class="card-icon" style="background-color: #409EFF;">
              <el-icon><User /></el-icon>
            </div>
            <div class="card-text">
              <div class="card-num">{{ overviewData.users }}</div>
              <div>总用户数</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="data-card">
          <div class="card-content">
            <div class="card-icon" style="background-color: #67C23A;">
              <el-icon><Document /></el-icon>
            </div>
            <div class="card-text">
              <div class="card-num">{{ overviewData.reports }}</div>
              <div>分析报告数</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="data-card">
          <div class="card-content">
            <div class="card-icon" style="background-color: #E6A23C;">
              <el-icon><DataLine /></el-icon>
            </div>
            <div class="card-text">
              <div class="card-num">{{ overviewData.dataSize }}</div>
              <div>总数据量 (GB)</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="data-card">
          <div class="card-content">
            <div class="card-icon" style="background-color: #F56C6C;">
              <el-icon><WarnTriangleFilled /></el-icon>
            </div>
            <div class="card-text">
              <div class="card-num">{{ overviewData.alerts }}</div>
              <div>系统警报</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top: 20px;">
      <el-col :span="12">
        <el-card shadow="hover">
          <template #header>
            <div>用户增长趋势</div>
          </template>
          <div ref="barChart" style="height: 400px;"></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="hover">
          <template #header>
            <div>数据类型分布</div>
          </template>
          <div ref="pieChart" style="height: 400px;"></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue';
import * as echarts from 'echarts';
import { User, Document, DataLine, WarnTriangleFilled } from '@element-plus/icons-vue'

// 图表DOM元素的引用
const barChart = ref<HTMLElement>();
const pieChart = ref<HTMLElement>();

// 模拟的概览数据
const overviewData = reactive({
  users: 1024,
  reports: 256,
  dataSize: 512,
  alerts: 3
});

// onMounted 生命周期钩子，确保DOM渲染完毕后再初始化图表
onMounted(() => {
  initBarChart();
  initPieChart();
});

// 初始化柱状图
const initBarChart = () => {
  const myChart = echarts.init(barChart.value!);
  const option = {
    tooltip: {
      trigger: 'axis'
    },
    xAxis: {
      type: 'category',
      data: ['一月', '二月', '三月', '四月', '五月', '六月']
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: '新增用户',
        data: [120, 200, 150, 80, 70, 110],
        type: 'bar'
      }
    ]
  };
  myChart.setOption(option);
};

// 初始化饼图
const initPieChart = () => {
  const myChart = echarts.init(pieChart.value!);
  const option = {
    tooltip: {
      trigger: 'item'
    },
    legend: {
      orient: 'vertical',
      left: 'left'
    },
    series: [
      {
        name: '数据来源',
        type: 'pie',
        radius: '50%',
        data: [
          { value: 1048, name: '电子病历' },
          { value: 735, name: '体检数据' },
          { value: 580, name: '穿戴设备' },
          { value: 484, name: '科研数据' },
          { value: 300, name: '其他' }
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  };
  myChart.setOption(option);
};

</script>

<style scoped>
.dashboard-container {
  padding: 20px;
}
.data-card {
  color: #606266;
}
.card-content {
  display: flex;
  align-items: center;
}
.card-icon {
  font-size: 3rem;
  color: #fff;
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20px;
  border-radius: 4px;
}
.card-text {
  font-size: 1rem;
}
.card-num {
  font-size: 2rem;
  font-weight: bold;
}
</style>
