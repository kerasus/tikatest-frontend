<template>
  <div class="grade-create-page q-pa-sm">
    <q-form @submit.prevent="onSubmit">
      <!-- ۱. کارت اصلی هدر و انتخاب ساختار آموزشی (Step 1 to 4) -->
      <q-card
        flat
        bordered
        class="rounded-borders q-mb-md">
        <q-card-section class="bg-blue-grey-1 q-py-sm">
          <div class="row items-center justify-between">
            <div class="row items-center">
              <q-avatar
                size="34px"
                color="teal"
                text-color="white"
                icon="playlist_add_check"
                class="q-mr-sm shadow-1" />
              <div>
                <div class="text-subtitle1 text-weight-bold text-blue-grey-10">
                  ثبت آزمون کلاسی و نمرات حضوری
                </div>
                <div class="text-caption text-grey-7">
                  انتخاب کلاس، درس و ثبت نمرات انفرادی دانش‌آموزان به‌صورت مستقیم
                </div>
              </div>
            </div>

            <!-- وضعیت انتخاب مرحله -->
            <div class="row items-center q-gutter-x-xs">
              <q-chip
                dense
                :color="form.class_id && form.lesson_id ? 'positive' : 'blue-grey-3'"
                text-color="white"
                class="text-weight-bold text-caption">
                <q-icon
                  :name="form.class_id && form.lesson_id ? 'check_circle' : 'pending'"
                  size="14px"
                  class="q-mr-xs" />
                {{ form.class_id && form.lesson_id ? 'کلاس و درس مشخص شد' : 'در انتظار انتخاب کلاس و درس' }}
              </q-chip>
            </div>
          </div>
        </q-card-section>

        <q-separator />

        <!-- فیلترهای سلسله مراتبی آموزشی -->
        <q-card-section class="q-pa-md">
          <div class="text-caption text-weight-bold text-grey-8 q-mb-sm flex items-center">
            <q-icon
              name="apartment"
              size="16px"
              class="q-mr-xs text-primary" />
            انتخاب دامنه آموزشی و کلاس:
          </div>

          <div class="row q-col-gutter-md">
            <!-- انتخاب مدرسه برای ادمین -->
            <div
              v-if="!currentSchoolId && userStoreManager.isAdmin"
              class="col-12">
              <form-builder-select-school
                v-model:value="form.school_id"
                label="انتخاب مدرسه *"
                outlined
                dense
                :rules="[(v) => !!v || 'مدرسه الزامی است']"
                @update:value="onSchoolChange" />
            </div>

            <!-- انتخاب رشته -->
            <div
              v-if="form.school_id"
              class="col-12 col-md-3">
              <form-builder-select-academic-field
                v-model:value="form.field_id"
                label="انتخاب رشته *"
                outlined
                dense
                :disable="!form.school_id"
                :rules="[(v) => !!v || 'رشته الزامی است']"
                :school-id="form.school_id"
                @update:value="onFieldChange" />
            </div>

            <!-- انتخاب پایه -->
            <div
              v-if="form.field_id"
              class="col-12 col-md-3">
              <form-builder-select-academic-level
                v-model:value="form.academic_level_id"
                label="انتخاب پایه تحصیلی *"
                outlined
                dense
                :disable="!form.field_id"
                :rules="[(v) => !!v || 'پایه الزامی است']"
                :school-id="form.school_id"
                :field-id="form.field_id"
                @update:value="onLevelChange" />
            </div>

            <!-- انتخاب کلاس -->
            <div
              v-if="form.academic_level_id"
              class="col-12 col-md-3">
              <form-builder-select-school-class
                v-model:value="form.class_id"
                label="انتخاب کلاس *"
                outlined
                dense
                :disable="!form.academic_level_id"
                :rules="[(v) => !!v || 'کلاس الزامی است']"
                :school-id="form.school_id"
                :field-id="form.field_id"
                :level-id="form.academic_level_id"
                @update:value="onClassChange" />
            </div>

            <!-- انتخاب درس -->
            <div
              v-if="form.class_id"
              class="col-12 col-md-3">
              <form-builder-select-lesson
                v-model:value="form.lesson_id"
                label="انتخاب درس *"
                outlined
                dense
                :disable="!form.academic_level_id"
                :rules="[(v) => !!v || 'درس الزامی است']"
                :school-id="form.school_id"
                :field-id="form.field_id"
                :level-id="form.academic_level_id"
                :class-id="form.class_id" />
            </div>
          </div>
        </q-card-section>
      </q-card>

      <!-- ۲. کارت تنظیمات و پارامترهای آزمون -->
      <transition
        appear
        enter-active-class="animated fadeIn"
        leave-active-class="animated fadeOut">
        <q-card
          v-if="form.class_id && form.lesson_id"
          flat
          bordered
          class="rounded-borders q-mb-md">
          <q-card-section class="bg-grey-1 q-py-xs text-caption text-weight-bold text-grey-8 row items-center">
            <q-icon
              name="tune"
              color="teal"
              size="18px"
              class="q-mr-xs" />
            مشخصات، بارم‌بندی و زمان‌بندی آزمون
          </q-card-section>

          <q-separator />

          <q-card-section class="q-pa-md">
            <div class="row q-col-gutter-md">
              <!-- عنوان آزمون -->
              <div class="col-12 col-md-4">
                <q-input
                  v-model="examName"
                  label="عنوان / نام آزمون *"
                  outlined
                  dense
                  :rules="[(v) => !!v || 'نام آزمون الزامی است']">
                  <template #prepend>
                    <q-icon
                      name="edit_note"
                      color="teal" />
                  </template>
                </q-input>
              </div>

              <!-- دسته‌بندی آزمون -->
              <div class="col-12 col-md-4">
                <form-builder-select-exam-category
                  v-model:value="form.exam_category_id"
                  :school-id="currentSchoolId"
                  label="دسته‌بندی آزمون *"
                  outlined
                  dense
                  :rules="[(v) => !!v || 'دسته‌بندی الزامی است']"
                  :disable="!form.school_id" />
              </div>

              <!-- دوره / ترم تحصیلی -->
              <div class="col-12 col-md-4">
                <form-builder-select-term
                  v-model:value="form.term_id"
                  :school-id="form.school_id"
                  active-only
                  label="دوره / ترم تحصیلی *"
                  outlined
                  dense
                  clearable />
              </div>

              <!-- تاریخ برگزاری آزمون -->
              <div class="col-12 col-md-3">
                <form-builder-date
                  v-model:value="form.exam_date"
                  label="تاریخ برگزاری آزمون *"
                  outlined
                  dense
                  :rules="[() => !!form.exam_date || 'تاریخ الزامی است']" />
              </div>

              <!-- زمان انتشار نتایج -->
              <div class="col-12 col-md-3">
                <form-builder-date-time
                  v-model:value="form.results_visible_at"
                  label="زمان نمایش نتایج به دانش‌آموزان"
                  outlined
                  dense />
              </div>

              <!-- وضعیت ارزیابی توصیفی -->
              <div class="col-12 col-md-6">
                <div class="bg-grey-1 q-px-md q-py-xs rounded-borders border row items-center justify-between full-height">
                  <div>
                    <div class="text-caption text-weight-bold text-blue-grey-9">نظام ارزیابی توصیفی (کیفی)</div>
                    <div class="text-caption text-grey-6">سطوح خیلی خوب، خوب، قابل قبول و...</div>
                  </div>
                  <q-toggle
                    v-model="form.is_descriptive"
                    color="purple"
                    dense />
                </div>
              </div>

              <!-- حداقل نمره قبولی و حداکثر نمره (اگر توصیفی نباشد) -->
              <template v-if="!form.is_descriptive">
                <div class="col-12 col-md-3">
                  <q-input
                    v-model.number="form.min_passing_score"
                    label="حداقل نمره قبولی"
                    outlined
                    dense
                    type="number"
                    step="0.01">
                    <template #prepend>
                      <q-icon
                        name="check_circle_outline"
                        color="positive" />
                    </template>
                  </q-input>
                </div>

                <div class="col-12 col-md-3">
                  <q-input
                    v-model.number="form.max_score"
                    label="سقف / حداکثر نمره *"
                    outlined
                    dense
                    type="number"
                    step="0.01">
                    <template #prepend>
                      <q-icon
                        name="military_tech"
                        color="warning" />
                    </template>
                  </q-input>
                </div>
              </template>
            </div>
          </q-card-section>
        </q-card>
      </transition>

      <!-- ۳. کارت ورود نمرات دانش‌آموزان -->
      <transition
        appear
        enter-active-class="animated fadeIn"
        leave-active-class="animated fadeOut">
        <q-card
          v-if="form.class_id && form.lesson_id"
          flat
          bordered
          class="rounded-borders q-mb-md">
          <q-card-section class="bg-blue-grey-1 q-py-sm">
            <div class="row items-center justify-between">
              <div class="row items-center">
                <q-icon
                  name="groups"
                  color="teal"
                  size="22px"
                  class="q-mr-xs" />
                <span class="text-subtitle2 text-weight-bold text-blue-grey-10">
                  لیست دانش‌آموزان و ورود نمرات
                </span>
              </div>
              <q-badge
                color="teal-7"
                class="text-weight-bold q-px-sm">
                تعداد کل: {{ studentOptions.length }} نفر
              </q-badge>
            </div>
          </q-card-section>

          <q-separator />

          <q-card-section class="q-pa-none">
            <!-- لودینگ / لیست خالی -->
            <div
              v-if="studentOptions.length === 0"
              class="column items-center justify-center q-pa-xl text-grey-6">
              <q-icon
                name="person_search"
                size="48px"
                color="grey-4" />
              <div class="text-body2 q-mt-sm">دانش‌آموزی در این کلاس یافت نشد.</div>
            </div>

            <!-- جدول / لیست ورود نمرات -->
            <q-list
              v-else
              separator
              class="rounded-borders">
              <q-item
                v-for="(student, index) in studentOptions"
                :key="student.id"
                class="q-py-sm items-center hover-bg-grey-1">
                <!-- ردیف و آیکون -->
                <q-item-section
                  avatar
                  style="min-width: 40px">
                  <span class="text-caption text-weight-bold text-grey-6">#{{ index + 1 }}</span>
                </q-item-section>

                <q-item-section>
                  <q-item-label class="text-weight-bold text-blue-grey-10">
                    {{ student.full_name }}
                  </q-item-label>
                </q-item-section>

                <!-- ورودی نمره عددی یا انتخاب توصیفی -->
                <q-item-section side>
                  <div class="row items-center q-col-gutter-sm">
                    <!-- حالت نمره‌ای -->
                    <div
                      v-if="!form.is_descriptive"
                      class="col-auto"
                      style="width: 140px">
                      <q-input
                        v-model="student.raw_grade"
                        label="نمره آزمون"
                        outlined
                        dense
                        type="number"
                        step="0.01"
                        placeholder="مثلاً 18.5"
                        bg-color="white" />
                    </div>

                    <!-- حالت توصیفی -->
                    <div
                      v-else
                      class="col-auto"
                      style="width: 200px">
                      <q-select
                        v-model="student.descriptive_value"
                        :options="descriptiveOptions"
                        option-value="value"
                        option-label="label"
                        label="سطح توصیفی"
                        outlined
                        dense
                        emit-value
                        map-options
                        bg-color="white" />
                    </div>
                  </div>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>
      </transition>

      <!-- دکمه‌های اقدام و سابمیت پایین صفحه -->
      <div class="row items-center justify-between q-mt-md">
        <q-btn
          flat
          color="grey-8"
          icon="arrow_forward"
          label="بازگشت به لیست آزمون‌های حضوری"
          :to="{ name: 'Panel.Exam.InPerson.List' }" />

        <q-btn
          type="submit"
          unelevated
          color="teal"
          icon="check_circle"
          label="ثبت نهایی آزمون و نمرات"
          class="q-px-lg"
          :loading="saving"
          :disable="!form.class_id || !form.lesson_id || !form.exam_category_id" />
      </div>
    </q-form>
  </div>
