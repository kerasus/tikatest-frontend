export const index = [
  {
    path: 'grades/:id',
    name: 'Panel.Grade.Show',
    meta: {
      pageCategory: 'مدیریت نمرات'
    },
    component: () => import('src/pages/panel/grade/show.vue')
  },
  {
    path: 'grades/report/lesson/:lessonId',
    name: 'Panel.GradeReport.Lesson',
    meta: { pageCategory: 'گزارش نمرات' },
    component: () => import('src/pages/panel/grade/report-lesson.vue')
  },
  {
    path: 'grades/report/multiple-lessons',
    name: 'Panel.GradeReport.Multiple',
    meta: { pageCategory: 'گزارش نمرات' },
    component: () => import('src/pages/panel/grade/report-multiple.vue')
  },
  {
    path: 'grades/report/student/:studentId',
    name: 'Panel.GradeReport.Student',
    meta: { pageCategory: 'گزارش نمرات' },
    component: () => import('src/pages/panel/grade/report-student.vue')
  },
  {
    path: 'report-card',
    name: 'Panel.ReportCard',
    meta: { pageCategory: 'کارنامه' },
    component: () => import('src/pages/panel/grade/report-card-admin.vue')
  }
]
