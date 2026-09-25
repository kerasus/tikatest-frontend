<template>
  <admin-dashboard v-if="userStoreManager.isAdmin" />
  <school-dashboard v-else-if="userStoreManager.isManager || userStoreManager.isStaff" />
  <teacher-dashboard v-else-if="userStoreManager.isTeacher" />
  <student-dashboard v-else-if="userStoreManager.isStudent" />
</template>

<script setup lang="ts">
import { useUser } from 'src/stores/user'
import AdminDashboard from 'src/components/dashboards/admin.vue'
import SchoolDashboard from 'src/components/dashboards/school.vue'
import StudentDashboard from 'src/components/dashboards/student.vue'
import TeacherDashboard from 'src/components/dashboards/teacher.vue'

const userStoreManager = useUser()
</script>
