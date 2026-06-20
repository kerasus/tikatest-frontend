<template>
  <div class="grade-form-page">
    <q-card>
      <q-card-section>
        <div class="text-h6">ثبت نمره جدید</div>
      </q-card-section>

      <q-separator />

      <q-card-section>
        <q-form @submit.prevent="onSubmit">
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-6">
              <q-select
                v-model="form.exam_session_id"
                :options="sessionOptions"
                option-value="id"
                option-label="label"
                label="جلسه آزمون *"
                outlined
                emit-value
                map-options
                required />
            </div>
            <div class="col-12 col-md-6">
              <q-input v-model="form.raw_grade" label="نمره خام *" outlined type="number" step="0.01" />
            </div>
            <div class="col-12 col-md-6">
              <q-select
                v-model="form.student_id"
                :options="studentOptions"
                option-value="id"
                option-label="full_name"
                label="دانش آموز *"
                outlined
                emit-value
                map-options
                required />
            </div>
            <div class="col-12 col-md-6">
              <q-select
                v-model="form.is_visible"
                :options="[{label: 'قابل مشاهده', value: true}, {label: 'مخفی', value: false}]"
                label="وضعیت نمایش"
                outlined
                emit-value
                map-options />
            </div>
            <div class="col-12">
              <q-input v-model="form.explanation" label="توضیحات" outlined type="textarea" />
            </div>
          </div>

          <div class="q-mt-md">
            <q-btn type="submit" color="primary" label="ثبت نمره" :loading="saving" />
            <q-btn flat label="انصراف" :to="{ name: 'Panel.Grade.List' }" class="q-ml-sm" />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import GradeAPI from 'src/repositories/grade'
import ExamSessionAPI from 'src/repositories/examSession'
import StudentAPI from 'src/repositories/student'
import type { GradeType } from 'src/repositories/grade'

const router = useRouter()
const $q = useQuasar()

const form = reactive<Partial<GradeType>>({
  exam_session_id: null,
  student_id: null,
  raw_grade: null,
  calculated_grade: null,
  is_visible: true,
  explanation: null
})

const sessionOptions = ref<any[]>([])
const studentOptions = ref<any[]>([])
const saving = ref(false)

async function loadSessions () {
  const result = await ExamSessionAPI.prototype.index({ length: 100 })
  sessionOptions.value = result.data.map((item: any) => ({
    id: item.id,
    label: `${item.lesson?.name || ''} - ${item.schoolClass?.name || ''} (${item.persian_date || item.gregorian_date})`,
    ...item
  }))
}

async function loadStudents () {
  const result = await StudentAPI.prototype.index({ length: 100 })
  studentOptions.value = result.data.map((item: any) => ({
    id: item.id,
    full_name: item.full_name || `${item.firstname} ${item.lastname}`,
    ...item
  }))
}

async function onSubmit () {
  saving.value = true
  try {
    await GradeAPI.prototype.create(form as any)
    $q.notify({
      icon: 'check',
      message: 'نمره با موفقیت ثبت شد.',
      color: 'positive'
    })
    router.push({ name: 'Panel.Grade.List' })
  } catch (error) {
    $q.notify({
      icon: 'error',
      message: 'خطا در ثبت نمره.',
      color: 'negative'
    })
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  loadSessions()
  loadStudents()
})
</script>

<style lang="scss" scoped>
.grade-form-page {
  max-width: 700px;
  margin: 0 auto;
}
</style>
