export const index = [
  {
    path: 'homework',
    name: 'Panel.Homework.List',
    meta: {
      pageCategory: 'تکالیف'
    },
    component: () => import('src/pages/panel/homework/list.vue')
  },
  {
    path: 'homework/create',
    name: 'Panel.Homework.Create',
    meta: {
      pageCategory: 'تکالیف'
    },
    component: () => import('src/pages/panel/homework/create.vue')
  },
  {
    path: 'homework/:id',
    name: 'Panel.Homework.Show',
    meta: {
      pageCategory: 'تکلیف'
    },
    component: () => import('src/pages/panel/homework/show.vue')
  },
  {
    path: 'homework/:id/edit',
    name: 'Panel.Homework.Edit',
    meta: {
      pageCategory: 'تکلیف'
    },
    component: () => import('src/pages/panel/homework/edit.vue')
  }
]
