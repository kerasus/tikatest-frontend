<template>
  <div class="school-dashboard">
    <school-header :school-name="currentSchoolManager.currentSchool.value?.name" />
    <school-stats
      :loading="loading"
      :stats="stats" />
    <school-quick-actions />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import DashboardAPI from 'src/repositories/dashboard'
import { useCurrentSchool } from 'src/composables/useCurrentSchool'
import SchoolHeader from './components/header.vue'
import SchoolStats from './components/stats.vue'
import SchoolQuickActions from './components/quickActions.vue'

const dashboardAPI = new DashboardAPI()
const currentSchoolManager = useCurrentSchool()

const loading = ref(true)
const stats = ref({
  students: 0,
  classes: 0,
  exams: 0,
  homework: 0
})

onMounted(async () => {
  loading.value = true
  const schoolId = currentSchoolManager.currentSchool.value?.id

  try {
    if (!schoolId) {
      return
    }

    const dashboardStats = await dashboardAPI.schoolDashboard(schoolId)

    stats.value.students = dashboardStats.students_count || 0
    stats.value.classes = dashboardStats.classes_count || 0
    stats.value.exams = dashboardStats.online_exams_count || 0
    stats.value.homework = dashboardStats.homeworks_count || 0
  } catch (error) {
    console.error('Error loading dashboard stats:', error)
  } finally {
    loading.value = false
  }
})
</script>
