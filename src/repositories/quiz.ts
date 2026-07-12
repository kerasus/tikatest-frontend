import BaseAPI from './BaseAPI'
import type { QuizBookletType } from './quizBooklet'

export type QuizContentType = {
  type: 'image' | 'text'
  path?: string
  body?: string
}

export type QuizType = {
   id: number | null
   school_id: number | null
   name: string | null
   time_limit: number | null
   starts_at: string | null
   ends_at: string | null
   start_time: string | null
   end_time: string | null
   description: string | null
   is_visible: boolean
   quiz_type: string | null
   content: QuizContentType[] | null
   solution: QuizContentType[] | null
   show_answer_date: string | null
    no_score_questions: string | null
    timer: string | null
    questions?: QuizQuestionType[]
    answer_keys?: QuizAnswerKeyType[]
    responses?: QuizResponseType[]
    booklets?: QuizBookletType[]
    created_at: string | null
    updated_at: string | null
  }

 export type QuizQuestionType = {
   id: number
   question_text: string
   question_type: string
   points: number
   has_negative_marking: boolean
   negative_marks: number | null
   question_image_url: string | null
   options?: QuizQuestionOptionType[]
 }

 export type QuizQuestionOptionType = {
   id: number
   option_number: number
   option_text: string
   option_image_url: string | null
   is_correct_answer: boolean
 }

export type QuizAnswerKeyType = {
  id: number | null
  quiz_id: number | null
  question_number: number
  correct_option: string
  weight: number
  is_active: boolean
}

export type QuizResponseType = {
  id: number | null
  user_id: number | null
  quiz_id: number | null
  question_number: number
  submitted_option: string | null
  is_correct: boolean | null
}

export default class QuizAPI extends BaseAPI<QuizType> {
  constructor () {
    super('/quizzes')
this.defaultObject = {
       id: null,
       school_id: null,
       name: null,
       time_limit: null,
       starts_at: null,
       ends_at: null,
       start_time: null,
       end_time: null,
       description: null,
       is_visible: true,
       quiz_type: null,
       content: null,
       solution: null,
       show_answer_date: null,
       no_score_questions: null,
       timer: null,
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

  getNormalizedItem (item: QuizType) {
    item = super.getNormalizedItem(item)
    item.starts_at = item.starts_at ?? item.start_time
    item.ends_at = item.ends_at ?? item.end_time
    item.start_time = item.start_time ?? item.starts_at
    item.end_time = item.end_time ?? item.ends_at
    return item
  }
}

export const quiz = new QuizAPI()
export const quizRepository = quiz