</template>


<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import ExamAPI from 'src/repositories/exam'
import StudentAPI from 'src/repositories/student'
import { useCurrentSchool } from 'src/composables/useCurrentSchool'
import FormBuilderDate from 'src/components/controls/formBuilderCustomInput/FormBuilderDate.vue'
import FormBuilderDateTime from 'src/components/controls/formBuilderCustomInput/FormBuilderDateTime.vue'
import FormBuilderSelectTerm from 'src/components/controls/formBuilderCustomInput/FormBuilderSelectTerm.vue'
import FormBuilderSelectLesson from 'src/components/controls/formBuilderCustomInput/FormBuilderSelectLesson.vue'
import FormBuilderSelectSchool from 'src/components/controls/formBuilderCustomInput/FormBuilderSelectSchool.vue'
import FormBuilderSelectSchoolClass from 'src/components/controls/formBuilderCustomInput/FormBuilderSelectSchoolClass.vue'
import FormBuilderSelectExamCategory from 'src/components/controls/formBuilderCustomInput/FormBuilderSelectExamCategory.vue'
import FormBuilderSelectAcademicField from 'src/components/controls/formBuilderCustomInput/FormBuilderSelectAcademicField.vue'
import FormBuilderSelectAcademicLevel from 'src/components/controls/formBuilderCustomInput/FormBuilderSelectAcademicLevel.vue'
import { useUser } from 'stores/user'

