import type { RouteRecordRaw } from 'vue-router'
import { index as studentRoutes } from './student'
import { index as userRoutes } from './user'
import { index as classRoutes } from './class'
import { index as gradeRoutes } from './grade'
import { index as quizRoutes } from './quiz'
import { index as homeworkRoutes } from './homework'
import { index as messageRoutes } from './message'
import { index as examSessionRoutes } from './examSession'
import { index as disciplinaryRoutes } from './disciplinary'
import { index as studentPortalRoutes } from './studentPortal'
import { index as calendarRoutes } from './calendar'
import { index as studyHoursRoutes } from './studyHours'
import { index as schoolRoutes } from './school'
import { index as academicTreeRoutes } from './academicTree'
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

      ...userRoutes,
      ...studentRoutes,
      ...classRoutes,
      ...gradeRoutes,
      ...quizRoutes,
      ...homeworkRoutes,
      ...messageRoutes,
      ...examSessionRoutes,
      ...disciplinaryRoutes,
      ...studentPortalRoutes,
      ...calendarRoutes,
      ...studyHoursRoutes,
      ...schoolRoutes,
      ...academicTreeRoutes
    ]
  },

  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]
