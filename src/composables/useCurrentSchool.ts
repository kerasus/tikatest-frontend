import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useUser } from 'src/stores/user'

export const useCurrentSchool = () => {
  const route = useRoute()
  const userStoreManager = useUser()

  const currentSchoolName = computed<string>(()=>route.params.schoolName as string)
  const mySchools = computed(()=>userStoreManager?.me?.schools || [])
  const currentSchool = mySchools.value.find((school) => school.slug === currentSchoolName.value)

  return {
    mySchools,
    currentSchool,
    currentSchoolName
  }
}
