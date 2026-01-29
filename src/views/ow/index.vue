<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { owCommunityHeroStats, owCommunityListLoadouts } from '~/api/owCommunity'
import { listOwHeroes } from '~/api/ow'
import { useAccountAuthStore } from '~/stores/accountAuth'
import { pinia } from '~/stores/pinia'
import { imageMap } from '~/assets/ow/imageMap'

const router = useRouter()
const accountAuth = useAccountAuthStore(pinia)

const loading = ref(false)
const heroes = ref([])
const heroStats = ref([])
const featuredList = ref([])
const list = ref([])
const total = ref(0)

const query = reactive({
  page: 1,
  size: 20,
  heroCode: '',
  keyword: '',
  sort: 'newest'
})

const heroOptions = computed(() => [{ heroCode: '', heroName: '全部英雄' }, ...(heroes.value || [])])

const heroCountMap = computed(() => {
  const map = {}
  for (const h of heroStats.value || []) {
    map[h.heroCode] = Number(h.loadoutCount || 0)
  }
  return map
})

const heroMap = computed(() => {
  const map = {}
  for (const h of heroes.value || []) {
    map[h.heroCode] = h
  }
  return map
})

const activeHero = computed(() => (query.heroCode ? heroMap.value[query.heroCode] : null))

const getItemImage = (it) => {
  if (it?.imgUrl) return it.imgUrl
  if (it?.imgKey && imageMap[it.imgKey]) return imageMap[it.imgKey]
  return null
}

const statLabels = {
  damage: '伤害',
  cooldown: '冷却',
  health: '生命',
  lifesteal: '吸血',
  weaponStrength: '武器强度',
  skillStrength: '技能强度',
  attackSpeed: '攻速',
  cooldownReduction: '减CD',
  maxAmmo: '弹药',
  weaponLifesteal: '武器吸血',
  skillLifesteal: '技能吸血',
  moveSpeed: '移速',
  reloadSpeed: '装填',
  meleeDamage: '近战',
  criticalDamage: '暴伤'
}

const formatStat = (s) => {
  if (!s) return ''
  const key = s.key
  const v = Number(s.value || 0)
  const label = statLabels[key] || key
  const sign = v >= 0 ? '+' : ''
  return `${label} ${sign}${v}`
}

const fetchList = async () => {
  loading.value = true
  try {
    const data = await owCommunityListLoadouts({
      page: query.page,
      size: query.size,
      heroCode: query.heroCode || undefined,
      keyword: query.keyword?.trim() || undefined,
      sort: query.sort || 'newest'
    })
    list.value = data?.records || []
    total.value = Number(data?.total || 0)
  } finally {
    loading.value = false
  }
}

const fetchFeatured = async () => {
  try {
    const data = await owCommunityListLoadouts({ page: 1, size: 6, featured: true, sort: 'newest' })
    featuredList.value = data?.records || []
  } catch {
    featuredList.value = []
  }
}

const goDetail = (id) => router.push(`/ow/loadouts/${id}`)

const goCreate = () => {
  if (!accountAuth.token) {
    router.push({ path: '/account/login', query: { redirect: '/ow/loadouts/new' } })
    return
  }
  router.push('/ow/loadouts/new')
}

const formatLdt = (s) => (s ? String(s).replace('T', ' ') : '-')

const onPickHero = async (heroCode) => {
  query.heroCode = heroCode || ''
  query.page = 1
  await fetchList()
}

const copyShare = async (id) => {
  const url = `${window.location.origin}/ow/loadouts/${id}`
  try {
    await navigator.clipboard.writeText(url)
  } catch {
    // ignore
  }
}

onMounted(async () => {
  heroes.value = (await listOwHeroes()) || []
  heroStats.value = (await owCommunityHeroStats()) || []
  await fetchFeatured()
  await fetchList()
})
</script>

