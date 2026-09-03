export const index = [
  {
    path: 'exam-categories',
    component: () => import('src/layouts/BareLayout.vue'),
    meta: {
      pageCategory: 'دسته‌بندی آزمون‌ها'
    },
    children: [
      {
        path: '',
        name: 'Panel.ExamCategory.List',
        meta: {
          breadCrumbs: [
            {
              label: 'دسته‌بندی آزمون‌ها'
            }
          ]
        },
        component: () => import('pages/panel/examCategory/list.vue')
      },
      {
        path: 'create',
        name: 'Panel.ExamCategory.Create',
        meta: {
          pageCategory: 'دسته‌بندی آزمون‌ها',
          breadCrumbs: [
            {
              label: 'دسته‌بندی آزمون‌ها',
              to: { name: 'Panel.ExamCategory.List' }
            },
            {
              label: 'تعریف دسته‌بندی'
            }
          ]
        },
        component: () => import('pages/panel/examCategory/create.vue')
      },
      {
        path: ':id',
        name: 'Panel.ExamCategory.Show',
        meta: {
          pageCategory: 'دسته‌بندی آزمون‌ها',
          breadCrumbs: [
            {
              label: 'دسته‌بندی آزمون‌ها',
              to: { name: 'Panel.ExamCategory.List' }
            },
            {
              label: 'مشاهده دسته‌بندی'
            }
          ]
        },
        component: () => import('pages/panel/examCategory/show.vue')
      },
      {
        path: ':id/edit',
        name: 'Panel.ExamCategory.Edit',
        meta: {
          pageCategory: 'دسته‌بندی آزمون‌ها',
          breadCrumbs: [
            {
              label: 'دسته‌بندی آزمون‌ها',
              to: { name: 'Panel.ExamCategory.List' }
            },
            {
              label: 'ویرایش دسته‌بندی'
            }
          ]
        },
        component: () => import('pages/panel/examCategory/edit.vue')
      }
    ]
  }
]
