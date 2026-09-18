import BaseAPI from './BaseAPI'
import { SchoolClassType } from './schoolClass'
import type { SkyroomRoomScheduleType } from './skyroomRoomSchedule'

export type SkyroomRoomType = {
  id: number | null;
  class_id: number | null;
  skyroom_id: number | null;
  name: string | null;
  title: string | null;
  description: string | null;
  max_users: number;
  guest_login: boolean;
  op_login_first: boolean;
  status: boolean;
  schedules?: SkyroomRoomScheduleType[];
  class?: SchoolClassType;
  created_at?: string | null;
  updated_at?: string | null;
  deleted_at?: string | null;
};

export type SkyroomRoomShowResponseType = {
  local_room: SkyroomRoomType;
  live_data: Record<string, any> | null;
};

export default class SkyroomRoomAPI extends BaseAPI<SkyroomRoomType> {
  constructor () {
    super('/skyroom-rooms')
    this.defaultObject = {
      id: null,
      class_id: null,
      skyroom_id: null,
      name: null,
      title: null,
      description: null,
      max_users: 20,
      guest_login: false,
      op_login_first: true,
      status: true,
      schedules: [],
      created_at: null,
      updated_at: null,
      deleted_at: null
    }
    this.endpoints = {
      ...this.endpoints,
      loginUrl: (roomId: number | string) => `${this.baseEndpoint}/${roomId}/login-url`
    }
  }

  /**
   * دریافت جزئیات لوکال و زنده یک اتاق اسکای‌روم
   */
  async getRoomDetails (roomId: number | string, params?: any): Promise<SkyroomRoomShowResponseType> {
    const response = await this.getAxiosInstanceWithToken().get(`${this.baseEndpoint}/${roomId}`, { params })
    return response.data
  }

  /**
   * دریافت لینک ورود مستقیم به کلاس بدون نیاز به لاگین در اسکای‌روم
   */
  async getLoginUrl (roomId: number | string, payload?: any): Promise<string> {
    const endpoint = (this.endpoints as any).loginUrl(roomId)
    const response = await this.getAxiosInstanceWithToken().post(endpoint, payload)
    return response.data
  }
}

export const skyroomRoom = new SkyroomRoomAPI()
