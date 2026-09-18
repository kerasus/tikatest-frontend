import BaseAPI from './BaseAPI'

export type CalendarEventStatus = 'active' | 'cancelled'

export type CalendarEventType =
  | 'general'
  | 'class'
  | 'exam'
  | 'homework'
  | 'meeting'
  | 'holiday'
  | 'national'
  | 'religious'
  | 'reminder'

export type CalendarEventSource =
  | 'manual'
  | 'official'
  | 'imported'
  | 'system'

/**
 * Calendar event returned by the API.
 */
export type CalendarEventDataType = {
  id: number | null

  calendar_id: number | null

  title: string | null
  description: string | null

  starts_at: string | null
  ends_at: string | null

  all_day: boolean

  type: CalendarEventType | null
  status: CalendarEventStatus | null

  location: string | null
  color: string | null

  source: CalendarEventSource | null

  is_recurring: boolean
  recurrence_rule: string | null
  recurrence_until: string | null

  metadata: Record<string, any> | null

  created_at: string | null
  updated_at: string | null
}

/**
 * Payload used when creating a calendar event.
 *
 * calendar_id is intentionally NOT accepted here.
 * The backend resolves the calendar based on school_id/user_id
 * and the authenticated user's role.
 */
export type CalendarEventCreateType = {
  title: string
  description?: string | null

  starts_at: string
  ends_at?: string | null

  all_day?: boolean

  type: CalendarEventType
  status?: CalendarEventStatus

  location?: string | null
  color?: string | null

  source?: CalendarEventSource

  is_recurring?: boolean
  recurrence_rule?: string | null
  recurrence_until?: string | null

  metadata?: Record<string, any> | null

  /**
   * Calendar context.
   *
   * Required for school-related users/events.
   * The backend decides which calendar to use.
   */
  school_id?: number | null

  /**
   * Optional personal event context.
   *
   * The backend must validate this value and must not trust
   * arbitrary user IDs from the client.
   */
  user_id?: number | null
}

/**
 * Payload used when updating a calendar event.
 *
 * calendar_id, school_id and user_id are intentionally excluded.
 * Updating an event should not allow the client to move it
 * between calendars.
 */
export type CalendarEventUpdateType = {
  title?: string

  description?: string | null

  starts_at?: string
  ends_at?: string | null

  all_day?: boolean

  type?: CalendarEventType
  status?: CalendarEventStatus

  location?: string | null
  color?: string | null

  source?: CalendarEventSource

  is_recurring?: boolean
  recurrence_rule?: string | null
  recurrence_until?: string | null

  metadata?: Record<string, any> | null
}

export default class CalendarEventAPI extends BaseAPI<CalendarEventDataType> {
  constructor () {
    super('/calendar-events')

    this.defaultObject = {
      id: null,

      calendar_id: null,

      title: null,
      description: null,

      starts_at: null,
      ends_at: null,

      all_day: false,

      type: 'general',
      status: 'active',

      location: null,
      color: null,

      source: 'manual',

      is_recurring: false,
      recurrence_rule: null,
      recurrence_until: null,

      metadata: null,

      created_at: null,
      updated_at: null
    }
  }

  async createEvent (
    data: CalendarEventCreateType
  ): Promise<CalendarEventDataType> {
    const response = await this.getAxiosInstanceWithToken().post(
      this.baseEndpoint,
      data
    )

    return response.data
  }

  async updateEvent (
    id: number | string,
    data: CalendarEventUpdateType
  ): Promise<CalendarEventDataType> {
    const response = await this.getAxiosInstanceWithToken().put(
      `${this.baseEndpoint}/${id}`,
      data
    )

    return response.data
  }
}

export const calendarEvent = new CalendarEventAPI()