const $q = useQuasar()
const examApi = new ExamAPI()
const userStoreManager = useUser()
const studentApi = new StudentAPI()
const currentSchoolManager = useCurrentSchool()

const studentOptions = ref<any[]>([])
const saving = ref(false)

const descriptiveOptions = [
  { label: 'خیلی خوب', value: 1 },
  { label: 'خوب', value: 2 },
  { label: 'قابل قبول', value: 3 },
  { label: 'نیاز به آموزش و تلاش بیشتر', value: 4 }
]

const form = reactive({
  school_id: null as number | null,
  field_id: null as number | null,
  academic_level_id: null as number | null,
  class_id: null as number | null,
  lesson_id: null as number | null,
  exam_date: new Date().toISOString() as string | null,
  is_descriptive: false,
  min_passing_score: 10 as number | null,
  max_score: 20 as number | null,
  results_visible_at: null as string | null,
  term_id: null as number | null,
  occurrence: null as number | null,
  exam_name: 'آزمون کلاسی',
  exam_category_id: null as number | null
})

const examName = computed({
  get () {
    return form.exam_name
  },
  set (val) {
    form.exam_name = val
  }
})
const currentSchoolId = computed(() => currentSchoolManager?.currentSchool.value?.id)

async function loadStudents (classId: number) {
  try {
    const result = await studentApi.index({ length: 1000, class_id: classId })
    studentOptions.value = result.data.map((s: any) => ({
      id: s.id,
      full_name: s.full_name || `${s.first_name} ${s.last_name}`,
      raw_grade: null,
      descriptive_value: null
    }))
  } catch (error) {
    console.error('Error loading students:', error)
  }
}

