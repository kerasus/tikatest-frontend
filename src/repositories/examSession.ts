import BaseAPI from './BaseAPI'

export type ExamSessionType = {
  id: number | null
  school_id: number | null
  lesson_id: number | null
  class_id: number | null
  gregorian_date: string | null
  persian_date: string | null
  grade_type: string | null
  grade_name_for_other_type: string | null
  is_descriptive: boolean
  is_report_card: boolean
  min_grade: number | null
  created_by: number | null
  created_at: string | null
  updated_at: string | null
}

export default class ExamSessionAPI extends BaseAPI<ExamSessionType> {
  constructor () {
    super('/exam-sessions')
    this.defaultObject = {
      id: null,
      school_id: null,
      lesson_id: null,
      class_id: null,
      gregorian_date: null,
      persian_date: null,
      grade_type: null,
      grade_name_for_other_type: null,
      is_descriptive: false,
      is_report_card: false,
      min_grade: null,
      created_by: null,
      created_at: null,
      updated_at: null
    }
  }
}
