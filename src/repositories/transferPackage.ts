import BaseAPI from './BaseAPI'

export type TransferPackageType = {
  id: number | null
  created_at: string | null
  updated_at: string | null
}

export default class TransferPackageAPI extends BaseAPI<TransferPackageType> {
  constructor () {
    super('/transfer-packages')
    this.defaultObject = {
      id: null,
      created_at: null,
      updated_at: null
    }
  }
}

export const transferPackage = new TransferPackageAPI()
