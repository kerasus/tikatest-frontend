import BaseAPI from './BaseAPI'
import type { AxiosResponse } from 'axios'


export type DevScriptActionType =
  | 'set-bale-webhook'
  | 'migrate-exam-files'
  | 'recalculate-exam-results'
  | 'fix-student-passwords'

// ۱. تایپ ریسپانس وب‌هوک بله
export interface BaleWebhookResultType {
  success: boolean
  exit_code: number
  output: string
}

// ۲. تایپ ریسپانس اصلاح پسوردها
export interface FixPasswordsResultType {
  message: string
  schools?: number[]
  fixed?: number
  skipped_already_bcrypt?: number
  skipped_empty_password?: number
  total_checked?: number
}

// ۳. تایپ ریسپانس بازشماری نتایج آزمون
export interface RecalculateExamResultsType {
  message?: string
  sessions_processed?: number
  responses_updated?: number
}

// ۴. تایپ‌های مربوط به مایگریشن فایل‌ها
export interface ExamFileMigrationFailureType {
  url: string
  status?: number
  reason: string
}

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

export type DevScriptResultType =
  | (BaleWebhookResultType & { message?: string })
  | ExamFilesMigrationResultType
  | FixPasswordsResultType
  | RecalculateExamResultsType

/**
 * ⚠️ موقت: ریپازیتوری اجرای اسکریپت‌های توسعه‌ای (فقط ادمین)
 * بعداً کامنت یا حذف شود!
 */
export default class DevAdminAPI extends BaseAPI<null> {
  constructor () {
    super('/users') // آدرس پایه مهم نیست، endpoint کامل را خودمان می‌دهیم
    this.endpoints = {
      ...this.endpoints,
      runOptimize: '/admin/dev/run/optimize',
      run: '/admin/dev/run'
    }
  }

  async runDevScript<T = any> (
    action: DevScriptActionType,
    params?: DevScriptParams | number[]
  ): Promise<T> {
    try {
      // نرمال‌سازی payload: اگر آرایه پاس داده شد تبدیل به { schools } بشه، اگر آبجکت بود مستقیم spread بشه
      const payload = Array.isArray(params)
        ? { action, schools: params }
        : { action, ...(params || {}) }

      const response: AxiosResponse<T> =
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

  async runOptimize (): Promise<{ success: boolean; output: string; message: string }> {
    const response: AxiosResponse<{ success: boolean; output: string; message: string }> =
        await this.getAxiosInstanceWithToken()
          .post(this.endpoints.runOptimize)

    return response.data
  }


}

export const devAdmin = new DevAdminAPI()
