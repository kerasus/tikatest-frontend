<template>
  <div class="academic-tree-page">
    <q-card>
      <q-card-section>
        <div class="row items-center q-col-gutter-md">
          <div class="col">
            <div class="text-h6">ساختار دروس و مقطع‌های تحصیلی</div>
            <div class="text-caption text-grey">
              درختواره بر اساس رشته، مقطع و درس
            </div>
          </div>
          <div class="col-auto">
            <q-btn
              color="positive"
              icon="add"
              label="افزودن رشته"
              @click="addRootField" />
          </div>
          <div class="col-auto">
            <q-btn
              color="primary"
              icon="refresh"
              label="بروزرسانی"
              :loading="loading"
              @click="loadTreeData" />
          </div>
        </div>
      </q-card-section>

      <q-separator />

      <q-card-section>
        <div
          v-if="loading"
          class="text-center q-pa-lg">
          <q-spinner
            color="primary"
            size="80px" />
        </div>
        <div
          v-else-if="treeData.length === 0"
          class="text-center q-pa-lg">
          <q-icon
            name="account_tree"
            size="80px"
            color="grey-4" />
          <p class="text-subtitle1 q-mt-md text-grey">هیچ داده‌ای یافت نشد</p>
        </div>
        <q-tree
          v-else
          v-model:selected="selectedNode"
          :nodes="treeData"
          node-key="id"
          label-key="label"
          children-key="children"
          default-expand-all
          class="academic-tree">
          <template #default-header="{ node }">
            <div class="row items-center q-col-gutter-sm full-width">
              <div class="col">
                <div class="text-subtitle2">{{ node.label }}</div>
                <div
                  v-if="node.subtitle"
                  class="text-caption text-grey">{{ node.subtitle }}</div>
              </div>
              <div class="col-auto">
                <q-btn
                  flat
                  dense
                  round
                  size="sm"
                  icon="add"
                  color="positive"
                  @click.stop="addChild(node)">
                  <q-tooltip>افزودن</q-tooltip>
                </q-btn>
                <q-btn
                  flat
                  dense
                  round
                  size="sm"
                  icon="edit"
                  color="primary"
                  @click.stop="editNode(node)">
                  <q-tooltip>ویرایش</q-tooltip>
                </q-btn>
                <q-btn
                  flat
                  dense
                  round
                  size="sm"
                  icon="delete"
                  color="negative"
                  @click.stop="deleteNode(node)">
                  <q-tooltip>حذف</q-tooltip>
                </q-btn>
              </div>
            </div>
          </template>
        </q-tree>
      </q-card-section>
    </q-card>

    <q-dialog
      v-model="dialog.show"
      persistent>
      <q-card style="min-width: 400px; max-width: 90vw;">
        <q-card-section>
          <div class="text-h6">{{ dialog.title }}</div>
        </q-card-section>

        <q-separator />

        <q-card-section>
          <q-form @submit.prevent="onSubmitDialog">
            <div class="row q-col-gutter-md">
              <div
                v-if="dialog.type === 'level'"
                class="col-12">
                <q-select
                  v-model="dialog.form.field_id"
                  :options="fieldOptions"
                  option-value="id"
                  option-label="name"
                  label="رشته"
                  outlined
                  emit-value
                  map-options
                  clearable
                  :rules="[v => !!v || 'رشته الزامی است']" />
              </div>
              <div
                v-if="dialog.type === 'lesson'"
                class="col-12">
                <q-select
                  v-model="dialog.form.level_id"
                  :options="levelOptions"
                  option-value="id"
                  option-label="name"
                  label="مقطع"
                  outlined
                  emit-value
                  map-options
                  clearable
                  :rules="[v => !!v || 'مقطع الزامی است']" />
              </div>
              <div
                v-if="dialog.type === 'lesson'"
                class="col-12">
                <q-select
                  v-model="dialog.form.class_id"
                  :options="classOptions"
                  option-value="id"
                  option-label="name"
                  label="کلاس"
                  outlined
                  emit-value
                  map-options
                  clearable />
              </div>
              <div class="col-12">
                <q-input
                  v-model="dialog.form.name"
                  :label="dialog.type === 'field' ? 'نام رشته' : dialog.type === 'level' ? 'نام مقطع' : 'نام درس'"
                  outlined
                  :rules="[v => !!v || 'نام الزامی است']" />
              </div>
              <div
                v-if="dialog.type === 'lesson'"
                class="col-12 col-md-6">
                <q-input
                  v-model="dialog.form.order"
                  label="ترتیب نمایش در کارنامه"
                  outlined
                  type="number"
                  hint="ترتیب نمایش درس در کارنامه" />
              </div>
              <div
                v-if="dialog.type === 'lesson'"
                class="col-12 col-md-6">
                <q-input
                  v-model="dialog.form.coefficient"
                  label="ضریب در کارنامه"
                  outlined
                  type="number"
                  step="0.01"
                  hint="ضریب جهت محاسبه میانگین نمره در کارنامه" />
              </div>
            </div>

            <div class="q-mt-md">
              <q-btn
                type="submit"
                color="primary"
                :label="dialog.edit ? 'بروزرسانی' : 'ثبت'"
                :loading="saving" />
              <q-btn
                flat
                label="انصراف"
                class="q-ml-sm"
                @click="dialog.show = false" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useQuasar } from 'quasar'
