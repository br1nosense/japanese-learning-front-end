import type { WordProgress, GrammarProgress, StudyStats, Achievement, StudySession } from '@/types/learning'
import { progressAPI, apiUtils } from '@/services/api'

// 学习数据管理工具

export class LearningDataManager {
  private static instance: LearningDataManager
  private useBackend: boolean = true // 是否使用后端API

  static getInstance(): LearningDataManager {
    if (!LearningDataManager.instance) {
      LearningDataManager.instance = new LearningDataManager()
    }
    return LearningDataManager.instance
  }

  constructor() {
    // 检查是否有认证token来决定是否使用后端
    this.useBackend = apiUtils.isAuthenticated()
  }

  // 获取单词学习进度
  async getWordProgress(): Promise<Map<string, WordProgress>> {
    if (this.useBackend) {
      try {
        const response = await progressAPI.getProgress()
        if (response.progress?.words) {
          const progressMap = new Map<string, WordProgress>()
          response.progress.words.forEach((word: any) => {
            progressMap.set(word.wordId, word)
          })
          return progressMap
        }
      } catch (error) {
        console.error('Failed to fetch word progress from backend:', error)
        // 降级到本地存储
        this.useBackend = false
      }
    }

    // 使用本地存储
    const saved = localStorage.getItem('wordProgress')
    if (saved) {
      const data = JSON.parse(saved)
      return new Map(data)
    }
    return new Map()
  }

  // 保存单词学习进度
  async saveWordProgress(progressMap: Map<string, WordProgress>): Promise<void> {
    // 同时保存到本地存储（作为备份）
    const data = Array.from(progressMap.entries())
    localStorage.setItem('wordProgress', JSON.stringify(data))

    if (this.useBackend) {
      // 这里不需要批量保存，因为每次更新都会调用API
      return
    }
  }

  // 更新单个单词进度（新方法）
  async updateWordProgress(wordId: string, wordData: Partial<WordProgress>): Promise<void> {
    if (this.useBackend) {
      try {
        await progressAPI.updateWordProgress({
          wordId,
          isKnown: wordData.isKnown || false,
          masteryLevel: wordData.masteryLevel,
          word: wordData.word,
          isFavorite: wordData.isFavorite,
          difficulty: wordData.difficulty
        })
        return
      } catch (error) {
        console.error('Failed to update word progress to backend:', error)
        this.useBackend = false
      }
    }

    // 降级到本地存储
    const progressMap = await this.getWordProgress()
    const existing = progressMap.get(wordId)

    if (existing) {
      Object.assign(existing, wordData)
    } else {
      progressMap.set(wordId, wordData as WordProgress)
    }

    await this.saveWordProgress(progressMap)
  }

  // 获取语法学习进度
  async getGrammarProgress(): Promise<Map<string, GrammarProgress>> {
    if (this.useBackend) {
      try {
        const response = await progressAPI.getProgress()
        if (response.progress?.grammar) {
          const progressMap = new Map<string, GrammarProgress>()
          response.progress.grammar.forEach((grammar: any) => {
            progressMap.set(grammar.questionId, grammar)
          })
          return progressMap
        }
      } catch (error) {
        console.error('Failed to fetch grammar progress from backend:', error)
        this.useBackend = false
      }
    }

    // 使用本地存储
    const saved = localStorage.getItem('grammarProgress')
    if (saved) {
      const data = JSON.parse(saved)
      return new Map(data)
    }
    return new Map()
  }

  // 保存语法学习进度
  async saveGrammarProgress(progressMap: Map<string, GrammarProgress>): Promise<void> {
    // 同时保存到本地存储（作为备份）
    const data = Array.from(progressMap.entries())
    localStorage.setItem('grammarProgress', JSON.stringify(data))

    if (this.useBackend) {
      // 这里不需要批量保存，因为每次更新都会调用API
      return
    }
  }

