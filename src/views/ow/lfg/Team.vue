<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  owLfgTeamDetail,
  owLfgApproveJoinRequest,
  owLfgRejectJoinRequest,
  owLfgKick,
  owLfgLeave,
  owLfgClose,
  owLfgDisband
} from '~/api/owLfg'
import { owLfgModeLabel, owLfgPlatformLabel, owLfgRoleLabel, owLfgVoiceLabel, owLfgRankLabel } from '~/constants/owLfgDict'

const router = useRouter()
const route = useRoute()

const loading = ref(false)
const team = ref(null)

const teamId = computed(() => Number(route.params.id))

const fetchDetail = async () => {
  loading.value = true
  try {
    team.value = await owLfgTeamDetail(teamId.value)
  } finally {
    loading.value = false
  }
}

const goInvite = () => {
  if (!team.value?.inviteCode) return
  router.push(`/ow/lfg/t/${team.value.inviteCode}`)
}

const onApprove = async (jr) => {
  await owLfgApproveJoinRequest(jr.id)
  ElMessage.success('已同意')
  await fetchDetail()
}

const onReject = async (jr) => {
  await owLfgRejectJoinRequest(jr.id)
  ElMessage.success('已拒绝')
  await fetchDetail()
}

const onKick = async (m) => {
  await ElMessageBox.confirm(`确认踢出「${m.displayName}」？`, '踢人', { type: 'warning', confirmButtonText: '踢出', cancelButtonText: '取消' })
  await owLfgKick(teamId.value, m.id)
  ElMessage.success('已踢出')
  await fetchDetail()
}

const onLeave = async () => {
  await ElMessageBox.confirm('确认退出该队伍？', '退出队伍', { type: 'warning', confirmButtonText: '退出', cancelButtonText: '取消' })
  await owLfgLeave(teamId.value)
  ElMessage.success('已退出')
  router.replace('/account/teams')
}

const onClose = async () => {
  await ElMessageBox.confirm('关闭招募后，邀请页将不可加入/申请。确认关闭？', '关闭招募', {
    type: 'warning',
    confirmButtonText: '关闭',
    cancelButtonText: '取消'
  })
  await owLfgClose(teamId.value)
  ElMessage.success('已关闭招募')
  await fetchDetail()
}

const onDisband = async () => {
  await ElMessageBox.confirm('解散后邀请页将显示“已解散”。确认解散？', '解散队伍', {
    type: 'warning',
    confirmButtonText: '解散',
    cancelButtonText: '取消'
  })
  await owLfgDisband(teamId.value)
  ElMessage.success('已解散')
  await fetchDetail()
}

const contactLines = computed(() => {
  const c = team.value?.contact
  if (!c) return []
  const lines = []
  if (c.battleTag) lines.push(['BattleTag', c.battleTag])
  if (c.voiceRoom) lines.push(['语音房间', c.voiceRoom])
  if (c.groupNo) lines.push(['群号', c.groupNo])
  return lines
})

onMounted(fetchDetail)
</script>

