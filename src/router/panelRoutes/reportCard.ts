export const index = [
  {
    path: 'report-cards',
    component: () => import('src/layouts/BareLayout.vue'),
    meta: {
      pageCategory: 'کارنامه‌ها'
    },
    children: [
      {
        path: 'grade-detail',
        name: 'Panel.ReportCard.Generate',
        meta: {
          breadCrumbs: [
            {
              label: 'کارنامه ریز نمرات'
            }
          ]
        },
        component: () => import('src/pages/panel/reportCard/generate.vue')
      },
      {
        path: 'grade-detail/print',
        name: 'Panel.ReportCard.Generate.Print',
        meta: {
          layoutConfig: {
            layoutHeader: false,
            layoutLeftDrawer: false,
            layoutRightDrawer: false,
            layoutFooter: false
          },
          breadCrumbs: [
            {
              label: 'چاپ کارنامه'
            }
          ]
        },
        component: () => import('src/pages/panel/reportCard/generatePrint.vue')
      },
      {
        path: 'comprehensive',
        name: 'Panel.ReportCard.Comprehensive',
        meta: {
          breadCrumbs: [
            {
              label: 'کارنامه جامع'
            }
          ]
        },
        component: () => import('src/pages/panel/reportCard/comprehensive.vue')
      },
      {
        path: 'comprehensive/print',
        name: 'Panel.ReportCard.Comprehensive.Print',
        meta: {
          layoutConfig: {
            layoutHeader: false,
            layoutLeftDrawer: false,
            layoutRightDrawer: false,
            layoutFooter: false
          },
          breadCrumbs: [
            {
              label: 'چاپ کارنامه جامع'
            }
          ]
        },
        component: () => import('src/pages/panel/reportCard/comprehensivePrint.vue')
      },
      {
        path: 'grade-matrix',
        name: 'Panel.ReportCard.GradeMatrix',
        meta: {
          breadCrumbs: [
            {
              label: 'ماتریس ریز نمرات'
            }
          ]
        },
        component: () => import('src/pages/panel/reportCard/gradeMatrix.vue')
      },
      {
        path: 'grade-matrix/print',
        name: 'Panel.ReportCard.GradeMatrix.Print',
        meta: {
          layoutConfig: {
            layoutHeader: false,
            layoutLeftDrawer: false,
            layoutRightDrawer: false,
            layoutFooter: false
          },
          breadCrumbs: [
            {
              label: 'چاپ ماتریس'
            }
          ]
        },
        component: () => import('src/pages/panel/reportCard/gradeMatrixPrint.vue')
      },
      {
        path: 'class-grade-sheet',
        name: 'Panel.ReportCard.ClassGradeSheet',
        meta: {
          breadCrumbs: [
            {
              label: 'شیت نمرات کلاسی'
            }
          ]
        },
        component: () => import('src/pages/panel/reportCard/classGradeSheet.vue')
      },
      {
        path: 'class-grade-sheet/print',
        name: 'Panel.ReportCard.ClassGradeSheet.Print',
        meta: {
          layoutConfig: {
            layoutHeader: false,
            layoutLeftDrawer: false,
            layoutRightDrawer: false,
            layoutFooter: false
          },
          breadCrumbs: [
            {
              label: 'چاپ شیت'
            }
          ]
        },
        component: () => import('src/pages/panel/reportCard/classGradeSheetPrint.vue')
      }
    ]
  }
]
