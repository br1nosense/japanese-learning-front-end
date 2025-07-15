<script lang="ts" setup>
import { Icon } from '@iconify/vue'
import { LearningDataManager } from '@/utils/learning'
import type { StudyStats, Achievement, WordProgress, GrammarProgress } from '@/types/learning'

const dataManager = LearningDataManager.getInstance()

// 加载状态
const loading = ref(true)

// 实际学习数据
const studyStats = ref<StudyStats>({
  totalWordsLearned: 0,
  totalGrammarPointsLearned: 0,
  todayWordsStudied: 0,
  todayGrammarStudied: 0,
  currentStreak: 0,
  totalStudyTime: 0,
  averageAccuracy: 0,
  weeklyProgress: [0, 0, 0, 0, 0, 0, 0]
})
const achievements = ref<Achievement[]>([])
const wordProgress = ref(new Map<string, WordProgress>())
const grammarProgress = ref(new Map<string, GrammarProgress>())

// 计算学习统计
const computedStats = computed(() => {
  const totalWords = wordProgress.value.size
  const totalGrammar = grammarProgress.value.size
  const masteredWords = Array.from(wordProgress.value.values()).filter(p => p.masteryLevel >= 80).length
  const masteredGrammar = Array.from(grammarProgress.value.values()).filter(p => p.masteryLevel >= 80).length

  return {
    totalWords,
    totalGrammar,
    masteredWords,
    masteredGrammar,
    wordMasteryRate: totalWords > 0 ? Math.round((masteredWords / totalWords) * 100) : 0,
    grammarMasteryRate: totalGrammar > 0 ? Math.round((masteredGrammar / totalGrammar) * 100) : 0
  }
})

const recentActivities = ref([
  {
    date: '2024-01-15',
    activity: '完成了"基础语法"课程',
    type: 'lesson',
    points: 50
  },
  {
    date: '2024-01-14',
    activity: '练习了50个假名',
    type: 'practice',
    points: 30
  },
  {
    date: '2024-01-13',
    activity: '完成了听力训练',
    type: 'listening',
    points: 40
  },
  {
    date: '2024-01-12',
    activity: '学习了新词汇',
    type: 'vocabulary',
    points: 25
  }
])

const weeklyData = ref([
  { day: '周一', minutes: 45 },
  { day: '周二', minutes: 30 },
  { day: '周三', minutes: 60 },
  { day: '周四', minutes: 0 },
  { day: '周五', minutes: 45 },
  { day: '周六', minutes: 0 },
  { day: '周日', minutes: 0 }
])

 achievements.value = ([
  {
    id: 'streak-7',
    title: '连续学习7天',
    description: '坚持每天学习日语',
    icon: 'tabler:calendar-check',
    condition: 'streak >= 7',
    isUnlocked: true,
    unlockedDate: new Date('2024-01-10'),
    progress: 100
  },
  {
    id: 'course-10',
    title: '完成10个课程',
    description: '完成了10个学习课程',
    icon: 'tabler:book-2',
    condition: 'courses >= 10',
    isUnlocked: true,
    unlockedDate: new Date('2024-01-08'),
    progress: 100
  },
  {
    id: 'study-master',
    title: '学习达人',
    description: '单日学习时间超过2小时',
    icon: 'tabler:trophy',
    condition: 'daily_time >= 120',
    isUnlocked: false,
    progress: 65
  },
  {
    id: 'kana-master',
    title: '假名大师',
    description: '掌握所有平假名和片假名',
    icon: 'tabler:language-hiragana',
    condition: 'kana_mastery >= 100',
    isUnlocked: false,
    progress: 30
  }
])

const formatTime = (minutes: number) => {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return hours > 0 ? `${hours}小时${mins}分钟` : `${mins}分钟`
}

const getActivityIcon = (type: string) => {
  const icons: Record<string, string> = {
    lesson: 'tabler:book',
    practice: 'tabler:pencil',
    listening: 'tabler:ear',
    vocabulary: 'tabler:abc'
  }
  return icons[type] || 'tabler:check'
}

const getActivityColor = (type: string): 'default' | 'primary' | 'success' | 'warning' | 'info' | 'error' => {
  const colors: Record<string, 'default' | 'primary' | 'success' | 'warning' | 'info' | 'error'> = {
    lesson: 'primary',
    practice: 'success',
    listening: 'warning',
    vocabulary: 'info'
  }
  return colors[type] || 'default'
}

