<script setup>
import StoreComponent from './components/StoreComponent.vue'
import HeroPanel from './components/HeroPanel.vue'
import InventoryPanel from './components/InventoryPanel.vue'
</script>

<template>
  <div class="ow-app">
    <div class="ow-container">
      <h1 class="ow-title">
        角斗领域：军械库模拟器
      </h1>
      
      <!-- 三列布局：装备栏（左）、军械库（中）、面板（右） -->
      <div class="ow-main-grid">
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

