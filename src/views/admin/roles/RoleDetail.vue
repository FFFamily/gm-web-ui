<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { apiPermissionList } from '~/api/permissions'
import { apiRoleBindPermissions, apiRoleDetail } from '~/api/roles'

const route = useRoute()
const router = useRouter()
const roleId = computed(() => route.params.id)

const loading = ref(false)
const detail = ref(null)

const fetchDetail = async () => {
  loading.value = true
  try {
    detail.value = await apiRoleDetail(roleId.value)
  } finally {
    loading.value = false
  }
}

const goEdit = () => router.push(`/admin/roles/${roleId.value}/edit`)

const bindDialog = reactive({
  open: false,
  saving: false
})

const allPermsLoading = ref(false)
const allPerms = ref([])
const treeData = ref([])
const treeRef = ref()

const groupLabel = (group) => {
  const map = {
    auth: '认证',
    user: '用户',
    role: '角色',
    permission: '权限点',
    audit: '审计'
  }
  return map[group] || group
}

const buildTree = (perms) => {
  const groups = new Map()
  perms.forEach((p) => {
    const code = p.permCode
    const name = p.permName || code
    const group = String(code).split(':')[0] || 'other'
    if (!groups.has(group)) {
      groups.set(group, { id: `group:${group}`, label: groupLabel(group), children: [] })
    }
    groups.get(group).children.push({ id: code, label: `${name} (${code})` })
  })

  // stable order
  const order = ['auth', 'user', 'role', 'permission', 'audit']
  const result = []
  order.forEach((g) => {
    if (groups.has(g)) result.push(groups.get(g))
  })
  ;[...groups.keys()].sort().forEach((g) => {
    if (!order.includes(g)) result.push(groups.get(g))
  })
  return result
}

const ensurePermsLoaded = async () => {
  if (allPerms.value.length > 0) return
  allPermsLoading.value = true
  try {
    allPerms.value = await apiPermissionList()
    treeData.value = buildTree(allPerms.value || [])
  } finally {
    allPermsLoading.value = false
  }
}

const openBindDialog = async () => {
  await ensurePermsLoaded()
  bindDialog.open = true
  // nextTick not strictly needed; el-tree will apply later as well
  setTimeout(() => {
    const checked = detail.value?.permCodes || []
    treeRef.value?.setCheckedKeys(checked)
  }, 0)
}

const onSavePerms = async () => {
  bindDialog.saving = true
  try {
    // leafOnly = true to avoid group nodes
    const permCodes = treeRef.value?.getCheckedKeys(true) || []
    await apiRoleBindPermissions(roleId.value, { permCodes })
    ElMessage.success('保存成功')
    bindDialog.open = false
    await fetchDetail()
  } finally {
    bindDialog.saving = false
  }
}

const formatLdt = (s) => (s ? String(s).replace('T', ' ') : '-')

onMounted(fetchDetail)
</script>

<template>
  <el-card shadow="never" v-loading="loading">
    <template #header>
      <div class="page-header">
        <span>角色详情</span>
        <div class="actions">
          <el-button @click="router.back()">返回</el-button>
          <el-button v-perm="'role:update'" @click="goEdit">编辑</el-button>
          <el-button v-perm="'role:bind_permissions'" type="primary" @click="openBindDialog">绑定权限</el-button>
        </div>
      </div>
    </template>

    <el-descriptions v-if="detail" :column="2" border>
      <el-descriptions-item label="ID">{{ detail.id }}</el-descriptions-item>
      <el-descriptions-item label="角色编码">{{ detail.roleCode }}</el-descriptions-item>
      <el-descriptions-item label="角色名称">{{ detail.roleName }}</el-descriptions-item>
      <el-descriptions-item label="创建时间">{{ formatLdt(detail.createdAt) }}</el-descriptions-item>
      <el-descriptions-item label="更新时间" :span="2">{{ formatLdt(detail.updatedAt) }}</el-descriptions-item>
      <el-descriptions-item label="已绑定权限" :span="2">
        <el-space wrap>
          <el-tag v-for="c in detail.permCodes || []" :key="c" type="info">{{ c }}</el-tag>
          <span v-if="!detail.permCodes || detail.permCodes.length === 0" class="muted">-</span>
        </el-space>
      </el-descriptions-item>
    </el-descriptions>
    <el-empty v-else description="暂无数据" />
  </el-card>

  <el-dialog v-model="bindDialog.open" title="绑定权限" width="720px">
    <el-alert type="info" show-icon :closable="false" title="勾选后保存即可生效（允许清空）" />
    <div class="tree-wrap" v-loading="allPermsLoading">
      <el-tree
        ref="treeRef"
        node-key="id"
        :data="treeData"
        show-checkbox
        default-expand-all
        :check-strictly="false"
      />
    </div>
    <template #footer>
      <el-button @click="bindDialog.open = false">取消</el-button>
      <el-button type="primary" :loading="bindDialog.saving" @click="onSavePerms">保存</el-button>
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
.tree-wrap {
  margin-top: 12px;
  max-height: 520px;
  overflow: auto;
  border: 1px solid rgba(2, 6, 23, 0.08);
  border-radius: 10px;
  padding: 10px;
  background: rgba(255, 255, 255, 0.6);
}
</style>
