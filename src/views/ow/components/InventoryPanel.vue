<script setup>
import { computed, ref } from 'vue'
import { gameStore } from '~/stores/gameStore'
import { Package } from 'lucide-vue-next'

const inventory = computed(() => gameStore.inventory)
const hoveredSlot = ref(null)

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

// 获取图片路径
const getItemImage = (item) => {
  if (item && item.img) {
    return item.img.startsWith('/') ? item.img : `/${item.img}`
  }
  return null
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
        @mouseenter="hoveredSlot = slot ? index : null"
        @mouseleave="hoveredSlot = null"
      >
        <div v-if="slot" class="inventory-slot-content">
          <img
            v-if="getItemImage(slot)"
            :src="getItemImage(slot)"
            :alt="slot.name"
            class="inventory-item-image"
          />
          <div v-else class="inventory-item-placeholder">
            {{ slot.name.charAt(0) }}
          </div>
        </div>
        <div v-else class="inventory-slot-empty-text">空</div>
        
        <!-- 悬浮提示框 -->
        <div
          v-if="hoveredSlot === index && slot && slot.stats && Object.keys(slot.stats).length > 0"
          class="inventory-item-tooltip"
        >
          <div class="tooltip-name">{{ slot.name }}</div>
          <div class="tooltip-stats">
            <div
              v-for="(value, key) in slot.stats"
              :key="key"
              class="tooltip-stat"
            >
              <span class="tooltip-stat-label">{{ key }}</span>
              <span class="tooltip-stat-value">
                +{{ value }}{{ key === 'damage' || key === 'cooldown' || key === 'lifesteal' ? '%' : '' }}
              </span>
            </div>
          </div>
        </div>
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
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-radius: 0.125rem;
}

.inventory-item-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.inventory-item-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 700;
  color: currentColor;
  background-color: rgba(255, 255, 255, 0.2);
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

.inventory-item-tooltip {
  position: absolute;
  top: calc(100% + 0.5rem);
  left: 50%;
  transform: translateX(-50%);
  padding: 0.5rem 0.75rem;
  background-color: #1f2937;
  color: white;
  border-radius: 0.375rem;
  z-index: 100;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2);
  animation: tooltipFadeIn 0.2s ease-out;
  pointer-events: none;
  white-space: nowrap;
  min-width: 120px;
}

.inventory-item-tooltip::before {
  content: '';
  position: absolute;
  top: -0.375rem;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 0.375rem solid transparent;
  border-right: 0.375rem solid transparent;
  border-bottom: 0.375rem solid #1f2937;
}

@keyframes tooltipFadeIn {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(-0.5rem);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}

.tooltip-name {
  font-weight: 700;
  font-size: 0.75rem;
  margin-bottom: 0.375rem;
  color: #f3f4f6;
  text-align: center;
}

.tooltip-stats {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.tooltip-stat {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.625rem;
  gap: 0.5rem;
}

.tooltip-stat-label {
  color: #d1d5db;
}

.tooltip-stat-value {
  color: #60a5fa;
  font-weight: 600;
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
