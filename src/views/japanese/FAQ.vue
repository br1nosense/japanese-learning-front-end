<script lang="ts" setup>
import { Icon } from '@iconify/vue'

const faqs = ref([
  {
    id: 1,
    question: '我是零基础，应该从哪里开始学习？',
    answer: '建议从"五十音图入门"课程开始，这是日语学习的基础。掌握平假名和片假名后，再学习基础词汇和语法。我们的学习路径会为您提供详细的指导。',
    category: 'beginner'
  },
  {
    id: 2,
    question: '免费课程和付费课程有什么区别？',
    answer: '免费课程提供基础的学习内容，包括五十音图、基础词汇等。付费课程包含更深入的语法讲解、听力训练、模拟考试等高级功能，以及个性化的学习计划和进度跟踪。',
    category: 'general'
  },
  {
    id: 3,
    question: '每天需要学习多长时间？',
    answer: '建议每天至少学习30分钟。对于初学者，每天1小时的学习时间比较合适。重要的是保持学习的连续性，每天坚持比偶尔长时间学习更有效。',
    category: 'study'
  },
  {
    id: 4,
    question: '如何准备JLPT考试？',
    answer: '我们提供专门的JLPT备考课程，包括N5到N1各个级别。建议先评估自己的水平，选择合适的级别进行系统学习，然后通过模拟考试检验学习效果。',
    category: 'exam'
  },
  {
    id: 5,
    question: '学习进度可以调整吗？',
    answer: '当然可以。您可以根据自己的时间安排和学习能力调整学习进度。我们的系统会记录您的学习情况，您可以随时暂停、加速或重复学习某个部分。',
    category: 'study'
  },
  {
    id: 6,
    question: '忘记密码怎么办？',
    answer: '在登录页面点击"忘记密码"，输入您注册时使用的邮箱地址，系统会发送重置密码的链接到您的邮箱。如果仍有问题，请联系客服。',
    category: 'account'
  },
  {
    id: 7,
    question: '可以在手机上学习吗？',
    answer: '是的，我们的网站采用响应式设计，完全支持手机和平板电脑访问。您可以随时随地进行学习，学习进度会自动同步。',
    category: 'technical'
  },
  {
    id: 8,
    question: '如何提高日语听力？',
    answer: '建议多听日语材料，从简单的对话开始，逐步提高难度。我们的听力训练课程提供分级听力材料，还有语速调节功能，帮助您循序渐进地提高听力水平。',
    category: 'study'
  }
])

const categories = ref([
  { label: '全部', value: 'all' },
  { label: '新手入门', value: 'beginner' },
  { label: '学习方法', value: 'study' },
  { label: '考试相关', value: 'exam' },
  { label: '账户问题', value: 'account' },
  { label: '技术支持', value: 'technical' },
  { label: '其他问题', value: 'general' }
])

const selectedCategory = ref('all')

const filteredFaqs = computed(() => {
  if (selectedCategory.value === 'all') {
    return faqs.value
  }
  return faqs.value.filter(faq => faq.category === selectedCategory.value)
})

const getCategoryIcon = (category: string) => {
  const icons = {
    beginner: 'tabler:baby-carriage',
    study: 'tabler:book-2',
    exam: 'tabler:certificate',
    account: 'tabler:user-circle',
    technical: 'tabler:settings',
    general: 'tabler:help-circle'
  }
  return icons[category] || 'tabler:question-mark'
}
</script>

