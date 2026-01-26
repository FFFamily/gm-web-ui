<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '~/stores/auth'
import { pinia } from '~/stores/pinia'
import {
  User,
  Setting,
  Lock,
  Notebook,
  SwitchButton
} from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore(pinia)

const menuItems = computed(() => {
  const items = [
    { label: '用户管理', to: '/admin/users', icon: User, perm: 'user:list' },
    { label: '角色管理', to: '/admin/roles', icon: Setting, perm: 'role:list' },
    { label: '权限点', to: '/admin/permissions', icon: Lock, perm: 'permission:list' },
    { label: '审计日志', to: '/admin/audits', icon: Notebook, perm: 'audit:list' }
  ]
  return items.filter((i) => auth.hasPerm(i.perm))
})

const activeMenu = computed(() => route.path)

const onLogout = async () => {
  await auth.logout()
  router.replace('/admin/login')
}
</script>

<template>
  <el-container class="admin-root">
    <el-aside width="220px" class="admin-aside">
      <div class="admin-brand" @click="router.push('/admin')">
        <div class="admin-brand-title">GM Admin</div>
        <div class="admin-brand-sub">用户体系</div>
      </div>

      <el-menu :default-active="activeMenu" class="admin-menu" router>
        <el-menu-item
          v-for="item in menuItems"
          :key="item.to"
          :index="item.to"
        >
          <el-icon><component :is="item.icon" /></el-icon>
          <span>{{ item.label }}</span>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <el-container>
      <el-header class="admin-header">
        <div class="admin-header-left">
          <span class="admin-page-title">{{ route.meta?.title || '后台' }}</span>
        </div>
        <div class="admin-header-right">
          <div class="admin-user">
            <span class="admin-user-name">{{ auth.me?.displayName || auth.me?.username }}</span>
          </div>
          <el-button type="default" :icon="SwitchButton" @click="onLogout">
            退出
          </el-button>
        </div>
      </el-header>

      <el-main class="admin-main">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<style scoped>
.admin-root {
  min-height: 100vh;
  background: #f6f7fb;
}

.admin-aside {
  background: #ffffff;
  border-right: 1px solid rgba(2, 6, 23, 0.06);
}

.admin-brand {
  padding: 16px 16px 12px;
  cursor: pointer;
  border-bottom: 1px solid rgba(2, 6, 23, 0.06);
}

.admin-brand-title {
  font-size: 16px;
  font-weight: 900;
  color: #0f172a;
}

.admin-brand-sub {
  font-size: 12px;
  color: #64748b;
  margin-top: 2px;
}

.admin-menu {
  border-right: none;
}

.admin-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(255, 255, 255, 0.9);
  border-bottom: 1px solid rgba(2, 6, 23, 0.06);
  backdrop-filter: blur(8px);
}

.admin-page-title {
  font-weight: 800;
  color: #0f172a;
}

.admin-header-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.admin-user-name {
  color: #334155;
  font-weight: 600;
}

.admin-main {
  padding: 16px;
}
</style>

