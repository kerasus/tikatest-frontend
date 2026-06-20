import BaseAPI from './BaseAPI'

export type QuizAttemptType = {
  id: number | null
  school_id: number | null
  quiz_id: number | null
  student_id: number | null
  lesson_id: number | null
  started_at: string | null
  ended_at: string | null
  user_answer: string | null
  temp_answer: string | null
  percent: number | null
  answer_status: 'not_sent' | 'sent'
  is_locked: boolean
  created_at: string | null
  updated_at: string | null
}

export default class QuizAttemptAPI extends BaseAPI<QuizAttemptType> {
  constructor () {
    super('/quiz-attempts')
    this.defaultObject = {
      id: null,
      school_id: null,
      quiz_id: null,
      student_id: null,
      lesson_id: null,
      started_at: null,
      ended_at: null,
      user_answer: null,
      temp_answer: null,
      percent: null,
      answer_status: 'not_sent',
      is_locked: false,
      created_at: null,
      updated_at: null
    }
  }
}
