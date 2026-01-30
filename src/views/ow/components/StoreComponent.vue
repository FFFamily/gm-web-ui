<script setup>
import { ref, computed } from 'vue'
import { gameStore } from '../../../stores/gameStore'
import { ShoppingCart, Coins } from 'lucide-vue-next'
import { imageMap } from '../../../assets/ow/imageMap.js'
import { owFormatStatValue, owStatLabel } from '~/constants/owDict'

const activeTab = ref('weapon')
const hoveredItem = ref(null)

const qualityColors = {
  green: 'item-quality-green',
  blue: 'item-quality-blue',
  purple: 'item-quality-purple'
}

// 根据物品的 category 属性判断分类
const getItemCategory = (item) => {
  const validCategories = ['weapon', 'skill', 'survival', 'device']
  return validCategories.includes(item.category) ? item.category : 'weapon' // 默认分类
}

// 过滤当前 tab 的物品
const filteredItems = computed(() => {
  return (gameStore.items || []).filter(item => getItemCategory(item) === activeTab.value)
})

// 按品质分组
const itemsByQuality = computed(() => {
  const grouped = {
    green: [],
    blue: [],
    purple: []
  }
  
  filteredItems.value.forEach(item => {
    if (grouped[item.quality]) {
      grouped[item.quality].push(item)
    }
  })
  
  return grouped
})

const purchaseItem = (item) => {
  const result = gameStore.purchaseItem(item)
  if (result.success) {
    // 可以添加成功提示
    console.log(result.message)
  } else {
    // 可以添加错误提示
    alert(result.message)
  }
}

const canPurchase = computed(() => {
  return gameStore.inventory.length < 6
})

const tabs = [
  { key: 'weapon', label: '武器' },
  { key: 'skill', label: '技能' },
  { key: 'survival', label: '生存' },
  { key: 'device', label: '装置' }
]

const getStatLabel = (key) => owStatLabel(key)
const getStatValue = (key, value) => owFormatStatValue(key, value)

// 获取图片路径 - 使用 imageMap 获取已导入的图片 URL
const getItemImage = (item) => {
  if (item?.imgUrl) return item.imgUrl
  if (item.img && imageMap[item.img]) {
    return imageMap[item.img]
  }
  return null
}
</script>

