import BaseAPI from './BaseAPI'

export type SkyroomRoomScheduleType = {
  id: number | null;
  skyroom_room_id: number | null;
  title: string | null;
  day_of_week: number | null;
  held_date: string | null;
  start_time: string | null;
  end_time: string | null;
  is_active: boolean;
  created_at?: string | null;
  updated_at?: string | null;
};

export default class SkyroomRoomScheduleAPI extends BaseAPI<SkyroomRoomScheduleType> {
  constructor () {
    super('/skyroom-room-schedules')
    this.defaultObject = {
      id: null,
      skyroom_room_id: null,
      title: null,
      day_of_week: null,
      held_date: null,
      start_time: null,
      end_time: null,
      is_active: true,
      created_at: null,
      updated_at: null
    }
  }
}

export const skyroomRoomSchedule = new SkyroomRoomScheduleAPI()
