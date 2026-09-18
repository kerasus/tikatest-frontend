import BaseAPI from './BaseAPI'

export type StudySessionSourceEnum = 'manual' | 'lms' | 'online_class'

export type StudySessionType = {
  id: number | null
  student_id: number | null
  lesson_id: number | null
  term_id: number | null
  started_at: string | null
  ended_at: string | null
  description: string | null
  source: StudySessionSourceEnum | null
  metadata: Record<string, any> | null
  created_at: string | null
  updated_at: string | null
  lesson?: {
    id: number | null
    name: string | null
  } | null
  term?: {
    id: number | null
    name: string | null
  } | null
  student?: {
    id: number | null
    first_name: string | null
    last_name: string | null
  } | null
}

export type StudySessionCreateType = {
  student_id: number | null
  lesson_id: number | null
  term_id: number | null
  started_at: string
  ended_at: string | null
  description?: string | null
  source?: StudySessionSourceEnum
  metadata?: Record<string, any> | null
}

export default class StudySessionAPI extends BaseAPI<StudySessionType> {
  constructor () {
    super('/study-sessions')

    this.defaultObject = {
      id: null,
      student_id: null,
      lesson_id: null,
      term_id: null,
      started_at: null,
      ended_at: null,
      description: null,
      source: 'manual',
      metadata: null,
      created_at: null,
      updated_at: null
    }
  }

  async createSession (
    data: StudySessionCreateType
  ): Promise<StudySessionType> {
    const response = await this.getAxiosInstanceWithToken().post(
      this.baseEndpoint,
      data
    )

    return response.data
  }
}

export const studySession = new StudySessionAPI()
