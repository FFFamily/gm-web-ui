<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import {
  owCommunityFavorite,
  owCommunityGetLoadout,
  owCommunityLike,
  owCommunityMyState,
  owCommunityUnfavorite,
  owCommunityUnlike
} from '~/api/owCommunity'
import { imageMap } from '~/assets/ow/imageMap'
import { useAccountAuthStore } from '~/stores/accountAuth'
import { pinia } from '~/stores/pinia'
import { owCategoryLabel, owQualityLabel } from '~/constants/owDict'
import { owFormatStatValue, owStatLabel } from '~/constants/owDict'
import { owStatColor } from '~/constants/owDict'

const route = useRoute()
const router = useRouter()
const accountAuth = useAccountAuthStore(pinia)

const id = computed(() => route.params.id)
const loading = ref(false)
const detail = ref(null)

const getItemImage = (item) => {
  if (item?.imgUrl) return item.imgUrl
  if (item?.imgKey && imageMap[item.imgKey]) return imageMap[item.imgKey]
  return null
}

const fetchDetail = async () => {
  loading.value = true
  try {
    detail.value = await owCommunityGetLoadout(id.value)
    if (accountAuth.token) {
      try {
        const st = await owCommunityMyState(id.value)
        detail.value = { ...(detail.value || {}), ...st }
      } catch {
        // ignore
      }
    }
  } finally {
    loading.value = false
  }
}

const formatLdt = (s) => (s ? String(s).replace('T', ' ') : '-')

const ensureLogin = () => {
  if (accountAuth.token) return true
  router.push({ path: '/account/login', query: { redirect: route.fullPath } })
  return false
}

const toggleLike = async () => {
  if (!ensureLogin()) return
  try {
    const liked = !!detail.value?.liked
    const st = liked ? await owCommunityUnlike(id.value) : await owCommunityLike(id.value)
    detail.value = { ...(detail.value || {}), ...st }
  } catch (e) {
    ElMessage.error(e?.message || '操作失败')
  }
}

const toggleFavorite = async () => {
  if (!ensureLogin()) return
  try {
    const favorited = !!detail.value?.favorited
    const st = favorited ? await owCommunityUnfavorite(id.value) : await owCommunityFavorite(id.value)
    detail.value = { ...(detail.value || {}), ...st }
  } catch (e) {
    ElMessage.error(e?.message || '操作失败')
  }
}

const copyShare = async () => {
  const url = `${window.location.origin}/ow/loadouts/${id.value}`
  try {
    await navigator.clipboard.writeText(url)
    ElMessage.success('已复制链接')
  } catch {
    ElMessage.warning('复制失败')
  }
}

const MAX_STAT = 110

const statSummary = computed(() => {
  const totals = detail.value?.statTotals || {}
  const list = Object.entries(totals)
    .map(([k, v]) => ({ key: k, value: Number(v ?? 0) }))
    .filter((x) => x.key && !Number.isNaN(x.value) && x.value !== 0)
    .sort((a, b) => Math.abs(b.value) - Math.abs(a.value))

  return list.map((x) => {
    const clamped = Math.max(-MAX_STAT, Math.min(MAX_STAT, x.value))
    const pct = Math.min(Math.abs(clamped), MAX_STAT) / MAX_STAT
    return {
      key: x.key,
      value: clamped,
      label: owStatLabel(x.key),
      color: owStatColor(x.key),
      // Element Plus Progress is 0..100. We normalize to MAX_STAT = 110%.
      percent: Math.round(pct * 100)
    }
  })
})

onMounted(fetchDetail)
</script>

