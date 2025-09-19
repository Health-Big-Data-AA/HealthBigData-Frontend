<template>
  <div class="dashboard-container">
    <el-row :gutter="20" class="panel-group">
      <el-col :lg="6" :sm="12" class="card-panel-col" @click="goTo('/users')">
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

      <el-col :lg="6" :sm="12" class="card-panel-col" @click="goTo('/data')">
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

      <el-col :lg="6" :sm="12" class="card-panel-col" @click="goTo('/data')">
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

      <el-col :lg="6" :sm="12" class="card-panel-col" @click="goTo('/logs')">
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

    <el-row :gutter="20" style="margin-top: 20px;">
      <el-col :lg="16" :sm="24">
        <el-card>
          <template #header>近7日数据新增趋势</template>
          <BaseChart :option="dailyTrendOption" height="350px"/>
        </el-card>
      </el-col>
      <el-col :lg="8" :sm="24">
        <el-card>
          <template #header>记录类型分布</template>
          <BaseChart :option="pieChartOption" height="350px" @chart-click="handlePieChartClick"/>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue';
import { useRouter } from 'vue-router'; // Import useRouter
import { User, Files, CirclePlus, Finished } from '@element-plus/icons-vue';
import BaseChart from '@/components/BaseChart.vue';
import { getDashboardSummary } from '@/api/dashboard.js';

// --- Router ---
const router = useRouter(); // Initialize router

// --- Reactive Data ---
const panelData = reactive({
  totalUsers: 0,
  totalRecords: 0,
  todayNewRecords: 0,
  pendingLogs: 0
});

const dailyTrendOption = ref({});
const pieChartOption = ref({}); // New: For pie chart

// --- Methods ---
const fetchData = () => {
  getDashboardSummary().then(response => {
    const data = response.data;

    // Update panel data
    Object.assign(panelData, data.panelData);

    // Update trend chart option
    dailyTrendOption.value = {
      tooltip: { trigger: 'axis' },
      xAxis: { type: 'category', data: data.trendData.dates, boundaryGap: false },
      yAxis: { type: 'value' },
      grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
      series: [{
        name: '新增数量',
        data: data.trendData.counts,
        type: 'line',
        smooth: true,
        areaStyle: {
          color: {
            type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [{ offset: 0, color: 'rgba(58,132,255,0.5)' }, {
              offset: 1,
              color: 'rgba(58,132,255,0.1)'
            }]
          }
        }
      }]
    };

    // New: Process and set pie chart option
    const pieData = Object.entries(data.recordTypeDistribution).map(([name, value]) => ({
      name,
      value
    }));

    pieChartOption.value = {
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)'
      },
      legend: {
        orient: 'vertical',
        left: 10,
        data: pieData.map(item => item.name)
      },
      series: [
        {
          name: '记录类型',
          type: 'pie',
          radius: ['50%', '70%'],
          avoidLabelOverlap: false,
          label: {
            show: false,
            position: 'center'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: '20',
              fontWeight: 'bold'
            }
          },
          labelLine: {
            show: false
          },
          data: pieData
        }
      ]
    };

  }).catch(error => {
    console.error("获取仪表盘数据失败:", error);
  });
};

// New: Navigation method
const goTo = (path) => {
  router.push(path);
};

const handlePieChartClick = (params) => {
  if (params && params.name) {
    router.push({
      path: '/data',
      query: { recordType: params.name }
    });
  }
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
    cursor: pointer; /* Add pointer cursor to indicate clickable */
  }

  .card-panel {
    height: 108px;
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
        background: #f2f6fc;
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
        --el-statistic-content-font-size: 20px;
      }
    }
  }
}

// Adjust layout for chart row on smaller screens
.el-row {
  .el-col {
    margin-bottom: 20px;
  }
}

@media (max-width: 768px) {
  .panel-group {
    .card-panel-col {
      width: 50%;
    }
  }

  .el-row .el-col[sm="24"] {
    width: 100%;
  }
}
</style>
