<template>
  <div class="data-flow-test">
    <n-card title="数据流测试">
      <n-space vertical>
        <n-button @click="testDataFlow" :loading="testing" type="primary">
          测试数据流
        </n-button>

        <n-card v-if="testResult" title="测试结果">
          <n-space vertical>
            <n-text strong>1. API调用结果:</n-text>
            <pre>{{ JSON.stringify(testResult.apiResponse, null, 2) }}</pre>
            
            <n-text strong>2. useApiRequest Hook结果:</n-text>
            <pre>{{ JSON.stringify(testResult.hookResult, null, 2) }}</pre>
            
            <n-text strong>3. 数据访问测试:</n-text>
            <n-text>apiResponse.data.courses.length: {{ testResult.coursesLength }}</n-text>
            <n-text>第一门课程标题: {{ testResult.firstCourseTitle }}</n-text>
          </n-space>
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
import { courseAPI } from '@/services/api'
import { useApiRequest } from '@/hooks/common/useApiRequest'

const testing = ref(false)
const testResult = ref<any>(null)
const error = ref<string | null>(null)

// 创建一个独立的API请求实例用于测试
const testRequest = useApiRequest()

async function testDataFlow() {
  testing.value = true
  error.value = null
  testResult.value = null

  try {
    console.log('开始数据流测试...')
    
    // 1. 直接调用API
    console.log('1. 直接调用courseAPI.getCourses...')
    const directApiResponse = await courseAPI.getCourses({
      limit: 3,
      page: 1,
      sort: 'newest'
    })
    console.log('直接API响应:', directApiResponse)

    // 2. 通过useApiRequest Hook调用
    console.log('2. 通过useApiRequest Hook调用...')
    const hookResponse = await testRequest.execute(() => courseAPI.getCourses({
      limit: 3,
      page: 1,
      sort: 'newest'
    }))
    console.log('Hook响应:', hookResponse)
    console.log('Hook data.value:', testRequest.data.value)

    // 3. 数据访问测试
    const coursesLength = directApiResponse?.data?.courses?.length || 0
    const firstCourseTitle = directApiResponse?.data?.courses?.[0]?.title || '未找到'

    testResult.value = {
      apiResponse: directApiResponse,
      hookResult: {
        data: testRequest.data.value,
        loading: testRequest.loading.value,
        error: testRequest.error.value
      },
      coursesLength,
      firstCourseTitle
    }

    console.log('数据流测试完成')
  } catch (err: any) {
    console.error('数据流测试失败:', err)
    error.value = err.message || '测试失败'
  } finally {
    testing.value = false
  }
}
</script>

<style scoped>
.data-flow-test {
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
