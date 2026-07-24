<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useQuasar } from 'quasar'
import UserAPI from 'src/repositories/user'
import SchoolAPI from 'src/repositories/school'

const props = defineProps<{
  userId: number
  readonly?: boolean
}>()

const emit = defineEmits(['update'])

const $q = useQuasar()
const userAPI = new UserAPI()
const schoolApi = new SchoolAPI()

const userSchools = ref<any[]>([])
const schoolLoading = ref(false)
const selectedSchoolId = ref<number | null>(null)
const selectedSchoolRole = ref<string | null>(null)
const schoolOptions = ref<any[]>([])

const roleOptions = [
  { label: 'مدیر', value: 'admin' },
  { label: 'مدیر', value: 'manager' },
  { label: 'معلم', value: 'teacher' },
  { label: 'دانش‌آموز', value: 'student' },
  { label: 'کارمند', value: 'staff' }
]

const schoolColumns = [
  { name: 'code', required: true, label: 'کد', align: 'right' as const, field: 'code' },
  { name: 'name', required: true, label: 'نام مدرسه', align: 'right' as const, field: 'name' },
  { name: 'role', label: 'نقش در مدرسه', align: 'right' as const, field: 'pivot.role' }
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

async function loadUserSchools () {
  try {
    userSchools.value = await userAPI.getSchools(props.userId)
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
  if (!selectedSchoolId.value || !props.userId) {
    return
  }

  schoolLoading.value = true
  try {
    await userAPI.assignSchool(props.userId, selectedSchoolId.value, selectedSchoolRole.value || undefined)
    $q.notify({
      icon: 'check',
      message: 'مدرسه با موفقیت اضافه شد.',
      color: 'positive'
    })
    selectedSchoolId.value = null
    selectedSchoolRole.value = null
    await loadUserSchools()
    emit('update')
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
  if (!props.userId) {
    return
  }

  schoolLoading.value = true
  try {
    await userAPI.removeSchool(props.userId, schoolId)
    $q.notify({
      icon: 'check',
      message: 'مدرسه با موفقیت حذف شد.',
      color: 'positive'
    })
    await loadUserSchools()
    emit('update')
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

watch(() => props.userId, (newId) => {
  if (newId) {
    loadUserSchools()
  }
})

onMounted(() => {
  loadUserSchools()
  if (!props.readonly) {
    loadSchools()
  }
})
</script>

<template>
  <q-card>
    <q-card-section>
      <div class="text-subtitle1 q-mb-md">مدیریت مدارس کاربر</div>
      <div
        v-if="!readonly"
        class="row q-col-gutter-md items-end q-mb-md">
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
        :columns="readonly ? schoolColumns : [...schoolColumns, { name: 'actions', label: 'عملیات', align: 'center' as const, field: 'actions' }]"
        row-key="id"
        flat
        bordered>
        <template #body-cell-role="props">
          <q-td :props="props">
            {{ getRoleLabel(props.row.pivot?.role) }}
          </q-td>
        </template>
        <template
          v-if="!readonly"
          #body-cell-actions="props">
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
</template>

<style scoped lang="scss">
</style>
