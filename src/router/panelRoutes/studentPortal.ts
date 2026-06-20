export const index = [
  {
    path: 'my-quizzes',
    name: 'Student.Quiz.List',
    meta: {
      pageCategory: 'آزمون‌های آنلاین'
    },
    component: () => import('src/pages/panel/student/quizzes.vue')
  },
  {
    path: 'my-quizzes/:id',
    name: 'Student.Quiz.Show',
    meta: {
      pageCategory: 'جزئیات آزمون'
    },
    component: () => import('src/pages/panel/student/quiz-detail.vue')
  },
  {
    path: 'my-quizzes/:id/attempt',
    name: 'Student.Quiz.Attempt',
    meta: {
      pageCategory: 'شرکت در آزمون'
    },
    component: () => import('src/pages/panel/quiz/attempt.vue')
  },
  {
    path: 'my-grades',
    name: 'Student.Grade.List',
    meta: {
      pageCategory: 'نمرات من'
    },
    component: () => import('src/pages/panel/student/grades.vue')
  },
  {
    path: 'my-homework',
    name: 'Student.Homework.List',
    meta: {
      pageCategory: 'تکالیف من'
    },
    component: () => import('src/pages/panel/student/homework.vue')
  }
]
