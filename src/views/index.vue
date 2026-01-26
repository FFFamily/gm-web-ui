<script setup>
import { onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowRight, Sparkles, Swords } from 'lucide-vue-next'

const router = useRouter()

onMounted(() => {
  // 等待 DOM 完全渲染后再初始化动画
  nextTick(() => {
    const reducedMotion =
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // 对“减少动态效果”的用户：直接展示内容，避免滚动/数字动画
    if (reducedMotion) {
      document.querySelectorAll('.animate-on-scroll').forEach((el) => {
        el.classList.add('animate-in')
      })
      return
    }

    // 添加滚动触发的动画
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    }
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in')
          
          // 如果是统计卡片，触发数字计数动画
          const statNumber = entry.target.querySelector('.stat-number')
          if (statNumber) {
            animateNumber(statNumber)
          }
          
          observer.unobserve(entry.target)
        }
      })
    }, observerOptions)
    
    // 观察所有需要动画的元素
    const animatedElements = document.querySelectorAll('.animate-on-scroll')
    animatedElements.forEach(el => observer.observe(el))
  })
})

// 数字计数动画函数
const animateNumber = (element) => {
  const text = element.textContent
  const match = text.match(/(\d+)([K+]*)/)
  if (!match) return
  
  const targetNumber = parseInt(match[1])
  const suffix = match[2] || ''
  const duration = 2000 // 2秒
  const steps = 60
  const increment = targetNumber / steps
  let current = 0
  let step = 0
  
  const timer = setInterval(() => {
    step++
    current = Math.min(Math.floor(increment * step), targetNumber)
    element.textContent = current + suffix
    
    if (step >= steps) {
      clearInterval(timer)
      element.textContent = targetNumber + suffix
    }
  }, duration / steps)
}

const scrollToSection = (id) => {
  const element = document.getElementById(id)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
}

const goToOwPage = () => {
  router.push('/ow')
}
</script>

