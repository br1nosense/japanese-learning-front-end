import { defineStore } from 'pinia'
import { authAPI, apiUtils } from '@/services/api'

interface User {
  _id: string
  username: string
  email: string
  profile: {
    firstName?: string
    lastName?: string
    fullName?: string
    avatar?: string
    bio?: string
    learningGoals?: string[]
    currentLevel?: string
    targetLevel?: string
  }
  preferences: {
    language: string
    theme: string
    notifications: {
      email: boolean
      push: boolean
      studyReminder: boolean
    }
  }
  stats: {
    totalStudyTime: number
    wordsLearned: number
    grammarPointsLearned: number
    currentStreak: number
    longestStreak: number
    lastStudyDate?: string
  }
  subscription: {
    type: string
    isActive: boolean
    startDate?: string
    endDate?: string
  }
  lastLogin: string
  createdAt: string
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    token: apiUtils.getAuthToken(),
    isAuthenticated: apiUtils.isAuthenticated(),
    isLoading: false,
    error: null,
  }),

  getters: {
    // 获取用户全名
    userFullName: (state): string => {
      if (state.user?.profile?.fullName) {
        return state.user.profile.fullName
      }
      if (state.user?.profile?.firstName && state.user?.profile?.lastName) {
        return `${state.user.profile.firstName} ${state.user.profile.lastName}`
      }
      return state.user?.username || '用户'
    },

    // 检查是否为高级用户
    isPremiumUser: (state): boolean => {
      return state.user?.subscription?.type !== 'free' &&
             state.user?.subscription?.isActive === true
    },

    // 获取用户学习级别
    userLevel: (state): string => {
      return state.user?.profile?.currentLevel || 'beginner'
    },

    // 获取用户目标级别
    targetLevel: (state): string => {
      return state.user?.profile?.targetLevel || 'N5'
    },

    // 检查是否有学习目标
    hasLearningGoals: (state): boolean => {
      return (state.user?.profile?.learningGoals?.length || 0) > 0
    },
  },

  actions: {
    // 用户注册
    async register(userData: {
      username: string
      email: string
      password: string
      profile?: any
    }) {
      this.isLoading = true
      this.error = null

      try {
        const response = await authAPI.register(userData)

        if (response.token && response.user) {
          this.token = response.token
          this.user = response.user
          this.isAuthenticated = true

          // 保存到本地存储
          apiUtils.setAuthToken(response.token)
          localStorage.setItem('userInfo', JSON.stringify(response.user))

          return { success: true, message: response.message }
        }

        throw new Error('注册失败')
      } catch (error: any) {
        this.error = apiUtils.handleApiError(error)
        return { success: false, error: this.error }
      } finally {
        this.isLoading = false
      }
    },

    // 用户登录
    async login(credentials: { identifier: string; password: string }) {
      this.isLoading = true
      this.error = null

      try {
        console.log('AuthStore: 开始调用API登录')
        const response = await authAPI.login(credentials)
        console.log('AuthStore: API响应:', response)

        // 检查响应是否存在
        if (!response) {
          throw new Error('服务器无响应')
        }

        if (response.token && response.user) {
          this.token = response.token
          this.user = response.user
          this.isAuthenticated = true

          // 保存到本地存储
          apiUtils.setAuthToken(response.token)
          localStorage.setItem('userInfo', JSON.stringify(response.user))

          console.log('AuthStore: 登录成功')
          return { success: true, message: response.message || '登录成功' }
        }

        // 如果没有token或user，但有错误信息
        if (response.error) {
          throw new Error(response.error)
        }

        throw new Error('登录失败：无效的服务器响应')
      } catch (error: any) {
        console.error('AuthStore: 登录错误:', error)
        this.error = apiUtils.handleApiError(error)

        // 确保总是返回一个有效的错误结果
        return {
          success: false,
          error: this.error || '登录失败',
          message: this.error || '登录失败'
        }
      } finally {
        this.isLoading = false
      }
    },

    // 获取用户信息
    async fetchUserProfile() {
      if (!this.isAuthenticated) return

      this.isLoading = true
      this.error = null

      try {
        const response = await authAPI.getProfile()

        if (response.user) {
          this.user = response.user
          localStorage.setItem('userInfo', JSON.stringify(response.user))
          return { success: true }
        }

        throw new Error('获取用户信息失败')
      } catch (error: any) {
        this.error = apiUtils.handleApiError(error)
        return { success: false, error: this.error }
      } finally {
        this.isLoading = false
      }
    },

    // 更新用户信息
    async updateProfile(profileData: any) {
      this.isLoading = true
      this.error = null

      try {
        const response = await authAPI.updateProfile(profileData)

        if (response.user) {
          this.user = response.user
          localStorage.setItem('userInfo', JSON.stringify(response.user))
          return { success: true, message: response.message }
        }

        throw new Error('更新用户信息失败')
      } catch (error: any) {
        this.error = apiUtils.handleApiError(error)
        return { success: false, error: this.error }
      } finally {
        this.isLoading = false
      }
    },

    // 修改密码
    async changePassword(passwordData: {
      currentPassword: string
      newPassword: string
    }) {
      this.isLoading = true
      this.error = null

      try {
        const response = await authAPI.changePassword(passwordData)
        return { success: true, message: response.message }
      } catch (error: any) {
        this.error = apiUtils.handleApiError(error)
        return { success: false, error: this.error }
      } finally {
        this.isLoading = false
      }
    },

    // 用户登出
    async logout() {
      try {
        if (this.isAuthenticated) {
          await authAPI.logout()
        }
      } catch (error) {
        console.error('Logout API error:', error)
      } finally {
        // 清除状态和本地存储
        this.user = null
        this.token = null
        this.isAuthenticated = false
        this.error = null

        apiUtils.clearAuthToken()
      }
    },

    // 初始化认证状态
    async initializeAuth() {
      const token = apiUtils.getAuthToken()
      const userInfo = localStorage.getItem('userInfo')

      if (token && userInfo) {
        try {
          this.token = token
          this.user = JSON.parse(userInfo)
          this.isAuthenticated = true

          // 验证token是否仍然有效
          await this.fetchUserProfile()
        } catch (error) {
          // Token无效，清除认证状态
          this.logout()
        }
      }
    },

    // 清除错误信息
    clearError() {
      this.error = null
    },

    // 更新用户统计信息
    updateUserStats(stats: any) {
      if (this.user) {
        this.user.stats = { ...this.user.stats, ...stats }
        localStorage.setItem('userInfo', JSON.stringify(this.user))
      }
    },
  },
})
