<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Refresh } from '@element-plus/icons-vue'
import { apiFileUpload } from '~/api/files'
import {
  adminCreateOwItem,
  adminDeleteOwItem,
  adminGetOwItem,
  adminListOwItems,
  adminUpdateOwItem,
  adminListOwHeroes
} from '~/api/owAdmin'
import {
  OW_ITEM_CATEGORY_OPTIONS,
  OW_ITEM_QUALITY_OPTIONS,
  OW_STAT_OPTIONS,
  owCategoryLabel,
  owQualityLabel,
  owStatLabel
} from '~/constants/owDict'

const loading = ref(false)
const tableData = ref([])
const total = ref(0)

const query = reactive({
  page: 1,
  size: 20,
  keyword: '',
  category: '',
  quality: '',
  enabled: '', // '' | 'true' | 'false'
  isGlobal: '' // '' | 'true' | 'false'
})

const enabledQueryValue = computed(() => {
  if (query.enabled === 'true') return true
  if (query.enabled === 'false') return false
  return undefined
})

const globalQueryValue = computed(() => {
  if (query.isGlobal === 'true') return true
  if (query.isGlobal === 'false') return false
  return undefined
})

const fetchList = async () => {
  loading.value = true
  try {
    const data = await adminListOwItems({
      page: query.page,
      size: query.size,
      keyword: query.keyword?.trim() || undefined,
      category: query.category || undefined,
      quality: query.quality || undefined,
      enabled: enabledQueryValue.value,
      isGlobal: globalQueryValue.value
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
  query.category = ''
  query.quality = ''
  query.enabled = ''
  query.isGlobal = ''
  query.page = 1
  query.size = 20
  await fetchList()
}

const dialog = reactive({
  open: false,
  mode: 'create' // create | edit
})

const heroesOptions = ref([])
const fetchHeroesOptions = async () => {
  const data = await adminListOwHeroes({ page: 1, size: 200, enabled: true })
  heroesOptions.value = data?.records || []
}

const form = reactive({
  id: null,
  itemCode: '',
  itemName: '',
  price: 0,
  quality: 'green',
  category: 'weapon',
  imgKey: '',
  imgUrl: '',
  isGlobal: true,
  heroIds: [],
  enabled: true,
  sortOrder: 0
})

const statRows = ref([])
const imgInputRef = ref(null)
const uploadingImg = ref(false)

const triggerImgPick = () => {
  imgInputRef.value?.click?.()
}

const onImgSelected = async (e) => {
  const f = e?.target?.files?.[0]
  // Reset input value so selecting the same file twice still triggers change.
  if (imgInputRef.value) imgInputRef.value.value = ''
  if (!f) return

  uploadingImg.value = true
  try {
    const res = await apiFileUpload({ biz: 'ow/item', type: 'image', file: f })
    form.imgUrl = res?.url || ''
    // Store storage path as well (not required for display, but useful for tracking).
    if (res?.key) form.imgKey = res.key
    ElMessage.success('图片上传成功')
  } finally {
    uploadingImg.value = false
  }
}

const copyText = async (text) => {
  if (!text) return
  try {
    await navigator.clipboard.writeText(text)
    ElMessage.success('已复制')
  } catch {
    ElMessage.warning('复制失败')
  }
}

const resetStatRows = (statsObj) => {
  const rows = []
  const obj = statsObj || {}
  for (const k of Object.keys(obj)) {
    rows.push({ key: k, value: Number(obj[k]) })
  }
  statRows.value = rows.length ? rows : [{ key: '', value: 0 }]
}

const statsPayload = computed(() => {
  const obj = {}
  for (const r of statRows.value || []) {
    const k = (r.key || '').trim()
    if (!k) continue
    obj[k] = Number(r.value || 0)
  }
  return obj
})

const usedStatKeys = computed(() => new Set((statRows.value || []).map((r) => (r.key || '').trim()).filter(Boolean)))
const statKeyDisabled = (value, currentKey) => {
  if (!value) return false
  if (value === (currentKey || '').trim()) return false
  return usedStatKeys.value.has(value)
}

const openCreate = async () => {
  dialog.open = true
  dialog.mode = 'create'
  form.id = null
  form.itemCode = ''
  form.itemName = ''
  form.price = 0
  form.quality = 'green'
  form.category = 'weapon'
  form.imgKey = ''
  form.imgUrl = ''
  form.isGlobal = true
  form.heroIds = []
  form.enabled = true
  form.sortOrder = 0
  resetStatRows({})
}

const openEdit = async (row) => {
  dialog.open = true
  dialog.mode = 'edit'
  const detail = await adminGetOwItem(row.id)
  form.id = detail.id
  form.itemCode = detail.itemCode
  form.itemName = detail.itemName
  form.price = Number(detail.price ?? 0)
  form.quality = detail.quality
  form.category = detail.category
  form.imgKey = detail.imgKey || ''
  form.imgUrl = detail.imgUrl || ''
  form.isGlobal = !!detail.isGlobal
  form.heroIds = detail.heroIds || []
  form.enabled = !!detail.enabled
  form.sortOrder = Number(detail.sortOrder ?? 0)
  resetStatRows(detail.stats || {})
}

const addStatRow = () => statRows.value.push({ key: '', value: 0 })
const removeStatRow = (idx) => statRows.value.splice(idx, 1)

const save = async () => {
  const payload = {
    itemCode: form.itemCode,
    itemName: form.itemName,
    price: Number(form.price ?? 0),
    quality: form.quality,
    category: form.category,
    imgKey: form.imgKey || null,
    imgUrl: form.imgUrl || null,
    stats: statsPayload.value,
    isGlobal: !!form.isGlobal,
    heroIds: form.isGlobal ? [] : form.heroIds,
    enabled: !!form.enabled,
    sortOrder: Number(form.sortOrder ?? 0)
  }

  if (dialog.mode === 'create') {
    await adminCreateOwItem(payload)
    ElMessage.success('已创建')
  } else {
    await adminUpdateOwItem(form.id, {
      itemName: payload.itemName,
      price: payload.price,
      quality: payload.quality,
      category: payload.category,
      imgKey: payload.imgKey,
      imgUrl: payload.imgUrl,
      stats: payload.stats,
      isGlobal: payload.isGlobal,
      heroIds: payload.heroIds,
      enabled: payload.enabled,
      sortOrder: payload.sortOrder
    })
    ElMessage.success('已保存')
  }

  dialog.open = false
  await fetchList()
}

const onDelete = async (row) => {
  await ElMessageBox.confirm(`确定删除装备「${row.itemName}」？`, '提示', { type: 'warning' })
  await adminDeleteOwItem(row.id)
  ElMessage.success('已删除')
  await fetchList()
}

onMounted(async () => {
  await fetchHeroesOptions()
  await fetchList()
})
</script>

<template>
  <el-card shadow="never">
    <template #header>
      <div class="page-header">
        <span>OW 装备管理</span>
        <div class="header-actions">
          <el-button :icon="Refresh" @click="fetchList">刷新</el-button>
          <el-button v-perm="'ow:item:create'" type="primary" @click="openCreate">新增装备</el-button>
        </div>
      </div>
    </template>

    <el-form :inline="true" class="filters" @submit.prevent>
      <el-form-item label="关键字">
        <el-input
          v-model="query.keyword"
          placeholder="itemCode / itemName"
          clearable
          style="width: 240px"
          @keyup.enter="onSearch"
        />
      </el-form-item>
      <el-form-item label="分类">
        <el-select v-model="query.category" clearable placeholder="全部" style="width: 140px">
          <el-option v-for="o in OW_ITEM_CATEGORY_OPTIONS" :key="o.value" :label="o.label" :value="o.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="品质">
        <el-select v-model="query.quality" clearable placeholder="全部" style="width: 140px">
          <el-option v-for="o in OW_ITEM_QUALITY_OPTIONS" :key="o.value" :label="o.label" :value="o.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="全局">
        <el-select v-model="query.isGlobal" clearable placeholder="全部" style="width: 140px">
          <el-option label="是" value="true" />
          <el-option label="否" value="false" />
        </el-select>
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
      <el-table-column prop="itemCode" label="itemCode" min-width="160" />
      <el-table-column prop="itemName" label="名称" min-width="160" />
      <el-table-column prop="category" label="分类" width="110">
        <template #default="{ row }">{{ owCategoryLabel(row.category) }}</template>
      </el-table-column>
      <el-table-column prop="quality" label="品质" width="110">
        <template #default="{ row }">{{ owQualityLabel(row.quality) }}</template>
      </el-table-column>
      <el-table-column prop="price" label="价格" width="110" />
      <el-table-column label="全局" width="90">
        <template #default="{ row }">
          <el-tag :type="row.isGlobal ? 'success' : 'info'">{{ row.isGlobal ? '是' : '否' }}</el-tag>
        </template>
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
          <el-button v-perm="'ow:item:update'" size="small" @click="openEdit(row)">编辑</el-button>
          <el-button v-perm="'ow:item:delete'" size="small" type="danger" @click="onDelete(row)">删除</el-button>
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

  <el-dialog v-model="dialog.open" :title="dialog.mode === 'create' ? '新增装备' : '编辑装备'" width="820px">
    <el-form label-width="110px">
      <el-form-item label="itemCode" required>
        <el-input v-model="form.itemCode" :disabled="dialog.mode === 'edit'" placeholder="例如: item_0001" />
      </el-form-item>
      <el-form-item label="名称" required>
        <el-input v-model="form.itemName" placeholder="装备名称" />
      </el-form-item>
      <el-form-item label="分类" required>
        <el-select v-model="form.category" style="width: 240px">
          <el-option v-for="o in OW_ITEM_CATEGORY_OPTIONS" :key="o.value" :label="o.label" :value="o.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="品质" required>
        <el-select v-model="form.quality" style="width: 240px">
          <el-option v-for="o in OW_ITEM_QUALITY_OPTIONS" :key="o.value" :label="o.label" :value="o.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="价格" required>
        <el-input-number v-model="form.price" :min="0" :step="100" style="width: 240px" />
      </el-form-item>
      <el-form-item label="图片 key">
        <el-input v-model="form.imgKey" placeholder="与前端 imageMap key 对齐（可选）" />
      </el-form-item>
      <el-form-item label="图片">
        <div class="img-upload">
          <div class="img-preview">
            <el-image
              v-if="form.imgUrl"
              :src="form.imgUrl"
              fit="cover"
              style="width: 56px; height: 56px; border-radius: 12px"
            />
            <div v-else class="img-empty">无</div>
          </div>

          <div class="img-ops">
            <input
              ref="imgInputRef"
              type="file"
              accept="image/*"
              class="hidden-file-input"
              @change="onImgSelected"
            />
            <el-button v-perm="'file:upload'" :loading="uploadingImg" type="primary" plain @click="triggerImgPick">
              上传图片
            </el-button>
            <el-button
              v-if="form.imgUrl"
              type="default"
              plain
              @click="
                () => {
                  form.imgUrl = ''
                  form.imgKey = ''
                }
              "
            >
              清除
            </el-button>
            <el-button v-if="form.imgUrl" type="primary" text @click="copyText(form.imgUrl)">复制 URL</el-button>
          </div>

          <div class="img-url" v-if="form.imgUrl">
            <el-input :model-value="form.imgUrl" disabled />
          </div>
        </div>
      </el-form-item>
      <el-form-item label="全局装备">
        <el-switch v-model="form.isGlobal" />
        <span class="hint">关闭后：只对绑定的英雄可见</span>
      </el-form-item>
      <el-form-item v-if="!form.isGlobal" label="绑定英雄">
        <el-select v-model="form.heroIds" multiple filterable style="width: 520px" placeholder="选择可使用该装备的英雄">
          <el-option v-for="h in heroesOptions" :key="h.id" :label="`${h.heroName} (#${h.id})`" :value="h.id" />
        </el-select>
      </el-form-item>

      <el-form-item label="启用">
        <el-switch v-model="form.enabled" />
      </el-form-item>
      <el-form-item label="排序">
        <el-input-number v-model="form.sortOrder" :min="0" :step="1" style="width: 240px" />
      </el-form-item>

      <el-divider content-position="left">属性（stats）</el-divider>
      <div class="stats-box">
        <div v-for="(r, idx) in statRows" :key="idx" class="stats-row">
          <el-select v-model="r.key" filterable placeholder="选择属性" style="width: 260px" clearable>
            <el-option
              v-for="o in OW_STAT_OPTIONS"
              :key="o.value"
              :label="o.label"
              :value="o.value"
              :disabled="statKeyDisabled(o.value, r.key)"
            />
          </el-select>
          <el-input-number v-model="r.value" :step="1" style="width: 180px" />
          <el-button type="danger" plain @click="removeStatRow(idx)" :disabled="statRows.length <= 1">删除</el-button>
        </div>
        <el-button type="primary" plain @click="addStatRow">新增一行</el-button>
        <div class="hint">提示：属性 key 统一从下拉选择；显示时使用中文 label（例如 {{ owStatLabel('weaponStrength') }}）。</div>
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

.stats-box {
  border: 1px solid rgba(2, 6, 23, 0.08);
  border-radius: 12px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.7);
}

.stats-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.hint {
  margin-left: 10px;
  font-size: 12px;
  color: #64748b;
}

.hint-danger {
  margin-top: 6px;
  font-size: 12px;
  color: #b91c1c;
}

.img-upload {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 520px;
}

.img-preview {
  display: flex;
  align-items: center;
  gap: 12px;
}

.img-empty {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  border: 1px dashed rgba(2, 6, 23, 0.15);
  background: rgba(248, 250, 252, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
  font-weight: 700;
  font-size: 12px;
}

.img-ops {
  display: flex;
  align-items: center;
  gap: 10px;
}

.hidden-file-input {
  display: none;
}

.img-url :deep(.el-input__wrapper) {
  opacity: 0.9;
}
</style>
