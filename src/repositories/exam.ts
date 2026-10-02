import BaseAPI, { type ListType } from './BaseAPI'
import type { UserType } from 'src/repositories/user'
import type { ExamCategoryType } from 'src/repositories/examCategory'
import type { SchoolClassType } from 'src/repositories/schoolClass'
import type { AcademicLevelType } from 'src/repositories/academicLevel'
import type { LessonType } from 'src/repositories/lesson'
import type {
  OnlineExamSessionType,
  ParticipationStatus
} from 'src/repositories/onlineExamSession'
import type { AcademicTermType } from 'src/repositories/academicTerm'

export type DeliveryMode = 'online' | 'in_person';

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

export interface OnlineExamAnswerKeyType {
  id: number;
  exam_id: number;
  question_number: number;
  number_of_choices: number;
  /**
   * گزینه صحیح که به صورت رشته برمی‌گرده (مثلاً '1' تا '4' یا برای سوالات چندگزینه‌ای)
   * می‌تونه در صورت خالی بودن یا چندگزینه‌ای بودن string باشه
   */
  correct_option: string;
  /**
   * ضریب/بارم سوال که در دیتابیس DECIMAL بوده و به صورت رشته برمی‌گرده (مثل '1.00')
   */
  weight: string;
  has_negative_mark: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

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
  answer_keys?: OnlineExamAnswerKeyType[];
  booklets?: BookletType[];
  createdBy?: UserType | null;
};

export type InPersonExamDetailType = {
  id: number | null
  exam_id: number | null
  held_at: string | null
  is_descriptive: boolean
  results_visible_at: string | null
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
  t_score: number | null;
  recorded_by: number | null;
  user_id: number | null;
  student?: UserType | null;
  created_at: string | null;
  updated_at: string | null;
};

export type ExamScoreType = {
  raw_score?: number | null;
  scaled_score?: number | null;
  t_score?: number | null;
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
  delivery_mode: DeliveryMode | null;
  exam_category_id: number | null;
  created_by: UserType | null;
  created_at: string | null;
  updated_at: string | null;
  category?: ExamCategoryType | null;
  lesson?: LessonType | null;
  participation_status?: ParticipationStatus;
  in_person_exam_detail?: InPersonExamDetailType | null;
  online_exam_detail?: OnlineExamDetailType | null;
  answer_keys?: OnlineExamAnswerKeyType[];
  classes?: SchoolClassType[];
  class_ids?: number[];
  academic_levels?: AcademicLevelType[];
  academic_level_ids?: number[];
  in_person_exam_results?: InPersonExamResultType[];
  in_person_exam_result?: InPersonExamResultType;
  grades?: any[];
  online_exam_sessions?: OnlineExamSessionType[];
  latest_session?: OnlineExamSessionType | null;
  session_status?: OnlineExamSessionType['status'];
  // my_result?: InPersonExamResultType | null;
  student_online_exam_session?: OnlineExamSessionType | null;
  score?: ExamScoreType | null;
  term?: AcademicTermType | null;
  sensitive_data_available?: boolean;
  term_id?: number | null;
  occurrence?: number | null;
};

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
      showStudentOnlineExam: (onlineExamId: number) => `/student-portal/online-exams/${onlineExamId}`,
      myGrades: '/student-portal/my-grades'
    }
  }

  async showStudentOnlineExam (onlineExamId: number): Promise<ExamType> {
    const response = await this.getAxiosInstanceWithToken()
      .get(this.endpoints.showStudentOnlineExam(onlineExamId))
    return response.data
  }

  async studentOnlineExams (params?: { length?: number; page?: number }): Promise<ListType<ExamType>> {
    const response = await this.getAxiosInstanceWithToken().get(this.endpoints.studentOnlineExams!, { params })
    return response.data
  }

  async myGrades (params?: { length?: number; page?: number; sortation_field?: string; sortation_order?: string }): Promise<ListType<ExamType>> {
    const response = await this.getAxiosInstanceWithToken().get(this.endpoints.myGrades, {
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
    term_id?: number | null
    occurrence?: number | null
    results: {
      user_id: number
      raw_score?: number
      scaled_score?: number
      t_score?: number
    }[]
  }): Promise<any> {
    const response = await this.getAxiosInstanceWithToken().post(this.endpoints.storeWithInPersonDetailAndResults!, data)
    return response.data
  }

  async examStudents (examId: number, params?: { length?: number }): Promise<ListType<UserType>> {
    const response = await this.getAxiosInstanceWithToken().get(`exams/${examId}/students`, { params })
    return response.data
  }

  override getNormalizedItem (item: ExamType): ExamType {
    if (item?.category) {
      item.exam_category_id = item.category.id
    }
    if (item?.term) {
      item.term_id = item.term.id
    }
    if (item?.online_exam_detail?.answer_keys) {
      item.answer_keys = item.online_exam_detail.answer_keys
    }
    return item
  }
}

export const exam = new ExamAPI()
