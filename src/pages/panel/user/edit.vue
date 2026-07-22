<template>
  <entity-edit
    :key="entityEditKey"
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
  <q-card>
    <q-card-section>
      <div class="text-subtitle1 q-mb-md">مدیریت مدارس کاربر</div>
      <div class="row q-col-gutter-md items-end q-mb-md">
        <div class="col-12 col-md-4">
          <q-select
            v-model="selectedSchoolId"
            :options="schoolOptions"
            option-value="id"
            option-label="name"
            label="انتخاب مدرسه"
            outlined
            emit-value
            map-options
            clearable />
        </div>
        <div class="col-12 col-md-3">
          <q-select
            v-model="selectedSchoolRole"
            :options="roleOptions"
            label="نقش در مدرسه"
            outlined
            emit-value
            map-options
            clearable />
        </div>
        <div class="col-12 col-md-2">
          <q-btn
            color="primary"
            icon="add"
            label="افزودن"
            :loading="schoolLoading"
            @click="assignSchool" />
        </div>
      </div>

      <q-table
        v-if="userSchools.length > 0"
        :rows="userSchools"
        :columns="schoolColumns"
        row-key="id"
        flat
        bordered>
        <template #body-cell-role="props">
          <q-td :props="props">
            {{ getRoleLabel(props.row.pivot?.role) }}
          </q-td>
        </template>
        <template #body-cell-actions="props">
          <q-td :props="props">
            <q-btn
              flat
              round
              dense
              color="negative"
              icon="delete"
              @click="removeSchool(props.row.id)" />
          </q-td>
        </template>
      </q-table>
      <div
        v-else
        class="text-grey-7">
        این کاربر به هیچ مدرسه‌ای متصل نیست.
      </div>
    </q-card-section>
  </q-card>
  <q-separator class="q-my-md" />
  <div class="row q-col-gutter-md">
    <div class="col-md-6 col-12">
      <entity-create
        ref="entityCreateRef"
        v-model:value="resetPasswordInputs"
        :title="resetPasswordLabel"
        :api="resetPasswordApi"
        :show-save-button="false"
        :show-close-button="false"
        :show-expand-button="false">
        <template #after-form-builder>
          <q-btn
            color="primary"
            label="تغییر کلمه عبور"
            :loading="resetPasswordLoading"
            class="q-mt-md"
            @click="resetPassword" />
        </template>
      </entity-create>
    </div>
    <div class="col-md-6 col-12">
      <q-card>
        <q-card-section>
          <role-list
            v-if="userData"
            :user="userData"
            :edit-mode="true"
            @change="onChangeUserRole" />
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar'
import { computed, ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import RoleList from 'src/components/roleList.vue'
import { EntityEdit, EntityCreate } from 'quasar-crud'
import UserAPI, { type UserType } from 'src/repositories/user'
import SchoolAPI from 'src/repositories/school'

const $q = useQuasar()
const route = useRoute()
const userAPI = new UserAPI()
const schoolApi = new SchoolAPI()

const entityCreateRef = ref()
const resetPasswordLoading = ref(false)
const entityEditKey = ref(Date.now())
const userData = ref<UserType | null>(null)
const userSchools = ref<any[]>([])
const schoolLoading = ref(false)
const selectedSchoolId = ref<number | null>(null)
const selectedSchoolRole = ref<string | null>(null)
const schoolOptions = ref<any[]>([])

const userId = computed(() => (route.params.id ? parseInt(route.params.id?.toString()) : 0))
const api = ref(userAPI.endpoints.byId(userId.value))
const label = ref('مشاهده کاربر')
const indexRouteName = ref('Panel.User.List')
const showRouteName = ref('Panel.User.Show')
const entityIdKey = ref('id')
const entityParamKey = ref('id')
const inputs = ref([
  {
    type: 'hidden',
    name: 'id',
    responseKey: 'id'
  },
  {
    type: 'input',
    name: 'firstname',
    responseKey: 'firstname',
    label: 'نام',
    placeholder: ' ',
    col: 'col-md-3 col-12'
  },
  {
    type: 'input',
    name: 'lastname',
    responseKey: 'lastname',
    label: 'نام خانوادگی',
    placeholder: ' ',
    col: 'col-md-3 col-12'
  },
  {
    type: 'input',
    name: 'employee_code',
    responseKey: 'employee_code',
    label: 'کد پرسنلی',
    placeholder: ' ',
    col: 'col-md-3 col-12'
  },
  { type: 'separator', name: 'space', size: '0', col: 'col-md-12' },
  {
    type: 'input',
    name: 'username',
    responseKey: 'username',
    label: 'نام کاربری',
    placeholder: ' ',
    col: 'col-md-3 col-12'
  },
  {
    type: 'input',
    name: 'mobile',
    responseKey: 'mobile',
    label: 'تلفن همراه',
    placeholder: ' ',
    col: 'col-md-3 col-12'
  },
  {
    type: 'input',
    name: 'email',
    responseKey: 'email',
    label: 'ایمیل',
    placeholder: ' ',
    col: 'col-md-3 col-12'
  }
])

const resetPasswordApi = ref(userAPI.endpoints.resetPassword(userId.value))
const resetPasswordLabel = ref('تغییر کلمه عبور')
const resetPasswordInputs = ref([
  {
    type: 'input',
    name: 'new_password',
    label: 'کلمه عبور جدید',
    placeholder: ' ',
    col: 'col-md-6 col-12'
  },
  {
    type: 'input',
    name: 'new_password_confirmation',
    label: 'تکرار کلمه عبور جدید',
    placeholder: ' ',
    col: 'col-md-6 col-12'
  }
])

const schoolColumns = [
  { name: 'code', required: true, label: 'کد', align: 'right' as const, field: 'code' },
  { name: 'name', required: true, label: 'نام مدرسه', align: 'right' as const, field: 'name' },
  { name: 'role', label: 'نقش در مدرسه', align: 'right' as const, field: 'pivot.role' },
  { name: 'actions', label: 'عملیات', align: 'center' as const, field: 'actions' }
]

const roleOptions = [
  { label: 'مدیر', value: 'admin' },
  { label: 'مدیر', value: 'manager' },
  { label: 'معلم', value: 'teacher' },
  { label: 'دانش‌آموز', value: 'student' },
  { label: 'کارمند', value: 'staff' }
]

function getRoleLabel (role: string | undefined | null): string {
  switch (role) {
    case 'admin':
      return 'مدیر'
    case 'manager':
      return 'مدیر'
    case 'teacher':
      return 'معلم'
    case 'student':
      return 'دانش‌آموز'
    case 'staff':
      return 'کارمند'
    default:
      return role || '-'
  }
}

function afterLoadInputData (data: UserType) {
  userData.value = data
  if (data.id) {
    loadUserSchools(data.id)
  }
}

async function loadUserSchools (userId: number) {
  try {
    userSchools.value = await userAPI.getSchools(userId)
  } catch (error) {
    console.error('Error loading user schools:', error)
  }
}

async function loadSchools () {
  try {
    const result = await schoolApi.index({ length: 100 })
    schoolOptions.value = result.data
  } catch (error) {
    console.error('Error loading schools:', error)
  }
}

async function assignSchool () {
  if (!selectedSchoolId.value || !userId.value) {
    return
  }

  schoolLoading.value = true
  try {
    await userAPI.assignSchool(userId.value, selectedSchoolId.value, selectedSchoolRole.value || undefined)
    $q.notify({
      icon: 'check',
      message: 'مدرسه با موفقیت اضافه شد.',
      color: 'positive'
    })
    selectedSchoolId.value = null
    selectedSchoolRole.value = null
    loadUserSchools(userId.value)
  } catch (error) {
    $q.notify({
      icon: 'error',
      message: 'خطا در افزودن مدرسه.',
      color: 'negative'
    })
  } finally {
    schoolLoading.value = false
  }
}

async function removeSchool (schoolId: number) {
  if (!userId.value) {
    return
  }

  schoolLoading.value = true
  try {
    await userAPI.removeSchool(userId.value, schoolId)
    $q.notify({
      icon: 'check',
      message: 'مدرسه با موفقیت حذف شد.',
      color: 'positive'
    })
    loadUserSchools(userId.value)
  } catch (error) {
    $q.notify({
      icon: 'error',
      message: 'خطا در حذف مدرسه.',
      color: 'negative'
    })
  } finally {
    schoolLoading.value = false
  }
}

function onChangeUserRole () {
  entityEditKey.value = Date.now()
}

async function resetPassword () {
  resetPasswordLoading.value = true
  try {
    const result = await entityCreateRef.value.createEntity(false)
    $q.notify({
      message: result.data.message,
      type: 'positive'
    })
  } finally {
    resetPasswordLoading.value = false
  }
}

onMounted(() => {
  loadSchools()
})
</script>
