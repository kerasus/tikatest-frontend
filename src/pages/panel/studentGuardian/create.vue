<template>
  <q-page class="q-pa-md">
    <div class="row items-center q-mb-lg">
      <div class="col">
        <h4 class="q-ma-none">ثبت وصی نگهبان دانش‌آموزی</h4>
      </div>
    </div>

    <q-card style="max-width: 600px; margin: 0 auto;">
      <q-card-section>
        <q-form @submit.prevent="onSubmit">
          <div class="row q-col-gutter-md">
            <div class="col-12">
              <q-select
                v-model="form.user_id"
                :options="userOptions"
                option-value="id"
                option-label="full_name"
                label="وصی *"
                outlined
                clearable
                emit-value
                map-options
                :rules="[val => !!val || 'انتخاب وصی الزامی است']" />
            </div>
            <div class="col-12">
              <q-select
                v-model="form.student_profile_id"
                :options="profileOptions"
                option-value="id"
                option-label="user.full_name"
                label="دانش‌آموز *"
                outlined
                clearable
                emit-value
                map-options
                :rules="[val => !!val || 'انتخاب دانش‌آموز الزامی است']" />
            </div>
            <div class="col-12">
              <q-select
                v-model="form.relationship_type"
                :options="relationshipOptions"
                label="نوع رابطه *"
                outlined
                clearable
                emit-value
                map-options
                :rules="[val => !!val || 'نوع رابطه الزامی است']" />
            </div>
            <div class="col-12">
              <q-input
                v-model="form.job"
                label="شغل"
                outlined
                clearable />
            </div>
            <div class="col-12">
              <q-checkbox
                v-model="form.is_primary_contact"
                label="تماس اصلی" />
            </div>
          </div>

          <div class="q-mt-lg">
            <q-btn
              type="submit"
              color="primary"
              label="ثبت"
              :loading="saving"
              class="q-ml-sm" />
            <q-btn
              flat
              label="انصراف"
              :to="{ name: 'Panel.StudentGuardian.List' }" />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { studentGuardian } from 'src/repositories/studentGuardian'
import { user } from 'src/repositories/user'
import { studentProfile } from 'src/repositories/studentProfile'

const router = useRouter()
const $q = useQuasar()

const saving = ref(false)
const userOptions = ref<any[]>([])
const profileOptions = ref<any[]>([])

const relationshipOptions = [
  { label: 'پدر', value: 'father' },
  { label: 'مادر', value: 'mother' },
  { label: 'سایر', value: 'guardian' }
]

const form = reactive({
  user_id: null as number | null,
  student_profile_id: null as number | null,
  relationship_type: null as string | null,
  job: null as string | null,
  is_primary_contact: false
})

const loadUsers = async () => {
  try {
    const response = await user.index({ length: 1000 })
    userOptions.value = response.data || []
  } catch (error: any) {
    console.error('Error loading users:', error)
  }
}

const loadProfiles = async () => {
  try {
    const response = await studentProfile.index({ length: 1000 })
    profileOptions.value = response.data || []
  } catch (error: any) {
    console.error('Error loading profiles:', error)
  }
}

const onSubmit = async () => {
  if (!form.user_id || !form.student_profile_id || !form.relationship_type) {
    $q.notify({ type: 'negative', message: 'همه فیلدها الزامی هستند' })
    return
  }

  saving.value = true
  try {
    await studentGuardian.create({
      user_id: form.user_id,
      student_profile_id: form.student_profile_id,
      relationship_type: form.relationship_type,
      job: form.job,
      is_primary_contact: form.is_primary_contact
    } as any)
    $q.notify({
      icon: 'check',
      message: 'وصی نگهبان با موفقیت ثبت شد.',
      color: 'positive'
    })
    router.push({ name: 'Panel.StudentGuardian.List' })
  } catch (error: any) {
    $q.notify({
      icon: 'error',
      message: 'خطا در ثبت وصی نگهبان.',
      color: 'negative'
    })
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  loadUsers()
  loadProfiles()
})
</script>
