import BaseAPI from './BaseAPI'

export type QuizType = {
  id: number | null
  school_id: number | null
  name: string | null
  correct_answers: string | null
  timer: string | null
  start_time: string | null
  end_time: string | null
  explanation: string | null
  is_visible: boolean
  quiz_type: string | null
  question_url: string | null
  answer_explanation: string | null
  false_negative_grading: boolean
  questions_text: string | null
  answers_text: string | null
  picture_id: string | null
  show_answer_date: string | null
  no_score_questions: string | null
  created_at: string | null
  updated_at: string | null
}

export default class QuizAPI extends BaseAPI<QuizType> {
  constructor () {
    super('/quizzes')
    this.defaultObject = {
      id: null,
      school_id: null,
      name: null,
      correct_answers: null,
      timer: null,
      start_time: null,
      end_time: null,
      explanation: null,
      is_visible: true,
      quiz_type: null,
      question_url: null,
      answer_explanation: null,
      false_negative_grading: false,
      questions_text: null,
      answers_text: null,
      picture_id: null,
      show_answer_date: null,
      no_score_questions: null,
      created_at: null,
      updated_at: null
    }
    this.endpoints = {
      ...this.endpoints,
      resultsWithRank: (quizId: number) => `${this.baseEndpoint}/${quizId}/results-with-rank`,
      assignParticipants: (quizId: number) => `${this.baseEndpoint}/${quizId}/participants`,
    }
  }

  async resultsWithRank (quizId: number) {
    return this.getAxiosInstanceWithToken().get(this.endpoints.resultsWithRank!(quizId))
  }

  async assignParticipants (quizId: number, classIds: number[]) {
    return this.getAxiosInstanceWithToken().post(this.endpoints.assignParticipants!(quizId), { class_ids: classIds })
  }
}

export const quiz = new QuizAPI()
export const quizRepository = quiz
