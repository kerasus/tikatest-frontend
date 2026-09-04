import BaseAPI from './BaseAPI'

export type ReportCardLessonResult = {
  id: number
  exam_id: number | null
  exam_name: string | null
  category: string | null
  raw_score: number | null
  scaled_score: number | null
  percent: number | null
  is_descriptive: boolean | null
  held_at: string | null
  scope: string | null
  booklet_id: number | null
  booklet_title: string | null
  max_score: number | null
  correct_count: number | null
  question_count: number | null
}

export type ReportCardLesson = {
  id: number
  name: string
  coefficient: number | null
  results: {
    total_count: number
    avg_score: number
    max_score: number
  }
  in_person_results: ReportCardLessonResult[]
  online_results: ReportCardLessonResult[]
}

export type ReportCardStudentInfoExtended = {
  id: number
  name: string | null
  last_name: string | null
  student_code: string | null
  username: string | null
}

export type ReportCardStudent = {
  student: ReportCardStudentInfoExtended
  lessons: ReportCardLesson[]
}

export type ReportCardClassStudent = {
  student_id: number
  name: string | null
  last_name: string | null
}

export type ReportCardSchool = {
  id: number
  name: string | null
  address: string | null
  phone: string | null
}

export type ReportCardTerm = {
  id: number
  name: string | null
  type: string | null
}

export type ReportCardClass = {
  id: number
  name: string | null
}

export type ReportCardClassCardsResponse = {
  school: ReportCardSchool
  term: ReportCardTerm | null
  class: ReportCardClass
  students: ReportCardStudent[]
}

export type ComprehensiveReportResponse = {
  school: ReportCardSchool
  term: ReportCardTerm | null
  class: ReportCardClass
  students: {
    student: ReportCardStudentInfoExtended
    lessons: {
      id: number
      name: string
      coefficient: number | null
      scores: { exam_id: number; exam_name: string | null; category: string | null; score: number | null; count: number }[]
      avg_score: number | null
    }[]
  }[]
}

export type GradeMatrixResponse = {
  school: ReportCardSchool
  term: ReportCardTerm | null
  class: ReportCardClass
  lesson: { id: number; name: string | null }
  exams: { id: number; name: string; category: string | null; held_at: string | null }[]
  students: {
    student_id: number
    name: string | null
    last_name: string | null
    student_code: string | null
    scores: (number | null)[]
    avg_score: number | null
  }[]
  exam_stats: {
    exam_id: number
    exam_name: string
    category: string | null
    max_score: number | null
    min_score: number | null
    avg_score: number | null
  }[]
  class_avg: number | null
}

export type ClassGradeSheetResponse = {
  school: ReportCardSchool
  term: ReportCardTerm | null
  class: ReportCardClass
  exams: { id: number; name: string; lesson_id: number; lesson_name: string | null; category: string | null }[]
  students: {
    student_id: number
    name: string | null
    last_name: string | null
    student_code: string | null
    scores: (number | null)[]
    overall_avg: number | null
  }[]
  column_stats: {
    exam_id: number
    exam_name: string
    lesson_name: string | null
    max_score: number | null
    min_score: number | null
    avg_score: number | null
  }[]
  lesson_stats: {
    lesson_id: number
    lesson_name: string | null
    max_score: number | null
    min_score: number | null
    avg_score: number | null
  }[]
}

export type ReportCardEnrollment = {
  class_id: number | null
  class_name: string | null
  term_id: number | null
  term_name: string | null
  school_id: number | null
}

export type ReportCardIndex = {
  student: {
    id: number
    name: string | null
    last_name: string | null
    student_code: string | null
    username: string | null
  }
  enrollments: ReportCardEnrollment[]
}

export default class ReportCardAPI extends BaseAPI<any> {
  constructor () {
    super('/report-cards')
    this.defaultObject = {
      id: null
    }
  }

  override async index (filters: any = { length: 10 }): Promise<any> {
    const response = await this.getAxiosInstanceWithToken().get(this.endpoints.base, { params: filters })
    return response.data
  }

  async studentReport (studentId: number, params: Record<string, any> = {}): Promise<ReportCardStudent> {
    const response = await this.getAxiosInstanceWithToken().get(`${this.endpoints.base}/student/${studentId}`, { params })
    return response.data
  }

  async classReport (classId: number, params: Record<string, any> = {}): Promise<ReportCardClassStudent[]> {
    const response = await this.getAxiosInstanceWithToken().get(`${this.endpoints.base}/class/${classId}`, { params })
    return response.data
  }

  async classReportCards (params: Record<string, any> = {}): Promise<ReportCardClassCardsResponse> {
    const response = await this.getAxiosInstanceWithToken().get(`${this.endpoints.base}/class-cards`, { params })
    return response.data
  }

  async comprehensiveReport (params: Record<string, any> = {}): Promise<ComprehensiveReportResponse> {
    const response = await this.getAxiosInstanceWithToken().get(`${this.endpoints.base}/comprehensive`, { params })
    return response.data
  }

  async gradeMatrix (params: Record<string, any> = {}): Promise<GradeMatrixResponse> {
    const response = await this.getAxiosInstanceWithToken().get(`${this.endpoints.base}/grade-matrix`, { params })
    return response.data
  }

  async classGradeSheet (params: Record<string, any> = {}): Promise<ClassGradeSheetResponse> {
    const response = await this.getAxiosInstanceWithToken().get(`${this.endpoints.base}/class-grade-sheet`, { params })
    return response.data
  }
}

export const reportCardAPI = new ReportCardAPI()
