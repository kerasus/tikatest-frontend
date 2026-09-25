<template>
  <div class="dashboard-page">
    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-6 col-lg-3">
        <q-card class="dashboard-card">
          <q-card-section>
            <div class="text-h6">دانش‌آموزان مدرسه</div>
            <div class="text-h4 text-primary">{{ stats.students }}</div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-md-6 col-lg-3">
        <q-card class="dashboard-card">
          <q-card-section>
            <div class="text-h6">کلاس‌های مدرسه</div>
            <div class="text-h4 text-primary">{{ stats.classes }}</div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-md-6 col-lg-3">
        <q-card class="dashboard-card">
          <q-card-section>
            <div class="text-h6">آزمون‌ها</div>
            <div class="text-h4 text-primary">{{ stats.exams }}</div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-md-6 col-lg-3">
        <q-card class="dashboard-card">
          <q-card-section>
            <div class="text-h6">تکالیف</div>
            <div class="text-h4 text-primary">{{ stats.homework }}</div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <q-card class="q-mt-md">
      <q-card-section>
        <div class="text-h6">
          به پنل معلم
          <span class="text-bold">تیکا تست</span>
          خوش آمدید
        </div>
        <p class="text-grey-7">برای مدیریت کلاس‌ها، آزمون‌ها و تکالیف از منوی اصلی استفاده کنید.</p>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import ExamAPI from 'src/repositories/exam'
import HomeworkAPI from 'src/repositories/homework'
import SchoolClassAPI from 'src/repositories/schoolClass'
import StudentAPI from 'src/repositories/student'
import { useCurrentSchool } from 'src/composables/useCurrentSchool'

const examAPI = new ExamAPI()
const homeworkAPI = new HomeworkAPI()
const schoolClassAPI = new SchoolClassAPI()
const studentAPI = new StudentAPI()
const currentSchoolManager = useCurrentSchool()

const stats = ref({
  students: 0,
  classes: 0,
  exams: 0,
  homework: 0
})

onMounted(async () => {
  try {
    const schoolId = currentSchoolManager.currentSchool.value?.id
    const [studentsRes, classesRes, examsRes, homeworkRes] = await Promise.all([
      studentAPI.index({ length: 1, school_id: schoolId }),
      schoolClassAPI.index({ length: 1, school_id: schoolId }),
      examAPI.index({ length: 1, school_id: schoolId }),
      homeworkAPI.index({ length: 1, school_id: schoolId })
    ])

    stats.value.students = studentsRes.total
    stats.value.classes = classesRes.total
    stats.value.exams = examsRes.total
    stats.value.homework = homeworkRes.total
  } catch (error) {
    console.error('Error loading teacher dashboard stats:', error)
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
