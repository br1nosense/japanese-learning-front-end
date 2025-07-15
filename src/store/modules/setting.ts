import { defineStore } from 'pinia'
import { animationType } from '@/settings'

export const useSettingStore = defineStore({
  id: 'setting',
  state: () => ({
    darkTheme: true, // 默认使用深色模式
    animationType,
    primaryColor: '#c8b2ae', // 指定的樱花色作为主色调
    sakuraTheme: true, // 启用樱花主题
  }),
  getters: {
    getDarkTheme(): boolean {
      return this.darkTheme
    },
    getPrimaryColor(): string {
      return this.primaryColor
    },
    getSakuraTheme(): boolean {
      return this.sakuraTheme
    },
  },
  actions: {
    toggleDarkTheme() {
      this.darkTheme = !this.darkTheme
      this.updateThemeVariables()
    },
    updateThemeVariables() {
      const root = document.documentElement
      if (this.sakuraTheme) {
        // 樱花主题色彩变量 - 使用指定的樱花色 #c8b2ae
        root.style.setProperty('--primary-color', '#c8b2ae')
        root.style.setProperty('--primary-color-hover', '#b8a29e')
        root.style.setProperty('--primary-color-pressed', '#a8928e')
        root.style.setProperty('--primary-color-suppl', '#d8c2be')

        // 樱花渐变色 - 基于新的樱花色调
        root.style.setProperty('--sakura-gradient', 'linear-gradient(135deg, #c8b2ae 0%, #d4bfba 50%, #e0ccc6 100%)')
        root.style.setProperty('--sakura-light-gradient', 'linear-gradient(135deg, #f5f1f0 0%, #f8f4f3 50%, #faf7f6 100%)')
        root.style.setProperty('--sakura-dark-gradient', 'linear-gradient(135deg, #9d8b87 0%, #8a7873 50%, #77655f 100%)')

        // 背景色调整
        if (this.darkTheme) {
          root.style.setProperty('--body-color', '#1a1715')
          root.style.setProperty('--card-color', '#2a2521')
          root.style.setProperty('--border-color', '#3a332d')
          root.style.setProperty('--hover-color', 'rgba(200, 178, 174, 0.1)')
        } else {
          root.style.setProperty('--body-color', '#faf8f7')
          root.style.setProperty('--card-color', '#ffffff')
          root.style.setProperty('--border-color', '#f0ebe9')
          root.style.setProperty('--hover-color', 'rgba(200, 178, 174, 0.05)')
        }
      }
    },
  },
})
