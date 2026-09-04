import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useReportCardStore = defineStore('reportCard', () => {
  const reportCards = ref<any>(null)
  const formSettings = ref<Record<string, any>>({})

  function setReportCards (data: any) {
    reportCards.value = data
  }

  function setFormSettings (settings: Record<string, any>) {
    formSettings.value = settings
  }

  function clear () {
    reportCards.value = null
    formSettings.value = {}
  }

  return {
    reportCards,
    formSettings,
    setReportCards,
    setFormSettings,
    clear
  }
})
