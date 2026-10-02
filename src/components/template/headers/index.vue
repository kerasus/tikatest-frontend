<template>
  <main-panel-component
    v-if="appLayoutStore.layoutHeaderType === 'mainPanel'"
    :floated="floated" />
  <online-exam-component
    v-if="appLayoutStore.layoutHeaderType === 'onlineExam'"
    :floated="floated" />
  <session-result-admin-view-component
    v-if="appLayoutStore.layoutHeaderType === 'sessionResultAdminView'"
    :floated="floated" />
</template>

<script setup lang="ts">
import { defineAsyncComponent } from 'vue'
import { useAppLayout } from 'src/stores/appLayout'

withDefaults(defineProps<{ floated?: boolean }>(), {
  floated: false
})

const appLayoutStore = useAppLayout()

const MainPanelComponent = defineAsyncComponent(() => import('./mainPanel.vue'))
const OnlineExamComponent = defineAsyncComponent(() => import('./onlineExam.vue'))
const sessionResultAdminViewComponent = defineAsyncComponent(() => import('./sessionResultAdminView.vue'))
</script>

<style scoped lang="scss"></style>
