import BaseAPI from './BaseAPI'

export type { ListType } from './BaseAPI'

export interface StudentProfileType {
  id: number | null
  user_id: number | null
  code: string | null
  xp: number | null
  created_at: string | null
  updated_at: string | null
  deleted_at: string | null
  user?: {
    id: number | null
    first_name: string | null
    last_name: string | null
    full_name: string | null
  } | null
  guardians?: StudentGuardianType[] | null
}

export interface StudentGuardianType {
  id: number | null
  user_id: number | null
  student_profile_id: number | null
  relationship_type: string | null
  job: string | null
  is_primary_contact: boolean
  created_at: string | null
  updated_at: string | null
  user?: {
    id: number | null
    first_name: string | null
    last_name: string | null
    full_name: string | null
  } | null
  studentProfile?: {
    id: number | null
    user?: {
      id: number | null
      full_name: string | null
    } | null
  } | null
}

export default class StudentProfileAPI extends BaseAPI<StudentProfileType> {
  constructor () {
    super('/student-profiles')
    this.defaultObject = {
      id: null,
      user_id: null,
      code: null,
      xp: 0,
      created_at: null,
      updated_at: null,
      deleted_at: null
    }
  }
}

export const studentProfile = new StudentProfileAPI()
export const studentProfileRepository = studentProfile
