<template>
  <div ref="chartRef" :style="{ height: height, width: width }"></div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import * as echarts from 'echarts';

const props = defineProps({
  option: {
    type: Object,
    required: true,
    default: () => ({})
  },
  width: {
    type: String,
    default: '100%'
  },
  height: {
    type: String,
    default: '400px'
  }
});

const chartRef = ref(null);
let chartInstance = null;

// 初始化图表
const initChart = () => {
  if (chartRef.value) {
    chartInstance = echarts.init(chartRef.value);
    chartInstance.setOption(props.option);
  }
};

// 销毁图表实例
const disposeChart = () => {
  if(chartInstance) {
    chartInstance.dispose();
    chartInstance = null;
  }
}

// 监听 option 变化，并更新图表
watch(() => props.option, (newOption) => {
  if (chartInstance) {
    chartInstance.setOption(newOption);
  }
}, { deep: true });

// 监听窗口大小变化，使图表自适应
const handleResize = () => {
  chartInstance?.resize();
}

onMounted(() => {
  initChart();
  window.addEventListener('resize', handleResize);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize);
  disposeChart();
});
</script>
