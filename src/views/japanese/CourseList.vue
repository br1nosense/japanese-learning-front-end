<script lang="ts" setup>
import { Icon } from '@iconify/vue'
import { useRouter } from 'vue-router'
import { onMounted, watch, computed, ref } from 'vue'
import { courseAPI } from '@/services/api'
import { useApiRequest, useSearchRequest } from '@/hooks/common/useApiRequest'
import type { Course, CourseListParams } from '@/types/course'
import { LEVEL_OPTIONS, CATEGORY_OPTIONS, PRICE_OPTIONS, SORT_OPTIONS } from '@/types/course'

const router = useRouter()

// 开发环境标识
const isDev = import.meta.env.DEV

// 响应式状态管理
const selectedLevel = ref('all')
const selectedCategory = ref('all')
const selectedPrice = ref('all')
const selectedSort = ref('newest')

// 分页状态
const currentPage = ref(1)
const pageSize = ref(12)

// 使用API请求Hook
const courseRequest = useApiRequest<{ courses: Course[], pagination: any }>({
  showLoading: true,
  showError: true,
  retries: 2
})

// 使用搜索Hook
const searchRequest = useSearchRequest<Course>(
  (query: string) => courseAPI.searchCourses(query, 12),
  500,
  { showLoading: true, showError: true }
)

// 课程数据
const courses = computed(() => {
  console.log('Computing courses...')
  console.log('Search query:', searchRequest.searchQuery.value)
  console.log('Course request data:', courseRequest.data.value)

  if (searchRequest.searchQuery.value.trim()) {
    console.log('Using search data:', searchRequest.data.value)
    return searchRequest.data.value || []
  }

  const apiData = courseRequest.data.value
  console.log('API data structure:', apiData)

  if (apiData && apiData.data && apiData.data.courses) {
    console.log('Found courses in data.data.courses:', apiData.data.courses.length)
    return apiData.data.courses
  } else if (apiData && apiData.courses) {
    console.log('Found courses in data.courses:', apiData.courses.length)
    return apiData.courses
  } else {
    console.log('No courses found, returning empty array')
    return []
  }
})

// 分页信息
const pagination = computed(() => {
  if (searchRequest.searchQuery.value.trim()) {
    return {
      currentPage: 1,
      totalPages: 1,
      totalCourses: searchRequest.data.value?.length || 0,
      hasNextPage: false,
      hasPrevPage: false,
      limit: 12
    }
  }

  const apiData = courseRequest.data.value
  if (apiData && apiData.data && apiData.data.pagination) {
    return apiData.data.pagination
  }

  return {
    currentPage: 1,
    totalPages: 1,
    totalCourses: 0,
    hasNextPage: false,
    hasPrevPage: false,
    limit: 12
  }
})

// 加载状态
const loading = computed(() => courseRequest.loading.value || searchRequest.loading.value)

// 错误状态
const error = computed(() => courseRequest.error.value || searchRequest.error.value)

// 获取课程数据的参数
const getCoursesParams = computed((): CourseListParams => ({
  category: selectedCategory.value === 'all' ? undefined : selectedCategory.value as any,
  level: selectedLevel.value === 'all' ? undefined : selectedLevel.value as any,
  price: selectedPrice.value === 'all' ? undefined : selectedPrice.value as any,
  sort: selectedSort.value as any,
  limit: pageSize.value,
  page: currentPage.value
}))

// 获取课程数据
async function loadCourses() {
  console.log('CourseList: 开始加载课程数据')
  console.log('CourseList: 请求参数:', getCoursesParams.value)

  try {
    await courseRequest.execute(() => courseAPI.getCourses(getCoursesParams.value))
    console.log('CourseList: 课程数据加载完成')
    console.log('CourseList: 课程数量:', courses.value.length)
    console.log('CourseList: 课程数据:', courses.value)
  } catch (error) {
    console.error('CourseList: 课程数据加载失败:', error)
  }
}

// 重新加载课程数据
async function reloadCourses() {
  // 清除搜索
  searchRequest.clearSearch()
  // 重新加载课程
  await loadCourses()
}

// 切换页面
async function changePage(page: number) {
  currentPage.value = page
  await loadCourses()
}

// 处理搜索
function handleSearch() {
  if (searchRequest.searchQuery.value.trim()) {
    searchRequest.debouncedSearch()
  } else {
    searchRequest.clearSearch()
    loadCourses()
  }
}

// 监听筛选条件变化
watch([selectedLevel, selectedCategory, selectedPrice, selectedSort], () => {
  console.log('筛选条件变化，重新加载课程')
  // 清除搜索状态
  searchRequest.clearSearch()
  // 重新加载课程
  loadCourses()
}, { deep: true, flush: 'post' })

