import BaseAPI from './BaseAPI'

export type ProductPartType = {
  id: number | null
  created_at: string | null
  updated_at: string | null
}

export default class ProductPartAPI extends BaseAPI<ProductPartType> {
  constructor () {
    super('/product-parts')
    this.defaultObject = {
      id: null,
      created_at: null,
      updated_at: null
    }
  }
}

export const productPart = new ProductPartAPI()
