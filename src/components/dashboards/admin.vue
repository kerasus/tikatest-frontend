<template>
  <div class="dashboard-page">
    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-6 col-lg-3">
        <q-card class="dashboard-card">
          <q-card-section>
            <div class="text-h6">مدارس و موسسات</div>
            <div class="text-h4 text-primary">{{ stats.schools }}</div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-md-6 col-lg-3">
        <q-card class="dashboard-card">
          <q-card-section>
            <div class="text-h6">کاربران</div>
            <div class="text-h4 text-primary">{{ stats.users }}</div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-md-6 col-lg-3">
        <q-card class="dashboard-card">
          <q-card-section>
            <div class="text-h6">معلمان</div>
            <div class="text-h4 text-primary">{{ stats.teachers }}</div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-md-6 col-lg-3">
        <q-card class="dashboard-card">
          <q-card-section>
            <div class="text-h6">دانش‌آموزان</div>
            <div class="text-h4 text-primary">{{ stats.students }}</div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <q-card class="q-mt-md">
      <q-card-section>
        <div class="text-h6">
          خوش آمدید به پنل مدیریت کل سامانه
          <span class="text-bold">تیکا تست</span>
        </div>
        <p class="text-grey-7">از این بخش می‌توانید مدارس، کاربران و اطلاعات کل سامانه را مدیریت کنید.</p>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import SchoolAPI from 'src/repositories/school'
import StudentAPI from 'src/repositories/student'
import UserAPI from 'src/repositories/user'

const schoolAPI = new SchoolAPI()
const studentAPI = new StudentAPI()
const userAPI = new UserAPI()

const stats = ref({
  schools: 0,
  users: 0,
  teachers: 0,
  students: 0
})

onMounted(async () => {
  try {
    const [schoolsRes, usersRes, teachersRes, studentsRes] = await Promise.all([
      schoolAPI.index({ length: 1 }),
      userAPI.index({ length: 1 }),
      userAPI.index({ length: 1, role: 'teacher' }),
      studentAPI.index({ length: 1 })
    ])

    stats.value.schools = schoolsRes.total
    stats.value.users = usersRes.total
    stats.value.teachers = teachersRes.total
    stats.value.students = studentsRes.total
  } catch (error) {
    console.error('Error loading admin dashboard stats:', error)
  }
})
</script>

<style lang="scss" scoped>
.dashboard-page {
  .dashboard-card {
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    }
  }
}
</style>
