<template>
  <div class="school-skyroom-accounts-page">
    <q-card>
      <q-card-section>
        <div class="row items-center q-col-gutter-md">
          <div class="col">
            <div class="text-h6">مدیریت اکانت‌های اسکای‌روم مدرسه</div>
            <div class="text-caption text-grey">{{ school?.name || 'در حال بارگذاری...' }}</div>
          </div>
          <div class="col-auto">
            <q-btn
              color="primary"
              icon="refresh"
              label="بروزرسانی"
              :loading="loading"
              @click="loadData" />
          </div>
          <div class="col-auto">
            <q-btn
              color="primary"
              icon="add"
              label="اکانت جدید"
              @click="openDialog()" />
          </div>
          <div
            v-if="userStore.isAdmin"
            class="col-auto">
            <q-btn
              outline
              color="primary"
              icon="list"
              label="لیست مدارس"
              :to="{ name: 'Panel.School.List' }" />
          </div>
        </div>
      </q-card-section>

      <q-separator />

      <q-card-section>
        <q-table
          flat
          bordered
          row-key="id"
          :rows="accounts"
          :columns="columns"
          :loading="loading"
          :pagination="{ rowsPerPage: 20 }"
          no-data-label="اکانت اسکای‌رومی ثبت نشده است.">
          <template #body-cell-is_active="props">
            <q-td :props="props">
              <q-chip
                :color="props.row.is_active ? 'positive' : 'grey'"
                text-color="white"
                dense>
                {{ props.row.is_active ? 'فعال' : 'غیرفعال' }}
              </q-chip>
            </q-td>
          </template>
          <template #body-cell-actions="props">
            <q-td :props="props">
              <q-btn
                flat
                round
                dense
                color="primary"
                icon="edit"
                @click="openDialog(props.row)">
                <q-tooltip>ویرایش</q-tooltip>
              </q-btn>
              <q-btn
                flat
                round
                dense
                color="negative"
                icon="delete"
                @click="removeAccount(props.row)">
                <q-tooltip>حذف</q-tooltip>
              </q-btn>
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>

    <q-dialog v-model="dialog.show">
      <q-card style="width: 520px; max-width: 95vw">
        <q-card-section class="row items-center">
          <div class="text-h6">{{ dialog.edit ? 'ویرایش اکانت اسکای‌روم' : 'اکانت اسکای‌روم جدید' }}</div>
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
          <q-form @submit.prevent="saveAccount">
            <q-input
              v-model="dialog.form.title"
              outlined
              label="عنوان اکانت *"
              :rules="requiredRules" />
            <q-input
              v-model="dialog.form.username"
              outlined
              label="نام کاربری مدیریت *"
              :rules="requiredRules" />
            <q-input
              v-model="dialog.form.api_key"
              outlined
              type="password"
              :label="dialog.edit ? 'کلید API (برای عدم تغییر خالی بماند)' : 'کلید API *'"
              :rules="dialog.edit ? [] : requiredRules" />
            <q-toggle
              v-model="dialog.form.is_active"
              label="اکانت فعال است" />
            <div class="row justify-end q-gutter-sm q-mt-md">
              <q-btn
                flat
                label="انصراف"
                @click="dialog.show = false" />
              <q-btn
                type="submit"
                color="primary"
                :label="dialog.edit ? 'بروزرسانی' : 'ثبت'"
                :loading="saving" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { useQuasar, type QTableColumn } from 'quasar'
import { useRoute } from 'vue-router'
import { useUser } from 'src/stores/user'
import { useCurrentSchool } from 'src/composables/useCurrentSchool'
import SchoolAPI, { type SchoolType } from 'src/repositories/school'
import SchoolSkyroomAccountAPI, { type SchoolSkyroomAccountType } from 'src/repositories/schoolSkyroomAccount'

const $q = useQuasar()
const route = useRoute()
const userStore = useUser()
const currentSchoolManager = useCurrentSchool()
const schoolApi = new SchoolAPI()

