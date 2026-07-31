import BaseAPI from './BaseAPI'

export type { ListType } from './BaseAPI'

export type StudentGuardianType = {
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
    mobile: string | null
  } | null
  studentProfile?: {
    id: number | null
    user?: {
      id: number | null
      first_name: string | null
      last_name: string | null
      full_name: string | null
    } | null
  } | null
}

export default class StudentGuardianAPI extends BaseAPI<StudentGuardianType> {
  constructor () {
    super('/student-guardians')
    this.defaultObject = {
      id: null,
      user_id: null,
      student_profile_id: null,
      relationship_type: null,
      job: null,
      is_primary_contact: false,
      created_at: null,
      updated_at: null
    }
  }
}

export const studentGuardian = new StudentGuardianAPI()
export const studentGuardianRepository = studentGuardian
