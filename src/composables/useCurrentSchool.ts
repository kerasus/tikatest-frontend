import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useUser } from 'src/stores/user'
import SchoolAPI from 'src/repositories/school'
import { type UserSchoolPivoteType } from 'src/repositories/user'

export const SYSTEM_SCHOOL_SLUG = 'system'

export const useCurrentSchool = () => {
  const schoolAPI = new SchoolAPI()
  const route = useRoute()
  const userStoreManager = useUser()


  function getFirstUserSchoolSlug (): string | null {
    const userSchools = userStoreManager.me.schools
    const firstSchool = userSchools[0] ?? null

    return firstSchool.slug ?? null
  }

  const currentSchoolSlug = computed<string>(()=>{
    const paramSchoolSlug = route.params.school as string
    if (paramSchoolSlug) {
      return paramSchoolSlug
    }

    if (userStoreManager.isAdmin) {
      return SYSTEM_SCHOOL_SLUG
    }

    const firstUserSchoolSlug = getFirstUserSchoolSlug()

    return firstUserSchoolSlug ?? 'gust'
  })
  const mySchools = computed(()=>userStoreManager?.me?.schools || [])
  const currentSchool = ref<UserSchoolPivoteType | undefined>(mySchools.value.find((school) => school.slug === currentSchoolSlug.value))

  onMounted(async () => {
    if (!currentSchool.value && currentSchoolSlug.value !== SYSTEM_SCHOOL_SLUG) {
      currentSchool.value = await schoolAPI.getBySlug(currentSchoolSlug.value)
    }
  })

  return {
    mySchools,
    currentSchool,
    currentSchoolSlug
  }
}