const loading = ref(false)
const saving = ref(false)
const school = ref<SchoolType | null>(null)
const accounts = ref<SchoolSkyroomAccountType[]>([])
const requiredRules = [(value: unknown) => !!value || 'این فیلد الزامی است']

const schoolId = computed<number | null>(() => {
  if (route.params.id) return Number(route.params.id)
  return currentSchoolManager.currentSchool.value?.id ?? null
})

const columns: QTableColumn[] = [
  { name: 'title', label: 'عنوان', field: 'title', align: 'right', sortable: true },
  { name: 'username', label: 'نام کاربری', field: 'username', align: 'right', sortable: true },
  { name: 'is_active', label: 'وضعیت', field: 'is_active', align: 'center' },
  { name: 'actions', label: 'عملیات', field: () => '', align: 'left' }
]

const dialog = reactive({
  show: false,
  edit: false,
  form: {
    id: null as number | null,
    title: '',
    username: '',
    api_key: '',
    is_active: true
  }
})

function openDialog (account?: SchoolSkyroomAccountType) {
  dialog.edit = !!account
  dialog.form = {
    id: account?.id ?? null,
    title: account?.title ?? '',
    username: account?.username ?? '',
    api_key: '',
    is_active: account?.is_active ?? true
  }
  dialog.show = true
}

async function loadData () {
  if (!schoolId.value) return
  loading.value = true
  try {
    const accountApi = new SchoolSkyroomAccountAPI(schoolId.value)
    const [schoolResponse, accountResponse] = await Promise.all([
      schoolApi.get(schoolId.value),
      accountApi.index({ length: 1000, sortation_field: 'created_at', sortation_order: 'desc' })
    ])
    school.value = schoolResponse
    accounts.value = accountResponse.data
  } catch (error) {
    console.error(error)
    $q.notify({ type: 'negative', message: 'خطا در بارگذاری اکانت‌های اسکای‌روم' })
  } finally {
    loading.value = false
  }
}

async function saveAccount () {
  if (!schoolId.value || !dialog.form.title || !dialog.form.username) return
  saving.value = true
  try {
    const accountApi = new SchoolSkyroomAccountAPI(schoolId.value)
    const payload: SchoolSkyroomAccountType = {
      ...accountApi.defaultObject,
      title: dialog.form.title,
      username: dialog.form.username,
      api_key: dialog.form.api_key || null,
      is_active: dialog.form.is_active
    }
    if (dialog.edit && dialog.form.id) {
      await accountApi.update(dialog.form.id, payload)
    } else {
      await accountApi.create(payload)
    }
    dialog.show = false
    await loadData()
    $q.notify({ type: 'positive', message: 'اکانت اسکای‌روم با موفقیت ذخیره شد.' })
  } catch (error) {
    console.error(error)
    $q.notify({ type: 'negative', message: 'خطا در ذخیره اکانت اسکای‌روم' })
  } finally {
    saving.value = false
  }
}

function removeAccount (account: SchoolSkyroomAccountType) {
  if (!schoolId.value || !account.id) return
  $q.dialog({
    title: 'حذف اکانت اسکای‌روم',
    message: `آیا از حذف «${account.title}» مطمئن هستید؟ اتاق‌های مرتبط نیز حذف می‌شوند.`,
    cancel: true,
    persistent: true
  }).onOk(async () => {
    try {
      await new SchoolSkyroomAccountAPI(schoolId.value!).delete(account.id!)
      await loadData()
      $q.notify({ type: 'positive', message: 'اکانت اسکای‌روم حذف شد.' })
    } catch (error) {
      console.error(error)
      $q.notify({ type: 'negative', message: 'خطا در حذف اکانت اسکای‌روم' })
    }
  })
}

onMounted(loadData)
</script>

<style scoped>
.school-skyroom-accounts-page {
  width: 100%;
  margin: 0 auto;
}
</style>
