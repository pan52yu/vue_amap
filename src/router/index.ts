import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Index',
    meta: {
      title: '首页',
      keepAlive: true,
      requireAuth: true,
    },
    component: () => import('../views/home/index.vue'),
  },
  {
    path: '/vueuse',
    name: 'vueUse',
    component: () => import('../views/vueuse/index.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})
export default router
