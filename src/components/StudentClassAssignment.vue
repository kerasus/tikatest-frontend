<template>
  <q-card class="q-mb-md">
    <q-card-section>
      <div class="text-h6">کلاس‌ها</div>
    </q-card-section>
    <q-separator />
    <q-card-section>
      <template v-if="!readonly">
        <div class="row q-col-gutter-md q-mb-md">
          <div class="col-12 col-md-4">
            <form-builder-select-school
              v-model:value="selectedSchoolId"
              label="انتخاب مدرسه"
              outlined
              clearable
              @update:value="onSchoolChange" />
          </div>

          <div
            v-if="selectedSchoolId"
            class="col-12 col-md-4">
            <div
              v-if="activeTermsLoading"
              class="flex items-center q-py-md">
              <q-spinner
                color="primary"
                size="24px" />
            </div>
            <div
              v-else-if="singleActiveTerm"
              class="rounded-borders bg-grey-2 q-pa-md">
              <div class="text-caption text-grey-7">ترم فعال</div>
              <div class="text-body1">{{ singleActiveTerm.name || '-' }}</div>
            </div>
            <form-builder-select-term
              v-else
              :key="selectedSchoolId"
              v-model:value="selectedTermId"
              :school-id="selectedSchoolId"
              label="انتخاب ترم فعال"
              active-only
              outlined
              clearable />
          </div>

          <div
            v-if="selectedSchoolId"
            class="col-12 col-md-4">
            <form-builder-select-academic-field
              :key="selectedSchoolId"
              v-model:value="selectedFieldId"
              :school-id="selectedSchoolId"
              label="انتخاب رشته"
              outlined
              clearable
              @update:value="onFieldChange" />
          </div>
          <div
            v-if="selectedSchoolId && selectedFieldId"
            class="col-12 col-md-4">
            <form-builder-select-academic-level
              :key="[selectedSchoolId, selectedFieldId].join('-')"
              v-model:value="selectedLevelId"
              :school-id="selectedSchoolId"
              :field-id="selectedFieldId"
              label="انتخاب پایه"
              outlined
              clearable
              @update:value="onLevelChange" />
          </div>
          <div
            v-if="selectedSchoolId && selectedFieldId && selectedLevelId"
            class="col-12 col-md-4">
            <form-builder-select-school-class
              :key="[selectedSchoolId, selectedFieldId, selectedLevelId].join('-')"
              v-model:value="newClassId"
              :school-id="selectedSchoolId"
              :field-id="selectedFieldId"
              :level-id="selectedLevelId"
              label="انتخاب کلاس"
              outlined
              clearable />
          </div>
          <div
            v-if="selectedSchoolId && selectedFieldId && selectedLevelId"
            class="col-12 flex items-end">
            <q-btn
              color="primary"
              icon="add"
              label="افزودن کلاس"
              :disable="!newClassId || !selectedTermId"
              @click="assignClass" />
          </div>
        </div>
      </template>

      <template v-if="loading">
        <div class="text-center q-pa-lg">
          <q-spinner
            color="primary"
            size="100px" />
        </div>
      </template>

      <template v-else-if="localRegistrations.length > 0">
        <q-list
          bordered
          separator>
          <q-item
            v-for="reg in localRegistrations"
            :key="reg.id"
            dense>
            <q-item-section>
              <q-item-label>{{ enrollmentClass(reg)?.name || '-' }}</q-item-label>
              <q-item-label caption>
                <template v-if="enrollmentClass(reg)?.academic_level">
                  پایه: {{ enrollmentClass(reg)?.academic_level?.name }}
                </template>
                <template v-if="enrollmentClass(reg)?.academic_level?.academic_field">
                  <span v-if="enrollmentClass(reg)?.academic_level"> - </span>
                  رشته: {{ enrollmentClass(reg)?.academic_level?.academic_field?.name }}
                </template>
                <template v-if="reg.term?.name">
                  <span> - </span>
                  ترم: {{ reg.term.name }}
                </template>
              </q-item-label>
            </q-item-section>
            <q-item-section
              v-if="!readonly"
              side>
              <q-btn
                flat
                dense
                icon="delete"
                color="negative"
                size="sm"
                @click="confirmRemoveClass(reg)">
                <q-tooltip>حذف</q-tooltip>
              </q-btn>
            </q-item-section>
          </q-item>
        </q-list>
      </template>
      <div
        v-else
        class="text-center text-grey">
        {{ readonly ? 'هیچ کلاسی ثبت نشده است.' : 'هنوز کلاسی ثبت نشده است.' }}
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, watch } from 'vue'
import { useQuasar } from 'quasar'
import { termEnrollment } from 'src/repositories/termEnrollment'
import type { TermEnrollmentType } from 'src/repositories/termEnrollment'
import { termAPI, type AcademicTermType } from 'src/repositories/academicTerm'
import FormBuilderSelectAcademicField from 'src/components/controls/formBuilderCustomInput/FormBuilderSelectAcademicField.vue'
import FormBuilderSelectAcademicLevel from 'src/components/controls/formBuilderCustomInput/FormBuilderSelectAcademicLevel.vue'
import FormBuilderSelectSchoolClass from 'src/components/controls/formBuilderCustomInput/FormBuilderSelectSchoolClass.vue'
import FormBuilderSelectSchool from 'src/components/controls/formBuilderCustomInput/FormBuilderSelectSchool.vue'
import FormBuilderSelectTerm from 'src/components/controls/formBuilderCustomInput/FormBuilderSelectTerm.vue'

