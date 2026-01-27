<script setup>
import { computed } from 'vue'
import { gameStore } from '~/stores/gameStore'

const heroes = computed(() => gameStore.heroes || [])

const onSelect = async (heroCode) => {
  await gameStore.selectHero(heroCode)
}
</script>

<template>
  <div class="hero-select">
    <div class="hero-select__title">先选择英雄</div>
    <div class="hero-select__grid">
      <button
        v-for="h in heroes"
        :key="h.heroCode"
        class="hero-select__card"
        @click="onSelect(h.heroCode)"
      >
        <div class="hero-select__avatar">
          <img v-if="h.avatarUrl" :src="h.avatarUrl" :alt="h.heroName" class="hero-select__avatar-img" />
          <div v-else class="hero-select__avatar-placeholder">{{ (h.heroName || '').charAt(0) }}</div>
        </div>
        <div class="hero-select__info">
          <div class="hero-select__name">{{ h.heroName }}</div>
          <div v-if="h.description" class="hero-select__desc">{{ h.description }}</div>
        </div>
      </button>
    </div>
  </div>
</template>

<style scoped>
.hero-select {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  padding: 1rem;
}

.hero-select__title {
  font-size: 1rem;
  font-weight: 800;
  color: #111827;
  margin-bottom: 0.75rem;
}

.hero-select__grid {
  display: grid;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  gap: 0.75rem;
}

@media (min-width: 768px) {
  .hero-select__grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

.hero-select__card {
  width: 100%;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  padding: 0.75rem;
  background: #ffffff;
  cursor: pointer;
  display: flex;
  gap: 0.75rem;
  align-items: center;
  transition: box-shadow 0.15s ease, transform 0.15s ease;
  text-align: left;
}

.hero-select__card:hover {
  transform: translateY(-1px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.08);
}

.hero-select__avatar {
  width: 44px;
  height: 44px;
  border-radius: 999px;
  overflow: hidden;
  flex: 0 0 auto;
  border: 1px solid #e5e7eb;
  background: #f9fafb;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hero-select__avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.hero-select__avatar-placeholder {
  font-weight: 900;
  color: #111827;
}

.hero-select__name {
  font-weight: 800;
  color: #111827;
}

.hero-select__desc {
  font-size: 12px;
  color: #6b7280;
  margin-top: 2px;
}
</style>

