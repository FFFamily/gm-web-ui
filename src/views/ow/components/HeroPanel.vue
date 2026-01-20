<script setup>
import { computed, reactive } from 'vue'
import { heroStatConfigs } from '../../../data/ow/baseInfo.js'

// 将配置转换为响应式对象
const stats = reactive(
  heroStatConfigs.reduce((acc, config) => {
    acc[config.key] = config.value
    return acc
  }, {})
)

// 从配置中生成配置数组
const statConfigs = computed(() => {
  return heroStatConfigs.map(config => ({
    ...config,
    value: stats[config.key] // 使用响应式的值
  }))
})
</script>

<template>
  <div class="hero-panel">
    <h2 class="hero-panel__title">英雄数据面板</h2>
    
    <div class="hero-panel__list">
      <div 
        v-for="config in statConfigs" 
        :key="config.key"
        class="hero-panel__item"
      >
        <div class="hero-panel__label-wrapper">
          <span class="hero-panel__label">{{ config.label }}</span>
        </div>
        <span :class="['hero-panel__value', config.color]">
          {{ config.value }}{{ config.unit }}
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.hero-panel {
  background-color: white;
  border-radius: 0.5rem;
  padding: 1.25rem;
  border: 1px solid rgb(229, 231, 235);
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  position: sticky;
  top: 1.5rem;
  max-height: calc(100vh - 3rem);
  overflow-y: auto;
  width: 100%;
}

.hero-panel__title {
  font-size: 1.25rem;
  line-height: 1.75rem;
  font-weight: 700;
  color: rgb(17, 24, 39);
  margin-bottom: 1rem;
  position: sticky;
  top: 0;
  background-color: white;
  padding-bottom: 0.5rem;
}

.hero-panel__list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.hero-panel__item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.625rem;
  background-color: rgb(249, 250, 251);
  border-radius: 0.5rem;
  border: 1px solid rgb(229, 231, 235);
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

.hero-panel__item:hover {
  background-color: rgb(243, 244, 246);
}

.hero-panel__label-wrapper {
  display: flex;
  align-items: center;
}

.hero-panel__label {
  color: rgb(55, 65, 81);
  font-weight: 500;
}

.hero-panel__value {
  font-size: 1.125rem;
  line-height: 1.5rem;
  font-weight: 700;
}
</style>
