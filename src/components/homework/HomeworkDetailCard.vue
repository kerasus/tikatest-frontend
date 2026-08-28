<template>
  <q-card class="q-mb-md">
    <q-card-section>
      <div class="text-h6">جزئیات تکلیف</div>
    </q-card-section>
    <q-separator />

    <q-card-section>
      <div class="row q-col-gutter-md">
        <div class="col-12 col-md-12">
          <q-input
            v-if="editable"
            v-model="homework.title"
            label="عنوان تکلیف"
            maxlength="255"
            required />
          <div
            v-else
            class="text-body1">
            {{ homework.title || '-' }}
          </div>
        </div>
        <div class="col-12 col-md-6">
          <form-builder-date
            v-if="editable"
            v-model:value="homework.due_date"
            label="موعد تحویل" />
          <div
            v-else
            class="text-body1">{{ dueDateFormatted }}</div>
        </div>
        <div class="col-12 col-md-6">
          <form-builder-select-lesson
            v-if="editable"
            v-model:value="homework.lesson_id"
            label="درس" />
          <div
            v-else
            class="text-body1">
            {{ homework.lesson?.name || '-' }}
          </div>
        </div>
        <div
          v-if="editable || homework.description"
          class="col-12">
          <q-input
            v-if="editable"
            v-model="homework.description"
            label="توضیحات"
            type="textarea"
            rows="3" />
          <div
            v-else
            class="text-body1">{{ homework.description }}</div>
        </div>
      </div>

      <q-separator class="q-my-md" />

      <div class="row q-col-gutter-md q-mt-md">
        <div class="col-12 col-md-6">
          <form-builder-select-academic-level
            v-if="editable"
            v-model:value="levelIds"
            label="پایه‌ها"
            outlined
            clearable
            multiple
            use-chips />
          <div v-else>
            <div class="text-subtitle2">پایه‌ها:</div>
            <div class="q-gutter-xs">
              <q-chip
                v-for="level in homework.academic_levels"
                :key="level.id"
                color="primary"
                text-color="white"
                dense>
                {{ level.name || '-' }}
              </q-chip>
              <span
                v-if="!homework.academic_levels?.length"
                class="text-grey">هیچ سطح آموزشی انتخاب نشده است.</span>
            </div>
          </div>
        </div>
        <div class="col-12 col-md-6">
          <form-builder-select-school-class
            v-if="editable"
            v-model:value="classIds"
            label="کلاس‌ها"
            outlined
            clearable
            multiple
            use-chips />
          <div v-else>
            <div class="text-subtitle2">کلاس‌ها:</div>
            <div class="q-gutter-xs">
              <q-chip
                v-for="cls in homework.classes"
                :key="cls.id"
                color="secondary"
                text-color="white"
                dense>
                {{ cls.name || '-' }}
              </q-chip>
              <span
                v-if="!homework.classes?.length"
                class="text-grey">هیچ کلاسی انتخاب نشده است.</span>
            </div>
          </div>
        </div>
      </div>

      <q-separator class="q-my-md" />

      <div class="row q-col-gutter-md q-mt-md">
        <div class="col-12">
          <div class="row items-center q-mb-sm">
            <div class="col">
              <div class="text-subtitle2">
                پیوست‌ها
                <q-btn
                  v-if="editable"
                  color="primary"
                  icon="add"
                  class="q-ml-md"
                  @click="addAttachment" />
              </div>
            </div>
          </div>
          <q-list
            v-if="attachmentsList.length"
            bordered
            separator
            class="rounded-borders">
            <q-item
              v-for="(att, index) in attachmentsList"
              :key="att.id || `new-${index}`"
              class="q-py-sm">
              <q-item-section>
                <content-editor
                  v-model:value="att.content"
                  :editable="editable" />
              </q-item-section>
              <q-item-section
                v-if="editable"
                side
                top>
                <q-btn
                  flat
                  round
                  dense
                  icon="delete"
                  color="negative"
                  size="sm"
                  @click="removeAttachment(index)" />
              </q-item-section>
            </q-item>
          </q-list>
          <div
            v-else
            class="text-center q-pa-md text-grey">پیوستی ثبت نشده است.</div>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useDate } from 'src/composables/Date'
import ContentEditor from 'src/components/ContentEditor.vue'
import type { HomeworkType, HomeworkAttachmentType } from 'src/repositories/homework'
import FormBuilderDate from 'src/components/controls/formBuilderCustomInput/FormBuilderDate.vue'
import FormBuilderSelectLesson from 'src/components/controls/formBuilderCustomInput/FormBuilderSelectLesson.vue'
import FormBuilderSelectSchoolClass from 'src/components/controls/formBuilderCustomInput/FormBuilderSelectSchoolClass.vue'
import FormBuilderSelectAcademicLevel from 'src/components/controls/formBuilderCustomInput/FormBuilderSelectAcademicLevel.vue'

const homework = defineModel<Partial<HomeworkType>>('homework')
defineProps<{
  editable?: boolean;
  classOptions?: unknown[];
}>()

const dateManager = useDate()

const dueDateFormatted = computed(() => {
  const raw = homework.value.due_date
  if (!raw) return '-'
  return dateManager.miladiToShamsi(raw, 'YYYY-MM-DD', 'jYYYY/jMM/jDD') || raw
})

const levelIds = computed<number[]>({
  get: () => {
    if (Array.isArray(homework.value.academic_level_ids)) {
      return homework.value.academic_level_ids
    }

    return (
      homework.value.academic_levels
        ?.map((level) => level.id)
        .filter((id): id is number => id !== null) || []
    )
  },
  set: (value) => {
    homework.value.academic_level_ids = value || []
  }
})

const classIds = computed<number[]>({
  get: () => {
    if (Array.isArray(homework.value.class_ids)) {
      return homework.value.class_ids
    }

    return (
      homework.value.classes
        ?.map((schoolClass) => schoolClass.id)
        .filter((id): id is number => id !== null) || []
    )
  },
  set: (value) => {
    homework.value.class_ids = value || []
  }
})

const attachmentsList = computed<HomeworkAttachmentType[]>({
  get: () => homework.value.attachments || [],
  set: (val) => {
    homework.value.attachments = val
  }
})

function addAttachment () {
  if (!homework.value.attachments) {
    homework.value.attachments = []
  }
  homework.value.attachments.push({
    id: null,
    homework_id: null,
    content: null,
    sort_order: homework.value.attachments.length,
    created_at: null,
    updated_at: null
  })
}

function removeAttachment (index: number) {
  if (!homework.value.attachments) return
  homework.value.attachments.splice(index, 1)
}
</script>

<style scoped></style>
