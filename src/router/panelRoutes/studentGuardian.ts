export const index = [
  {
    path: 'student-guardians',
    name: 'Panel.StudentGuardian.List',
    meta: {
      pageCategory: 'وصی نگهبانان دانش‌آموزی'
    },
    component: () => import('src/pages/panel/studentGuardian/list.vue')
  },
  {
    path: 'student-guardians/create',
    name: 'Panel.StudentGuardian.Create',
    meta: {
      pageCategory: 'وصی نگهبانان دانش‌آموزی'
    },
    component: () => import('src/pages/panel/studentGuardian/create.vue')
  },
  {
    path: 'student-guardians/:id',
    name: 'Panel.StudentGuardian.Show',
    meta: {
      pageCategory: 'وصی نگهبانان دانش‌آموزی'
    },
    component: () => import('src/pages/panel/studentGuardian/show.vue')
  }
]
