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

// ----------------------------------------------------
// تایپ‌های مربوط به سرویس فایل‌های FTP مدرسه
// ----------------------------------------------------
export interface FtpFileItem {
  name: string
  path: string
  size?: number
  extension?: string
  last_modified?: string
  url?: string
  [key: string]: unknown
}

export interface ClassFilesResponse {
  success: boolean
  message?: string
  files: FtpFileItem[]
}

export interface FtpFileTreeNode {
  id?: string | number
  label: string
  path?: string
  type?: 'folder' | 'file'
  children?: FtpFileTreeNode[]
  files?: FtpFileItem[]
  [key: string]: unknown
}

export interface ClassesFilesTreeResponse {
  success: boolean
  message?: string
  tree: Record<string | number, FtpFileTreeNode> | FtpFileTreeNode[]
}

export interface ClassesFilesTreePayload {
  school_id: number
  class_ids: number[]
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
  async getClassFiles (classId: number | string, schoolId: number): Promise<ClassFilesResponse> {
    const endpoint = (this.endpoints as any).classFiles(classId)
    const response = await this.getAxiosInstanceWithToken().get<ClassFilesResponse>(endpoint, {
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