<template>
  <div class="page">
    <div class="container">
      <el-page-header content="清单详情" @back="router.back()" />

      <div class="grid">
        <el-card shadow="never" class="card left" v-loading="loading">
          <template #header>
            <div class="head">
              <div class="title">
                <span v-if="detail?.pinned" class="badge badge-pinned">置顶</span>
                <span v-if="detail?.featured" class="badge badge-featured">精选</span>
                {{ detail?.title || '-' }}
              </div>
              <div class="hero">{{ detail?.heroName || '-' }}</div>
            </div>
          </template>

          <div class="meta">
            <span>作者：{{ detail?.authorName || '-' }}</span>
            <span>创建时间：{{ formatLdt(detail?.createdAt) }}</span>
            <span>总价：{{ detail?.totalPrice ?? 0 }}</span>
            <span>浏览：{{ detail?.viewCount ?? 0 }}</span>
            <span>点赞：{{ detail?.likeCount ?? 0 }}</span>
            <span>收藏：{{ detail?.favoriteCount ?? 0 }}</span>
          </div>

          <div class="actions">
            <el-button type="primary" plain @click="toggleLike">{{ detail?.liked ? '已点赞' : '点赞' }}</el-button>
            <el-button type="primary" plain @click="toggleFavorite">{{ detail?.favorited ? '已收藏' : '收藏' }}</el-button>
            <el-button @click="copyShare">分享</el-button>
          </div>

          <div v-if="detail?.description" class="desc">{{ detail.description }}</div>

          <el-divider content-position="left">装备列表</el-divider>
          <el-table :data="detail?.items || []" stripe>
            <el-table-column label="图片" width="76">
              <template #default="{ row }">
                <el-image v-if="getItemImage(row)" :src="getItemImage(row)" fit="cover" style="width: 44px; height: 44px; border-radius: 10px" />
                <div v-else class="img-fallback">{{ (row.itemName || '').charAt(0) }}</div>
              </template>
            </el-table-column>
            <el-table-column prop="itemName" label="名称" min-width="160" />
            <el-table-column prop="category" label="分类" width="100">
              <template #default="{ row }">{{ owCategoryLabel(row.category) }}</template>
            </el-table-column>
            <el-table-column prop="quality" label="品质" width="100">
              <template #default="{ row }">{{ owQualityLabel(row.quality) }}</template>
            </el-table-column>
            <el-table-column prop="price" label="价格" width="110" />
          </el-table>
        </el-card>

        <el-card shadow="never" class="card right" v-loading="loading">
          <template #header>
            <div class="side-head">
              <span class="side-title">属性汇总</span>
              <span class="side-sub">上限 {{ MAX_STAT }}%</span>
            </div>
          </template>

          <div v-if="statSummary.length === 0" class="muted">-</div>
          <div v-else class="stat-list">
            <div v-for="s in statSummary" :key="s.key" class="stat-row">
              <div class="stat-row-top">
                <div class="stat-name">{{ s.label }}</div>
                <div class="stat-val">{{ owFormatStatValue(s.key, s.value) }}</div>
              </div>
              <el-progress
                :percentage="s.percent"
                :color="s.color"
                :stroke-width="16"
                :show-text="false"
              />
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
  max-width: 1100px;
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
    grid-template-columns: 3fr 2fr;
    align-items: start;
  }
  .right {
    position: sticky;
    top: 92px;
  }
}

.head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.title {
  font-weight: 900;
  font-size: 18px;
  color: #0f172a;
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}

.hero {
  font-size: 12px;
  font-weight: 900;
  color: #0f766e;
  background: rgba(16, 185, 129, 0.12);
  border: 1px solid rgba(16, 185, 129, 0.22);
  padding: 6px 10px;
  border-radius: 999px;
}

.meta {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  color: #64748b;
  font-size: 12px;
  font-weight: 700;
}

.actions {
  margin-top: 12px;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.desc {
  margin-top: 10px;
  color: #334155;
  line-height: 1.7;
}

.badge {
  font-size: 12px;
  font-weight: 900;
  padding: 2px 8px;
  border-radius: 999px;
  border: 1px solid rgba(2, 6, 23, 0.08);
  background: rgba(2, 6, 23, 0.04);
  white-space: nowrap;
}

.badge-featured {
  color: #7c3aed;
  border-color: rgba(124, 58, 237, 0.25);
  background: rgba(124, 58, 237, 0.08);
}

.badge-pinned {
  color: #b45309;
  border-color: rgba(180, 83, 9, 0.25);
  background: rgba(180, 83, 9, 0.08);
}

.muted {
  color: #94a3b8;
  font-size: 12px;
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

.side-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 10px;
}

.side-title {
  font-weight: 900;
  color: #0f172a;
}

.side-sub {
  font-size: 12px;
  color: #64748b;
  font-weight: 800;
}

.stat-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.stat-row-top {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 6px;
}

.stat-name {
  font-weight: 900;
  color: #0f172a;
  font-size: 13px;
}

.stat-val {
  font-weight: 900;
  color: #0f172a;
  font-size: 12px;
}
</style>
