<script lang="ts" setup>
import { Icon } from '@iconify/vue'

const learningSteps = ref([
  {
    step: 1,
    title: '注册账户',
    description: '创建您的学习账户，开始个性化的日语学习之旅',
    icon: 'tabler:user-plus',
    action: '立即注册',
    route: '/get-started/how-to-register'
  },
  {
    step: 2,
    title: '选择课程',
    description: '根据您的日语水平选择合适的课程，从零基础到高级应有尽有',
    icon: 'tabler:book-2',
    action: '浏览课程',
    route: '/courses'
  },
  {
    step: 3,
    title: '开始学习',
    description: '使用我们的互动学习工具，通过游戏化的方式掌握日语',
    icon: 'tabler:play',
    action: '开始练习',
    route: '/courses/beginner'
  },
  {
    step: 4,
    title: '跟踪进度',
    description: '查看您的学习统计和进度，持续改进学习效果',
    icon: 'tabler:chart-line',
    action: '查看进度',
    route: '/progress'
  }
])

const whyChooseUs = ref([
  {
    title: '听力训练',
    description: '该平台提供了听力模式，您可以用它来提高日语听力理解能力',
    icon: 'tabler:ear'
  },
  {
    title: '语法掌握',
    description: '单词 → 短语 → 句子，让您了解每个单词在不同语境中的用法',
    icon: 'tabler:abc'
  },
  {
    title: '假名学习',
    description: '系统学习平假名和片假名，这是日语学习的重要基础',
    icon: 'tabler:language-hiragana'
  },
  {
    title: '渐进式学习',
    description: '采用 i+1 理论，确保学习内容既有挑战性又可理解',
    icon: 'tabler:stairs-up'
  },
  {
    title: '趣味学习',
    description: '游戏化的学习模式，让日语学习变得有趣不枯燥',
    icon: 'tabler:device-gamepad'
  },
  {
    title: '丰富内容',
    description: '提供从基础日语到日常会话等多种课程内容',
    icon: 'tabler:books'
  },
  {
    title: '重复巩固',
    description: '科学的复习机制，将学习内容融入后续课程中加强记忆',
    icon: 'tabler:repeat'
  },
  {
    title: '个性化学习',
    description: '支持自定义学习计划，适应不同学习者的需求',
    icon: 'tabler:user-cog'
  }
])

function navigateTo(route: string) {
  $router.push(route)
}
</script>

<template>
  <div class="get-started-page">
    <!-- Header Section -->
    <n-card class="intro-section mb-6 rounded-16px" content-style="padding: 40px;">
      <div class="text-center mb-8">
        <n-h1 class="mb-4">
          <n-gradient-text type="primary">
            日语学习入门指南
          </n-gradient-text>
        </n-h1>
        <n-text class="text-18px text-gray-600">
          日语学习助手是一款让您轻松掌握日语的学习工具，它使用科学的学习理论和游戏化的形式，
          通过不断的重复练习形成语言记忆，让日语学习从此不再困难。
        </n-text>
      </div>
      
      <div class="preview-image text-center">
        <img src="/vite.svg" alt="学习预览" class="w-400px h-200px opacity-30 mx-auto" />
      </div>
    </n-card>

    <!-- Learning Steps -->
    <n-card class="steps-section mb-6 rounded-16px" content-style="padding: 40px;">
      <n-h2 class="text-center mb-8">
        <n-gradient-text type="success">
          四步开始您的日语学习
        </n-gradient-text>
      </n-h2>
      
      <n-grid :cols="2" :x-gap="24" :y-gap="24" responsive="screen" item-responsive>
        <n-grid-item v-for="step in learningSteps" :key="step.step" span="24 m:12">
          <n-card hoverable class="step-card h-full" content-style="padding: 24px;">
            <div class="flex items-start gap-4">
              <div class="step-number">
                <n-tag type="primary" size="large" round>
                  {{ step.step }}
                </n-tag>
              </div>
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-3">
                  <Icon :icon="step.icon" class="text-24px text-primary" />
                  <n-h3 class="mb-0">{{ step.title }}</n-h3>
                </div>
                <n-text depth="3" class="mb-4 block">{{ step.description }}</n-text>
                <n-button type="primary" size="small" @click="navigateTo(step.route)">
                  {{ step.action }}
                </n-button>
              </div>
            </div>
          </n-card>
        </n-grid-item>
      </n-grid>
    </n-card>

    <!-- Why Choose Us -->
    <n-card class="why-section rounded-16px" content-style="padding: 40px;">
      <n-h2 class="text-center mb-8">
        <n-gradient-text type="info">
          为什么说它是您日语学习的必备工具？
        </n-gradient-text>
      </n-h2>
      
      <n-grid :cols="2" :x-gap="20" :y-gap="20" responsive="screen" item-responsive>
        <n-grid-item v-for="(item, index) in whyChooseUs" :key="index" span="24 m:12">
          <div class="feature-item flex items-start gap-3 p-4">
            <Icon :icon="item.icon" class="text-24px text-primary mt-1 flex-shrink-0" />
            <div>
              <n-text strong class="text-16px">{{ index + 1 }}. {{ item.title }}</n-text>
              <n-text depth="3" class="block mt-1">{{ item.description }}</n-text>
            </div>
          </div>
        </n-grid-item>
      </n-grid>
    </n-card>
  </div>
</template>

<style scoped>
.get-started-page {
  max-width: 1000px;
  margin: 0 auto;
}

.step-card {
  transition: transform 0.3s ease;
  border-left: 4px solid var(--primary-color);
}

.step-card:hover {
  transform: translateY(-2px);
}

.feature-item {
  border-radius: 8px;
  transition: background-color 0.3s ease;
}

.feature-item:hover {
  background-color: var(--hover-color);
}

@media (max-width: 768px) {
  .intro-section :deep(.n-card__content),
  .steps-section :deep(.n-card__content),
  .why-section :deep(.n-card__content) {
    padding: 20px;
  }
  
  .preview-image img {
    width: 300px;
    height: 150px;
  }
}
</style>
