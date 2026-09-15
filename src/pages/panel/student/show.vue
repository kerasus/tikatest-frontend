<template>
  <div
    v-if="loading"
    class="text-center q-pa-lg">
    <q-spinner
      color="primary"
      size="100px" />
  </div>

  <template v-else-if="studentData">
    <q-card class="q-mb-md">
      <q-card-section class="flex justify-between">
        <div class="text-h6">مشاهده اطلاعات دانش آموز</div>
        <q-btn
          :to="{ name: 'Panel.Student.Edit', params: { id: studentData.id } }"
          color="primary">
          ویرایش
        </q-btn>
      </q-card-section>
      <q-separator />
      <q-card-section> <!-- Header -->
        <q-item>
          <q-item-section avatar>
            <q-avatar
              color="primary"
              text-color="white"
              size="56px">
              <q-img :src="studentData.picture ? studentData.picture : '/images/blankProfile.png'" />
            </q-avatar>
          </q-item-section>

          <q-item-section>
            <q-item-label class="text-h6">
              {{ (studentData.first_name || '-') }} {{ (studentData.last_name || '') }}
            </q-item-label>
            <q-item-label caption>
              پروفایل دانش‌آموز
            </q-item-label>
          </q-item-section>

          <q-item-section side>
            نام کاربری:
            <q-badge
              v-if="studentData.username"
              color="grey-3"
              text-color="grey-9"
              class="q-pa-xs">
              {{ studentData.username }}
            </q-badge>
          </q-item-section>
        </q-item>

        <q-separator class="q-my-md" />

        <!-- Body -->
        <div class="row q-col-gutter-md">
          <!-- ستون ۱ -->
          <div class="col-12 col-md-6">
            <q-list
              bordered
              separator
              class="rounded-borders">
              <q-item>
                <q-item-section>
                  <q-item-label caption>نام</q-item-label>
                  <q-item-label>{{ studentData.first_name || '-' }}</q-item-label>
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <q-item-label caption>نام خانوادگی</q-item-label>
                  <q-item-label>{{ studentData.last_name || '-' }}</q-item-label>
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <q-item-label caption>تلفن همراه</q-item-label>
                  <q-item-label
                    class="text-body1"
                    dir="ltr">
                    {{ studentData.mobile || '-' }}
                  </q-item-label>
                </q-item-section>

                <!-- اگر خواستی دکمه کپی -->
                <q-item-section
                  v-if="studentData.mobile"
                  side>
                  <q-btn
                    flat
                    dense
                    icon="content_copy"
                    @click="copyText(studentData.mobile)" />
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <q-item-label caption>کد ملی</q-item-label>
                  <q-item-label dir="ltr">
                    {{ studentData.national_id || '-' }}
                  </q-item-label>
                </q-item-section>

                <q-item-section
                  v-if="studentData.national_id"
                  side>
                  <q-btn
                    flat
                    dense
                    icon="content_copy"
                    @click="copyText(studentData.national_id)" />
                </q-item-section>
              </q-item>
            </q-list>
          </div>

          <!-- ستون ۲ -->
          <div class="col-12 col-md-6">
            <q-list
              bordered
              separator
              class="rounded-borders">
              <q-item>
                <q-item-section>
                  <q-item-label caption>ایمیل</q-item-label>
                  <q-item-label dir="ltr">
                    {{ studentData.email || '-' }}
                  </q-item-label>
                </q-item-section>

                <q-item-section
                  v-if="studentData.email"
                  side>
                  <q-btn
                    flat
                    dense
                    icon="content_copy"
                    @click="copyText(studentData.email)" />
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <q-item-label caption>تاریخ تولد</q-item-label>
                  <q-item-label dir="ltr">
                    {{ studentData.birth_date ? toShamsiDate(studentData.birth_date) : '-' }}
                  </q-item-label>
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <q-item-label caption>آدرس</q-item-label>
                  <q-item-label class="text-body2">
                    {{ studentData.address || '-' }}
                  </q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </div>
        </div>

        <q-separator class="q-my-md" />
        <div class="flex justify-around">
          <q-btn
            outline
            color="primary"
            label="مشاهده همه نمرات"
            :to="{ name: 'Student.Grade.List', params: { studentId: studentData.id } }" />
          <q-btn
            outline
            color="primary"
            label="مشاهده تکالیف"
            :to="{ name: 'Student.Homework.List', params: { studentId: studentData.id } }" />
        </div>
      </q-card-section>
    </q-card>

    <student-class-assignment
      :student-id="studentData.id"
      :term-enrollments="studentData.term_enrollments || []"
      readonly
      @updated="loadPage" />

    <student-guardian-manager
      :student-profile-id="studentData?.student_profile?.id || null"
      :guardians="studentData?.student_profile?.guardians || []"
      readonly
      @updated="loadPage" />
  </template>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useQuasar, copyToClipboard, Notify  } from 'quasar'
import { student, StudentType } from 'src/repositories/student'
import StudentClassAssignment from 'src/components/StudentClassAssignment.vue'
import { useDate } from 'src/composables/Date'
import StudentGuardianManager from 'src/components/StudentGuardianManager.vue'

const $q = useQuasar()
const route = useRoute()
const dateManager = useDate()

const loading = ref(true)
const studentData = ref<StudentType | null>(null)

const getClassName = (): string => {
  if (!studentData.value?.term_enrollments?.length) return '-'
  const reg = studentData.value.term_enrollments[0]
  return reg?.school_class?.name || reg?.class?.name || '-'
}

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
