<template>
  <div class="simple-course-test">
    <n-card title="简化课程列表测试">
      <n-space vertical>
        <n-alert type="info">
          <template #header>测试状态</template>
          <p>加载状态: {{ loading }}</p>
          <p>错误信息: {{ error || '无' }}</p>
          <p>课程数量: {{ courses.length }}</p>
        </n-alert>

        <n-button @click="loadCourses" :loading="loading" type="primary">
          重新加载课程
        </n-button>

        <n-card v-if="rawResponse" title="原始API响应">
          <pre>{{ JSON.stringify(rawResponse, null, 2) }}</pre>
        </n-card>

        <n-card v-if="courses.length > 0" title="课程列表">
          <n-list>
            <n-list-item v-for="course in courses" :key="course.id">
              <n-thing>
                <template #header>{{ course.title }}</template>
                <template #description>
                  <n-space>
                    <n-tag :type="getLevelType(course.level)">{{ course.level }}</n-tag>
                    <n-tag>{{ course.category }}</n-tag>
                    <n-tag>{{ course.price }}</n-tag>
                  </n-space>
                </template>
                <p>{{ course.description }}</p>
              </n-thing>
            </n-list-item>
          </n-list>
        </n-card>

        <n-card v-if="error" title="错误详情" type="error">
          <pre>{{ JSON.stringify(errorDetails, null, 2) }}</pre>
        </n-card>
      </n-space>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'

const loading = ref(false)
const error = ref<string | null>(null)
const courses = ref<any[]>([])
const rawResponse = ref<any>(null)
const errorDetails = ref<any>(null)

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api'

async function loadCourses() {
  loading.value = true
  error.value = null
  errorDetails.value = null
  courses.value = []
  rawResponse.value = null

  try {
    console.log('简化测试：加载课程数据...')
    console.log('API URL:', `${apiBaseUrl}/courses`)
    
    const response = await axios.get(`${apiBaseUrl}/courses`, {
      params: {
        limit: 6,
        page: 1
      },
      timeout: 10000,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })

    console.log('API响应:', response)
    rawResponse.value = response.data

    if (response.data && response.data.success && response.data.data && response.data.data.courses) {
      courses.value = response.data.data.courses
      console.log('课程数据加载成功:', courses.value.length, '门课程')
    } else {
      throw new Error('API响应格式不正确')
    }
  } catch (err: any) {
    console.error('加载课程失败:', err)
    error.value = err.message || '加载失败'
    errorDetails.value = {
      message: err.message,
      code: err.code,
      status: err.response?.status,
      statusText: err.response?.statusText,
      data: err.response?.data,
      config: {
        url: err.config?.url,
        method: err.config?.method,
        baseURL: err.config?.baseURL
      }
    }
  } finally {
    loading.value = false
  }
}

function getLevelType(level: string) {
  const types: Record<string, string> = {
    beginner: 'success',
    intermediate: 'warning',
    advanced: 'error'
  }
  return types[level] || 'default'
}

onMounted(() => {
  loadCourses()
})
</script>

<style scoped>
.simple-course-test {
  max-width: 1000px;
  margin: 20px auto;
  padding: 20px;
}

pre {
  background: #f5f5f5;
  padding: 10px;
  border-radius: 4px;
  overflow-x: auto;
  font-size: 12px;
  max-height: 300px;
  overflow-y: auto;
}
</style>
