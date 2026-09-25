<template>
  <div class="dashboard-page">
    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-6 col-lg-3">
        <q-card class="dashboard-card">
          <q-card-section>
            <div class="text-h6">دانش آموزان</div>
            <div class="text-h4 text-primary">{{ stats.students }}</div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-md-6 col-lg-3">
        <q-card class="dashboard-card">
          <q-card-section>
            <div class="text-h6">کلاس‌ها</div>
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
          خوش آمدید به سیستم مدیریت دانش آموزی
          <span class="text-bold"> تیکا تست </span>
        </div>
        <p class="text-grey-7">گزینه مورد نظر را از منو انتخاب کنید.</p>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar'
import { ref, onMounted } from 'vue'
import ExamAPI from 'src/repositories/exam'
import StudentAPI from 'src/repositories/student'
import HomeworkAPI from 'src/repositories/homework'
import SchoolClassAPI from 'src/repositories/schoolClass'
import { useCurrentSchool } from 'src/composables/useCurrentSchool'

const examAPI = new ExamAPI()
const studentAPI = new StudentAPI()
const homeworkAPI = new HomeworkAPI()
const schoolClassAPI = new SchoolClassAPI()

const $q = useQuasar()
const currentSchoolManager = useCurrentSchool()

const stats = ref({
  students: 0,
  classes: 0,
  exams: 0,
  homework: 0
})

onMounted(async () => {
  try {
    const [studentsRes, classesRes, examsRes, homeworkRes] = await Promise.all([
      studentAPI.index({ length: 1, school_id: currentSchoolManager.currentSchool.value?.id }),
      schoolClassAPI.index({ length: 1, school_id: currentSchoolManager.currentSchool.value?.id }),
      examAPI.index({ length: 1, school_id: currentSchoolManager.currentSchool.value?.id }),
      homeworkAPI.index({ length: 1, school_id: currentSchoolManager.currentSchool.value?.id })
    ])
    stats.value.students = studentsRes.total
    stats.value.classes = classesRes.total
    stats.value.exams = examsRes.total
    stats.value.homework = homeworkRes.total
  } catch (error) {
    console.error('Error loading dashboard stats:', error)
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
