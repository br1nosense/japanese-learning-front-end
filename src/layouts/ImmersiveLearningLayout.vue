<script lang="ts" setup>
import { Icon } from '@iconify/vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

// 定义 props
interface Props {
  title?: string
  showSettings?: boolean
  showReset?: boolean
  showFullscreen?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  showSettings: true,
  showReset: true,
  showFullscreen: true
})

// 定义 emits
const emit = defineEmits<{
  settings: []
  reset: []
  fullscreen: []
  exit: []
}>()

// 响应式状态
const isFullscreen = ref(false)
const showSettingsPanel = ref(false)

// 全屏功能
function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().then(() => {
      isFullscreen.value = true
      emit('fullscreen')
    }).catch(err => {
      console.error('无法进入全屏模式:', err)
      window.$message.error('无法进入全屏模式')
    })
  } else {
    document.exitFullscreen().then(() => {
      isFullscreen.value = false
    }).catch(err => {
      console.error('无法退出全屏模式:', err)
    })
  }
}

// 监听全屏状态变化
function handleFullscreenChange() {
  isFullscreen.value = !!document.fullscreenElement
}

// 设置面板
function openSettings() {
  showSettingsPanel.value = true
  emit('settings')
}

// 重置功能
function handleReset() {
  window.$dialog.warning({
    title: t('immersive.resetConfirm'),
    content: t('immersive.resetMessage'),
    positiveText: t('immersive.confirmReset'),
    negativeText: t('common.cancel'),
    onPositiveClick: () => {
      emit('reset')
      window.$message.success(t('immersive.progressReset'))
    }
  })
}

// 退出学习模式
function exitLearning() {
  window.$dialog.info({
    title: t('immersive.exitConfirm'),
    content: t('immersive.exitMessage'),
    positiveText: t('immersive.confirmExit'),
    negativeText: t('immersive.continueStudy'),
    onPositiveClick: () => {
      emit('exit')
    }
  })
}

// 生命周期
onMounted(() => {
  document.addEventListener('fullscreenchange', handleFullscreenChange)
})

onUnmounted(() => {
  document.removeEventListener('fullscreenchange', handleFullscreenChange)
})
</script>

