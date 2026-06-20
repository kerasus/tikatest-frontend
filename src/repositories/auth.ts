import BaseAPI from './BaseAPI'
import type { AxiosResponse } from 'axios'

export type LoginPayload = {
  username: string
  password: string
  device_name?: string
}

export type LoginResponse = {
  token: string
  token_type: string
  user: any
}

export type PreRegistrationPayload = {
  username: string
  parent_username: string
  password: string
  sms_id?: string
}

export default class AuthAPI extends BaseAPI<any> {
  constructor () {
    super('/auth')
    this.endpoints = {
      ...this.endpoints,
      login: `${this.baseEndpoint}/login`,
      logout: `${this.baseEndpoint}/logout`,
      me: `${this.baseEndpoint}/me`
    }
  }

  async login (payload: LoginPayload): Promise<LoginResponse> {
    const response = await this.getAxiosInstanceWithoutToken().post(this.endpoints.login, payload)
    return response.data
  }

  async logout (): Promise<{ message: string }> {
    const response = await this.getAxiosInstanceWithToken().post(this.endpoints.logout)
    return response.data
  }

  async me (): Promise<any> {
    const response = await this.getAxiosInstanceWithToken().get(this.endpoints.me)
    return response.data
  }
}
