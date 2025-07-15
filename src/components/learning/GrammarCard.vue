<script lang="ts" setup>
import { Icon } from '@iconify/vue'
import type { GrammarPoint } from '@/types/learning'

interface Props {
  grammarPoint: GrammarPoint
  visible: boolean
}

interface Emits {
  (e: 'close'): void
  (e: 'update:visible', value: boolean): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// 获取难度颜色
function getDifficultyColor(difficulty: number) {
  const colors: Record<number, 'default' | 'error' | 'info' | 'success' | 'warning' | 'primary'> = {
    1: 'success',
    2: 'info',
    3: 'warning',
    4: 'error',
    5: 'error'
  }
  return colors[difficulty] || 'default'
}

// 关闭卡片
function handleClose() {
  emit('update:visible', false)
  emit('close')
}
</script>

<template>
  <n-drawer
    :show="visible"
    :width="400"
    placement="right"
    @update:show="handleClose"
  >
    <n-drawer-content title="语法解释" closable>
      <div class="grammar-card">
        <!-- 语法点标题 -->
        <div class="grammar-header mb-4">
          <div class="flex items-center justify-between mb-2">
            <n-h3 class="mb-0">{{ grammarPoint.title }}</n-h3>
            <div class="tags">
              <n-tag :type="getDifficultyColor(grammarPoint.difficulty)" size="small">
                {{ grammarPoint.level }}
              </n-tag>
            </div>
          </div>

          <!-- 语法结构 -->
          <div class="grammar-structure">
            <n-text depth="2" class="text-sm">语法结构：</n-text>
            <n-code :code="grammarPoint.structure" language="text" class="mt-1" />
          </div>
        </div>

        <!-- 用法说明 -->
        <div class="grammar-description mb-4">
          <n-h4>
            <Icon icon="tabler:info-circle" class="mr-2" />
            用法说明
          </n-h4>
          <n-text class="leading-relaxed">{{ grammarPoint.description }}</n-text>
        </div>

        <!-- 例句 -->
        <div class="grammar-examples mb-4" v-if="grammarPoint.examples.length > 0">
          <n-h4>
            <Icon icon="tabler:quote" class="mr-2" />
            例句
          </n-h4>
          <div class="examples-list">
            <div
              v-for="(example, index) in grammarPoint.examples"
              :key="index"
              class="example-item"
            >
              <div class="example-japanese">{{ example.japanese }}</div>
              <div class="example-romaji">{{ example.romaji }}</div>
              <div class="example-meaning">{{ example.meaning }}</div>
            </div>
          </div>
        </div>

        <!-- 使用场景 -->
        <div class="usage-scenes" v-if="grammarPoint.usageScenes.length > 0">
          <n-h4>
            <Icon icon="tabler:bulb" class="mr-2" />
            使用场景
          </n-h4>
          <div class="scenes-list">
            <n-tag
              v-for="scene in grammarPoint.usageScenes"
              :key="scene"
              size="small"
              type="info"
              :bordered="false"
              class="mr-2 mb-2"
            >
              {{ scene }}
            </n-tag>
          </div>
        </div>

        <!-- 难度指示 -->
        <div class="difficulty-indicator mt-6">
          <n-text depth="3" class="text-sm">难度等级：</n-text>
          <n-rate
            :value="grammarPoint.difficulty"
            readonly
            size="small"
            :count="5"
            class="ml-2"
          />
        </div>
      </div>
    </n-drawer-content>
  </n-drawer>
</template>

<style scoped>
.grammar-card {
  padding: 4px;
}

.grammar-structure {
  background: var(--hover-color);
  padding: 12px;
  border-radius: 8px;
  border-left: 4px solid var(--primary-color);
}

.examples-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.example-item {
  padding: 16px;
  background: var(--hover-color);
  border-radius: 8px;
  border: 1px solid var(--border-color);
}

.example-japanese {
  font-size: 16px;
  font-weight: bold;
  color: var(--text-color);
  margin-bottom: 4px;
}

.example-romaji {
  font-size: 14px;
  color: var(--text-color-secondary);
  margin-bottom: 4px;
  font-style: italic;
}

.example-meaning {
  font-size: 14px;
  color: var(--text-color-secondary);
}

.scenes-list {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.difficulty-indicator {
  display: flex;
  align-items: center;
  padding: 12px;
  background: var(--hover-color);
  border-radius: 8px;
}

.tags {
  display: flex;
  gap: 8px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  :deep(.n-drawer) {
    width: 100% !important;
  }
}
</style>
