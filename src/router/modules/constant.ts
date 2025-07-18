import type { RouteRecordRaw } from 'vue-router'
import layout from '../../layouts/TopNavLayout.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/redirect',
    name: 'RedirectComponent',
    component: layout,
    meta: {
      hidden: true,
      hideBreadcrumb: true,
    },
    children: [
      {
        path: '/redirect/:path(.*)',
        name: 'RedirectComponent',
        component: () => import('@/views/redirect/index.vue'),
      },
    ],
  },
  {
    path: '/',
    name: 'Root',
    redirect: '/home',
  },
  {
    path: '/debug/api-test',
    name: 'api-test',
    component: () => import('@/views/debug/ApiTest.vue'),
    meta: {
      title: 'API测试',
      hideInMenu: true,
      requiresAuth: false,
    },
  },
  {
    path: '/debug/course-test',
    name: 'course-test',
    component: () => import('@/views/debug/SimpleCourseTest.vue'),
    meta: {
      title: '课程测试',
      hideInMenu: true,
      requiresAuth: false,
    },
  },
  {
    path: '/debug/direct-api-test',
    name: 'direct-api-test',
    component: () => import('@/views/debug/DirectApiTest.vue'),
    meta: {
      title: '直接API测试',
      hideInMenu: true,
      requiresAuth: false,
    },
  },
  {
    path: '/debug/data-flow-test',
    name: 'data-flow-test',
    component: () => import('@/views/debug/DataFlowTest.vue'),
    meta: {
      title: '数据流测试',
      hideInMenu: true,
      requiresAuth: false,
    },
  },
  {
    path: '/debug/minimal-course-list',
    name: 'minimal-course-list',
    component: () => import('@/views/debug/MinimalCourseList.vue'),
    meta: {
      title: '最小化课程列表',
      hideInMenu: true,
      requiresAuth: false,
    },
  },
]

export default routes
