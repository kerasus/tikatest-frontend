import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useUser } from 'src/stores/user'
import { SchoolType } from 'src/repositories/school'

export const useCurrentSchool = () => {
  const route = useRoute()
  const userStoreManager = useUser()


  function getFirstUserSchoolSlug (): string | null {
    const userSchools = userStoreManager.me.schools
    const firstSchool = userSchools[0] ?? null

    return firstSchool.slug ?? null
  }

  const currentSchoolName = computed<string>(()=>{
    const paramSchoolSlug = route.params.school as string
    if (paramSchoolSlug) {
      return paramSchoolSlug
    }

    if (userStoreManager.isAdmin) {
      return 'system'
    }

    const firstUserSchoolSlug = getFirstUserSchoolSlug()

    return firstUserSchoolSlug ?? 'gust'
  })
  const mySchools = computed(()=>userStoreManager?.me?.schools || [])
  const currentSchool = mySchools.value.find((school) => school.slug === currentSchoolName.value)

  return {
    mySchools,
    currentSchool,
    currentSchoolName
  }
}
