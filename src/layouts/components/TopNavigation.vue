<script lang="ts" setup>
import { Icon } from '@iconify/vue'
import type { MenuOption } from 'naive-ui'
import { generatorMenu } from '@/utils/router'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const routeStore = useRouteStore()
const settingStore = useSettingStore()
const authStore = useAuthStore()

const mobileMenuVisible = ref(false)
const defaultValue = route.name as string

const menus = generatorMenu(routeStore.routes) as unknown as MenuOption[]

// 点击菜单
function clickMenuItem(key: string) {
  console.log('key',key)
  console.log('menus',menus)
  console.log('route',route)
  console.log('router',router)
  if (/http(s)?:/.test(key)) {
    window.open(key)
  } else {
    router.push({ name: key })
  }
  mobileMenuVisible.value = false // 移动端点击后关闭菜单
}

// 切换移动端菜单
function toggleMobileMenu() {
  mobileMenuVisible.value = !mobileMenuVisible.value
}

// 深色模式切换
function darkThemeSwitch() {
  settingStore.toggleDarkTheme()
  // 更新body类名
  document.body.classList.toggle('light', !settingStore.darkTheme)
}

// 获取菜单项的路由路径
function getMenuPath(option: MenuOption): string {
  if (option.key && typeof option.key === 'string') {
    if (/http(s)?:/.test(option.key)) {
      return option.key
    }
    // 根据路由名称查找路径
    const routes = router.getRoutes()
    const targetRoute = routes.find(r => r.name === option.key)
    return targetRoute?.path || option.key
  }
  return '#'
}

// 检查菜单项是否为当前活跃项
function isActiveMenu(option: MenuOption): boolean {
  const path = getMenuPath(option)
  return route.path === path || route.name === option.key
}

// 用户登录
function goToLogin() {
  router.push('/login')
}

// 用户注册
function goToRegister() {
  router.push('/register')
}

// 用户登出
async function handleLogout() {
  await authStore.logout()
  window.$message.success('已退出登录')
  router.push('/home')
}

// 跳转到用户资料
function goToProfile() {
  window.$message.info('用户资料页面开发中...')
}
</script>

