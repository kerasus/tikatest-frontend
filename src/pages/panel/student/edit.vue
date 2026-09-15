<template>
  <entity-edit
    v-model:value="inputs"
    :title="label"
    :api="api"
    :entity-id-key="entityIdKey"
    :entity-param-key="entityParamKey"
    :index-route-name="indexRouteName"
    :show-route-name="showRouteName"
    :show-expand-button="false"
    :after-load-input-data="afterLoadInputData" />

  <q-separator class="q-my-md" />

  <student-class-assignment
    :student-id="Number(studentId)"
    :term-enrollments="studentData?.term_enrollments || []"
    :readonly="false"
    @updated="loadPage" />

  <student-guardian-manager
    :student-profile-id="studentData?.student_profile?.id || null"
    :guardians="studentData?.student_profile?.guardians || []"
    :readonly="false"
    @updated="loadPage" />
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { EntityEdit } from 'quasar-crud'
import StudentAPI, { StudentType } from 'src/repositories/student'
import SchoolClassAPI from 'src/repositories/schoolClass'
import StudentClassAssignment from 'src/components/StudentClassAssignment.vue'
import StudentGuardianManager from 'src/components/StudentGuardianManager.vue'

const studentApi = new StudentAPI()
const schoolClassApi = new SchoolClassAPI()

const $q = useQuasar()
const route = useRoute()
const router = useRouter()

const studentId = computed(() => route.params.id)

const studentData = ref<StudentType | null>(null)
const entityIdKey = ref('id')
const entityParamKey = ref('id')
const indexRouteName = ref('Panel.Student.List')
const showRouteName = ref('Panel.Student.Show')

const inputs = ref([
  {
    type: 'hidden',
    name: 'id',
    responseKey: 'id'
  },
  {
    type: 'file',
    name: 'picture',
    responseKey: 'picture',
    label: 'تصویر',
    placeholder: ' ',
    col: 'col-md-3 col-12'
  },
  {
    type: 'space',
    name: 'space',
    responseKey: 'space',
    col: 'col-12'
  },
  {
    type: 'input',
    name: 'first_name',
    responseKey: 'first_name',
    label: 'نام',
    placeholder: ' ',
    col: 'col-md-4 col-12'
  },
  {
    type: 'input',
    name: 'last_name',
    responseKey: 'last_name',
    label: 'نام خانوادگی',
    placeholder: ' ',
    col: 'col-md-4 col-12'
  },
  {
    type: 'input',
    name: 'national_id',
    responseKey: 'national_id',
    label: 'کد ملی',
    placeholder: ' ',
    col: 'col-md-4 col-12'
  },
  {
    type: 'input',
    name: 'mobile',
    responseKey: 'mobile',
    label: 'تلفن همراه',
    placeholder: ' ',
    col: 'col-md-4 col-12'
  },
  {
    type: 'input',
    name: 'email',
    responseKey: 'email',
    label: 'ایمیل',
    placeholder: ' ',
    col: 'col-md-4 col-12'
  },
  {
    type: 'date',
    name: 'birth_date',
    responseKey: 'birth_date',
    outsideLabel: 'تاریخ تولد',
    placeholder: ' ',
    col: 'col-md-4 col-12'
  },
  {
    type: 'input',
    name: 'address',
    responseKey: 'address',
    inputType: 'textarea',
    label: 'آدرس',
    placeholder: ' ',
    col: 'col-md-12 col-12'
  }
])
const api = ref(studentApi.endpoints.byId(Number(studentId.value)))
const label = ref('اطلاعات دانش آموز')

const form = reactive<{
  first_name: string | null;
  last_name: string | null;
  mobile: string | null;
  national_id: string | null;
  birth_date: string | null;
  email: string | null;
  address: string | null;
  description: string | null;
  class_id: number | null;
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
    const result = await studentApi.get(Number(studentId.value))
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
    await studentApi.update(Number(studentId.value), form as any)
    $q.notify({
      icon: 'check',
      message: 'اطلاعات با موفقیت به‌روزرسانی شد.',
      color: 'positive'
    })
    router.push({ name: 'Panel.Student.Show', params: { id: studentId.value } })
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

async function loadPage () {
  await Promise.all([
    loadStudent(),
    (async () => {
      const result = await schoolClassApi.index({ length: 100 })
      classOptions.value = result.data
    })()
  ])
}

function afterLoadInputData (data: StudentType) {
  studentData.value = data
}

onMounted(async () => {
  loadPage()
})
</script>

<style lang="scss" scoped>
.student-form-page {
}
</style>
