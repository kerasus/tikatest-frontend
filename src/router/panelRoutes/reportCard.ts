export const index = [
  {
    path: 'report-cards',
    component: () => import('src/layouts/BareLayout.vue'),
    meta: {
      pageCategory: 'کارنامه ریز نمرات'
    },
    children: [
      {
        path: '',
        name: 'Panel.ReportCard.Generate',
        meta: {
          breadCrumbs: [
            {
              label: 'تهیه کارنامه'
            }
          ]
        },
        component: () => import('pages/panel/reportCard/generate.vue')
      }
    ]
  }
]