<template>
  <div class="home-page">
    <!-- 英雄区域 -->
    <section id="home" class="hero">
      <div class="hero-background">
        <div class="gradient-orb orb-1"></div>
        <div class="gradient-orb orb-2"></div>
        <div class="gradient-orb orb-3"></div>
        <div class="floating-shapes">
          <div class="shape shape-1"></div>
          <div class="shape shape-2"></div>
          <div class="shape shape-3"></div>
          <div class="shape shape-4"></div>
          <div class="shape shape-5"></div>
        </div>
      </div>
      <div class="hero-content">
        <div class="hero-badge">
          <Sparkles class="hero-badge-icon" aria-hidden="true" />
          <span>新功能：守望先锋军械库模拟器</span>
        </div>
        <h1 class="hero-title">
          <span class="title-line">欢迎来到</span>
          <span class="title-main">游戏宅天地</span>
        </h1>
        <p class="hero-subtitle">热爱游戏，热爱生活</p>
        <p class="hero-description">一个收纳小工具与灵感的轻量游戏站点。</p>
        <div class="hero-buttons">
          <button class="btn btn-primary" @click="scrollToSection('features')">
            开始探索
            <ArrowRight class="btn-icon" aria-hidden="true" />
          </button>
          <button class="btn btn-secondary" @click="scrollToSection('about')">
            了解更多
            <ArrowRight class="btn-icon" aria-hidden="true" />
          </button>
        </div>
        <div class="hero-image">
          <div class="image-frame">
            <img src="/home.png" alt="首页展示图" />
          </div>
        </div>
      </div>
    </section>

    <!-- 守望先锋角斗领域 -->
    <section id="features" class="features">
      <div class="container">
        <h2 class="ow-section-title animate-on-scroll">守望先锋角斗领域</h2>
        <p class="section-subtitle animate-on-scroll">军械库 · 配装 · 数据，一站式整理</p>
        <div class="ow-section animate-on-scroll">
          <div class="ow-content">
            <p class="ow-description">
              快速试配武器与配件，查看关键数值与手感差异。
            </p>
            <button class="ow-link" type="button" @click="goToOwPage">
              <Swords class="ow-link-icon" aria-hidden="true" />
              军械库模拟器
              <ArrowRight class="ow-link-arrow" aria-hidden="true" />
            </button>
          </div>
          <div class="ow-image">
            <div class="image-frame image-frame--compact">
              <img src="/ow-jiaodou-1.png" alt="守望先锋角斗领域" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 关于我们 -->
    <section id="about" class="about">
      <div class="container">
        <h2 class="section-title animate-on-scroll">关于图图小破站</h2>
        <p class="section-subtitle animate-on-scroll">轻量、好用、顺手：把注意力留给游戏与生活</p>
        <div class="about-content animate-on-scroll">
          <div class="about-text">
            <p class="about-intro">
              这里是一个“边玩边做”的小站：把常用的小工具、数据与灵感收在一起，
              让你更快进入状态，把时间留给游戏与生活。
            </p>
            <div class="stats">
              <div class="stat-item animate-on-scroll">
                <div class="stat-number">10K+</div>
                <div class="stat-label">活跃玩家</div>
              </div>
              <div class="stat-item animate-on-scroll">
                <div class="stat-number">50K+</div>
                <div class="stat-label">攻略收藏</div>
              </div>
              <div class="stat-item animate-on-scroll">
                <div class="stat-number">100+</div>
                <div class="stat-label">配装方案</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 联系/页脚 -->
    <footer id="contact" class="footer">
      <div class="container">
        <div class="footer-content">
          <div class="footer-section">
            <h3>图图小破站</h3>
            <p>让工具更顺手，让快乐更纯粹</p>
          </div>
          <div class="footer-section">
            <h4>快速链接</h4>
            <ul>
              <li><a @click.prevent="scrollToSection('home')" href="#home">首页</a></li>
              <li><a @click.prevent="scrollToSection('features')" href="#features">功能</a></li>
              <li><a @click.prevent="scrollToSection('about')" href="#about">关于</a></li>
            </ul>
          </div>
          <div class="footer-section">
            <h4>联系我们</h4>
            <ul>
              <li>邮箱: contact@tutu.com</li>
              <li>微信: tutu-design</li>
            </ul>
          </div>
        </div>
        <div class="footer-bottom">
          <p>&copy; 2024 图图小破站. All rights reserved.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.home-page {
  width: 100%;
  overflow-x: hidden;
  --c-text: #0f172a;
  --c-muted: #475569;
  --c-muted-2: #64748b;
  --c-surface: rgba(255, 255, 255, 0.78);
  --c-border: rgba(16, 185, 129, 0.18);
  --c-primary: #10b981;
  --c-primary-2: #34d399;
  --c-primary-3: #6ee7b7;
  --shadow-lg: 0 18px 55px rgba(2, 44, 34, 0.16);
  color: var(--c-text);
}

/* 英雄区域 */
.hero {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8rem 2rem 4rem;
  overflow: hidden;
}

.hero-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: -1;
  overflow: hidden;
}

.hero-background::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at 20% 50%, rgba(110, 231, 183, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 80% 80%, rgba(52, 211, 153, 0.1) 0%, transparent 50%);
  animation: backgroundShift 15s infinite ease-in-out;
}

.hero-background::after {
  content: '';
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at 50% 0%, rgba(255, 255, 255, 0.55) 0%, transparent 60%),
    repeating-linear-gradient(to right, rgba(16, 185, 129, 0.06) 0 1px, transparent 1px 64px),
    repeating-linear-gradient(to bottom, rgba(16, 185, 129, 0.06) 0 1px, transparent 1px 64px);
  opacity: 0.28;
  pointer-events: none;
}

@keyframes backgroundShift {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.1);
  }
}

/* 浮动装饰元素 */
.floating-shapes {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 0;
}

.shape {
  position: absolute;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(110, 231, 183, 0.3) 0%, rgba(52, 211, 153, 0.2) 100%);
  filter: blur(1px);
  animation: floatShape 20s infinite ease-in-out;
}

