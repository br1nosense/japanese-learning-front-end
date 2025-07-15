<script lang="ts" setup>
import { Icon } from '@iconify/vue'
import WordCard from '@/components/learning/WordCard.vue'
import { LearningDataManager } from '@/utils/learning'
import type { Word, WordProgress } from '@/types/learning'

const dataManager = LearningDataManager.getInstance()

// 模拟单词数据
const words = ref<Word[]>([
  {
    id: '1',
    japanese: 'こんにちは',
    romaji: 'konnichiwa',
    meaning: '你好，下午好',
    examples: [
      {
        japanese: 'こんにちは、田中さん。',
        romaji: 'Konnichiwa, Tanaka-san.',
        meaning: '你好，田中先生。'
      },
      {
        japanese: 'こんにちは、元気ですか？',
        romaji: 'Konnichiwa, genki desu ka?',
        meaning: '你好，你好吗？'
      }
    ],
    level: 'N5',
    category: '问候语',
    difficulty: 1
  },
  {
    id: '2',
    japanese: 'ありがとう',
    romaji: 'arigatou',
    meaning: '谢谢',
    examples: [
      {
        japanese: 'ありがとうございます。',
        romaji: 'Arigatou gozaimasu.',
        meaning: '谢谢您。'
      }
    ],
    level: 'N5',
    category: '礼貌用语',
    difficulty: 1
  },
  {
    id: '3',
    japanese: 'がっこう',
    kanji: '学校',
    romaji: 'gakkou',
    meaning: '学校',
    examples: [
      {
        japanese: '学校に行きます。',
        romaji: 'Gakkou ni ikimasu.',
        meaning: '去学校。'
      }
    ],
    level: 'N5',
    category: '名词',
    difficulty: 2
  }
])

// 学习进度数据
const progressMap = ref<Map<string, WordProgress>>(new Map())

// 当前单词索引
const currentIndex = ref(0)
const showAnswer = ref(false)

// 功能模式
const showReviewMode = ref(false)
const showFavorites = ref(false)
const reviewWords = ref<string[]>([])
const favoriteWords = ref<string[]>([])

// 学习统计
const stats = ref({
  totalWords: words.value.length,
  studiedWords: 0,
  knownWords: 0,
  unknownWords: 0
})

// 当前单词
const currentWord = computed(() => words.value[currentIndex.value])

// 当前进度
const currentProgress = computed(() => progressMap.value.get(currentWord.value?.id))

// 是否是最后一个单词
const isLastWord = computed(() => currentIndex.value >= words.value.length - 1)

// 处理认识单词
function handleKnow() {
  if (!currentWord.value) return

  updateProgress(currentWord.value.id, true)
  stats.value.knownWords++
  nextWord()
}

// 处理不认识单词
function handleUnknown() {
  if (!currentWord.value) return

  updateProgress(currentWord.value.id, false)
  stats.value.unknownWords++
  nextWord()
}

// 处理收藏
async function handleFavorite() {
  if (!currentWord.value) return

  const progress = progressMap.value.get(currentWord.value.id)
  if (progress) {
    progress.isFavorite = !progress.isFavorite
    await dataManager.updateWordProgress(currentWord.value.id, progress)
  } else {
    const newProgress: WordProgress = {
      wordId: currentWord.value.id,
      isKnown: false,
      reviewCount: 0,
      correctCount: 0,
      lastReviewDate: new Date(),
      nextReviewDate: new Date(),
      masteryLevel: 0,
      isFavorite: true
    }
    progressMap.value.set(currentWord.value.id, newProgress)
    await dataManager.updateWordProgress(currentWord.value.id, newProgress)
  }
}

// 更新学习进度
async function updateProgress(wordId: string, isKnown: boolean) {
  const existing = progressMap.value.get(wordId)

  if (existing) {
    existing.isKnown = isKnown
    existing.reviewCount++
    if (isKnown) existing.correctCount++
    existing.lastReviewDate = new Date()
    existing.masteryLevel = Math.min(100, existing.masteryLevel + (isKnown ? 20 : -10))
    existing.nextReviewDate = dataManager.calculateNextReviewDate(existing.masteryLevel, isKnown)

    // 更新到后端
    await dataManager.updateWordProgress(wordId, existing)
  } else {
    const newProgress: WordProgress = {
      wordId,
      isKnown,
      reviewCount: 1,
      correctCount: isKnown ? 1 : 0,
      lastReviewDate: new Date(),
      nextReviewDate: dataManager.calculateNextReviewDate(isKnown ? 20 : 0, isKnown),
      masteryLevel: isKnown ? 20 : 0,
      isFavorite: false
    }
    progressMap.value.set(wordId, newProgress)

    // 更新到后端
    await dataManager.updateWordProgress(wordId, newProgress)
  }

  stats.value.studiedWords = progressMap.value.size
}

