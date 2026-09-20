import type { RouteRecordRaw } from 'vue-router'

const authRoutes: RouteRecordRaw[] = [
  {
    path: 'auth',
    meta: {
      layoutConfig: {
        layoutHeader: false,
        layoutLeftDrawer: false,
        layoutRightDrawer: false,
        layoutFooter: false
      }
    },
    component: () => import('src/layouts/BareLayout.vue'),
    children: [
      {
        path: 'login',
        name: 'PublicAuth.Login',
        component: () => import('src/pages/Auth.vue')
      }
    ]
  },
  {
    path: ':school/:role/auth',
    meta: {
      layoutConfig: {
        layoutHeader: false,
        layoutLeftDrawer: false,
        layoutRightDrawer: false,
        layoutFooter: false
      }
    },
    component: () => import('src/layouts/BareLayout.vue'),
    children: [
      {
        path: 'login',
        name: 'Auth.Login',
        component: () => import('src/pages/Auth.vue')
      }
    ]
  }
]

export default authRoutes
