<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

onMounted(() => {
  // 等待 DOM 完全渲染后再初始化动画
  nextTick(() => {
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
        <h1 class="hero-title">
          <span class="title-line">欢迎来到</span>
          <span class="title-main">游戏宅天地</span>
        </h1>
        <p class="hero-subtitle">热爱游戏，热爱生活</p>
        <p class="hero-description">宅天地</p>
        <div class="hero-buttons">
          <button class="btn btn-primary" @click="scrollToSection('features')">开始探索</button>
          <button class="btn btn-secondary" @click="scrollToSection('about')">了解更多</button>
        </div>
        <div class="hero-image">
          <img src="/home.png" alt="首页展示图" />
        </div>
      </div>
    </section>

    <!-- 守望先锋角斗领域 -->
    <section id="features" class="features">
      <div class="container">
        <h2 class="ow-section-title animate-on-scroll">守望先锋角斗领域</h2>
        <div class="ow-section animate-on-scroll">
          <div class="ow-content">
            <p class="ow-description clickable" @click="goToOwPage">军械库模拟器</p>
          </div>
          <div class="ow-image">
            <img src="/ow-jiaodou-1.png" alt="守望先锋角斗领域" />
          </div>
        </div>
      </div>
    </section>

    <!-- 关于我们 -->
    <section id="about" class="about">
      <div class="container">
        <h2 class="section-title animate-on-scroll">关于图图小破站</h2>
        <div class="about-content animate-on-scroll">
          <div class="about-text">
            <p class="about-intro">
              图图小破站是一个致力于为创作者提供优质设计工具和服务的平台。
              我们相信每个人都有无限的创造力，我们的使命就是帮助每个人轻松实现自己的创意想法。
            </p>
            <div class="stats">
              <div class="stat-item animate-on-scroll">
                <div class="stat-number">10K+</div>
                <div class="stat-label">活跃用户</div>
              </div>
              <div class="stat-item animate-on-scroll">
                <div class="stat-number">50K+</div>
                <div class="stat-label">设计作品</div>
              </div>
              <div class="stat-item animate-on-scroll">
                <div class="stat-number">100+</div>
                <div class="stat-label">精美模板</div>
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
            <p>让设计更简单，让创意更自由</p>
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
  max-width: 800px;
  z-index: 1;
  animation: fadeInUp 1s ease-out;
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
}

.title-line {
  display: block;
  font-size: 1.5rem;
  color: #64748b;
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
  color: #475569;
  margin-bottom: 1rem;
  font-weight: 500;
  animation: fadeInUp 1s ease-out 0.4s both;
}

.hero-description {
  font-size: 1.1rem;
  color: #64748b;
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
  width: 100vw;
  margin-left: calc(-50vw + 50%);
  animation: fadeInUp 1s ease-out 0.8s both;
}

.hero-image img {
  width: 90vw;
  max-width: 90vw;
  height: auto;
  border-radius: 1rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  position: relative;
}

.hero-image img::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 1rem;
  background: linear-gradient(135deg, rgba(110, 231, 183, 0.2) 0%, rgba(52, 211, 153, 0.2) 100%);
  opacity: 0;
  transition: opacity 0.4s ease;
}

.hero-image img:hover {
  transform: scale(1.03) translateY(-5px);
  box-shadow: 0 20px 40px rgba(16, 185, 129, 0.3);
}

.btn {
  padding: 0.875rem 2rem;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary {
  background: linear-gradient(135deg, #6ee7b7 0%, #34d399 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(16, 185, 129, 0.4);
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
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 6px 25px rgba(16, 185, 129, 0.6);
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
  background: white;
  color: #10b981;
  border: 2px solid #10b981;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
}

.btn-secondary::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #6ee7b7 0%, #34d399 100%);
  transition: left 0.3s ease;
  z-index: -1;
}

.btn-secondary:hover::before {
  left: 0;
}

.btn-secondary:hover {
  background: #10b981;
  color: white;
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);
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
  color: #1e293b;
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
  color: #64748b;
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
  color: #1e293b;
  line-height: 1.2;
}

.ow-section {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 4rem;
  align-items: center;
  margin-top: 3rem;
}

.ow-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
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
  font-size: 1.8rem;
  color: #64748b;
  line-height: 1.6;
  transition: all 0.3s ease;
}

.ow-description.clickable {
  cursor: pointer;
  color: #10b981;
  font-weight: 600;
  position: relative;
  display: inline-block;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  transition: all 0.3s ease;
}

.ow-description.clickable::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 3px;
  background: linear-gradient(135deg, #6ee7b7 0%, #34d399 100%);
  transition: width 0.3s ease;
  border-radius: 2px;
}

.ow-description.clickable:hover {
  color: #059669;
  transform: translateX(5px);
  background: rgba(110, 231, 183, 0.1);
}

.ow-description.clickable:hover::after {
  width: 100%;
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

.ow-image img {
  width: 100%;
  max-width: 100%;
  height: auto;
  border-radius: 1rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  position: relative;
  transform: scale(1.2);
}

.ow-image img::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 1rem;
  background: linear-gradient(135deg, rgba(110, 231, 183, 0.1) 0%, rgba(52, 211, 153, 0.1) 100%);
  opacity: 0;
  transition: opacity 0.4s ease;
}

.ow-image img:hover {
  transform: scale(1.25) translateY(-5px);
  box-shadow: 0 20px 40px rgba(16, 185, 129, 0.3);
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
  color: #475569;
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
  background: white;
  border-radius: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
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
  transform: translateY(-5px) scale(1.02);
  box-shadow: 0 10px 20px rgba(16, 185, 129, 0.2);
}

.stat-number {
  font-size: 2.5rem;
  font-weight: 800;
  color: #10b981;
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
  color: #64748b;
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
    font-size: 1.2rem;
  }
  
  .ow-image img {
    transform: scale(1);
  }
  
  .ow-image img:hover {
    transform: scale(1.05) translateY(-5px);
  }
}
</style>