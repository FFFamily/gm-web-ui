<script setup>
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Refresh } from '@element-plus/icons-vue'
import { apiRoleDelete, apiRoleList } from '~/api/roles'

const router = useRouter()

const loading = ref(false)
const tableData = ref([])
const total = ref(0)

const query = reactive({
  page: 1,
  size: 50
})

const fetchList = async () => {
  loading.value = true
  try {
    const data = await apiRoleList({ page: query.page, size: query.size })
    tableData.value = data?.records || []
    total.value = Number(data?.total || 0)
  } finally {
    loading.value = false
  }
}

const goCreate = () => router.push('/admin/roles/new')
const goDetail = (row) => router.push(`/admin/roles/${row.id}`)
const goEdit = (row) => router.push(`/admin/roles/${row.id}/edit`)

const onDelete = async (row) => {
  if (row.roleCode === 'ADMIN') return
  await ElMessageBox.confirm(`确定删除角色「${row.roleName} (${row.roleCode})」？`, '删除确认', {
    type: 'warning',
    confirmButtonText: '删除',
    cancelButtonText: '取消'
  })
  await apiRoleDelete(row.id)
  ElMessage.success('删除成功')
  await fetchList()
}

const formatLdt = (s) => (s ? String(s).replace('T', ' ') : '-')

onMounted(fetchList)
</script>

<template>
  <el-card shadow="never">
    <template #header>
      <div class="page-header">
        <span>角色列表</span>
        <div class="header-actions">
          <el-button :icon="Refresh" @click="fetchList">刷新</el-button>
          <el-button v-perm="'role:create'" type="primary" @click="goCreate">新增角色</el-button>
        </div>
      </div>
    </template>

    <el-table v-loading="loading" :data="tableData" stripe style="width: 100%">
      <el-table-column prop="id" label="ID" width="90" />
      <el-table-column prop="roleCode" label="角色编码" min-width="180" />
      <el-table-column prop="roleName" label="角色名称" min-width="200" />
      <el-table-column label="创建时间" min-width="180">
        <template #default="{ row }">{{ formatLdt(row.createdAt) }}</template>
      </el-table-column>
      <el-table-column label="更新时间" min-width="180">
        <template #default="{ row }">{{ formatLdt(row.updatedAt) }}</template>
      </el-table-column>

      <el-table-column label="操作" fixed="right" width="240">
        <template #default="{ row }">
          <el-button v-perm="'role:read'" size="small" @click="goDetail(row)">详情</el-button>
          <el-button v-perm="'role:update'" size="small" @click="goEdit(row)">编辑</el-button>
          <el-button
            v-perm="'role:delete'"
            size="small"
            type="danger"
            :disabled="row.roleCode === 'ADMIN'"
            @click="onDelete(row)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pager">
      <el-pagination
        v-model:current-page="query.page"
        v-model:page-size="query.size"
        background
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        :page-sizes="[20, 50, 100, 200]"
        @current-change="fetchList"
        @size-change="
          () => {
            query.page = 1
            fetchList()
          }
        "
      />
    </div>
  </el-card>
</template>

<style scoped>
.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.header-actions {
  display: flex;
  gap: 8px;
}
.pager {
  display: flex;
  justify-content: flex-end;
  margin-top: 12px;
}
</style>
