import BaseAPI from './BaseAPI'
import type { SchoolType } from './school'

export type SchoolSkyroomAccountType = {
  id: number | null
  school_id: number | null
  school?: SchoolType | null
  title: string | null
  username: string | null
  api_key?: string | null
  is_active: boolean
  rooms_count?: number
  created_at: string | null
  updated_at: string | null
}

export default class SchoolSkyroomAccountAPI extends BaseAPI<SchoolSkyroomAccountType> {
  constructor (schoolId: number) {
    super(`/schools/${schoolId}/skyroom-accounts`)
    this.defaultObject = {
      id: null,
      school_id: schoolId,
      title: null,
      username: null,
      api_key: null,
      is_active: true,
      rooms_count: 0,
      created_at: null,
      updated_at: null
    }
  }
}
