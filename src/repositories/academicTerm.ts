import BaseAPI from './BaseAPI'
import { axiosInstanceManager } from 'src/boot/axios'
import { SchoolType } from 'src/repositories/school'

export type AcademicTermTypeType = 'school_year' | 'seasonal' | 'sub_term'

export const TERM_TYPE_LABELS: Record<AcademicTermTypeType, string> = {
  school_year: 'سال تحصیلی',
  seasonal: 'فصلی',
  sub_term: 'زیرمجموعه'
}

export type AcademicTermType = {
  id: number | null
  school_id: number | null
  school?: SchoolType
  name: string | null
  type: AcademicTermTypeType | null
  academic_year: string | null
  season: string | null
  period: number | null
  starts_at: string | null
  ends_at: string | null
  is_active: boolean | null
  parent_id: number | null
  children?: AcademicTermType[]
  created_at: string | null
  updated_at: string | null
}

export default class AcademicTermAPI extends BaseAPI<AcademicTermType> {
  constructor (schoolId: number) {
    super(`/schools/${schoolId}/terms`)
    this.defaultObject = {
      id: null,
      school_id: null,
      name: null,
      type: null,
      academic_year: null,
      season: null,
      period: null,
      starts_at: null,
      ends_at: null,
      is_active: null,
      parent_id: null,
      created_at: null,
      updated_at: null
    }
  }
}
