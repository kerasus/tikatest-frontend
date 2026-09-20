<template>
  <entity-create
    v-model:value="inputs"
    :title="label"
    :api="api"
    :entity-id-key="entityIdKey"
    :entity-param-key="entityParamKey"
    :index-route-name="indexRouteName"
    :show-route-name="showRouteName"
    :show-expand-button="false" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { getInputs } from './inputs'
import { EntityCreate } from 'quasar-crud'
import SchoolAPI from 'src/repositories/school'

const schoolApi = new SchoolAPI()

const api = ref(schoolApi.endpoints.base)
const label = ref('افزودن مدرسه جدید')
const indexRouteName = ref('Panel.School.List')
const showRouteName = ref('Panel.School.Show')
const entityIdKey = ref('id')
const entityParamKey = ref('id')

const inputs = ref(getInputs())
</script>

<style lang="scss" scoped>
.school-form-page {
}
</style>
