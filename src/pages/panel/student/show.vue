<template>
  <div class="student-show-page">
    <!-- وضعیت در حال لودینگ -->
    <div
      v-if="loading"
      class="column items-center justify-center q-pa-xl text-grey-7">
      <q-spinner-dots
        color="primary"
        size="48px" />
      <div class="text-caption q-mt-md">در حال بارگذاری پرونده دانش‌آموز...</div>
    </div>

    <!-- پرونده دانش‌آموز -->
    <template v-else-if="studentData">
      <!-- کارت اصلی مشخصات فردی دانش‌آموز -->
      <q-card
        flat
        bordered
        class="rounded-borders q-mb-md">
        <!-- هدر کارت با دکمه‌های کنترلی -->
        <q-card-section class="bg-blue-grey-1 q-py-sm">
          <div class="row items-center justify-between">
            <div class="row items-center">
              <q-avatar
                size="32px"
                color="primary"
                text-color="white"
                icon="badge"
                class="q-mr-sm shadow-1" />
              <div>
                <div class="text-subtitle1 text-weight-bold text-blue-grey-10">
                  شناسنامه و پرونده تحصیلی دانش‌آموز
                </div>
                <div class="text-caption text-grey-7">
                  اطلاعات هویتی، وضعیت ثبت‌نام، اطلاعات تماس و دسترسی‌های سریع
                </div>
              </div>
            </div>

            <div class="row items-center q-gutter-x-sm">
              <q-btn
                color="primary"
                icon="edit"
                label="ویرایش مشخصات"
                :to="{ name: 'Panel.Student.Edit', params: { id: studentData.id } }" />
            </div>
          </div>
        </q-card-section>

        <q-separator />

        <!-- سکشن بالایی پروفایل (آواتار و اطلاعات شاخص) -->
        <q-card-section class="q-pa-md bg-grey-1">
          <div class="row items-center justify-between q-col-gutter-md">
            <!-- تصویر و نام -->
            <div class="col-12 col-md-auto">
              <div class="row items-center q-gutter-x-md">
                <q-avatar
                  size="72px"
                  class="shadow-2 border bg-white">
                  <q-img :src="studentData.picture || '/images/blankProfile.png'">
                    <template #error>
                      <q-icon
                        name="person"
                        size="40px"
                        color="grey-5" />
                    </template>
                  </q-img>
                </q-avatar>

                <div>
                  <div class="text-h6 text-weight-bolder text-blue-grey-10">
                    {{ (studentData.first_name || '-') }} {{ (studentData.last_name || '') }}
                  </div>
                  <div class="row items-center q-gutter-x-xs q-mt-xs">
                    <q-badge
                      v-if="studentData.username"
                      color="blue-grey-2"
                      text-color="blue-grey-9"
                      class="q-pa-xs cursor-pointer"
                      @click="copyText(studentData.username)">
                      <q-icon
                        name="account_circle"
                        size="14px"
                        class="q-mr-xs" />
                      نام کاربری: <span class="font-monospace q-mx-xs">{{ studentData.username }}</span>
                      <q-icon
                        name="content_copy"
                        size="12px" />
                      <q-tooltip>کپی نام کاربری</q-tooltip>
                    </q-badge>
                  </div>
                </div>
              </div>
            </div>
            <!-- دکمه‌های دسترسی سریع در هدر -->
            <div class="col-12 col-md-auto">
              <div class="row items-center q-gutter-sm">
                <q-btn
                  outline
                  dense
                  color="primary"
                  icon="assessment"
                  label="کارنامه و نمرات"
                  class="q-px-sm"
                  :to="{ name: 'Student.Grade.List', params: { studentId: studentData.id } }" />

                <q-btn
                  outline
                  dense
                  color="deep-orange"
                  icon="assignment"
                  label="تکالیف دانش‌آموز"
                  class="q-px-sm"
                  :to="{ name: 'Student.Homework.List', params: { studentId: studentData.id } }" />
              </div>
            </div>

          </div>
        </q-card-section>

        <q-separator />

        <!-- فیلدهای جامع اطلاعات هویتی و تماسی -->
        <q-card-section class="q-pa-md">
          <div class="row q-col-gutter-md">
            <!-- ستون ۱: اطلاعات هویتی -->
            <div class="col-12 col-md-6">
              <div class="text-caption text-weight-bold text-grey-8 q-mb-sm flex items-center">
                <q-icon
                  name="fingerprint"
                  color="primary"
                  size="16px"
                  class="q-mr-xs" />
                مشخصات فردی و سجلی:
              </div>

              <div class="row q-col-gutter-sm">
                <div class="col-12 col-sm-6">
                  <div class="bg-grey-1 q-pa-sm rounded-borders border">
                    <div class="text-caption text-grey-7">نام</div>
                    <div class="text-body2 text-weight-bold text-blue-grey-10 q-mt-xs">
                      {{ studentData.first_name || '-' }}
                    </div>
                  </div>
                </div>

                <div class="col-12 col-sm-6">
                  <div class="bg-grey-1 q-pa-sm rounded-borders border">
                    <div class="text-caption text-grey-7">نام خانوادگی</div>
                    <div class="text-body2 text-weight-bold text-blue-grey-10 q-mt-xs">
                      {{ studentData.last_name || '-' }}
                    </div>
                  </div>
                </div>

                <div class="col-12 col-sm-6">
                  <div class="bg-grey-1 q-pa-sm rounded-borders border row items-center justify-between">
                    <div>
                      <div class="text-caption text-grey-7">کد ملی</div>
                      <div class="text-body2 text-weight-bold text-blue-grey-10 q-mt-xs font-monospace">
                        {{ studentData.national_id || '-' }}
                      </div>
                    </div>
                    <q-btn
                      v-if="studentData.national_id"
                      flat
                      round
                      dense
                      icon="content_copy"
                      size="sm"
                      color="grey-7"
                      @click="copyText(studentData.national_id)">
                      <q-tooltip>کپی کد ملی</q-tooltip>
                    </q-btn>
                  </div>
                </div>

                <div class="col-12 col-sm-6">
                  <div class="bg-grey-1 q-pa-sm rounded-borders border">
                    <div class="text-caption text-grey-7">تاریخ تولد</div>
                    <div class="text-body2 text-weight-bold text-blue-grey-10 q-mt-xs">
                      {{ studentData.birth_date ? toShamsiDate(studentData.birth_date) : '-' }}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- ستون ۲: اطلاعات ارتباطی و تماس -->
            <div class="col-12 col-md-6">
              <div class="text-caption text-weight-bold text-grey-8 q-mb-sm flex items-center">
                <q-icon
                  name="contact_phone"
                  color="teal"
                  size="16px"
                  class="q-mr-xs" />
                اطلاعات تماس و سکونت:
              </div>

              <div class="row q-col-gutter-sm">
                <div class="col-12 col-sm-6">
                  <div class="bg-grey-1 q-pa-sm rounded-borders border row items-center justify-between">
                    <div>
                      <div class="text-caption text-grey-7">شماره همراه</div>
                      <div
                        class="text-body2 text-weight-bold text-blue-grey-10 q-mt-xs font-monospace"
                        dir="ltr">
                        {{ studentData.mobile || '-' }}
                      </div>
                    </div>
                    <q-btn
                      v-if="studentData.mobile"
                      flat
                      round
                      dense
                      icon="content_copy"
                      size="sm"
                      color="grey-7"
                      @click="copyText(studentData.mobile)">
                      <q-tooltip>کپی شماره همراه</q-tooltip>
                    </q-btn>
                  </div>
                </div>

                <div class="col-12 col-sm-6">
                  <div class="bg-grey-1 q-pa-sm rounded-borders border row items-center justify-between">
                    <div class="ellipsis">
                      <div class="text-caption text-grey-7">پست الکترونیک (ایمیل)</div>
                      <div
                        class="text-body2 text-weight-bold text-blue-grey-10 q-mt-xs font-monospace ellipsis"
                        dir="ltr">
                        {{ studentData.email || '-' }}
                      </div>
                    </div>
                    <q-btn
                      v-if="studentData.email"
                      flat
                      round
                      dense
                      icon="content_copy"
                      size="sm"
                      color="grey-7"
                      @click="copyText(studentData.email)">
                      <q-tooltip>کپی ایمیل</q-tooltip>
                    </q-btn>
                  </div>
                </div>

                <div class="col-12">
                  <div class="bg-grey-1 q-pa-sm rounded-borders border">
                    <div class="text-caption text-grey-7">آدرس محل سکونت</div>
                    <div class="text-body2 text-blue-grey-10 q-mt-xs">
                      {{ studentData.address || '-' }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </q-card-section>
      </q-card>

      <!-- بخش کلاس‌بندی و انتساب تحصیلی -->
      <student-class-assignment
        :student-id="studentData.id"
        :term-enrollments="studentData.term_enrollments || []"
        readonly
        class="q-mb-md"
        @updated="loadPage" />

      <!-- بخش اطلاعات اولیا و سرپرستان -->
      <student-guardian-manager
        :student-profile-id="studentData?.student_profile?.id || null"
        :guardians="studentData?.student_profile?.guardians || []"
        readonly
        class="q-mb-md"
        @updated="loadPage" />
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useQuasar, copyToClipboard, Notify  } from 'quasar'
import { student, type StudentType } from 'src/repositories/student'
import StudentClassAssignment from 'src/components/StudentClassAssignment.vue'
import { useDate } from 'src/composables/Date'
import StudentGuardianManager from 'src/components/StudentGuardianManager.vue'

const $q = useQuasar()
const route = useRoute()
const dateManager = useDate()

const loading = ref(true)
const studentData = ref<StudentType | null>(null)

const fatherGuardian = computed(() => {
  if (!studentData.value?.guardian_records) return null
  return (
    studentData.value.guardian_records.find((g: any) => g.relationship_type === 'father') || null
  )
})

const motherGuardian = computed(() => {
  if (!studentData.value?.guardian_records) return null
  return (
    studentData.value.guardian_records.find((g: any) => g.relationship_type === 'mother') || null
  )
})

function toShamsiDate (date: string) {
  return dateManager.isoToLocalShamsiDate(date)
}

async function loadPage () {
  loading.value = true
  try {
    const id = parseInt(route.params.id as string)
    studentData.value = await student.get(id)
  } catch (error: any) {
    $q.notify({ type: 'negative', message: 'خطا در بارگذاری اطلاعات دانش آموز' })
  } finally {
    loading.value = false
  }
}

function copyText (text: string) {
  copyToClipboard(String(text))
    .then(() => Notify.create({ type: 'positive', message: 'کپی شد' }))
    .catch(() => Notify.create({ type: 'negative', message: 'کپی ناموفق بود' }))
}

onMounted(async () => {
  await loadPage()
})
</script>
