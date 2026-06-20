export const index = [
  {
    path: 'students',
    name: 'Panel.Student.List',
    meta: {
      pageCategory: 'مدیریت دانش آموزان'
    },
    component: () => import('src/pages/panel/student/list.vue')
  },
  {
    path: 'students/create',
    name: 'Panel.Student.Create',
    meta: {
      pageCategory: 'مدیریت دانش آموزان'
    },
    component: () => import('src/pages/panel/student/create.vue')
  },
  {
    path: 'students/:id',
    name: 'Panel.Student.Show',
    meta: {
      pageCategory: 'مدیریت دانش آموزان'
    },
    component: () => import('src/pages/panel/student/show.vue')
  },
  {
    path: 'students/:id/edit',
    name: 'Panel.Student.Edit',
    meta: {
      pageCategory: 'مدیریت دانش آموزان'
    },
    component: () => import('src/pages/panel/student/edit.vue')
  }
]
