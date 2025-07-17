<script lang="ts" setup>
import { Icon } from '@iconify/vue'
import { useI18n } from 'vue-i18n'
import WordCard from '@/components/learning/WordCard.vue'
import { LearningDataManager } from '@/utils/learning'
import type { Word, WordProgress } from '@/types/learning'
import ImmersiveLearningLayout from '@/layouts/ImmersiveLearningLayout.vue'

const { t } = useI18n()

const dataManager = LearningDataManager.getInstance()
const router = useRouter()
const route = useRoute()

// 获取课程信息
const courseInfo = computed(() => {
  const query = route.query
  return {
    courseId: query.courseId as string || '',
    level: query.level as string || 'beginner',
    title: query.title as string || '单词学习',
    description: query.description as string || '',
    category: query.category as string || 'vocabulary',
    lessons: parseInt(query.lessons as string || '0'),
    duration: query.duration as string || '',
    tags: query.tags ? (query.tags as string).split(',') : [],
    price: query.price as string || 'free',
    focus: query.focus as string || 'general',
    type: query.type as string || ''
  }
})

// 沉浸式学习模式状态
const isImmersiveMode = ref(true) // 默认开启沉浸式模式
const learningSettings = ref({
  fontSize: 16,
  volume: 70,
  autoPlay: true,
  showHints: true
})

// 根据课程信息生成单词数据
function generateWordsForCourse(courseInfo: any): Word[] {
  const baseWords: Word[] = [
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
  ]

  // 根据课程类型和级别筛选和扩展单词
  const levelWords = {
    beginner: [
      {
        id: '4',
        japanese: 'たべる',
        kanji: '食べる',
        romaji: 'taberu',
        meaning: '吃',
        examples: [
          {
            japanese: 'ご飯を食べます。',
            romaji: 'Gohan wo tabemasu.',
            meaning: '吃饭。'
          }
        ],
        level: 'N5',
        category: '动词',
        difficulty: 1
      }
    ],
    intermediate: [
      {
        id: '5',
        japanese: 'けいけん',
        kanji: '経験',
        romaji: 'keiken',
        meaning: '经验',
        examples: [
          {
            japanese: '経験が大切です。',
            romaji: 'Keiken ga taisetsu desu.',
            meaning: '经验很重要。'
          }
        ],
        level: 'N3',
        category: '名词',
        difficulty: 3
      }
    ],
    advanced: [
      {
        id: '6',
        japanese: 'こうりょ',
        kanji: '考慮',
        romaji: 'kouryo',
        meaning: '考虑',
        examples: [
          {
            japanese: '様々な要因を考慮する。',
            romaji: 'Samazama na youin wo kouryo suru.',
            meaning: '考虑各种因素。'
          }
        ],
        level: 'N1',
        category: '名词',
        difficulty: 5
      }
    ]
  }

  // 根据课程焦点添加特定类型的单词
  const focusWords = {
    business: [
      {
        id: '7',
        japanese: 'かいぎ',
        kanji: '会議',
        romaji: 'kaigi',
        meaning: '会议',
        examples: [
          {
            japanese: '会議に参加します。',
            romaji: 'Kaigi ni sanka shimasu.',
            meaning: '参加会议。'
          }
        ],
        level: 'N4',
        category: '商务',
        difficulty: 3
      }
    ],
    exam: [
      {
        id: '8',
        japanese: 'しけん',
        kanji: '試験',
        romaji: 'shiken',
        meaning: '考试',
        examples: [
          {
            japanese: '試験に合格しました。',
            romaji: 'Shiken ni goukaku shimashita.',
            meaning: '考试合格了。'
          }
        ],
        level: 'N4',
        category: '考试',
        difficulty: 3
      }
    ]
  }

  // 合并单词
  let finalWords = [...baseWords]

  // 根据级别添加单词
  if (levelWords[courseInfo.level as keyof typeof levelWords]) {
    finalWords = [...finalWords, ...levelWords[courseInfo.level as keyof typeof levelWords]]
  }

  // 根据焦点添加单词
  if (focusWords[courseInfo.focus as keyof typeof focusWords]) {
    finalWords = [...finalWords, ...focusWords[courseInfo.focus as keyof typeof focusWords]]
  }

  return finalWords
}