const props = defineProps({
  studentId: {
    type: Number,
    required: true
  },
  termEnrollments: {
    type: Array as () => TermEnrollmentType[],
    default: () => []
  },
  readonly: {
    type: Boolean,
    default: true
  }
})

const $q = useQuasar()

const loading = ref(false)
const activeTermsLoading = ref(false)
const activeTerms = ref<AcademicTermType[]>([])
const selectedSchoolId = ref<number | null>(null)
const selectedTermId = ref<number | null>(null)
const selectedFieldId = ref<number | null>(null)
const selectedLevelId = ref<number | null>(null)
const newClassId = ref<number | null>(null)
const localRegistrations = ref<TermEnrollmentType[]>([])
const singleActiveTerm = computed(() => activeTerms.value.length === 1 ? activeTerms.value[0] : null)

async function onSchoolChange () {
  selectedTermId.value = null
  selectedFieldId.value = null
  selectedLevelId.value = null
  newClassId.value = null
  await loadActiveTerms()
}

async function loadActiveTerms () {
  const schoolId = selectedSchoolId.value
  activeTerms.value = []
  if (!schoolId) return

  activeTermsLoading.value = true
  try {
    const response = await termAPI.index({
      school_id: schoolId,
      is_active: 1,
      length: 100
    })
    if (selectedSchoolId.value !== schoolId) return
    activeTerms.value = response.data
    selectedTermId.value = response.data.length === 1 ? response.data[0]?.id ?? null : null
  } catch (error) {
    console.error(error)
    $q.notify({
      icon: 'error',
      message: 'خطا در بارگذاری ترم‌های فعال.',
      color: 'negative'
    })
  } finally {
    if (selectedSchoolId.value === schoolId) activeTermsLoading.value = false
  }
}

function onFieldChange () {
  selectedLevelId.value = null
  newClassId.value = null
}

function onLevelChange () {
  newClassId.value = null
}

function enrollmentClass (registration: TermEnrollmentType) {
  return registration.school_class || registration.class || null
}

const emit = defineEmits(['updated'])

async function assignClass () {
  if (!selectedSchoolId.value || !selectedTermId.value || !newClassId.value) return
  try {
    await termEnrollment.enroll({
      student_id: props.studentId,
      school_id: selectedSchoolId.value,
      term_id: selectedTermId.value,
      class_id: newClassId.value
    })
    $q.notify({
      icon: 'check',
      message: 'کلاس با موفقیت اضافه شد.',
      color: 'positive'
    })
    activeTerms.value = []
    selectedSchoolId.value = null
    selectedTermId.value = null
    selectedFieldId.value = null
    selectedLevelId.value = null
    newClassId.value = null
    emit('updated')
  } catch (error) {
    $q.notify({
      icon: 'error',
      message: 'خطا در اضافه کردن کلاس.',
      color: 'negative'
    })
  }
}

function confirmRemoveClass (reg: TermEnrollmentType) {
  $q.dialog({
    title: 'تایید حذف',
    message: 'آیا از این کلاس حذف شود؟',
    cancel: true,
    persistent: true
  }).onOk(async () => {
    try {
      await termEnrollment.delete(reg.id!)
      $q.notify({
        icon: 'check',
        message: 'کلاس با موفقیت حذف شد.',
        color: 'positive'
      })
      emit('updated')
    } catch (error) {
      $q.notify({
        icon: 'error',
        message: 'خطا در حذف کلاس.',
        color: 'negative'
      })
    }
  })
}

function loadRegistrations () {
  localRegistrations.value = props.termEnrollments
}

watch(() => props.termEnrollments, () => {
  loadRegistrations()
}, {
  immediate: true
})
</script>
