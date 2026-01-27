import { reactive } from 'vue'
import { getOwBaseInfo, getOwHeroDetail, listOwHeroes, listOwItems } from '../api/ow'

// 游戏状态管理
export const gameStore = reactive({
  ready: false,
  loading: false,

  // Base info
  initialGold: 0,
  heroStatConfigs: [],

  // Heroes
  heroes: [],
  selectedHero: null, // { heroCode, heroName, ... }

  // Player state
  gold: 0,
  heroStats: {},
  inventory: [],

  // Store items (for current hero)
  items: [],

  async bootstrap() {
    if (this.loading) return
    this.loading = true
    try {
      const [baseInfo, heroes] = await Promise.all([getOwBaseInfo(), listOwHeroes()])
      this.initialGold = baseInfo?.initialGold ?? 80000
      this.heroStatConfigs = (baseInfo?.statDefs || []).map((d) => ({
        key: d.key,
        label: d.label,
        iconName: d.iconName,
        color: d.colorClass,
        unit: d.unit || '',
        value: d.defaultValue || 0
      }))
      this.heroes = heroes || []
      this.ready = true
    } finally {
      this.loading = false
    }
  },

  async selectHero(heroCode) {
    const detail = await getOwHeroDetail(heroCode)
    this.selectedHero = detail
    this.inventory = []
    this.gold = detail?.initialGold ?? this.initialGold ?? 80000
    this.heroStats = detail?.baseStats ? { ...detail.baseStats } : {}

    const items = await listOwItems({ heroCode })
    this.items = (items || []).map((i) => ({
      id: i.itemCode,
      code: i.itemCode,
      name: i.itemName,
      price: i.price,
      quality: i.quality,
      category: i.category,
      img: i.imgKey,
      imgUrl: i.imgUrl,
      stats: i.stats || {},
      isGlobal: i.isGlobal
    }))
  },

  clearHero() {
    this.selectedHero = null
    this.items = []
    this.inventory = []
    this.gold = this.initialGold || 0
    this.heroStats = {}
  },
  
  // 购买物品
  purchaseItem(item) {
    // 检查金币是否足够
    if (this.gold < item.price) {
      return { success: false, message: '金币不足' }
    }
    
    // 检查库存是否已满
    if (this.inventory.length >= 6) {
      return { success: false, message: '装备栏已满' }
    }
    
    // 扣除金币
    this.gold -= item.price
    
    // 添加到库存
    this.inventory.push(item)
    
    // 累加属性
    if (item.stats) {
      Object.keys(item.stats).forEach(key => {
        if (this.heroStats[key] !== undefined) {
          this.heroStats[key] += item.stats[key]
        } else {
          // 如果属性不存在，初始化为0后累加
          this.heroStats[key] = item.stats[key]
        }
      })
    }
    
    return { success: true, message: '购买成功' }
  }
})
