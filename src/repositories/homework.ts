import BaseAPI from './BaseAPI'
import type { AcademicLevelType } from 'src/repositories/academicLevel'
import type { ContentType } from 'src/repositories/exam'
import type { LessonType } from 'src/repositories/lesson'
import type { SchoolClassType } from 'src/repositories/schoolClass'
import type { UserType } from 'src/repositories/user'

export type { ListType } from './BaseAPI'

export type HomeworkAttachmentType = {
  id: number | null;
  homework_id: number | null;
  content: ContentType | null;
  sort_order: number | null;
  created_at: string | null;
  updated_at: string | null;
  homework?: HomeworkType | null;
}

export type HomeworkType = {
  id: number | null;
  title: string | null;
  description: string | null;
  lesson_id: number | null;
  due_date: string | null;
  created_by: number | null;
  created_at: string | null;
  updated_at: string | null;
  deleted_at: string | null;
  createdBy?: UserType | null;
  lesson?: LessonType | null;
  attachments?: HomeworkAttachmentType[];
  academic_levels?: AcademicLevelType[];
  classes?: SchoolClassType[];
  academic_level_ids?: number[];
  class_ids?: number[];
  submissions?: HomeworkSubmissionType[];
};

export type HomeworkSubmissionType = {
  id: number | null;
  homework_id: number | null;
  student_id: number | null;
  submitted_at: string | null;
  student_seen_at: string | null;
  operator_seen_at: string | null;
  feedback: string | null;
  content: ContentType | ContentType[] | null;
  created_at: string | null;
  updated_at: string | null;
  homework?: HomeworkType | null;
  student?: UserType | null;
};

export default class HomeworkAPI extends BaseAPI<HomeworkType> {
  constructor () {
    super('/homework')
    this.defaultObject = {
      id: null,
      title: null,
      lesson_id: null,
      description: null,
      due_date: null,
      created_by: null,
      created_at: null,
      updated_at: null,
      deleted_at: null
    }
    this.endpoints = {
      ...this.endpoints,
      myHomeworks: `${this.baseEndpoint}/mine`,
      homeworkSubmissions: (homeworkId: number) => `${this.baseEndpoint}/${homeworkId}/submissions`,
      storeAttachment: (homeworkId: number) => `${this.baseEndpoint}/${homeworkId}/attachments`,
      destroyAttachment: (homeworkId: number, attachmentId: number) => `${this.baseEndpoint}/${homeworkId}/attachments/${attachmentId}`
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

  async submitHomework (homeworkId: number, data: FormData) {
    const response = await this.getAxiosInstanceWithToken().post(`${this.endpoints.base}/${homeworkId}/submit`, data)
    return response.data
  }

  async storeAttachment (homeworkId: number, data: FormData) {
    const response = await this.getAxiosInstanceWithToken().post(`${this.endpoints.base}/${homeworkId}/attachments`, data)
    return response.data
  }

  async destroyAttachment (homeworkId: number, attachmentId: number) {
    const response = await this.getAxiosInstanceWithToken().delete(
      `${this.endpoints.base}/${homeworkId}/attachments/${attachmentId}`
    )
    return response.data
  }

  async myHomework (filters: any = { length: 10 }) {
    const response = await this.getAxiosInstanceWithToken().get(this.endpoints.myHomeworks, {
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
