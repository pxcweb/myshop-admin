// import useAuthStore from '@/stores/useAuthStore'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('@/views/layout/index.vue'),
      redirect: '/dashboard',
      children: [
        {
          path: '/dashboard',
          component: () => import('@/views/dashboard/index.vue')
        }
      ]
    },
    {
      path: '/login',
      component: () => import('@/views/login/index.vue')
    },
    {
      path: '/:catchAll(.*)',
      component: () => import('@/views/404/index.vue')
    }
  ]
})

// router.beforeEach((to, from) => {
//   const authStore = useAuthStore()
//   //如果没有token,且访问的是非登录页,拦截到登录页
//   if (!authStore.token && to.path !== '/login') {
//     return '/login'
//   }
//   //如果有token,且还想访问登录页,拦截到首页
//   if (authStore.token && to.path == '/login') {
//     return from.path
//   }
//   //其他情况正常放行
//   return true
// })

export default router