<template>
  <div class="faq-page">
    <!-- Header -->
    <n-card class="header-section mb-6 rounded-16px" content-style="padding: 40px;">
      <div class="text-center">
        <n-h1 class="mb-4">
          <n-gradient-text type="primary">
            常见问题
          </n-gradient-text>
        </n-h1>
        <n-text class="text-16px text-gray-600">
          快速找到您需要的答案
        </n-text>
      </div>
    </n-card>

    <!-- Category Filter -->
    <n-card class="filter-section mb-6 rounded-16px" content-style="padding: 24px;">
      <div class="flex items-center gap-4 flex-wrap">
        <n-text class="mr-2">分类筛选：</n-text>
        <n-radio-group v-model:value="selectedCategory" size="small">
          <n-radio-button
            v-for="category in categories"
            :key="category.value"
            :value="category.value"
            class="mr-2 mb-2"
          >
            {{ category.label }}
          </n-radio-button>
        </n-radio-group>
      </div>
    </n-card>

    <!-- FAQ List -->
    <div class="faq-list">
      <n-collapse>
        <n-collapse-item
          v-for="faq in filteredFaqs"
          :key="faq.id"
          :title="faq.question"
          :name="faq.id"
          class="mb-4"
        >
          <template #header-extra>
            <Icon :icon="getCategoryIcon(faq.category)" class="text-16px text-primary" />
          </template>
          <div class="faq-answer">
            <n-text>{{ faq.answer }}</n-text>
          </div>
        </n-collapse-item>
      </n-collapse>
    </div>

    <!-- Contact Section -->
    <n-card class="contact-section mt-8 rounded-16px" content-style="padding: 40px;">
      <div class="text-center">
        <Icon icon="tabler:message-circle-question" class="text-64px text-primary mb-4" />
        <n-h2 class="mb-4">
          <n-gradient-text type="info">
            没有找到您要的答案？
          </n-gradient-text>
        </n-h2>
        <n-text class="text-16px mb-6 block">
          我们的客服团队随时为您提供帮助
        </n-text>
        <div class="flex gap-4 justify-center">
          <n-button type="primary" size="large" @click="$router.push('/help/contact')">
            <template #icon>
              <Icon icon="tabler:mail" />
            </template>
            联系客服
          </n-button>
          <n-button size="large">
            <template #icon>
              <Icon icon="tabler:message-circle" />
            </template>
            在线咨询
          </n-button>
        </div>
      </div>
    </n-card>

    <!-- Quick Links -->
    <n-card class="quick-links mt-6 rounded-16px" content-style="padding: 40px;">
      <n-h3 class="text-center mb-6">
        <n-gradient-text type="success">
          快速链接
        </n-gradient-text>
      </n-h3>
      
      <n-grid :cols="3" :x-gap="20" :y-gap="20" responsive="screen" item-responsive>
        <n-grid-item span="24 m:8">
          <div class="quick-link-item text-center p-4 rounded-lg border border-gray-200 hover:border-primary transition-colors cursor-pointer" @click="$router.push('/get-started')">
            <Icon icon="tabler:rocket" class="text-32px text-primary mb-2" />
            <n-text strong class="block">新手指南</n-text>
            <n-text depth="3" class="text-sm">学习入门指导</n-text>
          </div>
        </n-grid-item>
        
        <n-grid-item span="24 m:8">
          <div class="quick-link-item text-center p-4 rounded-lg border border-gray-200 hover:border-primary transition-colors cursor-pointer" @click="$router.push('/courses')">
            <Icon icon="tabler:book-open" class="text-32px text-primary mb-2" />
            <n-text strong class="block">课程中心</n-text>
            <n-text depth="3" class="text-sm">浏览所有课程</n-text>
          </div>
        </n-grid-item>
        
        <n-grid-item span="24 m:8">
          <div class="quick-link-item text-center p-4 rounded-lg border border-gray-200 hover:border-primary transition-colors cursor-pointer" @click="$router.push('/progress')">
            <Icon icon="tabler:chart-line" class="text-32px text-primary mb-2" />
            <n-text strong class="block">学习进度</n-text>
            <n-text depth="3" class="text-sm">查看学习统计</n-text>
          </div>
        </n-grid-item>
      </n-grid>
    </n-card>
  </div>
</template>

<style scoped>
.faq-page {
  max-width: 1000px;
  margin: 0 auto;
}

.faq-answer {
  padding: 16px 0;
  line-height: 1.6;
}

.quick-link-item {
  transition: all 0.3s ease;
}

.quick-link-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.contact-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.contact-section :deep(.n-card__content) {
  background: transparent;
}

@media (max-width: 768px) {
  .header-section :deep(.n-card__content),
  .filter-section :deep(.n-card__content),
  .contact-section :deep(.n-card__content),
  .quick-links :deep(.n-card__content) {
    padding: 20px;
  }
  
  .filter-section .flex {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .contact-section .flex {
    flex-direction: column;
    align-items: center;
  }
}
</style>
