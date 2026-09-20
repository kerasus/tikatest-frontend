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

const route = useRoute()
const schoolApi = new SchoolAPI()

const schoolId = computed(() => route.params.id)

const entityIdKey = ref('id')
const entityParamKey = ref('id')
const indexRouteName = ref('Panel.School.List')
const showRouteName = ref('Panel.School.Show')
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
