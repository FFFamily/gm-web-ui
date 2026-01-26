<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const isScrolled = ref(false)

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

const handleScroll = () => {
  isScrolled.value = window.scrollY > 50
}

const scrollToSection = (id) => {
  // 如果当前不在首页，先跳转到首页
  if (route.path !== '/') {
    router.push('/')
    // 等待路由切换完成后再滚动
    setTimeout(() => {
      const element = document.getElementById(id)
      if (element) element.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  } else {
    const element = document.getElementById(id)
    if (element) element.scrollIntoView({ behavior: 'smooth' })
  }
}

const goToHome = () => {
  if (route.path !== '/') router.push('/')
  else window.scrollTo({ top: 0, behavior: 'smooth' })
}

const goToAdmin = () => {
  router.push('/admin')
}
</script>

<template>
  <div class="app-container">
    <!-- 导航栏 -->
    <nav :class="{ scrolled: isScrolled }" class="navbar">
      <div class="nav-container">
        <div class="logo" @click="goToHome">
          <span class="logo-text">游戏宅天地</span>
        </div>
        <ul class="nav-menu">
          <li><a @click.prevent="scrollToSection('home')" href="#home">首页</a></li>
          <li><a @click.prevent="scrollToSection('features')" href="#features">功能</a></li>
          <li><a @click.prevent="scrollToSection('about')" href="#about">关于</a></li>
          <li><a @click.prevent="scrollToSection('contact')" href="#contact">联系</a></li>
          <li><a @click.prevent="goToAdmin" href="/admin">后台管理</a></li>
        </ul>
      </div>
    </nav>

    <router-view />
  </div>
</template>

<style>
/* 导航栏样式 */
.navbar {
  position: fixed;
  top: 0.75rem;
  left: 1rem;
  right: 1rem;
  z-index: 1000;
  padding: 1rem 0;
  background: rgba(240, 253, 244, 0.72);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  border: 1px solid rgba(16, 185, 129, 0.14);
  border-radius: 999px;
  box-shadow: 0 14px 40px rgba(2, 44, 34, 0.08);
}

.navbar.scrolled {
  background: rgba(240, 253, 244, 0.92);
  box-shadow: 0 18px 55px rgba(2, 44, 34, 0.12);
  border-color: rgba(16, 185, 129, 0.18);
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.5rem;
  font-weight: 700;
  color: #10b981;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.logo:hover {
  transform: scale(1.05);
}

.logo-text {
  background: linear-gradient(135deg, #6ee7b7 0%, #34d399 50%, #10b981 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.nav-menu {
  display: flex;
  list-style: none;
  gap: 2rem;
  margin: 0;
  padding: 0;
}

.nav-menu a {
  color: #334155;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  padding: 0.25rem 0;
}

.nav-menu a:focus-visible {
  outline: 3px solid rgba(16, 185, 129, 0.35);
  outline-offset: 6px;
  border-radius: 8px;
}

.nav-menu a::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background: linear-gradient(135deg, #6ee7b7 0%, #34d399 100%);
  transition: width 0.3s ease;
}

.nav-menu a:hover {
  color: #10b981;
}

.nav-menu a:hover::after {
  width: 100%;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .navbar {
    left: 0.75rem;
    right: 0.75rem;
    padding: 0.75rem 0;
  }

  .nav-menu {
    gap: 1rem;
    font-size: 0.9rem;
  }
}
</style>
