<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { owLfgListTeams } from '~/api/owLfg'
import TeamCard from '~/components/ow/lfg/TeamCard.vue'
import { useAccountAuthStore } from '~/stores/accountAuth'
import { pinia } from '~/stores/pinia'
import { OW_LFG_MODE_OPTIONS, OW_LFG_PLATFORM_OPTIONS, OW_LFG_ROLE_OPTIONS } from '~/constants/owLfgDict'

const router = useRouter()
const accountAuth = useAccountAuthStore(pinia)

const loading = ref(false)
const list = ref([])
const total = ref(0)

const query = reactive({
  page: 1,
  size: 20,
  keyword: '',
  modeCode: '',
  platformCode: '',
  voiceRequired: '',
  needRole: ''
})

const voiceOptions = computed(() => [
  { value: '', label: '语音不限' },
  { value: 0, label: '不需要语音' },
  { value: 1, label: '语音可选' },
  { value: 2, label: '必须语音' }
])

const fetchList = async () => {
  loading.value = true
  try {
    const data = await owLfgListTeams({
      page: query.page,
      size: query.size,
      keyword: query.keyword?.trim() || undefined,
      modeCode: query.modeCode || undefined,
      platformCode: query.platformCode || undefined,
      voiceRequired: query.voiceRequired === '' ? undefined : Number(query.voiceRequired),
      needRole: query.needRole || undefined,
      status: 'OPEN'
    })
    list.value = data?.records || []
    total.value = Number(data?.total || 0)
  } finally {
    loading.value = false
  }
}

const goCreate = () => {
  if (!accountAuth.token) {
    router.push({ path: '/account/login', query: { redirect: '/ow/lfg/new' } })
    return
  }
  router.push('/ow/lfg/new')
}

const goInvite = (t) => {
  if (!t?.inviteCode) return
  router.push(`/ow/lfg/t/${t.inviteCode}`)
}

const totalPages = computed(() => {
  const s = Number(query.size || 20)
  if (!s) return 1
  return Math.max(1, Math.ceil(Number(total.value || 0) / s))
})
</script>

<template>
  <div class="lfg-app">
    <div class="lfg-container">
      <div class="lfg-head">
        <div>
          <h1 class="lfg-title">OW 组队大厅</h1>
          <p class="lfg-subtitle">一键发车、复制邀请，朋友点开就能加入。</p>
        </div>
        <button class="lfg-btn lfg-btn--primary" @click="goCreate">创建队伍</button>
      </div>

      <div class="lfg-filters">
        <div class="lfg-filter">
          <label class="lfg-label">关键字</label>
          <input
            v-model="query.keyword"
            class="lfg-input"
            placeholder="队伍标题/备注"
            @keyup.enter="
              () => {
                query.page = 1
                fetchList()
              }
            "
          />
        </div>

        <div class="lfg-filter">
          <label class="lfg-label">模式</label>
          <select
            v-model="query.modeCode"
            class="lfg-select"
            @change="
              () => {
                query.page = 1
                fetchList()
              }
            "
          >
            <option value="">全部</option>
            <option v-for="o in OW_LFG_MODE_OPTIONS" :key="o.value" :value="o.value">{{ o.label }}</option>
          </select>
        </div>

        <div class="lfg-filter">
          <label class="lfg-label">平台</label>
          <select
            v-model="query.platformCode"
            class="lfg-select"
            @change="
              () => {
                query.page = 1
                fetchList()
              }
            "
          >
            <option value="">全部</option>
            <option v-for="o in OW_LFG_PLATFORM_OPTIONS" :key="o.value" :value="o.value">{{ o.label }}</option>
          </select>
        </div>

        <div class="lfg-filter">
          <label class="lfg-label">语音</label>
          <select
            v-model="query.voiceRequired"
            class="lfg-select"
            @change="
              () => {
                query.page = 1
                fetchList()
              }
            "
          >
            <option v-for="o in voiceOptions" :key="String(o.value)" :value="o.value">{{ o.label }}</option>
          </select>
        </div>

        <div class="lfg-filter">
          <label class="lfg-label">位置需求</label>
          <select
            v-model="query.needRole"
            class="lfg-select"
            @change="
              () => {
                query.page = 1
                fetchList()
              }
            "
          >
            <option value="">不限</option>
            <option v-for="o in OW_LFG_ROLE_OPTIONS" :key="o.value" :value="o.value">{{ o.label }}</option>
          </select>
        </div>

        <div class="lfg-filter-actions">
          <button
            class="lfg-btn"
            @click="
              () => {
                query.keyword = ''
                query.modeCode = ''
                query.platformCode = ''
                query.voiceRequired = ''
                query.needRole = ''
                query.page = 1
                fetchList()
              }
            "
          >
            重置
          </button>
          <button
            class="lfg-btn lfg-btn--primary"
            :disabled="loading"
            @click="
              () => {
                query.page = 1
                fetchList()
              }
            "
          >
            {{ loading ? '加载中…' : '查询' }}
          </button>
        </div>
      </div>

      <div v-if="!loading && !list.length" class="lfg-empty">
        <div class="lfg-empty-title">还没有可加入的队伍</div>
        <div class="lfg-empty-sub">现在创建一个，生成邀请链接分享给朋友。</div>
        <button class="lfg-btn lfg-btn--primary" @click="goCreate">创建队伍</button>
      </div>

      <div class="lfg-grid">
        <TeamCard v-for="t in list" :key="t.id" :team="t" @click="goInvite(t)" />
      </div>

      <div v-if="totalPages > 1" class="lfg-pager">
        <button class="lfg-btn" :disabled="query.page <= 1 || loading" @click="(query.page--, fetchList())">上一页</button>
        <div class="lfg-page-text">第 {{ query.page }} / {{ totalPages }} 页（共 {{ total }} 条）</div>
        <button class="lfg-btn" :disabled="query.page >= totalPages || loading" @click="(query.page++, fetchList())">下一页</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.lfg-app {
  min-height: 100vh;
  color: #e2e8f0;
  padding-top: 5rem;
  background: radial-gradient(1000px 500px at 15% 0%, rgba(124, 58, 237, 0.35) 0%, rgba(15, 15, 35, 1) 55%),
    radial-gradient(900px 600px at 80% 10%, rgba(244, 63, 94, 0.18) 0%, rgba(15, 15, 35, 1) 60%),
    #0f0f23;
}

