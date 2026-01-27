<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Refresh } from '@element-plus/icons-vue'
import { apiAccountAdminList, apiAccountAdminResetPassword, apiAccountAdminUpdate } from '~/api/accounts'

const loading = ref(false)
const tableData = ref([])
const total = ref(0)

const query = reactive({
  page: 1,
  size: 20,
  keyword: '',
  enabled: '' // '' | 'true' | 'false'
})

const enabledQueryValue = computed(() => {
  if (query.enabled === 'true') return true
  if (query.enabled === 'false') return false
  return undefined
})

const fetchList = async () => {
  loading.value = true
  try {
    const params = {
      page: query.page,
      size: query.size,
      keyword: query.keyword?.trim() || undefined,
      enabled: enabledQueryValue.value
    }
    const data = await apiAccountAdminList(params)
    tableData.value = data?.records || []
    total.value = Number(data?.total || 0)
  } finally {
    loading.value = false
  }
}

const onSearch = async () => {
  query.page = 1
  await fetchList()
}

const onReset = async () => {
  query.keyword = ''
  query.enabled = ''
  query.page = 1
  query.size = 20
  await fetchList()
}

const formatLdt = (s) => (s ? String(s).replace('T', ' ') : '-')

const resetPwdDialog = reactive({
  open: false,
  username: '',
  tempPassword: ''
})

const onResetPassword = async (row) => {
  resetPwdDialog.open = true
  resetPwdDialog.username = row.username
  resetPwdDialog.tempPassword = ''

  try {
    const data = await apiAccountAdminResetPassword(row.id)
    resetPwdDialog.tempPassword = data?.tempPassword || ''
  } catch {
    resetPwdDialog.open = false
  }
}

const copyTempPassword = async () => {
  const text = resetPwdDialog.tempPassword
  if (!text) return
  try {
    await navigator.clipboard.writeText(text)
    ElMessage.success('已复制')
  } catch {
    ElMessage.warning('复制失败，请手动复制')
  }
}

const onToggleEnabled = async (row) => {
  const nextEnabled = !row.enabled
  try {
    await apiAccountAdminUpdate(row.id, { displayName: row.displayName || row.username, enabled: nextEnabled })
    row.enabled = nextEnabled
    ElMessage.success('已更新')
  } catch {
    // keep old state
  }
}

onMounted(fetchList)
</script>

<template>
  <el-card shadow="never">
    <template #header>
      <div class="page-header">
        <span>前台用户列表</span>
        <div class="header-actions">
          <el-button :icon="Refresh" @click="fetchList">刷新</el-button>
        </div>
      </div>
    </template>

    <el-form :inline="true" class="filters" @submit.prevent>
      <el-form-item label="关键字">
        <el-input
          v-model="query.keyword"
          placeholder="username / displayName"
          clearable
          style="width: 240px"
          @keyup.enter="onSearch"
        />
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="query.enabled" clearable placeholder="全部" style="width: 140px">
          <el-option label="启用" value="true" />
          <el-option label="禁用" value="false" />
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onSearch">查询</el-button>
        <el-button @click="onReset">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table v-loading="loading" :data="tableData" stripe style="width: 100%">
      <el-table-column prop="id" label="ID" width="90" />
      <el-table-column prop="username" label="用户名" min-width="160" />
      <el-table-column prop="displayName" label="显示名" min-width="160" />
      <el-table-column label="状态" width="140">
        <template #default="{ row }">
          <el-tag :type="row.enabled ? 'success' : 'info'">
            {{ row.enabled ? '启用' : '禁用' }}
          </el-tag>
          <el-button
            v-perm="'account:update'"
            size="small"
            text
            type="primary"
            @click="onToggleEnabled(row)"
          >
            {{ row.enabled ? '禁用' : '启用' }}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="最近登录" min-width="180">
        <template #default="{ row }">{{ formatLdt(row.lastLoginAt) }}</template>
      </el-table-column>
      <el-table-column label="创建时间" min-width="180">
        <template #default="{ row }">{{ formatLdt(row.createdAt) }}</template>
      </el-table-column>

      <el-table-column label="操作" fixed="right" width="160">
        <template #default="{ row }">
          <el-button
            v-perm="'account:reset_password'"
            size="small"
            type="warning"
            @click="onResetPassword(row)"
          >
            重置密码
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

  <el-dialog v-model="resetPwdDialog.open" title="重置密码" width="520px">
    <el-alert
      type="warning"
      show-icon
      :closable="false"
      title="临时密码只展示一次，请复制后线下转交用户"
    />
    <div class="pwd-box">
      <div class="pwd-row">
        <span class="pwd-label">用户</span>
        <span class="pwd-value">{{ resetPwdDialog.username }}</span>
      </div>
      <div class="pwd-row">
        <span class="pwd-label">临时密码</span>
        <span class="pwd-value pwd-mono">{{ resetPwdDialog.tempPassword || '-' }}</span>
      </div>
    </div>
    <template #footer>
      <el-button @click="resetPwdDialog.open = false">关闭</el-button>
      <el-button type="primary" :disabled="!resetPwdDialog.tempPassword" @click="copyTempPassword">
        复制
      </el-button>
    </template>
  </el-dialog>
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

.pwd-box {
  margin-top: 12px;
  border: 1px solid rgba(2, 6, 23, 0.08);
  border-radius: 12px;
  padding: 12px;
  background: #fff;
}

.pwd-row {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding: 6px 0;
}

.pwd-label {
  color: #64748b;
}

.pwd-value {
  color: #0f172a;
  font-weight: 700;
}

.pwd-mono {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono',
    'Courier New', monospace;
}

.pager {
  margin-top: 14px;
  display: flex;
  justify-content: flex-end;
}
</style>
