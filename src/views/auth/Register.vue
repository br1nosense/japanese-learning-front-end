<script lang="ts" setup>
import { Icon } from '@iconify/vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

// 表单数据
const formData = ref({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  profile: {
    firstName: '',
    lastName: '',
    currentLevel: 'beginner',
    targetLevel: 'N5',
    learningGoals: []
  },
  agreeTerms: false
})

// 学习目标选项
const learningGoalOptions = [
  { label: '日常对话', value: 'conversation' },
  { label: '商务日语', value: 'business' },
  { label: '旅游日语', value: 'travel' },
  { label: '动漫文化', value: 'anime' },
  { label: '日本文化', value: 'culture' },
  { label: '考试备考', value: 'exam' }
]

// 表单验证规则
const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: ['blur', 'input'] },
    { min: 3, max: 30, message: '用户名长度应为3-30个字符', trigger: ['blur', 'input'] },
    { pattern: /^[a-zA-Z0-9_]+$/, message: '用户名只能包含字母、数字和下划线', trigger: ['blur', 'input'] }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: ['blur', 'input'] },
    { type: 'email', message: '请输入有效的邮箱地址', trigger: ['blur', 'input'] }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: ['blur', 'input'] },
    { min: 6, message: '密码长度至少6个字符', trigger: ['blur', 'input'] },
    { pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, message: '密码必须包含大小写字母和数字', trigger: ['blur', 'input'] }
  ],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: ['blur', 'input'] },
    {
      validator: (rule: any, value: string) => {
        return value === formData.value.password
      },
      message: '两次输入的密码不一致',
      trigger: ['blur', 'input']
    }
  ],
  agreeTerms: [
    {
      validator: (rule: any, value: boolean) => {
        return value === true
      },
      message: '请同意用户协议和隐私政策',
      trigger: ['change']
    }
  ]
}

// 表单引用
const formRef = ref()
const loading = ref(false)
const currentStep = ref(1)

// 处理注册
async function handleRegister() {
  try {
    await formRef.value?.validate()
    loading.value = true

    const result = await authStore.register({
      username: formData.value.username,
      email: formData.value.email,
      password: formData.value.password,
      profile: formData.value.profile
    })

    if (result.success) {
      window.$message.success('注册成功！欢迎加入日语学习之旅！')
      router.push('/home')
    } else {
      window.$message.error(result.error || '注册失败')
    }
  } catch (error) {
    console.error('Register error:', error)
    // 处理网络错误或其他异常
    if (error.code === 'NETWORK_ERROR') {
      window.$message.error('网络连接失败，请检查网络设置')
    } else {
      window.$message.error('注册过程中发生错误，请稍后重试')
    }
  } finally {
    loading.value = false
  }
}

// 下一步
function nextStep() {
  if (currentStep.value < 2) {
    // 验证当前步骤的字段
    const fieldsToValidate = currentStep.value === 1
      ? ['username', 'email', 'password', 'confirmPassword']
      : []

    formRef.value?.validate((errors: any) => {
      if (!errors || errors.filter((e: any) => fieldsToValidate.includes(e[0].field)).length === 0) {
        currentStep.value++
      }
    }, (rule: any) => fieldsToValidate.includes(rule.key))
  }
}

