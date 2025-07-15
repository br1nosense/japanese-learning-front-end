<script lang="ts" setup>
import { Icon } from '@iconify/vue'
import type { Word, WordProgress } from '@/types/learning'

interface Props {
  word: Word
  progress?: WordProgress
  showAnswer?: boolean
}

interface Emits {
  (e: 'know'): void
  (e: 'unknown'): void
  (e: 'favorite'): void
  (e: 'flip'): void
}

const props = withDefaults(defineProps<Props>(), {
  showAnswer: false
})

const emit = defineEmits<Emits>()

const isFlipped = ref(props.showAnswer)
const cardRef = ref<HTMLElement>()

// 翻转卡片
function flipCard() {
  isFlipped.value = !isFlipped.value
  emit('flip')
}

// 处理认识/不认识
function handleKnow() {
  emit('know')
}

function handleUnknown() {
  emit('unknown')
}

// 处理收藏
function handleFavorite() {
  emit('favorite')
}

// 获取难度颜色
function getDifficultyColor(difficulty: number) {
  const colors = {
    1: 'success',
    2: 'info', 
    3: 'warning',
    4: 'error',
    5: 'error'
  }
  return colors[difficulty] || 'default'
}

// 监听showAnswer变化
watch(() => props.showAnswer, (newVal) => {
  isFlipped.value = newVal
})
</script>

<template>
  <div class="word-card-container">
    <div 
      ref="cardRef"
      class="word-card"
      :class="{ 'flipped': isFlipped }"
      @click="flipCard"
    >
      <!-- 卡片正面 -->
      <div class="card-face card-front">
        <div class="card-header">
          <n-tag :type="getDifficultyColor(word.difficulty)" size="small">
            {{ word.level }}
          </n-tag>
          <n-button
            text
            size="small"
            :type="progress?.isFavorite ? 'warning' : 'default'"
            @click.stop="handleFavorite"
          >
            <Icon 
              :icon="progress?.isFavorite ? 'tabler:heart-filled' : 'tabler:heart'" 
              class="text-16px"
            />
          </n-button>
        </div>
        
        <div class="card-content">
          <!-- 罗马音 -->
          <div class="romaji">{{ word.romaji }}</div>
          
          <!-- 日语单词 -->
          <div class="japanese-word">
            <div class="hiragana">{{ word.japanese }}</div>
            <div v-if="word.kanji" class="kanji">{{ word.kanji }}</div>
          </div>
          
          <!-- 分类 -->
          <div class="category">
            <n-tag size="small" type="info" :bordered="false">
              {{ word.category }}
            </n-tag>
          </div>
        </div>
        
        <div class="card-footer">
          <div class="flip-hint">
            <Icon icon="tabler:click" class="text-12px mr-1" />
            <span class="text-12px">点击翻转查看释义</span>
          </div>
        </div>
      </div>
      
      <!-- 卡片背面 -->
      <div class="card-face card-back">
        <div class="card-header">
          <n-tag :type="getDifficultyColor(word.difficulty)" size="small">
            {{ word.level }}
          </n-tag>
          <div class="mastery-level" v-if="progress">
            <Icon icon="tabler:brain" class="text-14px mr-1" />
            <span class="text-12px">{{ progress.masteryLevel }}%</span>
          </div>
        </div>
        
        <div class="card-content">
          <!-- 中文释义 -->
          <div class="meaning">{{ word.meaning }}</div>
          
          <!-- 例句 -->
          <div class="examples" v-if="word.examples.length > 0">
            <div class="example-title">例句：</div>
            <div 
              v-for="(example, index) in word.examples.slice(0, 2)" 
              :key="index"
              class="example-item"
            >
              <div class="example-japanese">{{ example.japanese }}</div>
              <div class="example-romaji">{{ example.romaji }}</div>
              <div class="example-meaning">{{ example.meaning }}</div>
            </div>
          </div>
        </div>
        
        <div class="card-footer">
          <div class="action-buttons">
            <n-button size="small" type="error" @click.stop="handleUnknown">
              <Icon icon="tabler:x" class="mr-1" />
              不认识
            </n-button>
            <n-button size="small" type="success" @click.stop="handleKnow">
              <Icon icon="tabler:check" class="mr-1" />
              认识
            </n-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.word-card-container {
  perspective: 1000px;
  width: 100%;
  max-width: 400px;
  height: 300px;
  margin: 0 auto;
}

.word-card {
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  transition: transform 0.6s ease;
  cursor: pointer;
}

.word-card.flipped {
  transform: rotateY(180deg);
}

.card-face {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  border-radius: 16px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  background: var(--card-color);
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow-2);
}

.card-front {
  background: linear-gradient(135deg, var(--card-color) 0%, var(--sakura-light-gradient) 100%);
}

.card-back {
  transform: rotateY(180deg);
  background: linear-gradient(135deg, var(--card-color) 0%, var(--sakura-light-gradient) 100%);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.card-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.card-footer {
  margin-top: 16px;
}

/* 正面样式 */
.romaji {
  font-size: 14px;
  color: var(--text-color-secondary);
  margin-bottom: 8px;
}

.japanese-word {
  margin-bottom: 16px;
}

.hiragana {
  font-size: 32px;
  font-weight: bold;
  color: var(--primary-color);
  margin-bottom: 4px;
}

.kanji {
  font-size: 24px;
  color: var(--text-color);
}

.category {
  margin-top: 8px;
}

.flip-hint {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-color-secondary);
}

/* 背面样式 */
.meaning {
  font-size: 20px;
  font-weight: bold;
  color: var(--text-color);
  margin-bottom: 20px;
  line-height: 1.4;
}

.examples {
  width: 100%;
  text-align: left;
}

.example-title {
  font-size: 14px;
  font-weight: bold;
  color: var(--text-color-secondary);
  margin-bottom: 8px;
}

.example-item {
  margin-bottom: 12px;
  padding: 8px;
  background: var(--hover-color);
  border-radius: 8px;
}

.example-japanese {
  font-size: 14px;
  color: var(--text-color);
  margin-bottom: 2px;
}

.example-romaji {
  font-size: 12px;
  color: var(--text-color-secondary);
  margin-bottom: 2px;
}

.example-meaning {
  font-size: 12px;
  color: var(--text-color-secondary);
}

.action-buttons {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.mastery-level {
  display: flex;
  align-items: center;
  color: var(--text-color-secondary);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .word-card-container {
    height: 280px;
  }
  
  .card-face {
    padding: 16px;
  }
  
  .hiragana {
    font-size: 28px;
  }
  
  .kanji {
    font-size: 20px;
  }
  
  .meaning {
    font-size: 18px;
  }
}
</style>
