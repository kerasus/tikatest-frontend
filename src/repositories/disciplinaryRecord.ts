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
    this.endpoints = {
      ...this.endpoints,
      registerAbsenteeism: '/disciplinary/absenteeism',
      viewAbsences: '/disciplinary/absences'
    }
  }

  async registerAbsenteeism (data: { student_ids: number[], date: string, description?: string, case_id: number }): Promise<any> {
    const response = await this.getAxiosInstanceWithToken().post(this.endpoints.registerAbsenteeism, {
      student_ids: data.student_ids,
      date: data.date,
      description: data.description,
      case_id: data.case_id
    })
    return response.data
  }

  async viewAbsences (params: any = {}): Promise<any> {
    const response = await this.getAxiosInstanceWithToken().get(this.endpoints.viewAbsences, { params })
    return response.data
  }
}

export const disciplinaryRecord = new DisciplinaryRecordAPI()
