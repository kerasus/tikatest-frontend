<template>
  <div class="student-form-page">
    <q-card>
      <q-card-section>
        <div class="text-h6">ویرایش اطلاعات دانش آموز</div>
      </q-card-section>

      <q-separator />

      <q-card-section>
        <q-form @submit.prevent="onSubmit">
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-6">
              <q-input
                v-model="form.first_name"
                label="نام"
                outlined />
            </div>
            <div class="col-12 col-md-6">
              <q-input
                v-model="form.last_name"
                label="نام خانوادگی"
                outlined />
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
                v-model="form.national_id"
                label="کد ملی"
                outlined
                dir="ltr" />
            </div>
            <div class="col-12 col-md-6">
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
                v-model="form.mother_name"
                label="نام مادر"
                outlined />
            </div>
            <div class="col-12 col-md-6">
              <q-input
                v-model="form.mother_phone"
                label="تلفن مادر"
                outlined
                dir="ltr" />
            </div>
          </div>

          <div class="q-mt-md">
            <q-btn
              type="submit"
              color="primary"
              label="ذخیره تغییرات"
              :loading="saving" />
            <q-btn
              flat
              label="انصراف"
              :to="{ name: 'Panel.Student.Show', params: { id: route.params.id } }"
              class="q-ml-sm" />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import StudentAPI from 'src/repositories/student'
import SchoolClassAPI from 'src/repositories/schoolClass'
import type { StudentType } from 'src/repositories/student'

const studentApi = new StudentAPI()
const schoolClassApi = new SchoolClassAPI()

const route = useRoute()
const router = useRouter()
const $q = useQuasar()

const form = reactive<Partial<StudentType>>({
  first_name: null,
  last_name: null,
  student_phone: null,
  national_id: null,
  student_code: null,
  birth_date: null,
  student_email: null,
  address: null,
  father_name: null,
  father_phone: null,
  father_email: null,
  father_job: null,
  mother_name: null,
  mother_last_name: null,
  mother_phone: null,
  mother_email: null,
  mother_job: null
})

const classOptions = ref<any[]>([])
const saving = ref(false)

async function loadStudent () {
  try {
    const result = await studentApi.get(Number(route.params.id))
    Object.assign(form, result)
  } catch (error) {
    $q.notify({
      icon: 'error',
      message: 'خطا در بارگذاری اطلاعات دانش آموز.',
      color: 'negative'
    })
  }
}

async function onSubmit () {
  saving.value = true
  try {
    await studentApi.update(Number(route.params.id), form as any)
    $q.notify({
      icon: 'check',
      message: 'اطلاعات با موفقیت به‌روزرسانی شد.',
      color: 'positive'
    })
    router.push({ name: 'Panel.Student.Show', params: { id: route.params.id } })
  } catch (error) {
    $q.notify({
      icon: 'error',
      message: 'خطا در به‌روزرسانی اطلاعات.',
      color: 'negative'
    })
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  loadStudent()
  schoolClassApi.index({ length: 100 }).then((result) => {
    classOptions.value = result.data
  })
})
</script>

<style lang="scss" scoped>
.student-form-page {
  max-width: 900px;
  margin: 0 auto;
}
</style>
