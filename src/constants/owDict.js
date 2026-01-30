// OW dictionary mappings for display (keep backend values stable, show Chinese labels in UI).

export const OW_ITEM_CATEGORY_LABELS = Object.freeze({
  weapon: '武器',
  skill: '技能',
  survival: '生存',
  device: '装置'
})

export const OW_ITEM_QUALITY_LABELS = Object.freeze({
  green: '绿色',
  blue: '蓝色',
  purple: '紫色'
})

// Item/hero stat labels.
// Note: keep keys aligned with backend `ow_stat_def.stat_key` and item `stats_json` keys.
export const OW_STAT_LABELS = Object.freeze({
  // Base hero stats
  weaponStrength: '武器强度',
  skillStrength: '技能强度',
  attackSpeed: '攻击速度',
  cooldownReduction: '冷却缩减',
  maxAmmo: '最大弹药',
  weaponLifesteal: '武器生命偷取',
  skillLifesteal: '技能生命偷取',
  moveSpeed: '移动速度',
  reloadSpeed: '装填速度',
  meleeDamage: '近身伤害',
  criticalDamage: '暴击伤害',

  // Common item stats (from store items)
  damage: '伤害',
  cooldown: '冷却缩减',
  health: '生命值',
  lifesteal: '吸血'
})

export const OW_STAT_IS_PERCENT = Object.freeze({
  // Item stats
  damage: true,
  cooldown: true,
  lifesteal: true,

  // Some hero stats are often treated as percent in UI, keep as true when needed.
  attackSpeed: true,
  cooldownReduction: true,
  moveSpeed: true,
  reloadSpeed: true,
  criticalDamage: true
})

// Progress bar colors for each stat key (used by community detail view etc.)
export const OW_STAT_COLORS = Object.freeze({
  damage: '#ef4444',
  cooldown: '#06b6d4',
  health: '#22c55e',
  lifesteal: '#f97316',

  weaponStrength: '#3b82f6',
  skillStrength: '#a855f7',
  attackSpeed: '#f59e0b',
  cooldownReduction: '#06b6d4',
  maxAmmo: '#eab308',
  weaponLifesteal: '#ec4899',
  skillLifesteal: '#fb7185',
  moveSpeed: '#10b981',
  reloadSpeed: '#6366f1',
  meleeDamage: '#f59e0b',
  criticalDamage: '#f43f5e'
})

export const OW_ITEM_CATEGORY_OPTIONS = Object.freeze(
  Object.entries(OW_ITEM_CATEGORY_LABELS).map(([value, label]) => ({ value, label }))
)

export const OW_ITEM_QUALITY_OPTIONS = Object.freeze(
  Object.entries(OW_ITEM_QUALITY_LABELS).map(([value, label]) => ({ value, label }))
)

export const OW_STAT_OPTIONS = Object.freeze(
  Object.entries(OW_STAT_LABELS).map(([value, label]) => ({ value, label }))
)

export function owCategoryLabel(code) {
  return OW_ITEM_CATEGORY_LABELS[code] || code || '-'
}

export function owQualityLabel(code) {
  return OW_ITEM_QUALITY_LABELS[code] || code || '-'
}

export function owStatLabel(code) {
  return OW_STAT_LABELS[code] || code || '-'
}

export function owStatColor(code) {
  return OW_STAT_COLORS[code] || '#10b981'
}

export function owFormatStatValue(statKey, value) {
  if (value == null || value === '') return ''
  const n = Number(value)
  const sign = n >= 0 ? '+' : ''
  const suffix = OW_STAT_IS_PERCENT[statKey] ? '%' : ''
  return `${sign}${n}${suffix}`
}
