<template>
  <div class="dashboard-container">
    <div class="toolbar">
      <el-button @click="isEditing = !isEditing">{{ isEditing ? '完成' : '编辑布局' }}</el-button>
      <el-button v-if="isEditing" @click="saveLayout">保存布局</el-button>
    </div>

    <grid-layout
        v-model:layout="layout"
        :col-num="12"
        :row-height="30"
        :is-draggable="isEditing"
        :is-resizable="isEditing"
        :vertical-compact="true"
        :use-css-transforms="true"
    >
      <grid-item v-for="item in layout"
                 :x="item.x"
                 :y="item.y"
                 :w="item.w"
                 :h="item.h"
                 :i="item.i"
                 :key="item.i"
                 @resized="resizedEvent"
                 class="grid-item-container"
      >
        <div class="card-header" v-if="item.i.startsWith('chart-')">{{ getChartHeader(item.i) }}</div>
        <component
            :is="getComponent(item.i)"
            v-bind="getComponentProps(item.i)"
            :ref="el => setComponentRef(el, item.i)"
            class="dashboard-component"
        />
      </grid-item>
    </grid-layout>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive, markRaw, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import { User, Files, CirclePlus, Finished } from '@element-plus/icons-vue';
import { GridLayout, GridItem } from 'vue3-grid-layout';
import { ElMessage } from 'element-plus';
import BaseChart from '@/components/BaseChart.vue';
import { getDashboardSummary } from '@/api/dashboard.js';
import PanelCard from '@/views/PanelCard.vue';

const isEditing = ref(false);
const router = useRouter();
const layout = ref([]);
const componentRefs = reactive({});

const panelData = reactive({
  totalUsers: { value: 0, text: '总用户数', icon: User, path: '/users' },
  totalRecords: { value: 0, text: '总数据条目', icon: Files, path: '/data' },
  todayNewRecords: { value: 0, text: '今日新增', icon: CirclePlus, path: '/data' },
  pendingLogs: { value: 0, text: '待审核日志', icon: Finished, path: '/logs' },
});

const dailyTrendOption = ref({});
const pieChartOption = ref({});

const components = {
  PanelCard: markRaw(PanelCard),
  BaseChart: markRaw(BaseChart)
};

const getComponent = (id) => {
  if (id.startsWith('panel-')) return components.PanelCard;
  if (id.startsWith('chart-')) return components.BaseChart;
};

const getChartHeader = (id) => {
  if (id === 'chart-trend') return '近7日数据新增趋势';
  if (id === 'chart-pie') return '记录类型分布';
  return '';
};

const getComponentProps = (id) => {
  if (id.startsWith('panel-')) {
    const key = id.replace('panel-', '');
    return {
      statistic: panelData[key],
      onClick: () => goTo(panelData[key].path)
    };
  }
  if (id === 'chart-trend') {
    return { option: dailyTrendOption.value, height: '100%' };
  }
  if (id === 'chart-pie') {
    return { option: pieChartOption.value, height: '100%', onChartClick: handlePieChartClick };
  }
  return {};
};

const setComponentRef = (el, key) => {
  if (el) {
    componentRefs[key] = el;
  }
};

const goTo = (path) => {
  if (!isEditing.value) router.push(path);
};

const handlePieChartClick = (params) => {
  if (!isEditing.value && params && params.name) {
    router.push({ path: '/data', query: { recordType: params.name } });
  }
};

const saveLayout = () => {
  localStorage.setItem('dashboard-layout', JSON.stringify(layout.value));
  isEditing.value = false;
  ElMessage.success('布局已保存！');
};

const loadLayout = () => {
  const savedLayout = localStorage.getItem('dashboard-layout');
  if (savedLayout) {
    layout.value = JSON.parse(savedLayout);
  } else {
    layout.value = [
      { x: 0, y: 0, w: 3, h: 4, i: 'panel-totalUsers' },
      { x: 3, y: 0, w: 3, h: 4, i: 'panel-totalRecords' },
      { x: 6, y: 0, w: 3, h: 4, i: 'panel-todayNewRecords' },
      { x: 9, y: 0, w: 3, h: 4, i: 'panel-pendingLogs' },
      { x: 0, y: 4, w: 8, h: 11, i: 'chart-trend' },
      { x: 8, y: 4, w: 4, h: 11, i: 'chart-pie' },
    ];
  }
};

const fetchData = async () => {
  try {
    const response = await getDashboardSummary();
    const data = response.data;

    panelData.totalUsers.value = data.panelData.totalUsers;
    panelData.totalRecords.value = data.panelData.totalRecords;
    panelData.todayNewRecords.value = data.panelData.todayNewRecords;
    panelData.pendingLogs.value = data.panelData.pendingLogs;

    dailyTrendOption.value = {
      tooltip: { trigger: 'axis' },
      xAxis: { type: 'category', data: data.trendData.dates, boundaryGap: false, axisLabel: { color: '#ccc' } },
      yAxis: { type: 'value', axisLabel: { color: '#ccc' } },
      grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
      series: [{
        name: '新增数量', data: data.trendData.counts, type: 'line', smooth: true,
        areaStyle: {
          color: {
            type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [{ offset: 0, color: 'rgba(58,132,255,0.5)' }, { offset: 1, color: 'rgba(58,132,255,0.1)' }]
          }
        }
      }]
    };

    const pieData = Object.entries(data.recordTypeDistribution).map(([name, value]) => ({ name, value }));
    pieChartOption.value = {
      tooltip: { trigger: 'item', formatter: '{a} <br/>{b}: {c} ({d}%)' },
      legend: { orient: 'vertical', left: 10, data: pieData.map(item => item.name), textStyle: { color: '#ccc' } },
      series: [{
        name: '记录类型', type: 'pie', radius: ['50%', '70%'], avoidLabelOverlap: false,
        label: { show: false, position: 'center' },
        emphasis: { label: { show: true, fontSize: '16', fontWeight: 'bold' } },
        labelLine: { show: false },
        data: pieData
      }]
    };

    await nextTick();
    resizedEvent('chart-trend');
    resizedEvent('chart-pie');

  } catch (error) {
    console.error("获取仪表盘数据失败:", error);
  }
};

const resizedEvent = (i) => {
  const chartRef = componentRefs[i];
  if (chartRef && typeof chartRef.resize === 'function') {
    chartRef.resize();
  }
};

onMounted(() => {
  loadLayout();
  fetchData();
});
</script>

<style lang="scss" scoped>
.dashboard-container {
  padding: 20px;
}
.toolbar {
  margin-bottom: 20px;
}
.grid-item-container {
  background-color: #161b22;
  border: 1px solid #30363d;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding: 10px;
}
.card-header {
  color: #f0f0f0;
  font-weight: bold;
  margin-bottom: 10px;
  padding-bottom: 10px;
  border-bottom: 1px solid #30363d;
}
.dashboard-component {
  flex-grow: 1;
  min-height: 0; /* Important for flex-grow to work correctly */
}
:deep(.vue-grid-item.vue-grid-placeholder) {
    background: #4a5568 !important;
}
</style>
