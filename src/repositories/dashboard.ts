import BaseAPI from './BaseAPI'

export interface ActiveOnlineClass {
  schedule_id: number
  room_id: number
  class_id: number
  class_name: string
  title: string
  start_time: string
  end_time: string
  is_live_now: boolean
  status: 'live' | 'upcoming'
  join_url: string
}

export interface UpcomingExam {
  id: number
  name: string
  delivery_mode: 'online' | 'in_person'
  category?: {
    id: number
    title: string
  } | null
  online_exam_detail?: {
    starts_at?: string | null
    ends_at?: string | null
    time_limit_minutes?: number | null
  } | null
  in_person_exam_detail?: {
    held_at?: string | null
  } | null
}

export interface PendingHomework {
  id: number
  title: string
  due_date?: string | null
  lesson?: {
    name?: string | null
  } | null
}

export interface RecentGrade {
  id: string
  type: 'online' | 'in_person'
  exam_name?: string | null
  lesson_name?: string | null
  score?: string | number | null
  percent?: string | number | null
  graded_at?: string | null
  exam_id: number | null
  scaled_score: number | null
  t_score: number | null
}

export interface UpcomingEvent {
  id: number
  title: string
  starts_at?: string | null
  all_day?: boolean
  type?: string
  color?: string | null
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

export interface SchoolDashboardData {
  students_count: number
  classes_count: number
  online_exams_count: number
  homeworks_count: number
}

// ----------------------------------------------------
// تایپ‌های وضعیت سلامت سیستم (Spatie Laravel Health)
// ----------------------------------------------------
export type HealthCheckStatus = 'ok' | 'warning' | 'failed' | 'crashed'

// تایپ تک‌تک متادیتاها بر اساس چک‌های فعال در لاگ و پکیج
export interface UsedDiskSpaceMeta {
  disk_space_used_percentage: number
}

export interface DatabaseMeta {
  connection_name: string
}

export interface DebugModeMeta {
  actual: boolean
  expected: boolean
}

export interface OpcacheMeta {
  enabled: boolean
  hit_rate: number
  cached_scripts: number
  memory_used_mb: number
}

export interface DatabasePingMeta {
  latency_ms: number
}

export interface SslCertificateMeta {
  domain: string
}

// برای مواردی مثل OptimizedApp که در صورت خالی بودن آرایه برمی‌گرداند یا متای عمومی
export type HealthCheckGenericMeta = Record<string, unknown> | unknown[]

// استفاده از Discriminated Union برای Autocomplete بی‌نقص بر اساس فیلد `name`
export type StoredCheckResult =
  | {
      name: 'UsedDiskSpace'
      label: string
      notificationMessage: string
      shortSummary: string
      status: HealthCheckStatus
      meta: UsedDiskSpaceMeta
    }
  | {
      name: 'Database'
      label: string
      notificationMessage: string
      shortSummary: string
      status: HealthCheckStatus
      meta: DatabaseMeta
    }
  | {
      name: 'DebugMode'
      label: string
      notificationMessage: string
      shortSummary: string
      status: HealthCheckStatus
      meta: DebugModeMeta
    }
  | {
      name: 'OptimizedApp'
      label: string
      notificationMessage: string
      shortSummary: string
      status: HealthCheckStatus
      meta: HealthCheckGenericMeta
    }
  | {
      name: 'Opcache'
      label: string
      notificationMessage: string
      shortSummary: string
      status: HealthCheckStatus
      meta: OpcacheMeta
    }
  | {
      name: 'DatabasePing'
      label: string
      notificationMessage: string
      shortSummary: string
      status: HealthCheckStatus
      meta: DatabasePingMeta
    }
  | {
      name: 'SslCertificate'
      label: string
      notificationMessage: string
      shortSummary: string
      status: HealthCheckStatus
      meta: SslCertificateMeta
    }
  | {
      // فال‌بک برای چک‌های احتمالی آینده تا سیستم داینامیک بمونه
      name: string
      label: string
      notificationMessage: string
      shortSummary: string
      status: HealthCheckStatus
      meta: HealthCheckGenericMeta
    }

export interface HealthCheckResponse {
  finishedAt: string
  storedCheckResults: StoredCheckResult[]
}

export interface AdminDashboardData {
  students_count: number
  classes_count: number
  online_exams_count: number
  homeworks_count: number
}

export default class DashboardAPI extends BaseAPI<Record<string, unknown>> {
  constructor () {
    super('/dashboard')
    this.defaultObject = {}
    this.endpoints = {
      ...this.endpoints,
      admin: `${this.baseEndpoint}/admin`,
      adminHealth: `${this.baseEndpoint}/admin/health`,
      student: `${this.baseEndpoint}/student`,
      school: `${this.baseEndpoint}/school`
    }
  }

  async adminDashboard (): Promise<AdminDashboardData> {
    const response = await this.getAxiosInstanceWithToken().get<AdminDashboardData>(
      this.endpoints.admin
    )

    return response.data
  }

  async adminHealth (): Promise<HealthCheckResponse> {
    const response = await this.getAxiosInstanceWithToken().get<HealthCheckResponse>(
      this.endpoints.adminHealth
    )

    return response.data
  }

  async studentDashboard (params?: Record<string, unknown>): Promise<StudentDashboardData> {
    const response = await this.getAxiosInstanceWithToken().get<StudentDashboardData>(
      this.endpoints.student,
      { params }
    )

    return response.data
  }

  async schoolDashboard (schoolId: number): Promise<SchoolDashboardData> {
    const response = await this.getAxiosInstanceWithToken().get<SchoolDashboardData>(
      this.endpoints.school,
      { params: { school_id: schoolId } }
    )

    return response.data
  }
}

export const dashboard = new DashboardAPI()
