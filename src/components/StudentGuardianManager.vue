<template>
  <q-card
    flat
    bordered
    class="rounded-borders q-mb-md">
    <!-- هدر کارت -->
    <q-card-section class="bg-blue-grey-1 q-py-sm">
      <div class="row items-center justify-between">
        <div class="row items-center">
          <q-avatar
            size="32px"
            color="deep-purple-7"
            text-color="white"
            icon="supervised_user_circle"
            class="q-mr-sm shadow-1" />
          <div>
            <div class="text-subtitle1 text-weight-bold text-blue-grey-10">
              اولیا و سرپرستان دانش‌آموز
            </div>
            <div class="text-caption text-grey-7">
              اطلاعات پدر، مادر یا سرپرست قانونی و تنظیم فرد پاسخگوی اصلی
            </div>
          </div>
        </div>

        <q-badge
          color="deep-purple-1"
          text-color="deep-purple-9"
          class="text-weight-bold q-px-sm q-py-xs">
          ثبت‌شده: {{ localGuardians.length }} نفر
        </q-badge>
      </div>
    </q-card-section>

    <q-separator />

    <q-card-section class="q-pa-md">
      <!-- فرم افزودن وصی / سرپرست جدید در حالت ویرایش -->
      <div
        v-if="!readonly"
        class="bg-grey-1 q-pa-md rounded-borders border q-mb-md">
        <div class="text-caption text-weight-bold text-grey-8 q-mb-sm flex items-center">
          <q-icon
            name="person_add"
            color="deep-purple-7"
            size="16px"
            class="q-mr-xs" />
          افزودن اطلاعات سرپرست جدید:
        </div>

        <q-form @submit.prevent="onSubmitNew">
          <div class="row q-col-gutter-md">
            <!-- نام -->
            <div class="col-12 col-sm-6 col-md-3">
              <q-input
                v-model="newForm.first_name"
                label="نام *"
                outlined
                dense
                clearable
                :rules="[(val) => !!val || 'نام الزامی است']" />
            </div>

            <!-- نام خانوادگی -->
            <div class="col-12 col-sm-6 col-md-3">
              <q-input
                v-model="newForm.last_name"
                label="نام خانوادگی *"
                outlined
                dense
                clearable
                :rules="[(val) => !!val || 'نام خانوادگی الزامی است']" />
            </div>

            <!-- تلفن همراه -->
            <div class="col-12 col-sm-6 col-md-3">
              <q-input
                v-model="newForm.mobile"
                label="تلفن همراه"
                outlined
                dense
                dir="ltr"
                clearable />
            </div>

            <!-- رمز عبور -->
            <div class="col-12 col-sm-6 col-md-3">
              <q-input
                v-model="newForm.password"
                type="password"
                label="رمز عبور پنل *"
                outlined
                dense
                dir="ltr"
                clearable
                :rules="[(val) => !!val || 'رمز عبور الزامی است']" />
            </div>

            <!-- نوع رابطه -->
            <div class="col-12 col-sm-6 col-md-3">
              <q-select
                v-model="newForm.relationship_type"
                :options="relationshipOptions"
                label="نسبت با دانش‌آموز *"
                outlined
                dense
                clearable
                emit-value
                map-options
                :rules="[(val) => !!val || 'نوع رابطه الزامی است']" />
            </div>

            <!-- شغل -->
            <div class="col-12 col-sm-6 col-md-3">
              <q-input
                v-model="newForm.job"
                label="شغل / زمینه فعالیت"
                outlined
                dense
                clearable />
            </div>

            <!-- تماس اصلی -->
            <div class="col-12 col-sm-6 col-md-3">
              <div class="bg-white q-px-sm q-py-xs rounded-borders border row items-center justify-between full-height">
                <span class="text-caption text-grey-8">تماس و پاسخگوی اصلی</span>
                <q-checkbox
                  v-model="newForm.is_primary_contact"
                  color="deep-purple-7"
                  dense />
              </div>
            </div>

            <!-- دکمه سابمیت -->
            <div class="col-12 col-sm-6 col-md-3 flex items-center">
              <q-btn
                type="submit"
                unelevated
                color="deep-purple-7"
                icon="add"
                label="ثبت و ذخیره سرپرست"
                class="full-width"
                style="height: 40px"
                :loading="saving" />
            </div>
          </div>
        </q-form>
      </div>

      <!-- لیست سرپرستان ثبت شده -->
      <template v-if="localGuardians.length > 0">
        <div class="text-caption text-weight-bold text-grey-8 q-mb-sm flex items-center">
          <q-icon
            name="format_list_bulleted"
            color="deep-purple-7"
            size="16px"
            class="q-mr-xs" />
          لیست اولیای ثبت‌شده:
        </div>

        <q-list
          bordered
          separator
          class="rounded-borders">
          <q-expansion-item
            v-for="guardian in localGuardians"
            :key="guardian.id"
            dense
            header-class="q-py-sm"
            :default-opened="!readonly">
            <template #header>
              <!-- آواتار بر اساس نسبت -->
              <q-item-section avatar>
                <q-avatar
                  :icon="guardian.relationship_type === 'mother' ? 'face_3' : 'face_6'"
                  color="deep-purple-1"
                  text-color="deep-purple-8"
                  size="36px" />
              </q-item-section>

              <!-- مشخصات و تلفن -->
              <q-item-section>
                <div class="row items-center q-gutter-x-sm">
                  <span class="text-weight-bold text-blue-grey-10 text-body2">
                    {{ guardian.user?.first_name }} {{ guardian.user?.last_name }}
                  </span>

                  <!-- شماره موبایل با کپی -->
                  <q-chip
                    v-if="guardian.user?.mobile"
                    dense
                    size="sm"
                    clickable
                    color="grey-2"
                    text-color="grey-9"
                    class="font-monospace q-px-xs"
                    @click.stop="copyText(guardian.user.mobile)">
                    <q-icon
                      name="phone"
                      size="12px"
                      class="q-mr-xs text-primary" />
                    {{ guardian.user.mobile }}
                    <q-icon
                      name="content_copy"
                      size="12px"
                      class="q-ml-xs text-grey-6" />
                    <q-tooltip>کپی شماره همراه</q-tooltip>
                  </q-chip>
                </div>

                <!-- نسبت و شغل -->
                <q-item-label
                  caption
                  class="q-mt-xs text-grey-7">
                  <span class="text-weight-bold text-deep-purple-8">
                    {{ getRelationshipLabel(guardian.relationship_type) }}
                  </span>
                  <template v-if="guardian.job">
                    <span class="q-mx-xs">•</span>
                    <span>شغل: {{ guardian.job }}</span>
                  </template>
                </q-item-label>
              </q-item-section>

              <!-- نشان تماس اصلی -->
              <q-item-section
                v-if="guardian.is_primary_contact"
                side>
                <q-chip
                  color="positive"
                  text-color="white"
                  dense
                  size="sm"
                  class="text-weight-bold">
                  <q-icon
                    name="star"
                    size="12px"
                    class="q-mr-xs" />
                  تماس اصلی
                </q-chip>
              </q-item-section>

              <!-- دکمه نمایش کاربر -->
              <q-item-section
                v-if="!readonly"
                side>
                <div class="row items-center q-gutter-x-xs">
                  <q-btn
                    flat
                    dense
                    round
                    icon="open_in_new"
                    color="primary"
                    size="sm"
                    @click.stop="openUserShow(guardian)">
                    <q-tooltip>نمایش پروفایل کاربری</q-tooltip>
                  </q-btn>

                  <q-btn
                    flat
                    dense
                    round
                    icon="delete_outline"
                    color="negative"
                    size="sm"
                    @click.stop="confirmDelete(guardian)">
                    <q-tooltip>حذف سرپرست</q-tooltip>
                  </q-btn>
                </div>
              </q-item-section>
            </template>

            <!-- بخش فرم ادیت درون آکاردئون -->
            <div
              v-if="editForms[guardian.id!] && !readonly"
              class="bg-grey-1 q-pa-md border-top">
              <div class="text-caption text-weight-bold text-grey-7 q-mb-sm">ویرایش مشخصات این سرپرست:</div>
              <div class="row q-col-gutter-md items-center">
                <div class="col-12 col-md-4">
                  <q-input
                    v-model="editForms[guardian.id!].job"
                    label="شغل / زمینه فعالیت"
                    outlined
                    dense
                    bg-color="white"
                    clearable />
                </div>

                <div class="col-12 col-md-4">
                  <q-select
                    v-model="editForms[guardian.id!].relationship_type"
                    :options="relationshipOptions"
                    label="نوع نسبت"
                    outlined
                    dense
                    bg-color="white"
                    clearable
                    emit-value
                    map-options />
                </div>

                <div class="col-12 col-md-2">
                  <div
                    class="bg-white q-px-sm q-py-xs rounded-borders border row items-center justify-between"
                    style="height: 40px">
                    <span class="text-caption text-grey-8">تماس اصلی</span>
                    <q-checkbox
                      v-model="editForms[guardian.id!].is_primary_contact"
                      color="deep-purple-7"
                      dense />
                  </div>
                </div>

                <div class="col-12 col-md-2">
                  <q-btn
                    unelevated
                    color="deep-purple-7"
                    icon="check"
                    label="ذخیره"
                    class="full-width"
                    style="height: 40px"
                    :loading="savingId === guardian.id"
                    @click="saveGuardian(guardian)" />
                </div>
              </div>
            </div>
          </q-expansion-item>
        </q-list>
      </template>

      <!-- حالت خالی -->
      <div
        v-else
        class="column items-center justify-center q-pa-lg text-grey-6">
        <q-icon
          name="family_restroom"
          size="42px"
          color="grey-4" />
        <div class="text-caption q-mt-sm">
          {{ readonly ? 'هیچ سرپرستی برای این دانش‌آموز ثبت نشده است.' : 'هنوز سرپرستی ثبت نشده است. از فرم بالا برای ثبت استفاده کنید.' }}
        </div>
      </div>
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

const emit = defineEmits(['updated'])
const $q = useQuasar()
const router = useRouter()
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
