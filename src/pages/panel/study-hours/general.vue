<template>
  <entity-index
    ref="entityIndexRef"
    :value="inputs"
    :title="label"
    :api="api"
    :table="table"
    :table-keys="tableKeys"
    :create-route-name="createRouteName"
    :show-route-name="showRouteName"
    :show-close-button="false"
    :show-expand-button="false"
    :show-reload-button="false"
    :show-search-button="true"
    :row-key="itemIdentifyKey">
    <template #entity-index-table-cell="{ inputData }">
      <template v-if="inputData.col.name === 'lesson'">
        {{ inputData.row.lesson?.name || '-' }}
      </template>
      <template v-else-if="inputData.col.name === 'term'">
        {{ inputData.row.term?.name || '-' }}
      </template>
      <template v-else>
        {{ inputData.col.value }}
      </template>
    </template>
  </entity-index>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { EntityIndex } from 'quasar-crud'
import FormBuilderInput from 'src/components/controls/formBuilderCustomInput/FormBuilderInput.vue'
import FormBuilderSelectSchool from 'src/components/controls/formBuilderCustomInput/FormBuilderSelectSchool.vue'
import FormBuilderSelectAcademicLevel from 'src/components/controls/formBuilderCustomInput/FormBuilderSelectAcademicLevel.vue'
import FormBuilderSelectAcademicField from 'src/components/controls/formBuilderCustomInput/FormBuilderSelectAcademicField.vue'
import FormBuilderSelectSchoolClass from 'src/components/controls/formBuilderCustomInput/FormBuilderSelectSchoolClass.vue'
import { studySession } from 'src/repositories/studySession'

const FormBuilderInputComponent = ref(FormBuilderInput)
const FormBuilderSelectSchoolComponent = ref(FormBuilderSelectSchool)
const FormBuilderSelectAcademicLevelComponent = ref(FormBuilderSelectAcademicLevel)
const FormBuilderSelectAcademicFieldComponent = ref(FormBuilderSelectAcademicField)
const FormBuilderSelectSchoolClassComponent = ref(FormBuilderSelectSchoolClass)

const api = studySession.endpoints.base
const label = ref('ساعات مطالعه')
const createRouteName = ref('Panel.StudySessions.Create')
const showRouteName = ref('Panel.Student.StudySessions.List')
const itemIdentifyKey = ref('id')

const tableKeys = ref({
  data: 'data',
  total: 'total',
  currentPage: 'current_page',
  perPage: 'per_page',
  pageKey: 'page'
})

const table = ref({
  columns: [
    {
      name: 'lesson',
      label: 'درس',
      align: 'center' as const,
      field: 'lesson',
      sortable: true
    },
    {
      name: 'term',
      label: 'ترم',
      align: 'center' as const,
      field: 'term',
      sortable: true
    },
    { name: 'started_at', label: 'شروع', align: 'center' as const, field: 'started_at' },
    { name: 'ended_at', label: 'پایان', align: 'center' as const, field: 'ended_at' },
    { name: 'description', label: 'توضیحات', align: 'center' as const, field: 'description' },
    { name: 'source', label: 'منبع', align: 'center' as const, field: 'source' }
  ]
})

const inputs = ref([
  {
    type: 'hidden',
    name: 'length',
    value: 20
  },
  {
    type: FormBuilderSelectSchoolComponent,
    name: 'school_id',
    label: 'مدرسه',
    col: 'col-md-4 col-12'
  },
  {
    type: FormBuilderSelectAcademicLevelComponent,
    name: 'academic_level_id',
    label: 'پایه',
    col: 'col-md-4 col-12'
  },
  {
    type: FormBuilderSelectAcademicFieldComponent,
    name: 'academic_field_id',
    label: 'رشته',
    col: 'col-md-4 col-12'
  },
  {
    type: FormBuilderSelectSchoolClassComponent,
    name: 'class_id',
    label: 'کلاس',
    col: 'col-md-4 col-12'
  },
  {
    type: FormBuilderInputComponent,
    name: 'student_id',
    label: 'دانش آموز',
    col: 'col-md-4 col-12'
  }
])

const entityIndexRef = ref()
</script>

<style scoped>
</style>
