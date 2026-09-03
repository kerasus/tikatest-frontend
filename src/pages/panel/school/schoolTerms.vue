<template>
  <div class="school-terms-page">
    <q-card>
      <q-card-section>
        <div class="row items-center q-col-gutter-md">
          <div class="col">
            <div class="text-h6">مدیریت ترم‌های مدرسه</div>
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
              icon="add"
              label="ترم جدید"
              @click="openDialog(null)" />
          </div>
          <div class="col-auto">
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
            name="event_available"
            size="80px"
            color="grey-4" />
          <p class="text-subtitle1 q-mt-md text-grey">هیچ ترمی یافت نشد</p>
        </div>
        <q-tree
          v-else
          v-model:selected="selectedNode"
          :nodes="treeData"
          node-key="id"
          label-key="label"
          children-key="children"
          :expanded="expanded"
          class="terms-tree"
          @update:expanded="onExpandedChange">
          <template #default-header="{ node }">
            <div class="row items-center q-col-gutter-sm full-width">
              <div class="col">
                <div class="text-subtitle2">{{ node.label }}</div>
                <div
                  v-if="node.subtitle"
                  class="text-caption text-grey">{{ node.subtitle }}</div>
              </div>
              <div class="col-auto">
                <q-chip
                  v-if="node.is_active"
                  color="positive"
                  text-color="white"
                  size="sm">
                  فعال
                </q-chip>
                <q-chip
                  v-else
                  color="grey"
                  text-color="white"
                  size="sm"> غیرفعال </q-chip>
              </div>
              <div class="col-auto">
                <q-btn
                  flat
                  dense
                  round
                  size="sm"
                  icon="add"
                  color="positive"
                  @click.stop="addChildTerm(node)">
                  <q-tooltip>افزودن زیرترم</q-tooltip>
                </q-btn>
                <q-btn
                  flat
                  dense
                  round
                  size="sm"
                  icon="edit"
                  color="primary"
                  @click.stop="editTerm(node)">
                  <q-tooltip>ویرایش</q-tooltip>
                </q-btn>
                <q-btn
                  flat
                  dense
                  round
                  size="sm"
                  icon="delete"
                  color="negative"
                  @click.stop="deleteTerm(node)">
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
      <q-card style="min-width: 500px; max-width: 90vw">
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
                  label="نام ترم *"
                  outlined
                  :rules="[(v) => !!v || 'نام ترم الزامی است']" />
              </div>
              <div class="col-12">
                <q-select
                  v-model="dialog.form.type"
                  label="نوع ترم *"
                  :options="termTypeOptions"
                  emit-value
                  map-options
                  option-label="label"
                  option-value="value"
                  outlined
                  :rules="[(v) => !!v || 'نوع ترم الزامی است']" />
              </div>
              <div class="col-6">
                <q-input
                  v-model="dialog.form.academic_year"
                  label="سال تحصیلی"
                  hint="مثال: ۱۴۰۳-۱۴۰۴"
                  outlined />
              </div>
              <div class="col-6">
                <q-input
                  v-model="dialog.form.season"
                  label="فصل"
                  hint="مثال: بهار، تابستان"
                  outlined />
              </div>
              <div class="col-6">
                <q-input
                  v-model.number="dialog.form.period"
                  label="دوره"
                  hint="عدد دوره (مثلاً 1 یا 2)"
                  type="number"
                  outlined />
              </div>
              <div class="col-6">
                <q-checkbox
                  v-model="dialog.form.is_active"
                  label="فعال"
                  :val="true"
                  :unchecked-value="false"
                  class="q-mt-sm" />
              </div>
              <div class="col-6">
                <form-builder-date
                  v-model="dialog.form.starts_at"
                  label="تاریخ شروع" />
              </div>
              <div class="col-6">
                <form-builder-date
                  v-model="dialog.form.ends_at"
                  label="تاریخ پایان" />
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

    <q-dialog
      v-model="deleteConfirm.show"
      persistent>
      <q-card style="min-width: 400px">
        <q-card-section class="row items-center">
          <q-avatar
            icon="warning"
            color="negative"
            text-color="white" />
          <span class="q-ml-sm">آیا مطمئن هستید؟</span>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn
            flat
            label="انصراف"
            @click="deleteConfirm.show = false" />
          <q-btn
            color="negative"
            label="حذف"
            :loading="deleting"
            @click="confirmDelete" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar'
import { useRoute } from 'vue-router'
import { ref, reactive, onMounted } from 'vue'
import SchoolAPI from 'src/repositories/school'
import { TERM_TYPE_LABELS } from 'src/repositories/school'
import type { SchoolType, AcademicTerm, AcademicTermType } from 'src/repositories/school'
import FormBuilderDate from 'src/components/controls/formBuilderCustomInput/FormBuilderDate.vue'

const route = useRoute()
const $q = useQuasar()

const schoolApi = new SchoolAPI()

const schoolId = parseInt(route.params.school_id as string)
const loading = ref(false)
const saving = ref(false)
const deleting = ref(false)
const selectedNode = ref(null)
const treeData = ref<any[]>([])
const expanded = ref<number[]>([])

const school = ref<SchoolType | null>(null)

const dialog = reactive({
  show: false,
  title: '',
  edit: false,
  node: null as AcademicTerm | null,
  form: {
    id: null as number | null,
    name: null as string | null,
    type: null as AcademicTermType | null,
    academic_year: null as string | null,
    season: null as string | null,
    period: null as number | null,
    parent_id: null as number | null,
    is_active: true as boolean,
    starts_at: null as string | null,
    ends_at: null as string | null
  }
})

