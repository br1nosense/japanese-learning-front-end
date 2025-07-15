<script lang="ts" setup>
import { Icon } from '@iconify/vue'

const registrationSteps = ref([
  {
    step: 1,
    title: '访问注册页面',
    description: '点击网站右上角的"注册"按钮，进入注册页面',
    icon: 'tabler:click'
  },
  {
    step: 2,
    title: '填写基本信息',
    description: '输入您的邮箱地址、用户名和密码',
    icon: 'tabler:form'
  },
  {
    step: 3,
    title: '选择学习目标',
    description: '告诉我们您的日语水平和学习目标',
    icon: 'tabler:target'
  },
  {
    step: 4,
    title: '验证邮箱',
    description: '查看邮箱中的验证邮件，点击链接完成验证',
    icon: 'tabler:mail-check'
  },
  {
    step: 5,
    title: '开始学习',
    description: '登录账户，开始您的日语学习之旅',
    icon: 'tabler:rocket'
  }
])

const benefits = ref([
  {
    title: '个性化学习计划',
    description: '根据您的水平和目标制定专属学习计划',
    icon: 'tabler:user-cog'
  },
  {
    title: '学习进度跟踪',
    description: '详细记录您的学习进度和成就',
    icon: 'tabler:chart-line'
  },
  {
    title: '社区互动',
    description: '与其他学习者交流经验，共同进步',
    icon: 'tabler:users'
  },
  {
    title: '离线学习',
    description: '下载课程内容，随时随地学习',
    icon: 'tabler:download'
  }
])
</script>

<template>
  <div class="how-to-register-page">
    <!-- Header -->
    <n-card class="header-section mb-6 rounded-16px" content-style="padding: 40px;">
      <div class="text-center">
        <n-h1 class="mb-4">
          <n-gradient-text type="primary">
            如何注册
          </n-gradient-text>
        </n-h1>
        <n-text class="text-16px text-gray-600">
          简单几步，开启您的日语学习之旅
        </n-text>
      </div>
    </n-card>

    <!-- Registration Steps -->
    <n-card class="steps-section mb-6 rounded-16px" content-style="padding: 40px;">
      <n-h2 class="text-center mb-8">
        <n-gradient-text type="success">
          注册步骤
        </n-gradient-text>
      </n-h2>
      
      <div class="steps-container">
        <div v-for="step in registrationSteps" :key="step.step" class="step-item mb-6">
          <div class="flex items-start gap-4">
            <div class="step-number">
              <n-tag type="primary" size="large" round>
                {{ step.step }}
              </n-tag>
            </div>
            <div class="flex-1">
              <div class="flex items-center gap-2 mb-2">
                <Icon :icon="step.icon" class="text-24px text-primary" />
                <n-h3 class="mb-0">{{ step.title }}</n-h3>
              </div>
              <n-text depth="3">{{ step.description }}</n-text>
            </div>
          </div>
          <n-divider v-if="step.step < registrationSteps.length" class="my-6" />
        </div>
      </div>
      
      <div class="text-center mt-8">
        <n-button type="primary" size="large">
          <template #icon>
            <Icon icon="tabler:user-plus" />
          </template>
          立即注册
        </n-button>
      </div>
    </n-card>

    <!-- Benefits -->
    <n-card class="benefits-section rounded-16px" content-style="padding: 40px;">
      <n-h2 class="text-center mb-8">
        <n-gradient-text type="info">
          注册后您将获得
        </n-gradient-text>
      </n-h2>
      
      <n-grid :cols="2" :x-gap="24" :y-gap="24" responsive="screen" item-responsive>
        <n-grid-item v-for="benefit in benefits" :key="benefit.title" span="24 m:12">
          <div class="benefit-item flex items-start gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors">
            <Icon :icon="benefit.icon" class="text-32px text-primary mt-1 flex-shrink-0" />
            <div>
              <n-text strong class="text-16px block mb-2">{{ benefit.title }}</n-text>
              <n-text depth="3">{{ benefit.description }}</n-text>
            </div>
          </div>
        </n-grid-item>
      </n-grid>
    </n-card>
  </div>
</template>

<style scoped>
.how-to-register-page {
  max-width: 800px;
  margin: 0 auto;
}

.step-item {
  position: relative;
}

.benefit-item {
  border: 1px solid transparent;
  transition: all 0.3s ease;
}

.benefit-item:hover {
  border-color: var(--primary-color);
  background-color: var(--hover-color);
}

@media (max-width: 768px) {
  .header-section :deep(.n-card__content),
  .steps-section :deep(.n-card__content),
  .benefits-section :deep(.n-card__content) {
    padding: 20px;
  }
}
</style>
