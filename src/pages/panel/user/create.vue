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
import { ref, shallowRef, watch } from 'vue'
import { useUser } from 'src/stores/user'
import { EntityCreate } from 'quasar-crud'
import UserAPI from 'src/repositories/user'
import { useCurrentSchool } from 'src/composables/useCurrentSchool'
import FormBuilderInput from 'src/components/controls/formBuilderCustomInput/FormBuilderInput.vue'

const userAPI = new UserAPI()
const userStoreManager = useUser()
const currentSchoolManager = useCurrentSchool()

const FormBuilderInputComponent = shallowRef(FormBuilderInput)

const api = ref(userAPI.endpoints.base)
const label = ref('کاربر جدید')
const indexRouteName = ref('Panel.User.List')
const showRouteName = ref('Panel.User.Show')
const entityIdKey = ref('id')
const entityParamKey = ref('id')
const inputs = ref([
  {
    type: 'hidden',
    name: 'school_id',
    value: null,
    col: 'col-12'
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
    type: FormBuilderInputComponent,
    name: 'first_name',
    responseKey: 'first_name',
    label: 'نام',
    placeholder: ' ',
    col: 'col-md-4 col-12'
  },
  {
    type: FormBuilderInputComponent,
    name: 'last_name',
    responseKey: 'last_name',
    label: 'نام خانوادگی',
    placeholder: ' ',
    col: 'col-md-4 col-12'
  },
  {
    type: FormBuilderInputComponent,
    name: 'mobile',
    responseKey: 'mobile',
    label: 'تلفن همراه',
    placeholder: ' ',
    col: 'col-md-4 col-12'
  },
  { type: 'separator', name: 'space', size: '0', col: 'col-md-12' },
  {
    type: FormBuilderInputComponent,
    name: 'username',
    responseKey: 'username',
    label: 'نام کاربری',
    placeholder: ' ',
    col: 'col-md-4 col-12'
  },
  {
    type: FormBuilderInputComponent,
    name: 'password',
    responseKey: 'password',
    label: 'کلمه عبور',
    placeholder: ' ',
    col: 'col-md-4 col-12'
  },
  {
    type: FormBuilderInputComponent,
    name: 'email',
    responseKey: 'email',
    label: 'ایمیل',
    placeholder: ' ',
    col: 'col-md-4 col-12'
  }
])

watch(
  [
    () => userStoreManager.isAdmin,
    () => currentSchoolManager.currentSchool.value?.id
  ],
  ([isAdmin, schoolId]) => {
    const schoolInput = inputs.value.find((item) => item.name === 'school_id')
    if (schoolInput) {
      schoolInput.value = isAdmin ? null : schoolId ?? null
    }
  },
  { immediate: true }
)
</script>
