<script setup>
import { ref, onMounted } from 'vue'

const isScrolled = ref(false)

onMounted(() => {
  window.addEventListener('scroll', () => {
    isScrolled.value = window.scrollY > 50
  })
})

const scrollToSection = (id) => {
  const element = document.getElementById(id)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
}
</script>

<template>
  <div class="home-page">
    <!-- 导航栏 -->
    <nav :class="{ 'scrolled': isScrolled }" class="navbar">
      <div class="nav-container">
        <div class="logo">
          <span class="logo-icon">🎨</span>
          <span class="logo-text">图图小破站</span>
        </div>
        <ul class="nav-menu">
          <li><a @click.prevent="scrollToSection('home')" href="#home">首页</a></li>
          <li><a @click.prevent="scrollToSection('features')" href="#features">功能</a></li>
          <li><a @click.prevent="scrollToSection('about')" href="#about">关于</a></li>
          <li><a @click.prevent="scrollToSection('contact')" href="#contact">联系</a></li>
        </ul>
      </div>
    </nav>

    <!-- 英雄区域 -->
    <section id="home" class="hero">
      <div class="hero-background">
        <div class="gradient-orb orb-1"></div>
        <div class="gradient-orb orb-2"></div>
        <div class="gradient-orb orb-3"></div>
      </div>
      <div class="hero-content">
        <h1 class="hero-title">
          <span class="title-line">欢迎来到</span>
          <span class="title-main">图图小破站</span>
        </h1>
        <p class="hero-subtitle">一个充满创意与想象力的设计平台</p>
        <p class="hero-description">探索无限可能，创造属于你的精彩世界</p>
        <div class="hero-buttons">
          <button class="btn btn-primary" @click="scrollToSection('features')">开始探索</button>
          <button class="btn btn-secondary" @click="scrollToSection('about')">了解更多</button>
        </div>
      </div>
      <div class="scroll-indicator">
        <div class="mouse"></div>
      </div>
    </section>

    <!-- 功能介绍 -->
    <section id="features" class="features">
      <div class="container">
        <h2 class="section-title">核心功能</h2>
        <p class="section-subtitle">发现图图小破站的强大功能</p>
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">✨</div>
            <h3>创意设计</h3>
            <p>丰富的设计工具和模板，让你的创意轻松实现</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">🚀</div>
            <h3>快速高效</h3>
            <p>简洁的操作界面，快速上手，高效完成工作</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">🎯</div>
            <h3>精准定位</h3>
            <p>智能推荐系统，为你找到最合适的设计方案</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">💎</div>
            <h3>精美模板</h3>
            <p>海量精美模板库，满足各种设计需求</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">🌐</div>
            <h3>云端同步</h3>
            <p>多设备云端同步，随时随地访问你的作品</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">🔒</div>
            <h3>安全可靠</h3>
            <p>企业级安全保障，保护你的创作成果</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 特色亮点 -->
    <section class="highlights">
      <div class="container">
        <div class="highlights-content">
          <div class="highlights-text">
            <h2 class="section-title">为什么选择图图小破站？</h2>
            <div class="highlight-item">
              <div class="highlight-number">01</div>
              <div class="highlight-content">
                <h3>专业团队</h3>
                <p>由资深设计师和开发工程师组成的专业团队，持续优化产品体验</p>
              </div>
            </div>
            <div class="highlight-item">
              <div class="highlight-number">02</div>
              <div class="highlight-content">
                <h3>用户至上</h3>
                <p>以用户需求为中心，不断收集反馈，持续改进产品功能</p>
              </div>
            </div>
            <div class="highlight-item">
              <div class="highlight-number">03</div>
              <div class="highlight-content">
                <h3>创新技术</h3>
                <p>采用最新的前端技术栈，提供流畅的用户体验</p>
              </div>
            </div>
          </div>
          <div class="highlights-visual">
            <div class="visual-card">
              <div class="card-glow"></div>
              <div class="card-content">
                <div class="card-icon">🎨</div>
                <h4>图图小破站</h4>
                <p>让设计更简单</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 关于我们 -->
    <section id="about" class="about">
      <div class="container">
        <h2 class="section-title">关于图图小破站</h2>
        <div class="about-content">
          <div class="about-text">
            <p class="about-intro">
              图图小破站是一个致力于为创作者提供优质设计工具和服务的平台。
              我们相信每个人都有无限的创造力，我们的使命就是帮助每个人轻松实现自己的创意想法。
            </p>
            <div class="stats">
              <div class="stat-item">
                <div class="stat-number">10K+</div>
                <div class="stat-label">活跃用户</div>
              </div>
              <div class="stat-item">
                <div class="stat-number">50K+</div>
                <div class="stat-label">设计作品</div>
              </div>
              <div class="stat-item">
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

