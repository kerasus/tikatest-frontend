export const index = [
  {
    path: 'exams',
    name: 'Panel.Exam.List',
    meta: {
      pageCategory: 'مدیریت آزمون‌ها'
    },
    component: () => import('src/pages/panel/exam/list.vue')
  },
  {
    path: 'exams/create',
    name: 'Panel.Exam.Create',
    meta: {
      pageCategory: 'مدیریت آزمون‌ها'
    },
    component: () => import('src/pages/panel/exam/create.vue')
  },
  {
    path: 'exams/:id',
    name: 'Panel.Exam.Show',
    meta: {
      pageCategory: 'مدیریت آزمون‌ها'
    },
    component: () => import('src/pages/panel/exam/show.vue')
  },
  {
    path: 'exams/:id/edit',
    name: 'Panel.Exam.Edit',
    meta: {
      pageCategory: 'مدیریت آزمون‌ها'
    },
    component: () => import('src/pages/panel/exam/edit.vue')
  }
]
