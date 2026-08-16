<template>
  <q-page class="q-pa-md">
    <div class="row items-center q-mb-lg">
      <div class="col">
        <h4 class="q-ma-none">ویرایش تکلیف</h4>
      </div>
      <div class="col-auto">
        <q-btn
          flat
          label="انصراف"
          :to="{ name: 'Panel.Homework.Show', params: { id: routeId } }" />
      </div>
    </div>

    <div
      v-if="loading"
      class="text-center q-pa-lg">
      <q-spinner
        color="primary"
        size="100px" />
    </div>

    <q-form
      v-else
      @submit.prevent="onSubmit">
      <homework-detail-card
        v-model:homework="form"
        :editable="true"
        :class-options="classOptions" />

      <div class="q-mt-md">
        <q-btn
          type="submit"
          color="primary"
          label="ذخیره تغییرات"
          :loading="saving" />
        <q-btn
          flat
          label="انصراف"
          :to="{ name: 'Panel.Homework.Show', params: { id: routeId } }"
          class="q-ml-sm" />
      </div>
    </q-form>
  </q-page>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import HomeworkAPI from 'src/repositories/homework'
import LessonAPI from 'src/repositories/lesson'
import SchoolClassAPI from 'src/repositories/schoolClass'
import HomeworkDetailCard from 'src/components/homework/HomeworkDetailCard.vue'
import { useHomeworkValidation } from 'src/composables/useHomeworkValidation'
import type { HomeworkType } from 'src/repositories/homework'

const homeworkApi = new HomeworkAPI()
const lessonApi = new LessonAPI()
const schoolClassApi = new SchoolClassAPI()

const route = useRoute()
const router = useRouter()
const $q = useQuasar()

const routeId = computed(() => Number(route.params.id))

const { validate } = useHomeworkValidation()

const form = reactive({
  id: null as number | null,
  school_id: null as number | null,
  title: null as string | null,
  lesson_id: null as number | null,
  description: null as string | null,
  due_date: null as string | null,
  created_by: null as number | null,
  created_at: null as string | null,
  updated_at: null as string | null,
  deleted_at: null as string | null,
  academic_levels: [] as any[],
  classes: [] as any[],
  attachments: [] as any[]
})

const loading = ref(true)
const saving = ref(false)

const classOptions = ref<any[]>([])

async function loadClasses () {
  try {
    const result = await schoolClassApi.index({ length: 100 })
    classOptions.value = result.data
  } catch (error: any) {
    console.error('Error loading classes:', error)
  }
}

async function loadHomework () {
  loading.value = true
  try {
    const data = await homeworkApi.get(routeId.value)
    Object.assign(form, data)
  } catch (error: any) {
    $q.notify({
      icon: 'error',
      message: 'خطا در بارگذاری اطلاعات تکلیف.',
      color: 'negative'
    })
  } finally {
    loading.value = false
  }
}

async function onSubmit () {
  if (!validate(form)) {
    return
  }

  saving.value = true
  try {
    const fd = new FormData()

    fd.append('title', form.title || '')
    if (form.lesson_id) fd.append('lesson_id', String(form.lesson_id))
    if (form.description) fd.append('description', form.description)
    if (form.due_date) fd.append('due_date', form.due_date)

    if (form.academic_levels?.length > 0) {
      fd.append('academic_level_ids', JSON.stringify(form.academic_levels.map((l: any) => l.id)))
    }

    if (form.classes?.length > 0) {
      fd.append('class_ids', JSON.stringify(form.classes.map((c: any) => c.id)))
    }

    if (form.attachments?.length > 0) {
      const attachmentsPayload: any[] = []
      form.attachments.forEach((att, index) => {
        const meta = { ...att.content }
        delete meta.file
        attachmentsPayload.push(meta)
        if (att.content?.file) {
          fd.append(`attachments.${index}.file`, att.content.file)
        }
      })
      fd.append('attachments', JSON.stringify(attachmentsPayload))
    }

    await homeworkApi.update(routeId.value, fd)

    $q.notify({
      icon: 'check',
      message: 'تکلیف با موفقیت به‌روز شد.',
      color: 'positive'
    })
    router.push({ name: 'Panel.Homework.Show', params: { id: routeId.value } })
  } catch (error: any) {
    $q.notify({
      icon: 'error',
      message: 'خطا در به‌روزرسانی تکلیف.',
      color: 'negative'
    })
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  loadClasses()
  loadHomework()
})
</script>

<style lang="scss" scoped>
</style>
