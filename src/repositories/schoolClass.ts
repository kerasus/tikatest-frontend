import BaseAPI from './BaseAPI'

export type SchoolClassType = {
  id: number | null
  school_id: number | null
  field_id: number | null
  level_id: number | null
  name: string | null
  created_at: string | null
  updated_at: string | null
  deleted_at: string | null
}

export default class SchoolClassAPI extends BaseAPI<SchoolClassType> {
  constructor () {
    super('/classes')
    this.defaultObject = {
      id: null,
      school_id: null,
      field_id: null,
      level_id: null,
      name: null,
      created_at: null,
      updated_at: null,
      deleted_at: null
    }
  }
}
