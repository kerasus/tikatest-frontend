<template>
  <staff-profile v-if="userManager.isAdmin || userManager.isManager || userManager.isStaff || userManager.isTeacher" />
  <student-profile v-else-if="userManager.isStudent" />
</template>

<script setup lang="ts">
import { useUser } from 'src/stores/user'
import StaffProfile from 'src/components/profile/StaffProfile.vue'
import StudentProfile from 'src/components/profile/StudentProfile.vue'

const userManager = useUser()
</script>
