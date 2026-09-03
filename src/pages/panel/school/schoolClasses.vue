<template>
  <div class="school-classes-page">
    <q-card>
      <q-card-section>
        <div class="row items-center q-col-gutter-md">
          <div class="col">
            <div class="text-h6">مدیریت کلاس‌های مدرسه</div>
            <div class="text-caption text-grey">
              {{ school?.name || 'در حال بارگذاری...' }}
            </div>
          </div>
          <div class="col-auto">
            <q-btn
              color="primary"
              icon="refresh"
              label="بروزرسانی"
              :loading="loading"
              @click="loadTreeData" />
          </div>
          <div class="col-auto">
            <q-btn
              color="primary"
              icon="list"
              label="لیست مدارس"
              :to="{ name: 'Panel.School.List' }" />
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
                  v-if="node.type === 'level'"
                  flat
                  dense
                  round
                  size="sm"
                  icon="add"
                  color="positive"
                  @click.stop="addClass(node)">
                  <q-tooltip>افزودن کلاس</q-tooltip>
                </q-btn>
                <q-btn
                  v-if="node.type === 'class'"
                  flat
                  dense
                  round
                  size="sm"
                  icon="edit"
                  color="primary"
                  @click.stop="editClass(node)">
                  <q-tooltip>ویرایش</q-tooltip>
                </q-btn>
                <q-btn
                  v-if="node.type === 'class'"
                  flat
                  dense
                  round
                  size="sm"
                  icon="delete"
                  color="negative"
                  @click.stop="deleteClass(node)">
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
      <q-card style="min-width: 400px; max-width: 90vw">
        <q-card-section>
          <div class="text-h6">{{ dialog.title }}</div>
        </q-card-section>

        <q-separator />

        <q-card-section>
          <q-form @submit.prevent="onSubmitDialog">
            <div class="row q-col-gutter-md">
              <div class="col-12">
                <q-input
                  v-model="dialog.form.name"
                  label="نام کلاس *"
                  outlined
                  :rules="[(v) => !!v || 'نام کلاس الزامی است']" />
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
import SchoolAPI from 'src/repositories/school'
import AcademicFieldAPI from 'src/repositories/academicField'
import AcademicLevelAPI from 'src/repositories/academicLevel'
import ClassAPI from 'src/repositories/schoolClass'
import type { SchoolType } from 'src/repositories/school'
import type { AcademicFieldType } from 'src/repositories/academicField'
import type { AcademicLevelType } from 'src/repositories/academicLevel'
import type { SchoolClassType } from 'src/repositories/schoolClass'

const route = useRoute()
const $q = useQuasar()

const schoolApi = new SchoolAPI()
const fieldApi = new AcademicFieldAPI()
const levelApi = new AcademicLevelAPI()
const classApi = new ClassAPI()

const schoolId = parseInt(route.params.school_id as string)
const loading = ref(false)
const saving = ref(false)
const selectedNode = ref(null)
const treeData = ref<any[]>([])

const school = ref<SchoolType | null>(null)

const dialog = reactive({
  show: false,
  title: '',
  edit: false,
  node: null as any,
  form: {
    id: null as number | null,
    school_id: schoolId,
    academic_level_id: null as number | null,
    name: null as string | null
  }
})

function buildTree (
  fields: AcademicFieldType[],
  levels: AcademicLevelType[],
  classes: SchoolClassType[]
): any[] {
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
        children: classes
          .filter((c) => c.academic_level_id === level.id)
          .map((cls) => ({
            id: `class-${cls.id}`,
            label: cls.name || 'کلاس',
            type: 'class',
            data: cls
          }))
      }))
  }))
}

async function loadTreeData () {
  loading.value = true
  try {
    const [schoolRes, fieldsRes, levelsRes, classesRes] = await Promise.all([
      schoolApi.get(schoolId),
      fieldApi.index({ length: 1000, school_id: schoolId }),
      levelApi.index({ length: 1000, school_id: schoolId }),
      classApi.index({ length: 1000, school_id: schoolId })
    ])

    school.value = schoolRes
    treeData.value = buildTree(fieldsRes.data, levelsRes.data, classesRes.data)
  } catch (error) {
    $q.notify({
      icon: 'error',
      message: 'خطا در بارگذاری ساختار کلاس‌ها',
      color: 'negative'
    })
  } finally {
    loading.value = false
  }
}

function addClass (node: any) {
  dialog.edit = false
  dialog.node = node
  dialog.title = 'افزودن کلاس'
  dialog.form = {
    id: null,
    school_id: schoolId,
    academic_level_id: node.data.id,
    name: null
  }
  dialog.show = true
}

function editClass (node: any) {
  dialog.edit = true
  dialog.node = node
  dialog.title = 'ویرایش کلاس'
  dialog.form = {
    id: node.data.id,
    school_id: schoolId,
    academic_level_id: node.data.academic_level_id,
    name: node.data.name
  }
  dialog.show = true
}

function deleteClass (node: any) {
  $q.dialog({
    title: 'تایید حذف',
    message: `آیا از حذف "${node.label}" اطمینان دارید؟`,
    cancel: true,
    persistent: true
  }).onOk(async () => {
    try {
      await classApi.delete(node.data.id)
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
    if (dialog.edit) {
      await classApi.update(dialog.form.id as number, dialog.form as any)
    } else {
      await classApi.create(dialog.form as any)
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

onMounted(() => {
  loadTreeData()
})
</script>

<style lang="scss" scoped>
</style>
