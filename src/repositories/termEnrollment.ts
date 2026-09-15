import BaseAPI from './BaseAPI'
import type { AcademicTermType } from './academicTerm'
import type { SchoolClassType } from './schoolClass'

export type TermEnrollmentType = {
  id: number | null
  user_id: number | null
  student_id?: number | null
  class_id: number | null
  school_id: number | null
  term_id: number | null
  enrolled_at: string | null
  left_at: string | null
  term?: AcademicTermType | null
  school_class?: SchoolClassType | null
  class?: SchoolClassType | null
  school?: { id: number | null; name: string | null } | null
  created_at: string | null
  updated_at: string | null
}

export type TermEnrollmentPayload = Pick<
  TermEnrollmentType,
  'class_id' | 'school_id' | 'term_id'
> & {
  student_id: number
  enrolled_at?: string | null
  left_at?: string | null
}

export default class TermEnrollmentAPI extends BaseAPI<TermEnrollmentType> {
  constructor () {
    super('/term-enrollments')
    this.defaultObject = {
      id: null,
      user_id: null,
      class_id: null,
      school_id: null,
      term_id: null,
      enrolled_at: null,
      left_at: null,
      created_at: null,
      updated_at: null
    }
  }

  async enroll (payload: TermEnrollmentPayload): Promise<number> {
    return this.create({
      ...this.defaultObject,
      ...payload,
      user_id: payload.student_id
    })
  }
}

export const termEnrollment = new TermEnrollmentAPI()