// 下一个单词
function nextWord() {
  showAnswer.value = false

  if (isLastWord.value) {
    // 学习完成
    window.$message.success('恭喜！本轮单词学习完成！')
    return
  }

  currentIndex.value++
}

// 上一个单词
function prevWord() {
  if (currentIndex.value > 0) {
    currentIndex.value--
    showAnswer.value = false
  }
}

// 重新开始
function restart() {
  currentIndex.value = 0
  showAnswer.value = false
  stats.value.studiedWords = 0
  stats.value.knownWords = 0
  stats.value.unknownWords = 0
}

// 加载进度数据
async function loadProgress() {
  try {
    progressMap.value = await dataManager.getWordProgress()
    stats.value.studiedWords = progressMap.value.size

    // 计算已知和未知单词数
    let known = 0, unknown = 0
    progressMap.value.forEach(progress => {
      if (progress.isKnown) known++
      else unknown++
    })
    stats.value.knownWords = known
    stats.value.unknownWords = unknown
  } catch (error) {
    console.error('Failed to load word progress:', error)
    window.$message.error('加载学习进度失败')
  }
}

// 翻转卡片
function handleFlip() {
  showAnswer.value = !showAnswer.value
}

// 获取需要复习的单词
async function getReviewWords() {
  try {
    reviewWords.value = await dataManager.getWordsForReview()
    return reviewWords.value
  } catch (error) {
    console.error('Failed to get review words:', error)
    return []
  }
}

// 获取收藏的单词
function getFavoriteWords() {
  const favorites: string[] = []
  progressMap.value.forEach((progress, wordId) => {
    if (progress.isFavorite) {
      favorites.push(wordId)
    }
  })
  favoriteWords.value = favorites
  return favorites
}

// 切换到复习模式
async function toggleReviewMode() {
  if (showReviewMode.value) {
    const reviewList = await getReviewWords()
    if (reviewList.length === 0) {
      window.$message.info('暂无需要复习的单词')
      showReviewMode.value = false
      return
    }
    window.$message.success(`找到 ${reviewList.length} 个需要复习的单词`)
  }
}

// 切换到收藏模式
function toggleFavoriteMode() {
  if (showFavorites.value) {
    const favorites = getFavoriteWords()
    if (favorites.length === 0) {
      window.$message.info('暂无收藏的单词')
      showFavorites.value = false
      return
    }
    window.$message.success(`找到 ${favorites.length} 个收藏的单词`)
  }
}

// 监听模式切换
watch(showReviewMode, (newVal) => {
  if (newVal) {
    showFavorites.value = false
    toggleReviewMode()
  }
})

watch(showFavorites, (newVal) => {
  if (newVal) {
    showReviewMode.value = false
    toggleFavoriteMode()
  }
})

// 组件挂载时加载进度
onMounted(async () => {
  await loadProgress()
  await getReviewWords()
  getFavoriteWords()
})
</script>

