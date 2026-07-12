import BaseAPI from './BaseAPI'
import { appApi } from 'src/boot/axios'

export type QuizBookletType = {
  id: number | null
  quiz_id: number | null
  title: string | null
  from_question: number | null
  to_question: number | null
  created_at: string | null
  updated_at: string | null
  percent?: number | null
}

export default class QuizBookletAPI extends BaseAPI<QuizBookletType> {
  constructor () {
    super('/quiz-booklets')
    this.defaultObject = {
      id: null,
      quiz_id: null,
      title: null,
      from_question: null,
      to_question: null,
      created_at: null,
      updated_at: null
    }
    this.endpoints = {
      ...this.endpoints,
      sync: (quizId: number) => `/quizzes/${quizId}/booklets/sync`
    }
  }

  async sync (quizId: number, booklets: any[]) {
    return appApi.post(this.endpoints.sync!(quizId), { booklets })
  }
}

export const quizBooklet = new QuizBookletAPI()
