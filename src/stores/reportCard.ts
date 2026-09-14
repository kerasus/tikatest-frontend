import { ref } from 'vue'
import { defineStore } from 'pinia'
import {
  ClassGradeSheetResponse,
  ComprehensiveReportResponse,
  GradeMatrixResponse,
  ReportCardClassCardsResponse
} from 'src/repositories/reportCard'

export const useReportCardStore = defineStore('reportCard', () => {
  const gradeDetails = ref<ReportCardClassCardsResponse | null>(null)
  const reportCards = ref<GradeMatrixResponse | null>(null)
  const classGradeSheet = ref<ClassGradeSheetResponse | null>(null)
  const comprehensiveReports = ref<ComprehensiveReportResponse | null>(null)
  const formSettings = ref<Record<string, any>>({})

  function setGradeDetails (data: ReportCardClassCardsResponse | null) {
    gradeDetails.value = data
  }

  function setReportCards (data: GradeMatrixResponse | null) {
    reportCards.value = data
  }

  function setClassGradeSheet (data: ClassGradeSheetResponse | null) {
    classGradeSheet.value = data
  }


  function setComprehensiveReports (data: ComprehensiveReportResponse | null) {
    comprehensiveReports.value = data
  }

  function setFormSettings (settings: Record<string, any>) {
    formSettings.value = settings
  }

  function clear () {
    reportCards.value = null
    classGradeSheet.value = null
    comprehensiveReports.value = null
    formSettings.value = {}
  }

  return {
    gradeDetails,
    reportCards,
    classGradeSheet,
    comprehensiveReports,
    formSettings,
    setReportCards,
    setFormSettings,
    setGradeDetails,
    setClassGradeSheet,
    setComprehensiveReports,
    clear
  }
})
