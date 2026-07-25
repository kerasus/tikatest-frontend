import type { RouteRecordRaw } from 'vue-router'
import Authenticated from 'src/router/middleware/Authenticated'
import hasOneOfThisRoles from 'src/router/middleware/hasOneOfThisRoles'

export const index = [
  {
    path: 'academic-fields',
    name: 'Panel.AcademicField.List',
    meta: {
      pageCategory: 'مدیریت رشته‌ها',
      middleware: [Authenticated, hasOneOfThisRoles(['Admin'])]
    },
    component: () => import('src/pages/panel/academicField/list.vue')
  },
  {
    path: 'academic-fields/create',
    name: 'Panel.AcademicField.Create',
    meta: {
      pageCategory: 'مدیریت رشته‌ها',
      middleware: [Authenticated, hasOneOfThisRoles(['Admin'])]
    },
    component: () => import('src/pages/panel/academicField/create.vue')
  },
  {
    path: 'academic-fields/:id/edit',
    name: 'Panel.AcademicField.Edit',
    meta: {
      pageCategory: 'مدیریت رشته‌ها',
      middleware: [Authenticated, hasOneOfThisRoles(['Admin'])]
    },
    component: () => import('src/pages/panel/academicField/edit.vue')
  },
  {
    path: 'academic-fields/:id',
    name: 'Panel.AcademicField.Show',
    meta: {
      pageCategory: 'مدیریت رشته‌ها',
      middleware: [Authenticated, hasOneOfThisRoles(['Admin'])]
    },
    component: () => import('src/pages/panel/academicField/show.vue')
  }
]
