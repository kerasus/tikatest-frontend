<template>
  <q-page class="q-pa-md">
    <div class="row items-center q-mb-lg">
      <div class="col">
        <h4 class="q-ma-none">ایجاد تکلیف جدید</h4>
      </div>
      <div class="col-auto">
        <q-btn
          flat
          label="انصراف"
          :to="{ name: 'Panel.Homework.List' }" />
      </div>
    </div>

    <homework-detail-card
      v-model:homework="homeworkForm"
      :editable="true" />

    <div class="row q-mt-md">
      <div class="col-12">
        <q-btn
          color="primary"
          label="ایجاد تکلیف"
          :loading="saving"
          @click="onSubmit" />
        <q-btn
          flat
          label="انصراف"
          :to="{ name: 'Panel.Homework.List' }"
          class="q-ml-sm" />
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import HomeworkAPI from 'src/repositories/homework'
import HomeworkDetailCard from 'src/components/homework/HomeworkDetailCard.vue'
import { buildHomeworkFormData, createEmptyHomework, validateHomework } from 'src/composables/useHomeworkForm'

const homeworkApi = new HomeworkAPI()
const router = useRouter()
const $q = useQuasar()

const homeworkForm = ref(createEmptyHomework())
const saving = ref(false)

async function onSubmit () {
  if (!validateHomework(homeworkForm.value)) {
    $q.notify({ icon: 'warning', message: 'عنوان و درس الزامی هستند.', color: 'warning' })
    return
  }

  saving.value = true
  try {
    const fd = buildHomeworkFormData(homeworkForm.value)
    await homeworkApi.create(fd)

    $q.notify({
      icon: 'check',
      message: 'تکلیف با موفقیت ایجاد شد.',
      color: 'positive'
    })
    router.push({ name: 'Panel.Homework.List' })
  } catch (error: any) {
    $q.notify({
      icon: 'error',
      message: 'خطا در ایجاد تکلیف.',
      color: 'negative'
    })
  } finally {
    saving.value = false
  }
}
</script>
