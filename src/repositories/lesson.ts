import BaseAPI, { type ListType } from './BaseAPI'
import type { AcademicLevelType } from 'src/repositories/academicLevel'


export type LessonType = {
  id: number | null;
  name: string | null;
  academic_level_id: number | null;
  order: number | null;
  coefficient: number | null;
  is_report_card: boolean;
  created_at: string | null;
  updated_at: string | null;
  deleted_at: string | null;
  academic_level?: AcademicLevelType;
};

export default class LessonAPI extends BaseAPI<LessonType> {
  constructor () {
    super('/lessons')
    this.defaultObject = {
      id: null,
      name: null,
      academic_level_id: null,
      order: 0,
      coefficient: 1,
      is_report_card: false,
      created_at: null,
      updated_at: null,
      deleted_at: null
    }
    this.endpoints = {
      ...this.endpoints,
      mine: `${this.baseEndpoint}/mine`
    }
  }

  async mine (filters: any = { length: 10 }): Promise<ListType<LessonType>> {
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

export const lesson = new LessonAPI()
