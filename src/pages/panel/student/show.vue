<template>
  <div class="student-show-page">
    <q-card>
      <q-card-section>
        <div class="row items-center">
          <q-avatar size="80px" class="q-ml-md">
            <img :src="student.picture || 'https://cdn.quasar.dev/img/avatar.png'" />
          </q-avatar>
          <div>
            <div class="text-h5">{{ student.full_name || `${student.name} ${student.lastname}` }}</div>
            <div class="text-grey-7">کد ملی: {{ student.melli_code || '-' }}</div>
          </div>
        </div>
      </q-card-section>

      <q-separator />

      <q-card-section>
        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-6">
            <q-list>
              <q-item>
                <q-item-section>
                  <q-item-label caption>نام کاربری</q-item-label>
                  <q-item-label>{{ student.username || '-' }}</q-item-label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-item-label caption>تلفن همراه</q-item-label>
                  <q-item-label>{{ student.student_phone || '-' }}</q-item-label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-item-label caption>ایمیل</q-item-label>
                  <q-item-label>{{ student.student_email || '-' }}</q-item-label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-item-label caption>تاریخ تولد</q-item-label>
                  <q-item-label>{{ student.birth_date || '-' }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </div>
        </div>
      </q-card-section>

      <q-separator />

      <q-card-section v-if="student.studentClassRegistrations && student.studentClassRegistrations.length">
        <div class="text-h6 q-mb-md">کلاس‌های ثبت شده</div>
        <q-table
          :rows="student.studentClassRegistrations"
          :columns="classColumns"
          row-key="id"
          flat
          bordered />
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useQuasar } from 'quasar'
import StudentAPI from 'src/repositories/student'
import type { StudentType } from 'src/repositories/student'

const route = useRoute()
const $q = useQuasar()
const student = ref<Partial<StudentType>>({})

const classColumns = [
  { name: 'name', label: 'نام کلاس', field: 'schoolClass.name' },
  { name: 'field', label: 'رشته', field: 'schoolClass.academicField.name' },
  { name: 'level', label: 'پایه', field: 'schoolClass.academicLevel.name' }
]

onMounted(async () => {
  try {
    const result = await StudentAPI.prototype.get(Number(route.params.id))
    student.value = result
  } catch (error) {
    $q.notify({
      icon: 'error',
      message: 'خطا در بارگذاری اطلاعات دانش آموز.',
      color: 'negative'
    })
  }
})
</script>
