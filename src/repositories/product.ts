import BaseAPI from './BaseAPI'

export type ProductType = {
  id: number | null
  created_at: string | null
  updated_at: string | null
}

export default class ProductAPI extends BaseAPI<ProductType> {
  constructor () {
    super('/products')
    this.defaultObject = {
      id: null,
      created_at: null,
      updated_at: null
    }
  }
}

export const product = new ProductAPI()