// 动态生成单词数据
const words = ref<Word[]>(generateWordsForCourse(courseInfo.value))

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

// 进入普通模式
function enterNormalMode() {
  // 保存当前学习状态
  const currentState = {
    currentIndex: currentIndex.value,
    showAnswer: showAnswer.value,
    stats: { ...stats.value },
    settings: { ...learningSettings.value }
  }

  // 将状态保存到sessionStorage，以便在普通模式中恢复
  sessionStorage.setItem('wordLearningState', JSON.stringify(currentState))

  // 跳转到普通模式
  router.push('/normal-learning/words')
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

// 沉浸式学习事件处理
function handleSettings() {
  // 设置面板已在布局组件中处理
  console.log('打开设置面板')
}

function handleReset() {
  // 重置当前学习进度
  currentIndex.value = 0
  stats.value = {
    totalWords: words.value.length,
    studiedWords: 0,
    knownWords: 0,
    unknownWords: 0
  }

  // 清除本地存储的进度
  words.value.forEach(word => {
    dataManager.removeWordProgress(word.id)
  })

  // 重新加载进度
  loadProgress()
  window.$message.success('学习进度已重置')
}

function handleFullscreen() {
  console.log('切换全屏模式')
}

function handleExit() {
  // 保存当前进度
  if (currentWord.value) {
    dataManager.saveWordProgress(currentWord.value.id, {
      wordId: currentWord.value.id,
      isKnown: false,
      reviewCount: 0,
      lastReviewDate: new Date(),
      nextReviewDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
      isFavorite: false
    })
  }

  // 返回课程列表
  router.push('/courses')
}

// 国际化消息处理
function showMessage(key: string, params?: any) {
  if (params) {
    window.$message.info(t(key, params))
  } else {
    window.$message.info(t(key))
  }
}

// 恢复学习状态（从专注模式返回时）
function restoreLearningState() {
  const savedState = sessionStorage.getItem('wordLearningState')
  if (savedState) {
    try {
      const state = JSON.parse(savedState)
      currentIndex.value = state.currentIndex || 0
      showAnswer.value = state.showAnswer || false
      if (state.stats) {
        stats.value = { ...stats.value, ...state.stats }
      }
      if (state.settings) {
        learningSettings.value = { ...learningSettings.value, ...state.settings }
      }
      // 清除保存的状态
      sessionStorage.removeItem('wordLearningState')
      console.log('学习状态已恢复')
    } catch (error) {
      console.error('恢复学习状态失败:', error)
    }
  }
}

// 获取级别颜色
function getLevelColor(level: string) {
  switch (level) {
    case 'beginner':
      return 'success'
    case 'intermediate':
      return 'warning'
    case 'advanced':
      return 'error'
    default:
      return 'info'
  }
}

// 获取级别文本
function getLevelText(level: string) {
  switch (level) {
    case 'beginner':
      return '初级'
    case 'intermediate':
      return '中级'
    case 'advanced':
      return '高级'
    default:
      return '未知'
  }
}

// 监听路由变化，重新生成单词
watch(() => route.query, (newQuery) => {
  if (newQuery.courseId) {
    words.value = generateWordsForCourse(courseInfo.value)
    currentIndex.value = 0
    showAnswer.value = false
    updateStats()
  }
}, { deep: true })

// 组件挂载时加载进度
onMounted(async () => {
  await loadProgress()
  await getReviewWords()
  getFavoriteWords()

  // 检查是否需要恢复状态（从专注模式返回）
  restoreLearningState()
})
</script>

<template>
  <ImmersiveLearningLayout
    :title="courseInfo.title || t('learning.wordLearning.title')"
    @settings="handleSettings"
    @reset="handleReset"
    @fullscreen="handleFullscreen"
    @exit="handleExit"
  >
    <!-- 主要学习内容 -->
    <div class="immersive-word-learning">
      <!-- 课程信息卡片 -->
      <n-card v-if="courseInfo.courseId" class="course-info-card mb-6 rounded-16px" content-style="padding: 20px;">
        <div class="course-info-header mb-3">
          <n-text strong class="text-18px">{{ courseInfo.title }}</n-text>
          <n-tag :type="getLevelColor(courseInfo.level)" size="small" class="ml-2">
            {{ getLevelText(courseInfo.level) }}
          </n-tag>
        </div>
        <n-text depth="3" class="mb-3 block">{{ courseInfo.description }}</n-text>
        <div class="course-meta flex items-center gap-4 text-sm">
          <div class="flex items-center gap-1">
            <Icon icon="tabler:book" />
            <span>{{ courseInfo.lessons }}课时</span>
          </div>
          <div class="flex items-center gap-1">
            <Icon icon="tabler:clock" />
            <span>{{ courseInfo.duration }}</span>
          </div>
          <div class="flex items-center gap-1">
            <Icon icon="tabler:tag" />
            <span>{{ courseInfo.category }}</span>
          </div>
        </div>
        <div v-if="courseInfo.tags.length > 0" class="course-tags mt-3">
          <n-tag
            v-for="tag in courseInfo.tags"
            :key="tag"
            size="small"
            class="mr-1"
            type="info"
            :bordered="false"
          >
            {{ tag }}
          </n-tag>
        </div>
      </n-card>

      <!-- 学习统计卡片 -->
      <n-card class="stats-card mb-6 rounded-16px" content-style="padding: 20px;">
        <div class="stats-grid">
          <div class="stat-item">
            <div class="stat-value">{{ stats.totalWords }}</div>
            <div class="stat-label">{{ t('learning.wordLearning.totalWords') }}</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">{{ stats.studiedWords }}</div>
            <div class="stat-label">{{ t('learning.wordLearning.studiedWords') }}</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">{{ stats.knownWords }}</div>
            <div class="stat-label">{{ t('learning.wordLearning.knownWords') }}</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">{{ stats.unknownWords }}</div>
            <div class="stat-label">{{ t('learning.wordLearning.unknownWords') }}</div>
          </div>
        </div>
      </n-card>

      <!-- 学习进度条 -->
      <n-card class="progress-card mb-6 rounded-16px" content-style="padding: 20px;">
        <div class="progress-header mb-3">
          <div class="flex items-center justify-between">
            <n-text strong>{{ t('learning.wordLearning.learningProgress') }}</n-text>
            <n-text class="progress-text">{{ currentIndex + 1 }} / {{ stats.totalWords }}</n-text>
          </div>
        </div>
        <n-progress
          type="line"
          :percentage="stats.totalWords > 0 ? (currentIndex / stats.totalWords) * 100 : 0"
          :show-indicator="false"
          :height="12"
          border-radius="6px"
          color="var(--primary-color)"
        />
      </n-card>


      <!-- 单词卡片区域 -->
      <div class="word-card-section mb-6">
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

      <!-- 学习控制区域 -->
      <div class="learning-controls">
        <!-- 主要控制按钮 -->
        <div class="main-controls">
          <n-button
            size="large"
            :disabled="currentIndex === 0"
            @click="prevWord"
            class="control-btn"
          >
            <Icon icon="noto:left-arrow" />
            <span class="btn-text">{{ t('learning.wordLearning.previous') }}</span>
          </n-button>

          <n-button
            size="large"
            type="primary"
            @click="handleFlip"
            class="control-btn flip-btn"
          >
            <Icon icon="noto:cherry-blossom" />
            <span class="btn-text">{{ t('learning.wordLearning.flipCard') }}</span>
          </n-button>

          <n-button
            size="large"
            :disabled="isLastWord"
            @click="nextWord"
            class="control-btn"
          >
            <span class="btn-text">{{ t('learning.wordLearning.next') }}</span>
            <Icon icon="noto:right-arrow" />
          </n-button>
        </div>

        <!-- 辅助功能按钮 -->
        <div class="secondary-controls">
          <n-button
            size="medium"
            @click="showReviewMode = !showReviewMode"
            :type="showReviewMode ? 'primary' : 'default'"
            class="aux-btn"
          >
            <Icon icon="noto:clockwise-vertical-arrows" />
            <span class="btn-text">{{ t('learning.wordLearning.smartReview') }}</span>
          </n-button>

          <n-button
            size="medium"
            @click="showFavorites = !showFavorites"
            :type="showFavorites ? 'primary' : 'default'"
            class="aux-btn"
          >
            <Icon icon="noto:red-heart" />
            <span class="btn-text">{{ t('learning.wordLearning.favoriteList') }}</span>
          </n-button>

          <!-- 进入普通模式按钮 -->
          <n-button
            size="medium"
            type="default"
            class="aux-btn normal-mode-btn"
            @click="enterNormalMode"
          >
            <Icon icon="noto:house" />
            <span class="btn-text">普通模式</span>
          </n-button>
        </div>
      </div>
    </div>

    <!-- 自定义设置面板 -->
    <template #settings>
      <div class="learning-settings">
        <n-space vertical size="large">
          <!-- 字体大小设置 -->
          <div class="setting-item">
            <n-text strong>{{ t('immersive.settingsPanel.fontSize') }}</n-text>
            <n-slider
              v-model:value="learningSettings.fontSize"
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
              v-model:value="learningSettings.volume"
              :min="0"
              :max="100"
              :step="10"
            />
          </div>

          <!-- 自动播放 -->
          <div class="setting-item">
            <n-space justify="space-between">
              <n-text strong>{{ t('immersive.settingsPanel.autoPlay') }}</n-text>
              <n-switch v-model:value="learningSettings.autoPlay" />
            </n-space>
          </div>

          <!-- 显示提示 -->
          <div class="setting-item">
            <n-space justify="space-between">
              <n-text strong>{{ t('immersive.settingsPanel.showHints') }}</n-text>
              <n-switch v-model:value="learningSettings.showHints" />
            </n-space>
          </div>
        </n-space>
      </div>
    </template>
  </ImmersiveLearningLayout>
</template>

<style scoped>
/* 沉浸式学习模式样式 */
.immersive-word-learning {
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
  grid-template-columns: repeat(4, 1fr);
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

/* 单词卡片区域 */
.word-card-section {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  padding: 20px 0;
}

/* 学习控制区域 */
.learning-controls {
  background: var(--card-color);
  border-radius: 16px;
  padding: 24px;
  border: 1px solid var(--border-color);
}

.main-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
}

.control-btn {
  min-width: 120px;
  height: 48px;
  border-radius: 12px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.control-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

.flip-btn {
  min-width: 140px;
  background: var(--sakura-gradient);
  border: none;
  color: white;
}

.flip-btn:hover {
  background: var(--sakura-dark-gradient);
}

.secondary-controls {
  display: flex;
  justify-content: center;
  gap: 12px;
}

.aux-btn {
  min-width: 100px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.btn-text {
  font-weight: 500;
}

/* 普通模式按钮特殊样式 */
.normal-mode-btn {
  background: var(--card-color);
  border: 2px solid var(--secondary-color);
  color: var(--secondary-color);
  box-shadow: var(--shadow-1);
  position: relative;
  overflow: hidden;
  min-width: 120px;
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

.normal-mode-btn .btn-text {
  position: relative;
  z-index: 1;
  font-weight: 600;
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

  .main-controls {
    flex-direction: column;
    gap: 12px;
  }

  .control-btn {
    width: 100%;
    min-width: auto;
  }

  .secondary-controls {
    flex-direction: column;
    gap: 8px;
  }

  .aux-btn {
    width: 100%;
    min-width: auto;
  }

  .word-card-section {
    min-height: 300px;
    padding: 16px 0;
  }
}

@media (max-width: 480px) {
  .stats-grid {
    grid-template-columns: 1fr;
    gap: 8px;
  }

  .learning-controls {
    padding: 16px;
  }

  .control-btn {
    height: 44px;
  }

  .aux-btn {
    height: 36px;
  }

  .btn-text {
    font-size: 14px;
  }
}
</style>
