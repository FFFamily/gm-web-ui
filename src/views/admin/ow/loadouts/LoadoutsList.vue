<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Refresh } from '@element-plus/icons-vue'
import { adminListOwHeroes } from '~/api/owAdmin'
import {
  adminGetOwLoadout,
  adminListOwLoadouts,
  adminSetOwLoadoutFeatured,
  adminSetOwLoadoutPinned,
  adminSetOwLoadoutStatus
} from '~/api/owAdmin'

const loading = ref(false)
const tableData = ref([])
const total = ref(0)
const heroesOptions = ref([])

const query = reactive({
  page: 1,
  size: 20,
  keyword: '',
  heroCode: '',
  status: '',
  featured: '', // '' | 'true' | 'false'
  pinned: '' // '' | 'true' | 'false'
})

const boolQuery = (v) => {
  if (v === 'true') return true
  if (v === 'false') return false
  return undefined
}

const fetchHeroesOptions = async () => {
  const data = await adminListOwHeroes({ page: 1, size: 200, enabled: true })
  heroesOptions.value = data?.records || []
}

const fetchList = async () => {
  loading.value = true
  try {
    const data = await adminListOwLoadouts({
      page: query.page,
      size: query.size,
      keyword: query.keyword?.trim() || undefined,
      heroCode: query.heroCode || undefined,
      status: query.status || undefined,
      featured: boolQuery(query.featured),
      pinned: boolQuery(query.pinned)
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
  query.heroCode = ''
  query.status = ''
  query.featured = ''
  query.pinned = ''
  query.page = 1
  query.size = 20
  await fetchList()
}

const formatLdt = (s) => (s ? String(s).replace('T', ' ') : '-')

const setStatus = async (row, status) => {
  await adminSetOwLoadoutStatus(row.id, { status })
  row.status = status
  ElMessage.success('已更新')
}

const toggleFeatured = async (row) => {
  try {
    const next = !row.featured
    await adminSetOwLoadoutFeatured(row.id, { featured: next })
    row.featured = next
    ElMessage.success('已更新')
  } catch (e) {
    ElMessage.error(e?.message || '操作失败')
  }
}

const togglePinned = async (row) => {
  try {
    const next = !row.pinned
    await adminSetOwLoadoutPinned(row.id, { pinned: next })
    row.pinned = next
    ElMessage.success('已更新')
  } catch (e) {
    ElMessage.error(e?.message || '操作失败')
  }
}

const detailDialog = reactive({
  open: false,
  loading: false,
  data: null
})

const openDetail = async (row) => {
  detailDialog.open = true
  detailDialog.loading = true
  try {
    detailDialog.data = await adminGetOwLoadout(row.id)
  } finally {
    detailDialog.loading = false
  }
}

onMounted(async () => {
  await fetchHeroesOptions()
  await fetchList()
})

const statusTagType = computed(() => (s) => {
  if (s === 'PUBLISHED') return 'success'
  if (s === 'HIDDEN') return 'info'
  return ''
})
</script>

<template>
  <el-card shadow="never">
    <template #header>
      <div class="header">
        <span>OW 清单管理</span>
        <div class="header-actions">
          <el-button :icon="Refresh" @click="fetchList">刷新</el-button>
        </div>
      </div>
    </template>

    <el-form :inline="true" class="filters" @submit.prevent>
      <el-form-item label="英雄">
        <el-select v-model="query.heroCode" clearable filterable placeholder="全部" style="width: 220px" @change="onSearch">
          <el-option v-for="h in heroesOptions" :key="h.id" :label="h.heroName" :value="h.heroCode" />
        </el-select>
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="query.status" clearable placeholder="全部" style="width: 140px" @change="onSearch">
          <el-option label="PUBLISHED" value="PUBLISHED" />
          <el-option label="HIDDEN" value="HIDDEN" />
        </el-select>
      </el-form-item>
      <el-form-item label="精选">
        <el-select v-model="query.featured" clearable placeholder="全部" style="width: 120px" @change="onSearch">
          <el-option label="true" value="true" />
          <el-option label="false" value="false" />
        </el-select>
      </el-form-item>
      <el-form-item label="置顶">
        <el-select v-model="query.pinned" clearable placeholder="全部" style="width: 120px" @change="onSearch">
          <el-option label="true" value="true" />
          <el-option label="false" value="false" />
        </el-select>
      </el-form-item>
      <el-form-item label="关键字">
        <el-input v-model="query.keyword" placeholder="标题/描述/作者" clearable style="width: 240px" @keyup.enter="onSearch" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSearch">查询</el-button>
        <el-button @click="onReset">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table v-loading="loading" :data="tableData" stripe style="width: 100%">
      <el-table-column prop="id" label="ID" width="90" />
      <el-table-column prop="heroName" label="英雄" min-width="140" />
      <el-table-column prop="title" label="标题" min-width="220" show-overflow-tooltip />
      <el-table-column prop="authorName" label="作者" min-width="140" />
      <el-table-column label="状态" width="120">
        <template #default="{ row }">
          <el-tag :type="statusTagType(row.status)">{{ row.status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="精选" width="110">
        <template #default="{ row }">
          <el-switch v-perm="'ow:loadout:feature'" :model-value="!!row.featured" @change="() => toggleFeatured(row)" />
        </template>
      </el-table-column>
      <el-table-column label="置顶" width="110">
        <template #default="{ row }">
          <el-switch v-perm="'ow:loadout:pin'" :model-value="!!row.pinned" @change="() => togglePinned(row)" />
        </template>
      </el-table-column>
      <el-table-column prop="viewCount" label="浏览" width="90" />
      <el-table-column prop="likeCount" label="赞" width="80" />
      <el-table-column prop="favoriteCount" label="藏" width="80" />
      <el-table-column label="创建时间" min-width="180">
        <template #default="{ row }">{{ formatLdt(row.createdAt) }}</template>
      </el-table-column>
      <el-table-column label="操作" width="220" fixed="right">
        <template #default="{ row }">
          <el-button size="small" @click="openDetail(row)">详情</el-button>
          <el-button
            v-perm="'ow:loadout:update_status'"
            size="small"
            type="warning"
            @click="
              async () => {
                const next = row.status === 'HIDDEN' ? 'PUBLISHED' : 'HIDDEN'
                const action = next === 'HIDDEN' ? '下架' : '上架'
                await ElMessageBox.confirm(`确认${action}该清单？`, '提示', { type: 'warning' })
                await setStatus(row, next)
              }
            "
          >
            {{ row.status === 'HIDDEN' ? '上架' : '下架' }}
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

  <el-dialog v-model="detailDialog.open" title="清单详情" width="720px">
    <div v-loading="detailDialog.loading">
      <div v-if="detailDialog.data" class="detail">
        <div class="row"><span class="k">标题</span><span class="v">{{ detailDialog.data.title }}</span></div>
        <div class="row"><span class="k">英雄</span><span class="v">{{ detailDialog.data.heroName }}</span></div>
        <div class="row"><span class="k">作者</span><span class="v">{{ detailDialog.data.authorName }}</span></div>
        <div class="row"><span class="k">状态</span><span class="v">{{ detailDialog.data.status }}</span></div>
        <div class="row"><span class="k">描述</span><span class="v">{{ detailDialog.data.description || '-' }}</span></div>
        <div class="row"><span class="k">itemsJson</span><span class="v mono">{{ detailDialog.data.itemsJson }}</span></div>
      </div>
    </div>
    <template #footer>
      <el-button @click="detailDialog.open = false">关闭</el-button>
    </template>
  </el-dialog>
</template>

<style scoped>
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.filters {
  margin-bottom: 12px;
}

.pager {
  margin-top: 14px;
  display: flex;
  justify-content: flex-end;
}

.detail .row {
  display: flex;
  gap: 10px;
  padding: 8px 0;
  border-bottom: 1px dashed rgba(2, 6, 23, 0.08);
}

.detail .k {
  width: 90px;
  flex: 0 0 auto;
  color: #64748b;
  font-weight: 900;
}

.detail .v {
  flex: 1;
  color: #0f172a;
  font-weight: 700;
}

.mono {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
  font-size: 12px;
  word-break: break-all;
}
</style>