.lfg-container {
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  padding: 1.5rem 1rem 2rem;
}

@media (min-width: 768px) {
  .lfg-container {
    max-width: 1040px;
  }
}

.lfg-head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 14px;
}

.lfg-title {
  font-size: 2rem;
  line-height: 2.2rem;
  font-weight: 1000;
  letter-spacing: 0.3px;
  margin: 0;
}

.lfg-subtitle {
  margin: 6px 0 0;
  color: rgba(226, 232, 240, 0.65);
  font-weight: 700;
}

.lfg-filters {
  border: 1px solid rgba(226, 232, 240, 0.12);
  background: rgba(15, 15, 35, 0.7);
  border-radius: 18px;
  padding: 12px;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
  margin-bottom: 14px;
  box-shadow: 0 16px 60px rgba(0, 0, 0, 0.35);
}

@media (min-width: 900px) {
  .lfg-filters {
    grid-template-columns: repeat(5, minmax(0, 1fr));
    align-items: end;
  }
}

.lfg-filter {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.lfg-label {
  font-size: 12px;
  font-weight: 900;
  color: rgba(226, 232, 240, 0.7);
}

.lfg-input,
.lfg-select {
  border: 1px solid rgba(226, 232, 240, 0.14);
  background: rgba(2, 6, 23, 0.35);
  color: rgba(226, 232, 240, 0.92);
  border-radius: 12px;
  padding: 10px 12px;
  font-weight: 800;
  outline: none;
}

.lfg-input:focus,
.lfg-select:focus {
  border-color: rgba(167, 139, 250, 0.65);
  box-shadow: 0 0 0 4px rgba(124, 58, 237, 0.18);
}

.lfg-filter-actions {
  display: flex;
  gap: 8px;
  align-items: center;
  grid-column: 1 / -1;
}

@media (min-width: 900px) {
  .lfg-filter-actions {
    grid-column: auto;
    justify-content: flex-end;
  }
}

.lfg-btn {
  border: 1px solid rgba(226, 232, 240, 0.18);
  background: rgba(2, 6, 23, 0.35);
  color: rgba(226, 232, 240, 0.9);
  border-radius: 12px;
  padding: 10px 14px;
  font-weight: 900;
  cursor: pointer;
  transition: transform 180ms ease, border-color 180ms ease, box-shadow 180ms ease;
}

.lfg-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  border-color: rgba(167, 139, 250, 0.55);
  box-shadow: 0 16px 45px rgba(0, 0, 0, 0.35);
}

.lfg-btn:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.lfg-btn--primary {
  border-color: rgba(244, 63, 94, 0.55);
  background: linear-gradient(135deg, rgba(244, 63, 94, 0.95) 0%, rgba(124, 58, 237, 0.9) 55%, rgba(167, 139, 250, 0.85) 100%);
  box-shadow: 0 14px 40px rgba(244, 63, 94, 0.18);
}

.lfg-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
}

@media (min-width: 900px) {
  .lfg-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

.lfg-empty {
  border: 1px dashed rgba(226, 232, 240, 0.18);
  background: rgba(15, 15, 35, 0.55);
  border-radius: 18px;
  padding: 20px;
  text-align: center;
  margin: 18px 0;
}

.lfg-empty-title {
  font-weight: 1000;
  font-size: 16px;
}

.lfg-empty-sub {
  margin-top: 6px;
  color: rgba(226, 232, 240, 0.65);
  font-weight: 800;
}

.lfg-pager {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-top: 16px;
}

.lfg-page-text {
  color: rgba(226, 232, 240, 0.75);
  font-weight: 800;
  font-size: 12px;
}
</style>