// 上一步
function prevStep() {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

// 跳转到登录页面
function goToLogin() {
  router.push('/login')
}
</script>

<template>
  <div class="register-page">
    <div class="register-container">
      <!-- 背景装饰 -->
      <div class="background-decoration">
        <div class="sakura-petals">
          <div class="petal" v-for="i in 8" :key="i"></div>
        </div>
      </div>

      <!-- 注册卡片 -->
      <n-card class="register-card" content-style="padding: 40px;">
        <!-- 头部 -->
        <div class="register-header mb-6">
          <div class="logo mb-4">
            <Icon icon="tabler:language" class="text-48px text-primary" />
          </div>
          <n-h2 class="text-center mb-2">加入我们</n-h2>
          <n-text depth="3" class="text-center block">
            开始您的日语学习之旅
          </n-text>
        </div>

        <!-- 步骤指示器 -->
        <n-steps :current="currentStep" class="mb-8">
          <n-step title="账户信息" />
          <n-step title="个人资料" />
        </n-steps>

        <!-- 注册表单 -->
        <n-form
          ref="formRef"
          :model="formData"
          :rules="rules"
          size="large"
          :show-label="false"
        >
          <!-- 第一步：账户信息 -->
          <div v-show="currentStep === 1" class="step-content">
            <n-form-item path="username">
              <n-input
                v-model:value="formData.username"
                placeholder="用户名"
                clearable
              >
                <template #prefix>
                  <Icon icon="tabler:user" />
                </template>
              </n-input>
            </n-form-item>

            <n-form-item path="email">
              <n-input
                v-model:value="formData.email"
                placeholder="邮箱地址"
                clearable
              >
                <template #prefix>
                  <Icon icon="tabler:mail" />
                </template>
              </n-input>
            </n-form-item>

            <n-form-item path="password">
              <n-input
                v-model:value="formData.password"
                type="password"
                placeholder="密码"
                show-password-on="click"
                clearable
              >
                <template #prefix>
                  <Icon icon="tabler:lock" />
                </template>
              </n-input>
            </n-form-item>

            <n-form-item path="confirmPassword">
              <n-input
                v-model:value="formData.confirmPassword"
                type="password"
                placeholder="确认密码"
                show-password-on="click"
                clearable
              >
                <template #prefix>
                  <Icon icon="tabler:lock-check" />
                </template>
              </n-input>
            </n-form-item>
          </div>

          <!-- 第二步：个人资料 -->
          <div v-show="currentStep === 2" class="step-content">
            <n-grid :cols="2" :x-gap="16">
              <n-grid-item>
                <n-form-item path="profile.firstName">
                  <n-input
                    v-model:value="formData.profile.firstName"
                    placeholder="姓"
                    clearable
                  >
                    <template #prefix>
                      <Icon icon="tabler:user-circle" />
                    </template>
                  </n-input>
                </n-form-item>
              </n-grid-item>
              <n-grid-item>
                <n-form-item path="profile.lastName">
                  <n-input
                    v-model:value="formData.profile.lastName"
                    placeholder="名"
                    clearable
                  >
                    <template #prefix>
                      <Icon icon="tabler:user-circle" />
                    </template>
                  </n-input>
                </n-form-item>
              </n-grid-item>
            </n-grid>

            <n-form-item path="profile.currentLevel">
              <n-select
                v-model:value="formData.profile.currentLevel"
                placeholder="当前日语水平"
                :options="[
                  { label: '初学者', value: 'beginner' },
                  { label: '中级', value: 'intermediate' },
                  { label: '高级', value: 'advanced' }
                ]"
              />
            </n-form-item>

            <n-form-item path="profile.targetLevel">
              <n-select
                v-model:value="formData.profile.targetLevel"
                placeholder="目标等级"
                :options="[
                  { label: 'N5', value: 'N5' },
                  { label: 'N4', value: 'N4' },
                  { label: 'N3', value: 'N3' },
                  { label: 'N2', value: 'N2' },
                  { label: 'N1', value: 'N1' }
                ]"
              />
            </n-form-item>

            <n-form-item path="profile.learningGoals">
              <n-checkbox-group v-model:value="formData.profile.learningGoals">
                <n-space>
                  <n-checkbox
                    v-for="goal in learningGoalOptions"
                    :key="goal.value"
                    :value="goal.value"
                    :label="goal.label"
                  />
                </n-space>
              </n-checkbox-group>
            </n-form-item>

            <n-form-item path="agreeTerms">
              <n-checkbox v-model:checked="formData.agreeTerms">
                我已阅读并同意
                <n-button text type="primary" class="mx-1">用户协议</n-button>
                和
                <n-button text type="primary" class="mx-1">隐私政策</n-button>
              </n-checkbox>
            </n-form-item>
          </div>
        </n-form>

        <!-- 操作按钮 -->
        <div class="action-buttons">
          <n-space justify="space-between">
            <n-button
              v-if="currentStep > 1"
              size="large"
              @click="prevStep"
            >
              <Icon icon="tabler:arrow-left" class="mr-1" />
              上一步
            </n-button>
            <div v-else></div>

            <n-button
              v-if="currentStep < 2"
              type="primary"
              size="large"
              @click="nextStep"
            >
              下一步
              <Icon icon="tabler:arrow-right" class="ml-1" />
            </n-button>
            <n-button
              v-else
              type="primary"
              size="large"
              :loading="loading"
              @click="handleRegister"
            >
              完成注册
            </n-button>
          </n-space>
        </div>

        <!-- 登录链接 -->
        <div class="login-link text-center mt-6">
          <n-text depth="3">已有账户？</n-text>
          <n-button text type="primary" @click="goToLogin" class="ml-1">
            立即登录
          </n-button>
        </div>
      </n-card>
    </div>
  </div>
</template>

<style scoped>
.register-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--primary-color-suppl) 0%, var(--primary-color) 100%);
  position: relative;
  overflow: hidden;
  padding: 20px 0;
}

.register-container {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
  padding: 20px;
}

.background-decoration {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  overflow: hidden;
}

.sakura-petals {
  position: absolute;
  width: 100%;
  height: 100%;
}

.petal {
  position: absolute;
  width: 8px;
  height: 8px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 50% 0 50% 0;
  animation: fall linear infinite;
}

.petal:nth-child(1) { left: 5%; animation-duration: 10s; animation-delay: 0s; }
.petal:nth-child(2) { left: 15%; animation-duration: 12s; animation-delay: 2s; }
.petal:nth-child(3) { left: 25%; animation-duration: 8s; animation-delay: 4s; }
.petal:nth-child(4) { left: 35%; animation-duration: 14s; animation-delay: 1s; }
.petal:nth-child(5) { left: 50%; animation-duration: 9s; animation-delay: 3s; }
.petal:nth-child(6) { left: 65%; animation-duration: 11s; animation-delay: 5s; }
.petal:nth-child(7) { left: 80%; animation-duration: 13s; animation-delay: 2s; }
.petal:nth-child(8) { left: 95%; animation-duration: 10s; animation-delay: 6s; }

@keyframes fall {
  0% {
    transform: translateY(-100vh) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: translateY(100vh) rotate(360deg);
    opacity: 0;
  }
}

.register-card {
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border-radius: 16px;
}

.register-header {
  text-align: center;
}

.logo {
  display: flex;
  justify-content: center;
}

.step-content {
  min-height: 300px;
}

.action-buttons {
  margin-top: 24px;
}

/* 响应式设计 */
@media (max-width: 600px) {
  .register-container {
    padding: 16px;
  }

  .register-card :deep(.n-card__content) {
    padding: 24px !important;
  }

  .register-header {
    margin-bottom: 20px !important;
  }

  .step-content {
    min-height: 250px;
  }
}
</style>
