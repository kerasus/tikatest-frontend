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
        <div class="text-h6">خوش آمدید به سیستم مدیریت دانش آموزی TikaTest</div>
        <p class="text-grey-7">گزینه مورد نظر را از منو انتخاب کنید.</p>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import StudentAPI from 'src/repositories/student'
import SchoolClassAPI from 'src/repositories/schoolClass'
import ExamAPI from 'src/repositories/exam'
import HomeworkAPI from 'src/repositories/homework'

const studentAPI = new StudentAPI()
const schoolClassAPI = new SchoolClassAPI()
const examAPI = new ExamAPI()
const homeworkAPI = new HomeworkAPI()

const $q = useQuasar()

const stats = ref({
  students: 0,
  classes: 0,
  exams: 0,
  homework: 0
})

onMounted(async () => {
  try {
    const [studentsRes, classesRes, examsRes, homeworkRes] = await Promise.all([
      studentAPI.index({ length: 1 }),
      schoolClassAPI.index({ length: 1 }),
      examAPI.index({ length: 1 }),
      homeworkAPI.index({ length: 1 })
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
      box-shadow: 0 8px 24px rgba(0,0,0,0.12);
    }
  }
}
</style>
