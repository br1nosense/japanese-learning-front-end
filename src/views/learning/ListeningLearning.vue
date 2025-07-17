<script lang="ts" setup>
import { Icon } from '@iconify/vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

// 获取课程信息
const courseInfo = computed(() => {
  const query = route.query
  return {
    courseId: query.courseId as string || '',
    level: query.level as string || 'beginner',
    title: query.title as string || '听力学习',
    description: query.description as string || '',
    category: query.category as string || 'listening',
    lessons: parseInt(query.lessons as string || '0'),
    duration: query.duration as string || '',
    tags: query.tags ? (query.tags as string).split(',') : [],
    price: query.price as string || 'free',
    focus: query.focus as string || 'general',
    type: query.type as string || ''
  }
})

// 模拟听力练习数据
const listeningExercises = ref([
  {
    id: '1',
    title: '日常问候',
    description: '学习基本的日语问候用语',
    audioUrl: '/audio/greeting.mp3',
    transcript: 'こんにちは。元気ですか？',
    translation: '你好。你好吗？',
    level: 'N5',
    duration: '30秒',
    questions: [
      {
        question: '说话者在问什么？',
        options: ['姓名', '身体状况', '年龄', '职业'],
        correctAnswer: 1
      }
    ]
  },
  {
    id: '2',
    title: '自我介绍',
    description: '听懂基本的自我介绍内容',
    audioUrl: '/audio/introduction.mp3',
    transcript: '私は田中です。よろしくお願いします。',
    translation: '我是田中。请多关照。',
    level: 'N5',
    duration: '25秒',
    questions: [
      {
        question: '说话者的姓氏是什么？',
        options: ['佐藤', '田中', '山田', '鈴木'],
        correctAnswer: 1
      }
    ]
  }
])

// 当前练习索引
const currentIndex = ref(0)
const isPlaying = ref(false)
const showTranscript = ref(false)
const showTranslation = ref(false)
const selectedAnswer = ref<number | null>(null)
const showResult = ref(false)

// 学习统计
const stats = ref({
  totalExercises: listeningExercises.value.length,
  completedExercises: 0,
  correctAnswers: 0,
  accuracy: 0
})

// 当前练习
const currentExercise = computed(() => listeningExercises.value[currentIndex.value])

// 是否是最后一个练习
const isLastExercise = computed(() => currentIndex.value >= listeningExercises.value.length - 1)

// 播放音频
function playAudio() {
  isPlaying.value = true
  // 模拟音频播放
  setTimeout(() => {
    isPlaying.value = false
  }, 3000)

  window.$message.info('音频播放中...')
}

// 显示原文
function toggleTranscript() {
  showTranscript.value = !showTranscript.value
}

// 显示翻译
function toggleTranslation() {
  showTranslation.value = !showTranslation.value
}

// 选择答案
function selectAnswer(index: number) {
  if (showResult.value) return

  selectedAnswer.value = index
  showResult.value = true

  // 更新统计
  stats.value.completedExercises++
  const isCorrect = index === currentExercise.value.questions[0].correctAnswer
  if (isCorrect) {
    stats.value.correctAnswers++
  }

  // 更新准确率
  stats.value.accuracy = Math.round((stats.value.correctAnswers / stats.value.completedExercises) * 100)
}

// 下一个练习
function nextExercise() {
  if (isLastExercise.value) {
    window.$message.success(`听力练习完成！正确率：${stats.value.accuracy}%`)
    return
  }

  currentIndex.value++
  selectedAnswer.value = null
  showResult.value = false
  showTranscript.value = false
  showTranslation.value = false
}

// 上一个练习
function prevExercise() {
  if (currentIndex.value > 0) {
    currentIndex.value--
    selectedAnswer.value = null
    showResult.value = false
    showTranscript.value = false
    showTranslation.value = false
  }
}

// 重新开始
function restart() {
  currentIndex.value = 0
  selectedAnswer.value = null
  showResult.value = false
  showTranscript.value = false
  showTranslation.value = false
  stats.value.completedExercises = 0
  stats.value.correctAnswers = 0
  stats.value.accuracy = 0
}

// 进入普通模式
function enterNormalMode() {
  // 保存当前学习状态
  const currentState = {
    currentIndex: currentIndex.value,
    selectedAnswer: selectedAnswer.value,
    showResult: showResult.value,
    showTranscript: showTranscript.value,
    showTranslation: showTranslation.value,
    stats: { ...stats.value }
  }

  // 将状态保存到sessionStorage，以便在普通模式中恢复
  sessionStorage.setItem('listeningLearningState', JSON.stringify(currentState))

  // 跳转到普通模式
  router.push('/normal-learning/listening')
}

// 获取选项样式
function getOptionType(index: number) {
  if (!showResult.value) return 'default'

  if (index === currentExercise.value.questions[0].correctAnswer) {
    return 'success'
  } else if (index === selectedAnswer.value && index !== currentExercise.value.questions[0].correctAnswer) {
    return 'error'
  }

  return 'default'
}

// 恢复学习状态（从普通模式返回时）
function restoreLearningState() {
  const savedState = sessionStorage.getItem('listeningLearningState')
  if (savedState) {
    try {
      const state = JSON.parse(savedState)
      currentIndex.value = state.currentIndex || 0
      selectedAnswer.value = state.selectedAnswer || null
      showResult.value = state.showResult || false
      showTranscript.value = state.showTranscript || false
      showTranslation.value = state.showTranslation || false
      if (state.stats) {
        stats.value = { ...stats.value, ...state.stats }
      }
      // 清除保存的状态
      sessionStorage.removeItem('listeningLearningState')
      console.log('听力学习状态已恢复')
    } catch (error) {
      console.error('恢复听力学习状态失败:', error)
    }
  }
}

