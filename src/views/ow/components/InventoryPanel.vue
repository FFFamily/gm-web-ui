<script setup>
import { computed } from 'vue'
import { gameStore } from '~/stores/gameStore'
import { Package } from 'lucide-vue-next'
const inventory = computed(() => gameStore.inventory)
const inventorySlots = computed(() => {
  const slots = Array(6).fill(null)
  inventory.value.forEach((item, index) => {
    if (index < 6) {
      slots[index] = item
    }
  })
  return slots
})

const qualityColors = {
  green: 'inventory-slot--green',
  blue: 'inventory-slot--blue',
  purple: 'inventory-slot--purple'
}
</script>

<template>
  <div class="inventory-panel">
    <div class="inventory-header">
      <h2 class="inventory-title">
        <Package :size="14" />
        已购装备栏
      </h2>
      <div class="inventory-footer">
        已使用: {{ inventory.length }} / 6
      </div>
    </div>
    
    <div class="inventory-grid">
      <div
        v-for="(slot, index) in inventorySlots"
        :key="index"
        :class="[
          'inventory-slot',
          slot
            ? qualityColors[slot.quality]
            : 'inventory-slot--empty'
        ]"
      >
        <div v-if="slot" class="inventory-slot-content">
          <div class="inventory-item-name">{{ slot.name }}</div>
          <div class="inventory-item-stats">
            <div
              v-for="(value, key) in slot.stats"
              :key="key"
            >
              +{{ value }}{{ key === 'damage' || key === 'cooldown' || key === 'lifesteal' ? '%' : '' }}
            </div>
          </div>
        </div>
        <div v-else class="inventory-slot-empty-text">空</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.inventory-panel {
  background-color: white;
  border-radius: 0.25rem;
  padding: 0.375rem;
  border: 1px solid #e5e7eb;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

.inventory-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.375rem;
}

.inventory-title {
  font-size: 0.75rem;
  font-weight: 700;
  color: #111827;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  margin: 0;
}

.inventory-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 0.25rem;
}

.inventory-slot {
  aspect-ratio: 1;
  border-radius: 0.25rem;
  border-width: 1.5px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0.125rem;
  min-height: 0;
}

.inventory-slot--green {
  border-color: #10b981;
  background-color: rgba(16, 185, 129, 0.1);
}

.inventory-slot--blue {
  border-color: #3b82f6;
  background-color: rgba(59, 130, 246, 0.1);
}

.inventory-slot--purple {
  border-color: #a855f7;
  background-color: rgba(168, 85, 247, 0.1);
}

.inventory-slot--empty {
  border-color: #d1d5db;
  background-color: #f9fafb;
  border-style: dashed;
}

.inventory-slot-content {
  text-align: center;
}

.inventory-item-name {
  font-size: 0.75rem;
  font-weight: 700;
  margin-bottom: 0.125rem;
  line-height: 1.2;
  word-break: break-all;
}

.inventory-item-stats {
  font-size: 0.625rem;
  line-height: 1.2;
}

.inventory-item-stats > div {
  margin-bottom: 0.0625rem;
}

.inventory-item-stats > div:last-child {
  margin-bottom: 0;
}

.inventory-slot-empty-text {
  color: #9ca3af;
  font-size: 0.75rem;
}

.inventory-footer {
  font-size: 0.625rem;
  color: #4b5563;
  margin: 0;
}

@media (max-width: 1024px) {
  .inventory-grid {
    grid-template-columns: repeat(3, 1fr);
  }
  
  .inventory-slot {
    aspect-ratio: 1;
  }
}
</style>
