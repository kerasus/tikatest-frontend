import BaseAPI from './BaseAPI'
import type { ListType } from './BaseAPI'

export type SchoolType = {
  id: number | null
  code: string | null
  name: string | null
  address: string | null
  website: string | null
  logo_url: string | null
  type: 'school' | 'institute' | null
  account_url: string | null
  created_at: string | null
  updated_at: string | null
  deleted_at: string | null
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
  }
}
