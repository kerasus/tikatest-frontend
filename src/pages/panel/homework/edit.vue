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

    <q-form v-else @submit.prevent="onSubmit">
      <div class="row q-col-gutter-md">
        <div class="col-12">
          <q-input
            v-model="form.title"
            label="عنوان تکلیف *"
            outlined
            required />
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
            label="کلاس (اختیاری)"
            outlined
            emit-value
            map-options
            clearable />
        </div>

        <div class="col-12">
          <q-input
            v-model="form.description"
            label="توضیحات تکلیف"
            outlined
            type="textarea" />
        </div>

        <div class="col-12 col-md-6">
          <q-input
            v-model="form.due_date"
            label="موعد تحویل"
            outlined
            type="date" />
        </div>

        <div class="col-12">
          <form-builder-select-academic-level
            v-model:value="form.academic_level_ids"
            label="پایه‌ها"
            outlined
            clearable
            multiple
            use-chips />
        </div>

        <div class="col-12">
          <form-builder-select-school-class
            v-model:value="form.class_ids"
            label="کلاس‌ها"
            outlined
            clearable
            multiple
            use-chips />
        </div>
      </div>

      <div class="q-mt-md">
        <div class="text-subtitle2 q-mb-sm">محتوای تکلیف</div>
        <exam-content-editor
          v-model:value="contentItem"
          :editable="true" />
      </div>

      <div class="row q-col-gutter-md q-mt-md">
        <div class="col-12">
          <div class="text-subtitle2 q-mb-sm">پیوست‌ها (فایل‌های اضافی)</div>
          <div
            v-for="(att, index) in attachmentList"
            :key="att.id || `new-${index}`"
            class="row q-col-gutter-sm items-center q-mb-sm">
            <div class="col">
              <exam-content-editor
                v-model:value="att.content"
                :editable="true" />
            </div>
            <div
              v-if="att.id"
              class="col-auto">
              <q-btn
                flat
                dense
                color="error"
                icon="delete"
                label="حذف"
                @click="removeAttachment(index)" />
            </div>
            <div
              v-else
              class="col-auto">
              <q-btn
                flat
                dense
                color="primary"
                icon="delete"
                label="حذف"
                @click="removeAttachment(index)" />
            </div>
          </div>
          <q-btn
            flat
            dense
            color="primary"
            icon="add"
            label="افزودن پیوست"
            @click="addAttachment" />
        </div>
      </div>

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
import ExamContentEditor from 'src/components/exam/ExamContentEditor.vue'
import FormBuilderSelectAcademicLevel from 'src/components/controls/formBuilderCustomInput/FormBuilderSelectAcademicLevel.vue'
import FormBuilderSelectSchoolClass from 'src/components/controls/formBuilderCustomInput/FormBuilderSelectSchoolClass.vue'
import type { HomeworkType } from 'src/repositories/homework'

const homeworkApi = new HomeworkAPI()
const lessonApi = new LessonAPI()
const schoolClassApi = new SchoolClassAPI()

const route = useRoute()
const router = useRouter()
const $q = useQuasar()

const routeId = computed(() => Number(route.params.id))

const homeworkData = ref<Partial<HomeworkType>>({})
const loading = ref(true)
const saving = ref(false)

const form = reactive({
  title: null as string | null,
  description: null as string | null,
  lesson_id: null as number | null,
  class_id: null as number | null,
  due_date: null as string | null,
  academic_level_ids: [] as number[],
  class_ids: [] as number[],
})

const contentItem = ref<{
  type: 'text' | 'image' | 'pdf';
  body?: string;
  path?: string;
  file?: File;
} | null>(null)

const attachmentList = ref<{ id?: number; content: any }[]>([])

const lessonOptions = ref<any[]>([])
const classOptions = ref<any[]>([])

async function loadLessons () {
  try {
    const result = await lessonApi.index({ length: 100 })
    lessonOptions.value = result.data
  } catch (error: any) {
    console.error('Error loading lessons:', error)
  }
}

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
    homeworkData.value = await homeworkApi.get(routeId.value)

    form.title = homeworkData.value.title
    form.description = homeworkData.value.description
    form.lesson_id = homeworkData.value.lesson_id
    form.class_id = homeworkData.value.class_id
    form.due_date = homeworkData.value.due_date

    if (homeworkData.value.attachments) {
      attachmentList.value = homeworkData.value.attachments.map((att: any) => ({
        id: att.id,
        content: att.content ? { ...att.content } : null
      }))
    }

    if (homeworkData.value.academic_levels) {
      form.academic_level_ids = homeworkData.value.academic_levels.map((l: any) => l.id)
    }

    if (homeworkData.value.classes) {
      form.class_ids = homeworkData.value.classes.map((c: any) => c.id)
    }
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
  if (!form.title || !form.lesson_id) {
    $q.notify({ icon: 'warning', message: 'عنوان و درس الزامی هستند.', color: 'warning' })
    return
  }

  saving.value = true
  try {
    const fd = new FormData()

    fd.append('title', form.title || '')
    if (form.description) fd.append('description', form.description)
    if (form.lesson_id) fd.append('lesson_id', String(form.lesson_id))
    if (form.class_id) fd.append('class_id', String(form.class_id))
    if (form.due_date) fd.append('due_date', form.due_date)

    if (contentItem.value) {
      const contentMeta = { ...contentItem.value }
      delete contentMeta.file
      fd.append('content', JSON.stringify(contentMeta))
      if (contentItem.value.file) {
        fd.append('content_file', contentItem.value.file)
      }
    }

    if (form.academic_level_ids.length > 0) {
      fd.append('academic_level_ids', JSON.stringify(form.academic_level_ids))
    }

    if (form.class_ids.length > 0) {
      fd.append('class_ids', JSON.stringify(form.class_ids))
    }

    if (attachmentList.value.length > 0) {
      const attachmentsPayload: any[] = []
      attachmentList.value.forEach((att, index) => {
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

function addAttachment () {
  attachmentList.value.push({ content: null })
}

function removeAttachment (index: number) {
  attachmentList.value.splice(index, 1)
}

onMounted(() => {
  loadLessons()
  loadClasses()
  loadHomework()
})
</script>

<style lang="scss" scoped>
</style>
