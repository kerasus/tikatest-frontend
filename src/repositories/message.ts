import BaseAPI from './BaseAPI'

export type { ListType } from './BaseAPI'
export type MessageType = {
  id: number | null
  school_id: number | null
  sender_id: number | null
  subject: string | null
  body: string | null
  attachment: string | null
  is_sms: boolean | null
  message_type: string | null
  sent_at: string | null
  created_at: string | null
  updated_at: string | null
  sender?: any
  owners?: MessageOwnerType[]
  receiver_ids?: number[]
  recipient_types?: any[]
}

export type MessageOwnerType = {
  id: number | null
  message_id: number | null
  user_id: number | null
  is_student: boolean | null
  is_father: boolean | null
  is_mother: boolean | null
  is_read: boolean | null
  read_at: string | null
  created_at: string | null
  updated_at: string | null
  user?: any
  message?: MessageType
}

export default class MessageAPI extends BaseAPI<MessageType> {
  constructor () {
    super('/messages')
    this.defaultObject = {
      id: null,
      school_id: null,
      sender_id: null,
      subject: null,
      body: null,
      attachment: null,
      is_sms: false,
      message_type: null,
      sent_at: null,
      created_at: null,
      updated_at: null
    }
    this.endpoints = {
      ...this.endpoints,
      sent: '/messages/sent',
      received: '/messages/received',
      sendToStudent: '/messages/send-to-student',
      sendToClass: '/messages/send-to-class'
    }
  }

  async sentMessages (params: any = {}): Promise<any> {
    const response = await this.getAxiosInstanceWithToken().get(this.endpoints.sent, { params })
    return response.data
  }

  async receivedMessages (params: any = {}): Promise<any> {
    const response = await this.getAxiosInstanceWithToken().get(this.endpoints.received, { params })
    return response.data
  }

  async sendToStudent (data: any): Promise<any> {
    const response = await this.getAxiosInstanceWithToken().post(this.endpoints.sendToStudent, data)
    return response.data
  }

  async sendToClass (data: any): Promise<any> {
    const response = await this.getAxiosInstanceWithToken().post(this.endpoints.sendToClass, data)
    return response.data
  }

  async myMessages (params: any = {}): Promise<any> {
    const response = await this.getAxiosInstanceWithToken().get(this.endpoints.received, { params })
    return response.data
  }
}

export const message = new MessageAPI()
