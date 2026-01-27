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
  displayName: '',
  password: '',
  confirmPassword: ''
})

const onSubmit = async () => {
  errorMsg.value = ''
  if (!form.username || !form.password) {
    errorMsg.value = '请填写用户名和密码'
    return
  }
  if (form.password.length < 8) {
    errorMsg.value = '密码至少 8 位'
    return
  }
  if (form.password !== form.confirmPassword) {
    errorMsg.value = '两次输入的密码不一致'
    return
  }

  loading.value = true
  try {
    await auth.register({
      username: form.username,
      password: form.password,
      displayName: form.displayName
    })
    const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : '/account/me'
    router.replace(redirect)
  } catch (e) {
    errorMsg.value = e?.message || '注册失败'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="gm-auth-page">
    <div class="gm-auth-panel">
      <div class="gm-brand">游戏宅天地</div>
      <div class="gm-title">创建账号</div>
      <div class="gm-subtitle">注册后将自动登录</div>

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
          <span class="gm-label">昵称（可选）</span>
          <input
            v-model="form.displayName"
            class="gm-input"
            placeholder="用于展示"
            autocomplete="nickname"
            :aria-invalid="!!errorMsg"
          />
        </label>

        <label class="gm-field">
          <span class="gm-label">密码</span>
          <input
            v-model="form.password"
            class="gm-input"
            placeholder="至少 8 位"
            type="password"
            autocomplete="new-password"
            :aria-invalid="!!errorMsg"
          />
        </label>

        <label class="gm-field">
          <span class="gm-label">确认密码</span>
          <input
            v-model="form.confirmPassword"
            class="gm-input"
            placeholder="再次输入密码"
            type="password"
            autocomplete="new-password"
            :aria-invalid="!!errorMsg"
          />
        </label>

        <div v-if="errorMsg" class="gm-alert gm-alert--error" role="alert" aria-live="polite">{{ errorMsg }}</div>

        <button class="gm-btn-primary w-full" type="submit" :disabled="loading">
          {{ loading ? '注册中…' : '注册' }}
        </button>
      </form>

      <div class="gm-hint">
        已有账号？
        <a class="gm-link" href="/account/login" @click.prevent="router.push('/account/login')">去登录</a>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
