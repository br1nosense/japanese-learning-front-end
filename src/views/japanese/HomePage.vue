<script lang="ts" setup>
import { Icon } from '@iconify/vue'
import { useI18n } from 'vue-i18n'
import SakuraAnimation from '@/components/common/SakuraAnimation.vue'

const router = useRouter()
const { t } = useI18n()
// 功能特性数据（使用计算属性支持国际化，日式主题图标）
const features = computed(() => [
  {
    icon: 'noto:cherry-blossom', // 樱花 - 单词学习
    title: t('homepage.features.wordLearning.title'),
    description: t('homepage.features.wordLearning.description'),
    route: '/learning/words',
    color: 'var(--primary-color)'
  },
  {
    icon: 'noto:japanese-symbol-for-beginner', // 日语初学者标志 - 语法练习
    title: t('homepage.features.grammarPractice.title'),
    description: t('homepage.features.grammarPractice.description'),
    route: '/learning/grammar',
    color: 'var(--secondary-color)'
  },
  {
    icon: 'noto:ear', // 耳朵 - 听力训练
    title: t('homepage.features.listeningTraining.title'),
    description: t('homepage.features.listeningTraining.description'),
    color: 'var(--accent-color)'
  },
  {
    icon: 'noto:mount-fuji', // 富士山 - 记忆强化
    title: t('homepage.features.memoryEnhancement.title'),
    description: t('homepage.features.memoryEnhancement.description'),
    color: 'var(--soft-blue)'
  },
  {
    icon: 'noto:video-game', // 游戏 - 游戏化学习
    title: t('homepage.features.gamifiedLearning.title'),
    description: t('homepage.features.gamifiedLearning.description'),
    color: 'var(--warm-gold)'
  },
  {
    icon: 'noto:chart-increasing', // 上升图表 - 进度跟踪
    title: t('homepage.features.progressTracking.title'),
    description: t('homepage.features.progressTracking.description'),
    route: '/progress',
    color: 'var(--matcha-green)'
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
          <div class="hero-icon-container">
            <Icon icon="noto:cherry-blossom" class="hero-icon primary" />
            <Icon icon="noto:japanese-symbol-for-beginner" class="hero-icon secondary" />
            <Icon icon="twemoji:flag-japan" class="hero-icon accent" />
          </div>
          <div>
            <n-gradient-text type="primary" :size="48" class="font-bold hero-title">
              {{ t('homepage.title') }}
            </n-gradient-text>
            <div class="text-18px hero-subtitle mt-2">
              {{ t('homepage.subtitle') }}
            </div>
          </div>
        </div>

        <n-h2 class="mb-6 max-w-800px">
          <n-gradient-text type="success">
            {{ t('homepage.description') }}
          </n-gradient-text>
        </n-h2>

        <div class="flex gap-4 mb-8">
          <n-button size="large" type="primary" class="hero-button primary-btn" @click="navigateToGetStarted">
            <template #icon>
              <Icon icon="noto:cherry-blossom" />
            </template>
            {{ t('homepage.startLearning') }}
          </n-button>
          <n-button size="large" class="hero-button secondary-btn" @click="navigateToCourses">
            <template #icon>
              <Icon icon="noto:books" />
            </template>
            {{ t('homepage.browseCourses') }}
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
          {{ t('homepage.featuresTitle') }}
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
              <div class="feature-icon-wrapper" :style="{ '--feature-color': feature.color }">
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
                <Icon icon="noto:right-arrow" class="arrow-icon" />
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
            {{ t('homepage.ctaTitle') }}
          </n-gradient-text>
        </n-h2>
        <n-text class="text-16px mb-6 block">
          {{ t('homepage.ctaDescription') }}
        </n-text>
        <n-button size="large" type="primary" class="cta-button" @click="navigateToGetStarted">
          <template #icon>
            <Icon icon="noto:cherry-blossom" />
          </template>
          {{ t('homepage.startNow') }}
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

/* 英雄区域图标样式 */
.hero-icon-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 24px;
  position: relative;
}

.hero-icon {
  font-size: 48px;
  margin: 4px 0;
  transition: all 0.3s ease;
  filter: drop-shadow(0 4px 8px rgba(255, 183, 197, 0.3));
}

.hero-icon.primary {
  font-size: 56px;
  animation: float 3s ease-in-out infinite;
}

.hero-icon.secondary {
  font-size: 40px;
  animation: float 3s ease-in-out infinite 1s;
}

.hero-icon.accent {
  font-size: 32px;
  animation: float 3s ease-in-out infinite 2s;
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

/* 英雄区域文本样式 */
.hero-title {
  background: var(--sakura-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  color: var(--text-color-2);
  font-weight: 500;
}

/* 英雄区域按钮样式 */
.hero-button {
  min-width: 160px;
  height: 48px;
  border-radius: 24px;
  font-weight: 600;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: var(--shadow-2);
}

.hero-button:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-3);
}

.primary-btn {
  background: var(--sakura-gradient);
  border: none;
  color: white;
}

.secondary-btn {
  background: var(--card-color);
  border: 2px solid var(--primary-color);
  color: var(--primary-color);
}

.secondary-btn:hover {
  background: var(--primary-color);
  color: white;
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
  background: var(--feature-color, var(--primary-color));
  box-shadow: 0 4px 16px rgba(255, 183, 197, 0.3);
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
  box-shadow: 0 8px 32px rgba(255, 183, 197, 0.4);
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

/* CTA按钮样式 */
.cta-button {
  min-width: 180px;
  height: 52px;
  border-radius: 26px;
  font-weight: 600;
  font-size: 16px;
  background: var(--sakura-gradient);
  border: none;
  color: white;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: var(--shadow-2);
}

.cta-button:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-3);
  background: var(--sakura-dark-gradient);
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
