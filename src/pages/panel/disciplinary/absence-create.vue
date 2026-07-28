<template>
  <q-page class="q-pa-md">
    <div class="row items-center q-mb-lg">
      <div class="col">
        <h4 class="q-ma-none">ثبت غیبت</h4>
      </div>
    </div>

    <q-card>
      <q-card-section>
        <div class="row q-col-gutter-md q-mb-md">
          <div class="col-12 col-md-4">
            <q-select
              v-model="form.case_id"
              :options="caseOptions"
              option-value="id"
              option-label="name"
              label="نوع غیبت"
              outlined
              dense
              emit-value
              map-options />
          </div>
          <div class="col-12 col-md-4">
            <q-input
              v-model="form.date"
              label="تاریخ"
              outlined
              dense
              mask="date"
              :rules="['date']">
              <template #append>
                <q-icon
                  name="event"
                  class="cursor-pointer">
                  <q-popup-proxy
                    cover
                    transition-show="scale"
                    transition-hide="scale">
                    <q-date
                      v-model="form.date"
                      color="primary" />
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>
          <div class="col-12 col-md-4">
            <q-input
              v-model="form.description"
              label="توضیحات"
              outlined
              dense />
          </div>
        </div>

        <div class="q-mb-md">
          <label class="text-subtitle2">دانش آموزان</label>
          <q-select
            v-model="form.student_ids"
            :options="studentOptions"
            option-value="id"
            option-label="full_name"
            multiple
            outlined
            dense
            emit-value
            map-options
            use-chips
            use-input
            @filter="filterStudents" />
        </div>

        <div class="text-center q-mt-lg">
          <q-btn
            color="primary"
            label="ثبت غیبت"
            :loading="loading"
            @click="submitForm" />
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { disciplinaryRecord } from 'src/repositories/disciplinaryRecord'
import { disciplinaryCase } from 'src/repositories/disciplinaryCase'
import { student } from 'src/repositories/student'

const $q = useQuasar()

const form = reactive({
  student_ids: [] as number[],
  date: new Date().toISOString().split('T')[0],
  description: '',
  case_id: null as number | null
})

const caseOptions = ref<any[]>([])
const studentOptions = ref<any[]>([])
const allStudents = ref<any[]>([])
const loading = ref(false)

const loadCases = async () => {
  try {
    const result = await disciplinaryCase.index({ length: 100 })
    caseOptions.value = result.data.filter((c: any) => 
      c.name?.toLowerCase().includes('غیبت') || c.name?.toLowerCase().includes('absence')
    )
  } catch (error) {
    $q.notify({ color: 'negative', message: 'خطا در بارگذاری انواع غیبت' })
  }
}

const loadStudents = async () => {
  try {
    const result = await student.index({ length: 100 })
    allStudents.value = result.data.map((s: any) => ({
      id: s.id,
      full_name: s.full_name || `${s.first_name} ${s.last_name}`,
      ...s
    }))
    studentOptions.value = allStudents.value
  } catch (error) {
    $q.notify({ color: 'negative', message: 'خطا در بارگذاری دانش آموزان' })
  }
}

const filterStudents = (val: string, update: any) => {
  if (!val) {
    update(() => {
      studentOptions.value = allStudents.value
    })
    return
  }
  update(() => {
    const needle = val.toLowerCase()
    studentOptions.value = allStudents.value.filter((s: any) =>
      s.full_name?.toLowerCase().includes(needle)
    )
  })
}

const submitForm = async () => {
  if (!form.student_ids.length || !form.case_id) {
    $q.notify({ color: 'warning', message: 'تمام فیلدها را پر کنید' })
    return
  }

  loading.value = true
  try {
    await disciplinaryRecord.registerAbsenteeism({
      student_ids: form.student_ids,
      date: form.date,
      description: form.description,
      case_id: form.case_id
    })
    $q.notify({ color: 'positive', message: 'غیبت با موفقیت ثبت شد' })
    form.student_ids = []
  } catch (error: any) {
    $q.notify({ color: 'negative', message: error.response?.data?.message || 'خطا در ثبت غیبت' })
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadCases()
  loadStudents()
})
</script>

<style scoped>
</style>