import type { RouteRecordRaw } from 'vue-router'
import Authenticated from 'src/router/middleware/Authenticated'
import hasOneOfThisRoles from 'src/router/middleware/hasOneOfThisRoles'

export const index = [
  {
    path: 'academic-levels',
    name: 'Panel.AcademicLevel.List',
    meta: {
      pageCategory: 'مدیریت مقطع‌ها',
      middleware: [Authenticated, hasOneOfThisRoles(['Admin'])]
    },
    component: () => import('src/pages/panel/academicLevel/list.vue')
  },
  {
    path: 'academic-levels/create',
    name: 'Panel.AcademicLevel.Create',
    meta: {
      pageCategory: 'مدیریت مقطع‌ها',
      middleware: [Authenticated, hasOneOfThisRoles(['Admin'])]
    },
    component: () => import('src/pages/panel/academicLevel/create.vue')
  },
  {
    path: 'academic-levels/:id/edit',
    name: 'Panel.AcademicLevel.Edit',
    meta: {
      pageCategory: 'مدیریت مقطع‌ها',
      middleware: [Authenticated, hasOneOfThisRoles(['Admin'])]
    },
    component: () => import('src/pages/panel/academicLevel/edit.vue')
  },
  {
    path: 'academic-levels/:id',
    name: 'Panel.AcademicLevel.Show',
    meta: {
      pageCategory: 'مدیریت مقطع‌ها',
      middleware: [Authenticated, hasOneOfThisRoles(['Admin'])]
    },
    component: () => import('src/pages/panel/academicLevel/show.vue')
  }
]
