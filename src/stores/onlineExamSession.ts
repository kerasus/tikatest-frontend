import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type {
  OnlineExamSessionResponseItemType,
  OnlineExamSessionType,
  StartExamResponseType
} from 'src/repositories/onlineExamSession'
import type { BookletType, OnlineExamDetailType } from 'src/repositories/exam'
import type { UserType } from 'src/repositories/user'

const SESSION_STATUS_LABELS: Record<string, string> = {
  not_started: 'شرکت نکرده',
  in_progress: 'در حال انجام',
  submitted: 'ارسال شده',
  graded: 'اتمام یافته',
  expired: 'منقضی شده'
}

export const useOnlineExamSession = defineStore('onlineExamSession', () => {
  const session = ref<StartExamResponseType | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const sessionData = computed<OnlineExamSessionType | null>(() => session.value?.session ?? null)
  const student = computed<UserType | null>(() => sessionData.value?.student ?? null)
  const booklets = computed<BookletType[]>(() => sessionData.value?.exam?.online_exam_detail?.booklets ?? [])
  const sessionResponses = computed<OnlineExamSessionResponseItemType[]>(() => sessionData.value?.responses ?? [])
  const examTitle = computed(() => sessionData.value?.exam?.name ?? 'آزمون آنلاین')
  const remainingTime = computed(() => session.value?.remaining_time ?? null)
  const onlineDetail = computed<OnlineExamDetailType | null>(() => sessionData.value?.exam?.online_exam_detail ?? null)
  const answerKeys = computed(() => onlineDetail.value?.answer_keys ?? null)
  const isActive = computed(() => sessionData.value?.status === 'in_progress')
  const isResultMode = computed(() => ['submitted', 'graded', 'expired'].includes(sessionData.value?.status ?? ''))
  const status = computed(() => sessionData.value?.status ?? null)
  const statusLabel = computed(() => SESSION_STATUS_LABELS[status.value ?? ''] ?? 'نامشخص')
  const durationLimit = computed(() => sessionData.value?.duration_limit_seconds ?? null)
  const usedTimeSeconds = computed(() => {
    const currentSession = sessionData.value
    if (!currentSession) return null

    if (currentSession.time_used_seconds != null && currentSession.time_used_seconds > 0) {
      return currentSession.time_used_seconds
    }

    if (currentSession.started_at && currentSession.submitted_at) {
      const started = new Date(currentSession.started_at).getTime()
      const submitted = new Date(currentSession.submitted_at).getTime()
      return Math.max(0, Math.floor((submitted - started) / 1000))
    }

    return currentSession.time_used_seconds ?? null
  })
  const formatRemainingTime = computed(() => {
    const remaining = remainingTime.value
    if (remaining != null) {
      const safe = Math.max(0, Math.floor(remaining))
      const hours = Math.floor(safe / 3600)
      const mins = Math.floor((safe % 3600) / 60)
      const secs = safe % 60
      if (hours > 0) {
        return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
      }
      return `${mins}:${secs.toString().padStart(2, '0')}`
    }
    return '-'
  })

  function setSession (data: StartExamResponseType | null) {
    session.value = data
    error.value = data?.error ?? null
  }

  function clearSession () {
    session.value = null
    error.value = null
  }

  function setLoading (value: boolean) {
    loading.value = value
  }

  function updateRemainingTime (time: number | null) {
    if (session.value) {
      session.value.remaining_time = time
    }
  }

  return {
    session,
    student,
    sessionData,
    loading,
    error,
    examTitle,
    remainingTime,
    answerKeys,
    sessionResponses,
    booklets,
    onlineDetail,
    isActive,
    isResultMode,
    durationLimit,
    status,
    statusLabel,
    usedTimeSeconds,
    formatRemainingTime,
    setSession,
    clearSession,
    setLoading,
    updateRemainingTime
  }
})
