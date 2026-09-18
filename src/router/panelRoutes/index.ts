import type { RouteRecordRaw } from 'vue-router'
import { index as studentRoutes } from './student'
import { index as userRoutes } from './user'
import { index as gradeRoutes } from './grade'
import { index as homeworkRoutes } from './homework'
import { index as messageRoutes } from './message'
import { index as examRoutes } from './exam'
import { index as examCategoryRoutes } from './examCategory'
import { index as reportCardRoutes } from './reportCard'
import { index as disciplinaryRoutes } from './disciplinary'
import { index as studentPortalRoutes } from './studentPortal'
import { index as calendarRoutes } from './calendar'
import { index as studyHoursRoutes } from './studyHours'
import { index as schoolRoutes } from './school'
import { index as studentProfileRoutes } from './studentProfile'
import { index as studentGuardianRoutes } from './studentGuardian'
import Authenticated from 'src/router/middleware/Authenticated'
import hasOneOfThisRoles from 'src/router/middleware/hasOneOfThisRoles'

export const index: RouteRecordRaw[] = [
  {
    path: ':school/:role',
    meta: {
      middleware: [Authenticated],
      layoutConfig: {
        pageCustomClass: 'q-pa-md'
      }
    },
    component: () => import('src/layouts/BareLayout.vue'),
    children: [
      {
        path: 'dashboard',
        name: 'Panel.AdminDashboard',
        meta: {
          pageCategory: 'داشبورد',
          middleware: [hasOneOfThisRoles(['Manager', 'Admin', 'Teacher'])]
        },
        component: () => import('pages/panel/adminDashboard.vue')
      },
      {
        path: 'dashboard',
        name: 'Panel.SchoolDashboard',
        meta: {
          pageCategory: 'داشبورد',
          middleware: [hasOneOfThisRoles(['Manager', 'Staff', 'Teacher'])]
        },
        component: () => import('src/pages/panel/schoolDashboard.vue')
      },
      {
        path: 'profile',
        name: 'Panel.Profile',
        meta: {
          pageCategory: 'پروفایل',
          middleware: [hasOneOfThisRoles(['Admin', 'Manager', 'Staff', 'Teacher'])]
        },
        component: () => import('src/pages/panel/user/profile.vue')
      },

      ...userRoutes,
      ...studentRoutes,
      ...gradeRoutes,
      ...homeworkRoutes,
      ...messageRoutes,
      ...examRoutes,
      ...examCategoryRoutes,
      ...reportCardRoutes,
      ...disciplinaryRoutes,
      ...calendarRoutes,
      ...studyHoursRoutes,
      ...schoolRoutes,
      ...studentProfileRoutes,
      ...studentGuardianRoutes,

      ...studentPortalRoutes
    ]
  }
]
