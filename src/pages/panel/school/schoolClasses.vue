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
          <div
            v-if="userManager.isAdmin"
            class="col-auto">
            <q-btn
              color="primary"
              icon="list"
              label="لیست مدارس"
              outline
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
          ref="treeRef"
          v-model:selected="selectedNode"
          v-model:expanded="expandedNodes"
          :nodes="treeData"
          node-key="id"
          label-key="label"
          children-key="children"
          class="academic-tree">
          <template #default-header="{ node }">
            <div
              class="row items-center q-col-gutter-sm full-width"
              @click.stop="handleNodeClick(node)">
              <div class="col">
                <div class="text-subtitle2">{{ node.label }}</div>
                <div
                  v-if="node.subtitle"
                  class="text-caption text-grey">{{ node.subtitle }}</div>
              </div>
              <div
                class="col-auto"
                @click.stop>
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
                  <q-tooltip>ویرایش کلاس و درس‌ها</q-tooltip>
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

    <q-dialog v-model="addDialog.show">
      <q-card style="min-width: 400px; max-width: 90vw">
        <q-card-section>
          <div class="text-h6">افزودن کلاس</div>
        </q-card-section>

        <q-separator />

        <q-card-section>
          <q-form @submit.prevent="onSubmitAddDialog">
            <q-input
              v-model="addDialog.form.name"
              label="نام کلاس *"
              outlined
              :rules="[(value) => !!value || 'نام کلاس الزامی است']" />

            <div class="q-mt-md">
              <q-btn
                type="submit"
                color="primary"
                label="ثبت"
                :loading="saving" />
              <q-btn
                flat
                label="انصراف"
                class="q-ml-sm"
                @click="addDialog.show = false" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <edit-school-class-dialog
      v-model="editDialog.show"
      :school-class="editDialog.schoolClass"
      :school-id="schoolId"
      :field-id="editDialog.fieldId"
      :level-id="editDialog.levelId"
      @updated="loadTreeData" />
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useUser } from 'src/stores/user'
import { QTree, useQuasar } from 'quasar'
import SchoolAPI from 'src/repositories/school'
import ClassAPI from 'src/repositories/schoolClass'
import { ref, reactive, onMounted, computed } from 'vue'
import type { SchoolType } from 'src/repositories/school'
import AcademicFieldAPI from 'src/repositories/academicField'
import AcademicLevelAPI from 'src/repositories/academicLevel'
import { useCurrentSchool } from 'src/composables/useCurrentSchool'
import type { SchoolClassType } from 'src/repositories/schoolClass'
import type { AcademicFieldType } from 'src/repositories/academicField'
import type { AcademicLevelType } from 'src/repositories/academicLevel'
import EditSchoolClassDialog from 'src/components/school/EditSchoolClassDialog.vue'

const $q = useQuasar()
const route = useRoute()

const userManager = useUser()
const classApi = new ClassAPI()
const schoolApi = new SchoolAPI()
const fieldApi = new AcademicFieldAPI()
const levelApi = new AcademicLevelAPI()
const currentSchoolManager = useCurrentSchool()

const treeRef = ref<QTree | null>(null)
const loading = ref(false)
const saving = ref(false)
const selectedNode = ref(null)
const expandedNodes = ref<any[]>([])
const treeData = ref<any[]>([])
const school = ref<SchoolType | null>(null)

const schoolId = computed(() => {
  if (route.name === 'Panel.School.Classes') {
    return route.params.id ? parseInt(route.params.id.toString()) : null
  }

  return currentSchoolManager.currentSchool.value?.id ?? null
})

const addDialog = reactive({
  show: false,
  form: {
    id: null as number | null,
    school_id: schoolId.value,
    academic_level_id: null as number | null,
    name: null as string | null
  }
})

const editDialog = reactive({
  show: false,
  schoolClass: null as SchoolClassType | null,
  fieldId: null as number | null,
  levelId: null as number | null
})

function handleNodeClick (node: any) {
  // کلاس‌ها برگ درخت هستند و فرزندی ندارند، پس نیازی به expand/collapse ندارند
  if (!node || node.type === 'class') return

  if (treeRef.value) {
    const isExpanded = treeRef.value.isExpanded(node.id)
    treeRef.value.setExpanded(node.id, !isExpanded)
  } else {
    const index = expandedNodes.value.indexOf(node.id)
    if (index > -1) {
      expandedNodes.value.splice(index, 1)
    } else {
      expandedNodes.value.push(node.id)
    }
  }
}

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
      .filter((level) => level.field_id === field.id)
      .map((level) => ({
        id: `level-${level.id}`,
        label: level.name || 'مقطع',
        type: 'level',
        data: level,
        fieldId: field.id,
        children: classes
          .filter((schoolClass) => schoolClass.academic_level_id === level.id)
          .map((schoolClass) => ({
            id: `class-${schoolClass.id}`,
            label: schoolClass.name || 'کلاس',
            type: 'class',
            data: schoolClass,
            fieldId: field.id,
            levelId: level.id
          }))
      }))
  }))
}

async function loadTreeData () {
  if (!schoolId.value) return

  loading.value = true
  try {
    const [schoolRes, fieldsRes, levelsRes, classesRes] = await Promise.all([
      schoolApi.get(schoolId.value),
      fieldApi.index({ length: 1000, school_id: schoolId.value }),
      levelApi.index({ length: 1000, school_id: schoolId.value }),
      classApi.index({ length: 1000, school_id: schoolId.value })
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
  addDialog.form = {
    id: null,
    school_id: schoolId.value,
    academic_level_id: node.data.id,
    name: null
  }
  addDialog.show = true
}

function editClass (node: any) {
  editDialog.schoolClass = node.data
  editDialog.fieldId = node.fieldId
  editDialog.levelId = node.levelId
  editDialog.show = true
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
      await loadTreeData()
    } catch (error) {
      $q.notify({
        icon: 'error',
        message: 'خطا در حذف.',
        color: 'negative'
      })
    }
  })
}

async function onSubmitAddDialog () {
  saving.value = true
  try {
    await classApi.create(addDialog.form as SchoolClassType)
    $q.notify({
      icon: 'check',
      message: 'با موفقیت ثبت شد.',
      color: 'positive'
    })
    addDialog.show = false
    await loadTreeData()
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

<style lang="scss" scoped></style>
