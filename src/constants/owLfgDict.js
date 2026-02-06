export const OW_LFG_MODE_LABELS = Object.freeze({
  COMPETITIVE: '竞技',
  QUICK_PLAY: '快速',
  CUSTOM: '自定义',
  ARMORY: '军械库'
})

export const OW_LFG_PLATFORM_LABELS = Object.freeze({
  PC: 'PC',
  CONSOLE: '主机'
})

export const OW_LFG_ROLE_LABELS = Object.freeze({
  TANK: '坦克',
  DPS: '输出',
  SUPPORT: '辅助'
})

export const OW_LFG_VOICE_LABELS = Object.freeze({
  0: '不需要语音',
  1: '语音可选',
  2: '必须语音'
})

export const OW_LFG_RANK_LABELS = Object.freeze({
  BRONZE: '青铜',
  SILVER: '白银',
  GOLD: '黄金',
  PLATINUM: '白金',
  DIAMOND: '钻石',
  MASTER: '大师',
  GRANDMASTER: '宗师',
  TOP500: '前500'
})

export const OW_LFG_MODE_OPTIONS = Object.freeze(
  Object.entries(OW_LFG_MODE_LABELS).map(([value, label]) => ({ value, label }))
)
export const OW_LFG_PLATFORM_OPTIONS = Object.freeze(
  Object.entries(OW_LFG_PLATFORM_LABELS).map(([value, label]) => ({ value, label }))
)
export const OW_LFG_ROLE_OPTIONS = Object.freeze(
  Object.entries(OW_LFG_ROLE_LABELS).map(([value, label]) => ({ value, label }))
)
export const OW_LFG_RANK_OPTIONS = Object.freeze(
  Object.entries(OW_LFG_RANK_LABELS).map(([value, label]) => ({ value, label }))
)

export const owLfgModeLabel = (v) => OW_LFG_MODE_LABELS[v] || v || '-'
export const owLfgPlatformLabel = (v) => OW_LFG_PLATFORM_LABELS[v] || v || '-'
export const owLfgRoleLabel = (v) => OW_LFG_ROLE_LABELS[v] || v || '-'
export const owLfgVoiceLabel = (v) => OW_LFG_VOICE_LABELS[v] || '-'
export const owLfgRankLabel = (v) => OW_LFG_RANK_LABELS[v] || v || '-'

