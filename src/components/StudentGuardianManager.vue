<template>
  <q-card class="q-mb-md">
    <q-card-section>
      <div class="text-h6">وصیان دانش‌آموز</div>
    </q-card-section>
    <q-separator />

    <q-card-section v-if="!readonly">
      <div class="text-subtitle2 q-mb-sm">افزودن وصی جدید</div>
      <q-form @submit.prevent="onSubmitNew">
        <div class="row q-col-gutter-md items-end">
          <div class="col-12 col-md-3">
            <q-input
              v-model="newForm.first_name"
              label="نام *"
              outlined
              clearable
              :rules="[(val) => !!val || 'نام الزامی است']" />
          </div>
          <div class="col-12 col-md-3">
            <q-input
              v-model="newForm.last_name"
              label="نام خانوادگی *"
              outlined
              clearable
              :rules="[(val) => !!val || 'نام خانوادگی الزامی است']" />
          </div>
          <div class="col-12 col-md-3">
            <q-input
              v-model="newForm.mobile"
              label="تلفن همراه"
              outlined
              clearable />
          </div>
          <div class="col-12 col-md-3">
            <q-input
              v-model="newForm.password"
              type="password"
              label="رمز عبور *"
              outlined
              clearable
              :rules="[(val) => !!val || 'رمز عبور الزامی است']" />
          </div>
          <div class="col-12 col-md-3">
            <q-select
              v-model="newForm.relationship_type"
              :options="relationshipOptions"
              label="نوع رابطه *"
              outlined
              clearable
              emit-value
              map-options
              :rules="[(val) => !!val || 'نوع رابطه الزامی است']" />
          </div>
          <div class="col-12 col-md-3">
            <q-input
              v-model="newForm.job"
              label="شغل"
              outlined
              clearable />
          </div>
          <div class="col-12 col-md-3">
            <q-checkbox
              v-model="newForm.is_primary_contact"
              label="تماس اصلی" />
          </div>
          <div class="col-12 flex items-end q-mt-sm">
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
      <template v-if="localGuardians.length > 0">
        <div class="text-subtitle2 q-mb-sm">وصیان ثبت شده</div>
        <q-list bordered>
          <q-expansion-item
            v-for="guardian in localGuardians"
            :key="guardian.id"
            dense
            header-class="q-py-sm">
            <template #header>
              <q-item-section
                side
                top>
                <q-avatar
                  icon="person"
                  color="primary"
                  text-color="white"
                  size="32px" />
              </q-item-section>
              <q-item-section>
                <q-item-label>
                  {{ guardian.user?.first_name }} {{ guardian.user?.last_name }}
                  <q-btn
                    outline
                    icon="phone"
                    dense
                    color="primary"
                    @click="copyText(guardian.user.mobile)">
                    {{ guardian.user.mobile }}
                  </q-btn>
                </q-item-label>
                <q-item-label caption>
                  {{ getRelationshipLabel(guardian.relationship_type) }}
                  <template v-if="guardian.job"> - {{ guardian.job }} </template>
                </q-item-label>
              </q-item-section>
              <q-item-section
                v-if="guardian.is_primary_contact"
                side>
                <q-chip
                  color="primary"
                  text-color="white"
                  dense
                  square
                  size="sm">
                  تماس اصلی
                </q-chip>
              </q-item-section>
              <q-item-section
                v-if="!readonly"
                side>
                <q-btn
                  flat
                  dense
                  round
                  icon="open_in_new"
                  color="primary"
                  size="sm"
                  @click.stop="openUserShow(guardian)">
                  <q-tooltip>نمایش کاربر</q-tooltip>
                </q-btn>
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
                  @click.stop="confirmDelete(guardian)">
                  <q-tooltip>حذف</q-tooltip>
                </q-btn>
              </q-item-section>
            </template>

            <div
              v-if="editForms[guardian.id!]"
              class="row q-col-gutter-md q-px-md q-pb-md">
              <div class="col-12 col-md-4">
                <q-input
                  v-model="editForms[guardian.id!].job"
                  label="شغل"
                  outlined
                  clearable />
              </div>
              <div class="col-12 col-md-4">
                <q-select
                  v-model="editForms[guardian.id!].relationship_type"
                  :options="relationshipOptions"
                  label="نوع رابطه"
                  outlined
                  clearable
                  emit-value
                  map-options />
              </div>
              <div class="col-12 col-md-4 flex items-end">
                <q-checkbox
                  v-model="editForms[guardian.id!].is_primary_contact"
                  label="تماس اصلی" />
              </div>
              <div class="col-12 flex items-end q-mt-sm">
                <q-btn
                  color="primary"
                  label="ذخیره"
                  :loading="savingId === guardian.id"
                  @click="saveGuardian(guardian)" />
              </div>
            </div>
          </q-expansion-item>
        </q-list>
      </template>

      <template v-else>
        <div class="text-center text-grey q-py-md">هیچ وصی ثبت نشده است.</div>
      </template>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { ref, reactive, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { copyToClipboard, Notify, useQuasar } from 'quasar'
import { studentGuardian } from 'src/repositories/studentGuardian'
import type { StudentGuardianType } from 'src/repositories/student'

const props = defineProps({
  studentProfileId: {
    type: Number,
    default: null
  },
  guardians: {
    type: Array as () => StudentGuardianType[],
    default: () => []
  },
  readonly: {
    type: Boolean,
    default: false
  }
})

const $q = useQuasar()
const router = useRouter()
const emit = defineEmits(['updated'])

const localGuardians = ref<StudentGuardianType[]>([...props.guardians])
const editForms = ref<
  Record<
    number,
    {
      relationship_type: string | null;
      job: string | null;
      is_primary_contact: boolean;
    }
  >
>({})
const savingId = ref<number | null>(null)
const saving = ref(false)

const relationshipOptions = [
  { label: 'پدر', value: 'father' },
  { label: 'مادر', value: 'mother' },
  { label: 'سایر', value: 'guardian' }
]

const newForm = reactive({
  first_name: null as string | null,
  last_name: null as string | null,
  mobile: null as string | null,
  password: null as string | null,
  relationship_type: null as string | null,
  job: null as string | null,
  is_primary_contact: false
})

function getRelationshipLabel (value: string | null): string {
  if (!value) return '-'
  const labels: Record<string, string> = {
    father: 'پدر',
    mother: 'مادر',
    guardian: 'سایر'
  }
  return labels[value] || value
}

function resetNewForm () {
  newForm.first_name = null
  newForm.last_name = null
  newForm.mobile = null
  newForm.password = null
  newForm.relationship_type = null
  newForm.job = null
  newForm.is_primary_contact = false
}

function initEditForms () {
  editForms.value = {}
  localGuardians.value.forEach((g) => {
    if (g.id) {
      editForms.value[g.id] = {
        relationship_type: g.relationship_type,
        job: g.job ?? null,
        is_primary_contact: g.is_primary_contact ?? false
      }
    }
  })
}

function openUserShow (guardian: StudentGuardianType) {
  if (!guardian.user_id) return
  const route = router.resolve({
    name: 'Panel.User.Show',
    params: { id: guardian.user_id }
  })
  window.open(route.href, '_blank')
}

async function onSubmitNew () {
  if (
    !newForm.first_name ||
    !newForm.last_name ||
    !newForm.password ||
    !newForm.relationship_type
  ) {
    $q.notify({
      type: 'negative',
      message: 'فیلدهای نام، نام خانوادگی، رمز عبور و نوع رابطه الزامی هستند.'
    })
    return
  }

  if (!props.studentProfileId) {
    $q.notify({
      type: 'negative',
      message: 'شناسه پروفایل دانش‌آموز یافت نشد.'
    })
    return
  }

  saving.value = true
  try {
    await studentGuardian.createWithUser({
      first_name: newForm.first_name,
      last_name: newForm.last_name,
      mobile: newForm.mobile,
      password: newForm.password,
      student_profile_id: props.studentProfileId,
      relationship_type: newForm.relationship_type,
      job: newForm.job,
      is_primary_contact: newForm.is_primary_contact
    })
    $q.notify({
      type: 'positive',
      message: 'وصی با موفقیت افزوده شد.'
    })
    resetNewForm()
    emit('updated')
  } catch (error: any) {
    $q.notify({
      type: 'negative',
      message: 'خطا در افزودن وصی.'
    })
  } finally {
    saving.value = false
  }
}

async function saveGuardian (guardian: StudentGuardianType) {
  savingId.value = guardian.id ?? null
  try {
    const form = editForms.value[guardian.id!]
    await studentGuardian.update(guardian.id!, {
      relationship_type: form.relationship_type,
      job: form.job,
      is_primary_contact: form.is_primary_contact
    } as any)
    $q.notify({
      type: 'positive',
      message: 'وصی با موفقیت به‌روزرسانی شد.'
    })
    emit('updated')
  } catch (error: any) {
    $q.notify({
      type: 'negative',
      message: 'خطا در به‌روزرسانی وصی.'
    })
  } finally {
    savingId.value = null
  }
}

function confirmDelete (guardian: StudentGuardianType) {
  $q.dialog({
    title: 'تایید حذف',
    message: `وصی ${guardian.user?.full_name || guardian.id} حذف شود؟`,
    cancel: true,
    persistent: true
  }).onOk(async () => {
    try {
      await studentGuardian.delete(guardian.id!)
      $q.notify({
        type: 'positive',
        message: 'وصی با موفقیت حذف شد.'
      })
      emit('updated')
    } catch (error: any) {
      $q.notify({
        type: 'negative',
        message: 'خطا در حذف وصی.'
      })
    }
  })
}

function copyText (text: string) {
  copyToClipboard(String(text))
    .then(() => Notify.create({ type: 'positive', message: 'کپی شد' }))
    .catch(() => Notify.create({ type: 'negative', message: 'کپی ناموفق بود' }))
}

watch(
  () => props.guardians,
  () => {
    localGuardians.value = [...props.guardians]
    initEditForms()
  },
  { deep: true }
)
</script>
