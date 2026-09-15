import BaseAPI from './BaseAPI'

export type { ListType } from './BaseAPI'

export type SchoolUserType = {
  id: number | null
  school_id: number | null
  user_id: number | null
  personnel_code: string | null
  is_active: boolean
  joined_at: string | null
  left_at: string | null
  created_at: string | null
  updated_at: string | null
  user?: {
    id: number | null
    first_name: string | null
    last_name: string | null
    full_name: string | null
    mobile: string | null
  } | null
  school?: {
    id: number | null
    name: string | null
    code: string | null
  } | null
}

export default class SchoolUserAPI extends BaseAPI<SchoolUserType> {
  constructor () {
    super('/school-users')
    this.defaultObject = {
      id: null,
      school_id: null,
      user_id: null,
      personnel_code: null,
      is_active: true,
      joined_at: null,
      left_at: null,
      created_at: null,
      updated_at: null
    }
  }
}

export const schoolUser = new SchoolUserAPI()
export const schoolUserRepository = schoolUser
