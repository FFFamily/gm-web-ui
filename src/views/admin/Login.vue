<script setup>
import { reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useAuthStore } from '~/stores/auth'
import { pinia } from '~/stores/pinia'

const router = useRouter()
const route = useRoute()
const auth = useAuthStore(pinia)

const loading = ref(false)
const form = reactive({
  username: '',
  password: ''
})

const onSubmit = async () => {
  if (!form.username || !form.password) {
    ElMessage.warning('请填写用户名和密码')
    return
  }

  loading.value = true
  try {
    await auth.login(form.username, form.password)
    const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : '/admin'
    router.replace(redirect)
  } catch {
    ElMessage.error('用户名或密码错误')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="login-root">
    <el-card class="login-card" shadow="always">
      <div class="login-title">GM Admin</div>
      <div class="login-subtitle">用户体系后台登录</div>

      <el-form :model="form" label-position="top" @submit.prevent>
        <el-form-item label="用户名">
          <el-input v-model="form.username" autocomplete="username" @keyup.enter="onSubmit" />
        </el-form-item>
        <el-form-item label="密码">
          <el-input
            v-model="form.password"
            type="password"
            autocomplete="current-password"
            show-password
            @keyup.enter="onSubmit"
          />
        </el-form-item>

        <el-button type="primary" class="login-btn" :loading="loading" @click="onSubmit">
          登录
        </el-button>
      </el-form>
    </el-card>
  </div>
</template>

<style scoped>
.login-root {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: radial-gradient(circle at 20% 20%, rgba(16, 185, 129, 0.12) 0%, transparent 60%),
    radial-gradient(circle at 90% 70%, rgba(52, 211, 153, 0.12) 0%, transparent 55%),
    #f6f7fb;
}

.login-card {
  width: 420px;
  border-radius: 16px;
}

.login-title {
  font-size: 18px;
  font-weight: 900;
  color: #0f172a;
}

.login-subtitle {
  margin-top: 4px;
  margin-bottom: 16px;
  color: #64748b;
  font-size: 13px;
}

.login-btn {
  width: 100%;
}
</style>

