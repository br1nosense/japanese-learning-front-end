<script lang="ts" setup>
import { Icon } from '@iconify/vue'

const advancedCourses = ref([
  {
    id: 1,
    title: '高级语法与表达',
    description: '掌握日语高级语法，学习地道的日语表达方式',
    lessons: 40,
    duration: '3-4个月',
    difficulty: '高级',
    students: 500,
    rating: 4.9,
    image: '/vite.svg',
    tags: ['高级语法', '地道表达', '文学语言'],
    features: ['语法深度解析', '文学作品赏析', '表达技巧'],
    price: 'premium'
  },
  {
    id: 2,
    title: '商务日语高级',
    description: '掌握高级商务日语，适应各种商务场合',
    lessons: 30,
    duration: '2-3个月',
    difficulty: '高级',
    students: 350,
    rating: 4.8,
    image: '/vite.svg',
    tags: ['商务谈判', '演讲技巧', '报告写作'],
    features: ['商务谈判', '演讲训练', '报告撰写'],
    price: 'premium'
  },
  {
    id: 3,
    title: '日语翻译技巧',
    description: '学习中日互译技巧，提升翻译能力',
    lessons: 25,
    duration: '2个月',
    difficulty: '高级',
    students: 280,
    rating: 4.7,
    image: '/vite.svg',
    tags: ['翻译技巧', '文化转换', '专业术语'],
    features: ['翻译理论', '实践练习', '文化对比'],
    price: 'premium'
  },
  {
    id: 4,
    title: '日本文学赏析',
    description: '通过文学作品深入理解日语和日本文化',
    lessons: 20,
    duration: '1-2个月',
    difficulty: '高级',
    students: 200,
    rating: 4.6,
    image: '/vite.svg',
    tags: ['文学作品', '文化理解', '语言艺术'],
    features: ['名著解读', '文化背景', '语言分析'],
    price: 'premium'
  },
  {
    id: 5,
    title: 'JLPT N2/N1备考',
    description: 'JLPT高级考试专项训练，冲刺最高级别',
    lessons: 60,
    duration: '4-6个月',
    difficulty: '高级',
    students: 800,
    rating: 4.9,
    image: '/vite.svg',
    tags: ['JLPT', 'N2', 'N1'],
    features: ['高难度题型', '应试策略', '冲刺训练'],
    price: 'premium'
  },
  {
    id: 6,
    title: '日语口语精进',
    description: '提升口语表达能力，达到母语水平',
    lessons: 35,
    duration: '3个月',
    difficulty: '高级',
    students: 400,
    rating: 4.8,
    image: '/vite.svg',
    tags: ['口语表达', '发音矫正', '流利度训练'],
    features: ['发音指导', '流利度训练', '表达技巧'],
    price: 'premium'
  }
])

function getDifficultyColor(difficulty: string) {
  return 'error'
}

function startCourse(courseId: number) {
  window.$message.success('开始学习课程！')
}
</script>

