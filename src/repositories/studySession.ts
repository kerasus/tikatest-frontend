import BaseAPI from './BaseAPI'

export type StudySessionType = {
  id: number | null
  student_id: number | null
  lesson_id: number | null
  started_at: string | null
  ended_at: string | null
  duration_minutes: number | null
  notes: string | null
  created_at: string | null
  updated_at: string | null
}

export default class StudySessionAPI extends BaseAPI<StudySessionType> {
  constructor () {
    super('/study-sessions')
    this.defaultObject = {
      id: null,
      student_id: null,
      lesson_id: null,
      started_at: null,
      ended_at: null,
      duration_minutes: null,
      notes: null,
      created_at: null,
      updated_at: null
    }
    this.endpoints = {
      ...this.endpoints,
      generalReport: '/study-sessions/report/general',
      studentReport: (studentId: number) => `/study-sessions/report/student/${studentId}`
    }
  }

  async generalReport (params: any = {}): Promise<any> {
    const response = await this.getAxiosInstanceWithToken().get(this.endpoints.generalReport, {
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

export const studySession = new StudySessionAPI()
