<script lang="ts" setup>
import { Icon } from '@iconify/vue'

const contactForm = ref({
  name: '',
  email: '',
  subject: '',
  message: ''
})

const contactMethods = ref([
  {
    title: '邮箱联系',
    description: '发送邮件给我们，我们会在24小时内回复',
    icon: 'tabler:mail',
    contact: 'support@japanese-learning.com',
    action: 'mailto:support@japanese-learning.com'
  },
  {
    title: '在线客服',
    description: '工作日9:00-18:00在线为您服务',
    icon: 'tabler:message-circle',
    contact: '点击开始对话',
    action: '#'
  },
  {
    title: '电话支持',
    description: '紧急问题可以直接电话联系',
    icon: 'tabler:phone',
    contact: '400-123-4567',
    action: 'tel:400-123-4567'
  }
])

const officeInfo = ref({
  address: '北京市朝阳区xxx路xxx号',
  workTime: '周一至周五 9:00-18:00',
  timezone: 'GMT+8 北京时间'
})

function submitForm() {
  // 表单验证
  if (!contactForm.value.name || !contactForm.value.email || !contactForm.value.message) {
    window.$message.warning('请填写必填项')
    return
  }
  
  // 模拟提交
  window.$message.success('消息已发送，我们会尽快回复您！')
  
  // 重置表单
  contactForm.value = {
    name: '',
    email: '',
    subject: '',
    message: ''
  }
}

function handleContactAction(action: string) {
  if (action.startsWith('mailto:') || action.startsWith('tel:')) {
    window.location.href = action
  } else if (action === '#') {
    window.$message.info('在线客服功能开发中...')
  }
}
</script>

