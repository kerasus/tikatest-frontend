<template>
  <div class="report-card-page">
    <q-form @submit.prevent="generateReportCards">
      <q-card class="q-mb-md">
        <q-card-section>
          <div class="text-h6">تنظیمات کارنامه</div>
        </q-card-section>

        <q-card-section>
          <!-- فیلترها (مدرسه، رشته، پایه، کلاس، ترم) -->
          <div
            v-if="!currentSchoolId && isAdmin"
            class="row q-col-gutter-md q-mb-md">
            <div class="col-12 col-md-6">
              <form-builder-select-school
                v-model:value="form.school_id"
                label="انتخاب مدرسه"
                outlined
                :rules="[(v) => !!v || 'مدرسه الزامی است']"
                @update:value="onSchoolChange" />
            </div>
          </div>

          <div
            v-if="form.school_id"
            class="row q-col-gutter-md q-mb-md">
            <div class="col-12 col-md-6">
              <form-builder-select-academic-field
                v-model:value="form.field_id"
                label="انتخاب رشته"
                outlined
                :disable="!form.school_id"
                :rules="[(v) => !!v || 'رشته الزامی است']"
                :school-id="form.school_id"
                @update:value="onFieldChange" />
            </div>
          </div>

          <div
            v-if="form.field_id"
            class="row q-col-gutter-md q-mb-md">
            <div class="col-12 col-md-6">
              <form-builder-select-academic-level
                v-model:value="form.academic_level_id"
                label="انتخاب پایه"
                outlined
                :disable="!form.field_id"
                :rules="[(v) => !!v || 'پایه الزامی است']"
                :school-id="form.school_id"
                :field-id="form.field_id"
                @update:value="onLevelChange" />
            </div>
          </div>

          <div
            v-if="form.academic_level_id"
            class="row q-col-gutter-md q-mb-md">
            <div class="col-12 col-md-6">
              <form-builder-select-school-class
                v-model:value="form.class_id"
                label="انتخاب کلاس"
                outlined
                :disable="!form.academic_level_id"
                :rules="[(v) => !!v || 'کلاس الزامی است']"
                :school-id="form.school_id"
                :field-id="form.field_id"
                :level-id="form.academic_level_id"
                @update:value="onClassChange" />
            </div>
          </div>

          <div
            v-if="form.class_id"
            class="row q-col-gutter-md q-mb-md">
            <div class="col-12 col-md-6">
              <form-builder-select-term
                v-model:value="form.term_id"
                label="انتخاب ترم"
                outlined
                :disable="!form.class_id"
                :rules="[(v) => !!v || 'ترم الزامی است']"
                :school-id="form.school_id"
                active-only />
            </div>
          </div>

          <div
            v-if="form.term_id"
            class="row q-col-gutter-md q-mb-md">
            <div class="col-12 col-md-6">
              <form-builder-input
                v-model:value="form.title"
                label="عنوان کارنامه"
                outlined
                dense />
            </div>
          </div>

          <!-- گزینه‌های نمایش ستون‌ها و نمودارها -->
          <div
            v-if="form.term_id"
            class="row q-col-gutter-md q-mb-md">
            <div class="col-12">
              <div class="text-subtitle2 q-mb-sm text-primary font-bold">
                تنظیمات نمایش ستون‌ها و نمودارها:
              </div>
              <div class="row q-col-gutter-sm">
                <div class="col-12 col-sm-6 col-md-4 col-lg-3">
                  <q-checkbox
                    v-model="form.show_exam_row_number"
                    label="نمایش شماره ردیف"
                    dense />
                </div>
                <div class="col-12 col-sm-6 col-md-4 col-lg-3">
                  <q-checkbox
                    v-model="form.show_exam_dates"
                    label="نمایش تاریخ آزمون‌ها"
                    dense />
                </div>
                <div class="col-12 col-sm-6 col-md-4 col-lg-3">
                  <q-checkbox
                    v-model="form.show_exam_titles"
                    label="نمایش عنوان آزمون‌ها"
                    dense />
                </div>
                <div class="col-12 col-sm-6 col-md-4 col-lg-3">
                  <q-checkbox
                    v-model="form.show_student_grade"
                    label="نمایش نمره دانش‌آموز"
                    dense />
                </div>
                <div class="col-12 col-sm-6 col-md-4 col-lg-3">
                  <q-checkbox
                    v-model="form.show_max_grade"
                    label="نمایش بیشترین نمره کلاس"
                    dense />
                </div>
                <div class="col-12 col-sm-6 col-md-4 col-lg-3">
                  <q-checkbox
                    v-model="form.show_min_grade"
                    label="نمایش کمترین نمره کلاس"
                    dense />
                </div>
                <div class="col-12 col-sm-6 col-md-4 col-lg-3">
                  <q-checkbox
                    v-model="form.show_avg_grade"
                    label="نمایش میانگین نمرات کلاس"
                    dense />
                </div>
                <div class="col-12 col-sm-6 col-md-4 col-lg-3">
                  <q-checkbox
                    v-model="form.show_student_score"
                    label="نمایش تراز دانش‌آموز"
                    dense />
                </div>
                <div class="col-12 col-sm-6 col-md-4 col-lg-3">
                  <q-checkbox
                    v-model="form.show_max_score"
                    label="نمایش بیشترین تراز"
                    dense />
                </div>
                <div class="col-12 col-sm-6 col-md-4 col-lg-3">
                  <q-checkbox
                    v-model="form.show_min_score"
                    label="نمایش کمترین تراز"
                    dense />
                </div>
                <div class="col-12 col-sm-6 col-md-4 col-lg-3">
                  <q-checkbox
                    v-model="form.show_grade_chart"
                    label="نمایش نمودار مقایسه‌ای نمرات"
                    dense />
                </div>
                <div class="col-12 col-sm-6 col-md-4 col-lg-3">
                  <q-checkbox
                    v-model="form.show_taraz_chart"
                    label="نمایش نمودار تراز"
                    dense />
                </div>
              </div>
            </div>
          </div>

          <q-separator class="q-my-md" />

          <div class="row q-col-gutter-md">
            <div class="col-12">
              <q-btn
                type="submit"
                color="primary"
                label="تولید کارنامه"
                :loading="generating"
                :disable="!canGenerate" />
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-form>

    <div
      v-if="generating"
      class="text-center q-pa-lg">
      <q-spinner
        color="primary"
        size="80px" />
      <p class="q-mt-md text-grey">در حال بارگذاری کارنامه‌ها...</p>
    </div>

    <q-card
      v-if="reportCards"
      class="q-mt-md">
      <q-card-section>
        <div class="text-h6 text-positive">کارنامه‌ها با موفقیت بارگذاری شدند</div>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn
          color="primary"
          label="مشاهده و چاپ کارنامه‌ها"
          icon="print"
          @click="goToPrint" />
        <q-btn
          flat
          label="بازنشانی"
          @click="resetForm" />
      </q-card-actions>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUser } from 'src/stores/user'
