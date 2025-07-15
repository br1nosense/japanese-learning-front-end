<script lang="ts" setup>
import { Icon } from '@iconify/vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const selectedLevel = ref('all')
const selectedCategory = ref('all')

const courses = ref([
  {
    id: 1,
    title: '零基础日语入门',
    description: '从五十音图开始，系统学习日语基础知识',
    level: 'beginner',
    category: 'grammar',
    lessons: 30,
    duration: '2-3个月',
    students: 1250,
    rating: 4.8,
    image: '/vite.svg',
    tags: ['五十音', '基础语法', '日常用语'],
    price: 'free'
  },
  {
    id: 2,
    title: '日语语法精讲',
    description: '深入学习日语语法结构和用法',
    level: 'intermediate',
    category: 'grammar',
    lessons: 45,
    duration: '3-4个月',
    students: 890,
    rating: 4.7,
    image: '/vite.svg',
    tags: ['语法', '句型', '敬语'],
    price: 'premium'
  },
  {
    id: 3,
    title: '日语听力训练',
    description: '通过各种场景对话提高听力理解能力',
    level: 'intermediate',
    category: 'listening',
    lessons: 25,
    duration: '2个月',
    students: 670,
    rating: 4.6,
    image: '/vite.svg',
    tags: ['听力', '对话', '发音'],
    price: 'premium'
  },
  {
    id: 4,
    title: '商务日语',
    description: '学习商务场合的日语表达和礼仪',
    level: 'advanced',
    category: 'business',
    lessons: 20,
    duration: '1-2个月',
    students: 420,
    rating: 4.9,
    image: '/vite.svg',
    tags: ['商务', '敬语', '邮件'],
    price: 'premium'
  },
  {
    id: 5,
    title: '日语阅读理解',
    description: '提高日语文章阅读和理解能力',
    level: 'intermediate',
    category: 'reading',
    lessons: 35,
    duration: '2-3个月',
    students: 580,
    rating: 4.5,
    image: '/vite.svg',
    tags: ['阅读', '词汇', '理解'],
    price: 'free'
  },
  {
    id: 6,
    title: '日语词汇学习',
    description: '系统学习日语常用词汇，掌握词汇用法',
    level: 'beginner',
    category: 'vocabulary',
    lessons: 50,
    duration: '2-3个月',
    students: 1100,
    rating: 4.7,
    image: '/vite.svg',
    tags: ['词汇', '单词', '记忆'],
    price: 'free'
  },
  {
    id: 7,
    title: 'JLPT N5备考',
    description: 'JLPT N5考试专项训练和模拟测试',
    level: 'beginner',
    category: 'exam',
    lessons: 40,
    duration: '3个月',
    students: 950,
    rating: 4.8,
    image: '/vite.svg',
    tags: ['JLPT', 'N5', '考试'],
    price: 'premium'
  },
  {
    id: 8,
    title: '日语听力进阶',
    description: '高级听力训练，提升听力理解水平',
    level: 'advanced',
    category: 'listening',
    lessons: 30,
    duration: '2个月',
    students: 380,
    rating: 4.6,
    image: '/vite.svg',
    tags: ['听力', '进阶', '理解'],
    price: 'premium'
  }
])

const levelOptions = [
  { label: '全部级别', value: 'all' },
  { label: '初级', value: 'beginner' },
  { label: '中级', value: 'intermediate' },
  { label: '高级', value: 'advanced' }
]

const categoryOptions = [
  { label: '全部分类', value: 'all' },
  { label: '词汇', value: 'vocabulary' },
  { label: '语法', value: 'grammar' },
  { label: '听力', value: 'listening' },
  { label: '阅读', value: 'reading' },
  { label: '商务', value: 'business' },
  { label: '考试', value: 'exam' }
]

const filteredCourses = computed(() => {
  return courses.value.filter(course => {
    const levelMatch = selectedLevel.value === 'all' || course.level === selectedLevel.value
    const categoryMatch = selectedCategory.value === 'all' || course.category === selectedCategory.value
    return levelMatch && categoryMatch
  })
})

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

