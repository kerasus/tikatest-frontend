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

    <q-form @submit.prevent="onSubmit">
      <homework-detail-card
        v-model:homework="form"
        :editable="true" />

      <div class="q-mt-md">
        <q-btn
          type="submit"
          color="primary"
          label="ایجاد تکلیف"
          :loading="saving" />
        <q-btn
          flat
          label="انصراف"
          :to="{ name: 'Panel.Homework.List' }"
          class="q-ml-sm" />
      </div>
    </q-form>
  </q-page>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import HomeworkAPI, {
  type HomeworkAttachmentType,
  type HomeworkType
} from 'src/repositories/homework'
import HomeworkDetailCard from 'src/components/homework/HomeworkDetailCard.vue'
import { useHomeworkValidation } from 'src/composables/useHomeworkValidation'

const homeworkApi = new HomeworkAPI()

const router = useRouter()
const $q = useQuasar()

const { validate } = useHomeworkValidation()

const form = reactive<HomeworkType>({
  ...homeworkApi.defaultObject,
  academic_level_ids: [],
  class_ids: [],
  attachments: []
})

const saving = ref(false)

function appendAttachments (formData: FormData, attachments: HomeworkAttachmentType[]) {
  let payloadIndex = 0

  attachments.forEach((attachment) => {
    const content = attachment.content
    if (!content) return

    const key = `attachments[${payloadIndex}]`
    formData.append(`${key}[type]`, content.type)

    if (content.body) {
      formData.append(`${key}[body]`, content.body)
    }
    if (content.path) {
      formData.append(`${key}[path]`, content.path)
    }
    if (content.file) {
      formData.append(`${key}[file]`, content.file)
    }

    payloadIndex += 1
  })
}

async function onSubmit () {
  if (!validate(form)) {
    return
  }

  saving.value = true
  try {
    const fd = new FormData()

    fd.append('title', form.title?.trim() || '')
    if (form.lesson_id !== null) fd.append('lesson_id', String(form.lesson_id))
    if (form.description) fd.append('description', form.description)
    if (form.due_date) fd.append('due_date', form.due_date)
    if (form.created_by !== null) fd.append('created_by', String(form.created_by))

    if (form.academic_level_ids?.length) {
      fd.append('academic_level_ids', JSON.stringify(form.academic_level_ids))
    }

    if (form.class_ids?.length) {
      fd.append('class_ids', JSON.stringify(form.class_ids))
    }

    if (form.attachments?.length) {
      appendAttachments(fd, form.attachments)
    }

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

<style lang="scss" scoped>
.homework-form-page {
  max-width: 800px;
  margin: 0 auto;
}
</style>
