import type { RouteRecordRaw } from 'vue-router'
import studentRoutes from './student'
import classRoutes from './class'
import gradeRoutes from './grade'
import quizRoutes from './quiz'
import homeworkRoutes from './homework'
import messageRoutes from './message'
import Authenticated from 'src/router/middleware/Authenticated'
import hasOneOfThisRoles from 'src/router/middleware/hasOneOfThisRoles'

export const index: RouteRecordRaw[] = [
  {
    path: 'panel',
    meta: {
      middleware: [Authenticated],
      layoutConfig: {}
    },
    component: () => import('src/layouts/BareLayout.vue'),
    children: [
      {
        path: 'dashboard',
        name: 'Panel.Dashboard',
        meta: {
          pageCategory: 'داشبورد',
          middleware: [hasOneOfThisRoles(['Manager', 'Admin', 'Teacher'])]
        },
        component: () => import('src/pages/panel/dashboard.vue')
      },

      ...studentRoutes,
      ...classRoutes,
      ...gradeRoutes,
      ...quizRoutes,
      ...homeworkRoutes,
      ...messageRoutes,
    ]
  },

  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]
