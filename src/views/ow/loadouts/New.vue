<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { listOwHeroes, listOwItems } from '~/api/ow'
import { owCommunityCreateLoadout } from '~/api/owCommunity'
import { imageMap } from '~/assets/ow/imageMap'
import { owCategoryLabel, owQualityLabel } from '~/constants/owDict'
import { owFormatStatValue, owStatLabel } from '~/constants/owDict'

const router = useRouter()

const heroes = ref([])
const items = ref([])
const loadingItems = ref(false)
const saving = ref(false)
const activeTab = ref('weapon')
const hoveredItem = ref(null)

const form = reactive({
  heroCode: '',
  title: '',
  description: ''
})

const selected = ref([]) // item objects, max 6

const tabs = [
  { key: 'weapon', label: '武器' },
  { key: 'skill', label: '技能' },
  { key: 'survival', label: '生存' },
  { key: 'device', label: '装置' }
]

const qualityColors = {
  green: 'item-quality-green',
  blue: 'item-quality-blue',
  purple: 'item-quality-purple'
}

const getItemImage = (item) => {
  if (item?.imgUrl) return item.imgUrl
  if (item?.imgKey && imageMap[item.imgKey]) return imageMap[item.imgKey]
  return null
}

// 按品质分组（3列：绿/蓝/紫）
const itemsByQuality = computed(() => {
  const grouped = { green: [], blue: [], purple: [] }
  for (const it of items.value || []) {
    if (grouped[it.quality]) grouped[it.quality].push(it)
  }
  return grouped
})

const selectedCodes = computed(() => new Set((selected.value || []).map((i) => i.itemCode)))

const addItem = (item) => {
  if (!item) return
  if (selected.value.length >= 6) return ElMessage.warning('最多选择 6 件装备')
  if (selectedCodes.value.has(item.itemCode)) return
  selected.value.push(item)
}

const togglePick = (item) => {
  if (!item) return
  const idx = selected.value.findIndex((i) => i.itemCode === item.itemCode)
  if (idx >= 0) {
    selected.value.splice(idx, 1)
    return
  }
  addItem(item)
}

const removeItem = (idx) => {
  selected.value.splice(idx, 1)
}

const resetAll = () => {
  form.heroCode = ''
  form.title = ''
  form.description = ''
  items.value = []
  selected.value = []
  activeTab.value = 'weapon'
}

const loadItems = async (resetSelected = false) => {
  if (!form.heroCode) {
    items.value = []
    if (resetSelected) selected.value = []
    return
  }
  loadingItems.value = true
  try {
    const data = await listOwItems({ heroCode: form.heroCode, category: activeTab.value })
    items.value = (data || []).map((i) => ({
      itemCode: i.itemCode,
      itemName: i.itemName,
      price: i.price,
      quality: i.quality,
      category: i.category,
      imgKey: i.imgKey,
      imgUrl: i.imgUrl,
      stats: i.stats || {}
    }))
    if (resetSelected) selected.value = []
  } finally {
    loadingItems.value = false
  }
}

const switchTab = async (key) => {
  activeTab.value = key
  await loadItems(false)
}

const getStatLabel = (key) => owStatLabel(key)
const getStatValue = (key, value) => owFormatStatValue(key, value)

const publish = async () => {
  if (!form.heroCode) return ElMessage.warning('请选择英雄')
  const title = form.title.trim()
  if (!title) return ElMessage.warning('请输入标题')
  if (selected.value.length === 0) return ElMessage.warning('请至少选择 1 件装备')

  saving.value = true
  try {
    const res = await owCommunityCreateLoadout({
      heroCode: form.heroCode,
      title,
      description: form.description?.trim() || null,
      itemCodes: selected.value.map((i) => i.itemCode)
    })
    ElMessage.success('已发布')
    router.replace(`/ow/loadouts/${res.id}`)
  } finally {
    saving.value = false
  }
}

onMounted(async () => {
  heroes.value = (await listOwHeroes()) || []
})
</script>

