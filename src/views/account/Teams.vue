<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { owLfgMyTeams } from '~/api/owLfg'
import TeamCard from '~/components/ow/lfg/TeamCard.vue'

const router = useRouter()
const loading = ref(false)
const created = ref([])
const joined = ref([])

const fetchMine = async () => {
  loading.value = true
  try {
    const data = await owLfgMyTeams()
    created.value = data?.created || []
    joined.value = data?.joined || []
  } finally {
    loading.value = false
  }
}

const goInvite = (t) => {
  if (!t?.inviteCode) return
  router.push(`/ow/lfg/t/${t.inviteCode}`)
}

const goTeam = (t) => {
  if (!t?.id) return
  router.push(`/ow/lfg/teams/${t.id}`)
}

onMounted(fetchMine)
</script>

<template>
  <div class="my-teams">
    <div class="lfg-container">
      <div class="head">
        <div>
          <h1 class="title">我的队伍</h1>
          <p class="sub">你创建/加入的 OW 队伍都会在这里。</p>
        </div>
        <div class="actions">
          <button class="btn" @click="router.push('/ow/lfg')">去大厅</button>
          <button class="btn btn--primary" @click="router.push('/ow/lfg/new')">创建队伍</button>
        </div>
      </div>

      <div class="section">
        <div class="section-title">我创建的（{{ created.length }}）</div>
        <div v-if="!created.length && !loading" class="empty">暂无，去创建一个吧。</div>
        <div class="grid">
          <TeamCard v-for="t in created" :key="'c-' + t.id" :team="t" @click="goTeam(t)" />
        </div>
      </div>

      <div class="section">
        <div class="section-title">我加入的（{{ joined.length }}）</div>
        <div v-if="!joined.length && !loading" class="empty">暂无，去大厅看看。</div>
        <div class="grid">
          <TeamCard v-for="t in joined" :key="'j-' + t.id" :team="t" @click="goTeam(t)" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.my-teams {
  min-height: 100vh;
  color: #e2e8f0;
  padding-top: 5rem;
  background: radial-gradient(900px 550px at 15% 0%, rgba(124, 58, 237, 0.35) 0%, rgba(15, 15, 35, 1) 58%),
    radial-gradient(900px 600px at 80% 18%, rgba(244, 63, 94, 0.22) 0%, rgba(15, 15, 35, 1) 62%),
    #0f0f23;
}

.lfg-container {
  width: 100%;
  margin: 0 auto;
  padding: 1.5rem 1rem 2rem;
}

@media (min-width: 900px) {
  .lfg-container {
    max-width: 1040px;
  }
}

.head {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 12px;
  margin-bottom: 14px;
}

.title {
  font-size: 2rem;
  line-height: 2.2rem;
  font-weight: 1000;
  margin: 0;
}

.sub {
  margin: 6px 0 0;
  color: rgba(226, 232, 240, 0.65);
  font-weight: 700;
}

.actions {
  display: flex;
  gap: 10px;
}

.btn {
  border: 1px solid rgba(226, 232, 240, 0.18);
  background: rgba(2, 6, 23, 0.35);
  color: rgba(226, 232, 240, 0.9);
  border-radius: 12px;
  padding: 10px 14px;
  font-weight: 900;
  cursor: pointer;
  transition: transform 180ms ease, border-color 180ms ease, box-shadow 180ms ease;
}

.btn:hover {
  transform: translateY(-1px);
  border-color: rgba(167, 139, 250, 0.55);
  box-shadow: 0 16px 55px rgba(0, 0, 0, 0.35);
}

.btn--primary {
  border-color: rgba(244, 63, 94, 0.55);
  background: linear-gradient(135deg, rgba(244, 63, 94, 0.95) 0%, rgba(124, 58, 237, 0.9) 55%, rgba(167, 139, 250, 0.85) 100%);
  box-shadow: 0 14px 40px rgba(244, 63, 94, 0.18);
}

.section {
  margin-top: 14px;
}

.section-title {
  font-weight: 1000;
  margin-bottom: 10px;
}

.grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
}

@media (min-width: 900px) {
  .grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

.empty {
  border: 1px dashed rgba(226, 232, 240, 0.18);
  background: rgba(15, 15, 35, 0.55);
  border-radius: 18px;
  padding: 16px;
  text-align: center;
  color: rgba(226, 232, 240, 0.7);
  font-weight: 900;
}
</style>

