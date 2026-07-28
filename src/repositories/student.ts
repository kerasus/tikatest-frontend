import BaseAPI from './BaseAPI'

export type AcademicFieldType = {
  id: number | null
  school_id: number | null
  name: string | null
  created_at: string | null
  updated_at: string | null
  deleted_at: string | null
  school?: {
    id: number | null
    name: string | null
    code: string | null
  }
}

export type AcademicLevelType = {
  id: number | null
  field_id: number | null
  name: string | null
  created_at: string | null
  updated_at: string | null
  deleted_at: string | null
  academic_field?: AcademicFieldType
}

export type SchoolClassType = {
  id: number | null
  level_id: number | null
  name: string | null
  created_at: string | null
  updated_at: string | null
  deleted_at: string | null
  academic_level?: AcademicLevelType
}

export type UserClassRegistrationType = {
  id: number | null
  user_id: number | null
  class_id: number | null
  created_at: string | null
  updated_at: string | null
  school_class?: SchoolClassType
}

export type StudentType = {
  id: number | null
  first_name: string | null
  last_name: string | null
  full_name: string | null
  email: string | null
  username: string | null
  password: string | null
  class_id: number | null
  student_phone: string | null
  national_id: string | null
  student_code: string | null
  birth_date: string | null
  student_email: string | null
  address: string | null
  picture: string | null
  school_id: number | null
  father_name: string | null
  father_phone: string | null
  father_email: string | null
  father_job: string | null
  father_national_id: string | null
  mother_name: string | null
  mother_last_name: string | null
  mother_phone: string | null
  mother_email: string | null
  mother_job: string | null
  mother_national_id: string | null
  user_type: string | null
  roles_list: string[]
  user_class_registrations?: UserClassRegistrationType[]
  created_at: string | null
  updated_at: string | null
}

export default class StudentAPI extends BaseAPI<StudentType> {
  constructor () {
    super('/students')
    this.defaultObject = {
      id: null,
      first_name: null,
      last_name: null,
      full_name: null,
      email: null,
      username: null,
      password: null,
      class_id: null,
      student_phone: null,
      national_id: null,
      student_code: null,
      birth_date: null,
      student_email: null,
      address: null,
      picture: null,
      school_id: null,
      father_name: null,
      father_phone: null,
      father_email: null,
      father_job: null,
      father_national_id: null,
      mother_name: null,
      mother_last_name: null,
      mother_phone: null,
      mother_email: null,
      mother_job: null,
      mother_national_id: null,
      user_type: null,
      roles_list: [],
      created_at: null,
      updated_at: null
    }
    this.endpoints = {
      ...this.endpoints,
      dashboard: '/student-portal/dashboard',
      myGrades: '/student-portal/grades',
      reportCard: '/student-portal/report-card',
      absences: '/student-portal/absences',
      disciplinary: '/student-portal/disciplinary',
      studySessions: '/student-portal/study-sessions'
    }
  }

  async dashboard (params?: any) {
    return this.getAxiosInstanceWithToken().get(this.endpoints.dashboard!, { params })
  }

  async myGrades (params?: any) {
    return this.getAxiosInstanceWithToken().get(this.endpoints.myGrades!, { params })
  }

  async reportCard (params?: any) {
    return this.getAxiosInstanceWithToken().get(this.endpoints.reportCard!, { params })
  }

  async absences (params?: any) {
    return this.getAxiosInstanceWithToken().get(this.endpoints.absences!, { params })
  }

  async disciplinary (params?: any) {
    return this.getAxiosInstanceWithToken().get(this.endpoints.disciplinary!, { params })
  }

  async studySessions (params?: any) {
    return this.getAxiosInstanceWithToken().get(this.endpoints.studySessions!, { params })
  }

  async createStudySession (data: any) {
    return this.getAxiosInstanceWithToken().post(this.endpoints.studySessions!, data)
  }
}

export const student = new StudentAPI()
