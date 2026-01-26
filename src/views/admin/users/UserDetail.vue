<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { apiUserDetail, apiUserResetPassword } from '~/api/users'

const route = useRoute()
const router = useRouter()
const userId = computed(() => route.params.id)

const loading = ref(false)
const detail = ref(null)

const fetchDetail = async () => {
  loading.value = true
  try {
    detail.value = await apiUserDetail(userId.value)
  } finally {
    loading.value = false
  }
}

const goEdit = () => router.push(`/admin/users/${userId.value}/edit`)

const resetPwdDialog = reactive({
  open: false,
  tempPassword: ''
})

const onResetPassword = async () => {
  resetPwdDialog.open = true
  resetPwdDialog.tempPassword = ''
  try {
    const data = await apiUserResetPassword(userId.value)
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

const formatLdt = (s) => (s ? String(s).replace('T', ' ') : '-')

onMounted(fetchDetail)
</script>

<template>
  <el-card shadow="never" v-loading="loading">
    <template #header>
      <div class="page-header">
        <span>用户详情</span>
        <div class="actions">
          <el-button @click="router.back()">返回</el-button>
          <el-button v-perm="'user:update'" @click="goEdit">编辑</el-button>
          <el-button v-perm="'user:reset_password'" type="warning" @click="onResetPassword">重置密码</el-button>
        </div>
      </div>
    </template>

    <el-descriptions v-if="detail" :column="2" border>
      <el-descriptions-item label="ID">{{ detail.id }}</el-descriptions-item>
      <el-descriptions-item label="用户名">{{ detail.username }}</el-descriptions-item>
      <el-descriptions-item label="显示名">{{ detail.displayName }}</el-descriptions-item>
      <el-descriptions-item label="状态">
        <el-tag :type="detail.enabled ? 'success' : 'info'">{{ detail.enabled ? '启用' : '禁用' }}</el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="角色" :span="2">
        <el-space wrap>
          <el-tag v-for="c in detail.roleCodes || []" :key="c" type="info">{{ c }}</el-tag>
          <span v-if="!detail.roleCodes || detail.roleCodes.length === 0" class="muted">-</span>
        </el-space>
      </el-descriptions-item>
      <el-descriptions-item label="最近登录">{{ formatLdt(detail.lastLoginAt) }}</el-descriptions-item>
      <el-descriptions-item label="创建时间">{{ formatLdt(detail.createdAt) }}</el-descriptions-item>
      <el-descriptions-item label="更新时间" :span="2">{{ formatLdt(detail.updatedAt) }}</el-descriptions-item>
    </el-descriptions>

    <el-empty v-else description="暂无数据" />
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
        <span class="pwd-label">临时密码</span>
        <span class="pwd-value pwd-mono">{{ resetPwdDialog.tempPassword || '-' }}</span>
      </div>
    </div>
    <template #footer>
      <el-button @click="resetPwdDialog.open = false">关闭</el-button>
      <el-button type="primary" :disabled="!resetPwdDialog.tempPassword" @click="copyTempPassword">复制</el-button>
    </template>
  </el-dialog>
</template>

<style scoped>
.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.actions {
  display: flex;
  gap: 8px;
}
.muted {
  color: #94a3b8;
}
.pwd-box {
  margin-top: 12px;
  padding: 12px;
  border: 1px solid rgba(2, 6, 23, 0.08);
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.6);
}
.pwd-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 0;
  gap: 12px;
}
.pwd-label {
  color: #64748b;
  font-size: 12px;
}
.pwd-value {
  color: #0f172a;
  font-weight: 700;
}
.pwd-mono {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New',
    monospace;
}
</style>
