<script lang="ts" setup>
import { Icon } from '@iconify/vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

// 表单数据
const formData = ref({
  identifier: '', // 用户名或邮箱
  password: '',
  rememberMe: false
})

// 表单验证规则
const rules = {
  identifier: {
    required: true,
    message: '请输入用户名或邮箱',
    trigger: ['blur', 'input']
  },
  password: {
    required: true,
    message: '请输入密码',
    trigger: ['blur', 'input']
  }
}

// 表单引用
const formRef = ref()
const loading = ref(false)

// 处理登录
async function handleLogin() {
  try {
    await formRef.value?.validate()
    loading.value = true
    
    const result = await authStore.login({
      identifier: formData.value.identifier,
      password: formData.value.password
    })
    
    if (result.success) {
      window.$message.success('登录成功！')
      
      // 跳转到首页或之前的页面
      const redirect = router.currentRoute.value.query.redirect as string
      router.push(redirect || '/home')
    } else {
      window.$message.error(result.error || '登录失败')
    }
  } catch (error) {
    console.error('Login error:', error)
  } finally {
    loading.value = false
  }
}

// 跳转到注册页面
function goToRegister() {
  router.push('/register')
}

// 忘记密码
function forgotPassword() {
  window.$message.info('忘记密码功能暂未开放，请联系管理员')
}

// 第三方登录（演示）
function handleThirdPartyLogin(provider: string) {
  window.$message.info(`${provider} 登录功能暂未开放`)
}
</script>

<template>
  <div class="login-page">
    <div class="login-container">
      <!-- 背景装饰 -->
      <div class="background-decoration">
        <div class="sakura-petals">
          <div class="petal" v-for="i in 6" :key="i"></div>
        </div>
      </div>
      
      <!-- 登录卡片 -->
      <n-card class="login-card" content-style="padding: 40px;">
        <!-- 头部 -->
        <div class="login-header mb-8">
          <div class="logo mb-4">
            <Icon icon="tabler:language" class="text-48px text-primary" />
          </div>
          <n-h2 class="text-center mb-2">欢迎回来</n-h2>
          <n-text depth="3" class="text-center block">
            登录您的日语学习账户
          </n-text>
        </div>
        
        <!-- 登录表单 -->
        <n-form
          ref="formRef"
          :model="formData"
          :rules="rules"
          size="large"
          :show-label="false"
        >
          <n-form-item path="identifier">
            <n-input
              v-model:value="formData.identifier"
              placeholder="用户名或邮箱"
              clearable
            >
              <template #prefix>
                <Icon icon="tabler:user" />
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
              @keyup.enter="handleLogin"
            >
              <template #prefix>
                <Icon icon="tabler:lock" />
              </template>
            </n-input>
          </n-form-item>
          
          <!-- 记住我和忘记密码 -->
          <div class="login-options mb-6">
            <n-checkbox v-model:checked="formData.rememberMe">
              记住我
            </n-checkbox>
            <n-button text type="primary" @click="forgotPassword">
              忘记密码？
            </n-button>
          </div>
          
          <!-- 登录按钮 -->
          <n-button
            type="primary"
            size="large"
            block
            :loading="loading"
            @click="handleLogin"
            class="login-button mb-6"
          >
            登录
          </n-button>
        </n-form>
        
        <!-- 分割线 -->
        <n-divider class="my-6">
          <n-text depth="3" class="text-sm">或</n-text>
        </n-divider>
        
        <!-- 第三方登录 -->
        <div class="third-party-login mb-6">
          <n-space justify="center" :size="16">
            <n-button
              circle
              size="large"
              @click="handleThirdPartyLogin('GitHub')"
              class="third-party-btn"
            >
              <Icon icon="tabler:brand-github" class="text-20px" />
            </n-button>
            <n-button
              circle
              size="large"
              @click="handleThirdPartyLogin('Google')"
              class="third-party-btn"
            >
              <Icon icon="tabler:brand-google" class="text-20px" />
            </n-button>
            <n-button
              circle
              size="large"
              @click="handleThirdPartyLogin('微信')"
              class="third-party-btn"
            >
              <Icon icon="tabler:brand-wechat" class="text-20px" />
            </n-button>
          </n-space>
        </div>
        
        <!-- 注册链接 -->
        <div class="register-link text-center">
          <n-text depth="3">还没有账户？</n-text>
          <n-button text type="primary" @click="goToRegister" class="ml-1">
            立即注册
          </n-button>
        </div>
      </n-card>
    </div>
  </div>
</template>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--primary-color-suppl) 0%, var(--primary-color) 100%);
  position: relative;
  overflow: hidden;
}

.login-container {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 400px;
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
  width: 10px;
  height: 10px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 50% 0 50% 0;
  animation: fall linear infinite;
}

.petal:nth-child(1) { left: 10%; animation-duration: 8s; animation-delay: 0s; }
.petal:nth-child(2) { left: 20%; animation-duration: 10s; animation-delay: 2s; }
.petal:nth-child(3) { left: 40%; animation-duration: 12s; animation-delay: 4s; }
.petal:nth-child(4) { left: 60%; animation-duration: 9s; animation-delay: 1s; }
.petal:nth-child(5) { left: 80%; animation-duration: 11s; animation-delay: 3s; }
.petal:nth-child(6) { left: 90%; animation-duration: 13s; animation-delay: 5s; }

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

.login-card {
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border-radius: 16px;
}

.login-header {
  text-align: center;
}

.logo {
  display: flex;
  justify-content: center;
}

.login-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.login-button {
  height: 48px;
  font-size: 16px;
  font-weight: 600;
}

.third-party-btn {
  width: 48px;
  height: 48px;
  transition: all 0.3s ease;
}

.third-party-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* 响应式设计 */
@media (max-width: 480px) {
  .login-container {
    padding: 16px;
  }
  
  .login-card :deep(.n-card__content) {
    padding: 24px !important;
  }
  
  .login-header {
    margin-bottom: 24px !important;
  }
}
</style>
