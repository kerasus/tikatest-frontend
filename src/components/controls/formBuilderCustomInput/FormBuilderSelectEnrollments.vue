<template>
  <div class="row q-col-gutter-md">
    <div
      v-if="!schoolId"
      class="col-xs-12">
      <form-builder-select-school
        v-model="localSchoolId"
        label="مدرسه"
        name="school_id"
        clearable />
    </div>
    <div class="col-md-3 col-xs-12">
      <form-builder-select-academic-field
        v-model="fieldId"
        label="رشته تحصیلی"
        name="field_id"
        clearable
        :schoolId="schoolId"
        :disable="!schoolId" />
    </div>
    <div class="col-md-3 col-xs-12">
      <form-builder-select-academic-level
        v-model="levelId"
        label="پایه"
        name="level_id"
        clearable
        :schoolId="schoolId"
        :fieldId="fieldId"
        :disable="!schoolId || !fieldId" />
    </div>
    <div class="col-md-3 col-xs-12">
      <form-builder-select-school-class
        v-model="selectedClass"
        label="کلاس"
        name="class_id"
        clearable
        :emit-value="false"
        :map-options="false"
        :schoolId="schoolId"
        :fieldId="fieldId"
        :levelId="levelId"
        :disable="!schoolId || !fieldId || !levelId" />
    </div>
    <div class="col-md-3 col-xs-12">
      <form-builder-select-term
        v-model="selectedTermId"
        label="ترم"
        name="term_id"
        clearable
        :schoolId="schoolId"
        :disable="!schoolId" />
    </div>

    <div class="col-12">
      <q-btn
        color="primary"
        icon="add"
        label="افزودن"
        :disable="!selectedClass?.id || !selectedTermId || isInList(selectedClass?.id, selectedTermId)"
        @click="addEnrollment" />
    </div>
    <div class="col-12">
      <q-list
        bordered
        separator>
        <q-item
          v-for="item in selectedEnrollments"
          :key="`${item.schoolClass.id}-${item.term_id}`">
          <q-item-section>
            <q-item-label>{{ item.schoolClass.name }}</q-item-label>
            <q-item-label caption>
              {{ item.schoolClass.academic_level?.academic_field?.name }} - {{ item.schoolClass.academic_level?.name }}
              | ترم: {{ item.term_id }}
            </q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-btn
              flat
              color="negative"
              icon="delete"
              size="sm"
              @click="removeEnrollment(item.schoolClass.id, item.term_id)" />
          </q-item-section>
        </q-item>
      </q-list>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import SchoolClassAPI from 'src/repositories/schoolClass'
import type { SchoolClassType } from 'src/repositories/schoolClass'
import { useEntitySelector } from 'src/composables/useEntitySelector'
import FormBuilderSelectSchool from 'src/components/controls/formBuilderCustomInput/FormBuilderSelectSchool.vue'
import FormBuilderSelectTerm from 'src/components/controls/formBuilderCustomInput/FormBuilderSelectTerm.vue'
import FormBuilderSelectSchoolClass from 'src/components/controls/formBuilderCustomInput/FormBuilderSelectSchoolClass.vue'
import FormBuilderSelectAcademicField from 'src/components/controls/formBuilderCustomInput/FormBuilderSelectAcademicField.vue'
import FormBuilderSelectAcademicLevel from 'src/components/controls/formBuilderCustomInput/FormBuilderSelectAcademicLevel.vue'

type EnrollmentPayload = { class_id: number; term_id: number }

defineOptions({
  name: 'FormBuilderSelectEnrollments'
})

const props = defineProps({
  value: {
    default: () => [],
    type: Array as () => EnrollmentPayload[]
  },
  schoolId: {
    default: null,
    type: Number
  }
})

const emits = defineEmits<{
  (e: 'update:value', v: EnrollmentPayload[]): void
}>()


const localSchoolId = ref<number | null>(null)
const fieldId = ref<number | null>(null)
const levelId = ref<number | null>(null)
const selectedTermId = ref<number | null>(null)
const selectedEnrollments = ref<{ schoolClass: SchoolClassType; term_id: number }[]>([])

const selectedClass = ref<SchoolClassType | null>(null)

const selectedClasses = ref<SchoolClassType[]>([])

const schoolClassAPI = new SchoolClassAPI()

useEntitySelector<SchoolClassType>({
  value: () => props.value,
  schoolId: () => props.schoolId,
  filteredOptions: selectedClasses,
  entityName: 'classes',
  fetchByIds: (params) => schoolClassAPI.index({
    ...params,
    sortation_field: 'created_at',
    sortation_order: 'desc'
  })
})

watch(localSchoolId, () => {
  fieldId.value = null
  levelId.value = null
  selectedClass.value = null
})

watch(fieldId, () => {
  levelId.value = null
  selectedClass.value = null
})

watch(levelId, () => {
  selectedClass.value = null
})

// async function addClass () {
//   if (!selectedClass.value) return
//   if (isInList(selectedClass.value?.id)) return
//
//   selectedClasses.value.push(selectedClass.value)
//
//   emits(
//     'update:value',
//     selectedClasses.value.map((c) => c.id)
//   )
//
//   selectedClass.value = null
// }

async function addEnrollment () {
  if (!selectedClass.value?.id || !selectedTermId.value) return

  const classId = selectedClass.value.id
  const termId = selectedTermId.value

  if (isInList(classId, termId)) return

  selectedEnrollments.value.push({
    schoolClass: selectedClass.value,
    term_id: termId
  })

  // ارسال خروجی جدید به فرم‌بیلدر
  emits(
    'update:value',
    selectedEnrollments.value.map((e) => ({
      class_id: e.schoolClass.id,
      term_id: e.term_id
    }))
  )

  // ریست کردن کلاس بعد از افزودن
  selectedClass.value = null
  // اگر دوست داری ترم هم ریست بشه این رو آن‌کامنت کن، ولی معمولاً کاربر پشت‌هم برای یک ترم کلاس ادد می‌کنه
  // selectedTermId.value = null
}

function isInList (classId: number | null | undefined, termId: number | null | undefined): boolean {
  if (!classId || !termId) return false
  return selectedEnrollments.value.some(
    (e) => e.schoolClass.id === classId && e.term_id === termId
  )
}

function removeEnrollment (classId: number, termId: number) {
  selectedEnrollments.value = selectedEnrollments.value.filter(
    (e) => !(e.schoolClass.id === classId && e.term_id === termId)
  )

  emits(
    'update:value',
    selectedEnrollments.value.map((e) => ({
      class_id: e.schoolClass.id,
      term_id: e.term_id
    }))
  )
}

onMounted(() => {
  localSchoolId.value = props.schoolId
})

watch(
  () => props.value,
  async (value) => {
    const v = (value ?? []) as EnrollmentPayload[]
    const classIds = [...new Set(v.map((x) => x.class_id).filter(Boolean))]

    // کلاس‌ها رو بکش
    const res = await schoolClassAPI.index({
      ids: classIds, // اگر API شما ids را اینطوری می‌گیرد
      sortation_field: 'created_at',
      sortation_order: 'desc'
    })

    const classes = res.data
    const map = new Map<number, SchoolClassType>(classes.map((c: SchoolClassType) => [c.id, c]))

    selectedEnrollments.value = v
      .map((e) => {
        const schoolClass = map.get(e.class_id)
        if (!schoolClass) return null
        return { schoolClass, term_id: e.term_id }
      })
      .filter(Boolean) as Array<{ schoolClass: SchoolClassType; term_id: number }>
  },
  { deep: true, immediate: true }
)

</script>
