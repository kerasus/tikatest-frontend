<template>
  <q-page class="q-pa-md">
    <div class="row items-center q-mb-lg">
      <div class="col">
        <h4 class="q-ma-none">جزئیات دانش آموز</h4>
      </div>
      <div class="col-auto">
        <q-btn
          v-if="studentData"
          color="primary"
          label="ویرایش"
          :to="{ name: 'Panel.Student.Edit', params: { id: studentData.id } }" />
      </div>
    </div>

    <div
      v-if="loading"
      class="text-center q-pa-lg">
      <q-spinner
        color="primary"
        size="100px" />
    </div>

    <template v-else-if="studentData">
      <q-card class="q-mb-md">
        <q-card-section>
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-6">
              <div class="text-subtitle2">نام و نام خانوادگی:</div>
              <div class="text-body1">{{ studentData.full_name }}</div>
            </div>
            <div class="col-12 col-md-6">
              <div class="text-subtitle2">نام کاربری:</div>
              <div class="text-body1">{{ studentData.username }}</div>
            </div>
            <div class="col-12 col-md-6">
              <div class="text-subtitle2">شماره تماس:</div>
              <div class="text-body1">{{ studentData.student_phone || '-' }}</div>
            </div>
            <div class="col-12 col-md-6">
              <div class="text-subtitle2">کد ملی:</div>
              <div class="text-body1">{{ studentData.national_id || '-' }}</div>
            </div>
            <div class="col-12 col-md-6">
              <div class="text-subtitle2">تاریخ تولد:</div>
              <div class="text-body1">{{ formatDate(studentData.birth_date) }}</div>
            </div>
            <div class="col-12 col-md-6">
              <div class="text-subtitle2">کلاس:</div>
              <div class="text-body1">{{ getClassName() }}</div>
            </div>
          </div>
        </q-card-section>
      </q-card>

      <q-card class="q-mb-md">
        <q-card-section>
          <div class="text-h6">مدارس و کلاس‌ها</div>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <template v-if="groupedSchools.length > 0">
            <q-card
              v-for="school in groupedSchools"
              :key="school.id"
              flat
              bordered
              class="q-mb-md full-width-card">
              <q-card-section>
                <q-list
                  bordered
                  separator>
                  <q-item
                    v-for="reg in school.registrations"
                    :key="reg.id"
                    dense>
                    <q-item-section>
                      <q-item-label>{{ reg.school_class?.name || '-' }}</q-item-label>
                      <q-item-label caption>
                        <template v-if="reg.school_class?.academic_level">
                          پایه: {{ reg.school_class.academic_level.name }}
                        </template>
                        <template v-if="reg.school_class?.academic_level?.academic_field">
                          <span v-if="reg.school_class?.academic_level"> - </span>
                          رشته: {{ reg.school_class.academic_level.academic_field.name }}
                        </template>
                        <div class="q-mt-xs text-grey">
                          مدرسه: {{ reg.school_class?.academic_level?.academic_field?.school?.name || '-' }}
                        </div>
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-card-section>
            </q-card>
          </template>
          <div
            v-else
            class="text-center text-grey">
            هیچ مدرسه و کلاسی ثبت نشده است.
          </div>
        </q-card-section>
      </q-card>

      <q-card class="q-mb-md">
        <q-card-section>
          <div class="text-h6">نمرات</div>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <q-btn
            flat
            color="primary"
            label="مشاهده همه نمرات"
            :to="{ name: 'Student.Grade.List', params: { studentId: studentData.id } }" />
        </q-card-section>
      </q-card>

      <q-card class="q-mb-md">
        <q-card-section>
          <div class="text-h6">تکالیف</div>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <q-btn
            flat
            color="primary"
            label="مشاهده تکالیف"
            :to="{ name: 'Student.Homework.List', params: { studentId: studentData.id } }" />
        </q-card-section>
      </q-card>

      <q-card>
        <q-card-section>
          <div class="text-h6">مشخصات والدین</div>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-6">
              <div class="text-subtitle1 text-weight-medium q-mb-md">پدر</div>
              <div class="q-col-gutter-xs">
                <div class="q-mb-sm">
                  <div class="text-caption text-grey">نام:</div>
                  <div class="text-body1">{{ studentData?.father_name || '-' }}</div>
                </div>
                <div class="q-mb-sm">
                  <div class="text-caption text-grey">شماره تماس:</div>
                  <div class="text-body1">{{ studentData?.father_phone || '-' }}</div>
                </div>
                <div class="q-mb-sm">
                  <div class="text-caption text-grey">ایمیل:</div>
                  <div class="text-body1">{{ studentData?.father_email || '-' }}</div>
                </div>
                <div class="q-mb-sm">
                  <div class="text-caption text-grey">شغل:</div>
                  <div class="text-body1">{{ studentData?.father_job || '-' }}</div>
                </div>
                <div class="q-mb-sm">
                  <div class="text-caption text-grey">کد ملی:</div>
                  <div class="text-body1">{{ studentData?.father_national_id || '-' }}</div>
                </div>
              </div>
            </div>
            <div class="col-12 col-md-6">
              <div class="text-subtitle1 text-weight-medium q-mb-md">مادر</div>
              <div class="q-col-gutter-xs">
                <div class="q-mb-sm">
                  <div class="text-caption text-grey">نام:</div>
                  <div class="text-body1">{{ studentData?.mother_name || '-' }} {{ studentData?.mother_last_name || '' }}</div>
                </div>
                <div class="q-mb-sm">
                  <div class="text-caption text-grey">شماره تماس:</div>
                  <div class="text-body1">{{ studentData?.mother_phone || '-' }}</div>
                </div>
                <div class="q-mb-sm">
                  <div class="text-caption text-grey">ایمیل:</div>
                  <div class="text-body1">{{ studentData?.mother_email || '-' }}</div>
                </div>
                <div class="q-mb-sm">
                  <div class="text-caption text-grey">شغل:</div>
                  <div class="text-body1">{{ studentData?.mother_job || '-' }}</div>
                </div>
                <div class="q-mb-sm">
                  <div class="text-caption text-grey">کد ملی:</div>
                  <div class="text-body1">{{ studentData?.mother_national_id || '-' }}</div>
                </div>
              </div>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </template>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useQuasar } from 'quasar'
