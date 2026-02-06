<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { owLfgInvite, owLfgJoin, owLfgMyState, owLfgRequestJoin, owLfgCancelJoinRequest, owLfgReport } from '~/api/owLfg'
import { useAccountAuthStore } from '~/stores/accountAuth'
import { pinia } from '~/stores/pinia'
import { owLfgModeLabel, owLfgPlatformLabel, owLfgRoleLabel, owLfgVoiceLabel, owLfgRankLabel } from '~/constants/owLfgDict'

const router = useRouter()
const route = useRoute()
const accountAuth = useAccountAuthStore(pinia)

const loading = ref(false)
const invite = ref(null)
const state = ref(null)
const requestMsg = ref('')

const inviteCode = computed(() => String(route.params.inviteCode || ''))

const shareUrl = computed(() => `${window.location.origin}/ow/lfg/t/${inviteCode.value}`)

const remainText = computed(() => {
  const exp = invite.value?.expiresAt ? new Date(String(invite.value.expiresAt)) : null
  if (!exp || Number.isNaN(exp.getTime())) return '-'
  const ms = exp.getTime() - Date.now()
  if (ms <= 0) return '已过期'
  const mins = Math.floor(ms / 60000)
  if (mins < 60) return `还剩 ${mins}m`
  const h = Math.floor(mins / 60)
  const m = mins % 60
  return `还剩 ${h}h ${m}m`
})

const statusText = computed(() => {
  const st = invite.value?.status || 'OPEN'
  if (st === 'OPEN') return '招募中'
  if (st === 'CLOSED') return '已关闭'
  if (st === 'FULL') return '已满员'
  if (st === 'EXPIRED') return '已过期'
  if (st === 'DISBANDED') return '已解散'
  return st
})

const canJoin = computed(() => Boolean(state.value?.canJoin))
const canRequest = computed(() => Boolean(state.value?.canRequest))

const fetchInvite = async () => {
  loading.value = true
  try {
    invite.value = await owLfgInvite(inviteCode.value)
    if (accountAuth.token && invite.value?.id) {
      state.value = await owLfgMyState(invite.value.id)
    } else {
      state.value = null
    }
  } finally {
    loading.value = false
  }
}

const ensureLogin = () => {
  if (accountAuth.token) return true
  router.push({ path: '/account/login', query: { redirect: route.fullPath } })
  return false
}

const copy = async (text) => {
  try {
    await navigator.clipboard.writeText(String(text || ''))
    ElMessage.success('已复制')
  } catch {
    ElMessage.warning('复制失败，请手动复制')
  }
}

const onJoin = async () => {
  if (!ensureLogin()) return
  if (!invite.value?.id) return
  await owLfgJoin(invite.value.id)
  ElMessage.success('加入成功')
  await fetchInvite()
}

const onRequestJoin = async () => {
  if (!ensureLogin()) return
  if (!invite.value?.id) return
  await owLfgRequestJoin(invite.value.id, { message: requestMsg.value?.trim() || null })
  ElMessage.success('已提交申请')
  await fetchInvite()
}

const onCancelRequest = async () => {
  const jrStatus = state.value?.joinRequestStatus
  if (jrStatus !== 'PENDING') return
  const jrId = state.value?.joinRequestId
  if (!jrId) return
  await owLfgCancelJoinRequest(jrId)
  ElMessage.success('已撤销')
  await fetchInvite()
}

const goTeam = () => {
  if (!ensureLogin()) return
  if (!invite.value?.id) return
  router.push(`/ow/lfg/teams/${invite.value.id}`)
}

const onReport = async () => {
  if (!ensureLogin()) return
  const reasons = ['辱骂/引战', '低俗/不当内容', '诈骗/引流', '其他']
  try {
    const reason = await ElMessageBox.prompt('请选择或填写举报原因', '举报', {
      inputPlaceholder: '如：辱骂/引战',
      inputValue: reasons[0],
      confirmButtonText: '提交',
      cancelButtonText: '取消'
    })
    const r = reason?.value?.trim()
    if (!r) return
    await owLfgReport({
      targetType: 'TEAM',
      targetId: invite.value?.id,
      reason: r,
      detail: null
    })
    ElMessage.success('已举报')
  } catch {
    // canceled
  }
}

onMounted(fetchInvite)
</script>

