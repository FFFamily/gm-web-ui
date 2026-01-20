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
      
      <div class="ow-grid">
        <!-- 左侧：已购装备栏 -->
        <div>
          <InventoryPanel />
        </div>
        
        <!-- 中间：商店 -->
        <div>
          <StoreComponent />
        </div>
        
        <!-- 右侧：英雄数据面板 -->
        <div>
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

.ow-grid {
  display: grid;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  gap: 1.5rem;
}

@media (min-width: 1024px) {
  .ow-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
</style>

