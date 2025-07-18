import axios, { AxiosInstance, AxiosResponse } from 'axios'

// API配置
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api'

// 创建axios实例
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 请求拦截器 - 添加认证token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器 - 处理错误
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response
  },
  (error) => {
    // 网络错误
    if (!error.response) {
      error.code = 'NETWORK_ERROR'
      error.message = '网络连接失败，请检查网络设置'
      return Promise.reject(error)
    }

    const { status, data } = error.response

    switch (status) {
      case 401:
        // Token过期或无效，清除本地存储并跳转到登录页
        localStorage.removeItem('authToken')
        localStorage.removeItem('userInfo')
        // 使用路由跳转而不是直接修改location
        if (window.$router) {
          window.$router.push('/login')
        } else {
          window.location.href = '/login'
        }
        error.message = '登录已过期，请重新登录'
        break
      case 403:
        error.message = '权限不足，无法访问该资源'
        break
      case 404:
        error.message = '请求的资源不存在'
        break
      case 429:
        error.message = '请求过于频繁，请稍后再试'
        break
      case 500:
        error.message = '服务器内部错误，请稍后重试'
        break
      case 502:
      case 503:
      case 504:
        error.message = '服务暂时不可用，请稍后重试'
        break
      default:
        error.message = data?.error || data?.message || '请求失败，请稍后重试'
    }

    return Promise.reject(error)
  }
)

// API响应类型定义
interface ApiResponse<T = any> {
  data: T
  message?: string
  error?: string
}

// 用户认证相关API
export const authAPI = {
  // 用户注册
  register: async (userData: {
    username: string
    email: string
    password: string
    profile?: any
  }): Promise<ApiResponse> => {
    const response = await apiClient.post('/auth/register', userData)
    return response.data
  },

  // 用户登录
  login: async (credentials: {
    identifier: string
    password: string
  }): Promise<ApiResponse> => {
    try {
      console.log('API: 发送登录请求到:', `${API_BASE_URL}/auth/login`)
      console.log('API: 请求数据:', { identifier: credentials.identifier, password: '***' })

      const response = await apiClient.post('/auth/login', credentials)
      console.log('API: 登录响应状态:', response.status)
      console.log('API: 登录响应数据:', response.data)

      return response.data
    } catch (error: any) {
      console.error('API: 登录请求失败:', error)

      // 重新抛出错误，让上层处理
      throw error
    }
  },

  // 获取用户信息
  getProfile: async (): Promise<ApiResponse> => {
    const response = await apiClient.get('/auth/profile')
    return response.data
  },

  // 更新用户信息
  updateProfile: async (profileData: any): Promise<ApiResponse> => {
    const response = await apiClient.put('/auth/profile', profileData)
    return response.data
  },

  // 修改密码
  changePassword: async (passwordData: {
    currentPassword: string
    newPassword: string
  }): Promise<ApiResponse> => {
    const response = await apiClient.post('/auth/change-password', passwordData)
    return response.data
  },

  // 登出
  logout: async (): Promise<ApiResponse> => {
    const response = await apiClient.post('/auth/logout')
    return response.data
  },
}

// 课程相关API
export const courseAPI = {
  // 获取课程列表
  getCourses: async (params?: {
    category?: string
    level?: string
    jlptLevel?: string
    price?: string
    limit?: number
    page?: number
    sort?: string
  }): Promise<ApiResponse> => {
    const response = await apiClient.get('/courses', { params })
    return response.data
  },

  // 获取特色课程
  getFeaturedCourses: async (limit?: number): Promise<ApiResponse> => {
    const response = await apiClient.get('/courses/featured', {
      params: { limit }
    })
    return response.data
  },

  // 根据级别获取课程
  getCoursesByLevel: async (level: string, limit?: number): Promise<ApiResponse> => {
    const response = await apiClient.get(`/courses/${level}`, {
      params: { limit }
    })
    return response.data
  },

  // 获取课程详情
  getCourseDetails: async (courseId: string): Promise<ApiResponse> => {
    const response = await apiClient.get(`/courses/course/${courseId}`)
    return response.data
  },

  // 获取课程课时内容
  getLessonContent: async (courseId: string, lessonId: string): Promise<ApiResponse> => {
    const response = await apiClient.get(`/courses/course/${courseId}/lessons/${lessonId}`)
    return response.data
  },

  // 报名课程
  enrollCourse: async (courseId: string): Promise<ApiResponse> => {
    const response = await apiClient.post(`/courses/${courseId}/enroll`)
    return response.data
  },

  // 搜索课程
  searchCourses: async (query: string, limit?: number): Promise<ApiResponse> => {
    const response = await apiClient.get('/courses/search', {
      params: { q: query, limit }
    })
    return response.data
  },
}

