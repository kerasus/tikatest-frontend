import BaseAPI from './BaseAPI'
import { AcademicFieldType } from 'src/repositories/academicField'

export type AcademicLevelType = {
  id: number | null;
  school_id: number | null;
  field_id: number | null;
  name: string | null;
  created_at: string | null;
  updated_at: string | null;
  deleted_at: string | null;
  academic_field?: AcademicFieldType;
};

export default class AcademicLevelAPI extends BaseAPI<AcademicLevelType> {
  constructor () {
    super('/academic-levels')
    this.defaultObject = {
      id: null,
      school_id: null,
      field_id: null,
      name: null,
      created_at: null,
      updated_at: null,
      deleted_at: null
    }
  }
}

export const academicLevel = new AcademicLevelAPI()
