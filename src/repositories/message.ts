import BaseAPI from './BaseAPI'

export type MessageType = {
  id: number | null
  school_id: number | null
  sender_id: number | null
  receiver_id: number | null
  subject: string | null
  body: string | null
  attachment: string | null
  sent_at: string | null
  read_at: string | null
  created_at: string | null
  updated_at: string | null
}

export default class MessageAPI extends BaseAPI<MessageType> {
  constructor () {
    super('/messages')
    this.defaultObject = {
      id: null,
      school_id: null,
      sender_id: null,
      receiver_id: null,
      subject: null,
      body: null,
      attachment: null,
      sent_at: null,
      read_at: null,
      created_at: null,
      updated_at: null
    }
    this.endpoints = {
      ...this.endpoints,
      sent: '/messages/sent',
      received: '/messages/received'
    }
  }

  async sentMessages(params: any = {}): Promise<any> {
    const response = await this.getAxiosInstanceWithToken().get(this.endpoints.sent, { params })
    return response.data
  }

  async receivedMessages(params: any = {}): Promise<any> {
    const response = await this.getAxiosInstanceWithToken().get(this.endpoints.received, { params })
    return response.data
  }
}

export const message = new MessageAPI()
