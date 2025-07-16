<script lang="ts" setup>
import { Icon } from '@iconify/vue'
import GrammarCard from '@/components/learning/GrammarCard.vue'
import { LearningDataManager } from '@/utils/learning'
import type { GrammarQuestion, GrammarProgress } from '@/types/learning'
import ImmersiveLearningLayout from '@/layouts/ImmersiveLearningLayout.vue'

const dataManager = LearningDataManager.getInstance()

// 模拟语法题目数据
const questions = ref<GrammarQuestion[]>([
  {
    id: '1',
    sentence: '私は毎日学校___行きます。',
    options: ['に', 'を', 'で', 'と'],
    correctAnswer: 0,
    explanation: '「に」表示移动的目的地或方向。',
    level: 'N5',
    grammarPoint: {
      id: 'particle-ni',
      title: '助词「に」的用法',
      description: '「に」是日语中最常用的助词之一，主要表示时间、地点、方向、目的等。在这个句子中，「に」表示移动的目的地。',
      structure: '名词 + に + 动词',
      examples: [
        {
          japanese: '学校に行きます。',
          romaji: 'Gakkou ni ikimasu.',
          meaning: '去学校。'
        },
        {
          japanese: '家に帰ります。',
          romaji: 'Ie ni kaerimasu.',
          meaning: '回家。'
        }
      ],
      level: 'N5',
      difficulty: 2,
      usageScenes: ['表示目的地', '表示时间', '表示对象']
    }
  },
  {
    id: '2',
    sentence: '昨日友達___映画を見ました。',
    options: ['に', 'と', 'で', 'を'],
    correctAnswer: 1,
    explanation: '「と」表示一起做某事的对象。',
    level: 'N5',
    grammarPoint: {
      id: 'particle-to',
      title: '助词「と」的用法',
      description: '「と」表示"和"、"与"的意思，用于连接名词或表示一起行动的对象。',
      structure: '名词 + と + 动词',
      examples: [
        {
          japanese: '友達と映画を見ます。',
          romaji: 'Tomodachi to eiga wo mimasu.',
          meaning: '和朋友看电影。'
        }
      ],
      level: 'N5',
      difficulty: 2,
      usageScenes: ['表示共同行动', '连接名词', '表示对话对象']
    }
  }
])

// 当前题目索引
const currentIndex = ref(0)
const selectedAnswer = ref<number | null>(null)
const showResult = ref(false)
const showGrammarCard = ref(false)

// 学习统计
const stats = ref({
  totalQuestions: questions.value.length,
  answeredQuestions: 0,
  correctAnswers: 0,
  accuracy: 0
})

// 进度数据
const progressMap = ref<Map<string, GrammarProgress>>(new Map())

// 当前题目
const currentQuestion = computed(() => questions.value[currentIndex.value])

// 是否是最后一题
const isLastQuestion = computed(() => currentIndex.value >= questions.value.length - 1)

// 选择答案
function selectAnswer(index: number) {
  if (showResult.value) return

  selectedAnswer.value = index
  showResult.value = true

  // 更新统计
  stats.value.answeredQuestions++
  const isCorrect = index === currentQuestion.value.correctAnswer
  if (isCorrect) {
    stats.value.correctAnswers++
  }

  // 更新准确率
  stats.value.accuracy = Math.round((stats.value.correctAnswers / stats.value.answeredQuestions) * 100)

  // 更新进度
  updateProgress(currentQuestion.value.id, isCorrect)

  // 自动显示语法解释
  setTimeout(() => {
    showGrammarCard.value = true
  }, 1000)
}

// 下一题
function nextQuestion() {
  if (isLastQuestion.value) {
    // 学习完成
    window.$message.success(`学习完成！正确率：${stats.value.accuracy}%`)
    return
  }

  currentIndex.value++
  selectedAnswer.value = null
  showResult.value = false
  showGrammarCard.value = false
}

// 上一题
function prevQuestion() {
  if (currentIndex.value > 0) {
    currentIndex.value--
    selectedAnswer.value = null
    showResult.value = false
    showGrammarCard.value = false
  }
}

// 重新开始
function restart() {
  currentIndex.value = 0
  selectedAnswer.value = null
  showResult.value = false
  showGrammarCard.value = false
  stats.value.answeredQuestions = 0
  stats.value.correctAnswers = 0
  stats.value.accuracy = 0
}

// 显示语法解释
function showGrammar() {
  showGrammarCard.value = true
}

// 更新学习进度
async function updateProgress(questionId: string, isCorrect: boolean) {
  const existing = progressMap.value.get(questionId)

  if (existing) {
    existing.attempts++
    if (isCorrect) existing.isCorrect = true
    existing.lastAttemptDate = new Date()
    existing.masteryLevel = Math.min(100, existing.masteryLevel + (isCorrect ? 25 : -10))

    await dataManager.updateGrammarProgress(questionId, existing)
  } else {
    const newProgress: GrammarProgress = {
      questionId,
      isCorrect,
      attempts: 1,
      lastAttemptDate: new Date(),
      masteryLevel: isCorrect ? 25 : 0
    }
    progressMap.value.set(questionId, newProgress)

    await dataManager.updateGrammarProgress(questionId, newProgress)
  }
}

// 加载进度
async function loadProgress() {
  try {
    progressMap.value = await dataManager.getGrammarProgress()
  } catch (error) {
    console.error('Failed to load grammar progress:', error)
    window.$message.error('加载语法学习进度失败')
  }
}

