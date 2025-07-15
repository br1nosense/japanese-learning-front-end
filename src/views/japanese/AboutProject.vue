<script lang="ts" setup>
import { Icon } from '@iconify/vue'

const projectStats = ref([
  {
    title: '注册用户',
    value: '50,000+',
    icon: 'tabler:users',
    color: 'primary'
  },
  {
    title: '课程数量',
    value: '200+',
    icon: 'tabler:book-2',
    color: 'success'
  },
  {
    title: '学习时长',
    value: '1,000,000+',
    subtitle: '分钟',
    icon: 'tabler:clock',
    color: 'warning'
  },
  {
    title: '用户满意度',
    value: '98%',
    icon: 'tabler:heart',
    color: 'error'
  }
])

const features = ref([
  {
    title: '科学的学习方法',
    description: '基于语言学习理论，采用i+1、连词成句等科学方法',
    icon: 'tabler:brain'
  },
  {
    title: '游戏化学习体验',
    description: '通过游戏化的方式让学习变得有趣，提高学习动力',
    icon: 'tabler:device-gamepad'
  },
  {
    title: '个性化学习计划',
    description: '根据用户水平和目标制定专属的学习计划',
    icon: 'tabler:user-cog'
  },
  {
    title: '全面的课程体系',
    description: '从零基础到高级，涵盖听说读写各个方面',
    icon: 'tabler:school'
  },
  {
    title: '智能进度跟踪',
    description: '详细记录学习进度，提供数据分析和建议',
    icon: 'tabler:chart-line'
  },
  {
    title: '多平台支持',
    description: '支持PC、手机、平板等多种设备，随时随地学习',
    icon: 'tabler:devices'
  }
])

const techStack = ref([
  {
    name: 'Vue 3',
    description: '现代化的前端框架',
    icon: 'tabler:brand-vue',
    color: '#4FC08D'
  },
  {
    name: 'TypeScript',
    description: '类型安全的JavaScript',
    icon: 'tabler:brand-typescript',
    color: '#3178C6'
  },
  {
    name: 'Naive UI',
    description: '优雅的组件库',
    icon: 'tabler:components',
    color: '#18A058'
  },
  {
    name: 'Vite',
    description: '快速的构建工具',
    icon: 'tabler:bolt',
    color: '#646CFF'
  },
  {
    name: 'UnoCSS',
    description: '原子化CSS引擎',
    icon: 'tabler:palette',
    color: '#333333'
  },
  {
    name: 'Pinia',
    description: '状态管理库',
    icon: 'tabler:database',
    color: '#FFD859'
  }
])

const timeline = ref([
  {
    date: '2024年1月',
    title: '项目启动',
    description: '确定项目目标和技术方案'
  },
  {
    date: '2024年2月',
    title: '核心功能开发',
    description: '完成基础学习功能和用户系统'
  },
  {
    date: '2024年3月',
    title: '内容制作',
    description: '制作初级和中级课程内容'
  },
  {
    date: '2024年4月',
    title: '测试优化',
    description: '进行全面测试和性能优化'
  },
  {
    date: '2024年5月',
    title: '正式发布',
    description: '网站正式上线，开始服务用户'
  }
])
</script>

