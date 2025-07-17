<script lang="ts" setup>
import { useRouter } from 'vue-router'
import { useFullscreen } from '@vueuse/core'
import { Icon } from '@iconify/vue'

const router = useRouter()

// 全屏功能
const { isFullscreen, toggle: toggleFullscreen } = useFullscreen()

// 退出学习模式
function exitFocusedMode() {
  // 如果当前是全屏状态，先退出全屏
  if (isFullscreen.value) {
    toggleFullscreen()
  }

  // 返回到带导航栏的普通学习模式
  const currentPath = router.currentRoute.value.path
  if (currentPath.includes('/focused/')) {
    // 从专注模式路径返回到普通学习模式路径
    const normalPath = currentPath.replace('/focused/', '/normal-learning/')
    router.push(normalPath)
  } else {
    // 默认返回首页
    router.push('/home')
  }
}

// ESC键退出功能
function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    exitFocusedMode()
  }
}

// 组件挂载时添加键盘监听
onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

// 组件卸载时移除键盘监听
onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})

// 发射事件给父组件
const emit = defineEmits<{
  settings: []
  reset: []
  fullscreen: []
  exit: []
}>()

// 处理设置
function handleSettings() {
  emit('settings')
}

// 处理重置
function handleReset() {
  emit('reset')
}

// 处理全屏
function handleFullscreen() {
  toggleFullscreen()
  emit('fullscreen')
}

// 处理退出
function handleExit() {
  emit('exit')
  exitFocusedMode()
}

// 接收标题属性
defineProps<{
  title?: string
}>()
</script>

<template>
  <div class="focused-learning-layout">
    <!-- 背景装饰 -->
    <div class="background-decoration">
      <div class="sakura-petals">
        <div v-for="i in 8" :key="i" class="petal" :style="{ '--delay': i * 0.5 + 's' }">
          <Icon icon="noto:cherry-blossom" />
        </div>
      </div>
    </div>

    <!-- 顶部控制栏 -->
    <div class="top-controls">
      <div class="title-section">
        <h1 v-if="title" class="learning-title">{{ title }}</h1>
      </div>

      <div class="action-buttons">
        <!-- 设置按钮 -->
        <n-tooltip trigger="hover" placement="bottom">
          <template #trigger>
            <n-button
              quaternary
              circle
              size="large"
              class="action-button"
              @click="handleSettings"
            >
              <Icon icon="noto:gear" class="action-icon" />
            </n-button>
          </template>
          设置
        </n-tooltip>

        <!-- 重置按钮 -->
        <n-tooltip trigger="hover" placement="bottom">
          <template #trigger>
            <n-button
              quaternary
              circle
              size="large"
              class="action-button"
              @click="handleReset"
            >
              <Icon icon="noto:clockwise-vertical-arrows" class="action-icon" />
            </n-button>
          </template>
          重置
        </n-tooltip>

        <!-- 全屏按钮 -->
        <n-tooltip trigger="hover" placement="bottom">
          <template #trigger>
            <n-button
              quaternary
              circle
              size="large"
              class="action-button"
              @click="handleFullscreen"
            >
              <Icon
                :icon="isFullscreen ? 'noto:downwards-button' : 'noto:upwards-button'"
                class="action-icon"
              />
            </n-button>
          </template>
          {{ isFullscreen ? '退出全屏' : '全屏' }}
        </n-tooltip>

        <!-- 退出专注模式按钮 -->
        <n-tooltip trigger="hover" placement="bottom">
          <template #trigger>
            <n-button
              quaternary
              circle
              size="large"
              class="action-button exit-button"
              @click="handleExit"
            >
              <Icon icon="noto:cross-mark" class="action-icon" />
            </n-button>
          </template>
          退出专注模式 (ESC)
        </n-tooltip>
      </div>
    </div>

    <!-- 主要学习内容区域 -->
    <main class="learning-content">
      <slot />
    </main>

    <!-- 设置面板插槽 -->
    <n-drawer
      v-if="$slots.settings"
      :show="false"
      :width="320"
      placement="right"
    >
      <n-drawer-content title="学习设置">
        <slot name="settings" />
      </n-drawer-content>
    </n-drawer>
  </div>
</template>

<style scoped>
/* 专注学习模式布局样式 */
.focused-learning-layout {
  position: relative;
  min-height: 100vh;
  width: 100%;
  background: var(--body-color);
  overflow: hidden;
}

/* 背景装饰 */
.background-decoration {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 0;
}

.sakura-petals {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.petal {
  position: absolute;
  top: -50px;
  font-size: 20px;
  color: var(--primary-color);
  opacity: 0.1;
  animation: fall var(--delay, 8s) infinite linear;
  animation-delay: var(--delay, 0s);
}

.petal:nth-child(1) { left: 10%; }
.petal:nth-child(2) { left: 20%; }
.petal:nth-child(3) { left: 30%; }
.petal:nth-child(4) { left: 40%; }
.petal:nth-child(5) { left: 60%; }
.petal:nth-child(6) { left: 70%; }
.petal:nth-child(7) { left: 80%; }
.petal:nth-child(8) { left: 90%; }

@keyframes fall {
  0% {
    transform: translateY(-50px) rotate(0deg);
    opacity: 0;
  }
  10% {
    opacity: 0.1;
  }
  90% {
    opacity: 0.1;
  }
  100% {
    transform: translateY(100vh) rotate(360deg);
    opacity: 0;
  }
}

/* 顶部控制栏 */
.top-controls {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.title-section {
  flex: 1;
}

.learning-title {
  font-size: 24px;
  font-weight: 700;
  color: var(--text-color-1);
  margin: 0;
  background: var(--sakura-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* 操作按钮组 */
.action-buttons {
  display: flex;
  gap: 12px;
  align-items: center;
}

.action-button {
  width: 48px;
  height: 48px;
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 183, 197, 0.3);
  backdrop-filter: blur(10px);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.action-button:hover {
  background: var(--primary-color);
  border-color: var(--primary-color-hover);
  transform: scale(1.05);
  box-shadow: 0 8px 25px rgba(255, 183, 197, 0.4);
}

.action-button.exit-button {
  border-color: rgba(230, 0, 18, 0.3);
}

.action-button.exit-button:hover {
  background: var(--japanese-red);
  border-color: var(--japanese-red-hover);
  box-shadow: 0 8px 25px rgba(230, 0, 18, 0.4);
}

.action-icon {
  font-size: 20px;
  color: white;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
}

/* 主要学习内容区域 */
.learning-content {
  position: relative;
  z-index: 1;
  min-height: 100vh;
  padding-top: 80px; /* 为顶部控制栏预留空间 */
  padding-bottom: 20px;
  padding-left: 20px;
  padding-right: 20px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .top-controls {
    padding: 12px 16px;
  }

  .learning-title {
    font-size: 20px;
  }

  .action-buttons {
    gap: 8px;
  }

  .action-button {
    width: 44px;
    height: 44px;
  }

  .action-icon {
    font-size: 18px;
  }

  .learning-content {
    padding-top: 70px;
    padding-left: 16px;
    padding-right: 16px;
  }
}

/* 全屏模式适配 */
.focused-learning-layout:fullscreen {
  background: var(--body-color);
}

.focused-learning-layout:fullscreen .top-controls {
  background: rgba(0, 0, 0, 0.8);
}

/* 深色模式适配 */
.dark .top-controls {
  background: rgba(0, 0, 0, 0.3);
  border-bottom-color: rgba(255, 255, 255, 0.05);
}

.dark .action-button {
  background: rgba(0, 0, 0, 0.2);
}
</style>
