import BaseAPI from './BaseAPI'
import type { ListType } from './BaseAPI'
import { axiosInstanceManager } from 'src/boot/axios'

export type SchoolType = {
  id: number | null
  code: string | null
  name: string | null
  address: string | null
  website: string | null
  logo_url: string | null
  type: SchoolTypeEnum | null
  account_url: string | null
  created_at: string | null
  updated_at: string | null
  deleted_at: string | null
}

export enum SchoolTypeEnum {
  School = 'school',
  Institute = 'institute'
}

export const SCHOOL_TYPE_LABELS: Record<SchoolTypeEnum, string> = {
  [SchoolTypeEnum.School]: 'مدرسه',
  [SchoolTypeEnum.Institute]: 'موسسه'
}

export type AcademicTermType = 'school_year' | 'seasonal' | 'sub_term'

export const TERM_TYPE_LABELS: Record<AcademicTermType, string> = {
  school_year: 'سال تحصیلی',
  seasonal: 'فصلی',
  sub_term: 'زیرمجموعه'
}

export type AcademicTerm = {
  id: number | null
  school_id: number | null
  name: string | null
  type: AcademicTermType | null
  academic_year: string | null
  season: string | null
  period: number | null
  starts_at: string | null
  ends_at: string | null
  is_active: boolean | null
  parent_id: number | null
  children?: AcademicTerm[]
  created_at: string | null
  updated_at: string | null
}


export default class SchoolAPI extends BaseAPI<SchoolType> {
  constructor () {
    super('/schools')
    this.defaultObject = {
      id: null,
      code: null,
      name: null,
      address: null,
      website: null,
      logo_url: null,
      type: null,
      account_url: null,
      created_at: null,
      updated_at: null,
      deleted_at: null
    }


    this.endpoints = {
      ...this.endpoints,
      terms: (schoolId: number) => `/schools/${schoolId}/terms`,
      termById: (schoolId: number, termId: number) => `/schools/${schoolId}/terms/${termId}`
    }
  }

  async termsIndex (schoolId: number): Promise<AcademicTerm[]> {
    const response = await this.getAxiosInstanceWithToken()
      .get(this.endpoints.terms(schoolId))
    return response.data.data ?? response.data
  }

  async termsStore (schoolId: number, data: Partial<AcademicTerm>): Promise<AcademicTerm> {
    const response = await this.getAxiosInstanceWithToken()
      .post(this.endpoints.terms(schoolId), data)
    return response.data
  }

  async termsUpdate (schoolId: number, termId: number, data: Partial<AcademicTerm>): Promise<AcademicTerm> {
    const response = await this.getAxiosInstanceWithToken()
      .put(this.endpoints.termById(schoolId, termId), data)
    return response.data
  }

  async termsDestroy (schoolId: number, termId: number): Promise<void> {
    await this.getAxiosInstanceWithToken().delete(this.endpoints.termById(schoolId, termId))
  }
}
