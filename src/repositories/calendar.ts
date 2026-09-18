import BaseAPI from './BaseAPI'

export type CalendarType = 'school' | 'personal' | 'national' | 'religious'

export type CalendarUserType = {
  id: number | null
  name: string | null
  type: CalendarType | null
  school_id: number | null
  user_id: number | null
  is_active: boolean
  created_at: string | null
  updated_at: string | null
  deleted_at: string | null
}

export default class CalendarAPI extends BaseAPI<CalendarUserType> {
  constructor () {
    super('/calendars')
    this.defaultObject = {
      id: null,
      name: null,
      type: null,
      school_id: null,
      user_id: null,
      is_active: true,
      created_at: null,
      updated_at: null,
      deleted_at: null
    }
  }
}

export const calendar = new CalendarAPI()
