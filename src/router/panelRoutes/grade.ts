export const index = [
  {
    path: 'grades',
    name: 'Panel.Grade.List',
    meta: {
      pageCategory: 'مدیریت نمرات'
    },
    component: () => import('src/pages/panel/grade/list.vue')
  },
  {
    path: 'grades/create',
    name: 'Panel.Grade.Create',
    meta: {
      pageCategory: 'مدیریت نمرات'
    },
    component: () => import('src/pages/panel/grade/create.vue')
  },
  {
    path: 'grades/:id',
    name: 'Panel.Grade.Show',
    meta: {
      pageCategory: 'مدیریت نمرات'
    },
    component: () => import('src/pages/panel/grade/show.vue')
  }
]
