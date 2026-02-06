<script setup>
import { computed, reactive, ref, watchEffect } from 'vue'
import { useRouter } from 'vue-router'
import { useAccountAuthStore } from '~/stores/accountAuth'
import { pinia } from '~/stores/pinia'

const auth = useAccountAuthStore(pinia)
const router = useRouter()

const saving = ref(false)
const success = ref('')
const error = ref('')

const form = reactive({
  displayName: ''
})

watchEffect(() => {
  form.displayName = auth.me?.displayName || ''
})

const canSave = computed(() => form.displayName && form.displayName.trim().length > 0)
const avatarText = computed(() => {
  const raw = (auth.me?.displayName || auth.me?.username || '').trim()
  if (!raw) return 'A'
  return raw.slice(0, 1).toUpperCase()
})

const onSave = async () => {
  success.value = ''
  error.value = ''
  if (!canSave.value) {
    error.value = '昵称不能为空'
    return
  }
  saving.value = true
  try {
    await auth.updateProfile({ displayName: form.displayName })
    success.value = '保存成功'
  } catch (e) {
    error.value = e?.message || '保存失败'
  } finally {
    saving.value = false
  }
}

const onLogout = async () => {
  await auth.logout()
  router.replace('/')
}

const goTeams = () => router.push('/account/teams')
</script>

<template>
  <div class="gm-page-wrap">
    <div class="mx-auto max-w-[920px]">
      <div class="gm-card p-5 sm:p-6">
        <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div class="flex items-start gap-3">
            <div class="gm-avatar" aria-hidden="true">{{ avatarText }}</div>
            <div class="min-w-0">
              <div class="gm-title mt-0">我的账号</div>
              <div class="gm-subtitle mb-0">你可以在这里修改基础信息</div>
            </div>
          </div>

          <div class="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
            <button class="gm-btn-ghost w-full sm:w-auto" type="button" @click="goTeams">我的队伍</button>
            <button class="gm-btn-ghost w-full sm:w-auto" type="button" @click="onLogout">退出登录</button>
          </div>
        </div>

        <div class="mt-5 grid gap-3 md:grid-cols-2">
          <div class="gm-kv">
            <div class="gm-kv-label">ID</div>
            <div class="gm-kv-value">{{ auth.me?.id }}</div>
          </div>

          <div class="gm-kv">
            <div class="gm-kv-label">用户名</div>
            <div class="gm-kv-value">{{ auth.me?.username }}</div>
          </div>

          <div class="gm-kv md:col-span-2">
            <div class="gm-kv-label">昵称</div>
            <div class="mt-2">
              <input
                v-model="form.displayName"
                class="gm-input"
                placeholder="请输入昵称"
                autocomplete="nickname"
                :aria-invalid="!!error"
              />
            </div>
            <div class="mt-2 text-[12px] text-slate-500">用于展示在导航栏与个人信息页。</div>
          </div>
        </div>

        <div class="mt-4 grid gap-2">
          <div v-if="error" class="gm-alert gm-alert--error" role="alert" aria-live="polite">{{ error }}</div>
          <div v-if="success" class="gm-alert gm-alert--success" role="status" aria-live="polite">{{ success }}</div>
        </div>

        <div class="mt-4 flex justify-end">
          <button class="gm-btn-primary w-full sm:w-auto px-5" :disabled="saving || !canSave" @click="onSave">
            {{ saving ? '保存中…' : '保存' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
