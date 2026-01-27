<script setup>
import { reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAccountAuthStore } from '~/stores/accountAuth'
import { pinia } from '~/stores/pinia'

const router = useRouter()
const route = useRoute()
const auth = useAccountAuthStore(pinia)

const loading = ref(false)
const errorMsg = ref('')
const form = reactive({
  username: '',
  password: ''
})

const onSubmit = async () => {
  errorMsg.value = ''
  if (!form.username || !form.password) {
    errorMsg.value = '请填写用户名和密码'
    return
  }
  loading.value = true
  try {
    await auth.login(form.username, form.password)
    // 登录后默认回到前台首页；如有 redirect 则优先。
    const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : '/'
    router.replace(redirect)
  } catch {
    errorMsg.value = '用户名或密码错误'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="gm-auth-page">
    <div class="gm-auth-panel">
      <div class="gm-brand">游戏宅天地</div>
      <div class="gm-title">欢迎回来</div>
      <div class="gm-subtitle">登录你的前台账号</div>

      <form class="gm-form" @submit.prevent="onSubmit">
        <label class="gm-field">
          <span class="gm-label">用户名</span>
          <input
            v-model="form.username"
            class="gm-input"
            placeholder="请输入用户名"
            autocomplete="username"
            :aria-invalid="!!errorMsg"
            autofocus
          />
        </label>

        <label class="gm-field">
          <span class="gm-label">密码</span>
          <input
            v-model="form.password"
            class="gm-input"
            placeholder="请输入密码"
            type="password"
            autocomplete="current-password"
            :aria-invalid="!!errorMsg"
          />
        </label>

        <div v-if="errorMsg" class="gm-alert gm-alert--error" role="alert" aria-live="polite">{{ errorMsg }}</div>

        <button class="gm-btn-primary w-full" type="submit" :disabled="loading">
          {{ loading ? '登录中…' : '登录' }}
        </button>
      </form>

      <div class="gm-hint">
        还没有账号？
        <a class="gm-link" href="/account/register" @click.prevent="router.push('/account/register')">去注册</a>
        <span class="sep">|</span>
        本地默认账号：<code class="gm-code">user1</code> / <code class="gm-code">User@123456</code>
      </div>
    </div>
  </div>
</template>

<style scoped>
.sep {
  margin: 0 8px;
  opacity: 0.6;
}
</style>
