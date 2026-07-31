import BaseAPI from './BaseAPI'

export type StudentType = {
  id: number | null
  first_name: string | null
  last_name: string | null
  full_name: string | null
  email: string | null
  mobile: string | null
  username: string | null
  national_id: string | null
  birth_date: string | null
  address: string | null
  description: string | null
  picture: string | null
  roles_list: string[]
  permissions_list: string[]
  created_at: string | null
  updated_at: string | null
  student_profile?: {
    id: number | null
    code: string | null
    xp: number | null
  } | null
  guardian_records?: Array<{
    id: number | null
    relationship_type: 'father' | 'mother' | 'guardian' | null
    job: string | null
    is_primary_contact: boolean | null
  }> | null
  user_class_registrations?: Array<{
    id: number | null
    class_id: number | null
  }> | null
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
      mobile: null,
      username: null,
      national_id: null,
      birth_date: null,
      address: null,
      description: null,
      picture: null,
      roles_list: [],
      permissions_list: [],
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
    const response = await this.getAxiosInstanceWithToken().get(this.endpoints.dashboard!, { params })
    return response.data
  }

  async myGrades (params?: any) {
    const response = await this.getAxiosInstanceWithToken().get(this.endpoints.myGrades!, { params })
    return response.data
  }

  async reportCard (params?: any) {
    const response = await this.getAxiosInstanceWithToken().get(this.endpoints.reportCard!, { params })
    return response.data
  }

  async absences (params?: any) {
    const response = await this.getAxiosInstanceWithToken().get(this.endpoints.absences!, { params })
    return response.data
  }

  async disciplinary (params?: any) {
    const response = await this.getAxiosInstanceWithToken().get(this.endpoints.disciplinary!, { params })
    return response.data
  }

  async studySessions (params?: any) {
    const response = await this.getAxiosInstanceWithToken().get(this.endpoints.studySessions!, { params })
    return response.data
  }

  async createStudySession (data: any) {
    return this.getAxiosInstanceWithToken().post(this.endpoints.studySessions!, data)
  }
}

export const student = new StudentAPI()