<template>
  <div class="lfg-team">
    <div class="lfg-container">
      <div class="lfg-team-head">
        <button class="lfg-btn" @click="router.push('/account/teams')">返回我的队伍</button>
        <div class="lfg-team-actions">
          <button class="lfg-btn" @click="goInvite">打开邀请页</button>
        </div>
      </div>

      <div v-if="team" class="hero">
        <div class="hero-main">
          <div class="title">{{ team.title }}</div>
          <div class="sub">
            <span class="badge badge--mode">{{ owLfgModeLabel(team.modeCode) }}</span>
            <span class="badge">{{ owLfgPlatformLabel(team.platformCode) }}</span>
            <span class="badge">{{ owLfgVoiceLabel(team.voiceRequired) }}</span>
            <span class="badge">段位：{{ owLfgRankLabel(team.rankMin) }} - {{ owLfgRankLabel(team.rankMax) }}</span>
            <span class="badge">人数：{{ team.memberCount }}/{{ team.capacity }}</span>
            <span class="badge">队长：{{ team.leaderName }}</span>
          </div>
        </div>
        <div class="hero-cta">
          <button v-if="team.leader && team.status === 'OPEN'" class="lfg-btn lfg-btn--primary" :disabled="loading" @click="onClose">
            关闭招募
          </button>
          <button v-if="team.leader" class="lfg-btn lfg-btn--danger" :disabled="loading" @click="onDisband">解散队伍</button>
          <button v-if="!team.leader" class="lfg-btn lfg-btn--danger" :disabled="loading" @click="onLeave">退出队伍</button>
        </div>
      </div>

      <div v-if="team" class="grid">
        <div class="panel">
          <div class="panel-title">联系方式（仅成员可见）</div>
          <div v-if="!contactLines.length" class="muted">暂无</div>
          <div v-else class="kv">
            <div v-for="line in contactLines" :key="line[0]" class="kv-row">
              <div class="k">{{ line[0] }}</div>
              <div class="v mono">{{ line[1] }}</div>
            </div>
          </div>
        </div>

        <div class="panel">
          <div class="panel-title">成员（{{ team.members?.length || 0 }}）</div>
          <div class="members">
            <div v-for="m in team.members || []" :key="m.id" class="member">
              <div class="avatar">{{ (m.displayName || '').slice(0, 1) }}</div>
              <div class="info">
                <div class="name">
                  {{ m.displayName }}
                  <span v-if="m.leader" class="leader">队长</span>
                </div>
                <div class="meta">
                  <span v-if="m.roleTags?.length">{{ m.roleTags.map(owLfgRoleLabel).join(' / ') }}</span>
                  <span v-else>未选择位置</span>
                </div>
              </div>
              <div v-if="team.leader && !m.leader" class="ops">
                <button class="mini-btn" :disabled="loading" @click="onKick(m)">踢出</button>
              </div>
            </div>
          </div>
        </div>

        <div v-if="team.leader && team.pendingJoinRequests?.length" class="panel panel--full">
          <div class="panel-title">待处理申请（{{ team.pendingJoinRequests.length }}）</div>
          <div class="requests">
            <div v-for="jr in team.pendingJoinRequests" :key="jr.id" class="req">
              <div class="req-main">
                <div class="req-name">{{ jr.displayName }}</div>
                <div class="req-msg">{{ jr.message || '无留言' }}</div>
              </div>
              <div class="req-ops">
                <button class="mini-btn mini-btn--primary" :disabled="loading" @click="onApprove(jr)">同意</button>
                <button class="mini-btn" :disabled="loading" @click="onReject(jr)">拒绝</button>
              </div>
            </div>
          </div>
        </div>

        <div v-if="team" class="panel panel--full">
          <div class="panel-title">备注 / 规则</div>
          <div class="note">{{ team.note || '暂无' }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.lfg-team {
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

.lfg-team-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  gap: 10px;
}

.hero {
  border: 1px solid rgba(226, 232, 240, 0.14);
  border-radius: 20px;
  padding: 14px;
  background: linear-gradient(135deg, rgba(124, 58, 237, 0.25) 0%, rgba(15, 15, 35, 0.75) 55%, rgba(244, 63, 94, 0.12) 100%);
  box-shadow: 0 18px 75px rgba(0, 0, 0, 0.45);
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 14px;
}

@media (min-width: 900px) {
  .hero {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
}

.title {
  font-size: 1.3rem;
  font-weight: 1000;
}

.sub {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
}

.badge {
  font-size: 12px;
  font-weight: 900;
  padding: 4px 8px;
  border-radius: 999px;
  border: 1px solid rgba(226, 232, 240, 0.16);
  background: rgba(2, 6, 23, 0.35);
  color: rgba(226, 232, 240, 0.88);
}

.badge--mode {
  border-color: rgba(124, 58, 237, 0.55);
}

.hero-cta {
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: flex-end;
}

@media (max-width: 899px) {
  .hero-cta {
    align-items: stretch;
  }
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

.panel {
  border: 1px solid rgba(226, 232, 240, 0.12);
  background: rgba(15, 15, 35, 0.7);
  border-radius: 18px;
  padding: 14px;
  box-shadow: 0 18px 70px rgba(0, 0, 0, 0.4);
}

.panel--full {
  grid-column: 1 / -1;
}

.panel-title {
  font-weight: 1000;
  margin-bottom: 10px;
}

.muted {
  color: rgba(226, 232, 240, 0.65);
  font-weight: 800;
  font-size: 12px;
}

.kv-row {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  padding: 6px 0;
  border-bottom: 1px dashed rgba(226, 232, 240, 0.12);
}

.kv-row:last-child {
  border-bottom: none;
}

.k {
  color: rgba(226, 232, 240, 0.6);
  font-weight: 900;
  font-size: 12px;
}

.v {
  color: rgba(226, 232, 240, 0.9);
  font-weight: 900;
  font-size: 12px;
  text-align: right;
  word-break: break-all;
}

.mono {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
}

.members {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.member {
  display: flex;
  gap: 10px;
  align-items: center;
  border: 1px solid rgba(226, 232, 240, 0.1);
  background: rgba(2, 6, 23, 0.25);
  border-radius: 14px;
  padding: 10px;
}

.avatar {
  width: 38px;
  height: 38px;
  border-radius: 999px;
  background: rgba(124, 58, 237, 0.2);
  border: 1px solid rgba(124, 58, 237, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 1000;
}

.info {
  min-width: 0;
  flex: 1 1 auto;
}

.name {
  font-weight: 1000;
}

.leader {
  margin-left: 8px;
  font-size: 12px;
  padding: 2px 6px;
  border-radius: 999px;
  border: 1px solid rgba(244, 63, 94, 0.45);
  background: rgba(244, 63, 94, 0.12);
}

.meta {
  margin-top: 3px;
  color: rgba(226, 232, 240, 0.65);
  font-size: 12px;
  font-weight: 800;
}

.ops {
  flex: 0 0 auto;
}

.requests {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.req {
  border: 1px solid rgba(226, 232, 240, 0.1);
  background: rgba(2, 6, 23, 0.25);
  border-radius: 14px;
  padding: 10px;
  display: flex;
  justify-content: space-between;
  gap: 10px;
}

.req-name {
  font-weight: 1000;
}

.req-msg {
  margin-top: 4px;
  color: rgba(226, 232, 240, 0.7);
  font-size: 12px;
  font-weight: 800;
  white-space: pre-wrap;
}

.req-ops {
  display: flex;
  gap: 8px;
  align-items: center;
}

.note {
  color: rgba(226, 232, 240, 0.86);
  font-weight: 800;
  line-height: 1.55;
  white-space: pre-wrap;
}

.mini-btn {
  border: 1px solid rgba(226, 232, 240, 0.18);
  background: rgba(2, 6, 23, 0.35);
  color: rgba(226, 232, 240, 0.9);
  border-radius: 10px;
  padding: 8px 10px;
  font-weight: 900;
  cursor: pointer;
}

.mini-btn--primary {
  border-color: rgba(16, 185, 129, 0.35);
  background: rgba(16, 185, 129, 0.14);
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
  box-shadow: 0 16px 55px rgba(0, 0, 0, 0.35);
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

.lfg-btn--danger {
  border-color: rgba(244, 63, 94, 0.45);
  background: rgba(244, 63, 94, 0.12);
}
</style>

