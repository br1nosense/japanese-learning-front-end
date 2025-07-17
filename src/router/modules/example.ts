import type { RouteRecordRaw } from 'vue-router'
import layout from '../../layouts/TopNavLayout.vue'
import home from '~icons/tabler/home'
import book from '~icons/tabler/book'
import school from '~icons/tabler/school'
import chart from '~icons/tabler/chart-line'
import help from '~icons/tabler/help-circle'
import info from '~icons/tabler/info-circle'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/home',
    name: 'home',
    component: layout,
    meta: {
      isRoot: true,
      icon: () => h(home),
      title: '首页',
    },
    children: [
      {
        path: '',
        name: 'home-index',
        component: () => import('@/views/japanese/HomePage.vue'),
        meta: {
          title: '首页',
        },
      },
    ],
  },
  {
    path: '/get-started',
    name: 'get-started',
    component: layout,
    meta: {
      title: '开始学习',
      icon: () => h(book),
      isRoot: true,
    },
    children: [
      {
        path: '',
        name: 'get-started-index',
        component: () => import('@/views/japanese/GetStarted.vue'),
        meta: {
          title: '学习入门',
        },
      },
      {
        path: 'how-to-register',
        name: 'how-to-register',
        component: () => import('@/views/japanese/HowToRegister.vue'),
        meta: {
          title: '如何注册',
        },
      },
      {
        path: 'study-method',
        name: 'study-method',
        component: () => import('@/views/japanese/StudyMethod.vue'),
        meta: {
          title: '学习方法',
        },
      },
    ],
  },
  {
    path: '/courses',
    name: 'courses',
    component: layout,
    meta: {
      title: '课程中心',
      icon: () => h(school),
      isRoot: true,
    },
    children: [
      {
        path: '',
        name: 'courses-index',
        component: () => import('@/views/japanese/CourseList.vue'),
        meta: {
          title: '课程列表',
        },
      },
      {
        path: 'beginner',
        name: 'beginner-courses',
        component: () => import('@/views/japanese/BeginnerCourses.vue'),
        meta: {
          title: '初级课程',
        },
      },
      {
        path: 'intermediate',
        name: 'intermediate-courses',
        component: () => import('@/views/japanese/IntermediateCourses.vue'),
        meta: {
          title: '中级课程',
        },
      },
      {
        path: 'advanced',
        name: 'advanced-courses',
        component: () => import('@/views/japanese/AdvancedCourses.vue'),
        meta: {
          title: '高级课程',
        },
      },
    ],
  },
  {
    path: '/learning',
    name: 'learning',
    component: layout,
    meta: {
      title: '互动学习',
      icon: () => h(book),
      isRoot: true,
    },
    children: [
      {
        path: 'words',
        name: 'word-learning',
        redirect: '/focused/words',
        meta: {
          title: '单词学习',
          icon: () => h(book),
        },
      },
      {
        path: 'grammar',
        name: 'grammar-learning',
        redirect: '/focused/grammar',
        meta: {
          title: '语法练习',
          icon: () => h(book),
        },
      },
      {
        path: 'listening',
        name: 'listening-learning',
        redirect: '/focused/listening',
        meta: {
          title: '听力练习',
          icon: () => h(book),
        },
      },
    ],
  },
  {
    path: '/progress',
    name: 'progress',
    component: layout,
    meta: {
      title: '学习进度',
      icon: () => h(chart),
      isRoot: true,
    },
    children: [
      {
        path: '',
        name: 'progress-index',
        component: () => import('@/views/japanese/StudyProgress.vue'),
        meta: {
          title: '学习统计',
        },
      },
    ],
  },
  {
    path: '/help',
    name: 'help',
    component: layout,
    meta: {
      title: '帮助中心',
      icon: () => h(help),
    },
    children: [
      {
        path: 'faq',
        name: 'faq',
        component: () => import('@/views/japanese/FAQ.vue'),
        meta: {
          title: '常见问题',
        },
      },
      {
        path: 'contact',
        name: 'contact',
        component: () => import('@/views/japanese/Contact.vue'),
        meta: {
          title: '联系我们',
        },
      },
    ],
  },
  {
    path: '/about',
    name: 'about',
    component: layout,
    meta: {
      icon: () => h(info),
      title: '关于我们',
    },
    children: [
      {
        path: 'project',
        name: 'about-project',
        component: () => import('@/views/japanese/AboutProject.vue'),
        meta: {
          title: '关于项目',
        },
      },
    ],
  },

  // 认证相关路由
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/auth/Login.vue'),
    meta: {
      title: '登录',
      hideInMenu: true,
    },
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('@/views/auth/Register.vue'),
    meta: {
      title: '注册',
      hideInMenu: true,
    },
  },
  {
    path: '/test/route',
    name: 'route-test',
    component: layout,
    meta: {
      title: '路由测试',
      icon: () => h(book),
      isRoot: true,
    },
    children: [
      {
        path: '',
        name: 'route-test-index',
        component: () => import('@/views/test/RouteTest.vue'),
        meta: {
          title: '路由测试',
        },
      },
    ],
  },
]

export default routes