import { useReportCardStore } from 'src/stores/reportCard'
import { reportCardAPI } from 'src/repositories/reportCard'
import { useCurrentSchool } from 'src/composables/useCurrentSchool'
import FormBuilderInput from 'src/components/controls/formBuilderCustomInput/FormBuilderInput.vue'
import FormBuilderSelectTerm from 'src/components/controls/formBuilderCustomInput/FormBuilderSelectTerm.vue'
import FormBuilderSelectSchool from 'src/components/controls/formBuilderCustomInput/FormBuilderSelectSchool.vue'
import FormBuilderSelectSchoolClass from 'src/components/controls/formBuilderCustomInput/FormBuilderSelectSchoolClass.vue'
import FormBuilderSelectAcademicField from 'src/components/controls/formBuilderCustomInput/FormBuilderSelectAcademicField.vue'
import FormBuilderSelectAcademicLevel from 'src/components/controls/formBuilderCustomInput/FormBuilderSelectAcademicLevel.vue'

const $q = useQuasar()
const router = useRouter()
const { isAdmin } = useUser()
const reportCardStore = useReportCardStore()
const currentSchoolManager = useCurrentSchool()

const generating = ref(false)
const reportCards = ref<any>(null)

const form = ref({
  school_id: null as number | null,
  field_id: null as number | null,
  academic_level_id: null as number | null,
  class_id: null as number | null,
  term_id: null as number | null,
  title: 'کارنامه ریز نمرات' as string,
  show_exam_row_number: true,
  show_exam_dates: true,
  show_exam_titles: true,
  show_student_grade: true,
  show_max_grade: true,
  show_min_grade: true,
  show_avg_grade: true,
  show_student_score: true,
  show_max_score: true,
  show_min_score: true,
  show_grade_chart: true,
  show_taraz_chart: true
})

const canGenerate = computed(() => {
  return !!(
    form.value.school_id &&
    form.value.field_id &&
    form.value.academic_level_id &&
    form.value.class_id &&
    form.value.term_id
  )
})
const currentSchoolId = computed(() => currentSchoolManager?.currentSchool.value?.id)

function onSchoolChange () {
  form.value.field_id = null
  form.value.academic_level_id = null
  form.value.class_id = null
  form.value.term_id = null
}

function onFieldChange () {
  form.value.academic_level_id = null
  form.value.class_id = null
}

function onLevelChange () {
  form.value.class_id = null
}

function onClassChange () {
  form.value.term_id = null
}

async function generateReportCards () {
  if (!canGenerate.value) return

  generating.value = true
  reportCards.value = null

  try {
    const data = await reportCardAPI.classReportCards({
      school_id: form.value.school_id,
      term_id: form.value.term_id,
      class_id: form.value.class_id
    })
    reportCards.value = data
    reportCardStore.setGradeDetails(data)
    reportCardStore.setFormSettings({
      ...form.value
    })
    router.push({ name: 'Panel.ReportCard.Generate.Print' })
  } catch (e) {
    console.error(e)
    $q.notify({ type: 'negative', message: 'خطا در بارگذاری کارنامه‌ها' })
  } finally {
    generating.value = false
  }
}

function goToPrint () {
  router.push({ name: 'Panel.ReportCard.Generate.Print' })
}

function resetForm () {
  reportCards.value = null
  reportCardStore.clear()
  form.value.school_id = null
  form.value.field_id = null
  form.value.academic_level_id = null
  form.value.class_id = null
  form.value.term_id = null
  form.value.title = 'کارنامه ریز نمرات'
}

function loadInputsForCurrentSchool () {
  if (!currentSchoolId.value) {
    return
  }
  form.value.school_id = currentSchoolId.value
  onSchoolChange()
}

loadInputsForCurrentSchool()
</script>

<style lang="scss" scoped>
.report-card-page {
  padding: 16px;
}
.chart-container {
  direction: ltr;
}
</style>
