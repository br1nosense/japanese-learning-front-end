<script lang="ts" setup>
import type { RouteLocationNormalized } from 'vue-router'

const routeStore = useRouteStore()
const settingStore = useSettingStore()
const keepAliveComponents = computed(() => routeStore.keepAliveComponents)

// 生成更精确的路由 key，确保父级路由和子路由能够正确区分
function generateRouteKey(route: RouteLocationNormalized): string {
  // 使用路由名称和完整路径的组合来生成唯一 key
  // 这样可以确保即使路径相同，但路由名称不同的情况下也能正确区分
  const routeName = route.name?.toString() || 'unknown'
  const fullPath = route.fullPath

  // 对于父级路由的默认子路由（空路径），添加特殊标识
  if (route.path === '' && route.matched.length > 1) {
    // 这是一个默认子路由，使用父路由信息
    const parentRoute = route.matched[route.matched.length - 2]
    const parentName = parentRoute.name?.toString() || 'parent'
    return `${parentName}-default-${fullPath}`
  }

  // 对于普通路由，使用路由名称和路径的组合
  return `${routeName}-${fullPath}`
}
</script>

<template>
  <router-view v-slot="{ Component, route }">
    <transition :name="settingStore.animationType" mode="out-in" appear>
      <keep-alive :include="keepAliveComponents">
        <component
          :is="Component"
          v-if="Component && routeStore.reloadFlag"
          :key="generateRouteKey(route)"
        />
      </keep-alive>
    </transition>
  </router-view>
</template>

<style scoped></style>
