import BaseAPI from './BaseAPI'
import type { SchoolType } from './school'

export enum SchoolFeatureKey {
  Skyroom = 'skyroom',
  FtpPanel = 'ftp_panel'
}

export const SCHOOL_FEATURE_LABELS: Record<SchoolFeatureKey, string> = {
  [SchoolFeatureKey.Skyroom]: 'اسکای‌روم',
  [SchoolFeatureKey.FtpPanel]: 'پنل FTP'
}

export const schoolFeatureOptions = Object.entries(SCHOOL_FEATURE_LABELS).map(([value, label]) => ({
  value: value as SchoolFeatureKey,
  label
}))

export type SchoolFeatureSettingsType = Record<string, unknown>

export type SchoolFeatureType = {
  id: number | null
  school_id: number | null
  school?: SchoolType | null
  feature_key: SchoolFeatureKey | null
  is_enabled: boolean
  settings: SchoolFeatureSettingsType | null
  expires_at: string | null
  created_at: string | null
  updated_at: string | null
}

export default class SchoolFeatureAPI extends BaseAPI<SchoolFeatureType> {
  constructor (schoolId: number) {
    super(`/schools/${schoolId}/features`)
    this.defaultObject = {
      id: null,
      school_id: schoolId,
      feature_key: null,
      is_enabled: true,
      settings: null,
      expires_at: null,
      created_at: null,
      updated_at: null
    }
  }
}
