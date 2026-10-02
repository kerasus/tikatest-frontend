import { tokenDataKeyInLocalstorage } from 'src/boot/axios'
import type { RouteLocationNormalized } from 'vue-router'

type AuthenticatedContext = {
  to?: RouteLocationNormalized
}

export default function Authenticated (context?: AuthenticatedContext) {
  const loginRouteName = 'Auth.Login'
  const tokenDataRaw = localStorage.getItem(tokenDataKeyInLocalstorage)
  if (!tokenDataRaw) {

    const to = context?.to
    const school = (to?.params?.school as string) || (typeof localStorage !== 'undefined' ? localStorage.getItem('last_school') : null)
    const role = (to?.params?.role as string) || 'student'

    if (school && role) {
      return {
        name: 'Auth.Login',
        params: {
          school,
          role
        }
      }
    }

    return { name: 'PublicAuth.Login' }
  }

  // Continue to the route if token is found or already on login page
  return null
}
