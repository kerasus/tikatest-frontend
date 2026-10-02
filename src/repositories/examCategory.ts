import BaseAPI, { type ListType } from './BaseAPI'

export type ExamCategoryType = {
  id: number | null
  school_id: number | null
  title: string | null
  term_number: number | null
  sort_order: number
  is_system: boolean
  created_at: string | null
  updated_at: string | null
  exams?: any[]
  school?: {
    id: number | null
    name: string | null
  } | null
}

export default class ExamCategoryAPI extends BaseAPI<ExamCategoryType> {
  constructor () {
    super('/exam-categories')
    this.defaultObject = {
      id: null,
      school_id: null,
      title: null,
      term_number: null,
      sort_order: 0,
      is_system: false,
      created_at: null,
      updated_at: null
    }
    this.endpoints = {
      ...this.endpoints,
      mine: `${this.baseEndpoint}/mine`
    }
  }

  async mine (filters: any = { length: 10 }): Promise<ListType<ExamCategoryType>> {
    return new Promise((resolve, reject) => {
      this.getAxiosInstanceWithToken()
        .get(this.endpoints.mine, {
          params: this.getNormalizedIndexFilter(filters)
        })
        .then((response) => {
          const normalizedListType = this.getNormalizedListType(response)
          normalizedListType.data = this.getNormalizedList(normalizedListType.data)
          resolve(normalizedListType)
        })
        .catch((e) => {
          console.error(e)
          reject(e)
        })
    })
  }
}

export const examCategory = new ExamCategoryAPI()
