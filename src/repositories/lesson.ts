import BaseAPI from './BaseAPI'

export type LessonType = {
  id: number | null
  school_id: number | null
  name: string | null
  field_id: number | null
  level_id: number | null
  class_id: number | null
  coefficient: number | null
  created_at: string | null
  updated_at: string | null
  deleted_at: string | null
}

export default class LessonAPI extends BaseAPI<LessonType> {
  constructor () {
    super('/lessons')
    this.defaultObject = {
      id: null,
      school_id: null,
      name: null,
      field_id: null,
      level_id: null,
      class_id: null,
      coefficient: 1,
      created_at: null,
      updated_at: null,
      deleted_at: null
    }
  }
}
