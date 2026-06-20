import BaseAPI from './BaseAPI'

export type DisciplinaryRecordType = {
  id: number | null
  school_id: number | null
  student_id: number | null
  case_id: number | null
  description: string | null
  incident_date: string | null
  recorded_by: number | null
  created_at: string | null
  updated_at: string | null
  deleted_at: string | null
}

export default class DisciplinaryRecordAPI extends BaseAPI<DisciplinaryRecordType> {
  constructor () {
    super('/disciplinary-records')
    this.defaultObject = {
      id: null,
      school_id: null,
      student_id: null,
      case_id: null,
      description: null,
      incident_date: null,
      recorded_by: null,
      created_at: null,
      updated_at: null,
      deleted_at: null
    }
  }
}
