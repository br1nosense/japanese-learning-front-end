import { ref, type Ref } from 'vue'
import { apiUtils } from '@/services/api'

export interface ApiRequestOptions {
  showLoading?: boolean
  showError?: boolean
  retries?: number
  retryDelay?: number
  onSuccess?: (data: any) => void
  onError?: (error: any) => void
}

export interface ApiRequestState<T = any> {
  data: Ref<T | null>
  loading: Ref<boolean>
  error: Ref<string | null>
  execute: (requestFn: () => Promise<any>, options?: ApiRequestOptions) => Promise<T | null>
  retry: () => Promise<T | null>
  reset: () => void
}

/**
 * API请求状态管理Hook
 * 提供统一的加载状态、错误处理和重试机制
 */
export function useApiRequest<T = any>(defaultOptions?: ApiRequestOptions): ApiRequestState<T> {
  const data = ref<T | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  
  let lastRequestFn: (() => Promise<any>) | null = null
  let lastOptions: ApiRequestOptions | undefined

  const execute = async (
    requestFn: () => Promise<any>, 
    options: ApiRequestOptions = {}
  ): Promise<T | null> => {
    const opts = { ...defaultOptions, ...options }
    
    // 保存请求函数和选项，用于重试
    lastRequestFn = requestFn
    lastOptions = opts

    loading.value = opts.showLoading !== false
    error.value = null

    try {
      let result: any

      if (opts.retries && opts.retries > 0) {
        // 使用重试机制
        result = await apiUtils.retryRequest(requestFn, opts.retries, opts.retryDelay)
      } else {
        // 直接执行请求
        result = await requestFn()
      }

      data.value = result
      
      // 调用成功回调
      if (opts.onSuccess) {
        opts.onSuccess(result)
      }

      return result
    } catch (err: any) {
      const errorMessage = apiUtils.handleApiError(err)
      error.value = errorMessage

      // 显示错误提示
      if (opts.showError !== false) {
        window.$message?.error(errorMessage)
      }

      // 调用错误回调
      if (opts.onError) {
        opts.onError(err)
      }

      return null
    } finally {
      loading.value = false
    }
  }

  const retry = async (): Promise<T | null> => {
    if (lastRequestFn) {
      return execute(lastRequestFn, lastOptions)
    }
    return null
  }

  const reset = () => {
    data.value = null
    loading.value = false
    error.value = null
    lastRequestFn = null
    lastOptions = undefined
  }

  return {
    data,
    loading,
    error,
    execute,
    retry,
    reset
  }
}

/**
 * 分页请求Hook
 */
export interface PaginationState {
  currentPage: Ref<number>
  pageSize: Ref<number>
  total: Ref<number>
  totalPages: Ref<number>
  hasNextPage: Ref<boolean>
  hasPrevPage: Ref<boolean>
}

export function usePaginatedRequest<T = any>(
  requestFn: (page: number, pageSize: number, ...args: any[]) => Promise<any>,
  defaultPageSize = 20,
  options?: ApiRequestOptions
) {
  const apiRequest = useApiRequest<T[]>(options)
  
  const currentPage = ref(1)
  const pageSize = ref(defaultPageSize)
  const total = ref(0)
  const totalPages = ref(0)
  const hasNextPage = ref(false)
  const hasPrevPage = ref(false)

  const loadPage = async (page?: number, size?: number, ...args: any[]) => {
    if (page !== undefined) currentPage.value = page
    if (size !== undefined) pageSize.value = size

    const result = await apiRequest.execute(() => 
      requestFn(currentPage.value, pageSize.value, ...args)
    )

    if (result && result.pagination) {
      const { pagination } = result
      total.value = pagination.totalCourses || pagination.total || 0
      totalPages.value = pagination.totalPages || 0
      hasNextPage.value = pagination.hasNextPage || false
      hasPrevPage.value = pagination.hasPrevPage || false
    }

    return result
  }

  const nextPage = () => {
    if (hasNextPage.value) {
      return loadPage(currentPage.value + 1)
    }
  }

  const prevPage = () => {
    if (hasPrevPage.value) {
      return loadPage(currentPage.value - 1)
    }
  }

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages.value) {
      return loadPage(page)
    }
  }

  const changePageSize = (size: number) => {
    return loadPage(1, size)
  }

  return {
    ...apiRequest,
    pagination: {
      currentPage,
      pageSize,
      total,
      totalPages,
      hasNextPage,
      hasPrevPage
    },
    loadPage,
    nextPage,
    prevPage,
    goToPage,
    changePageSize
  }
}

/**
 * 搜索请求Hook
 */
export function useSearchRequest<T = any>(
  searchFn: (query: string, ...args: any[]) => Promise<any>,
  debounceDelay = 500,
  options?: ApiRequestOptions
) {
  const apiRequest = useApiRequest<T[]>(options)
  const searchQuery = ref('')
  
  let debounceTimer: NodeJS.Timeout | null = null

  const search = async (query?: string, ...args: any[]) => {
    if (query !== undefined) {
      searchQuery.value = query
    }

    if (!searchQuery.value.trim()) {
      apiRequest.reset()
      return null
    }

    return apiRequest.execute(() => searchFn(searchQuery.value.trim(), ...args))
  }

  const debouncedSearch = (...args: any[]) => {
    if (debounceTimer) {
      clearTimeout(debounceTimer)
    }

    debounceTimer = setTimeout(() => {
      search(undefined, ...args)
    }, debounceDelay)
  }

  const clearSearch = () => {
    searchQuery.value = ''
    apiRequest.reset()
    if (debounceTimer) {
      clearTimeout(debounceTimer)
    }
  }

  return {
    ...apiRequest,
    searchQuery,
    search,
    debouncedSearch,
    clearSearch
  }
}
