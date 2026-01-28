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
  newPassword: '',
  confirmPassword: '',
  saving: false
})

const onResetPassword = () => {
  resetPwdDialog.open = true
  resetPwdDialog.newPassword = ''
  resetPwdDialog.confirmPassword = ''
  resetPwdDialog.saving = false
}

const confirmResetPassword = async () => {
  const pwd = resetPwdDialog.newPassword || ''
  const confirm = resetPwdDialog.confirmPassword || ''
  if (pwd.length < 6) return ElMessage.warning('密码至少 6 位')
  if (pwd !== confirm) return ElMessage.warning('两次输入的密码不一致')

  resetPwdDialog.saving = true
  try {
    await apiUserResetPassword(userId.value, { newPassword: pwd })
    ElMessage.success('已重置')
    resetPwdDialog.open = false
  } finally {
    resetPwdDialog.saving = false
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
      title="请输入新的密码并确认"
    />
    <div class="pwd-box">
      <div class="pwd-row">
        <span class="pwd-label">新密码</span>
        <el-input v-model="resetPwdDialog.newPassword" show-password placeholder="输入新密码" style="max-width: 320px" />
      </div>
      <div class="pwd-row">
        <span class="pwd-label">确认密码</span>
        <el-input v-model="resetPwdDialog.confirmPassword" show-password placeholder="再次输入" style="max-width: 320px" />
      </div>
    </div>
    <template #footer>
      <el-button @click="resetPwdDialog.open = false">关闭</el-button>
      <el-button type="primary" :loading="resetPwdDialog.saving" @click="confirmResetPassword">确认重置</el-button>
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
