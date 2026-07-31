import BaseAPI from './BaseAPI'

export type ExamCategoryType = {
  id: number | null
  school_id: number | null
  title: string | null
  term_number: number | null
  sort_order: number
  is_system: boolean
  created_at: string | null
  updated_at: string | null
  exams?: any[]
  school?: {
    id: number | null
    name: string | null
  } | null
}

export default class ExamCategoryAPI extends BaseAPI<ExamCategoryType> {
  constructor () {
    super('/exam-categories')
    this.defaultObject = {
      id: null,
      school_id: null,
      title: null,
      term_number: null,
      sort_order: 0,
      is_system: false,
      created_at: null,
      updated_at: null
    }
  }
}

export const examCategory = new ExamCategoryAPI()
