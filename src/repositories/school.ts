import BaseAPI from './BaseAPI'
import { axiosInstanceManager } from 'src/boot/axios'

export type SchoolType = {
  id: number | null
  slug: string | null
  name: string | null
  address: string | null
  website: string | null
  logo: string | null
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

export default class SchoolAPI extends BaseAPI<SchoolType> {
  constructor () {
    super('/schools')
    this.defaultObject = {
      id: null,
      name: null,
      slug: null,
      address: null,
      website: null,
      logo: null,
      type: null,
      account_url: null,
      created_at: null,
      updated_at: null,
      deleted_at: null
    }

    this.endpoints = {
      ...this.endpoints,
      slug: (slug: string) => `${this.baseEndpoint}/slug/${slug}`,
      termById: (schoolId: number, termId: number) => `/schools/${schoolId}/terms/${termId}`
    }
  }

  async getBySlug (slug: string) {
    const response = await this.getAxiosInstanceWithToken()
      .get(this.endpoints.slug(slug))
    return response.data
  }
}