import { student } from 'src/repositories/student'
import { useDate } from 'src/composables/Date'

const route = useRoute()
const $q = useQuasar()
const date = useDate()

const loading = ref(true)
const studentData = ref<any>(null)

const formatDate = (dateString: string | null | undefined): string => {
  if (!dateString) return '-'
  return date.miladiToShamsi(dateString, 'YYYY-MM-DD', 'jYYYY/jMM/jDD')
}

const getClassName = (): string => {
  if (!studentData.value?.user_class_registrations?.length) return '-'
  const reg = studentData.value.user_class_registrations[0]
  return reg?.school_class?.name || '-'
}

const groupedSchools = computed(() => {
  if (!studentData.value?.user_class_registrations?.length) return []

  const map = new Map<number, any>()

  for (const reg of studentData.value.user_class_registrations) {
    const school = reg.school_class?.academic_level?.academic_field?.school
    if (!school) continue

    const schoolId = school.id
    if (!map.has(schoolId)) {
      map.set(schoolId, {
        id: schoolId,
        name: school.name,
        registrations: []
      })
    }

    map.get(schoolId).registrations.push(reg)
  }

  return Array.from(map.values())
})

onMounted(async () => {
  loading.value = true
  try {
    const id = parseInt(route.params.id as string)
    const response = await student.get(id)
    studentData.value = response
  } catch (error: any) {
    $q.notify({ type: 'negative', message: 'خطا در بارگذاری اطلاعات دانش آموز' })
  } finally {
    loading.value = false
  }
})
</script>
