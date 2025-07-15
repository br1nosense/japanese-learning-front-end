<script lang="ts" setup>
defineProps<{
  collapsed: boolean
  inverted: boolean
}>()
defineEmits(['update:collapsed'])
const settingStore = useSettingStore()
const routeStore = useRouteStore()
const route = useRoute()

// 面包屑导航
const breadcrumbs = computed(() => {
  const matched = route.matched.filter(item => item.meta && item.meta.title)
  const breadcrumbList = []

  // 添加首页
  if (route.path !== '/home') {
    breadcrumbList.push({
      title: '首页',
      path: '/home'
    })
  }

  // 添加当前路径的面包屑
  matched.forEach(item => {
    if (item.meta?.title) {
      breadcrumbList.push({
        title: item.meta.title,
        path: item.path
      })
    }
  })

  return breadcrumbList
})

function openGithub() {
  window.open('https://github.com/Wyatex/Vue3-starter')
}
function darkThemeSwitch() {
  settingStore.darkTheme = !settingStore.darkTheme
}
// 刷新页面
const { loading, startLoading, endLoading } = useLoading()
function reloadPage() {
  startLoading()
  routeStore.reloadPage()
  setTimeout(() => {
    endLoading()
  }, 1000)
}

const isFullScreen = ref(false)
// 切换全屏图标
function toggleFullscreenIcon() {
  return isFullScreen.value = document.fullscreenElement !== null
}

// 监听全屏切换事件
document.addEventListener('fullscreenchange', toggleFullscreenIcon)

// 全屏切换
function toggleFullScreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen()
  }
  else {
    if (document.exitFullscreen)
      document.exitFullscreen()
  }
}
</script>

<template>
  <div
    class="z-11 h-64px w-full flex items-center justify-between p-0 shadow transition"
  >
    <div class="flex items-center">
      <!-- 菜单收起 -->
      <div
        class="ml-1 ml-24px h-64px flex-center cursor-pointer transition"
        @click="() => $emit('update:collapsed', !collapsed)"
      >
        <n-icon v-if="collapsed" size="20">
          <i-tabler:indent-increase />
        </n-icon>
        <n-icon v-else size="20">
          <i-tabler:indent-decrease />
        </n-icon>
      </div>
      <!-- 刷新 -->
      <div
        class="ml-24px h-64px flex-center cursor-pointer transition"
        @click="reloadPage"
      >
        <n-icon size="20">
          <i-ic:round-refresh :class="{ 'animate-spin': loading }" />
        </n-icon>
      </div>
      <!-- 切换全屏 -->
      <div
        class="ml-24px h-64px flex-center cursor-pointer transition"
        @click="toggleFullScreen"
      >
        <n-tooltip placement="bottom">
          <template #trigger>
            <n-icon size="20">
              <i-ant-design:fullscreen-outlined v-if="!isFullScreen" />
              <i-ant-design:fullscreen-exit-outlined v-else />
            </n-icon>
          </template>
          <span>全屏</span>
        </n-tooltip>
      </div>

      <!-- 面包屑导航 -->
      <div class="ml-24px flex items-center">
        <n-breadcrumb v-if="breadcrumbs.length > 1">
          <n-breadcrumb-item
            v-for="(item, index) in breadcrumbs"
            :key="item.path"
            :clickable="index < breadcrumbs.length - 1"
            @click="index < breadcrumbs.length - 1 && $router.push(item.path)"
          >
            {{ item.title }}
          </n-breadcrumb-item>
        </n-breadcrumb>
      </div>
    </div>
    <div class="flex items-center">
      <!-- 深色开关 -->
      <div
        class="mr-24px h-64px flex-center cursor-pointer transition"
        @click="darkThemeSwitch"
      >
        <div class="h-full flex items-center">
          <n-tooltip placement="bottom">
            <template #trigger>
              <n-icon size="20">
                <i-line-md:sunny-filled-loop-to-moon-alt-filled-loop-transition
                  v-if="settingStore.darkTheme"
                />
                <i-line-md:moon-alt-to-sunny-outline-loop-transition v-else />
              </n-icon>
            </template>
            <span> 深浅色切换 </span>
          </n-tooltip>
        </div>
      </div>
      <!-- github -->
      <div
        class="mr-24px h-64px flex-center cursor-pointer transition"
        @click="openGithub"
      >
        <n-tooltip placement="bottom">
          <template #trigger>
            <n-icon size="20">
              <i-line-md:github-loop />
            </n-icon>
          </template>
          <span> github </span>
        </n-tooltip>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
