<script lang="ts" setup>
import { Icon } from '@iconify/vue'
import { useI18n } from 'vue-i18n'
import { switchLanguage, getCurrentLocale, SUPPORT_LOCALES, LOCALE_NAMES, type SupportLocale } from '@/i18n'

const { t } = useI18n()

// 当前语言
const currentLocale = ref<SupportLocale>(getCurrentLocale())

// 显示下拉菜单状态
const showDropdown = ref(false)

// 语言选项 - 使用日式主题图标
const languageOptions = SUPPORT_LOCALES.map(locale => ({
  label: LOCALE_NAMES[locale],
  key: locale,
  icon: locale === 'zh-CN' ? 'noto:flag-china' : 'noto:flag-united-states',
  color: locale === 'zh-CN' ? 'var(--japanese-red)' : 'var(--soft-blue)'
}))

// 切换语言
function handleLanguageChange(locale: SupportLocale) {
  console.log('切换语言到:', locale) // 调试日志

  if (switchLanguage(locale)) {
    currentLocale.value = locale
    showDropdown.value = false
    window.$message?.success(t('common.success'))
    console.log('语言切换成功:', locale) // 调试日志
  } else {
    console.error('语言切换失败:', locale) // 调试日志
    window.$message?.error('语言切换失败')
  }
}

// 监听语言变化
watch(() => getCurrentLocale(), (newLocale) => {
  currentLocale.value = newLocale
})

// 获取当前语言的图标和颜色
const currentLanguageIcon = computed(() => {
  return currentLocale.value === 'zh-CN' ? 'noto:flag-china' : 'noto:flag-united-states'
})

const currentLanguageColor = computed(() => {
  return currentLocale.value === 'zh-CN' ? 'var(--japanese-red)' : 'var(--soft-blue)'
})
</script>

<template>
  <div class="language-switcher-wrapper">
    <n-popover
      trigger="click"
      placement="bottom-end"
      :show="showDropdown"
      @update:show="showDropdown = $event"
    >
      <template #trigger>
        <n-button
          quaternary
          circle
          size="medium"
          class="language-switcher"
          :style="{ '--current-lang-color': currentLanguageColor }"
        >
          <template #icon>
            <Icon
              :icon="currentLanguageIcon"
              class="language-icon"
            />
          </template>
        </n-button>
      </template>

      <div class="language-menu">
        <div
          v-for="option in languageOptions"
          :key="option.key"
          class="language-option"
          :class="{ active: option.key === currentLocale }"
          :style="{ '--option-color': option.color }"
          @click="handleLanguageChange(option.key)"
        >
          <Icon :icon="option.icon" class="option-icon" />
          <span class="option-label">{{ option.label }}</span>
          <div v-if="option.key === currentLocale" class="active-indicator">
            <Icon icon="noto:cherry-blossom" class="cherry-icon" />
          </div>
        </div>
      </div>
    </n-popover>
  </div>
</template>

<style scoped>
/* 日式主题语言切换器样式 */
.language-switcher-wrapper {
  position: relative;
}

/* 主按钮样式 - 樱花主题 */
.language-switcher {
  width: 44px;
  height: 44px;
  background: var(--card-color);
  border: 2px solid var(--primary-color);
  border-radius: 12px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: var(--shadow-1);
  position: relative;
  overflow: hidden;
}

.language-switcher::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--sakura-light-gradient);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.language-switcher:hover {
  background: var(--primary-color);
  border-color: var(--primary-color-hover);
  transform: scale(1.05);
  box-shadow: var(--shadow-2);
}

.language-switcher:hover::before {
  opacity: 0.1;
}

.language-switcher:active {
  transform: scale(0.98);
  background: var(--primary-color-pressed);
}

/* 图标样式 */
.language-icon {
  font-size: 20px;
  transition: all 0.3s ease;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1));
  position: relative;
  z-index: 1;
}

.language-switcher:hover .language-icon {
  transform: scale(1.1);
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
}

/* 下拉菜单样式 */
.language-menu {
  min-width: 160px;
  padding: 12px 0;
  background: var(--card-color);
  border-radius: 12px;
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow-3);
  backdrop-filter: blur(10px);
}

/* 语言选项样式 */
.language-option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 16px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 8px;
  margin: 4px 8px;
  position: relative;
  min-height: 44px; /* 确保触摸目标大小 */
}

.language-option::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--option-color, var(--primary-color));
  opacity: 0;
  border-radius: 8px;
  transition: opacity 0.3s ease;
}

.language-option:hover {
  background: var(--hover-color);
  transform: translateX(4px);
}

.language-option:hover::before {
  opacity: 0.05;
}

/* 激活状态样式 */
.language-option.active {
  background: var(--primary-color);
  color: white;
  border: 2px solid var(--primary-color-hover);
  box-shadow: var(--shadow-2);
}

.language-option.active::before {
  opacity: 0.1;
}

.language-option.active:hover {
  background: var(--primary-color-hover);
  transform: translateX(2px);
}

/* 选项图标样式 */
.option-icon {
  font-size: 18px;
  transition: all 0.3s ease;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1));
}

.language-option:hover .option-icon {
  transform: scale(1.1);
}

.language-option.active .option-icon {
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
}

/* 选项文字样式 */
.option-label {
  font-size: 14px;
  font-weight: 600;
  transition: all 0.3s ease;
  flex: 1;
}

.language-option.active .option-label {
  font-weight: 700;
}

/* 樱花激活指示器 */
.active-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
}

.cherry-icon {
  font-size: 16px;
  animation: gentle-pulse 2s ease-in-out infinite;
  filter: drop-shadow(0 1px 3px rgba(0, 0, 0, 0.3));
}

@keyframes gentle-pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 0.8;
  }
  50% {
    transform: scale(1.1);
    opacity: 1;
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .language-switcher {
    width: 40px;
    height: 40px;
    border-radius: 10px;
  }

  .language-icon {
    font-size: 18px;
  }

  .language-menu {
    min-width: 140px;
    padding: 8px 0;
  }

  .language-option {
    padding: 10px 12px;
    margin: 2px 6px;
    min-height: 40px;
  }

  .option-label {
    font-size: 13px;
  }
}

/* 深色模式适配 */
.dark .language-switcher {
  background: var(--card-color);
  border-color: var(--primary-color);
}

.dark .language-menu {
  background: var(--card-color);
  border-color: var(--border-color);
}

.dark .language-option.active {
  background: var(--primary-color);
  color: white;
}
</style>
