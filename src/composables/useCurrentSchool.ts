import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useUser } from 'src/stores/user'
import SchoolAPI, { type SchoolType } from 'src/repositories/school'
import type { UserSchoolPivoteType } from 'src/repositories/user'

export const SYSTEM_SCHOOL_SLUG = 'system'

export const useCurrentSchool = () => {
  const schoolAPI = new SchoolAPI()
  const route = useRoute()
  const userStoreManager = useUser()

  function getUserSchool (): SchoolType[] {
    const mySchools = userStoreManager.me?.schools ?? []
    const enrollmentSchools = (userStoreManager.me?.term_enrollments ?? [])
      .map((te) => te.school)
      .filter(Boolean) as SchoolType[]

    return Object.values(
      [...enrollmentSchools, ...mySchools].reduce<Record<number, SchoolType>>((acc, school) => {
        if (school?.id != null) {
          acc[school.id] = school
        }
        return acc
      }, {})
    )
  }

  function getFirstUserSchoolSlug (): string | null {
    const userSchools = getUserSchool()
    const firstSchool = userSchools[0] ?? null

    return firstSchool?.slug ?? null
  }

  const localSchoolFromApiBySlug = ref<UserSchoolPivoteType | undefined>(undefined)
  const currentSchoolSlug = computed<string>(()=>{
    const paramSchoolSlug = route.params.school as string
    if (paramSchoolSlug) {
      const userSchools = getUserSchool()
      const paramSchoolInMySchools = userSchools.find((ms) => ms.slug === paramSchoolSlug)
      if (paramSchoolInMySchools) {
        return paramSchoolSlug
      }
    }

    if (userStoreManager.isAdmin) {
      return SYSTEM_SCHOOL_SLUG
    }

    const firstUserSchoolSlug = getFirstUserSchoolSlug()

    return firstUserSchoolSlug ?? 'guest'
  })
  const mySchools = computed(()=>userStoreManager?.me?.schools || [])
  const currentSchool = computed<UserSchoolPivoteType | undefined>(()=> {
    if (localSchoolFromApiBySlug.value) {
      return localSchoolFromApiBySlug.value
    }
    return mySchools.value.find((school) => school.slug === currentSchoolSlug.value)
  })

  onMounted(async () => {
    if (!currentSchool.value && currentSchoolSlug.value !== SYSTEM_SCHOOL_SLUG) {
      localSchoolFromApiBySlug.value = await schoolAPI.getBySlug(currentSchoolSlug.value)
    }
  })

  return {
    mySchools,
    currentSchool,
    currentSchoolSlug
  }
}
