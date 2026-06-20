import BaseAPI from './BaseAPI'

export type DisciplinaryCaseType = {
  id: number | null
  school_id: number | null
  name: string | null
  description: string | null
  created_at: string | null
  updated_at: string | null
  deleted_at: string | null
}

export default class DisciplinaryCaseAPI extends BaseAPI<DisciplinaryCaseType> {
  constructor () {
    super('/disciplinary-cases')
    this.defaultObject = {
      id: null,
      school_id: null,
      name: null,
      description: null,
      created_at: null,
      updated_at: null,
      deleted_at: null
    }
  }
}
