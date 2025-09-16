<!--<template>-->
<!--  <div class="dashboard-container">-->
<!--    <el-row :gutter="20">-->
<!--      <el-col :span="6">-->
<!--        <el-card shadow="hover" class="data-card">-->
<!--          <div class="card-content">-->
<!--            <div class="card-icon" style="background-color: #409EFF;">-->
<!--              <el-icon><User /></el-icon>-->
<!--            </div>-->
<!--            <div class="card-text">-->
<!--              <div class="card-num">{{ overviewData.users }}</div>-->
<!--              <div>总用户数</div>-->
<!--            </div>-->
<!--          </div>-->
<!--        </el-card>-->
<!--      </el-col>-->
<!--      <el-col :span="6">-->
<!--        <el-card shadow="hover" class="data-card">-->
<!--          <div class="card-content">-->
<!--            <div class="card-icon" style="background-color: #67C23A;">-->
<!--              <el-icon><Document /></el-icon>-->
<!--            </div>-->
<!--            <div class="card-text">-->
<!--              <div class="card-num">{{ overviewData.reports }}</div>-->
<!--              <div>分析报告数</div>-->
<!--            </div>-->
<!--          </div>-->
<!--        </el-card>-->
<!--      </el-col>-->
<!--      <el-col :span="6">-->
<!--        <el-card shadow="hover" class="data-card">-->
<!--          <div class="card-content">-->
<!--            <div class="card-icon" style="background-color: #E6A23C;">-->
<!--              <el-icon><DataLine /></el-icon>-->
<!--            </div>-->
<!--            <div class="card-text">-->
<!--              <div class="card-num">{{ overviewData.dataSize }}</div>-->
<!--              <div>总数据量 (GB)</div>-->
<!--            </div>-->
<!--          </div>-->
<!--        </el-card>-->
<!--      </el-col>-->
<!--      <el-col :span="6">-->
<!--        <el-card shadow="hover" class="data-card">-->
<!--          <div class="card-content">-->
<!--            <div class="card-icon" style="background-color: #F56C6C;">-->
<!--              <el-icon><WarnTriangleFilled /></el-icon>-->
<!--            </div>-->
<!--            <div class="card-text">-->
<!--              <div class="card-num">{{ overviewData.alerts }}</div>-->
<!--              <div>系统警报</div>-->
<!--            </div>-->
<!--          </div>-->
<!--        </el-card>-->
<!--      </el-col>-->
<!--    </el-row>-->

<!--    <el-row :gutter="20" style="margin-top: 20px;">-->
<!--      <el-col :span="12">-->
<!--        <el-card shadow="hover">-->
<!--          <template #header>-->
<!--            <div>用户增长趋势</div>-->
<!--          </template>-->
<!--          <div ref="barChart" style="height: 400px;"></div>-->
<!--        </el-card>-->
<!--      </el-col>-->
<!--      <el-col :span="12">-->
<!--        <el-card shadow="hover">-->
<!--          <template #header>-->
<!--            <div>数据类型分布</div>-->
<!--          </template>-->
<!--          <div ref="pieChart" style="height: 400px;"></div>-->
<!--        </el-card>-->
<!--      </el-col>-->
<!--    </el-row>-->
<!--  </div>-->
<!--</template>-->

<!--<script setup lang="ts">-->
<!--import { ref, onMounted, reactive } from 'vue';-->
<!--import * as echarts from 'echarts';-->
<!--import { User, Document, DataLine, WarnTriangleFilled } from '@element-plus/icons-vue'-->

<!--// 图表DOM元素的引用-->
<!--const barChart = ref<HTMLElement>();-->
<!--const pieChart = ref<HTMLElement>();-->

<!--// 模拟的概览数据-->
<!--const overviewData = reactive({-->
<!--  users: 1024,-->
<!--  reports: 256,-->
<!--  dataSize: 512,-->
<!--  alerts: 3-->
<!--});-->

