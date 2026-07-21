<template>
  <q-page class="q-pa-md">
    <div class="row items-center q-mb-lg">
      <div class="col">
        <h4 class="q-ma-none">ثبت مورد انضباطی</h4>
      </div>
    </div>

    <q-card style="max-width: 700px; margin: 0 auto;">
      <q-card-section>
        <q-form @submit.prevent="onSubmit">
          <div class="row q-col-gutter-md">
            <div class="col-12">
              <q-select
                v-model="form.student_id"
                :options="studentOptions"
                option-value="id"
                option-label="full_name"
                label="دانش آموز *"
                outlined
                use-input
                emit-value
                map-options
                :rules="[val => !!val || 'دانش آموز را انتخاب کنید']"
                @filter="filterStudents" />
            </div>
            <div class="col-12">
              <q-select
                v-model="form.case_id"
                :options="caseOptions"
                option-value="id"
                option-label="name"
                label="نوع مورد انضباطی *"
                outlined
                emit-value
                map-options
                :rules="[val => !!val || 'نوع مورد را انتخاب کنید']" />
            </div>
            <div class="col-12">
              <q-input
                v-model="form.incident_date"
                label="تاریخ واقعه"
                outlined
                type="date" />
            </div>
            <div class="col-12">
              <q-input
                v-model="form.description"
                label="توضیحات"
                outlined
                type="textarea" />
            </div>
          </div>

          <div class="q-mt-lg">
            <q-btn
              type="submit"
              color="primary"
              label="ثبت مورد"
              :loading="saving"
              class="q-ml-sm" />
            <q-btn
              flat
              label="انصراف"
              :to="{ name: 'Panel.Disciplinary.List' }" />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { disciplinaryRecord } from 'src/repositories/disciplinaryRecord'
import { disciplinaryCase } from 'src/repositories/disciplinaryCase'
import { student } from 'src/repositories/student'

const router = useRouter()
const $q = useQuasar()

const saving = ref(false)
const allStudents = ref<any[]>([])
const cases = ref<any[]>([])

const studentOptions = ref<any[]>([])
const caseOptions = ref<any[]>([])

const form = reactive({
  student_id: null as number | null,
  case_id: null as number | null,
  incident_date: new Date().toISOString().split('T')[0],
  description: null as string | null
})

const filterStudents = (val: string, update: any) => {
  if (val === '') {
    update(() => { studentOptions.value = allStudents.value })
    return
  }
  update(() => {
    studentOptions.value = allStudents.value.filter((s: any) =>
      s.full_name.toLowerCase().includes(val.toLowerCase())
    )
  })
}

const onSubmit = async () => {
  saving.value = true
  try {
    await disciplinaryRecord.create(form as any)
    $q.notify({
      icon: 'check',
      message: 'مورد انضباطی با موفقیت ثبت شد.',
      color: 'positive'
    })
    router.push({ name: 'Panel.Disciplinary.List' })
  } catch (error) {
    $q.notify({
      icon: 'error',
      message: 'خطا در ثبت مورد.',
      color: 'negative'
    })
  } finally {
    saving.value = false
  }
}

onMounted(async () => {
  try {
    const [studentsRes, casesRes] = await Promise.all([
      student.index({ length: 200 }),
      disciplinaryCase.index({ length: 100 })
    ])
    allStudents.value = studentsRes.data || []
    caseOptions.value = casesRes.data || []
    studentOptions.value = allStudents.value
  } catch (error: any) {
    $q.notify({ type: 'negative', message: 'خطا در بارگذاری داده‌ها' })
  }
})
</script>
