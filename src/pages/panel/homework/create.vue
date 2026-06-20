<template>
  <div class="homework-form-page">
    <q-card>
      <q-card-section>
        <div class="text-h6">ایجاد تکلیف جدید</div>
      </q-card-section>

      <q-separator />

      <q-card-section>
        <q-form @submit.prevent="onSubmit">
          <div class="row q-col-gutter-md">
            <div class="col-12">
              <q-input v-model="form.title" label="عنوان تکلیف *" outlined required />
            </div>
            <div class="col-12 col-md-6">
              <q-select
                v-model="form.lesson_id"
                :options="lessonOptions"
                option-value="id"
                option-label="name"
                label="درس *"
                outlined
                emit-value
                map-options
                required />
            </div>
            <div class="col-12 col-md-6">
              <q-select
                v-model="form.class_id"
                :options="classOptions"
                option-value="id"
                option-label="name"
                label="کلاس *"
                outlined
                emit-value
                map-options
                required />
            </div>
            <div class="col-12">
              <q-input v-model="form.description" label="توضیحات تکلیف" outlined type="textarea" />
            </div>
            <div class="col-12 col-md-6">
              <q-input v-model="form.due_date" label="موعد تحویل" outlined type="datetime-local" />
            </div>
          </div>

          <div class="q-mt-md">
            <q-btn type="submit" color="primary" label="ایجاد تکلیف" :loading="saving" />
            <q-btn flat label="انصراف" :to="{ name: 'Panel.Homework.List' }" class="q-ml-sm" />
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
import HomeworkAPI from 'src/repositories/homework'
import LessonAPI from 'src/repositories/lesson'
import SchoolClassAPI from 'src/repositories/schoolClass'

const router = useRouter()
const $q = useQuasar()

const form = reactive({
  title: null,
  description: null,
  lesson_id: null,
  class_id: null,
  due_date: null,
  attachment: null
})

const lessonOptions = ref<any[]>([])
const classOptions = ref<any[]>([])
const saving = ref(false)

async function loadLessons () {
  const result = await LessonAPI.prototype.index({ length: 100 })
  lessonOptions.value = result.data
}

async function loadClasses () {
  const result = await SchoolClassAPI.prototype.index({ length: 100 })
  classOptions.value = result.data
}

async function onSubmit () {
  saving.value = true
  try {
    await HomeworkAPI.prototype.create(form as any)
    $q.notify({
      icon: 'check',
      message: 'تکلیف با موفقیت ایجاد شد.',
      color: 'positive'
    })
    router.push({ name: 'Panel.Homework.List' })
  } catch (error) {
    $q.notify({
      icon: 'error',
      message: 'خطا در ایجاد تکلیف.',
      color: 'negative'
    })
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  loadLessons()
  loadClasses()
})
</script>

<style lang="scss" scoped>
.homework-form-page {
  max-width: 700px;
  margin: 0 auto;
}
</style>
