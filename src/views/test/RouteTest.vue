<script lang="ts" setup>
import { Icon } from '@iconify/vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const testRoutes = [
  { path: '/home', name: '首页' },
  { path: '/courses', name: '课程中心' },
  { path: '/progress', name: '学习进度' },
  { path: '/learning/words', name: '单词学习' },
  { path: '/learning/grammar', name: '语法练习' },
]

function navigateTo(path: string) {
  console.log('Navigating to:', path)
  router.push(path)
}

function testDirectAccess(path: string) {
  console.log('Testing direct access to:', path)
  window.open(path, '_blank')
}
</script>

<template>
  <div class="route-test-page">
    <n-card class="mb-6 rounded-16px" content-style="padding: 40px;">
      <div class="text-center">
        <n-h1 class="mb-4">
          <n-gradient-text type="primary">
            路由导航测试
          </n-gradient-text>
        </n-h1>
        <n-text class="text-16px text-gray-600">
          测试路由跳转和页面渲染功能
        </n-text>
      </div>
    </n-card>

    <n-card class="test-section rounded-16px" content-style="padding: 24px;">
      <n-h3 class="mb-4">
        <Icon icon="tabler:route" class="mr-2" />
        路由跳转测试
      </n-h3>

      <div class="test-grid">
        <div v-for="route in testRoutes" :key="route.path" class="test-item">
          <n-card hoverable class="test-card rounded-12px" content-style="padding: 20px;">
            <div class="flex items-center justify-between mb-3">
              <n-text strong>{{ route.name }}</n-text>
              <n-tag size="small" type="info">{{ route.path }}</n-tag>
            </div>
            
            <div class="test-buttons flex gap-2">
              <n-button 
                type="primary" 
                size="small" 
                @click="navigateTo(route.path)"
              >
                <template #icon>
                  <Icon icon="tabler:arrow-right" />
                </template>
                路由跳转
              </n-button>
              
              <n-button 
                type="default" 
                size="small" 
                @click="testDirectAccess(route.path)"
              >
                <template #icon>
                  <Icon icon="tabler:external-link" />
                </template>
                直接访问
              </n-button>
            </div>
          </n-card>
        </div>
      </div>
    </n-card>

    <n-card class="instructions-section mt-6 rounded-16px" content-style="padding: 24px;">
      <n-h3 class="mb-4">
        <Icon icon="tabler:info-circle" class="mr-2" />
        测试说明
      </n-h3>
      
      <n-ul>
        <n-li>点击"路由跳转"按钮测试程序内路由导航</n-li>
        <n-li>点击"直接访问"按钮测试直接在地址栏输入URL的情况</n-li>
        <n-li>观察页面是否能正常显示，无需手动刷新</n-li>
        <n-li>检查浏览器开发者工具的控制台是否有错误信息</n-li>
      </n-ul>
    </n-card>
  </div>
</template>

<style scoped>
.route-test-page {
  max-width: 1000px;
  margin: 0 auto;
}

.test-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 16px;
}

.test-card {
  transition: transform 0.3s ease;
}

.test-card:hover {
  transform: translateY(-2px);
}

.test-buttons {
  width: 100%;
}

.test-buttons .n-button {
  flex: 1;
}

@media (max-width: 768px) {
  .test-grid {
    grid-template-columns: 1fr;
  }
  
  .test-buttons {
    flex-direction: column;
  }
}
</style>