/* 导航栏 */
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  padding: 1rem 0;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  border-bottom: 1px solid transparent;
}

.navbar.scrolled {
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
  border-bottom-color: rgba(0, 0, 0, 0.05);
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
  color: #6366f1;
}

.logo-icon {
  font-size: 2rem;
}

.logo-text {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
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
  transition: color 0.3s ease;
  cursor: pointer;
}

.nav-menu a:hover {
  color: #6366f1;
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
}

.gradient-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.5;
  animation: float 20s infinite ease-in-out;
}

.orb-1 {
  width: 500px;
  height: 500px;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  top: -200px;
  left: -200px;
  animation-delay: 0s;
}

.orb-2 {
  width: 400px;
  height: 400px;
  background: linear-gradient(135deg, #ec4899 0%, #f43f5e 100%);
  bottom: -150px;
  right: -150px;
  animation-delay: 5s;
}

.orb-3 {
  width: 300px;
  height: 300px;
  background: linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%);
  top: 50%;
  right: 10%;
  animation-delay: 10s;
}

@keyframes float {
  0%, 100% {
    transform: translate(0, 0) scale(1);
  }
  33% {
    transform: translate(30px, -30px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }
}

.hero-content {
  text-align: center;
  max-width: 800px;
  z-index: 1;
}

.hero-title {
  margin-bottom: 1.5rem;
}

.title-line {
  display: block;
  font-size: 1.5rem;
  color: #64748b;
  font-weight: 400;
  margin-bottom: 0.5rem;
}

.title-main {
  display: block;
  font-size: 4.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%);
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
}

.hero-description {
  font-size: 1.1rem;
  color: #64748b;
  margin-bottom: 2.5rem;
}

.hero-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
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
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(99, 102, 241, 0.4);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(99, 102, 241, 0.5);
}

.btn-secondary {
  background: white;
  color: #6366f1;
  border: 2px solid #6366f1;
}

.btn-secondary:hover {
  background: #6366f1;
  color: white;
  transform: translateY(-2px);
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
  border: 2px solid #6366f1;
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
  background: #6366f1;
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
}

.section-subtitle {
  text-align: center;
  color: #64748b;
  font-size: 1.1rem;
  margin-bottom: 3rem;
}

/* 功能介绍 */
.features {
  padding: 6rem 0;
  background: #f8fafc;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
}

.feature-card {
  background: white;
  padding: 2.5rem;
  border-radius: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  border: 1px solid #e2e8f0;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 24px rgba(99, 102, 241, 0.15);
  border-color: #6366f1;
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.feature-card h3 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #1e293b;
}

.feature-card p {
  color: #64748b;
  line-height: 1.6;
}

/* 特色亮点 */
.highlights {
  padding: 6rem 0;
  background: white;
}

.highlights-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
  margin-top: 3rem;
}

.highlight-item {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 2.5rem;
}

.highlight-number {
  font-size: 3rem;
  font-weight: 800;
  color: #6366f1;
  opacity: 0.2;
  line-height: 1;
}

.highlight-content h3 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  color: #1e293b;
}

.highlight-content p {
  color: #64748b;
  line-height: 1.6;
}

.highlights-visual {
  display: flex;
  justify-content: center;
  align-items: center;
}

.visual-card {
  position: relative;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  padding: 3rem;
  border-radius: 1.5rem;
  color: white;
  width: 100%;
  max-width: 400px;
  overflow: hidden;
}

.card-glow {
  position: absolute;
  top: -50%;
  right: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
  animation: rotate 20s linear infinite;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.card-content {
  position: relative;
  z-index: 1;
  text-align: center;
}

.card-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.card-content h4 {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.card-content p {
  opacity: 0.9;
}

/* 关于我们 */
.about {
  padding: 6rem 0;
  background: #f8fafc;
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
}

.stat-number {
  font-size: 2.5rem;
  font-weight: 800;
  color: #6366f1;
  margin-bottom: 0.5rem;
}

.stat-label {
  color: #64748b;
  font-size: 1rem;
}

/* 页脚 */
.footer {
  background: #1e293b;
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
  color: #6366f1;
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
  color: #6366f1;
}

.footer-bottom {
  text-align: center;
  padding-top: 2rem;
  border-top: 1px solid #334155;
  color: #94a3b8;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .title-main {
    font-size: 3rem;
  }
  
  .hero-subtitle {
    font-size: 1.2rem;
  }
  
  .nav-menu {
    gap: 1rem;
    font-size: 0.9rem;
  }
  
  .highlights-content {
    grid-template-columns: 1fr;
  }
  
  .stats {
    grid-template-columns: 1fr;
  }
  
  .features-grid {
    grid-template-columns: 1fr;
  }
}
</style>