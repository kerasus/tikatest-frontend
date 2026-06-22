<template>
  <q-page class="q-pa-md">
    <div class="row items-center q-mb-lg">
      <div class="col">
        <h4 class="q-ma-none">جزئیات دانش آموز</h4>
      </div>
      <div class="col-auto">
        <q-btn color="primary" label="ویرایش" :to="{ name: 'Panel.Student.Edit', params: { id: student?.id } }" />
      </div>
    </div>

    <div v-if="loading" class="text-center q-pa-lg">
      <q-spinner color="primary" size="100px" />
    </div>

    <template v-else-if="student">
      <q-card class="q-mb-md">
        <q-card-section>
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-6">
              <div class="text-subtitle2">نام و نام خانوادگی:</div>
              <div class="text-body1">{{ student.full_name }}</div>
            </div>
            <div class="col-12 col-md-6">
              <div class="text-subtitle2">نام کاربری:</div>
              <div class="text-body1">{{ student.username }}</div>
            </div>
            <div class="col-12 col-md-6">
              <div class="text-subtitle2">شماره تماس:</div>
              <div class="text-body1">{{ student.student_phone || '-' }}</div>
            </div>
            <div class="col-12 col-md-6">
              <div class="text-subtitle2">کد ملی:</div>
              <div class="text-body1">{{ student.melli_code || '-' }}</div>
            </div>
            <div class="col-12 col-md-6">
              <div class="text-subtitle2">تاریخ تولد:</div>
              <div class="text-body1">{{ student.birth_date || '-' }}</div>
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
          <div class="text-h6">نمرات</div>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <q-btn flat color="primary" label="مشاهده همه نمرات" :to="{ name: 'Student.Grade.List', params: { studentId: student.id } }" />
        </q-card-section>
      </q-card>

      <q-card class="q-mb-md">
        <q-card-section>
          <div class="text-h6">تکالیف</div>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <q-btn flat color="primary" label="مشاهده تکالیف" :to="{ name: 'Student.Homework.List', params: { studentId: student.id } }" />
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
              <div class="text-subtitle2">نام پدر:</div>
              <div class="text-body1">{{ student.father_name || '-' }}</div>
            </div>
            <div class="col-12 col-md-6">
              <div class="text-subtitle2">شماره تماس پدر:</div>
              <div class="text-body1">{{ student.father_phone || '-' }}</div>
            </div>
            <div class="col-12 col-md-6">
              <div class="text-subtitle2">نام مادر:</div>
              <div class="text-body1">{{ student.mother_name || '-' }}</div>
            </div>
            <div class="col-12 col-md-6">
              <div class="text-subtitle2">شماره تماس مادر:</div>
              <div class="text-body1">{{ student.mother_phone || '-' }}</div>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </template>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useQuasar } from 'quasar'
import { student } from 'src/repositories/student'

const route = useRoute()
const $q = useQuasar()

const loading = ref(true)
const studentData = ref<any>(null)

const getClassName = (): string => {
  if (!studentData.value?.studentClassRegistrations?.length) return '-'
  const reg = studentData.value.studentClassRegistrations[0]
  return reg?.schoolClass?.name || '-'
}

onMounted(async () => {
  loading.value = true
  try {
    const id = parseInt(route.params.id as string)
    const response = await student.get(id)
    studentData.value = response.data
  } catch (error: any) {
    $q.notify({ type: 'negative', message: 'خطا در بارگذاری اطلاعات دانش آموز' })
  } finally {
    loading.value = false
  }
})
</script>
