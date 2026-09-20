<template>
  <entity-show
    :key="entityShowKey"
    v-model:value="inputs"
    :title="label"
    :api="api"
    :entity-id-key="entityIdKey"
    :entity-param-key="entityParamKey"
    :index-route-name="indexRouteName"
    :show-route-name="showRouteName"
    :edit-route-name="editRouteName"
    :show-expand-button="false"
    :after-load-input-data="afterLoadInputData" />
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { getInputs } from './inputs'
import { useRoute } from 'vue-router'
import { EntityShow } from 'quasar-crud'
import SchoolAPI, { type SchoolType } from 'src/repositories/school'

const route = useRoute()
const schoolApi = new SchoolAPI()

const schoolId = computed(() => (route.params.id ? parseInt(route.params.id.toString()) : 0))

const entityShowKey = ref(Date.now())
const schoolData = ref<SchoolType | null>(null)

const api = ref(schoolApi.endpoints.byId(schoolId.value))
const label = ref('مشاهده مدرسه')
const indexRouteName = ref('Panel.School.List')
const showRouteName = ref('Panel.School.Show')
const editRouteName = ref('Panel.School.Edit')
const entityIdKey = ref('id')
const entityParamKey = ref('id')

const inputs = ref(getInputs())

function afterLoadInputData (data: SchoolType) {
  schoolData.value = data
}
</script>

<style lang="scss" scoped></style>
