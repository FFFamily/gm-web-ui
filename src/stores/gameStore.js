import { reactive } from 'vue'
import { storeItems } from '../data/storeItems.js'
import { heroStatConfigs, initialGold, heroInfo } from '../data/ow/baseInfo.js'

// 游戏状态管理
export const gameStore = reactive({
  // 玩家资产
  gold: initialGold,
  
  // 英雄属性配置
  heroStatConfigs: heroStatConfigs,
  
  // 英雄属性值（从配置中提取初始值）
  heroStats: { ...heroInfo },
  
  // 已购清单（最大6个槽位）
  inventory: [],
  
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

// 重新导出 storeItems，方便其他组件使用
export { storeItems }