<!--// onMounted 生命周期钩子，确保DOM渲染完毕后再初始化图表-->
<!--onMounted(() => {-->
<!--  initBarChart();-->
<!--  initPieChart();-->
<!--});-->

<!--// 初始化柱状图-->
<!--const initBarChart = () => {-->
<!--  const myChart = echarts.init(barChart.value!);-->
<!--  const option = {-->
<!--    tooltip: {-->
<!--      trigger: 'axis'-->
<!--    },-->
<!--    xAxis: {-->
<!--      type: 'category',-->
<!--      data: ['一月', '二月', '三月', '四月', '五月', '六月']-->
<!--    },-->
<!--    yAxis: {-->
<!--      type: 'value'-->
<!--    },-->
<!--    series: [-->
<!--      {-->
<!--        name: '新增用户',-->
<!--        data: [120, 200, 150, 80, 70, 110],-->
<!--        type: 'bar'-->
<!--      }-->
<!--    ]-->
<!--  };-->
<!--  myChart.setOption(option);-->
<!--};-->

<!--// 初始化饼图-->
<!--const initPieChart = () => {-->
<!--  const myChart = echarts.init(pieChart.value!);-->
<!--  const option = {-->
<!--    tooltip: {-->
<!--      trigger: 'item'-->
<!--    },-->
<!--    legend: {-->
<!--      orient: 'vertical',-->
<!--      left: 'left'-->
<!--    },-->
<!--    series: [-->
<!--      {-->
<!--        name: '数据来源',-->
<!--        type: 'pie',-->
<!--        radius: '50%',-->
<!--        data: [-->
<!--          { value: 1048, name: '电子病历' },-->
<!--          { value: 735, name: '体检数据' },-->
<!--          { value: 580, name: '穿戴设备' },-->
<!--          { value: 484, name: '科研数据' },-->
<!--          { value: 300, name: '其他' }-->
<!--        ],-->
<!--        emphasis: {-->
<!--          itemStyle: {-->
<!--            shadowBlur: 10,-->
<!--            shadowOffsetX: 0,-->
<!--            shadowColor: 'rgba(0, 0, 0, 0.5)'-->
<!--          }-->
<!--        }-->
<!--      }-->
<!--    ]-->
<!--  };-->
<!--  myChart.setOption(option);-->
<!--};-->

<!--</script>-->

<!--<style scoped>-->
<!--.dashboard-container {-->
<!--  padding: 20px;-->
<!--}-->
<!--.data-card {-->
<!--  color: #606266;-->
<!--}-->
<!--.card-content {-->
<!--  display: flex;-->
<!--  align-items: center;-->
<!--}-->
<!--.card-icon {-->
<!--  font-size: 3rem;-->
<!--  color: #fff;-->
<!--  width: 80px;-->
<!--  height: 80px;-->
<!--  display: flex;-->
<!--  align-items: center;-->
<!--  justify-content: center;-->
<!--  margin-right: 20px;-->
<!--  border-radius: 4px;-->
<!--}-->
<!--.card-text {-->
<!--  font-size: 1rem;-->
<!--}-->
<!--.card-num {-->
<!--  font-size: 2rem;-->
<!--  font-weight: bold;-->
<!--}-->
<!--</style>-->

