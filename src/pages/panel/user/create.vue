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
import UserAPI from 'src/repositories/user'
import FormBuilderInput from 'src/components/controls/formBuilderCustomInput/FormBuilderInput.vue'

const userAPI = new UserAPI()

const FormBuilderInputComponent = shallowRef(FormBuilderInput)

const api = ref(userAPI.endpoints.base)
const label = ref('کاربر جدید')
const indexRouteName = ref('Panel.User.List')
const showRouteName = ref('Panel.User.Show')
const entityIdKey = ref('id')
const entityParamKey = ref('id')
const inputs = ref([
  {
    type: FormBuilderInputComponent,
    name: 'first_name',
    responseKey: 'first_name',
    label: 'نام',
    placeholder: ' ',
    col: 'col-md-3 col-12'
  },
  {
    type: FormBuilderInputComponent,
    name: 'last_name',
    responseKey: 'last_name',
    label: 'نام خانوادگی',
    placeholder: ' ',
    col: 'col-md-3 col-12'
  },
  {
    type: FormBuilderInputComponent,
    name: 'employee_code',
    responseKey: 'employee_code',
    label: 'کد پرسنلی',
    placeholder: ' ',
    col: 'col-md-3 col-12'
  },
  { type: 'separator', name: 'space', size: '0', col: 'col-md-12' },
  {
    type: FormBuilderInputComponent,
    name: 'username',
    responseKey: 'username',
    label: 'نام کاربری',
    placeholder: ' ',
    col: 'col-md-3 col-12'
  },
  {
    type: FormBuilderInputComponent,
    name: 'password',
    responseKey: 'password',
    label: 'کلمه عبور',
    placeholder: ' ',
    col: 'col-md-3 col-12'
  },
  {
    type: FormBuilderInputComponent,
    name: 'mobile',
    responseKey: 'mobile',
    label: 'تلفن همراه',
    placeholder: ' ',
    col: 'col-md-3 col-12'
  },
  {
    type: FormBuilderInputComponent,
    name: 'email',
    responseKey: 'email',
    label: 'ایمیل',
    placeholder: ' ',
    col: 'col-md-3 col-12'
  }
])
</script>
