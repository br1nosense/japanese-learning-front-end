<script lang="ts" setup>
import { Icon } from '@iconify/vue'

const methods = ref([
  {
    title: 'i+1 理论',
    description: '选择略高于当前水平的学习内容，确保既有挑战性又能理解',
    icon: 'tabler:stairs-up',
    details: [
      '从简单的内容开始，逐步增加难度',
      '确保每次学习都有新的收获',
      '避免选择过于困难的材料导致挫败感'
    ]
  },
  {
    title: '连词成句',
    description: '通过单词组合成句子的练习，掌握日语语法结构',
    icon: 'tabler:puzzle',
    details: [
      '从基础词汇开始练习',
      '学习词汇在句子中的位置和用法',
      '通过重复练习形成语感'
    ]
  },
  {
    title: '重复学习',
    description: '科学的重复机制帮助形成长期记忆',
    icon: 'tabler:repeat',
    details: [
      '间隔重复，提高记忆效果',
      '将学过的内容融入新课程中',
      '定期复习巩固已学知识'
    ]
  },
  {
    title: '游戏化学习',
    description: '通过游戏化的方式让学习变得有趣',
    icon: 'tabler:device-gamepad',
    details: [
      '设置学习目标和奖励机制',
      '通过成就系统激励学习',
      '多样化的学习模式保持兴趣'
    ]
  }
])

const tips = ref([
  {
    title: '制定学习计划',
    content: '每天固定时间学习，保持学习的连续性',
    icon: 'tabler:calendar-time'
  },
  {
    title: '多听多说',
    content: '通过听力练习和口语练习提高语言运用能力',
    icon: 'tabler:ear'
  },
  {
    title: '记录学习笔记',
    content: '记录重要的语法点和词汇，便于复习',
    icon: 'tabler:notes'
  },
  {
    title: '参与社区讨论',
    content: '与其他学习者交流，分享学习经验',
    icon: 'tabler:message-circle'
  }
])
</script>

<template>
  <div class="study-method-page">
    <!-- Header -->
    <n-card class="header-section mb-6 rounded-16px" content-style="padding: 40px;">
      <div class="text-center">
        <n-h1 class="mb-4">
          <n-gradient-text type="primary">
            学习方法
          </n-gradient-text>
        </n-h1>
        <n-text class="text-16px text-gray-600">
          科学的学习方法让日语学习事半功倍
        </n-text>
      </div>
    </n-card>

    <!-- Learning Methods -->
    <div class="methods-section mb-6">
      <n-h2 class="text-center mb-8">
        <n-gradient-text type="success">
          核心学习理论
        </n-gradient-text>
      </n-h2>
      
      <n-grid :cols="2" :x-gap="24" :y-gap="24" responsive="screen" item-responsive>
        <n-grid-item v-for="method in methods" :key="method.title" span="24 l:12">
          <n-card hoverable class="method-card h-full rounded-16px" content-style="padding: 24px;">
            <div class="flex items-start gap-4">
              <div class="method-icon">
                <Icon :icon="method.icon" class="text-32px text-primary" />
              </div>
              <div class="flex-1">
                <n-h3 class="mb-3">{{ method.title }}</n-h3>
                <n-text depth="3" class="mb-4 block">{{ method.description }}</n-text>
                <n-ul class="method-details">
                  <n-li v-for="detail in method.details" :key="detail" class="mb-2">
                    <n-text depth="2">{{ detail }}</n-text>
                  </n-li>
                </n-ul>
              </div>
            </div>
          </n-card>
        </n-grid-item>
      </n-grid>
    </div>

    <!-- Learning Tips -->
    <n-card class="tips-section rounded-16px" content-style="padding: 40px;">
      <n-h2 class="text-center mb-8">
        <n-gradient-text type="info">
          学习小贴士
        </n-gradient-text>
      </n-h2>
      
      <n-grid :cols="2" :x-gap="20" :y-gap="20" responsive="screen" item-responsive>
        <n-grid-item v-for="tip in tips" :key="tip.title" span="24 m:12">
          <div class="tip-item flex items-start gap-3 p-4 rounded-lg border border-gray-200 hover:border-primary transition-colors">
            <Icon :icon="tip.icon" class="text-24px text-primary mt-1 flex-shrink-0" />
            <div>
              <n-text strong class="text-16px block mb-2">{{ tip.title }}</n-text>
              <n-text depth="3">{{ tip.content }}</n-text>
            </div>
          </div>
        </n-grid-item>
      </n-grid>
    </n-card>

    <!-- CTA Section -->
    <n-card class="cta-section mt-6 rounded-16px" content-style="padding: 40px;">
      <div class="text-center">
        <n-h2 class="mb-4">
          <n-gradient-text type="warning">
            准备开始实践这些学习方法了吗？
          </n-gradient-text>
        </n-h2>
        <n-text class="text-16px mb-6 block">
          选择适合您的课程，开始高效的日语学习
        </n-text>
        <div class="flex gap-4 justify-center">
          <n-button type="primary" size="large" @click="$router.push('/courses')">
            <template #icon>
              <Icon icon="tabler:book-open" />
            </template>
            浏览课程
          </n-button>
          <n-button size="large" @click="$router.push('/get-started')">
            <template #icon>
              <Icon icon="tabler:arrow-left" />
            </template>
            返回入门指南
          </n-button>
        </div>
      </div>
    </n-card>
  </div>
</template>

<style scoped>
.study-method-page {
  max-width: 1000px;
  margin: 0 auto;
}

.method-card {
  transition: transform 0.3s ease;
  border-left: 4px solid var(--primary-color);
}

.method-card:hover {
  transform: translateY(-4px);
}

.method-details {
  list-style: none;
  padding: 0;
}

.method-details li {
  position: relative;
  padding-left: 20px;
}

.method-details li::before {
  content: '•';
  color: var(--primary-color);
  position: absolute;
  left: 0;
  top: 0;
}

.tip-item {
  transition: all 0.3s ease;
}

.tip-item:hover {
  background-color: var(--hover-color);
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
  .tips-section :deep(.n-card__content),
  .cta-section :deep(.n-card__content) {
    padding: 20px;
  }
  
  .cta-section .flex {
    flex-direction: column;
    align-items: center;
  }
}
</style>