// 监听搜索输入
watch(searchRequest.searchQuery, handleSearch)

function getLevelColor(level: string) {
  const colors = {
    beginner: 'success',
    intermediate: 'warning',
    advanced: 'error'
  }
  return colors[level] || 'default'
}

function getLevelText(level: string) {
  const texts = {
    beginner: '初级',
    intermediate: '中级',
    advanced: '高级'
  }
  return texts[level] || level
}

function startCourse(courseId: string) {
  // 根据课程类别跳转到不同的学习页面
  const course = courses.value.find(c => c.id === courseId)
  if (!course) return

  // 构建完整的课程信息参数
  const courseParams = {
    courseId: courseId,
    level: course.level,
    title: course.title,
    description: course.description,
    category: course.category,
    lessons: course.totalLessons.toString(),
    duration: course.totalDuration.toString(),
    tags: course.tags.join(','), // 将标签数组转换为逗号分隔的字符串
    price: course.price
  }

  // 根据课程类别跳转到不同的学习页面
  switch (course.category) {
    case 'vocabulary':
      // 词汇类课程跳转到单词学习
      router.push({
        path: '/learning/words',
        query: {
          ...courseParams,
          focus: 'vocabulary' // 指定学习重点
        }
      })
      break
    case 'grammar':
      // 语法类课程跳转到语法学习
      router.push({
        path: '/learning/grammar',
        query: {
          ...courseParams,
          focus: 'grammar'
        }
      })
      break
    case 'listening':
      // 听力类课程跳转到听力学习页面
      router.push({
        path: '/learning/listening',
        query: {
          ...courseParams,
          focus: 'listening'
        }
      })
      break
    case 'reading':
      // 阅读类课程跳转到阅读学习页面（暂时跳转到单词学习）
      router.push({
        path: '/learning/words',
        query: {
          ...courseParams,
          focus: 'reading',
          type: 'reading'
        }
      })
      break
    case 'business':
      // 商务日语课程跳转到语法学习，但专注于商务内容
      router.push({
        path: '/learning/grammar',
        query: {
          ...courseParams,
          focus: 'business',
          type: 'business'
        }
      })
      break
    case 'exam':
      // 考试类课程跳转到语法学习，但专注于考试内容
      router.push({
        path: '/learning/grammar',
        query: {
          ...courseParams,
          focus: 'exam',
          type: 'exam'
        }
      })
      break
    default:
      // 默认跳转到单词学习
      router.push({
        path: '/learning/words',
        query: {
          ...courseParams,
          focus: 'general'
        }
      })
  }
}

// 组件挂载时加载课程数据
onMounted(() => {
  loadCourses()
})
</script>