.shape-1 {
  width: 80px;
  height: 80px;
  top: 20%;
  left: 10%;
  animation-delay: 0s;
  animation-duration: 15s;
}

.shape-2 {
  width: 60px;
  height: 60px;
  top: 60%;
  left: 20%;
  animation-delay: 2s;
  animation-duration: 18s;
}

.shape-3 {
  width: 100px;
  height: 100px;
  top: 40%;
  right: 15%;
  animation-delay: 4s;
  animation-duration: 20s;
}

.shape-4 {
  width: 50px;
  height: 50px;
  bottom: 30%;
  left: 50%;
  animation-delay: 6s;
  animation-duration: 16s;
}

.shape-5 {
  width: 70px;
  height: 70px;
  top: 10%;
  right: 30%;
  animation-delay: 8s;
  animation-duration: 22s;
}

@keyframes floatShape {
  0%, 100% {
    transform: translate(0, 0) rotate(0deg);
    opacity: 0.3;
  }
  25% {
    transform: translate(30px, -40px) rotate(90deg);
    opacity: 0.5;
  }
  50% {
    transform: translate(-20px, 30px) rotate(180deg);
    opacity: 0.4;
  }
  75% {
    transform: translate(40px, 20px) rotate(270deg);
    opacity: 0.5;
  }
}

.gradient-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.6;
  animation: float 20s infinite ease-in-out, pulse 4s infinite ease-in-out;
}

@keyframes pulse {
  0%, 100% {
    opacity: 0.6;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.1);
  }
}

.orb-1 {
  width: 500px;
  height: 500px;
  background: linear-gradient(135deg, #a7f3d0 0%, #6ee7b7 100%);
  top: -200px;
  left: -200px;
  animation-delay: 0s;
}

.orb-2 {
  width: 400px;
  height: 400px;
  background: linear-gradient(135deg, #6ee7b7 0%, #34d399 100%);
  bottom: -150px;
  right: -150px;
  animation-delay: 5s;
}

.orb-3 {
  width: 300px;
  height: 300px;
  background: linear-gradient(135deg, #34d399 0%, #10b981 100%);
  top: 50%;
  right: 10%;
  animation-delay: 10s;
}

@keyframes float {
  0%, 100% {
    transform: translate(0, 0) scale(1) rotate(0deg);
  }
  33% {
    transform: translate(30px, -30px) scale(1.1) rotate(120deg);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.9) rotate(240deg);
  }
}

.hero-content {
  text-align: center;
  max-width: 1100px;
  z-index: 1;
  animation: fadeInUp 1s ease-out;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.875rem;
  border-radius: 999px;
  background: rgba(240, 253, 244, 0.85);
  border: 1px solid var(--c-border);
  color: var(--c-muted);
  font-weight: 600;
  box-shadow: 0 10px 30px rgba(16, 185, 129, 0.12);
  backdrop-filter: blur(10px);
  margin: 0 auto 1.5rem;
  animation: fadeInUp 1s ease-out 0.1s both;
}

.hero-badge-icon {
  width: 18px;
  height: 18px;
  color: var(--c-primary);
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.hero-title {
  margin-bottom: 1.5rem;
  animation: fadeInUp 1s ease-out 0.2s both;
  letter-spacing: -0.02em;
  text-wrap: balance;
}

.title-line {
  display: block;
  font-size: 1.5rem;
  color: var(--c-muted-2);
  font-weight: 400;
  margin-bottom: 0.5rem;
  animation: fadeInUp 1s ease-out 0.3s both;
}

.title-main {
  display: block;
  font-size: 4.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, #a7f3d0 0%, #6ee7b7 50%, #34d399 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1.2;
}

.hero-subtitle {
  font-size: 1.5rem;
  color: var(--c-muted);
  margin-bottom: 1rem;
  font-weight: 500;
  animation: fadeInUp 1s ease-out 0.4s both;
}

.hero-description {
  font-size: 1.1rem;
  color: var(--c-muted-2);
  margin-bottom: 2.5rem;
  animation: fadeInUp 1s ease-out 0.5s both;
}

.hero-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 3rem;
  animation: fadeInUp 1s ease-out 0.6s both;
}

.hero-image {
  margin-top: 3rem;
  display: flex;
  justify-content: center;
  align-items: center;
  animation: fadeInUp 1s ease-out 0.8s both;
}

.image-frame {
  position: relative;
  width: min(1100px, 92vw);
  border-radius: 1.25rem;
  overflow: hidden;
  box-shadow: var(--shadow-lg);
  transform: translateZ(0);
  transition: transform 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.2),
    box-shadow 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.2);
}

