import BaseAPI from './BaseAPI'
import { SchoolType } from 'src/repositories/school'

export type AcademicFieldType = {
  id: number | null;
  school_id: number | null;
  name: string | null;
  created_at: string | null;
  updated_at: string | null;
  deleted_at: string | null;
  school?: SchoolType;
};

export default class AcademicFieldAPI extends BaseAPI<AcademicFieldType> {
  constructor () {
    super('/academic-fields')
    this.defaultObject = {
      id: null,
      school_id: null,
      name: null,
      created_at: null,
      updated_at: null,
      deleted_at: null
    }
  }
}
