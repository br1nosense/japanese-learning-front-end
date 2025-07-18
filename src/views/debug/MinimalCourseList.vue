<template>
  <div class="minimal-course-list">
    <n-card title="最小化课程列表测试">
      <n-space vertical>
        <n-button @click="loadData" :loading="loading" type="primary">
          加载课程数据
        </n-button>

        <n-alert v-if="error" type="error">
          错误: {{ error }}
        </n-alert>

        <n-alert v-if="!loading && !error && courses.length === 0" type="warning">
          没有找到课程数据
        </n-alert>

        <n-alert v-if="courses.length > 0" type="success">
          成功加载 {{ courses.length }} 门课程
        </n-alert>

        <!-- 简单的课程列表 -->
        <div v-if="courses.length > 0">
          <n-card v-for="course in courses" :key="course.id" class="mb-4">
            <template #header>
              {{ course.title }}
            </template>
            <n-space>
              <n-tag :type="getLevelType(course.level)">{{ course.level }}</n-tag>
              <n-tag>{{ course.category }}</n-tag>
              <n-tag v-if="course.price === 'free'" type="success">免费</n-tag>
              <n-tag v-else type="warning">付费</n-tag>
            </n-space>
            <p class="mt-2">{{ course.description }}</p>
          </n-card>
        </div>

        <!-- 调试信息 -->
        <n-card title="调试信息">
          <n-space vertical>
            <n-text>加载状态: {{ loading }}</n-text>
            <n-text>错误状态: {{ error || '无' }}</n-text>
            <n-text>课程数量: {{ courses.length }}</n-text>
            <n-text>API响应: {{ apiResponse ? '已获取' : '未获取' }}</n-text>
          </n-space>
        </n-card>
      </n-space>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { courseAPI } from '@/services/api'

const loading = ref(false)
const error = ref<string | null>(null)
const courses = ref<any[]>([])
const apiResponse = ref<any>(null)

async function loadData() {
  loading.value = true
  error.value = null
  courses.value = []
  apiResponse.value = null

  try {
    console.log('最小化测试：开始加载课程数据')
    
    const response = await courseAPI.getCourses({
      limit: 12,
      page: 1,
      sort: 'newest'
    })

    console.log('API响应:', response)
    apiResponse.value = response

    if (response && response.success && response.data && response.data.courses) {
      courses.value = response.data.courses
      console.log('成功加载课程:', courses.value.length)
    } else {
      throw new Error('API响应格式不正确')
    }
  } catch (err: any) {
    console.error('加载失败:', err)
    error.value = err.message || '加载失败'
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
</script>

<style scoped>
.minimal-course-list {
  max-width: 800px;
  margin: 20px auto;
  padding: 20px;
}
</style>
