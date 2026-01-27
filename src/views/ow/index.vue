<script setup>
import { computed, onMounted } from 'vue'
import { gameStore } from '~/stores/gameStore'

import HeroSelect from './components/HeroSelect.vue'
import StoreComponent from './components/StoreComponent.vue'
import HeroPanel from './components/HeroPanel.vue'
import InventoryPanel from './components/InventoryPanel.vue'

onMounted(() => {
  gameStore.bootstrap()
})

const selectedHeroName = computed(() => gameStore.selectedHero?.heroName)
</script>

<template>
  <div class="ow-app">
    <div class="ow-container">
      <h1 class="ow-title">
        角斗领域：军械库模拟器
      </h1>

      <div v-if="selectedHeroName" class="ow-subtitle">
        当前英雄：{{ selectedHeroName }}
        <button class="ow-switch" @click="gameStore.clearHero()">切换英雄</button>
      </div>

      <div v-if="!gameStore.selectedHero" class="ow-hero-select-wrapper">
        <HeroSelect />
      </div>
      
      <!-- 三列布局：装备栏（左）、军械库（中）、面板（右） -->
      <div v-else class="ow-main-grid">
        <!-- 左侧：装备栏 -->
        <div class="ow-inventory-section">
          <InventoryPanel />
        </div>
        
        <!-- 中间：军械库 -->
        <div class="ow-store-section">
          <StoreComponent />
        </div>
        
        <!-- 右侧：英雄数据面板 -->
        <div class="ow-hero-section">
          <HeroPanel />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.ow-app {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  min-height: 100vh;
  background-color: #ffffff;
  color: #111827;
  padding-top: 5rem;
}

.ow-container {
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  padding-left: 1rem;
  padding-right: 1rem;
  padding-top: 1.5rem;
  padding-bottom: 1.5rem;
}

@media (min-width: 640px) {
  .ow-container {
    max-width: 640px;
  }
}

@media (min-width: 768px) {
  .ow-container {
    max-width: 768px;
  }
}

@media (min-width: 1024px) {
  .ow-container {
    max-width: 1024px;
  }
}

@media (min-width: 1280px) {
  .ow-container {
    max-width: 1280px;
  }
}

@media (min-width: 1536px) {
  .ow-container {
    max-width: 1536px;
  }
}

.ow-title {
  font-size: 2.25rem;
  line-height: 2.5rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 2rem;
  color: #111827;
}

.ow-subtitle {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  color: #334155;
  font-weight: 700;
  margin-bottom: 1rem;
}

.ow-switch {
  border: 1px solid #e5e7eb;
  padding: 6px 10px;
  border-radius: 999px;
  background: #ffffff;
  cursor: pointer;
  font-weight: 700;
}

.ow-switch:hover {
  background: #f9fafb;
}

.ow-hero-select-wrapper {
  max-width: 1024px;
  margin: 0 auto;
}

.ow-main-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

@media (min-width: 1024px) {
  .ow-main-grid {
    grid-template-columns: 90px 1fr 280px;
  }
}

.ow-inventory-section {

  min-width: 0;
}

.ow-store-section {
  min-width: 0;
}

.ow-hero-section {
  min-width: 0;
}
</style>
