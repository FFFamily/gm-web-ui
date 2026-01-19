<script setup>
import { computed } from 'vue'
import { gameStore } from '../../../stores/gameStore'
import { Shield, Zap, Heart, Droplet } from 'lucide-vue-next'

const stats = computed(() => gameStore.heroStats)
</script>

<template>
  <div class="bg-white rounded-lg p-6 border border-gray-200 shadow-sm sticky top-6">
    <h2 class="text-2xl font-bold text-gray-900 mb-6">英雄数据面板</h2>
    
    <div class="space-y-4">
      <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
        <div class="flex items-center gap-3">
          <Zap :size="20" class="text-gray-700" />
          <span class="text-gray-700">伤害</span>
        </div>
        <span class="text-xl font-bold text-gray-900">{{ stats.damage }}%</span>
      </div>
      
      <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
        <div class="flex items-center gap-3">
          <Shield :size="20" class="text-gray-700" />
          <span class="text-gray-700">冷却缩减</span>
        </div>
        <span class="text-xl font-bold text-gray-900">{{ stats.cooldown }}%</span>
      </div>
      
      <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
        <div class="flex items-center gap-3">
          <Heart :size="20" class="text-red-600" />
          <span class="text-gray-700">生命值</span>
        </div>
        <span class="text-xl font-bold text-red-600">{{ stats.health }}</span>
      </div>
      
      <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
        <div class="flex items-center gap-3">
          <Droplet :size="20" class="text-pink-600" />
          <span class="text-gray-700">吸血</span>
        </div>
        <span class="text-xl font-bold text-pink-600">{{ stats.lifesteal }}%</span>
      </div>
    </div>
  </div>
</template>
