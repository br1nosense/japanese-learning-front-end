import type { RouteRecordRaw } from 'vue-router'
import layout from '../../layouts/TopNavLayout.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/normal-learning',
    name: 'normal-learning',
    component: layout,
    meta: {
      title: '普通学习模式',
      hideInMenu: true, // 不在菜单中显示
      requiresAuth: false,
    },
    children: [
      {
        path: 'words',
        name: 'normal-word-learning',
        component: () => import('@/views/learning/WordLearning.vue'),
        meta: {
          title: '单词学习 - 普通模式',
          hideInMenu: true,
        },
      },
      {
        path: 'grammar',
        name: 'normal-grammar-learning',
        component: () => import('@/views/learning/GrammarLearning.vue'),
        meta: {
          title: '语法练习 - 普通模式',
          hideInMenu: true,
        },
      },
      {
        path: 'listening',
        name: 'normal-listening-learning',
        component: () => import('@/views/learning/ListeningLearning.vue'),
        meta: {
          title: '听力练习 - 普通模式',
          hideInMenu: true,
        },
      },
    ],
  },
]

export default routes
