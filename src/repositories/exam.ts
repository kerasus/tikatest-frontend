import BaseAPI, { ListType } from './BaseAPI'
import { UserType } from 'src/repositories/user'
import { ExamCategoryType } from 'src/repositories/examCategory'
import { SchoolClassType } from 'src/repositories/schoolClass'
import { AcademicLevelType } from 'src/repositories/academicLevel'
import { LessonType } from 'src/repositories/lesson'
import { OnlineExamSessionType } from 'src/repositories/onlineExamSession'

export interface ContentType {
  type: 'text' | 'image' | 'pdf';
  body?: string;
  path?: string;
  file?: File;
}

export interface OnlineExamContentType extends ContentType {}

export type BookletType = {
  id: number | null;
  online_exam_id: number | null;
  lesson_id: number | null;
  title: string | null;
  from_question: number | null;
  to_question: number | null;
  booklet_scores: any[] | null;
  created_by: number | null;
  created_at: string | null;
  updated_at: string | null;
  deleted_at: string | null;
  lesson?: LessonType | null;
};

export type OnlineExamDetailType = {
  id: number | null;
  exam_id: number | null;
  starts_at: string | null;
  ends_at: string | null;
  time_limit_minutes: number | null;
  visible_at: string | null;
  answers_visible_at: string | null;
  content: OnlineExamContentType | null;
  solution: OnlineExamContentType | null;
  created_by: number | null;
  created_at: string | null;
  updated_at: string | null;
  deleted_at: string | null;
  sessions?: any[];
  booklets?: BookletType[];
  createdBy?: UserType | null;
};

export type InPersonExamDetailType = {
  id: number | null
  exam_id: number | null
  held_at: string | null
  is_descriptive: boolean
  created_by: number | null
  created_at: string | null
  updated_at: string | null
  deleted_at: string | null
  results?: any[]
  createdBy?: UserType | null
}

export type InPersonExamResultType = {
  id: number | null;
  in_person_exam_id: number | null;
  raw_score: number | null;
  scaled_score: number | null;
  z_score: number | null;
  recorded_by: number | null;
  user_id: number | null;
  student?: UserType | null;
  created_at: string | null;
  updated_at: string | null;
};

export type StudentExamListType = ListType<ExamType>

export type ExamScoreType = {
  raw_score?: number | null;
  scaled_score?: number | null;
  z_score?: number | null;
  score?: number | null;
  percent?: number | null;
  status?: string | null;
}

export type ExamType = {
  id: number | null;
  name: string | null;
  description: string | null;
  lesson_id: number | null;
  min_passing_score: number | null;
  max_score: number | null;
  delivery_mode: 'online' | 'in_person' | null;
  exam_category_id: number | null;
  created_by: UserType | null;
  created_at: string | null;
  updated_at: string | null;
  category?: ExamCategoryType | null;
  lesson?: LessonType | null;
  in_person_exam_detail?: InPersonExamDetailType | null;
  online_exam_detail?: OnlineExamDetailType | null;
  answer_keys?: any[];
  classes?: SchoolClassType[];
  academic_levels?: AcademicLevelType[];
  in_person_exam_results?: InPersonExamResultType[];
  grades?: any[];
  online_exam_sessions?: OnlineExamSessionType[];
  latest_session?: OnlineExamSessionType | null;
  session_status?: OnlineExamSessionType['status'];
  my_result?: InPersonExamResultType | null;
  my_session?: OnlineExamSessionType | null;
  score?: ExamScoreType | null;
};

export type StudentOnlineExamListType = ListType<ExamType>;

export default class ExamAPI extends BaseAPI<ExamType> {
  constructor () {
    super('/exams')
    this.defaultObject = {
      id: null,
      name: null,
      description: null,
      lesson_id: null,
      min_passing_score: null,
      max_score: null,
      delivery_mode: 'in_person',
      exam_category_id: null,
      created_by: null,
      created_at: null,
      updated_at: null
    }
    this.endpoints = {
      ...this.endpoints,
      storeWithInPersonDetailAndResults: '/exams/store-with-inperson-results',
      storeWithOnlineDetail: '/exams/store-with-online-detail',
      studentOnlineExams: '/student-portal/online-exams',
      myExams: '/student-portal/my-exams'
    }
  }

  async studentOnlineExams (params?: { length?: number; page?: number }): Promise<StudentOnlineExamListType> {
    const response = await this.getAxiosInstanceWithToken().get(this.endpoints.studentOnlineExams!, { params })
    return response.data
  }

  async myExams (params?: { length?: number; page?: number; sortation_field?: string; sortation_order?: string }): Promise<StudentExamListType> {
    const response = await this.getAxiosInstanceWithToken().get(this.endpoints.myExams, {
      params
    })
    return response.data
  }

  async storeWithOnlineDetail (data: any): Promise<any> {
    const response = await this.getAxiosInstanceWithToken().post(this.endpoints.storeWithOnlineDetail!, data)
    return response.data
  }

  async updateWithOnlineDetail (id: number, data: any): Promise<any> {
    const response = await this.getAxiosInstanceWithToken().post(`exams/update-with-online-detail/${id}`, data)
    return response.data
  }

  async storeWithInPersonDetailAndResults (data: {
    name: string
    description?: string
    lesson_id?: number
    min_passing_score?: number
    max_score?: number
    exam_category_id: number
    created_by?: number
    held_at: string
    is_descriptive?: boolean
    class_ids?: number[]
    academic_level_ids?: number[]
    results: {
      user_id: number
      raw_score?: number
      scaled_score?: number
      z_score?: number
    }[]
  }): Promise<any> {
    const response = await this.getAxiosInstanceWithToken().post(this.endpoints.storeWithInPersonDetailAndResults!, data)
    return response.data
  }
}

export const exam = new ExamAPI()
