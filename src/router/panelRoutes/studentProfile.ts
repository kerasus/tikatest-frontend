export const index = [
  {
    path: 'student-profiles',
    name: 'Panel.StudentProfile.List',
    meta: {
      pageCategory: 'پروفایل‌های دانش‌آموزی'
    },
    component: () => import('src/pages/panel/studentProfile/list.vue')
  },
  {
    path: 'student-profiles/create',
    name: 'Panel.StudentProfile.Create',
    meta: {
      pageCategory: 'پروفایل‌های دانش‌آموزی'
    },
    component: () => import('src/pages/panel/studentProfile/create.vue')
  },
  {
    path: 'student-profiles/:id',
    name: 'Panel.StudentProfile.Show',
    meta: {
      pageCategory: 'پروفایل‌های دانش‌آموزی'
    },
    component: () => import('src/pages/panel/studentProfile/show.vue')
  }
]
