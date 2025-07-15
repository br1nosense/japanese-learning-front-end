<script setup lang="ts">
const settingStore = useSettingStore()
const inverted = computed(() => settingStore.darkTheme)
</script>

<template>
  <n-layout-footer
    class="min-h-60px flex items-center justify-center border-t"
    :class="{ 'bg-white': inverted === false }"
  >
    <div class="footer text-center">
      <div class="text-sm text-gray-600 mb-1">
        Copyright ©2024 日语学习助手 | 让日语学习变得简单有趣
      </div>
      <div class="text-xs text-gray-500">
        基于 Vue3 + TypeScript + Naive UI 构建
      </div>
    </div>
  </n-layout-footer>
</template>
