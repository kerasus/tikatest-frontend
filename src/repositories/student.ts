import BaseAPI from './BaseAPI'

export type StudentType = {
  id: number | null
  firstname: string | null
  lastname: string | null
  full_name: string | null
  email: string | null
  username: string | null
  password: string | null
  class_id: number | null
  student_phone: string | null
  melli_code: string | null
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
  father_melli_code: string | null
  mother_name: string | null
  mother_lastname: string | null
  mother_phone: string | null
  mother_email: string | null
  mother_job: string | null
  mother_melli_code: string | null
  user_type: string | null
  roles_list: string[]
  created_at: string | null
  updated_at: string | null
}

export default class StudentAPI extends BaseAPI<StudentType> {
  constructor () {
    super('/students')
    this.defaultObject = {
      id: null,
      firstname: null,
      lastname: null,
      full_name: null,
      email: null,
      username: null,
      password: null,
      class_id: null,
      student_phone: null,
      melli_code: null,
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
      father_melli_code: null,
      mother_name: null,
      mother_lastname: null,
      mother_phone: null,
      mother_email: null,
      mother_job: null,
      mother_melli_code: null,
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