<template>
  <div class="about-project-page">
    <!-- Header -->
    <n-card class="header-section mb-6 rounded-16px" content-style="padding: 40px;">
      <div class="text-center">
        <n-h1 class="mb-4">
          <n-gradient-text type="primary">
            关于项目
          </n-gradient-text>
        </n-h1>
        <n-text class="text-16px text-gray-600">
          了解我们的日语学习平台
        </n-text>
      </div>
    </n-card>

    <!-- Project Introduction -->
    <n-card class="intro-section mb-6 rounded-16px" content-style="padding: 40px;">
      <n-h2 class="mb-6">
        <n-gradient-text type="success">
          项目简介
        </n-gradient-text>
      </n-h2>
      
      <div class="intro-content">
        <n-text class="text-16px leading-relaxed">
          日语学习助手是一个专注于日语教育的在线学习平台，致力于为中文用户提供最优质的日语学习体验。
          我们采用科学的语言学习理论，结合现代化的技术手段，打造了一个集趣味性、实用性、系统性于一体的学习环境。
        </n-text>
        
        <n-text class="text-16px leading-relaxed block mt-4">
          平台基于Vue3技术栈开发，采用响应式设计，支持多种设备访问。我们相信，通过科学的方法和持续的努力，
          每个人都能够掌握日语，实现自己的学习目标。
        </n-text>
      </div>
    </n-card>

    <!-- Project Stats -->
    <n-card class="stats-section mb-6 rounded-16px" content-style="padding: 40px;">
      <n-h2 class="text-center mb-8">
        <n-gradient-text type="info">
          项目数据
        </n-gradient-text>
      </n-h2>
      
      <n-grid :cols="4" :x-gap="24" :y-gap="24" responsive="screen" item-responsive>
        <n-grid-item v-for="stat in projectStats" :key="stat.title" span="24 s:12 m:6">
          <div class="stat-card text-center p-6 rounded-lg border border-gray-200 hover:border-primary transition-colors">
            <Icon :icon="stat.icon" :class="`text-48px text-${stat.color} mb-4`" />
            <n-h2 class="mb-1">{{ stat.value }}</n-h2>
            <n-text v-if="stat.subtitle" depth="3" class="text-sm block">{{ stat.subtitle }}</n-text>
            <n-text depth="2">{{ stat.title }}</n-text>
          </div>
        </n-grid-item>
      </n-grid>
    </n-card>

    <!-- Features -->
    <n-card class="features-section mb-6 rounded-16px" content-style="padding: 40px;">
      <n-h2 class="text-center mb-8">
        <n-gradient-text type="warning">
          核心特色
        </n-gradient-text>
      </n-h2>
      
      <n-grid :cols="3" :x-gap="24" :y-gap="24" responsive="screen" item-responsive>
        <n-grid-item v-for="feature in features" :key="feature.title" span="24 m:12 l:8">
          <div class="feature-card p-6 rounded-lg border border-gray-200 hover:border-primary transition-all h-full">
            <Icon :icon="feature.icon" class="text-32px text-primary mb-4" />
            <n-h3 class="mb-3">{{ feature.title }}</n-h3>
            <n-text depth="3">{{ feature.description }}</n-text>
          </div>
        </n-grid-item>
      </n-grid>
    </n-card>

    <!-- Tech Stack -->
    <n-card class="tech-section mb-6 rounded-16px" content-style="padding: 40px;">
      <n-h2 class="text-center mb-8">
        <n-gradient-text type="error">
          技术栈
        </n-gradient-text>
      </n-h2>
      
      <n-grid :cols="3" :x-gap="20" :y-gap="20" responsive="screen" item-responsive>
        <n-grid-item v-for="tech in techStack" :key="tech.name" span="24 s:12 m:8">
          <div class="tech-card flex items-center gap-4 p-4 rounded-lg border border-gray-200 hover:border-primary transition-colors">
            <Icon :icon="tech.icon" class="text-32px" :style="{ color: tech.color }" />
            <div>
              <n-text strong class="block">{{ tech.name }}</n-text>
              <n-text depth="3" class="text-sm">{{ tech.description }}</n-text>
            </div>
          </div>
        </n-grid-item>
      </n-grid>
    </n-card>

    <!-- Timeline -->
    <n-card class="timeline-section mb-6 rounded-16px" content-style="padding: 40px;">
      <n-h2 class="text-center mb-8">
        <n-gradient-text type="primary">
          发展历程
        </n-gradient-text>
      </n-h2>
      
      <div class="timeline max-w-600px mx-auto">
        <div v-for="(item, index) in timeline" :key="index" class="timeline-item mb-6">
          <div class="flex items-start gap-4">
            <div class="timeline-dot">
              <n-tag type="primary" size="small" round>{{ index + 1 }}</n-tag>
            </div>
            <div class="flex-1">
              <div class="flex items-center gap-2 mb-2">
                <n-text strong>{{ item.title }}</n-text>
                <n-tag size="small" type="info">{{ item.date }}</n-tag>
              </div>
              <n-text depth="3">{{ item.description }}</n-text>
            </div>
          </div>
          <n-divider v-if="index < timeline.length - 1" class="my-4" />
        </div>
      </div>
    </n-card>

    <!-- Contact CTA -->
    <n-card class="cta-section rounded-16px" content-style="padding: 40px;">
      <div class="text-center">
        <n-h2 class="mb-4">
          <n-gradient-text type="success">
            加入我们的学习社区
          </n-gradient-text>
        </n-h2>
        <n-text class="text-16px mb-6 block">
          开始您的日语学习之旅，与千万学习者一起进步
        </n-text>
        <div class="flex gap-4 justify-center">
          <n-button type="primary" size="large" @click="$router.push('/get-started')">
            <template #icon>
              <Icon icon="tabler:rocket" />
            </template>
            开始学习
          </n-button>
          <n-button size="large" @click="$router.push('/help/contact')">
            <template #icon>
              <Icon icon="tabler:mail" />
            </template>
            联系我们
          </n-button>
        </div>
      </div>
    </n-card>
  </div>
</template>

<style scoped>
.about-project-page {
  max-width: 1200px;
  margin: 0 auto;
}

.intro-content {
  line-height: 1.8;
}

.stat-card {
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.feature-card {
  transition: all 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.tech-card {
  transition: all 0.3s ease;
}

.tech-card:hover {
  transform: translateX(4px);
}

.timeline-item {
  position: relative;
}

.cta-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.cta-section :deep(.n-card__content) {
  background: transparent;
}

@media (max-width: 768px) {
  .header-section :deep(.n-card__content),
  .intro-section :deep(.n-card__content),
  .stats-section :deep(.n-card__content),
  .features-section :deep(.n-card__content),
  .tech-section :deep(.n-card__content),
  .timeline-section :deep(.n-card__content),
  .cta-section :deep(.n-card__content) {
    padding: 20px;
  }
  
  .cta-section .flex {
    flex-direction: column;
    align-items: center;
  }
}
</style>
