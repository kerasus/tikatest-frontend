<template>
  <q-dialog v-model="dialogVisible">
    <q-card style="width: 700px; max-width: 95vw">
      <q-card-section class="row items-center">
        <div class="text-h6">ویرایش کلاس</div>
        <q-space />
        <q-btn
          v-close-popup
          flat
          round
          dense
          icon="close" />
      </q-card-section>

      <q-separator />

      <q-card-section>
        <q-form @submit.prevent="saveClass">
          <q-input
            v-model="form.name"
            label="نام کلاس *"
            outlined
            :rules="[(value) => !!value || 'نام کلاس الزامی است']" />

          <div class="row justify-end q-mt-md">
            <q-btn
              type="submit"
              color="primary"
              label="ذخیره نام کلاس"
              :loading="savingClass" />
          </div>
        </q-form>
      </q-card-section>

      <q-separator />

      <q-card-section>
        <div class="text-subtitle1 q-mb-md">درس‌های کلاس</div>

        <div class="row q-col-gutter-sm items-start">
          <div class="col-12 col-sm">
            <form-builder-select-lesson
              v-model:value="selectedLessonId"
              :school-id="schoolId"
              :field-id="fieldId"
              :level-id="levelId"
              label="انتخاب درس"
              outlined
              clearable />
          </div>
          <div class="col-12 col-sm-auto">
            <q-btn
              color="positive"
              icon="add"
              label="افزودن درس"
              class="full-width"
              :disable="!selectedLessonId"
              :loading="addingLesson"
              @click="addLesson" />
          </div>
        </div>

        <div
          v-if="loadingLessons"
          class="text-center q-pa-lg">
          <q-spinner
            color="primary"
            size="40px" />
        </div>

        <q-list
          v-else-if="classLessons.length"
          bordered
          separator
          class="q-mt-md rounded-borders">
          <q-item
            v-for="item in classLessons"
            :key="item.id ?? item.lesson_id">
            <q-item-section>
              <q-item-label>{{ item.lesson?.name || 'درس' }}</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-btn
                flat
                round
                dense
                color="negative"
                icon="delete"
                :loading="removingLessonId === item.id"
                @click="removeLesson(item)">
                <q-tooltip>حذف درس از کلاس</q-tooltip>
              </q-btn>
            </q-item-section>
          </q-item>
        </q-list>

        <div
          v-else
          class="text-center text-grey q-pa-lg">
          هنوز درسی به این کلاس اضافه نشده است.
        </div>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn
          flat
          label="بستن"
          @click="dialogVisible = false" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { useQuasar } from 'quasar'
import SchoolClassAPI, { type SchoolClassType } from 'src/repositories/schoolClass'
import ClassLessonAPI, { type ClassLessonType } from 'src/repositories/classLesson'
import FormBuilderSelectLesson from 'src/components/controls/formBuilderCustomInput/FormBuilderSelectLesson.vue'

const props = defineProps<{
  modelValue: boolean
  schoolClass: SchoolClassType | null
  schoolId: number | null
  fieldId: number | null
  levelId: number | null
}>()

const emit = defineEmits<{
  (event: 'update:modelValue', value: boolean): void
  (event: 'updated'): void
}>()

const $q = useQuasar()
const classApi = new SchoolClassAPI()

const savingClass = ref(false)
const loadingLessons = ref(false)
const addingLesson = ref(false)
const removingLessonId = ref<number | null>(null)
const selectedLessonId = ref<number | null>(null)
const classLessons = ref<ClassLessonType[]>([])
const form = reactive({
  name: ''
})

const dialogVisible = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emit('update:modelValue', value)
})

watch(
  () => props.modelValue,
  async (visible) => {
    if (!visible || !props.schoolClass?.id) return
    form.name = props.schoolClass.name || ''
    selectedLessonId.value = null
    await loadClassLessons()
  }
)

async function loadClassLessons () {
  const classId = props.schoolClass?.id
  if (!classId) return

  loadingLessons.value = true
  try {
    const classLessonApi = new ClassLessonAPI(classId)
    const response = await classLessonApi.index({
      length: 1000
    })
    classLessons.value = response.data
  } catch (error) {
    $q.notify({
      icon: 'error',
      message: 'خطا در بارگذاری درس‌های کلاس',
      color: 'negative'
    })
  } finally {
    loadingLessons.value = false
  }
}

async function saveClass () {
  if (!props.schoolClass?.id || !form.name.trim()) return

  savingClass.value = true
  try {
    await classApi.update(props.schoolClass.id, {
      ...props.schoolClass,
      name: form.name.trim()
    })
    $q.notify({
      icon: 'check',
      message: 'نام کلاس با موفقیت بروزرسانی شد.',
      color: 'positive'
    })
    emit('updated')
  } catch (error) {
    $q.notify({
      icon: 'error',
      message: 'خطا در بروزرسانی کلاس.',
      color: 'negative'
    })
  } finally {
    savingClass.value = false
  }
}

async function addLesson () {
  const classId = props.schoolClass?.id
  if (!classId || !selectedLessonId.value) return

  if (classLessons.value.some((item) => item.lesson_id === selectedLessonId.value)) {
    $q.notify({
      icon: 'info',
      message: 'این درس قبلاً به کلاس اضافه شده است.',
      color: 'info'
    })
    return
  }

  addingLesson.value = true
  try {
    const classLessonApi = new ClassLessonAPI(classId)
    await classLessonApi.create({
      ...classLessonApi.defaultObject,
      class_id: classId,
      lesson_id: selectedLessonId.value
    })
    selectedLessonId.value = null
    await loadClassLessons()
    $q.notify({
      icon: 'check',
      message: 'درس با موفقیت به کلاس اضافه شد.',
      color: 'positive'
    })
    emit('updated')
  } catch (error) {
    $q.notify({
      icon: 'error',
      message: 'خطا در افزودن درس به کلاس.',
      color: 'negative'
    })
  } finally {
    addingLesson.value = false
  }
}

async function removeLesson (item: ClassLessonType) {
  const classId = props.schoolClass?.id
  if (!classId || !item.id) return

  removingLessonId.value = item.id
  try {
    const classLessonApi = new ClassLessonAPI(classId)
    await classLessonApi.delete(item.id)
    await loadClassLessons()
    $q.notify({
      icon: 'check',
      message: 'درس از کلاس حذف شد.',
      color: 'positive'
    })
    emit('updated')
  } catch (error) {
    $q.notify({
      icon: 'error',
      message: 'خطا در حذف درس از کلاس.',
      color: 'negative'
    })
  } finally {
    removingLessonId.value = null
  }
}
</script>
