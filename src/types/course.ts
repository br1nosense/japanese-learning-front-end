// 课程相关类型定义

export interface Course {
  id: string
  title: string
  description: string
  longDescription?: string
  level: 'beginner' | 'intermediate' | 'advanced'
  category: 'vocabulary' | 'grammar' | 'listening' | 'reading' | 'business' | 'exam'
  jlptLevel?: 'N5' | 'N4' | 'N3' | 'N2' | 'N1'
  image?: string
  thumbnail?: string
  tags: string[]
  price: 'free' | 'premium'
  instructor: {
    name: string
    bio?: string
    avatar?: string
    credentials?: string[]
  }
  lessons?: Lesson[]
  totalLessons: number
  totalDuration: number
  difficulty?: number
  prerequisites?: string[]
  learningObjectives?: string[]
  estimatedCompletionTime?: string
  rating: {
    average: number
    count: number
  }
  enrollment: {
    count: number
  }
  status?: 'draft' | 'published' | 'archived'
  isActive?: boolean
  createdAt?: string
  updatedAt?: string
}

export interface Lesson {
  id?: string
  title: string
  description: string
  content?: string
  duration: number
  order: number
  type: 'video' | 'text' | 'interactive' | 'quiz'
  isPreview: boolean
}

export interface CourseListParams {
  category?: 'all' | 'vocabulary' | 'grammar' | 'listening' | 'reading' | 'business' | 'exam'
  level?: 'all' | 'beginner' | 'intermediate' | 'advanced'
  jlptLevel?: 'N5' | 'N4' | 'N3' | 'N2' | 'N1'
  price?: 'all' | 'free' | 'premium'
  limit?: number
  page?: number
  sort?: 'newest' | 'oldest' | 'rating' | 'popular' | 'title'
}

export interface CourseListResponse {
  success: boolean
  data: {
    courses: Course[]
    pagination: {
      currentPage: number
      totalPages: number
      totalCourses: number
      hasNextPage: boolean
      hasPrevPage: boolean
      limit: number
    }
  }
}

export interface CourseSearchParams {
  q: string
  limit?: number
}

// 课程筛选选项
export interface FilterOption {
  label: string
  value: string
}

export const LEVEL_OPTIONS: FilterOption[] = [
  { label: '全部级别', value: 'all' },
  { label: '初级', value: 'beginner' },
  { label: '中级', value: 'intermediate' },
  { label: '高级', value: 'advanced' }
]

export const CATEGORY_OPTIONS: FilterOption[] = [
  { label: '全部分类', value: 'all' },
  { label: '词汇', value: 'vocabulary' },
  { label: '语法', value: 'grammar' },
  { label: '听力', value: 'listening' },
  { label: '阅读', value: 'reading' },
  { label: '商务', value: 'business' },
  { label: '考试', value: 'exam' }
]

export const JLPT_LEVEL_OPTIONS: FilterOption[] = [
  { label: '全部等级', value: 'all' },
  { label: 'N5', value: 'N5' },
  { label: 'N4', value: 'N4' },
  { label: 'N3', value: 'N3' },
  { label: 'N2', value: 'N2' },
  { label: 'N1', value: 'N1' }
]

export const PRICE_OPTIONS: FilterOption[] = [
  { label: '全部价格', value: 'all' },
  { label: '免费', value: 'free' },
  { label: '付费', value: 'premium' }
]

export const SORT_OPTIONS: FilterOption[] = [
  { label: '最新发布', value: 'newest' },
  { label: '最早发布', value: 'oldest' },
  { label: '评分最高', value: 'rating' },
  { label: '最受欢迎', value: 'popular' },
  { label: '按标题排序', value: 'title' }
]
