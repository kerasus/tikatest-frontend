import { appApi } from 'src/boot/axios'

export const quizSession = {
  startSession: (quizId: number, attemptNumber = 1) =>
    appApi.post(`/quiz-sessions/${quizId}/start`, { attempt_number: attemptNumber }),

  getSession: (sessionId: number) =>
    appApi.get(`/quiz-sessions/${sessionId}`),

  submitAnswer: (sessionId: number, data: any) =>
    appApi.post(`/quiz-sessions/${sessionId}/answer`, data),

  submitQuiz: (sessionId: number) =>
    appApi.post(`/quiz-sessions/${sessionId}/submit`, {}),

  getMyAttempts: () =>
    appApi.get(`/quiz-sessions/my-sessions`),

  getQuizAttempts: (quizId: number) =>
    appApi.get(`/quiz-sessions/${quizId}/attempts`),

  reportAntiCheatEvent: (sessionId: number, eventType: string, eventData?: any) =>
    appApi.post(`/quiz-sessions/${sessionId}/anti-cheat`, {
      event_type: eventType,
      event_data: eventData
    }),
}

export default quizSession
