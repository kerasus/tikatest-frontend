import type { RouteRecordRaw } from 'vue-router'
import Authenticated from 'src/router/middleware/Authenticated'
import hasOneOfThisRoles from 'src/router/middleware/hasOneOfThisRoles'

export const index = [
  {
    path: 'schools/:school_id/academic-tree',
    name: 'Panel.AcademicTree',
    meta: {
      pageCategory: 'ساختار آموزشی',
      middleware: [Authenticated, hasOneOfThisRoles(['Admin'])]
    },
    component: () => import('src/pages/panel/academicTree.vue')
  }
]
