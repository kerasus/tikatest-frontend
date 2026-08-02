import BaseAPI from './BaseAPI'

export type ExamType = {
  id: number | null
  name: string | null
  description: string | null
  lesson_id: number | null
  min_passing_score: number | null
  max_score: number | null
  delivery_mode: 'online' | 'in_person' | null
  exam_category_id: number | null
  created_by: number | null
  created_at: string | null
  updated_at: string | null
  category?: {
    id: number | null
    title: string | null
    school_id: number | null
    term_number: number | null
    is_system: boolean
  } | null
  lesson?: {
    id: number | null
    name: string | null
  } | null
  inPersonDetail?: {
    id: number | null
    exam_id: number | null
    held_at: string | null
    is_descriptive: boolean
  } | null
  onlineDetail?: {
    id: number | null
    exam_id: number | null
    starts_at: string | null
    ends_at: string | null
    time_limit_minutes: number | null
    visible_at: string | null
    answers_visible_at: string | null
    content: any | null
    solution: any | null
  } | null
  answerKeys?: any[]
  classes?: any[]
  academicLevels?: any[]
  grades?: any[]
}

export default class ExamAPI extends BaseAPI<ExamType> {
  constructor () {
    super('/exams')
    this.defaultObject = {
      id: null,
      name: null,
      description: null,
      lesson_id: null,
      min_passing_score: null,
      max_score: null,
      delivery_mode: 'in_person',
      exam_category_id: null,
      created_by: null,
      created_at: null,
      updated_at: null
    }
    this.endpoints = {
      ...this.endpoints,
      storeWithInPersonDetailAndResults: '/exams/store-with-inperson-results'
    }
  }

  async storeWithInPersonDetailAndResults (data: {
    name: string
    description?: string
    lesson_id?: number
    min_passing_score?: number
    max_score?: number
    exam_category_id: number
    created_by?: number
    held_at: string
    is_descriptive?: boolean
    class_ids?: number[]
    academic_level_ids?: number[]
    results: {
      user_id: number
      raw_score?: number
      scaled_score?: number
      z_score?: number
    }[]
  }): Promise<any> {
    const response = await this.getAxiosInstanceWithToken().post(this.endpoints.storeWithInPersonDetailAndResults!, data)
    return response.data
  }
}

export const exam = new ExamAPI()
