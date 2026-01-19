<script setup>
import { computed } from 'vue'
import { gameStore } from '../../../stores/gameStore'
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
  green: 'border-green-500 bg-green-500/10',
  blue: 'border-blue-500 bg-blue-500/10',
  purple: 'border-purple-500 bg-purple-500/10'
}
</script>

<template>
  <div class="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
    <h2 class="text-2xl font-bold text-gray-900 flex items-center gap-2 mb-4">
      <Package :size="24" />
      已购装备栏
    </h2>
    
    <div class="grid grid-cols-3 gap-3">
      <div
        v-for="(slot, index) in inventorySlots"
        :key="index"
        :class="[
          'aspect-square rounded-lg border-2 flex flex-col items-center justify-center p-2',
          slot
            ? qualityColors[slot.quality]
            : 'border-gray-300 bg-gray-50 border-dashed'
        ]"
      >
        <div v-if="slot" class="text-center">
          <div class="text-xs font-bold mb-1">{{ slot.name }}</div>
          <div class="text-[10px] space-y-0.5">
            <div
              v-for="(value, key) in slot.stats"
              :key="key"
            >
              +{{ value }}{{ key === 'damage' || key === 'cooldown' || key === 'lifesteal' ? '%' : '' }}
            </div>
          </div>
        </div>
        <div v-else class="text-gray-400 text-xs">空</div>
      </div>
    </div>
    
    <div class="mt-4 text-sm text-gray-600 text-center">
      已使用: {{ inventory.length }} / 6
    </div>
  </div>
</template>