<template>
  <div class="page">
    <div class="container">
      <el-page-header content="创建装备清单" @back="router.back()" />

      <el-card shadow="never" class="card">
        <el-form label-width="90px">
          <el-form-item label="英雄" required>
            <el-select v-model="form.heroCode" placeholder="选择英雄" style="width: 320px" @change="() => loadItems(true)">
              <el-option v-for="h in heroes" :key="h.heroCode" :label="h.heroName" :value="h.heroCode" />
            </el-select>
          </el-form-item>
          <el-form-item label="标题" required>
            <el-input v-model="form.title" placeholder="例如：士兵76 通用武器流" maxlength="128" show-word-limit />
          </el-form-item>
          <el-form-item label="描述">
            <el-input v-model="form.description" type="textarea" :rows="3" maxlength="512" show-word-limit placeholder="简单介绍一下思路（可选）" />
          </el-form-item>
        </el-form>
      </el-card>

      <div class="grid">
        <el-card shadow="never" class="card" v-loading="loadingItems">
          <template #header>
            <div class="card-head">
              <span>选择装备（最多 6）</span>
            </div>
          </template>

          <div v-if="!form.heroCode" class="hint">请先选择英雄</div>
          <div v-else>
            <div class="store-tabs">
              <button
                v-for="tab in tabs"
                :key="tab.key"
                :class="['store-tab', { 'store-tab-active': activeTab === tab.key }]"
                @click="switchTab(tab.key)"
              >
                {{ tab.label }}
              </button>
            </div>

            <div class="store-quality-grid">
              <div class="store-quality-column">
                <div class="quality-items">
                  <div
                    v-for="it in itemsByQuality.green"
                    :key="it.itemCode"
                    :class="[
                      'store-item',
                      qualityColors[it.quality],
                      selectedCodes.has(it.itemCode) ? 'store-item-selected' : '',
                      !selectedCodes.has(it.itemCode) && selected.length >= 6 ? 'store-item-disabled' : 'store-item-pickable'
                    ]"
                    @click="!selectedCodes.has(it.itemCode) && selected.length >= 6 ? null : togglePick(it)"
                    @mouseenter="hoveredItem = it"
                    @mouseleave="hoveredItem = null"
                  >
                    <div class="store-item-content">
                      <div class="store-item-image-wrapper">
                        <img v-if="getItemImage(it)" :src="getItemImage(it)" :alt="it.itemName" class="store-item-image" />
                        <div v-else class="store-item-image-placeholder">{{ (it.itemName || '').charAt(0) }}</div>
                      </div>
                      <div class="store-item-info">
                        <div class="store-item-name">{{ it.itemName }}</div>
                        <div class="store-item-price">{{ it.price }} 金币</div>
                      </div>
                    </div>

                    <div v-if="!selectedCodes.has(it.itemCode) && selected.length >= 6" class="store-item-warning">装备栏已满</div>

                    <div
                      v-if="hoveredItem === it && it.stats && Object.keys(it.stats).length > 0"
                      class="store-item-tooltip"
                    >
                      <div class="tooltip-title">效果</div>
                      <div class="tooltip-stats">
                        <div v-for="(value, key) in it.stats" :key="key" class="tooltip-stat">
                          <span class="tooltip-stat-label">{{ getStatLabel(key) }}</span>
                          <span class="tooltip-stat-value">{{ getStatValue(key, value) }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="store-quality-column">
                <div class="quality-items">
                  <div
                    v-for="it in itemsByQuality.blue"
                    :key="it.itemCode"
                    :class="[
                      'store-item',
                      qualityColors[it.quality],
                      selectedCodes.has(it.itemCode) ? 'store-item-selected' : '',
                      !selectedCodes.has(it.itemCode) && selected.length >= 6 ? 'store-item-disabled' : 'store-item-pickable'
                    ]"
                    @click="!selectedCodes.has(it.itemCode) && selected.length >= 6 ? null : togglePick(it)"
                    @mouseenter="hoveredItem = it"
                    @mouseleave="hoveredItem = null"
                  >
                    <div class="store-item-content">
                      <div class="store-item-image-wrapper">
                        <img v-if="getItemImage(it)" :src="getItemImage(it)" :alt="it.itemName" class="store-item-image" />
                        <div v-else class="store-item-image-placeholder">{{ (it.itemName || '').charAt(0) }}</div>
                      </div>
                      <div class="store-item-info">
                        <div class="store-item-name">{{ it.itemName }}</div>
                        <div class="store-item-price">{{ it.price }} 金币</div>
                      </div>
                    </div>

                    <div v-if="!selectedCodes.has(it.itemCode) && selected.length >= 6" class="store-item-warning">装备栏已满</div>

                    <div
                      v-if="hoveredItem === it && it.stats && Object.keys(it.stats).length > 0"
                      class="store-item-tooltip"
                    >
                      <div class="tooltip-title">效果</div>
                      <div class="tooltip-stats">
                        <div v-for="(value, key) in it.stats" :key="key" class="tooltip-stat">
                          <span class="tooltip-stat-label">{{ getStatLabel(key) }}</span>
                          <span class="tooltip-stat-value">{{ getStatValue(key, value) }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="store-quality-column">
                <div class="quality-items">
                  <div
                    v-for="it in itemsByQuality.purple"
                    :key="it.itemCode"
                    :class="[
                      'store-item',
                      qualityColors[it.quality],
                      selectedCodes.has(it.itemCode) ? 'store-item-selected' : '',
                      !selectedCodes.has(it.itemCode) && selected.length >= 6 ? 'store-item-disabled' : 'store-item-pickable'
                    ]"
                    @click="!selectedCodes.has(it.itemCode) && selected.length >= 6 ? null : togglePick(it)"
                    @mouseenter="hoveredItem = it"
                    @mouseleave="hoveredItem = null"
                  >
                    <div class="store-item-content">
                      <div class="store-item-image-wrapper">
                        <img v-if="getItemImage(it)" :src="getItemImage(it)" :alt="it.itemName" class="store-item-image" />
                        <div v-else class="store-item-image-placeholder">{{ (it.itemName || '').charAt(0) }}</div>
                      </div>
                      <div class="store-item-info">
                        <div class="store-item-name">{{ it.itemName }}</div>
                        <div class="store-item-price">{{ it.price }} 金币</div>
                      </div>
                    </div>

                    <div v-if="!selectedCodes.has(it.itemCode) && selected.length >= 6" class="store-item-warning">装备栏已满</div>

                    <div
                      v-if="hoveredItem === it && it.stats && Object.keys(it.stats).length > 0"
                      class="store-item-tooltip"
                    >
                      <div class="tooltip-title">效果</div>
                      <div class="tooltip-stats">
                        <div v-for="(value, key) in it.stats" :key="key" class="tooltip-stat">
                          <span class="tooltip-stat-label">{{ getStatLabel(key) }}</span>
                          <span class="tooltip-stat-value">{{ getStatValue(key, value) }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-card>

        <el-card shadow="never" class="card">
          <template #header>
            <div class="card-head">
              <span>已选装备（{{ selected.length }}/6）</span>
              <div class="actions">
                <el-button @click="resetAll">重置</el-button>
                <el-button type="primary" :loading="saving" @click="publish">发布清单</el-button>
              </div>
            </div>
          </template>

          <div v-if="selected.length === 0" class="empty">暂未选择装备</div>
          <div v-else class="selected-list">
            <div v-for="(it, idx) in selected" :key="it.itemCode" class="selected-item">
              <div class="selected-left">
                <el-image
                  v-if="getItemImage(it)"
                  :src="getItemImage(it)"
                  fit="cover"
                  style="width: 40px; height: 40px; border-radius: 10px"
                />
                <div v-else class="img-fallback small">{{ (it.itemName || '').charAt(0) }}</div>
                <div class="selected-info">
                  <div class="selected-name">{{ it.itemName }}</div>
                  <div class="selected-meta">{{ owCategoryLabel(it.category) }} · {{ owQualityLabel(it.quality) }} · {{ it.price }} 金币</div>
                </div>
              </div>
              <el-button type="danger" plain size="small" @click="removeItem(idx)">移除</el-button>
            </div>
          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page {
  padding-top: 5rem;
  background: #ffffff;
  min-height: 100vh;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 18px 16px;
}

.card {
  margin-top: 14px;
}

.grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 14px;
}

