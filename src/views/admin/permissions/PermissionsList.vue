<script setup>
import { onMounted, ref } from 'vue'
import { Refresh } from '@element-plus/icons-vue'
import { apiPermissionList } from '~/api/permissions'

const loading = ref(false)
const tableData = ref([])

const fetchList = async () => {
  loading.value = true
  try {
    tableData.value = (await apiPermissionList()) || []
  } finally {
    loading.value = false
  }
}

onMounted(fetchList)
</script>

<template>
  <el-card shadow="never">
    <template #header>
      <div class="page-header">
        <span>权限点列表</span>
        <el-button :icon="Refresh" @click="fetchList">刷新</el-button>
      </div>
    </template>

    <el-table v-loading="loading" :data="tableData" stripe style="width: 100%">
      <el-table-column prop="permCode" label="权限编码" min-width="220" />
      <el-table-column prop="permName" label="权限名称" min-width="240" />
      <el-table-column prop="createdAt" label="创建时间" min-width="180">
        <template #default="{ row }">{{ row.createdAt ? String(row.createdAt).replace('T', ' ') : '-' }}</template>
      </el-table-column>
      <el-table-column prop="updatedAt" label="更新时间" min-width="180">
        <template #default="{ row }">{{ row.updatedAt ? String(row.updatedAt).replace('T', ' ') : '-' }}</template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<style scoped>
.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