<template>
  <div class="contact-page">
    <!-- Header -->
    <n-card class="header-section mb-6 rounded-16px" content-style="padding: 40px;">
      <div class="text-center">
        <n-h1 class="mb-4">
          <n-gradient-text type="primary">
            联系我们
          </n-gradient-text>
        </n-h1>
        <n-text class="text-16px text-gray-600">
          我们随时为您提供帮助和支持
        </n-text>
      </div>
    </n-card>

    <n-grid :cols="2" :x-gap="24" :y-gap="24" responsive="screen" item-responsive>
      <!-- Contact Form -->
      <n-grid-item span="24 l:12">
        <n-card class="contact-form-section rounded-16px" content-style="padding: 32px;">
          <n-h2 class="mb-6">
            <Icon icon="tabler:edit" class="mr-2" />
            发送消息
          </n-h2>
          
          <n-form :model="contactForm" label-placement="top">
            <n-form-item label="姓名 *" path="name">
              <n-input
                v-model:value="contactForm.name"
                placeholder="请输入您的姓名"
                size="large"
              />
            </n-form-item>
            
            <n-form-item label="邮箱 *" path="email">
              <n-input
                v-model:value="contactForm.email"
                placeholder="请输入您的邮箱地址"
                size="large"
                type="email"
              />
            </n-form-item>
            
            <n-form-item label="主题" path="subject">
              <n-input
                v-model:value="contactForm.subject"
                placeholder="请输入消息主题"
                size="large"
              />
            </n-form-item>
            
            <n-form-item label="消息内容 *" path="message">
              <n-input
                v-model:value="contactForm.message"
                type="textarea"
                placeholder="请详细描述您的问题或建议..."
                :rows="6"
                size="large"
              />
            </n-form-item>
            
            <n-button type="primary" size="large" block @click="submitForm">
              <template #icon>
                <Icon icon="tabler:send" />
              </template>
              发送消息
            </n-button>
          </n-form>
        </n-card>
      </n-grid-item>

      <!-- Contact Methods -->
      <n-grid-item span="24 l:12">
        <n-card class="contact-methods-section rounded-16px" content-style="padding: 32px;">
          <n-h2 class="mb-6">
            <Icon icon="tabler:phone" class="mr-2" />
            联系方式
          </n-h2>
          
          <div class="contact-methods">
            <div
              v-for="method in contactMethods"
              :key="method.title"
              class="contact-method-item p-4 rounded-lg border border-gray-200 hover:border-primary transition-all cursor-pointer mb-4"
              @click="handleContactAction(method.action)"
            >
              <div class="flex items-start gap-4">
                <div class="method-icon">
                  <Icon :icon="method.icon" class="text-32px text-primary" />
                </div>
                <div class="flex-1">
                  <n-text strong class="text-16px block mb-1">{{ method.title }}</n-text>
                  <n-text depth="3" class="text-sm block mb-2">{{ method.description }}</n-text>
                  <n-text class="text-primary">{{ method.contact }}</n-text>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Office Info -->
          <n-divider />
          
          <div class="office-info">
            <n-h3 class="mb-4">
              <Icon icon="tabler:building" class="mr-2" />
              办公信息
            </n-h3>
            
            <div class="info-item flex items-center gap-3 mb-3">
              <Icon icon="tabler:map-pin" class="text-20px text-gray-500" />
              <div>
                <n-text depth="2" class="text-sm">办公地址</n-text>
                <n-text class="block">{{ officeInfo.address }}</n-text>
              </div>
            </div>
            
            <div class="info-item flex items-center gap-3 mb-3">
              <Icon icon="tabler:clock" class="text-20px text-gray-500" />
              <div>
                <n-text depth="2" class="text-sm">工作时间</n-text>
                <n-text class="block">{{ officeInfo.workTime }}</n-text>
              </div>
            </div>
            
            <div class="info-item flex items-center gap-3">
              <Icon icon="tabler:world" class="text-20px text-gray-500" />
              <div>
                <n-text depth="2" class="text-sm">时区</n-text>
                <n-text class="block">{{ officeInfo.timezone }}</n-text>
              </div>
            </div>
          </div>
        </n-card>
      </n-grid-item>
    </n-grid>

    <!-- FAQ Link -->
    <n-card class="faq-link-section mt-6 rounded-16px" content-style="padding: 32px;">
      <div class="text-center">
        <Icon icon="tabler:help-circle" class="text-48px text-primary mb-4" />
        <n-h3 class="mb-4">
          <n-gradient-text type="info">
            查看常见问题
          </n-gradient-text>
        </n-h3>
        <n-text class="text-16px mb-6 block">
          在联系我们之前，您可以先查看常见问题，可能会找到您需要的答案
        </n-text>
        <n-button type="info" size="large" @click="$router.push('/help/faq')">
          <template #icon>
            <Icon icon="tabler:question-mark" />
          </template>
          查看常见问题
        </n-button>
      </div>
    </n-card>

    <!-- Social Media -->
    <n-card class="social-section mt-6 rounded-16px" content-style="padding: 32px;">
      <n-h3 class="text-center mb-6">
        <n-gradient-text type="success">
          关注我们
        </n-gradient-text>
      </n-h3>
      
      <div class="social-links flex justify-center gap-6">
        <div class="social-item text-center cursor-pointer hover:scale-110 transition-transform">
          <Icon icon="tabler:brand-wechat" class="text-40px text-green-500 mb-2" />
          <n-text class="text-sm block">微信公众号</n-text>
        </div>
        
        <div class="social-item text-center cursor-pointer hover:scale-110 transition-transform">
          <Icon icon="tabler:brand-weibo" class="text-40px text-red-500 mb-2" />
          <n-text class="text-sm block">新浪微博</n-text>
        </div>
        
        <div class="social-item text-center cursor-pointer hover:scale-110 transition-transform">
          <Icon icon="tabler:brand-bilibili" class="text-40px text-blue-500 mb-2" />
          <n-text class="text-sm block">哔哩哔哩</n-text>
        </div>
        
        <div class="social-item text-center cursor-pointer hover:scale-110 transition-transform">
          <Icon icon="tabler:brand-youtube" class="text-40px text-red-600 mb-2" />
          <n-text class="text-sm block">YouTube</n-text>
        </div>
      </div>
    </n-card>
  </div>
</template>

<style scoped>
.contact-page {
  max-width: 1200px;
  margin: 0 auto;
}

.contact-method-item {
  transition: all 0.3s ease;
}

.contact-method-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.social-item {
  transition: transform 0.3s ease;
}

@media (max-width: 768px) {
  .header-section :deep(.n-card__content),
  .contact-form-section :deep(.n-card__content),
  .contact-methods-section :deep(.n-card__content),
  .faq-link-section :deep(.n-card__content),
  .social-section :deep(.n-card__content) {
    padding: 20px;
  }
  
  .social-links {
    flex-wrap: wrap;
    gap: 16px;
  }
}
</style>
