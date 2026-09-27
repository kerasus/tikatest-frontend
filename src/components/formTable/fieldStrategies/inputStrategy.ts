import * as shvl from 'shvl'
import type { Row, FormTableInputType } from '../filedTextStrategy'

export const inputStrategy = (input: FormTableInputType) => (row: Row) => {
  return shvl.get(row, input.responseKey, null)
}
