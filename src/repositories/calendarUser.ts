import BaseAPI from './BaseAPI'

export type CalendarUserType = {
  id: number | null
  calendar_id: number | null
  user_id: number | null
  is_visible: boolean
  created_at: string | null
  updated_at: string | null
}

export default class CalendarUserAPI extends BaseAPI<CalendarUserType> {
  constructor () {
    super('/calendar-users')
    this.defaultObject = {
      id: null,
      calendar_id: null,
      user_id: null,
      is_visible: true,
      created_at: null,
      updated_at: null
    }
  }
}

export const calendarUser = new CalendarUserAPI()
