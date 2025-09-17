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
