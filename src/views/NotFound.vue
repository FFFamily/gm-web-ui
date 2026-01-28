<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft, Home, LayoutDashboard, SearchX } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()

const fullPath = computed(() => (typeof route.fullPath === 'string' ? route.fullPath : ''))

const goBack = () => {
  // Some direct-entry 404s won't have history; fallback to home for a deterministic UX.
  if (typeof window !== 'undefined' && window.history.length > 1) router.back()
  else router.push('/')
}
</script>

<template>
  <div class="gm-page-wrap">
    <div class="mx-auto flex min-h-[calc(100vh-160px)] max-w-[980px] items-center justify-center">
      <div class="relative w-full">
        <!-- Decorative orbs (kept subtle; disabled for reduced-motion users) -->
        <div class="pointer-events-none absolute -inset-6 overflow-hidden">
          <div class="nf-orb nf-orb--1" />
          <div class="nf-orb nf-orb--2" />
          <div class="nf-orb nf-orb--3" />
        </div>

        <div class="gm-card relative p-6 sm:p-8">
          <div class="mx-auto flex max-w-[680px] flex-col items-center text-center">
            <div class="nf-icon" aria-hidden="true">
              <SearchX class="h-5 w-5" />
            </div>

            <div class="nf-code">404</div>
            <div class="mt-2 text-[18px] font-extrabold text-slate-900">页面不存在</div>
            <p class="mt-2 text-[13px] font-semibold text-slate-600">
              你访问的地址不存在或已被移除。
              <span v-if="fullPath" class="ml-1">路径：<code class="gm-code">{{ fullPath }}</code></span>
            </p>

            <div class="mt-6 flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
              <button class="gm-btn-primary w-full sm:w-auto" type="button" @click="router.push('/')">
                <span class="inline-flex items-center gap-2">
                  <Home class="h-4 w-4" aria-hidden="true" />
                  返回前台首页
                </span>
              </button>
              <button class="gm-btn-ghost w-full sm:w-auto" type="button" @click="goBack">
                <span class="inline-flex items-center gap-2">
                  <ArrowLeft class="h-4 w-4" aria-hidden="true" />
                  返回上一页
                </span>
              </button>
              <button class="gm-btn-ghost w-full sm:w-auto" type="button" @click="router.push('/admin')">
                <span class="inline-flex items-center gap-2">
                  <LayoutDashboard class="h-4 w-4" aria-hidden="true" />
                  进入后台
                </span>
              </button>
            </div>

            <div class="mt-5 text-xs text-slate-500">
              如果你认为这是一个错误，请检查链接或联系管理员。
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.nf-icon {
  width: 44px;
  height: 44px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  color: #064e3b;
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.2);
  box-shadow: 0 12px 26px rgba(2, 44, 34, 0.08);
}

.nf-code {
  margin-top: 10px;
  font-size: 64px;
  font-weight: 1000;
  letter-spacing: 0.06em;
  line-height: 1;
  color: transparent;
  background: linear-gradient(135deg, rgba(110, 231, 183, 1) 0%, rgba(16, 185, 129, 1) 60%, rgba(6, 95, 70, 1) 100%);
  -webkit-background-clip: text;
  background-clip: text;
  text-shadow: 0 18px 55px rgba(2, 44, 34, 0.14);
}

.nf-orb {
  position: absolute;
  width: 380px;
  height: 380px;
  border-radius: 999px;
  filter: blur(22px);
  opacity: 0.35;
  transform: translate3d(0, 0, 0);
  animation: nf-float 9s ease-in-out infinite;
}

.nf-orb--1 {
  top: -80px;
  left: -120px;
  background: radial-gradient(circle at 30% 30%, rgba(110, 231, 183, 0.8) 0%, rgba(110, 231, 183, 0) 60%);
}

.nf-orb--2 {
  bottom: -120px;
  right: -90px;
  width: 440px;
  height: 440px;
  animation-duration: 11s;
  background: radial-gradient(circle at 30% 30%, rgba(52, 211, 153, 0.7) 0%, rgba(52, 211, 153, 0) 60%);
}

.nf-orb--3 {
  top: 30%;
  right: 20%;
  width: 260px;
  height: 260px;
  animation-duration: 13s;
  background: radial-gradient(circle at 30% 30%, rgba(16, 185, 129, 0.5) 0%, rgba(16, 185, 129, 0) 60%);
}

@keyframes nf-float {
  0%,
  100% {
    transform: translate3d(0, 0, 0);
  }
  50% {
    transform: translate3d(0, -10px, 0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .nf-orb {
    animation: none;
  }
}
</style>
