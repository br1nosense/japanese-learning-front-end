<script lang="ts" setup>
import { Icon } from '@iconify/vue'
import { useI18n } from 'vue-i18n'
import GrammarCard from '@/components/learning/GrammarCard.vue'
import { LearningDataManager } from '@/utils/learning'
import type { GrammarQuestion, GrammarProgress } from '@/types/learning'
import ImmersiveLearningLayout from '@/layouts/ImmersiveLearningLayout.vue'

const { t } = useI18n()
const router = useRouter()

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

// 沉浸式学习事件处理
function handleSettings() {
  console.log('打开设置面板')
}

function handleReset() {
  // 重置当前学习进度
  currentIndex.value = 0
  selectedAnswer.value = null
  showResult.value = false
  stats.value = {
    totalQuestions: questions.value.length,
    answeredQuestions: 0,
    accuracy: 0
  }

  // 清除本地存储的进度
  questions.value.forEach(question => {
    dataManager.removeGrammarProgress(question.id)
  })

  loadProgress()
  window.$message.success(t('immersive.progressReset'))
}

function handleFullscreen() {
  console.log('切换全屏模式')
}

function handleExit() {
  // 保存当前进度
  if (currentQuestion.value) {
    dataManager.saveGrammarProgress(currentQuestion.value.id, {
      questionId: currentQuestion.value.id,
      isCorrect: selectedAnswer.value === currentQuestion.value.correctAnswer,
      attempts: 1,
      lastAttemptDate: new Date()
    })
  }

  // 返回课程列表
  router.push('/courses')
}

// 进入普通模式
function enterNormalMode() {
  // 保存当前学习状态
  const currentState = {
    currentIndex: currentIndex.value,
    selectedAnswer: selectedAnswer.value,
    showResult: showResult.value,
    stats: { ...stats.value }
  }

  // 将状态保存到sessionStorage，以便在普通模式中恢复
  sessionStorage.setItem('grammarLearningState', JSON.stringify(currentState))

  // 跳转到普通模式
  router.push('/normal-learning/grammar')
}

// 组件挂载时加载进度
// 恢复学习状态（从专注模式返回时）
function restoreLearningState() {
  const savedState = sessionStorage.getItem('grammarLearningState')
  if (savedState) {
    try {
      const state = JSON.parse(savedState)
      currentIndex.value = state.currentIndex || 0
      selectedAnswer.value = state.selectedAnswer || null
      showResult.value = state.showResult || false
      if (state.stats) {
        stats.value = { ...stats.value, ...state.stats }
      }
      // 清除保存的状态
      sessionStorage.removeItem('grammarLearningState')
      console.log('语法学习状态已恢复')
    } catch (error) {
      console.error('恢复语法学习状态失败:', error)
    }
  }
}

onMounted(async () => {
  await loadProgress()

  // 检查是否需要恢复状态（从专注模式返回）
  restoreLearningState()
})
</script>

