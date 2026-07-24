import BaseAPI from './BaseAPI'

export type { ListType } from './BaseAPI'
export type LessonType = {
  id: number | null
  school_id: number | null
  name: string | null
  class_id: number | null
  order: number | null
  coefficient: number | null
  is_report_card: boolean
  created_at: string | null
  updated_at: string | null
  deleted_at: string | null
  school?: {
    id: number | null
    name: string | null
    code: string | null
  }
  schoolClass?: {
    id: number | null
    name: string | null
  }
}

export default class LessonAPI extends BaseAPI<LessonType> {
  constructor () {
    super('/lessons')
    this.defaultObject = {
      id: null,
      school_id: null,
      name: null,
      class_id: null,
      order: 0,
      coefficient: 1,
      is_report_card: false,
      created_at: null,
      updated_at: null,
      deleted_at: null
    }
  }
}

export const lesson = new LessonAPI()
