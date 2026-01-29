import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '~/stores/auth'
import { useAccountAuthStore } from '~/stores/accountAuth'
import { pinia } from '~/stores/pinia'

import SiteLayout from '~/layouts/SiteLayout.vue'
import AdminLayout from '~/layouts/AdminLayout.vue'

import Home from '~/views/index.vue'
import OwPage from '~/views/ow/index.vue'
import OwLoadoutDetail from '~/views/ow/loadouts/Detail.vue'
import OwLoadoutNew from '~/views/ow/loadouts/New.vue'

import AdminLogin from '~/views/admin/Login.vue'
import AdminForbidden from '~/views/admin/Forbidden.vue'

import AccountLogin from '~/views/account/Login.vue'
import AccountProfile from '~/views/account/Profile.vue'
import AccountRegister from '~/views/account/Register.vue'

import UsersList from '~/views/admin/users/UsersList.vue'
import UserCreate from '~/views/admin/users/UserCreate.vue'
import UserEdit from '~/views/admin/users/UserEdit.vue'
import UserDetail from '~/views/admin/users/UserDetail.vue'

import AccountsList from '~/views/admin/accounts/AccountsList.vue'

import OwHeroesList from '~/views/admin/ow/heroes/HeroesList.vue'
import OwItemsList from '~/views/admin/ow/items/ItemsList.vue'
import OwLoadoutsList from '~/views/admin/ow/loadouts/LoadoutsList.vue'

import FilesList from '~/views/admin/files/FilesList.vue'

import RolesList from '~/views/admin/roles/RolesList.vue'
import RoleCreate from '~/views/admin/roles/RoleCreate.vue'
import RoleEdit from '~/views/admin/roles/RoleEdit.vue'
import RoleDetail from '~/views/admin/roles/RoleDetail.vue'

import PermissionsList from '~/views/admin/permissions/PermissionsList.vue'
import AuditList from '~/views/admin/audits/AuditList.vue'
import NotFound from '~/views/NotFound.vue'

const routes = [
  {
    path: '/',
    component: SiteLayout,
    children: [
      { path: '', name: 'Home', component: Home },
      { path: 'ow', name: 'Ow', component: OwPage },
      { path: 'ow/loadouts/new', name: 'OwLoadoutNew', component: OwLoadoutNew, meta: { title: '创建清单', requiresAccountAuth: true } },
      { path: 'ow/loadouts/:id', name: 'OwLoadoutDetail', component: OwLoadoutDetail, meta: { title: '清单详情' } },

      // Account: front-end user (no permission system)
      { path: 'account', redirect: '/account/me' },
      { path: 'account/login', name: 'AccountLogin', component: AccountLogin, meta: { title: '登录' } },
      { path: 'account/register', name: 'AccountRegister', component: AccountRegister, meta: { title: '注册' } },
      { path: 'account/me', name: 'AccountMe', component: AccountProfile, meta: { title: '我的账号', requiresAccountAuth: true } }
    ]
  },

  // Admin: all routes are prefixed with `/admin/*`
  { path: '/admin/login', name: 'AdminLogin', component: AdminLogin, meta: { title: '登录' } },
  { path: '/admin/403', name: 'AdminForbidden', component: AdminForbidden, meta: { title: '无权限' } },
  {
    path: '/admin',
    component: AdminLayout,
    meta: { requiresAuth: true },
    children: [
      { path: '', redirect: '/admin/users' },

      { path: 'users', name: 'AdminUsers', component: UsersList, meta: { title: '后台用户管理', perm: 'user:list' } },
      { path: 'users/new', name: 'AdminUserCreate', component: UserCreate, meta: { title: '新增用户', perm: 'user:create' } },
      { path: 'users/:id', name: 'AdminUserDetail', component: UserDetail, meta: { title: '用户详情', perm: 'user:read' } },
      { path: 'users/:id/edit', name: 'AdminUserEdit', component: UserEdit, meta: { title: '编辑用户', perm: 'user:update' } },

      { path: 'accounts', name: 'AdminAccounts', component: AccountsList, meta: { title: '前台用户管理', perm: 'account:list' } },

      { path: 'ow/heroes', name: 'AdminOwHeroes', component: OwHeroesList, meta: { title: 'OW 英雄管理', perm: 'ow:hero:list' } },
      { path: 'ow/items', name: 'AdminOwItems', component: OwItemsList, meta: { title: 'OW 装备管理', perm: 'ow:item:list' } },
      { path: 'ow/loadouts', name: 'AdminOwLoadouts', component: OwLoadoutsList, meta: { title: 'OW 清单管理', perm: 'ow:loadout:list' } },

      { path: 'files', name: 'AdminFiles', component: FilesList, meta: { title: '文件管理', perm: 'file:list' } },

      { path: 'roles', name: 'AdminRoles', component: RolesList, meta: { title: '角色管理', perm: 'role:list' } },
      { path: 'roles/new', name: 'AdminRoleCreate', component: RoleCreate, meta: { title: '新增角色', perm: 'role:create' } },
      { path: 'roles/:id', name: 'AdminRoleDetail', component: RoleDetail, meta: { title: '角色详情', perm: 'role:read' } },
      { path: 'roles/:id/edit', name: 'AdminRoleEdit', component: RoleEdit, meta: { title: '编辑角色', perm: 'role:update' } },

      { path: 'permissions', name: 'AdminPermissions', component: PermissionsList, meta: { title: '权限点', perm: 'permission:list' } },
      { path: 'audits', name: 'AdminAudits', component: AuditList, meta: { title: '审计日志', perm: 'audit:list' } }
    ]
  },

  // Fallback
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound, meta: { title: '404' } }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach(async (to) => {
  const auth = useAuthStore(pinia)
  const accountAuth = useAccountAuthStore(pinia)
  const requiresAuth = to.matched.some((r) => r.meta.requiresAuth)
  const requiresAccountAuth = to.matched.some((r) => r.meta.requiresAccountAuth)

  if (requiresAuth && !auth.token) {
    return { path: '/admin/login', query: { redirect: to.fullPath } }
  }

  if (requiresAuth && auth.token && !auth.me) {
    try {
      await auth.bootstrap()
    } catch {
      // bootstrap will be handled by http 401 interceptor as well
      return { path: '/admin/login', query: { redirect: to.fullPath } }
    }
  }

  if (requiresAccountAuth && !accountAuth.token) {
    return { path: '/account/login', query: { redirect: to.fullPath } }
  }

  if (requiresAccountAuth && accountAuth.token && !accountAuth.me) {
    try {
      await accountAuth.bootstrap()
    } catch {
      return { path: '/account/login', query: { redirect: to.fullPath } }
    }
  }

  const requiredPerm = [...to.matched].reverse().find((r) => r.meta.perm)?.meta.perm
  if (requiresAuth && requiredPerm && !auth.hasPerm(requiredPerm)) {
    return { path: '/admin/403' }
  }

  return true
})

export default router
