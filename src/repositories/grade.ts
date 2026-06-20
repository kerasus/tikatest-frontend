import BaseAPI from './BaseAPI'

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
  }
}