const deleteConfirm = reactive({
  show: false,
  node: null as AcademicTerm | null
})

const termTypeOptions = Object.entries(TERM_TYPE_LABELS).map(([value, label]) => ({
  label,
  value: value as AcademicTermType
}))

function termTypeLabel (type: AcademicTermType | null): string {
  if (!type) return 'ناشناس'
  return TERM_TYPE_LABELS[type] || type
}

async function loadTreeData () {
  loading.value = true
  try {
    const [schoolRes, terms] = await Promise.all([
      schoolApi.get(schoolId),
      schoolApi.termsIndex(schoolId)
    ])
    school.value = schoolRes
    treeData.value = buildTermTree(terms)
    expanded.value = collectExpandedIds(terms)
  } catch (e) {
    console.error(e)
    $q.notify({ type: 'negative', message: 'خطا در بارگذاری ترم‌ها' })
  } finally {
    loading.value = false
  }
}

function buildTermTree (terms: AcademicTerm[]): any[] {
  return terms.map((term) => normalizeTermNode(term))
}

function normalizeTermNode (term: AcademicTerm): any {
  return {
    id: term.id,
    label: term.name || 'بدون نام',
    subtitle: `${termTypeLabel(term.type)} ${term.academic_year ? '— ' + term.academic_year : ''}`,
    type: 'term',
    is_active: term.is_active ?? false,
    data: term,
    children: Array.isArray(term.children) ? term.children.map((child) => normalizeTermNode(child)) : []
  }
}

function collectExpandedIds (terms: AcademicTerm[]): number[] {
  const ids: number[] = []
  terms.forEach((term) => {
    if (term.id) ids.push(term.id)
    if (Array.isArray(term.children) && term.children.length) {
      ids.push(...collectExpandedIds(term.children))
    }
  })
  return ids
}

function onExpandedChange (val: readonly number[]): void {
  expanded.value = [...val]
}

function resetDialog () {
  dialog.title = ''
  dialog.edit = false
  dialog.node = null
  dialog.form = {
    id: null,
    name: null,
    type: null,
    academic_year: null,
    season: null,
    period: null,
    parent_id: null,
    is_active: true,
    starts_at: null,
    ends_at: null
  }
}

function openDialog (node: any | null) {
  resetDialog()
  if (node && node.data) {
    dialog.edit = true
    dialog.node = node.data
    dialog.title = 'ویرایش ترم'
    dialog.form.id = node.data.id
    dialog.form.name = node.data.name
    dialog.form.type = node.data.type
    dialog.form.academic_year = node.data.academic_year
    dialog.form.season = node.data.season
    dialog.form.period = node.data.period
    dialog.form.is_active = node.data.is_active ?? true
    dialog.form.starts_at = node.data.starts_at?.split('T')[0] || null
    dialog.form.ends_at = node.data.ends_at?.split('T')[0] || null
  } else {
    dialog.title = 'ترم جدید'
    dialog.form.is_active = true
  }
  dialog.show = true
}

function addChildTerm (node: any) {
  resetDialog()
  dialog.edit = false
  dialog.title = 'افزودن زیرترم'
  dialog.form.is_active = true
  if (node && node.data) {
    dialog.form.parent_id = node.data.id
  }
  dialog.show = true
}

function editTerm (node: any) {
  openDialog(node)
}

function deleteTerm (node: any) {
  deleteConfirm.node = node.data
  deleteConfirm.show = true
}

async function onSubmitDialog () {
  if (!dialog.form.name || !dialog.form.type) return

  saving.value = true
  try {
    const payload: any = {
      name: dialog.form.name,
      type: dialog.form.type,
      academic_year: dialog.form.academic_year,
      season: dialog.form.season,
      period: dialog.form.period,
      is_active: dialog.form.is_active,
      starts_at: dialog.form.starts_at,
      ends_at: dialog.form.ends_at
    }

    if (dialog.edit) {
      await schoolApi.termsUpdate(schoolId, dialog.form.id!, payload)
      $q.notify({ type: 'positive', message: 'ترم بروزرسانی شد' })
    } else {
      payload.parent_id = dialog.form.id ? null : (dialog.form as any).parent_id
      await schoolApi.termsStore(schoolId, payload)
      $q.notify({ type: 'positive', message: 'ترم ثبت شد' })
    }

    dialog.show = false
    await loadTreeData()
  } catch (e) {
    console.error(e)
    $q.notify({ type: 'negative', message: 'خطا در ذخیره ترم' })
  } finally {
    saving.value = false
  }
}

async function confirmDelete () {
  if (!deleteConfirm.node?.id) return
  deleting.value = true
  try {
    await schoolApi.termsDestroy(schoolId, deleteConfirm.node.id)
    deleteConfirm.show = false
    $q.notify({ type: 'positive', message: 'ترم حذف شد' })
    await loadTreeData()
  } catch (e) {
    console.error(e)
    $q.notify({ type: 'negative', message: 'خطا در حذف ترم' })
  } finally {
    deleting.value = false
  }
}

onMounted(() => {
  loadTreeData()
})
</script>

<style lang="scss" scoped>
.school-terms-page {
  width: 100%;
  margin: 0 auto;
}
.terms-tree {
  max-height: 600px;
  overflow-y: auto;
}
</style>