.image-frame--compact {
  width: min(900px, 92vw);
}

.image-frame::before {
  content: '';
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at 20% 10%, rgba(110, 231, 183, 0.25) 0%, transparent 55%),
    radial-gradient(circle at 90% 80%, rgba(52, 211, 153, 0.2) 0%, transparent 55%),
    linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(255, 255, 255, 0.05) 60%, rgba(16, 185, 129, 0.08) 100%);
  opacity: 0.65;
  pointer-events: none;
  transition: opacity 0.35s ease;
}

.image-frame::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  border: 1px solid rgba(255, 255, 255, 0.55);
  mix-blend-mode: overlay;
  pointer-events: none;
}

.image-frame img {
  display: block;
  width: 100%;
  height: auto;
}

.image-frame:hover {
  transform: translateY(-6px) scale(1.01);
  box-shadow: 0 28px 80px rgba(2, 44, 34, 0.22);
}

.image-frame:hover::before {
  opacity: 0.85;
}

.btn-icon {
  width: 18px;
  height: 18px;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.875rem 2rem;
  border-radius: 0.75rem;
  font-size: 1rem;
  font-weight: 700;
  border: none;
  cursor: pointer;
  transition: transform 0.25s ease, box-shadow 0.25s ease, background 0.25s ease, color 0.25s ease;
}

.btn:focus-visible {
  outline: 3px solid rgba(16, 185, 129, 0.35);
  outline-offset: 4px;
}

.btn-primary {
  background: linear-gradient(135deg, var(--c-primary-3) 0%, var(--c-primary-2) 50%, var(--c-primary) 100%);
  color: white;
  box-shadow: 0 10px 30px rgba(16, 185, 129, 0.35);
  position: relative;
  overflow: hidden;
}

.btn-primary::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  transform: translate(-50%, -50%);
  transition: width 0.6s, height 0.6s;
}

.btn-primary:hover::before {
  width: 300px;
  height: 300px;
}

.btn-primary:hover {
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 16px 44px rgba(16, 185, 129, 0.45);
}

.btn-primary:active {
  transform: translateY(0) scale(1);
  animation: pulse 0.3s ease;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(0.95);
  }
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.9);
  color: var(--c-primary);
  border: 1px solid rgba(16, 185, 129, 0.35);
  position: relative;
  overflow: hidden;
  transition: transform 0.25s ease, box-shadow 0.25s ease, color 0.25s ease, border-color 0.25s ease;
}

.btn-secondary:hover {
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(110, 231, 183, 0.08) 100%);
  color: #065f46;
  border-color: rgba(16, 185, 129, 0.55);
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 14px 40px rgba(16, 185, 129, 0.16);
}

.scroll-indicator {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
}

.mouse {
  width: 24px;
  height: 40px;
  border: 2px solid #10b981;
  border-radius: 12px;
  position: relative;
}

.mouse::before {
  content: '';
  position: absolute;
  top: 8px;
  left: 50%;
  transform: translateX(-50%);
  width: 4px;
  height: 8px;
  background: #10b981;
  border-radius: 2px;
  animation: scroll 2s infinite;
}

