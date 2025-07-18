<template>
  <div class="api-test-container">
    <n-card title="API连接测试">
      <n-space vertical>
        <n-alert type="info">
          <template #header>环境配置</template>
          <p>API Base URL: {{ apiBaseUrl }}</p>
          <p>当前环境: {{ currentEnv }}</p>
        </n-alert>

        <n-button @click="testHealthCheck" :loading="healthLoading" type="primary">
          测试健康检查 API
        </n-button>

        <n-button @click="testLogin" :loading="loginLoading" type="warning">
          测试登录 API
        </n-button>

        <n-button @click="testCourses" :loading="coursesLoading" type="info">
          测试课程列表 API
        </n-button>

        <n-card v-if="healthResult" title="健康检查结果">
          <pre>{{ JSON.stringify(healthResult, null, 2) }}</pre>
        </n-card>

        <n-card v-if="loginResult" title="登录测试结果">
          <pre>{{ JSON.stringify(loginResult, null, 2) }}</pre>
        </n-card>

        <n-card v-if="coursesResult" title="课程列表测试结果">
          <pre>{{ JSON.stringify(coursesResult, null, 2) }}</pre>
        </n-card>

        <n-card v-if="errorResult" title="错误信息" type="error">
          <pre>{{ JSON.stringify(errorResult, null, 2) }}</pre>
        </n-card>
      </n-space>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api'
const currentEnv = import.meta.env.MODE

const healthLoading = ref(false)
const loginLoading = ref(false)
const coursesLoading = ref(false)
const healthResult = ref(null)
const loginResult = ref(null)
const coursesResult = ref(null)
const errorResult = ref(null)

async function testHealthCheck() {
  healthLoading.value = true
  errorResult.value = null

  try {
    console.log('测试健康检查API:', `${apiBaseUrl}/health`)
    console.log('完整URL:', `${apiBaseUrl}/health`)

    const response = await axios.get(`${apiBaseUrl}/health`, {
      timeout: 5000,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
    healthResult.value = {
      status: response.status,
      statusText: response.statusText,
      data: response.data,
      headers: response.headers
    }
    console.log('健康检查成功:', response)
  } catch (error: any) {
    console.error('健康检查失败:', error)
    errorResult.value = {
      type: 'health_check_error',
      message: error.message,
      code: error.code,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      headers: error.response?.headers,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        baseURL: error.config?.baseURL,
        timeout: error.config?.timeout
      }
    }
  } finally {
    healthLoading.value = false
  }
}

async function testLogin() {
  loginLoading.value = true
  errorResult.value = null

  try {
    console.log('测试登录API:', `${apiBaseUrl}/auth/login`)
    const response = await axios.post(`${apiBaseUrl}/auth/login`, {
      identifier: 'student001@example.com',
      password: 'Student123456'
    }, {
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    })
    loginResult.value = response.data
    console.log('登录测试成功:', response.data)
  } catch (error: any) {
    console.error('登录测试失败:', error)
    errorResult.value = {
      type: 'login_test_error',
      message: error.message,
      code: error.code,
      status: error.response?.status,
      data: error.response?.data,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        baseURL: error.config?.baseURL
      }
    }
  } finally {
    loginLoading.value = false
  }
}

async function testCourses() {
  coursesLoading.value = true
  errorResult.value = null

  try {
    console.log('测试课程API:', `${apiBaseUrl}/courses`)
    const response = await axios.get(`${apiBaseUrl}/courses?limit=3`, {
      timeout: 10000,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
    coursesResult.value = {
      status: response.status,
      statusText: response.statusText,
      data: response.data,
      coursesCount: response.data?.data?.courses?.length || 0,
      totalCourses: response.data?.data?.pagination?.totalCourses || 0
    }
    console.log('课程API测试成功:', response.data)
  } catch (error: any) {
    console.error('课程API测试失败:', error)
    errorResult.value = {
      type: 'courses_test_error',
      message: error.message,
      code: error.code,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      headers: error.response?.headers,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        baseURL: error.config?.baseURL,
        timeout: error.config?.timeout
      }
    }
  } finally {
    coursesLoading.value = false
  }
}
</script>

<style scoped>
.api-test-container {
  max-width: 800px;
  margin: 20px auto;
  padding: 20px;
}

pre {
  background: #f5f5f5;
  padding: 10px;
  border-radius: 4px;
  overflow-x: auto;
  font-size: 12px;
}
</style>
