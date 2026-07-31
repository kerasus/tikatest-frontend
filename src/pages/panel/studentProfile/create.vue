<template>
  <q-page class="q-pa-md">
    <div class="row items-center q-mb-lg">
      <div class="col">
        <h4 class="q-ma-none">ثبت پروفایل دانش‌آموزی</h4>
      </div>
    </div>

    <q-card style="max-width: 600px; margin: 0 auto;">
      <q-card-section>
        <q-form @submit.prevent="onSubmit">
          <div class="row q-col-gutter-md">
            <div class="col-12">
              <q-select
                v-model="form.user_id"
                :options="studentOptions"
                option-value="id"
                option-label="full_name"
                label="دانش‌آموز *"
                outlined
                clearable
                emit-value
                map-options
                :rules="[val => !!val || 'انتخاب دانش‌آموز الزامی است']" />
            </div>
            <div class="col-12">
              <q-input
                v-model="form.code"
                label="کد دانش‌آموزی"
                outlined
                clearable />
            </div>
            <div class="col-12">
              <q-input
                v-model.number="form.xp"
                label="امتیاز XP"
                outlined
                type="number"
                min="0"
                step="1" />
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
              :to="{ name: 'Panel.StudentProfile.List' }" />
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
import { studentProfile } from 'src/repositories/studentProfile'
import { user } from 'src/repositories/user'

const router = useRouter()
const $q = useQuasar()

const saving = ref(false)
const studentOptions = ref<any[]>([])

const form = reactive({
  user_id: null as number | null,
  code: null as string | null,
  xp: 0
})

const loadStudents = async () => {
  try {
    const response = await user.index({ length: 1000 })
    studentOptions.value = response.data || []
  } catch (error: any) {
    console.error('Error loading students:', error)
  }
}

const onSubmit = async () => {
  if (!form.user_id) {
    $q.notify({ type: 'negative', message: 'دانش‌آموز الزامی است' })
    return
  }

  saving.value = true
  try {
    await studentProfile.create({
      user_id: form.user_id,
      code: form.code,
      xp: form.xp
    } as any)
    $q.notify({
      icon: 'check',
      message: 'پروفایل با موفقیت ثبت شد.',
      color: 'positive'
    })
    router.push({ name: 'Panel.StudentProfile.List' })
  } catch (error: any) {
    $q.notify({
      icon: 'error',
      message: 'خطا در ثبت پروفایل.',
      color: 'negative'
    })
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  loadStudents()
})
</script>