function startCourse(courseId: number) {
  // 根据课程类别跳转到不同的学习页面
  const course = courses.value.find(c => c.id === courseId)
  if (!course) return

  switch (course.category) {
    case 'vocabulary':
      // 词汇类课程跳转到单词学习
      router.push({
        path: '/learning/words',
        query: { courseId: courseId.toString(), level: course.level }
      })
      break
    case 'grammar':
      // 语法类课程跳转到语法学习
      router.push({
        path: '/learning/grammar',
        query: { courseId: courseId.toString(), level: course.level }
      })
      break
    case 'listening':
      // 听力类课程跳转到听力学习页面
      router.push({
        path: '/learning/listening',
        query: { courseId: courseId.toString(), level: course.level }
      })
      break
    case 'reading':
      // 阅读类课程跳转到阅读学习页面（暂时跳转到单词学习）
      router.push({
        path: '/learning/words',
        query: { courseId: courseId.toString(), level: course.level, type: 'reading' }
      })
      break
    case 'business':
    case 'exam':
      // 商务和考试类课程跳转到语法学习
      router.push({
        path: '/learning/grammar',
        query: { courseId: courseId.toString(), level: course.level, type: course.category }
      })
      break
    default:
      // 默认跳转到单词学习
      router.push({
        path: '/learning/words',
        query: { courseId: courseId.toString(), level: course.level }
      })
  }
}
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

    <!-- Filters -->
    <n-card class="filter-section mb-6 rounded-16px" content-style="padding: 24px;">
      <div class="flex gap-4 items-center flex-wrap">
        <div class="filter-item">
          <n-text class="mr-2">级别筛选：</n-text>
          <n-select
            v-model:value="selectedLevel"
            :options="levelOptions"
            class="w-120px"
            size="small"
          />
        </div>
        <div class="filter-item">
          <n-text class="mr-2">分类筛选：</n-text>
          <n-select
            v-model:value="selectedCategory"
            :options="categoryOptions"
            class="w-120px"
            size="small"
          />
        </div>
        <div class="ml-auto">
          <n-text depth="3">
            共找到 {{ filteredCourses.length }} 门课程
          </n-text>
        </div>
      </div>
    </n-card>

    <!-- Course Grid -->
    <n-grid :cols="24" :x-gap="24" :y-gap="24" responsive="screen" item-responsive>
      <n-grid-item v-for="course in filteredCourses" :key="course.id" span="24 l:8 m:12 s:24">
        <n-card hoverable class="course-card h-full" content-style="padding: 0;">
          <div class="course-image">
            <img :src="course.image" :alt="course.title" class="w-full h-160px object-cover" />
            <div class="course-overlay">
              <n-tag :type="getLevelColor(course.level)" size="small">
                {{ getLevelText(course.level) }}
              </n-tag>
              <n-tag v-if="course.price === 'free'" type="success" size="small" class="ml-2">
                免费
              </n-tag>
            </div>
          </div>

          <div class="course-content p-20px">
            <n-h3 class="mb-2 line-clamp-1">{{ course.title }}</n-h3>
            <n-text depth="3" class="mb-3 block line-clamp-2">{{ course.description }}</n-text>

            <div class="course-tags mb-3">
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
                <div class="flex items-center gap-1">
                  <Icon icon="tabler:book" />
                  <span>{{ course.lessons }}课时</span>
                </div>
                <div class="flex items-center gap-1">
                  <Icon icon="tabler:clock" />
                  <span>{{ course.duration }}</span>
                </div>
                <div class="flex items-center gap-1">
                  <Icon icon="tabler:users" />
                  <span>{{ course.students }}</span>
                </div>
              </div>
              <div class="flex items-center gap-1 mt-2">
                <Icon icon="tabler:star-filled" class="text-yellow-500" />
                <span class="text-sm">{{ course.rating }}</span>
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

    <!-- Empty State -->
    <div v-if="filteredCourses.length === 0" class="empty-state text-center py-20">
      <Icon icon="tabler:book-off" class="text-80px text-gray-400 mb-4" />
      <n-text depth="3" class="text-18px">
        没有找到符合条件的课程
      </n-text>
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
