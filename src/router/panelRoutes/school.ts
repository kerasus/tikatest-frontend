import type { RouteRecordRaw } from 'vue-router'
import Authenticated from 'src/router/middleware/Authenticated'
import hasOneOfThisRoles from 'src/router/middleware/hasOneOfThisRoles'

export const index = [
  {
    path: 'schools',
    name: 'Panel.School.List',
    meta: {
      pageCategory: 'مدیریت مدارس',
      middleware: [Authenticated, hasOneOfThisRoles(['Admin'])]
    },
    component: () => import('src/pages/panel/school/list.vue')
  },
  {
    path: 'schools/create',
    name: 'Panel.School.Create',
    meta: {
      pageCategory: 'مدیریت مدارس',
      middleware: [Authenticated, hasOneOfThisRoles(['Admin'])]
    },
    component: () => import('src/pages/panel/school/create.vue')
  },
  {
    path: 'schools/:id/edit',
    name: 'Panel.School.Edit',
    meta: {
      pageCategory: 'مدیریت مدارس',
      middleware: [Authenticated, hasOneOfThisRoles(['Admin'])]
    },
    component: () => import('src/pages/panel/school/edit.vue')
  },
  {
    path: 'schools/:school_id/grades/create',
    name: 'Panel.School.Grade.Create',
    meta: {
      pageCategory: 'مدیریت مدارس',
      middleware: [Authenticated, hasOneOfThisRoles(['Admin'])]
    },
    component: () => import('src/pages/panel/grade/schoolCreate.vue')
  },
  {
    path: 'schools/:school_id/classes',
    name: 'Panel.School.Classes',
    meta: {
      pageCategory: 'مدیریت مدارس',
      middleware: [Authenticated, hasOneOfThisRoles(['Admin'])]
    },
    component: () => import('pages/panel/school/schoolClasses.vue')
  },
  {
    path: 'schools/:id',
    name: 'Panel.School.Show',
    meta: {
      pageCategory: 'مدیریت مدارس',
      middleware: [Authenticated, hasOneOfThisRoles(['Admin'])]
    },
    component: () => import('src/pages/panel/school/show.vue')
  }
]
