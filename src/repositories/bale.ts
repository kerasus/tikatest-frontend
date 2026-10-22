import BaseAPI from './BaseAPI'

export type BaleLinkResponse = {
  connected: boolean
  deep_link?: string
  expires_in?: number
}

export default class BaleAPI extends BaseAPI<BaleLinkResponse> {
  constructor () {
    super('/v1/bale')
  }

  async link (): Promise<BaleLinkResponse> {
    const response = await this.getAxiosInstanceWithToken().post(`${this.baseEndpoint}/link`)
    return response.data
  }

  async disconnect (): Promise<{ connected: boolean }> {
    const response = await this.getAxiosInstanceWithToken().delete(`${this.baseEndpoint}/connection`)
    return response.data
  }
}
