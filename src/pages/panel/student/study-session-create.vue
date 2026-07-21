<template>
  <q-page class="q-pa-md">
    <div class="row items-center q-mb-lg">
      <div class="col">
        <h4 class="q-ma-none">ثبت ساعت مطالعه</h4>
      </div>
    </div>

    <q-card style="max-width: 700px; margin: 0 auto;">
      <q-card-section>
        <q-form @submit.prevent="onSubmit">
          <div class="row q-col-gutter-md">
            <div class="col-12">
              <q-select
                v-model="form.lesson_id"
                :options="lessonOptions"
                option-value="id"
                option-label="name"
                label="درس"
                outlined
                clearable
                emit-value
                map-options />
            </div>
            <div class="col-12 col-md-6">
              <q-input
                v-model="form.started_at"
                label="زمان شروع"
                outlined
                type="datetime-local" />
            </div>
            <div class="col-12 col-md-6">
              <q-input
                v-model="form.ended_at"
                label="زمان پایان"
                outlined
                type="datetime-local" />
            </div>
            <div class="col-12">
              <q-input
                v-model="form.notes"
                label="یادداشت"
                outlined
                type="textarea" />
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
              :to="{ name: 'Student.StudySessions.List' }" />
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
import { appApi } from 'src/boot/axios'
import { lesson } from 'src/repositories/lesson'

const router = useRouter()
const $q = useQuasar()
const saving = ref(false)
const lessonOptions = ref<any[]>([])

const form = reactive({
  lesson_id: null as number | null,
  started_at: new Date().toISOString().slice(0, 16),
  ended_at: null as string | null,
  notes: null as string | null
})

const onSubmit = async () => {
  saving.value = true
  try {
    await appApi.post('/student-portal/study-sessions', form)
    $q.notify({
      icon: 'check',
      message: 'ساعت مطالعه با موفقیت ثبت شد.',
      color: 'positive'
    })
    router.push({ name: 'Student.StudySessions.List' })
  } catch (error: any) {
    $q.notify({
      icon: 'error',
      message: 'خطا در ثبت ساعت مطالعه.',
      color: 'negative'
    })
  } finally {
    saving.value = false
  }
}

onMounted(async () => {
  try {
    const response = await lesson.index({ length: 100 })
    lessonOptions.value = response.data || []
  } catch (error: any) {
    console.error('Error loading lessons:', error)
  }
})
</script>
