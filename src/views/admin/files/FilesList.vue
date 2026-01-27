<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Refresh } from '@element-plus/icons-vue'
import { apiFileDelete, apiFileList, apiFileUpload } from '~/api/files'

const loading = ref(false)
const tableData = ref([])
const total = ref(0)

const query = reactive({
  page: 1,
  size: 20,
  biz: '',
  keyword: ''
})

const fetchList = async () => {
  loading.value = true
  try {
    const data = await apiFileList({
      page: query.page,
      size: query.size,
      biz: query.biz?.trim() || undefined,
      keyword: query.keyword?.trim() || undefined
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
  query.biz = ''
  query.keyword = ''
  query.page = 1
  query.size = 20
  await fetchList()
}

const uploadDialog = reactive({
  open: false,
  biz: 'ow/item',
  type: 'image',
  file: null,
  uploading: false
})

const openUpload = () => {
  uploadDialog.open = true
  uploadDialog.biz = 'ow/item'
  uploadDialog.type = 'image'
  uploadDialog.file = null
}

const onPickFile = (e) => {
  const f = e?.target?.files?.[0]
  uploadDialog.file = f || null
}

const doUpload = async () => {
  if (!uploadDialog.biz?.trim()) return ElMessage.warning('biz 不能为空')
  if (!uploadDialog.file) return ElMessage.warning('请选择文件')
  uploadDialog.uploading = true
  try {
    const res = await apiFileUpload({
      biz: uploadDialog.biz.trim(),
      type: uploadDialog.type,
      file: uploadDialog.file
    })
    ElMessage.success('上传成功')
    uploadDialog.open = false
    await fetchList()
    await navigator.clipboard?.writeText?.(window.location.origin + res.url)
  } finally {
    uploadDialog.uploading = false
  }
}

const onDelete = async (row) => {
  await ElMessageBox.confirm(`确定删除文件记录 #${row.id}？（会尝试删除磁盘文件）`, '提示', { type: 'warning' })
  await apiFileDelete(row.id)
  ElMessage.success('已删除')
  await fetchList()
}

const formatLdt = (s) => (s ? String(s).replace('T', ' ') : '-')
const isImage = (row) => String(row.contentType || '').toLowerCase().startsWith('image/')
const fullUrl = (row) => `${window.location.origin}${row.url}`

const pageTitle = computed(() => '文件管理')

onMounted(fetchList)
</script>

<template>
  <el-card shadow="never">
    <template #header>
      <div class="page-header">
        <span>{{ pageTitle }}</span>
        <div class="header-actions">
          <el-button :icon="Refresh" @click="fetchList">刷新</el-button>
          <el-button v-perm="'file:upload'" type="primary" @click="openUpload">上传文件</el-button>
        </div>
      </div>
    </template>

    <el-form :inline="true" class="filters" @submit.prevent>
      <el-form-item label="biz">
        <el-input v-model="query.biz" placeholder="例如 ow/item" clearable style="width: 220px" @keyup.enter="onSearch" />
      </el-form-item>
      <el-form-item label="关键字">
        <el-input
          v-model="query.keyword"
          placeholder="originalName / url"
          clearable
          style="width: 240px"
          @keyup.enter="onSearch"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSearch">查询</el-button>
        <el-button @click="onReset">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table v-loading="loading" :data="tableData" stripe style="width: 100%">
      <el-table-column prop="id" label="ID" width="90" />
      <el-table-column prop="biz" label="biz" min-width="140" />
      <el-table-column label="预览" width="80">
        <template #default="{ row }">
          <el-image v-if="isImage(row)" :src="row.url" fit="cover" style="width: 40px; height: 40px; border-radius: 8px" />
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column prop="originalName" label="原文件名" min-width="220" />
      <el-table-column prop="contentType" label="类型" min-width="180" />
      <el-table-column prop="sizeBytes" label="大小(B)" width="120" />
      <el-table-column label="URL" min-width="260">
        <template #default="{ row }">
          <el-link :href="row.url" target="_blank" type="primary">{{ row.url }}</el-link>
          <el-button
            size="small"
            text
            type="primary"
            @click="
              async () => {
                try {
                  await navigator.clipboard.writeText(fullUrl(row))
                  ElMessage.success('已复制')
                } catch {
                  ElMessage.warning('复制失败')
                }
              }
            "
          >
            复制
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" min-width="180">
        <template #default="{ row }">{{ formatLdt(row.createdAt) }}</template>
      </el-table-column>

      <el-table-column label="操作" fixed="right" width="120">
        <template #default="{ row }">
          <el-button v-perm="'file:delete'" size="small" type="danger" @click="onDelete(row)">删除</el-button>
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

  <el-dialog v-model="uploadDialog.open" title="上传文件" width="520px">
    <el-form label-width="80px">
      <el-form-item label="biz" required>
        <el-input v-model="uploadDialog.biz" placeholder="例如 ow/item" />
      </el-form-item>
      <el-form-item label="type">
        <el-select v-model="uploadDialog.type" style="width: 220px">
          <el-option label="image" value="image" />
          <el-option label="file" value="file" />
        </el-select>
      </el-form-item>
      <el-form-item label="文件" required>
        <input type="file" @change="onPickFile" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="uploadDialog.open = false">取消</el-button>
      <el-button type="primary" :loading="uploadDialog.uploading" @click="doUpload">上传</el-button>
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
</style>

