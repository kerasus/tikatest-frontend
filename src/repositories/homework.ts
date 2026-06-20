import BaseAPI from './BaseAPI'

export type HomeworkType = {
  id: number | null
  school_id: number | null
  lesson_id: number | null
  class_id: number | null
  title: string | null
  description: string | null
  attachment: string | null
  due_date: string | null
  created_by: number | null
  created_at: string | null
  updated_at: string | null
  deleted_at: string | null
}

export default class HomeworkAPI extends BaseAPI<HomeworkType> {
  constructor () {
    super('/homework')
    this.defaultObject = {
      id: null,
      school_id: null,
      lesson_id: null,
      class_id: null,
      title: null,
      description: null,
      attachment: null,
      due_date: null,
      created_by: null,
      created_at: null,
      updated_at: null,
      deleted_at: null
    }
  }
}
