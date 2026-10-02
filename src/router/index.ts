import { defineRouter } from '#q-app/wrappers'
import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory,
  type RouteLocationRaw,
  type RouteLocationNamedRaw,
  type RouteLocationNormalizedLoaded
} from 'vue-router'
import routes from './routes'

export default defineRouter(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : (process.env.VUE_ROUTER_MODE === 'history' ? createWebHistory : createWebHashHistory)

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,
    history: createHistory(process.env.VUE_ROUTER_BASE)
  })

  // تابع کمکی برای استخراج سریع پارامترهای school و role از URL مرورگر در صورت خالی بودن Router.currentRoute
  function extractParamsFromBrowserUrl (): { school?: string; role?: string } {
    if (typeof window === 'undefined') return {}
    // پشتیبانی هم از حالت هش (#/mobtakeran/student/...) و هم history
    const path = window.location.hash
      ? window.location.hash.replace(/^#\/?/, '/')
      : window.location.pathname

    const segments = path.split('/').filter(Boolean)
    if (segments.length >= 2) {
      return {
        school: segments[0],
        role: segments[1]
      }
    }
    return {}
  }

  // -------------------------------------------------------------
  // منطق تزریق خودکار پارامترهای school و role برای روت‌های پنل
  // -------------------------------------------------------------
  function autoFillPanelParams (
    to: RouteLocationRaw,
    currentLocation?: RouteLocationNormalizedLoaded
  ): RouteLocationRaw {
    // اگر آدرس یک رشته ساده یا نامعتبر بود کاری باهاش نداریم
    if (typeof to !== 'object' || to === null || !('name' in to) || !to.name) {
      return to
    }

    // ۱. اولویت اول: خواندن از currentLocation که خود vue-router پاس داده
    // ۲. اولویت دوم: Router.currentRoute
    // ۳. اولویت سوم: خواندن مستقیم از آدرس بار مرورگر
    const fallbackFromBrowser = extractParamsFromBrowserUrl()
    const activeRoute = currentLocation || Router.currentRoute.value

    const currentSchool =
      activeRoute?.params?.school ||
      fallbackFromBrowser.school ||
      (typeof localStorage !== 'undefined' ? localStorage.getItem('last_school') : null)

    const currentRole =
      activeRoute?.params?.role ||
      fallbackFromBrowser.role ||
      'student' // نقش پیش‌فرض برای نجات از خطای کرش

    // بررسی اینکه آیا روت مقصد متعلق به پنل است؟
    const targetRecord = Router.getRoutes().find((r) => r.name === to.name)
    const isPanelRoute =
      String(to.name).startsWith('Panel.') ||
      Boolean(targetRecord?.meta?.isPanel)

    if (isPanelRoute && currentSchool && currentRole) {
      const namedTo = to as RouteLocationNamedRaw
      return {
        ...namedTo,
        params: {
          school: currentSchool,
          role: currentRole,
          ...(namedTo.params || {}) // اگر خودش دستی پارامتر داده بود، اولویت با داده‌های دستی است
        }
      }
    }

    return to
  }

  // ۱. اورراید resolve (پاس دادن currentLocation به autoFillPanelParams)
  const originalResolve = Router.resolve.bind(Router)
  Router.resolve = function (to: RouteLocationRaw, currentLocation?: any) {
    return originalResolve(autoFillPanelParams(to, currentLocation), currentLocation)
  }

  // ۲. اورراید push
  const originalPush = Router.push.bind(Router)
  Router.push = function (to: RouteLocationRaw) {
    return originalPush(autoFillPanelParams(to))
  }

  // ۳. اورراید replace
  const originalReplace = Router.replace.bind(Router)
  Router.replace = function (to: RouteLocationRaw) {
    return originalReplace(autoFillPanelParams(to))
  }

  return Router
})
