import BaseAPI from './BaseAPI'
import type { LessonType } from 'src/repositories/lesson'
import type { BookletType, ExamType, OnlineExamDetailType } from 'src/repositories/exam'
import type { UserType } from 'src/repositories/user'

export type ParticipationStatus =
  | 'not_started'
  | 'in_progress'
  | 'submitted'
  | 'graded'
  | 'expired';

export type OnlineExamSessionResponseItemType = {
  id: number | null
  session_id: number | null
  question_number: number | null
  booklet_id?: number | null
  lesson_id?: number | null
  submitted_option: string | null
  answer_text: string | null
  is_correct: boolean | null
  marks_obtained: number | null
  created_at: string | null
  updated_at: string | null
}

export type OnlineExamSessionResultType = {
  id: number | null
  online_exam_session_id: number | null
  online_exam_booklet_id: number | null
  lesson_id: number | null
  question_count: number | null
  answered_questions: number | null
  correct_count: number | null
  wrong_count: number | null
  unanswered_count: number | null
  raw_score: number | null
  t_score: number | null
  percent: number | null
  rank_in_lesson?: number | null
  rank_in_booklet?: number | null
  rank_in_exam?: number | null
  created_at?: string | null
  updated_at?: string | null
  lesson?: LessonType | null
  booklet?: BookletType | null
}

export type OnlineExamSessionType = {
  id: number | null
  exam_id: number | null
  student_id: number | null
  status: ParticipationStatus | null
  started_at: string | null
  submitted_at: string | null
  duration_limit_seconds: number | null
  time_used_seconds: number | null
  t_score: number | null
  percent: number | null
  ip_address: string | null
  user_agent: string | null
  attempt_number: number | null
  is_locked: boolean | null
  created_at: string | null
  updated_at: string | null
  exam?: ExamType | null
  student?: UserType | null
  responses?: OnlineExamSessionResponseItemType[] | null
  results?: OnlineExamSessionResultType[] | null
}

export type StudentAnswerKeyType = {
  id: number | null
  exam_id: number | null
  question_number: number | null
  number_of_choices: number | null
  correct_option?: string | null
  submitted_option?: string | null
  weight: string | number | null
  has_negative_mark: boolean | null
  is_active: boolean | null
}

export type StartExamResponseType = {
  session: OnlineExamSessionType
  remaining_time: number | null
  answer_keys: StudentAnswerKeyType[] | null
  error?: string | null
  status?: number | string | null
}

export default class OnlineExamSessionAPI extends BaseAPI<OnlineExamSessionType> {
  constructor () {
    super('/online-exam-sessions')
    this.defaultObject = {
      id: null,
      exam_id: null,
      student_id: null,
      status: 'not_started',
      started_at: null,
      submitted_at: null,
      duration_limit_seconds: null,
      time_used_seconds: 0,
      t_score: 0,
      percent: 0,
      ip_address: null,
      user_agent: null,
      attempt_number: 1,
      is_locked: false,
      created_at: null,
      updated_at: null,
      exam: null,
      student: null,
      responses: [],
      results: []
    }
  }

  async start (examId: number, attemptNumber: number = 1): Promise<StartExamResponseType> {
    const response = await this.getAxiosInstanceWithToken().post(
      `${this.baseEndpoint}/${examId}/start`,
      { attempt_number: attemptNumber }
    )
    return response.data
  }

  async mySessions (): Promise<OnlineExamSessionType[]> {
    const response = await this.getAxiosInstanceWithToken().get(
      `${this.baseEndpoint}/my-sessions`
    )
    return response.data
  }

  async getExamSessions (examId: number): Promise<OnlineExamSessionType[]> {
    const response = await this.getAxiosInstanceWithToken().get(
      `${this.baseEndpoint}/${examId}/sessions`
    )
    return response.data
  }

  async getSession (sessionId: number): Promise<any> {
    const response = await this.getAxiosInstanceWithToken().get(
      `${this.baseEndpoint}/${sessionId}/view`
    )
    return response.data
  }

  async show (sessionId: number): Promise<StartExamResponseType> {
    const response = await this.getAxiosInstanceWithToken().get(
      `${this.baseEndpoint}/${sessionId}`
    )
    return response.data
  }

  async getMyResultByExamId (examId: number, params?: { attempt_number?: number }): Promise<StartExamResponseType> {
    const response = await this.getAxiosInstanceWithToken().get(
      `${this.baseEndpoint}/${examId}/my-result`,
      { params }
    )
    return response.data
  }

  async getResultBySessionId (sessionId: number): Promise<StartExamResponseType> {
    const response = await this.getAxiosInstanceWithToken()
      .get(`${this.baseEndpoint}/${sessionId}`)
    return response.data
  }

  async submitAnswer (sessionId: number, questionNumber: number, submittedOption?: string, answerText?: string): Promise<any> {
    const response = await this.getAxiosInstanceWithToken().post(
      `${this.baseEndpoint}/${sessionId}/answer`,
      {
        question_number: questionNumber,
        submitted_option: submittedOption,
        answer_text: answerText
      }
    )
    return response.data
  }

  async submitSession (sessionId: number): Promise<any> {
    const response = await this.getAxiosInstanceWithToken().post(
      `${this.baseEndpoint}/${sessionId}/submit`
    )
    return response.data
  }

  async autoExpire (): Promise<any> {
    const response = await this.getAxiosInstanceWithToken().post(
      `${this.baseEndpoint}/auto-expire`
    )
    return response.data
  }
}
