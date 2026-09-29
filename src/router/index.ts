import { defineRouter } from '#q-app/wrappers'
import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory,
  type RouteLocationRaw,
  type RouteLocationNamedRaw
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

  // -------------------------------------------------------------
  // منطق تزریق خودکار پارامترهای school و role برای روت‌های پنل
  // -------------------------------------------------------------
  function autoFillPanelParams (to: RouteLocationRaw): RouteLocationRaw {
    // اگر آدرس یک رشته ساده مثل "/login" بود کاری باهاش نداریم
    if (typeof to !== 'object' || to === null || !('name' in to) || !to.name) {
      return to
    }

    const currentParams = Router.currentRoute.value?.params || {}
    const currentSchool = currentParams.school
    const currentRole = currentParams.role

    // اگر در حال حاضر پارامترهای school و role موجود نیستند، نیازی به پر کردن نیست
    if (!currentSchool || !currentRole) {
      return to
    }

    // بررسی اینکه آیا این نام روت متعلق به پنل است؟
    // ۱. چک ساده بر اساس نام (مثلا Panel.Dashboard یا Panel.*)
    // ۲. چک پیشرفته بر اساس meta.isPanel در رکورد روت
    const targetRecord = Router.getRoutes().find((r) => r.name === to.name)
    const isPanelRoute = String(to.name).startsWith('Panel.') ||
      Boolean(targetRecord?.meta?.isPanel)


    if (isPanelRoute) {
      const namedTo = to as RouteLocationNamedRaw
      return {
        ...namedTo,
        params: {
          school: currentSchool,
          role: currentRole,
          ...(namedTo.params || {}) // اگر خودش پارامتر دستی فرستاده بود، اولویت با دستی‌هاست
        }
      }
    }

    return to
  }

  // ۱. اورراید resolve (حل کننده مشکل :to روی q-item، q-btn و RouterLink)
  const originalResolve = Router.resolve.bind(Router)
  Router.resolve = function (to: RouteLocationRaw, currentLocation?: any) {
    return originalResolve(autoFillPanelParams(to), currentLocation)
  }

  // ۲. اورراید push (برای router.push در اسکریپت‌ها)
  const originalPush = Router.push.bind(Router)
  Router.push = function (to: RouteLocationRaw) {
    return originalPush(autoFillPanelParams(to))
  }

  // ۳. اورراید replace (برای router.replace در اسکریپت‌ها)
  const originalReplace = Router.replace.bind(Router)
  Router.replace = function (to: RouteLocationRaw) {
    return originalReplace(autoFillPanelParams(to))
  }

  return Router
})
