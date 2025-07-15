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
    if (error.response?.status === 401) {
      // Token过期或无效，清除本地存储并跳转到登录页
      localStorage.removeItem('authToken')
      localStorage.removeItem('userInfo')
      window.location.href = '/login'
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
    const response = await apiClient.post('/auth/login', credentials)
    return response.data
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
    if (error.response?.data?.error) {
      return error.response.data.error
    }
    if (error.response?.data?.message) {
      return error.response.data.message
    }
    if (error.message) {
      return error.message
    }
    return '网络错误，请稍后重试'
  },
}

export default apiClient
