<template>
  <entity-create
    v-model:value="inputs"
    :title="label"
    :api="api"
    :entity-id-key="entityIdKey"
    :entity-param-key="entityParamKey"
    :index-route-name="indexRouteName"
    :show-route-name="showRouteName"
    :before-send-data="beforeSendData"
    :show-expand-button="false" />
</template>

<script setup lang="ts">
import { ref, shallowRef } from 'vue'
import { EntityCreate } from 'quasar-crud'
import StudentAPI from 'src/repositories/student'
import { FormBuilderAssist } from 'quasar-form-builder'
import { useCurrentSchool } from 'src/composables/useCurrentSchool'
import FormBuilderDate from 'src/components/controls/formBuilderCustomInput/FormBuilderDate.vue'
import FormBuilderInput from 'src/components/controls/formBuilderCustomInput/FormBuilderInput.vue'
import FormBuilderSelectEnrollments from 'src/components/controls/formBuilderCustomInput/FormBuilderSelectEnrollments.vue'

const studentAPI = new StudentAPI()
const currentSchoolManager = useCurrentSchool()

type localInputType = {
  type: any
  name: string
  responseKey: string
  col?: string
  label?: string
  placeholder?: string
  inputType?: string
  schoolId?: number
  required?: boolean
  sendNull?: boolean
  value?: any
}

const FormBuilderDateComponent = shallowRef(FormBuilderDate)
const FormBuilderInputComponent = shallowRef(FormBuilderInput)
const FormBuilderSelectEnrollmentsComponent = shallowRef(FormBuilderSelectEnrollments)

const api = ref(studentAPI.endpoints.base)
const label = ref('ثبت دانش آموز جدید')
const indexRouteName = ref('Panel.Student.List')
const showRouteName = ref('Panel.Student.Show')
const entityIdKey = ref('id')
const entityParamKey = ref('id')
const inputs = ref<localInputType[]>([
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
    type: FormBuilderSelectEnrollmentsComponent,
    name: 'enrollments',
    responseKey: 'enrollments',
    schoolId: currentSchoolManager.currentSchool.value?.id,
    label: 'کلاس ها',
    col: 'col-md-12'
  }
])

function beforeSendData (formData) {
  if (!(formData instanceof FormData)) {
    return
  }
  const enrollmentsInput = FormBuilderAssist.getInputsByName(inputs.value, 'enrollments')
  const enrollments = enrollmentsInput.value
  formData.delete('enrollments[]')
  enrollments.forEach((item, index) => {
    formData.append(`enrollments[${index}][class_id]`, item.class_id.toString())
    formData.append(`enrollments[${index}][term_id]`, item.term_id.toString())
  })
}

function getFormData (): FormData {
  const isFile = (file) => {
    return file instanceof File
  }
  const formData = new FormData()
  inputs.value.forEach((item) => {
    if (
      item.type.toString().toLowerCase() === 'file' &&
      (
        (!isFile(item.value) && !item.sendNull) ||
        (!isFile(item.value) && item.sendNull && item.value !== null)
      )
    ) {
      return
    }

    if (Array.isArray(item.value)) {
      item.value.forEach((arrayValue) => {
        if (arrayValue !== null && typeof arrayValue !== 'undefined') {
          formData.append(item.name + '[]', arrayValue)
        }
      })
    } else if (typeof item.value === 'object') {
      formData.append(item.name + '[]', JSON.stringify(item.value))
    } else {
      if (item.value !== null && typeof item.value !== 'undefined') {
        formData.append(item.name, item.value)
      }
    }
  })

  return formData
}
</script>