function onSchoolChange () {
  form.field_id = null
  form.academic_level_id = null
  form.class_id = null
  form.lesson_id = null
  form.exam_category_id = null
  form.exam_name = 'آزمون کلاسی'
  studentOptions.value = []
}

function onFieldChange (fieldId: number | null) {
  form.academic_level_id = null
  form.class_id = null
  form.lesson_id = null
  studentOptions.value = []
}

function onLevelChange (levelId: number | null) {
  form.class_id = null
  form.lesson_id = null
  studentOptions.value = []
}

function onClassChange (classId: number | null) {
  studentOptions.value = []
  if (classId) {
    loadStudents(classId)
  }
}

async function onSubmit () {
  saving.value = true

  try {
    if (!form.is_descriptive) {
      if (!form.max_score || Number(form.max_score) <= 0) {
        $q.notify({
          icon: 'error',
          message: 'حداکثر نمره معتبر نیست.',
          color: 'negative'
        })
        return
      }

      if (
        form.min_passing_score !== null &&
        Number(form.min_passing_score) >= Number(form.max_score)
      ) {
        $q.notify({
          icon: 'error',
          message: 'حداقل نمره قبولی باید از حداکثر نمره کمتر باشد.',
          color: 'negative'
        })
        return
      }

      if (!form.term_id) {
        $q.notify({
          icon: 'error',
          message: 'ترم را انتخاب کنید',
          color: 'negative'
        })
        return
      }

      for (const student of studentOptions.value) {
        const rawGrade = student.raw_grade

        const isEmpty = rawGrade === null || rawGrade === ''
        if (!isEmpty && isNaN(Number(rawGrade))) {
          $q.notify({
            icon: 'error',
            message: `نمره دانش آموز ${student.full_name} باید عدد باشد.`,
            color: 'negative'
          })
          return
        }

        if (!isEmpty && Number(rawGrade) > Number(form.max_score)) {
          $q.notify({
            icon: 'error',
            message: `نمره دانش آموز ${student.full_name} باید کمتر از حداکثر نمره (${form.max_score}) باشد.`,
            color: 'negative'
          })
          return
        }
      }
    }

    const results = studentOptions.value
      .map((s: any) => {
        const rawScore = form.is_descriptive
          ? s.descriptive_value || 0
          : s.raw_grade === null || s.raw_grade === ''
            ? null
            : Number(s.raw_grade)
        let scaledScore = null
        if (
          !form.is_descriptive &&
          rawScore !== null &&
          form.max_score &&
          Number(form.max_score) > 0
        ) {
          scaledScore = Math.round((rawScore / Number(form.max_score)) * 20)
        }

        return {
          user_id: s.id,
          raw_score: rawScore,
          scaled_score: scaledScore,
          t_score: null
        }
      })
      .filter(
        (r) => typeof r.raw_score !== 'undefined' && r.raw_score !== null && !isNaN(r.raw_score)
      )

    const payload = {
      name: examName.value || form.exam_name,
      description: null,
      lesson_id: form.lesson_id,
      min_passing_score: form.min_passing_score,
      max_score: form.max_score,
      exam_category_id: form.exam_category_id,
      held_at: form.exam_date,
      is_descriptive: form.is_descriptive,
      results_visible_at: form.results_visible_at,
      term_id: form.term_id,
      occurrence: form.occurrence,
      class_ids: [form.class_id],
      results
    }

    await examApi.storeWithInPersonDetailAndResults(payload)

    $q.notify({
      icon: 'check',
      message: 'آزمون با موفقیت ثبت شد.',
      color: 'positive'
    })
  } catch (error: any) {
    const message = error?.response?.data?.message || 'خطا در ثبت آزمون.'
    $q.notify({
      icon: 'error',
      message,
      color: 'negative'
    })
  } finally {
    saving.value = false
  }
}

function loadInputsForCurrentSchool () {
  if (!currentSchoolId.value) {
    return
  }

  form.school_id = currentSchoolId.value
  onSchoolChange()
}

loadInputsForCurrentSchool()

onMounted(() => {
  if (currentSchoolId.value) {
    form.school_id = currentSchoolId.value
  }
  // No need to load schools - FormBuilderSelectSchool loads internally
})
</script>

<style lang="scss" scoped>
.grade-create-page {
  width: 100%;
  margin: 0 auto;
}
</style>
