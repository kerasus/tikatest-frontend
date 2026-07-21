import BaseAPI from './BaseAPI'

export type { ListType } from './BaseAPI'
export type HomeworkType = {
  id: number | null
  school_id: number | null
  lesson_id: number | null
  class_id: number | null
  title: string | null
  description: string | null
  attachment: string | null
  attachment_2: string | null
  due_date: string | null
  created_by: number | null
  created_at: string | null
  updated_at: string | null
  deleted_at: string | null
  owners?: HomeworkOwnerType[]
  submissions?: HomeworkSubmissionType[]
  lesson?: {
    id: number | null
    name: string | null
  } | null
  schoolClass?: {
    id: number | null
    name: string | null
  } | null
}

export type HomeworkOwnerType = {
  id: number | null
  homework_id: number | null
  user_id: number | null
  read_status: boolean | null
  read_at: string | null
  submission_file: string | null
  submitted_at: string | null
  created_at: string | null
  updated_at: string | null
  homework?: HomeworkType
}

export type HomeworkSubmissionType = {
  id: number | null
  school_id: number | null
  homework_id: number | null
  student_id: number | null
  submission_text: string | null
  submission_file: string | null
  submitted_at: string | null
  grade: number | null
  feedback: string | null
  graded_by: number | null
  graded_at: string | null
  created_at: string | null
  updated_at: string | null
}

export default class HomeworkAPI extends BaseAPI<HomeworkType> {
  constructor () {
    super('/homework')
    this.defaultObject = {
      id: null,
      school_id: null,
      lesson_id: null,
      class_id: null,
      title: null,
      description: null,
      attachment: null,
      attachment_2: null,
      due_date: null,
      created_by: null,
      created_at: null,
      updated_at: null,
      deleted_at: null
    }
  }

  async getSubmissions (homeworkId: number) {
    const response = await this.getAxiosInstanceWithToken().get(`${this.endpoints.base}/${homeworkId}/submissions`)
    return response.data
  }

  async viewHomework (homeworkId: number) {
    const response = await this.getAxiosInstanceWithToken().get(`${this.endpoints.base}/${homeworkId}/view`)
    return response.data
  }

  async submitHomework (homeworkId: number, data: { submission_file?: string }) {
    const response = await this.getAxiosInstanceWithToken().post(`${this.endpoints.base}/${homeworkId}/submit`, data)
    return response.data
  }

  async myHomework (filters: any = { length: 10 }) {
    const response = await this.getAxiosInstanceWithToken().get('/student-portal/homework', {
      params: filters
    })
    return response.data
  }

  async mySubmissions (filters: any = { length: 10 }) {
    const response = await this.getAxiosInstanceWithToken().get('/student-portal/homework/my-submissions', {
      params: filters
    })
    return response.data
  }
}

export const homework = new HomeworkAPI()
export const homeworkRepository = homework
