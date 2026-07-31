import BaseAPI from './BaseAPI'

export type { ListType } from './BaseAPI'
export type GradeType = {
  id: number | null
  in_person_exam_id: number | null
  user_id: number | null
  raw_score: number | null
  scaled_score: number | null
  z_score: number | null
  recorded_by: number | null
  exam_id: number | null
  lesson_id: number | null
  class_ids: number[] | null
  grade_type: string | null
  grade_name_for_other_type: string | null
  exam_date: string | null
  is_descriptive: boolean | null
  is_report_card: boolean
  min_passing_score: number | null
  max_score: number | null
  gregorian_date: string | null
  persian_date: string | null
  is_visible: boolean
  explanation: string | null
  created_at: string | null
  updated_at: string | null
  inPersonExamDetail?: {
    id: number | null
    exam_id: number | null
    held_at: string | null
    is_descriptive: boolean
    exam?: {
      id: number | null
      name: string | null
      category?: {
        id: number | null
        title: string | null
      } | null
      lesson?: {
        id: number | null
        name: string | null
      } | null
      classes?: {
        id: number | null
        name: string | null
      }[] | null
    } | null
  } | null
  student?: {
    id: number | null
    full_name: string | null
    first_name?: string | null
    last_name?: string | null
  } | null
  lesson?: {
    id: number | null
    name: string | null
  } | null
  schoolClass?: {
    id: number | null
    name: string | null
  } | null
}

export default class GradeAPI extends BaseAPI<GradeType> {
  constructor () {
    super('/grades')
    this.defaultObject = {
      id: null,
      in_person_exam_id: null,
      user_id: null,
      raw_score: null,
      scaled_score: null,
      z_score: null,
      recorded_by: null,
      exam_id: null,
      lesson_id: null,
      class_ids: null,
      grade_type: null,
      grade_name_for_other_type: null,
      exam_date: null,
      is_descriptive: false,
      is_report_card: false,
      min_passing_score: null,
      max_score: null,
      is_visible: true,
      gregorian_date: null,
      persian_date: null,
      explanation: null,
      created_at: null,
      updated_at: null
    }
    this.endpoints = {
      ...this.endpoints,
      lessonReport: (lessonId: number) => `/grades/report/lesson/${lessonId}`,
      multipleLessonsReport: '/grades/report/multiple-lessons',
      studentReport: (studentId: number) => `/grades/report/student/${studentId}`,
      bulkStore: '/grades/bulk',
      createExamWithGrades: '/grades/store-with-exam'
    }
  }

  async lessonReport (lessonId: number, params: any = {}): Promise<any> {
    const response = await this.getAxiosInstanceWithToken().get(this.endpoints.lessonReport(lessonId), {
      params
    })
    return response.data
  }

  async multipleLessonsReport (params: { lesson_ids: number[], class_id?: number }): Promise<any> {
    const response = await this.getAxiosInstanceWithToken().get(this.endpoints.multipleLessonsReport, {
      params
    })
    return response.data
  }

  async studentReport (studentId: number, params: any = {}): Promise<any> {
    const response = await this.getAxiosInstanceWithToken().get(this.endpoints.studentReport(studentId), {
      params
    })
    return response.data
  }

  async bulkStore (data: { grades: any[] }): Promise<any> {
    const response = await this.getAxiosInstanceWithToken().post(this.endpoints.bulkStore!, data)
    return response.data
  }

  async createExamWithGrades (data: any): Promise<any> {
    const response = await this.getAxiosInstanceWithToken().post(this.endpoints.createExamWithGrades!, data)
    return response.data
  }
}

export const grade = new GradeAPI()
export const gradeRepository = grade