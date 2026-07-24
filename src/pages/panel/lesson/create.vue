<template>
  <div class="lesson-form-page">
    <q-card>
      <q-card-section>
        <div class="text-h6">افزودن درس جدید</div>
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
                label="نام درس *"
                outlined
                :rules="[value => !!value || 'نام الزامی است']" />
            </div>
            <div class="col-12 col-md-6">
              <q-select
                v-model="form.class_id"
                :options="classOptions"
                option-value="id"
                option-label="name"
                label="کلاس"
                outlined
                emit-value
                map-options
                clearable />
            </div>
            <div class="col-12 col-md-6">
              <q-input
                v-model="form.order"
                label="ترتیب نمایش در کارنامه"
                outlined
                type="number"
                hint="ترتیب نمایش درس در کارنامه" />
            </div>
            <div class="col-12 col-md-6">
              <q-input
                v-model="form.coefficient"
                label="ضریب در کارنامه"
                outlined
                type="number"
                step="0.01"
                hint="ضریب جهت محاسبه میانگین نمره در کارنامه"
                :rules="[value => value !== null && value !== '' || 'ضریب الزامی است']" />
            </div>
          </div>

          <div class="q-mt-md">
            <q-btn
              type="submit"
              color="primary"
              label="ثبت درس"
              :loading="saving" />
            <q-btn
              flat
              label="انصراف"
              :to="{ name: 'Panel.Lesson.List' }"
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
import LessonAPI from 'src/repositories/lesson'
import SchoolAPI from 'src/repositories/school'
import ClassAPI from 'src/repositories/schoolClass'
import type { SchoolType } from 'src/repositories/school'
import type { SchoolClassType } from 'src/repositories/schoolClass'

const lessonApi = new LessonAPI()
const schoolApi = new SchoolAPI()
const classApi = new ClassAPI()
const router = useRouter()
const $q = useQuasar()

const saving = ref(false)

const form = reactive({
  school_id: null as number | null,
  name: null as string | null,
  class_id: null as number | null,
  order: 0 as number | null,
  coefficient: 1 as number | null
})

const schoolOptions = ref<SchoolType[]>([])
const classOptions = ref<SchoolClassType[]>([])

onMounted(async () => {
  try {
    const schoolResult = await schoolApi.index({ length: 100 })
    schoolOptions.value = schoolResult.data
  } catch (error) {
    console.error('Error loading schools:', error)
  }
  try {
    const classResult = await classApi.index({ length: 100 })
    classOptions.value = classResult.data
  } catch (error) {
    console.error('Error loading classes:', error)
  }
})

async function onSubmit () {
  saving.value = true
  try {
    await lessonApi.create(form as any)
    $q.notify({
      icon: 'check',
      message: 'درس با موفقیت ثبت شد.',
      color: 'positive'
    })
    router.push({ name: 'Panel.Lesson.List' })
  } catch (error) {
    $q.notify({
      icon: 'error',
      message: 'خطا در ثبت درس.',
      color: 'negative'
    })
  } finally {
    saving.value = false
  }
}
</script>

<style lang="scss" scoped>
.lesson-form-page {
  max-width: 700px;
  margin: 0 auto;
}
</style>
