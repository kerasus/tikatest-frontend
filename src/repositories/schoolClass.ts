import BaseAPI from './BaseAPI'
import type { SkyroomRoomType } from './skyroomRoom'
import type { AcademicLevelType } from 'src/repositories/academicLevel'

export type { ListType } from './BaseAPI'

export type SchoolClassType = {
  id: number | null
  school_id: number | null
  academic_level_id: number | null
  name: string | null
  academic_level?: AcademicLevelType
  created_at: string | null
  updated_at: string | null
  deleted_at: string | null
}

/**
 * مشخصات هر فایل دریافت شده از سرور FTP
 */
export interface FtpFileItem {
  name: string
  path: string
  url  : string
  size: number
  timestamp: number
  type: 'file' | 'directory'
}

/**
 * دایرکتوری در صورت وجود زیرپوشه
 */
export interface FtpDirectoryItem {
  name: string
  path: string
  type: 'directory'
}

/**
 * گره نهایی برگ (Leaf Node) در درخت فایل‌ها متناظر با یک پایه مشخص
 */
export interface ClassFilesLeafNode {
  permissions: string[]
  class_ids: number[]
  path: string
  directories: FtpDirectoryItem[]
  files: FtpFileItem[]
}

/**
 * ساختار چند سطحی درخت:
 * Level 1 (Season / Term): کلید دوره/فصل (مثلاً "1404-10")
 * Level 2 (Lesson): کلید عنوان درس (مثلاً "علوم")
 * Level 3 (Grade): کلید پایه/کلاس (مثلاً "6") -> حاوی داده‌های نهایی
 */
export type SeasonKey = string
export type LessonKey = string
export type GradeKey = string

export type LessonFilesTree = Record<GradeKey, ClassFilesLeafNode>
export type SeasonFilesTree = Record<LessonKey, LessonFilesTree>
export type ClassesFilesTreeMap = Record<SeasonKey, SeasonFilesTree>

/**
 * تایپ ورودی (Payload) متد
 */
export interface ClassesFilesTreePayload {
  school_id?: number
  class_ids: number[]
}

/**
 * ریسپانس کلی بازگشتی از API سرور
 */
export interface ClassesFilesTreeResponse {
  success: boolean
  tree: ClassesFilesTreeMap
  message?: string
}




export default class SchoolClassAPI extends BaseAPI<SchoolClassType> {
  constructor () {
    super('/classes')
    this.defaultObject = {
      id: null,
      school_id: null,
      academic_level_id: null,
      name: null,
      created_at: null,
      updated_at: null,
      deleted_at: null
    }
    this.endpoints = {
      ...this.endpoints,
      skyroomRooms: (classId: number | string) => `${this.baseEndpoint}/${classId}/skyroom-rooms`,
      classFiles: (classId: number | string) => `${this.baseEndpoint}/${classId}/files`,
      classesFilesTree: `${this.baseEndpoint}/files-tree`
    }
  }

  async getSkyroomRooms (classId: number | string, params?: Record<string, unknown>): Promise<SkyroomRoomType[]> {
    const endpoint = (this.endpoints as any).skyroomRooms(classId)
    const response = await this.getAxiosInstanceWithToken().get(endpoint, {
      params: { length: 1000, ...params }
    })
    return Array.isArray(response.data) ? response.data : response.data.data
  }

  /**
   * دریافت لیست فایل‌های یک کلاس خاص
   * GET /api/classes/{classId}/files?school_id=...
   */
  async getClassFiles (classId: number | string, schoolId: number): Promise<ClassesFilesTreeResponse> {
    const endpoint = (this.endpoints as any).classFiles(classId)
    const response = await this.getAxiosInstanceWithToken().get<ClassesFilesTreeResponse>(endpoint, {
      params: { school_id: schoolId }
    })
    return response.data
  }

  /**
   * دریافت درخت فایل‌های مجموعه‌ای از کلاس‌ها
   * POST /api/classes/files-tree
   */
  async getClassesFilesTree (payload: ClassesFilesTreePayload): Promise<ClassesFilesTreeResponse> {
    const response = await this.getAxiosInstanceWithToken().post<ClassesFilesTreeResponse>(
      this.endpoints.classesFilesTree,
      payload
    )
    return response.data
  }
}

export const schoolClass = new SchoolClassAPI()
