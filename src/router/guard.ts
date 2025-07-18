import { isNavigationFailure } from 'vue-router'
import type { Router } from 'vue-router'
import { useRouteStore } from '@/store/modules/route'
import { useAuthStore } from '@/stores/auth'
import { storage } from '@/utils/storage'

export function createGuard(router: Router) {
  router.beforeEach(async (to, _from, next) => {
    const Loading = window.$loading || null
    Loading && Loading.start()

    // 获取认证store
    const authStore = useAuthStore()

    // 公开页面，不需要认证
    const publicPages = ['/login', '/register', '/home', '/get-started', '/about', '/courses', '/contact', '/faq']
    const isPublicPage = publicPages.some(page => to.path.startsWith(page)) || to.path === '/'

    // 检查是否需要认证
    // 1. 如果路由明确设置了 requiresAuth: true，则需要认证
    // 2. 如果路由明确设置了 requiresAuth: false，则不需要认证
    // 3. 如果没有设置 requiresAuth，则根据是否为公开页面判断
    const requiresAuth = to.meta?.requiresAuth === true ||
                        (to.meta?.requiresAuth !== false && !isPublicPage)

    // 如果需要认证但用户未登录
    if (requiresAuth && !authStore.isAuthenticated) {
      // 跳转到登录页面，并保存当前路径用于登录后重定向
      const redirectData = {
        path: '/login',
        replace: true,
        query: {
          redirect: to.fullPath
        }
      }
      next(redirectData)
      return
    }

    // 如果已登录用户访问登录/注册页面，重定向到首页
    if (authStore.isAuthenticated && (to.path === '/login' || to.path === '/register')) {
      next('/home')
      return
    }

    next()
    // 不在这里结束 loading，让 afterEach 处理
  })

  router.afterEach((to, _, failure) => {
    document.title = (to?.meta?.title as string) || document.title
    if (isNavigationFailure(failure))
      console.error('failed navigation', failure)

    const routeStore = useRouteStore()
    // 在这里设置需要缓存的组件名称
    const keepAliveComponents = routeStore.keepAliveComponents
    const currentComName = to.matched.find(item => item.name === to.name)
      ?.name as string | undefined
    if (
      currentComName
      && !keepAliveComponents.includes(currentComName)
      && to.meta?.keepAlive
    ) {
      // 需要缓存的组件
      keepAliveComponents.push(currentComName)
    }
    else if (!to.meta?.keepAlive || to.name === 'Redirect') {
      // 不需要缓存的组件
      const index = routeStore.keepAliveComponents.findIndex(
        name => name === currentComName,
      )
      if (index !== -1)
        keepAliveComponents.splice(index, 1)
    }
    routeStore.setKeepAliveComponents(keepAliveComponents)

    const Loading = window.$loading || null
    Loading && Loading.finish()
  })

  router.onError((error) => {
    console.error('路由错误:', error)
    // 确保在路由错误时也结束 loading
    const Loading = window.$loading || null
    Loading && Loading.finish()
  })
}
