import type {
  RouteLocationAsPathGeneric,
  RouteLocationAsRelativeGeneric,
  RouteRecordRaw
} from 'vue-router'

export const PublicLoginRouteName = 'PublicAuth.Login'
export const SchoolLoginRouteName = 'Auth.Login'

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
        name: PublicLoginRouteName,
        meta: {
          layoutConfig: {
            layoutHeader: false,
            layoutLeftDrawer: false,
            layoutRightDrawer: false,
            layoutFooter: false,
            pageCustomClass: ''
          }
        },
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
        layoutFooter: false,
        pageCustomClass: ''
      }
    },
    component: () => import('src/layouts/BareLayout.vue'),
    children: [
      {
        path: 'login',
        name: SchoolLoginRouteName,
        component: () => import('src/pages/Auth.vue')
      }
    ]
  }
]

export default authRoutes

export function isPublicLoginRoute (
  route: string | RouteLocationAsRelativeGeneric | RouteLocationAsPathGeneric | RouteRecordRaw
): boolean {
  if (typeof route === 'string') {
    return route.startsWith(PublicLoginRouteName)
  }

  if ('name' in route && route.name !== undefined) {
    return route.name === PublicLoginRouteName
  }

  if ('path' in route && route.path !== undefined) {
    return route.path.startsWith(PublicLoginRouteName)
  }

  return false
}

export function isSchoolLoginRoute (
  route: string | RouteLocationAsRelativeGeneric | RouteLocationAsPathGeneric | RouteRecordRaw
): boolean {
  if (typeof route === 'string') {
    return route.startsWith(SchoolLoginRouteName)
  }

  if ('name' in route && route.name !== undefined) {
    return route.name === SchoolLoginRouteName
  }

  if ('path' in route && route.path !== undefined) {
    return route.path.startsWith(SchoolLoginRouteName)
  }

  return false
}

export function isLoginRoute (route: string | RouteLocationAsRelativeGeneric | RouteLocationAsPathGeneric) {
  return isSchoolLoginRoute(route) || isPublicLoginRoute(route)
}
