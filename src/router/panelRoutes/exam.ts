export const index = [
  {
    path: 'online-exams',
    name: 'Panel.OnlineExam.List',
    meta: {
      pageCategory: 'مدیریت آزمون‌ها'
    },
    component: () => import('src/pages/panel/exam/online/list.vue')
  },
  {
    path: 'exams/create',
    name: 'Panel.OnlineExam.Create',
    meta: {
      pageCategory: 'مدیریت آزمون‌ها'
    },
    component: () => import('pages/panel/exam/online/create.vue')
  },
  {
    path: 'in-person-exams',
    name: 'Panel.inPersonExamList.List',
    meta: {
      pageCategory: 'مدیریت آزمون‌ها'
    },
    component: () => import('pages/panel/exam/inPersonExamList.vue')
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
    path: 'exams/:id/sessions',
    name: 'Panel.Exam.Sessions',
    meta: {
      pageCategory: 'مدیریت آزمون‌ها'
    },
    component: () => import('src/pages/panel/exam/sessions.vue')
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
