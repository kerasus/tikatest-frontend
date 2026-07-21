import BaseAPI from './BaseAPI'

export type TransferType = {
  id: number | null
  created_at: string | null
  updated_at: string | null
}

export default class TransferAPI extends BaseAPI<TransferType> {
  constructor () {
    super('/transfers')
    this.defaultObject = {
      id: null,
      created_at: null,
      updated_at: null
    }
  }
}

export const transfer = new TransferAPI()