import AcademicFieldAPI from 'src/repositories/academicField'
import AcademicLevelAPI from 'src/repositories/academicLevel'
import LessonAPI from 'src/repositories/lesson'
import ClassAPI from 'src/repositories/schoolClass'
import SchoolAPI from 'src/repositories/school'
import type { SchoolType } from 'src/repositories/school'
import type { AcademicFieldType } from 'src/repositories/academicField'
import type { AcademicLevelType } from 'src/repositories/academicLevel'
import type { LessonType } from 'src/repositories/lesson'
import type { SchoolClassType } from 'src/repositories/schoolClass'

const route = useRoute()
const $q = useQuasar()

const schoolApi = new SchoolAPI()
const fieldApi = new AcademicFieldAPI()
const levelApi = new AcademicLevelAPI()
const lessonApi = new LessonAPI()
const classApi = new ClassAPI()

const loading = ref(false)
const saving = ref(false)
const selectedNode = ref(null)
const treeData = ref<any[]>([])
const fieldOptions = ref<AcademicFieldType[]>([])
const levelOptions = ref<AcademicLevelType[]>([])
const classOptions = ref<SchoolClassType[]>([])

const schoolId = parseInt(route.params.school_id as string)

const dialog = reactive({
  show: false,
  title: '',
  type: '' as 'field' | 'level' | 'lesson' | '',
  edit: false,
  node: null as any,
  form: {
    school_id: schoolId,
    field_id: null as number | null,
    level_id: null as number | null,
    class_id: null as number | null,
    name: null as string | null,
    order: 0 as number | null,
    coefficient: 1 as number | null
  }
})

function buildTree (fields: AcademicFieldType[], levels: AcademicLevelType[], lessons: LessonType[]): any[] {
  return fields.map((field) => ({
    id: `field-${field.id}`,
    label: field.name || 'رشته',
    type: 'field',
    data: field,
    children: levels
      .filter((l) => l.field_id === field.id)
      .map((level) => ({
        id: `level-${level.id}`,
        label: level.name || 'مقطع',
        type: 'level',
        data: level,
        children: lessons
          .filter((l) => l.class_id === level.id)
          .map((lesson) => ({
            id: `lesson-${lesson.id}`,
            label: lesson.name || 'درس',
            subtitle: `ترتیب: ${lesson.order ?? '-'} | ضریب: ${lesson.coefficient ?? '-'}`,
            type: 'lesson',
            data: lesson
          }))
      }))
  }))
}

async function loadTreeData () {
  loading.value = true
  try {
    const [fieldsRes, levelsRes, lessonsRes, classesRes] = await Promise.all([
      fieldApi.index({ length: 1000, school_id: schoolId }),
      levelApi.index({ length: 1000, school_id: schoolId }),
      lessonApi.index({ length: 1000, school_id: schoolId }),
      classApi.index({ length: 1000, school_id: schoolId })
    ])

    treeData.value = buildTree(fieldsRes.data, levelsRes.data, lessonsRes.data)
  } catch (error) {
    $q.notify({
      icon: 'error',
      message: 'خطا در بارگذاری ساختار دروس',
      color: 'negative'
    })
  } finally {
    loading.value = false
  }
}

function addRootField () {
  dialog.edit = false
  dialog.node = null
  dialog.type = 'field'
  dialog.title = 'افزودن رشته'
  dialog.form = {
    school_id: schoolId,
    field_id: null,
    level_id: null,
    class_id: null,
    name: null,
    order: 0,
    coefficient: 1
  }
  dialog.show = true
}

