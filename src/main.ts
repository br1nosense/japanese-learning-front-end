import 'uno.css'
// 统一浏览器默认样式
import '@unocss/reset/normalize.css'
import '@/assets/styles/index.scss'
import { createApp } from 'vue'
import App from './App.vue'
import { store } from '@/store'
import { routerPlugin } from '@/router'
import { useSettingStore } from '@/store/modules/setting'
import { useAuthStore } from '@/stores/auth'
import i18n from '@/i18n'

/**
 * 加载页面，可以在mount的前后执行任务
 */
async function startApp() {
  const app = createApp(App)
  app.use(store).use(routerPlugin).use(i18n)

  // 初始化主题
  const settingStore = useSettingStore()
  settingStore.updateThemeVariables()

  // 初始化认证状态
  const authStore = useAuthStore()
  await authStore.initializeAuth()

  app.mount('#app')
}

startApp()
