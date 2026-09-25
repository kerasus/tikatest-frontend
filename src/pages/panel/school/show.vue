<template>
  {{ userManager.isAdmin }}
  <entity-show
    :key="entityShowKey"
    v-model:value="inputs"
    :title="label"
    :api="api"
    :entity-id-key="entityIdKey"
    :entity-param-key="entityParamKey"
    :index-route-name="indexRouteName"
    :edit-route-name="editRouteName"
    :show-expand-button="false"
    :show-edit-button="userManager.isAdmin"
    :after-load-input-data="afterLoadInputData" />
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { getInputs } from './inputs'
import { useRoute } from 'vue-router'
import { EntityShow } from 'quasar-crud'
import { useUser } from 'src/stores/user'
import { useCurrentSchool } from 'src/composables/useCurrentSchool'
import SchoolAPI, { type SchoolType } from 'src/repositories/school'

const route = useRoute()
const userManager = useUser()
const schoolApi = new SchoolAPI()
const currentSchoolManager = useCurrentSchool()

const schoolId = computed(() => {
  if (route.name === 'Panel.School.Show') {
    return route.params.id ? parseInt(route.params.id.toString()) : 0
  } else if (currentSchoolManager?.currentSchool.value) {
    return currentSchoolManager?.currentSchool.value?.id
  }

  return null
})

const editRouteName = computed(() => {
  if (route.name === 'Panel.School.Show') {
    return 'Panel.School.Edit'
  } else if (currentSchoolManager?.currentSchool.value) {
    return 'Panel.CurrentSchool.Edit'
  }

  return null
})

const entityShowKey = ref(Date.now())
const schoolData = ref<SchoolType | null>(null)

const api = ref(schoolApi.endpoints.byId(schoolId.value))
const label = ref('مشاهده مدرسه')
const indexRouteName = ref('Panel.School.List')
const entityIdKey = ref('id')
const entityParamKey = ref('id')

const inputs = ref(getInputs())

function afterLoadInputData (data: SchoolType) {
  schoolData.value = data
}
</script>

<style lang="scss" scoped></style>
