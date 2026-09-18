import BaseAPI from './BaseAPI'

export type CalendarEventTargetType = {
  id: number | null
  calendar_event_id: number | null
  target_type: string | null
  target_id: number | null
  created_at: string | null
  updated_at: string | null
}

export default class CalendarEventTargetAPI extends BaseAPI<CalendarEventTargetType> {
  constructor () {
    super('/calendar-event-targets')
    this.defaultObject = {
      id: null,
      calendar_event_id: null,
      target_type: null,
      target_id: null,
      created_at: null,
      updated_at: null
    }
  }
}

export const calendarEventTarget = new CalendarEventTargetAPI()