<template>
  <div class="store-container">
    <div class="store-header">
      <h2 class="store-title">
        <ShoppingCart :size="24" />
        军械库
      </h2>
      <div class="gold-display">
        <Coins :size="20" />
        <span class="gold-amount">{{ gameStore.gold }}</span>
      </div>
    </div>
    
    <!-- Tab 切换 -->
    <div class="store-tabs">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        :class="['store-tab', { 'store-tab-active': activeTab === tab.key }]"
        @click="activeTab = tab.key"
      >
        {{ tab.label }}
      </button>
    </div>
    
    <!-- 按品质分3列显示 -->
    <div class="store-quality-grid">
      <!-- 绿色品质列 -->
      <div class="store-quality-column">
        <div class="quality-items">
          <div
            v-for="item in itemsByQuality.green"
            :key="item.id"
            :class="[
              'store-item',
              qualityColors[item.quality],
              gameStore.gold >= item.price && canPurchase
                ? 'store-item-purchasable'
                : 'store-item-disabled'
            ]"
            @click="gameStore.gold >= item.price && canPurchase && purchaseItem(item)"
            @mouseenter="hoveredItem = item"
            @mouseleave="hoveredItem = null"
          >
            <div class="store-item-content">
              <!-- 左侧圆形图片 -->
              <div class="store-item-image-wrapper">
                <img
                  v-if="getItemImage(item)"
                  :src="getItemImage(item)"
                  :alt="item.name"
                  class="store-item-image"
                />
                <div v-else class="store-item-image-placeholder">
                  {{ item.name.charAt(0) }}
                </div>
              </div>
              
              <!-- 右侧信息 -->
              <div class="store-item-info">
                <div class="store-item-name">{{ item.name }}</div>
                <div class="store-item-price">{{ item.price }} 金币</div>
              </div>
            </div>
            
            <!-- 错误提示 -->
            <div
              v-if="gameStore.gold < item.price"
              class="store-item-error"
            >
              金币不足
            </div>
            <div
              v-else-if="!canPurchase"
              class="store-item-warning"
            >
              装备栏已满
            </div>
            
            <!-- 悬浮提示框 -->
            <div
              v-if="hoveredItem === item && item.stats && Object.keys(item.stats).length > 0"
              class="store-item-tooltip"
            >
              <div class="tooltip-title">效果</div>
              <div class="tooltip-stats">
                <div
                  v-for="(value, key) in item.stats"
                  :key="key"
                  class="tooltip-stat"
                >
                  <span class="tooltip-stat-label">{{ getStatLabel(key) }}</span>
                  <span class="tooltip-stat-value">{{ getStatValue(key, value) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 蓝色品质列 -->
      <div class="store-quality-column">
        <div class="quality-items">
          <div
            v-for="item in itemsByQuality.blue"
            :key="item.id"
            :class="[
              'store-item',
              qualityColors[item.quality],
              gameStore.gold >= item.price && canPurchase
                ? 'store-item-purchasable'
                : 'store-item-disabled'
            ]"
            @click="gameStore.gold >= item.price && canPurchase && purchaseItem(item)"
            @mouseenter="hoveredItem = item"
            @mouseleave="hoveredItem = null"
          >
            <div class="store-item-content">
              <!-- 左侧圆形图片 -->
              <div class="store-item-image-wrapper">
                <img
                  v-if="getItemImage(item)"
                  :src="getItemImage(item)"
                  :alt="item.name"
                  class="store-item-image"
                />
                <div v-else class="store-item-image-placeholder">
                  {{ item.name.charAt(0) }}
                </div>
              </div>
              
              <!-- 右侧信息 -->
              <div class="store-item-info">
                <div class="store-item-name">{{ item.name }}</div>
                <div class="store-item-price">{{ item.price }} 金币</div>
              </div>
            </div>
            
            <!-- 错误提示 -->
            <div
              v-if="gameStore.gold < item.price"
              class="store-item-error"
            >
              金币不足
            </div>
            <div
              v-else-if="!canPurchase"
              class="store-item-warning"
            >
              装备栏已满
            </div>
            
            <!-- 悬浮提示框 -->
            <div
              v-if="hoveredItem === item && item.stats && Object.keys(item.stats).length > 0"
              class="store-item-tooltip"
            >
              <div class="tooltip-title">效果</div>
              <div class="tooltip-stats">
                <div
                  v-for="(value, key) in item.stats"
                  :key="key"
                  class="tooltip-stat"
                >
                  <span class="tooltip-stat-label">{{ getStatLabel(key) }}</span>
                  <span class="tooltip-stat-value">{{ getStatValue(key, value) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 紫色品质列 -->
      <div class="store-quality-column">
        <div class="quality-items">
          <div
            v-for="item in itemsByQuality.purple"
            :key="item.id"
            :class="[
              'store-item',
              qualityColors[item.quality],
              gameStore.gold >= item.price && canPurchase
                ? 'store-item-purchasable'
                : 'store-item-disabled'
            ]"
            @click="gameStore.gold >= item.price && canPurchase && purchaseItem(item)"
            @mouseenter="hoveredItem = item"
            @mouseleave="hoveredItem = null"
          >
            <div class="store-item-content">
              <!-- 左侧圆形图片 -->
              <div class="store-item-image-wrapper">
                <img
                  v-if="getItemImage(item)"
                  :src="getItemImage(item)"
                  :alt="item.name"
                  class="store-item-image"
                />
                <div v-else class="store-item-image-placeholder">
                  {{ item.name.charAt(0) }}
                </div>
              </div>
              
              <!-- 右侧信息 -->
              <div class="store-item-info">
                <div class="store-item-name">{{ item.name }}</div>
                <div class="store-item-price">{{ item.price }} 金币</div>
              </div>
            </div>
            
            <!-- 错误提示 -->
            <div
              v-if="gameStore.gold < item.price"
              class="store-item-error"
            >
              金币不足
            </div>
            <div
              v-else-if="!canPurchase"
              class="store-item-warning"
            >
              装备栏已满
            </div>
            
            <!-- 悬浮提示框 -->
            <div
              v-if="hoveredItem === item && item.stats && Object.keys(item.stats).length > 0"
              class="store-item-tooltip"
            >
              <div class="tooltip-title">效果</div>
              <div class="tooltip-stats">
                <div
                  v-for="(value, key) in item.stats"
                  :key="key"
                  class="tooltip-stat"
                >
                  <span class="tooltip-stat-label">{{ getStatLabel(key) }}</span>
                  <span class="tooltip-stat-value">{{ getStatValue(key, value) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.store-container {
  background-color: white;
  border-radius: 0.5rem;
  padding: 1.5rem;
  border: 1px solid #e5e7eb;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

.store-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.store-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.gold-display {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #111827;
}

.gold-amount {
  font-size: 1.25rem;
  font-weight: 700;
}

/* Tab 切换样式 */
.store-tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  border-bottom: 2px solid #e5e7eb;
}

.store-tab {
  padding: 0.75rem 1.5rem;
  background: none;
  border: none;
  border-bottom: 3px solid transparent;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  color: #6b7280;
  transition: all 0.2s;
  margin-bottom: -2px;
}

.store-tab:hover {
  color: #111827;
  background-color: #f9fafb;
}

.store-tab-active {
  color: #111827;
  border-bottom-color: #10b981;
}

/* 按品质分3列布局 */
.store-quality-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.store-quality-column {
  display: flex;
  flex-direction: column;
}

.quality-header {
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
  font-weight: 700;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.quality-header-green {
  background-color: rgba(16, 185, 129, 0.1);
  color: #10b981;
  border: 2px solid #10b981;
}

.quality-header-blue {
  background-color: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
  border: 2px solid #3b82f6;
}

.quality-header-purple {
  background-color: rgba(168, 85, 247, 0.1);
  color: #a855f7;
  border: 2px solid #a855f7;
}

.quality-label {
  font-size: 1.125rem;
}

.quality-count {
  font-size: 0.875rem;
  opacity: 0.8;
}

.quality-items {
  display: grid;
  grid-template-rows: repeat(2, auto);
  gap: 0.75rem;
  grid-auto-flow: row;
}

@media (max-width: 1024px) {
  .store-quality-grid {
    grid-template-columns: 1fr;
  }
}

.store-item {
  position: relative;
  padding: 0.625rem;
  border-radius: 0.375rem;
  border-width: 2px;
  transition: all 0.2s;
  cursor: pointer;
}

.store-item-purchasable:hover {
  transform: scale(1.05);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.store-item-disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.item-quality-green {
  border-color: #10b981;
  background-color: rgba(16, 185, 129, 0.1);
  color: #4ade80;
}

.item-quality-blue {
  border-color: #3b82f6;
  background-color: rgba(59, 130, 246, 0.1);
  color: #60a5fa;
}

.item-quality-purple {
  border-color: #a855f7;
  background-color: rgba(168, 85, 247, 0.1);
  color: #a78bfa;
}

.store-item-content {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.store-item-image-wrapper {
  flex-shrink: 0;
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.2);
}

.store-item-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.store-item-image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  font-weight: 700;
  color: currentColor;
}

.store-item-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  min-width: 0;
}

.store-item-name {
  font-weight: 700;
  font-size: 0.875rem;
  line-height: 1.2;
}

.store-item-price {
  font-size: 0.75rem;
  font-weight: 600;
  opacity: 0.9;
}

.store-item-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.375rem;
}

.store-item-stats {
  margin-top: 0.375rem;
}

.store-item-stats > * + * {
  margin-top: 0.125rem;
}

.store-item-stat {
  font-size: 0.75rem;
}

.store-item-stat-label {
  text-transform: capitalize;
}

.store-item-stat-value {
  margin-left: 0.5rem;
}

.store-item-error {
  margin-top: 0.375rem;
  font-size: 0.625rem;
  color: #dc2626;
}

.store-item-warning {
  margin-top: 0.375rem;
  font-size: 0.625rem;
  color: #ca8a04;
}

.store-item-tooltip {
  position: absolute;
  top: calc(100% + 0.5rem);
  left: 0;
  right: 0;
  padding: 0.75rem;
  background-color: #1f2937;
  color: white;
  border-radius: 0.375rem;
  z-index: 100;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2);
  animation: tooltipFadeIn 0.2s ease-out;
  pointer-events: none;
}

.store-item-tooltip::before {
  content: '';
  position: absolute;
  top: -0.375rem;
  left: 1rem;
  width: 0;
  height: 0;
  border-left: 0.375rem solid transparent;
  border-right: 0.375rem solid transparent;
  border-bottom: 0.375rem solid #1f2937;
}

@keyframes tooltipFadeIn {
  from {
    opacity: 0;
    transform: translateY(-0.5rem);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.tooltip-title {
  font-weight: 700;
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
  color: #f3f4f6;
}

.tooltip-stats {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.tooltip-stat {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.75rem;
}

.tooltip-stat-label {
  color: #d1d5db;
}

.tooltip-stat-value {
  color: #60a5fa;
  font-weight: 600;
}
</style>
