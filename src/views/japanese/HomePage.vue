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

      <!-- 使用 CSS Grid 布局替代 n-grid -->
      <div class="features-grid">
        <div
          v-for="feature in features"
          :key="feature.title"
          class="feature-card-wrapper"
        >
          <n-card
            hoverable
            class="feature-card"
            :class="{ 'clickable': feature.route }"
            content-style="padding: 0;"
            @click="feature.route && $router.push(feature.route)"
          >
            <div class="feature-content">
              <!-- 图标区域 -->
              <div class="feature-icon-wrapper">
                <Icon :icon="feature.icon" class="feature-icon" />
              </div>

              <!-- 内容区域 -->
              <div class="feature-text">
                <n-h3 class="feature-title">{{ feature.title }}</n-h3>
                <n-text class="feature-description" depth="3">
                  {{ feature.description }}
                </n-text>
              </div>

              <!-- 箭头指示器（仅对可点击的卡片显示） -->
              <div v-if="feature.route" class="feature-arrow">
                <Icon icon="tabler:arrow-right" class="arrow-icon" />
              </div>
            </div>
          </n-card>
        </div>
      </div>
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

/* Features Grid 布局 */
.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 24px;
  margin: 0;
}

/* 确保在大屏幕上最多显示3列 */
@media (min-width: 1200px) {
  .features-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* 中等屏幕显示2列 */
@media (min-width: 768px) and (max-width: 1199px) {
  .features-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* 小屏幕显示1列 */
@media (max-width: 767px) {
  .features-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
}

/* 卡片包装器 */
.feature-card-wrapper {
  height: 100%;
}

/* 功能卡片样式 */
.feature-card {
  height: 100%;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 16px;
  overflow: hidden;
  background: var(--card-color);
  border: 1px solid var(--border-color);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  position: relative;
}

.feature-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: 0;
}

.feature-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12);
  border-color: rgba(102, 126, 234, 0.3);
}

.feature-card:hover::before {
  opacity: 1;
}

.feature-card.clickable {
  cursor: pointer;
}

.feature-card.clickable:hover {
  transform: translateY(-12px);
  box-shadow: 0 16px 40px rgba(102, 126, 234, 0.15);
}

.feature-card.clickable:active {
  transform: translateY(-8px);
  transition: all 0.1s ease;
}

/* 卡片内容布局 */
.feature-content {
  padding: 32px 24px;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  position: relative;
  z-index: 1;
}

/* 图标样式 */
.feature-icon-wrapper {
  margin-bottom: 20px;
  padding: 16px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  box-shadow: 0 4px 16px rgba(102, 126, 234, 0.3);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.feature-icon-wrapper::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, transparent 50%);
  border-radius: 50%;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.feature-card:hover .feature-icon-wrapper {
  transform: scale(1.1) rotate(5deg);
  box-shadow: 0 8px 32px rgba(102, 126, 234, 0.4);
}

.feature-card:hover .feature-icon-wrapper::before {
  opacity: 1;
}

.feature-icon {
  font-size: 32px;
  color: white;
  display: block;
  position: relative;
  z-index: 1;
}

/* 文本内容 */
.feature-text {
  flex: 1;
  margin-bottom: 16px;
}

.feature-title {
  margin-bottom: 12px;
  font-weight: 600;
  color: var(--text-color-1);
  font-size: 18px;
}

.feature-description {
  line-height: 1.6;
  color: var(--text-color-2);
  font-size: 14px;
}

/* 箭头指示器 */
.feature-arrow {
  margin-top: auto;
  opacity: 0;
  transform: translateX(-10px);
  transition: all 0.3s ease;
}

.feature-card.clickable:hover .feature-arrow {
  opacity: 1;
  transform: translateX(0);
}

.arrow-icon {
  font-size: 20px;
  color: var(--primary-color);
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

/* 移动端响应式优化 */
@media (max-width: 768px) {
  .hero-section :deep(.n-card__content) {
    padding: 40px 20px;
  }

  .features-section :deep(.n-card__content) {
    padding: 24px 16px;
  }

  .cta-section :deep(.n-card__content) {
    padding: 30px 20px;
  }

  /* 移动端卡片优化 */
  .feature-content {
    padding: 24px 20px;
  }

  .feature-icon-wrapper {
    padding: 12px;
    margin-bottom: 16px;
  }

  .feature-icon {
    font-size: 28px;
  }

  .feature-title {
    font-size: 16px;
    margin-bottom: 8px;
  }

  .feature-description {
    font-size: 13px;
  }
}

/* 超小屏幕优化 */
@media (max-width: 480px) {
  .features-section :deep(.n-card__content) {
    padding: 20px 12px;
  }

  .features-grid {
    gap: 12px;
  }

  .feature-content {
    padding: 20px 16px;
  }

  .feature-icon-wrapper {
    padding: 10px;
    margin-bottom: 12px;
  }

  .feature-icon {
    font-size: 24px;
  }

  .feature-title {
    font-size: 15px;
  }

  .feature-description {
    font-size: 12px;
  }
}
</style>
