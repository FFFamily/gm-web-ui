<script setup>
import { computed } from 'vue'
import { owLfgModeLabel, owLfgPlatformLabel, owLfgRoleLabel, owLfgVoiceLabel, owLfgRankLabel } from '~/constants/owLfgDict'

const props = defineProps({
  team: { type: Object, required: true }
})

const emit = defineEmits(['click'])

const remainText = computed(() => {
  const exp = props.team?.expiresAt ? new Date(String(props.team.expiresAt)) : null
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
  const st = props.team?.status || 'OPEN'
  if (st === 'OPEN') return '招募中'
  if (st === 'CLOSED') return '已关闭'
  if (st === 'FULL') return '已满员'
  if (st === 'EXPIRED') return '已过期'
  if (st === 'DISBANDED') return '已解散'
  return st
})

const progress = computed(() => {
  const cap = Number(props.team?.capacity || 0)
  const mc = Number(props.team?.memberCount || 0)
  if (!cap) return 0
  return Math.max(0, Math.min(100, Math.round((mc / cap) * 100)))
})

const needRoles = computed(() => (props.team?.needRoles || []).filter(Boolean).slice(0, 3))
const tags = computed(() => (props.team?.tags || []).filter(Boolean).slice(0, 6))
</script>

<template>
  <div class="lfg-card" role="button" tabindex="0" @click="emit('click')" @keydown.enter="emit('click')">
    <div class="lfg-card-top">
      <div class="lfg-title">{{ team.title }}</div>
      <div class="lfg-badges">
        <span class="lfg-badge lfg-badge--mode">{{ owLfgModeLabel(team.modeCode) }}</span>
        <span class="lfg-badge">{{ owLfgPlatformLabel(team.platformCode) }}</span>
        <span class="lfg-badge">{{ owLfgVoiceLabel(team.voiceRequired) }}</span>
      </div>
    </div>

    <div class="lfg-meta">
      <div class="lfg-meta-item">
        <span class="k">队长</span>
        <span class="v">{{ team.leaderName || '-' }}</span>
      </div>
      <div class="lfg-meta-item">
        <span class="k">段位</span>
        <span class="v">
          <span v-if="team.rankMin || team.rankMax">
            {{ owLfgRankLabel(team.rankMin) }} - {{ owLfgRankLabel(team.rankMax) }}
          </span>
          <span v-else>-</span>
        </span>
      </div>
      <div class="lfg-meta-item">
        <span class="k">状态</span>
        <span class="v">{{ statusText }}</span>
      </div>
      <div class="lfg-meta-item">
        <span class="k">时间</span>
        <span class="v">{{ remainText }}</span>
      </div>
    </div>

    <div class="lfg-progress">
      <div class="lfg-progress-row">
        <div class="lfg-progress-text">{{ team.memberCount }}/{{ team.capacity }}</div>
        <div class="lfg-progress-bar">
          <div class="lfg-progress-fill" :style="{ width: progress + '%' }"></div>
        </div>
      </div>
    </div>

    <div v-if="needRoles.length || tags.length" class="lfg-tags">
      <span v-for="r in needRoles" :key="'r-' + r" class="lfg-chip lfg-chip--role">{{ owLfgRoleLabel(r) }}</span>
      <span v-for="t in tags" :key="'t-' + t" class="lfg-chip">{{ t }}</span>
    </div>
  </div>
</template>

<style scoped>
.lfg-card {
  border: 1px solid rgba(124, 58, 237, 0.22);
  border-radius: 18px;
  padding: 14px 14px 12px;
  background: radial-gradient(1200px 400px at 10% 0%, rgba(124, 58, 237, 0.22) 0%, rgba(15, 15, 35, 0.85) 45%),
    linear-gradient(180deg, rgba(15, 15, 35, 0.72) 0%, rgba(15, 15, 35, 0.92) 100%);
  box-shadow: 0 14px 45px rgba(0, 0, 0, 0.35);
  cursor: pointer;
  transition: transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease;
  outline: none;
}

.lfg-card:focus-visible {
  border-color: rgba(244, 63, 94, 0.65);
  box-shadow: 0 0 0 4px rgba(244, 63, 94, 0.18), 0 16px 55px rgba(0, 0, 0, 0.4);
}

.lfg-card:hover {
  transform: translateY(-2px);
  border-color: rgba(167, 139, 250, 0.55);
  box-shadow: 0 18px 65px rgba(0, 0, 0, 0.45);
}

.lfg-card-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 10px;
}

.lfg-title {
  font-weight: 900;
  color: #e2e8f0;
  letter-spacing: 0.2px;
  line-height: 1.2;
  font-size: 16px;
  flex: 1 1 auto;
  min-width: 0;
}

.lfg-badges {
  display: flex;
  gap: 6px;
  flex: 0 0 auto;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.lfg-badge {
  font-size: 12px;
  font-weight: 800;
  color: rgba(226, 232, 240, 0.9);
  border: 1px solid rgba(226, 232, 240, 0.18);
  background: rgba(2, 6, 23, 0.35);
  padding: 4px 8px;
  border-radius: 999px;
  white-space: nowrap;
}

.lfg-badge--mode {
  border-color: rgba(124, 58, 237, 0.55);
  box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.12);
}

.lfg-meta {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px 12px;
  margin-top: 10px;
}

.lfg-meta-item {
  display: flex;
  gap: 8px;
  align-items: baseline;
  min-width: 0;
}

.lfg-meta-item .k {
  color: rgba(226, 232, 240, 0.6);
  font-size: 12px;
  font-weight: 700;
}

.lfg-meta-item .v {
  color: rgba(226, 232, 240, 0.92);
  font-size: 12px;
  font-weight: 800;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.lfg-progress {
  margin-top: 10px;
}

.lfg-progress-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.lfg-progress-text {
  color: rgba(226, 232, 240, 0.8);
  font-size: 12px;
  font-weight: 900;
  flex: 0 0 auto;
}

.lfg-progress-bar {
  flex: 1 1 auto;
  height: 10px;
  border-radius: 999px;
  background: rgba(226, 232, 240, 0.12);
  overflow: hidden;
  border: 1px solid rgba(226, 232, 240, 0.12);
}

.lfg-progress-fill {
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(90deg, rgba(244, 63, 94, 0.95) 0%, rgba(124, 58, 237, 0.9) 55%, rgba(167, 139, 250, 0.9) 100%);
  box-shadow: 0 0 16px rgba(244, 63, 94, 0.22);
}

.lfg-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 10px;
}

.lfg-chip {
  font-size: 12px;
  font-weight: 800;
  padding: 4px 8px;
  border-radius: 999px;
  border: 1px solid rgba(226, 232, 240, 0.16);
  background: rgba(15, 15, 35, 0.55);
  color: rgba(226, 232, 240, 0.85);
}

.lfg-chip--role {
  border-color: rgba(16, 185, 129, 0.28);
  background: rgba(16, 185, 129, 0.12);
}
</style>
