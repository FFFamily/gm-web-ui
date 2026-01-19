import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/index.vue'
import OwPage from '../views/ow/index.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/ow',
    name: 'Ow',
    component: OwPage
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