<template>
  <nav class="top-navigation">
    <!-- 桌面端导航 -->
    <div class="desktop-nav hidden md:flex items-center justify-between w-full px-6 py-4">
      <!-- Logo区域 -->
      <div class="nav-logo flex items-center gap-3 cursor-pointer" @click="router.push('/home')">
        <Icon icon="noto:japanese-symbol-for-beginner" class="text-32px" />
        <span class="text-xl font-bold text-white">日语学习助手</span>
      </div>

      <!-- 导航菜单 -->
      <div class="nav-menu flex items-center gap-8">
        <div
          v-for="menu in menus"
          :key="menu.key"
          class="nav-item relative cursor-pointer px-4 py-2 rounded-lg transition-all duration-300"
          :class="{
            'bg-white/20 text-white': isActiveMenu(menu),
            'text-white/80 hover:text-white hover:bg-white/10': !isActiveMenu(menu)
          }"
          @click="clickMenuItem(menu.name as string)"
        >
          <div class="flex items-center gap-2">
            <component :is="menu.icon" v-if="menu.icon" class="text-18px" />
            <span class="font-medium">{{ menu.label }}</span>
          </div>
        </div>
      </div>

      <!-- 右侧工具栏 -->
      <div class="nav-tools flex items-center gap-4">
        <!-- 深色模式切换 -->
        <div
          class="tool-item cursor-pointer p-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-all"
          @click="darkThemeSwitch"
        >
          <Icon
            :icon="settingStore.darkTheme ? 'tabler:sun' : 'tabler:moon'"
            class="text-20px"
          />
        </div>

        <!-- 用户认证区域 -->
        <div v-if="!authStore.isAuthenticated" class="auth-buttons flex items-center gap-2">
          <n-button
            size="small"
            quaternary
            type="primary"
            @click="goToLogin"
            class="text-white border-white/30 hover:border-white/50"
          >
            登录
          </n-button>
          <n-button
            size="small"
            type="primary"
            @click="goToRegister"
            class="bg-white text-primary hover:bg-white/90"
          >
            注册
          </n-button>
        </div>

        <!-- 用户菜单 -->
        <div v-else class="user-menu">
          <n-dropdown
            :options="[
              {
                label: '个人资料',
                key: 'profile',
                icon: () => h(Icon, { icon: 'tabler:user' })
              },
              {
                label: '学习进度',
                key: 'progress',
                icon: () => h(Icon, { icon: 'tabler:chart-line' })
              },
              {
                type: 'divider',
                key: 'divider'
              },
              {
                label: '退出登录',
                key: 'logout',
                icon: () => h(Icon, { icon: 'tabler:logout' })
              }
            ]"
            @select="(key) => {
              if (key === 'logout') handleLogout()
              else if (key === 'profile') goToProfile()
              else if (key === 'progress') router.push('/progress')
            }"
          >
            <div class="user-avatar cursor-pointer flex items-center gap-2 px-3 py-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-all">
              <Icon icon="tabler:user-circle" class="text-24px" />
              <span class="text-sm font-medium">{{ authStore.userFullName }}</span>
              <Icon icon="tabler:chevron-down" class="text-16px" />
            </div>
          </n-dropdown>
        </div>

        <!-- GitHub链接 -->
        <div
          class="tool-item cursor-pointer p-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-all"
          @click="window.open('https://github.com')"
        >
          <Icon icon="tabler:brand-github" class="text-20px" />
        </div>
      </div>
    </div>

    <!-- 移动端导航 -->
    <div class="mobile-nav md:hidden flex items-center justify-between w-full px-4 py-3">
      <!-- Logo -->
      <div class="nav-logo flex items-center gap-2 cursor-pointer" @click="router.push('/home')">
        <Icon icon="noto:japanese-symbol-for-beginner" class="text-28px" />
        <span class="text-lg font-bold text-white">日语学习</span>
      </div>

      <!-- 汉堡菜单按钮 -->
      <div
        class="hamburger-menu cursor-pointer p-2 rounded-lg text-white hover:bg-white/10 transition-all"
        @click="toggleMobileMenu"
      >
        <Icon
          :icon="mobileMenuVisible ? 'tabler:x' : 'tabler:menu-2'"
          class="text-24px"
        />
      </div>
    </div>

    <!-- 移动端下拉菜单 -->
    <transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 transform -translate-y-2"
      enter-to-class="opacity-100 transform translate-y-0"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 transform translate-y-0"
      leave-to-class="opacity-0 transform -translate-y-2"
    >
      <div
        v-if="mobileMenuVisible"
        class="mobile-menu md:hidden absolute top-full left-0 right-0 shadow-lg z-50"
        :style="{ background: 'var(--sakura-gradient)' }"
      >
        <div class="px-4 py-2">
          <div
            v-for="menu in menus"
            :key="menu.key"
            class="mobile-menu-item cursor-pointer px-4 py-3 rounded-lg mb-2 transition-all"
            :class="{
              'bg-white/20 text-white': isActiveMenu(menu),
              'text-white/80 hover:text-white hover:bg-white/10': !isActiveMenu(menu)
            }"
            @click="clickMenuItem(menu.name as string)"
          >
            <div class="flex items-center gap-3">
              <component :is="menu.icon" v-if="menu.icon" class="text-20px" />
              <span class="font-medium">{{ menu.label }}</span>
            </div>
          </div>

          <!-- 移动端工具栏 -->
          <div class="flex items-center gap-2 mt-4 pt-4 border-t border-white/20">
            <div
              class="tool-item cursor-pointer p-3 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-all flex-1 text-center"
              @click="darkThemeSwitch"
            >
              <Icon
                :icon="settingStore.darkTheme ? 'tabler:sun' : 'tabler:moon'"
                class="text-20px"
              />
            </div>
            <div
              class="tool-item cursor-pointer p-3 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-all flex-1 text-center"
              @click="window.open('https://github.com')"
            >
              <Icon icon="tabler:brand-github" class="text-20px" />
            </div>
          </div>
        </div>
      </div>
    </transition>
  </nav>
</template>

<style scoped>
.top-navigation {
  position: relative;
  background: var(--sakura-gradient);
  box-shadow: 0 4px 20px rgba(200, 178, 174, 0.3);
}

.nav-item::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 50%;
  width: 0;
  height: 2px;
  background: white;
  transition: all 0.3s ease;
  transform: translateX(-50%);
}

.nav-item:hover::after,
.nav-item.active::after {
  width: 80%;
}

.mobile-menu {
  backdrop-filter: blur(10px);
}

/* 确保移动端菜单在其他内容之上 */
.mobile-menu {
  z-index: 1000;
}
</style>
