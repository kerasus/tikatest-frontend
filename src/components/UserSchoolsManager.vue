<template>
  <q-card class="q-mb-md">
    <q-card-section>
      <div class="text-h6">مدارس کاربر</div>
    </q-card-section>
    <q-separator />

    <q-card-section v-if="!readonly">
      <div class="text-subtitle2 q-mb-sm">افزودن مدرسه جدید</div>
      <q-form @submit.prevent="onSubmitNew">
        <div class="row q-col-gutter-md items-end">
          <div class="col-12 col-md-3">
            <form-builder-select-school
              v-model:value="newForm.school_id"
              label="مدرسه *"
              outlined
              :rules="[val => !!val || 'انتخاب مدرسه الزامی است']" />
          </div>
          <div class="col-12 col-md-3">
            <q-input
              v-model="newForm.personnel_code"
              label="کد پرسنلی"
              outlined
              clearable />
          </div>
          <div class="col-12 col-md-2">
            <form-builder-date
              v-model:value="newForm.joined_at"
              label="تاریخ شروع"
              outlined />
          </div>
          <div class="col-12 col-md-2">
            <form-builder-date
              v-model:value="newForm.left_at"
              label="تاریخ پایان"
              outlined />
          </div>
          <div class="col-12 col-md-2 flex items-end">
            <q-checkbox
              v-model="newForm.is_active"
              label="فعال" />
          </div>
          <div class="col-12">
            <q-btn
              type="submit"
              color="primary"
              label="افزودن"
              :loading="saving" />
          </div>
        </div>
      </q-form>
    </q-card-section>

    <q-card-section>
      <div
        v-if="localSchoolUsers.length > 0"
        class="text-subtitle2 q-mb-sm">
        مدارس ثبت شده
      </div>

      <q-list
        v-if="localSchoolUsers.length > 0"
        bordered
        pop>
        <q-expansion-item
          v-for="item in localSchoolUsers"
          :key="item.id"
          dense
          header-class="q-py-sm">
          <template #header>
            <q-item-section
              side
              top>
              <q-avatar
                icon="school"
                color="primary"
                text-color="white"
                size="32px" />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ item?.name || '-' }}</q-item-label>
              <q-item-label caption>
                {{ item?.code || '' }}
                <template v-if="item.pivot?.personnel_code">
                  - {{ item.pivot?.personnel_code }}
                </template>
              </q-item-label>
            </q-item-section>
            <q-item-section
              v-if="item.pivot?.is_active"
              side>
              <q-chip
                color="positive"
                text-color="white"
                dense
                square
                size="sm">
                فعال
              </q-chip>
            </q-item-section>
            <q-item-section
              v-else
              side>
              <q-chip
                color="grey-4"
                text-color="white"
                dense
                square
                size="sm">
                غیرفعال
              </q-chip>
            </q-item-section>
            <q-item-section
              v-if="!readonly"
              side>
              <q-btn
                flat
                dense
                round
                icon="delete"
                color="negative"
                size="sm"
                @click.stop="confirmDelete(item)">
                <q-tooltip>حذف</q-tooltip>
              </q-btn>
            </q-item-section>
          </template>

          <div class="row q-col-gutter-md q-px-md q-pb-md">
            <div class="col-12 col-md-4">
              <q-input
                v-model="editForms[item.id!].personnel_code"
                label="کد پرسنلی"
                outlined
                clearable />
            </div>
            <div class="col-12 col-md-4">
              <form-builder-date
                v-model:value="editForms[item.id!].joined_at"
                label="تاریخ شروع"
                outlined />
            </div>
            <div class="col-12 col-md-4">
              <form-builder-date
                v-model:value="editForms[item.id!].left_at"
                label="تاریخ پایان"
                outlined />
            </div>
            <div class="col-12 col-md-4">
              <q-checkbox
                v-model="editForms[item.id!].is_active"
                label="فعال" />
            </div>
            <div class="col-12">
              <q-btn
                color="primary"
                label="ذخیره"
                :loading="savingId === item.id"
                @click="saveSchoolUser(item)" />
            </div>
          </div>
        </q-expansion-item>
      </q-list>

      <div
        v-if="localSchoolUsers.length === 0"
        class="text-center text-grey q-py-md">
        هیچ مدرسه‌ای ثبت نشده است.
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { ref, reactive, watch, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { schoolUser } from 'src/repositories/schoolUser'
import FormBuilderDate from 'src/components/controls/formBuilderCustomInput/FormBuilderDate.vue'
import FormBuilderSelectSchool from 'src/components/controls/formBuilderCustomInput/FormBuilderSelectSchool.vue'
import { UserSchoolPivoteType } from 'src/repositories/user'

const props = defineProps({
  userId: {
    type: Number,
    default: null
  },
  schoolUsers: {
    type: Array as () => UserSchoolPivoteType[],
    default: () => []
  },
  readonly: {
    type: Boolean,
    default: false
  }
})

const $q = useQuasar()
const emit = defineEmits(['updated'])

const localSchoolUsers = ref<UserSchoolPivoteType[]>([...props.schoolUsers])
const editForms = ref<Record<number, {
  personnel_code: string | null
  is_active: boolean
  joined_at: string | null
  left_at: string | null
}>>({})
const savingId = ref<number | null>(null)
const saving = ref(false)

const newForm = reactive({
  school_id: null as number | null,
  personnel_code: null as string | null,
  is_active: true,
  joined_at: null as string | null,
  left_at: null as string | null
})

async function loadSchoolUsers () {
  localSchoolUsers.value = props.schoolUsers
}

function resetNewForm () {
  newForm.school_id = null
  newForm.personnel_code = null
  newForm.is_active = true
  newForm.joined_at = null
  newForm.left_at = null
}

function initEditForms () {
  editForms.value = {}
  localSchoolUsers.value.forEach((item) => {
    if (item.id) {
      editForms.value[item.id] = {
        personnel_code: item.pivot?.personnel_code ?? null,
        is_active: item.pivot?.is_active ?? true,
        joined_at: item.pivot?.joined_at ?? null,
        left_at: item.pivot?.left_at ?? null
      }
    }
  })
}

async function onSubmitNew () {
  if (!newForm.school_id) {
    $q.notify({
      type: 'negative',
      message: 'انتخاب مدرسه الزامی است.'
    })
    return
  }

  if (!props.userId) {
    $q.notify({
      type: 'negative',
      message: 'شناسه کاربر یافت نشد.'
    })
    return
  }

  saving.value = true
  try {
    await schoolUser.create({
      school_id: newForm.school_id,
      user_id: props.userId,
      personnel_code: newForm.personnel_code,
      is_active: newForm.is_active,
      joined_at: newForm.joined_at,
      left_at: newForm.left_at
    } as any)
    $q.notify({
      type: 'positive',
      message: 'مدرسه با موفقیت افزوده شد.'
    })
    resetNewForm()
    emit('updated')
  } catch (error: any) {
    $q.notify({
      type: 'negative',
      message: 'خطا در افزودن مدرسه.'
    })
  } finally {
    saving.value = false
  }
}

async function saveSchoolUser (item: UserSchoolPivoteType) {
  savingId.value = item.id ?? null
  try {
    const form = editForms.value[item.id!]
    await schoolUser.update(item.id!, {
      personnel_code: form.personnel_code,
      is_active: form.is_active,
      joined_at: form.joined_at,
      left_at: form.left_at
    } as any)
    $q.notify({
      type: 'positive',
      message: 'اطلاعات مدرسه با موفقیت به‌روزرسانی شد.'
    })
    emit('updated')
  } catch (error: any) {
    $q.notify({
      type: 'negative',
      message: 'خطا در به‌روزرسانی اطلاعات.'
    })
  } finally {
    savingId.value = null
  }
}

function confirmDelete (item: UserSchoolPivoteType) {
  $q.dialog({
    title: 'تایید حذف',
    message: `مدرسه ${item?.name || item.id} از کاربر جدا شود؟`,
    cancel: true,
    persistent: true
  }).onOk(async () => {
    try {
      await schoolUser.delete(item.id!)
      $q.notify({
        type: 'positive',
        message: 'مدرسه با موفقیت حذف شد.'
      })
      emit('updated')
    } catch (error: any) {
      $q.notify({
        type: 'negative',
        message: 'خطا در حذف مدرسه.'
      })
    }
  })
}

watch(() => props.schoolUsers, () => {
  if (props.schoolUsers.length > 0) {
    loadSchoolUsers()
    initEditForms()
  }
}, { deep: true })

onMounted(() => {
  loadSchoolUsers()
})
</script>
