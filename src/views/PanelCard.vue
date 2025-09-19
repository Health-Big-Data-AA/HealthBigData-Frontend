<template>
  <el-card shadow="hover" @click="handleClick" class="panel-card">
    <div class="card-panel">
      <div class="card-panel-icon-wrapper">
        <el-icon :class="iconColor"><component :is="statistic.icon" /></el-icon>
      </div>
      <div class="card-panel-description">
        <div class="card-panel-text">{{ statistic.text }}</div>
        <el-statistic :value="statistic.value" />
      </div>
    </div>
  </el-card>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  statistic: {
    type: Object,
    required: true,
    default: () => ({ text: '', value: 0, icon: null })
  },
  onClick: {
    type: Function,
    default: () => {}
  }
});

const handleClick = () => {
  props.onClick();
};

// This is a simple way to give different icons different colors
const iconColor = computed(() => {
  const text = props.statistic.text;
  if (text.includes('用户')) return 'icon-user';
  if (text.includes('数据')) return 'icon-data';
  if (text.includes('新增')) return 'icon-today';
  if (text.includes('日志')) return 'icon-audit';
  return '';
});
</script>

<style lang="scss" scoped>
.panel-card {
  cursor: pointer;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  background-color: transparent !important; // Match grid background
  border: none !important;
}

.el-card__body {
  flex-grow: 1;
  padding: 10px !important; // Reduce padding
}

.card-panel {
  height: 100%;
  font-size: 12px;
  position: relative;
  overflow: hidden;
  color: #c9d1d9;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .card-panel-icon-wrapper {
    padding: 12px; // Adjust padding
    transition: all 0.38s ease-out;
    border-radius: 6px;

    .el-icon {
      font-size: 40px; // Adjust icon size
    }
  }

  .icon-user { color: #40c9c6; }
  .icon-data { color: #36a3f7; }
  .icon-today { color: #f4516c; }
  .icon-audit { color: #34bfa3; }

  &:hover {
    .card-panel-icon-wrapper {
      transform: scale(1.1);
    }
  }

  .card-panel-description {
    font-weight: bold;
    margin: 0 10px; // Adjust margin
    text-align: right;

    .card-panel-text {
      line-height: 16px;
      color: #8b949e;
      font-size: 14px; // Adjust font size
      margin-bottom: 8px;
    }

    .el-statistic {
      --el-statistic-content-font-size: 18px; // Adjust font size
      --el-statistic-content-color: #f0f0f0;
    }
  }
}
</style>
