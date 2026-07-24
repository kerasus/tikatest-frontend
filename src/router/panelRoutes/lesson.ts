import type { RouteRecordRaw } from 'vue-router'
import Authenticated from 'src/router/middleware/Authenticated'
import hasOneOfThisRoles from 'src/router/middleware/hasOneOfThisRoles'

export const index = [
  {
    path: 'lessons',
    name: 'Panel.Lesson.List',
    meta: {
      pageCategory: 'مدیریت دروس',
      middleware: [Authenticated, hasOneOfThisRoles(['Admin'])]
    },
    component: () => import('src/pages/panel/lesson/list.vue')
  },
  {
    path: 'lessons/create',
    name: 'Panel.Lesson.Create',
    meta: {
      pageCategory: 'مدیریت دروس',
      middleware: [Authenticated, hasOneOfThisRoles(['Admin'])]
    },
    component: () => import('src/pages/panel/lesson/create.vue')
  },
  {
    path: 'lessons/:id/edit',
    name: 'Panel.Lesson.Edit',
    meta: {
      pageCategory: 'مدیریت دروس',
      middleware: [Authenticated, hasOneOfThisRoles(['Admin'])]
    },
    component: () => import('src/pages/panel/lesson/edit.vue')
  },
  {
    path: 'lessons/:id',
    name: 'Panel.Lesson.Show',
    meta: {
      pageCategory: 'مدیریت دروس',
      middleware: [Authenticated, hasOneOfThisRoles(['Admin'])]
    },
    component: () => import('src/pages/panel/lesson/show.vue')
  }
]
