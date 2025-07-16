<script lang="ts" setup>
import type { RouteLocationNormalized } from 'vue-router'
import { nextTick } from 'vue'

const routeStore = useRouteStore()
const settingStore = useSettingStore()
const keepAliveComponents = computed(() => routeStore.keepAliveComponents)

// 添加调试状态（仅在开发环境启用）
const isDebugMode = ref(false) // 设置为 false 以禁用调试信息
const renderCount = ref(0)
const forceRender = ref(0)

// 生成精确的路由 key，确保父级路由和子路由能够正确区分
function generateRouteKey(route: RouteLocationNormalized): string {
  const routeName = route.name?.toString() || 'unknown'
  const fullPath = route.fullPath

  // 对于父级路由的默认子路由（空路径），添加特殊标识
  if (route.path === '' && route.matched.length > 1) {
    // 这是一个默认子路由，使用父路由信息
    const parentRoute = route.matched[route.matched.length - 2]
    const parentName = parentRoute.name?.toString() || 'parent'
    const key = `${parentName}-default-${fullPath}`

    if (isDebugMode.value) {
      console.log(`[LayoutContent] 默认子路由 Key: ${key}`, {
        routeName,
        routePath: route.path,
        fullPath,
        matched: route.matched.map(r => ({ name: r.name, path: r.path }))
      })
    }

    return key
  }

  // 对于普通路由，使用路由名称和路径的组合
  const key = `${routeName}-${fullPath}`

  if (isDebugMode.value) {
    console.log(`[LayoutContent] 普通路由 Key: ${key}`, {
      routeName,
      routePath: route.path,
      fullPath
    })
  }

  return key
}

// 检查组件是否应该被渲染
function shouldRenderComponent(Component: any): boolean {
  const hasComponent = !!Component
  const reloadFlag = routeStore.reloadFlag
  const shouldRender = hasComponent && reloadFlag

  if (isDebugMode.value) {
    console.log(`[LayoutContent] 渲染检查:`, {
      hasComponent,
      reloadFlag,
      shouldRender,
      componentName: Component?.name || Component?.displayName || 'Anonymous'
    })
  }

  return shouldRender
}

// 监听路由变化
watch(() => routeStore.reloadFlag, (newVal) => {
  if (isDebugMode.value) {
    console.log(`[LayoutContent] reloadFlag 变化: ${newVal}`)
  }
})

// 组件渲染计数
function onComponentRender() {
  renderCount.value++
  if (isDebugMode.value) {
    console.log(`[LayoutContent] 组件渲染次数: ${renderCount.value}`)
  }
}

// 获取组件名称
function getComponentName(Component: any): string {
  if (!Component) return 'None'

  // 尝试从不同属性获取组件名称
  return Component.name ||
         Component.displayName ||
         Component.__name ||
         Component.type?.name ||
         Component.type?.displayName ||
         'Anonymous'
}

// 强制重新渲染
function forceRerender() {
  forceRender.value++
  if (isDebugMode.value) {
    console.log(`[LayoutContent] 强制重新渲染: ${forceRender.value}`)
  }
}

// 监听路由变化，在路由变化时强制重新渲染
const route = useRoute()
watch(() => route.fullPath, (newPath, oldPath) => {
  if (isDebugMode.value) {
    console.log(`[LayoutContent] 路由变化: ${oldPath} -> ${newPath}`)
  }

  // 给组件一些时间加载
  nextTick(() => {
    forceRerender()
  })
}, { immediate: true })
</script>

<template>
  <router-view v-slot="{ Component, route }">
    <!-- 调试信息 -->
    <div v-if="isDebugMode" class="debug-info">
      <p>路由: {{ route.name }} ({{ route.path }})</p>
      <p>组件: {{ getComponentName(Component) }}</p>
      <p>Key: {{ generateRouteKey(route) }}</p>
      <p>reloadFlag: {{ routeStore.reloadFlag }}</p>
      <p>渲染次数: {{ renderCount }}</p>
    </div>

    <transition :name="settingStore.animationType" mode="out-in" appear>
      <keep-alive :include="keepAliveComponents">
        <component
          :is="Component"
          v-if="shouldRenderComponent(Component)"
          :key="`${generateRouteKey(route)}-${forceRender}`"
          @vue:mounted="onComponentRender"
        />
      </keep-alive>
    </transition>

    <!-- 当组件不应该渲染时显示的占位符 -->
    <div v-if="!shouldRenderComponent(Component)" class="component-placeholder">
      <div class="loading-message">
        <p>正在加载组件...</p>
        <p v-if="isDebugMode">
          组件状态: {{ Component ? '已加载' : '未加载' }},
          reloadFlag: {{ routeStore.reloadFlag }}
        </p>
      </div>
    </div>
  </router-view>
</template>

<style scoped>
.debug-info {
  position: fixed;
  top: 10px;
  right: 10px;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 10px;
  border-radius: 5px;
  font-size: 12px;
  z-index: 9999;
  max-width: 300px;
}

.debug-info p {
  margin: 2px 0;
}

.component-placeholder {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
  padding: 20px;
}

.loading-message {
  text-align: center;
  color: #666;
}

.loading-message p {
  margin: 5px 0;
}
</style>
