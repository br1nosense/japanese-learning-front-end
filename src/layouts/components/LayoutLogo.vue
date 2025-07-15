<script lang="ts" setup>
import { Icon } from '@iconify/vue'

defineProps<{
  collapsed: boolean
}>()
</script>

<template>
  <div class="logo">
    <transition name="fade" mode="out-in" appear>
      <div v-if="collapsed" class="logo-collapsed">
        <Icon icon="noto:japanese-symbol-for-beginner" class="text-32px" />
      </div>
      <div v-else class="logo-expanded flex items-center gap-2">
        <Icon icon="noto:japanese-symbol-for-beginner" class="text-32px" />
        <span class="text-xl font-bold">日语学习助手</span>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.logo {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 64px;
  line-height: 64px;
  overflow: hidden;
  white-space: nowrap;
}
img {
  width: auto;
  height: 32px;
}
</style>