// 学习进度相关API
export const progressAPI = {
  // 获取学习进度
  getProgress: async (): Promise<ApiResponse> => {
    const response = await apiClient.get('/progress')
    return response.data
  },

  // 更新单词学习进度
  updateWordProgress: async (wordData: {
    wordId: string
    isKnown: boolean
    masteryLevel?: number
    word?: any
    isFavorite?: boolean
    difficulty?: number
  }): Promise<ApiResponse> => {
    const response = await apiClient.post('/progress/words', wordData)
    return response.data
  },

  // 更新语法学习进度
  updateGrammarProgress: async (grammarData: {
    questionId: string
    isCorrect: boolean
    grammarPoint?: any
  }): Promise<ApiResponse> => {
    const response = await apiClient.post('/progress/grammar', grammarData)
    return response.data
  },

  // 更新听力学习进度
  updateListeningProgress: async (listeningData: {
    exerciseId: string
    score: number
    timeSpent?: number
    exercise?: any
  }): Promise<ApiResponse> => {
    const response = await apiClient.post('/progress/listening', listeningData)
    return response.data
  },

  // 添加学习会话
  addStudySession: async (sessionData: {
    duration: number
    activities: Array<{
      type: 'word' | 'grammar' | 'listening' | 'course'
      count: number
      accuracy?: number
    }>
  }): Promise<ApiResponse> => {
    const response = await apiClient.post('/progress/session', sessionData)
    return response.data
  },

  // 获取学习统计
  getStats: async (): Promise<ApiResponse> => {
    const response = await apiClient.get('/progress/stats')
    return response.data
  },

  // 获取成就
  getAchievements: async (): Promise<ApiResponse> => {
    const response = await apiClient.get('/progress/achievements')
    return response.data
  },

  // 更新学习偏好
  updatePreferences: async (preferences: {
    dailyGoal?: number
    reminderTime?: string
    studyDays?: number[]
  }): Promise<ApiResponse> => {
    const response = await apiClient.put('/progress/preferences', preferences)
    return response.data
  },
}

// 健康检查API
export const healthAPI = {
  // 检查API服务状态
  checkHealth: async (): Promise<ApiResponse> => {
    const response = await apiClient.get('/health')
    return response.data
  },
}

// 工具函数
export const apiUtils = {
  // 设置认证token
  setAuthToken: (token: string) => {
    localStorage.setItem('authToken', token)
  },

  // 清除认证token
  clearAuthToken: () => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('userInfo')
  },

  // 获取认证token
  getAuthToken: (): string | null => {
    return localStorage.getItem('authToken')
  },

  // 检查是否已登录
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('authToken')
  },

  // 处理API错误
  handleApiError: (error: any): string => {
    // 如果错误已经被响应拦截器处理过，直接返回message
    if (error.message) {
      return error.message
    }

    // 处理响应错误
    if (error.response?.data) {
      const { data } = error.response
      return data.error || data.message || '请求失败，请稍后重试'
    }

    // 处理网络错误
    if (error.code === 'NETWORK_ERROR' || !error.response) {
      return '网络连接失败，请检查网络设置'
    }

    // 处理超时错误
    if (error.code === 'ECONNABORTED') {
      return '请求超时，请稍后重试'
    }

    return '未知错误，请稍后重试'
  },

  // 重试请求
  retryRequest: async (requestFn: () => Promise<any>, maxRetries = 3, delay = 1000): Promise<any> => {
    let lastError: any

    for (let i = 0; i <= maxRetries; i++) {
      try {
        return await requestFn()
      } catch (error: any) {
        lastError = error

        // 如果是客户端错误（4xx），不重试
        if (error.response?.status >= 400 && error.response?.status < 500) {
          throw error
        }

        // 如果是最后一次尝试，抛出错误
        if (i === maxRetries) {
          throw error
        }

        // 等待一段时间后重试
        await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)))
      }
    }

    throw lastError
  },
}

export default apiClient
