<template>
  <div class="report-card-page">
    <q-form @submit.prevent="generateReport">
      <q-card class="q-mb-md">
        <q-card-section>
          <div class="text-h6">ماتریس ریز نمرات کلاسی</div>
        </q-card-section>

        <q-card-section>
          <div class="row q-col-gutter-md q-mb-md">
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
              <form-builder-select-lesson
                v-model:value="form.lesson_id"
                label="انتخاب درس"
                outlined
                :disable="!form.class_id"
                :rules="[(v) => !!v || 'درس الزامی است']"
                :school-id="form.school_id"
                :field-id="form.field_id"
                :level-id="form.academic_level_id" />
            </div>
          </div>

          <div
            v-if="form.lesson_id"
            class="row q-col-gutter-md q-mb-md">
            <div class="col-12 col-md-6">
              <form-builder-select-term
                v-model:value="form.term_id"
                label="انتخاب ترم"
                outlined
                :disable="!form.lesson_id"
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
                label="عنوان گزارش"
                outlined
                dense />
            </div>
          </div>

          <q-separator class="q-my-md" />

          <div class="row q-col-gutter-md">
            <div class="col-12">
              <q-btn
                type="submit"
                color="primary"
                label="تولید ماتریس نمرات"
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
      <p class="q-mt-md text-grey">در حال بارگذاری ماتریس...</p>
    </div>

    <q-card
      v-if="reportData"
      class="q-mt-md">
      <q-card-section>
        <div class="text-h6 text-positive">ماتریس با موفقیت بارگذاری شد</div>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn
          color="primary"
          label="مشاهده و چاپ"
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
import { ref, computed } from 'vue'
import { useQuasar } from 'quasar'
import FormBuilderSelectSchool from 'src/components/controls/formBuilderCustomInput/FormBuilderSelectSchool.vue'
import FormBuilderSelectAcademicField from 'src/components/controls/formBuilderCustomInput/FormBuilderSelectAcademicField.vue'
import FormBuilderSelectAcademicLevel from 'src/components/controls/formBuilderCustomInput/FormBuilderSelectAcademicLevel.vue'
import FormBuilderSelectSchoolClass from 'src/components/controls/formBuilderCustomInput/FormBuilderSelectSchoolClass.vue'
import FormBuilderSelectLesson from 'src/components/controls/formBuilderCustomInput/FormBuilderSelectLesson.vue'
import FormBuilderSelectTerm from 'src/components/controls/formBuilderCustomInput/FormBuilderSelectTerm.vue'
import FormBuilderInput from 'src/components/controls/formBuilderCustomInput/FormBuilderInput.vue'
import { reportCardAPI } from 'src/repositories/reportCard'
import type { GradeMatrixResponse } from 'src/repositories/reportCard'
import { useReportCardStore } from 'src/stores/reportCard'
import { useRouter } from 'vue-router'

const $q = useQuasar()
const router = useRouter()
const reportCardStore = useReportCardStore()

const generating = ref(false)
const reportData = ref<GradeMatrixResponse | null>(null)

const form = ref({
  school_id: null as number | null,
  field_id: null as number | null,
  academic_level_id: null as number | null,
  class_id: null as number | null,
  lesson_id: null as number | null,
  term_id: null as number | null,
  title: 'ماتریس ریز نمرات' as string
})

const canGenerate = computed(() => {
  return form.value.class_id !== null && form.value.lesson_id !== null && form.value.term_id !== null
})

function onSchoolChange () {
  form.value.field_id = null
  form.value.academic_level_id = null
  form.value.class_id = null
  form.value.lesson_id = null
  form.value.term_id = null
}

function onFieldChange () {
  form.value.academic_level_id = null
  form.value.class_id = null
  form.value.lesson_id = null
  form.value.term_id = null
}

function onLevelChange () {
  form.value.class_id = null
  form.value.lesson_id = null
  form.value.term_id = null
}

function onClassChange () {
  form.value.lesson_id = null
  form.value.term_id = null
}

async function generateReport () {
  if (!canGenerate.value) return

  generating.value = true
  reportData.value = null

  try {
    const data = await reportCardAPI.gradeMatrix({
      class_id: form.value.class_id,
      lesson_id: form.value.lesson_id,
      term_id: form.value.term_id
    })
    reportData.value = data
    reportCardStore.setReportCards(data as any)
    reportCardStore.setFormSettings({ ...form.value, reportType: 'gradeMatrix' })
    router.push({ name: 'Panel.ReportCard.GradeMatrix.Print' })
  } catch (e) {
    console.error(e)
    $q.notify({ type: 'negative', message: 'خطا در بارگذاری ماتریس' })
  } finally {
    generating.value = false
  }
}

function goToPrint () {
  router.push({ name: 'Panel.ReportCard.GradeMatrix.Print' })
}

function resetForm () {
  reportData.value = null
  reportCardStore.clear()
  form.value.school_id = null
  form.value.field_id = null
  form.value.academic_level_id = null
  form.value.class_id = null
  form.value.lesson_id = null
  form.value.term_id = null
  form.value.title = 'ماتریس ریز نمرات'
}
</script>

<style lang="scss" scoped>
.report-card-page {
  padding: 16px;
}
</style>
