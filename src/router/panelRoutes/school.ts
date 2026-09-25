import type { RouteRecordRaw } from 'vue-router'
import Authenticated from 'src/router/middleware/Authenticated'
import hasOneOfThisRoles from 'src/router/middleware/hasOneOfThisRoles'

export const index: RouteRecordRaw[] = [
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
        path: ':id/academic-tree',
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
        path: ':id/classes',
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
        path: ':id/terms',
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
  },
  {
    path: 'current-school',
    component: () => import('src/layouts/BareLayout.vue'),
    meta: {
      middleware: [Authenticated, hasOneOfThisRoles(['Manager', 'Staff'])],
      pageCategory: 'مدیریت مدارس'
    },
    children: [
      {
        path: '',
        name: 'Panel.CurrentSchool.Show',
        meta: {
          breadCrumbs: [
            {
              label: 'مشاهده مدرسه',
              to: { name: 'Panel.CurrentSchool.Show' }
            }
          ]
        },
        component: () => import('src/pages/panel/school/show.vue')
      },
      {
        path: 'edit',
        name: 'Panel.CurrentSchool.Edit',
        meta: {
          breadCrumbs: [
            {
              label: 'ویرایش مدرسه',
              to: { name: 'Panel.CurrentSchool.Edit' }
            }
          ]
        },
        component: () => import('src/pages/panel/school/edit.vue')
      },
      {
        path: 'academic-tree',
        name: 'Panel.CurrentSchool.AcademicTree',
        meta: {
          breadCrumbs: [
            {
              label: 'مدیریت ساختار آموزشی',
              to: { name: 'Panel.CurrentSchool.AcademicTree' }
            }
          ]
        },
        component: () => import('pages/panel/school/academicTree.vue')
      },
      {
        path: 'classes',
        name: 'Panel.CurrentSchool.Classes',
        meta: {
          breadCrumbs: [
            {
              label: 'مدیریت کلاس‌ها',
              to: { name: 'Panel.CurrentSchool.Classes' }
            }
          ]
        },
        component: () => import('pages/panel/school/schoolClasses.vue')
      },
      {
        path: 'terms',
        name: 'Panel.CurrentSchool.Terms',
        meta: {
          breadCrumbs: [
            {
              label: 'مدیریت ترم‌ها',
              to: { name: 'Panel.CurrentSchool.Terms' }
            }
          ]
        },
        component: () => import('pages/panel/school/schoolTerms.vue')
      }
    ]
  }
]