<template>
  <div class="course-list-page">
    <!-- Header -->
    <n-card class="header-section mb-6 rounded-16px" content-style="padding: 40px;">
      <div class="text-center">
        <n-h1 class="mb-4">
          <n-gradient-text type="primary">
            课程中心
          </n-gradient-text>
        </n-h1>
        <n-text class="text-16px text-gray-600">
          选择适合您水平的日语课程，开始系统化的学习之旅
        </n-text>
      </div>
    </n-card>

    <!-- Search and Filters -->
    <n-card class="filter-section mb-6 rounded-16px" content-style="padding: 24px;">
      <!-- Search Bar -->
      <div class="search-section mb-4">
        <n-input
          v-model:value="searchRequest.searchQuery.value"
          placeholder="搜索课程名称、标签或讲师..."
          clearable
          size="large"
          :disabled="loading"
        >
          <template #prefix>
            <Icon icon="tabler:search" />
          </template>
        </n-input>
      </div>

      <!-- Filters -->
      <div class="flex gap-4 items-center flex-wrap">
        <div class="filter-item">
          <n-text class="mr-2">级别筛选：</n-text>
          <n-select
            v-model:value="selectedLevel"
            :options="LEVEL_OPTIONS"
            class="w-120px"
            size="small"
            :disabled="loading"
          />
        </div>
        <div class="filter-item">
          <n-text class="mr-2">分类筛选：</n-text>
          <n-select
            v-model:value="selectedCategory"
            :options="CATEGORY_OPTIONS"
            class="w-120px"
            size="small"
            :disabled="loading"
          />
        </div>
        <div class="filter-item">
          <n-text class="mr-2">价格筛选：</n-text>
          <n-select
            v-model:value="selectedPrice"
            :options="PRICE_OPTIONS"
            class="w-120px"
            size="small"
            :disabled="loading"
          />
        </div>
        <div class="filter-item">
          <n-text class="mr-2">排序方式：</n-text>
          <n-select
            v-model:value="selectedSort"
            :options="SORT_OPTIONS"
            class="w-120px"
            size="small"
            :disabled="loading"
          />
        </div>
        <div class="ml-auto flex items-center gap-3">
          <n-button
            size="small"
            @click="reloadCourses"
            :loading="loading"
            secondary
          >
            <template #icon>
              <Icon icon="tabler:refresh" />
            </template>
            刷新
          </n-button>
          <n-text depth="3">
            共找到 {{ pagination.totalCourses }} 门课程 (当前显示: {{ courses.length }})
          </n-text>
        </div>
      </div>
    </n-card>

    <!-- Error State -->
    <n-card v-if="error && !loading" class="error-section mb-6 rounded-16px">
      <n-result status="error" title="加载失败" :description="error">
        <template #footer>
          <n-space>
            <n-button type="primary" @click="reloadCourses">
              <template #icon>
                <Icon icon="tabler:refresh" />
              </template>
              重新加载
            </n-button>
            <n-button
              v-if="searchRequest.searchQuery.value.trim()"
              @click="searchRequest.retry()"
              secondary
            >
              <template #icon>
                <Icon icon="tabler:search" />
              </template>
              重试搜索
            </n-button>
            <n-button
              v-else
              @click="courseRequest.retry()"
              secondary
            >
              <template #icon>
                <Icon icon="tabler:reload" />
              </template>
              重试请求
            </n-button>
          </n-space>
        </template>
      </n-result>
    </n-card>

    <!-- Loading State -->
    <div v-if="loading" class="loading-section mb-6">
      <n-card class="rounded-16px" content-style="padding: 60px;">
        <div class="text-center">
          <n-spin size="large">
            <template #description>
              <n-text depth="3">正在加载课程数据...</n-text>
            </template>
          </n-spin>
        </div>
      </n-card>
    </div>

    <!-- Debug Info (开发环境) -->
    <n-card v-if="isDev" class="debug-section mb-6 rounded-16px" title="调试信息">
      <n-space vertical>
        <n-text>加载状态: {{ loading }}</n-text>
        <n-text>错误状态: {{ error || '无' }}</n-text>
        <n-text>课程数量: {{ courses.length }}</n-text>
        <n-text>显示课程网格: {{ !loading && !error }}</n-text>
        <n-text>API数据存在: {{ !!courseRequest.data.value }}</n-text>
        <n-text>课程数据路径: {{ courseRequest.data.value?.data?.courses ? '正确' : '错误' }}</n-text>
      </n-space>
    </n-card>

    <!-- Course Grid -->
    <div v-if="!loading && !error">
      <!-- 简单的课程列表测试 -->
      <n-card v-if="isDev" class="mb-4" title="简单渲染测试">
        <n-space vertical>
          <n-text>准备渲染 {{ courses.length }} 门课程</n-text>
          <div v-for="(course, index) in courses.slice(0, 3)" :key="course.id || index">
            <n-text>{{ index + 1 }}. {{ course.title }} (ID: {{ course.id }})</n-text>
          </div>
        </n-space>
      </n-card>

      <n-grid :cols="24" :x-gap="24" :y-gap="24" responsive="screen" item-responsive>
        <n-grid-item v-for="course in courses" :key="course.id || course._id" span="24 l:8 m:12 s:24">
          <n-card hoverable class="course-card h-full" content-style="padding: 0;">
            <div class="course-image">
              <img
                :src="course.image || course.thumbnail || '/vite.svg'"
                :alt="course.title"
                class="w-full h-160px object-cover"
              />
              <div class="course-overlay">
                <n-tag :type="getLevelColor(course.level)" size="small">
                  {{ getLevelText(course.level) }}
                </n-tag>
                <n-tag v-if="course.price === 'free'" type="success" size="small" class="ml-2">
                  免费
                </n-tag>
                <n-tag v-if="course.jlptLevel" type="warning" size="small" class="ml-2">
                  {{ course.jlptLevel }}
                </n-tag>
              </div>
            </div>

            <div class="course-content p-20px">
              <n-h3 class="mb-2 line-clamp-1">{{ course.title }}</n-h3>
              <n-text depth="3" class="mb-3 block line-clamp-2">{{ course.description }}</n-text>

              <!-- 讲师信息 -->
              <div v-if="course.instructor?.name" class="instructor-info mb-3">
                <n-text depth="2" class="text-sm">
                  讲师：{{ course.instructor.name }}
                </n-text>
              </div>

              <div v-if="course.tags && course.tags.length > 0" class="course-tags mb-3">
                <n-tag
                  v-for="tag in course.tags"
                  :key="tag"
                  size="small"
                  class="mr-1 mb-1"
                  type="info"
                  :bordered="false"
                >
                  {{ tag }}
                </n-tag>
              </div>

              <div class="course-stats mb-4">
                <div class="flex items-center gap-4 text-sm text-gray-600">
                  <div v-if="course.lessons" class="flex items-center gap-1">
                    <Icon icon="tabler:book" />
                    <span>{{ course.lessons }}课时</span>
                  </div>
                  <div v-if="course.duration" class="flex items-center gap-1">
                    <Icon icon="tabler:clock" />
                    <span>{{ course.duration }}</span>
                  </div>
                  <div v-if="course.students" class="flex items-center gap-1">
                    <Icon icon="tabler:users" />
                    <span>{{ course.students }}</span>
                  </div>
                </div>
                <div v-if="course.rating" class="flex items-center gap-1 mt-2">
                  <Icon icon="tabler:star-filled" class="text-yellow-500" />
                  <span class="text-sm">{{ course.rating }} ({{ course.students || 0 }})</span>
                </div>
              </div>

              <n-button type="primary" block @click="startCourse(course.id)">
                <template #icon>
                  <Icon icon="tabler:play" />
                </template>
                开始学习
              </n-button>
            </div>
          </n-card>
        </n-grid-item>
      </n-grid>

      <!-- Pagination -->
      <div v-if="pagination.totalPages > 1" class="pagination-section mt-8 text-center">
        <n-pagination
          v-model:page="currentPage"
          :page-count="pagination.totalPages"
          :page-size="pageSize"
          :item-count="pagination.totalCourses"
          show-size-picker
          show-quick-jumper
          :page-sizes="[6, 12, 24, 48]"
          @update:page="changePage"
          @update:page-size="(size) => { pageSize = size; currentPage = 1; reloadCourses() }"
        />
      </div>

      <!-- Empty State -->
      <div v-if="courses.length === 0 && !loading && !error" class="empty-state text-center py-20">
        <n-card class="rounded-16px" content-style="padding: 60px;">
          <Icon icon="tabler:book-off" class="text-80px text-gray-400 mb-4" />
          <n-text depth="3" class="text-18px mb-4 block">
            {{ searchRequest.searchQuery.value.trim() ? '没有找到匹配的课程' : '没有找到符合条件的课程' }}
          </n-text>
          <n-space justify="center">
            <n-button @click="reloadCourses" secondary>
              <template #icon>
                <Icon icon="tabler:refresh" />
              </template>
              重新加载
            </n-button>
            <n-button
              v-if="searchRequest.searchQuery.value.trim()"
              @click="searchRequest.clearSearch()"
              tertiary
            >
              <template #icon>
                <Icon icon="tabler:x" />
              </template>
              清除搜索
            </n-button>
          </n-space>
        </n-card>
      </div>
    </div>
  </div>
