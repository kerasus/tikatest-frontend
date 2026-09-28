<template>
  <q-card
    flat
    bordered
    class="rounded-borders q-mb-md">
    <!-- هدر کارت -->
    <q-card-section class="bg-blue-grey-1 q-py-sm">
      <div class="row items-center justify-between">
        <div class="row items-center">
          <q-avatar
            size="32px"
            color="indigo-7"
            text-color="white"
            icon="school"
            class="q-mr-sm shadow-1" />
          <div>
            <div class="text-subtitle1 text-weight-bold text-blue-grey-10">
              کلاس‌ها و دوره‌های تحصیلی
            </div>
            <div class="text-caption text-grey-7">
              کلاس‌های ثبت‌نامی و سوابق انتساب دانش‌آموز در ترم‌های مختلف
            </div>
          </div>
        </div>

        <q-badge
          color="indigo-1"
          text-color="indigo-9"
          class="text-weight-bold q-px-sm q-py-xs">
          تعداد انتساب: {{ localRegistrations.length }} کلاس
        </q-badge>
      </div>
    </q-card-section>

    <q-separator />

    <q-card-section class="q-pa-md">
      <!-- بخش فرم افزودن کلاس جدید (در حالت ویرایش) -->
      <div
        v-if="!readonly"
        class="bg-grey-1 q-pa-md rounded-borders border q-mb-md">
        <div class="text-caption text-weight-bold text-grey-8 q-mb-sm flex items-center">
          <q-icon
            name="add_circle"
            color="indigo-7"
            size="16px"
            class="q-mr-xs" />
          انتساب کلاس و دوره جدید:
        </div>

        <div class="row q-col-gutter-md">
          <!-- انتخاب مدرسه -->
          <div
            v-if="!schoolId"
            class="col-12 col-md-4">
            <form-builder-select-school
              v-model:value="selectedSchoolId"
              label="انتخاب مدرسه *"
              outlined
              dense
              clearable
              @update:value="onSchoolChange" />
          </div>

          <!-- انتخاب / نمایش ترم فعال -->
          <div
            v-if="selectedSchoolId"
            class="col-12 col-md-4">
            <div
              v-if="activeTermsLoading"
              class="flex items-center justify-center full-height q-py-sm">
              <q-spinner-dots
                color="indigo-7"
                size="24px" />
              <span class="text-caption text-grey-7 q-ml-xs">در حال دریافت ترم‌ها...</span>
            </div>

            <div
              v-else-if="singleActiveTerm"
              class="bg-white q-px-md q-py-xs rounded-borders border row items-center justify-between full-height">
              <div>
                <div class="text-caption text-grey-6">ترم فعال جاری</div>
                <div class="text-body2 text-weight-bold text-blue-grey-9">
                  {{ singleActiveTerm.name || '-' }}
                </div>
              </div>
              <q-icon
                name="event_available"
                color="positive"
                size="20px" />
            </div>

            <form-builder-select-term
              v-else
              :key="selectedSchoolId"
              v-model:value="selectedTermId"
              :school-id="selectedSchoolId"
              label="انتخاب ترم فعال *"
              active-only
              outlined
              dense
              clearable />
          </div>

          <!-- انتخاب رشته -->
          <div
            v-if="selectedSchoolId"
            class="col-12 col-md-4">
            <form-builder-select-academic-field
              :key="selectedSchoolId"
              v-model:value="selectedFieldId"
              :school-id="selectedSchoolId"
              label="انتخاب رشته *"
              outlined
              dense
              clearable
              @update:value="onFieldChange" />
          </div>

          <!-- انتخاب پایه -->
          <div
            v-if="selectedSchoolId && selectedFieldId"
            class="col-12 col-md-4">
            <form-builder-select-academic-level
              :key="[selectedSchoolId, selectedFieldId].join('-')"
              v-model:value="selectedLevelId"
              :school-id="selectedSchoolId"
              :field-id="selectedFieldId"
              label="انتخاب پایه تحصیلی *"
              outlined
              dense
              clearable
              @update:value="onLevelChange" />
          </div>

          <!-- انتخاب کلاس -->
          <div
            v-if="selectedSchoolId && selectedFieldId && selectedLevelId"
            class="col-12 col-md-4">
            <form-builder-select-school-class
              :key="[selectedSchoolId, selectedFieldId, selectedLevelId].join('-')"
              v-model:value="newClassId"
              :school-id="selectedSchoolId"
              :field-id="selectedFieldId"
              :level-id="selectedLevelId"
              label="انتخاب کلاس *"
              outlined
              dense
              clearable />
          </div>

          <!-- دکمه افزودن -->
          <div
            v-if="selectedSchoolId && selectedFieldId && selectedLevelId"
            class="col-12 col-md-4 flex items-center">
            <q-btn
              unelevated
              color="indigo-7"
              icon="add"
              label="افزودن دانش‌آموز به کلاس"
              class="full-width"
              style="height: 40px"
              :disable="!newClassId || !selectedTermId"
              @click="assignClass" />
          </div>
        </div>
      </div>

      <!-- وضعیت لودینگ -->
      <div
        v-if="loading"
        class="column items-center justify-center q-pa-lg text-grey-7">
        <q-spinner-dots
          color="indigo-7"
          size="36px" />
        <div class="text-caption q-mt-sm">در حال بارگذاری لیست کلاس‌ها...</div>
      </div>

      <!-- لیست کلاس‌های ثبت‌شده -->
      <q-list
        v-else-if="localRegistrations.length > 0"
        bordered
        separator
        class="rounded-borders">
        <q-item
          v-for="reg in localRegistrations"
          :key="reg.id"
          class="q-py-sm">
          <q-item-section avatar>
            <q-avatar
              size="36px"
              color="indigo-1"
              text-color="indigo-8"
              icon="class" />
          </q-item-section>

          <q-item-section>
            <q-item-label class="text-weight-bold text-blue-grey-10 text-body2">
              {{ enrollmentClass(reg)?.name || '-' }}
            </q-item-label>

            <!-- متادیتای کلاس (پایه، رشته، ترم) -->
            <q-item-label class="q-mt-xs row items-center q-gutter-x-xs">
              <q-chip
                v-if="enrollmentClass(reg)?.academic_level"
                dense
                size="sm"
                color="blue-1"
                text-color="blue-9">
                پایه: {{ enrollmentClass(reg)?.academic_level?.name }}
              </q-chip>

              <q-chip
                v-if="enrollmentClass(reg)?.academic_level?.academic_field"
                dense
                size="sm"
                color="cyan-1"
                text-color="cyan-9">
                رشته: {{ enrollmentClass(reg)?.academic_level?.academic_field?.name }}
              </q-chip>

              <q-chip
                v-if="reg.term?.name"
                dense
                size="sm"
                color="purple-1"
                text-color="purple-9">
                ترم: {{ reg.term.name }}
              </q-chip>
            </q-item-label>
          </q-item-section>

          <!-- دکمه حذف کلاس در حالت ویرایش -->
          <q-item-section
            v-if="!readonly"
            side>
            <q-btn
              flat
              round
              dense
              icon="delete_outline"
              color="negative"
              size="sm"
              @click="confirmRemoveClass(reg)">
              <q-tooltip>حذف از این کلاس</q-tooltip>
            </q-btn>
          </q-item-section>
        </q-item>
      </q-list>

      <!-- حالت بدون کلاس -->
      <div
        v-else
        class="column items-center justify-center q-pa-lg text-grey-6">
        <q-icon
          name="meeting_room"
          size="42px"
          color="grey-4" />
        <div class="text-caption q-mt-sm">
          {{ readonly ? 'هیچ کلاسی برای این دانش‌آموز ثبت نشده است.' : 'هنوز کلاسی ثبت نشده است. از فرم بالا برای انتساب کلاس استفاده کنید.' }}
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar'
import { computed, onMounted, ref, watch } from 'vue'
import { termEnrollment } from 'src/repositories/termEnrollment'
import type { TermEnrollmentType } from 'src/repositories/termEnrollment'
import AcademicTermAPI, { type AcademicTermType } from 'src/repositories/academicTerm'
import FormBuilderSelectTerm from 'src/components/controls/formBuilderCustomInput/FormBuilderSelectTerm.vue'
import FormBuilderSelectSchool from 'src/components/controls/formBuilderCustomInput/FormBuilderSelectSchool.vue'
import FormBuilderSelectSchoolClass from 'src/components/controls/formBuilderCustomInput/FormBuilderSelectSchoolClass.vue'
import FormBuilderSelectAcademicField from 'src/components/controls/formBuilderCustomInput/FormBuilderSelectAcademicField.vue'
import FormBuilderSelectAcademicLevel from 'src/components/controls/formBuilderCustomInput/FormBuilderSelectAcademicLevel.vue'

const props = defineProps({
  studentId: {
    type: Number,
    required: true
  },
  schoolId: {
    type: Number,
    required: false
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

const emit = defineEmits(['updated'])

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
    const academicTermAPI = new AcademicTermAPI(schoolId)
    const response = await academicTermAPI.index({
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

onMounted(() => {
  selectedSchoolId.value = props.schoolId
})
</script>