// 获取选项样式
function getOptionType(index: number) {
  if (!showResult.value) return 'default'

  if (index === currentQuestion.value.correctAnswer) {
    return 'success'
  } else if (index === selectedAnswer.value && index !== currentQuestion.value.correctAnswer) {
    return 'error'
  }

  return 'default'
}

// 组件挂载时加载进度
onMounted(async () => {
  await loadProgress()
})
</script>

<template>
  <div class="grammar-learning-page">
    <!-- 头部信息 -->
    <n-card class="header-section mb-6 rounded-16px" content-style="padding: 24px;">
      <div class="flex items-center justify-between">
        <div>
          <n-h2 class="mb-2">
            <Icon icon="tabler:grammar" class="mr-2" />
            语法学习
          </n-h2>
          <n-text depth="3">
            通过选择题练习日语语法，掌握助词和语法结构
          </n-text>
        </div>

        <div class="stats-info">
          <div class="stat-item">
            <n-statistic label="总题数" :value="stats.totalQuestions" />
          </div>
          <div class="stat-item">
            <n-statistic label="已答题" :value="stats.answeredQuestions" />
          </div>
          <div class="stat-item">
            <n-statistic label="正确率" :value="stats.accuracy" suffix="%" />
          </div>
        </div>
      </div>
    </n-card>

    <!-- 进度条 -->
    <n-card class="progress-section mb-6 rounded-16px" content-style="padding: 16px;">
      <div class="flex items-center gap-4">
        <n-text class="text-sm">答题进度：</n-text>
        <n-progress
          type="line"
          :percentage="(currentIndex / stats.totalQuestions) * 100"
          :show-indicator="false"
          class="flex-1"
        />
        <n-text class="text-sm">{{ currentIndex + 1 }} / {{ stats.totalQuestions }}</n-text>
      </div>
    </n-card>

    <!-- 题目卡片 -->
    <n-card class="question-section mb-6 rounded-16px" content-style="padding: 32px;">
      <div v-if="currentQuestion" class="question-content">
        <!-- 题目信息 -->
        <div class="question-header mb-6">
          <div class="flex items-center justify-between">
            <n-tag :type="currentQuestion.level === 'N5' ? 'success' : 'info'" size="small">
              {{ currentQuestion.level }}
            </n-tag>
            <n-button text @click="showGrammar">
              <Icon icon="tabler:help-circle" class="mr-1" />
              查看语法解释
            </n-button>
          </div>
        </div>

        <!-- 句子 -->
        <div class="sentence mb-8">
          <n-h3 class="text-center">{{ currentQuestion.sentence }}</n-h3>
        </div>

        <!-- 选项 -->
        <div class="options mb-6">
          <n-grid :cols="2" :x-gap="16" :y-gap="16">
            <n-grid-item v-for="(option, index) in currentQuestion.options" :key="index">
              <n-button
                block
                size="large"
                :type="getOptionType(index)"
                :disabled="showResult"
                @click="selectAnswer(index)"
                class="option-button"
              >
                {{ String.fromCharCode(65 + index) }}. {{ option }}
              </n-button>
            </n-grid-item>
          </n-grid>
        </div>

        <!-- 结果解释 -->
        <div v-if="showResult" class="result-section">
          <n-alert
            :type="selectedAnswer === currentQuestion.correctAnswer ? 'success' : 'error'"
            :title="selectedAnswer === currentQuestion.correctAnswer ? '回答正确！' : '回答错误'"
            class="mb-4"
          >
            {{ currentQuestion.explanation }}
          </n-alert>
        </div>
      </div>
    </n-card>

    <!-- 控制按钮 -->
    <n-card class="controls-section rounded-16px" content-style="padding: 24px;">
      <div class="flex items-center justify-center gap-4">
        <n-button
          size="large"
          :disabled="currentIndex === 0"
          @click="prevQuestion"
        >
          <Icon icon="tabler:arrow-left" class="mr-1" />
          上一题
        </n-button>

        <n-button
          size="large"
          type="primary"
          :disabled="!showResult"
          @click="nextQuestion"
        >
          {{ isLastQuestion ? '完成学习' : '下一题' }}
          <Icon icon="tabler:arrow-right" class="ml-1" />
        </n-button>

        <n-button
          size="large"
          type="warning"
          @click="restart"
        >
          <Icon icon="tabler:refresh" class="mr-1" />
          重新开始
        </n-button>
      </div>
    </n-card>

    <!-- 语法解释卡片 -->
    <GrammarCard
      v-if="currentQuestion"
      :grammar-point="currentQuestion.grammarPoint"
      :visible="showGrammarCard"
      @close="showGrammarCard = false"
    />
  </div>
</template>

<style scoped>
.grammar-learning-page {
  max-width: 800px;
  margin: 0 auto;
}

.stats-info {
  display: flex;
  gap: 24px;
}

.stat-item {
  text-align: center;
}

.question-content {
  text-align: center;
}

.sentence {
  font-size: 24px;
  font-weight: bold;
  color: var(--primary-color);
  padding: 20px;
  background: var(--hover-color);
  border-radius: 12px;
  border: 2px dashed var(--primary-color);
}

.option-button {
  height: 60px;
  font-size: 16px;
  transition: all 0.3s ease;
}

.option-button:hover {
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .header-section .flex {
    flex-direction: column;
    gap: 16px;
    text-align: center;
  }

  .stats-info {
    gap: 16px;
  }

  .sentence {
    font-size: 20px;
    padding: 16px;
  }

  .controls-section .flex {
    flex-wrap: wrap;
    gap: 8px;
  }

  .controls-section .n-button {
    flex: 1;
    min-width: 120px;
  }
}
</style>
