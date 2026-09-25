<template>
  <div class="dashboard-page">
    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-6 col-lg-3">
        <q-card class="dashboard-card">
          <q-card-section>
            <div class="text-h6">نمرات اخیر</div>
            <div class="text-h4 text-primary">{{ stats.recent_grades.length }}</div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-md-6 col-lg-3">
        <q-card class="dashboard-card">
          <q-card-section>
            <div class="text-h6">مطالعه این ماه</div>
            <div class="text-h4 text-primary">{{ stats.total_study_minutes_this_month }}</div>
            <div class="text-caption text-grey-7">دقیقه</div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-md-6 col-lg-3">
        <q-card class="dashboard-card">
          <q-card-section>
            <div class="text-h6">تکالیف در انتظار</div>
            <div class="text-h4 text-primary">{{ stats.pending_homework_count }}</div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-md-6 col-lg-3">
        <q-card class="dashboard-card">
          <q-card-section>
            <div class="text-h6">موارد انضباطی اخیر</div>
            <div class="text-h4 text-primary">{{ stats.recent_disciplinary.length }}</div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <q-card class="q-mt-md">
      <q-card-section>
        <div class="text-h6">
          به پنل دانش‌آموزی
          <span class="text-bold">تیکا تست</span>
          خوش آمدید
        </div>
        <p class="text-grey-7">از منوی اصلی می‌توانید تکالیف، آزمون‌ها، نمرات و برنامه‌های خود را مشاهده کنید.</p>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { student } from 'src/repositories/student'

type StudentDashboardStats = {
  recent_grades: unknown[]
  recent_study_sessions: unknown[]
  total_study_minutes_this_month: number
  recent_disciplinary: unknown[]
  pending_homework_count: number
}

const stats = ref<StudentDashboardStats>({
  recent_grades: [],
  recent_study_sessions: [],
  total_study_minutes_this_month: 0,
  recent_disciplinary: [],
  pending_homework_count: 0
})

onMounted(async () => {
  try {
    stats.value = await student.dashboard()
  } catch (error) {
    console.error('Error loading student dashboard stats:', error)
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