<template>
  <div class="word-learning-page">
    <!-- 头部信息 -->
    <n-card class="header-section mb-6 rounded-16px" content-style="padding: 24px;">
      <div class="flex items-center justify-between">
        <div>
          <n-h2 class="mb-2">
            <Icon icon="tabler:cards" class="mr-2" />
            单词学习
          </n-h2>
          <n-text depth="3">
            通过卡片翻转的方式学习日语单词
          </n-text>
        </div>

        <div class="stats-info">
          <div class="stat-item">
            <n-statistic label="总单词" :value="stats.totalWords" />
          </div>
          <div class="stat-item">
            <n-statistic label="已学习" :value="stats.studiedWords" />
          </div>
          <div class="stat-item">
            <n-statistic label="认识" :value="stats.knownWords" />
          </div>
          <div class="stat-item">
            <n-statistic label="不认识" :value="stats.unknownWords" />
          </div>
        </div>
      </div>
    </n-card>

    <!-- 进度条 -->
    <n-card class="progress-section mb-6 rounded-16px" content-style="padding: 20px;">
      <div class="progress-content">
        <!-- 主进度条 -->
        <div class="main-progress mb-4">
          <div class="flex items-center justify-between mb-2">
            <n-text class="text-sm font-medium">学习进度</n-text>
            <n-text class="text-sm">{{ currentIndex + 1 }} / {{ stats.totalWords }}</n-text>
          </div>
          <n-progress
            type="line"
            :percentage="(currentIndex / stats.totalWords) * 100"
            :show-indicator="false"
            :height="8"
            border-radius="4px"
          />
        </div>

        <!-- 详细统计 -->
        <div class="detailed-stats">
          <n-grid :cols="3" :x-gap="16">
            <n-grid-item>
              <div class="stat-item text-center">
                <n-progress
                  type="circle"
                  :percentage="stats.totalWords > 0 ? (stats.knownWords / stats.totalWords) * 100 : 0"
                  :stroke-width="8"
                  :size="60"
                  color="var(--success-color)"
                  class="mb-2"
                />
                <n-text depth="3" class="text-xs block">认识</n-text>
                <n-text class="text-sm font-medium">{{ stats.knownWords }}</n-text>
              </div>
            </n-grid-item>
            <n-grid-item>
              <div class="stat-item text-center">
                <n-progress
                  type="circle"
                  :percentage="stats.totalWords > 0 ? (stats.unknownWords / stats.totalWords) * 100 : 0"
                  :stroke-width="8"
                  :size="60"
                  color="var(--warning-color)"
                  class="mb-2"
                />
                <n-text depth="3" class="text-xs block">不认识</n-text>
                <n-text class="text-sm font-medium">{{ stats.unknownWords }}</n-text>
              </div>
            </n-grid-item>
            <n-grid-item>
              <div class="stat-item text-center">
                <n-progress
                  type="circle"
                  :percentage="stats.totalWords > 0 ? (stats.studiedWords / stats.totalWords) * 100 : 0"
                  :stroke-width="8"
                  :size="60"
                  color="var(--primary-color)"
                  class="mb-2"
                />
                <n-text depth="3" class="text-xs block">已学习</n-text>
                <n-text class="text-sm font-medium">{{ stats.studiedWords }}</n-text>
              </div>
            </n-grid-item>
          </n-grid>
        </div>
      </div>
    </n-card>

    <!-- 单词卡片 -->
    <div class="card-section mb-6">
      <WordCard
        v-if="currentWord"
        :word="currentWord"
        :progress="currentProgress"
        :show-answer="showAnswer"
        @know="handleKnow"
        @unknown="handleUnknown"
        @favorite="handleFavorite"
        @flip="handleFlip"
      />
    </div>

    <!-- 控制按钮 -->
    <n-card class="controls-section rounded-16px" content-style="padding: 24px;">
      <!-- 主要控制按钮 -->
      <div class="main-controls flex items-center justify-center gap-4 mb-4">
        <n-button
          size="large"
          :disabled="currentIndex === 0"
          @click="prevWord"
        >
          <Icon icon="tabler:arrow-left" class="mr-1" />
          上一个
        </n-button>

        <n-button
          size="large"
          type="primary"
          @click="handleFlip"
        >
          <Icon icon="tabler:refresh" class="mr-1" />
          翻转卡片
        </n-button>

        <n-button
          size="large"
          :disabled="isLastWord"
          @click="nextWord"
        >
          下一个
          <Icon icon="tabler:arrow-right" class="ml-1" />
        </n-button>
      </div>

      <!-- 辅助功能按钮 -->
      <div class="secondary-controls flex items-center justify-center gap-3">
        <n-button
          size="medium"
          @click="showReviewMode = !showReviewMode"
          :type="showReviewMode ? 'primary' : 'default'"
        >
          <Icon icon="tabler:repeat" class="mr-1" />
          智能复习
        </n-button>

        <n-button
          size="medium"
          @click="showFavorites = !showFavorites"
          :type="showFavorites ? 'primary' : 'default'"
        >
          <Icon icon="tabler:heart" class="mr-1" />
          收藏列表
        </n-button>

        <n-button
          size="medium"
          type="warning"
          @click="restart"
        >
          <Icon icon="tabler:refresh" class="mr-1" />
          重新开始
        </n-button>
      </div>
    </n-card>
  </div>
</template>

<style scoped>
.word-learning-page {
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

.card-section {
  display: flex;
  justify-content: center;
  min-height: 320px;
  align-items: center;
}

.progress-content {
  width: 100%;
}

.main-progress {
  background: var(--hover-color);
  padding: 16px;
  border-radius: 12px;
  border: 1px solid var(--border-color);
}

.detailed-stats {
  margin-top: 16px;
}

.stat-item {
  padding: 12px;
  background: var(--hover-color);
  border-radius: 8px;
  border: 1px solid var(--border-color);
  transition: all 0.3s ease;
}

.stat-item:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-2);
}

.main-controls {
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 16px;
}

.secondary-controls {
  padding-top: 16px;
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