<!--*******************************************-->
<!--*******************************************-->
<!--*******************************************-->
<!--*******************************************-->
<template>
  <div class="dashboard-container">
    <el-row :gutter="20" class="panel-group">
      <el-col :lg="6" :sm="12" class="card-panel-col">
        <el-card shadow="hover">
          <div class="card-panel">
            <div class="card-panel-icon-wrapper icon-user">
              <el-icon><User /></el-icon>
            </div>
            <div class="card-panel-description">
              <div class="card-panel-text">总用户数</div>
              <el-statistic :value="panelData.totalUsers" />
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :lg="6" :sm="12" class="card-panel-col">
        <el-card shadow="hover">
          <div class="card-panel">
            <div class="card-panel-icon-wrapper icon-data">
              <el-icon><Files /></el-icon>
            </div>
            <div class="card-panel-description">
              <div class="card-panel-text">总数据条目</div>
              <el-statistic :value="panelData.totalRecords" />
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :lg="6" :sm="12" class="card-panel-col">
        <el-card shadow="hover">
          <div class="card-panel">
            <div class="card-panel-icon-wrapper icon-today">
              <el-icon><CirclePlus /></el-icon>
            </div>
            <div class="card-panel-description">
              <div class="card-panel-text">今日新增</div>
              <el-statistic :value="panelData.todayNewRecords" />
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :lg="6" :sm="12" class="card-panel-col">
        <el-card shadow="hover">
          <div class="card-panel">
            <div class="card-panel-icon-wrapper icon-audit">
              <el-icon><Finished /></el-icon>
            </div>
            <div class="card-panel-description">
              <div class="card-panel-text">待审核日志</div>
              <el-statistic :value="panelData.pendingLogs" />
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row style="margin-top: 20px;">
      <el-col :span="24">
        <el-card>
          <template #header>近7日数据新增趋势</template>
          <BaseChart :option="dailyTrendOption" height="350px"/>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue';
import { User, Files, CirclePlus, Finished } from '@element-plus/icons-vue';
import BaseChart from '@/components/BaseChart.vue';
// import { getDashboardData } from '@/api/dashboard';

// --- 响应式数据 ---
// 顶部面板数据
const panelData = reactive({
  totalUsers: 0,
  totalRecords: 0,
  todayNewRecords: 0,
  pendingLogs: 0
});

// 趋势图 ECharts 配置
const dailyTrendOption = ref({});

// --- 方法 ---
const fetchData = () => {
  // **API 调用**: getDashboardData().then(response => { ... });
  // 模拟从后端一次性获取所有数据
  setTimeout(() => {
    const mockData = {
      panelData: {
        totalUsers: 128,
        totalRecords: 1530,
        todayNewRecords: 22,
        pendingLogs: 3
      },
      trendData: {
        dates: ['2025-09-10', '2025-09-11', '2025-09-12', '2025-09-13', '2025-09-14', '2025-09-15', '2025-09-16'],
        counts: [15, 8, 20, 18, 25, 22, 19]
      }
    };

    // 更新面板数据
    Object.assign(panelData, mockData.panelData);

    // 更新图表配置
    dailyTrendOption.value = {
      tooltip: { trigger: 'axis' },
      xAxis: { type: 'category', data: mockData.trendData.dates, boundaryGap: false, },
      yAxis: { type: 'value' },
      grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
      series: [{
        name: '新增数量',
        data: mockData.trendData.counts,
        type: 'line',
        smooth: true,
        areaStyle: {
          // 渐变色
          color: {
            type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [{ offset: 0, color: 'rgba(58,132,255,0.5)' }, { offset: 1, color: 'rgba(58,132,255,0.1)' }]
          }
        }
      }]
    };

  }, 300); // 模拟网络延迟
};

onMounted(() => {
  fetchData();
});
</script>

<style lang="scss" scoped>
.dashboard-container {
  padding: 20px;
}
.panel-group {
  .card-panel-col {
    margin-bottom: 20px;
  }
  .card-panel {
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .card-panel-icon-wrapper {
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
      .el-icon {
        font-size: 48px;
      }
    }
    .icon-user {
      color: #40c9c6;
    }
    .icon-data {
      color: #36a3f7;
    }
    .icon-today {
      color: #f4516c;
    }
    .icon-audit {
      color: #34bfa3
    }

    &:hover {
      .card-panel-icon-wrapper {
        transform: scale(1.1);
      }
    }

    .card-panel-description {
      font-weight: bold;
      margin: 0 26px;
      text-align: right;
      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }
      .el-statistic {
        // 覆盖 element-plus 的默认样式
        --el-statistic-content-font-size: 20px;
      }
    }
  }
}
</style>
