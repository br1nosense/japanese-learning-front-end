// 学习相关的类型定义

export interface Word {
  id: string
  japanese: string // 日语单词（假名）
  kanji?: string // 汉字（如果有）
  romaji: string // 罗马音
  meaning: string // 中文释义
  examples: Example[] // 例句
  level: 'N5' | 'N4' | 'N3' | 'N2' | 'N1' // JLPT级别
  category: string // 分类（如：动词、名词等）
  difficulty: number // 难度等级 1-5
}

export interface Example {
  japanese: string // 日语例句
  romaji: string // 罗马音
  meaning: string // 中文翻译
}

export interface WordProgress {
  wordId: string
  isKnown: boolean // 是否认识
  reviewCount: number // 复习次数
  correctCount: number // 答对次数
  lastReviewDate: Date // 最后复习时间
  nextReviewDate: Date // 下次复习时间
  masteryLevel: number // 掌握程度 0-100
  isFavorite: boolean // 是否收藏
}

export interface GrammarPoint {
  id: string
  title: string // 语法点名称
  description: string // 用法说明
  structure: string // 语法结构
  examples: Example[] // 例句
  level: 'N5' | 'N4' | 'N3' | 'N2' | 'N1'
  difficulty: number
  usageScenes: string[] // 使用场景
}

export interface GrammarQuestion {
  id: string
  sentence: string // 句子（带空格）
  options: string[] // 选项
  correctAnswer: number // 正确答案索引
  explanation: string // 解释
  grammarPoint: GrammarPoint // 对应的语法点
  level: 'N5' | 'N4' | 'N3' | 'N2' | 'N1'
}

export interface GrammarProgress {
  questionId: string
  isCorrect: boolean
  attempts: number // 尝试次数
  lastAttemptDate: Date
  masteryLevel: number
}

export interface StudySession {
  id: string
  type: 'word' | 'grammar'
  startTime: Date
  endTime?: Date
  wordsStudied: number
  questionsAnswered: number
  correctAnswers: number
  totalTime: number // 学习时长（分钟）
}

export interface StudyStats {
  totalWordsLearned: number
  totalGrammarPointsLearned: number
  todayWordsStudied: number
  todayGrammarStudied: number
  currentStreak: number // 连续学习天数
  totalStudyTime: number // 总学习时长（分钟）
  averageAccuracy: number // 平均正确率
  weeklyProgress: number[] // 一周的学习进度
}

export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  condition: string // 达成条件
  isUnlocked: boolean
  unlockedDate?: Date
  progress: number // 进度百分比
}

export interface StudyPlan {
  id: string
  name: string
  dailyWordTarget: number // 每日单词目标
  dailyGrammarTarget: number // 每日语法目标
  reminderTime?: string // 提醒时间
  isActive: boolean
  createdDate: Date
}