function addChild (node: any) {
  dialog.edit = false
  dialog.node = node
  dialog.type = node.type === 'field' ? 'level' : 'lesson'
  dialog.title = dialog.type === 'level' ? 'افزودن مقطع' : 'افزودن درس'
  dialog.form = {
    school_id: schoolId,
    field_id: node.type === 'field' ? node.data.id : (node.data.field_id || null),
    level_id: node.type === 'level' ? node.data.id : null,
    class_id: node.type === 'level' ? node.data.id : null,
    name: null,
    order: 0,
    coefficient: 1
  }

  if (dialog.type === 'lesson') {
    loadLevelOptions(node.data.field_id)
    loadClassOptions(node.data.id)
  } else if (dialog.type === 'level') {
    loadFieldOptions()
  }

  dialog.show = true
}

function editNode (node: any) {
  dialog.edit = true
  dialog.node = node
  dialog.type = node.type
  dialog.title = node.type === 'field' ? 'ویرایش رشته' : node.type === 'level' ? 'ویرایش مقطع' : 'ویرایش درس'
  dialog.form = {
    school_id: schoolId,
    field_id: node.data.field_id || null,
    level_id: node.data.level_id || null,
    class_id: node.data.class_id || null,
    name: node.data.name,
    order: node.data.order ?? 0,
    coefficient: node.data.coefficient ?? 1
  }

  if (node.type === 'lesson') {
    loadFieldOptions()
    loadLevelOptions(node.data.field_id)
    loadClassOptions(node.data.class_id)
  } else if (node.type === 'level') {
    loadFieldOptions()
  }

  dialog.show = true
}

function deleteNode (node: any) {
  $q.dialog({
    title: 'تایید حذف',
    message: `آیا از حذف "${node.label}" اطمینان دارید؟`,
    cancel: true,
    persistent: true
  }).onOk(async () => {
    try {
      if (node.type === 'field') await fieldApi.delete(node.data.id)
      else if (node.type === 'level') await levelApi.delete(node.data.id)
      else if (node.type === 'lesson') await lessonApi.delete(node.data.id)

      $q.notify({
        icon: 'check',
        message: 'با موفقیت حذف شد.',
        color: 'positive'
      })
      loadTreeData()
    } catch (error) {
      $q.notify({
        icon: 'error',
        message: 'خطا در حذف.',
        color: 'negative'
      })
    }
  })
}

async function onSubmitDialog () {
  saving.value = true
  try {
    if (dialog.type === 'field') {
      if (dialog.edit) await fieldApi.update(dialog.node.data.id, dialog.form as any)
      else await fieldApi.create(dialog.form as any)
    } else if (dialog.type === 'level') {
      if (dialog.edit) await levelApi.update(dialog.node.data.id, dialog.form as any)
      else await levelApi.create(dialog.form as any)
    } else if (dialog.type === 'lesson') {
      if (dialog.edit) await lessonApi.update(dialog.node.data.id, dialog.form as any)
      else await lessonApi.create(dialog.form as any)
    }

    $q.notify({
      icon: 'check',
      message: 'با موفقیت ثبت شد.',
      color: 'positive'
    })
    dialog.show = false
    loadTreeData()
  } catch (error) {
    $q.notify({
      icon: 'error',
      message: 'خطا در ثبت.',
      color: 'negative'
    })
  } finally {
    saving.value = false
  }
}

async function loadFieldOptions () {
  try {
    const result = await fieldApi.index({ length: 1000, school_id: schoolId })
    fieldOptions.value = result.data
  } catch (error) {
    console.error('Error loading fields:', error)
  }
}

async function loadLevelOptions (fieldId?: number) {
  try {
    const params: any = { length: 1000, school_id: schoolId }
    if (fieldId) params.field_id = fieldId
    const result = await levelApi.index(params)
    levelOptions.value = result.data
  } catch (error) {
    console.error('Error loading levels:', error)
  }
}

async function loadClassOptions (levelId?: number) {
  try {
    const result = await classApi.index({ length: 1000, school_id: schoolId })
    classOptions.value = result.data
  } catch (error) {
    console.error('Error loading classes:', error)
  }
}

onMounted(() => {
  loadTreeData()
})
</script>

<style lang="scss" scoped>
.academic-tree-page {
  max-width: 100%;
  margin: 0 auto;
}

.academic-tree {
  min-height: 400px;
}
</style>
