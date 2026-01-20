<script setup>
import { computed } from 'vue'
import { gameStore, storeItems } from '../../../stores/gameStore'
import { ShoppingCart, Coins } from 'lucide-vue-next'

const qualityColors = {
  green: 'item-quality-green',
  blue: 'item-quality-blue',
  purple: 'item-quality-purple'
}

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
    
    <div class="store-items-grid">
      <div
        v-for="item in storeItems"
        :key="item.id"
        :class="[
          'store-item',
          qualityColors[item.quality],
          gameStore.gold >= item.price && canPurchase
            ? 'store-item-purchasable'
            : 'store-item-disabled'
        ]"
        @click="gameStore.gold >= item.price && canPurchase && purchaseItem(item)"
      >
        <div class="store-item-header">
          <h3 class="store-item-name">{{ item.name }}</h3>
          <span class="store-item-price">{{ item.price }} 金币</span>
        </div>
        
        <div class="store-item-stats">
          <div
            v-for="(value, key) in item.stats"
            :key="key"
            class="store-item-stat"
          >
            <span class="store-item-stat-label">
              {{ key === 'damage' ? '伤害' : key === 'cooldown' ? '冷却缩减' : key === 'health' ? '生命值' : '吸血' }}
            </span>
            <span class="store-item-stat-value">+{{ value }}{{ key === 'damage' || key === 'cooldown' || key === 'lifesteal' ? '%' : '' }}</span>
          </div>
        </div>
        
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

.store-items-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

@media (min-width: 768px) {
  .store-items-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

.store-item {
  padding: 1rem;
  border-radius: 0.5rem;
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

.store-item-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.5rem;
}

.store-item-name {
  font-weight: 700;
  font-size: 1.125rem;
}

.store-item-price {
  font-size: 0.875rem;
  font-weight: 600;
}

.store-item-stats {
  margin-top: 0.5rem;
}

.store-item-stats > * + * {
  margin-top: 0.25rem;
}

.store-item-stat {
  font-size: 0.875rem;
}

.store-item-stat-label {
  text-transform: capitalize;
}

.store-item-stat-value {
  margin-left: 0.5rem;
}

.store-item-error {
  margin-top: 0.5rem;
  font-size: 0.75rem;
  color: #dc2626;
}

.store-item-warning {
  margin-top: 0.5rem;
  font-size: 0.75rem;
  color: #ca8a04;
}
</style>
