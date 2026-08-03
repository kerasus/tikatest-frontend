import BaseAPI from './BaseAPI'

export type StudentProfileType = {
  id: number | null
  user_id: number | null
  code: string | null
  xp: number | null
  deleted_at: string | null
  created_at: string | null
  updated_at: string | null
}

export type StudentGuardianType = {
  id: number | null
  user_id: number | null
  student_profile_id: number | null
  relationship_type: 'father' | 'mother' | 'guardian' | null
  job: string | null
  is_primary_contact: boolean | null
  user?: {
    id: number | null
    first_name: string | null
    last_name: string | null
    full_name: string | null
    mobile: string | null
    email: string | null
  } | null
  student_profile?: StudentProfileType | null
  created_at: string | null
  updated_at: string | null
}

export type StudentUserClassRegistrationType = {
  id: number | null
  user_id: number | null
  class_id: number | null
  school_class?: {
    id: number | null
    name: string | null
    school_id: number | null
    academic_level_id: number | null
  } | null
  class?: {
    id: number | null
    name: string | null
  } | null
  created_at: string | null
  updated_at: string | null
}

export type StudentType = {
  id: number | null
  first_name: string | null
  last_name: string | null
  full_name: string | null
  email: string | null
  username: string | null
  mobile: string | null
  national_id: string | null
  birth_date: string | null
  address: string | null
  description: string | null
  picture: string | null
  email_verified_at: string | null
  mobile_verified_at: string | null
  roles_list: string[]
  permissions_list: string[]
  created_at: string | null
  updated_at: string | null
  student_profile?: StudentProfileType | null
  guardian_records?: StudentGuardianType[] | null
  user_class_registrations?: StudentUserClassRegistrationType[] | null
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
      mobile: null,
      national_id: null,
      birth_date: null,
      address: null,
      description: null,
      picture: null,
      email_verified_at: null,
      mobile_verified_at: null,
      roles_list: [],
      permissions_list: [],
      created_at: null,
      updated_at: null,
      student_profile: null,
      guardian_records: null,
      user_class_registrations: null
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
