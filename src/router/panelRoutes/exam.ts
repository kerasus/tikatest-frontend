export const index = [
  {
    path: 'exams',
    component: () => import('src/layouts/BareLayout.vue'),
    children: [
      {
        path: 'online',
        component: () => import('src/layouts/BareLayout.vue'),
        children: [
          {
            path: '',
            name: 'Panel.Exam.Online.List',
            meta: {
              pageCategory: 'مدیریت آزمون‌ها'
            },
            component: () => import('src/pages/panel/exam/online/list.vue')
          },
          {
            path: 'create',
            name: 'Panel.Exam.Online.Create',
            meta: {
              pageCategory: 'مدیریت آزمون‌ها'
            },
            component: () => import('pages/panel/exam/online/create.vue')
          },
          {
            path: ':id',
            name: 'Panel.Exam.Online.Show',
            meta: {
              pageCategory: 'مدیریت آزمون‌ها'
            },
            component: () => import('pages/panel/exam/online/show.vue')
          }
        ]
      },
      {
        path: 'in-person',
        component: () => import('src/layouts/BareLayout.vue'),
        children: [
          {
            path: '',
            name: 'Panel.Exam.InPerson.List',
            meta: {
              pageCategory: 'مدیریت آزمون‌ها'
            },
            component: () => import('pages/panel/exam/inPerson/list.vue')
          },
          {
            path: 'create',
            name: 'Panel.Exam.InPerson.Create',
            meta: {
              pageCategory: 'مدیریت نمرات'
            },
            component: () => import('pages/panel/exam/inPerson/create.vue')
          },
          {
            path: ':id',
            name: 'Panel.Exam.InPerson.Show',
            meta: {
              pageCategory: 'مدیریت آزمون‌ها'
            },
            component: () => import('src/pages/panel/exam/inPerson/show.vue')
          }
        ]
      }
    ]
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
