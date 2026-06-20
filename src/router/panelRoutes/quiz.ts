export const index = [
  {
    path: 'quizzes',
    name: 'Panel.Quiz.List',
    meta: {
      pageCategory: 'آزمون‌های آنلاین'
    },
    component: () => import('src/pages/panel/quiz/list.vue')
  },
  {
    path: 'quizzes/create',
    name: 'Panel.Quiz.Create',
    meta: {
      pageCategory: 'آزمون‌های آنلاین'
    },
    component: () => import('src/pages/panel/quiz/create.vue')
  },
  {
    path: 'quizzes/:id',
    name: 'Panel.Quiz.Show',
    meta: {
      pageCategory: 'آزمون‌های آنلاین'
    },
    component: () => import('src/pages/panel/quiz/show.vue')
  },
  {
    path: 'quizzes/:id/results',
    name: 'Panel.Quiz.Results',
    meta: {
      pageCategory: 'آزمون‌های آنلاین'
    },
    component: () => import('src/pages/panel/quiz/results.vue')
  }
]
