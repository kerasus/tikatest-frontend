<template>
  <q-page class="q-pa-md">
    <div class="row items-center q-mb-lg">
      <div class="col">
        <h4 class="q-ma-none">ثبت ساعت مطالعه</h4>
      </div>
      <div class="col-auto">
        <q-btn
          flat
          label="لیست ساعات مطالعه"
          :to="{ name: 'Student.StudySessions.List' }" />
      </div>
    </div>

    <q-card style="max-width: 700px; margin: 0 auto;">
      <q-card-section>
        <q-form @submit.prevent="onSubmit">
          <div class="row q-col-gutter-md">
            <div class="col-12">
              <q-select
                v-model="form.lesson_id"
                :options="lessonOptions"
                option-value="id"
                option-label="name"
                label="درس"
                outlined
                clearable
                emit-value
                map-options />
            </div>
            <div class="col-12">
              <q-select
                v-model="form.term_id"
                :options="termOptions"
                option-value="id"
                option-label="name"
                label="ترم"
                outlined
                clearable
                emit-value
                map-options />
            </div>
            <div class="col-12 col-md-6">
              <q-input
                v-model="form.started_at"
                label="زمان شروع"
                outlined
                type="datetime-local" />
            </div>
            <div class="col-12 col-md-6">
              <q-input
                v-model="form.ended_at"
                label="زمان پایان"
                outlined
                type="datetime-local" />
            </div>
            <div class="col-12">
              <q-input
                v-model="form.description"
                label="توضیحات"
                outlined
                type="textarea" />
            </div>
            <div class="col-12">
              <q-select
                v-model="form.source"
                :options="sourceOptions"
                label="منبع"
                outlined
                clearable
                emit-value
                map-options />
            </div>
          </div>

          <div class="q-mt-lg">
            <q-btn
              type="submit"
              color="primary"
              label="ثبت"
              :loading="saving"
              class="q-ml-sm" />
            <q-btn
              flat
              label="انصراف"
              :to="{ name: 'Student.StudySessions.List' }" />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
import { useUser } from 'src/stores/user'
import { ref, reactive, onMounted } from 'vue'
import { lesson } from 'src/repositories/lesson'
import type { LessonType } from 'src/repositories/lesson'
import AcademicTermAPI from 'src/repositories/academicTerm'
import { studySession } from 'src/repositories/studySession'
import { useCurrentSchool } from 'src/composables/useCurrentSchool'
import type { AcademicTermType } from 'src/repositories/academicTerm'
import type { StudySessionSourceEnum } from 'src/repositories/studySession'

const $q = useQuasar()
const router = useRouter()
const userStore = useUser()
const currentSchoolManager = useCurrentSchool()

const saving = ref(false)
const lessonOptions = ref<LessonType[]>([])
const termOptions = ref<AcademicTermType[]>([])

const form = reactive({
  lesson_id: null as number | null,
  term_id: null as number | null,
  started_at: new Date().toISOString().slice(0, 16),
  ended_at: null as string | null,
  description: null as string | null,
  source: 'manual' as StudySessionSourceEnum | null,
  metadata: null as Record<string, any> | null
})

const sourceOptions = [
  { label: 'دستی', value: 'manual' },
  { label: 'سیستم مدیریت یادگیری', value: 'lms' },
  { label: 'کلاس آنلاین', value: 'online_class' }
]

async function onSubmit () {
  saving.value = true
  try {
    await studySession.createSession({
      student_id: userStore.me?.id ?? null,
      lesson_id: form.lesson_id,
      term_id: form.term_id,
      started_at: form.started_at,
      ended_at: form.ended_at,
      description: form.description,
      source: form.source
    })
    $q.notify({
      icon: 'check',
      message: 'ساعت مطالعه با موفقیت ثبت شد.',
      color: 'positive'
    })
    router.push({ name: 'Student.StudySessions.List' })
  } catch (error: any) {
    $q.notify({
      icon: 'error',
      message: error?.response?.data?.message || 'خطا در ثبت ساعت مطالعه.',
      color: 'negative'
    })
  } finally {
    saving.value = false
  }
}

onMounted(async () => {
  try {
    const academicTermAPI = new AcademicTermAPI(currentSchoolManager.currentSchool.value.id)
    const [lessonsRes, termsRes] = await Promise.all([
      lesson.index({ length: 1000 }),
      academicTermAPI.index({ length: 1000 })
    ])
    lessonOptions.value = lessonsRes.data ?? []
    termOptions.value = termsRes.data ?? []
  } catch (error: any) {
    console.error('Error loading data:', error)
  }
})
</script>
