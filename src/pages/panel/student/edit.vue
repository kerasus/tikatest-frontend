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
                v-model="form.mobile"
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
                v-model="form.email"
                label="ایمیل"
                outlined
                dir="ltr" />
            </div>
            <div class="col-12 col-md-6">
              <q-input
                v-model="form.birth_date"
                label="تاریخ تولد"
                outlined
                type="date"
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
                dense
                clearable
                emit-value
                map-options />
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

    <student-class-assignment
      :student-id="Number(route.params.id)"
      :registrations="studentData?.user_class_registrations || []"
      :readonly="false" />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import StudentAPI from 'src/repositories/student'
import SchoolClassAPI from 'src/repositories/schoolClass'
import StudentClassAssignment from 'src/components/StudentClassAssignment.vue'

const studentApi = new StudentAPI()
const schoolClassApi = new SchoolClassAPI()

const route = useRoute()
const router = useRouter()
const $q = useQuasar()

const studentData = ref<any>(null)

const form = reactive<{
  first_name: string | null
  last_name: string | null
  mobile: string | null
  national_id: string | null
  birth_date: string | null
  email: string | null
  address: string | null
  description: string | null
  class_id: number | null
}>({
  first_name: null,
  last_name: null,
  mobile: null,
  national_id: null,
  birth_date: null,
  email: null,
  address: null,
  description: null,
  class_id: null
})

const saving = ref(false)
const classOptions = ref<any[]>([])

async function loadStudent () {
  try {
    const result = await studentApi.get(Number(route.params.id))
    studentData.value = result
    form.first_name = result.first_name
    form.last_name = result.last_name
    form.mobile = result.mobile
    form.national_id = result.national_id
    form.birth_date = result.birth_date
      ? new Date(result.birth_date).toISOString().split('T')[0]
      : null
    form.email = result.email
    form.address = result.address
    form.description = result.description
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

onMounted(async () => {
  await Promise.all([
    loadStudent(),
    (async () => {
      const result = await schoolClassApi.index({ length: 100 })
      classOptions.value = result.data
    })()
  ])
})
</script>

<style lang="scss" scoped>
.student-form-page {
  max-width: 900px;
  margin: 0 auto;
}
</style>
