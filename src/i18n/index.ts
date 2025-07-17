import { createI18n } from 'vue-i18n'
import zhCN from '@/locales/zh-CN.json'
import enUS from '@/locales/en-US.json'

// 支持的语言列表
export const SUPPORT_LOCALES = ['zh-CN', 'en-US'] as const
export type SupportLocale = typeof SUPPORT_LOCALES[number]

// 语言显示名称映射
export const LOCALE_NAMES: Record<SupportLocale, string> = {
  'zh-CN': '中文',
  'en-US': 'English'
}

// 从 localStorage 获取保存的语言设置，默认为中文
function getDefaultLocale(): SupportLocale {
  const savedLocale = localStorage.getItem('japanese-learning-locale') as SupportLocale
  
  if (savedLocale && SUPPORT_LOCALES.includes(savedLocale)) {
    return savedLocale
  }
  
  // 检测浏览器语言
  const browserLocale = navigator.language
  if (browserLocale.startsWith('en')) {
    return 'en-US'
  }
  
  // 默认返回中文
  return 'zh-CN'
}

// 保存语言设置到 localStorage
export function saveLocale(locale: SupportLocale) {
  localStorage.setItem('japanese-learning-locale', locale)
}

// 创建 i18n 实例
const i18n = createI18n({
  legacy: false, // 使用组合式 API
  locale: getDefaultLocale(),
  fallbackLocale: 'zh-CN',
  messages: {
    'zh-CN': zhCN,
    'en-US': enUS
  },
  globalInjection: true, // 全局注入 $t 函数
  silentTranslationWarn: true, // 静默翻译警告
  silentFallbackWarn: true // 静默回退警告
})

export default i18n

// 导出 i18n 实例的全局属性，方便在组件外使用
export const { global } = i18n

// 切换语言的工具函数
export function switchLanguage(locale: SupportLocale) {
  if (SUPPORT_LOCALES.includes(locale)) {
    global.locale.value = locale
    saveLocale(locale)
    
    // 更新 HTML lang 属性
    document.documentElement.lang = locale
    
    return true
  }
  return false
}

// 获取当前语言
export function getCurrentLocale(): SupportLocale {
  return global.locale.value as SupportLocale
}

// 获取翻译函数（用于组件外使用）
export const t = global.t
