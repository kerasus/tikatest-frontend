<template>
  <div class="academic-field-form-page">
    <q-card>
      <q-card-section>
        <div class="text-h6">افزودن رشته جدید</div>
      </q-card-section>

      <q-separator />

      <q-card-section>
        <q-form @submit.prevent="onSubmit">
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-6">
              <q-select
                v-model="form.school_id"
                :options="schoolOptions"
                option-value="id"
                option-label="name"
                label="مدرسه"
                outlined
                emit-value
                map-options
                clearable />
            </div>
            <div class="col-12 col-md-6">
              <q-input
                v-model="form.name"
                label="نام رشته *"
                outlined
                :rules="[value => !!value || 'نام رشته الزامی است']" />
            </div>
          </div>

          <div class="q-mt-md">
            <q-btn
              type="submit"
              color="primary"
              label="ثبت رشته"
              :loading="saving" />
            <q-btn
              flat
              label="انصراف"
              :to="{ name: 'Panel.AcademicField.List' }"
              class="q-ml-sm" />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import AcademicFieldAPI from 'src/repositories/academicField'
import SchoolAPI from 'src/repositories/school'
import type { SchoolType } from 'src/repositories/school'

const fieldApi = new AcademicFieldAPI()
const schoolApi = new SchoolAPI()
const router = useRouter()
const $q = useQuasar()

const saving = ref(false)

const form = reactive({
  school_id: null as number | null,
  name: null as string | null
})

const schoolOptions = ref<SchoolType[]>([])

onMounted(async () => {
  try {
    const result = await schoolApi.index({ length: 100 })
    schoolOptions.value = result.data
  } catch (error) {
    console.error('Error loading schools:', error)
  }
})

async function onSubmit () {
  saving.value = true
  try {
    await fieldApi.create(form as any)
    $q.notify({
      icon: 'check',
      message: 'رشته با موفقیت ثبت شد.',
      color: 'positive'
    })
    router.push({ name: 'Panel.AcademicField.List' })
  } catch (error) {
    $q.notify({
      icon: 'error',
      message: 'خطا در ثبت رشته.',
      color: 'negative'
    })
  } finally {
    saving.value = false
  }
}
</script>

<style lang="scss" scoped>
.academic-field-form-page {
  max-width: 700px;
  margin: 0 auto;
}
</style>