<template>
  <ImmersiveLearningLayout
    :title="t('learning.grammarLearning.title')"
    @settings="handleSettings"
    @reset="handleReset"
    @fullscreen="handleFullscreen"
    @exit="handleExit"
  >
    <!-- 主要学习内容 -->
    <div class="immersive-grammar-learning">
      <!-- 学习统计卡片 -->
      <n-card class="stats-card mb-6 rounded-16px" content-style="padding: 20px;">
        <div class="stats-grid">
          <div class="stat-item">
            <div class="stat-value">{{ stats.totalQuestions }}</div>
            <div class="stat-label">{{ t('learning.grammarLearning.totalQuestions') }}</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">{{ stats.answeredQuestions }}</div>
            <div class="stat-label">{{ t('learning.grammarLearning.answeredQuestions') }}</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">{{ stats.accuracy }}%</div>
            <div class="stat-label">{{ t('learning.grammarLearning.accuracy') }}</div>
          </div>
        </div>
      </n-card>

      <!-- 学习进度条 -->
      <n-card class="progress-card mb-6 rounded-16px" content-style="padding: 20px;">
        <div class="progress-header mb-3">
          <div class="flex items-center justify-between">
            <n-text strong>{{ t('stats.progress') }}</n-text>
            <n-text class="progress-text">{{ currentIndex + 1 }} / {{ stats.totalQuestions }}</n-text>
          </div>
        </div>
        <n-progress
          type="line"
          :percentage="stats.totalQuestions > 0 ? (currentIndex / stats.totalQuestions) * 100 : 0"
          :show-indicator="false"
          :height="12"
          border-radius="6px"
          color="var(--primary-color)"
        />
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
              {{ t('learning.grammarLearning.showExplanation') }}
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
            :title="selectedAnswer === currentQuestion.correctAnswer ? t('learning.grammarLearning.correct') : t('learning.grammarLearning.incorrect')"
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
          {{ t('learning.wordLearning.previous') }}
        </n-button>

        <n-button
          size="large"
          type="primary"
          :disabled="!showResult"
          @click="nextQuestion"
        >
          {{ isLastQuestion ? t('common.complete') : t('learning.grammarLearning.nextQuestion') }}
          <Icon icon="noto:right-arrow" class="ml-1" />
        </n-button>

        <!-- 进入普通模式按钮 -->
        <n-button
          size="large"
          type="default"
          class="normal-mode-btn"
          @click="enterNormalMode"
        >
          <Icon icon="noto:house" class="mr-1" />
          普通模式
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

    <!-- 自定义设置面板 -->
    <template #settings>
      <div class="learning-settings">
        <n-space vertical size="large">
          <!-- 字体大小设置 -->
          <div class="setting-item">
            <n-text strong>{{ t('immersive.settingsPanel.fontSize') }}</n-text>
            <n-slider
              :default-value="16"
              :min="12"
              :max="24"
              :step="2"
              :marks="{
                12: t('immersive.settingsPanel.fontSizes.small'),
                16: t('immersive.settingsPanel.fontSizes.medium'),
                20: t('immersive.settingsPanel.fontSizes.large'),
                24: t('immersive.settingsPanel.fontSizes.extraLarge')
              }"
            />
          </div>

          <!-- 音量设置 -->
          <div class="setting-item">
            <n-text strong>{{ t('immersive.settingsPanel.volume') }}</n-text>
            <n-slider
              :default-value="70"
              :min="0"
              :max="100"
              :step="10"
            />
          </div>

          <!-- 显示提示 -->
          <div class="setting-item">
            <n-space justify="space-between">
              <n-text strong>{{ t('immersive.settingsPanel.showHints') }}</n-text>
              <n-switch :default-value="true" />
            </n-space>
          </div>
        </n-space>
      </div>
    </template>
  </ImmersiveLearningLayout>
</template>

<style scoped>
/* 沉浸式语法学习模式样式 */
.immersive-grammar-learning {
  max-width: 900px;
  margin: 0 auto;
}

/* 统计卡片样式 */
.stats-card {
  background: var(--card-color);
  border: 1px solid var(--border-color);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  text-align: center;
}

.stat-item {
  padding: 16px 12px;
  border-radius: 12px;
  background: var(--hover-color);
  transition: all 0.3s ease;
}

.stat-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: var(--primary-color);
  margin-bottom: 4px;
}

.stat-label {
  font-size: 12px;
  color: var(--text-color-3);
  font-weight: 500;
}

/* 进度卡片样式 */
.progress-card {
  background: var(--card-color);
  border: 1px solid var(--border-color);
}

.progress-header {
  margin-bottom: 12px;
}

.progress-text {
  font-weight: 600;
  color: var(--primary-color);
}

/* 题目内容样式 */
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

/* 普通模式按钮特殊样式 */
.normal-mode-btn {
  background: var(--card-color);
  border: 2px solid var(--secondary-color);
  color: var(--secondary-color);
  box-shadow: var(--shadow-1);
  position: relative;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.normal-mode-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--secondary-color);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.normal-mode-btn:hover {
  background: var(--secondary-color);
  color: white;
  transform: translateY(-2px);
  box-shadow: var(--shadow-2);
}

.normal-mode-btn:hover::before {
  opacity: 0.1;
}

/* 设置面板样式 */
.learning-settings {
  padding: 16px 0;
}

.setting-item {
  padding: 12px 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }

  .stat-item {
    padding: 12px 8px;
  }

  .stat-value {
    font-size: 20px;
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

@media (max-width: 480px) {
  .stats-grid {
    grid-template-columns: 1fr;
    gap: 8px;
  }

  .sentence {
    font-size: 18px;
  }
}
</style>
