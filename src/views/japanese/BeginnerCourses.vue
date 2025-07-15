<script lang="ts" setup>
import { Icon } from '@iconify/vue'

const beginnerCourses = ref([
  {
    id: 1,
    title: '五十音图入门',
    description: '从零开始学习平假名和片假名，掌握日语文字基础',
    lessons: 15,
    duration: '2-3周',
    difficulty: '入门',
    students: 2500,
    rating: 4.9,
    image: '/vite.svg',
    tags: ['平假名', '片假名', '发音'],
    features: ['发音练习', '书写练习', '记忆技巧'],
    price: 'free'
  },
  {
    id: 2,
    title: '基础日语语法',
    description: '学习日语基本语法结构，掌握简单句型',
    lessons: 25,
    duration: '1-2个月',
    difficulty: '初级',
    students: 1800,
    rating: 4.8,
    image: '/vite.svg',
    tags: ['语法', '句型', '助词'],
    features: ['语法讲解', '例句练习', '语法测试'],
    price: 'premium'
  },
  {
    id: 3,
    title: '日常会话入门',
    description: '学习日常生活中的基本对话和表达',
    lessons: 20,
    duration: '3-4周',
    difficulty: '初级',
    students: 1500,
    rating: 4.7,
    image: '/vite.svg',
    tags: ['会话', '日常用语', '礼貌用语'],
    features: ['情景对话', '发音练习', '角色扮演'],
    price: 'premium'
  },
  {
    id: 4,
    title: '基础词汇1000',
    description: '掌握日语学习必备的1000个基础词汇',
    lessons: 30,
    duration: '2个月',
    difficulty: '初级',
    students: 2200,
    rating: 4.6,
    image: '/vite.svg',
    tags: ['词汇', '记忆', '应用'],
    features: ['词汇分类', '记忆方法', '应用练习'],
    price: 'free'
  },
  {
    id: 5,
    title: '数字与时间表达',
    description: '学习日语中数字、时间、日期的表达方法',
    lessons: 12,
    duration: '2周',
    difficulty: '入门',
    students: 1200,
    rating: 4.8,
    image: '/vite.svg',
    tags: ['数字', '时间', '日期'],
    features: ['数字练习', '时间表达', '实用对话'],
    price: 'free'
  },
  {
    id: 6,
    title: 'JLPT N5备考',
    description: 'JLPT N5考试专项训练，全面提升应试能力',
    lessons: 40,
    duration: '3个月',
    difficulty: '初级',
    students: 3000,
    rating: 4.9,
    image: '/vite.svg',
    tags: ['JLPT', 'N5', '考试'],
    features: ['模拟考试', '真题练习', '考试技巧'],
    price: 'premium'
  }
])

function getDifficultyColor(difficulty: string) {
  const colors = {
    '入门': 'success',
    '初级': 'info'
  }
  return colors[difficulty] || 'default'
}

function startCourse(courseId: number) {
  window.$message.success('开始学习课程！')
}
</script>

<template>
  <div class="beginner-courses-page">
    <!-- Header -->
    <n-card class="header-section mb-6 rounded-16px" content-style="padding: 40px;">
      <div class="text-center">
        <n-h1 class="mb-4">
          <n-gradient-text type="primary">
            初级课程
          </n-gradient-text>
        </n-h1>
        <n-text class="text-16px text-gray-600">
          专为日语初学者设计的系统化课程
        </n-text>
      </div>
    </n-card>

    <!-- Course Grid -->
    <n-grid :cols="2" :x-gap="24" :y-gap="24" responsive="screen" item-responsive>
      <n-grid-item v-for="course in beginnerCourses" :key="course.id" span="24 l:12">
        <n-card hoverable class="course-card h-full rounded-16px" content-style="padding: 0;">
          <div class="course-image">
            <img :src="course.image" :alt="course.title" class="w-full h-160px object-cover" />
            <div class="course-overlay">
              <n-tag :type="getDifficultyColor(course.difficulty)" size="small">
                {{ course.difficulty }}
              </n-tag>
              <n-tag v-if="course.price === 'free'" type="success" size="small" class="ml-2">
                免费
              </n-tag>
            </div>
          </div>
          
          <div class="course-content p-20px">
            <n-h3 class="mb-2">{{ course.title }}</n-h3>
            <n-text depth="3" class="mb-3 block">{{ course.description }}</n-text>
            
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
            
            <div class="course-features mb-4">
              <n-text depth="2" class="text-sm block mb-2">课程特色：</n-text>
              <div class="features-list">
                <div v-for="feature in course.features" :key="feature" class="feature-item flex items-center gap-2 mb-1">
                  <Icon icon="tabler:check" class="text-green-500 text-sm" />
                  <n-text depth="3" class="text-sm">{{ feature }}</n-text>
                </div>
              </div>
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

    <!-- Learning Path -->
    <n-card class="learning-path mt-6 rounded-16px" content-style="padding: 40px;">
      <n-h2 class="text-center mb-6">
        <n-gradient-text type="success">
          推荐学习路径
        </n-gradient-text>
      </n-h2>
      
      <div class="path-steps">
        <div class="step-item flex items-center gap-4 mb-4">
          <n-tag type="primary" size="large" round>1</n-tag>
          <div>
            <n-text strong>五十音图入门</n-text>
            <n-text depth="3" class="block">掌握日语文字基础</n-text>
          </div>
        </div>
        <div class="step-connector"></div>
        
        <div class="step-item flex items-center gap-4 mb-4">
          <n-tag type="primary" size="large" round>2</n-tag>
          <div>
            <n-text strong>基础词汇1000</n-text>
            <n-text depth="3" class="block">积累基础词汇量</n-text>
          </div>
        </div>
        <div class="step-connector"></div>
        
        <div class="step-item flex items-center gap-4 mb-4">
          <n-tag type="primary" size="large" round>3</n-tag>
          <div>
            <n-text strong>基础日语语法</n-text>
            <n-text depth="3" class="block">学习基本语法结构</n-text>
          </div>
        </div>
        <div class="step-connector"></div>
        
        <div class="step-item flex items-center gap-4 mb-4">
          <n-tag type="primary" size="large" round>4</n-tag>
          <div>
            <n-text strong>日常会话入门</n-text>
            <n-text depth="3" class="block">练习实际对话应用</n-text>
          </div>
        </div>
        <div class="step-connector"></div>
        
        <div class="step-item flex items-center gap-4">
          <n-tag type="primary" size="large" round>5</n-tag>
          <div>
            <n-text strong>JLPT N5备考</n-text>
            <n-text depth="3" class="block">准备能力考试</n-text>
          </div>
        </div>
      </div>
    </n-card>
  </div>
</template>

<style scoped>
.beginner-courses-page {
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

.features-list {
  max-height: 80px;
  overflow-y: auto;
}

.path-steps {
  max-width: 600px;
  margin: 0 auto;
}

.step-connector {
  width: 2px;
  height: 30px;
  background: var(--primary-color);
  margin: 0 auto 0 20px;
}

@media (max-width: 768px) {
  .header-section :deep(.n-card__content),
  .learning-path :deep(.n-card__content) {
    padding: 20px;
  }
}
</style>
