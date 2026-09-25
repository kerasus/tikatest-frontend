<template>
  <entity-create
    v-model:value="inputs"
    :title="label"
    :api="api"
    :entity-id-key="entityIdKey"
    :entity-param-key="entityParamKey"
    :index-route-name="indexRouteName"
    :show-route-name="showRouteName"
    :show-expand-button="false" />
</template>

<script setup lang="ts">
import { ref, shallowRef } from 'vue'
import { EntityCreate } from 'quasar-crud'
import StudentAPI from 'src/repositories/student'
import { useCurrentSchool } from 'src/composables/useCurrentSchool'
import FormBuilderDate from 'src/components/controls/formBuilderCustomInput/FormBuilderDate.vue'
import FormBuilderInput from 'src/components/controls/formBuilderCustomInput/FormBuilderInput.vue'
import FormBuilderSelectClasses from 'src/components/controls/formBuilderCustomInput/FormBuilderSelectClasses.vue'

const studentAPI = new StudentAPI()
const currentSchoolManager = useCurrentSchool()

const FormBuilderDateComponent = shallowRef(FormBuilderDate)
const FormBuilderInputComponent = shallowRef(FormBuilderInput)
const FormBuilderSelectClassesComponent = shallowRef(FormBuilderSelectClasses)

const api = ref(studentAPI.endpoints.base)
const label = ref('ثبت دانش آموز جدید')
const indexRouteName = ref('Panel.Student.List')
const showRouteName = ref('Panel.Student.Show')
const entityIdKey = ref('id')
const entityParamKey = ref('id')
const inputs = ref([
  {
    type: FormBuilderInputComponent,
    name: 'first_name',
    responseKey: 'first_name',
    label: 'نام',
    col: 'col-md-6 col-12',
    required: true
  },
  {
    type: FormBuilderInputComponent,
    name: 'last_name',
    responseKey: 'last_name',
    label: 'نام خانوادگی',
    col: 'col-md-6 col-12',
    required: true
  },
  {
    type: FormBuilderInputComponent,
    name: 'username',
    responseKey: 'username',
    label: 'نام کاربری',
    col: 'col-md-6 col-12',
    required: true
  },
  {
    type: FormBuilderInputComponent,
    name: 'password',
    responseKey: 'password',
    label: 'کلمه عبور',
    col: 'col-md-6 col-12',
    required: true
  },
  {
    type: FormBuilderInputComponent,
    name: 'mobile',
    responseKey: 'mobile',
    label: 'تلفن همراه',
    col: 'col-md-6 col-12'
  },
  {
    type: FormBuilderInputComponent,
    name: 'national_id',
    responseKey: 'national_id',
    label: 'کد ملی',
    col: 'col-md-6 col-12'
  },
  {
    type: FormBuilderInputComponent,
    name: 'student_code',
    responseKey: 'student_code',
    label: 'کد دانش آموزی',
    placeholder: ' ',
    col: 'col-md-6 col-12'
  },
  {
    type: FormBuilderInputComponent,
    name: 'email',
    responseKey: 'email',
    label: 'ایمیل',
    col: 'col-md-6 col-12'
  },
  {
    type: FormBuilderDateComponent,
    name: 'birth_date',
    responseKey: 'birth_date',
    label: 'تاریخ تولد',
    col: 'col-md-6 col-12'
  },
  {
    type: 'input',
    name: 'address',
    responseKey: 'address',
    label: 'آدرس',
    inputType: 'textarea',
    col: 'col-md-12'
  },
  {
    type: FormBuilderSelectClassesComponent,
    name: 'class_ids',
    responseKey: 'class_ids',
    schoolId: currentSchoolManager.currentSchool.value?.id,
    label: 'کلاس ها',
    col: 'col-md-12'
  }
])
</script>
}
