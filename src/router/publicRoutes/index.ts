import authRoutes from './auth'
import type { RouteRecordRaw } from 'vue-router'

export const index: RouteRecordRaw[] = [
  {
    path: '',
    meta: {
      layoutConfig: {
        layoutHeader: false,
        layoutLeftDrawer: false,
        layoutRightDrawer: false,
        layoutFooter: false
      }
    },
    name: 'HomePage',
    // redirect: () => {
    //   // the function receives the target route as the argument
    //   // we return a redirect path/location here.
    //   return { name: 'Auth.Login' }
    // }
    component: () => import('src/pages/IndexPage.vue')
  },
  ...authRoutes
]
