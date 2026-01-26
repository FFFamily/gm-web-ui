<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { Refresh } from '@element-plus/icons-vue'
import { apiAuditList } from '~/api/audits'
import { formatLdt, toLocalDateTimeString } from '~/utils/datetime'

const loading = ref(false)
const tableData = ref([])
const total = ref(0)

const query = reactive({
  page: 1,
  size: 20,
  actorUserId: '',
  action: '',
  targetType: '',
  range: null // [Date, Date]
})

const startAt = computed(() => (query.range?.[0] ? toLocalDateTimeString(query.range[0]) : undefined))
const endAt = computed(() => (query.range?.[1] ? toLocalDateTimeString(query.range[1]) : undefined))

const actorUserIdValue = computed(() => {
  const s = String(query.actorUserId || '').trim()
  if (!s) return undefined
  if (!/^\d+$/.test(s)) return undefined
  return Number(s)
})

const fetchList = async () => {
  loading.value = true
  try {
    const params = {
      page: query.page,
      size: query.size,
      actorUserId: actorUserIdValue.value,
      action: query.action?.trim() || undefined,
      targetType: query.targetType?.trim() || undefined,
      startAt: startAt.value,
      endAt: endAt.value
    }
    const data = await apiAuditList(params)
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
  query.actorUserId = ''
  query.action = ''
  query.targetType = ''
  query.range = null
  query.page = 1
  query.size = 20
  await fetchList()
}

const detailDialog = reactive({
  open: false,
  title: '详情',
  jsonText: ''
})

const openDetail = (row) => {
  detailDialog.open = true
  detailDialog.title = `审计详情 #${row.id}`
  const raw = row.detailJson || ''
  try {
    detailDialog.jsonText = raw ? JSON.stringify(JSON.parse(raw), null, 2) : ''
  } catch {
    detailDialog.jsonText = raw
  }
}

onMounted(fetchList)
</script>

<template>
  <el-card shadow="never">
    <template #header>
      <div class="page-header">
        <span>审计日志</span>
        <el-button :icon="Refresh" @click="fetchList">刷新</el-button>
      </div>
    </template>

    <el-form :inline="true" class="filters" @submit.prevent>
      <el-form-item label="操作者ID">
        <el-input
          v-model="query.actorUserId"
          placeholder="actorUserId"
          clearable
          style="width: 160px"
          @keyup.enter="onSearch"
        />
      </el-form-item>
      <el-form-item label="动作">
        <el-input v-model="query.action" placeholder="action" clearable style="width: 180px" @keyup.enter="onSearch" />
      </el-form-item>
      <el-form-item label="目标类型">
        <el-input
          v-model="query.targetType"
          placeholder="targetType"
          clearable
          style="width: 180px"
          @keyup.enter="onSearch"
        />
      </el-form-item>
      <el-form-item label="时间范围">
        <el-date-picker
          v-model="query.range"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSearch">查询</el-button>
        <el-button @click="onReset">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table v-loading="loading" :data="tableData" stripe style="width: 100%">
      <el-table-column prop="id" label="ID" width="90" />
      <el-table-column prop="actorUserId" label="操作者" width="110" />
      <el-table-column prop="action" label="动作" min-width="160" />
      <el-table-column prop="targetType" label="目标类型" width="120" />
      <el-table-column prop="targetId" label="目标ID" min-width="120" />
      <el-table-column prop="result" label="结果" width="110" />
      <el-table-column prop="ip" label="IP" min-width="140" />
      <el-table-column prop="requestId" label="requestId" min-width="180" />
      <el-table-column label="时间" min-width="180">
        <template #default="{ row }">{{ formatLdt(row.createdAt) }}</template>
      </el-table-column>

      <el-table-column label="操作" fixed="right" width="120">
        <template #default="{ row }">
          <el-button size="small" @click="openDetail(row)">详情</el-button>
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

  <el-dialog v-model="detailDialog.open" :title="detailDialog.title" width="720px">
    <pre class="json-pre">{{ detailDialog.jsonText || '-' }}</pre>
    <template #footer>
      <el-button @click="detailDialog.open = false">关闭</el-button>
    </template>
  </el-dialog>
</template>

<style scoped>
.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.filters {
  margin-bottom: 12px;
}

.pager {
  display: flex;
  justify-content: flex-end;
  margin-top: 12px;
}

.json-pre {
  margin: 0;
  max-height: 520px;
  overflow: auto;
  padding: 12px;
  border-radius: 10px;
  border: 1px solid rgba(2, 6, 23, 0.08);
  background: rgba(2, 6, 23, 0.03);
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New',
    monospace;
  font-size: 12px;
  line-height: 1.5;
}
</style>