@media (min-width: 1024px) {
  .grid {
    grid-template-columns: 2fr 1fr;
  }
}

.card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.hint {
  padding: 18px 12px;
  color: #64748b;
}

/* 仿“军械库模拟器”的选择体验：顶部 Tab + 3 列品质 */
.store-tabs {
  display: flex;
  gap: 10px;
  margin: 6px 0 14px;
  flex-wrap: wrap;
}

.store-tab {
  padding: 8px 12px;
  border-radius: 999px;
  border: 1px solid rgba(16, 185, 129, 0.25);
  background: rgba(240, 253, 244, 0.6);
  color: #065f46;
  font-weight: 800;
  cursor: pointer;
}

.store-tab-active {
  border-color: rgba(16, 185, 129, 0.7);
  background: rgba(16, 185, 129, 0.12);
}

.store-quality-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 14px;
}

@media (min-width: 900px) {
  .store-quality-grid {
    grid-template-columns: 1fr 1fr 1fr;
  }
}

.store-quality-column {
  min-width: 0;
}

.quality-items {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.store-item {
  position: relative;
  border-radius: 14px;
  border: 1px solid rgba(2, 6, 23, 0.08);
  padding: 10px 10px 12px;
  background: #ffffff;
  transition: transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease;
}

.store-item-pickable {
  cursor: pointer;
}

.store-item-pickable:hover {
  transform: translateY(-1px);
  box-shadow: 0 16px 36px rgba(2, 44, 34, 0.08);
}

.store-item-disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.store-item-selected {
  border-color: rgba(16, 185, 129, 0.8);
  box-shadow: 0 10px 30px rgba(16, 185, 129, 0.15);
}

.item-quality-green {
  background: linear-gradient(135deg, rgba(34, 197, 94, 0.06) 0%, rgba(255, 255, 255, 1) 60%);
}

.item-quality-blue {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.06) 0%, rgba(255, 255, 255, 1) 60%);
}

