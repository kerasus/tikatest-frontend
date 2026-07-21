import BaseAPI from './BaseAPI'

export type { ListType } from './BaseAPI'
export type GradeType = {
  id: number | null
  school_id: number | null
  exam_session_id: number | null
  lesson_id: number | null
  student_id: number | null
  class_id: number | null
  raw_grade: number | null
  calculated_grade: number | null
  min_grade: number | null
  grade_type: string | null
  grade_name_for_other_type: string | null
  is_report_card: boolean
  is_descriptive: boolean
  descriptive_value: string | null
  is_visible: boolean
  z_score: number | null
  gregorian_date: string | null
  persian_date: string | null
  explanation: string | null
  created_at: string | null
  updated_at: string | null
  lesson?: {
    id: number | null
    name: string | null
  } | null
  student?: {
    id: number | null
    full_name: string | null
    firstname?: string | null
    lastname?: string | null
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
      school_id: null,
      exam_session_id: null,
      lesson_id: null,
      student_id: null,
      class_id: null,
      raw_grade: null,
      calculated_grade: null,
      min_grade: null,
      grade_type: null,
      grade_name_for_other_type: null,
      is_report_card: false,
      is_descriptive: false,
      descriptive_value: null,
      is_visible: true,
      z_score: null,
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
      studentReport: (studentId: number) => `/grades/report/student/${studentId}`
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
}

export const grade = new GradeAPI()
export const gradeRepository = grade