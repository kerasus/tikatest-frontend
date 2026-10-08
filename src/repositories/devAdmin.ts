import BaseAPI from './BaseAPI'
import type { AxiosResponse } from 'axios'

export type DevScriptActionType = 'fix-student-passwords'

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
    schoolIds?: number[]
  ): Promise<DevScriptRunResultType> {
    try {
      const response: AxiosResponse<DevScriptRunResultType | DevScriptRunErrorType> =
        await this.getAxiosInstanceWithToken()
          .post(this.endpoints.run, {
            action,
            ...(schoolIds ? { schools: schoolIds } : {})
          })

      const data = response.data as DevScriptRunResultType
      if (typeof data.message === 'string' && data.fixed !== undefined) {
        return data
      }

      // اگر سرور خطای منطقی برگرداند
      throw new Error((response.data as DevScriptRunErrorType).message || 'Unknown dev script error')
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
