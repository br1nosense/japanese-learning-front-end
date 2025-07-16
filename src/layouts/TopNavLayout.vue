<script lang="ts" setup>
import TopNavigation from './components/TopNavigation.vue'
import LayoutContent from './components/LayoutContent.vue'
import LayoutFooter from './components/LayoutFooter.vue'

const settingStore = useSettingStore()
</script>

<template>
  <naive-provider>
    <div class="top-nav-layout min-h-screen flex flex-col">
      <!-- 顶部导航 -->
      <TopNavigation />

      <!-- 主要内容区域 -->
      <main class="main-content flex-1 flex flex-col">
        <div class="content-wrapper flex-1 p-4 md:p-6">
          <LayoutContent />
        </div>

        <!-- 页脚 -->
        <LayoutFooter />
      </main>
    </div>
  </naive-provider>
</template>

<style scoped>
.top-nav-layout {
  background-color: var(--body-color);
  transition: background-color 0.3s ease;
}

.main-content {
  margin-top: 80px; /* 为固定导航栏预留空间 */
  min-height: calc(100vh - 80px);
}

.content-wrapper {
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
}

/* 深色模式适配 */
.dark .top-nav-layout {
  background-color: #1a1a1a;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .content-wrapper {
    padding: 16px;
  }

  .main-content {
    min-height: calc(100vh - 70px); /* 移动端导航栏高度调整 */
  }
}
</style>
