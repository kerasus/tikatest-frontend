import BaseAPI from './BaseAPI'
import type { AxiosResponse } from 'axios'

export type DevScriptActionType = 'fix-student-passwords' | 'migrate-exam-files'

export interface DevScriptRunResultType {
  message: string
  schools?: number[]
  fixed?: number
  skipped_already_bcrypt?: number
  skipped_empty_password?: number
}

export interface DevScriptRunErrorType {
  message: string
  action?: string
  error?: string
}

export interface DevScriptParams {
  limit?: number
  schools?: number[]
  [key: string]: unknown
}

export interface ExamFileMigrationFailureType {
  url: string
  status?: number
  reason: string
}

export interface ExamFilesMigrationResultType {
  message: string
  total_matched_records: number
  updated_records: number
  downloaded_files: number
  failed_count: number
  failed_urls: ExamFileMigrationFailureType[]
  // برای سازگاری با اسکریپت پسورد قبلی در صورت نیاز
  fixed?: number
  skipped_already_bcrypt?: number
  skipped_empty_password?: number
}





/**
 * ⚠️ موقت: ریپازیتوری اجرای اسکریپت‌های توسعه‌ای (فقط ادمین)
 * بعداً کامنت یا حذف شود!
 */
export default class DevAdminAPI extends BaseAPI<null> {
  constructor () {
    super('/users') // آدرس پایه مهم نیست، endpoint کامل را خودمان می‌دهیم
    this.endpoints = {
      ...this.endpoints,
      run: '/admin/dev/run'
    }
  }

  async runDevScript (
    action: DevScriptActionType,
    params?: DevScriptParams | number[]
  ): Promise<ExamFilesMigrationResultType> {
    try {
      // نرمال‌سازی payload: اگر آرایه پاس داده شد تبدیل به { schools } بشه، اگر آبجکت بود مستقیم spread بشه
      const payload = Array.isArray(params)
        ? { action, schools: params }
        : { action, ...(params || {}) }

      const response: AxiosResponse<ExamFilesMigrationResultType> =
        await this.getAxiosInstanceWithToken()
          .post(this.endpoints.run, payload)

      return response.data
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message)
      } else {
        throw new Error('An unknown error occurred on runDevScript')
      }
    }
  }


}

export const devAdmin = new DevAdminAPI()