@keyframes scroll {
  0% {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
  100% {
    opacity: 0;
    transform: translateX(-50%) translateY(12px);
  }
}

/* 通用容器 */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

/* 章节标题 */
.section-title {
  font-size: 2.5rem;
  font-weight: 800;
  text-align: center;
  margin-bottom: 1rem;
  color: #0f172a;
  position: relative;
  display: inline-block;
  width: 100%;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 4px;
  background: linear-gradient(135deg, #6ee7b7 0%, #34d399 100%);
  border-radius: 2px;
  animation: expandLine 0.8s ease-out;
}

@keyframes expandLine {
  from {
    width: 0;
  }
  to {
    width: 60px;
  }
}

.section-subtitle {
  text-align: center;
  color: var(--c-muted-2);
  font-size: 1.1rem;
  margin-bottom: 3rem;
}

/* 守望先锋角斗领域 */
.features {
  padding: 6rem 0;
  background: linear-gradient(180deg, #f0fdf4 0%, #dcfce7 100%);
}

.ow-section-title {
  font-size: 3rem;
  font-weight: 800;
  text-align: center;
  margin-bottom: 3rem;
  color: #0f172a;
  line-height: 1.2;
}

.ow-section {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 4rem;
  align-items: center;
  margin-top: 2.5rem;
}

.ow-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1.25rem;
  animation: slideInLeft 0.8s ease-out;
}

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.ow-description {
  font-size: 1.2rem;
  color: var(--c-muted);
  line-height: 1.6;
  transition: color 0.25s ease;
}

.ow-link {
  width: fit-content;
  display: inline-flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.875rem 1.1rem;
  border-radius: 0.9rem;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(240, 253, 244, 0.9) 100%);
  border: 1px solid rgba(16, 185, 129, 0.35);
  color: #065f46;
  font-weight: 800;
  letter-spacing: 0.2px;
  box-shadow: 0 16px 50px rgba(16, 185, 129, 0.14);
  transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease, background 0.25s ease;
}

.ow-link-icon {
  width: 18px;
  height: 18px;
  color: var(--c-primary);
}

.ow-link-arrow {
  width: 18px;
  height: 18px;
  color: #0f766e;
  opacity: 0.85;
}

.ow-link:hover {
  transform: translateY(-2px);
  box-shadow: 0 26px 70px rgba(16, 185, 129, 0.18);
  border-color: rgba(16, 185, 129, 0.55);
  background: linear-gradient(135deg, rgba(240, 253, 244, 0.95) 0%, rgba(220, 252, 231, 0.75) 100%);
}

.ow-link:focus-visible {
  outline: 3px solid rgba(16, 185, 129, 0.35);
  outline-offset: 4px;
}

.ow-image {
  display: flex;
  justify-content: center;
  align-items: center;
  animation: slideInRight 0.8s ease-out;
  overflow: visible;
  position: relative;
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.ow-image .image-frame--compact {
  transform: translateZ(0) scale(1.08);
}

.ow-image .image-frame--compact:hover {
  transform: translateY(-6px) scale(1.1);
}

/* 关于我们 */
.about {
  padding: 6rem 0;
  background: linear-gradient(180deg, #dcfce7 0%, #f0fdf4 100%);
}

.about-content {
  max-width: 800px;
  margin: 3rem auto 0;
}

.about-intro {
  font-size: 1.2rem;
  color: var(--c-muted);
  line-height: 1.8;
  text-align: center;
  margin-bottom: 3rem;
}

.stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  margin-top: 3rem;
}

.stat-item {
  text-align: center;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.92);
  border-radius: 1rem;
  box-shadow: 0 10px 28px rgba(2, 44, 34, 0.08);
  transition: transform 0.25s ease, box-shadow 0.25s ease;
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(16, 185, 129, 0.1);
}

.stat-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(110, 231, 183, 0.1) 0%, rgba(52, 211, 153, 0.1) 100%);
  transition: left 0.3s ease;
}

.stat-item:hover::before {
  left: 0;
}

.stat-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 55px rgba(16, 185, 129, 0.14);
}

