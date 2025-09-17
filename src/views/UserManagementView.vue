<template>
  <el-card>
    <template #header>
      <h1>部门管理 (数据来自后端)</h1>
    </template>

    <el-table :data="departmentList" v-loading="loading" stripe style="width: 100%">
      <el-table-column prop="deptId" label="部门ID" width="180" />
      <el-table-column prop="deptName" label="部门名称" width="180" />
      <el-table-column prop="location" label="位置" />
    </el-table>

  </el-card>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import api from '@/router/request';

// 定义部门数据的接口类型
interface Department {
  deptId: number;
  deptName: string;
  location: string;
}

const departmentList = ref<Department[]>([]);
const loading = ref(true);

// 获取所有部门数据的函数
// @ts-ignore
const fetchAllDepartments = async () => {
  loading.value = true;
  try {
    // 从 /departments/getAllDepartment 接口获取数据
    const response = await api.get('/api/departments/getAllDepartment');
    departmentList.value = response;
  } catch (error) {
    console.error("获取部门列表失败:", error);
  } finally {
    loading.value = false;
  }
};

// 在组件挂载后执行数据获取
onMounted(() => {
  fetchAllDepartments();
});
</script>

<style scoped>
/* 您可以在这里添加一些样式 */
</style>