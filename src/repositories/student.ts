import BaseAPI from './BaseAPI'
import type { UserType } from 'src/repositories/user'
import { SchoolClassType } from 'src/repositories/schoolClass'
import type { TermEnrollmentType } from 'src/repositories/termEnrollment'

export type StudentProfileType = {
  id: number | null
  user_id: number | null
  code: string | null
  xp: number | null
  guardians: StudentGuardianType[]
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

export interface StudentType extends UserType {
  student_profile?: StudentProfileType | null
  guardian_records?: StudentGuardianType[] | null
  term_enrollments: TermEnrollmentType[]
}


export interface ActiveOnlineClass {
  schedule_id: number
  room_id: number
  class_id: number
  class_name: string
  title: string
  start_time: string // e.g. "15:15"
  end_time: string   // e.g. "23:59"
  is_live_now: boolean
  status: 'live' | 'upcoming'
  join_url: string
}

export interface UpcomingExam {
  id: number
  name: string
  delivery_mode: 'online' | 'in_person';
  category?: {
    id: number;
    title: string;
  } | null;
  online_exam_detail?: {
    starts_at?: string | null;
    ends_at?: string | null;
    time_limit_minutes?: number | null;
  } | null;
  in_person_exam_detail?: {
    held_at?: string | null;
  } | null;
}

export interface PendingHomework {
  id: number;
  title: string;
  due_date?: string | null;
  lesson?: {
    name?: string | null;
  } | null;
}

export interface RecentGrade {
  id: string;
  type: 'online' | 'in_person';
  exam_name?: string | null;
  lesson_name?: string | null;
  score?: string | number | null;
  percent?: string | number | null;
  graded_at?: string | null;
  exam_id: number | null
  scaled_score: number | null
  t_score: number | null
}

export interface UpcomingEvent {
  id: number;
  title: string;
  starts_at?: string | null;
  all_day?: boolean;
  type?: string;
  color?: string | null;
  ends_at: string
  status: string
  calendar?: {
    id: number
    title: string
    is_active: boolean
  }
}

export interface StudentDashboardData {
  has_skyroom_feature: boolean
  active_online_classes: ActiveOnlineClass[]
  upcoming_exams: UpcomingExam[]
  pending_homeworks: PendingHomework[]
  recent_grades: RecentGrade[]
  upcoming_events: UpcomingEvent[]
  total_study_minutes_this_month: number
  total_study_hours_this_month: number
}

export default class StudentAPI extends BaseAPI<StudentType> {
  constructor () {
    super('/students')
    this.defaultObject = {
      id: null,
      first_name: null,
      last_name: null,
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
      schools: [],
      roles: [],
      roles_list: [],
      permissions_list: [],
      created_at: null,
      updated_at: null,
      student_profile: null,
      guardian_records: null,
      term_enrollments: []
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

  async dashboard (params?: any): Promise<StudentDashboardData> {
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