// 刷新数据
async function refreshData() {
  try {
    loading.value = true
    studyStats.value = await dataManager.getStudyStats()
    achievements.value = await dataManager.getAchievements()
    wordProgress.value = await dataManager.getWordProgress()
    grammarProgress.value = await dataManager.getGrammarProgress()
  } catch (error) {
    console.error('Failed to refresh data:', error)
    window.$message.error('加载学习数据失败')
  } finally {
    loading.value = false
  }
}

// 组件挂载时刷新数据
onMounted(async () => {
  await refreshData()
})
</script>

<template>
  <div class="study-progress-page">
    <!-- Loading State -->
    <div v-if="loading" class="loading-container">
      <n-spin size="large">
        <div class="loading-content">
          <n-text>正在加载学习数据...</n-text>
        </div>
      </n-spin>
    </div>

    <!-- Main Content -->
    <div v-else>
      <!-- Header -->
      <n-card class="header-section mb-6 rounded-16px" content-style="padding: 40px;">
        <div class="text-center">
          <n-h1 class="mb-4">
            <n-gradient-text type="primary">
              学习进度
            </n-gradient-text>
          </n-h1>
          <n-text class="text-16px text-gray-600">
            跟踪您的学习进度，保持学习动力
          </n-text>
        </div>
      </n-card>

    <!-- Stats Overview -->
    <n-grid :cols="24" :x-gap="20" :y-gap="20" responsive="screen" item-responsive class="mb-6">
      <n-grid-item span="24 l:6 m:12 s:24">
        <n-card class="stat-card rounded-16px" content-style="padding: 20px;">
          <div class="flex items-center gap-3">
            <div class="stat-icon bg-blue-100 text-blue-600">
              <Icon icon="tabler:cards" class="text-24px" />
            </div>
            <div>
              <n-text depth="3" class="text-sm">学习单词</n-text>
              <n-h2 class="mb-0">{{ computedStats.totalWords }}</n-h2>
            </div>
          </div>
        </n-card>
      </n-grid-item>

      <n-grid-item span="24 l:6 m:12 s:24">
        <n-card class="stat-card rounded-16px" content-style="padding: 20px;">
          <div class="flex items-center gap-3">
            <div class="stat-icon bg-green-100 text-green-600">
              <Icon icon="tabler:grammar" class="text-24px" />
            </div>
            <div>
              <n-text depth="3" class="text-sm">语法练习</n-text>
              <n-h2 class="mb-0">{{ computedStats.totalGrammar }}</n-h2>
            </div>
          </div>
        </n-card>
      </n-grid-item>

      <n-grid-item span="24 l:6 m:12 s:24">
        <n-card class="stat-card rounded-16px" content-style="padding: 20px;">
          <div class="flex items-center gap-3">
            <div class="stat-icon bg-orange-100 text-orange-600">
              <Icon icon="tabler:flame" class="text-24px" />
            </div>
            <div>
              <n-text depth="3" class="text-sm">连续学习</n-text>
              <n-h2 class="mb-0">{{ studyStats.currentStreak }}天</n-h2>
            </div>
          </div>
        </n-card>
      </n-grid-item>

      <n-grid-item span="24 l:6 m:12 s:24">
        <n-card class="stat-card rounded-16px" content-style="padding: 20px;">
          <div class="flex items-center gap-3">
            <div class="stat-icon bg-purple-100 text-purple-600">
              <Icon icon="tabler:target" class="text-24px" />
            </div>
            <div>
              <n-text depth="3" class="text-sm">平均正确率</n-text>
              <n-h2 class="mb-0">{{ studyStats.averageAccuracy }}%</n-h2>
            </div>
          </div>
        </n-card>
      </n-grid-item>
    </n-grid>

    <n-grid :cols="2" :x-gap="24" :y-gap="24" responsive="screen" item-responsive>
      <!-- Progress Section -->
      <n-grid-item span="24 l:12">
        <n-card class="progress-section rounded-16px" content-style="padding: 24px;">
          <n-h3 class="mb-4">
            <Icon icon="tabler:target" class="mr-2" />
            学习进度
          </n-h3>

          <div class="progress-item mb-6">
            <div class="flex justify-between items-center mb-2">
              <n-text>单词掌握率</n-text>
              <n-text depth="3">{{ computedStats.wordMasteryRate }}%</n-text>
            </div>
            <n-progress
              type="line"
              :percentage="computedStats.wordMasteryRate"
              :show-indicator="false"
              color="var(--primary-color)"
            />
            <n-text depth="3" class="text-sm mt-1 block">
              已掌握 {{ computedStats.masteredWords }} / {{ computedStats.totalWords }} 个单词
            </n-text>
          </div>

          <div class="progress-item">
            <div class="flex justify-between items-center mb-2">
              <n-text>语法掌握率</n-text>
              <n-text depth="3">{{ computedStats.grammarMasteryRate }}%</n-text>
            </div>
            <n-progress
              type="line"
              :percentage="computedStats.grammarMasteryRate"
              :show-indicator="false"
              color="var(--primary-color)"
            />
            <n-text depth="3" class="text-sm mt-1 block">
              已掌握 {{ computedStats.masteredGrammar }} / {{ computedStats.totalGrammar }} 个语法点
            </n-text>
          </div>
        </n-card>
      </n-grid-item>

      <!-- Recent Activities -->
      <n-grid-item span="24 l:12">
        <n-card class="activities-section rounded-16px" content-style="padding: 24px;">
          <n-h3 class="mb-4">
            <Icon icon="tabler:activity" class="mr-2" />
            最近活动
          </n-h3>

          <div class="activity-list">
            <div
              v-for="activity in recentActivities"
              :key="activity.date"
              class="activity-item flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div class="activity-icon">
                <n-tag :type="getActivityColor(activity.type)" size="small" round>
                  <template #icon>
                    <Icon :icon="getActivityIcon(activity.type)" />
                  </template>
                </n-tag>
              </div>
              <div class="flex-1">
                <n-text class="block">{{ activity.activity }}</n-text>
                <n-text depth="3" class="text-sm">{{ activity.date }}</n-text>
              </div>
              <div class="points">
                <n-text class="text-sm text-green-600">+{{ activity.points }}分</n-text>
              </div>
            </div>
          </div>
        </n-card>
      </n-grid-item>
    </n-grid>

    <!-- Achievements -->
    <div class="achievements-section mt-6">
      <n-h3 class="mb-4">
        <Icon icon="tabler:trophy" class="mr-2" />
        成就徽章
      </n-h3>

      <n-grid :cols="24" :x-gap="16" :y-gap="16" responsive="screen" item-responsive>
        <n-grid-item v-for="achievement in achievements" :key="achievement.id" span="24 l:6 m:12 s:24">
          <n-card
            hoverable
            class="achievement-card rounded-16px text-center"
            :class="achievement.isUnlocked ? 'achievement-earned' : 'achievement-locked'"
            content-style="padding: 20px;"
          >
            <Icon
              :icon="achievement.icon"
              class="text-32px mb-3"
              :class="achievement.isUnlocked ? 'text-primary' : 'text-gray-400'"
            />
            <n-text :depth="achievement.isUnlocked ? 1 : 3" class="block font-medium mb-2">
              {{ achievement.title }}
            </n-text>
            <n-text depth="3" class="text-sm block mb-3">
              {{ achievement.description }}
            </n-text>
            <div v-if="achievement.isUnlocked && achievement.unlockedDate" class="achievement-date">
              <n-tag type="success" size="small" round>
                <template #icon>
                  <Icon icon="tabler:check" />
                </template>
                {{ achievement.unlockedDate.toLocaleDateString() }}
              </n-tag>
            </div>
            <div v-else class="achievement-locked-indicator">
              <n-tag type="default" size="small" round>
                <template #icon>
                  <Icon icon="tabler:lock" />
                </template>
                {{ Math.round(achievement.progress) }}%
              </n-tag>
            </div>
          </n-card>
        </n-grid-item>
      </n-grid>
    </div>
    </div>
  </div>
</template>

<style scoped>
.study-progress-page {
  max-width: 1200px;
  margin: 0 auto;
}

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
}

.loading-content {
  text-align: center;
  padding: 20px;
}

.stat-card {
  transition: transform 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.achievement-card {
  transition: all 0.3s ease;
  border: 1px solid transparent;
}

.achievement-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.achievement-earned {
  border-color: var(--primary-color);
  background: linear-gradient(135deg, rgba(24, 160, 88, 0.05) 0%, rgba(24, 160, 88, 0.02) 100%);
}

.achievement-locked {
  opacity: 0.7;
}

.achievement-locked:hover {
  opacity: 0.9;
}

.achievement-date {
  margin-top: 8px;
}

.achievement-locked-indicator {
  margin-top: 8px;
}

@media (max-width: 768px) {
  .header-section :deep(.n-card__content),
  .progress-section :deep(.n-card__content),
  .activities-section :deep(.n-card__content) {
    padding: 16px;
  }

  .stat-card :deep(.n-card__content) {
    padding: 16px !important;
  }

  .achievement-card :deep(.n-card__content) {
    padding: 16px !important;
  }
}
</style>
