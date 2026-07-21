<template>
  <div class="student-form-page">
    <q-card>
      <q-card-section>
        <div class="text-h6">ثبت دانش آموز جدید</div>
      </q-card-section>

      <q-separator />

      <q-card-section>
        <q-form @submit.prevent="onSubmit">
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-6">
              <q-input
                v-model="form.firstname"
                label="نام *"
                outlined
                required />
            </div>
            <div class="col-12 col-md-6">
              <q-input
                v-model="form.lastname"
                label="نام خانوادگی *"
                outlined
                required />
            </div>
            <div class="col-12 col-md-6">
              <q-input
                v-model="form.username"
                label="نام کاربری *"
                outlined
                required
                dir="ltr" />
            </div>
            <div class="col-12 col-md-6">
              <q-input
                v-model="form.password"
                label="کلمه عبور *"
                type="password"
                outlined
                required />
            </div>
            <div class="col-12 col-md-6">
              <q-input
                v-model="form.student_phone"
                label="تلفن همراه"
                outlined
                dir="ltr" />
            </div>
            <div class="col-12 col-md-6">
              <q-input
                v-model="form.melli_code"
                label="کد ملی"
                outlined
                dir="ltr" />
            </div>
            <div class="col-12 col-md-6">
              <q-input
                v-model="form.student_code"
                label="کد دانش آموزی"
                outlined
                dir="ltr" />
            </div>
            <div class="col-12 col-md-6">
              <q-input
                v-model="form.student_email"
                label="ایمیل"
                outlined
                dir="ltr" />
            </div>
            <div class="col-12 col-md-6">
              <q-input
                v-model="form.birth_date"
                label="تاریخ تولد"
                outlined
                mask="####/##/##" />
            </div>
            <div class="col-12">
              <q-input
                v-model="form.address"
                label="آدرس"
                outlined
                type="textarea" />
            </div>

            <div class="col-12 col-md-6">
              <q-input
                v-model="form.father_name"
                label="نام پدر"
                outlined />
            </div>
            <div class="col-12 col-md-6">
              <q-input
                v-model="form.father_phone"
                label="تلفن پدر"
                outlined
                dir="ltr" />
            </div>
            <div class="col-12 col-md-6">
              <q-input
                v-model="form.father_email"
                label="ایمیل پدر"
                outlined
                dir="ltr" />
            </div>
            <div class="col-12 col-md-6">
              <q-input
                v-model="form.father_job"
                label="شغل پدر"
                outlined />
            </div>

            <div class="col-12 col-md-6">
              <q-input
                v-model="form.mother_name"
                label="نام مادر"
                outlined />
            </div>
            <div class="col-12 col-md-6">
              <q-input
                v-model="form.mother_lastname"
                label="نام خانوادگی مادر"
                outlined />
            </div>
            <div class="col-12 col-md-6">
              <q-input
                v-model="form.mother_phone"
                label="تلفن مادر"
                outlined
                dir="ltr" />
            </div>
            <div class="col-12 col-md-6">
              <q-input
                v-model="form.mother_email"
                label="ایمیل مادر"
                outlined
                dir="ltr" />
            </div>

            <div class="col-12 col-md-6">
              <q-select
                v-model="form.class_id"
                :options="classOptions"
                option-value="id"
                option-label="name"
                label="کلاس"
                outlined
                emit-value
                map-options
                clearable />
            </div>
          </div>

          <div class="q-mt-md">
            <q-btn
              type="submit"
              color="primary"
              label="ثبت دانش آموز"
              :loading="saving" />
            <q-btn
              flat
              label="انصراف"
              :to="{ name: 'Panel.Student.List' }"
              class="q-ml-sm" />
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
import StudentAPI from 'src/repositories/student'
import SchoolClassAPI from 'src/repositories/schoolClass'
import type { StudentType } from 'src/repositories/student'

const studentApi = new StudentAPI()
const schoolClassApi = new SchoolClassAPI()

const router = useRouter()
const $q = useQuasar()

const form = reactive<Partial<StudentType>>({
  firstname: null,
  lastname: null,
  username: null,
  password: null,
  student_phone: null,
  melli_code: null,
  student_code: null,
  birth_date: null,
  student_email: null,
  address: null,
  father_name: null,
  father_phone: null,
  father_email: null,
  father_job: null,
  mother_name: null,
  mother_lastname: null,
  mother_phone: null,
  mother_email: null,
  mother_job: null
})

const classOptions = ref<any[]>([])
const saving = ref(false)

async function onSubmit () {
  saving.value = true
  try {
    await studentApi.create(form as any)
    $q.notify({
      icon: 'check',
      message: 'دانش آموز با موفقیت ثبت شد.',
      color: 'positive'
    })
    router.push({ name: 'Panel.Student.List' })
  } catch (error) {
    $q.notify({
      icon: 'error',
      message: 'خطا در ثبت دانش آموز.',
      color: 'negative'
    })
  } finally {
    saving.value = false
  }
}

onMounted(async () => {
  const result = await schoolClassApi.index({ length: 100 })
  classOptions.value = result.data
})
</script>

<style lang="scss" scoped>
.student-form-page {
  max-width: 900px;
  margin: 0 auto;
}
</style>
