export const index = [
  {
    path: 'exam-sessions',
    name: 'Panel.ExamSession.List',
    meta: {
      pageCategory: 'مدیریت آزمون‌های کلاسی'
    },
    component: () => import('src/pages/panel/examSession/list.vue')
  },
  {
    path: 'exam-sessions/create',
    name: 'Panel.ExamSession.Create',
    meta: {
      pageCategory: 'مدیریت آزمون‌های کلاسی'
    },
    component: () => import('src/pages/panel/examSession/create.vue')
  },
  {
    path: 'exam-sessions/:id',
    name: 'Panel.ExamSession.Show',
    meta: {
      pageCategory: 'مدیریت آزمون‌های کلاسی'
    },
    component: () => import('src/pages/panel/examSession/show.vue')
  }
]
