<template>
  <div class="direct-api-test">
    <n-card title="直接API测试">
      <n-space vertical>
        <n-alert type="info">
          <template #header>测试状态</template>
          <p>API Base URL: {{ apiBaseUrl }}</p>
          <p>测试状态: {{ testStatus }}</p>
        </n-alert>

        <n-button @click="testDirectAPI" :loading="loading" type="primary">
          直接测试课程API
        </n-button>

        <n-card v-if="result" title="测试结果">
          <pre>{{ JSON.stringify(result, null, 2) }}</pre>
        </n-card>

        <n-card v-if="error" title="错误信息" type="error">
          <pre>{{ error }}</pre>
        </n-card>
      </n-space>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const loading = ref(false)
const result = ref<any>(null)
const error = ref<string | null>(null)
const testStatus = ref('未开始')

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api'

async function testDirectAPI() {
  loading.value = true
  error.value = null
  result.value = null
  testStatus.value = '测试中...'

  try {
    console.log('直接API测试开始')
    console.log('API URL:', `${apiBaseUrl}/courses`)
    
    // 使用原生fetch测试
    const response = await fetch(`${apiBaseUrl}/courses?limit=3`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })

    console.log('Response status:', response.status)
    console.log('Response headers:', response.headers)

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const data = await response.json()
    console.log('Response data:', data)

    result.value = {
      status: response.status,
      statusText: response.statusText,
      data: data,
      coursesCount: data?.data?.courses?.length || 0,
      totalCourses: data?.data?.pagination?.totalCourses || 0
    }

    testStatus.value = '测试成功'
  } catch (err: any) {
    console.error('直接API测试失败:', err)
    error.value = err.message || '测试失败'
    testStatus.value = '测试失败'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.direct-api-test {
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
  max-height: 400px;
  overflow-y: auto;
}
</style>
