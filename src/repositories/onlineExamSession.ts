import BaseAPI from './BaseAPI'

export type OnlineExamSessionType = {
  id: number | null
  exam_id: number | null
  student_id: number | null
  status: 'not_started' | 'in_progress' | 'submitted' | 'graded' | 'expired' | null
  started_at: string | null
  submitted_at: string | null
  duration_limit_seconds: number | null
  time_used_seconds: number | null
  score: number | null
  percent: number | null
  ip_address: string | null
  user_agent: string | null
  attempt_number: number | null
  is_locked: boolean | null
  created_at: string | null
  updated_at: string | null
  exam?: any | null
  student?: {
    id: number | null
    full_name: string | null
    first_name: string | null
    last_name: string | null
  } | null
  responses?: any[] | null
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
      score: 0,
      percent: 0,
      ip_address: null,
      user_agent: null,
      attempt_number: 1,
      is_locked: false,
      created_at: null,
      updated_at: null
    }
  }

  async start (examId: number, attemptNumber: number = 1): Promise<any> {
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
