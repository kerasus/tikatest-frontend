import { BaseAPI } from 'src/repositories/BaseAPI'

export const quizSession = {
  startSession: (quizId: number, attemptNumber = 1) =>
    BaseAPI.post(`/quizzes/${quizId}/start-session`, { attempt_number: attemptNumber }),

  getSession: (sessionId: number) =>
    BaseAPI.get(`/quiz-sessions/${sessionId}`),

  submitAnswer: (sessionId: number, data: any) =>
    BaseAPI.post(`/quiz-sessions/${sessionId}/submit-answer`, data),

  submitQuiz: (sessionId: number) =>
    BaseAPI.post(`/quiz-sessions/${sessionId}/submit`, {}),

  getMyAttempts: () =>
    BaseAPI.get(`/my-quiz-attempts`),
}

export default quizSession
