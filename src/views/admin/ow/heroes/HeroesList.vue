<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Refresh } from '@element-plus/icons-vue'
import { getOwBaseInfo } from '~/api/ow'
import { adminCreateOwHero, adminDeleteOwHero, adminGetOwHero, adminListOwHeroes, adminUpdateOwHero } from '~/api/owAdmin'

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

const statDefs = ref([])

const fetchStatDefs = async () => {
  const data = await getOwBaseInfo()
  statDefs.value = data?.statDefs || []
}

const fetchList = async () => {
  loading.value = true
  try {
    const data = await adminListOwHeroes({
      page: query.page,
      size: query.size,
      keyword: query.keyword?.trim() || undefined,
      enabled: enabledQueryValue.value
    })
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

const dialog = reactive({
  open: false,
  mode: 'create' // create | edit
})

const form = reactive({
  id: null,
  heroCode: '',
  heroName: '',
  description: '',
  avatarKey: '',
  avatarUrl: '',
  initialGold: null,
  enabled: true,
  sortOrder: 0
})

const baseStats = reactive({})

const initBaseStats = (values) => {
  Object.keys(baseStats).forEach((k) => delete baseStats[k])
  for (const d of statDefs.value || []) {
    baseStats[d.key] = Number(values?.[d.key] ?? d.defaultValue ?? 0)
  }
}

const openCreate = async () => {
  dialog.open = true
  dialog.mode = 'create'
  form.id = null
  form.heroCode = ''
  form.heroName = ''
  form.description = ''
  form.avatarKey = ''
  form.avatarUrl = ''
  form.initialGold = null
  form.enabled = true
  form.sortOrder = 0
  initBaseStats({})
}

const openEdit = async (row) => {
  dialog.open = true
  dialog.mode = 'edit'
  const detail = await adminGetOwHero(row.id)
  form.id = detail.id
  form.heroCode = detail.heroCode
  form.heroName = detail.heroName
  form.description = detail.description || ''
  form.avatarKey = detail.avatarKey || ''
  form.avatarUrl = detail.avatarUrl || ''
  form.initialGold = detail.initialGold ?? null
  form.enabled = !!detail.enabled
  form.sortOrder = Number(detail.sortOrder ?? 0)
  initBaseStats(detail.baseStats || {})
}

const save = async () => {
  const payload = {
    heroCode: form.heroCode,
    heroName: form.heroName,
    description: form.description || null,
    avatarKey: form.avatarKey || null,
    avatarUrl: form.avatarUrl || null,
    initialGold: form.initialGold ?? null,
    baseStats: { ...baseStats },
    enabled: !!form.enabled,
    sortOrder: Number(form.sortOrder ?? 0)
  }

  if (dialog.mode === 'create') {
    await adminCreateOwHero(payload)
    ElMessage.success('已创建')
  } else {
    await adminUpdateOwHero(form.id, {
      heroName: payload.heroName,
      description: payload.description,
      avatarKey: payload.avatarKey,
      avatarUrl: payload.avatarUrl,
      initialGold: payload.initialGold,
      baseStats: payload.baseStats,
      enabled: payload.enabled,
      sortOrder: payload.sortOrder
    })
    ElMessage.success('已保存')
  }

  dialog.open = false
  await fetchList()
}

const onDelete = async (row) => {
  await ElMessageBox.confirm(`确定删除英雄「${row.heroName}」？`, '提示', { type: 'warning' })
  await adminDeleteOwHero(row.id)
  ElMessage.success('已删除')
  await fetchList()
}

onMounted(async () => {
  await fetchStatDefs()
  await fetchList()
})
</script>

<template>
  <el-card shadow="never">
    <template #header>
      <div class="page-header">
        <span>OW 英雄管理</span>
        <div class="header-actions">
          <el-button :icon="Refresh" @click="fetchList">刷新</el-button>
          <el-button v-perm="'ow:hero:create'" type="primary" @click="openCreate">新增英雄</el-button>
        </div>
      </div>
    </template>

    <el-form :inline="true" class="filters" @submit.prevent>
      <el-form-item label="关键字">
        <el-input
          v-model="query.keyword"
          placeholder="heroCode / heroName"
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
      <el-table-column prop="heroCode" label="heroCode" min-width="160" />
      <el-table-column prop="heroName" label="英雄名" min-width="160" />
      <el-table-column prop="sortOrder" label="排序" width="90" />
      <el-table-column prop="initialGold" label="初始金币" width="120">
        <template #default="{ row }">{{ row.initialGold ?? '-' }}</template>
      </el-table-column>
      <el-table-column label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="row.enabled ? 'success' : 'info'">
            {{ row.enabled ? '启用' : '禁用' }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column label="操作" fixed="right" width="220">
        <template #default="{ row }">
          <el-button v-perm="'ow:hero:update'" size="small" @click="openEdit(row)">编辑</el-button>
          <el-button v-perm="'ow:hero:delete'" size="small" type="danger" @click="onDelete(row)">删除</el-button>
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

  <el-dialog v-model="dialog.open" :title="dialog.mode === 'create' ? '新增英雄' : '编辑英雄'" width="720px">
    <el-form label-width="110px">
      <el-form-item label="heroCode" required>
        <el-input v-model="form.heroCode" :disabled="dialog.mode === 'edit'" placeholder="例如: soldier76" />
      </el-form-item>
      <el-form-item label="英雄名" required>
        <el-input v-model="form.heroName" placeholder="例如: 士兵 76" />
      </el-form-item>
      <el-form-item label="描述">
        <el-input v-model="form.description" type="textarea" :rows="2" placeholder="可选" />
      </el-form-item>
      <el-form-item label="avatarKey">
        <el-input v-model="form.avatarKey" placeholder="可选（用于图片映射 key）" />
      </el-form-item>
      <el-form-item label="avatarUrl">
        <el-input v-model="form.avatarUrl" placeholder="可选（后续可直接填 URL）" />
      </el-form-item>
      <el-form-item label="初始金币">
        <el-input-number v-model="form.initialGold" :min="0" :step="100" style="width: 220px" />
        <span class="hint">为空则使用全局 initial_gold</span>
      </el-form-item>
      <el-form-item label="启用">
        <el-switch v-model="form.enabled" />
      </el-form-item>
      <el-form-item label="排序">
        <el-input-number v-model="form.sortOrder" :min="0" :step="1" style="width: 220px" />
      </el-form-item>

      <el-divider content-position="left">基础属性</el-divider>
      <div class="stats-grid">
        <div v-for="d in statDefs" :key="d.key" class="stats-item">
          <div class="stats-label">{{ d.label }} ({{ d.key }})</div>
          <el-input-number v-model="baseStats[d.key]" :step="1" style="width: 220px" />
        </div>
      </div>
    </el-form>

    <template #footer>
      <el-button @click="dialog.open = false">取消</el-button>
      <el-button type="primary" @click="save">保存</el-button>
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

.filters {
  margin-bottom: 12px;
}

.pager {
  display: flex;
  justify-content: flex-end;
  margin-top: 12px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  gap: 12px;
}

@media (min-width: 768px) {
  .stats-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

.stats-item {
  border: 1px solid rgba(2, 6, 23, 0.08);
  border-radius: 12px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.7);
}

.stats-label {
  font-size: 12px;
  color: #64748b;
  margin-bottom: 8px;
  font-weight: 700;
}

.hint {
  margin-left: 10px;
  font-size: 12px;
  color: #64748b;
}
</style>

