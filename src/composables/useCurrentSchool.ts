import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useUser } from 'src/stores/user'
import SchoolAPI, { type SchoolType } from 'src/repositories/school'
import type { UserSchoolPivoteType } from 'src/repositories/user'
import type { SchoolFeatureType } from 'src/repositories/schoolFeature'

export const SYSTEM_SCHOOL_SLUG = 'system'

export const useCurrentSchool = () => {
  const schoolAPI = new SchoolAPI()
  const route = useRoute()
  const userStoreManager = useUser()

  const localSchoolFromApiBySlug = ref<UserSchoolPivoteType | undefined>(undefined)

  function getFirstUserSchoolSlug (): string | null {
    const userSchools = mySchools.value
    const firstSchool = userSchools[0] ?? null

    return firstSchool?.slug ?? null
  }

  const currentSchoolSlug = computed<string>(()=>{
    const paramSchoolSlug = route.params.school as string
    if (paramSchoolSlug) {
      const userSchools = mySchools.value
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
  const mySchools = computed(()=>userStoreManager?.mySchools || [])
  const currentSchool = computed<UserSchoolPivoteType | SchoolType | undefined>(()=> {
    if (localSchoolFromApiBySlug.value) {
      return localSchoolFromApiBySlug.value
    }
    return mySchools.value.find((school) => school.slug === currentSchoolSlug.value)
  })
  const currentSchoolFeatures = computed<SchoolFeatureType[]>(()=> {
    const currentSchool = mySchools.value.find((school) => school.slug === currentSchoolSlug.value)
    if (!currentSchool) {
      return []
    }

    return currentSchool.features
  })

  onMounted(async () => {
    if (!currentSchool.value && currentSchoolSlug.value !== SYSTEM_SCHOOL_SLUG) {
      localSchoolFromApiBySlug.value = await schoolAPI.getBySlug(currentSchoolSlug.value)
    }
  })

  return {
    mySchools,
    currentSchool,
    currentSchoolSlug,
    currentSchoolFeatures
  }
}
