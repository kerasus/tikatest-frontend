import BaseAPI from './BaseAPI'

export type UserClassRegistrationType = {
  id: number | null
  student_id: number | null
  class_id: number | null
  school_class?: {
    id: number | null
    name: string | null
    academic_level?: {
      id: number | null
      name: string | null
      academic_field?: {
        id: number | null
        name: string | null
      } | null
    } | null
  } | null
  created_at: string | null
  updated_at: string | null
}

export default class UserClassRegistrationAPI extends BaseAPI<UserClassRegistrationType> {
  constructor () {
    super('/user-class-registrations')
    this.defaultObject = {
      id: null,
      student_id: null,
      class_id: null,
      school_class: null,
      created_at: null,
      updated_at: null
    }
  }
}

export const userClassRegistration = new UserClassRegistrationAPI()