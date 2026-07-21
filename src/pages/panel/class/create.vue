<template>
  <div class="class-form-page">
    <q-card>
      <q-card-section>
        <div class="text-h6">افزودن کلاس جدید</div>
      </q-card-section>

      <q-separator />

      <q-card-section>
        <q-form @submit.prevent="onSubmit">
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-6">
              <q-select
                v-model="form.field_id"
                :options="fieldOptions"
                option-value="id"
                option-label="name"
                label="رشته *"
                outlined
                emit-value
                map-options
                required
                @update:model-value="loadLevels" />
            </div>
            <div class="col-12 col-md-6">
              <q-select
                v-model="form.level_id"
                :options="levelOptions"
                option-value="id"
                option-label="name"
                label="پایه *"
                outlined
                emit-value
                map-options
                required />
            </div>
            <div class="col-12 col-md-6">
              <q-input
                v-model="form.name"
                label="نام کلاس *"
                outlined
                required />
            </div>
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
          </div>

          <div class="q-mt-md">
            <q-btn
              type="submit"
              color="primary"
              label="ثبت کلاس"
              :loading="saving" />
            <q-btn
              flat
              label="انصراف"
              :to="{ name: 'Panel.Class.List' }"
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
import SchoolClassAPI from 'src/repositories/schoolClass'
import AcademicFieldAPI from 'src/repositories/academicField'
import AcademicLevelAPI from 'src/repositories/academicLevel'
import SchoolAPI from 'src/repositories/school'

const schoolClassApi = new SchoolClassAPI()
const academicFieldApi = new AcademicFieldAPI()
const academicLevelApi = new AcademicLevelAPI()
const schoolApi = new SchoolAPI()

const router = useRouter()
const $q = useQuasar()

const form = reactive({
  name: null,
  field_id: null,
  level_id: null,
  school_id: null
})

const fieldOptions = ref<any[]>([])
const levelOptions = ref<any[]>([])
const schoolOptions = ref<any[]>([])
const saving = ref(false)

async function loadFields () {
  const result = await academicFieldApi.index({ length: 100 })
  fieldOptions.value = result.data
}

async function loadLevels () {
  if (form.field_id) {
    const result = await academicLevelApi.index({ field_id: form.field_id, length: 100 })
    levelOptions.value = result.data
  } else {
    levelOptions.value = []
  }
}

async function loadSchools () {
  const result = await schoolApi.index({ length: 100 })
  schoolOptions.value = result.data
}

async function onSubmit () {
  saving.value = true
  try {
    await schoolClassApi.create(form as any)
    $q.notify({
      icon: 'check',
      message: 'کلاس با موفقیت ثبت شد.',
      color: 'positive'
    })
    router.push({ name: 'Panel.Class.List' })
  } catch (error) {
    $q.notify({
      icon: 'error',
      message: 'خطا در ثبت کلاس.',
      color: 'negative'
    })
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  loadFields()
  loadSchools()
})
</script>

<style lang="scss" scoped>
.class-form-page {
  max-width: 700px;
  margin: 0 auto;
}
</style>
