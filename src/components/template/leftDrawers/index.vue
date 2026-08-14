<script setup lang="ts">
import { defineAsyncComponent } from 'vue'
import { useAppLayout } from 'src/stores/appLayout'

const appLayoutStore = useAppLayout()

const MainPanelComponent = defineAsyncComponent(() => import('./mainPanel/mainPanel.vue'))
const OnlineExamComponent = defineAsyncComponent(() => import('./onlineExam/onlineExam.vue'))
</script>

<template>
  <main-panel-component v-if="appLayoutStore.layoutLeftDrawerType === 'mainPanel'" />
  <online-exam-component v-if="appLayoutStore.layoutLeftDrawerType === 'onlineExam'" />
</template>

<style scoped lang="scss"></style>