// 组件挂载时恢复状态
onMounted(() => {
  restoreLearningState()
})
</script>

<template>
  <div class="listening-learning-page">
    <!-- 头部信息 -->
    <n-card class="header-section mb-6 rounded-16px" content-style="padding: 24px;">
      <div class="flex items-center justify-between">
        <div>
          <n-h2 class="mb-2">
            <Icon icon="tabler:headphones" class="mr-2" />
            听力练习
          </n-h2>
          <n-text depth="3">
            通过听力练习提高日语听力理解能力
          </n-text>
        </div>

        <div class="stats-info">
          <div class="stat-item">
            <n-statistic label="总练习" :value="stats.totalExercises" />
          </div>
          <div class="stat-item">
            <n-statistic label="已完成" :value="stats.completedExercises" />
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
        <n-text class="text-sm">练习进度：</n-text>
        <n-progress
          type="line"
          :percentage="(currentIndex / stats.totalExercises) * 100"
          :show-indicator="false"
          class="flex-1"
        />
        <n-text class="text-sm">{{ currentIndex + 1 }} / {{ stats.totalExercises }}</n-text>
      </div>
    </n-card>

    <!-- 听力练习卡片 -->
    <n-card class="exercise-section mb-6 rounded-16px" content-style="padding: 32px;">
      <div v-if="currentExercise" class="exercise-content">
        <!-- 练习信息 -->
        <div class="exercise-header mb-6">
          <div class="flex items-center justify-between">
            <n-tag :type="currentExercise.level === 'N5' ? 'success' : 'info'" size="small">
              {{ currentExercise.level }}
            </n-tag>
            <n-text depth="3" class="text-sm">{{ currentExercise.duration }}</n-text>
          </div>
          <n-h3 class="mt-4 mb-2">{{ currentExercise.title }}</n-h3>
          <n-text depth="3">{{ currentExercise.description }}</n-text>
        </div>

        <!-- 音频播放区域 -->
        <div class="audio-section mb-8">
          <div class="audio-player">
            <n-button
              size="large"
              type="primary"
              circle
              :loading="isPlaying"
              @click="playAudio"
              class="play-button"
            >
              <Icon icon="tabler:play" class="text-24px" />
            </n-button>
            <div class="audio-info ml-4">
              <n-text class="block font-medium">点击播放音频</n-text>
              <n-text depth="3" class="text-sm">可以重复播放多次</n-text>
            </div>
          </div>
        </div>

        <!-- 辅助功能 -->
        <div class="helper-section mb-6">
          <n-space>
            <n-button @click="toggleTranscript" :type="showTranscript ? 'primary' : 'default'">
              <Icon icon="tabler:file-text" class="mr-1" />
              {{ showTranscript ? '隐藏原文' : '显示原文' }}
            </n-button>
            <n-button @click="toggleTranslation" :type="showTranslation ? 'primary' : 'default'">
              <Icon icon="tabler:language" class="mr-1" />
              {{ showTranslation ? '隐藏翻译' : '显示翻译' }}
            </n-button>
          </n-space>

          <!-- 原文显示 -->
          <div v-if="showTranscript" class="transcript mt-4 p-4 bg-blue-50 rounded-lg">
            <n-text class="font-medium">原文：</n-text>
            <n-text class="block mt-2 text-lg">{{ currentExercise.transcript }}</n-text>
          </div>

          <!-- 翻译显示 -->
          <div v-if="showTranslation" class="translation mt-4 p-4 bg-green-50 rounded-lg">
            <n-text class="font-medium">翻译：</n-text>
            <n-text class="block mt-2">{{ currentExercise.translation }}</n-text>
          </div>
        </div>

        <!-- 问题 -->
        <div class="question-section">
          <n-h4 class="mb-4">{{ currentExercise.questions[0].question }}</n-h4>
          <n-grid :cols="2" :x-gap="16" :y-gap="16">
            <n-grid-item v-for="(option, index) in currentExercise.questions[0].options" :key="index">
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

        <!-- 结果显示 -->
        <div v-if="showResult" class="result-section mt-6">
          <n-alert
            :type="selectedAnswer === currentExercise.questions[0].correctAnswer ? 'success' : 'error'"
            :title="selectedAnswer === currentExercise.questions[0].correctAnswer ? '回答正确！' : '回答错误'"
            class="mb-4"
          >
            正确答案是：{{ currentExercise.questions[0].options[currentExercise.questions[0].correctAnswer] }}
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
          @click="prevExercise"
        >
          <Icon icon="tabler:arrow-left" class="mr-1" />
          上一个
        </n-button>

        <n-button
          size="large"
          type="primary"
          :disabled="!showResult"
          @click="nextExercise"
        >
          {{ isLastExercise ? '完成练习' : '下一个' }}
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
  </div>
</template>

<style scoped>
.listening-learning-page {
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

.exercise-content {
  text-align: center;
}

.audio-player {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px;
  background: var(--hover-color);
  border-radius: 16px;
  border: 2px dashed var(--primary-color);
}

.play-button {
  width: 80px;
  height: 80px;
}

.audio-info {
  text-align: left;
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

@media (max-width: 768px) {
  .header-section .flex {
    flex-direction: column;
    gap: 16px;
    text-align: center;
  }

  .stats-info {
    gap: 16px;
  }

  .audio-player {
    flex-direction: column;
    gap: 16px;
    padding: 24px;
  }

  .audio-info {
    text-align: center;
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
