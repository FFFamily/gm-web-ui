<script setup>
import { computed } from 'vue'
import { gameStore, storeItems } from '../../../stores/gameStore'
import { ShoppingCart, Coins } from 'lucide-vue-next'

const qualityColors = {
  green: 'border-green-500 bg-green-500/10 text-green-400',
  blue: 'border-blue-500 bg-blue-500/10 text-blue-400',
  purple: 'border-purple-500 bg-purple-500/10 text-purple-400'
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
  <div class="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-2xl font-bold text-gray-900 flex items-center gap-2">
        <ShoppingCart :size="24" />
        军械库
      </h2>
      <div class="flex items-center gap-2 text-gray-900">
        <Coins :size="20" />
        <span class="text-xl font-bold">{{ gameStore.gold }}</span>
      </div>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div
        v-for="item in storeItems"
        :key="item.id"
        :class="[
          'p-4 rounded-lg border-2 transition-all cursor-pointer',
          qualityColors[item.quality],
          gameStore.gold >= item.price && canPurchase
            ? 'hover:scale-105 hover:shadow-lg'
            : 'opacity-50 cursor-not-allowed'
        ]"
        @click="gameStore.gold >= item.price && canPurchase && purchaseItem(item)"
      >
        <div class="flex justify-between items-start mb-2">
          <h3 class="font-bold text-lg">{{ item.name }}</h3>
          <span class="text-sm font-semibold">{{ item.price }} 金币</span>
        </div>
        
        <div class="mt-2 space-y-1">
          <div
            v-for="(value, key) in item.stats"
            :key="key"
            class="text-sm"
          >
            <span class="capitalize">
              {{ key === 'damage' ? '伤害' : key === 'cooldown' ? '冷却缩减' : key === 'health' ? '生命值' : '吸血' }}
            </span>
            <span class="ml-2">+{{ value }}{{ key === 'damage' || key === 'cooldown' || key === 'lifesteal' ? '%' : '' }}</span>
          </div>
        </div>
        
        <div
          v-if="gameStore.gold < item.price"
          class="mt-2 text-xs text-red-600"
        >
          金币不足
        </div>
        <div
          v-else-if="!canPurchase"
          class="mt-2 text-xs text-yellow-600"
        >
          装备栏已满
        </div>
      </div>
    </div>
  </div>
</template>
