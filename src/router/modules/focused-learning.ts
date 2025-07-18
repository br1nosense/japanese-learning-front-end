import type { RouteRecordRaw } from 'vue-router'
import FocusedLearningLayout from '../../layouts/FocusedLearningLayout.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/focused',
    name: 'focused-learning',
    component: FocusedLearningLayout,
    meta: {
      title: '专注学习模式',
      hideInMenu: true, // 不在菜单中显示
      requiresAuth: true, // 需要登录才能访问
    },
    children: [
      {
        path: 'words',
        name: 'focused-word-learning',
        component: () => import('@/views/learning/WordLearning.vue'),
        meta: {
          title: '专注单词学习',
          hideInMenu: true,
          requiresAuth: true,
        },
      },
      {
        path: 'grammar',
        name: 'focused-grammar-learning',
        component: () => import('@/views/learning/GrammarLearning.vue'),
        meta: {
          title: '专注语法练习',
          hideInMenu: true,
          requiresAuth: true,
        },
      },
      {
        path: 'listening',
        name: 'focused-listening-learning',
        component: () => import('@/views/learning/ListeningLearning.vue'),
        meta: {
          title: '专注听力练习',
          hideInMenu: true,
          requiresAuth: true,
        },
      },
    ],
  },
]

export default routes