<template>
  <div class="lfg-invite">
    <div class="lfg-container">
      <div class="lfg-invite-head">
        <button class="lfg-btn" @click="router.push('/ow/lfg')">返回大厅</button>
        <div class="lfg-head-actions">
          <button class="lfg-btn" @click="copy(shareUrl)">复制邀请链接</button>
          <button class="lfg-btn" @click="onReport">举报</button>
        </div>
      </div>

      <div v-if="invite" class="lfg-hero">
        <div class="lfg-hero-main">
          <div class="lfg-title">{{ invite.title }}</div>
          <div class="lfg-sub">
            <span class="badge badge--mode">{{ owLfgModeLabel(invite.modeCode) }}</span>
            <span class="badge">{{ owLfgPlatformLabel(invite.platformCode) }}</span>
            <span class="badge">{{ owLfgVoiceLabel(invite.voiceRequired) }}</span>
            <span class="badge">队长：{{ invite.leaderName || '-' }}</span>
            <span class="badge">状态：{{ statusText }}</span>
            <span class="badge">{{ remainText }}</span>
          </div>
        </div>

        <div class="lfg-hero-cta">
          <div class="lfg-count">{{ invite.memberCount }}/{{ invite.capacity }}</div>
          <button v-if="canJoin" class="lfg-btn lfg-btn--primary" :disabled="loading" @click="onJoin">
            {{ loading ? '处理中…' : '立即加入' }}
          </button>
          <button v-else-if="canRequest" class="lfg-btn lfg-btn--primary" :disabled="loading" @click="onRequestJoin">
            {{ loading ? '处理中…' : '申请加入' }}
          </button>
          <button v-else class="lfg-btn lfg-btn--primary" disabled>
            {{ state?.member ? '已在队伍中' : state?.joinRequestStatus === 'PENDING' ? '等待队长通过' : '当前不可加入' }}
          </button>
          <button v-if="accountAuth.token && (state?.member || state?.leader)" class="lfg-btn" @click="goTeam">进入队伍页</button>
        </div>
      </div>

      <div v-if="invite" class="lfg-panels">
        <div class="panel">
          <div class="panel-title">队伍信息</div>
          <div class="panel-grid">
            <div class="item"><span class="k">段位</span><span class="v">{{ owLfgRankLabel(invite.rankMin) }} - {{ owLfgRankLabel(invite.rankMax) }}</span></div>
            <div class="item">
              <span class="k">位置需求</span>
              <span class="v">
                <span v-if="invite.needRoles?.length">{{ invite.needRoles.map(owLfgRoleLabel).join(' / ') }}</span>
                <span v-else>-</span>
              </span>
            </div>
            <div class="item"><span class="k">邀请码</span><span class="v mono">{{ invite.inviteCode }}</span></div>
            <div class="item"><span class="k">分享链接</span><span class="v mono">{{ shareUrl }}</span></div>
          </div>
          <div v-if="invite.tags?.length" class="chips">
            <span v-for="t in invite.tags" :key="t" class="chip">{{ t }}</span>
          </div>
        </div>

        <div class="panel">
          <div class="panel-title">成员（{{ invite.members?.length || 0 }}）</div>
          <div class="members">
            <div v-for="m in invite.members || []" :key="m.id" class="member">
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
            </div>
          </div>
        </div>

        <div class="panel panel--full">
          <div class="panel-title">规则 / 备注</div>
          <div class="note">{{ invite.note || '暂无' }}</div>
          <div v-if="!invite.autoApprove" class="hint">该队伍为“需队长同意”，你可以填一句话提升通过率。</div>
          <div v-if="canRequest" class="req">
            <input v-model="requestMsg" class="lfg-input" placeholder="给队长留言（可选）" />
            <button class="lfg-btn lfg-btn--primary" :disabled="loading" @click="onRequestJoin">提交申请</button>
          </div>
          <div v-else-if="state?.joinRequestStatus === 'PENDING'" class="req">
            <button class="lfg-btn" :disabled="loading" @click="onCancelRequest">撤销申请</button>
            <div class="hint">MVP：撤销入口后续会补全（目前请进队伍页处理）。</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.lfg-invite {
  min-height: 100vh;
  color: #e2e8f0;
  padding-top: 5rem;
  background: radial-gradient(1000px 550px at 15% 0%, rgba(124, 58, 237, 0.35) 0%, rgba(15, 15, 35, 1) 58%),
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

.lfg-invite-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}

.lfg-head-actions {
  display: flex;
  gap: 10px;
}

.lfg-hero {
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
  .lfg-hero {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
}

.lfg-title {
  font-size: 1.3rem;
  font-weight: 1000;
  letter-spacing: 0.2px;
}

.lfg-sub {
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

.lfg-hero-cta {
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-width: 220px;
  align-items: flex-end;
}

@media (max-width: 899px) {
  .lfg-hero-cta {
    align-items: stretch;
  }
}

.lfg-count {
  font-weight: 1000;
  font-size: 18px;
  color: rgba(226, 232, 240, 0.92);
}

.lfg-panels {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
}

@media (min-width: 900px) {
  .lfg-panels {
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

.panel-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 8px;
}

.item {
  display: flex;
  justify-content: space-between;
  gap: 10px;
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

.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 10px;
}

.chip {
  font-size: 12px;
  font-weight: 900;
  padding: 4px 8px;
  border-radius: 999px;
  border: 1px solid rgba(226, 232, 240, 0.16);
  background: rgba(2, 6, 23, 0.25);
  color: rgba(226, 232, 240, 0.82);
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

.note {
  color: rgba(226, 232, 240, 0.86);
  font-weight: 800;
  line-height: 1.55;
  white-space: pre-wrap;
}

.hint {
  margin-top: 10px;
  color: rgba(226, 232, 240, 0.65);
  font-size: 12px;
  font-weight: 800;
}

.req {
  margin-top: 10px;
  display: flex;
  gap: 10px;
  align-items: center;
}

.lfg-input {
  flex: 1 1 auto;
  border: 1px solid rgba(226, 232, 240, 0.14);
  background: rgba(2, 6, 23, 0.35);
  color: rgba(226, 232, 240, 0.92);
  border-radius: 12px;
  padding: 10px 12px;
  font-weight: 800;
  outline: none;
}

.lfg-input:focus {
  border-color: rgba(167, 139, 250, 0.65);
  box-shadow: 0 0 0 4px rgba(124, 58, 237, 0.18);
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
</style>