.stat-number {
  font-size: 2.5rem;
  font-weight: 800;
  color: var(--c-primary);
  margin-bottom: 0.5rem;
  position: relative;
  z-index: 1;
  transition: all 0.3s ease;
}

.stat-item:hover .stat-number {
  transform: scale(1.1);
  background: linear-gradient(135deg, #6ee7b7 0%, #34d399 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.stat-label {
  color: var(--c-muted-2);
  font-size: 1rem;
  position: relative;
  z-index: 1;
  transition: color 0.3s ease;
}

.stat-item:hover .stat-label {
  color: #10b981;
  font-weight: 600;
}

/* 页脚 */
.footer {
  background: linear-gradient(135deg, #065f46 0%, #047857 100%);
  color: white;
  padding: 4rem 0 2rem;
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 3rem;
  margin-bottom: 3rem;
}

.footer-section h3 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #6ee7b7;
}

.footer-section h4 {
  font-size: 1.2rem;
  margin-bottom: 1rem;
}

.footer-section p {
  color: #94a3b8;
  line-height: 1.6;
}

.footer-section ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-section ul li {
  margin-bottom: 0.5rem;
  color: #94a3b8;
}

.footer-section ul li a {
  color: #94a3b8;
  text-decoration: none;
  transition: color 0.3s ease;
  cursor: pointer;
}

.footer-section ul li a:focus-visible {
  outline: 3px solid rgba(110, 231, 183, 0.35);
  outline-offset: 4px;
  border-radius: 6px;
}

.footer-section ul li a:hover {
  color: #6ee7b7;
}

.footer-bottom {
  text-align: center;
  padding-top: 2rem;
  border-top: 1px solid rgba(110, 231, 183, 0.3);
  color: #a7f3d0;
}

/* 滚动触发动画 */
.animate-on-scroll {
  opacity: 0;
  transform: translateY(50px);
  transition: opacity 0.8s ease-out, transform 0.8s ease-out;
}

.animate-on-scroll.animate-in {
  opacity: 1;
  transform: translateY(0);
}

/* 为不同元素添加不同的延迟 */
.animate-on-scroll:nth-child(1) {
  transition-delay: 0.1s;
}

.animate-on-scroll:nth-child(2) {
  transition-delay: 0.2s;
}

.animate-on-scroll:nth-child(3) {
  transition-delay: 0.3s;
}

.animate-on-scroll:nth-child(4) {
  transition-delay: 0.4s;
}

/* 统计卡片的特殊动画 */
.stats .stat-item.animate-on-scroll {
  transform: translateY(30px) scale(0.9);
}

.stats .stat-item.animate-on-scroll.animate-in {
  transform: translateY(0) scale(1);
}

.stats .stat-item.animate-on-scroll:nth-child(1) {
  transition-delay: 0.1s;
}

.stats .stat-item.animate-on-scroll:nth-child(2) {
  transition-delay: 0.2s;
}

.stats .stat-item.animate-on-scroll:nth-child(3) {
  transition-delay: 0.3s;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .title-main {
    font-size: 3rem;
  }
  
  .hero-subtitle {
    font-size: 1.2rem;
  }
  
  .stats {
    grid-template-columns: 1fr;
  }
  
  .ow-section {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  
  .ow-section-title {
    font-size: 2rem;
  }
  
  .ow-description {
    font-size: 1.05rem;
  }
  
  .ow-image .image-frame--compact {
    transform: scale(1);
  }
  
  .ow-image .image-frame--compact:hover {
    transform: translateY(-4px) scale(1.01);
  }
}

@media (prefers-reduced-motion: reduce) {
  .shape,
  .gradient-orb,
  .hero-content,
  .ow-content,
  .ow-image,
  .btn-primary::before {
    animation: none !important;
  }

  .animate-on-scroll {
    transition: none !important;
    transform: none !important;
    opacity: 1 !important;
  }

  .btn,
  .image-frame,
  .stat-item,
  .ow-link,
  .ow-link {
    transition: none !important;
  }
}
</style>