.item-quality-purple {
  background: linear-gradient(135deg, rgba(168, 85, 247, 0.06) 0%, rgba(255, 255, 255, 1) 60%);
}

.store-item-content {
  display: flex;
  align-items: center;
  gap: 10px;
}

.store-item-image-wrapper {
  width: 46px;
  height: 46px;
  border-radius: 999px;
  overflow: hidden;
  background: rgba(2, 6, 23, 0.04);
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
}

.store-item-image {
  width: 46px;
  height: 46px;
  object-fit: cover;
}

.store-item-image-placeholder {
  font-weight: 900;
  color: rgba(2, 6, 23, 0.55);
}

.store-item-info {
  min-width: 0;
  flex: 1;
}

.store-item-name {
  font-weight: 900;
  color: #0f172a;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.store-item-price {
  margin-top: 2px;
  font-size: 12px;
  color: #64748b;
  font-weight: 800;
}

.store-item-warning {
  margin-top: 6px;
  font-size: 12px;
  color: #b45309;
  font-weight: 800;
}

.store-item-tooltip {
  position: absolute;
  left: 12px;
  right: 12px;
  top: calc(100% + 8px);
  z-index: 10;
  background: rgba(15, 23, 42, 0.95);
  color: #ffffff;
  padding: 10px 10px 8px;
  border-radius: 12px;
  box-shadow: 0 26px 70px rgba(2, 6, 23, 0.35);
}

.tooltip-title {
  font-weight: 900;
  margin-bottom: 6px;
}

.tooltip-stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px 10px;
}

.tooltip-stat {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  font-size: 12px;
}

.tooltip-stat-label {
  color: rgba(255, 255, 255, 0.75);
}

.tooltip-stat-value {
  font-weight: 900;
}

.filters {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.actions {
  display: flex;
  gap: 10px;
}

.empty {
  color: #64748b;
  text-align: center;
  padding: 22px 0;
}

.selected-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.selected-item {
  border: 1px solid rgba(2, 6, 23, 0.08);
  border-radius: 12px;
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.selected-left {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
}

.selected-info {
  min-width: 0;
}

.selected-name {
  font-weight: 900;
  color: #0f172a;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.selected-meta {
  margin-top: 2px;
  font-size: 12px;
  color: #64748b;
}

.img-fallback {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  border: 1px dashed rgba(2, 6, 23, 0.18);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 900;
  color: #0f172a;
  background: rgba(248, 250, 252, 0.8);
}

.img-fallback.small {
  width: 40px;
  height: 40px;
}
</style>
