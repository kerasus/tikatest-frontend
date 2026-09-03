import Authenticated from 'src/router/middleware/Authenticated'
import hasOneOfThisRoles from 'src/router/middleware/hasOneOfThisRoles'

export const index = [
  {
    path: 'schools',
    component: () => import('src/layouts/BareLayout.vue'),
    meta: {
      middleware: [Authenticated, hasOneOfThisRoles(['Admin'])],
      pageCategory: 'مدیریت مدارس'
    },
    children: [
      {
        path: '',
        name: 'Panel.School.List',
        meta: {
          breadCrumbs: [
            {
              label: 'لیست مدارس',
              to: { name: 'Panel.School.List' }
            }
          ]
        },
        component: () => import('src/pages/panel/school/list.vue')
      },
      {
        path: 'create',
        name: 'Panel.School.Create',
        meta: {
          breadCrumbs: [
            {
              label: 'لیست مدارس',
              to: { name: 'Panel.School.List' }
            },
            {
              label: 'تعریف مدرسه جدید',
              to: { name: 'Panel.School.Create' }
            }
          ]
        },
        component: () => import('src/pages/panel/school/create.vue')
      },
      {
        path: ':id',
        name: 'Panel.School.Show',
        meta: {
          breadCrumbs: [
            {
              label: 'لیست مدارس',
              to: { name: 'Panel.School.List' }
            },
            {
              label: 'مشاهده مدرسه',
              to: { name: 'Panel.School.Show' }
            }
          ]
        },
        component: () => import('src/pages/panel/school/show.vue')
      },
      {
        path: ':id/edit',
        name: 'Panel.School.Edit',
        meta: {
          breadCrumbs: [
            {
              label: 'لیست مدارس',
              to: { name: 'Panel.School.List' }
            },
            {
              label: 'ویرایش مدرسه',
              to: { name: 'Panel.School.Edit' }
            }
          ]
        },
        component: () => import('src/pages/panel/school/edit.vue')
      },
      {
        path: ':school_id/academic-tree',
        name: 'Panel.School.AcademicTree',
        meta: {
          breadCrumbs: [
            {
              label: 'لیست مدارس',
              to: { name: 'Panel.School.List' }
            },
            {
              label: 'مدیریت ساختار آموزشی',
              to: { name: 'Panel.School.AcademicTree' }
            }
          ]
        },
        component: () => import('pages/panel/school/academicTree.vue')
      },
      {
        path: ':school_id/classes',
        name: 'Panel.School.Classes',
        meta: {
          breadCrumbs: [
            {
              label: 'لیست مدارس',
              to: { name: 'Panel.School.List' }
            },
            {
              label: 'مدیریت کلاس ها',
              to: { name: 'Panel.School.Classes' }
            }
          ]
        },
        component: () => import('pages/panel/school/schoolClasses.vue')
      },
      {
        path: ':school_id/terms',
        name: 'Panel.School.Terms',
        meta: {
          breadCrumbs: [
            {
              label: 'لیست مدارس',
              to: { name: 'Panel.School.List' }
            },
            {
              label: 'مدیریت ترم‌ها',
              to: { name: 'Panel.School.Terms' }
            }
          ]
        },
        component: () => import('pages/panel/school/schoolTerms.vue')
      }
    ]
  }
]
