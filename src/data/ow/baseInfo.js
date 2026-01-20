// 初始金额
export const initialGold = 3500;

// 英雄属性配置信息
export const heroStatConfigs = [
  { key: 'weaponStrength', label: '武器强度', iconName: 'Sword', color: 'text-blue-600', unit: '', value: 0 },
  { key: 'skillStrength', label: '技能强度', iconName: 'Sparkles', color: 'text-purple-600', unit: '', value: 0 },
  { key: 'attackSpeed', label: '攻击速度', iconName: 'Gauge', color: 'text-orange-600', unit: '%', value: 0 },
  { key: 'cooldownReduction', label: '冷却缩减', iconName: 'Shield', color: 'text-cyan-600', unit: '%', value: 0 },
  { key: 'maxAmmo', label: '最大弹药', iconName: 'Circle', color: 'text-yellow-600', unit: '', value: 0 },
  { key: 'weaponLifesteal', label: '武器生命偷取', iconName: 'Droplet', color: 'text-pink-600', unit: '%', value: 0 },
  { key: 'skillLifesteal', label: '技能生命偷取', iconName: 'Heart', color: 'text-red-600', unit: '%', value: 0 },
  { key: 'moveSpeed', label: '移动速度', iconName: 'Zap', color: 'text-green-600', unit: '%', value: 0 },
  { key: 'reloadSpeed', label: '装填速度', iconName: 'RefreshCw', color: 'text-indigo-600', unit: '%', value: 0 },
  { key: 'meleeDamage', label: '近身伤害', iconName: 'Hand', color: 'text-amber-600', unit: '', value: 0 },
  { key: 'criticalDamage', label: '暴击伤害', iconName: 'Target', color: 'text-rose-600', unit: '%', value: 0 }
]

// 英雄基本信息（从配置中提取）
export const heroInfo = heroStatConfigs.reduce((acc, config) => {
  acc[config.key] = config.value
  return acc
}, {})