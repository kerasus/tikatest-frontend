export const index = [
  {
    path: 'study-hours',
    name: 'Panel.StudyHours.General',
    meta: { pageCategory: 'ساعت مطالعه' },
    component: () => import('src/pages/panel/study-hours/general.vue')
  },
  {
    path: 'study-hours/student/:studentId',
    name: 'Panel.StudyHours.Individual',
    meta: { pageCategory: 'ساعت مطالعه' },
    component: () => import('src/pages/panel/study-hours/individual.vue')
  }
]