  // 更新单个语法进度（新方法）
  async updateGrammarProgress(questionId: string, grammarData: Partial<GrammarProgress>): Promise<void> {
    if (this.useBackend) {
      try {
        await progressAPI.updateGrammarProgress({
          questionId,
          isCorrect: grammarData.isCorrect || false,
          grammarPoint: grammarData.grammarPoint
        })
        return
      } catch (error) {
        console.error('Failed to update grammar progress to backend:', error)
        this.useBackend = false
      }
    }

    // 降级到本地存储
    const progressMap = await this.getGrammarProgress()
    const existing = progressMap.get(questionId)

    if (existing) {
      Object.assign(existing, grammarData)
    } else {
      progressMap.set(questionId, grammarData as GrammarProgress)
    }

    await this.saveGrammarProgress(progressMap)
  }

  // 获取学习统计
  async getStudyStats(): Promise<StudyStats> {
    if (this.useBackend) {
      try {
        const response = await progressAPI.getStats()
        if (response.stats) {
          return response.stats
        }
      } catch (error) {
        console.error('Failed to fetch study stats from backend:', error)
        this.useBackend = false
      }
    }

    // 使用本地存储
    const saved = localStorage.getItem('studyStats')
    if (saved) {
      return JSON.parse(saved)
    }

    return {
      totalWordsLearned: 0,
      totalGrammarPointsLearned: 0,
      todayWordsStudied: 0,
      todayGrammarStudied: 0,
      currentStreak: 0,
      totalStudyTime: 0,
      averageAccuracy: 0,
      weeklyProgress: [0, 0, 0, 0, 0, 0, 0]
    }
  }

  // 保存学习统计
  async saveStudyStats(stats: StudyStats): Promise<void> {
    // 保存到本地存储（作为备份）
    localStorage.setItem('studyStats', JSON.stringify(stats))

    if (this.useBackend) {
      // 后端统计会自动更新，这里不需要手动保存
      return
    }
  }

  // 更新学习统计
  updateStudyStats(type: 'word' | 'grammar', isCorrect?: boolean): void {
    const stats = this.getStudyStats()
    const today = new Date().toDateString()
    const lastStudyDate = localStorage.getItem('lastStudyDate')

    // 更新今日学习数据
    if (lastStudyDate !== today) {
      stats.todayWordsStudied = 0
      stats.todayGrammarStudied = 0
      localStorage.setItem('lastStudyDate', today)

      // 更新连续学习天数
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      if (lastStudyDate === yesterday.toDateString()) {
        stats.currentStreak++
      } else if (lastStudyDate !== today) {
        stats.currentStreak = 1
      }
    }

    if (type === 'word') {
      stats.todayWordsStudied++
      stats.totalWordsLearned++
    } else {
      stats.todayGrammarStudied++
      stats.totalGrammarPointsLearned++
    }

    // 更新周进度（简化版本）
    const dayOfWeek = new Date().getDay()
    stats.weeklyProgress[dayOfWeek]++

    this.saveStudyStats(stats)
  }

  // 获取成就列表
  async getAchievements(): Promise<Achievement[]> {
    if (this.useBackend) {
      try {
        const response = await progressAPI.getAchievements()
        if (response.achievements) {
          return response.achievements.map((achievement: any) => ({
            id: achievement.achievementId,
            title: achievement.title,
            description: achievement.description,
            icon: achievement.icon,
            condition: '', // 后端不需要condition字段
            isUnlocked: achievement.isUnlocked,
            progress: achievement.progress,
            unlockedDate: achievement.unlockedDate
          }))
        }
      } catch (error) {
        console.error('Failed to fetch achievements from backend:', error)
        this.useBackend = false
      }
    }

    // 使用本地存储
    const saved = localStorage.getItem('achievements')
    if (saved) {
      return JSON.parse(saved)
    }

    return [
      {
        id: 'first-word',
        title: '初学者',
        description: '学习第一个单词',
        icon: 'tabler:star',
        condition: 'word_count >= 1',
        isUnlocked: false,
        progress: 0
      },
      {
        id: 'word-master-10',
        title: '单词达人',
        description: '学习10个单词',
        icon: 'tabler:book',
        condition: 'word_count >= 10',
        isUnlocked: false,
        progress: 0
      },
      {
        id: 'grammar-starter',
        title: '语法入门',
        description: '完成第一个语法练习',
        icon: 'tabler:grammar',
        condition: 'grammar_count >= 1',
        isUnlocked: false,
        progress: 0
      },
      {
        id: 'streak-7',
        title: '坚持不懈',
        description: '连续学习7天',
        icon: 'tabler:flame',
        condition: 'streak >= 7',
        isUnlocked: false,
        progress: 0
      },
      {
        id: 'accuracy-90',
        title: '精准射手',
        description: '语法练习正确率达到90%',
        icon: 'tabler:target',
        condition: 'accuracy >= 90',
        isUnlocked: false,
        progress: 0
      }
    ]
  }

