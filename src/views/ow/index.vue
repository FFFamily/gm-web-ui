<script setup>
import StoreComponent from './components/StoreComponent.vue'
import HeroPanel from './components/HeroPanel.vue'
import InventoryPanel from './components/InventoryPanel.vue'
</script>

<template>
  <div class="ow-app min-h-screen bg-white text-gray-900 pt-20">
    <div class="container mx-auto px-4 py-6">
      <h1 class="text-4xl font-bold text-center mb-8 text-gray-900">
        角斗领域：军械库模拟器
      </h1>
      
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- 左侧：商店 -->
        <div class="lg:col-span-2 space-y-6">
          <!-- 军械库组件 -->
          <StoreComponent />
        </div>
        
        <!-- 右侧：英雄数据面板和已购装备栏 -->
        <div class="space-y-6">
          <HeroPanel />
          <InventoryPanel />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.ow-app {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}
</style>
