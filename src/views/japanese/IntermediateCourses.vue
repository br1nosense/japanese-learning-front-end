<script lang="ts" setup>
import { Icon } from '@iconify/vue'

const intermediateCourses = ref([
  {
    id: 1,
    title: '中级语法精讲',
    description: '深入学习日语中级语法，掌握复杂句型结构',
    lessons: 35,
    duration: '2-3个月',
    difficulty: '中级',
    students: 1200,
    rating: 4.8,
    image: '/vite.svg',
    tags: ['中级语法', '复杂句型', '敬语'],
    features: ['语法详解', '例句分析', '实战练习'],
    price: 'premium'
  },
  {
    id: 2,
    title: '商务日语基础',
    description: '学习商务场合的日语表达和商务礼仪',
    lessons: 25,
    duration: '1-2个月',
    difficulty: '中级',
    students: 800,
    rating: 4.7,
    image: '/vite.svg',
    tags: ['商务日语', '职场礼仪', '邮件写作'],
    features: ['商务对话', '邮件模板', '礼仪培训'],
    price: 'premium'
  },
  {
    id: 3,
    title: '日语听力强化',
    description: '通过各种场景对话和新闻材料提高听力水平',
    lessons: 30,
    duration: '2个月',
    difficulty: '中级',
    students: 950,
    rating: 4.6,
    image: '/vite.svg',
    tags: ['听力训练', '新闻日语', '对话理解'],
    features: ['分级听力', '语速训练', '理解测试'],
    price: 'premium'
  },
  {
    id: 4,
    title: '日语阅读理解',
    description: '提高日语文章阅读能力，掌握阅读技巧',
    lessons: 28,
    duration: '2个月',
    difficulty: '中级',
    students: 700,
    rating: 4.5,
    image: '/vite.svg',
    tags: ['阅读理解', '文章分析', '词汇扩展'],
    features: ['文章精读', '阅读技巧', '词汇积累'],
    price: 'free'
  },
  {
    id: 5,
    title: 'JLPT N4备考',
    description: 'JLPT N4考试专项训练，全面提升应试能力',
    lessons: 45,
    duration: '3个月',
    difficulty: '中级',
    students: 1500,
    rating: 4.9,
    image: '/vite.svg',
    tags: ['JLPT', 'N4', '考试技巧'],
    features: ['真题练习', '模拟考试', '弱项分析'],
    price: 'premium'
  },
  {
    id: 6,
    title: '日本文化与社会',
    description: '了解日本文化背景，提升语言理解深度',
    lessons: 20,
    duration: '1个月',
    difficulty: '中级',
    students: 600,
    rating: 4.7,
    image: '/vite.svg',
    tags: ['日本文化', '社会背景', '文化理解'],
    features: ['文化讲解', '视频资料', '讨论交流'],
    price: 'free'
  }
])

function getDifficultyColor(difficulty: string) {
  return 'warning'
}

function startCourse(courseId: number) {
  window.$message.success('开始学习课程！')
}
</script>

<template>
  <div class="intermediate-courses-page">
    <!-- Header -->
    <n-card class="header-section mb-6 rounded-16px" content-style="padding: 40px;">
      <div class="text-center">
        <n-h1 class="mb-4">
          <n-gradient-text type="warning">
            中级课程
          </n-gradient-text>
        </n-h1>
        <n-text class="text-16px text-gray-600">
          进阶日语学习，提升语言运用能力
        </n-text>
      </div>
    </n-card>

    <!-- Prerequisites -->
    <n-card class="prerequisites-section mb-6 rounded-16px" content-style="padding: 24px;">
      <div class="flex items-start gap-3">
        <Icon icon="tabler:info-circle" class="text-24px text-warning mt-1" />
        <div>
          <n-text strong class="text-16px block mb-2">学习前提</n-text>
          <n-text depth="3">
            建议已完成初级课程学习，掌握基础语法和1000个常用词汇，具备简单的日语交流能力。
          </n-text>
        </div>
      </div>
    </n-card>

    <!-- Course Grid -->
    <n-grid :cols="2" :x-gap="24" :y-gap="24" responsive="screen" item-responsive>
      <n-grid-item v-for="course in intermediateCourses" :key="course.id" span="24 l:12">
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
                type="warning"
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
            
            <n-button type="warning" block @click="startCourse(course.id)">
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
        <n-gradient-text type="warning">
          中级学习路径
        </n-gradient-text>
      </n-h2>
      
      <div class="path-description text-center mb-6">
        <n-text depth="3">
          中级阶段重点提升语言运用能力，建议按以下顺序学习：
        </n-text>
      </div>
      
      <div class="path-steps">
        <div class="step-item flex items-center gap-4 mb-4">
          <n-tag type="warning" size="large" round>1</n-tag>
          <div>
            <n-text strong>中级语法精讲</n-text>
            <n-text depth="3" class="block">掌握复杂语法结构</n-text>
          </div>
        </div>
        <div class="step-connector"></div>
        
        <div class="step-item flex items-center gap-4 mb-4">
          <n-tag type="warning" size="large" round>2</n-tag>
          <div>
            <n-text strong>日语听力强化</n-text>
            <n-text depth="3" class="block">提升听力理解能力</n-text>
          </div>
        </div>
        <div class="step-connector"></div>
        
        <div class="step-item flex items-center gap-4 mb-4">
          <n-tag type="warning" size="large" round>3</n-tag>
          <div>
            <n-text strong>日语阅读理解</n-text>
            <n-text depth="3" class="block">增强阅读技能</n-text>
          </div>
        </div>
        <div class="step-connector"></div>
        
        <div class="step-item flex items-center gap-4 mb-4">
          <n-tag type="warning" size="large" round>4</n-tag>
          <div>
            <n-text strong>商务日语基础</n-text>
            <n-text depth="3" class="block">学习职场应用</n-text>
          </div>
        </div>
        <div class="step-connector"></div>
        
        <div class="step-item flex items-center gap-4">
          <n-tag type="warning" size="large" round>5</n-tag>
          <div>
            <n-text strong>JLPT N4备考</n-text>
            <n-text depth="3" class="block">准备能力考试</n-text>
          </div>
        </div>
      </div>
    </n-card>
  </div>
</template>

<style scoped>
.intermediate-courses-page {
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

.prerequisites-section {
  border-left: 4px solid var(--warning-color);
}

.path-steps {
  max-width: 600px;
  margin: 0 auto;
}

.step-connector {
  width: 2px;
  height: 30px;
  background: var(--warning-color);
  margin: 0 auto 0 20px;
}

@media (max-width: 768px) {
  .header-section :deep(.n-card__content),
  .prerequisites-section :deep(.n-card__content),
  .learning-path :deep(.n-card__content) {
    padding: 20px;
  }
}
</style>