<template>
  <div class="advanced-courses-page">
    <!-- Header -->
    <n-card class="header-section mb-6 rounded-16px" content-style="padding: 40px;">
      <div class="text-center">
        <n-h1 class="mb-4">
          <n-gradient-text type="error">
            高级课程
          </n-gradient-text>
        </n-h1>
        <n-text class="text-16px text-gray-600">
          日语精通之路，达到专业水平
        </n-text>
      </div>
    </n-card>

    <!-- Prerequisites -->
    <n-card class="prerequisites-section mb-6 rounded-16px" content-style="padding: 24px;">
      <div class="flex items-start gap-3">
        <Icon icon="tabler:alert-triangle" class="text-24px text-error mt-1" />
        <div>
          <n-text strong class="text-16px block mb-2">学习要求</n-text>
          <n-text depth="3">
            建议已通过JLPT N3考试或具备相当水平，能够熟练运用中级语法，词汇量达到3000以上。
            高级课程难度较大，需要较强的自学能力和持续的学习动力。
          </n-text>
        </div>
      </div>
    </n-card>

    <!-- Course Grid -->
    <n-grid :cols="2" :x-gap="24" :y-gap="24" responsive="screen" item-responsive>
      <n-grid-item v-for="course in advancedCourses" :key="course.id" span="24 l:12">
        <n-card hoverable class="course-card h-full rounded-16px" content-style="padding: 0;">
          <div class="course-image">
            <img :src="course.image" :alt="course.title" class="w-full h-160px object-cover" />
            <div class="course-overlay">
              <n-tag :type="getDifficultyColor(course.difficulty)" size="small">
                {{ course.difficulty }}
              </n-tag>
              <n-tag type="warning" size="small" class="ml-2">
                付费
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
                type="error"
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
            
            <n-button type="error" block @click="startCourse(course.id)">
              <template #icon>
                <Icon icon="tabler:play" />
              </template>
              开始学习
            </n-button>
          </div>
        </n-card>
      </n-grid-item>
    </n-grid>

    <!-- Learning Goals -->
    <n-card class="goals-section mt-6 rounded-16px" content-style="padding: 40px;">
      <n-h2 class="text-center mb-6">
        <n-gradient-text type="error">
          高级学习目标
        </n-gradient-text>
      </n-h2>
      
      <n-grid :cols="3" :x-gap="20" :y-gap="20" responsive="screen" item-responsive>
        <n-grid-item span="24 m:8">
          <div class="goal-item text-center p-6 rounded-lg border border-red-200 hover:border-red-400 transition-colors">
            <Icon icon="tabler:certificate" class="text-48px text-red-500 mb-4" />
            <n-text strong class="block mb-2">通过JLPT N1</n-text>
            <n-text depth="3" class="text-sm">
              达到日语能力考试最高级别
            </n-text>
          </div>
        </n-grid-item>
        
        <n-grid-item span="24 m:8">
          <div class="goal-item text-center p-6 rounded-lg border border-red-200 hover:border-red-400 transition-colors">
            <Icon icon="tabler:briefcase" class="text-48px text-red-500 mb-4" />
            <n-text strong class="block mb-2">职场应用</n-text>
            <n-text depth="3" class="text-sm">
              在日企或日语环境中工作
            </n-text>
          </div>
        </n-grid-item>
        
        <n-grid-item span="24 m:8">
          <div class="goal-item text-center p-6 rounded-lg border border-red-200 hover:border-red-400 transition-colors">
            <Icon icon="tabler:language" class="text-48px text-red-500 mb-4" />
            <n-text strong class="block mb-2">母语水平</n-text>
            <n-text depth="3" class="text-sm">
              达到接近母语的表达能力
            </n-text>
          </div>
        </n-grid-item>
      </n-grid>
    </n-card>

    <!-- Study Tips -->
    <n-card class="tips-section mt-6 rounded-16px" content-style="padding: 40px;">
      <n-h2 class="text-center mb-6">
        <n-gradient-text type="info">
          高级学习建议
        </n-gradient-text>
      </n-h2>
      
      <div class="tips-grid">
        <div class="tip-item flex items-start gap-3 mb-4">
          <Icon icon="tabler:bulb" class="text-24px text-yellow-500 mt-1" />
          <div>
            <n-text strong>多接触原版材料</n-text>
            <n-text depth="3" class="block">阅读日语新闻、小说，观看日语影视作品</n-text>
          </div>
        </div>
        
        <div class="tip-item flex items-start gap-3 mb-4">
          <Icon icon="tabler:users" class="text-24px text-blue-500 mt-1" />
          <div>
            <n-text strong>参与语言交换</n-text>
            <n-text depth="3" class="block">与日语母语者交流，提升实际应用能力</n-text>
          </div>
        </div>
        
        <div class="tip-item flex items-start gap-3 mb-4">
          <Icon icon="tabler:target" class="text-24px text-green-500 mt-1" />
          <div>
            <n-text strong>设定具体目标</n-text>
            <n-text depth="3" class="block">制定明确的学习计划和阶段性目标</n-text>
          </div>
        </div>
        
        <div class="tip-item flex items-start gap-3">
          <Icon icon="tabler:clock" class="text-24px text-purple-500 mt-1" />
          <div>
            <n-text strong>保持学习习惯</n-text>
            <n-text depth="3" class="block">每天坚持学习，保持语言敏感度</n-text>
          </div>
        </div>
      </div>
    </n-card>
  </div>
</template>

<style scoped>
.advanced-courses-page {
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
  border-left: 4px solid var(--error-color);
}

.goal-item {
  transition: all 0.3s ease;
}

.goal-item:hover {
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .header-section :deep(.n-card__content),
  .prerequisites-section :deep(.n-card__content),
  .goals-section :deep(.n-card__content),
  .tips-section :deep(.n-card__content) {
    padding: 20px;
  }
}
</style>
