<script lang="ts" setup>
import { Icon } from '@iconify/vue'
import SakuraAnimation from '@/components/common/SakuraAnimation.vue'
const router = useRouter()
const features = ref([
  {
    icon: 'tabler:cards',
    title: '单词学习',
    description: '通过卡片翻转的方式学习日语单词，支持收藏和复习功能',
    route: '/learning/words'
  },
  {
    icon: 'tabler:grammar',
    title: '语法练习',
    description: '通过选择题练习日语语法，掌握助词和语法结构',
    route: '/learning/grammar'
  },
  {
    icon: 'tabler:ear',
    title: '听力训练',
    description: '通过听力模式提高日语听力理解能力，从基础发音到日常对话'
  },
  {
    icon: 'tabler:brain',
    title: '记忆强化',
    description: '科学的重复学习机制，帮助形成长期记忆'
  },
  {
    icon: 'tabler:device-gamepad',
    title: '游戏化学习',
    description: '趣味学习模式，让日语学习不再枯燥'
  },
  {
    icon: 'tabler:chart-line',
    title: '进度跟踪',
    description: '详细的学习统计和进度分析，掌握学习节奏',
    route: '/progress'
  }
])

function navigateToGetStarted() {
  router.push('/beginnerCourses')
}

function navigateToCourses() {
  router.push('/courses')
}

// 根据设备性能调整花瓣数量
const petalCount = computed(() => {
  // 检测是否为移动设备
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)

  // 检测屏幕尺寸
  const isSmallScreen = window.innerWidth < 768

  if (isMobile || isSmallScreen) {
    return 8 // 移动端使用较少的花瓣
  }

  return 15 // 桌面端使用更多花瓣
})
</script>

<template>
  <div class="japanese-home relative">
    <!-- 樱花动画背景 -->
    <SakuraAnimation :petal-count="petalCount" />

    <!-- Hero Section -->
    <n-card class="hero-section mb-6 rounded-16px" content-style="padding: 60px 40px;">
      <div class="flex flex-col items-center text-center">
        <div class="flex items-center mb-8">
          <Icon icon="noto:japanese-symbol-for-beginner" class="text-80px mr-4" />
          <div>
            <n-gradient-text type="primary" :size="48" class="font-bold">
              日语学习助手
            </n-gradient-text>
            <div class="text-18px text-gray-600 mt-2">
              让日语学习变得简单有趣
            </div>
          </div>
        </div>

        <n-h2 class="mb-6 max-w-800px">
          <n-gradient-text type="success">
            通过科学的学习方法和游戏化体验，帮助您轻松掌握日语
          </n-gradient-text>
        </n-h2>

        <div class="flex gap-4 mb-8">
          <n-button size="large" type="primary" @click="navigateToGetStarted">
            <template #icon>
              <Icon icon="tabler:rocket" />
            </template>
            开始学习
          </n-button>
          <n-button size="large" @click="navigateToCourses">
            <template #icon>
              <Icon icon="tabler:book-open" />
            </template>
            浏览课程
          </n-button>
        </div>

        <div class="hero-image">
          <img src="/vite.svg" alt="日语学习" class="w-200px h-200px opacity-20" />
        </div>
      </div>
    </n-card>

    <!-- Features Section -->
    <n-card class="features-section rounded-16px" content-style="padding: 40px;">
      <n-h2 class="text-center mb-8">
        <n-gradient-text type="info">
          为什么选择我们的日语学习平台？
        </n-gradient-text>
      </n-h2>

      <n-grid :cols="3" :x-gap="24" :y-gap="24" responsive="screen" item-responsive>
        <n-grid-item v-for="feature in features" :key="feature.title" span="24 m:12 l:8">
          <n-card
            hoverable
            class="feature-card h-full"
            :class="{ 'clickable': feature.route }"
            content-style="padding: 24px;"
            @click="feature.route && $router.push(feature.route)"
          >
            <div class="text-center">
              <Icon :icon="feature.icon" class="text-48px text-primary mb-4" />
              <n-h3 class="mb-3">{{ feature.title }}</n-h3>
              <n-text depth="3">{{ feature.description }}</n-text>
              <div v-if="feature.route" class="mt-4">
                <Icon icon="tabler:arrow-right" class="text-primary" />
              </div>
            </div>
          </n-card>
        </n-grid-item>
      </n-grid>
    </n-card>

    <!-- CTA Section -->
    <n-card class="cta-section mt-6 rounded-16px" content-style="padding: 40px;">
      <div class="text-center">
        <n-h2 class="mb-4">
          <n-gradient-text type="warning">
            准备开始您的日语学习之旅了吗？
          </n-gradient-text>
        </n-h2>
        <n-text class="text-16px mb-6 block">
          加入我们，体验最有效的日语学习方法
        </n-text>
        <n-button size="large" type="primary" @click="navigateToGetStarted">
          <template #icon>
            <Icon icon="tabler:arrow-right" />
          </template>
          立即开始
        </n-button>
      </div>
    </n-card>
  </div>
</template>

<style scoped>
.japanese-home {
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

.hero-section {
  background: var(--sakura-gradient);
  color: white;
  position: relative;
  z-index: 2;
  backdrop-filter: blur(1px);
}

.hero-section :deep(.n-card__content) {
  background: transparent;
}

.feature-card {
  transition: transform 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-4px);
}

.feature-card.clickable {
  cursor: pointer;
}

.feature-card.clickable:hover {
  transform: translateY(-6px);
  box-shadow: var(--shadow-3);
}

.cta-section {
  background: var(--sakura-gradient);
  color: white;
  position: relative;
  z-index: 2;
}

.cta-section :deep(.n-card__content) {
  background: transparent;
}

@media (max-width: 768px) {
  .hero-section :deep(.n-card__content) {
    padding: 40px 20px;
  }

  .features-section :deep(.n-card__content) {
    padding: 20px;
  }

  .cta-section :deep(.n-card__content) {
    padding: 30px 20px;
  }
}
</style>
