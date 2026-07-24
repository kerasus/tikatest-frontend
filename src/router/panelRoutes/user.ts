import type { RouteRecordRaw } from 'vue-router'
import Authenticated from 'src/router/middleware/Authenticated'
import hasOneOfThisRoles from 'src/router/middleware/hasOneOfThisRoles'

export const index: RouteRecordRaw[] = [
  {
    path: 'users',
    name: 'Panel.User',
    meta: {
      pageCategory: 'کاربران'
    },
    component: () => import('src/layouts/BareLayout.vue'),
    children: [
      {
        path: '',
        name: 'Panel.User.List',
        meta: {
          breadCrumbs: [
            {
              label: 'لیست'
            }
          ]
        },
        component: () => import('src/pages/panel/user/list.vue')
      },
      {
        path: 'create',
        name: 'Panel.User.Create',
        meta: {
          breadCrumbs: [
            {
              label: 'جدید'
            }
          ]
        },
        component: () => import('src/pages/panel/user/create.vue')
      },
      {
        path: ':id',
        name: 'Panel.User.Show',
        meta: {
          breadCrumbs: [
            {
              label: 'مشاهده'
            }
          ]
        },
        component: () => import('src/pages/panel/user/show.vue')
      },
      {
        path: ':id/edit',
        name: 'Panel.User.Edit',
        meta: {
          breadCrumbs: [
            {
              label: 'ویرایش'
            }
          ]
        },
        component: () => import('src/pages/panel/user/edit.vue')
      },
      {
        path: 'roles',
        name: 'Panel.User.Roles',
        meta: {
          pageCategory: 'مدیریت نقش‌های کاربران',
          middleware: [Authenticated, hasOneOfThisRoles(['Admin'])],
          breadCrumbs: [
            {
              label: 'نقش‌ها'
            }
          ]
        },
        component: () => import('src/pages/panel/user/role-management.vue')
      },
      {
        path: 'teachers',
        name: 'Panel.User.Teachers',
        meta: {
          pageCategory: 'مدیریت معلمان',
          middleware: [Authenticated, hasOneOfThisRoles(['Admin'])],
          breadCrumbs: [
            {
              label: 'معلمان'
            }
          ]
        },
        component: () => import('src/pages/panel/user/teacher-list.vue')
      },
      {
        path: 'managers',
        name: 'Panel.User.Managers',
        meta: {
          pageCategory: 'مدیریت مدیران',
          middleware: [Authenticated, hasOneOfThisRoles(['Admin'])],
          breadCrumbs: [
            {
              label: 'مدیران'
            }
          ]
        },
        component: () => import('src/pages/panel/user/manager-list.vue')
      },
      {
        path: 'staff',
        name: 'Panel.User.Staff',
        meta: {
          pageCategory: 'مدیریت کارکنان',
          middleware: [Authenticated, hasOneOfThisRoles(['Admin'])],
          breadCrumbs: [
            {
              label: 'کارکنان'
            }
          ]
        },
        component: () => import('src/pages/panel/user/staff-list.vue')
      }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]
