<template>
  <admin-dashboard v-if="userStoreManager.isAdmin" />
  <school-dashboard v-else-if="userStoreManager.isManager || userStoreManager.isStaff" />
  <teacher-dashboard v-else-if="userStoreManager.isTeacher" />
  <student-dashboard v-else-if="userStoreManager.isStudent" />
</template>

<script setup lang="ts">
import { useUser } from 'src/stores/user'
import AdminDashboard from 'components/dashboards/admin/admin.vue'
import SchoolDashboard from 'components/dashboards/school/school.vue'
import StudentDashboard from 'components/dashboards/student/student.vue'
import TeacherDashboard from 'src/components/dashboards/teacher.vue'

const userStoreManager = useUser()
</script>