</template>

<style scoped>
.course-list-page {
  max-width: 1200px;
  margin: 0 auto;
}

.course-card {
  transition: transform 0.3s ease;
  overflow: hidden;
}

.course-card:hover {
  transform: translateY(-4px);
}

.course-image {
  position: relative;
  overflow: hidden;
}

.course-overlay {
  position: absolute;
  top: 12px;
  left: 12px;
}

.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.search-section {
  max-width: 500px;
  margin: 0 auto;
}

.pagination-section {
  padding: 20px 0;
}

/* 响应式布局优化 */
/* 桌面端 (>1200px): 3列 */
@media (min-width: 1201px) {
  .course-content {
    padding: 20px !important;
  }

  .course-content .n-h3 {
    font-size: 18px;
  }
}

/* 平板端 (768px-1200px): 2列 */
@media (max-width: 1200px) and (min-width: 769px) {
  .course-content {
    padding: 18px !important;
  }

  .course-content .n-h3 {
    font-size: 17px;
  }
}

/* 移动端 (<768px): 1-2列 */
@media (max-width: 768px) {
  .filter-section .flex {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .filter-item {
    width: 100%;
  }

  .filter-item .n-select {
    width: 100%;
  }

  .course-content {
    padding: 16px !important;
  }

  .course-content .n-h3 {
    font-size: 16px;
  }

  /* 在小屏幕上调整图片高度 */
  .course-image img {
    height: 140px !important;
  }
}

/* 超小屏幕 (<480px): 1列 */
@media (max-width: 480px) {
  .course-content {
    padding: 14px !important;
  }

  .course-content .n-h3 {
    font-size: 15px;
  }

  .course-image img {
    height: 120px !important;
  }
}
</style>
