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
      <template v-if="inputData.col.name === 'schoolClass'">
        {{ inputData.props.row.schoolClass?.name || '-' }}
      </template>
      <template v-else-if="inputData.col.name === 'due_date'">
        {{ formatDate(inputData.props.row.due_date) }}
      </template>
      <template v-else-if="inputData.col.name === 'actions'">
        <div class="action-column-entity-index">
          <q-btn
            color="primary"
            flat
            icon="visibility"
            :to="{ name: showRouteName, params: { id: inputData.props.row.id } }" />
          <q-btn
            color="secondary"
            flat
            icon="edit"
            :to="{ name: 'Panel.Homework.Edit', params: { id: inputData.props.row.id } }" />
          <delete-btn
            :row="inputData.props.row"
            :api="homeworkApi"
            :use-flag="false"
            @change="afterRemove" />
        </div>
      </template>
      <template v-else>
        {{ inputData.col.value }}
      </template>
    </template>
  </entity-index>
</template>

<script setup lang="ts">
import { computed, ref, shallowRef } from 'vue'
import { useQuasar } from 'quasar'
import { EntityIndex } from 'quasar-crud'
import { homework, HomeworkType } from 'src/repositories/homework'
import DeleteBtn from 'src/components/controls/deleteBtn.vue'
import { useDate } from 'src/composables/Date'
import { useCurrentSchool } from 'src/composables/useCurrentSchool'
import FormBuilderInput from 'src/components/controls/formBuilderCustomInput/FormBuilderInput.vue'
import FormBuilderSelectLesson from 'src/components/controls/formBuilderCustomInput/FormBuilderSelectLesson.vue'
import FormBuilderSelectSchool from 'src/components/controls/formBuilderCustomInput/FormBuilderSelectSchool.vue'
import FormBuilderSelectSchoolClass from 'src/components/controls/formBuilderCustomInput/FormBuilderSelectSchoolClass.vue'
import FormBuilderSelectAcademicField from 'src/components/controls/formBuilderCustomInput/FormBuilderSelectAcademicField.vue'
import FormBuilderSelectAcademicLevel from 'src/components/controls/formBuilderCustomInput/FormBuilderSelectAcademicLevel.vue'
import FormBuilderSelectTerm from 'src/components/controls/formBuilderCustomInput/FormBuilderSelectTerm.vue'

const $q = useQuasar()
const dateManager = useDate()
const currentSchoolManager = useCurrentSchool()

const FormBuilderInputComponent = shallowRef(FormBuilderInput)
const FormBuilderSelectSchoolComponent = shallowRef(FormBuilderSelectSchool)
const FormBuilderSelectLessonComponent = shallowRef(FormBuilderSelectLesson)
const FormBuilderSelectSchoolClassComponent = shallowRef(FormBuilderSelectSchoolClass)
const FormBuilderSelectAcademicFieldComponent = shallowRef(FormBuilderSelectAcademicField)
const FormBuilderSelectAcademicLevelComponent = shallowRef(FormBuilderSelectAcademicLevel)
const FormBuilderSelectTermComponent = shallowRef(FormBuilderSelectTerm)

const homeworkApi = homework

const api = ref(homework.endpoints.base)
const label = ref('تکالیف')
const createRouteName = ref('Panel.Homework.Create')
const showRouteName = ref('Panel.Homework.Show')
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
      name: 'title',
      required: true,
      label: 'عنوان تکلیف',
      align: 'center' as const,
      field: 'title',
      sortable: true
    },
    { name: 'schoolClass', label: 'کلاس', align: 'center' as const, field: 'schoolClass' },
    {
      name: 'due_date',
      label: 'موعد تحویل',
      align: 'center' as const,
      field: 'due_date',
      sortable: true
    },
    {
      name: 'actions',
      required: true,
      label: 'عملیات',
      align: 'left',
      field: () => ''
    }
  ]
})

const inputs = ref([
  {
    type: 'hidden',
    name: 'sortation_field',
    value: 'created_at'
  },
  {
    type: 'hidden',
    name: 'sortation_order',
    value: 'desc'
  },
  {
    type: 'hidden',
    name: 'length',
    value: 10
  },
  {
    type: FormBuilderSelectSchoolComponent,
    name: 'inSchool',
    label: 'مدرسه',
    col: 'col-md-4 col-12'
  },
  {
    type: FormBuilderSelectAcademicFieldComponent,
    name: 'field_id',
    label: 'رشته',
    col: 'col-md-4 col-12'
  },
  {
    type: FormBuilderSelectAcademicLevelComponent,
    name: 'academic_level_id',
    label: 'پایه',
    col: 'col-md-4 col-12'
  },
  {
    type: FormBuilderSelectSchoolClassComponent,
    name: 'class_id',
    label: 'کلاس',
    col: 'col-md-4 col-12'
  },
  {
    type: FormBuilderSelectLessonComponent,
    name: 'lesson_id',
    col: 'col-md-4 col-12'
  },
  {
    type: FormBuilderSelectTermComponent,
    name: 'term_id',
    label: 'ترم',
    col: 'col-md-4 col-12'
  },
  {
    type: FormBuilderInputComponent,
    name: 'title',
    label: 'عنوان تکلیف',
    placeholder: ' ',
    col: 'col-md-3 col-12'
  }
])

const entityIndexRef = ref()

const currentSchoolId = computed(() => currentSchoolManager?.currentSchool?.id)

const afterRemove = () => {
  entityIndexRef.value.reload()
  $q.notify({
    message: 'حذف با موفقیت انجام شد.',
    type: 'positive'
  })
}

const formatDate = (value: string | null | undefined): string => {
  if (!value) return '-'
  return dateManager.miladiToShamsi(value, 'YYYY-MM-DD', 'jYYYY/jMM/jDD') || value
}

function loadInputsForCurrentSchool () {
  const currentSchoolId = currentSchoolManager?.currentSchool?.id
  if (!currentSchoolId) {
    return
  }
  inputs.value.forEach((item) => {
    if (item.name === 'inSchool') {
      item.type = 'hidden'
      item.value = currentSchoolId
    } else if (item.name === 'field_id') {
      // @ts-ignore
      item.schoolId = currentSchoolId
    } else if (item.name === 'academic_level_id') {
      // @ts-ignore
      item.schoolId = currentSchoolId
    } else if (item.name === 'class_id') {
      // @ts-ignore
      item.schoolId = currentSchoolId
    } else if (item.name === 'lesson_id') {
      // @ts-ignore
      item.schoolId = currentSchoolId
    } else if (item.name === 'term_id') {
      // @ts-ignore
      item.schoolId = currentSchoolId
    }
  })
}

loadInputsForCurrentSchool()
</script>

<style lang="scss" scoped>
.action-column-entity-index {
  display: flex;
  gap: 4px;
  justify-content: center;
}
</style>
