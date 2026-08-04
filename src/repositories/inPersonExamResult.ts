import BaseAPI from './BaseAPI'

export type InPersonExamResultType = {
  id: number | null
  in_person_exam_id: number | null
  user_id: number | null
  raw_score: number | null
  scaled_score: number | null
  recorded_by: number | null
  z_score: number | null
  created_at: string | null
  updated_at: string | null
  student?: {
    id: number | null
    full_name: string | null
    first_name: string | null
    last_name: string | null
  } | null
  inPersonExamDetail?: {
    id: number | null
    exam_id: number | null
    held_at: string | null
    is_descriptive: boolean
    exam?: {
      id: number | null
      name: string | null
    } | null
  } | null
}

export default class InPersonExamResultAPI extends BaseAPI<InPersonExamResultType> {
  constructor () {
    super('/in-person-exam-results')
    this.defaultObject = {
      id: null,
      in_person_exam_id: null,
      user_id: null,
      raw_score: null,
      scaled_score: null,
      recorded_by: null,
      z_score: null,
      created_at: null,
      updated_at: null
    }
  }
}

export const inPersonExamResult = new InPersonExamResultAPI()