<template>
  <div class="immersive-learning-layout" :class="{ 'fullscreen-mode': isFullscreen }">
    <!-- 顶部功能栏 -->
    <div class="learning-header">
      <!-- 左侧标题 -->
      <div class="header-left">
        <n-h3 class="learning-title">{{ title || t('immersive.settings') }}</n-h3>
      </div>

      <!-- 右侧功能按钮组 -->
      <div class="header-actions">
        <!-- 设置按钮 -->
        <n-tooltip v-if="showSettings" trigger="hover" placement="bottom">
          <template #trigger>
            <n-button
              quaternary
              circle
              size="large"
              class="action-button"
              @click="openSettings"
            >
              <Icon icon="noto:gear" class="action-icon" />
            </n-button>
          </template>
          {{ t('immersive.settings') }}
        </n-tooltip>

        <!-- 重置按钮 -->
        <n-tooltip v-if="showReset" trigger="hover" placement="bottom">
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
          {{ t('immersive.reset') }}
        </n-tooltip>

        <!-- 全屏按钮 -->
        <n-tooltip v-if="showFullscreen" trigger="hover" placement="bottom">
          <template #trigger>
            <n-button
              quaternary
              circle
              size="large"
              class="action-button"
              @click="toggleFullscreen"
            >
              <Icon
                :icon="isFullscreen ? 'noto:downwards-button' : 'noto:upwards-button'"
                class="action-icon"
              />
            </n-button>
          </template>
          {{ isFullscreen ? t('immersive.exitFullscreen') : t('immersive.fullscreen') }}
        </n-tooltip>

        <!-- 退出按钮 -->
        <n-tooltip trigger="hover" placement="bottom">
          <template #trigger>
            <n-button
              quaternary
              circle
              size="large"
              class="action-button exit-button"
              @click="exitLearning"
            >
              <Icon icon="noto:cross-mark" class="action-icon" />
            </n-button>
          </template>
          {{ t('immersive.exit') }}
        </n-tooltip>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="learning-content">
      <slot />
    </div>

    <!-- 设置面板 -->
    <n-drawer
      v-model:show="showSettingsPanel"
      :width="400"
      placement="right"
      :mask-closable="true"
    >
      <n-drawer-content :title="t('immersive.settings')" closable>
        <slot name="settings">
          <div class="default-settings">
            <n-space vertical size="large">
              <!-- 字体大小设置 -->
              <div class="setting-item">
                <n-text strong>{{ t('immersive.settingsPanel.fontSize') }}</n-text>
                <n-slider
                  :default-value="16"
                  :min="12"
                  :max="24"
                  :step="2"
                  :marks="{
                    12: t('immersive.settingsPanel.fontSizes.small'),
                    16: t('immersive.settingsPanel.fontSizes.medium'),
                    20: t('immersive.settingsPanel.fontSizes.large'),
                    24: t('immersive.settingsPanel.fontSizes.extraLarge')
                  }"
                />
              </div>

              <!-- 音量设置 -->
              <div class="setting-item">
                <n-text strong>{{ t('immersive.settingsPanel.volume') }}</n-text>
                <n-slider
                  :default-value="70"
                  :min="0"
                  :max="100"
                  :step="10"
                />
              </div>

              <!-- 自动播放 -->
              <div class="setting-item">
                <n-space justify="space-between">
                  <n-text strong>{{ t('immersive.settingsPanel.autoPlay') }}</n-text>
                  <n-switch :default-value="true" />
                </n-space>
              </div>

              <!-- 显示提示 -->
              <div class="setting-item">
                <n-space justify="space-between">
                  <n-text strong>{{ t('immersive.settingsPanel.showHints') }}</n-text>
                  <n-switch :default-value="true" />
                </n-space>
              </div>
            </n-space>
          </div>
        </slot>
      </n-drawer-content>
    </n-drawer>
  </div>
</template>

<style scoped>
.immersive-learning-layout {
  min-height: 100vh;
  background: var(--body-color);
  display: flex;
  flex-direction: column;
}

.learning-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background: var(--card-color);
  border-bottom: 1px solid var(--border-color);
  backdrop-filter: blur(8px);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-left .learning-title {
  margin: 0;
  color: var(--text-color-1);
  font-weight: 600;
}

.header-actions {
  display: flex;
  gap: 8px;
  align-items: center;
}

.action-button {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 50%;
  width: 44px;
  height: 44px;
}

.action-button:hover {
  background: var(--hover-color);
  transform: scale(1.05);
}

.action-button.exit-button:hover {
  background: rgba(255, 107, 107, 0.1);
  color: #ff6b6b;
}

.action-icon {
  font-size: 20px;
}

.learning-content {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
}

/* 全屏模式样式 */
.fullscreen-mode {
  background: #000;
}

.fullscreen-mode .learning-header {
  background: rgba(0, 0, 0, 0.8);
  border-bottom-color: rgba(255, 255, 255, 0.1);
}

.fullscreen-mode .learning-title {
  color: white;
}

.fullscreen-mode .action-button {
  color: white;
}

.fullscreen-mode .action-button:hover {
  background: rgba(255, 255, 255, 0.1);
}

/* 设置面板样式 */
.default-settings {
  padding: 16px 0;
}

.setting-item {
  padding: 12px 0;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .learning-header {
    padding: 12px 16px;
  }

  .header-actions {
    gap: 4px;
  }

  .action-button {
    width: 40px;
    height: 40px;
  }

  .action-icon {
    font-size: 18px;
  }

  .learning-content {
    padding: 16px;
  }

  .learning-title {
    font-size: 18px;
  }
}

/* 超小屏幕优化 */
@media (max-width: 480px) {
  .learning-header {
    padding: 8px 12px;
  }

  .action-button {
    width: 36px;
    height: 36px;
  }

  .action-icon {
    font-size: 16px;
  }

  .learning-content {
    padding: 12px;
  }
}
</style>
