import type { RouteRecordRaw } from 'vue-router'
import layout from '../../layouts/TopNavLayout.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/learning',
    name: 'learning',
    component: layout,
    meta: {
      title: '学习模式',
      hideInMenu: true, // 不在菜单中显示
      requiresAuth: true, // 需要登录才能访问
    },
    children: [
      {
        path: 'words',
        name: 'word-learning',
        component: () => import('@/views/learning/WordLearning.vue'),
        meta: {
          title: '单词学习',
          hideInMenu: true,
          requiresAuth: true,
        },
      },
      {
        path: 'grammar',
        name: 'grammar-learning',
        component: () => import('@/views/learning/GrammarLearning.vue'),
        meta: {
          title: '语法练习',
          hideInMenu: true,
          requiresAuth: true,
        },
      },
      {
        path: 'listening',
        name: 'listening-learning',
        component: () => import('@/views/learning/ListeningLearning.vue'),
        meta: {
          title: '听力练习',
          hideInMenu: true,
          requiresAuth: true,
        },
      },
    ],
  },
  // 保留旧的路由以兼容现有链接
  {
    path: '/normal-learning',
    redirect: '/learning'
  }
]

export default routes