<template>
  <div class="ow-app">
    <div class="ow-container">
      <h1 class="ow-title">军械库社区</h1>
      <p class="ow-subtitle">按英雄浏览、按热度发现，看看大家都在用什么搭配。</p>

      <div class="hero-strip">
        <div
          v-for="h in heroes"
          :key="h.heroCode"
          :class="['hero-chip', { active: query.heroCode === h.heroCode }]"
          @click="onPickHero(h.heroCode)"
        >
          <div class="hero-avatar">
            <img v-if="h.avatarUrl" :src="h.avatarUrl" :alt="h.heroName" />
            <div v-else class="hero-avatar-fallback">{{ (h.heroName || '').slice(0, 1) }}</div>
          </div>
          <div class="hero-chip-info">
            <div class="hero-chip-name">{{ h.heroName }}</div>
            <div class="hero-chip-count">{{ heroCountMap[h.heroCode] ?? 0 }} 条</div>
          </div>
        </div>
      </div>

      <div v-if="activeHero" class="hero-head">
        <div class="hero-head-left">
          <div class="hero-head-avatar">
            <img v-if="activeHero.avatarUrl" :src="activeHero.avatarUrl" :alt="activeHero.heroName" />
            <div v-else class="hero-avatar-fallback">{{ (activeHero.heroName || '').slice(0, 1) }}</div>
          </div>
          <div class="hero-head-info">
            <div class="hero-head-name">{{ activeHero.heroName }}</div>
            <div v-if="activeHero.description" class="hero-head-desc">{{ activeHero.description }}</div>
          </div>
        </div>
        <div class="hero-head-right">
          <div class="hero-head-stat">
            <div class="k">清单数</div>
            <div class="v">{{ heroCountMap[activeHero.heroCode] ?? 0 }}</div>
          </div>
        </div>
      </div>

      <div class="ow-filters">
        <div class="ow-filter">
          <label class="ow-filter-label">英雄</label>
          <select
            v-model="query.heroCode"
            class="ow-select"
            @change="
              () => {
                query.page = 1
                fetchList()
              }
            "
          >
            <option v-for="h in heroOptions" :key="h.heroCode" :value="h.heroCode">
              {{ h.heroName }}
            </option>
          </select>
        </div>

        <div class="ow-filter">
          <label class="ow-filter-label">关键字</label>
          <input
            v-model="query.keyword"
            class="ow-input"
            placeholder="标题/描述"
            @keyup.enter="
              () => {
                query.page = 1
                fetchList()
              }
            "
          />
        </div>

        <div class="ow-filter">
          <label class="ow-filter-label">排序</label>
          <select
            v-model="query.sort"
            class="ow-select"
            @change="
              () => {
                query.page = 1
                fetchList()
              }
            "
          >
            <option value="newest">最新</option>
            <option value="hot">最热</option>
            <option value="views">浏览最多</option>
            <option value="likes">点赞最多</option>
            <option value="favorites">收藏最多</option>
          </select>
        </div>

        <div class="ow-filter-actions">
          <button
            class="btn btn-secondary"
            @click="
              () => {
                query.keyword = ''
                query.heroCode = ''
                query.page = 1
                query.sort = 'newest'
                fetchList()
              }
            "
          >
            重置
          </button>
          <button
            class="btn btn-primary"
            @click="
              () => {
                query.page = 1
                fetchList()
              }
            "
          >
            查询
          </button>
          <button class="btn btn-primary" @click="goCreate">创建清单</button>
        </div>
      </div>

      <div v-if="featuredList.length" class="featured">
        <div class="section-head">
          <div class="section-title">精选</div>
          <div class="section-sub">置顶/精选内容优先展示</div>
        </div>
        <div class="ow-grid">
          <div v-for="row in featuredList" :key="row.id" class="ow-card" @click="goDetail(row.id)">
            <div class="ow-card-head">
              <div class="ow-card-title">
                <span v-if="row.pinned" class="badge badge-pinned">置顶</span>
                <span v-if="row.featured" class="badge badge-featured">精选</span>
                {{ row.title }}
              </div>
              <div class="ow-card-hero">{{ row.heroName }}</div>
            </div>
            <div class="ow-card-preview">
              <div v-for="it in row.itemsPreview || []" :key="it.itemCode" class="mini">
                <img v-if="getItemImage(it)" :src="getItemImage(it)" :alt="it.itemName" />
                <div v-else class="mini-fallback">{{ (it.itemName || '').slice(0, 1) }}</div>
              </div>
            </div>
            <div class="ow-card-chips">
              <span v-for="s in row.topStats || []" :key="s.key" class="chip">{{ formatStat(s) }}</span>
            </div>
            <div class="ow-card-foot">
              <div class="foot-left">总价 {{ row.totalPrice ?? 0 }}</div>
              <div class="foot-right">
                <span>浏览 {{ row.viewCount ?? 0 }}</span>
                <span>赞 {{ row.likeCount ?? 0 }}</span>
                <span>藏 {{ row.favoriteCount ?? 0 }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="section-head">
        <div class="section-title">全部清单</div>
        <div class="section-sub">共 {{ total }} 条</div>
      </div>

      <div class="ow-list" v-loading="loading">
        <div v-if="list.length === 0" class="ow-empty">暂无清单</div>
        <div class="ow-grid">
          <div v-for="row in list" :key="row.id" class="ow-card" @click="goDetail(row.id)">
            <div class="ow-card-head">
              <div class="ow-card-title">
                <span v-if="row.pinned" class="badge badge-pinned">置顶</span>
                <span v-if="row.featured" class="badge badge-featured">精选</span>
                {{ row.title }}
              </div>
              <div class="ow-card-hero">{{ row.heroName }}</div>
            </div>
            <div v-if="row.description" class="ow-card-desc">{{ row.description }}</div>

            <div class="ow-card-preview">
              <div v-for="it in row.itemsPreview || []" :key="it.itemCode" class="mini">
                <img v-if="getItemImage(it)" :src="getItemImage(it)" :alt="it.itemName" />
                <div v-else class="mini-fallback">{{ (it.itemName || '').slice(0, 1) }}</div>
              </div>
            </div>

            <div class="ow-card-chips">
              <span v-for="s in row.topStats || []" :key="s.key" class="chip">{{ formatStat(s) }}</span>
            </div>

            <div class="ow-card-meta">
              <span class="ow-card-author">作者：{{ row.authorName || '-' }}</span>
              <span class="ow-card-time">{{ formatLdt(row.createdAt) }}</span>
            </div>

            <div class="ow-card-foot">
              <div class="foot-left">
                <span>总价 {{ row.totalPrice ?? 0 }}</span>
                <span class="dot">·</span>
                <span>武器{{ row.categoryCounts?.weapon ?? 0 }}</span>
                <span>技能{{ row.categoryCounts?.skill ?? 0 }}</span>
                <span>生存{{ row.categoryCounts?.survival ?? 0 }}</span>
                <span>装置{{ row.categoryCounts?.device ?? 0 }}</span>
              </div>
              <div class="foot-right">
                <span>浏览 {{ row.viewCount ?? 0 }}</span>
                <span>赞 {{ row.likeCount ?? 0 }}</span>
                <span>藏 {{ row.favoriteCount ?? 0 }}</span>
                <button class="link" @click.stop="copyShare(row.id)">分享</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="ow-pager">
        <button
          class="btn btn-secondary"
          :disabled="query.page <= 1"
          @click="
            () => {
              query.page -= 1
              fetchList()
            }
          "
        >
          上一页
        </button>
        <div class="ow-pager-info">第 {{ query.page }} 页 / 共 {{ total }} 条</div>
        <button
          class="btn btn-secondary"
          :disabled="query.page * query.size >= total"
          @click="
            () => {
              query.page += 1
              fetchList()
            }
          "
        >
          下一页
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.ow-app {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  min-height: 100vh;
  background-color: #ffffff;
  color: #111827;
  padding-top: 5rem;
}

.ow-container {
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  padding-left: 1rem;
  padding-right: 1rem;
  padding-top: 1.5rem;
  padding-bottom: 1.5rem;
}

@media (min-width: 640px) {
  .ow-container {
    max-width: 640px;
  }
}

@media (min-width: 768px) {
  .ow-container {
    max-width: 768px;
  }
}

@media (min-width: 1024px) {
  .ow-container {
    max-width: 1024px;
  }
}

@media (min-width: 1280px) {
  .ow-container {
    max-width: 1280px;
  }
}

@media (min-width: 1536px) {
  .ow-container {
    max-width: 1536px;
  }
}

.ow-title {
  font-size: 2.25rem;
  line-height: 2.5rem;
  font-weight: 900;
  text-align: center;
  margin-bottom: 0.6rem;
  color: #111827;
}

.ow-subtitle {
  text-align: center;
  color: #64748b;
  margin-bottom: 1.5rem;
}

.hero-strip {
  display: flex;
  gap: 10px;
  overflow-x: auto;
  padding: 8px 4px 12px;
  margin-bottom: 8px;
}

.hero-chip {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  gap: 10px;
  border: 1px solid rgba(2, 6, 23, 0.08);
  border-radius: 16px;
  padding: 8px 10px;
  cursor: pointer;
  background: rgba(248, 250, 252, 0.7);
  transition: transform 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease;
}

.hero-chip.active {
  border-color: rgba(16, 185, 129, 0.6);
  box-shadow: 0 12px 30px rgba(16, 185, 129, 0.12);
}

.hero-chip:hover {
  transform: translateY(-1px);
}

.hero-avatar {
  width: 34px;
  height: 34px;
  border-radius: 999px;
  overflow: hidden;
  border: 1px solid rgba(2, 6, 23, 0.08);
  background: rgba(2, 6, 23, 0.04);
  display: flex;
  align-items: center;
  justify-content: center;
}

.hero-avatar img {
  width: 34px;
  height: 34px;
  object-fit: cover;
}

.hero-avatar-fallback {
  font-weight: 900;
  color: rgba(2, 6, 23, 0.65);
}

.hero-chip-name {
  font-weight: 900;
  font-size: 12px;
  color: #0f172a;
  line-height: 1.2;
}

.hero-chip-count {
  font-weight: 800;
  font-size: 12px;
  color: #64748b;
  margin-top: 2px;
}

.hero-head {
  border: 1px solid rgba(2, 6, 23, 0.08);
  border-radius: 18px;
  padding: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
  background: linear-gradient(135deg, rgba(240, 253, 244, 0.55) 0%, rgba(248, 250, 252, 0.75) 70%);
}

.hero-head-left {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}

.hero-head-avatar {
  width: 46px;
  height: 46px;
  border-radius: 999px;
  overflow: hidden;
  border: 1px solid rgba(2, 6, 23, 0.1);
  background: rgba(2, 6, 23, 0.04);
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
}

.hero-head-avatar img {
  width: 46px;
  height: 46px;
  object-fit: cover;
}

.hero-head-info {
  min-width: 0;
}

.hero-head-name {
  font-weight: 900;
  color: #0f172a;
}

.hero-head-desc {
  margin-top: 2px;
  font-size: 12px;
  color: #64748b;
  line-height: 1.4;
  max-width: 720px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.hero-head-stat .k {
  font-size: 12px;
  color: #64748b;
  font-weight: 800;
}

.hero-head-stat .v {
  font-size: 20px;
  font-weight: 900;
  color: #0f172a;
  text-align: right;
}

.ow-filters {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 14px;
  background: #ffffff;
  position: sticky;
  top: 86px;
  z-index: 10;
}

@media (min-width: 768px) {
  .ow-filters {
    grid-template-columns: 220px 1fr 180px auto;
    align-items: end;
  }
}

.ow-filter-label {
  display: block;
  font-size: 12px;
  font-weight: 800;
  color: #64748b;
  margin-bottom: 6px;
}

.ow-select,
.ow-input {
  width: 100%;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 10px 12px;
  outline: none;
  background: #ffffff;
}

.ow-filter-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.btn {
  border: 1px solid #e5e7eb;
  border-radius: 999px;
  padding: 10px 14px;
  background: #ffffff;
  cursor: pointer;
  font-weight: 800;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-primary {
  border-color: rgba(16, 185, 129, 0.35);
  background: rgba(16, 185, 129, 0.12);
  color: #065f46;
}

.btn-secondary {
  background: #f8fafc;
  color: #334155;
}

.ow-list {
  margin-top: 12px;
}

.section-head {
  margin-top: 14px;
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 10px;
}

.section-title {
  font-weight: 900;
  color: #0f172a;
}

.section-sub {
  font-size: 12px;
  color: #64748b;
  font-weight: 800;
}

.featured {
  margin-top: 14px;
}

.ow-grid {
  margin-top: 10px;
  display: grid;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  gap: 12px;
}

@media (min-width: 768px) {
  .ow-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (min-width: 1200px) {
  .ow-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

.ow-card {
  border: 1px solid rgba(2, 6, 23, 0.08);
  background: rgba(255, 255, 255, 0.9);
  border-radius: 14px;
  padding: 14px;
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.ow-card:hover {
  transform: translateY(-1px);
  box-shadow: 0 10px 30px rgba(2, 6, 23, 0.08);
}

.ow-card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.ow-card-title {
  font-weight: 900;
  color: #0f172a;
  font-size: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  min-width: 0;
  flex: 1;
}

.ow-card-hero {
  flex: 0 0 auto;
  font-size: 12px;
  font-weight: 900;
  color: #0f766e;
  background: rgba(16, 185, 129, 0.12);
  border: 1px solid rgba(16, 185, 129, 0.22);
  padding: 6px 10px;
  border-radius: 999px;
}

.ow-card-desc {
  margin-top: 8px;
  color: #475569;
  font-size: 13px;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
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

.ow-card-preview {
  margin-top: 10px;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.mini {
  width: 36px;
  height: 36px;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid rgba(2, 6, 23, 0.08);
  background: rgba(2, 6, 23, 0.04);
  display: flex;
  align-items: center;
  justify-content: center;
}

.mini img {
  width: 36px;
  height: 36px;
  object-fit: cover;
}

.mini-fallback {
  font-weight: 900;
  color: rgba(2, 6, 23, 0.6);
}

.ow-card-chips {
  margin-top: 10px;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.chip {
  font-size: 12px;
  font-weight: 900;
  color: #0f172a;
  background: rgba(2, 6, 23, 0.04);
  border: 1px solid rgba(2, 6, 23, 0.06);
  padding: 4px 8px;
  border-radius: 999px;
}

.ow-card-meta {
  margin-top: 10px;
  display: flex;
  justify-content: space-between;
  gap: 10px;
  font-size: 12px;
  color: #64748b;
}

.ow-card-foot {
  margin-top: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  font-size: 12px;
  color: #64748b;
  font-weight: 800;
  border-top: 1px dashed rgba(2, 6, 23, 0.08);
  padding-top: 10px;
}

.foot-left {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}

.dot {
  opacity: 0.6;
}

.foot-right {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 0 0 auto;
}

.link {
  border: none;
  background: transparent;
  color: #0f766e;
  font-weight: 900;
  cursor: pointer;
}

.ow-empty {
  padding: 20px;
  text-align: center;
  color: #64748b;
  border: 1px dashed rgba(2, 6, 23, 0.18);
  border-radius: 12px;
}

.ow-pager {
  margin-top: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
}

.ow-pager-info {
  font-size: 12px;
  color: #64748b;
  font-weight: 800;
}
</style>