  // 保存成就
  async saveAchievements(achievements: Achievement[]): Promise<void> {
    // 保存到本地存储（作为备份）
    localStorage.setItem('achievements', JSON.stringify(achievements))

    if (this.useBackend) {
      // 后端成就会自动更新，这里不需要手动保存
      return
    }
  }

  // 检查并解锁成就
  checkAchievements(): Achievement[] {
    const achievements = this.getAchievements()
    const stats = this.getStudyStats()
    const wordProgress = this.getWordProgress()
    const grammarProgress = this.getGrammarProgress()

    let hasNewAchievement = false

    achievements.forEach(achievement => {
      if (achievement.isUnlocked) return

      let shouldUnlock = false

      switch (achievement.id) {
        case 'first-word':
          shouldUnlock = wordProgress.size >= 1
          achievement.progress = Math.min(100, (wordProgress.size / 1) * 100)
          break
        case 'word-master-10':
          shouldUnlock = wordProgress.size >= 10
          achievement.progress = Math.min(100, (wordProgress.size / 10) * 100)
          break
        case 'grammar-starter':
          shouldUnlock = grammarProgress.size >= 1
          achievement.progress = Math.min(100, (grammarProgress.size / 1) * 100)
          break
        case 'streak-7':
          shouldUnlock = stats.currentStreak >= 7
          achievement.progress = Math.min(100, (stats.currentStreak / 7) * 100)
          break
        case 'accuracy-90':
          shouldUnlock = stats.averageAccuracy >= 90
          achievement.progress = Math.min(100, (stats.averageAccuracy / 90) * 100)
          break
      }

      if (shouldUnlock && !achievement.isUnlocked) {
        achievement.isUnlocked = true
        achievement.unlockedDate = new Date()
        hasNewAchievement = true
      }
    })

    if (hasNewAchievement) {
      this.saveAchievements(achievements)
    }

    return achievements.filter(a => a.isUnlocked && a.unlockedDate &&
      new Date().getTime() - new Date(a.unlockedDate).getTime() < 5000) // 5秒内解锁的成就
  }

  // 智能复习算法 - 基于遗忘曲线
  getWordsForReview(): string[] {
    const progressMap = this.getWordProgress()
    const now = new Date()
    const wordsForReview: string[] = []

    progressMap.forEach((progress, wordId) => {
      if (progress.nextReviewDate <= now) {
        wordsForReview.push(wordId)
      }
    })

    return wordsForReview
  }

  // 计算下次复习时间
  calculateNextReviewDate(masteryLevel: number, isCorrect: boolean): Date {
    const now = new Date()
    let intervalDays = 1

    if (isCorrect) {
      // 根据掌握程度调整复习间隔
      if (masteryLevel >= 80) intervalDays = 30
      else if (masteryLevel >= 60) intervalDays = 14
      else if (masteryLevel >= 40) intervalDays = 7
      else if (masteryLevel >= 20) intervalDays = 3
      else intervalDays = 1
    } else {
      // 答错了，缩短复习间隔
      intervalDays = Math.max(1, Math.floor(masteryLevel / 20))
    }

    const nextDate = new Date(now)
    nextDate.setDate(nextDate.getDate() + intervalDays)
    return nextDate
  }

  // 清除所有学习数据
  clearAllData(): void {
    localStorage.removeItem('wordProgress')
    localStorage.removeItem('grammarProgress')
    localStorage.removeItem('studyStats')
    localStorage.removeItem('achievements')
    localStorage.removeItem('lastStudyDate')
  }
}
