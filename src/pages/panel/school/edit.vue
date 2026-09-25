<template>
  <entity-edit
    v-model:value="inputs"
    :title="label"
    :api="api"
    :entity-id-key="entityIdKey"
    :entity-param-key="entityParamKey"
    :index-route-name="indexRouteName"
    :show-route-name="showRouteName"
    :show-expand-button="false"
    :after-load-input-data="afterLoadInputData" />
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { getInputs } from './inputs'
import { useRoute } from 'vue-router'
import { EntityEdit } from 'quasar-crud'
import SchoolAPI, { SchoolType } from 'src/repositories/school'
import { useCurrentSchool } from 'src/composables/useCurrentSchool'

const route = useRoute()
const schoolApi = new SchoolAPI()
const currentSchoolManager = useCurrentSchool()

const schoolId = computed(() => {
  if (route.name === 'Panel.School.Edit') {
    return route.params.id ? parseInt(route.params.id.toString()) : 0
  } else if (currentSchoolManager?.currentSchool.value) {
    return currentSchoolManager?.currentSchool.value?.id
  }

  return null
})
const showRouteName = computed(() => {
  if (route.name === 'Panel.School.Edit') {
    return 'Panel.School.Show'
  } else if (currentSchoolManager?.currentSchool.value) {
    return 'Panel.CurrentSchool.Show'
  }

  return null
})

const entityIdKey = ref('id')
const entityParamKey = ref('id')
const indexRouteName = ref('Panel.School.List')
const label = ref('ویرایش مدرسه')

const schoolData = ref<SchoolType | null>(null)

const api = computed(() => schoolApi.endpoints.byId(Number(schoolId.value)))

const inputs = ref(getInputs())

function afterLoadInputData (data: SchoolType) {
  schoolData.value = data
}
</script>

<style lang="scss" scoped>
.school-form-page {
}
</style>
